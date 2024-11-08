export interface CategoryModel {
  _id: string;
  title: string;
  parentId?: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductModel {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categories: string[];
  supplier: string;
  content: string;
  images: any[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
