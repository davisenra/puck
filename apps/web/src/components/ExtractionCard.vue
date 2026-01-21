<script setup lang="ts">
import { ref } from "vue";
import { useModal } from "@/composables/useModal";

const { openManageExtractionModal } = useModal();

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

async function handleView(extraction: (typeof extractions.value)[0]) {
  const result = await openManageExtractionModal({ extraction });
  if (result.deleted) {
    console.log("Deleting extraction:", extraction.id);
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
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="extraction in extractions"
              :key="extraction.id"
              class="hover:bg-base-200 cursor-pointer"
              @click="handleView(extraction)"
            >
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
