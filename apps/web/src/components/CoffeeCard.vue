<script setup lang="ts">
import { ref } from "vue";
import { useModal } from "@/composables/useModal";

const { openDeleteModal, openAddCoffeeModal } = useModal();

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

async function handleDelete(id: number, name: string) {
  const result = await openDeleteModal({
    itemName: name,
    itemType: "coffee",
  });

  if (result.confirmed) {
    console.log("Deleting coffee:", id);
  }
}

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
      <div>
        <table class="table-sm table">
          <thead>
            <tr>
              <th>Roaster</th>
              <th>Name</th>
              <th>Process</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="coffee in coffees" :key="coffee.id">
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
              <td class="text-right">
                <div class="dropdown dropdown-end dropdown-bottom">
                  <div
                    tabindex="0"
                    role="button"
                    class="btn btn-xs btn-ghost m-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </div>
                  <ul
                    tabindex="0"
                    class="dropdown-content menu bg-base-100 rounded-box z-50 w-32 p-2 shadow"
                  >
                    <li><a>Edit</a></li>
                    <li>
                      <a
                        class="text-error"
                        @click="handleDelete(coffee.id, coffee.name)"
                        >Delete</a
                      >
                    </li>
                  </ul>
                </div>
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
