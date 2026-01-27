<script setup lang="ts">
import BaseModal from "../BaseModal.vue";
import ConfirmDeletionButton from "@/components/Buttons/ConfirmDeletionButton.vue";

export interface ManageEquipmentModalProps {
  id: number;
  name: string;
  type: "GRINDER" | "BREWER";
}

const props = defineProps<ManageEquipmentModalProps>();

const emit = defineEmits<{
  close: [result: { deleted?: boolean }];
}>();

function handleCancel() {
  emit("close", {});
}

function handleSave() {
  // no-op
  emit("close", {});
}

function handleDeleteConfirm() {
  emit("close", { deleted: true });
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">Manage Equipment</h3>
    <div class="space-y-4 py-4 text-sm">
      <div class="form-control">
        <label class="label">
          <span class="label-text mr-2">Name</span>
        </label>
        <span>{{ props.name }}</span>
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text mr-2">Type</span>
        </label>
        <span>{{ props.type }}</span>
      </div>
    </div>
    <div class="modal-action flex justify-between">
      <button class="btn btn-sm" @click="handleCancel">Cancel</button>
      <div class="flex gap-2">
        <ConfirmDeletionButton @confirm-delete="handleDeleteConfirm" />
        <button class="btn btn-primary btn-sm" @click="handleSave">Save</button>
      </div>
    </div>
  </BaseModal>
</template>
