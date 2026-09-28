// Importamos useRouter de expo-router para poder navegar entre pantallas
import { useRouter } from "expo-router";

// Importamos los componentes de React Native que vamos a usar
import {
  Image, // Para mostrar imágenes
  Pressable, // Para botones táctiles con efecto al presionar
  ScrollView, // Contenedor con scroll vertical
  StyleSheet, // Para crear los estilos
  Text, // Para mostrar texto
  View, // Contenedor genérico (como un div)
} from "react-native";

// ============================================================
// COMPONENTE OpcionMenu
// Es una tarjeta reutilizable que muestra un icono, un título,
// una descripción y una flecha. Al presionarla navega a otra pantalla.
// ============================================================
function OpcionMenu({
  icono,        // El emoji/icono que se muestra arriba (ej: 🎮)
  titulo,       // El título de la tarjeta (ej: "Controles")
  descripcion,  // Texto descriptivo debajo del título
  onPress,      // Función que se ejecuta al tocar la tarjeta
}: {
  icono: string;
  titulo: string;
  descripcion: string;
  onPress: () => void;
}) {
  return (
    // Pressable es el botón. El estilo cambia según si está presionado
    <Pressable
      style={({ pressed }) => [
        styles.card,                    // Estilo base de la tarjeta
        pressed && styles.cardPresionado, // Si está presionado, aplica el efecto
      ]}
      onPress={onPress}                 // Navega a la pantalla indicada
    >
      {/* Caja que contiene el icono/emoji */}
      <View style={styles.iconoCaja}>
        <Text style={styles.icono}>{icono}</Text>
      </View>

      {/* Bloque con el título y la descripción */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitulo}>{titulo}</Text>
        <Text style={styles.cardDescripcion}>{descripcion}</Text>
      </View>

      {/* Flecha que indica que es clicable */}
      <Text style={styles.flecha}>›</Text>
    </Pressable>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL: Inicio
// Es la pantalla de inicio de la app ControlZone
// ============================================================
export default function Inicio() {
  // useRouter nos da acceso para navegar entre pantallas (push)
  const router = useRouter();

  return (
    // ScrollView = contenedor con scroll. contentContainerStyle aplica
    // los estilos al contenido interno (no al área de scroll en sí)
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false} // Oculta la barra de scroll
    >
      {/* ============================================
          PORTADA PRINCIPAL (Hero)
          Imagen de fondo con texto encima
          ============================================ */}
      <View style={styles.hero}>
        {/* Imagen de fondo desde internet */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1593305841991-05c297ba4575",
          }}
          style={styles.imagenHero}
        />

        {/* Capa oscura con el texto de la portada */}
        <View style={styles.overlay}>
          <Text style={styles.etiqueta}>GAMING STORE</Text>
          <Text style={styles.titulo}>ControlZone</Text>
          <Text style={styles.subtitulo}>
            Encuentra el control perfecto para llevar tu experiencia gaming al
            siguiente nivel.
          </Text>
        </View>
      </View>

      {/* ============================================
          BIENVENIDA
          Saludo al usuario con un avatar
          ============================================ */}
      <View style={styles.saludoBox}>
        {/* Texto de la izquierda */}
        <View style={styles.saludoInfo}>
          <Text style={styles.saludoTitulo}>Hola, gamer 🎮</Text>
          <Text style={styles.saludoTexto}>
            ¿Qué control estás buscando hoy?
          </Text>
        </View>

        {/* Avatar circular de la derecha */}
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>🎮</Text>
        </View>
      </View>

      {/* ============================================
          RESUMEN (estadísticas)
          Tres datos separados por líneas verticales
          ============================================ */}
      <View style={styles.resumen}>
        {/* Primer dato: 4+ Controles */}
        <View style={styles.resumenItem}>
          <Text style={styles.resumenNumero}>4+</Text>
          <Text style={styles.resumenTexto}>Controles</Text>
        </View>

        {/* Línea separadora vertical */}
        <View style={styles.separador} />

        {/* Segundo dato: 100% Gaming */}
        <View style={styles.resumenItem}>
          <Text style={styles.resumenNumero}>100%</Text>
          <Text style={styles.resumenTexto}>Gaming</Text>
        </View>

        <View style={styles.separador} />

        {/* Tercer dato: PC Consolas */}
        <View style={styles.resumenItem}>
          <Text style={styles.resumenNumero}>PC</Text>
          <Text style={styles.resumenTexto}>Consolas</Text>
        </View>
      </View>

      {/* ============================================
          SECCIÓN: Explorar ControlZone
          Título de la sección
          ============================================ */}
      <Text style={styles.seccionTitulo}>Explorar ControlZone</Text>

      {/* ============================================
          OPCIONES EN HORIZONTAL
          Este View con flexDirection: "row" hace que las
          tarjetas se acomoden en una sola fila
          ============================================ */}
      <View style={styles.opcionesFila}>
        {/* OPCIÓN 1: Controles -> navega a /imagenes */}
        <OpcionMenu
          icono="🎮"
          titulo="Controles"
          descripcion="Conoce nuestros controles disponibles para gaming."
          onPress={() => router.push("/imagenes")}
        />

        {/* OPCIÓN 2: Realizar pedido -> navega a /formulario */}
        <OpcionMenu
          icono="🛒"
          titulo="Realizar pedido"
          descripcion="Selecciona tu control y registra tu pedido."
          onPress={() => router.push("/formulario")}
        />

        {/* OPCIÓN 3: Contacto -> navega a /contacto */}
        <OpcionMenu
          icono="📍"
          titulo="Contacto"
          descripcion="Consulta la información y ubicación de nuestra tienda."
          onPress={() => router.push("/contacto")}
        />

        {/* OPCIÓN 4: Ver pedidos -> navega a /pedido */}
        <OpcionMenu
          icono="📋"
          titulo="Ver pedidos"
          descripcion="Consulta todos los pedidos registrados."
          onPress={() => router.push("/pedidos")}
        />
      </View>

      {/* ============================================
          PRODUCTO DESTACADO
          Tarjeta con el control destacado de la tienda
          ============================================ */}
      <View style={styles.destacado}>
        {/* Icono de fuego */}
        <View style={styles.destacadoIcono}>
          <Text style={styles.destacadoEmoji}>🔥</Text>
        </View>

        {/* Texto del producto destacado */}
        <View style={styles.destacadoInfo}>
          <Text style={styles.destacadoTitulo}>Control destacado</Text>
          <Text style={styles.destacadoTexto}>
            GameSir Kaleid: excelente respuesta, iluminación RGB y gran
            experiencia para tus partidas.
          </Text>
        </View>
      </View>

      {/* ============================================
          FOOTER
          Texto al final de la pantalla
          ============================================ */}
      <Text style={styles.footer}>ControlZone · Gaming Store</Text>
    </ScrollView>
  );
}

// ============================================================
// ESTILOS
// Aquí se definen todos los estilos de la pantalla
// ============================================================
const styles = StyleSheet.create({
  // Contenedor principal: fondo oscuro, padding alrededor
  container: {
    flexGrow: 1,           // Ocupa todo el alto disponible
    backgroundColor: "#0B0F19", // Color de fondo casi negro azulado
    padding: 18,           // Espacio interno de 18px en todos los lados
  },

  // ---------- PORTADA (Hero) ----------
  hero: {
    height: 290,           // Alto fijo de 290px
    borderRadius: 26,      // Esquinas redondeadas
    overflow: "hidden",    // Recorta el contenido que sobresalga
    marginBottom: 20,      // Espacio debajo
    elevation: 8,          // Sombra en Android
  },

  imagenHero: {
    width: "100%",         // Ocupa todo el ancho
    height: "100%",        // Ocupa todo el alto del contenedor
  },

  overlay: {
    position: "absolute",  // Se superpone sobre la imagen
    left: 0,
    right: 0,
    bottom: 0,             // Anclado abajo
    padding: 22,
    backgroundColor: "rgba(8, 12, 22, 0.82)", // Fondo oscuro semitransparente
  },

  etiqueta: {
    color: "#00E5FF",      // Color cian
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 2,      // Espacio entre letras
    marginBottom: 6,
  },

  titulo: {
    color: "#FFFFFF",      // Blanco
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 7,
  },

  subtitulo: {
    color: "#D9E1EA",
    fontSize: 14,
    lineHeight: 21,        // Alto de línea para mejor lectura
  },

  // ---------- BIENVENIDA ----------
  saludoBox: {
    backgroundColor: "#151B2A",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",      // Los hijos se alinean en fila
    justifyContent: "space-between", // Espacio entre izquierda y derecha
    alignItems: "center",      // Centrado vertical
    marginBottom: 16,
    borderWidth: 1,            // Borde de 1px
    borderColor: "#252D40",
    elevation: 3,
  },

  saludoInfo: {
    flex: 1,               // Ocupa el espacio disponible
  },

  saludoTitulo: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  saludoTexto: {
    marginTop: 4,
    color: "#AAB4C5",
    fontSize: 14,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,      // Círculo (mitad del ancho)
    backgroundColor: "#172D42",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  avatarTexto: {
    fontSize: 25,
  },

  // ---------- RESUMEN ----------
  resumen: {
    backgroundColor: "#151B2A",
    borderRadius: 20,
    paddingVertical: 17,
    flexDirection: "row",
    justifyContent: "space-around", // Reparte el espacio equitativamente
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#252D40",
    elevation: 3,
  },

  resumenItem: {
    flex: 1,               // Cada item ocupa un tercio
    alignItems: "center",  // Centra el contenido
  },

  resumenNumero: {
    color: "#00E5FF",
    fontSize: 18,
    fontWeight: "bold",
  },

  resumenTexto: {
    color: "#8F9AAF",
    fontSize: 12,
    marginTop: 3,
  },

  separador: {
    width: 1,              // Línea vertical de 1px
    height: 35,
    backgroundColor: "#30394D",
  },

  // ---------- SECCIÓN ----------
  seccionTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 14,
  },

  // ---------- CONTENEDOR DE LAS TARJETAS EN FILA ----------
  // CLAVE: flexDirection "row" + flexWrap "wrap" permite que las tarjetas
  // pasen a una segunda fila cuando no caben
  opcionesFila: {
    flexDirection: "row",
    flexWrap: "wrap",      // Permite que pasen a otra fila
    gap: 10,               // Espacio de 10px entre tarjetas
    marginBottom: 14,
  },

  // ---------- TARJETA (OpcionMenu) ----------
  card: {
    width: "48%",          // Dos tarjetas por fila
    backgroundColor: "#151B2A",
    borderRadius: 20,
    padding: 16,
    flexDirection: "column", // Contenido apilado en vertical
    alignItems: "center",    // Centra el contenido horizontalmente
    borderWidth: 1,
    borderColor: "#252D40",
    elevation: 3,
  },

  // Efecto visual al presionar la tarjeta
  cardPresionado: {
    opacity: 0.8,          // Se ve más tenue
    transform: [{ scale: 0.97 }], // Se encoge un 3%
  },

  iconoCaja: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#172D42",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 0,
    marginBottom: 10,      // Espacio entre icono y texto
  },

  icono: {
    fontSize: 25,
  },

  cardInfo: {
    flex: 1,
    alignItems: "center",  // Centra el texto
    marginBottom: 6,
  },

  cardTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",   // Texto centrado
  },

  cardDescripcion: {
    color: "#9DA8BA",
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },

  flecha: {
    fontSize: 26,
    color: "#00E5FF",
    marginLeft: 0,
  },

  // ---------- PRODUCTO DESTACADO ----------
  destacado: {
    backgroundColor: "#162B3D",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    borderWidth: 1,
    borderColor: "#23445A",
  },

  destacadoIcono: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: "#0F1B29",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  destacadoEmoji: {
    fontSize: 25,
  },

  destacadoInfo: {
    flex: 1,
  },

  destacadoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  destacadoTexto: {
    color: "#AEB9C8",
    fontSize: 13,
    lineHeight: 19,
  },

  // ---------- FOOTER ----------
  footer: {
    textAlign: "center",
    color: "#68758A",
    fontSize: 12,
    marginTop: 25,
    marginBottom: 12,
  },
});
