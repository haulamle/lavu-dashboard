import { Modal } from "antd";
import { AddCategory } from "../components";
import { TreeModel } from "../models/FormModel";

interface Props {
  visible: boolean;
  onclose: () => void;
  onAddNew: (val: any) => void;
  values: TreeModel[];
}
const ModalCategory = (props: Props) => {
  const { visible, values, onclose, onAddNew } = props;

  const handleclose = async () => {
    onclose();
  };

  return (
    <Modal
      title="Add category"
      open={visible}
      onClose={handleclose}
      onCancel={handleclose}
      footer={null}
    >
      <AddCategory
        onAddNew={(val) => {
          onAddNew(val);
          onclose();
        }}
        values={values}
      />
    </Modal>
  );
};

export default ModalCategory;
