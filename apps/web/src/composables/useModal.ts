import { useModalStore } from "@/stores/modal";
import DeleteConfirmModal from "@/components/Modal/Modals/DeleteConfirmModal.vue";
import LogExtractionModal from "@/components/Modal/Modals/LogExtractionModal.vue";
import AddEquipmentModal from "@/components/Modal/Modals/AddEquipmentModal.vue";
import AddCoffeeModal from "@/components/Modal/Modals/AddCoffeeModal.vue";
import ManageCoffeeModal from "@/components/Modal/Modals/ManageCoffeeModal.vue";
import ManageEquipmentModal from "@/components/Modal/Modals/ManageEquipmentModal.vue";
import ManageExtractionModal from "@/components/Modal/Modals/ManageExtractionModal.vue";
import { Coffee, UpdateCoffee } from "@/types";

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

  async function openManageCoffeeModal(options: {
    coffee: Coffee;
  }): Promise<{ deleted?: boolean; updated?: UpdateCoffee }> {
    return openModal(ManageCoffeeModal, options);
  }

  async function openManageEquipmentModal(options: {
    equipment: {
      id: number;
      name: string;
      type: "GRINDER" | "BREWER";
    };
  }): Promise<{ deleted?: boolean }> {
    return openModal(ManageEquipmentModal, options);
  }

  async function openManageExtractionModal(options: {
    extraction: {
      id: number;
      coffee: string;
      brewer: string;
      grinder: string;
      dose: string;
      yield: string;
      time: string;
      rating: number;
    };
  }): Promise<{ deleted?: boolean }> {
    return openModal(ManageExtractionModal, options);
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
    openManageCoffeeModal,
    openManageEquipmentModal,
    openManageExtractionModal,
  };
}
