import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useUsersStore } from '@/store/usersStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { UsuarioResumen } from './types';

type Props = NativeStackScreenProps<AppStackParamList, 'UsuariosList'>;

export default function UsuariosListScreen({ navigation }: Props) {
  const { usuarios, isLoading, fetchUsuarios } = useUsersStore();
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchUsuarios(searchText);
    }, [])
  );

  const renderItem = ({ item }: { item: UsuarioResumen }) => (
    <TouchableOpacity 
      className="bg-white p-3 mb-3 rounded-2xl border border-gray-100 shadow-sm flex-row items-center"
      onPress={() => navigation.navigate('UsuarioDetalle', { id: item.usuario_id })}
    >
      {/* Avatar */}
      <View className="w-12 h-12 bg-gray-100 rounded-full mr-4 overflow-hidden items-center justify-center border border-gray-200">
        {item.avatar_url ? (
          <Image source={{ uri: item.avatar_url }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <Feather name="user" size={20} color="#9ca3af" />
        )}
      </View>

      <View className="flex-1">
        <Text className="font-bold text-gray-800 text-base">{item.nombre_completo}</Text>
        <Text className="text-xs text-gray-500">{item.descripcion_corta}</Text>
      </View>

      <View className="items-end">
         <View className={`px-2 py-0.5 rounded-full ${item.es_activo ? 'bg-green-100' : 'bg-red-100'}`}>
            <Text className={`text-[10px] font-bold ${item.es_activo ? 'text-green-800' : 'text-red-800'}`}>
                {item.estado}
            </Text>
         </View>
      </View>
      
      <Feather name="chevron-right" size={20} color="#d1d5db" className="ml-2" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 px-4 pt-2">
        
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full">
             <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 ml-2">Directorio</Text>
        </View>

        {/* Buscador */}
        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2 mb-4 shadow-sm">
            <Feather name="search" size={18} color="#9ca3af" />
            <TextInput 
              className="flex-1 ml-2 text-gray-800"
              placeholder="Nombre, RUT o Email..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => fetchUsuarios(searchText)}
              returnKeyType="search"
            />
        </View>

        {isLoading && usuarios.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#b91c1c" />
          </View>
        ) : (
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.usuario_id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}