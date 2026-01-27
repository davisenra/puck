<script setup lang="ts">
import type { ComputedRef } from "vue";
import type { CoffeeFormState } from "@/schemas/coffee";

const props = defineProps<{
  modelValue: CoffeeFormState;
  validation: {
    hasError: (field: keyof CoffeeFormState) => ComputedRef<boolean>;
    getError: (field: keyof CoffeeFormState) => ComputedRef<string | undefined>;
    handleBlur: (field: keyof CoffeeFormState) => void;
  };
  showArchived?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: CoffeeFormState): void;
}>();

function update(field: keyof CoffeeFormState, value: any) {
  emit("update:modelValue", { ...props.modelValue, [field]: value });
}

function getStatusText(archived?: boolean): string {
  return archived ? "Archived" : "Available";
}
</script>

<template>
  <div class="space-y-4 py-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text">Roaster</span>
      </label>
      <input
        :value="modelValue.roaster"
        @input="update('roaster', ($event.target as HTMLInputElement).value)"
        type="text"
        class="input input-bordered input-sm w-full"
        :class="{ 'input-error': validation.hasError('roaster').value }"
        placeholder="e.g., Onyx Coffee Lab"
        @blur="validation.handleBlur('roaster')"
      />
      <label class="label">
        <span
          v-if="validation.hasError('roaster').value"
          class="label-text-alt text-error text-xs"
        >
          {{ validation.getError("roaster").value }}
        </span>
      </label>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Name</span>
      </label>
      <input
        :value="modelValue.name"
        @input="update('name', ($event.target as HTMLInputElement).value)"
        type="text"
        class="input input-bordered input-sm w-full"
        :class="{ 'input-error': validation.hasError('name').value }"
        placeholder="e.g., Ethiopia Gedeb"
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
        <span class="label-text">Roast Date</span>
      </label>
      <input
        :value="modelValue.roastDate"
        @input="update('roastDate', ($event.target as HTMLInputElement).value)"
        type="date"
        class="input input-bordered input-sm w-full"
        @blur="validation.handleBlur('roastDate')"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Process</span>
      </label>
      <input
        :value="modelValue.process"
        @input="update('process', ($event.target as HTMLInputElement).value)"
        type="text"
        class="input input-bordered input-sm w-full"
        :class="{ 'input-error': validation.hasError('process').value }"
        placeholder="e.g., Washed, Natural"
        @blur="validation.handleBlur('process')"
      />
      <label class="label">
        <span
          v-if="validation.hasError('process').value"
          class="label-text-alt text-error text-xs"
        >
          {{ validation.getError("process").value }}
        </span>
      </label>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Notes</span>
      </label>
      <textarea
        :value="modelValue.notes"
        @input="update('notes', ($event.target as HTMLInputElement).value)"
        class="textarea textarea-bordered textarea-sm w-full"
        :class="{ 'textarea-error': validation.hasError('notes').value }"
        placeholder="Tasting notes, origins, etc."
        rows="3"
        @blur="validation.handleBlur('notes')"
      />
      <label class="label">
        <span
          v-if="validation.hasError('notes').value"
          class="label-text-alt text-error text-xs"
        >
          {{ validation.getError("notes").value }}
        </span>
      </label>
    </div>

    <div v-if="showArchived" class="form-control">
      <label class="label">
        <span class="label-text">Status</span>
      </label>
      <label class="label cursor-pointer">
        <span class="label-text">Archived</span>
        <input
          :checked="modelValue.archived"
          @change="
            update('archived', ($event.target as HTMLInputElement).checked)
          "
          type="checkbox"
          class="checkbox checkbox-sm"
        />
      </label>
      <span class="text-base-content/50 text-xs">
        Current: {{ getStatusText(modelValue.archived) }}
      </span>
    </div>
  </div>
</template>
