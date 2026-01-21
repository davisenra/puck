<script setup lang="ts">
import { ref } from "vue";
import { useModal } from "@/composables/useModal";

const { openManageEquipmentModal, openAddEquipmentModal } = useModal();

const equipment = ref<
  { id: number; name: string; type: "GRINDER" | "BREWER" }[]
>([
  { id: 1, name: "Baratza Sette 270", type: "GRINDER" },
  { id: 2, name: "V60", type: "BREWER" },
]);

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

async function handleView(item: (typeof equipment.value)[0]) {
  const result = await openManageEquipmentModal({ equipment: item });
  if (result.deleted) {
    console.log("Deleting equipment:", item.id);
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

      <div class="text-base-content/50 py-8 text-center">
        <p>{{ equipment.length }} equipment items</p>
      </div>
    </div>
  </div>
</template>
