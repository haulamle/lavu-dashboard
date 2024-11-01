import { Button, Form, Input, message, Space, TreeSelect } from "antd";
import React, { useEffect, useState } from "react";
import { replaceName } from "../utils/replaceName";
import handleAPI from "../apis/handleAPI";
import { TreeModel } from "../models/FormModel";
import { CategoryModel } from "../models/ProductModel";

interface Props {
  onAddNew: (val: any) => void;
  values: TreeModel[];
  selected?: CategoryModel;
  onClose?: () => void;
}
const AddCategory = (props: Props) => {
  const { onAddNew, values, selected, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (selected) {
      form.setFieldsValue(selected);
      if (!selected.parentId) {
        form.setFieldsValue({ parentId: null });
      }
    } else {
      form.resetFields();
    }
  }, [form, selected]);

  const handleCategory = async (values: any) => {
    setIsLoading(true);
    const api = selected
      ? `/products/update-category?id=${selected._id}`
      : `/products/add-category`;
    const data: any = {};
    for (const i in values) {
      data[i] = values[i];
    }
    data.slug = replaceName(values.title);
    try {
      const res = await handleAPI(api, data, selected ? "put" : "post");
      message.success("Add category successfully");

      onAddNew(res.data);

      form.resetFields();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form
        disabled={isLoading}
        layout="vertical"
        onFinish={handleCategory}
        size="large"
        form={form}
      >
        <Form.Item name={"parentId"} label="Parent category">
          <TreeSelect treeDefaultExpandAll treeData={values} showSearch />
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

      <div className="text-right">
        <Space>
          {onClose && (
            <Button
              disabled={isLoading}
              onClick={() => {
                onClose();
                form.resetFields();
              }}
              loading={isLoading}
            >
              Cancel
            </Button>
          )}

          <Button
            disabled={isLoading}
            type="primary"
            onClick={() => form.submit()}
            loading={isLoading}
          >
            {selected ? "Update" : "Submit"}
          </Button>
        </Space>
      </div>
    </>
  );
};

export default AddCategory;
