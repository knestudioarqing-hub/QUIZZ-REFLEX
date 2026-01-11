
import React, { useState, useMemo } from 'react';
import { QuizAnalysis } from './types.ts';
import { 
  ChevronRight, 
  Zap, 
  Calendar,
  Loader2,
  User,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Target,
  Globe,
  CheckCircle2,
  TrendingUp,
  FileText,
  Award
} from 'lucide-react';

const QUESTIONS = [
  { id: 1, text: "Quando alguém entra hoje na sua página, qual é a primeira impressão que ela passa?", options: ["Profissional e confiável", "Boa, mas poderia ser melhor", "Simples demais", "Amadora ou confusa"] },
  { id: 2, text: "Você sente que sua página transmite autoridade no seu mercado?", options: ["Sim, claramente", "Em parte", "Muito pouco", "Não transmite nada"] },
  { id: 3, text: "Quantos visitantes entram na sua página por mês?", options: ["Mais de 5.000", "Entre 1.000 e 5.000", "Menos de 1.000", "Não sei / não acompanho"] },
  { id: 4, text: "O que mais acontece quando alguém preenche seu formulário?", options: ["Vira cliente rapidamente", "Demonstra interesse real", "Faz muitas perguntas e some", "Só curiosidade, sem intenção de compra"] },
  { id: 5, text: "Hoje você sente que está desperdiçando tráfego pago ou orgânico?", options: ["Não, tudo é bem aproveitado", "Um pouco", "Bastante", "Com certeza"] },
  { id: 6, text: "Sua landing page foi criada com foco em conversão ou só em design?", options: ["Conversão estratégica", "Um poco dos dois", "Mais design que conversão", "Só para “estar no ar”"] },
  { id: 7, text: "Sua página conversa diretamente com a dor do seu cliente ideal?", options: ["Sim, de forma clara", "Mais ou menos", "Muito pouco", "Não conversa"] },
  { id: 8, text: "Você usa automações após o lead se cadastrar?", options: ["Sim, bem estruturadas", "Algumas automações simples", "Quase nada", "Nenhuma automação"] },
  { id: 9, text: "O que acontece depois que o lead entra no funil?", options: ["Recebe mensagens estratégicas", "Recebe algo genérico", "Fica parado no CRM", "Não existe funil"] },
  { id: 10, text: "Você mede a taxa de conversão da sua landing page?", options: ["Sim, constantemente", "Às vezes", "Raramente", "Nunca medi"] },
  { id: 11, text: "Quanto valeria para você receber apenas leads realmente qualificados?", options: ["Mudaria completamente meu negócio", "Ajudaria muito", "Seria positivo", "Nunca pensei nisso"] },
  { id: 12, text: "Se sua página transmitisse mais profissionalismo, o que mudaria?", options: ["Aumentaria a confiança do cliente", "Melhoraria a percepção de valor", "Facilitaria o fechamento de vendas", "Todas as opções acima"] },
  { id: 13, text: "Hoje seus leads entendem claramente o valor da sua oferta?", options: ["Sim, entendem perfeitamente", "Entendem parcialmente", "Ficam confusos", "Não entendem"] },
  { id: 14, text: "Você sente que poderia cobrar mais pelo seu serviço ou produto?", options: ["Sim, com certeza", "Talvez", "Pouco", "Não"] },
  { id: 15, text: "Qual é hoje o maior obstáculo para converter mais vendas?", options: ["Falta de volume de leads", "Leads desqualificados", "Falta de processo estruturado", "Falta de uma landing page estratégica"] },
  { id: 16, text: "Se sua landing page convertesse mais, o impacto seria:", options: ["Crescimento imediato", "Aumento gradual", "Melhor organização do processo", "Ainda não sei"] },
  { id: 17, text: "Você estaria disposto a investir em uma landing page estratégica com automações?", options: ["Sim, agora", "Sim, em breve", "Talvez", "Não no momento"] },
  { id: 18, text: "O que você mais espera de uma landing page de alta conversão?", options: ["Mais vendas", "Leads mais qualificados", "Autoridade profissional", "Todos os itens acima"] },
  { id: 19, text: "Se você tivesse um funil automatizado hoje, isso ajudaria a vender mais?", options: ["Com certeza", "Provavelmente", "Talvez", "Não sei"] },
  { id: 20, text: "Qual seria o próximo passo mais inteligente para aumentar suas conversões?", options: ["Estruturar uma landing page estratégica com automações", "Ajustar alguns detalhes na página atual", "Continuar testando sozinho", "Ainda não é prioridade"] }
];

const App: React.FC = () => {
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => Math.max(0, prev - 1));

  const calculateResults = (): QuizAnalysis => {
    const pointsMap = [5, 3, 1, 0];
    const totalScore = answers.reduce((acc, curr) => acc + pointsMap[curr], 0);
    
    if (totalScore >= 85) {
      return {
        score: totalScore,
        verdict: "Perfil Elite: Seu negócio está maduro, mas você está em um platô de escala por falta de automação avançada.",
        recommendation: "Otimizar o funil atual com Landing Pages de alta performance e automações de fechamento imediato para maximizar o ROI."
      };
    } else if (totalScore >= 60) {
      return {
        score: totalScore,
        verdict: "Potencial Inexplorado: Você tem tração, mas perde 40% do faturamento por leads desqualificados e processos manuais.",
        recommendation: "Implementar uma estrutura de qualificação automática e uma página que transmita autoridade instantânea."
      };
    } else if (totalScore >= 30) {
      return {
        score: totalScore,
        verdict: "Zona de Risco: Seu processo de vendas é frágil e depende de sorte. O custo de aquisição está acima do ideal.",
        recommendation: "Reestruturação total da jornada do cliente. Começar por uma Landing Page estratégica que resolva a dor do lead."
      };
    } else {
      return {
        score: totalScore,
        verdict: "Estado Crítico: Sua presença digital atual está afastando potenciais clientes e desperdiçando seu tempo.",
        recommendation: "Parar de testar sozinho e construir um funil profissional do zero antes de investir mais em tráfego."
      };
    }
  };

  const handleComplete = () => {
    setLoading(true);
    setTimeout(() => {
      const result = calculateResults();
      setAnalysis(result);
      setStep(22);
      setLoading(false);
    }, 3500);
  };

  const sendEmailNotification = async () => {
    setIsSending(true);
    const targetEmail = 'contacto.kngrowth@gmail.com';
    const payload = {
      _subject: `🔥 QUIZ 20P - LEAD: ${name} (${analysis?.score}%)`,
      Nome: name,
      Score: `${analysis?.score}/100`,
      Veredicto: analysis?.verdict,
      Recomendação: analysis?.recommendation,
      "Resumo das Respostas": answers.map((a, i) => `Q${i+1}: ${QUESTIONS[i].options[a]}`).join(' | '),
      _template: 'table',
      _captcha: 'false'
    };

    try {
      await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
      window.open("https://api.highlevelowcost.com/widget/booking/plVbjiI0RPnBy1ygJqyy", '_blank');
    }
  };

  const progress = useMemo(() => {
    if (step <= 0) return 0;
    if (step >= 21) return 100;
    return Math.round((step / 20) * 100);
  }, [step]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-[#fbfbfd] overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Aurora Effects */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-blue-50 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <main className="w-full max-w-5xl relative z-10 flex flex-col items-center">
        
        {/* Progress Tracker (Floating pill) */}
        {step > 0 && step <= 20 && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-full px-6 py-2.5 shadow-sm flex items-center gap-4">
               <span className="text-[10px] font-extrabold text-slate-400 tracking-[0.2em] uppercase">Progresso</span>
               <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
               </div>
               <span className="text-xs font-bold text-indigo-600 w-8">{progress}%</span>
            </div>
          </div>
        )}

        <div className={`w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
          ${step === 22 ? 'max-w-6xl' : 'max-w-4xl'}
          bg-white border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] rounded-[2.5rem] 
          ${step === 0 ? 'p-8 sm:p-16 lg:p-24' : 'p-6 sm:p-12 lg:p-16'}
          flex flex-col min-h-[600px] justify-center relative overflow-hidden`}>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-12 animate-in fade-in duration-1000">
              <div className="relative">
                 <div className="w-24 h-24 rounded-full border-[3px] border-slate-100 border-t-indigo-600 animate-spin" />
                 <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-600/40" />
              </div>
              <div className="text-center space-y-4 max-w-sm">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase italic">Gerando Diagnóstico</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Cruzando seus dados com nossa matriz de escala estratégica para definir seu próximo passo ideal.</p>
              </div>
            </div>
          ) : step === 0 ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center text-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/50 mb-2">
                   <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Auditoria Exclusiva 2024</span>
                </div>
                <img 
                  src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" 
                  alt="Reflex" 
                  className="h-6 sm:h-8 mx-auto mb-10 opacity-90" 
                />
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1] max-w-4xl mx-auto">
                  Descubra o Score de <span className="text-indigo-600 italic">Escala Estratégica</span> do seu negócio.
                </h1>
                <p className="text-slate-500 font-medium text-lg sm:text-2xl max-w-2xl mx-auto leading-relaxed">
                  Receba um diagnóstico completo do seu funil e uma recomendação personalizada em menos de 3 minutos.
                </p>
              </div>

              <div className="w-full max-w-md space-y-6 mt-4">
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Seu nome" 
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none text-lg font-bold shadow-sm"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <button 
                  disabled={!name}
                  onClick={handleNext}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 text-xl group active:scale-[0.98]"
                >
                  Iniciar Diagnóstico <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="flex items-center gap-6 opacity-30 pt-8">
                 <img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" className="h-4 grayscale" alt="Logo" />
                 <div className="h-4 w-px bg-slate-400"></div>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Reflex AC Intelligence</span>
              </div>
            </div>
          ) : step <= 20 ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col flex-1 justify-center space-y-12">
              <div className="space-y-6 text-center">
                <span className="inline-block px-3 py-1 rounded-md bg-slate-100 text-[10px] font-black text-slate-500 tracking-widest uppercase mb-4">
                  Etapa {step} / 20
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-3xl mx-auto">
                  {QUESTIONS[step - 1].text}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full max-w-4xl mx-auto">
                {QUESTIONS[step - 1].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[step - 1] = idx;
                      setAnswers(newAnswers);
                      handleNext();
                    }}
                    className="group text-left p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-between active:scale-[0.98] shadow-sm min-h-[90px] lg:min-h-[110px]"
                  >
                    <span className="font-bold text-sm sm:text-lg lg:text-xl text-slate-700 group-hover:text-indigo-900 leading-snug">{option}</span>
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all shrink-0 ml-4">
                       <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <button onClick={handleBack} className="text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-all px-6 py-2 border border-transparent hover:border-slate-200 rounded-full">
                  Voltar
                </button>
              </div>
            </div>
          ) : step === 21 ? (
            <div className="text-center space-y-12 animate-in zoom-in-95 duration-700 py-12 flex flex-col items-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-4 relative">
                 <div className="absolute inset-0 bg-indigo-400/10 blur-2xl rounded-full"></div>
                 <Rocket className="h-12 w-12 sm:h-16 sm:w-16 text-indigo-600 relative z-10" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">Finalizado.</h2>
                <p className="text-slate-500 text-lg sm:text-2xl font-medium max-w-xl mx-auto leading-relaxed">
                  Excelente, <span className="text-indigo-600 font-bold">{name}</span>. Seus dados foram processados com sucesso.
                </p>
              </div>
              <button 
                onClick={handleComplete} 
                className="w-full max-w-xs bg-slate-900 text-white font-extrabold py-5 sm:py-6 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-2xl hover:bg-black text-xl group active:scale-[0.98]"
              >
                Ver Meu Score <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-16 py-8">
              
              {/* Report Header */}
              <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-end justify-between border-b border-slate-100 pb-12">
                 <div className="space-y-4 text-center lg:text-left flex-1">
                    <img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" alt="Reflex" className="h-5 mb-8 opacity-60 mx-auto lg:mx-0" />
                    <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">Diagnóstico<br/>Estratégico</h2>
                    <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">ID Auditoria: #{Math.floor(Math.random() * 999999)}</p>
                 </div>
                 
                 <div className="relative group shrink-0">
                    <div className="absolute inset-0 bg-indigo-600/10 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex flex-col items-center">
                       <span className="text-[10rem] sm:text-[13rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-700 to-slate-950 leading-[0.8] tracking-tighter">
                         {analysis?.score}
                       </span>
                       <span className="text-slate-300 font-extrabold text-2xl sm:text-4xl mt-[-20px]">PONTOS / 100</span>
                    </div>
                 </div>
              </div>

              {/* Insights Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="bg-[#f8fafc] p-8 sm:p-12 rounded-[2.5rem] border border-slate-200/50 space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                     <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Award className="h-5 w-5" />
                     </div>
                     <h3 className="text-slate-900 font-black text-xl uppercase tracking-tight">O Veredito</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-bold text-lg sm:text-xl">
                    {analysis?.verdict}
                  </p>
                </div>

                <div className="bg-[#f8fafc] p-8 sm:p-12 rounded-[2.5rem] border border-slate-200/50 space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                     <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                        <TrendingUp className="h-5 w-5" />
                     </div>
                     <h3 className="text-slate-900 font-black text-xl uppercase tracking-tight">Próximos Passos</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-bold text-lg sm:text-xl">
                    {analysis?.recommendation}
                  </p>
                </div>
              </div>

              {/* High Impact CTA */}
              <div className="relative bg-[#0f172a] p-10 sm:p-16 lg:p-20 rounded-[3rem] text-center space-y-10 shadow-2xl overflow-hidden group">
                 <div className="absolute top-[-20%] right-[-10%] opacity-10 pointer-events-none group-hover:translate-x-[-20px] transition-transform duration-1000">
                    <Zap className="h-[400px] w-[400px] text-white" />
                 </div>
                 
                 <div className="space-y-6 relative z-10 max-w-3xl mx-auto">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/5 backdrop-blur-sm text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-4">
                      <Target className="w-3.5 h-3.5" /> Foco em Resultados Reais
                   </div>
                   <h3 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1]">
                     Pronto para escalar seu faturamento?
                   </h3>
                   <p className="text-slate-400 text-lg sm:text-2xl font-medium leading-relaxed">
                     Já identificamos as falhas. Agora, agende uma sessão estratégica individual gratuita para desenharmos seu novo funil de alta conversão.
                   </p>
                 </div>

                 <div className="flex flex-col gap-6 items-center relative z-10">
                   <button 
                     onClick={sendEmailNotification}
                     disabled={isSending}
                     className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-indigo-600 text-white font-black px-12 lg:px-20 py-6 lg:py-8 rounded-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] text-xl sm:text-3xl disabled:opacity-70"
                   >
                     {isSending ? (
                       <Loader2 className="h-8 w-8 animate-spin" />
                     ) : (
                       <>AGENDAR MINHA ASESSORIA GRATUITA <Calendar className="h-8 w-8" /></>
                     )}
                   </button>
                   <div className="flex items-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
                     <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Vagas Limitadas</span>
                     <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
                     <span>{new Date().toLocaleString('pt-BR', { month: 'long' })} 2024</span>
                   </div>
                 </div>
              </div>

              <div className="text-center pt-8 border-t border-slate-100">
                <a href="https://reflexbr.com/home-2688" target="_blank" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors text-base group px-6 py-3 rounded-full hover:bg-slate-50">
                  <Globe className="h-5 w-5" /> Ver estudos de caso da Reflex AC <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer branding */}
        <div className="mt-12 opacity-30 flex items-center gap-4 animate-in fade-in duration-1000">
          <span className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Built with KN Growth Engineering</span>
          <div className="h-4 w-px bg-slate-300"></div>
          <img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" alt="Reflex" className="h-4" />
        </div>
      </main>
    </div>
  );
};

export default App;
