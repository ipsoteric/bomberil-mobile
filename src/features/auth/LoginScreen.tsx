import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Alert
} from 'react-native';
import { AxiosError } from 'axios';
import { Feather, MaterialIcons } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import client from '@/api/client'; // Importamos el cliente configurado
import { ENDPOINTS } from '@/api/endpoints';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';


type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [rut, setRut] = useState(''); // Cambiado de email a rut
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuthStore();


  const handleLogin = async () => {
    if (!rut.trim() || !password.trim()) {
        Alert.alert('Faltan datos', 'Por favor ingresa tu credencial y contraseña');
        return;
    }

    setLoading(true);
    try {
        const response = await client.post(ENDPOINTS.AUTH.LOGIN, {
            rut: rut.trim(), // Limpiamos espacios
            password: password
        });

        // Si llega aquí, es 200 OK
        await signIn(response.data);

    } catch (error: any) {
        console.log("Error Login:", error);
        
        let errorTitle = 'Error de inicio de sesión';
        let errorMessage = 'Ocurrió un problema inesperado. Intenta nuevamente.';

        if (error.response) {
            // El servidor respondió con un código de error (4xx, 5xx)
            const data = error.response.data;
            const status = error.response.status;

            if (data.detail) {
                // Caso Django Rest Framework estándar
                errorMessage = Array.isArray(data.detail) ? data.detail[0] : data.detail;
            } else if (data.non_field_errors) {
                errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
            } else if (data.rut) {
                errorMessage = `RUT: ${Array.isArray(data.rut) ? data.rut[0] : data.rut}`;
            } else if (data.password) {
                errorMessage = `Contraseña: ${Array.isArray(data.password) ? data.password[0] : data.password}`;
            } else {
                // Fallback por código de estado
                if (status === 401) errorMessage = 'Credenciales incorrectas o cuenta inactiva.';
                else if (status === 403) errorMessage = 'No tienes permisos para acceder.';
                else if (status === 404) errorMessage = 'Servicio no encontrado (404).';
                else if (status >= 500) errorMessage = 'Error interno del servidor.';
            }
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta (Timeout, Red)
            errorTitle = 'Error de Conexión';
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu internet o la dirección IP.';
        } else {
            errorMessage = error.message;
        }

        Alert.alert(errorTitle, errorMessage);
    } finally {
        setLoading(false);
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-gray-100">
        <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
        
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 justify-center px-6"
          >
            
            {/* --- SECCIÓN LOGO --- */}
            <View className="items-center mb-10">
              <View className="bg-white p-2 rounded-full shadow-lg mb-4">
                <Image 
                  source={require('../../../assets/logo_bomberil.png')}
                  className="w-24 h-24 rounded-full" 
                  resizeMode="contain"
                />
              </View>
              <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Bomberil<Text className="text-bomberil-700">System</Text>
              </Text>
              <Text className="text-gray-500 font-medium mt-1">
                Gestión Integral de Compañía
              </Text>
            </View>

            {/* --- TARJETA DE FORMULARIO --- */}
            <View className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              
              {/* Input RUT / Credencial */}
              <View className="mb-4 space-y-2">
                <Text className="text-gray-600 font-bold ml-1 text-xs uppercase tracking-wider">
                  Credencial / RUT
                </Text>
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-bomberil-700 focus:bg-white transition-colors">
                  <Feather name="user" size={20} color="#9ca3af" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 font-medium text-base"
                    placeholder="Ej. 12.345.678-9"
                    placeholderTextColor="#d1d5db"
                    value={rut}
                    onChangeText={setRut} // Actualiza estado rut
                    autoCapitalize="none"
                    // keyboardType="email-address" // Opcional: Quitar si prefieres teclado normal
                  />
                </View>
              </View>

              {/* Input Contraseña */}
              <View className="mb-8 space-y-2">
                <Text className="text-gray-600 font-bold ml-1 text-xs uppercase tracking-wider">
                  Contraseña
                </Text>
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                  <Feather name="lock" size={20} color="#9ca3af" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 font-medium text-base"
                    placeholder="••••••••"
                    placeholderTextColor="#d1d5db"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather 
                      name={showPassword ? "eye" : "eye-off"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('RecuperarClave')}
                  className="self-end mt-2">
                  <Text className="text-bomberil-700 font-semibold text-sm">
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Botón de Acción */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className={`flex-row justify-center items-center py-4 rounded-xl shadow-md ${
                  loading ? 'bg-bomberil-500' : 'bg-bomberil-700'
                }`}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">
                      Iniciar Sesión
                    </Text>
                    <Feather name="arrow-right" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

            </View>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text className="text-gray-400 text-xs">
                Bomberil Mobile v1.0.0
              </Text>
            </View>

          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}