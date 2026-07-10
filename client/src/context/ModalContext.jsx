import { createContext, useContext, useState, useCallback } from "react";

const ModalContext = createContext(null);
export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null); // null | "expense" | "income"

  const openAddExpense = useCallback(() => setActiveModal("expense"), []);
  const openAddIncome = useCallback(() => setActiveModal("income"), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const value = { activeModal, openAddExpense, openAddIncome, closeModal };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
