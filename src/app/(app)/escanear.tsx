import { QrScanner } from "@/components/qr-scanner";
import { buscarCodigoCatalogo } from "@/lib/catalogo-qr";
import { useRouter } from "expo-router";

export default function Escanear() {
  const router = useRouter();

  const validarCodigo = async (texto: string) => {
    const codigo = await buscarCodigoCatalogo(texto);
    if (!codigo) return false;

    router.replace({
      pathname: "/detalle-item",
      params: { codigo, origen: "qr" },
    });
    return true;
  };

  return (
    <QrScanner onCodeScanned={validarCodigo} />
  );
}
