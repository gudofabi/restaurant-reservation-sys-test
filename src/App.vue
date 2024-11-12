<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <main>
    <div class="bg-gray-100 h-svh">
      <div class="w-full shadow-lg py-4 bg-white">
        <div class="container mx-auto">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-semibold">Reservations</h1>
            <button class="bg-purple-600 text-white px-4 py-2 rounded shadow">
              Disable Reservations
            </button>
          </div>
        </div>
      </div>

      <div class="container mx-auto mt-20">
        <RouterView />
      </div>
    </div>
  </main>
</template>

<style scoped></style>
