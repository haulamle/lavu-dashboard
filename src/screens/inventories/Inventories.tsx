import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleAPI";
import {
  Avatar,
  Button,
  message,
  Modal,
  QRCode,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ProductModel, SubProductModel } from "../../models/ProductModel";
import { ColumnProps } from "antd/es/table";
import CategoryComponent from "../../components/CategoryComponent";
import { MdLibraryAdd } from "react-icons/md";
import { colors } from "../../constants/colors";
import { AddSubProductModal } from "../../modals";
import { Link, useNavigate } from "react-router-dom";
import { Edit2, Trash } from "iconsax-react";

const { confirm } = Modal;
const Inventories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isVisibleModalAddSubProduct, setIsVisibleModalAddSubProduct] =
    useState(false);
  const [productSelected, setProductSelected] = useState<ProductModel>();

  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const res = await handleAPI("/products");
      setProducts(res.data);
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
      width: 400,
    },
    {
      key: "categories",
      dataIndex: "categories",
      title: "Categories",
      render: (ids: string[]) => (
        <Space>
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

  return (
    <div>
      <Table
        bordered
        scroll={{ x: "100%" }}
        dataSource={products}
        columns={columns}
        loading={isLoading}
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
