import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Typography,
} from "antd";
import { User } from "iconsax-react";
import { useRef, useState } from "react";
import { colors } from "../constants/colors";
import { upLoadFile } from "../utils/uploadFile";
import { replaceName } from "../utils/replaceName";
import handleAPI from "../apis/handleAPI";
import { SupplierModel } from "../models/SupplierModel";

const { Paragraph } = Typography;

interface Props {
  visible: boolean;
  onclose: () => void;
  onAddNew: (val: SupplierModel) => void;
  supplier?: SupplierModel;
}
const ToogleSupplier = (props: Props) => {
  const { visible, onclose, onAddNew, supplier } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isTaking, setIsTaking] = useState<boolean>();
  const [file, setFile] = useState<any>();
  const [form] = Form.useForm();
  const inputRef = useRef<any>();

  const addNewSupplier = async (values: any) => {
    setIsLoading(true);

    const data: any = {};
    const api = "/supplier/add-new";
    for (const i in values) {
      data[i] = values[i] ?? "";
    }
    data.price = values.price ? parseFloat(values.price) : 0;
    data.isTaking = isTaking ? 1 : 0;

    if (file) {
      data.photoUrl = await upLoadFile(file);
    }
    data.slug = replaceName(values.name);

    try {
      const res: any = await handleAPI(api, data, "post");
      message.success(res.message);
      onAddNew(res.data);
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    form.resetFields();
    onclose();
  };
  return (
    <Modal
      // width={720}
      closable={!isLoading}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
      title="Add Supplier"
      okText="Add Supplier"
      cancelText="Discard"
    >
      <label
        htmlFor="inFile"
        className="p-2 mb-3 row align-items-center justify-content-center"
      >
        {file ? (
          <Avatar size={100} src={URL.createObjectURL(file)} />
        ) : (
          <Avatar
            size={100}
            style={{
              backgroundColor: "white",
              border: "1px dashed #e0e0e0",
            }}
          >
            <User size={60} color={colors.gray600}></User>
          </Avatar>
        )}

        <div className="ml-3">
          <Paragraph className="text-muted ml-2 m-0">Drag image here</Paragraph>
          <Paragraph className="text-muted m-0  text-center">or</Paragraph>
          <Button onClick={() => inputRef.current.click()} type="link">
            Browse image
          </Button>
        </div>
      </label>
      <Form
        disabled={isLoading}
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        size="large"
        onFinish={addNewSupplier}
      >
        <Form.Item
          name={"name"}
          rules={[{ required: true, message: "Enter supplier name" }]}
          label="Suplier Name"
        >
          <Input placeholder="Entersuplier name" allowClear />
        </Form.Item>
        <Form.Item name={"product"} label="Product">
          <Input placeholder="Enter product" allowClear />
        </Form.Item>
        <Form.Item name={"categories"} label="Category">
          <Select options={[]} />
        </Form.Item>
        <Form.Item name={"price"} label="Price">
          <Input placeholder="Enter buying price" type="number" />
        </Form.Item>
        <Form.Item name={"contact"} label="Contact">
          <Input placeholder="Enter supplier contact number" allowClear />
        </Form.Item>
        <Form.Item label="Type">
          <div className="mb-2">
            <Button
              size="middle"
              onClick={() => setIsTaking(false)}
              type={isTaking === false ? "primary" : "default"}
            >
              Not taking return
            </Button>
          </div>
          <Button
            size="middle"
            onClick={() => setIsTaking(true)}
            type={isTaking ? "primary" : "default"}
          >
            Taking return
          </Button>
        </Form.Item>
      </Form>
      <div className="d-none">
        <input
          ref={inputRef}
          accept="image/*"
          type="file"
          name=""
          id="inFile"
          onChange={(e: any) => setFile(e.target.files[0])}
        />
      </div>
    </Modal>
  );
};

export default ToogleSupplier;
