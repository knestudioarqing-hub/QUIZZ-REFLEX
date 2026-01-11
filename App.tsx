
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
  Sparkles,
  Target,
  Globe,
  CheckCircle2,
  AlertCircle,
  TrendingUp
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
  { id: 20, text: "Qual seria o próximo passo más inteligente para aumentar suas conversões?", options: ["Estruturar uma landing page estratégica com automações", "Ajustar alguns detalhes na página atual", "Continuar testando sozinho", "Ainda não é prioridade"] }
];

const App: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Name, 1-20: Questions, 21: Analysis Start, 22: Results
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<number[]>([]); // Almacena el índice de la opción elegida (0=A, 1=B, 2=C, 3=D)
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
    <div className="min-h-screen relative flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-50 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-indigo-100/40 rounded-full blur-[140px] -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2"></div>
      </div>

      <main className="w-full max-w-6xl h-full flex flex-col justify-center relative z-10 py-1 sm:py-2">
        {/* Progress Bar */}
        {step > 0 && step <= 20 && (
          <div className="mb-2 sm:mb-4 max-w-md mx-auto w-full px-4">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Progresso</span>
              <span className="text-xs font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500 ease-out rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className={`bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-slate-200 relative overflow-hidden transition-all duration-500 flex flex-col min-h-[85vh] sm:min-h-[70vh] justify-center ${step === 0 ? 'pt-6 sm:pt-8' : ''}`}>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-8 animate-pulse">
              <div className="relative">
                 <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-slate-100 border-t-indigo-600 border-t-2 animate-spin" />
                 <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-600 animate-bounce" />
              </div>
              <div className="space-y-4 text-center">
                <h3 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic">Auditando sua Estrutura...</h3>
                <p className="text-slate-500 text-sm md:text-lg font-bold max-w-sm mx-auto leading-relaxed">Cruzando respostas com benchmarks de mercado para calcular seu potencial real de escala.</p>
              </div>
            </div>
          ) : step === 0 ? (
            <div className="space-y-6 sm:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col items-center">
              <div className="text-center space-y-4 sm:space-y-8 w-full">
                <img 
                  src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" 
                  alt="REFLEX AC" 
                  className="h-[18px] md:h-[24px] mx-auto object-contain transition-all" 
                />
                <h1 className="text-3xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1] max-w-4xl mx-auto px-2">
                  Descubra o Score de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Escala Estratégica</span> do seu negócio.
                </h1>
                <p className="text-slate-500 font-bold text-base md:text-2xl max-w-2xl mx-auto">Responda 20 perguntas rápidas e receba um diagnóstico completo.</p>
              </div>
              <div className="max-w-md w-full mx-auto space-y-6 sm:space-y-8">
                <div className="group relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-6 w-6 transition-colors group-focus-within:text-indigo-600" />
                  <input 
                    type="text" 
                    placeholder="Seu nome..." 
                    className="w-full pl-14 pr-6 py-4 sm:py-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all outline-none text-base md:text-lg font-bold shadow-sm"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <button 
                  disabled={!name}
                  onClick={handleNext}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white font-black py-4 sm:py-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 text-xl group active:scale-[0.98]"
                >
                  Iniciar Auditoria <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest pt-4"><ShieldCheck className="w-4 h-4" /> Diagnóstico Oficial Reflex AC</div>
            </div>
          ) : step <= 20 ? (
            <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-right-6 duration-500 flex flex-col flex-1 justify-center">
              <div className="text-center space-y-3 sm:space-y-6">
                <span className="text-[10px] sm:text-xs font-black text-indigo-500 tracking-[0.4em] uppercase">Pergunta {step} de 20</span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto px-4">
                  {QUESTIONS[step - 1].text}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 lg:gap-8 w-full max-w-5xl mx-auto">
                {QUESTIONS[step - 1].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[step - 1] = idx;
                      setAnswers(newAnswers);
                      handleNext();
                    }}
                    className="group text-left p-5 sm:p-10 lg:p-12 rounded-3xl border border-slate-200 bg-white hover:border-indigo-600 hover:bg-slate-50 transition-all flex items-center justify-between active:scale-[0.98] shadow-sm min-h-[90px] sm:min-h-[140px]"
                  >
                    <span className="font-bold text-sm sm:text-xl lg:text-2xl text-slate-700 group-hover:text-indigo-900 leading-tight">{option}</span>
                    <ArrowRight className="h-6 w-6 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0 ml-4" />
                  </button>
                ))}
              </div>
              <div className="flex justify-center pt-2 sm:pt-6">
                <button onClick={handleBack} className="text-xs sm:text-sm font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-all px-6 py-3">Voltar</button>
              </div>
            </div>
          ) : step === 21 ? (
            <div className="space-y-8 sm:space-y-12 text-center animate-in zoom-in-95 duration-700 py-10 flex flex-col items-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-indigo-100 blur-[80px] rounded-full"></div>
                <div className="relative bg-white border border-slate-200 w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl"><Rocket className="h-12 w-12 sm:h-16 sm:w-16 text-indigo-600" /></div>
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Dados Coletados.</h2>
                <p className="text-slate-500 text-lg sm:text-2xl font-bold max-w-xl mx-auto">{name}, sua jornada de 20 passos terminou. Vamos revelar sua pontuação estratégica?</p>
              </div>
              <div className="flex flex-col items-center gap-6 px-4 w-full max-w-sm">
                <button onClick={handleComplete} className="w-full bg-slate-900 text-white font-black py-5 sm:py-7 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl hover:bg-black text-xl group active:scale-[0.98]">
                  Ver Meu Score <Zap className="h-6 w-6 fill-indigo-400 text-indigo-400 group-hover:scale-125 transition-transform" />
                </button>
                <button onClick={() => setStep(20)} className="text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Revisar última resposta</button>
              </div>
            </div>
          ) : (
            <div className="space-y-10 sm:space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 py-6 sm:py-10 flex flex-col flex-1">
              <div className="text-center space-y-4 sm:space-y-6">
                <img 
                  src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" 
                  alt="REFLEX AC" 
                  className="h-[18px] sm:h-[22px] mx-auto opacity-70" 
                />
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter uppercase">Diagnóstico Final</h2>
                <div className="relative flex justify-center">
                   <div className="text-[6rem] sm:text-[10rem] md:text-[14rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-700 to-indigo-950 leading-[0.9]">
                     {analysis?.score}
                     <span className="text-3xl sm:text-5xl md:text-7xl font-bold ml-1 text-slate-300">/100</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-6xl mx-auto w-full">
                <div className="bg-slate-50 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] space-y-6 border border-slate-200">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100"><Target className="h-6 w-6 sm:h-8 sm:w-8" /></div>
                  <div className="space-y-3">
                    <h3 className="text-slate-900 font-black text-xl sm:text-2xl uppercase tracking-tight">O Veredito</h3>
                    <p className="text-slate-600 leading-relaxed font-bold text-base sm:text-xl">{analysis?.verdict}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] space-y-6 border border-slate-200">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[1.5rem] bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100"><TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" /></div>
                  <div className="space-y-3">
                    <h3 className="text-slate-900 font-black text-xl sm:text-2xl uppercase tracking-tight">Plano de Ação</h3>
                    <p className="text-slate-600 leading-relaxed font-bold text-base sm:text-xl">{analysis?.recommendation}</p>
                  </div>
                </div>
              </div>

              <div className="relative bg-indigo-600 p-8 sm:p-16 md:p-20 rounded-[2.5rem] sm:rounded-[4rem] text-center space-y-8 sm:space-y-12 shadow-2xl shadow-indigo-200 overflow-hidden mx-auto w-full max-w-5xl">
                 <div className="absolute top-0 right-0 p-4 sm:p-12 opacity-10 pointer-events-none transition-transform duration-1000 rotate-12"><Zap className="h-40 w-40 sm:h-64 sm:w-64 text-white" /></div>
                 <div className="space-y-6 relative z-10">
                   <h3 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1]">Quer transformar esse score em faturamento real?</h3>
                   <p className="text-indigo-100 text-lg sm:text-2xl md:text-3xl max-w-3xl mx-auto font-medium leading-relaxed">
                     Nós já auditamos seu perfil. O próximo passo é uma sessão estratégica 1-a-1 gratuita para traçar seu plano de implementação.
                   </p>
                 </div>
                 <div className="flex flex-col gap-6 items-center relative z-10">
                   <button 
                     onClick={sendEmailNotification}
                     disabled={isSending}
                     className="w-full md:w-auto inline-flex items-center justify-center gap-4 bg-white text-indigo-600 font-black px-10 sm:px-20 py-5 sm:py-8 rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl text-xl sm:text-3xl disabled:opacity-70 group"
                   >
                     {isSending ? <Loader2 className="h-8 w-8 animate-spin" /> : <>RESERVAR MINHA SESSÃO AGORA <Calendar className="h-8 w-8" /></>}
                   </button>
                   <p className="text-indigo-200 text-xs sm:text-sm font-black uppercase tracking-[0.4em] flex items-center gap-3">
                     <CheckCircle2 className="h-5 w-5" /> Vagas limitadas para {new Date().toLocaleString('pt-BR', { month: 'long' })}
                   </p>
                 </div>
              </div>

              <div className="text-center pt-4 pb-4">
                <a href="https://reflexbr.com/home-2688" target="_blank" className="text-slate-400 font-bold hover:text-indigo-600 transition-colors text-base flex items-center justify-center gap-2">
                  <Globe className="h-5 w-5" /> Ver resultados de quem já aplicou o diagnóstico
                </a>
              </div>
            </div>
          )}
        </div>
        
        {step < 22 && (
          <div className="mt-2 sm:mt-4 text-center pb-2">
            <div className="inline-flex items-center gap-3 grayscale opacity-30">
              <span className="text-[10px] font-black text-slate-600 tracking-widest uppercase">Inteligência Estratégica</span>
              <img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" alt="Reflex" className="h-4" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
