<script setup lang="ts">
import BaseModal from "../BaseModal.vue";
import ConfirmDeletionButton from "@/components/Buttons/ConfirmDeletionButton.vue";

interface Props {
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
    <h3 class="text-lg font-bold">Manage Extraction</h3>
    <div class="space-y-4 py-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Brewer</span>
        </label>
        <span>{{ extraction.brewer }}</span>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Grinder</span>
        </label>
        <span>{{ extraction.grinder }}</span>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Dose</span>
        </label>
        <span>{{ extraction.dose }}</span>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Yield</span>
        </label>
        <span>{{ extraction.yield }}</span>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Time</span>
        </label>
        <span>{{ extraction.time }}</span>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Rating</span>
        </label>
        <span>{{ extraction.rating }}/10</span>
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
