import { create } from 'zustand';
import client from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { Existencia, ProductoStock, RecepcionPayload } from '@/features/inventario/types';
import { Alert } from 'react-native';

interface InventoryState {
  currentExistencia: Existencia | null;
  catalogo: ProductoStock[];
  existenciasProducto: [],
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchExistenciaByQR: (codigo: string) => Promise<boolean>;
  fetchCatalogo: (search?: string) => Promise<void>;
  fetchExistenciasPorProducto: (productoId: number) => Promise<void>;
  recepcionarStock: (payload: RecepcionPayload) => Promise<boolean>;
  clearCurrentExistencia: () => void;
  clearExistenciasProducto: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  currentExistencia: null,
  catalogo: [],
  existenciasProducto: [],
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

  // Acción conectada al endpoint agrupado
  fetchCatalogo: async (search = '') => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.get(ENDPOINTS.INVENTARIO.CATALOGO_STOCK(search));
      // El backend devuelve una lista directa: [ {id, nombre...}, ... ]
      set({ catalogo: response.data, isLoading: false });
    } catch (error: any) {
      console.log("Error fetching catalog:", error);
      set({ error: "No se pudo cargar el catálogo", isLoading: false });
    }
  },

  fetchExistenciasPorProducto: async (productoId: number) => {
    set({ isLoading: true, error: null, existenciasProducto: [] }); // Limpiamos antes de cargar
    try {
      const response = await client.get(ENDPOINTS.INVENTARIO.EXISTENCIAS_POR_PRODUCTO(productoId));
      // Asumimos paginación estándar de DRF o lista directa
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      set({ existenciasProducto: data, isLoading: false });
    } catch (error: any) {
      console.log("Error fetching items by product:", error);
      set({ error: "No se pudieron cargar las existencias.", isLoading: false });
    }
  },

  recepcionarStock: async (payload: RecepcionPayload) => {
    set({ isLoading: true, error: null });
    try {
      // POST al endpoint transaccional
      await client.post(ENDPOINTS.INVENTARIO.RECEPCION_STOCK, payload);
      
      // Si todo sale bien
      set({ isLoading: false });
      return true;
      
    } catch (error: any) {
      console.log("Error en recepción:", error);
      // Extraemos el mensaje de error útil del backend (ej: "Falta proveedor_id")
      const msg = error.response?.data?.detail || error.message || "Error al procesar la recepción.";
      
      set({ error: msg, isLoading: false });
      Alert.alert("Error de Recepción", msg);
      return false;
    }
  },

  clearCurrentExistencia: () => set({ currentExistencia: null, error: null }),
  clearExistenciasProducto: () => set({ existenciasProducto: [], error: null }),
}));