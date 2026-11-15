import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { productos } from "@/constants/productos";
import { supabase } from "@/lib/supabase";

type ItemBase = {
  key: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  detalle: string;
  precio: number | null;
  imagen: string | null;
};

type Item =
  | (ItemBase & { tipo: "remoto" })
  | (ItemBase & { tipo: "local"; id: string });

type ItemRemoto = Extract<Item, { tipo: "remoto" }>;

type FormularioProducto = {
  codigo: string;
  titulo: string;
  descripcion: string;
  detalle: string;
  precio: string;
};

const formularioVacio: FormularioProducto = {
  codigo: "",
  titulo: "",
  descripcion: "",
  detalle: "",
  precio: "",
};

const patronQr = [
  "111000111",
  "101000101",
  "111010111",
  "000010000",
  "110111010",
  "010001101",
  "111010111",
  "101000101",
  "111000111",
];

const productosLocales: Item[] = productos.map((producto) => ({
  tipo: "local",
  key: producto.id,
  codigo: producto.codigo,
  id: producto.id,
  titulo: producto.nombre,
  descripcion: producto.descripcion,
  detalle: producto.detalle,
  precio: producto.precio,
  imagen: producto.imagen,
}));

export default function Catalogo() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(productosLocales);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState("");
  const [intento, setIntento] = useState(0);
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [productoEditando, setProductoEditando] = useState<string | null>(null);
  const [formulario, setFormulario] =
    useState<FormularioProducto>(formularioVacio);
  const [errorFormulario, setErrorFormulario] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [productoAEliminar, setProductoAEliminar] =
    useState<ItemRemoto | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminacion, setErrorEliminacion] = useState("");

  useEffect(() => {
    let activo = true;

    async function consultarCatalogo() {
      setCargando(true);
      setAviso("");

      try {
        const { data, error } = await supabase
          .from("catalogo_qr")
          .select("codigo,titulo,descripcion,detalle,precio")
          .order("codigo", { ascending: true });

        if (error) {
          console.error("Error Supabase:", error);
          throw error;
        }

        console.log("Productos recibidos:", data);

        if (activo) {
          if (data?.length) {
            setItems(
              data.map((item) => {
                const producto = productos.find(
                  (candidato) => candidato.codigo === item.codigo,
                );

                return {
                  tipo: "remoto",
                  key: String(item.codigo),
                  codigo: item.codigo,
                  titulo: item.titulo ?? producto?.nombre ?? "",
                  descripcion: item.descripcion ?? producto?.descripcion ?? "",
                  detalle: item.detalle ?? producto?.detalle ?? "",
                  precio: item.precio,
                  imagen: producto?.imagen ?? null,
                };
              }),
            );
          } else {
            setItems(productosLocales);
            setAviso(
              "Aún no hay productos en Supabase. Te mostramos los productos disponibles en la app.",
            );
          }
        }
      } catch (error: unknown) {
        console.error("Error al cargar catálogo:", error);

        if (activo) {
          setItems(productosLocales);
          setAviso(
            "No fue posible actualizar desde Supabase. Te mostramos los productos disponibles en la app.",
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void consultarCatalogo();

    return () => {
      activo = false;
    };
  }, [intento]);

  const abrirFormularioNuevo = () => {
    const siguienteNumero =
      Math.max(
        0,
        ...items.map((item) =>
          Number(item.codigo.slice("CTRL-".length)),
        ),
      ) + 1;
    setProductoEditando(null);
    setFormulario({
      ...formularioVacio,
      codigo: `CTRL-${String(siguienteNumero).padStart(3, "0")}`,
    });
    setErrorFormulario("");
    setFormularioVisible(true);
  };

  const abrirFormularioEdicion = (item: ItemRemoto) => {
    setProductoEditando(item.codigo);
    setFormulario({
      codigo: item.codigo,
      titulo: item.titulo,
      descripcion: item.descripcion,
      detalle: item.detalle,
      precio: item.precio === null ? "" : String(item.precio),
    });
    setErrorFormulario("");
    setFormularioVisible(true);
  };

  const guardarProducto = async () => {
    const codigo = formulario.codigo.trim().toUpperCase();
    const titulo = formulario.titulo.trim();
    const descripcion = formulario.descripcion.trim();
    const detalle = formulario.detalle.trim();
    const precioTexto = formulario.precio.trim().replace(",", ".");
    const precio = precioTexto === "" ? null : Number(precioTexto);

    if (
      !/^CTRL-\d{3,}$/.test(codigo) ||
      !/[1-9]/.test(codigo.slice("CTRL-".length)) ||
      !titulo ||
      !descripcion ||
      !detalle
    ) {
      setErrorFormulario(
        "Ingresa un código con el formato CTRL-001, título, descripción y detalle.",
      );
      return;
    }

    if (precioTexto !== "" && (!Number.isFinite(precio) || Number(precio) < 0)) {
      setErrorFormulario("El precio debe ser un número igual o mayor que cero.");
      return;
    }

    const codigoExiste =
      !productoEditando &&
      items.some((item) => item.codigo === codigo);

    if (codigoExiste) {
      setErrorFormulario(`El código ${codigo} ya existe. Ingresa uno diferente.`);
      return;
    }

    setGuardando(true);
    setErrorFormulario("");

    try {
      const datos = {
        codigo,
        titulo,
        descripcion,
        detalle,
        precio,
      };

      const resultado = productoEditando
        ? await supabase
            .from("catalogo_qr")
            .update(datos)
            .eq("codigo", productoEditando)
            .select("codigo")
            .maybeSingle()
        : await supabase
            .from("catalogo_qr")
            .insert(datos)
            .select("codigo")
            .maybeSingle();

      if (resultado.error) {
        throw resultado.error;
      }

      if (!resultado.data) {
        throw new Error(
          "No se guardaron los cambios. Verifica los permisos de Supabase.",
        );
      }

      setFormularioVisible(false);
      setIntento((actual) => actual + 1);
    } catch (error: unknown) {
      console.error("Error al guardar producto:", error);
      const esCodigoDuplicado =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505";

      if (esCodigoDuplicado) {
        setErrorFormulario(
          `El código ${codigo} ya existe. Ingresa uno diferente.`,
        );
        return;
      }

      const mensaje =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : String(error);
      setErrorFormulario("No fue posible guardar: " + mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;

    setEliminando(true);
    setErrorEliminacion("");

    try {
      const { data, error } = await supabase
        .from("catalogo_qr")
        .delete()
        .eq("codigo", productoAEliminar.codigo)
        .select("codigo")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(
          "No se eliminó el producto. Verifica los permisos de Supabase.",
        );
      }

      setProductoAEliminar(null);
      setIntento((actual) => actual + 1);
    } catch (error: unknown) {
      console.error("Error al eliminar producto:", error);
      const mensaje =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : String(error);
      setErrorEliminacion("No fue posible eliminar: " + mensaje);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <View style={styles.pantalla}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Catálogo de controles</Text>
        <View style={styles.accionesEncabezado}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Actualizar catálogo"
            disabled={cargando}
            onPress={() => setIntento((actual) => actual + 1)}
            style={({ pressed }) => [
              styles.botonCircular,
              pressed && styles.botonPresionado,
            ]}
          >
            {cargando ? (
              <ActivityIndicator size="small" color="#00E5FF" />
            ) : (
              <Text style={styles.iconoRecargar}>⟳</Text>
            )}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Agregar producto"
            onPress={abrirFormularioNuevo}
            style={({ pressed }) => [
              styles.botonCircular,
              styles.botonMas,
              pressed && styles.botonPresionado,
            ]}
          >
            <Text style={styles.iconoMas}>+</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <>
            <Text style={styles.subtitulo}>
              Explora los controles disponibles en ControlZone.
            </Text>
            {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}
          </>
        }
        ListEmptyComponent={
          <View style={styles.centro}>
            <Text style={styles.vacio}>No hay productos registrados.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                item.tipo === "remoto"
                  ? router.push({
                      pathname: "/detalle-item",
                      params: { codigo: item.codigo },
                    })
                  : router.push({
                      pathname: "/detalle",
                      params: { id: item.id },
                    })
              }
              style={({ pressed }) => [
                styles.producto,
                pressed && styles.botonPresionado,
              ]}
            >
              {item.imagen ? (
                <Image
                  source={{ uri: item.imagen }}
                  resizeMode="contain"
                  style={styles.imagen}
                />
              ) : (
                <View style={styles.iconoCaja}>
                  <Text style={styles.icono}>🎮</Text>
                </View>
              )}

              <View style={styles.info}>
                <Text style={styles.nombre}>{item.titulo}</Text>
                <Text style={styles.codigo}>{item.codigo}</Text>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
                {item.precio !== null && item.precio !== undefined ? (
                  <Text style={styles.precio}>
                    US$ {Number(item.precio).toFixed(2)}
                  </Text>
                ) : null}
                <Text style={styles.enlace}>Ver detalles →</Text>
              </View>
            </Pressable>

            {item.tipo === "remoto" ? (
              <View style={styles.accionesProducto}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => abrirFormularioEdicion(item)}
                  style={({ pressed }) => [
                    styles.botonEditar,
                    pressed && styles.botonPresionado,
                  ]}
                >
                  <Text style={styles.botonTexto}>Editar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setErrorEliminacion("");
                    setProductoAEliminar(item);
                  }}
                  style={({ pressed }) => [
                    styles.botonEliminar,
                    pressed && styles.botonPresionado,
                  ]}
                >
                  <Text style={styles.botonTexto}>Eliminar</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        )}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Escanear código QR"
        onPress={() => router.push("/escanear")}
        style={({ pressed }) => [
          styles.botonQrFlotante,
          pressed && styles.botonPresionado,
        ]}
      >
        <View style={styles.qrIcono}>
          {patronQr.map((fila, filaIndex) => (
            <View key={filaIndex} style={styles.qrFila}>
              {Array.from(fila).map((pixel, pixelIndex) => (
                <View
                  key={pixelIndex}
                  style={[
                    styles.qrPixel,
                    pixel === "1" && styles.qrPixelActivo,
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </Pressable>

      <Modal
        animationType="slide"
        transparent
        visible={formularioVisible}
        onRequestClose={() => {
          if (!guardando) setFormularioVisible(false);
        }}
      >
        <View style={styles.modalFondo}>
          <KeyboardAvoidingView
            style={styles.tecladoModal}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.modalScroll}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalCard}>
                <Text style={styles.modalTitulo}>
                  {productoEditando ? "Editar producto" : "Agregar producto"}
                </Text>
                <TextInput
                  accessibilityLabel="Código del producto"
                  style={styles.input}
                  placeholder="CTRL-001"
                  placeholderTextColor="#7F8A9C"
                  value={formulario.codigo}
                  editable={!guardando && !productoEditando}
                  onChangeText={(codigo) =>
                    setFormulario((actual) => ({
                      ...actual,
                      codigo: codigo.toUpperCase(),
                    }))
                  }
                />
                <TextInput
                  accessibilityLabel="Título del producto"
                  style={styles.input}
                  placeholder="Título"
                  placeholderTextColor="#7F8A9C"
                  value={formulario.titulo}
                  editable={!guardando}
                  onChangeText={(titulo) =>
                    setFormulario((actual) => ({ ...actual, titulo }))
                  }
                />
                <TextInput
                  accessibilityLabel="Descripción del producto"
                  style={[styles.input, styles.inputMultilinea]}
                  placeholder="Descripción"
                  placeholderTextColor="#7F8A9C"
                  multiline
                  value={formulario.descripcion}
                  editable={!guardando}
                  onChangeText={(descripcion) =>
                    setFormulario((actual) => ({ ...actual, descripcion }))
                  }
                />
                <TextInput
                  accessibilityLabel="Detalle del producto"
                  style={[styles.input, styles.inputMultilinea]}
                  placeholder="Detalle"
                  placeholderTextColor="#7F8A9C"
                  multiline
                  value={formulario.detalle}
                  editable={!guardando}
                  onChangeText={(detalle) =>
                    setFormulario((actual) => ({ ...actual, detalle }))
                  }
                />
                <TextInput
                  accessibilityLabel="Precio del producto"
                  style={styles.input}
                  placeholder="Precio (opcional)"
                  placeholderTextColor="#7F8A9C"
                  keyboardType="decimal-pad"
                  value={formulario.precio}
                  editable={!guardando}
                  onChangeText={(precio) =>
                    setFormulario((actual) => ({ ...actual, precio }))
                  }
                />
                {errorFormulario ? (
                  <Text style={styles.error}>{errorFormulario}</Text>
                ) : null}
                <View style={styles.accionesModal}>
                  <Pressable
                    accessibilityRole="button"
                    disabled={guardando}
                    onPress={() => setFormularioVisible(false)}
                    style={styles.botonCancelar}
                  >
                    <Text style={styles.botonTexto}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    disabled={guardando}
                    onPress={() => void guardarProducto()}
                    style={styles.botonAgregar}
                  >
                    {guardando ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.botonTexto}>Guardar</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={productoAEliminar !== null}
        onRequestClose={() => {
          if (!eliminando) setProductoAEliminar(null);
        }}
      >
        <View style={[styles.modalFondo, styles.modalConfirmacionFondo]}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Eliminar producto</Text>
            <Text style={styles.confirmacionTexto}>
              ¿Seguro que deseas eliminar {productoAEliminar?.titulo}? Esta
              acción no se puede deshacer.
            </Text>
            {errorEliminacion ? (
              <Text style={styles.error}>{errorEliminacion}</Text>
            ) : null}
            <View style={styles.accionesModal}>
              <Pressable
                accessibilityRole="button"
                disabled={eliminando}
                onPress={() => setProductoAEliminar(null)}
                style={styles.botonCancelar}
              >
                <Text style={styles.botonTexto}>Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={eliminando}
                onPress={() => void eliminarProducto()}
                style={styles.botonEliminar}
              >
                {eliminando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.botonTexto}>Eliminar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#0B0F19",
  },
  lista: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#0B0F19",
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  accionesEncabezado: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  botonCircular: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#151B2A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#252D40",
  },
  iconoRecargar: {
    color: "#00E5FF",
    fontSize: 30,
    lineHeight: 34,
  },
  botonMas: {
    backgroundColor: "#00AFC4",
    borderColor: "#00AFC4",
  },
  iconoMas: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 34,
  },
  titulo: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  subtitulo: {
    color: "#9DA8BA",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#151B2A",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#252D40",
  },
  producto: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconoCaja: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "#202A3D",
    borderRadius: 14,
  },
  icono: {
    fontSize: 26,
  },
  imagen: {
    width: 84,
    height: 84,
    marginRight: 14,
    borderRadius: 14,
    backgroundColor: "#202A3D",
  },
  info: {
    flex: 1,
  },
  nombre: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  codigo: {
    color: "#00E5FF",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  descripcion: {
    color: "#AEB9C8",
    fontSize: 14,
    lineHeight: 20,
  },
  detalle: {
    color: "#9DA8BA",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  precio: {
    color: "#00E5FF",
    fontWeight: "600",
    marginTop: 12,
  },
  enlace: {
    color: "#00E5FF",
    fontWeight: "600",
    marginTop: 12,
  },
  vacio: {
    color: "#9DA8BA",
    textAlign: "center",
    marginTop: 32,
  },
  aviso: {
    color: "#AEB9C8",
    backgroundColor: "#151B2A",
    borderColor: "#252D40",
    borderWidth: 1,
    borderRadius: 12,
    lineHeight: 20,
    padding: 12,
    marginBottom: 16,
  },
  accionesProducto: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  botonAgregar: {
    alignItems: "center",
    backgroundColor: "#00AFC4",
    borderRadius: 12,
    padding: 14,
  },
  botonEditar: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#202A3D",
    borderRadius: 10,
    padding: 12,
  },
  botonEliminar: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#8E3B46",
    borderRadius: 10,
    padding: 12,
  },
  botonQrFlotante: {
    position: "absolute",
    right: 22,
    bottom: 22,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00AFC4",
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  qrIcono: {
    flexDirection: "column",
    gap: 1,
  },
  qrFila: {
    flexDirection: "row",
    gap: 1,
  },
  qrPixel: {
    width: 3,
    height: 3,
  },
  qrPixelActivo: {
    backgroundColor: "#0B0F19",
  },
  botonPresionado: {
    opacity: 0.8,
  },
  botonTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalFondo: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalConfirmacionFondo: {
    justifyContent: "center",
  },
  tecladoModal: {
    flex: 1,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    padding: 20,
    backgroundColor: "#151B2A",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#252D40",
  },
  modalTitulo: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    color: "#FFFFFF",
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#2A3A52",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  inputMultilinea: {
    minHeight: 76,
    textAlignVertical: "top",
  },
  error: {
    color: "#FF8A8A",
    lineHeight: 20,
    marginBottom: 12,
  },
  confirmacionTexto: {
    color: "#AEB9C8",
    lineHeight: 22,
    marginBottom: 18,
  },
  accionesModal: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  botonCancelar: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#30394D",
    borderRadius: 10,
    padding: 12,
  },
});
