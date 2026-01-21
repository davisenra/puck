<script setup lang="ts">
import { ref } from "vue";
import { useModal } from "@/composables/useModal";

const { openDeleteModal, openAddEquipmentModal } = useModal();

const equipment = ref([
  { id: 1, name: "Baratza Sette 270", type: "GRINDER" },
  { id: 2, name: "V60", type: "BREWER" },
]);

async function handleDelete(id: number, name: string) {
  const result = await openDeleteModal({
    itemName: name,
    itemType: "equipment",
  });

  if (result.confirmed) {
    console.log("Deleting equipment:", id);
  }
}

async function handleAddEquipment() {
  const result = await openAddEquipmentModal();

  if (result?.equipment) {
    const newId = Math.max(...equipment.value.map((e) => e.id), 0) + 1;
    equipment.value.push({
      id: newId,
      name: result.equipment.name,
      type: result.equipment.type,
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
      <div class="overflow-x-auto">
        <table class="table-sm table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in equipment" :key="item.id">
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
                        @click="handleDelete(item.id, item.name)"
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
        <p>{{ equipment.length }} equipment items</p>
      </div>
    </div>
  </div>
</template>
