"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { CreateEpiForm } from "./create-epi-form";

import { useCreateEpiModal } from "../hooks/use-create-epi-modal";

export const CreateEpiModal = () => {
  const { isOpen, setIsOpen, close } = useCreateEpiModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateEpiForm onCancel={close} />
    </ResponsiveModal>
  );
};
