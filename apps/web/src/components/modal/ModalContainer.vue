<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useModalStore } from "@/stores/modal";

const modalStore = useModalStore();

function handleEscape(event: KeyboardEvent): void {
  if (event.key === "Escape" && modalStore.hasActiveModals) {
    modalStore.closeTop();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-for="(modal, index) in modalStore.modals"
      :key="modal.id"
      :style="{ zIndex: 1000 + index }"
    >
      <component
        :is="modal.component"
        v-bind="modal.props"
        @close="(result: unknown) => modalStore.close(result, modal.id)"
      />
    </div>
  </Teleport>
</template>
