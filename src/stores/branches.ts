import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

// Define interfaces for better type safety
interface Table {
  id: string;
  name: string;
  accepts_reservations: boolean;
}

interface Section {
  id: string;
  name: string;
  tables: Table[];
}

interface Branch {
  id: string;
  name: string;
  reference: string;
  accepts_reservations: boolean;
  reservation_duration: number;
  sections: Section[];
}

export const useBranchStore = defineStore('branchStore', () => {
  // State
  const branches = ref<Branch[]>([]);
  const error = ref<string | null>(null);

  // API setup
  const API_URL = '/api/';

  // Axios instance
  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`
    }
  });

  // Actions
  async function fetchBranches() {
    try {
      const response = await apiClient.get('branches', {
        params: {
          'include[0]': 'sections',
          'include[1]': 'sections.tables'
        }
      });
      branches.value = response.data.data.filter((branch: Branch) => branch.accepts_reservations === true);
      error.value = null; // Clear error on success
    } catch (err) {
      console.error('Error fetching branches:', err);
      error.value = 'Failed to fetch branches. Please try again later.';
    }
  }

  async function updateBranch(branchId: string, updates: Partial<Branch>) {
    try {
      await apiClient.put(`branches/${branchId}`, updates);
      const index = branches.value.findIndex(branch => branch.id === branchId);
      if (index !== -1) {
        branches.value[index] = { ...branches.value[index], ...updates };
      }
      error.value = null;
    } catch (err) {
      console.error('Error updating branch:', err);
      error.value = 'Failed to update branch. Please try again later.';
    }
  }

  async function enableReservation(branchId: string) {
    await updateBranch(branchId, { accepts_reservations: true });
  }

  async function disableReservation(branchId: string) {
    await updateBranch(branchId, { accepts_reservations: false });
  }

  // Getters
  const getBranchById = (id: string) => branches.value.find((branch) => branch.id === id);

  const countReservableTables = (branch: Branch) => {
    if (!branch?.sections) return 0; // Return 0 if sections is undefined or missing
    return branch.sections.reduce((total, section) => {
        return total + (section.tables ? section.tables.filter(table => table.accepts_reservations).length : 0);
    }, 0);
  }

  return {
    branches,
    error,
    fetchBranches,
    updateBranch,
    enableReservation,
    disableReservation,
    getBranchById,
    countReservableTables
  };
});
