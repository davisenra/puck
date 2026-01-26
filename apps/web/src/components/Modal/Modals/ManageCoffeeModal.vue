<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "../BaseModal.vue";
import ConfirmDeletionButton from "@/components/Buttons/ConfirmDeletionButton.vue";
import { useFormValidation } from "@/composables/useFormValidation";
import type { Coffee, UpdateCoffee } from "@/types";

const props = defineProps<Coffee>();

const emit = defineEmits<{
  close: [result: { deleted?: boolean; updated?: UpdateCoffee }];
}>();

const form = ref({
  roaster: props.roaster,
  name: props.name,
  roastDate: props.roastDate,
  process: props.process,
  notes: props.notes,
  archived: props.archived,
});

const schema = {
  roaster: {
    required: true,
    minLength: 2,
    message: "Roaster is required (min 2 chars)",
  },
  name: {
    required: true,
    minLength: 2,
    message: "Name is required (min 2 chars)",
  },
  roastDate: {},
  process: {
    maxLength: 50,
    message: "Process must be at most 50 characters",
  },
  notes: {
    maxLength: 500,
    message: "Notes must be at most 500 characters",
  },
  archived: {},
};

const { reset, validateAll, handleBlur, hasError, getError } =
  useFormValidation(schema, form, { mode: "blur" });

reset();

function handleCancel() {
  emit("close", {});
}

function handleSave() {
  if (!validateAll()) {
    return;
  }

  emit("close", { updated: form.value });
}

function handleDeleteConfirm() {
  emit("close", { deleted: true });
}

function getStatusText(archived: boolean): string {
  return archived ? "Archived" : "Available";
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
        <input
          v-model="form.roaster"
          type="text"
          class="input input-bordered input-sm w-full"
          :class="{ 'input-error': hasError('roaster').value }"
          @blur="handleBlur('roaster')"
        />
        <label class="label">
          <span
            v-if="hasError('roaster')"
            class="label-text-alt text-error text-xs"
          >
            {{ getError("roaster") }}
          </span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Name</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          class="input input-bordered input-sm w-full"
          :class="{ 'input-error': hasError('name').value }"
          @blur="handleBlur('name')"
        />
        <label class="label">
          <span
            v-if="hasError('name')"
            class="label-text-alt text-error text-xs"
          >
            {{ getError("name") }}
          </span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Roast Date</span>
        </label>
        <input
          v-model="form.roastDate"
          type="date"
          class="input input-bordered input-sm w-full"
          @blur="handleBlur('roastDate')"
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Process</span>
        </label>
        <input
          v-model="form.process"
          type="text"
          class="input input-bordered input-sm w-full"
          :class="{ 'input-error': hasError('process').value }"
          placeholder="e.g., Washed, Natural"
          @blur="handleBlur('process')"
        />
        <label class="label">
          <span
            v-if="hasError('process')"
            class="label-text-alt text-error text-xs"
          >
            {{ getError("process") }}
          </span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Notes</span>
        </label>
        <textarea
          v-model="form.notes"
          class="textarea textarea-bordered textarea-sm w-full"
          :class="{ 'textarea-error': hasError('notes').value }"
          placeholder="Tasting notes, origins, etc."
          rows="3"
          @blur="handleBlur('notes')"
        />
        <label class="label">
          <span
            v-if="hasError('notes')"
            class="label-text-alt text-error text-xs"
          >
            {{ getError("notes") }}
          </span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Status</span>
        </label>
        <label class="label cursor-pointer">
          <span class="label-text">Archived</span>
          <input
            v-model="form.archived"
            type="checkbox"
            class="checkbox checkbox-sm"
          />
        </label>
        <span class="text-base-content/50 text-xs">
          Current: {{ getStatusText(form.archived) }}
        </span>
      </div>
    </div>

    <div class="modal-action flex justify-between">
      <button class="btn btn-sm" @click="handleCancel">Cancel</button>
      <div class="flex gap-2">
        <ConfirmDeletionButton @confirm-delete="handleDeleteConfirm" />
        <button class="btn btn-primary btn-sm" @click="handleSave">
          Save Changes
        </button>
      </div>
    </div>
  </BaseModal>
</template>
