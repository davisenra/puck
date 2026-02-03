<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "../BaseModal.vue";
import ExtractionForm from "@/components/Forms/ExtractionForm.vue";
import { useFormValidation } from "@/composables/useFormValidation";
import {
  extractionSchema,
  type ExtractionFormState,
} from "@/schemas/extraction";
import { useCoffees } from "@/api/useCoffees";
import { useEquipment } from "@/api/useEquipment";
import type { CreateExtraction } from "@/types";

const emit = defineEmits<{
  close: [result: { extraction: CreateExtraction } | null];
}>();

const { data: coffees } = useCoffees();
const { data: equipment } = useEquipment();

const form = ref<ExtractionFormState>({
  coffeeId: null,
  brewerId: null,
  grinderId: null,
  grindSetting: null,
  dose: null,
  yield: null,
  brewTime: null,
  waterTemp: null,
  rating: 3,
  tastingNotes: null,
  recipeMetadata: null,
});

const { validateAll, handleBlur, hasError, getError } = useFormValidation(
  extractionSchema,
  form,
  { mode: "blur" },
);

function handleSave(): void {
  if (!validateAll()) {
    return;
  }

  const extractionData: CreateExtraction = {
    coffeeId: form.value.coffeeId!,
    brewerId: form.value.brewerId!,
    grinderId: form.value.grinderId,
    grindSetting: form.value.grindSetting,
    dose: form.value.dose!,
    yield: form.value.yield!,
    brewTime: form.value.brewTime!,
    waterTemp: form.value.waterTemp,
    rating: form.value.rating,
    tastingNotes: form.value.tastingNotes,
    recipeMetadata: form.value.recipeMetadata,
  };

  emit("close", { extraction: extractionData });
}

function handleCancel(): void {
  emit("close", null);
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">Log Extraction</h3>

    <ExtractionForm
      v-if="coffees && equipment"
      v-model="form"
      :coffees="coffees"
      :equipment="equipment"
      :validation="{ hasError, getError, handleBlur }"
      :is-edit="false"
    />
    <div v-else class="py-8 text-center">
      <span class="loading loading-spinner loading-md"></span>
    </div>

    <div class="modal-action flex justify-between">
      <button class="btn btn-sm" @click="handleCancel">Cancel</button>
      <button class="btn btn-primary btn-sm" @click="handleSave">
        Save Extraction
      </button>
    </div>
  </BaseModal>
</template>
