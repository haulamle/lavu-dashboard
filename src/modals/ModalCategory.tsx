import { Form, Input, message, Modal, TreeSelect } from "antd";
import { useState } from "react";
import handleAPI from "../apis/handleAPI";
import { TreeModel } from "../models/FormModel";
import { replaceName } from "../utils/replaceName";

interface Props {
  visible: boolean;
  onclose: () => void;
  onAddNew: (val: any) => void;
  values: TreeModel[];
}
const ModalCategory = (props: Props) => {
  const { visible, values, onclose, onAddNew } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();
  const handleclose = async () => {
    form.resetFields();
    onclose();
  };

  const handleCategory = async (values: any) => {
    setIsLoading(true);
    const api = "/products/add-category";
    const data: any = {};
    for (const i in values) {
      data[i] = values[i];
    }
    data.slug = replaceName(values.title);
    try {
      const res = await handleAPI(api, data, "post");
      message.success("Add category successfully");
      onAddNew(res.data);
      handleclose();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add category"
      open={visible}
      closable={!isLoading}
      onClose={handleclose}
      onCancel={handleclose}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading, disabled: isLoading }}
      cancelButtonProps={{ disabled: isLoading, loading: isLoading }}
    >
      <Form
        disabled={isLoading}
        layout="vertical"
        onFinish={handleCategory}
        size="large"
        form={form}
      >
        <Form.Item name={"parentId"} label="Parent category">
          <TreeSelect
            defaultValue={values[0]?.value}
            treeDefaultExpandAll
            treeData={values}
            showSearch
          />
        </Form.Item>
        <Form.Item
          name={"title"}
          label="Title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name={"description"}
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={4} allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCategory;
