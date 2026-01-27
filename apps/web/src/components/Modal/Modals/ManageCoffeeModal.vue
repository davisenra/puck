<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "../BaseModal.vue";
import ConfirmDeletionButton from "@/components/Buttons/ConfirmDeletionButton.vue";
import CoffeeForm from "@/components/Forms/CoffeeForm.vue";
import { useFormValidation } from "@/composables/useFormValidation";
import type { UpdateCoffee } from "@/types";
import { coffeeSchema, type CoffeeFormState } from "@/schemas/coffee";

const props = defineProps<CoffeeFormState>();

const emit = defineEmits<{
  close: [result: { deleted?: boolean; updated?: UpdateCoffee }];
}>();

const form = ref<CoffeeFormState>({
  roaster: props.roaster,
  name: props.name,
  roastDate: (props.roastDate
    ? new Date(props.roastDate).toISOString().split("T")[0]
    : null) as string | null,
  process: props.process,
  notes: props.notes,
  archived: props.archived,
});

const { validateAll, handleBlur, hasError, getError } = useFormValidation(
  coffeeSchema,
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

  const updatedData: UpdateCoffee = {
    ...form.value,
    roastDate: form.value.roastDate ? new Date(form.value.roastDate) : null,
  };

  emit("close", { updated: updatedData });
}

function handleDeleteConfirm() {
  emit("close", { deleted: true });
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">Manage Coffee</h3>

    <CoffeeForm
      v-model="form"
      :validation="{ hasError, getError, handleBlur }"
      show-archived
    />

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
