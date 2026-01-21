<script setup lang="ts">
import { ref } from "vue";
import { useModal } from "@/composables/useModal";

const { openDeleteModal } = useModal();

const extractions = ref([
  {
    id: 1,
    coffee: "Ethiopia Gedeb",
    brewer: "V60",
    grinder: "Baratza Sette 270 / 20 clicks",
    dose: "20g",
    yield: "40g",
    time: "30s",
    rating: 8,
  },
  {
    id: 2,
    coffee: "House Blend",
    brewer: "V60",
    grinder: "Baratza Sette 270 / 22 clicks",
    dose: "22g",
    yield: "44g",
    time: "35s",
    rating: 7,
  },
]);

async function handleDelete(id: number, coffeeName: string) {
  const result = await openDeleteModal({
    itemName: coffeeName,
    itemType: "extraction",
  });

  if (result.confirmed) {
    console.log("Deleting extraction:", id);
  }
}
</script>

<template>
  <div id="extractions" class="card bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title mb-4">Extractions</h2>
      <div class="overflow-x-auto">
        <table class="table-sm table">
          <thead>
            <tr>
              <th>Coffee</th>
              <th>Brewer</th>
              <th>Grinder/Clicks</th>
              <th>Dose</th>
              <th>Yield</th>
              <th>Time</th>
              <th>Rating</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="extraction in extractions" :key="extraction.id">
              <td>{{ extraction.coffee }}</td>
              <td>{{ extraction.brewer }}</td>
              <td>{{ extraction.grinder }}</td>
              <td>{{ extraction.dose }}</td>
              <td>{{ extraction.yield }}</td>
              <td>{{ extraction.time }}</td>
              <td>
                <span class="badge badge-accent"
                  >{{ extraction.rating }}/10</span
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
                    <li><a>View</a></li>
                    <li><a>Edit</a></li>
                    <li>
                      <a
                        class="text-error"
                        @click="handleDelete(extraction.id, extraction.coffee)"
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
        <p>{{ extractions.length }} extractions logged</p>
      </div>
    </div>
  </div>
</template>
