import { Avatar, Button, Form, message, Modal, Typography } from "antd";
import { User } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { colors } from "../constants/colors";
import { SupplierModel } from "../models/SupplierModel";
import { replaceName } from "../utils/replaceName";
import { FormModel } from "../models/FormModel";
import FormItem from "../components/FormItem";
import { uploadFile } from "../utils/uploadFile";

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
  const [isGetting, setIsGetting] = useState(false);
  const [isTaking, setIsTaking] = useState<boolean>();
  const [formData, setFormData] = useState<FormModel>();
  const [file, setFile] = useState<any>();

  const [form] = Form.useForm();
  const inputRef = useRef<any>();

  useEffect(() => {
    getFormData();
  }, []);

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier);
      setIsTaking(supplier.isTaking === 1);
    }
  }, [supplier]);

  const addNewSupplier = async (values: any) => {
    setIsLoading(true);

    const data: any = {};
    const api = `${
      supplier ? `/supplier/update?id=${supplier._id}` : "/supplier/add-new"
    }`;
    for (const i in values) {
      data[i] = values[i] ?? "";
    }
    data.price = values.price ? parseFloat(values.price) : 0;
    data.isTaking = isTaking ? 1 : 0;

    if (file) {
      data.photoUrl = await uploadFile(file);
    }
    data.slug = replaceName(values.name);

    try {
      const res: any = await handleAPI(api, data, supplier ? "put" : "post");
      message.success(res.message);
      !supplier && onAddNew(res.data);
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFormData = async () => {
    const api = "/supplier/get-form";
    setIsGetting(true);
    try {
      const res = await handleAPI(api);
      res.data && setFormData(res.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsGetting(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFile(undefined);
    onclose();
  };
  return (
    <Modal
      // width={720}
      loading={isGetting}
      closable={!isLoading}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
      title={supplier ? "Update Supplier" : "Add new supplier"}
      okText={supplier ? "Update Supplier" : "Add Supplier"}
      cancelText="Discard"
    >
      <label
        htmlFor="inFile"
        className="p-2 mb-3 row align-items-center justify-content-center"
      >
        {file ? (
          <Avatar size={100} src={URL.createObjectURL(file)} />
        ) : supplier ? (
          <Avatar size={100} src={supplier.photoUrl} />
        ) : (
          <Avatar
            size={100}
            style={{
              backgroundColor: "white",
              border: "1px dashed #e0e0e0",
            }}
          >
            <User size={60} color={colors.gray600} />
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
      {formData && (
        <Form
          disabled={isLoading}
          form={form}
          layout={formData.layout || "horizontal"}
          labelCol={{ span: formData.labelCol }}
          wrapperCol={{ span: formData.wrapperCol }}
          size="large"
          onFinish={addNewSupplier}
        >
          {formData.formItems.map((item) => (
            <FormItem item={item} checked={isTaking} setChecked={setIsTaking} />
          ))}
        </Form>
      )}

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
