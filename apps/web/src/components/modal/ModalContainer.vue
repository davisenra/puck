<script setup lang="ts">
import { useModalStore } from "@/stores/modal";

const modalStore = useModalStore();
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
