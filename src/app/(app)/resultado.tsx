import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Resultado() {
  const router = useRouter();

  const {
    nombre,
    correo,
    telefono,
    control,
    cantidad,
  } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎮 Pedido realizado</Text>

      <Text style={styles.subtitulo}>
        Tu pedido ha sido registrado correctamente.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Cliente</Text>
        <Text style={styles.valor}>{nombre}</Text>

        <Text style={styles.label}>Correo</Text>
        <Text style={styles.valor}>{correo}</Text>

        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.valor}>{telefono}</Text>

        <Text style={styles.label}>Control</Text>
        <Text style={styles.valor}>{control}</Text>

        <Text style={styles.label}>Cantidad</Text>
        <Text style={styles.valor}>{cantidad}</Text>
      </View>

      <Pressable
        style={styles.boton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.botonTexto}>
          Volver al inicio
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
    justifyContent: "center",
    padding: 20,
  },

  titulo: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  subtitulo: {
    color: "#9DA8BA",
    textAlign: "center",
    marginBottom: 22,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#151B2A",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#252D40",
    marginBottom: 18,
    elevation: 4,
  },

  label: {
    color: "#00E5FF",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "600",
  },

  valor: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },

  boton: {
    backgroundColor: "#00AFC4",
    padding: 14,
    borderRadius: 13,
    alignItems: "center",
  },

  botonTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});