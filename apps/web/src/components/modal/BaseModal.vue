<script setup lang="ts">
const emit = defineEmits<{
  close: [result?: any];
}>();

function handleBackdropClick(event: MouseEvent): void {
  if (event.target === event.currentTarget) {
    emit("close");
  }
}

function handleEscapeKey(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    emit("close");
  }
}
</script>

<template>
  <div
    class="modal modal-open"
    @click="handleBackdropClick"
    @keydown="handleEscapeKey"
    tabindex="-1"
  >
    <div class="modal-box" @click.stop>
      <slot />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </div>
</template>
