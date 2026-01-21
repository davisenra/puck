<script setup lang="ts">
import BaseModal from "../BaseModal.vue";
import ConfirmDeletionButton from "@/components/Buttons/ConfirmDeletionButton.vue";

interface Props {
  coffee: {
    id: number;
    roaster: string;
    name: string;
    process: string;
    status: string;
  };
}

const props = defineProps<Props>();

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
    <h3 class="text-lg font-bold">Manage Coffee</h3>
    <div class="space-y-4 py-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Roaster</span>
        </label>
        <span>{{ coffee.roaster }}</span>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Process</span>
        </label>
        <span>{{ coffee.process }}</span>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Status</span>
        </label>
        <span>{{ coffee.status }}</span>
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
