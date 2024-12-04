import {
  Avatar,
  Button,
  Divider,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import Dropdown from "antd/es/dropdown/dropdown";
import { ColumnProps, TableProps } from "antd/es/table";
import { Edit2, Sort, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { MdLibraryAdd } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import handleAPI from "../../apis/handleAPI";
import { FilterProduct } from "../../components";
import CategoryComponent from "../../components/CategoryComponent";
import { FilterProductValue } from "../../components/FilterProduct";
import { colors } from "../../constants/colors";
import { AddSubProductModal } from "../../modals";
import { ProductModel, SubProductModel } from "../../models/ProductModel";
import { replaceName } from "../../utils/replaceName";

const { confirm } = Modal;
type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];
const Inventories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isVisibleModalAddSubProduct, setIsVisibleModalAddSubProduct] =
    useState(false);
  const [productSelected, setProductSelected] = useState<ProductModel>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [isFilting, setIsFilting] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!searchKey) {
      setPage(1);
      getProducts(`/products?page=${page}&pageSize=${pageSize}`);
    }
  }, [page, pageSize, searchKey]);

  useEffect(() => {
    getProducts(`/products?page=${page}&pageSize=${pageSize}`);
  }, [page, pageSize]);

  const getProducts = async (api: string) => {
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      const data = res.data;
      setProducts(data.items?.map((item: any) => ({ ...item, key: item._id })));
      setTotal(data.totalItems);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getMinMaxValues = (subItems: SubProductModel[]) => {
    const nums: number[] = [];
    if (subItems.length > 0) {
      subItems.forEach((item) => {
        nums.push(item.price);
      });
    }
    return nums.length > 0
      ? `${Math.min(...nums).toLocaleString()} - ${Math.max(
          ...nums
        ).toLocaleString()}`
      : "";
  };

  const handleRemoveProduct = async (id: string) => {
    const api = `/products/delete?id=${id}`;
    try {
      await handleAPI(api, undefined, "delete");
      const items = [...products];
      const index = items.findIndex((item) => item._id === id);
      if (index !== -1) {
        items.splice(index, 1);
      }
      setProducts(items);
      message.success("Delete product successfully!!!");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns: ColumnProps<ProductModel>[] = [
    {
      title: "Title",
      dataIndex: "",
      key: "title",
      width: 300,
      render: (item: ProductModel) => (
        <Link to={`/inventory/detail/${item.slug}?id=${item._id}`}>
          {item.title}
        </Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 320,
      render: (des: string) => (
        <Tooltip title={des}>
          <div className="text-2-line">{des}</div>
        </Tooltip>
      ),
    },
    {
      key: "categories",
      dataIndex: "categories",
      title: "Categories",
      render: (ids: string[]) => (
        <Space wrap>
          {ids.map((id) => (
            <CategoryComponent key={id} id={id} />
          ))}
        </Space>
      ),
      width: 300,
    },
    {
      key: "images",
      dataIndex: "images",
      title: "Images",
      render: (images: string[]) =>
        images &&
        images.length > 0 && (
          <Space>
            <Avatar.Group>
              {images.map((image, index) => (
                <Avatar key={index} size={40} src={image} />
              ))}
            </Avatar.Group>
          </Space>
        ),
      width: 300,
    },
    // {
    //   key: "QR",
    //   title: "QR",
    //   dataIndex: "",
    //   render: (item: ProductModel) => <QRCode size={60} value={item._id} />,
    // },

    {
      key: "Color",
      title: "Color",
      dataIndex: "subItems",
      render: (items: SubProductModel[]) => {
        const colors: string[] = [];
        items.forEach((item) => {
          if (!colors.includes(item.color)) {
            colors.push(item.color);
          }
        });
        return (
          <Space>
            {colors.length > 0 &&
              colors.map((item, index) => (
                <div
                  key={`color=${item}` + index}
                  style={{
                    backgroundColor: item,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                  }}
                />
              ))}
          </Space>
        );
      },
      width: 300,
    },
    {
      key: "Sizes",
      title: "Sizes",
      dataIndex: "subItems",
      render: (items: SubProductModel[]) => (
        <Space wrap>
          {items.length > 0 &&
            items.map((item) => (
              <Tag key={`size=${item.size}`}>{item.size}</Tag>
            ))}
        </Space>
      ),
      width: 130,
    },
    {
      key: "Price",
      title: "Price",
      dataIndex: "subItems",
      render: (items: SubProductModel[]) => (
        <Typography.Text>{getMinMaxValues(items)}</Typography.Text>
      ),
      width: 300,
    },
    {
      key: "Stock",
      title: "Stock",
      dataIndex: "subItems",
      render: (items: SubProductModel[]) =>
        items.reduce((a, b) => a + b.qty, 0),
      align: "center",
      width: 100,
    },

    {
      key: "action",
      title: "Action",
      dataIndex: "",
      fixed: "right",
      render: (item: ProductModel) => {
        return (
          <Space>
            <Tooltip title="Add subProduct" key={"btnaddsubproduct"}>
              <Button
                onClick={() => {
                  setProductSelected(item);
                  setIsVisibleModalAddSubProduct(true);
                }}
                type="text"
                icon={<MdLibraryAdd size={20} color={colors.primary500} />}
              />
            </Tooltip>
            <Tooltip title="Edit subProduct" key={"btneditsubproduct"}>
              <Button
                onClick={() => {
                  navigate(`/inventory/add-product?id=${item._id}`);
                }}
                type="text"
                icon={<Edit2 size={20} color={colors.primary500} />}
              />
            </Tooltip>
            <Tooltip title="Delete subProduct" key={"btndeletesubproduct"}>
              <Button
                onClick={() => {
                  confirm({
                    title: "Are you sure you want to delete this product?",
                    content:
                      "When clicked the OK button, this product will be deleted.",
                    onOk: async () => {
                      handleRemoveProduct(item._id);
                    },
                    onCancel: () => {
                      console.log("Cancel");
                    },
                  });
                }}
                type="text"
                icon={<Trash size={20} className="text-danger" />}
              />
            </Tooltip>
          </Space>
        );
      },
      width: 150,
    },
  ];
  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection: TableRowSelection<ProductModel> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleSelectAllProduct = async () => {
    try {
      const res = await handleAPI("/products");
      const items = res.data.items;
      if (items.length > 0) {
        const keys = items.map((item: ProductModel) => item._id);
        setSelectedRowKeys(keys);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchProducts = async () => {
    const key = replaceName(searchKey);
    setPage(1);
    const api = `/products?title=${key}&page=${page}&pageSize=${pageSize} `;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      setProducts(res.data.items);
      setTotal(res.data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilerProducts = async (vals: FilterProductValue) => {
    const api = `/products/filter-products`;
    setIsFilting(true);
    try {
      const res = await handleAPI(api, vals, "post");
      setTotal(res.data.totalItems);
      setProducts(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col">
          <Typography.Title level={4}>Product</Typography.Title>
        </div>
        <div className="col">
          {selectedRowKeys.length > 0 && (
            <Space>
              <Tooltip title="Delete product" key="btndelete">
                <Button
                  onClick={() =>
                    confirm({
                      title: "Are you sure you want to delete this product?",
                      content:
                        "When clicked the OK button, this product will be deleted.",
                      onOk: () => {
                        selectedRowKeys.forEach(
                          async (key) =>
                            await handleRemoveProduct(key as string)
                        );
                      },

                      onCancel: () => {
                        setSelectedRowKeys([]);
                      },
                    })
                  }
                  danger
                  type="text"
                  icon={<Trash size={18} className="text-danger" />}
                >
                  Delete
                </Button>
              </Tooltip>

              <Typography.Text>
                {selectedRowKeys.length} items selected
              </Typography.Text>
              {selectedRowKeys.length > 0 && selectedRowKeys.length < total && (
                <Button type="link" onClick={handleSelectAllProduct}>
                  Select all
                </Button>
              )}
            </Space>
          )}
        </div>
        <div className="col text-right">
          <Space>
            {isFilting && (
              <Button
                onClick={async () => {
                  setIsFilting(false);
                  setPage(1);
                  await getProducts(
                    `/products?page=${page}&pageSize=${pageSize}`
                  );
                }}
              >
                Clear filter
              </Button>
            )}
            <Input.Search
              value={searchKey}
              onChange={(val) => setSearchKey(val.target.value)}
              onSearch={handleSearchProducts}
              placeholder="search"
              allowClear
              style={{ minWidth: "100px" }}
            />
            <Dropdown
              dropdownRender={(menu) => (
                <FilterProduct
                  values={{}}
                  onFiter={(val) => {
                    handleFilerProducts(val);
                  }}
                />
              )}
            >
              <Button icon={<Sort size={20} />}>Filter</Button>
            </Dropdown>

            <Divider type="vertical" />
            <Button
              onClick={() => navigate(`/inventory/add-product`)}
              style={{ background: colors.primary500 }}
            >
              Add Product
            </Button>
          </Space>
        </div>
      </div>
      <Table
        bordered
        scroll={{ x: "100%" }}
        dataSource={products}
        columns={columns}
        loading={isLoading}
        rowSelection={rowSelection}
        pagination={{
          showSizeChanger: true,
          total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
          showQuickJumper: false,
        }}
      />
      <AddSubProductModal
        product={productSelected}
        visible={isVisibleModalAddSubProduct}
        onclose={() => {
          setProductSelected(undefined);
          setIsVisibleModalAddSubProduct(false);
        }}
        onAddNew={(val) => console.log(val)}
      />
    </div>
  );
};

export default Inventories;
