<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  "confirm-delete": [];
}>();

const confirming = ref(false);

function handleClick() {
  if (confirming.value) {
    emit("confirm-delete");
    confirming.value = false; // reset
  } else {
    confirming.value = true;
  }
}
</script>

<template>
  <button
    class="btn btn-sm transition-colors duration-200"
    :class="{ 'btn-error': confirming }"
    @click="handleClick"
  >
    {{ confirming ? "Confirm deletion?" : "Delete" }}
  </button>
</template>
