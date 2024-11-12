<script setup lang="ts"></script>

<template>
  <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
    <div class="p-4 flex justify-end bg-white">
      <button
        @click="data_showCreateModal = !data_showCreateModal"
        @close="func_closeCreate"
        class="bg-white text-gray-700 px-4 py-2 rounded shadow border-gray-500"
      >
        Add Branches
      </button>
      <CreateModal :show="data_showCreateModal" />
    </div>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="py-3 px-6">Branch</th>
          <th scope="col" class="py-3 px-6">Reference</th>
          <th scope="col" class="py-3 px-6">Number of Tables</th>
          <th scope="col" class="py-3 px-6">Reservation Duration</th>
        </tr>
      </thead>

      <tbody>
        <tr
          @click="func_selectedBranch(data)"
          class="bg-white border-b"
          v-for="data in branches"
          :key="data.id"
        >
          <td class="py-4 px-6">{{ data.name }}</td>
          <td class="py-4 px-6">{{ data.reference }}</td>
          <td class="py-4 px-6">
            {{ branchStore.countReservableTables(data) }}
          </td>
          <td class="py-4 px-6">{{ data.reservation_duration }}</td>
        </tr>
        <!-- Repeat for other branches -->
      </tbody>
    </table>
  </div>
  <UpdateModal
    :isOpen="data_isUpdateModalOpen"
    :branchData="data_updateBranchData"
    @close="data_isUpdateModalOpen = false"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useBranchStore } from "@/stores/branches";

/** Component */
import CreateModal from "@/components/CreateModal.vue";
import UpdateModal from "@/components/UpdateModal.vue";

/** Article Store */
const branchStore = useBranchStore();
const { branches, error } = storeToRefs(branchStore);

const data_showCreateModal = ref(false);
const data_isUpdateModalOpen = ref(false);
const data_updateBranchData = ref({});

onMounted(() => {
  branchStore.fetchBranches();
});

const func_closeCreate = (value) => {
  console.log(value);
  data_showCreateModal.value = value;
};

const func_selectedBranch = (branch: any) => {
  data_isUpdateModalOpen.value = true;
  data_updateBranchData.value = branch;
};
</script>
