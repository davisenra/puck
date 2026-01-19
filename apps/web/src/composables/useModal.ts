import { useModalStore } from "@/stores/modal";
import DeleteConfirmModal from "@/components/modal/modals/DeleteConfirmModal.vue";
import LogExtractionModal from "@/components/modal/modals/LogExtractionModal.vue";
import AddEquipmentModal from "@/components/modal/modals/AddEquipmentModal.vue";
import AddCoffeeModal from "@/components/modal/modals/AddCoffeeModal.vue";

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

  async function openAddEquipmentModal(options?: Record<string, any>): Promise<{
    equipment: { name: string; type: "GRINDER" | "BREWER" };
  } | null> {
    return openModal(AddEquipmentModal, options || {});
  }

  async function openAddCoffeeModal(options?: Record<string, any>): Promise<{
    coffee: {
      roaster: string;
      name: string;
      roastDate: string | null;
      process: string | null;
      notes: string | null;
    };
  } | null> {
    return openModal(AddCoffeeModal, options || {});
  }

  return {
    openModal,
    closeModal,
    closeAllModals,
    closeTopModal,
    openDeleteModal,
    openLogExtractionModal,
    openAddEquipmentModal,
    openAddCoffeeModal,
  };
}
