import {
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Contacto() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📍 Contacto</Text>

      <Text style={styles.subtitulo}>
        Información de ControlZone.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Tienda</Text>
        <Text style={styles.valor}>ControlZone</Text>

        <Text style={styles.label}>Universidad</Text>
        <Text style={styles.valor}>Universidad CESMAG</Text>

        <Text style={styles.label}>Programa</Text>
        <Text style={styles.valor}>Ingeniería de Sistemas</Text>

        <Text style={styles.label}>Asignatura</Text>
        <Text style={styles.valor}>Desarrollo Móvil</Text>

        <Text style={styles.label}>Correo</Text>
        <Text style={styles.valor}>controlzone@ejemplo.com</Text>

        <Text style={styles.label}>Ciudad</Text>
        <Text style={styles.valor}>Pasto</Text>
      </View>
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
  },

  subtitulo: {
    textAlign: "center",
    color: "#9DA8BA",
    marginBottom: 22,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#151B2A",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#252D40",
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
});