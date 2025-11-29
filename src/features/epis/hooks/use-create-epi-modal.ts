import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateEpiModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-epi",
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
