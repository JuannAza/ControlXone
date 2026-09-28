import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

// ── Pantalla: listar todos los pedidos ──────────────────────────────────
// Consulta la tabla "pedidos" y muestra cada registro en una tarjeta.
export default function Pedidos() {
  const router = useRouter();

  // Estado con la lista de pedidos que devuelve Supabase
  const [pedidos, setPedidos] = useState<any[]>([]);

  // Estado que indica si la consulta está en curso
  const [cargando, setCargando] = useState(true);

  // Al montar la pantalla, se cargan los pedidos
  useEffect(() => {
    cargarPedidos();
  }, []);

  // ── Función: consultar todos los pedidos ────────────────────────────
  const cargarPedidos = async () => {
    setCargando(true);

    // SELECT * FROM pedidos ORDER BY id DESC
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert("Error al consultar: " + error.message);
      setCargando(false);
      return;
    }

    setPedidos(data || []);
    setCargando(false);
  };

  // Mientras carga, muestra una rueda girando
  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#00AFC4" />
        <Text style={styles.centroTexto}>Consultando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.titulo}>🎮 Pedidos registrados</Text>

      {/* Lista de pedidos */}
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.numero}>Pedido #{item.id}</Text>
            </View>

            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.dato}>📧 {item.correo}</Text>
            <Text style={styles.dato}>📞 {item.telefono}</Text>
            <Text style={styles.dato}>🎮 {item.control}</Text>
            <Text style={styles.dato}>🔢 Cantidad: {item.cantidad}</Text>
          </View>
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no hay pedidos registrados.</Text>
        }
      />

      {/* Botón para volver al formulario */}
      <Pressable
        style={({ pressed }) => [
          styles.boton,
          pressed && styles.botonPresionado,
        ]}
        onPress={() => router.push("/formulario")}
      >
        <Text style={styles.botonTexto}>➕ Nuevo pedido</Text>
      </Pressable>
    </View>
  );
}

// ── Estilos (paleta oscura de ControlZone) ──────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F19",
    padding: 20,
  },

  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0F19",
  },

  centroTexto: {
    color: "#9DA8BA",
    marginTop: 12,
    fontSize: 14,
  },

  titulo: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 20,
  },

  lista: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#151B2A",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#252D40",
    marginBottom: 12,
    elevation: 3,
  },

  cardHeader: {
    marginBottom: 8,
  },

  numero: {
    color: "#00E5FF",
    fontSize: 13,
    fontWeight: "bold",
  },

  nombre: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  dato: {
    color: "#AEB9C8",
    fontSize: 14,
    marginBottom: 4,
  },

  vacio: {
    color: "#7F8A9C",
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },

  boton: {
    backgroundColor: "#00AFC4",
    padding: 14,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 10,
  },

  botonPresionado: {
    opacity: 0.85,
  },

  botonTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
