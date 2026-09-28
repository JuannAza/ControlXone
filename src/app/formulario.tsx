import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Cliente de Supabase configurado en src/lib/supabase.js
import { supabase } from "../lib/supabase";

// ── Pantalla del formulario de pedidos ──────────────────────────────────
// Muestra el formulario, valida los datos y los guarda en Supabase.
export default function Formulario() {
  // Router para navegar a la pantalla de resultado después de guardar
  const router = useRouter();

  // ── Estados del formulario ────────────────────────────────────────────
  // Cada estado guarda lo que el usuario escribe en su campo
  const [nombre, setNombre] = useState("");      // Nombre del cliente
  const [correo, setCorreo] = useState("");      // Correo electrónico
  const [telefono, setTelefono] = useState("");  // Teléfono
  const [control, setControl] = useState("");    // Control que quiere comprar
  const [cantidad, setCantidad] = useState("");  // Cantidad de controles

  // Estado que controla si el botón está "guardando" (para mostrar la carga)
  const [guardando, setGuardando] = useState(false);

  // ── Función: validar el correo electrónico ────────────────────────────
  // Devuelve true si el correo tiene formato válido (algo@algo.algo)
  const validarCorreo = (email: string) => {
    const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresion.test(email);
  };

  // ── Función: guardar el pedido en Supabase ────────────────────────────
  // Valida los campos, inserta el registro y navega al resultado
  const guardar = async () => {
    // Paso 1: validar que ningún campo esté vacío
    // trim() quita los espacios en blanco al inicio y al final
    if (
      !nombre.trim() ||
      !correo.trim() ||
      !telefono.trim() ||
      !control.trim() ||
      !cantidad.trim()
    ) {
      alert("Todos los campos son obligatorios");
      return; // Se detiene aquí si falta algún campo
    }

    // Paso 2: validar que el correo tenga formato correcto
    if (!validarCorreo(correo)) {
      alert("Ingrese un correo electrónico válido");
      return;
    }

    // Paso 3: validar que el teléfono contenga solo números
    if (isNaN(Number(telefono))) {
      alert("El teléfono debe contener solamente números");
      return;
    }

    // Paso 4: validar la longitud mínima del teléfono
    if (telefono.length < 7) {
      alert("Ingrese un número de teléfono válido");
      return;
    }

    // Paso 5: validar que la cantidad sea un número mayor a 0
    const cantidadNumero = Number(cantidad);
    if (isNaN(cantidadNumero) || cantidadNumero <= 0) {
      alert("Ingrese una cantidad válida");
      return;
    }

    try {
      // Paso 6: activar el indicador de carga (el botón muestra "Guardando...")
      setGuardando(true);

      // Paso 7: insertar el pedido en la tabla "pedidos" de Supabase
      // .select() devuelve el registro creado para obtener su id
      const { data, error } = await supabase
        .from("pedidos")
        .insert([
          {
            nombre: nombre.trim(),
            correo: correo.trim(),
            telefono: telefono.trim(),
            control: control.trim(),
            cantidad: cantidadNumero, // Se guarda como número, no como texto
          },
        ])
        .select();

      // Paso 8: si Supabase devolvió un error (tabla no existe, permisos, red...)
      if (error) {
        console.log("ERROR SUPABASE:", error); // Se muestra en consola para depurar
        alert("Error al guardar: " + error.message);
        return;
      }

      // Paso 9: obtener el registro recién creado por Supabase
      const registro = data?.[0];

      // Si por alguna razón no se recuperó, avisamos al usuario
      if (!registro) {
        alert("No fue posible recuperar el registro guardado");
        return;
      }

      console.log("REGISTRO GUARDADO:", registro); // Para verlo en consola

      // Paso 10: navegar a la pantalla de resultado con los datos guardados
      router.push({
        pathname: "/resultado",
        params: {
          id: String(registro.id),          // El id que generó Supabase
          nombre: registro.nombre,
          correo: registro.correo,
          telefono: registro.telefono,
          control: registro.control,
          cantidad: String(registro.cantidad),
        },
      });

      // Paso 11: limpiar el formulario después de guardar
      setNombre("");
      setCorreo("");
      setTelefono("");
      setControl("");
      setCantidad("");
    } catch (error) {
      // Si ocurre un error inesperado no controlado arriba
      console.log("ERROR INESPERADO:", error);
      alert("No fue posible guardar la información");
    } finally {
      // Paso 12: siempre se ejecuta, desactiva el indicador de carga
      setGuardando(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled" // Permite tocar botones con el teclado abierto
    >
      {/* ── ENCABEZADO de la pantalla ─────────────────────────────────── */}
      <View style={styles.encabezado}>
        {/* Contenedor circular con el icono de la tienda */}
        <View style={styles.iconoContainer}>
          <Text style={styles.iconoCafe}>🎮</Text>
        </View>

        {/* Título de la tienda */}
        <Text style={styles.titulo}>ControlZone</Text>

        {/* Subtítulo descriptivo */}
        <Text style={styles.subtitulo}>
          Realiza tu pedido de controles para PC y consolas.
        </Text>
      </View>

      {/* ── Tarjeta del formulario ────────────────────────────────────── */}
      <View style={styles.card}>
        {/* Título de la tarjeta */}
        <Text style={styles.cardTitulo}>Datos del pedido</Text>

        {/* Descripción de la tarjeta */}
        <Text style={styles.cardDescripcion}>
          Completa todos los campos antes de guardar la información.
        </Text>

        {/* Campo: Nombre completo */}
        <Text style={styles.label}>Nombre completo</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre"
          placeholderTextColor="#7F8A9C"
          value={nombre}                    // Valor controlado por el estado
          onChangeText={setNombre}          // Actualiza el estado al escribir
          autoCapitalize="words"            // Primera letra de cada palabra en mayúscula
        />

        {/* Campo: Correo electrónico */}
        <Text style={styles.label}>Correo electrónico</Text>

        <TextInput
          style={styles.input}
          placeholder="correo@dominio.com"
          placeholderTextColor="#7F8A9C"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"      // Teclado con @ y punto
          autoCapitalize="none"             // Sin mayúsculas automáticas
        />

        {/* Campo: Teléfono */}
        <Text style={styles.label}>Teléfono</Text>

        <TextInput
          style={styles.input}
          placeholder="3001234567"
          placeholderTextColor="#7F8A9C"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="numeric"            // Solo muestra teclado numérico
          maxLength={15}                    // Máximo 15 caracteres
        />

        {/* Campo: Control que desea comprar */}
        <Text style={styles.label}>Control que desea comprar</Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: GameSir Kaleid"
          placeholderTextColor="#7F8A9C"
          value={control}
          onChangeText={setControl}
        />

        {/* Campo: Cantidad */}
        <Text style={styles.label}>Cantidad</Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: 1"
          placeholderTextColor="#7F8A9C"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"            // Solo muestra teclado numérico
        />

        {/* ── Botón Guardar ─────────────────────────────────────────────
            Si está guardando, muestra una rueda de carga y se desactiva
            para evitar que el usuario envíe el pedido dos veces */}
        <Pressable
          style={({ pressed }) => [
            styles.boton,
            pressed && styles.botonPresionado,    // Efecto visual al presionar
            guardando && styles.botonDesactivado, // Se ve apagado mientras guarda
          ]}
          onPress={guardar}                       // Llama a la función guardar
          disabled={guardando}                    // Desactiva el botón mientras guarda
        >
          {/* Si está guardando muestra la rueda, si no, el texto normal */}
          {guardando ? (
            <View style={styles.cargandoContainer}>
              {/* Rueda girando */}
              <ActivityIndicator color="#FFFFFF" />

              <Text style={styles.botonTexto}>Guardando...</Text>
            </View>
          ) : (
            <Text style={styles.botonTexto}>🛒 Realizar pedido</Text>
          )}
        </Pressable>
      </View>

      {/* ── Bloque de información ─────────────────────────────────────── */}
      <View style={styles.infoBox}>
        {/* Icono del bloque */}
        <View style={styles.infoIcono}>
          <Text style={styles.infoEmoji}>🕹️</Text>
        </View>

        {/* Contenido del bloque */}
        <View style={styles.infoContenido}>
          <Text style={styles.infoTitulo}>ControlZone</Text>

          <Text style={styles.infoTexto}>
            La información registrada será almacenada en nuestra base de datos
            utilizando Supabase.
          </Text>
        </View>
      </View>

      {/* ── Pie de página ─────────────────────────────────────────────── */}
      <Text style={styles.footer}>ControlZone · Desarrollo Móvil</Text>
    </ScrollView>
  );
}

// ── Estilos de la pantalla ──────────────────────────────────────────────
// Paleta oscura de ControlZone
const styles = StyleSheet.create({
  // Contenedor principal con scroll
  container: {
    flexGrow: 1,
    backgroundColor: "#0B0F19",
    padding: 20,
  },

  // Encabezado: centra el icono y los títulos
  encabezado: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },

  // Contenedor circular del icono
  iconoContainer: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#162B3D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  // Icono de la tienda
  iconoCafe: {
    fontSize: 40,
  },

  // Título principal
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  // Subtítulo
  subtitulo: {
    fontSize: 14,
    color: "#9DA8BA",
    textAlign: "center",
    marginTop: 7,
    lineHeight: 21,
    paddingHorizontal: 20,
  },

  // Tarjeta del formulario
  card: {
    backgroundColor: "#151B2A",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#252D40",
    elevation: 4,
  },

  // Título de la tarjeta
  cardTitulo: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  // Descripción de la tarjeta
  cardDescripcion: {
    color: "#9DA8BA",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 20,
  },

  // Etiqueta de cada campo
  label: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 7,
  },

  // Campo de texto
  input: {
    backgroundColor: "#0F1522",
    borderWidth: 1,
    borderColor: "#30394D",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 17,
    color: "#FFFFFF",
    fontSize: 15,
  },

  // Botón principal
  boton: {
    backgroundColor: "#00AFC4",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 6,
    elevation: 2,
  },

  // Efecto al presionar el botón
  botonPresionado: {
    opacity: 0.85,
  },

  // Botón apagado mientras guarda
  botonDesactivado: {
    opacity: 0.65,
  },

  // Texto del botón
  botonTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },

  // Contenedor de la rueda de carga + texto
  cargandoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Bloque de información inferior
  infoBox: {
    backgroundColor: "#162B3D",
    padding: 17,
    borderRadius: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  // Icono del bloque de información
  infoIcono: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#0B0F19",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  // Emoji del icono de información
  infoEmoji: {
    fontSize: 23,
    color: "#00E5FF",
  },

  // Contenedor del texto de información
  infoContenido: {
    flex: 1,
  },

  // Título del bloque de información
  infoTitulo: {
    color: "#00E5FF",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 3,
  },

  // Texto del bloque de información
  infoTexto: {
    color: "#AEB9C8",
    fontSize: 13,
    lineHeight: 19,
  },

  // Pie de página
  footer: {
    textAlign: "center",
    color: "#7F8A9C",
    fontSize: 12,
    marginTop: 24,
    marginBottom: 10,
  },
});
