<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import ModalContainer from "@/components/modal/ModalContainer.vue";
</script>

<template>
  <div class="bg-base-200 min-h-screen">
    <Navbar />
    <main>
      <RouterView />
    </main>
    <ModalContainer />
  </div>
</template>

<style scoped></style>
