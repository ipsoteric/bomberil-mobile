import { create } from 'zustand';
import client from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { Existencia } from '@/features/inventario/types';
import { Alert } from 'react-native';

interface InventoryState {
  currentExistencia: Existencia | null;
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchExistenciaByQR: (codigo: string) => Promise<boolean>;
  clearCurrentExistencia: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  currentExistencia: null,
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

  clearCurrentExistencia: () => set({ currentExistencia: null, error: null }),
}));