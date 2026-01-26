<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "../BaseModal.vue";
import { useFormValidation } from "@/composables/useFormValidation";

const emit = defineEmits<{
  close: [
    result: {
      coffee: {
        roaster: string;
        name: string;
        roastDate: string | null;
        process: string | null;
        notes: string | null;
      };
    } | null,
  ];
}>();

const form = ref({
  roaster: "",
  name: "",
  roastDate: null as string | null,
  process: null as string | null,
  notes: null as string | null,
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
};

const { reset, validateAll, handleBlur, hasError, getError } =
  useFormValidation(schema, form, { mode: "blur" });

reset();

function handleSave(): void {
  if (!validateAll()) {
    return;
  }

  const coffeeData = { ...form.value };

  emit("close", { coffee: coffeeData });
}

function handleCancel(): void {
  emit("close", null);
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">Add Coffee</h3>
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
          placeholder="e.g., Onyx Coffee Lab"
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
          placeholder="e.g., Ethiopia Gedeb"
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
    </div>

    <div class="modal-action">
      <button class="btn btn-sm" @click="handleCancel">Cancel</button>
      <button class="btn btn-primary btn-sm" @click="handleSave">
        Save Coffee
      </button>
    </div>
  </BaseModal>
</template>
