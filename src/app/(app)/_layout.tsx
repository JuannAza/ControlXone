import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0B0F19",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="inicio" options={{ title: "ControlZone" }} />
      <Stack.Screen name="formulario" options={{ title: "Realizar pedido" }} />
      <Stack.Screen name="resultado" options={{ title: "Resultado" }} />
      <Stack.Screen name="registros" options={{ title: "Pedidos registrados" }} />
      <Stack.Screen name="imagenes" options={{ title: "Controles" }} />
      <Stack.Screen name="contacto" options={{ title: "Contacto" }} />
      <Stack.Screen name="catalogo" options={{ title: "Catálogo" }} />
      <Stack.Screen name="detalle-item" options={{ title: "Detalle" }} />
      <Stack.Screen name="detalle" options={{ title: "Detalle del producto" }} />
      <Stack.Screen name="escanear" options={{ title: "Escanear QR" }} />
    </Stack>
  );
}
