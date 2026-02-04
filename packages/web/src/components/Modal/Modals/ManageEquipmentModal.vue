<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "../BaseModal.vue";
import ConfirmDeletionButton from "@/components/Buttons/ConfirmDeletionButton.vue";
import EquipmentForm from "@/components/Forms/EquipmentForm.vue";
import { useFormValidation } from "@/composables/useFormValidation";
import type { UpdateEquipment } from "@/types";
import { equipmentSchema, type EquipmentFormState } from "@/schemas/equipment";

const props = defineProps<EquipmentFormState>();

const emit = defineEmits<{
  close: [result: { deleted?: boolean; updated?: UpdateEquipment }];
}>();

const form = ref<EquipmentFormState>({
  name: props.name,
  type: props.type,
});

const { validateAll, handleBlur, hasError, getError } = useFormValidation(
  equipmentSchema,
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

  const updatedData: UpdateEquipment = {
    name: form.value.name,
  };

  emit("close", { updated: updatedData });
}

function handleDeleteConfirm() {
  emit("close", { deleted: true });
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">Manage Equipment</h3>

    <EquipmentForm
      v-model="form"
      :validation="{ hasError, getError, handleBlur }"
      :type-disabled="true"
    />

    <div class="modal-action flex justify-between">
      <button class="btn btn-sm" @click="handleCancel">Cancel</button>
      <div class="flex gap-2">
        <ConfirmDeletionButton @confirm-delete="handleDeleteConfirm" />
        <button class="btn btn-primary btn-sm" @click="handleSave">Save</button>
      </div>
    </div>
  </BaseModal>
</template>
