
import React, { useState } from 'react';
import { LeadData, QuizAnalysis, BusinessStage, Challenge, Budget, Timeline } from './types';
import { analyzeLead } from './services/geminiService';
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
  Cpu,
  Sparkles,
  BarChart3
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null);
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    email: '',
    // Inicializamos con strings vacíos para que no haya selección previa
    stage: '' as any,
    challenge: '' as any,
    budget: '' as any,
    timeline: '' as any
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  const handleComplete = async () => {
    setLoading(true);
    try {
      const result = await analyzeLead(leadData);
      setAnalysis(result);
      setStep(6);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateLead = (updates: Partial<LeadData>) => {
    setLeadData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-2">
                <img 
                  src="https://storage.googleapis.com/msgsndr/WlnojMjrKnk5cMGiCAD4/media/6963aae098efbd2584e5bc32.png" 
                  alt="Reflex Engine Logo" 
                  className="h-[20px] md:h-[30px] object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Escala tu negocio con <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">datos, no suposiciones.</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
                Obtén un diagnóstico profesional de tu potencial de crecimiento generado por nuestra IA en menos de 2 minutos.
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <div className="group relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-indigo-500" />
                <input 
                  type="text" 
                  placeholder="Escribe tu nombre aquí..." 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  value={leadData.name}
                  onChange={e => updateLead({ name: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button 
                disabled={!leadData.name}
                onClick={nextStep}
                className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-200 glow-button"
              >
                Comenzar Evaluación <ChevronRight className="h-5 w-5" />
              </button>
              <p className="text-slate-400 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Tu privacidad es nuestra prioridad estratégica
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <SelectionStep 
            title="Etapa de tu Negocio"
            description="¿En qué punto de la curva de crecimiento te encuentras?"
            options={['Idea', 'Startup', 'Crecimiento', 'Consolidado']}
            current={leadData.stage}
            onSelect={(val) => { 
              updateLead({ stage: val as BusinessStage }); 
              setTimeout(nextStep, 400); // Pequeño retraso para ver el cambio de color
            }}
            onBack={prevStep}
          />
        );

      case 2:
        return (
          <SelectionStep 
            title="Mayor Desafío"
            description="¿Cuál es el principal cuello de botella que frena tu expansión?"
            options={['Ventas', 'Marketing', 'Operaciones', 'Tecnología']}
            current={leadData.challenge}
            onSelect={(val) => { 
              updateLead({ challenge: val as Challenge }); 
              setTimeout(nextStep, 400); 
            }}
            onBack={prevStep}
          />
        );

      case 3:
        return (
          <SelectionStep 
            title="Capacidad de Inversión"
            description="Presupuesto mensual destinado a escalamiento estratégico."
            options={['Menos de $1k', '$1k - $5k', '$5k - $20k', 'Más de $20k']}
            current={leadData.budget}
            onSelect={(val) => { 
              updateLead({ budget: val as Budget }); 
              setTimeout(nextStep, 400); 
            }}
            onBack={prevStep}
          />
        );

      case 4:
        return (
          <SelectionStep 
            title="Horizonte Temporal"
            description="¿Qué tan pronto buscas ver resultados tangibles?"
            options={['Inmediato', '1-3 meses', '3-6 meses', 'Solo explorando']}
            current={leadData.timeline}
            onSelect={(val) => { 
              updateLead({ timeline: val as Timeline }); 
              setTimeout(nextStep, 400); 
            }}
            onBack={prevStep}
          />
        );

      case 5:
        return (
          <div className="space-y-10 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-indigo-100 blur-3xl rounded-full"></div>
              <div className="relative bg-white border border-slate-100 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
                <Cpu className="h-12 w-12 text-indigo-500" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">DATOS LISTOS.</h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-sm mx-auto">
                {leadData.name}, nuestro motor de IA está listo para procesar tu perfil estratégico.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={handleComplete}
                className="w-full max-w-xs bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.05] active:scale-95 shadow-xl"
              >
                GENERAR DIAGNÓSTICO <Zap className="h-5 w-5 fill-indigo-400 text-indigo-400" />
              </button>
              <button onClick={prevStep} className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Revisar respuestas</button>
            </div>
          </div>
        );

      case 6:
        return analysis ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black tracking-widest uppercase">
                <BarChart3 className="w-4 h-4" /> AI ANALYSIS COMPLETE
              </div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">TU POTENCIAL DE ÉXITO</h2>
              
              <div className="relative flex justify-center py-6">
                 <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-600 to-indigo-900">
                   {analysis.score}<span className="text-3xl font-bold ml-1 text-slate-400">%</span>
                 </div>
                 <div className="absolute inset-0 bg-indigo-400/5 blur-[80px] -z-10"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4 border border-slate-100">
                <h3 className="text-indigo-600 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Veredicto Estratégico
                </h3>
                <p className="text-slate-700 leading-relaxed text-lg font-medium italic">
                  "{analysis.verdict}"
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4 border border-slate-100">
                <h3 className="text-purple-600 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Recomendación IA
                </h3>
                <p className="text-slate-700 leading-relaxed text-lg">
                  {analysis.recommendation}
                </p>
              </div>
            </div>

            <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative bg-white p-10 rounded-[2.4rem] text-center space-y-6">
                 <h3 className="text-3xl font-black text-slate-900">¿Quieres ejecutar este plan?</h3>
                 <p className="text-slate-500 text-lg max-w-md mx-auto">
                   Reserva una sesión estratégica gratuita para profundizar en tu puntaje de {analysis.score}%.
                 </p>
                 <a 
                   href="https://calendly.com" 
                   target="_blank" 
                   className="inline-flex items-center gap-3 bg-indigo-600 text-white font-black px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-200"
                 >
                   Agendar minha asesoria gratuita
                   <Calendar className="h-6 w-6" />
                 </a>
                 <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Cupos limitados por semana</p>
               </div>
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 md:p-12">
      {/* Soft White Aurora Background */}
      <div className="fixed inset-0 overflow-hidden -z-10 bg-white">
        <div className="aurora-sphere absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-indigo-50 rounded-full"></div>
        <div className="aurora-sphere absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-50 rounded-full" style={{ animationDelay: '-7s' }}></div>
        <div className="aurora-sphere absolute top-[15%] right-[5%] w-[40%] h-[40%] bg-purple-50 rounded-full" style={{ animationDelay: '-12s' }}></div>
      </div>

      <main className="w-full max-w-4xl relative z-10">
        {/* Step Indicator */}
        {step > 0 && step < 6 && (
          <div className="mb-12 flex justify-between items-center px-4 max-w-md mx-auto">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center flex-1 last:flex-none">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 border-2 ${
                  step >= num 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                </div>
                {num < 5 && (
                  <div className={`h-1 flex-1 mx-2 transition-all duration-700 rounded-full ${
                    step > num ? 'bg-indigo-600' : 'bg-slate-100'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden border border-white/80">
          {/* Accent decoration inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
              <div className="relative">
                 <div className="absolute inset-0 bg-indigo-100 blur-2xl rounded-full animate-pulse"></div>
                 <Loader2 className="h-16 w-16 text-indigo-600 animate-spin relative z-10" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-widest uppercase">Consultando con la IA...</h3>
                <p className="text-slate-500">Generando tu hoja de ruta personalizada.</p>
              </div>
            </div>
          ) : renderStep()}
        </div>

        {/* Brand Footer */}
        {step < 6 && (
          <div className="mt-8 text-center opacity-70">
            <p className="text-slate-400 text-sm font-bold tracking-tighter flex items-center justify-center gap-2 uppercase">
              POWERED BY REFLEX ENGINE <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            </p>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{title}</h2>
        <p className="text-slate-500 text-lg leading-relaxed">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`group text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between relative overflow-hidden active:scale-[0.98] ${
              current === option 
                ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100 scale-[1.02]' 
                : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'
            }`}
          >
            <span className={`font-bold text-lg relative z-10 ${current === option ? 'text-indigo-900' : 'text-slate-600'}`}>
              {option}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              current === option ? 'bg-indigo-600 text-white rotate-0' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
            }`}>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>
      <div className="flex justify-center pt-4">
        <button onClick={onBack} className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest border-b border-transparent hover:border-indigo-200 pb-1">Volver</button>
      </div>
    </div>
  );
};

export default App;
