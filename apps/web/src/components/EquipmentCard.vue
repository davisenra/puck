<script setup lang="ts">
import { useModal } from "@/composables/useModal";
import {
  useEquipment,
  useCreateEquipment,
  useDeleteEquipment,
} from "@/api/useEquipment";

const { openManageEquipmentModal, openAddEquipmentModal } = useModal();

const { data: equipment, isLoading, error } = useEquipment();
const createEquipment = useCreateEquipment();
const deleteEquipment = useDeleteEquipment();

async function handleAddEquipment() {
  const result = await openAddEquipmentModal();

  if (result?.equipment) {
    createEquipment.mutate(result.equipment, {
      onError: (error) => console.error("Failed to create equipment:", error),
    });
  }
}

async function handleView(item: NonNullable<typeof equipment.value>[0]) {
  const result = await openManageEquipmentModal({ equipment: item });
  if (result?.deleted) {
    deleteEquipment.mutate(item.id, {
      onError: (error) => console.error("Failed to delete equipment:", error),
    });
  }
}
</script>

<template>
  <div id="equipment" class="card bg-base-100 shadow">
    <div class="card-body">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="card-title">Equipment</h2>
        <button class="btn btn-sm" @click="handleAddEquipment">
          <span>+ Add Equipment</span>
        </button>
      </div>
      <div v-if="isLoading" class="py-8 text-center">
        <span class="loading loading-spinner loading-md"></span>
        <p class="mt-2">Loading equipment...</p>
      </div>
      <div v-else-if="error" class="py-8 text-center">
        <p class="text-error">Failed to load equipment</p>
      </div>
      <div v-else-if="!equipment?.length" class="py-8 text-center">
        <p class="text-base-content/50">No equipment found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="table-sm table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in equipment"
              :key="item.id"
              class="hover:bg-base-200 cursor-pointer"
              @click="handleView(item)"
            >
              <td>{{ item.name }}</td>
              <td>
                <span
                  :class="[
                    'badge',
                    item.type === 'GRINDER'
                      ? 'badge-primary'
                      : 'badge-secondary',
                  ]"
                  >{{ item.type }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="equipment?.length"
        class="text-base-content/50 py-8 text-center"
      >
        <p>{{ equipment.length }} equipment items</p>
      </div>
    </div>
  </div>
</template>
