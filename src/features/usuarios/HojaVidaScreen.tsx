import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useUsersStore } from '@/store/usersStore';

export default function HojaVidaScreen() {
  const { selectedHojaVida, isLoading } = useUsersStore();

  if (isLoading && !selectedHojaVida) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!selectedHojaVida) return null;

  const { perfil, institucional, historial } = selectedHojaVida;

  const SectionTitle = ({ icon, title }: { icon: any, title: string }) => (
    <View className="flex-row items-center mb-3 mt-2">
        <Feather name={icon} size={18} color="#4b5563" />
        <Text className="ml-2 font-bold text-gray-700 uppercase text-xs tracking-wider">{title}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4" showsVerticalScrollIndicator={false}>
      
      {/* 1. RESUMEN INSTITUCIONAL */}
      <View className="bg-white p-5 rounded-xl shadow-sm mb-4 border-l-4 border-blue-600">
         <Text className="text-xl font-bold text-gray-900">{perfil.nombre_completo}</Text>
         <Text className="text-gray-500 text-sm mb-4">{perfil.rut}</Text>

         <View className="flex-row justify-between flex-wrap">
            <View className="w-[48%] mb-3">
                <Text className="text-xs text-gray-400 uppercase">N° Registro</Text>
                <Text className="font-bold text-gray-800">{institucional.numero_registro || 'N/A'}</Text>
            </View>
            <View className="w-[48%] mb-3">
                <Text className="text-xs text-gray-400 uppercase">Fecha Ingreso</Text>
                <Text className="font-bold text-gray-800">{institucional.fecha_ingreso || 'N/A'}</Text>
            </View>
            <View className="w-[48%]">
                <Text className="text-xs text-gray-400 uppercase">Estado</Text>
                <Text className="font-bold text-gray-800">{institucional.estado_membresia}</Text>
            </View>
            <View className="w-[48%]">
                <Text className="text-xs text-gray-400 uppercase">Cargo Actual</Text>
                <Text className="font-bold text-blue-700">{institucional.cargo_actual}</Text>
            </View>
         </View>
      </View>

      {/* 2. DATOS PERSONALES */}
      <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
         <SectionTitle icon="user" title="Datos Personales" />
         <View className="border-t border-gray-100 pt-3">
            <Text className="text-gray-600 mb-1"><Text className="font-bold">Profesión:</Text> {perfil.profesion}</Text>
            <Text className="text-gray-600 mb-1"><Text className="font-bold">Estado Civil:</Text> {perfil.estado_civil}</Text>
            <Text className="text-gray-600 mb-1"><Text className="font-bold">Nacionalidad:</Text> {perfil.nacionalidad}</Text>
            <Text className="text-gray-600"><Text className="font-bold">Género:</Text> {perfil.genero}</Text>
         </View>
      </View>

      {/* 3. HISTORIAL DE CARGOS */}
      <SectionTitle icon="briefcase" title="Historial de Cargos" />
      {historial.cargos.length === 0 ? (
          <Text className="text-gray-400 text-center italic mb-4">Sin registros.</Text>
      ) : (
          historial.cargos.map((cargo, index) => (
            <View key={index} className="bg-white p-4 rounded-xl shadow-sm mb-2 flex-row border-l-4 border-gray-300">
                <View className="flex-1">
                    <Text className="font-bold text-gray-800">{cargo.cargo}</Text>
                    <Text className="text-xs text-gray-500">{cargo.ambito}</Text>
                </View>
                <View className="items-end">
                    <Text className="text-xs font-bold text-gray-600">{cargo.inicio}</Text>
                    <Text className="text-xs text-gray-400">{cargo.fin || 'Actualidad'}</Text>
                </View>
            </View>
          ))
      )}

      {/* 4. RECONOCIMIENTOS Y PREMIOS */}
      {historial.premios.length > 0 && (
          <>
            <SectionTitle icon="award" title="Reconocimientos" />
            {historial.premios.map((item, index) => (
                <View key={index} className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-2 flex-row items-center">
                    <Feather name="star" size={20} color="#d97706" />
                    <View className="ml-3 flex-1">
                        <Text className="font-bold text-yellow-900">{item.nombre}</Text>
                        <Text className="text-xs text-yellow-700">{item.fecha} • {item.motivo}</Text>
                    </View>
                </View>
            ))}
          </>
      )}

      {/* 5. SANCIONES */}
      {historial.sanciones.length > 0 && (
          <>
            <SectionTitle icon="alert-triangle" title="Historial Disciplinario" />
            {historial.sanciones.map((item, index) => (
                <View key={index} className="bg-red-50 p-4 rounded-xl border border-red-100 mb-2 flex-row items-center">
                    <Feather name="slash" size={20} color="#b91c1c" />
                    <View className="ml-3 flex-1">
                        <Text className="font-bold text-red-900">{item.tipo}</Text>
                        <Text className="text-xs text-red-700">{item.fecha} • {item.motivo}</Text>
                    </View>
                </View>
            ))}
          </>
      )}

      <View className="h-10" />
    </ScrollView>
  );
}