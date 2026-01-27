# Modal System

A scalable, promise-based modal system for Puck built with Vue 3, Pinia, and DaisyUI.

## Architecture

The modal system consists of:

- **Modal Store** (`stores/modal.ts`): Pinia store managing the modal stack
- **useModal Composable** (`composables/useModal.ts`): Convenient API for opening/closing modals
- **ModalContainer** (`components/modal/ModalContainer.vue`): Renders modals using `component:is`
- **BaseModal** (`components/modal/BaseModal.vue`): DaisyUI modal wrapper with backdrop/ESC handling

## Usage

### Opening a Modal

Using the composable:

```typescript
import { useModal } from "@/composables/useModal";

const { openModal, openDeleteModal, openLogExtractionModal } = useModal();

// Open any modal component
const result = await openModal(DeleteConfirmModal, {
  itemName: "Baratza Sette 270",
  itemType: "equipment",
});

if (result.confirmed) {
  // Handle confirmed action
}

// Use convenience methods
await openDeleteModal({ itemName: "Coffee Name", itemType: "coffee" });
await openLogExtractionModal({ coffeeId: "1" });
```

### Creating a New Modal

1. Create a modal component in `components/modal/modals/`:

```vue
<script setup lang="ts">
import BaseModal from "../BaseModal.vue";

interface Props {
  title: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [result: { value: string }];
}>();

function handleConfirm() {
  emit("close", { value: "confirmed" });
}

function handleCancel() {
  emit("close", { value: "cancelled" });
}
</script>

<template>
  <BaseModal @close="handleCancel">
    <h3 class="text-lg font-bold">{{ props.title }}</h3>
    <p class="py-4">Modal content goes here...</p>
    <div class="modal-action">
      <button class="btn" @click="handleCancel">Cancel</button>
      <button class="btn btn-primary" @click="handleConfirm">Confirm</button>
    </div>
  </BaseModal>
</template>
```

2. Add a convenience method to `useModal.ts` if needed:

```typescript
async function openMyModal(options: {
  title: string;
}): Promise<{ value: string }> {
  return openModal(MyModal, options);
}

return {
  // ... other methods
  openMyModal,
};
```

## Features

- **Stacked Modals**: Multiple modals can be open simultaneously with proper z-index management
- **Promise-based**: Async/await pattern for modal results
- **Type-safe**: Full TypeScript support for props and return values
- **DaisyUI Integration**: Uses DaisyUI's native modal classes
- **Keyboard Support**: ESC key closes the top modal
- **Backdrop Handling**: Click outside the modal to close
- **Global Access**: Use `closeAllModals()` from anywhere to close all modals

## Existing Modals

- **DeleteConfirmModal**: Confirmation dialog for delete actions
- **LogExtractionModal**: Form for logging new coffee extractions

## Modal Props

All modal components should:

1. Accept props via `defineProps<Props>()`
2. Emit a `close` event with the result: `defineEmits<{ close: [result: T] }>()`
3. Use `BaseModal` as the wrapper for consistent styling and behavior
