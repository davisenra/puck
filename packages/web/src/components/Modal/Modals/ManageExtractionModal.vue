<script setup lang="ts">
import { ref, computed } from "vue";
import BaseModal from "../BaseModal.vue";
import ConfirmDeletionButton from "@/components/Buttons/ConfirmDeletionButton.vue";
import ExtractionForm from "@/components/Forms/ExtractionForm.vue";
import { useFormValidation } from "@/composables/useFormValidation";
import {
  extractionSchema,
  type ExtractionFormState,
} from "@/schemas/extraction";
import { useCoffees } from "@/api/useCoffees";
import { useEquipment } from "@/api/useEquipment";
import { useExtraction } from "@/api/useExtractions";
import type { Extraction, UpdateExtraction } from "@/types";

interface Props {
  extractionId: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [result: { deleted?: boolean; updated?: UpdateExtraction }];
}>();

const { data: extraction, isLoading: isLoadingExtraction } = useExtraction(
  props.extractionId,
);
const { data: coffees } = useCoffees();
const { data: equipment } = useEquipment();

const form = computed<ExtractionFormState>(() => ({
  coffeeId: extraction.value?.coffee.id ?? null,
  brewerId: extraction.value?.brewer.id ?? null,
  grinderId: extraction.value?.grinder?.id ?? null,
  grindSetting: extraction.value?.grindSetting ?? null,
  dose: extraction.value?.dose ?? null,
  yield: extraction.value?.yield ?? null,
  brewTime: extraction.value?.brewTime ?? null,
  waterTemp: extraction.value?.waterTemp ?? null,
  rating: extraction.value?.rating ?? 3,
  tastingNotes: extraction.value?.tastingNotes ?? null,
  recipeMetadata: extraction.value?.recipeMetadata ?? null,
}));

const { validateAll, handleBlur, hasError, getError } = useFormValidation(
  extractionSchema,
  form,
  { mode: "blur" },
);

function handleCancel() {
  emit("close", {});
}

function handleSave() {
  if (!validateAll()) {
    return;
  }

  const updatedData: UpdateExtraction = {
    dose: form.value.dose ?? undefined,
    yield: form.value.yield ?? undefined,
    brewTime: form.value.brewTime ?? undefined,
    waterTemp: form.value.waterTemp,
    rating: form.value.rating,
    tastingNotes: form.value.tastingNotes,
    recipeMetadata: form.value.recipeMetadata,
  };

  emit("close", { updated: updatedData });
}

function handleDeleteConfirm() {
  emit("close", { deleted: true });
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">Manage Extraction</h3>

    <div v-if="isLoadingExtraction" class="py-8 text-center">
      <span class="loading loading-spinner loading-md"></span>
    </div>

    <div v-else-if="!extraction" class="py-8 text-center">
      <p class="text-error">Extraction not found</p>
    </div>

    <ExtractionForm
      v-if="coffees && equipment"
      v-model="form"
      :coffees="coffees"
      :equipment="equipment"
      :validation="{ hasError, getError, handleBlur }"
      :is-edit="true"
    />

    <div v-if="extraction" class="text-base-content/60 text-sm">
      <p>{{ formatDate(extraction.createdAt) }}</p>
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
