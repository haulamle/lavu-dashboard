import { Button, message, Modal, Space, Tooltip, Typography } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { Edit2, Sort, UserRemove } from "iconsax-react";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { colors } from "../constants/colors";
import { ToogleSupplier } from "../modals";
import { SupplierModel } from "../models/SupplierModel";

const { Title, Text } = Typography;
const { confirm } = Modal;

const Suppliers = () => {
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(10);

  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: "index",
      dataIndex: "index",
      title: "#",
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Supplier name",
    },
    {
      key: "product",
      dataIndex: "product",
      title: "Product",
    },
    {
      key: "contact",
      dataIndex: "contact",
      title: "contact",
    },
    {
      key: "email",
      dataIndex: "email",
      title: "Email",
    },
    {
      key: "Type",
      dataIndex: "isTaking",
      title: "Type",
      render: (isTaking: boolean) => (
        <Text type={isTaking ? "success" : "danger"}>
          {isTaking ? "Taking Return" : "Not taking Return"}
        </Text>
      ),
    },
    {
      key: "on",
      dataIndex: "active",
      title: "On the way",
      align: "center",
      render: (num) => num ?? "-",
    },
    {
      key: "actions",
      dataIndex: "",
      title: "Actions",
      fixed: "right",
      align: "right",
      render: (item: SupplierModel) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                setSupplierSelected(item);
                setIsVisibleModalAddNew(true);
              }}
              icon={<Edit2 size={20} className="text-info" />}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              onClick={() =>
                confirm({
                  title: "Confirm",
                  content: "Are you sure you want to delete this supplier?",
                  onOk: () => removeSupplier(item._id),
                })
              }
              icon={<UserRemove size={20} className="text-danger" />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getSuppliers();
  }, [page, pageSize]);

  const getSuppliers = async () => {
    const api = `/supplier?page=${page}&pageSize=${pageSize}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      // res.data && setSuppliers(res.data.items);
      const items: SupplierModel[] = [];

      res.data.items.forEach((item: any, index: number) =>
        items.push({ index: (page - 1) * pageSize + (index + 1), ...item })
      );
      setSuppliers(items);
      setTotal(res.data.total);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSupplier = async (id: string) => {
    const api = `/supplier/remove?id=${id}`;
    try {
      await handleAPI(api, undefined, "put");
      getSuppliers();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <div>
      <Table
        pagination={{
          total,
          showSizeChanger: true,
          onShowSizeChange: (_current, size) => setPageSize(size),
          onChange: (current) => setPage(current),
        }}
        scroll={{ y: "calc(100vh - 320px)" }}
        loading={isLoading}
        columns={columns}
        dataSource={suppliers}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={3}>Suppliers</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button
                  type="primary"
                  onClick={() => setIsVisibleModalAddNew(true)}
                >
                  Add Supplier
                </Button>
                <Button icon={<Sort size={20} color={colors.gray600} />}>
                  Filters
                </Button>
                <Button>Download all</Button>
              </Space>
            </div>
          </div>
        )}
      />
      <ToogleSupplier
        onAddNew={(val) => setSuppliers([...suppliers, val])}
        visible={isVisibleModalAddNew}
        onclose={() => {
          supplierSelected && getSuppliers();
          setIsVisibleModalAddNew(false);
          setSupplierSelected(undefined);
        }}
        supplier={supplierSelected}
      />
    </div>
  );
};

export default Suppliers;
