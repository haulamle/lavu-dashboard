import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

const CategoryDetail = () => {
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const id = searchParams.get("id");
  console.log(id);
  console.log(slug);
  return <div>CategoryDetail</div>;
};

export default CategoryDetail;
