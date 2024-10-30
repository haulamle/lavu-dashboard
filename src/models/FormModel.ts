import { FormLayout } from "antd/es/form/Form";

export interface FormModel {
  title: string;
  layout?: FormLayout;
  labelCol: number;
  wrapperCol: number;
  formItems: FormItemModel[];
}

export interface FormItemModel {
  key: string;
  value: string;
  label: string;
  placeholder: string;
  type: "defautl" | "number" | "checkbox" | "select" | "email" | "file" | "tel";
  message: string;
  lockup_item: SelectModel[];
  default_value: string;
  displayLength: number;
  required: boolean;
}

export interface SelectModel {
  title: string;
  value: string;
}

export interface TreeModel {
  title: string;
  value: string;
  children?: SelectModel[];
}
