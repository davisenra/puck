<script setup lang="ts">
import { ref } from "vue";
import { useModal } from "@/composables/useModal";

const { openManageCoffeeModal, openAddCoffeeModal } = useModal();

const coffees = ref([
  {
    id: 1,
    roaster: "Onyx Coffee Lab",
    name: "Ethiopia Gedeb",
    process: "Washed",
    status: "Available",
  },
  {
    id: 2,
    roaster: "Intelligentsia",
    name: "House Blend",
    process: "Natural",
    status: "Archived",
  },
]);

async function handleAddCoffee() {
  const result = await openAddCoffeeModal();

  if (result?.coffee) {
    const newId = Math.max(...coffees.value.map((c) => c.id), 0) + 1;
    coffees.value.push({
      id: newId,
      roaster: result.coffee.roaster,
      name: result.coffee.name,
      process: result.coffee.process ?? "",
      status: "Available",
    });
  }
}

async function handleView(coffee: (typeof coffees.value)[0]) {
  const result = await openManageCoffeeModal({ coffee });
  if (result.deleted) {
    console.log("Deleting coffee:", coffee.id);
  }
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
      <div class="overflow-x-auto">
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
              v-for="coffee in coffees"
              :key="coffee.id"
              class="hover:bg-base-200 cursor-pointer"
              @click="handleView(coffee)"
            >
              <td>{{ coffee.roaster }}</td>
              <td>{{ coffee.name }}</td>
              <td>{{ coffee.process }}</td>
              <td>
                <span
                  :class="[
                    'badge',
                    coffee.status === 'Available'
                      ? 'badge-success'
                      : 'badge-neutral',
                  ]"
                  >{{ coffee.status }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-base-content/50 py-8 text-center">
        <p>{{ coffees.length }} coffee items</p>
      </div>
    </div>
  </div>
</template>
