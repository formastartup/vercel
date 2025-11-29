import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateEstoqueModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-estoque",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
