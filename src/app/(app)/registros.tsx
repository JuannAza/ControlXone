import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { supabase } from "@/lib/supabase";

type Pedido = {
  id: string | number;
  nombre: string;
  correo: string;
  telefono: string;
  control: string;
  cantidad: number;
};

export default function Registros() {
  const router = useRouter();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let active = true;

    void Promise.resolve(
      supabase
        .from("pedidos")
        .select("*")
        .order("id", { ascending: false })
    )
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          Alert.alert("Error al consultar", error.message);
          return;
        }

        setPedidos(data ?? []);
      })
      .catch((error: unknown) => {
        if (!active) return;

        const message =
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado.";
        Alert.alert("Error al consultar", message);
      })
      .finally(() => {
        if (active) setCargando(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
      <Text style={styles.titulo}>🎮 Pedidos registrados</Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => String(item.id)}
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
