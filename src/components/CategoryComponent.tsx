import { useEffect, useState } from "react";
import { CategoryModel } from "../models/ProductModel";
import { message, Tag } from "antd";
import handleAPI from "../apis/handleAPI";
import { Link } from "react-router-dom";
import { listColors } from "../constants/colors";

interface Props {
  id: string;
}
const CategoryComponent = (props: Props) => {
  const { id } = props;

  const [category, setCategory] = useState<CategoryModel>();

  useEffect(() => {
    getCategoryDetail();
  }, [id]);

  const getCategoryDetail = async () => {
    const api = `/products/categories/detail?id=${id}`;
    try {
      const res = await handleAPI(api);
      res.data && setCategory(res.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <Link to={`/categories/detail/${category?.slug}?id=${id}`}>
      <Tag color={listColors[Math.floor(Math.random() * listColors.length)]}>
        {category?.title}
      </Tag>
    </Link>
  );
};

export default CategoryComponent;
