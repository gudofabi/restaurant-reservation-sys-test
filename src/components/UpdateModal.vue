<template>
  <div
    v-if="data_isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg relative">
      <h2 class="text-lg font-semibold mb-4">
        Edit {{ data_branchData.name }} branch reservation settings
      </h2>

      <!-- Branch Working Hours -->
      <div class="bg-blue-100 text-blue-700 p-2 rounded mb-4 text-sm">
        Branch working hours are {{ data_branchData.opening_from }} -
        {{ data_branchData.opening_to }}
      </div>

      <!-- Reservation Duration -->
      <label class="block text-sm font-medium mb-1">
        Reservation Duration (minutes) <span class="text-red-500">*</span>
      </label>
      <input
        v-model="data_branchData.reservation_duration"
        type="number"
        class="border border-gray-300 rounded w-full p-2 mb-4"
      />

      <!-- Table Selection -->
      <label class="block text-sm font-medium mb-1">Tables</label>
      <div class="border border-gray-300 rounded p-2 flex flex-wrap gap-2 mb-4">
        <span
          v-if="
            data_branchData.sections &&
            data_branchData.sections.length > 0 &&
            data_branchData.sections[0].tables
          "
          v-for="table in data_branchData.sections[0].tables"
          :key="table.id"
          class="px-2 py-1 bg-blue-100 text-blue-700 rounded"
        >
          {{ data_branchData.name }} - {{ table.name }}
        </span>
      </div>

      <!-- Time Slot Component for Each Day -->
      <TimeSlot
        v-for="day in daysOfWeek"
        :key="day"
        :day="day"
        :initialTimeSlots="timeSlots"
        @update="updateTimeSlots"
        @applyToAllDays="applyToAllDays"
      />

      <!-- Messages and Errors -->
      <p
        v-if="data_error"
        class="bg-red-100 text-red-700 p-2 rounded my-4 text-sm"
      >
        {{ data_error }}
      </p>
      <p
        v-if="data_message"
        class="bg-green-100 text-green-700 p-2 rounded my-4 text-sm"
      >
        {{ data_message }}
      </p>

      <!-- Footer Buttons -->
      <div class="flex justify-between items-center mt-6">
        <button
          @click="toggleReservations"
          class="text-red-500"
          :disabled="data_loading"
        >
          {{
            data_branchData.accepts_reservations
              ? "Disable Reservations"
              : "Enable Reservations"
          }}
        </button>
        <div>
          <button
            @click="closeModal"
            class="mr-2 border border-gray-300 rounded px-4 py-2"
          >
            Close
          </button>
          <button
            @click="save"
            class="bg-purple-700 text-white rounded px-4 py-2"
            :disabled="data_loading || !data_branchData.accepts_reservations"
          >
            {{ data_loading ? "Saving..." : "Save" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TimeSlot from "@/components/TimeSlot.vue";
import { ref, toRaw, watch } from "vue";
import { storeToRefs } from "pinia";
import { useBranchStore } from "@/stores/branches";

/** Store setup */
const branchStore = useBranchStore();
const { error } = storeToRefs(branchStore);

// Props and Events
const props = defineProps({
  isOpen: Boolean,
  branchData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
const emit = defineEmits(["close", "save", "disable"]);

const data_branchData = ref({ ...props.branchData });
const data_isOpen = ref(props.isOpen);
const data_error = ref("");
const data_message = ref("");
const data_loading = ref(false);

const daysOfWeek = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

// Reactive time slots from branchData
const timeSlots = ref({ ...data_branchData.value?.reservation_times });

// Watchers to handle prop updates
watch(
  () => props.isOpen,
  (value) => (data_isOpen.value = value),
  { immediate: true }
);

watch(
  () => props.branchData,
  (value) => {
    data_branchData.value = value;
    timeSlots.value = value.reservation_times || {};
  },
  { immediate: true, deep: true }
);

// Utility Functions
function resetMessages() {
  data_error.value = "";
  data_message.value = "";
}

function handleSuccess(message) {
  data_message.value = message;
  setTimeout(closeModal, 3000);
}

function handleError(err) {
  data_error.value = err.response?.data?.message || "An error occurred";
}

// Close Modal
function closeModal() {
  data_isOpen.value = false;
  resetMessages();
  emit("close", data_isOpen.value);
}

// Save Reservations
function save() {
  data_loading.value = true;
  resetMessages();

  const formattedTimeSlots = Object.fromEntries(
    Object.entries(toRaw(timeSlots.value)).map(([day, slots]) => [
      day,
      Array.isArray(slots) ? slots.map((slot) => [slot.start, slot.end]) : [],
    ])
  );

  const dataToUpdate = {
    reservation_duration: data_branchData.value.reservation_duration,
    reservation_times: formattedTimeSlots,
  };

  branchStore
    .updateBranch(data_branchData.value.id, dataToUpdate)
    .then(() => handleSuccess("Update successful!"))
    .catch(handleError)
    .finally(() => (data_loading.value = false));
}

// Enable or Disable Reservations
function toggleReservations() {
  data_loading.value = true;
  resetMessages();

  const action = data_branchData.value.accepts_reservations
    ? branchStore.disableReservation
    : branchStore.enableReservation;
  action(data_branchData.value.id)
    .then(() => handleSuccess("Reservation status updated!"))
    .catch(handleError)
    .finally(() => (data_loading.value = false));
}

// Update Time Slots
function updateTimeSlots(updatedSlots) {
  Object.assign(timeSlots, updatedSlots);
}

// Apply Time Slots to All Days
function applyToAllDays({ day, slots }) {
  daysOfWeek.forEach((d) => {
    if (d !== day) {
      timeSlots[d] = [...slots];
    }
  });
}
</script>

<style scoped>
/* Additional styling if needed */
</style>
