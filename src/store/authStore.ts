import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { tokenStorage } from '@/utils/storage';
import client from '@/api/client';

// 1. Definimos la estructura del JWT (Payload)
// Modifica esto según lo que tu backend Django ponga dentro del token.
interface UserData {
  user_id: number;
  email: string;
  exp?: number; // Tiempo de expiración unix timestamp
}

// 2. Definimos la interfaz del Store (Los tipos de datos)
interface AuthState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  userPermissions: string[]; // Lista de permisos (ej: ['accion_ver_inventario'])
  isLoading: boolean;
  signIn: (token: string, permissions: string[]) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  userPermissions: [],
  isLoading: true,

  // --- ACCIÓN: INICIAR SESIÓN ---
  signIn: async (token, permissions) => {
    // 1. Guardamos el token en disco (SecureStore)
    await tokenStorage.setToken(token);

    // 2. Decodificamos el usuario del token
    // El try-catch evita que la app explote si el token viene corrupto
    try {
      const user = jwtDecode<UserData>(token);
      set({ token, user, isAuthenticated: true, userPermissions: permissions });
    } catch (error) {
      console.error("Error al decodificar token en login:", error);
      // Si falla, no autenticamos
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  // --- ACCIÓN: CERRAR SESIÓN ---
  signOut: async () => {
    await tokenStorage.removeToken();
    set({ token: null, user: null, isAuthenticated: false, userPermissions: [] });
  },

  // --- HELPER: VERIFICAR PERMISOS ---
  hasPermission: (perm: string) => {
    const { userPermissions } = get();
    // Retorna true si el permiso está en la lista
    return userPermissions.includes(perm);
  },

  // --- ACCIÓN: RESTAURAR SESIÓN (Al abrir la App) ---
  restoreSession: async () => {
    try {
      const token = await tokenStorage.getToken();
      
      // CASO 1: No hay token guardado
      if (!token) {
        // Importante: No hacemos nada más, pero DEJAMOS de cargar
        set({ token: null, isAuthenticated: false, isLoading: false }); 
        return;
      }

      // CASO 2: Hay token, verificamos expiración
      const user = jwtDecode<UserData>(token);
      const isExpired = user.exp ? (Date.now() / 1000) > user.exp : false;

      if (isExpired) {
        await get().signOut();
        set({ isLoading: false });
        return;
      }

      // CASO 3: Token válido
      // Simulamos permisos o los cargamos de API
      const fakePermissions = ['accion_ver_inventario']; 
      set({ token, user, isAuthenticated: true, userPermissions: fakePermissions, isLoading: false });

    } catch (e) {
      console.error('Error restaurando sesión:', e);
      // Si algo falla, asumimos logout para no bloquear la app
      set({ token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));