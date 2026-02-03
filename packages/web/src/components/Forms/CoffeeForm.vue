<script setup lang="ts">
import type { ComputedRef } from "vue";
import type { CoffeeFormState } from "@/schemas/coffee";

const model = defineModel<CoffeeFormState>({ required: true });

const props = defineProps<{
  validation: {
    hasError: (field: keyof CoffeeFormState) => ComputedRef<boolean>;
    getError: (field: keyof CoffeeFormState) => ComputedRef<string | undefined>;
    handleBlur: (field: keyof CoffeeFormState) => void;
  };
  showArchived?: boolean;
}>();

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
        v-model="model.roaster"
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
        v-model="model.name"
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
        v-model="model.roastDate"
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
        v-model="model.process"
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
        v-model="model.notes"
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
      <label class="label cursor-pointer">
        <span class="label-text">Archived</span>
        <input
          v-model="model.archived"
          type="checkbox"
          class="checkbox checkbox-sm"
        />
      </label>
    </div>
  </div>
</template>
