import { Button, Card, Form, Input, message, Space, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import SocialLogin from "./components/SocialLogin";
import handleAPI from "../../apis/handleAPI";
import { addAuth } from "../../reduxs/reducers/authReducer";
import { useDispatch } from "react-redux";
import { colors } from "../../constants/colors";

const { Title, Paragraph, Text } = Typography;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleLogin = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    const api = "/auth/register";
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api, values, "post");
      if (res.data) {
        message.success(res.message);
        dispatch(addAuth(res.data));
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div style={{ width: "80%" }}>
      <Card>
        <div className="text-center">
          <Title level={2}>Create an account</Title>
          <Paragraph type="secondary">Start your 30-day free trial.</Paragraph>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleLogin}
          disabled={isLoading}
          size="large"
        >
          <Form.Item
            name={"name"}
            label={"Name"}
            rules={[{ required: true, message: "Please enter your name!!!" }]}
          >
            <Input placeholder="Enter your name" allowClear />
          </Form.Item>
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
            rules={[
              // { required: true, message: "Please enter your password!!!" },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(
                      new Error("Please enter your password!!!")
                    );
                  } else if (value.length < 6) {
                    return Promise.reject(
                      new Error("Password must be at least 6 characters")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              maxLength={100}
              type="password"
            />
          </Form.Item>
        </Form>

        <div className="mt-5 mb-3">
          <Button
            loading={isLoading}
            onClick={() => form.submit()}
            type="primary"
            style={{ width: "100%", backgroundColor: colors.primary500 }}
            size="large"
          >
            Sign Up
          </Button>
        </div>
        <SocialLogin />
        <div className="mt-4 text-center">
          <Space>
            <Text type="secondary">Dont'have an account?</Text>
            <Link style={{ color: colors.primary500 }} to="/login">
              Login
            </Link>
          </Space>
        </div>
      </Card>
    </div>
  );
}
