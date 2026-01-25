import { defineStore } from "pinia";
import { ref, computed, markRaw } from "vue";

interface ModalEntry {
  id: string;
  component: any;
  props: Record<string, any>;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

export const useModalStore = defineStore("modal", () => {
  const modals = ref<ModalEntry[]>([]);

  const activeModal = computed(
    () => modals.value[modals.value.length - 1] || null,
  );
  const hasActiveModals = computed(() => modals.value.length > 0);

  function generateId(): string {
    return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  function open<T>(
    component: any,
    props: Record<string, any> = {},
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = generateId();
      modals.value.push({
        id,
        component: markRaw(component),
        props,
        resolve,
        reject,
      });
    });
  }

  function close(result?: any, modalId?: string): void {
    if (modalId) {
      const index = modals.value.findIndex((m) => m.id === modalId);
      if (index !== -1) {
        const modal = modals.value[index];
        modal?.resolve(result);
        modals.value.splice(index, 1);
      }
    } else if (modals.value.length > 0) {
      const modal = modals.value.pop();
      modal?.resolve(result);
    }
  }

  function closeAll(): void {
    modals.value.forEach((modal) => {
      modal.resolve(undefined);
    });
    modals.value = [];
  }

  function closeTop(): void {
    const modal = modals.value.pop();
    if (modal) {
      modal.resolve(undefined);
    }
  }

  return {
    modals,
    activeModal,
    hasActiveModals,
    open,
    close,
    closeAll,
    closeTop,
  };
});
