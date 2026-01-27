<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "../BaseModal.vue";
import CoffeeForm from "@/components/Forms/CoffeeForm.vue";
import { useFormValidation } from "@/composables/useFormValidation";
import { coffeeSchema, type CoffeeFormState } from "@/schemas/coffee";

const emit = defineEmits<{
  close: [
    result: {
      coffee: CoffeeFormState;
    } | null,
  ];
}>();

const form = ref<CoffeeFormState>({
  roaster: "",
  name: "",
  roastDate: null,
  process: null,
  notes: null,
});

const { validateAll, handleBlur, hasError, getError } = useFormValidation(
  coffeeSchema,
  form,
  { mode: "blur" },
);

function handleSave(): void {
  if (!validateAll()) {
    return;
  }

  const coffeeData = { ...form.value };

  emit("close", { coffee: coffeeData });
}

function handleCancel(): void {
  emit("close", null);
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">Add Coffee</h3>

    <CoffeeForm
      v-model="form"
      :validation="{ hasError, getError, handleBlur }"
    />

    <div class="modal-action">
      <button class="btn btn-sm" @click="handleCancel">Cancel</button>
      <button class="btn btn-primary btn-sm" @click="handleSave">
        Save Coffee
      </button>
    </div>
  </BaseModal>
</template>
