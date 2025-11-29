"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateEstoqueForm } from "./create-estoque-form";
import { useCreateEstoqueModal } from "../hooks/use-create-estoque-modal";

export const CreateEstoqueModal = () => {
  const { isOpen, setIsOpen, close } = useCreateEstoqueModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateEstoqueForm onCancel={close} />
    </ResponsiveModal>
  );
};
