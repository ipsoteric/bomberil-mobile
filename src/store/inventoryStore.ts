import { create } from 'zustand';
import client from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { Existencia } from '@/features/inventario/types';
import { Alert } from 'react-native';

interface InventoryState {
  currentExistencia: Existencia | null;
  existencias: Existencia[];
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchExistenciaByQR: (codigo: string) => Promise<boolean>;
  fetchExistencias: () => Promise<void>;
  clearCurrentExistencia: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  currentExistencia: null,
  existencias: [],
  isLoading: false,
  error: null,

  fetchExistenciaByQR: async (codigo) => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.get(ENDPOINTS.INVENTARIO.EXISTENCIA_BUSCAR(codigo));
      const data = response.data; 
      
      // Si la búsqueda devuelve una lista, tomamos el primero.
      // Si devuelve un objeto directo, lo usamos.
      let existencia: Existencia;
      
      if (Array.isArray(data)) {
        if (data.length === 0) throw new Error("No se encontró ninguna existencia con ese código.");
        existencia = data[0];
      } else {
        existencia = data;
      }

      set({ currentExistencia: existencia, isLoading: false });
      return true;

    } catch (error: any) {
      console.log("Error fetching existencia:", error);
      const msg = error.response?.data?.detail || error.message || "Error al buscar existencia";
      
      set({ error: msg, isLoading: false, currentExistencia: null });
      Alert.alert("Error", msg);
      return false;
    }
  },

  fetchExistencias: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.get(ENDPOINTS.INVENTARIO.EXISTENCIAS);
      // Asumiendo que la API devuelve una lista directa o paginada en results
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      set({ existencias: data, isLoading: false });
    } catch (error: any) {
      console.log("Error fetching list:", error);
      set({ error: "No se pudo cargar el inventario", isLoading: false });
    }
  },

  clearCurrentExistencia: () => set({ currentExistencia: null, error: null }),
}));