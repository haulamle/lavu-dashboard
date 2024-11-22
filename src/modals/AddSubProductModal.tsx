import {
  ColorPicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import { ProductModel, SubProductModel } from "../models/ProductModel";
import { uploadFile } from "../utils/uploadFile";
import handleAPI from "../apis/handleAPI";

interface Props {
  visible: boolean;
  onclose: () => void;
  product?: ProductModel;
  onAddNew: (val: SubProductModel) => void;
}

const AddSubProductModal = (props: Props) => {
  const { visible, onclose, product, onAddNew } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue("color", colors.primary500);
  }, []);

  const handleAddSubProduct = async (values: any) => {
    if (product) {
      const data: any = {};
      for (const i in values) {
        data[i] = values[i] ?? "";
      }
      data.productId = product._id;
      if (data.color) {
        data.color =
          typeof data.color === "string"
            ? data.color
            : data.color.toHexString();
      }
      if (fileList.length > 0) {
        const urls: string[] = [];
        fileList.forEach(async (item) => {
          const url = await uploadFile(item.originFileObj);
          url && urls.push(url);

          if (urls.length === fileList.length) {
            await handleAwaitImageSubProduct({ ...data, images: urls });
          }
        });
      } else {
        await handleAwaitImageSubProduct(data);
      }
    } else {
      message.error("Product not found");
    }
  };

  const handleAwaitImageSubProduct = async (data: any) => {
    const api = "/products/add-sub-product";
    try {
      setIsLoading(true);

      const res = await handleAPI(api, data, "post");
      onAddNew(res.data);

      handleCancel();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onclose();
  };
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const items = newFileList.map((item) =>
      item.originFileObj
        ? {
            ...item,
            url: item.originFileObj
              ? URL.createObjectURL(item.originFileObj)
              : "",
            status: "done",
          }
        : { ...item }
    );

    setFileList(items);
  };
  return (
    <Modal
      title="Add sub product"
      open={visible}
      onClose={handleCancel}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
    >
      <Form
        layout="vertical"
        size="large"
        disabled={isLoading}
        form={form}
        onFinish={handleAddSubProduct}
      >
        <Typography.Title level={5}>{product?.title}</Typography.Title>
        <Form.Item name="color" label="Color">
          <ColorPicker format="hex" />
        </Form.Item>
        <Form.Item
          name="size"
          label="Size"
          rules={[{ required: true, message: "Size is required " }]}
        >
          <Input allowClear placeholder="Enter size" />
        </Form.Item>

        <div className="row">
          <div className="col">
            <Form.Item name="qty" label="Quantity">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item name="price" label="Price">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </div>
      </Form>
      <Upload
        fileList={fileList}
        multiple
        accept="image/*"
        name="images"
        listType="picture-card"
        onChange={handleChange}
      >
        Upload
      </Upload>
    </Modal>
  );
};

export default AddSubProductModal;
