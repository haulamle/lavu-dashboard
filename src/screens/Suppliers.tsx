import { Button, message, Modal, Space, Tooltip } from "antd";
import { Edit2, UserRemove } from "iconsax-react";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import TableComponent from "../components/TableComponent";
import { ToogleSupplier } from "../modals";
import { FormModel } from "../models/FormModel";
import { SupplierModel } from "../models/SupplierModel";

const { confirm } = Modal;

const Suppliers = () => {
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(10);
  const [forms, setForms] = useState<FormModel>();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getSuppliers();
  }, [page, pageSize]);

  const getData = async () => {
    setIsLoading(true);
    await getSuppliers();
    await getForm();
    try {
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getForm = async () => {
    const api = "/supplier/get-form";
    const res = await handleAPI(api);
    res.data && setForms(res.data);
  };

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
      await getSuppliers();
      message.success("Delete supplier successfully!!!");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <div>
      {forms && (
        <TableComponent
          api="supplier"
          forms={forms}
          total={total}
          loading={isLoading}
          records={suppliers}
          onPageChange={(val) => {
            setPage(val.page);
            setPageSize(val.pageSize);
          }}
          onAddnew={() => setIsVisibleModalAddNew(true)}
          extraColumn={(item) => (
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
          )}
        />
      )}

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
