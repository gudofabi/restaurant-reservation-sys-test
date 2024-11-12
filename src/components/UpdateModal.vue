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
          v-if="data_branchData.sections[0]"
          v-for="table in data_branchData.sections[0].tables"
          :key="table.id"
          class="px-2 py-1 bg-blue-100 text-blue-700 rounded"
        >
          {{ table.section }} - {{ table.name }}
        </span>
      </div>

      <TimeSlot
        v-for="day in daysOfWeek"
        :key="day"
        :day="day"
        :initialTimeSlots="timeSlots"
        @update="updateTimeSlots"
        @applyToAllDays="applyToAllDays"
      />

      <!-- Footer Buttons -->
      <div class="flex justify-between items-center mt-6">
        <button @click="disableReservations" class="text-red-500">
          Disable Reservations
        </button>
        <div>
          <button
            @click="close"
            class="mr-2 border border-gray-300 rounded px-4 py-2"
          >
            Close
          </button>
          <button
            @click="save"
            class="bg-purple-700 text-white rounded px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TimeSlot from "@/components/TimeSlot.vue";
import { ref, reactive, toRefs, watch } from "vue";

// Props
const props = defineProps({
  isOpen: Boolean,
  branchData: {
    type: Object,
    required: true,
    default: () => {},
  },
});
const emit = defineEmits(["close", "save", "disable"]);

const data_branchData = ref(props.brachData);
const data_isOpen = ref(props.isOpen);

const daysOfWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

// Initial time slots for each day
const timeSlots = reactive({
  Saturday: [],
  Sunday: [],
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
});

watch(
  () => props.isOpen,
  (value) => {
    data_isOpen.value = value;
  },
  { immediate: true, deep: true }
);

watch(
  () => props.branchData,
  (value) => {
    data_branchData.value = value;
  },
  { immediate: true, deep: true }
);

// Methods
function close() {
  emit("close");
}

function save() {
  const dataToUpdate = { ...data_branchData.value };
  console.log(dataToUpdate);
  emit("save", dataToUpdate);
}

function disableReservations() {
  emit("disable");
}

// Update time slots when a slot is added or removed
function updateTimeSlots(updatedSlots) {
  Object.assign(timeSlots, updatedSlots);
}

// Apply time slots from one day to all days
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
