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
  StatusBar
} from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Feather } from '@expo/vector-icons'; // Iconos vectoriales incluidos en Expo
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return; // Validación básica
    Keyboard.dismiss();
    setLoading(true);
    
    try {
      // DATOS SIMULADOS (Reemplazar con llamada real a API)
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      const fakePermissions = ['accion_ver_inventario', 'accion_ajustar_stock'];
      
      // Simulamos delay de red de 1.5s para ver la animación de carga
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await signIn(fakeToken, fakePermissions); 
    } catch (error) {
      console.error(error);
      alert('Error de conexión o credenciales inválidas');
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
                {/* REEMPLAZA require... con tu logo real */}
                {/* Si tienes el archivo en assets: require('../../../assets/logo.png') */}
                <Image 
                  source={require('../../../assets/bomberil_logo.png')}
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
              
              {/* Input Usuario */}
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
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
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
                <TouchableOpacity className="self-end mt-2">
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