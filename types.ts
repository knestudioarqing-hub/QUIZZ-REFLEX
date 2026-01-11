
export type BusinessType = 'Serviço' | 'Infoproduto' | 'Cursos' | 'Mentorias';
export type DiagnosisType = 'Baixa conversão' | 'Conversão com leads desqualificados' | 'Conversão sem vendas' | 'Meu funil não converte' | 'Quero fazer um lançamento';
export type RevenueRange = 'R$ 0 - 2.000' | 'R$ 2.000 - 5.000' | 'R$ 5.000 - 10.000' | '+ R$ 10.000';
export type GoalType = 'Aumentar minhas vendas' | 'Obter leads qualificados' | 'Uma landing page profissional e de alta conversão' | 'Os 3 anteriores';

export interface LeadData {
  name: string;
  businessType: BusinessType;
  currentDiagnosis: DiagnosisType;
  revenue: RevenueRange;
  goal: GoalType;
}

export interface QuizAnalysis {
  score: number;
  verdict: string;
  recommendation: string;
}
