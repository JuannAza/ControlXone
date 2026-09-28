import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto"; // Necesario para que Supabase funcione en React Native

// ── CONFIGURACIÓN DE SUPABASE ──────────────────────────────────────────────
// Reemplaza estos valores con los de tu proyecto (Project Settings → API)
// ⚠️ IMPORTANTE: solo la URL base, SIN "/rest/v1/" al final
const supabaseUrl = "https://briuoqmobjfhdjyvklhl.supabase.co";

// Clave pública (anon key) de tu proyecto
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyaXVvcW1vYmpmaGRqeXZrbGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMjA2NzQsImV4cCI6MjEwNTU5NjY3NH0.26AeXhc5YKdhrfVvcvTqMZtMB21FYk-bymfb4rx3JJA";

// ── CREACIÓN DEL CLIENTE ──────────────────────────────────────────────────
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,      // No guarda la sesión en el dispositivo
      autoRefreshToken: false,    // No renueva el token automáticamente
      detectSessionInUrl: false,  // No busca token en la URL
    },
  }
);
