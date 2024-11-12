<template>
  <div
    v-if="data_showModal"
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
  >
    <div class="bg-white p-6 rounded-lg w-full max-w-[400px] mx-auto">
      <h2 class="text-lg font-semibold mb-4">Add Branches</h2>
      <div class="mb-6">
        <label for="branch" class="block text-sm font-medium text-gray-700 mb-1"
          >Branches</label
        >
        <select
          id="branch"
          class="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option>branch 2 (B02)</option>
          <!-- Dynamically list other options here -->
        </select>
      </div>
      <div class="flex justify-end space-x-4">
        <button
          @click="func_close"
          class="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Close
        </button>
        <button
          class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
}>();

const emits = defineEmits<{
  (e: "close", value: boolean): void;
}>();

const data_showModal = ref(props.show);

watch(
  () => props.show,
  (value) => {
    data_showModal.value = value;
  },
  { immediate: true, deep: true }
);

const func_close = () => {
  data_showModal.value = false;

  emits("close", data_showModal.value);
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
