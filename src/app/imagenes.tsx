// Importamos los componentes de React Native que vamos a usar
import {
  Image, // Para mostrar imágenes
  ScrollView, // Contenedor con scroll vertical
  StyleSheet, // Para crear los estilos
  Text, // Para mostrar texto
  View, // Contenedor genérico (como un div)
} from "react-native";

// ============================================================
// COMPONENTE PRINCIPAL: Imagenes
// Muestra una lista de controles con su foto y descripción
// ============================================================
export default function Imagenes() {
  // Arreglo de objetos con los datos de cada control.
  // Cada control tiene: id (clave única), titulo, descripcion y uri (URL de la imagen)
  const controles = [
    {
      id: 1,
      titulo: "GameSir Kaleid",
      descripcion: "Control para PC y Xbox con iluminación RGB.",
      // URL de imagen real de Unsplash (foto de un control)
      uri: "https://images.unsplash.com/photo-1605901309584-818e25960a8f",
    },
    {
      id: 2,
      titulo: "Control inalámbrico",
      descripcion: "Control inalámbrico para disfrutar tus videojuegos.",
      // NOTA: la URL anterior era de una página de tienda, no una imagen.
      // La reemplacé por una foto real de Unsplash para que cargue correctamente.
      uri: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf",
    },
    {
      id: 3,
      titulo: "Control Gaming",
      descripcion: "Diseño cómodo para largas sesiones de juego.",
      uri: "https://images.unsplash.com/photo-1593305841991-05c297ba4575",
    },
  ];

  return (
    // ScrollView permite desplazarse verticalmente por el contenido
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título principal de la pantalla */}
      <Text style={styles.titulo}>🎮 Nuestros controles</Text>

      {/* Subtítulo de presentación */}
      <Text style={styles.subtitulo}>
        Conoce algunos de los controles disponibles en ControlZone.
      </Text>

      {/* Recorremos el arreglo "controles" con .map()
          Por cada control se genera una tarjeta (View) con su imagen y texto */}
      {controles.map((item) => (
        // "key" debe ser única para que React sepa diferenciar cada tarjeta
        <View style={styles.card} key={item.id}>
          {/* Imagen del control, toma la URL del objeto actual */}
          <Image
            source={{ uri: item.uri }}
            style={styles.imagen}
          />

          {/* Bloque con el texto de la tarjeta */}
          <View style={styles.contenido}>
            {/* Nombre del control */}
            <Text style={styles.nombre}>
              {item.titulo}
            </Text>

            {/* Descripción del control */}
            <Text style={styles.descripcion}>
              {item.descripcion}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ============================================================
// ESTILOS
// ============================================================
const styles = StyleSheet.create({
  // Contenedor principal: padding alrededor y fondo oscuro
  container: {
    padding: 20,
    backgroundColor: "#0B0F19",
  },

  // Título principal
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",   // Centrado
    color: "#FFFFFF",      // Blanco
    marginBottom: 6,
  },

  // Subtítulo
  subtitulo: {
    textAlign: "center",
    color: "#9DA8BA",
    marginBottom: 20,
    lineHeight: 20,
  },

  // Tarjeta que contiene imagen + texto
  card: {
    backgroundColor: "#151B2A",
    borderRadius: 20,       // Esquinas redondeadas
    overflow: "hidden",     // Recorta la imagen dentro de las esquinas
    marginBottom: 18,       // Separación entre tarjetas
    borderWidth: 1,
    borderColor: "#252D40",
    elevation: 4,           // Sombra en Android
  },

  // Imagen del control
  imagen: {
    width: "100%",          // Ocupa todo el ancho de la tarjeta
    height: 210,            // Alto fijo
  },

  // Contenedor del texto dentro de la tarjeta
  contenido: {
    padding: 15,
  },

  // Nombre del control
  nombre: {
    color: "#00E5FF",       // Cian
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  // Descripción del control
  descripcion: {
    color: "#AEB9C8",
    fontSize: 14,
    lineHeight: 20,
  },
});
