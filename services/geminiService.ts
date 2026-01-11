
import { GoogleGenAI, Type } from "@google/genai";
import { LeadData, QuizAnalysis } from "../types.ts";

export const analyzeLead = async (data: LeadData): Promise<QuizAnalysis> => {
  // Siempre creamos una instancia fresca antes de la llamada para asegurar el uso de la clave más reciente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const promptText = `Analiza este perfil de lead para una consultoría de negocios de alto impacto:
  Nombre: ${data.name}
  Etapa de Negocio: ${data.stage}
  Principal Desafío: ${data.challenge}
  Presupuesto Mensual: ${data.budget}
  Plazo para Resultados: ${data.timeline}
  
  Genera un objeto JSON con:
  1. "score": Un número del 1 al 100 indicando qué tan buen "fit" es para una consultoría premium.
  2. "verdict": Un resumen profesional y directo de su situación.
  3. "recommendation": Una razón poderosa de por qué debe agendar su sesión gratuita hoy mismo.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    if (!text) throw new Error("La IA no devolvió contenido.");
    
    return JSON.parse(text.trim()) as QuizAnalysis;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Propagamos el error para manejarlo en la UI (especialmente si es de permisos o cuota)
    throw error;
  }
};
