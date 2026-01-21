<script setup lang="ts">
const emit = defineEmits<{
  close: [result?: any];
}>();
</script>

<template>
  <div class="modal modal-open">
    <div class="modal-box" @click.stop>
      <slot />
    </div>
    <form method="dialog" class="modal-backdrop" @click="$emit('close')">
      <button>close</button>
    </form>
  </div>
</template>
