import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { productos } from "@/constants/productos";
import { supabase } from "@/lib/supabase";

type ItemCatalogo = {
  codigo: string;
  titulo: string;
  descripcion: string;
  detalle: string;
  precio: number | null;
};

export default function Detalle() {
  const router = useRouter();
  const { id, codigo, origen } = useLocalSearchParams<{
    id?: string;
    codigo?: string;
    origen?: string;
  }>();
  const producto = productos.find(
    (item) => item.id === id || (codigo && item.codigo === codigo),
  );
  const [itemCatalogo, setItemCatalogo] = useState<ItemCatalogo | null>(null);
  const [cargando, setCargando] = useState(Boolean(codigo));
  const [mensaje, setMensaje] = useState("");
  const [intento, setIntento] = useState(0);
  const textoVolver = origen === "qr" ? "Volver al inicio" : "Volver al catálogo";

  const volverDesdeDetalle = () => {
    if (origen === "qr") {
      router.replace("/inicio");
      return;
    }

    router.back();
  };

  useEffect(() => {
    let activo = true;

    async function consultarItem() {
      if (!codigo) {
        setItemCatalogo(null);
        setMensaje(producto ? "" : "Falta código");
        setCargando(false);
        return;
      }

      setCargando(true);
      setMensaje("");
      setItemCatalogo(null);

      try {
        const { data, error } = await supabase
          .from("catalogo_qr")
          .select("codigo,titulo,descripcion,detalle,precio")
          .eq("codigo", codigo)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (activo) {
          setItemCatalogo(data);
          if (!data) {
            setMensaje("Elemento no encontrado");
          }
        }
      } catch (error: unknown) {
        console.error("Error al cargar el detalle del producto:", error);

        if (activo) {
          const mensaje =
            error instanceof Error
              ? error.message
              : typeof error === "object" &&
                  error !== null &&
                  "message" in error
                ? String(error.message)
                : String(error);

          setMensaje("Error al consultar ficha: " + mensaje);
          setItemCatalogo(null);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void consultarItem();

    return () => {
      activo = false;
    };
  }, [codigo, intento, producto]);

  if (cargando) {
    return (
      <View style={styles.estado}>
        <ActivityIndicator size="large" color="#00E5FF" />
        <Text style={styles.textoEstado}>Cargando producto...</Text>
      </View>
    );
  }

  if (mensaje) {
    return (
      <View style={styles.estado}>
        <Text style={styles.error}>{mensaje}</Text>
        {codigo ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setIntento((actual) => actual + 1)}
            style={({ pressed }) => [
              styles.boton,
              pressed && styles.botonPresionado,
            ]}
          >
            <Text style={styles.botonTexto}>Reintentar</Text>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={volverDesdeDetalle}
          style={styles.botonSecundario}
        >
          <Text style={styles.botonSecundarioTexto}>{textoVolver}</Text>
        </Pressable>
      </View>
    );
  }

  const nombre = producto?.nombre ?? itemCatalogo?.titulo;
  const codigoVisible = itemCatalogo?.codigo ?? producto?.codigo;
  const descripcion = producto?.descripcion ?? itemCatalogo?.descripcion;
  const detalle = producto?.detalle ?? itemCatalogo?.detalle;
  const precio = itemCatalogo?.precio ?? producto?.precio ?? null;

  if (!nombre) {
    return (
      <View style={styles.estado}>
        <Text style={styles.titulo}>Producto no encontrado</Text>
        <Text style={styles.descripcion}>
          Regresa al catálogo para elegir un control disponible.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace("/catalogo")}
          style={styles.boton}
        >
          <Text style={styles.botonTexto}>Volver al catálogo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {producto?.imagen ? (
        <Image
          source={{ uri: producto.imagen }}
          resizeMode="contain"
          style={styles.imagen}
        />
      ) : null}

      <View style={styles.info}>
        {codigoVisible ? (
          <Text style={styles.codigo}>Código: {codigoVisible}</Text>
        ) : null}
        <Text style={styles.nombre}>{nombre}</Text>
        {descripcion ? (
          <Text style={styles.descripcion}>{descripcion}</Text>
        ) : null}
        {detalle ? <Text style={styles.detalle}>{detalle}</Text> : null}
        <View style={styles.valorPrecio}>
          <Text style={styles.etiquetaSeccion}>PRECIO DE REFERENCIA · USD</Text>
          <Text style={styles.precio}>
            {precio !== null ? `US$ ${Number(precio).toFixed(2)}` : "Consultar"}
          </Text>
        </View>

        {producto?.especificaciones.length ? (
          <View style={styles.especificaciones}>
            <Text style={styles.tituloSeccion}>Especificaciones</Text>
            {producto.especificaciones.map((especificacion) => (
              <View key={especificacion.etiqueta} style={styles.filaValor}>
                <Text style={styles.etiquetaValor}>
                  {especificacion.etiqueta}
                </Text>
                <Text style={styles.textoValor}>{especificacion.valor}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/formulario")}
          style={({ pressed }) => [
            styles.boton,
            pressed && styles.botonPresionado,
          ]}
        >
          <Text style={styles.botonTexto}>Realizar pedido</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={volverDesdeDetalle}
          style={styles.botonSecundario}
        >
          <Text style={styles.botonSecundarioTexto}>{textoVolver}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 18,
    padding: 20,
    backgroundColor: "#0B0F19",
  },
  estado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#0B0F19",
  },
  imagen: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    backgroundColor: "#151B2A",
  },
  info: {
    padding: 20,
    backgroundColor: "#151B2A",
    borderWidth: 1,
    borderColor: "#252D40",
    borderRadius: 16,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  nombre: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 8,
  },
  codigo: {
    color: "#00E5FF",
    fontSize: 14,
    marginBottom: 18,
  },
  descripcion: {
    color: "#AEB9C8",
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 16,
  },
  detalle: {
    color: "#AEB9C8",
    fontSize: 16,
    lineHeight: 24,
  },
  valorPrecio: {
    marginTop: 22,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#252D40",
  },
  etiquetaSeccion: {
    color: "#8F9AAF",
    fontSize: 12,
    fontWeight: "bold",
  },
  precio: {
    color: "#00E5FF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 6,
  },
  especificaciones: {
    marginTop: 22,
  },
  tituloSeccion: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filaValor: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#252D40",
  },
  etiquetaValor: {
    flex: 0.8,
    color: "#8F9AAF",
    fontSize: 14,
  },
  textoValor: {
    flex: 1.2,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },
  textoEstado: {
    color: "#AEB9C8",
    marginTop: 12,
    fontSize: 14,
  },
  error: {
    color: "#FF9090",
    textAlign: "center",
    lineHeight: 22,
  },
  boton: {
    alignItems: "center",
    backgroundColor: "#00AFC4",
    borderRadius: 12,
    marginTop: 24,
    padding: 15,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  botonTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  botonSecundario: {
    alignItems: "center",
    padding: 15,
    marginTop: 8,
    backgroundColor: "#202A3D",
    borderRadius: 12,
  },
  botonSecundarioTexto: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
