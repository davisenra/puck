<script setup lang="ts">
import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Coffee, Equipment } from "@/types";
import type { ExtractionFormState } from "@/schemas/extraction";

const model = defineModel<ExtractionFormState>({ required: true });

const props = defineProps<{
  coffees: Coffee[];
  equipment: Equipment[];
  validation: {
    hasError: (field: keyof ExtractionFormState) => ComputedRef<boolean>;
    getError: (
      field: keyof ExtractionFormState,
    ) => ComputedRef<string | undefined>;
    handleBlur: (field: keyof ExtractionFormState) => void;
  };
  isEdit?: boolean;
}>();

const availableCoffees = computed(() =>
  props.coffees.filter((c) => !c.archived),
);
const brewers = computed(() =>
  props.equipment.filter((e) => e.type === "BREWER"),
);
const grinders = computed(() =>
  props.equipment.filter((e) => e.type === "GRINDER"),
);
</script>

<template>
  <div class="space-y-4 py-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text">Coffee</span>
      </label>
      <select
        v-model.number="model.coffeeId"
        class="select select-bordered select-sm w-full"
        :class="{ 'select-error': validation.hasError('coffeeId').value }"
        :disabled="isEdit"
        @blur="validation.handleBlur('coffeeId')"
      >
        <option disabled :value="null">Select coffee</option>
        <option
          v-for="coffee in availableCoffees"
          :key="coffee.id"
          :value="coffee.id"
        >
          {{ coffee.roaster }} - {{ coffee.name }}
        </option>
      </select>
      <label class="label">
        <span
          v-if="validation.hasError('coffeeId').value"
          class="label-text-alt text-error text-xs"
        >
          {{ validation.getError("coffeeId").value }}
        </span>
      </label>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Brewer</span>
        </label>
        <select
          v-model.number="model.brewerId"
          class="select select-bordered select-sm w-full"
          :class="{ 'select-error': validation.hasError('brewerId').value }"
          :disabled="isEdit"
          @blur="validation.handleBlur('brewerId')"
        >
          <option disabled :value="null">Select brewer</option>
          <option v-for="brewer in brewers" :key="brewer.id" :value="brewer.id">
            {{ brewer.name }}
          </option>
        </select>
        <label class="label">
          <span
            v-if="validation.hasError('brewerId').value"
            class="label-text-alt text-error text-xs"
          >
            {{ validation.getError("brewerId").value }}
          </span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Grinder</span>
        </label>
        <select
          v-model.number="model.grinderId"
          class="select select-bordered select-sm w-full"
          :disabled="isEdit"
        >
          <option :value="null">None</option>
          <option
            v-for="grinder in grinders"
            :key="grinder.id"
            :value="grinder.id"
          >
            {{ grinder.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Grind Setting</span>
      </label>
      <input
        v-model="model.grindSetting"
        type="text"
        class="input input-bordered input-sm w-full"
        placeholder="e.g., 20 clicks"
        :disabled="isEdit"
      />
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Dose (g)</span>
        </label>
        <input
          v-model.number="model.dose"
          type="number"
          class="input input-bordered input-sm w-full"
          :class="{ 'input-error': validation.hasError('dose').value }"
          min="0"
          step="0.1"
          @blur="validation.handleBlur('dose')"
        />
        <label class="label">
          <span
            v-if="validation.hasError('dose').value"
            class="label-text-alt text-error text-xs"
          >
            {{ validation.getError("dose").value }}
          </span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Yield (g)</span>
        </label>
        <input
          v-model.number="model.yield"
          type="number"
          class="input input-bordered input-sm w-full"
          :class="{ 'input-error': validation.hasError('yield').value }"
          min="0"
          step="0.1"
          @blur="validation.handleBlur('yield')"
        />
        <label class="label">
          <span
            v-if="validation.hasError('yield').value"
            class="label-text-alt text-error text-xs"
          >
            {{ validation.getError("yield").value }}
          </span>
        </label>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Time (seconds)</span>
        </label>
        <input
          v-model.number="model.brewTime"
          type="number"
          class="input input-bordered input-sm w-full"
          :class="{ 'input-error': validation.hasError('brewTime').value }"
          min="0"
          @blur="validation.handleBlur('brewTime')"
        />
        <label class="label">
          <span
            v-if="validation.hasError('brewTime').value"
            class="label-text-alt text-error text-xs"
          >
            {{ validation.getError("brewTime").value }}
          </span>
        </label>
      </div>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Water Temperature (°C)</span>
      </label>
      <input
        v-model.number="model.waterTemp"
        type="number"
        class="input input-bordered input-sm w-full"
        min="0"
        max="100"
        step="0.1"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Rating</span>
      </label>
      <div class="rating rating-sm">
        <input
          v-for="i in 5"
          :key="i"
          type="radio"
          :name="`rating-${Date.now()}`"
          class="mask mask-star-2 bg-orange-400"
          :class="{ 'input-error': validation.hasError('rating').value }"
          :checked="model.rating === 6 - i"
          @change="model.rating = 6 - i"
        />
      </div>
      <label class="label">
        <span
          v-if="validation.hasError('rating').value"
          class="label-text-alt text-error text-xs"
        >
          {{ validation.getError("rating").value }}
        </span>
      </label>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Tasting Notes</span>
      </label>
      <textarea
        v-model="model.tastingNotes"
        class="textarea textarea-bordered textarea-sm w-full"
        placeholder="Tasting notes, observations..."
        rows="3"
      ></textarea>
    </div>
  </div>
</template>
