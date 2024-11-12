import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleAPI";
import { Avatar, Button, message, QRCode, Space, Table, Tooltip } from "antd";
import { ProductModel } from "../../models/ProductModel";
import { ColumnProps } from "antd/es/table";
import CategoryComponent from "../../components/CategoryComponent";
import { MdLibraryAdd } from "react-icons/md";
import { colors } from "../../constants/colors";
import { AddSubProductModal } from "../../modals";

const Inventories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isVisibleModalAddSubProduct, setIsVisibleModalAddSubProduct] =
    useState(false);
  const [productSelected, setProductSelected] = useState<ProductModel>();
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

  const columns: ColumnProps<ProductModel>[] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
    },
    // {
    //   key: "QR",
    //   title: "QR",
    //   dataIndex: "",
    //   render: (item: ProductModel) => <QRCode size={60} value={item._id} />,
    // },
    {
      key: "action",
      title: "Action",
      dataIndex: "",
      fixed: "right",
      render: (item: ProductModel) => {
        return (
          <Space>
            <Tooltip title="Add subProduct">
              <Button
                onClick={() => {
                  setProductSelected(item);
                  setIsVisibleModalAddSubProduct(true);
                }}
                type="text"
                icon={<MdLibraryAdd size={20} color={colors.primary500} />}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Table dataSource={products} columns={columns} loading={isLoading} />
      <AddSubProductModal
        product={productSelected}
        visible={isVisibleModalAddSubProduct}
        onclose={() => {
          setProductSelected(undefined);
          setIsVisibleModalAddSubProduct(false);
        }}
      />
    </div>
  );
};

export default Inventories;
