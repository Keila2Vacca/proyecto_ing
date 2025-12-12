// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Tu API Key - EN PRODUCCIÓN usa variables de entorno
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBslvEA7UZei5jqPVam5pEG5LG3i15k6jM";

// Inicializar el cliente de Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

// Configurar el modelo (Gemini Pro es gratuito con límites)
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Configuración de seguridad (opcional pero recomendado)
const generationConfig = {
  temperature: 0.7, // Creatividad: 0 (preciso) a 1 (creativo)
  topK: 1,
  topP: 1,
  maxOutputTokens: 1000,
};

// Sistema prompt para el chatbot de transporte
const systemPrompt = `
Eres "HacariBot", el asistente virtual de COOTRANS Hacaritama, una empresa de transporte en Colombia.

INSTRUCCIONES:
1. Solo responde preguntas sobre transporte, rutas, horarios, precios y servicios de COOTRANS Hacaritama
2. Si la pregunta no es sobre transporte, responde amablemente que solo puedes ayudar con temas de transporte
3. Usa un tono amable y profesional
4. Mantén las respuestas breves y directas
5. Si no sabes algo, sugiere contactar al teléfono 314 2157928
6. Siempre menciona que eres el asistente de COOTRANS Hacaritama

INFORMACIÓN DE LA EMPRESA:
- Nombre: COOTRANS Hacaritama
- Teléfono: 314 2157928
- Horarios terminal: Lunes a Sábado 5:00 AM - 7:00 PM
- Rutas principales: Ocaña, Ábrego, Cúcuta, Bogotá
- Reservas online: Disponibles 24/7
- Métodos de pago: Efectivo, tarjetas, PSE

Ejemplo de respuestas:
P: "¿Cómo reservar un pasaje?"
R: "Puedes reservar tu pasaje en nuestra terminal, por teléfono al 314 2157928, o en nuestra página web en la sección 'Reservar Pasaje'. Las reservas online están disponibles 24/7."

P: "¿Precio a Ocaña?"
R: "El pasaje a Ocaña tiene un costo de $13,000 pesos colombianos. Los precios pueden variar según la temporada, te recomiendo confirmar al momento de la reserva."

Ahora responde la siguiente pregunta del usuario:
`;

// Función auxiliar para respuestas de respaldo
const getBackupResponse = (userInput: string): string => {
  const normalizedInput = userInput.toLowerCase().trim();
  
  // Mapeo de preguntas a respuestas específicas
  const responseMap: { [key: string]: string } = {
    // Preguntas sobre reservas
    "reservar": "Para reservar un pasaje, dirígete a la sección 'Reservar Pasaje' en el menú principal o desde el dashboard. También puedes llamar al 314 2157928 para asistencia telefónica.",
    "reserva": "Para reservar un pasaje, dirígete a la sección 'Reservar Pasaje' en el menú principal o desde el dashboard. También puedes llamar al 314 2157928 para asistencia telefónica.",
    "comprar pasaje": "Para reservar un pasaje, dirígete a la sección 'Reservar Pasaje' en el menú principal o desde el dashboard. También puedes llamar al 314 2157928 para asistencia telefónica.",
    "cómo reservar": "Para reservar un pasaje, dirígete a la sección 'Reservar Pasaje' en el menú principal o desde el dashboard. También puedes llamar al 314 2157928 para asistencia telefónica.",
    "quiero reservar": "Para reservar un pasaje, dirígete a la sección 'Reservar Pasaje' en el menú principal o desde el dashboard. También puedes llamar al 314 2157928 para asistencia telefónica.",
    
    // Preguntas sobre horarios
    "horario": "Nuestros horarios de atención en terminal son de lunes a sábado de 5:00 AM a 7:00 PM. Las reservas online están disponibles 24/7.",
    "horarios": "Nuestros horarios de atención en terminal son de lunes a sábado de 5:00 AM a 7:00 PM. Las reservas online están disponibles 24/7.",
    "atención": "Nuestros horarios de atención en terminal son de lunes a sábado de 5:00 AM a 7:00 PM. Las reservas online están disponibles 24/7.",
    "cuándo abren": "Nuestros horarios de atención en terminal son de lunes a sábado de 5:00 AM a 7:00 PM. Las reservas online están disponibles 24/7.",
    "abierto": "Nuestros horarios de atención en terminal son de lunes a sábado de 5:00 AM a 7:00 PM. Las reservas online están disponibles 24/7.",
    
    // Preguntas sobre precios a Ocaña
    "precio ocaña": "El precio del pasaje a Ocaña es de $13,000 pesos colombianos (precio actualizado 2025).",
    "cuánto cuesta ocaña": "El precio del pasaje a Ocaña es de $13,000 pesos colombianos (precio actualizado 2025).",
    "tarifa ocaña": "El precio del pasaje a Ocaña es de $13,000 pesos colombianos (precio actualizado 2025).",
    "valor ocaña": "El precio del pasaje a Ocaña es de $13,000 pesos colombianos (precio actualizado 2025).",
    "pasaje ocaña": "El precio del pasaje a Ocaña es de $13,000 pesos colombianos (precio actualizado 2025).",
    
    // Preguntas sobre pagos
    "pago": "Sí, aceptamos pagos en línea a través de PSE (Pagos Seguros en Línea), tarjetas débito/crédito. En terminal aceptamos efectivo y tarjetas.",
    "pagos": "Sí, aceptamos pagos en línea a través de PSE (Pagos Seguros en Línea), tarjetas débito/crédito. En terminal aceptamos efectivo y tarjetas.",
    "tarjeta": "Sí, aceptamos pagos en línea a través de PSE (Pagos Seguros en Línea), tarjetas débito/crédito. En terminal aceptamos efectivo y tarjetas.",
    "efectivo": "Sí, aceptamos pagos en línea a través de PSE (Pagos Seguros en Línea), tarjetas débito/crédito. En terminal aceptamos efectivo y tarjetas.",
    "método de pago": "Sí, aceptamos pagos en línea a través de PSE (Pagos Seguros en Línea), tarjetas débito/crédito. En terminal aceptamos efectivo y tarjetas.",
    "pse": "Sí, aceptamos pagos en línea a través de PSE (Pagos Seguros en Línea), tarjetas débito/crédito. En terminal aceptamos efectivo y tarjetas.",
    
    // Preguntas sobre cancelación
    "cancelar": "Política de cancelación: • Más de 48h: 90% reembolso • 24-48h: 50% reembolso • Menos de 24h: Sin reembolso",
    "cancelación": "Política de cancelación: • Más de 48h: 90% reembolso • 24-48h: 50% reembolso • Menos de 24h: Sin reembolso",
    "reembolso": "Política de cancelación: • Más de 48h: 90% reembolso • 24-48h: 50% reembolso • Menos de 24h: Sin reembolso",
    "devolución": "Política de cancelación: • Más de 48h: 90% reembolso • 24-48h: 50% reembolso • Menos de 24h: Sin reembolso",
    "cancelar reserva": "Política de cancelación: • Más de 48h: 90% reembolso • 24-48h: 50% reembolso • Menos de 24h: Sin reembolso",
    
    // Preguntas sobre equipaje
    "equipaje": "Política de equipaje: • 1 maleta grande (25kg) incluida • 1 equipaje de mano • Equipaje extra: $5,000 por pieza",
    "maleta": "Política de equipaje: • 1 maleta grande (25kg) incluida • 1 equipaje de mano • Equipaje extra: $5,000 por pieza",
    "maletas": "Política de equipaje: • 1 maleta grande (25kg) incluida • 1 equipaje de mano • Equipaje extra: $5,000 por pieza",
    "peso equipaje": "Política de equipaje: • 1 maleta grande (25kg) incluida • 1 equipaje de mano • Equipaje extra: $5,000 por pieza",
    "llevar equipaje": "Política de equipaje: • 1 maleta grande (25kg) incluida • 1 equipaje de mano • Equipaje extra: $5,000 por pieza",
    "equipaje permitido": "Política de equipaje: • 1 maleta grande (25kg) incluida • 1 equipaje de mano • Equipaje extra: $5,000 por pieza",
    
    // Preguntas sobre rutas
    "ruta": "Nuestras rutas principales son: Ocaña, Ábrego.",
    "rutas": "Nuestras rutas principales son: Ocaña, Ábrego.",
    "destinos": "Nuestras rutas principales son: Ocaña, Ábrego.",
    "a dónde viajan": "Nuestras rutas principales son: Ocaña, Ábrego.",
    "dónde viajan": "Nuestras rutas principales son: Ocaña, Ábrego.",
    
    // Preguntas sobre contacto
    "teléfono": "Puedes contactarnos al 314 2157928 para atención personalizada.",
    "contacto": "Puedes contactarnos al 314 2157928 para atención personalizada.",
    "llamar": "Puedes contactarnos al 314 2157928 para atención personalizada.",
    "número": "Puedes contactarnos al 314 2157928 para atención personalizada.",
    "contactar": "Puedes contactarnos al 314 2157928 para atención personalizada.",
  };

  // Buscar coincidencia
  for (const [keyword, response] of Object.entries(responseMap)) {
    if (normalizedInput.includes(keyword)) {
      return response;
    }
  }

  // Respuesta por defecto si no encuentra coincidencia
  return "Entiendo tu pregunta sobre transporte. Para información más específica sobre rutas, horarios o precios, puedes consultar nuestro sitio web o llamar al 314 2157928.";
};

/**
 * Función para generar respuestas usando Gemini AI
 */
export async function generateChatbotResponse(userMessage: string): Promise<string> {
  try {
    // Validar API key
    if (!API_KEY || API_KEY === "AIzaSyBslvEA7UZei5jqPVam5pEG5LG3i15k6jM") {
      throw new Error("API Key de Gemini no configurada. Configura VITE_GEMINI_API_KEY en .env");
    }

    // Combinar prompt del sistema con mensaje del usuario
    const fullPrompt = `${systemPrompt}\n\nUsuario: ${userMessage}\n\nHacariBot:`;

    // Generar respuesta
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();

    // Limpiar y retornar respuesta
    return text.trim() || getBackupResponse(userMessage);

  } catch (error: any) {
    console.error("Error en Gemini API:", error);
    
    // Verificar tipo de error
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      return "He alcanzado mi límite de respuestas por hoy. Por favor, llama al 314 2157928 para atención inmediata.";
    }
    
    if (error.message?.includes("API key") || error.message?.includes("authentication")) {
      return "Hay un problema con mi configuración. Por favor, contacta al soporte técnico.";
    }
    
    // Usar respuestas de respaldo específicas
    return getBackupResponse(userMessage);
  }
}

/**
 * Función para verificar si la API key es válida
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    await generateChatbotResponse("Hola");
    return true;
  } catch (error) {
    console.error("Conexión a Gemini falló:", error);
    return false;
  }
}

/**
 * Exportar también la función de respaldo por si acaso
 */
export { getBackupResponse };