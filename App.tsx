import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  { id: 9, text: "O que acontece depois que le lead entra no funil?", options: ["Recebe mensagens estratégicas", "Recebe algo genérico", "Fica parado no CRM", "Não existe funil"] },
  { id: 10, text: "Você mede a taxa de conversão da sua landing page?", options: ["Sim, constantemente", "Às vezes", "Raramente", "Nunca medi"] },
  { id: 11, text: "Quanto valeria para você receber apenas leads realmente qualificados?", options: ["Mudaria completamente meu negócio", "Ajudaria muito", "Seria positivo", "Nunca pensei nisso"] },
  { id: 12, text: "Se sua página transmitisse mais profissionalismo, o que mudaria?", options: ["Aumentaria a confiança do cliente", "Melhoraria a percepção de valor", "Facilitaria o fechamento de vendas", "Todas as opções acima"] },
  { id: 13, text: "Hoje seus leads entendem claramente o valor da sua oferta?", options: ["Sim, entendem perfeitamente", "Entendem parcialmente", "Ficam confusos", "Não entendem"] },
  { id: 14, text: "Você sente que poderia cobrar mais pelo seu serviço ou produto?", options: ["Sim, com certeza", "Talvez", "Pouco", "Não"] },
  { id: 15, text: "Qual é hoy o maior obstáculo para converter mais vendas?", options: ["Falta de volume de leads", "Leads desqualificados", "Falta de processo estruturado", "Falta de uma landing page estratégica"] },
  { id: 16, text: "Se sua landing page convertesse mais, o impacto seria:", options: ["Crescimento imediato", "Aumento gradual", "Melhor organization do processo", "Ainda não sei"] },
  { id: 17, text: "Você estaria disposto a investir em uma landing page estratégica com automações?", options: ["Sim, agora", "Sim, em breve", "Talvez", "Não no momento"] },
  { id: 18, text: "O que você mais espera de uma landing page de alta conversão?", options: ["Mais vendas", "Leads mais qualificados", "Autoridade profissional", "Todos os itens acima"] },
  { id: 19, text: "Se você tivesse um funil automatizado hoje, isso ajudaria a vender mais?", options: ["Com certeza", "Provavelmente", "Talvez", "Não sei"] },
  { id: 20, text: "Qual seria o próximo passo más inteligente para aumentar suas conversões?", options: ["Estruturar uma landing page estratégica com automações", "Ajustar alguns detalhes na página atual", "Continuar testando sozinho", "Ainda não é prioridade"] }
];

const App: React.FC = () => {
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null);
  
  const sentCheckpoints = useRef<Set<number>>(new Set());

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => Math.max(0, prev - 1));

  const sendProgressNotification = async (percentage: number) => {
    const targetEmail = 'contacto.kngrowth@gmail.com';
    const payload = {
      _subject: `⚡ QUIZ PROGRESSO [${percentage}%] - LEAD: ${name}`,
      Nome: name,
      Progresso: `${percentage}%`,
      Mensagem: `O lead ${name} acabou de atingir ${percentage}% do quiz de diagnóstico.`,
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
    }
  };

  useEffect(() => {
    if (step === 9 && !sentCheckpoints.current.has(9)) {
      sentCheckpoints.current.add(9);
      sendProgressNotification(45);
    }
    if (step === 16 && !sentCheckpoints.current.has(16)) {
      sentCheckpoints.current.add(16);
      sendProgressNotification(80);
    }
  }, [step]);

  const calculateResults = (): QuizAnalysis => {
    const pointsMap = [5, 3, 1, 0];
    const totalScore = answers.reduce((acc, curr) => acc + pointsMap[curr], 0);
    
    if (totalScore >= 85) {
      return {
        score: totalScore,
        verdict: "Perfil Elite: Seu negócio está maduro, mas você está em um platô de escala por falta de automação avançada.",
        recommendation: "Otimizar o funil atual com Landing Pages de alta performance e automações de fechamento imediato."
      };
    } else if (totalScore >= 60) {
      return {
        score: totalScore,
        verdict: "Potencial Inexplorado: Você perde faturamento por leads desqualificados e processos manuais.",
        recommendation: "Implementar qualificação automática e uma página de autoridade instantânea."
      };
    } else if (totalScore >= 30) {
      return {
        score: totalScore,
        verdict: "Zona de Risco: Seu processo de vendas é frágil. O custo de aquisição está acima do ideal.",
        recommendation: "Reestruturação total da jornada. Começar por uma Landing Page estratégica."
      };
    } else {
      return {
        score: totalScore,
        verdict: "Estado Crítico: Sua presença digital está afastando potenciais clientes e desperdiçando tempo.",
        recommendation: "Construir um funil profissional do zero antes de investir mais em tráfego."
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
      _subject: `🔥 QUIZ COMPLETO - LEAD: ${name} (${analysis?.score}%)`,
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
    <div className="h-screen w-screen overflow-y-auto bg-[#fbfbfd] selection:bg-[#3E5ABA]/20 selection:text-[#050637] relative">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-[#E2E7EF] rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#899EC8]/10 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="min-h-full w-full flex flex-col items-center justify-center p-2 sm:p-6 relative z-10">
        <main className="w-full max-w-7xl flex flex-col items-center justify-center py-4 sm:py-8">
          
          {/* Progress Tracker */}
          {step > 0 && step <= 20 && (
            <div className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md border border-[#E2E7EF] rounded-full px-4 sm:px-6 py-1.5 sm:py-2.5 shadow-sm flex items-center gap-3 sm:gap-4 pointer-events-auto">
                 <span className="text-[8px] sm:text-[10px] font-extrabold text-[#686A86] tracking-widest uppercase">Progresso</span>
                 <div className="w-20 sm:w-32 h-1 bg-[#E2E7EF] rounded-full overflow-hidden">
                   <div className="h-full bg-[#1D2889] transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
                 </div>
                 <span className="text-[10px] sm:text-xs font-bold text-[#1D2889]">{progress}%</span>
              </div>
            </div>
          )}

          <div className={`w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
            ${step === 22 
              ? 'max-w-7xl bg-transparent shadow-none' 
              : `bg-white border border-[#E2E7EF] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] ${step === 0 ? 'max-w-6xl' : 'max-w-4xl'}`
            }
            rounded-[1.25rem] sm:rounded-[2.5rem] 
            ${step === 22 ? 'p-0' : step === 0 ? 'p-6 sm:p-12 lg:p-16' : 'p-3 sm:p-6 lg:p-10'}
            flex flex-col relative`}>
            
            <div className="flex flex-col justify-center py-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-10 animate-in fade-in duration-1000">
                  <div className="relative">
                     <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-[3px] border-[#E2E7EF] border-t-[#1D2889] animate-spin" />
                     <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 sm:h-8 sm:w-8 text-[#1D2889]/30" />
                  </div>
                  <div className="text-center space-y-4 max-w-sm px-4">
                    <h3 className="text-lg sm:text-2xl font-black text-[#050637] tracking-tight uppercase italic">Gerando Diagnóstico</h3>
                    <p className="text-xs sm:text-base text-[#444E68] font-medium leading-relaxed">Cruzando seus dados estrategicamente.</p>
                  </div>
                </div>
              ) : step === 0 ? (
                // --- STEP 0: START SCREEN (DESKTOP REDESIGN) ---
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    
                    {/* Left Column: Value Prop */}
                    <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8">
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2E7EF]/50 border border-[#E2E7EF] self-center lg:self-start">
                         <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1D2889]" />
                         <span className="text-[8px] sm:text-[10px] font-black text-[#1D2889] uppercase tracking-widest">Auditoria Exclusiva 2026</span>
                       </div>
                       
                       <div className="space-y-4">
                         <img 
                            src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" 
                            alt="Reflex" 
                            className="h-5 sm:h-6 lg:h-8 mb-2 opacity-90 mx-auto lg:mx-0" 
                          />
                          <h1 className="text-3xl sm:text-5xl lg:text-[65px] font-black text-[#050637] tracking-tighter leading-[1.1]">
                            Score de <br className="hidden lg:block"/> <span className="text-[#1D2889] italic">Escala Estratégica</span>
                          </h1>
                          <p className="text-sm sm:text-xl text-[#444E68] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Diagnóstico completo do seu funil e recomendação personalizada em menos de 3 minutos. Descubra onde você está perdendo dinheiro.
                          </p>
                       </div>
                       
                       <div className="hidden lg:flex items-center gap-6 text-[#899EC8] text-xs font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1D2889]" /> Análise de Funil</span>
                          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1D2889]" /> Benchmarking</span>
                          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1D2889]" /> Plano de Ação</span>
                       </div>
                    </div>

                    {/* Right Column: Interaction Card */}
                    <div className="lg:col-span-5 w-full">
                      <div className="bg-[#fbfbfd] border border-[#E2E7EF] p-6 sm:p-8 rounded-2xl lg:rounded-3xl shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D2889]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        
                        <div className="relative z-10 space-y-6">
                           <div>
                             <h3 className="text-lg font-bold text-[#050637] mb-1">Comece agora</h3>
                             <p className="text-xs text-[#899EC8]">É gratuito e confidencial.</p>
                           </div>
                           
                           <div className="space-y-4">
                              <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#899EC8] group-focus-within/input:text-[#1D2889] transition-colors h-5 w-5" />
                                <input 
                                  type="text" 
                                  placeholder="Seu nome" 
                                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-[#E2E7EF] text-[#050637] placeholder:text-[#899EC8]/80 focus:ring-4 focus:ring-[#1D2889]/5 focus:border-[#1D2889] transition-all outline-none text-base font-bold shadow-sm"
                                  value={name}
                                  onChange={e => setName(e.target.value)}
                                />
                              </div>
                              <button 
                                disabled={!name}
                                onClick={handleNext}
                                className="w-full bg-[#1D2889] hover:bg-[#12165F] disabled:opacity-30 text-white font-extrabold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#1D2889]/10 hover:shadow-[#1D2889]/20 text-lg group active:scale-[0.98]"
                              >
                                Iniciar Diagnóstico <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </button>
                           </div>
                           
                           <div className="text-center">
                             <span className="text-[10px] text-[#899EC8] font-medium">Tempo estimado: 2 min 30 seg</span>
                           </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ) : step <= 20 ? (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col space-y-4 sm:space-y-10 py-1">
                  <div className="space-y-2 sm:space-y-6 text-center">
                    <span className="inline-block px-3 py-1 rounded-md bg-[#E2E7EF]/50 text-[8px] sm:text-[10px] font-black text-[#444E68] tracking-widest uppercase">
                      Etapa {step} / 20
                    </span>
                    <h2 className="text-lg sm:text-3xl lg:text-4xl font-extrabold text-[#050637] tracking-tight leading-tight max-w-2xl mx-auto px-4">
                      {QUESTIONS[step - 1].text}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 w-full max-w-4xl mx-auto px-2">
                    {QUESTIONS[step - 1].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const newAnswers = [...answers];
                          newAnswers[step - 1] = idx;
                          setAnswers(newAnswers);
                          handleNext();
                        }}
                        className="group text-left p-3.5 sm:p-7 rounded-xl border border-[#E2E7EF] bg-white hover:border-[#3E5ABA] hover:bg-[#E2E7EF]/30 transition-all flex items-center justify-between active:scale-[0.98] shadow-sm min-h-[50px] sm:min-h-[100px]"
                      >
                        <span className="font-bold text-xs sm:text-lg lg:text-xl text-[#444E68] group-hover:text-[#050637] leading-tight pr-3">{option}</span>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#E2E7EF] flex items-center justify-center group-hover:bg-[#3E5ABA] group-hover:border-[#3E5ABA] transition-all shrink-0">
                           <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#899EC8] group-hover:text-white transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button onClick={handleBack} className="text-[9px] sm:text-xs font-black text-[#899EC8] hover:text-[#1D2889] uppercase tracking-widest transition-all px-6 py-2 border border-transparent hover:border-[#E2E7EF] rounded-full">
                      Voltar
                    </button>
                  </div>
                </div>
              ) : step === 21 ? (
                <div className="text-center space-y-6 sm:space-y-10 animate-in zoom-in-95 duration-700 py-4 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-32 sm:h-32 bg-[#E2E7EF] rounded-2xl flex items-center justify-center mb-1 sm:mb-2 relative">
                     <div className="absolute inset-0 bg-[#3E5ABA]/10 blur-2xl rounded-full"></div>
                     <Rocket className="h-8 w-8 sm:h-16 text-[#1D2889] relative z-10" />
                  </div>
                  <div className="space-y-3 sm:space-y-4 px-4">
                    <h2 className="text-2xl sm:text-6xl font-black text-[#050637] tracking-tighter uppercase leading-none">Finalizado.</h2>
                    <p className="text-sm sm:text-2xl text-[#444E68] font-medium max-w-xl mx-auto leading-relaxed">
                      Excelente, <span className="text-[#1D2889] font-bold">{name}</span>. Seus dados foram processados.
                    </p>
                  </div>
                  <button 
                    onClick={handleComplete} 
                    className="w-full max-w-[240px] sm:max-w-xs bg-[#1D2889] text-white font-extrabold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 sm:gap-4 transition-all shadow-2xl hover:bg-[#12165F] text-base sm:text-xl group active:scale-[0.98]"
                  >
                    Ver Meu Score <Zap className="h-4 w-4 sm:h-5 text-[#B98164] fill-[#B98164]" />
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-2 sm:space-y-4 py-1 w-full">
                  
                  {/* Minimal Top Header - PADDING ADJUSTED */}
                  <div className="flex flex-col items-center justify-center text-center pb-8 lg:pb-14">
                     <img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" alt="Reflex" className="h-3 sm:h-4 opacity-40 mb-1" />
                     <h2 className="text-[7px] sm:text-[10px] font-black text-[#899EC8] tracking-[0.4em] uppercase opacity-60">Auditoria Reflex AC Intelligence</h2>
                  </div>

                  {/* CONSOLIDATED HERO CTA AREA - ALL-IN-ONE DIAGNOSTIC BLOCK */}
                  <div className="relative bg-[#050637] p-6 sm:p-12 lg:p-16 rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden mx-1 sm:mx-2 border border-white/5 w-full">
                     {/* Strategic Background Aura */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-gradient-to-b from-[#1D2889]/30 to-transparent pointer-events-none"></div>
                     
                     {/* DESKTOP LAYOUT GRID */}
                     <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                        
                        {/* LEFT COLUMN: SCORE (Ancla Visual) */}
                        <div className="lg:col-span-5 flex flex-col items-center lg:items-center justify-center text-center">
                            <div className="animate-in zoom-in duration-1000 relative">
                                <span className="text-[5rem] sm:text-[8rem] lg:text-[11rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#899EC8] leading-none tracking-tighter block drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                                {analysis?.score}
                                </span>
                                <div className="absolute -right-4 top-4 lg:top-10 rotate-12 bg-[#3E5ABA] text-white text-[10px] lg:text-sm font-bold px-2 py-1 rounded-md border border-white/20 shadow-lg">
                                    Nível Atual
                                </div>
                            </div>
                            <span className="text-[#899EC8] font-extrabold text-[9px] sm:text-xl uppercase tracking-[0.4em] sm:-mt-2 opacity-90 mb-4 lg:mb-8">
                            PONTOS / 100
                            </span>

                            <div className="hidden lg:flex flex-col items-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#899EC8] text-[8px] sm:text-xs font-black uppercase tracking-[0.4em]">
                                    <Target className="w-3 h-3 sm:w-4" /> Escala Imediata
                                </div>
                                <h3 className="text-xl lg:text-3xl font-black text-white tracking-tighter leading-tight text-center">
                                    Pronto para escalar?
                                </h3>
                                <a href="https://reflexbr.com/home-2688" target="_blank" className="inline-flex items-center gap-2 text-[#899EC8] font-bold hover:text-white transition-colors text-[10px] lg:text-xs group px-4 py-2 rounded-full hover:bg-white/10 mt-1">
                                  <Globe className="h-3 w-3" /> Estudos de Caso Reflex AC <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: DIAGNOSIS & CTA */}
                        <div className="lg:col-span-7 space-y-6 lg:space-y-8">
                             {/* Cards de Diagnostico */}
                             <div className="grid grid-cols-1 gap-4 lg:gap-6">
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 lg:p-8 rounded-[1.25rem] lg:rounded-[2rem] space-y-3 group hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 opacity-60">
                                        <Award className="h-4 w-4 text-white" />
                                        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">O Veredito</h3>
                                    </div>
                                    <p className="text-white text-lg lg:text-2xl font-bold leading-tight">
                                        {analysis?.verdict}
                                    </p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 lg:p-8 rounded-[1.25rem] lg:rounded-[2rem] space-y-3 group hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 opacity-60">
                                        <TrendingUp className="h-4 w-4 text-[#B98164]" />
                                        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Próximos Passos</h3>
                                    </div>
                                    <p className="text-white text-lg lg:text-2xl font-bold leading-tight">
                                        {analysis?.recommendation}
                                    </p>
                                </div>
                             </div>

                             {/* Botón CTA (Visible en Desktop aquí abajo) */}
                             <div className="pt-4 lg:pt-2">
                                <button 
                                onClick={sendEmailNotification}
                                disabled={isSending}
                                className="w-full inline-flex items-center justify-center gap-4 bg-[#3E5ABA] text-white font-black px-8 py-6 rounded-xl lg:rounded-2xl hover:bg-[#1D2889] hover:scale-[1.01] active:scale-95 transition-all shadow-[0_15px_30px_-10px_rgba(62,90,186,0.5)] text-lg lg:text-2xl uppercase tracking-tight"
                                >
                                {isSending ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                    <span>AGENDAR ASSESSORIA GRATUITA</span> 
                                    <Calendar className="h-6 w-6 shrink-0" />
                                    </>
                                )}
                                </button>
                                <div className="flex items-center justify-center gap-4 mt-4 text-[#899EC8]/40 text-[10px] font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Vagas Limitadas</span>
                                    <span>Janeiro 2026</span>
                                </div>
                             </div>
                        </div>

                     </div>
                     
                     {/* MOBILE ONLY TEXT (Oculto en Desktop ya que se movió a la izquierda) */}
                     <div className="lg:hidden space-y-4 pt-8 text-center flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#899EC8] text-[8px] font-black uppercase tracking-[0.4em]">
                            <Target className="w-3 h-3" /> Escala Imediata
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tighter leading-tight">
                          Pronto para escalar seu faturamento?
                        </h3>
                        <a href="https://reflexbr.com/home-2688" target="_blank" className="inline-flex items-center gap-2 text-[#899EC8] font-bold hover:text-white transition-colors text-[10px] group px-4 py-2 rounded-full hover:bg-white/10">
                           <Globe className="h-3 w-3" /> Estudos de Caso Reflex AC <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                         </a>
                        <p className="text-[#E2E7EF]/70 text-sm font-medium leading-relaxed max-w-2xl mx-auto">
                          Seu score indica gargalos. Agende agora uma sessão estratégica gratuita para desenharmos seu novo funil.
                        </p>
                     </div>

                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer branding */}
          <div className="mt-3 sm:mt-6 opacity-25 flex items-center gap-3 text-[8px] sm:text-[10px] px-4">
            <span className="font-black text-[#686A86] tracking-widest uppercase">Built with KN Growth</span>
            <div className="h-3 w-px bg-[#E2E7EF]"></div>
            <img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" alt="Reflex" className="h-2.5 sm:h-4 grayscale" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;