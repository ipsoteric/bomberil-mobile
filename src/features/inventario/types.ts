export interface Movimiento {
  id: number;
  fecha: string; // ISO date
  tipo: string; // "ENTRADA", "SALIDA", etc.
  usuario: string;
  origen: string;
  destino: string;
}

export interface UsoStats {
  total_horas: number;
  ultimo_uso: string | null;
  total_registros: number;
}

export interface MantenimientoStats {
  ordenes_activas_count: number;
  en_taller: boolean;
}

// Interfaz unificada basada en tu respuesta del backend (data_response)
export interface Existencia {
  tipo_existencia: 'ACTIVO' | 'LOTE'; // Backend envía esto ahora
  id: number;
  sku: string;
  codigo: string;
  nombre: string;
  marca: string;
  ubicacion: string;
  estado: string;
  estado_color: string; // "green" | "red" | "orange"
  imagen: string | null;

  // Específicos de ACTIVO
  modelo?: string;
  serie?: string;
  uso_stats?: UsoStats | null;
  mantenimiento?: MantenimientoStats | null;

  // Específicos de LOTE
  cantidad_actual?: number;
  unidad_medida?: string;
  vencimiento?: string | null;
  lote_fabricacion?: string;

  // Historial
  historial_movimientos: Movimiento[];
}