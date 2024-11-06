import { Editor } from "@tinymce/tinymce-react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
  TreeSelect,
  Typography,
} from "antd";
import { Add } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import handleAPI from "../../apis/handleAPI";
import { ModalCategory } from "../../modals";
import { SelectModel, TreeModel } from "../../models/FormModel";
import { replaceName } from "../../utils/replaceName";
import { upLoadFile } from "../../utils/uploadFile";
import { getTreeValues } from "../../utils/getTreeValues";

const { Title } = Typography;

const AddProduct = () => {
  const [fileUrl, setFileUrl] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [supplierOptions, setSupplierOptions] = useState<SelectModel[]>([]);
  const [isVisibleAddCategory, setIsVisibleAddCategory] = useState(false);
  const [categories, setCategories] = useState<TreeModel[]>([]);

  const editorRef = useRef<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getSupplier();
      await getCategories();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewProduct = async (values: any) => {
    console.log(values);
    const content = editorRef.current.getContent();
  };

  const getSupplier = async () => {
    const api = "/supplier";
    const res = await handleAPI(api);
    const data = res.data.items;
    const options = data.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));

    setSupplierOptions(options);
  };

  const getCategories = async () => {
    const res = await handleAPI(`/products/get-categories`);
    const datas = res.data;

    const data = datas.length > 0 ? getTreeValues(datas, true) : [];

    setCategories(data);
  };
  return isLoading ? (
    <Spin />
  ) : (
    <div>
      <div className="container">
        <Title level={5}>Add new product</Title>
        <Form
          size="large"
          form={form}
          onFinish={handleAddNewProduct}
          layout="vertical"
        >
          <div className="row">
            <div className="col-8">
              <Form.Item
                name={"title"}
                label="Title"
                rules={[{ required: true, message: "Enter title" }]}
              >
                <Input allowClear maxLength={150} showCount />
              </Form.Item>
              <Form.Item
                name={"description"}
                label="Description"
                rules={[{ required: true, message: "Enter description" }]}
              >
                <Input.TextArea
                  allowClear
                  showCount
                  maxLength={500}
                  placeholder="Enter description"
                />
              </Form.Item>

              <Editor
                disabled={isLoading}
                apiKey="c8ri048c72n87em4govx3yacxovhahncjald16bdxhu9qyv0"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={content !== "" ? content : ""}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>
            <div className="col-4">
              <Card size="small" className="mt-4">
                <Space>
                  <Button size="middle" onClick={() => form.resetFields()}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => form.submit()}
                  >
                    Submit
                  </Button>
                </Space>
              </Card>
              <Card size="small" className="mt-3" title="Categories">
                <Form.Item
                  name={"categoried"}
                  rules={[{ message: "Enter category" }]}
                >
                  <TreeSelect
                    showSearch
                    treeData={categories}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider />
                        <Button
                          onClick={() => setIsVisibleAddCategory(true)}
                          icon={<Add size={20} />}
                          type="link"
                        >
                          Add new
                        </Button>
                      </>
                    )}
                  />
                </Form.Item>
              </Card>
              <Card size="small" className="mt-3" title="Supplies">
                <Form.Item
                  name={"supplier"}
                  rules={[{ required: true, message: "Enter Supplier" }]}
                >
                  <Select
                    defaultValue={supplierOptions[0]?.value}
                    showSearch
                    filterOption={(input, option) =>
                      replaceName(option?.label ? option.label : "").includes(
                        replaceName(input)
                      )
                    }
                    options={supplierOptions}
                  />
                </Form.Item>
              </Card>
              <Card className="mt-3">
                <Input
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
                <Input
                  className="mt-3"
                  type="file"
                  accept="image/*"
                  onChange={async (files: any) => {
                    const file = files.target.files[0];
                    if (file) {
                      const dowloadUrl = await upLoadFile(file);
                      dowloadUrl && setFileUrl(dowloadUrl);
                    }
                  }}
                />
              </Card>
            </div>
          </div>
        </Form>
      </div>
      <ModalCategory
        visible={isVisibleAddCategory}
        onclose={() => setIsVisibleAddCategory(false)}
        onAddNew={async (val) => {
          await getCategories();
        }}
        values={categories}
      />
    </div>
  );
};

export default AddProduct;
