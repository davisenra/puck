<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "../BaseModal.vue";
import { useFormValidation } from "@/composables/useFormValidation";

const emit = defineEmits<{
  close: [
    result: { equipment: { name: string; type: "GRINDER" | "BREWER" } } | null,
  ];
}>();

const form = ref({
  name: "",
  type: "" as "GRINDER" | "BREWER",
});

const schema = {
  name: {
    required: true,
    minLength: 2,
    message: "Name is required (min 2 chars)",
  },
  type: { required: true, message: "Type is required" },
};

const { reset, validateAll, handleBlur, hasError, getError } =
  useFormValidation(schema, form, { mode: "blur" });

reset();

function handleSave(): void {
  if (!validateAll()) {
    return;
  }
  emit("close", { equipment: form.value });
}

function handleCancel(): void {
  emit("close", null);
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">Add Equipment</h3>
    <div class="space-y-4 py-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Name</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          class="input input-bordered input-sm w-full"
          :class="{ 'input-error': hasError('name').value }"
          placeholder="e.g., Baratza Sette 270"
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
          <span class="label-text">Type</span>
        </label>
        <select
          v-model="form.type"
          class="select select-bordered select-sm w-full"
          :class="{ 'select-error': hasError('type').value }"
          @blur="handleBlur('type')"
        >
          <option disabled value="">Select type</option>
          <option value="GRINDER">Grinder</option>
          <option value="BREWER">Brewer</option>
        </select>
        <label class="label">
          <span
            v-if="hasError('type')"
            class="label-text-alt text-error text-xs"
          >
            {{ getError("type") }}
          </span>
        </label>
      </div>
    </div>

    <div class="modal-action">
      <button class="btn btn-sm" @click="handleCancel">Cancel</button>
      <button class="btn btn-primary btn-sm" @click="handleSave">
        Save Equipment
      </button>
    </div>
  </BaseModal>
</template>
