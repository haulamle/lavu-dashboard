import { Modal } from "antd";
import { AddCategory } from "../components";
import { TreeModel } from "../models/FormModel";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
  values: TreeModel[];
}
const ModalCategory = (props: Props) => {
  const { visible, values, onClose, onAddNew } = props;

  const handleclose = async () => {
    onClose();
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
          onClose();
        }}
        values={values}
      />
    </Modal>
  );
};

export default ModalCategory;
