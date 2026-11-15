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

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    if (!correo.trim() || !password) {
      Alert.alert("Campos incompletos", "Ingrese correo y contraseña");
      return;
    }

    try {
      setCargando(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: correo.trim(),
        password,
      });

      if (error) {
        Alert.alert("Inicio de sesión", error.message);
      }
    } catch {
      Alert.alert(
        "Inicio de sesión",
        "No fue posible iniciar sesión. Inténtelo de nuevo."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🎮</Text>
        <Text style={styles.titulo}>ControlZone</Text>
        <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#7F8A9C"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!cargando}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#7F8A9C"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
          editable={!cargando}
        />

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            pressed && !cargando && styles.botonPresionado,
            cargando && styles.botonDesactivado,
          ]}
          onPress={iniciarSesion}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.botonTexto}>Iniciar sesión</Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.push("/registro" as any)}
          disabled={cargando}
        >
          <Text style={styles.enlace}>¿No tienes cuenta? Regístrate</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
    justifyContent: "center",
    padding: 24,
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
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    color: "#9DA8BA",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#0F172A",
    borderColor: "#2A3A52",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    color: "#FFFFFF",
    marginBottom: 14,
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
    marginTop: 18,
    color: "#7DD3FC",
    textAlign: "center",
    fontWeight: "600",
  },
});
