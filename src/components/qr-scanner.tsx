import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from "expo-camera";
import { useIsFocused } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type QrScannerProps = {
  collapsible?: boolean;
  onCodeScanned?: (code: string) => Promise<boolean>;
};

export function QrScanner({
  collapsible = false,
  onCodeScanned,
}: QrScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const [isOpen, setIsOpen] = useState(!collapsible);
  const [resultado, setResultado] = useState<BarcodeScanningResult | null>(null);
  const [errorCamara, setErrorCamara] = useState<string | null>(null);
  const [errorCodigo, setErrorCodigo] = useState<string | null>(null);
  const [validando, setValidando] = useState(false);
  const scanProcesado = useRef(false);

  const procesarEscaneo = (scan: BarcodeScanningResult) => {
    if (scanProcesado.current) return;

    scanProcesado.current = true;
    setResultado(scan);
    setErrorCodigo(null);

    if (onCodeScanned) {
      setValidando(true);
      void onCodeScanned(scan.data)
        .then((encontrado) => {
          if (!encontrado) {
            setErrorCodigo("No encontramos un producto con ese código.");
          }
        })
        .catch((error: unknown) => {
          console.error("Error al validar el código QR:", error);
          setErrorCodigo(
            "No se pudo consultar el producto. Comprueba la conexión e inténtalo de nuevo.",
          );
        })
        .finally(() => setValidando(false));
    }
  };

  const escanearDeNuevo = () => {
    scanProcesado.current = false;
    setResultado(null);
    setErrorCamara(null);
    setErrorCodigo(null);
  };

  const toggleScanner = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    escanearDeNuevo();
    setIsOpen(true);
  };

  return (
    <View style={styles.container}>
      {collapsible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
          onPress={toggleScanner}
          style={({ pressed }) => [
            styles.toggle,
            pressed && styles.botonPresionado,
          ]}
        >
          <Text style={styles.toggleText}>
            {isOpen ? "Ocultar escáner" : "Abrir escáner QR"}
          </Text>
          <Text style={styles.toggleIcon}>{isOpen ? "−" : "+"}</Text>
        </Pressable>
      ) : null}

      {isOpen ? (
        <>
          {!permission ? (
            <View style={styles.estado}>
              <ActivityIndicator size="large" color="#00E5FF" />
              <Text style={styles.textoEstado}>
                Comprobando permiso de cámara...
              </Text>
            </View>
          ) : !permission.granted ? (
            <View style={styles.estado}>
              <Text style={styles.titulo}>Permiso de cámara</Text>
              <Text style={styles.textoEstado}>
                Necesitamos acceso a la cámara para escanear códigos QR.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void requestPermission()}
                style={({ pressed }) => [
                  styles.boton,
                  pressed && styles.botonPresionado,
                ]}
              >
                <Text style={styles.botonTexto}>Permitir cámara</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.titulo}>Escanear código QR</Text>
              <Text style={styles.instruccion}>
                Centra el código QR dentro del recuadro.
              </Text>

              <View style={styles.visor}>
                {isFocused && !resultado && !errorCamara ? (
                  <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    onBarcodeScanned={procesarEscaneo}
                    onMountError={({ message }) => setErrorCamara(message)}
                  />
                ) : null}
                <View pointerEvents="none" style={styles.marco} />
              </View>

              {errorCamara ? (
                <View style={styles.resultado}>
                  <Text style={styles.resultadoTitulo}>
                    No se pudo iniciar la cámara
                  </Text>
                  <Text selectable style={styles.resultadoTexto}>
                    {errorCamara}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={escanearDeNuevo}
                    style={styles.boton}
                  >
                    <Text style={styles.botonTexto}>Intentar de nuevo</Text>
                  </Pressable>
                </View>
              ) : resultado ? (
                <View style={styles.resultado}>
                  <Text style={styles.resultadoTitulo}>
                    {validando
                      ? "Consultando producto..."
                      : errorCodigo
                        ? "No se pudo abrir el producto"
                        : "Código QR leído"}
                  </Text>
                  {validando ? (
                    <ActivityIndicator size="small" color="#00E5FF" />
                  ) : null}
                  {errorCodigo ? (
                    <Text style={styles.resultadoTexto}>{errorCodigo}</Text>
                  ) : (
                    <Text style={styles.tipoCodigo}>Tipo: {resultado.type}</Text>
                  )}
                  <Text selectable style={styles.resultadoTexto}>
                    {resultado.data}
                  </Text>
                  {!validando ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={escanearDeNuevo}
                      style={styles.boton}
                    >
                      <Text style={styles.botonTexto}>
                        {errorCodigo ? "Escanear de nuevo" : "Escanear otro código"}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : (
                <Text style={styles.ayuda}>
                  El contenido del código se mostrará aquí después de
                  escanearlo.
                </Text>
              )}
            </>
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#151B2A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#252D40",
  },
  toggleText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleIcon: {
    color: "#00E5FF",
    fontSize: 24,
    fontWeight: "bold",
  },
  estado: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#151B2A",
    borderRadius: 16,
    marginTop: 16,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  instruccion: {
    color: "#AEB9C8",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 18,
  },
  textoEstado: {
    color: "#AEB9C8",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 12,
  },
  visor: {
    width: "100%",
    height: 300,
    overflow: "hidden",
    alignSelf: "center",
    backgroundColor: "#151B2A",
    borderRadius: 20,
  },
  marco: {
    position: "absolute",
    width: 220,
    height: 220,
    alignSelf: "center",
    top: "50%",
    marginTop: -110,
    borderWidth: 3,
    borderColor: "#00E5FF",
    borderRadius: 20,
  },
  ayuda: {
    color: "#9DA8BA",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 16,
  },
  resultado: {
    padding: 16,
    marginTop: 16,
    backgroundColor: "#151B2A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#252D40",
  },
  resultadoTitulo: {
    color: "#00E5FF",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tipoCodigo: {
    color: "#9DA8BA",
    marginBottom: 8,
  },
  resultadoTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },
  boton: {
    alignItems: "center",
    backgroundColor: "#00AFC4",
    borderRadius: 13,
    marginTop: 18,
    padding: 14,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  botonTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
