
export type BusinessStage = 'Idea' | 'Startup' | 'Crecimiento' | 'Consolidado';
export type Challenge = 'Ventas' | 'Marketing' | 'Operaciones' | 'Tecnología';
export type Budget = 'Menos de $1k' | '$1k - $5k' | '$5k - $20k' | 'Más de $20k';
export type Timeline = 'Inmediato' | '1-3 meses' | '3-6 meses' | 'Solo explorando';

export interface LeadData {
  name: string;
  email?: string;
  stage: BusinessStage;
  challenge: Challenge;
  budget: Budget;
  timeline: Timeline;
}

export interface QuizAnalysis {
  score: number;
  verdict: string;
  recommendation: string;
}
