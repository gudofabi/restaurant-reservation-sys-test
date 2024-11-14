<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useBranchStore } from "@/stores/branches";

/** Components */
import CreateModal from "@/components/CreateModal.vue";
import UpdateModal from "@/components/UpdateModal.vue";

/** Branch Store */
const branchStore = useBranchStore();
const { branches, error } = storeToRefs(branchStore);

const showCreateModal = ref(false);
const isUpdateModalOpen = ref(false);
const selectedBranchData = ref<any>({});

/** Fetch branches on component mount */
onMounted(() => {
  branchStore.fetchBranches();
});

/** Toggle Create Modal */
function toggleCreateModal() {
  showCreateModal.value = !showCreateModal.value;
}

/** Close Create Modal */
function closeCreateModal(value: boolean) {
  showCreateModal.value = value;
}

/** Close Update Modal */
function closeUpdateModal(value: boolean) {
  isUpdateModalOpen.value = value;
  selectedBranchData.value = {}; // Reset branch data on close
}

/** Handle branch selection for updating */
function selectBranchForUpdate(branch: any) {
  isUpdateModalOpen.value = true;

  // Transform reservation_times to match the expected format
  const formattedReservationTimes = branch?.reservation_times
    ? Object.fromEntries(
        Object.entries(branch.reservation_times).map(([day, slots]) => [
          day.toLowerCase(),
          slots.map((slot: string[]) => ({ start: slot[0], end: slot[1] })),
        ])
      )
    : {
        saturday: [],
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
      };

  // Set selected branch data
  selectedBranchData.value = {
    ...branch,
    reservation_times: formattedReservationTimes,
  };
}
</script>

<template>
  <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
    <div class="p-4 flex justify-end bg-white">
      <button
        @click="toggleCreateModal"
        class="bg-white text-gray-700 px-4 py-2 rounded shadow border-gray-500"
      >
        Add Branches
      </button>
      <CreateModal :show="showCreateModal" @close="closeCreateModal" />
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
        <tr v-if="branches.length === 0">
          <td colspan="4" class="p-6 text-center">No Available Branch.</td>
        </tr>
        <tr
          v-else
          v-for="branch in branches"
          :key="branch.id"
          @click="selectBranchForUpdate(branch)"
          class="bg-white border-b cursor-pointer"
        >
          <td class="py-4 px-6">{{ branch.name }}</td>
          <td class="py-4 px-6">{{ branch.reference }}</td>
          <td class="py-4 px-6">
            {{ branchStore.countReservableTables(branch) }}
          </td>
          <td class="py-4 px-6">{{ branch.reservation_duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <UpdateModal
    :isOpen="isUpdateModalOpen"
    :branchData="selectedBranchData"
    @close="closeUpdateModal"
  />
</template>

<style scoped>
/* Add additional styling if needed */
</style>
