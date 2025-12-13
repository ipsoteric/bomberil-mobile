import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useUsersStore } from '@/store/usersStore';

export default function FichaMedicaScreen() {
  const { selectedFichaMedica, isLoading } = useUsersStore();

  if (isLoading && !selectedFichaMedica) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#b91c1c" />
      </View>
    );
  }

  if (!selectedFichaMedica) return null;

  const { paciente, biometria, alertas, tratamiento, contactos_emergencia, observaciones_generales } = selectedFichaMedica;

  const WarningCard = ({ items, title, icon }: { items: any[], title: string, icon: any }) => {
     if (items.length === 0) return null;
     return (
        <View className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-2">
                <Feather name={icon} size={20} color="#b91c1c" />
                <Text className="text-red-800 font-bold ml-2 uppercase">{title}</Text>
            </View>
            {items.map((item, i) => (
                <View key={i} className="mb-2 last:mb-0">
                    <Text className="font-bold text-red-900">• {item.nombre}</Text>
                    {item.observacion ? <Text className="text-red-700 text-xs ml-3">{item.observacion}</Text> : null}
                </View>
            ))}
        </View>
     );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4" showsVerticalScrollIndicator={false}>
      
      {/* HEADER DE PACIENTE */}
      <View className="bg-white p-5 rounded-xl shadow-sm mb-4 border-t-4 border-red-600">
         <View className="flex-row justify-between items-start">
             <View>
                 <Text className="text-xl font-bold text-gray-900">{paciente.nombre_completo}</Text>
                 <Text className="text-gray-500">{paciente.rut}</Text>
             </View>
             <View className="bg-red-100 px-3 py-1 rounded-lg items-center">
                 <Text className="text-xs text-red-800 font-bold">GRUPO</Text>
                 <Text className="text-xl font-bold text-red-600">{paciente.grupo_sanguineo}</Text>
             </View>
         </View>
         
         <View className="flex-row mt-4 pt-4 border-t border-gray-100">
             <View className="flex-1">
                 <Text className="text-xs text-gray-400">Edad</Text>
                 <Text className="font-bold text-gray-800">{paciente.edad} años</Text>
             </View>
             <View className="flex-1">
                 <Text className="text-xs text-gray-400">Previsión</Text>
                 <Text className="font-bold text-gray-800">{paciente.sistema_salud}</Text>
             </View>
         </View>
      </View>

      {/* ALERTAS MÉDICAS */}
      <WarningCard items={alertas.alergias} title="Alergias" icon="alert-octagon" />
      <WarningCard items={alertas.enfermedades} title="Enfermedades Crónicas" icon="activity" />

      {/* BIOMETRÍA */}
      <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
         <Text className="text-xs font-bold text-gray-400 uppercase mb-3">Biometría</Text>
         <View className="flex-row justify-between">
            <View className="items-center flex-1">
                <Text className="text-gray-400 text-xs">Peso</Text>
                <Text className="font-bold text-gray-800 text-lg">{biometria.peso || '--'}</Text>
            </View>
            <View className="items-center flex-1 border-l border-gray-100">
                <Text className="text-gray-400 text-xs">Altura</Text>
                <Text className="font-bold text-gray-800 text-lg">{biometria.altura || '--'}</Text>
            </View>
            <View className="items-center flex-1 border-l border-gray-100">
                <Text className="text-gray-400 text-xs">P. Arterial</Text>
                <Text className="font-bold text-gray-800 text-lg">{biometria.presion_arterial || '--'}</Text>
            </View>
         </View>
      </View>

      {/* TRATAMIENTO (MEDICAMENTOS Y CIRUGÍAS) */}
      {(tratamiento.medicamentos.length > 0 || tratamiento.cirugias.length > 0) && (
          <View className="bg-white p-4 rounded-xl shadow-sm mb-4">
             
             {/* Medicamentos */}
             {tratamiento.medicamentos.length > 0 && (
                <View className="mb-4">
                    <View className="flex-row items-center mb-3">
                        <Feather name="briefcase" size={18} color="#4b5563" />
                        <Text className="ml-2 font-bold text-gray-700">Medicamentos Permanentes</Text>
                    </View>
                    {tratamiento.medicamentos.map((med, i) => (
                        <View key={i} className="mb-2 pb-2 border-b border-gray-50 last:border-0">
                            <Text className="font-bold text-gray-800">{med.nombre}</Text>
                            <Text className="text-xs text-gray-500">{med.dosis}</Text>
                        </View>
                    ))}
                </View>
             )}

             {/* Cirugías (NUEVO) */}
             {tratamiento.cirugias.length > 0 && (
                <View>
                    <View className="flex-row items-center mb-3 mt-2">
                        <Feather name="scissors" size={18} color="#4b5563" />
                        <Text className="ml-2 font-bold text-gray-700">Cirugías Previas</Text>
                    </View>
                    {tratamiento.cirugias.map((cir, i) => (
                        <View key={i} className="mb-2 pb-2 border-b border-gray-50 last:border-0">
                            <Text className="font-bold text-gray-800">{cir.nombre}</Text>
                            <Text className="text-xs text-gray-500">{cir.fecha} • {cir.observacion}</Text>
                        </View>
                    ))}
                </View>
             )}
          </View>
      )}

      {/* CONTACTOS EMERGENCIA */}
      <Text className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">En caso de emergencia</Text>
      {contactos_emergencia.map((contacto, i) => (
          <TouchableOpacity 
             key={i} 
             className="bg-white p-4 rounded-xl shadow-sm mb-2 flex-row justify-between items-center"
             onPress={() => Alert.alert("Llamar", `¿Llamar a ${contacto.nombre}?`)}
          >
              <View>
                  <Text className="font-bold text-gray-800">{contacto.nombre}</Text>
                  <Text className="text-xs text-gray-500">{contacto.relacion} • {contacto.telefono}</Text>
              </View>
              <View className="bg-green-100 p-2 rounded-full">
                  <Feather name="phone-call" size={20} color="green" />
              </View>
          </TouchableOpacity>
      ))}

      {observaciones_generales && (
          <View className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <Text className="text-xs font-bold text-yellow-800 uppercase mb-1">Observaciones</Text>
              <Text className="text-yellow-900 text-sm italic">"{observaciones_generales}"</Text>
          </View>
      )}

      <View className="h-10" />
    </ScrollView>
  );
}