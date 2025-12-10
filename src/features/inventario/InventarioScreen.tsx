import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'InventarioHome'>;

export default function InventarioScreen({ navigation }: Props) {
  
  const handleScanPress = () => {
    navigation.navigate('ScannerInventario');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <SafeAreaView className="flex-1 px-6 pt-4">
        
        {/* Header Simple */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Inventario</Text>
          <View style={{ width: 40 }} /> 
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* ACCIÓN PRINCIPAL: ESCANER */}
          <View className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 items-center mb-8">
            <View className="bg-red-50 p-4 rounded-full mb-4">
              <Feather name="maximize" size={40} color="#b91c1c" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center mb-2">
              Escanear Existencia
            </Text>
            <Text className="text-gray-500 text-center text-sm mb-6 px-4">
              Apunta al código QR del activo o lote para ver su hoja de vida y gestionar movimientos.
            </Text>
            
            <TouchableOpacity 
              onPress={handleScanPress}
              className="bg-bomberil-700 w-full py-4 rounded-xl flex-row justify-center items-center shadow-md"
              activeOpacity={0.8}
            >
              <Feather name="camera" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">Abrir Escáner</Text>
            </TouchableOpacity>
          </View>

          {/* ACCIONES SECUNDARIAS */}
          <Text className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-3 ml-1">
            Otras Operaciones
          </Text>

          <View className="flex-row justify-between mb-4">
            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-[48%] items-center">
              <Feather name="search" size={24} color="#4b5563" />
              <Text className="text-gray-700 font-bold mt-2">Buscar Manual</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-[48%] items-center">
              <Feather name="list" size={24} color="#4b5563" />
              <Text className="text-gray-700 font-bold mt-2">Catálogo Local</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}