import { MinusCircle, PlusCircle } from "lucide-react";
import { useModal } from "../../context/ModalContext";
import Modal from "../Modal/Modal";
import AddExpense from "../../pages/AddExpense/AddExpense";
import AddIncome from "../../pages/AddIncome/AddIncome";

export default function AddEntryModals() {
  const { activeModal, closeModal } = useModal();

  return (
    <>
      <Modal
        open={activeModal === "expense"}
        onClose={closeModal}
        title="Add expense"
        icon={<MinusCircle size={20} color="var(--expense)" />}
      >
        <AddExpense onDone={closeModal} />
      </Modal>

      <Modal
        open={activeModal === "income"}
        onClose={closeModal}
        title="Add income"
        icon={<PlusCircle size={20} color="var(--income)" />}
      >
        <AddIncome onDone={closeModal} />
      </Modal>
    </>
  );
}
