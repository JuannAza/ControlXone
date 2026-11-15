import { supabase } from "@/lib/supabase";

function normalizarCodigo(valor: string): string | null {
  const codigo = valor.trim().toUpperCase();

  if (/^\d+$/.test(codigo)) {
    return `CTRL-${codigo.padStart(3, "0")}`;
  }

  const coincidencia = /^CTRL-(\d{1,})$/.exec(codigo);
  if (!coincidencia || !/[1-9]/.test(coincidencia[1])) return null;

  return `CTRL-${coincidencia[1].padStart(3, "0")}`;
}

export async function buscarCodigoCatalogo(texto: string): Promise<string | null> {
  const valor = texto.trim();
  let codigo = normalizarCodigo(valor);

  if (!codigo) {
    try {
      const parametro = new URL(valor).searchParams.get("codigo");
      codigo = parametro ? normalizarCodigo(parametro) : null;
    } catch {
      return null;
    }
  }

  if (!codigo) return null;

  const { data, error } = await supabase
    .from("catalogo_qr")
    .select("codigo")
    .eq("codigo", codigo)
    .maybeSingle();

  if (error) throw error;
  return data ? String(data.codigo) : null;
}