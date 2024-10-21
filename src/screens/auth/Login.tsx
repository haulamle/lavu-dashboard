import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import SocialLogin from "./components/SocialLogin";
import handleAPI from "../../apis/handleAPI";
import { useDispatch } from "react-redux";
import { addAuth } from "../../reduxs/reducers/authReducer";
import { localDataNames } from "../../constants/appInfos";

const { Title, Paragraph, Text } = Typography;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const res: any = await handleAPI("/auth/login", values, "post");
      message.success(res.message);
      res.data && dispatch(addAuth(res.data));
      if (isRemember) {
        localStorage.setItem(localDataNames.authData, JSON.stringify(res.data));
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card loading={isLoading}>
      <div className="text-center">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/kanban-28821.appspot.com/o/logo-web.png?alt=media&token=eaaf7b15-f82b-45e3-aa8e-39fef1011200"
          alt="logo"
          style={{ width: 48, height: 48 }}
          className="mb-3"
        />
        <Title level={2}>Login to your account</Title>
        <Paragraph type="secondary">
          Welcome back! Please enter your details.
        </Paragraph>
      </div>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleLogin}
        disabled={isLoading}
        size="large"
      >
        <Form.Item
          name={"email"}
          label={"Email"}
          rules={[{ required: true, message: "Please enter your email!!!" }]}
        >
          <Input
            placeholder="Enter your email"
            allowClear
            maxLength={100}
            type="email"
          />
        </Form.Item>
        <Form.Item
          name={"password"}
          label={"Password"}
          rules={[{ required: true, message: "Please enter your password!!!" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            maxLength={100}
            type="password"
          />
        </Form.Item>
      </Form>

      <div className="row">
        <div className="col">
          <Checkbox
            checked={isRemember}
            onChange={(e) => setIsRemember(e.target.checked)}
          >
            Remember for 30 days
          </Checkbox>
        </div>
        <div className="col text-right">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
      <div className="mt-4 mb-3">
        <Button
          onClick={() => form.submit()}
          type="primary"
          style={{ width: "100%" }}
          size="large"
        >
          Login
        </Button>
      </div>
      <SocialLogin isRemember={isRemember} />
      <div className="mt-4 text-center">
        <Space>
          <Text type="secondary">Dont'have an account?</Text>
          <Link to="/sign-up">Sign up</Link>
        </Space>
      </div>
    </Card>
  );
}
