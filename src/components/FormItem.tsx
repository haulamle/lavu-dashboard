import { Checkbox, Form, Input, Select } from "antd";
import { FormItemModel } from "../models/FormModel";

interface Props {
  item: FormItemModel;
  checked?: boolean;
  setChecked?: (val: boolean) => void;
}
const FormItem = (props: Props) => {
  const { item, setChecked, checked } = props;

  const renderInput = (item: FormItemModel) => {
    let content = <></>;
    switch (item.type) {
      case "checkbox":
        content = (
          <Checkbox checked={checked} onClick={() => setChecked?.(!checked)} />
        );
        break;
      case "select":
        content = (
          <Select
            placeholder={item.placeholder}
            allowClear
            options={item.lockup_item ?? []}
          />
        );
        break;
      default:
        content = (
          <Input type={item.type} placeholder={item.placeholder} allowClear />
        );
        break;
    }

    return content;
  };

  return (
    <Form.Item
      key={item.key}
      name={item.value}
      rules={[{ required: item.required, message: item.message }]}
      label={item.label}
    >
      {renderInput(item)}
    </Form.Item>
  );
};

export default FormItem;
