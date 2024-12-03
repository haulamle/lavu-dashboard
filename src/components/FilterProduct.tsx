import {
  Button,
  Card,
  Empty,
  Form,
  Select,
  Slider,
  Space,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { SelectModel } from "../models/FormModel";

export interface FilterProductValue {
  color?: string;
  categories?: string[];
  size?: string;
  price?: number[];
}
interface Props {
  values: FilterProductValue;
  onFiter: (values: FilterProductValue) => void;
}
const FilterProduct = (props: Props) => {
  const { values, onFiter } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [selectDatas, setSelectDatas] = useState<{
    categories: SelectModel[];
    colors: string[];
    prices: number[];
    sizes: SelectModel[];
  }>();
  const [colorSelected, setColorSelected] = useState<string[]>([]);

  const [form] = Form.useForm();
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (
      selectDatas &&
      selectDatas?.categories &&
      selectDatas?.categories.length > 0
    ) {
      getFilterValues();
    }
  }, [selectDatas?.categories]);
  const getData = async () => {
    setIsLoading(true);
    try {
      await getCategories();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    const res = await handleAPI("products/get-categories");
    const data =
      res.data && res.data.length > 0
        ? res.data.map((item: any) => ({
            label: item.title,
            value: item._id,
          }))
        : [];
    handleChangeValue("categories", data);
  };

  const handleChangeValue = (key: string, val: any) => {
    const items: any = { ...selectDatas };
    items[`${key}`] = val;

    setSelectDatas({ ...selectDatas, ...items });
  };

  const getFilterValues = async () => {
    const res = await handleAPI("/products/get-filter-values");
    const items: any = { ...selectDatas };

    const data: any = res.data;

    for (const i in data) {
      items[i] = data[i];
    }

    setSelectDatas(items);
  };

  const handleFilter = (values: any) => {
    onFiter({
      ...values,
      colors: colorSelected,
    });
  };
  return (
    <Card
      className="filter-card"
      style={{
        minWidth: 320,
      }}
    >
      {isLoading ? (
        <Spin />
      ) : selectDatas ? (
        <>
          <Form form={form} layout="vertical" onFinish={handleFilter}>
            <Form.Item name={"categories"} label="Categories">
              <Select
                placeholder="Select categories"
                mode="multiple"
                allowClear
                options={selectDatas.categories}
              />
            </Form.Item>
            <>
              {selectDatas.colors && selectDatas.colors.length > 0 && (
                <Space wrap className="mb-3">
                  {selectDatas.colors.map((color) => (
                    <Button
                      onClick={() => {
                        const items = [...colorSelected];
                        const index = items.findIndex(
                          (element) => element === color
                        );
                        if (index !== -1) {
                          items.splice(index, 1);
                        } else {
                          items.push(color);
                        }

                        setColorSelected(items);
                      }}
                      key={color}
                      style={{
                        borderColor: colorSelected.includes(color)
                          ? color
                          : undefined,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 2,
                          backgroundColor: color,
                        }}
                      />
                      <Typography.Text style={{ color: color }}>
                        {color}
                      </Typography.Text>
                    </Button>
                  ))}
                </Space>
              )}
            </>
            <Form.Item name={"Size"} label="Sizes">
              <Select
                placeholder="Select Size"
                allowClear
                options={selectDatas.sizes}
              />
            </Form.Item>
            <Form.Item name={"price"} label="Price">
              {selectDatas.prices && (
                <Slider
                  range
                  min={Math.min(...selectDatas.prices)}
                  max={Math.max(...selectDatas.prices)}
                />
              )}
            </Form.Item>
          </Form>
          <div className="mt-4 text-right">
            <Button type="primary" onClick={() => form.submit()}>
              Filter
            </Button>
          </div>
        </>
      ) : (
        <Empty />
      )}
    </Card>
  );
};

export default FilterProduct;
