import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useUsersStore } from '@/store/usersStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'UsuarioDetalle'>;

export default function UsuarioDetalleScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const { selectedUsuario, isLoading, fetchUsuarioDetalle, fetchFichaMedica } = useUsersStore();

  useEffect(() => {
    fetchUsuarioDetalle(id);
  }, [id]);

  const handleVerFicha = async () => {
    // Verificamos permisos intentando cargar la ficha
    const success = await fetchFichaMedica(id);
    if (success) {
        // 
        Alert.alert("Próximamente", "Pantalla de Ficha Médica en Commit 41");
        // navigation.navigate('FichaMedica', { id }); 
    }
  };

  const handleVerHojaVida = () => {
      // 
      Alert.alert("Próximamente", "Pantalla de Hoja de Vida en Commit 41");
      // navigation.navigate('HojaVida', { id });
  };

  if (isLoading && !selectedUsuario) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#b91c1c" />
      </View>
    );
  }

  if (!selectedUsuario) return null;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER GRANDE CON FOTO */}
        <View className="bg-white pb-6 rounded-b-3xl shadow-sm">
            <SafeAreaView>
                <View className="px-4 py-2 flex-row justify-between items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-100 rounded-full">
                        <Feather name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="font-bold text-gray-400 text-xs">PERFIL DE USUARIO</Text>
                    <View style={{width: 40}} />
                </View>

                <View className="items-center mt-4">
                    <View className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white shadow-sm mb-3 overflow-hidden">
                        {selectedUsuario.avatar_url ? (
                            <Image source={{ uri: selectedUsuario.avatar_url }} className="w-full h-full" />
                        ) : (
                            <View className="w-full h-full items-center justify-center bg-gray-300">
                                <Feather name="user" size={40} color="white" />
                            </View>
                        )}
                    </View>
                    <Text className="text-xl font-bold text-gray-900 text-center px-6">
                        {selectedUsuario.nombre_completo}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">{selectedUsuario.roles_display}</Text>
                    
                    <View className={`mt-3 px-3 py-1 rounded-full ${selectedUsuario.estado_codigo === 'AC' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Text className={`text-xs font-bold ${selectedUsuario.estado_codigo === 'AC' ? 'text-green-800' : 'text-red-800'}`}>
                            {selectedUsuario.estado}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>

        {/* INFO BÁSICA */}
        <View className="p-4">
            <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
                <Text className="text-xs font-bold text-gray-400 uppercase mb-3">Información de Contacto</Text>
                
                <View className="flex-row items-center mb-3">
                    <Feather name="mail" size={18} color="#6b7280" />
                    <Text className="ml-3 text-gray-700">{selectedUsuario.email}</Text>
                </View>
                <View className="flex-row items-center mb-3">
                    <Feather name="phone" size={18} color="#6b7280" />
                    <Text className="ml-3 text-gray-700">{selectedUsuario.telefono}</Text>
                </View>
                <View className="flex-row items-center">
                    <Feather name="map-pin" size={18} color="#6b7280" />
                    <Text className="ml-3 text-gray-700 flex-1">{selectedUsuario.direccion}</Text>
                </View>
            </View>

            {/* BOTONES DE ACCIÓN */}
            <Text className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Documentación</Text>
            
            <TouchableOpacity 
                onPress={handleVerHojaVida}
                className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row items-center justify-between border border-gray-100"
            >
                <View className="flex-row items-center">
                    <View className="bg-blue-100 p-2 rounded-lg">
                        <Feather name="file-text" size={24} color="#2563eb" />
                    </View>
                    <View className="ml-3">
                        <Text className="font-bold text-gray-800 text-base">Hoja de Vida</Text>
                        <Text className="text-gray-500 text-xs">Historial, cargos y premios</Text>
                    </View>
                </View>
                <Feather name="chevron-right" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={handleVerFicha}
                className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row items-center justify-between border border-gray-100"
            >
                <View className="flex-row items-center">
                    <View className="bg-red-100 p-2 rounded-lg">
                        <Feather name="activity" size={24} color="#b91c1c" />
                    </View>
                    <View className="ml-3">
                        <Text className="font-bold text-gray-800 text-base">Ficha Médica</Text>
                        <Text className="text-gray-500 text-xs">Alergias, enfermedades y datos</Text>
                    </View>
                </View>
                <Feather name="chevron-right" size={20} color="#d1d5db" />
            </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}