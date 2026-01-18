<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <div class="bg-base-200 min-h-screen">
    <Navbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
