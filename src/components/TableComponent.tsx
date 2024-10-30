import { Button, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";
import { Sort } from "iconsax-react";
import { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import { FormModel } from "../models/FormModel";
import { Resizable } from "re-resizable";
import { ModalExportData } from "../modals";

interface Props {
  forms: FormModel;
  loading: boolean;
  records: any[];
  onPageChange: (val: { page: number; pageSize: number }) => void;
  onAddnew: () => void;
  scroollHeight?: string;
  total: number;
  extraColumn?: (item: any) => void;
  api: string;
}

const { Title } = Typography;

const TableComponent = (props: Props) => {
  const {
    forms,
    total,
    loading,
    onAddnew,
    scroollHeight,
    onPageChange,
    records,
    extraColumn,
    api,
  } = props;

  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: 10,
  });

  const [columns, setColumns] = useState<ColumnProps<any>[]>([]);
  const [isVisibleModalExport, setIsVisibleModalExport] = useState(false);

  useEffect(() => {
    if (forms && forms.formItems && forms.formItems.length > 0) {
      const items: any = [];
      forms.formItems.forEach((item: any) => {
        items.push({
          key: item.key,
          dataIndex: item.value,
          title: item.label,
          width: item.displayLength,
          //   ellipsis: true,
        });
      });

      items.unshift({
        key: "index",
        dataIndex: "index",
        title: "#",
        width: 50,
      });
      if (extraColumn) {
        items.push({
          key: "actions",
          dataIndex: "",
          title: "Action",
          align: "right",
          fixed: "right",

          width: 100,
          render: (item: any) => extraColumn(item),
        });
      }

      setColumns(items);
    }
  }, [extraColumn, forms]);

  useEffect(() => {
    onPageChange(pageInfo);
  }, [onPageChange, pageInfo]);

  const RenderTitle = (props: any) => {
    const { children, ...restProps } = props;
    return (
      <th
        {...restProps}
        style={{
          padding: "6px 12px",
        }}
      >
        <Resizable
          enable={{ right: true }}
          onResizeStop={(_e, _direction, _ref, d) => {
            const item = columns.find(
              (element) => element.title === children[1]
            );
            if (item) {
              const items = [...columns];
              const newWidth = (item.width as number) + d.width;
              const index = columns.findIndex(
                (element) => element.key === item.key
              );

              if (index !== -1) {
                items[index].width = newWidth;
              }

              setColumns(items);
            }
          }}
        >
          {children}
        </Resizable>
      </th>
    );
  };
  return (
    <>
      <Table
        pagination={{
          showSizeChanger: true,
          // onShowSizeChange: (_current, size) =>
          //   setPageInfo({
          //     ...pageInfo,
          //     pageSize: size,
          //   }),
          total,
          onChange: (current, size) =>
            setPageInfo({
              ...pageInfo,
              page: current,
              pageSize: size,
            }),

          showQuickJumper: true,
        }}
        scroll={{ y: scroollHeight ? scroollHeight : "calc(100vh - 320px)" }}
        loading={loading}
        columns={columns}
        dataSource={records}
        bordered
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={3}>{forms.title}</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button type="primary" onClick={onAddnew}>
                  Add Supplier
                </Button>
                <Button icon={<Sort size={20} color={colors.gray600} />}>
                  Filters
                </Button>
                <Button onClick={() => setIsVisibleModalExport(true)}>
                  Export Excel
                </Button>
              </Space>
            </div>
          </div>
        )}
        components={{
          header: {
            cell: RenderTitle,
          },
        }}
      />
      <ModalExportData
        api={api}
        name={api}
        visible={isVisibleModalExport}
        onclose={() => setIsVisibleModalExport(false)}
      />
    </>
  );
};

export default TableComponent;
