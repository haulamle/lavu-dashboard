import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleAPI";
import { message, Table } from "antd";
import { ProductModel } from "../../models/ProductModel";

const Inventories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);

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

  return (
    <div>
      <Table dataSource={products} columns={[]} loading={isLoading} />
    </div>
  );
};

export default Inventories;
