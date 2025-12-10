export type TipoExistencia = 'ACTIVO' | 'LOTE_INSUMO';

// Basado en las reglas de negocio: Ubicaciones pueden ser Vehículos o Áreas
export interface Ubicacion {
  id: number;
  nombre: string;
  tipo: 'AREA' | 'VEHICULO' | 'ADMINISTRATIVA';
}

export interface ProductoCatalogo {
  sku: string;
  nombre: string;
  es_serializado: boolean; // Define si es Activo
  es_fungible: boolean;    // Define si es Lote
  unidad_medida?: string;
}

export interface Existencia {
  id: number;
  tipo: TipoExistencia;
  codigo_qr: string; // El identificador que vendrá en el QR
  producto: ProductoCatalogo;
  ubicacion_actual: Ubicacion;
  estado: string; // DISPONIBLE, EN_PRESTAMO, etc.
  
  // Datos específicos de ACTIVO (Serializado)
  numero_serie?: string;
  marca?: string;
  modelo?: string;
  
  // Datos específicos de LOTE (Fungible)
  cantidad_actual?: number;
  fecha_vencimiento?: string; // ISO Date
  lote_fabricacion?: string;
}