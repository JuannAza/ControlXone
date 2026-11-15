import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { supabase } from "../../lib/supabase";

export default function Registro() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [guardando, setGuardando] = useState(false);

  const crearCuenta = async () => {
    if (!correo.trim() || !password) {
      Alert.alert("Campos incompletos", "Ingrese correo y contraseña");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Contraseña", "Debe tener mínimo 6 caracteres");
      return;
    }

    try {
      setGuardando(true);

      const { error } = await supabase.auth.signUp({
        email: correo.trim(),
        password,
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      await supabase.auth.signOut();
      Alert.alert("Cuenta creada", "Ahora puede iniciar sesión", [
        {
          text: "Continuar",
          onPress: () => router.replace("/login" as any),
        },
      ]);
    } catch {
      Alert.alert("Error", "No fue posible crear la cuenta. Inténtelo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🎮</Text>
        <Text style={styles.titulo}>Crear cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#7F8A9C"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!guardando}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#7F8A9C"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          editable={!guardando}
        />

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            pressed && !guardando && styles.botonPresionado,
            guardando && styles.botonDesactivado,
          ]}
          onPress={crearCuenta}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.botonTexto}>Crear cuenta</Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.replace("/login" as any)}
          disabled={guardando}
        >
          <Text style={styles.enlace}>Ya tengo una cuenta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#0B0F19",
  },
  card: {
    backgroundColor: "#151B2A",
    borderColor: "#252D40",
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
  },
  logo: {
    fontSize: 52,
    textAlign: "center",
    marginBottom: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#2A3A52",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    color: "#FFFFFF",
  },
  boton: {
    backgroundColor: "#00AFC4",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  botonPresionado: {
    opacity: 0.85,
  },
  botonDesactivado: {
    opacity: 0.65,
  },
  botonTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  enlace: {
    color: "#7DD3FC",
    textAlign: "center",
    marginTop: 18,
    fontWeight: "600",
  },
});
