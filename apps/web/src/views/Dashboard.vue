<script setup lang="ts">
import EquipmentCard from "@/components/EquipmentCard.vue";
import CoffeeCard from "@/components/CoffeeCard.vue";
import ExtractionCard from "@/components/ExtractionCard.vue";
import { useModal } from "@/composables/useModal";

const { openLogExtractionModal } = useModal();

async function handleLogExtraction() {
  const result = await openLogExtractionModal();

  if (result?.extraction) {
    console.log("Saving extraction:", result.extraction);
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 pb-24">
    <div class="mb-8">
      <h1 class="mb-2 text-4xl font-bold">Dashboard</h1>
      <p class="text-base-content/60">
        Manage your equipment, coffee inventory, and brewing logs
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ExtractionCard class="lg:col-span-2" />
      <EquipmentCard />
      <CoffeeCard />
    </div>

    <button
      class="btn btn-primary btn-lg fixed right-8 bottom-8 z-50 gap-2 shadow-lg"
      @click="handleLogExtraction"
    >
      <span class="text-xl">+</span>
      <span>Log Extraction</span>
    </button>
  </div>
</template>
