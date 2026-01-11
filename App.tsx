
import React, { useState } from 'react';
import { LeadData, QuizAnalysis, BusinessType, DiagnosisType, RevenueRange, GoalType } from './types.ts';
import { 
  ChevronRight, 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  Calendar,
  Loader2,
  User,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Sparkles,
  Trophy,
  Target,
  Globe
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null);
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    businessType: '' as any,
    currentDiagnosis: '' as any,
    revenue: '' as any,
    goal: '' as any
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  // Função para enviar os dados para o seu e-mail via FormSubmit (AJAX)
  const sendEmailNotification = async () => {
    setIsSending(true);
    const targetEmail = 'contacto.kngrowth@gmail.com';
    const payload = {
      _subject: `Novo Lead Quiz: ${leadData.name} (${analysis?.score}%)`,
      Nome: leadData.name,
      Score: `${analysis?.score}%`,
      Negocio: leadData.businessType,
      Diagnostico: leadData.currentDiagnosis,
      Faturamento: leadData.revenue,
      Objetivo: leadData.goal,
      Veredito: analysis?.verdict,
      Recomendacao: analysis?.recommendation,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      console.log('Notificação enviada para contacto.kngrowth@gmail.com');
    } catch (e) {
      console.error('Erro ao enviar notificação:', e);
    } finally {
      setIsSending(false);
      // Redireciona para o link de agendamento após o disparo do e-mail
      window.open(getBookingUrl(), '_blank');
    }
  };

  const generateAutomaticDiagnosis = (data: LeadData): QuizAnalysis => {
    let score = 65; 
    if (data.revenue === '+ R$ 10.000') score += 20;
    if (data.revenue === 'R$ 5.000 - 10.000') score += 15;
    if (data.goal === 'Os 3 anteriores') score += 10;
    if (score > 100) score = 99;

    const verdicts: Record<string, string> = {
      'Baixa conversão': 'Seu funil está retendo menos de 1% do tráfego. Você está perdendo dinheiro em cada clique.',
      'Conversão com leads desqualificados': 'Sua comunicação está atraindo curiosos, não compradores. É necessário filtrar seu público imediatamente.',
      'Conversão sem vendas': 'O problema está na oferta ou no fechamento. O lead chega, mas não confia o suficiente para pagar.',
      'Meu funil não converte': 'Há uma quebra estrutural na jornada do seu cliente que impede qualquer tração financeira.',
      'Quero fazer um lançamento': 'Lançamentos sem base sólida são arriscados. Você precisa de uma estrutura de validação antes de escalar.'
    };

    const recommendations: Record<string, string> = {
      'Serviço': 'Como prestador de serviços, sua escala depende de processos e posicionamento. Vamos profissionalizar sua aquisição.',
      'Infoproduto': 'Produtos digitais precisam de LPs agressivas e funis automáticos. Seu foco deve ser ROI.',
      'Cursos': 'Transformar alunos em fãs requer uma jornada clara. Vamos estruturar seu funil de vendas recorrentes.',
      'Mentorias': 'High ticket exige autoridade. Vamos posicionar você como a solução definitiva no mercado.'
    };

    return {
      score,
      verdict: verdicts[data.currentDiagnosis] || 'Identificamos gargalos críticos na sua operação comercial.',
      recommendation: recommendations[data.businessType] || 'É necessário um plano de ação imediato para atingir seus objetivos de faturamento.'
    };
  };

  const handleComplete = () => {
    setLoading(true);
    setTimeout(() => {
      const result = generateAutomaticDiagnosis(leadData);
      setAnalysis(result);
      setStep(6);
      setLoading(false);
    }, 1500);
  };

  const getBookingUrl = () => {
    const baseUrl = "https://api.highlevelowcost.com/widget/booking/plVbjiI0RPnBy1ygJqyy";
    const params = new URLSearchParams({
      first_name: leadData.name.split(' ')[0],
      full_name: leadData.name,
      diagnosis: leadData.currentDiagnosis,
      score: analysis?.score.toString() || '',
      revenue: leadData.revenue
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const updateLead = (updates: Partial<LeadData>) => {
    setLeadData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4 md:space-y-6">
              <div className="flex flex-col items-center gap-4">
                <img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" alt="REFLEX AC Logo" className="h-[22px] md:h-[28px] object-contain" />
                <div className="inline-block bg-white px-6 py-2.5 rounded-full shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] border border-slate-300">
                  <span className="text-slate-800 text-[11px] md:text-sm font-bold tracking-tight">Infoprodutores, Mentores e Donos de agencias</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">Escala o seu negócio com <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">dados reais.</span></h1>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <div className="group relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5 transition-colors group-focus-within:text-indigo-600" />
                <input 
                  type="text" 
                  placeholder="Seu nome completo..." 
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-100 border border-slate-400 text-slate-900 placeholder:text-slate-500 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-base font-bold shadow-sm"
                  value={leadData.name}
                  onChange={e => updateLead({ name: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button 
                disabled={!leadData.name}
                onClick={nextStep}
                className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-indigo-100 text-base md:text-lg"
              >
                Começar Avaliação <ChevronRight className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black"><ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Diagnóstico Profissional e Seguro</div>
            </div>
          </div>
        );

      case 1: return <SelectionStep title="Seu Negócio" description="Em qual categoria sua empresa se encaixa melhor?" options={['Serviço', 'Infoproduto', 'Cursos', 'Mentorias']} current={leadData.businessType} onSelect={(val) => { updateLead({ businessType: val as BusinessType }); setTimeout(nextStep, 300); }} onBack={prevStep} />;
      case 2: return <SelectionStep title="Diagnóstico" description="Qual é o seu maior desafio operacional hoje?" options={['Baixa conversão', 'Leads desqualificados', 'Conversão sem vendas', 'Meu funil não converte', 'Quero fazer um lançamento']} current={leadData.currentDiagnosis} onSelect={(val) => { updateLead({ currentDiagnosis: val as DiagnosisType }); setTimeout(nextStep, 300); }} onBack={prevStep} />;
      case 3: return <SelectionStep title="Faturamento" description="Média de faturamento mensal?" options={['R$ 0 - 2.000', 'R$ 2.000 - 5.000', 'R$ 5.000 - 10.000', '+ R$ 10.000']} current={leadData.revenue} onSelect={(val) => { updateLead({ revenue: val as RevenueRange }); setTimeout(nextStep, 300); }} onBack={prevStep} />;
      case 4: return <SelectionStep title="Objetivo" description="Prioridade máxima para os próximos 30 dias?" options={['Aumentar minhas vendas', 'Obter leads qualificados', 'Landing page profesional', 'Os 3 anteriores']} current={leadData.goal} onSelect={(val) => { updateLead({ goal: val as GoalType }); setTimeout(nextStep, 300); }} onBack={prevStep} />;
      
      case 5:
        return (
          <div className="space-y-8 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-indigo-100 blur-3xl rounded-full"></div>
              <div className="relative bg-white border border-slate-300 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl"><Rocket className="h-12 w-12 text-indigo-600" /></div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Diagnóstico Concluído.</h2>
              <p className="text-slate-800 text-sm md:text-lg leading-relaxed max-w-sm mx-auto px-4 font-bold">{leadData.name}, preparamos seu plano estratégico personalizado.</p>
            </div>
            <div className="flex flex-col items-center gap-4 px-4">
              <button onClick={handleComplete} disabled={loading} className="w-full max-w-xs bg-slate-900 text-white font-black py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50 text-base">
                {loading ? <>ANALISANDO... <Loader2 className="h-5 w-5 animate-spin" /></> : <>VER MEU SCORE <Zap className="h-5 w-5 fill-indigo-400 text-indigo-400" /></>}
              </button>
              <button onClick={prevStep} className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Revisar respostas</button>
            </div>
          </div>
        );

      case 6:
        return analysis ? (
          <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-4">
              <div className="flex justify-center"><img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" alt="REFLEX AC Logo" className="h-[22px] md:h-[28px] object-contain opacity-90" /></div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase">Potencial de Escala</h2>
              <div className="relative flex justify-center py-4">
                 <div className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-800 to-indigo-950">{analysis.score}<span className="text-3xl md:text-4xl font-bold ml-0.5 text-slate-400">%</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] space-y-4 border border-slate-400 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700"><Target className="h-5 w-5" /></div>
                <div><h3 className="text-slate-900 font-black text-sm md:text-base mb-1">Gargalo Identificado</h3><p className="text-slate-800 leading-relaxed text-sm md:text-base font-bold">{analysis.verdict}</p></div>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-[2rem] space-y-4 border border-slate-400 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700"><Sparkles className="h-5 w-5" /></div>
                <div><h3 className="text-slate-900 font-black text-sm md:text-base mb-1">Recomendação</h3><p className="text-slate-800 leading-relaxed text-sm md:text-base font-bold">{analysis.recommendation}</p></div>
              </div>
            </div>

            <div className="relative bg-white p-6 md:p-12 rounded-[2.5rem] text-center space-y-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-400">
               <div className="space-y-2">
                 <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Quer escalar este score?</h3>
                 <p className="text-slate-900 text-sm md:text-lg max-w-sm md:max-w-md mx-auto leading-relaxed px-2 font-bold">Reserve sua sessão estratégica gratuita agora. Seus dados serão enviados automaticamente para nossa equipe.</p>
               </div>
               <div className="flex flex-col gap-3 items-center w-full max-w-xs md:max-w-none mx-auto">
                 <button 
                   onClick={sendEmailNotification}
                   disabled={isSending}
                   className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-indigo-600 text-white font-black px-8 md:px-12 py-4 md:py-5 rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl text-base md:text-lg disabled:opacity-70"
                 >
                   {isSending ? <>ENVIANDO DADOS... <Loader2 className="h-5 w-5 animate-spin" /></> : <>Agendar Assessoria Gratuita <Calendar className="h-5 w-5" /></>}
                 </button>
                 <a href="https://reflexbr.com/home-2688" target="_blank" className="text-slate-600 font-bold px-6 py-3 rounded-xl hover:text-indigo-600 transition-colors text-sm underline"><Globe className="h-4 w-4 inline mr-1" /> Visitar nosso site oficial</a>
               </div>
               <div className="pt-4 border-t border-slate-200"><p className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase">Vagas limitadas para {new Date().toLocaleString('pt-BR', { month: 'long' })}</p></div>
            </div>
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center justify-center p-4 md:p-8">
      <div className="fixed inset-0 overflow-hidden -z-10 bg-[#f8fafc]">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-indigo-100/50 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2"></div>
      </div>
      <main className="w-full max-w-4xl relative z-10 py-6 md:py-12">
        {step > 0 && step < 6 && (
          <div className="mb-8 md:mb-12 flex justify-between items-center px-6 max-w-[300px] md:max-w-md mx-auto">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center flex-1 last:flex-none">
                <div className={`w-3 h-3 rounded-full transition-all duration-700 ${step >= num ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`} />
                {num < 5 && <div className={`h-px flex-1 mx-2 transition-all duration-1000 ${step > num ? 'bg-indigo-400' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        )}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] relative overflow-hidden border border-slate-400">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 space-y-8">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin" />
              <div className="space-y-2 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Gerando seu Diagnóstico...</h3>
                <p className="text-slate-600 text-sm md:text-base font-bold">Isso levará apenas alguns segundos.</p>
              </div>
            </div>
          ) : renderStep()}
        </div>
        {step < 6 && (
          <div className="mt-10 text-center opacity-70">
            <div className="inline-flex items-center gap-3"><span className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">Powered by</span><img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" alt="Reflex" className="h-4" /></div>
          </div>
        )}
      </main>
    </div>
  );
};

interface SelectionStepProps {
  title: string;
  description: string;
  options: string[];
  current: string;
  onSelect: (val: string) => void;
  onBack: () => void;
}

const SelectionStep: React.FC<SelectionStepProps> = ({ title, description, options, current, onSelect, onBack }) => {
  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase leading-tight">{title}</h2>
        <p className="text-slate-800 text-sm md:text-lg leading-relaxed max-w-md mx-auto font-bold">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 px-1">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`group text-left px-6 py-5 md:py-7 rounded-2xl border-2 transition-all flex items-center justify-between active:scale-[0.98] ${
              current === option ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/10' : 'border-slate-400 bg-white hover:border-indigo-600 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <span className={`font-bold text-sm md:text-xl tracking-tight ${current === option ? 'text-indigo-950' : 'text-slate-800'}`}>{option}</span>
            <div className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${current === option ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600'}`}><ArrowRight className="h-4 w-4 md:h-5 md:w-5" /></div>
          </button>
        ))}
      </div>
      <div className="flex justify-center pt-2"><button onClick={onBack} className="text-xs font-black text-slate-600 hover:text-indigo-600 uppercase tracking-[0.2em] border-b border-slate-300 hover:border-indigo-500 pb-1 transition-all">Voltar</button></div>
    </div>
  );
};

export default App;
