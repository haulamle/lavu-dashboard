import {
  Checkbox,
  DatePicker,
  Divider,
  List,
  message,
  Modal,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { FormModel } from "../models/FormModel";
import handleAPI from "../apis/handleAPI";
import { DateTime } from "../utils/dateTime";
import handleExportExcel from "../utils/handleExportExcel";

interface Props {
  visible: boolean;
  onclose: () => void;
  api: string;
  name?: string;
}

const { RangePicker } = DatePicker;

const ModalExportData = (props: Props) => {
  const { visible, onclose, api, name } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [forms, setForms] = useState<FormModel>();
  const [checked, setChecked] = useState<string[]>([]);
  const [timeSelect, setTimeSelect] = useState<"all" | "ranger">("all");
  const [dates, setDates] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    if (visible) {
      getForms();
    }
  }, [api, visible]);

  const getForms = async () => {
    const url = `/${api}/get-form`;
    setIsGetting(true);
    try {
      const res = await handleAPI(url);
      res.data && setForms(res.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsGetting(false);
    }
  };

  const handleCheckedValue = async (value: string) => {
    const items = [...checked];
    const index = items.findIndex((item) => item === value);
    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(value);
    }
    setChecked(items);
  };

  const handleExport = async () => {
    let url = ``;
    if (timeSelect !== "all" && dates.start && dates.end) {
      if (new Date(dates.start).getTime() > new Date(dates.end).getTime()) {
        message.error("Start date must be less than end date");
      } else {
        url = `${api}/get-export-data/?start=${dates.start}&end=${dates.end}`;
      }
    } else {
      url = `/${api}/get-export-data`;
    }

    const data = checked;
    if (Object.keys(data).length > 0) {
      setIsLoading(true);
      try {
        const res = await handleAPI(url, data, "post");
        res.data && handleExportExcel(res.data, name);
        message.success("Export successfully");
        onclose();
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      message.error("Please select at least one form");
    }
  };

  return (
    <Modal
      open={visible}
      onOk={handleExport}
      onClose={onclose}
      onCancel={onclose}
      title="Export to excel"
      okButtonProps={{ loading: isLoading }}
      loading={isGetting}
    >
      <div>
        <div>
          <Checkbox
            checked={timeSelect === "all"}
            onChange={() =>
              setTimeSelect(timeSelect === "all" ? "ranger" : "all")
            }
          >
            Get all
          </Checkbox>
        </div>
        <div className="mt-2">
          <Checkbox
            checked={timeSelect === "ranger"}
            onChange={() =>
              setTimeSelect(timeSelect === "ranger" ? "all" : "ranger")
            }
          >
            Date ranger
          </Checkbox>
        </div>
        <div className="mt-2">
          {timeSelect === "ranger" && (
            <Space>
              <RangePicker
                onChange={(val: any) => {
                  setDates(
                    val && val[0] && val[1]
                      ? {
                          start: `${DateTime.CalenndarDate(val[0])} 00:00:00`,
                          end: `${DateTime.CalenndarDate(val[1])} 00:00:00`,
                        }
                      : {
                          start: "",
                          end: "",
                        }
                  );
                }}
              />
            </Space>
          )}
        </div>
      </div>
      <Divider />
      <div className="mt-2">
        <List
          dataSource={forms?.formItems}
          renderItem={(item) => (
            <List.Item key={item.key}>
              <Checkbox
                checked={checked.includes(item.value)}
                onChange={() => handleCheckedValue(item.value)}
              >
                {item.label}
              </Checkbox>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default ModalExportData;
