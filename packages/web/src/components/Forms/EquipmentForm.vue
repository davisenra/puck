<script setup lang="ts">
import type { ComputedRef } from "vue";
import type { EquipmentFormState } from "@/schemas/equipment";

const model = defineModel<EquipmentFormState>({ required: true });

const props = defineProps<{
  validation: {
    hasError: (field: keyof EquipmentFormState) => ComputedRef<boolean>;
    getError: (
      field: keyof EquipmentFormState,
    ) => ComputedRef<string | undefined>;
    handleBlur: (field: keyof EquipmentFormState) => void;
  };
  typeDisabled?: boolean;
}>();
</script>

<template>
  <div class="space-y-4 py-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text">Name</span>
      </label>
      <input
        v-model="model.name"
        type="text"
        class="input input-bordered input-sm w-full"
        :class="{ 'input-error': validation.hasError('name').value }"
        placeholder="e.g., Baratza Sette 270"
        @blur="validation.handleBlur('name')"
      />
      <label class="label">
        <span
          v-if="validation.hasError('name').value"
          class="label-text-alt text-error text-xs"
        >
          {{ validation.getError("name").value }}
        </span>
      </label>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Type</span>
      </label>
      <select
        v-model="model.type"
        class="select select-bordered select-sm w-full"
        :class="{ 'select-error': validation.hasError('type').value }"
        :disabled="typeDisabled"
        @blur="validation.handleBlur('type')"
      >
        <option disabled value="">Select type</option>
        <option value="GRINDER">Grinder</option>
        <option value="BREWER">Brewer</option>
      </select>
      <label class="label">
        <span
          v-if="validation.hasError('type').value"
          class="label-text-alt text-error text-xs"
        >
          {{ validation.getError("type").value }}
        </span>
      </label>
    </div>
  </div>
</template>
