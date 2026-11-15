export type Producto = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  detalle: string;
  imagen: string | null;
  precio: number | null;
  especificaciones: { etiqueta: string; valor: string }[];
};

export const productos: Producto[] = [
  {
    id: "gamesir-kaleid",
    codigo: "CTRL-001",
    nombre: "GameSir Kaleid Flux",
    descripcion:
      "Control con cable para Xbox y PC, con cuerpo transparente e iluminación RGB personalizable.",
    detalle:
      "Sus sticks y gatillos Hall Effect ofrecen una respuesta analógica precisa. Incorpora dos tiras LED personalizables, cuatro motores de vibración, dos botones traseros programables y conector de audio de 3,5 mm. Se conecta mediante un cable USB-C desmontable de 3 m y es compatible con Xbox Series X|S, Xbox One, Windows 10/11 y Steam. La configuración de luces y controles se realiza con GameSir Nexus.",
    imagen:
      "https://cdn.shopify.com/s/files/1/2241/8433/files/gamesir_cms_upload_2_2de430f1ba.png?v=1781617964",
    precio: 46.99,
    especificaciones: [
      { etiqueta: "Conexión", valor: "USB-C desmontable, 3 m" },
      { etiqueta: "Compatibilidad", valor: "Xbox Series X|S, Xbox One, Windows 10/11 y Steam" },
      { etiqueta: "Sticks y gatillos", valor: "Hall Effect" },
      { etiqueta: "Botones traseros", valor: "2 programables" },
      { etiqueta: "Iluminación y vibración", valor: "RGB y 4 motores" },
    ],
  },
  {
    id: "control-inalambrico",
    codigo: "CTRL-002",
    nombre: "GameSir Nova Lite 2",
    descripcion:
      "Mando inalámbrico multiplataforma con sticks Hall Effect y sondeo de hasta 1000 Hz.",
    detalle:
      "Se conecta por Bluetooth, receptor inalámbrico de 2,4 GHz incluido o cable USB-C. Es compatible con Nintendo Switch, PC, Android e iOS. Incluye sticks y gatillos Hall Effect, topes de gatillo de dos etapas, cruceta circular mecánica, dos botones macro traseros y motores de vibración asimétricos. Su batería es de 600 mAh y se puede personalizar con GameSir Connect.",
    imagen:
      "https://cdn.shopify.com/s/files/1/2241/8433/files/gamesir-nova-2-lite-multiplatform-wireless-game-controller-7695939.png?v=1784477669&width=2560&quality=75",
    precio: 34.99,
    especificaciones: [
      { etiqueta: "Conexión", valor: "Bluetooth, receptor 2,4 GHz o USB-C" },
      { etiqueta: "Compatibilidad", valor: "Nintendo Switch, PC, Android e iOS" },
      { etiqueta: "Sondeo", valor: "Hasta 1000 Hz" },
      { etiqueta: "Sticks y gatillos", valor: "Hall Effect" },
      { etiqueta: "Batería", valor: "600 mAh" },
      { etiqueta: "Botones macro", valor: "2 traseros" },
    ],
  },
  {
    id: "control-gaming",
    codigo: "CTRL-003",
    nombre: "GameSir Tarantula 8K PC",
    descripcion:
      "Control cableado para PC con sondeo de 8000 Hz y botones de microinterruptor.",
    detalle:
      "Diseñado para juego competitivo en PC, combina sticks TMR GameSir Mag-Res de segunda generación y nueve botones remapeables. Los gatillos permiten elegir entre recorrido analógico Hall Effect o respuesta de microinterruptor, y los botones ABXY también usan microinterruptores. Incluye giroscopio de seis ejes, iluminación RGB, audio de 3,5 mm y cable USB-C desmontable de 1,8 m. La tasa de sondeo llega hasta 8000 Hz; la configuración se hace con GameSir Connect.",
    imagen:
      "https://cdn.shopify.com/s/files/1/2241/8433/files/gamesir-tarantula-8k-pc-wired-esports-controller-for-pc-9496467.png?v=1785969188&width=2560&quality=75",
    precio: 69.99,
    especificaciones: [
      { etiqueta: "Conexión", valor: "USB-C desmontable, 1,8 m" },
      { etiqueta: "Compatibilidad", valor: "PC" },
      { etiqueta: "Sondeo", valor: "Hasta 8000 Hz" },
      { etiqueta: "Sticks", valor: "TMR GameSir Mag-Res, 2.ª generación" },
      { etiqueta: "Gatillos", valor: "Hall Effect o microinterruptor" },
      { etiqueta: "Sensores y botones", valor: "Giroscopio de 6 ejes, ABXY con microinterruptor" },
    ],
  },
  {
    id: "gamesir-t4-pro",
    codigo: "CTRL-004",
    nombre: "GameSir T4 Pro",
    descripcion:
      "Control multiplataforma con Bluetooth, receptor inalámbrico de 2,4 GHz y conexión USB-C.",
    detalle:
      "El manual indica compatibilidad con Windows 7/10 o posterior, Android 8 o posterior, iOS 13 o posterior, macOS y Nintendo Switch. Incluye soporte para teléfono, botones traseros M1–M4 programables, función Turbo y niveles ajustables de vibración e iluminación. La conexión puede hacerse por Bluetooth, receptor USB o cable; confirma el modo compatible con tu dispositivo antes de comprar.",
    imagen:
      "https://cdn.shopify.com/s/files/1/2241/8433/files/gamesir-cyclone-2-multiplatform-controller-shadow-black-7020093.png?v=1785969188&width=2560&quality=75",
    precio: null,
    especificaciones: [
      { etiqueta: "Conexión", valor: "Bluetooth, receptor 2,4 GHz o USB-C" },
      { etiqueta: "Compatibilidad", valor: "Windows, Android, iOS, macOS y Nintendo Switch" },
      { etiqueta: "Botones traseros", valor: "M1–M4 programables" },
      { etiqueta: "Funciones", valor: "Turbo, vibración e iluminación ajustables" },
      { etiqueta: "Accesorio", valor: "Soporte para teléfono" },
    ],
  },
  {
    id: "control-arcade",
    codigo: "CTRL-005",
    nombre: "GameSir Pocket Taco",
    descripcion:
      "Control Bluetooth móvil, compacto y vertical, inspirado en los juegos arcade retro.",
    detalle:
      "Su formato portátil sujeta el teléfono para jugar en vertical y recuperar la sensación de las máquinas arcade clásicas. Pesa 62,2 g, integra batería de 600 mAh y se conecta por Bluetooth a Android y otros dispositivos compatibles. La aplicación GameSir permite ajustar zonas muertas, reasignar botones y actualizar el firmware; también ofrece Turbo para varios botones. Verifica que tus juegos admitan mando.",
    imagen:
      "https://cdn.shopify.com/s/files/1/2241/8433/files/gamesir-pocket-taco-bluetooth-mobile-gaming-controller-perfect-for-retro-scene-8977864.png?v=1782903320&width=2560&quality=75",
    precio: 29.99,
    especificaciones: [
      { etiqueta: "Conexión", valor: "Bluetooth" },
      { etiqueta: "Compatibilidad", valor: "Android y dispositivos compatibles" },
      { etiqueta: "Formato", valor: "Mando móvil vertical para juegos retro" },
      { etiqueta: "Peso", valor: "62,2 g" },
      { etiqueta: "Batería", valor: "600 mAh" },
      { etiqueta: "Funciones", valor: "Turbo y configuración con GameSir App" },
    ],
  },
];
