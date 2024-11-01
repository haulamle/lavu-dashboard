import { Button, Card, message, Modal, Space, Spin, Tooltip } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { AddCategory } from "../components";
import { colors } from "../constants/colors";
import { TreeModel } from "../models/FormModel";
import { CategoryModel } from "../models/ProductModel";
import { getTreeValues } from "../utils/getTreeValues";

const { confirm } = Modal;
export const Categories = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [treevalues, setTreeValues] = useState<TreeModel[]>([]);
  const [categorySelected, setCategorySelected] = useState<CategoryModel>();
  useEffect(() => {
    getCategories(`/products/get-categories`, true);
  }, []);

  useEffect(() => {
    const api = `/products/get-categories?page=${page}&pageSize=${pageSize}`;
    getCategories(api);
  }, [page, pageSize]);
  const getCategories = async (api: string, isSelected?: boolean) => {
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      setCategories(res.data);

      if (isSelected) {
        setTreeValues(getTreeValues(res.data, "parentId"));
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<CategoryModel>[] = [
    {
      key: "title",
      title: "Name",
      dataIndex: "title",
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "btnaction",
      title: "Actions",
      dataIndex: "",
      render: (item: any) => {
        return (
          <Space>
            <Tooltip title="Edit" key="btnedit">
              <Button
                onClick={() => setCategorySelected(item)}
                type="text"
                icon={<Edit2 size={20} color={colors.gray600} />}
              />
            </Tooltip>
            <Tooltip title="Remove" key="btnremove">
              <Button
                onClick={() =>
                  confirm({
                    title: "Are you sure you want to delete this category?",
                    content: "This action cannot be undone",
                    okText: "Yes",
                    okType: "danger",
                    cancelText: "No",
                    onOk: async () => {
                      handleRemove(item._id);
                    },
                  })
                }
                type="text"
                icon={<Trash size={20} className="text-danger" />}
              />
            </Tooltip>
          </Space>
        );
      },
      align: "right",
      fixed: "right",
    },
  ];

  const handleRemove = async (id: string) => {
    const api = `/products/delete-categories?id=${id}`;
    try {
      await handleAPI(api, undefined, "delete");
      const newCategories = categories.filter((item) => item._id !== id);
      setCategories(newCategories);
      message.success("Delete category successfully!!!");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return isLoading ? (
    <Spin />
  ) : (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <Card title="Add category">
              <AddCategory
                selected={categorySelected}
                values={treevalues}
                onAddNew={async (val) => {
                  if (categorySelected) {
                    const items = [...categories];
                    const index = items.findIndex(
                      (element) => element._id === categorySelected._id
                    );
                    if (index !== -1) {
                      items[index] = val;
                    }
                    setCategories(items);
                    setCategorySelected(undefined);
                  } else {
                    setCategories([...categories, val]);
                    // await getCategories(`/products/get-categories`, true);
                  }
                }}
                onClose={() => setCategorySelected(undefined)}
              />
            </Card>
          </div>
          <div className="col-md-8">
            <Card>
              <Table
                // pagination={{
                //   pageSize: 1,
                //   showSizeChanger: true,
                //   onChange: (current, size) => {
                //     setPage(current);
                //     setPageSize(size);
                //   },
                // }}
                columns={columns}
                dataSource={categories}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
