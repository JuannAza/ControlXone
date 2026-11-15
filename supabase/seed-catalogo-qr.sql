insert into public.catalogo_qr (codigo, titulo, descripcion, detalle, precio)
values
  (
    'CTRL-001',
    'GameSir Kaleid Flux',
    'Control con cable para Xbox y PC, con cuerpo transparente e iluminación RGB personalizable.',
    'Sus sticks y gatillos Hall Effect ofrecen una respuesta analógica precisa. Incorpora dos tiras LED personalizables, cuatro motores de vibración, dos botones traseros programables y conector de audio de 3,5 mm. Se conecta mediante un cable USB-C desmontable de 3 m y es compatible con Xbox Series X|S, Xbox One, Windows 10/11 y Steam. La configuración de luces y controles se realiza con GameSir Nexus.',
    46.99
  ),
  (
    'CTRL-002',
    'GameSir Nova Lite 2',
    'Mando inalámbrico multiplataforma con sticks Hall Effect y sondeo de hasta 1000 Hz.',
    'Se conecta por Bluetooth, receptor inalámbrico de 2,4 GHz incluido o cable USB-C. Es compatible con Nintendo Switch, PC, Android e iOS. Incluye sticks y gatillos Hall Effect, topes de gatillo de dos etapas, cruceta circular mecánica, dos botones macro traseros y motores de vibración asimétricos. Su batería es de 600 mAh y se puede personalizar con GameSir Connect.',
    34.99
  ),
  (
    'CTRL-003',
    'GameSir Tarantula 8K PC',
    'Control cableado para PC con sondeo de 8000 Hz y botones de microinterruptor.',
    'Diseñado para juego competitivo en PC, combina sticks TMR GameSir Mag-Res de segunda generación y nueve botones remapeables. Los gatillos permiten elegir entre recorrido analógico Hall Effect o respuesta de microinterruptor, y los botones ABXY también usan microinterruptores. Incluye giroscopio de seis ejes, iluminación RGB, audio de 3,5 mm y cable USB-C desmontable de 1,8 m. La tasa de sondeo llega hasta 8000 Hz; la configuración se hace con GameSir Connect.',
    69.99
  ),
  (
    'CTRL-004',
    'GameSir T4 Pro',
    'Control multiplataforma con Bluetooth, receptor inalámbrico de 2,4 GHz y conexión USB-C.',
    'El manual indica compatibilidad con Windows 7/10 o posterior, Android 8 o posterior, iOS 13 o posterior, macOS y Nintendo Switch. Incluye soporte para teléfono, botones traseros M1–M4 programables, función Turbo y niveles ajustables de vibración e iluminación. La conexión puede hacerse por Bluetooth, receptor USB o cable; confirma el modo compatible con tu dispositivo antes de comprar.',
    null
  ),
  (
    'CTRL-005',
    'GameSir Pocket Taco',
    'Control Bluetooth móvil, compacto y vertical, inspirado en los juegos arcade retro.',
    'Su formato portátil sujeta el teléfono para jugar en vertical y recuperar la sensación de las máquinas arcade clásicas. Pesa 62,2 g, integra batería de 600 mAh y se conecta por Bluetooth a Android y otros dispositivos compatibles. La aplicación GameSir permite ajustar zonas muertas, reasignar botones y actualizar el firmware; también ofrece Turbo para varios botones. Verifica que tus juegos admitan mando.',
    29.99
  )
on conflict (codigo) do update set
  titulo = excluded.titulo,
  descripcion = excluded.descripcion,
  detalle = excluded.detalle,
  precio = excluded.precio;