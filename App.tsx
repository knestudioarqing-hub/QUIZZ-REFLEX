
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
  { id: 16, text: "Se sua landing page convertesse mais, o impacto seria:", options: ["Crescimento imediato", "Aumento gradual", "Melhor organização do processo", "Ainda não sei"] },
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
  
  // Track notifications to avoid double sending
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
      console.log(`Notification sent for ${percentage}%`);
    } catch (e) {
      console.error(e);
    }
  };

  // Watch for progress milestones
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
    <div className="h-screen w-screen flex flex-col items-center justify-center p-3 sm:p-6 bg-[#fbfbfd] overflow-hidden selection:bg-[#3E5ABA]/20 selection:text-[#050637] relative">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-[#E2E7EF] rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#899EC8]/10 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <main className="w-full max-w-5xl h-full flex flex-col items-center justify-center relative z-10 py-2 sm:py-4">
        
        {/* Progress Tracker */}
        {step > 0 && step <= 20 && (
          <div className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white/90 backdrop-blur-md border border-[#E2E7EF] rounded-full px-4 sm:px-6 py-1.5 sm:py-2.5 shadow-sm flex items-center gap-3 sm:gap-4">
               <span className="text-[8px] sm:text-[10px] font-extrabold text-[#686A86] tracking-widest uppercase">Progresso</span>
               <div className="w-20 sm:w-32 h-1 bg-[#E2E7EF] rounded-full overflow-hidden">
                 <div className="h-full bg-[#1D2889] transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
               </div>
               <span className="text-[10px] sm:text-xs font-bold text-[#1D2889]">{progress}%</span>
            </div>
          </div>
        )}

        <div className={`w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
          ${step === 22 ? 'max-w-6xl h-full lg:h-auto max-h-[96vh]' : 'max-w-4xl max-h-[85vh] h-auto'}
          bg-white border border-[#E2E7EF] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] rounded-[1.5rem] sm:rounded-[2.5rem] 
          ${step === 0 ? 'p-6 sm:p-16 lg:p-24' : 'p-4 sm:p-10 lg:p-12'}
          flex flex-col relative overflow-hidden`}>
          
          <div className="flex-1 overflow-y-auto custom-scroll flex flex-col justify-center py-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-10 animate-in fade-in duration-1000">
                <div className="relative">
                   <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-[#E2E7EF] border-t-[#1D2889] animate-spin" />
                   <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 text-[#1D2889]/30" />
                </div>
                <div className="text-center space-y-4 max-w-sm px-4">
                  <h3 className="text-xl sm:text-2xl font-black text-[#050637] tracking-tight uppercase italic">Gerando Diagnóstico</h3>
                  <p className="text-sm sm:text-base text-[#444E68] font-medium leading-relaxed">Cruzando seus dados estrategicamente.</p>
                </div>
              </div>
            ) : step === 0 ? (
              <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center text-center">
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2E7EF]/50 border border-[#E2E7EF] mb-2">
                     <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1D2889]" />
                     <span className="text-[9px] sm:text-[10px] font-black text-[#1D2889] uppercase tracking-widest">Auditoria Exclusiva 2026</span>
                  </div>
                  <img 
                    src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" 
                    alt="Reflex" 
                    className="h-4 sm:h-8 mx-auto mb-4 opacity-90 transition-all duration-300" 
                  />
                  <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black text-[#050637] tracking-tighter leading-[1.1] sm:leading-[1.05] max-w-4xl mx-auto px-1">
                    Score de <span className="text-[#1D2889] italic">Escala Estratégica</span>
                  </h1>
                  <p className="text-base sm:text-2xl text-[#444E68] font-medium max-w-2xl mx-auto leading-relaxed px-4">
                    Diagnóstico completo do seu funil e recomendação personalizada em menos de 3 minutos.
                  </p>
                </div>

                <div className="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6 mt-2 px-4">
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#899EC8] group-focus-within:text-[#1D2889] transition-colors h-4 w-4 sm:h-5 sm:w-5" />
                    <input 
                      type="text" 
                      placeholder="Seu nome" 
                      className="w-full pl-12 sm:pl-14 pr-6 py-4 rounded-xl sm:rounded-2xl bg-[#E2E7EF]/20 border border-[#E2E7EF] text-[#050637] placeholder:text-[#899EC8] focus:ring-4 focus:ring-[#1D2889]/5 focus:border-[#1D2889] transition-all outline-none text-base sm:text-lg font-bold shadow-sm"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <button 
                    disabled={!name}
                    onClick={handleNext}
                    className="w-full bg-[#1D2889] hover:bg-[#12165F] disabled:opacity-30 text-white font-extrabold py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#1D2889]/10 hover:shadow-[#1D2889]/20 text-lg sm:text-xl group active:scale-[0.98]"
                  >
                    Iniciar Diagnóstico <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center gap-4 opacity-30 pt-4">
                   <img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" className="h-3 sm:h-4 grayscale" alt="Logo" />
                   <span className="text-[8px] sm:text-[10px] font-black text-[#899EC8] uppercase tracking-widest">Reflex AC Intelligence</span>
                </div>
              </div>
            ) : step <= 20 ? (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col space-y-6 sm:space-y-10 py-2">
                <div className="space-y-3 sm:space-y-6 text-center">
                  <span className="inline-block px-3 py-1 rounded-md bg-[#E2E7EF]/50 text-[9px] sm:text-[10px] font-black text-[#444E68] tracking-widest uppercase">
                    Etapa {step} / 20
                  </span>
                  <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#050637] tracking-tight leading-tight max-w-2xl mx-auto px-4">
                    {QUESTIONS[step - 1].text}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-6 w-full max-w-4xl mx-auto px-2">
                  {QUESTIONS[step - 1].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const newAnswers = [...answers];
                        newAnswers[step - 1] = idx;
                        setAnswers(newAnswers);
                        handleNext();
                      }}
                      className="group text-left p-4 sm:p-7 rounded-xl sm:rounded-2xl border border-[#E2E7EF] bg-white hover:border-[#3E5ABA] hover:bg-[#E2E7EF]/30 transition-all flex items-center justify-between active:scale-[0.98] shadow-sm min-h-[60px] sm:min-h-[100px]"
                    >
                      <span className="font-bold text-sm sm:text-lg lg:text-xl text-[#444E68] group-hover:text-[#050637] leading-tight pr-4">{option}</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#E2E7EF] flex items-center justify-center group-hover:bg-[#3E5ABA] group-hover:border-[#3E5ABA] transition-all shrink-0">
                         <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#899EC8] group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-center pt-2">
                  <button onClick={handleBack} className="text-[10px] sm:text-xs font-black text-[#899EC8] hover:text-[#1D2889] uppercase tracking-widest transition-all px-6 py-2 border border-transparent hover:border-[#E2E7EF] rounded-full">
                    Voltar
                  </button>
                </div>
              </div>
            ) : step === 21 ? (
              <div className="text-center space-y-10 animate-in zoom-in-95 duration-700 py-6 flex flex-col items-center">
                <div className="w-20 h-20 sm:w-32 bg-[#E2E7EF] rounded-2xl flex items-center justify-center mb-2 relative">
                   <div className="absolute inset-0 bg-[#3E5ABA]/10 blur-2xl rounded-full"></div>
                   <Rocket className="h-10 w-10 sm:h-16 text-[#1D2889] relative z-10" />
                </div>
                <div className="space-y-4 px-4">
                  <h2 className="text-3xl sm:text-6xl font-black text-[#050637] tracking-tighter uppercase leading-none">Finalizado.</h2>
                  <p className="text-base sm:text-2xl text-[#444E68] font-medium max-w-xl mx-auto leading-relaxed">
                    Excelente, <span className="text-[#1D2889] font-bold">{name}</span>. Seus dados foram processados.
                  </p>
                </div>
                <button 
                  onClick={handleComplete} 
                  className="w-full max-w-xs bg-[#1D2889] text-white font-extrabold py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-4 transition-all shadow-2xl hover:bg-[#12165F] text-lg sm:text-xl group active:scale-[0.98]"
                >
                  Ver Meu Score <Zap className="h-5 w-5 text-[#B98164] fill-[#B98164]" />
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-6 sm:space-y-12 py-2">
                
                {/* Report Header - Enhanced Vertical Balance */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-center justify-between border-b border-[#E2E7EF] pb-8 sm:pb-12 px-2 sm:px-4">
                   <div className="space-y-3 text-center sm:text-left flex-1 w-full">
                      <img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" alt="Reflex" className="h-3 sm:h-5 mb-4 opacity-60 mx-auto sm:mx-0" />
                      <h2 className="text-2xl sm:text-5xl font-black text-[#050637] tracking-tighter uppercase leading-[1.1] sm:leading-[1]">Diagnóstico<br/>Estratégico</h2>
                      <p className="text-[#899EC8] font-bold text-[10px] sm:text-sm tracking-widest uppercase">ID Auditoria: #{Math.floor(Math.random() * 999999)}</p>
                   </div>
                   
                   {/* Score Container - Perfect Centering with Vertical Balance and adjusted spacing */}
                   <div className="relative shrink-0 flex flex-col items-center justify-center text-center py-8 sm:py-10 min-w-[200px] sm:min-h-[240px]">
                      <span className="text-[7rem] sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#1D2889] to-[#050637] leading-none sm:leading-[0.8] tracking-tighter block mb-2 sm:mb-0">
                        {analysis?.score}
                      </span>
                      <span className="text-[#899EC8] font-extrabold text-[12px] sm:text-3xl uppercase tracking-widest sm:-mt-4">
                        PONTOS / 100
                      </span>
                   </div>
                </div>

                {/* Insights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10 px-2 sm:px-4">
                  <div className="bg-[#E2E7EF]/20 p-5 sm:p-10 rounded-2xl border border-[#E2E7EF] space-y-3 sm:space-y-6">
                    <div className="flex items-center gap-3">
                       <Award className="h-4 w-4 sm:h-5 text-[#1D2889]" />
                       <h3 className="text-[#050637] font-black text-xs sm:text-xl uppercase tracking-tight">O Veredito</h3>
                    </div>
                    <p className="text-xs sm:text-xl text-[#444E68] leading-relaxed font-bold">
                      {analysis?.verdict}
                    </p>
                  </div>

                  <div className="bg-[#E2E7EF]/20 p-5 sm:p-10 rounded-2xl border border-[#E2E7EF] space-y-3 sm:space-y-6">
                    <div className="flex items-center gap-3">
                       <TrendingUp className="h-4 w-4 sm:h-5 text-[#B98164]" />
                       <h3 className="text-[#050637] font-black text-xs sm:text-xl uppercase tracking-tight">Próximos Passos</h3>
                    </div>
                    <p className="text-xs sm:text-xl text-[#444E68] leading-relaxed font-bold">
                      {analysis?.recommendation}
                    </p>
                  </div>
                </div>

                {/* CTA Box */}
                <div className="relative bg-[#050637] p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] text-center space-y-6 sm:space-y-10 shadow-2xl overflow-hidden mx-1 sm:mx-4">
                   <div className="space-y-3 sm:space-y-6 relative z-10 max-w-2xl mx-auto px-1 sm:px-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-[#899EC8] text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                        <Target className="w-2.5 h-2.5 sm:w-3.5" /> Foco em Resultados
                     </div>
                     <h3 className="text-xl sm:text-5xl font-black text-white tracking-tighter leading-tight sm:leading-[1.05]">
                       Pronto para escalar seu faturamento?
                     </h3>
                     <p className="text-[#E2E7EF]/60 text-[10px] sm:text-2xl font-medium leading-relaxed max-w-lg mx-auto">
                       Agende uma sessão estratégica individual gratuita para desenharmos seu novo funil.
                     </p>
                   </div>

                   <div className="flex flex-col gap-4 sm:gap-8 items-center relative z-10 px-1 sm:px-4">
                     <button 
                       onClick={sendEmailNotification}
                       disabled={isSending}
                       className="w-full sm:w-auto inline-flex items-center justify-center gap-3 sm:gap-6 bg-[#3E5ABA] text-white font-black px-6 sm:px-14 py-4 rounded-xl sm:rounded-2xl hover:bg-[#1D2889] hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-[#3E5ABA]/20 text-[11px] sm:text-2xl whitespace-nowrap"
                     >
                       {isSending ? (
                         <Loader2 className="h-4 w-4 sm:h-8 animate-spin" />
                       ) : (
                         <>
                          <span className="truncate uppercase">AGENDAR MINHA ASESSORIA GRATUITA</span> 
                          <Calendar className="h-3.5 w-3.5 sm:h-7 shrink-0" />
                         </>
                       )}
                     </button>
                     <div className="flex items-center justify-center gap-3 sm:gap-6 text-[#899EC8]/40 text-[7px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em]">
                       <span className="flex items-center gap-1.5 sm:gap-2 shrink-0"><CheckCircle2 className="h-2.5 w-2.5 sm:h-4 text-[#B98164]" /> Vagas Limitadas</span>
                       <div className="h-0.5 w-0.5 sm:h-1 sm:w-1 bg-[#444E68] rounded-full shrink-0"></div>
                       <span className="shrink-0 uppercase">Janeiro 2026</span>
                     </div>
                   </div>
                </div>

                <div className="text-center pt-4 border-t border-[#E2E7EF] px-4">
                  <a href="https://reflexbr.com/home-2688" target="_blank" className="inline-flex items-center gap-2 text-[#899EC8] font-bold hover:text-[#1D2889] transition-colors text-[10px] sm:text-base group px-4 py-2 rounded-full hover:bg-[#E2E7EF]/20">
                    <Globe className="h-4 w-4 sm:h-5" /> Ver estudos de caso Reflex AC <ArrowRight className="w-3 h-3 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer branding */}
        <div className="mt-4 sm:mt-8 opacity-25 flex items-center gap-3 text-[8px] sm:text-[10px] px-4">
          <span className="font-black text-[#686A86] tracking-widest uppercase">Built with KN Growth</span>
          <div className="h-3 w-px bg-[#E2E7EF]"></div>
          <img src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" alt="Reflex" className="h-2.5 sm:h-4 grayscale" />
        </div>
      </main>
    </div>
  );
};

export default App;
