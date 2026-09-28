import { Stack } from "expo-router";

export default function Layout() {
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
      <Stack.Screen
        name="index"
        options={{
          title: "ControlZone",
        }}
      />

      <Stack.Screen
        name="formulario"
        options={{
          title: "Realizar pedido",
        }}
      />

      <Stack.Screen
        name="resultado"
        options={{
          title: "Pedido realizado",
        }}
      />

      <Stack.Screen
        name="pedidos"
        options={{
          title: "Pedidos registrados",
        }}
      />

      <Stack.Screen
        name="imagenes"
        options={{
          title: "Controles",
        }}
      />

      <Stack.Screen
        name="contacto"
        options={{
          title: "Contacto",
        }}
      />
    </Stack>
  );
}
