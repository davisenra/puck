<script setup lang="ts">
import type { Equipment } from "@/types";
import BaseModal from "../BaseModal.vue";
import ConfirmDeletionButton from "@/components/Buttons/ConfirmDeletionButton.vue";

interface EquipmentProps {
  id: number;
  name: string;
  type: "GRINDER" | "BREWER";
  createdAt: Date;
  updatedAt: Date;
}

const props = defineProps<EquipmentProps>();

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
    <div class="space-y-4 py-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Type</span>
        </label>
        <span>{{ props.type }}</span>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Static Input</span>
        </label>
        <input
          type="text"
          class="input input-bordered input-sm w-full"
          disabled
          value="Static Placeholder"
        />
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
