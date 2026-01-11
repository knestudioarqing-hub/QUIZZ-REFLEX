
import { GoogleGenAI, Type } from "@google/genai";
import { LeadData, QuizAnalysis } from "../types.ts";

export const analyzeLead = async (data: LeadData): Promise<QuizAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analiza este perfil de lead para una consultoría de negocios de alto impacto:
  Nombre: ${data.name}
  ${data.email ? `Email: ${data.email}` : ''}
  Etapa de Negocio: ${data.stage}
  Principal Desafío: ${data.challenge}
  Presupuesto: ${data.budget}
  Plazo: ${data.timeline}
  
  Proporciona un puntaje del 1 al 100 de "Fit" con una consultoría premium, un veredicto profesional de su situación actual y una recomendación específica de por qué debería agendar una asesoría gratuita ahora mismo.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Puntaje de 1 a 100" },
          verdict: { type: Type.STRING, description: "Resumen de la situación del lead" },
          recommendation: { type: Type.STRING, description: "Por qué agendar la asesoría" }
        },
        required: ["score", "verdict", "recommendation"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim()) as QuizAnalysis;
  } catch (e) {
    console.error("Error parsing Gemini response", e);
    return {
      score: 75,
      verdict: "Perfil interesante con necesidades claras de crecimiento.",
      recommendation: "Es el momento ideal para escalar tus operaciones con ayuda experta."
    };
  }
};
