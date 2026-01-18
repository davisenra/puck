import { useModalStore } from "@/stores/modal";
import DeleteConfirmModal from "@/components/modal/modals/DeleteConfirmModal.vue";
import LogExtractionModal from "@/components/modal/modals/LogExtractionModal.vue";

export function useModal() {
  const modalStore = useModalStore();

  function openModal<T>(
    component: any,
    props: Record<string, any> = {},
  ): Promise<T> {
    return modalStore.open<T>(component, props);
  }

  function closeModal(result?: any, modalId?: string): void {
    modalStore.close(result, modalId);
  }

  function closeAllModals(): void {
    modalStore.closeAll();
  }

  function closeTopModal(): void {
    modalStore.closeTop();
  }

  async function openDeleteModal(options: {
    itemName: string;
    itemType: string;
  }): Promise<{ confirmed: boolean }> {
    return openModal(DeleteConfirmModal, options);
  }

  async function openLogExtractionModal(
    options?: Record<string, any>,
  ): Promise<{ extraction: any } | null> {
    return openModal(LogExtractionModal, options || {});
  }

  return {
    openModal,
    closeModal,
    closeAllModals,
    closeTopModal,
    openDeleteModal,
    openLogExtractionModal,
  };
}
