import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useInventoryStore } from '@/store/inventoryStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/types';
import { Existencia } from './types';

type Props = NativeStackScreenProps<AppStackParamList, 'CatalogoLocal'>;

export default function CatalogoLocalScreen({ navigation }: Props) {
  const { existencias, isLoading, fetchExistencias } = useInventoryStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchExistencias();
  }, []);

  // Filtrado local para búsqueda rápida
  const filteredData = existencias.filter(item => 
    item.producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
    item.codigo_qr.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Existencia }) => (
    <TouchableOpacity 
      className="bg-white p-4 mb-3 rounded-xl border border-gray-100 shadow-sm flex-row items-center"
      onPress={() => navigation.navigate('DetalleExistencia', { sku: item.codigo_qr })}
    >
      <View className={`p-3 rounded-full mr-4 ${item.tipo === 'ACTIVO' ? 'bg-blue-50' : 'bg-orange-50'}`}>
        <Feather name={item.tipo === 'ACTIVO' ? 'tag' : 'box'} size={20} color={item.tipo === 'ACTIVO' ? '#2563eb' : '#ea580c'} />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-gray-800 text-base" numberOfLines={1}>{item.producto.nombre}</Text>
        <Text className="text-gray-500 text-xs mt-1">{item.ubicacion_actual.nombre} • {item.estado}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 px-4 pt-2">
        
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 ml-2">Catálogo Local</Text>
        </View>

        {/* Buscador */}
        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
          <Feather name="search" size={20} color="#9ca3af" />
          <TextInput 
            className="flex-1 ml-3 text-gray-800"
            placeholder="Buscar por nombre o código..."
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Lista */}
        {isLoading && existencias.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#b91c1c" />
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Text className="text-gray-400">No se encontraron resultados</Text>
              </View>
            }
            refreshing={isLoading}
            onRefresh={fetchExistencias}
          />
        )}
      </SafeAreaView>
    </View>
  );
}