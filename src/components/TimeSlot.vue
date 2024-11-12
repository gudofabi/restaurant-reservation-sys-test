<template>
  <div class="time-slot-component">
    <label class="block text-sm font-medium mb-1">{{ day }}</label>
    <div class="flex items-center gap-2 flex-wrap">
      <!-- Display each time slot -->
      <div
        v-for="(slot, index) in timeSlots[day]"
        :key="index"
        class="flex items-center gap-2 border border-gray-300 rounded p-2"
      >
        <input
          v-model="slot.start"
          type="time"
          class="border-none focus:ring-0 outline-none w-20"
          placeholder="Start time"
        />
        <span>-</span>
        <input
          v-model="slot.end"
          type="time"
          class="border-none focus:ring-0 outline-none w-20"
          placeholder="End time"
        />
        <button
          @click="removeTimeSlot(day, index)"
          class="text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
      </div>

      <!-- Placeholder text if no slots are available -->
      <div
        v-if="timeSlots[day].length === 0"
        class="flex-1 border border-gray-300 rounded p-2 text-gray-500 text-center"
      >
        Add Available Reservation Times
      </div>

      <!-- Add time slot button, hidden if 3 slots are added -->
      <button
        v-if="timeSlots[day].length < 3"
        @click="addTimeSlot(day)"
        class="text-gray-500 hover:text-gray-700 text-xl"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, computed } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  day: String,
  initialTimeSlots: {
    type: Object,
    default: () => ({
      Saturday: [],
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    }),
  },
});

const emit = defineEmits(["update", "applyToAllDays"]);

// Reactive state for time slots
const timeSlots = reactive({ ...props.initialTimeSlots });

// Method to add a time slot, up to a limit of 3 slots
function addTimeSlot(day) {
  if (timeSlots[day].length < 3) {
    timeSlots[day].push({ start: "00:00", end: "00:00" });
    emit("update", timeSlots);
  }
}

// Method to remove a time slot by index
function removeTimeSlot(day, index) {
  timeSlots[day].splice(index, 1);
  emit("update", timeSlots);
}

// Method to apply the slots of one day to all days
function applySlotsToAllDays(day) {
  const slotsToApply = [...timeSlots[day]];
  emit("applyToAllDays", { day, slots: slotsToApply });
}
</script>

<style scoped>
/* Custom styles */
.time-slot-component .time-input {
  width: 60px;
}
</style>
