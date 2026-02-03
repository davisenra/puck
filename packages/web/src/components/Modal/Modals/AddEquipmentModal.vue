<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "../BaseModal.vue";
import EquipmentForm from "@/components/Forms/EquipmentForm.vue";
import { useFormValidation } from "@/composables/useFormValidation";
import { equipmentSchema, type EquipmentFormState } from "@/schemas/equipment";

const emit = defineEmits<{
  close: [result: { equipment: EquipmentFormState } | null];
}>();

const form = ref<EquipmentFormState>({
  name: "",
  type: "GRINDER",
});

const { validateAll, handleBlur, hasError, getError } = useFormValidation(
  equipmentSchema,
  form,
  { mode: "blur" },
);

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

    <EquipmentForm
      v-model="form"
      :validation="{ hasError, getError, handleBlur }"
    />

    <div class="modal-action">
      <button class="btn btn-sm" @click="handleCancel">Cancel</button>
      <button class="btn btn-primary btn-sm" @click="handleSave">
        Save Equipment
      </button>
    </div>
  </BaseModal>
</template>
