<script setup lang="ts">
import { useModal } from "@/composables/useModal";
import {
  usePaginatedExtractions,
  useCreateExtraction,
  useUpdateExtraction,
  useDeleteExtraction,
} from "@/api/useExtractions";
import type { Extraction } from "@/types";

const { openManageExtractionModal } = useModal();

const {
  data: extractions,
  meta,
  isLoading,
  error,
  prevPage,
  nextPage,
} = usePaginatedExtractions(1, 25);

const updateExtraction = useUpdateExtraction();
const deleteExtraction = useDeleteExtraction();

async function handleView(item: Extraction) {
  const result = await openManageExtractionModal({ extractionId: item.id });
  if (result?.deleted) {
    deleteExtraction.mutate(item.id, {
      onError: (error) => console.error("Failed to delete extraction:", error),
    });
  } else if (result?.updated) {
    updateExtraction.mutate(
      { id: item.id, data: result.updated },
      {
        onError: (error) =>
          console.error("Failed to update extraction:", error),
      },
    );
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`;
}

function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
</script>

<template>
  <div id="extractions" class="card bg-base-100 shadow">
    <div class="card-body">
      <div v-if="isLoading" class="py-8 text-center">
        <span class="loading loading-spinner loading-md"></span>
        <p class="mt-2">Loading extractions...</p>
      </div>

      <div v-else-if="error" class="py-8 text-center">
        <p class="text-error">Failed to load extractions</p>
      </div>

      <div v-else-if="!extractions?.data?.length" class="py-8 text-center">
        <p class="text-base-content/50">No extractions found</p>
      </div>

      <div v-else class="overflow-x-auto">
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
              v-for="extraction in extractions.data"
              :key="extraction.id"
              class="hover:bg-base-200 cursor-pointer"
              @click="handleView(extraction)"
            >
              <td>{{ extraction.coffee.name }}</td>
              <td>{{ extraction.brewer.name }}</td>
              <td>
                {{
                  extraction.grinder
                    ? `${extraction.grinder.name}${extraction.grindSetting ? ` / ${extraction.grindSetting}` : ""}`
                    : "-"
                }}
              </td>
              <td>{{ extraction.dose }}g</td>
              <td>{{ extraction.yield }}g</td>
              <td>{{ formatTime(extraction.brewTime) }}</td>
              <td>
                <span class="text-orange-400">{{
                  renderStars(extraction.rating)
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="extractions?.data?.length && meta"
        class="mt-4 flex items-center justify-between"
      >
        <div class="text-base-content/50 text-sm">
          <span>{{ meta.total }} extractions</span>
          <span v-if="meta.totalPages > 1" class="ml-2">
            | Page {{ meta.page }} of {{ meta.totalPages }}
          </span>
        </div>
        <div v-if="meta.totalPages > 1" class="join">
          <button
            class="btn btn-sm join-item"
            :disabled="meta.page === 1"
            @click.stop="prevPage"
          >
            Previous
          </button>
          <button
            class="btn btn-sm join-item"
            :disabled="meta.page === meta.totalPages"
            @click.stop="nextPage"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
