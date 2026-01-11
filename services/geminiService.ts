
import { GoogleGenAI, Type } from "@google/genai";
import { LeadData, QuizAnalysis } from "../types.ts";

export const analyzeLead = async (data: LeadData): Promise<QuizAnalysis> => {
  // Verificación básica de la API Key antes de proceder
  if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
    throw new Error("API_KEY_MISSING: No se encontró una clave de API configurada.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const promptText = `Eres un experto analista de negocios. Evalúa el siguiente perfil:
  Nombre: ${data.name}
  Etapa: ${data.stage}
  Desafío: ${data.challenge}
  Presupuesto: ${data.budget}
  Plazo: ${data.timeline}
  
  Devuelve UNICAMENTE un objeto JSON con estas claves exactas:
  - score: (número del 1 al 100)
  - verdict: (situación actual en 1 frase)
  - recommendation: (por qué agendar la asesoría en 1 frase)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["score", "verdict", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE: La IA no devolvió ningún texto.");
    
    return JSON.parse(text.trim()) as QuizAnalysis;
  } catch (error: any) {
    // Extraemos el mensaje de error real para ayudar al diagnóstico
    const apiError = error?.message || error?.toString() || "Error desconocido";
    console.error("Detalle del error en Gemini:", apiError);
    throw new Error(apiError);
  }
};
