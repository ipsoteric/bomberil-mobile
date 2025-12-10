import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useInventoryStore } from '@/store/inventoryStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'DetalleExistencia'>;

export default function ExistenciaDetailScreen({ navigation }: Props) {
  const { currentExistencia, isLoading, clearCurrentExistencia } = useInventoryStore();

  useEffect(() => {
    // Limpiamos la existencia al salir de la pantalla
    return () => clearCurrentExistencia();
  }, []);

  if (isLoading || !currentExistencia) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#b91c1c" />
      </View>
    );
  }

  const isLote = currentExistencia.tipo === 'LOTE_INSUMO';

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold ml-4 text-gray-800">Ficha de Existencia</Text>
        </View>

        <ScrollView className="p-5">
          {/* Card Identidad */}
          <View className="bg-white p-5 rounded-2xl shadow-sm mb-4 border-l-4 border-bomberil-700">
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
              {currentExistencia.tipo.replace('_', ' ')}
            </Text>
            <Text className="text-2xl font-extrabold text-gray-900 mb-2">
              {currentExistencia.producto.nombre}
            </Text>
            <View className="flex-row">
              <View className="bg-gray-100 px-3 py-1 rounded-lg">
                <Text className="text-xs font-bold text-gray-700">{currentExistencia.estado}</Text>
              </View>
            </View>
          </View>

          {/* Detalles Técnicos */}
          <View className="bg-white p-5 rounded-2xl shadow-sm mb-6">
            <View className="space-y-4">
              <DetailItem icon="map-pin" label="Ubicación Actual" value={currentExistencia.ubicacion_actual.nombre} />
              <DetailItem icon="maximize" label="Código QR" value={currentExistencia.codigo_qr} />
              
              {!isLote ? (
                <>
                  <DetailItem icon="tag" label="Marca" value={currentExistencia.marca || '-'} />
                  <DetailItem icon="hash" label="N° Serie" value={currentExistencia.numero_serie || '-'} />
                </>
              ) : (
                <>
                  <DetailItem icon="box" label="Lote Fabricación" value={currentExistencia.lote_fabricacion || '-'} />
                  <DetailItem icon="calendar" label="Vencimiento" value={currentExistencia.fecha_vencimiento || '-'} />
                  <View className="mt-2 pt-4 border-t border-gray-100">
                    <Text className="text-gray-500 text-xs">Stock Disponible</Text>
                    <Text className="text-3xl font-bold text-bomberil-700">
                      {currentExistencia.cantidad_actual} <Text className="text-base text-gray-400">{currentExistencia.producto.unidad_medida}</Text>
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const DetailItem = ({ icon, label, value }: { icon: keyof typeof Feather.glyphMap, label: string, value: string }) => (
  <View className="flex-row items-center mb-3">
    <Feather name={icon} size={18} color="#9ca3af" style={{ width: 24 }} />
    <View>
      <Text className="text-gray-400 text-xs">{label}</Text>
      <Text className="text-gray-800 font-medium">{value}</Text>
    </View>
  </View>
);