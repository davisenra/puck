<script setup lang="ts">
import { useModal } from "@/composables/useModal";
import {
  useCoffees,
  useCreateCoffee,
  useUpdateCoffee,
  useDeleteCoffee,
} from "@/api/useCoffees";
import type { Coffee } from "@/types";

const { openManageCoffeeModal, openAddCoffeeModal } = useModal();

const { data: coffees, isLoading, error } = useCoffees();
const createCoffee = useCreateCoffee();
const updateCoffee = useUpdateCoffee();
const deleteCoffee = useDeleteCoffee();

async function handleAddCoffee() {
  const result = await openAddCoffeeModal();

  if (result?.coffee) {
    const coffeeData = {
      ...result.coffee,
      roastDate: result.coffee.roastDate
        ? new Date(result.coffee.roastDate)
        : null,
    };
    createCoffee.mutate(coffeeData, {
      onError: (error) => console.error("Failed to create coffee:", error),
    });
  }
}

async function handleView(item: Coffee) {
  const result = await openManageCoffeeModal({ coffee: item });
  if (result?.deleted) {
    deleteCoffee.mutate(item.id, {
      onError: (error) => console.error("Failed to delete coffee:", error),
    });
  } else if (result?.updated) {
    updateCoffee.mutate(
      { id: item.id, data: result.updated },
      {
        onError: (error) => console.error("Failed to update coffee:", error),
      },
    );
  }
}

function getStatusText(archived: boolean): string {
  return archived ? "Archived" : "Available";
}
</script>

<template>
  <div id="coffees" class="card bg-base-100 shadow">
    <div class="card-body">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="card-title">Coffees</h2>
        <button class="btn btn-sm" @click="handleAddCoffee">
          <span>+ Add Coffee</span>
        </button>
      </div>
      <div v-if="isLoading" class="py-8 text-center">
        <span class="loading loading-spinner loading-md"></span>
        <p class="mt-2">Loading coffees...</p>
      </div>
      <div v-else-if="error" class="py-8 text-center">
        <p class="text-error">Failed to load coffees</p>
      </div>
      <div v-else-if="!coffees?.length" class="py-8 text-center">
        <p class="text-base-content/50">No coffees found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="table-sm table">
          <thead>
            <tr>
              <th>Roaster</th>
              <th>Name</th>
              <th>Process</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in coffees"
              :key="item.id"
              class="hover:bg-base-200 cursor-pointer"
              @click="handleView(item)"
            >
              <td>{{ item.roaster }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.process || "-" }}</td>
              <td>
                <span
                  :class="[
                    'badge',
                    !item.archived ? 'badge-success' : 'badge-neutral',
                  ]"
                  >{{ getStatusText(item.archived) }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="coffees?.length" class="text-base-content/50 py-8 text-center">
        <p>{{ coffees.length }} coffee items</p>
      </div>
    </div>
  </div>
</template>
