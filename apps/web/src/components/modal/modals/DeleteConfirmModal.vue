<script setup lang="ts">
import BaseModal from "../BaseModal.vue";

interface Props {
  itemName: string;
  itemType: string;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [result: { confirmed: boolean }];
}>();

function handleConfirm(): void {
  emit("close", { confirmed: true });
}

function handleCancel(): void {
  emit("close", { confirmed: false });
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">Delete {{ itemType }}?</h3>
    <p class="py-4">
      Are you sure you want to delete <strong>{{ itemName }}</strong
      >? This action cannot be undone.
    </p>
    <div class="modal-action">
      <button class="btn" @click="handleCancel">Cancel</button>
      <button class="btn btn-error" @click="handleConfirm">Delete</button>
    </div>
  </BaseModal>
</template>
