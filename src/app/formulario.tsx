import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Formulario() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [control, setControl] = useState("");
  const [cantidad, setCantidad] = useState("");

  const enviar = () => {
    if (!nombre || !correo || !telefono || !control || !cantidad) {
      alert("Todos los campos son obligatorios");
      return;
    }

    router.push({
      pathname: "/resultado",
      params: {
        nombre,
        correo,
        telefono,
        control,
        cantidad,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>🎮 Realizar pedido</Text>

      <Text style={styles.subtitulo}>
        Completa la información para comprar tu control.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre completo</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre"
          placeholderTextColor="#7F8A9C"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Correo electrónico</Text>

        <TextInput
          style={styles.input}
          placeholder="correo@dominio.com"
          placeholderTextColor="#7F8A9C"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Teléfono</Text>

        <TextInput
          style={styles.input}
          placeholder="3001234567"
          placeholderTextColor="#7F8A9C"
          keyboardType="numeric"
          value={telefono}
          onChangeText={setTelefono}
        />

        <Text style={styles.label}>Control que desea comprar</Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: GameSir Kaleid"
          placeholderTextColor="#7F8A9C"
          value={control}
          onChangeText={setControl}
        />

        <Text style={styles.label}>Cantidad</Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: 1"
          placeholderTextColor="#7F8A9C"
          keyboardType="numeric"
          value={cantidad}
          onChangeText={setCantidad}
        />

        <Pressable style={styles.boton} onPress={enviar}>
          <Text style={styles.botonTexto}>🛒 Realizar pedido</Text>
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitulo}>ControlZone</Text>

        <Text style={styles.infoTexto}>
          Controles para PC y consolas. Realiza tu pedido de forma rápida y
          sencilla.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0B0F19",
    padding: 20,
    justifyContent: "center",
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  subtitulo: {
    color: "#9DA8BA",
    textAlign: "center",
    marginBottom: 20,
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
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#0F1522",
    borderWidth: 1,
    borderColor: "#30394D",
    borderRadius: 13,
    padding: 12,
    marginBottom: 14,
    color: "#FFFFFF",
  },

  boton: {
    backgroundColor: "#00AFC4",
    paddingVertical: 14,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 4,
  },

  botonTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },

  info: {
    marginTop: 18,
    backgroundColor: "#162B3D",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#23445A",
  },

  infoTitulo: {
    color: "#00E5FF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  infoTexto: {
    color: "#AEB9C8",
    fontSize: 13,
    lineHeight: 19,
  },
});