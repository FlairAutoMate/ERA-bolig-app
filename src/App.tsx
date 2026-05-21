import React, { useState, useEffect } from 'react';
import { Camera, Home, Calendar, BookOpen, Sparkles, LogOut, User, ChevronRight, Plus, ArrowRight, Clock, FileText, X, Check, MapPin, Activity, Shield, ArrowUpRight, Fingerprint, Droplets, Zap, Wifi, AlertTriangle, Bell, FileDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

import { DataModelOverlay } from './components/DataModelOverlay';

function MagneticButton({ children, onClick, className, disabled }: any) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={disabled ? undefined : onClick}
      className={className}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('hjem');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCraftsmanViewOpen, setIsCraftsmanViewOpen] = useState(false);
  const [isDocUploadOpen, setIsDocUploadOpen] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [activeProjectBrief, setActiveProjectBrief] = useState<string | null>(null);

  const [isDataModelOpen, setIsDataModelOpen] = useState(false);

  const [maintenanceScore, setMaintenanceScore] = useState(92);
  const [hasRequestedQuotes, setHasRequestedQuotes] = useState(false);
  const [quotesArrived, setQuotesArrived] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [acceptedQuoteId, setAcceptedQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (hasRequestedQuotes && !acceptedQuoteId) {
      const timer = setTimeout(() => {
        setQuotesArrived(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }, 4000); // simulate delay before quotes arrive
      return () => clearTimeout(timer);
    }
  }, [hasRequestedQuotes, acceptedQuoteId]);

  const [journalTimeline, setJournalTimeline] = useState([
    {
      year: '2026',
      items: [
        { 
          type: 'Visuell Analyse', date: '12. Mai', title: 'Fasadevask', 
          img: 'https://images.unsplash.com/photo-1518005020470-58b76007ec5b?auto=format&fit=crop&q=80&h=800', 
          size: 'large', align: 'right', 
          desc: 'Rengjøring av ytre kledning sørvegg. AI registrerte falmet farge i nedre felt, men ingen råte. Struktur ansett som sunn.' 
        },
        { 
          type: 'Dokument', date: '3. Mars', title: 'Årsoppgjør BRL', 
          iconType: 'file', 
          size: 'small', align: 'left', 
          desc: 'Felleskostnader og regnskap for sameiet lastet opp fra forvalter. Alle papirer i orden.' 
        }
      ]
    },
    {
      year: '2025',
      items: [
        { 
          type: 'Prosjekt', date: 'August', title: 'Ny platting og utemiljø', 
          img: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200', 
          size: 'full', align: 'center', 
          desc: 'Oppføring av 40 kvm platting i trykkimpregnert furu med skjult innfesting. Arbeid utført av Nordisk Bygg AS.' 
        },
        { 
          type: 'Inspeksjon', date: '14. Nov', title: 'Tilstandsrapport Tak', 
          img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&h=800', 
          size: 'medium', align: 'left', 
          desc: 'Taktekking er vurdert til TG1 av takstmann. Ingen umiddelbare tiltak nødvendig de neste 5 årene.' 
        },
      ]
    }
  ]);

  const handleArchiveInvoice = () => {
    const newTimeline = [...journalTimeline];
    const newEntry = { 
      type: 'Dokument', date: '16. Mai', title: 'Faktura: Takrennesjekk', 
      iconType: 'file', 
      size: 'small', align: 'left', 
      desc: 'Arkivert faktura. Tett takrenne fikset. ERA-indeks oppdatert med +3 poeng for forebyggende fukttiltak.' 
    };
    if (newTimeline[0].year === '2026') {
      newTimeline[0].items = [newEntry, ...newTimeline[0].items];
    } else {
      newTimeline.unshift({ year: '2026', items: [newEntry] });
    }
    setJournalTimeline(newTimeline);
    setMaintenanceScore(95);
  };

  const tabs = ['hjem', 'plan', 'journal', 'era'];
  const currentIndex = tabs.indexOf(activeTab);

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = offset.x * velocity.x;
    if (swipe < -5000 && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (swipe > 5000 && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'hjem': return <HomeTab key="hjem" maintenanceScore={maintenanceScore} onOpenDocUpload={() => setIsDocUploadOpen(true)} onOpenCamera={() => setIsCameraOpen(true)} onOpenProjectBrief={() => setActiveProjectBrief('maling')} onOpenDataModel={() => setIsDataModelOpen(true)} />;
      case 'plan': return <PlanTab key="plan" hasRequestedQuotes={hasRequestedQuotes} acceptedQuote={acceptedQuoteId} onAcceptQuote={setAcceptedQuoteId} onOpenProjectBrief={(id) => setActiveProjectBrief(id)} onOpenDataModel={() => setIsDataModelOpen(true)} />;
      case 'journal': return <JournalTab key="journal" timeline={journalTimeline} onOpenDocUpload={() => setIsDocUploadOpen(true)} />;
      case 'era': return <EraTab key="era" onOpenProjectBrief={() => setActiveProjectBrief('maling')} />;
      default: return <HomeTab key="hjem" maintenanceScore={maintenanceScore} onOpenDocUpload={() => setIsDocUploadOpen(true)} onOpenCamera={() => setIsCameraOpen(true)} onOpenProjectBrief={() => setActiveProjectBrief('maling')} onOpenDataModel={() => setIsDataModelOpen(true)} />;
    }
  }

  if (!hasOnboarded) {
    return <OnboardingFlow onComplete={() => setHasOnboarded(true)} />;
  }

  return (
    <div className="min-h-screen pb-32 overflow-x-hidden">
      {/* HEADER */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${isScrolled ? 'bg-warm-ivory/90 backdrop-blur-md border-b border-deep-navy/5 py-3' : 'bg-transparent py-5 lg:py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">
          <div className="flex items-center gap-8 sm:gap-12">
            <div className="text-2xl font-display font-medium tracking-tighter text-deep-navy flex items-center">
              era<span className="w-1 h-1 bg-muted-gold ml-0.5 mb-1 inline-block" />
            </div>
            <nav className="hidden lg:flex gap-10">
              <button 
                onClick={() => setIsCraftsmanViewOpen(false)}
                className={`text-[11px] uppercase tracking-[0.2em] font-bold pb-1 transition-colors ${!isCraftsmanViewOpen ? 'border-b border-deep-navy text-deep-navy' : 'text-deep-navy/40 hover:text-deep-navy'}`}
              >
                Boligeier
              </button>
              <button 
                onClick={() => setIsCraftsmanViewOpen(true)}
                className={`text-[11px] uppercase tracking-[0.2em] font-bold pb-1 transition-colors ${isCraftsmanViewOpen ? 'border-b border-deep-navy text-deep-navy' : 'text-deep-navy/40 hover:text-deep-navy'}`}
              >
                Leverandør
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[11px] uppercase tracking-[0.2em] font-bold text-deep-navy flex items-center gap-3 hover:opacity-70 transition-opacity">
              <span className="hidden sm:inline">Lars-Henrik Sand</span>
              <User size={14} />
            </button>
            <div className="w-[1px] h-3 bg-deep-navy/20 hidden sm:block" />
            <button className="text-[11px] uppercase tracking-[0.2em] font-bold text-deep-navy/40 flex items-center gap-2 hover:text-deep-navy transition-colors hidden sm:flex">
              <span>Logg ut</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="w-full"
      >
        <AnimatePresence mode="wait">
           {renderContent()}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isCameraOpen && (
           <CameraOverlay onClose={() => setIsCameraOpen(false)} />
        )}
        {isDocUploadOpen && (
           <DocumentAnalyzerOverlay onClose={() => setIsDocUploadOpen(false)} onArchive={handleArchiveInvoice} onOpenProjectBrief={() => setActiveProjectBrief('maling')} />
        )}
        {isCraftsmanViewOpen && (
           <CraftsmanBriefView onClose={() => setIsCraftsmanViewOpen(false)} />
        )}
        {activeProjectBrief && (
           <ProjectBriefOverlay onClose={() => setActiveProjectBrief(null)} onRequestQuotes={() => { setHasRequestedQuotes(true); setActiveProjectBrief(null); setActiveTab('plan'); }} />
        )}
        {isDataModelOpen && (
           <DataModelOverlay onClose={() => setIsDataModelOpen(false)} />
        )}
      </AnimatePresence>

      {/* MINIMALIST BOTTOM NAV */}
      <nav className="fixed bottom-4 lg:bottom-6 inset-x-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[680px] z-50">
        <div className="bg-white/90 backdrop-blur-2xl border border-deep-navy/5 shadow-[0_20px_40px_rgba(8,20,38,0.08)] rounded-2xl sm:rounded-none sm:border-x-0 h-20 px-4 sm:px-8 flex items-center justify-between pb-safe pt-safe">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveTab('hjem')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'hjem' ? 'text-deep-navy' : 'text-deep-navy/30 hover:text-deep-navy/60'}`}>
            <Home size={22} strokeWidth={activeTab === 'hjem' ? 2 : 1.5} />
            <span className="text-[9px] uppercase font-bold tracking-[0.15em] block">Hjem</span>
          </motion.button>
          
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveTab('plan')} className={`relative flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'plan' ? 'text-deep-navy' : 'text-deep-navy/30 hover:text-deep-navy/60'}`}>
            <Calendar size={22} strokeWidth={activeTab === 'plan' ? 2 : 1.5} />
            <span className="text-[9px] uppercase font-bold tracking-[0.15em] block">Plan</span>
            {hasRequestedQuotes && !acceptedQuoteId && quotesArrived && (
              <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </motion.button>

          {/* PRIMARY CAMERA CTA */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCameraOpen(true)} 
            className="relative w-14 h-14 sm:w-16 sm:h-16 bg-midnight text-warm-ivory shadow-[0_10px_30px_rgba(8,20,38,0.4)] flex items-center justify-center hover:bg-deep-navy transition-colors duration-500 ease-out z-10 -translate-y-4"
          >
            <Camera size={24} strokeWidth={1.5} className="text-warm-ivory" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-muted-gold rounded-full" />
          </motion.button>

          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveTab('journal')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'journal' ? 'text-deep-navy' : 'text-deep-navy/30 hover:text-deep-navy/60'}`}>
            <BookOpen size={22} strokeWidth={activeTab === 'journal' ? 2 : 1.5} />
            <span className="text-[9px] uppercase font-bold tracking-[0.15em] block">Journal</span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveTab('era')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'era' ? 'text-deep-navy' : 'text-deep-navy/30 hover:text-deep-navy/60'}`}>
            <Sparkles size={22} strokeWidth={activeTab === 'era' ? 2 : 1.5} />
            <span className="text-[9px] uppercase font-bold tracking-[0.15em] block">ERA</span>
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 bg-deep-navy text-warm-ivory px-6 py-4 rounded-lg shadow-2xl border border-deep-navy/5 flex items-center gap-4"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-light">2 nye tilbud klare for gjennomgang</span>
            <button onClick={() => { setActiveTab('plan'); setShowToast(false); }} className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-gold hover:text-white transition-colors ml-4">
              Se tilbud
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CameraOverlay({ onClose }: { onClose: () => void }) {
  const [cameraState, setCameraState] = useState<'scanning' | 'analyzing' | 'result'>('scanning');

  const handleCapture = () => {
    setCameraState('analyzing');
    // Simulate AI analysis time
    setTimeout(() => {
      setCameraState('result');
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-deep-navy text-warm-ivory flex flex-col"
    >
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518005020470-58b76007ec5b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-overlay transition-opacity duration-1000" style={{ opacity: cameraState === 'scanning' ? 0.4 : 0.8 }} />
       
       <div className="relative z-10 flex justify-between items-center p-6 lg:p-10">
          <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-warm-ivory/60 flex items-center gap-3">
             <span className={`w-2 h-2 rounded-full ${cameraState === 'result' ? 'bg-green-400' : 'bg-muted-gold animate-pulse'}`} />
             {cameraState === 'scanning' && 'ERA Visuell Analyse'}
             {cameraState === 'analyzing' && 'Analyserer overflate...'}
             {cameraState === 'result' && 'Observasjon registrert'}
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 transition-colors rounded-full backdrop-blur-md">
             <X size={20} />
          </button>
       </div>

       <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
          <AnimatePresence mode="wait">
             {cameraState === 'scanning' && (
                <motion.div key="scan" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center w-full">
                  {/* Scanning frame */}
                  <div className="w-72 h-72 lg:w-96 lg:h-96 border border-white/20 relative flex items-center justify-center">
                     <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-muted-gold" />
                     <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-muted-gold" />
                     <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-muted-gold" />
                     <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-muted-gold" />
                     
                     <div className="w-full h-[1px] bg-muted-gold/50 absolute top-1/2 -translate-y-1/2 animate-[scan_3s_ease-in-out_infinite]" />
                  </div>
                  <p className="mt-8 text-warm-ivory/70 font-light tracking-wide bg-deep-navy/40 px-4 py-2 backdrop-blur-md">Pek kameraet mot overflaten</p>
                </motion.div>
             )}

             {cameraState === 'analyzing' && (
                <motion.div key="analyze" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
                   <div className="w-72 h-72 lg:w-96 lg:h-96 relative flex items-center justify-center backdrop-blur-sm bg-deep-navy/20 border border-white/10">
                      <div className="absolute inset-0 bg-muted-gold/10 animate-pulse" />
                      <div className="w-full absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-muted-gold/20 to-transparent animate-[scan_2s_linear_infinite]" />
                      <Sparkles size={48} className="text-muted-gold animate-pulse relative z-10" />
                   </div>
                </motion.div>
             )}

             {cameraState === 'result' && (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm bg-warm-ivory text-deep-navy p-8 shadow-2xl space-y-6">
                   <div className="space-y-2 border-b border-deep-navy/10 pb-6">
                     <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Oppfattet Kontekst</div>
                     <h3 className="text-3xl font-display text-deep-navy">Sørvegg Fasade</h3>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-light text-deep-navy/60">Tilstand</span>
                        <span className="text-sm font-medium text-deep-navy">God, men falmet i nedfelt</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-light text-deep-navy/60">Materiale</span>
                        <span className="text-sm font-medium text-deep-navy">Liggende kledning (Tre)</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-light text-deep-navy/60">Handling</span>
                        <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-deep-navy bg-deep-navy/5 px-2 py-1">Arkivert i journal</span>
                     </div>
                   </div>

                   <button onClick={onClose} className="w-full py-4 bg-deep-navy text-warm-ivory text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-midnight transition-colors">
                     Ferdig
                   </button>
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       {cameraState === 'scanning' && (
         <div className="relative z-10 pb-20 pt-10 px-6 flex justify-center bg-gradient-to-t from-deep-navy to-transparent">
            <button onClick={handleCapture} className="w-20 h-20 bg-white/10 border-2 border-warm-ivory rounded-full flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md">
               <div className="w-16 h-16 bg-warm-ivory rounded-full" />
            </button>
         </div>
       )}
    </motion.div>
  )
}

function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<'vipps' | 'fetching' | 'result'>('vipps');

  const startLogin = () => {
    setStep('fetching');
    setTimeout(() => setStep('result'), 4000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-warm-ivory flex flex-col items-center justify-center p-6 lg:p-12 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518005020470-58b76007ec5b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-multiply opacity-[0.03] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {step === 'vipps' && (
          <motion.div 
            key="vipps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md flex flex-col items-center text-center space-y-12"
          >
            <div className="text-4xl font-display font-medium text-deep-navy tracking-tight flex items-center">
              era<span className="w-1.5 h-1.5 bg-muted-gold ml-1 text-deep-navy mb-2 block" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-display text-deep-navy tracking-tight">Velkommen hjem.</h1>
              <p className="text-base font-light text-deep-navy/60 text-balance px-4">
                Ta vare på boligen, helt automatisk. Din personlige AI-agent for eiendomsvedlikehold og trygg oppussing.
              </p>
            </div>

            <div className="w-full space-y-4">
              <MagneticButton 
                onClick={startLogin}
                className="w-full py-5 bg-[#FF5B24] text-white rounded-full text-base font-bold tracking-wide hover:shadow-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                Logg inn med Vipps
              </MagneticButton>
              <div className="text-xs font-light text-deep-navy/40">Trygg innlogging og sikker eiendomsverifisering.</div>
            </div>
          </motion.div>
        )}

        {step === 'fetching' && (
          <motion.div 
            key="fetching"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-sm flex flex-col items-center text-center space-y-10"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-[3px] border-deep-navy/5 rounded-full" />
              <div className="absolute inset-0 border-[3px] border-muted-gold rounded-full border-t-transparent animate-spin" />
              <MapPin size={28} className="text-deep-navy" strokeWidth={1.5} />
            </div>

            <div className="space-y-3">
               <h2 className="text-2xl font-display text-deep-navy">Analyserer eiendomsdata</h2>
               <div className="flex flex-col gap-2 text-sm font-light text-deep-navy/50 font-mono">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>✓ Autentisert via Vipps</motion.div>
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>✓ Kobler til Matrikkelen...</motion.div>
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>✓ Henter grunnbok og tinglysninger...</motion.div>
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>✓ Kjører første AI-modell...</motion.div>
               </div>
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-white shadow-2xl p-8 lg:p-12 space-y-10 border border-deep-navy/5 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-soft-beige rounded-bl-full -z-10" />
            
            <div className="w-20 h-20 bg-muted-gold/10 text-muted-gold rounded-full flex items-center justify-center mx-auto">
              <Check size={32} strokeWidth={2} />
            </div>

            <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40">Eiendom lokalisert</div>
              <h2 className="text-4xl font-display text-deep-navy tracking-tight">Myrerveien 46A</h2>
            </div>

            <div className="space-y-4 pb-6 border-b border-deep-navy/5 text-left">
               <div className="flex justify-between items-center bg-soft-beige p-4">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Matrikkel ID</div>
                 <div className="text-sm font-medium text-deep-navy">0301-54/1210</div>
               </div>
               <div className="flex justify-between items-center bg-soft-beige p-4">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Verifisert Hjemmelshaver</div>
                 <div className="text-sm font-medium text-deep-navy">Lars-Henrik Sand</div>
               </div>
            </div>

            <MagneticButton 
              onClick={onComplete}
              className="w-full py-5 bg-midnight text-warm-ivory text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-deep-navy transition-colors shadow-lg"
            >
              Åpne Boligprofil
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DocumentAnalyzerOverlay({ onClose, onArchive, onOpenProjectBrief }: { onClose: () => void, onArchive?: () => void, onOpenProjectBrief?: () => void }) {
  const [docState, setDocState] = useState<'uploading' | 'analyzing' | 'result'>('uploading');

  useEffect(() => {
    // Only automatically jump from uploading to analyzing to result in a real app would be triggered by an actual upload.
    // Since we simulate, we'll start progressing right away.
    const t1 = setTimeout(() => setDocState('analyzing'), 2000);
    const t2 = setTimeout(() => setDocState('result'), 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-warm-ivory text-deep-navy flex flex-col"
    >
       <div className="relative z-10 flex justify-between items-center p-6 lg:p-10 bg-warm-ivory/90 backdrop-blur-md">
          <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40 flex items-center gap-3">
             <span className={`w-2 h-2 rounded-full ${docState === 'result' ? 'bg-green-500' : 'bg-muted-gold animate-pulse'}`} />
             {docState === 'uploading' && 'Laster inn opplastning...'}
             {docState === 'analyzing' && 'ERA leser dokument...'}
             {docState === 'result' && 'Ekstraksjon fullført'}
          </div>
          <button onClick={onClose} className="p-3 bg-deep-navy/5 hover:bg-deep-navy/10 transition-colors rounded-full">
             <X size={20} />
          </button>
       </div>

       <div className="flex-1 flex flex-col items-center justify-center p-6">
          <AnimatePresence mode="wait">
             {docState === 'uploading' && (
                <motion.div key="upload" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center space-y-6">
                   <div className="w-24 h-32 bg-white shadow-xl relative flex items-center justify-center">
                     <FileText size={40} className="text-deep-navy/20" />
                   </div>
                   <p className="text-xl font-light text-deep-navy/60">Klargjør for AI-parsing</p>
                </motion.div>
             )}

             {docState === 'analyzing' && (
                <motion.div key="analyze" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center space-y-8">
                   <div className="w-64 h-80 bg-white shadow-2xl relative overflow-hidden flex flex-col p-6 text-[8px] text-deep-navy/20 font-mono leading-relaxed opacity-50">
                     <div className="w-full h-1/3 bg-gradient-to-b from-transparent via-muted-gold/20 to-transparent absolute inset-x-0 animate-[scan_2s_linear_infinite]" />
                     <p>FAKTURA NR: 104921</p>
                     <p>DATO: 14. August 2026</p>
                     <p>---</p>
                     <p>Kunde: Lars-Henrik Sand</p>
                     <p>Adresse: Myrerveien 46A</p>
                     <p>---</p>
                     <p>BESKRIVELSE:</p>
                     <p>Demontering av eksisterende OSO 200L.</p>
                     <p>Ny OSO Saga S 200 montert med ekspansjonskar.</p>
                     <p>Inkludert rør og deler.</p>
                     <p>---</p>
                     <p>Totalt INKL MVA: 18,500 NOK</p>
                   </div>
                   <div className="flex items-center gap-4 text-deep-navy/60">
                     <div className="w-4 h-4 border-2 border-muted-gold border-t-transparent rounded-full animate-spin" />
                     <span className="text-sm font-light tracking-wide">Trekker ut strukturert data...</span>
                   </div>
                </motion.div>
             )}

             {docState === 'result' && (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white p-8 shadow-2xl space-y-8 border border-deep-navy/5">
                   <div className="space-y-2 border-b border-deep-navy/10 pb-6 border-dashed">
                     <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Gjenkjent Dokument</div>
                     <h3 className="text-3xl font-display text-deep-navy">Faktura fra Rørlegger</h3>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="flex flex-col gap-1 pb-3 border-b border-deep-navy/5 border-dashed">
                        <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-deep-navy/40">Arbeid</span>
                        <span className="text-base text-deep-navy">Bytte av varmtvannsbereder (200L)</span>
                     </div>
                     <div className="flex flex-col gap-1 pb-3 border-b border-deep-navy/5 border-dashed">
                        <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-deep-navy/40">Dato</span>
                        <span className="text-base font-mono text-deep-navy">Aug 2026</span>
                     </div>
                     <div className="flex flex-col gap-1 pb-3 border-b border-deep-navy/5 border-dashed">
                        <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-deep-navy/40">Ny metadata utledet</span>
                        <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-1 self-start inline-flex items-center gap-1.5">
                           <Sparkles size={10} /> Garanti lagt til ut 2031
                        </span>
                     </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4">
                     <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { if(onArchive) onArchive(); onClose(); }} className="flex-1 py-4 bg-transparent border border-deep-navy/20 text-deep-navy text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-deep-navy/5 transition-colors">
                       Arkiver faktura
                     </motion.button>
                     <MagneticButton 
                       onClick={() => {
                         onClose();
                         if(onOpenProjectBrief) onOpenProjectBrief();
                       }} 
                       className="flex-1 py-4 bg-midnight text-warm-ivory text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-deep-navy transition-colors shadow-lg"
                     >
                       Innhent tilbud
                     </MagneticButton>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </motion.div>
  )
}


function HomeTab({ maintenanceScore, onOpenCamera, onOpenDocUpload, onOpenProjectBrief, onOpenDataModel }: { key?: string, maintenanceScore: number, onOpenCamera?: () => void, onOpenDocUpload?: () => void, onOpenProjectBrief?: () => void, onOpenDataModel?: () => void }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pt-32 lg:pt-48 px-6 lg:px-12 max-w-7xl mx-auto space-y-24 lg:space-y-48"
    >
        {/* INTRO & HERO */}
        <section className="space-y-12 lg:space-y-16">
           <div className="space-y-6">
             <div className="flex items-center gap-4">
               <span className="w-8 h-[1px] bg-muted-gold"></span>
               <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40">Eiendomsportefølje</span>
             </div>
             <h1 className="text-5xl sm:text-6xl lg:text-[110px] font-display font-medium text-deep-navy tracking-tightest leading-[0.9] text-balance">
               God kveld, Lars-Henrik.<br />
               <span className="text-deep-navy/30">Myrerveien 46A.</span>
             </h1>
           </div>

           {/* ARCHITECTURAL IMAGE FRAME */}
           <div className="relative w-full aspect-[4/3] lg:aspect-[21/9] bg-soft-beige overflow-hidden">
              <motion.div style={{ y, scale: 1.05 }} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518005020470-58b76007ec5b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-multiply opacity-80 transition-transform duration-[3s] ease-out will-change-transform" />
              <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 flex gap-4">
                 <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-deep-navy bg-warm-ivory px-4 py-2 border border-deep-navy/5">Primærbolig</div>
                 <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-deep-navy bg-warm-ivory/80 backdrop-blur-md px-4 py-2 border border-deep-navy/5">135 m²</div>
              </div>
           </div>
        </section>

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Score KPI */}
           <div className="p-6 border border-deep-navy/10 bg-white shadow-sm flex flex-col gap-4 group cursor-pointer hover:border-deep-navy/30 transition-colors" onClick={onOpenDataModel}>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40 flex justify-between items-center">
                <span>ERA Vedlikeholdsindeks</span>
                <Activity size={14} className="text-muted-gold" />
              </div>
              <div className="flex items-end gap-3 mt-4">
                  <div className="text-5xl font-display text-deep-navy tracking-tight leading-none">{maintenanceScore}<span className="text-2xl text-deep-navy/40">/100</span></div>
                  <div className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">Utmerket</div>
              </div>
           </div>

           {/* Potensielt Verdiløft KPI */}
           <div className="p-6 border border-deep-navy/10 bg-white shadow-sm flex flex-col gap-4 group cursor-pointer hover:border-deep-navy/30 transition-colors" onClick={onOpenDataModel}>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40 flex justify-between items-center">
                <span>Potensielt Verdiløft</span>
                <Sparkles size={14} className="text-muted-gold" />
              </div>
              <div className="mt-auto">
                  <div className="text-2xl font-display text-deep-navy tracking-tight pt-2">130k - 180k,-</div>
                  <div className="text-xs font-light text-deep-navy/60 mt-1">Estimert over 12 mnd (veiledende)</div>
              </div>
           </div>

           {/* Neste Uløste Oppgave KPI */}
           <div className="p-6 border border-deep-navy/10 bg-white shadow-sm flex flex-col gap-4">
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Neste Uløste Oppgave</div>
              <div className="mt-auto">
                  <div className="font-display text-deep-navy text-2xl tracking-tight pt-2">Rens takrenner</div>
                  <div className="text-xs font-light text-deep-navy/60 mt-1">Før høstens første uvær.</div>
              </div>
           </div>
        </section>

        {/* SESONGBASERT FOREBYGGING (PROAKTIVE NOTIFIKASJONER) */}
        <section className="bg-mild-clay/10 border border-mild-clay/20 p-8 lg:p-12 space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-mild-clay/10 rounded-bl-full -z-10" />
           <div className="flex items-start justify-between gap-8 flex-col sm:flex-row">
              <div className="space-y-4 max-w-xl">
                 <div className="flex items-center justify-between gap-6">
                   <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40 flex items-center gap-3">
                     <AlertTriangle size={14} className="text-[#FF5B24]" />
                     <span>Sesongvarsel & Forebygging</span>
                   </div>
                   <button 
                     onClick={() => {
                       if (window.Notification && Notification.permission !== "denied") {
                         Notification.requestPermission().then(permission => {
                           if (permission === "granted") {
                             new Notification("ERA: Frostvarsel for Myrerveien 46A", {
                               body: "Det er meldt -3°C i natt. Husk å stenge og tømme utekranen for vinteren for å unngå frostsprengte rør."
                             });
                           } else {
                             alert("Eksempel på push-varsel til telefon: 'ERA: Det er meldt -3°C i natt. Husk å stenge og tømme utekranen.'");
                           }
                         });
                       } else {
                         alert("Eksempel på push-varsel til telefon: 'ERA: Det er meldt -3°C i natt. Husk å stenge og tømme utekranen.'");
                       }
                     }}
                     className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-[0.2em] bg-white border border-deep-navy/10 px-3 py-1.5 rounded-full hover:bg-deep-navy/5 text-deep-navy cursor-pointer transition-colors shadow-sm hover:shadow-md"
                   >
                     <Bell size={12} className="text-[#FF5B24]" />
                     <span className="hidden sm:inline">Aktiver Push-varsel</span>
                   </button>
                 </div>
                 <h2 className="text-3xl lg:text-4xl font-display text-deep-navy tracking-tight">Kaldfront på vei. Frost i natt.</h2>
                 <p className="text-base text-deep-navy/60 font-light leading-relaxed">
                   AI-agenten følger med på lokalt vær. Det er meldt -3°C i natt. Har du husket å stenge og tømme utekranen for vinteren for å unngå frostsprengte rør?
                 </p>
              </div>
              <div className="shrink-0 flex gap-4 w-full sm:w-auto">
                 <MagneticButton className="bg-[#FF5B24] text-white px-8 py-4 flex-1 sm:flex-none text-center shadow-lg hover:shadow-xl transition-shadow text-[11px] uppercase font-bold tracking-[0.2em]">
                   TIPS TIL UTFØRELSE
                 </MagneticButton>
                 <button className="px-6 py-4 border border-deep-navy/10 text-deep-navy flex-1 sm:flex-none text-center hover:bg-deep-navy/5 transition-colors text-[11px] uppercase font-bold tracking-[0.2em]">
                   UTFØRT
                 </button>
              </div>
           </div>
           
           <div className="flex gap-4">
           </div>
        </section>

        {/* AI INTELLIGENCE */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24 relative">
          <div className="bg-soft-beige/50 absolute inset-0 -mx-6 lg:-mx-12 -my-12 lg:-my-24 -z-10" />
          
          <div className="space-y-4">
             <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40 flex items-center gap-3">
               <Sparkles size={14} className="text-muted-gold" />
               <span>ERA Observasjon</span>
             </div>
             <div className="w-12 h-[1px] bg-deep-navy/10" />
          </div>
          
          <div className="space-y-8 lg:space-y-12">
             <p className="text-2xl lg:text-5xl font-display text-deep-navy leading-[1.1] text-balance">
               Det er gått fire måneder siden forrige bildeanalyse av fasaden. Vintersesongen kan ha medført slitasje.
             </p>
             <div className="flex gap-10">
               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onOpenCamera} className="text-[11px] uppercase font-bold tracking-[0.2em] text-deep-navy border-b border-deep-navy pb-1 hover:text-muted-gold hover:border-muted-gold transition-all duration-300">
                  Ta nytt bilde
               </motion.button>
               <button className="text-[11px] uppercase font-bold tracking-[0.2em] text-deep-navy/40 hover:text-deep-navy transition-all duration-300">
                  Ignorer inntil videre
               </button>
             </div>
          </div>
        </section>

        {/* ACTIONS / PROGRESS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-1 lg:gap-px bg-deep-navy/5">
           <motion.button whileTap={{ scale: 0.98 }} className="bg-warm-ivory hover:bg-midnight hover:text-warm-ivory transition-colors duration-500 group aspect-square lg:aspect-[4/5] p-8 lg:p-12 flex flex-col justify-between items-start text-left">
             <div className="text-deep-navy/30 group-hover:text-muted-gold transition-colors duration-500">
               <Plus strokeWidth={1} size={32} />
             </div>
             <div className="space-y-6 w-full">
               <div className="flex justify-between items-end w-full border-t border-deep-navy/10 group-hover:border-warm-ivory/20 pt-6 transition-colors duration-500">
                  <h3 className="text-2xl lg:text-3xl font-display tracking-tight text-deep-navy group-hover:text-warm-ivory transition-colors duration-500 pr-4">Start Prosjekt</h3>
                  <ArrowRight size={18} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out text-muted-gold shrink-0 mb-1" />
               </div>
               <p className="text-sm font-light text-deep-navy/50 group-hover:text-warm-ivory/50 transition-colors duration-500">Beskriv arbeidet du vil ha utført i år.</p>
             </div>
           </motion.button>

           <motion.button whileTap={{ scale: 0.98 }} onClick={onOpenDocUpload} className="bg-warm-ivory hover:bg-midnight hover:text-warm-ivory transition-colors duration-500 group aspect-square lg:aspect-[4/5] p-8 lg:p-12 flex flex-col justify-between items-start text-left">
             <div className="text-deep-navy/30 group-hover:text-muted-gold transition-colors duration-500">
               <FileText strokeWidth={1} size={32} />
             </div>
             <div className="space-y-6 w-full">
               <div className="flex justify-between items-end w-full border-t border-deep-navy/10 group-hover:border-warm-ivory/20 pt-6 transition-colors duration-500">
                  <h3 className="text-2xl lg:text-3xl font-display tracking-tight text-deep-navy group-hover:text-warm-ivory transition-colors duration-500 pr-4">Dokumenter</h3>
                  <ArrowRight size={18} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out text-muted-gold shrink-0 mb-1" />
               </div>
               <p className="text-sm font-light text-deep-navy/50 group-hover:text-warm-ivory/50 transition-colors duration-500">Utvid boligens hukommelse.</p>
             </div>
           </motion.button>

           <motion.button whileTap={{ scale: 0.98 }} className="bg-warm-ivory hover:bg-midnight hover:text-warm-ivory transition-colors duration-500 group aspect-square lg:aspect-[4/5] p-8 lg:p-12 flex flex-col justify-between items-start text-left">
             <div className="text-deep-navy/30 group-hover:text-muted-gold transition-colors duration-500">
               <Sparkles strokeWidth={1} size={32} />
             </div>
             <div className="space-y-6 w-full">
               <div className="flex justify-between items-end w-full border-t border-deep-navy/10 group-hover:border-warm-ivory/20 pt-6 transition-colors duration-500">
                  <h3 className="text-2xl lg:text-3xl font-display tracking-tight text-deep-navy group-hover:text-warm-ivory transition-colors duration-500 pr-4">Spør ERA</h3>
                  <ArrowRight size={18} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out text-muted-gold shrink-0 mb-1" />
               </div>
               <p className="text-sm font-light text-deep-navy/50 group-hover:text-warm-ivory/50 transition-colors duration-500">Søk i eiendommens historie og data.</p>
             </div>
           </motion.button>
        </section>

    </motion.main>
  );
}

function PlanTab({ hasRequestedQuotes, quotesArrived, acceptedQuote, onAcceptQuote, onOpenProjectBrief, onOpenDataModel }: { key?: string, hasRequestedQuotes?: boolean, quotesArrived?: boolean, acceptedQuote?: string | null, onAcceptQuote?: (id: string) => void, onOpenProjectBrief?: (id: string) => void, onOpenDataModel?: () => void }) {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <>
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pt-32 lg:pt-48 px-6 lg:px-12 max-w-5xl mx-auto space-y-24"
      >
        <section className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-12 border-b border-deep-navy/10 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-8 h-[1px] bg-muted-gold"></span>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40">Fremtidig verdibevaring</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-medium text-deep-navy tracking-tight leading-tight">
              Strategisk Plan.
            </h1>
            <p className="text-xl text-deep-navy/50 font-light max-w-2xl text-balance">
              Basert på estimert levetid av overflater og struktur, har ERA satt opp anbefalte tidspunkt for vedlikehold.
            </p>
          </div>
          
          <MagneticButton 
            onClick={() => setIsGenerating(true)} 
            className="shrink-0 bg-midnight text-warm-ivory px-8 py-5 flex items-center gap-4 hover:bg-deep-navy transition-colors shadow-xl"
          >
            <Sparkles size={20} className="text-muted-gold" />
            <span className="text-[11px] uppercase font-bold tracking-[0.2em]">Kjør ny analyse</span>
          </MagneticButton>
        </section>

        <section className="space-y-12 pb-32">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-[100px_1fr] sm:grid-cols-[150px_1fr] gap-6 sm:gap-12 group transition-colors">
             <div className="text-deep-navy/40 font-display text-xl lg:text-3xl mt-1 pt-4">2026</div>
             <div className="space-y-4 border-l border-deep-navy/10 pl-6 lg:pl-12 pb-12 relative transition-colors duration-500">
               <div className={`absolute top-6 -left-1.5 w-3 h-3 bg-warm-ivory border-[2px] rounded-full transition-colors ${acceptedQuote ? 'border-green-500 bg-green-500/20' : (hasRequestedQuotes ? 'border-muted-gold shadow-[0_0_10px_rgba(184,151,104,0.5)]' : 'border-muted-gold')}`} />
               
               <div 
                 onClick={() => !hasRequestedQuotes && onOpenProjectBrief && onOpenProjectBrief('maling')} 
                 className={`p-4 -ml-4 rounded-sm transition-colors ${!hasRequestedQuotes ? 'cursor-pointer hover:bg-soft-beige/30 group/inner' : ''}`}
               >
                 <div className="flex items-center gap-4">
                   <div className={`text-[10px] uppercase font-bold tracking-[0.2em] ${acceptedQuote ? 'text-green-600' : 'text-muted-gold'}`}>
                     {acceptedQuote ? 'Oppdrag låst' : (hasRequestedQuotes ? 'Avventer Svar / Tilbud Mottatt' : 'Anbefalt Tiltak')}
                   </div>
                   {!hasRequestedQuotes && (
                     <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40 opacity-0 -translate-x-4 group-hover/inner:opacity-100 group-hover/inner:translate-x-0 transition-all duration-500 flex items-center gap-2">
                       Gjennomfør <ArrowRight size={12} />
                     </div>
                   )}
                 </div>
                 <div className="text-2xl lg:text-4xl font-display text-deep-navy leading-tight mt-4">Maling av sør- og vestfasade</div>
                 <p className="text-sm font-light text-deep-navy/60 max-w-lg mt-4">Trevirke er estimert til å miste beskyttelse etter 10 år. Sørveggen har hardest soleksponering og ERA anbefaler tiltak i år.</p>
               </div>

               {hasRequestedQuotes && !acceptedQuote && (
                 <div className="mt-8 pt-8 border-t border-deep-navy/10 min-h-[300px]">
                   <h4 className="text-[11px] uppercase font-bold tracking-[0.2em] text-deep-navy mb-6">Mottatte Tilbud</h4>
                   {!quotesArrived ? (
                     <div className="flex flex-col items-center justify-center space-y-6 h-full py-12">
                       <div className="relative w-16 h-16 flex items-center justify-center">
                         <div className="absolute inset-0 border-[2px] border-deep-navy/5 rounded-full" />
                         <div className="absolute inset-0 border-[2px] border-muted-gold rounded-full border-t-transparent animate-spin" />
                       </div>
                       <p className="text-deep-navy/50 font-light text-sm">Innhenter tilbud fra sertifiserte håndverkere...</p>
                     </div>
                   ) : (
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         {/* Quote 1 */}
                     <div className="bg-white p-6 md:p-8 space-y-6 shadow-xl border border-deep-navy/5 relative overflow-hidden group/quote hover:border-muted-gold/30 transition-colors">
                       <div className="absolute top-0 right-0 p-4">
                         <div className="flex items-center gap-1 text-muted-gold">
                           <Shield size={14} className="fill-muted-gold" />
                           <span className="text-[9px] uppercase tracking-wider font-bold">ERA Sert.</span>
                         </div>
                       </div>
                       <div className="space-y-1">
                         <h5 className="font-display text-xl text-deep-navy">Malermester Hansen AS</h5>
                         <div className="flex flex-wrap items-center gap-3 text-xs font-light text-deep-navy/50">
                           <span className="flex items-center gap-1"><Sparkles size={12} /> 4.8/5</span>
                           <span>•</span>
                           <span>Verifiserte ERA-jobber: 12</span>
                         </div>
                       </div>
                       <div className="text-4xl font-display text-deep-navy">kr 42.000,-</div>
                       <ul className="text-sm font-light text-deep-navy/70 space-y-3 py-4">
                         <li className="flex items-center gap-3"><Check size={14} className="text-green-500 shrink-0" /> Vask og skraping inngår</li>
                         <li className="flex items-center gap-3"><Check size={14} className="text-green-500 shrink-0" /> 2 strøk premium dekkbeis</li>
                         <li className="flex items-center gap-3"><Check size={14} className="text-green-500 shrink-0" /> Oppstart neste uke</li>
                       </ul>
                       <MagneticButton onClick={() => onAcceptQuote && onAcceptQuote('hansen')} className="w-full py-4 bg-midnight text-warm-ivory text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-deep-navy transition-colors shadow-lg">
                         Aksepter Tilbud
                       </MagneticButton>
                     </div>

                     {/* Quote 2 */}
                     <div className="bg-white p-6 md:p-8 space-y-6 shadow-xl border border-deep-navy/5 relative overflow-hidden group/quote hover:border-deep-navy/20 transition-colors">
                       <div className="absolute top-0 right-0 p-4">
                         <div className="flex items-center gap-1 text-muted-gold">
                           <Shield size={14} className="fill-muted-gold" />
                           <span className="text-[9px] uppercase tracking-wider font-bold">ERA Sert.</span>
                         </div>
                       </div>
                       <div className="space-y-1">
                         <h5 className="font-display text-xl text-deep-navy">Nordisk Bygg & Fasad</h5>
                         <div className="flex flex-wrap items-center gap-3 text-xs font-light text-deep-navy/50">
                           <span className="flex items-center gap-1"><Sparkles size={12} /> 4.9/5</span>
                           <span>•</span>
                           <span>Verifiserte ERA-jobber: 34</span>
                         </div>
                       </div>
                       <div className="text-4xl font-display text-deep-navy">kr 38.500,-</div>
                       <ul className="text-sm font-light text-deep-navy/70 space-y-3 py-4">
                         <li className="flex items-center gap-3"><Check size={14} className="text-green-500 shrink-0" /> Vask og skraping inngår</li>
                         <li className="flex items-center gap-3"><Check size={14} className="text-green-500 shrink-0" /> 2 strøk standard oljedekkbeis</li>
                         <li className="flex items-center gap-3"><Check size={14} className="text-green-500 shrink-0" /> Oppstart om 3 uker</li>
                       </ul>
                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onAcceptQuote && onAcceptQuote('nordisk')} className="w-full py-4 bg-transparent border border-deep-navy/20 text-deep-navy text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-deep-navy/5 transition-colors">
                         Aksepter Tilbud
                       </motion.button>
                     </div>
                   </div>
                     </motion.div>
                   )}
                 </div>
               )}

               <AnimatePresence>
                 {acceptedQuote && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-8 overflow-hidden">
                     <div className="bg-green-500/10 p-6 md:p-8 border border-green-500/20 text-center space-y-6 rounded-sm relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -z-10" />
                       <div className="w-16 h-16 bg-green-500/20 text-green-700 rounded-full flex items-center justify-center mx-auto">
                         <Check size={28} strokeWidth={2} />
                       </div>
                       <div className="space-y-3">
                         <h4 className="text-2xl font-display text-deep-navy">Oppdrag Bundet</h4>
                         <p className="text-sm text-deep-navy/70 max-w-md mx-auto leading-relaxed">
                           Du har valgt <strong>{acceptedQuote === 'hansen' ? 'Malermester Hansen AS' : 'Nordisk Bygg & Fasad'}</strong>.<br/>
                           Dialog og fakturering skjer automatisk og trygt gjennom ERA.
                         </p>
                       </div>
                       <div className="inline-flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase font-bold tracking-widest text-deep-navy/60 bg-white/50 px-6 py-4 rounded-full border border-green-500/20 shadow-sm mt-4">
                         <span>Escrow / Avtalegiro etablert</span>
                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                         <span className="text-green-700">ERA Transaksjonsfee: {acceptedQuote === 'hansen' ? '2.100,-' : '1.925,-'} (5%)</span>
                       </div>
                     </div>
                   </motion.div>
                 )}
                </AnimatePresence>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-[100px_1fr] sm:grid-cols-[150px_1fr] gap-6 sm:gap-12 group cursor-pointer hover:bg-soft-beige/30 p-4 -ml-4 transition-colors">
             <div className="text-deep-navy/30 font-display text-xl lg:text-3xl mt-1">2028</div>
             <div className="space-y-4 border-l border-deep-navy/10 pl-6 lg:pl-12 pb-12 relative group-hover:border-deep-navy/30 transition-colors duration-500">
               <div className="absolute top-2 -left-1.5 w-3 h-3 bg-warm-ivory border-[2px] border-deep-navy/20 rounded-full group-hover:border-deep-navy/40 transition-colors" />
               <div className="flex items-center justify-between">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Rutinesjekk</div>
               </div>
               <div className="text-2xl lg:text-4xl font-display text-deep-navy/70 leading-tight">Lovpålagt el-tilsyn</div>
               <p className="text-sm font-light text-deep-navy/50 max-w-lg">Forrige kontroll ble utført da boligen var ny i 2018. Anbefalt intervall er 10 år for boligmasser.</p>
             </div>
          </motion.div>
        </section>

        {/* ØKONOMI & ENERGI (ROI & ENOVA) */}
        <section className="bg-mild-clay/10 border border-mild-clay/20 p-8 lg:p-12 space-y-12 relative overflow-hidden mb-32">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-deep-navy/10 pb-8">
             <div className="space-y-4">
                <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40 flex items-center gap-3">
                  <Zap size={14} className="text-muted-gold" />
                  <span>Enova & Oppgraderinger (Estimater)</span>
                </div>
                <h2 className="text-3xl lg:text-5xl font-display text-deep-navy tracking-tight">Potensial & Økonomi.</h2>
                <p className="text-base text-deep-navy/60 font-light max-w-xl leading-relaxed text-balance">
                  ERA modellerer aktuelle energitiltak basert på byggeår (2018) og bruttoareal. Dette er veiledende estimater for forbedring av energikarakter og potensielle støtteordninger.
                </p>
             </div>
             <div className="shrink-0 bg-white p-4 border border-deep-navy/5 text-center min-w-[200px]">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40 mb-1">Dagens Energimerking</div>
                <div className="text-4xl font-display text-[#8BA888] font-bold">C</div>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Solceller */}
              <div className="bg-white border border-deep-navy/5 p-8 relative group hover:border-deep-navy/20 transition-colors">
                 <div className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-widest text-[#8BA888] bg-[#8BA888]/10 px-3 py-1">Mulig Oppgradering</div>
                 <h3 className="text-2xl font-display text-deep-navy mb-2 mt-4">Solcelleanlegg (Tak)</h3>
                 <p className="text-sm font-light text-deep-navy/60 leading-relaxed mb-8">
                   Ditt tak på 85m² har god sydvendt vinkel. Estimert årlig produksjon er 8.500 kWh. Kan potensielt heve energimerket til B.
                 </p>
                 
                 <div className="space-y-4 border-t border-deep-navy/10 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-light text-deep-navy/60">Estimert Investering</span>
                      <span className="text-sm font-medium text-deep-navy">130.000 - 150.000,-</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-light text-deep-navy/60">Enova-støtte (veiledende)</span>
                      <span className="text-sm font-medium text-green-600 block">Inntil 32.500,-</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-deep-navy/5">
                      <span className="text-xs font-light text-deep-navy/40 uppercase tracking-wider">Antatt inntjeningstid</span>
                      <span className="text-sm font-medium text-deep-navy">~ 7-9 år</span>
                    </div>
                 </div>
              </div>

              {/* Varmepumpe */}
              <div className="bg-white border border-deep-navy/5 p-8 relative group hover:border-deep-navy/20 transition-colors">
                 <div className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-widest text-[#8BA888] bg-[#8BA888]/10 px-3 py-1">Alternativt Tiltak</div>
                 <h3 className="text-2xl font-display text-deep-navy mb-2 mt-4">Væske-til-vann Varmepumpe</h3>
                 <p className="text-sm font-light text-deep-navy/60 leading-relaxed mb-8">
                   Boligen har vannbåren varme i alle oppholdsrom. Overgang fra el-kjel reduserer strømforbruk til oppvarming betraktelig.
                 </p>
                 
                 <div className="space-y-4 border-t border-deep-navy/10 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-light text-deep-navy/60">Estimert Inv. (inkl. brønn)</span>
                      <span className="text-sm font-medium text-deep-navy">200.000 - 250.000,-</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-light text-deep-navy/60">Enova-støtte (veiledende)</span>
                      <span className="text-sm font-medium text-green-600">Inntil 10.000,-</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-deep-navy/5">
                      <span className="text-xs font-light text-deep-navy/40 uppercase tracking-wider">Antatt inntjeningstid</span>
                      <span className="text-sm font-medium text-deep-navy">~ 10-12 år</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="bg-warm-ivory/50 border border-deep-navy/10 p-5 rounded-sm flex flex-col md:flex-row items-start gap-4 mt-8">
             <Shield size={18} className="text-deep-navy/40 shrink-0 mt-0.5" />
             <div className="flex-1">
               <p className="text-xs font-light text-deep-navy/60 leading-relaxed text-balance">
                 <strong className="font-medium text-deep-navy/80 tracking-wide uppercase text-[10px]">Ansvarsfraskrivelse:</strong> Tallene vist ovenfor er kalkulerte gjennomsnittsestimater levert av ERA-modellen. Dette utgjør <em>ikke</em> finansiell, juridisk, eller forsikringsteknisk rådgivning. Utgifter, støttesatser, ROI og endelig energibesparelse vil avvike basert på reelle markedsforhold, valgt leverandør, lokal geografi, og faktisk forbruksmønster. For nøyaktig pris anbefales det alltid å innhente kvalifiserte tilbud.
               </p>
               <button onClick={onOpenDataModel} className="mt-4 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-gold hover:text-deep-navy transition-colors">
                 Se Datagrunnlag & Kilder
               </button>
             </div>
           </div>
        </section>

      </motion.main>

      <AnimatePresence>
        {isGenerating && <PlanGeneratorOverlay onClose={() => setIsGenerating(false)} />}
      </AnimatePresence>
    </>
  )
}

function DnaTab() {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pt-32 lg:pt-48 px-6 lg:px-12 max-w-7xl mx-auto space-y-24"
    >
      <section className="space-y-6 border-b border-deep-navy/10 pb-16">
        <div className="flex items-center gap-4">
          <span className="w-8 h-[1px] bg-muted-gold"></span>
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40">Statisk Eiendomsdata</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-display font-medium text-deep-navy tracking-tight leading-tight">
          Bolig-DNA.
        </h1>
        <p className="text-xl text-deep-navy/50 font-light max-w-2xl text-balance">
          Hjernen og det tekniske grensesnittet for Myrerveien 46A. Alle faste spesifikasjoner og installasjoner samlet på ett sted.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Dimensjoner & Fakta */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
             <Activity className="text-muted-gold" size={18} />
             <h3 className="text-2xl font-display text-deep-navy">Eiendomsfakta</h3>
           </div>
           <div className="grid grid-cols-2 gap-px bg-deep-navy/5 border border-deep-navy/5">
              <div className="bg-white p-6 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Byggeår</div>
                <div className="text-lg font-medium text-deep-navy">2018 (TEK17)</div>
              </div>
              <div className="bg-white p-6 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Bruksareal (BRA)</div>
                <div className="text-lg font-medium text-deep-navy">135 m²</div>
              </div>
              <div className="bg-white p-6 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Tomt</div>
                <div className="text-lg font-medium text-deep-navy">Eiet, 452 m²</div>
              </div>
              <div className="bg-white p-6 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Gnr/Bnr</div>
                <div className="text-lg font-medium text-deep-navy">54 / 1210</div>
              </div>
           </div>
        </div>

        {/* Fargekoder */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
             <Droplets className="text-muted-gold" size={18} />
             <h3 className="text-2xl font-display text-deep-navy">Fargekoder (NCS)</h3>
           </div>
           <div className="space-y-4">
             <div className="flex items-center gap-4 bg-white border border-deep-navy/5 p-4 relative overflow-hidden group hover:border-deep-navy/20 transition-colors">
                <div className="w-12 h-12 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#D4CDC1' }} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-deep-navy">Stue / Kjøkken</div>
                  <div className="text-xs font-mono text-deep-navy/50">Jotun 10678 Space (NCS S1502-Y)</div>
                </div>
             </div>
             <div className="flex items-center gap-4 bg-white border border-deep-navy/5 p-4 relative overflow-hidden group hover:border-deep-navy/20 transition-colors">
                <div className="w-12 h-12 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#576766' }} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-deep-navy">Hovedsoverom</div>
                  <div className="text-xs font-mono text-deep-navy/50">Jotun 6352 Evening Green (NCS S6010-B90G)</div>
                </div>
             </div>
             <div className="flex items-center gap-4 bg-white border border-deep-navy/5 p-4 relative overflow-hidden group hover:border-deep-navy/20 transition-colors">
                <div className="w-12 h-12 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#FAFAFA' }} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-deep-navy">Lister & Tak</div>
                  <div className="text-xs font-mono text-deep-navy/50">Klassisk Hvit (NCS S0500-N)</div>
                </div>
             </div>
           </div>
        </div>

        {/* Teknisk / Rør / Sikringer */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
             <Zap className="text-muted-gold" size={18} />
             <h3 className="text-2xl font-display text-deep-navy">Teknisk & Infrastruktur</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-mild-clay/10 p-6 border border-mild-clay/20 space-y-3">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/60">Hovedstoppekran</div>
                 <div className="text-base text-deep-navy font-medium">Under vasken på vaskerom (1. etg)</div>
                 <div className="text-xs font-light text-deep-navy/60 leading-relaxed mt-2">Sist inspisert: Feb 2024. Rør i rør-system fra 2018. Rørskap i gang nede.</div>
              </div>
              <div className="bg-mild-clay/10 p-6 border border-mild-clay/20 space-y-3">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/60">Sikringsskap</div>
                 <div className="text-base text-deep-navy font-medium">I entré bak speilskap.</div>
                 <div className="text-xs font-light text-deep-navy/60 leading-relaxed mt-2">Hovedsikring 63A. Automatsikringer jordfeilbryter kl. A på alle 16 kurser.</div>
                 <button className="mt-4 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-gold hover:text-deep-navy transition-colors">
                   <FileDown size={14} /> Samsvarserklæring (2018)
                 </button>
              </div>
              <div className="bg-mild-clay/10 p-6 border border-mild-clay/20 space-y-3 sm:col-span-2 relative group hover:border-deep-navy/20 transition-colors">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/60">Ventilasjon (Balansert)</div>
                 <div className="text-base text-deep-navy font-medium">Villavent Flexit UNI 3</div>
                 <div className="text-xs font-light text-deep-navy/60 leading-relaxed mt-2">Aggregat plassert på mørkeloft. Filter: G4 (Art nr. 116422). Skiftes 2 ggr. i året.</div>
                 <div className="pt-4 mt-2 border-t border-deep-navy/5 flex gap-4">
                   <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-gold hover:text-deep-navy transition-colors">
                     <FileDown size={14} /> Brukermanual
                   </button>
                   <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-gold hover:text-deep-navy transition-colors">
                     <FileDown size={14} /> Monteringsanvisning
                   </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Abonnementer / Avtaler */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
             <Wifi className="text-muted-gold" size={18} />
             <h3 className="text-2xl font-display text-deep-navy">Tilknyttede Tjenester</h3>
           </div>
           <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-white p-5 border border-deep-navy/5">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Strømleverandør</div>
                  <div className="text-sm font-medium text-deep-navy mt-1">Tibber Spotpris</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-deep-navy/60">Siden: Okt 2021</div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white p-5 border border-deep-navy/5">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Internett & TV</div>
                  <div className="text-sm font-medium text-deep-navy mt-1">Telenor (Fiber 500/500)</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-deep-navy/60">Bindingstid ute</div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white p-5 border border-deep-navy/5">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Boligforsikring</div>
                  <div className="text-sm font-medium text-deep-navy mt-1">Gjensidige HUS Super</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-deep-navy/60 mt-1">Avtalenr. 841295</div>
                </div>
              </div>
           </div>
        </div>

      </div>
    </motion.main>
  )
}

function PlanGeneratorOverlay({ onClose }: { onClose: () => void }) {
  const [genState, setGenState] = useState<'gathering' | 'analyzing' | 'compiling' | 'result'>('gathering');

  useEffect(() => {
    const t1 = setTimeout(() => setGenState('analyzing'), 2000);
    const t2 = setTimeout(() => setGenState('compiling'), 4500);
    const t3 = setTimeout(() => setGenState('result'), 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-warm-ivory text-deep-navy flex flex-col justify-center items-center p-6"
    >
       {genState !== 'result' ? (
         <div className="w-full max-w-lg space-y-12">
            <div className="flex justify-center mb-8">
               <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 border-[3px] border-deep-navy/5 rounded-full" />
                  <div className="absolute inset-0 border-[3px] border-muted-gold rounded-full border-t-transparent animate-spin" />
                  <Sparkles size={28} className="text-muted-gold" strokeWidth={1.5} />
               </div>
            </div>
            
            <div className="space-y-6">
               <h2 className="text-3xl text-center font-display text-deep-navy">Systematiserer eiendom...</h2>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm font-light">
                     <div className={`w-3 h-3 rounded-full flex-shrink-0 ${genState === 'gathering' ? 'bg-muted-gold animate-pulse' : 'bg-green-500'}`} />
                     <span className={genState === 'gathering' ? 'text-deep-navy' : 'text-deep-navy/50'}>
                       Trinn 1: Henter Matrikkel-data, byggeår og klimasone (Kystnært, Viken)
                     </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-light">
                     <div className={`w-3 h-3 rounded-full flex-shrink-0 ${genState === 'analyzing' ? 'bg-muted-gold animate-pulse' : (genState === 'compiling' || genState === 'result' ? 'bg-green-500' : 'bg-deep-navy/10')}`} />
                     <span className={genState === 'analyzing' ? 'text-deep-navy' : 'text-deep-navy/50'}>
                       Trinn 2: Vision Engine analyserer 12 nylige bilder for svikt (NS 3451)
                     </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-light">
                     <div className={`w-3 h-3 rounded-full flex-shrink-0 ${genState === 'compiling' ? 'bg-muted-gold animate-pulse' : (genState === 'result' ? 'bg-green-500' : 'bg-deep-navy/10')}`} />
                     <span className={genState === 'compiling' ? 'text-deep-navy' : 'text-deep-navy/50'}>
                       Trinn 3: Kryssjekker vedlikeholdshistorikk mot levetidstabeller
                     </span>
                  </div>
               </div>
            </div>
         </div>
       ) : (
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white p-8 shadow-2xl border border-deep-navy/5 space-y-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <Check size={28} strokeWidth={2} />
            </div>
            
            <div className="space-y-2 pb-6 border-b border-deep-navy/10">
               <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Analyse fullført</div>
               <h3 className="text-3xl font-display text-deep-navy">Plan generert</h3>
               <p className="text-deep-navy/60 font-light text-sm pt-2">Fant 2 anbefalte utbedringer basert på bildeanalyse av Sørveggen og estimert levetid på malingspigmenter.</p>
            </div>
            
            <MagneticButton 
              onClick={onClose} 
              className="w-full py-4 bg-midnight text-warm-ivory text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-deep-navy transition-colors"
            >
               Se ny Strategisk Plan
            </MagneticButton>
         </motion.div>
       )}
    </motion.div>
  )
}

function ProjectBriefOverlay({ onClose, onRequestQuotes }: { onClose: () => void, onRequestQuotes?: () => void }) {
  const [shareState, setShareState] = useState<'idle' | 'sharing' | 'shared'>('idle');

  const handleShare = () => {
    setShareState('sharing');
    setTimeout(() => {
      setShareState('shared');
    }, 2500);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed inset-0 z-[100] bg-warm-ivory text-deep-navy flex flex-col overflow-y-auto"
    >
       <div className="sticky top-0 z-10 flex justify-between items-center p-6 lg:p-10 bg-warm-ivory/90 backdrop-blur-md">
          <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40 flex items-center gap-3">
             <span className="w-2 h-2 bg-muted-gold rounded-full" />
             ERA Prosjektunderlag
          </div>
          <button onClick={onClose} className="p-3 bg-deep-navy/5 hover:bg-deep-navy/10 transition-colors rounded-full text-deep-navy">
             <X size={20} />
          </button>
       </div>

       <div className="flex-1 max-w-4xl mx-auto w-full px-6 lg:px-12 pb-32">
          {shareState === 'shared' ? (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-muted-gold/20 rounded-full flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 border border-muted-gold rounded-full animate-ping opacity-20" />
                  <Check size={40} className="text-muted-gold" />
                </div>
                <h2 className="text-4xl lg:text-6xl font-display text-deep-navy tracking-tight">Prosjektet er delt.</h2>
                <p className="text-xl text-deep-navy/60 font-light max-w-lg text-balance">
                  Underlaget er sendt til tre kvalitetssikrede malermestere. Du vil motta presise estimater pr. kvm i ERA i løpet av 48 timer.
                </p>
                <div className="pt-8">
                  <button onClick={onRequestQuotes || onClose} className="text-[11px] uppercase font-bold tracking-[0.2em] text-deep-navy border-b border-deep-navy pb-1 hover:text-muted-gold hover:border-muted-gold transition-colors">
                    Tilbake til plan
                  </button>
                </div>
             </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-6 mb-16 pt-8 lg:pt-16">
                 <h1 className="text-4xl lg:text-7xl font-display font-medium text-deep-navy tracking-tight leading-tight">
                   Maling av sør- og vestfasade.
                 </h1>
                 <p className="text-xl lg:text-2xl text-deep-navy/50 font-light text-balance max-w-2xl">
                   ERA har forfattet en byggeteknisk beskrivelse basert på boligens data. Dette fjerner behovet for fysisk befaring og minsker usikkerhet for håndverker.
                 </p>
              </div>

              <div className="bg-white p-8 lg:p-16 space-y-12 relative border border-deep-navy/5 shadow-xl">
                 <div className="absolute top-0 right-4 lg:right-12 -translate-y-1/2 bg-midnight text-warm-ivory text-[9px] uppercase font-bold tracking-[0.2em] px-4 py-2 flex items-center gap-2 shadow-lg">
                   <Sparkles size={12} className="text-muted-gold" />
                   Generert av ERA
                 </div>

                 <div className="space-y-4">
                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Objekt for prosjekt</div>
                    <div className="text-xl font-medium text-deep-navy flex gap-4">
                      <span className="w-1 bg-muted-gold shrink-0" />
                      Rekkehus (Byggeår 2018), Liggende trepaneler.
                    </div>
                 </div>

                 <div className="space-y-4 pt-4">
                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40 border-b border-deep-navy/10 pb-4">Omfang & Volum</div>
                    <p className="text-lg lg:text-xl text-deep-navy/80 font-light leading-relaxed pt-2">
                      Overflatebehandling av sørvendt og vestvendt fasade, totalt nøyaktig målt til <span className="font-medium text-deep-navy">43.5 kvm</span>. Boligen går over to fullverdige etasjer, og det kreves stillas for oppføring fordi helningen på tomten mot vest er beregnet til ca 15 grader. Gavlvegg er uten vinduer.
                    </p>
                 </div>

                 <div className="space-y-4 pt-4">
                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40 border-b border-deep-navy/10 pb-4">Gjeldende Tilstand & Behov</div>
                    <p className="text-lg lg:text-xl text-deep-navy/80 font-light leading-relaxed pt-2">
                      ERA bildeanalyse (Senest 12. mai 2026) viser tidlig falming av fargepigmenter i nedre felt. <span className="font-medium text-deep-navy">Ingen tegn til råte eller fuktskade</span>. Sist overflatebehandlet ifbm. oppføring. Arbeidet krever husvask, skraping av løst virke, grunning på eventuelle bare flekker, og to toppstrøk.
                    </p>
                 </div>
                 
                 <div className="flex flex-wrap gap-4 pt-8 border-t border-deep-navy/10">
                   <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.15em] text-deep-navy bg-soft-beige px-4 py-3">
                     <Camera size={16} className="text-muted-gold" />
                     8 Vedlagte Observasjoner
                   </div>
                   <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.15em] text-deep-navy bg-soft-beige px-4 py-3">
                     <FileText size={16} className="text-muted-gold" />
                     Fargekode: Jotun 0706
                   </div>
                 </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 lg:gap-6">
                 <MagneticButton 
                   onClick={handleShare}
                   disabled={shareState === 'sharing'}
                   className="flex-1 bg-midnight text-warm-ivory px-8 py-6 flex items-center justify-center gap-4 group hover:bg-deep-navy transition-colors duration-500 ease-out"
                 >
                    <span className="text-[11px] uppercase font-bold tracking-[0.2em]">
                      {shareState === 'sharing' ? 'Sender forespørsel...' : 'Del med ERA-verifiserte partnere'}
                    </span>
                    {shareState === 'sharing' ? (
                       <div className="w-5 h-5 border-2 border-muted-gold border-t-transparent rounded-full animate-spin" />
                    ) : (
                       <ArrowRight size={20} className="text-muted-gold group-hover:translate-x-2 transition-transform duration-500" />
                    )}
                 </MagneticButton>
                 <motion.button whileTap={{ scale: 0.98 }} className="px-8 py-6 bg-transparent border border-deep-navy/20 text-deep-navy text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-deep-navy/5 transition-colors duration-500">
                    Eksporter PDF
                 </motion.button>
              </div>
            </motion.div>
          )}
       </div>
    </motion.div>
  )
}


function CraftsmanBriefView({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'nye' | 'aktive' | 'fdv'>('nye');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-midnight text-warm-ivory flex flex-col overflow-y-auto"
    >
       <div className="sticky top-0 z-10 flex justify-between items-center p-6 lg:p-10 bg-midnight/90 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 flex items-center gap-3">
               <span className="w-2 h-2 bg-muted-gold rounded-full" />
               Bedriftsportal: Malermester Hansen
            </div>
            <div className="hidden sm:flex gap-4 ml-8">
              <button onClick={() => setActiveTab('nye')} className={`text-[10px] uppercase font-bold tracking-[0.2em] transition-colors pb-1 ${activeTab === 'nye' ? 'text-muted-gold border-b border-muted-gold' : 'text-white/40 hover:text-white'}`}>Nye Forespørsler</button>
              <button onClick={() => setActiveTab('aktive')} className={`text-[10px] uppercase font-bold tracking-[0.2em] transition-colors pb-1 ${activeTab === 'aktive' ? 'text-muted-gold border-b border-muted-gold' : 'text-white/40 hover:text-white'}`}>Aktive Oppdrag (2)</button>
              <button onClick={() => setActiveTab('fdv')} className={`text-[10px] uppercase font-bold tracking-[0.2em] transition-colors pb-1 ${activeTab === 'fdv' ? 'text-muted-gold border-b border-muted-gold' : 'text-white/40 hover:text-white'}`}>FDV Leveransesenter</button>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-full text-white">
             <X size={20} />
          </button>
       </div>

       <div className="flex-1 max-w-5xl mx-auto w-full px-6 lg:px-12 py-16 space-y-16">
          {activeTab === 'nye' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="space-y-6">
                 <h1 className="text-4xl lg:text-6xl font-display font-medium text-white tracking-tight leading-tight">
                   Nye Forespørsler.
                 </h1>
                 <p className="text-xl text-white/50 font-light text-balance max-w-2xl">
                   Du har 1 ny henvendelse fra ditt ERA-partnernettverk.
                 </p>
              </div>

              <div className="bg-deep-navy p-8 lg:p-12 space-y-12 border border-white/5 shadow-2xl relative">
                 <div className="absolute top-0 right-8 -translate-y-1/2 bg-muted-gold text-deep-navy text-[9px] uppercase font-bold tracking-[0.2em] px-4 py-2 flex items-center gap-2">
                   <Sparkles size={12} />
                   Verifisert ERA-data
                 </div>

                 <div className="space-y-2">
                    <h2 className="text-2xl font-display text-white">Maling av sør- og vestfasade</h2>
                    <p className="text-sm font-light text-white/50">Myrerveien 46A, 0494 Oslo (Lars-Henrik Sand)</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-y border-white/5 py-8">
                   <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Objekt</div>
                      <div className="text-lg font-medium text-white">Rekkehus (Byggeår 2018)</div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Materialer</div>
                      <div className="text-lg font-medium text-white">Liggende trepaneler</div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Kalkulert Omfang</div>
                      <div className="text-lg font-medium text-white">43.5 kvm</div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Terrengets Helning</div>
                      <div className="text-lg font-medium text-white">15 grader (Stillas påkrevd)</div>
                   </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setActiveTab('aktive')} className="flex-1 bg-muted-gold text-deep-navy px-8 py-4 text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-white transition-colors duration-500 text-center">
                       Gi Pris & Aksepter
                    </button>
                    <button className="px-8 py-4 bg-transparent border border-white/20 text-white text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-white/5 transition-colors duration-500 text-center">
                       Avslå
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'aktive' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               <div className="space-y-6">
                 <h1 className="text-4xl lg:text-5xl font-display font-medium text-white tracking-tight leading-tight">
                   Pågående Oppdrag.
                 </h1>
               </div>
               <div className="grid grid-cols-1 gap-6">
                 <div className="bg-white/5 border border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div>
                     <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2">Oppstart: Om 2 uker</div>
                     <div className="text-xl font-medium text-white">Utskifting av kledning (Bakhage)</div>
                     <div className="text-sm text-white/50">Storgata 12, Oslo</div>
                   </div>
                   <button className="text-[10px] uppercase font-bold tracking-[0.2em] px-6 py-3 border border-white/20 text-white hover:bg-white/10 transition-colors">
                     Se detaljer
                   </button>
                 </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'fdv' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               <div className="space-y-6">
                 <h1 className="text-4xl lg:text-5xl font-display font-medium text-white tracking-tight leading-tight">
                   Overlevering av FDV.
                 </h1>
                 <p className="text-lg text-white/50 font-light max-w-2xl">
                   Last opp sluttdokumentasjon for ferdigstilte prosjekter. Dokumentene lagres direkte i boligens DNA hos kunden.
                 </p>
               </div>
               
               <div className="bg-deep-navy border border-white/10 p-8 space-y-8">
                 <div className="space-y-2 border-b border-white/10 pb-6">
                   <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-gold">Kunde & Objekt</div>
                   <div className="text-xl text-white">Myrerveien 46A (Varmepumpe-installasjon)</div>
                 </div>

                 <div className="border-2 border-dashed border-white/20 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-muted-gold/50 hover:bg-white/5 transition-colors cursor-pointer group">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/50 group-hover:text-muted-gold transition-colors">
                     <FileDown size={24} />
                   </div>
                   <div className="space-y-1">
                     <div className="text-lg font-medium text-white">Last opp FDV-dokumentasjon</div>
                     <div className="text-sm font-light text-white/50">Dra og slipp PDF, samsvarserklæring, eller manualer</div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h3 className="text-sm uppercase font-bold tracking-[0.2em] text-white/60">Opplastet (Klare for overføring)</h3>
                   <div className="flex items-center justify-between bg-white/5 p-4 border border-white/10">
                     <div className="flex items-center gap-4">
                       <FileText size={20} className="text-green-400" />
                       <div className="text-sm text-white">Samsvarserklæring_Elektro.pdf</div>
                     </div>
                     <button className="text-white/40 hover:text-white"><X size={16} /></button>
                   </div>
                   <div className="flex items-center justify-between bg-white/5 p-4 border border-white/10">
                     <div className="flex items-center gap-4">
                       <FileText size={20} className="text-green-400" />
                       <div className="text-sm text-white">Brukermanual_Daikin.pdf</div>
                     </div>
                     <button className="text-white/40 hover:text-white"><X size={16} /></button>
                   </div>
                 </div>
                 
                 <div className="pt-6">
                   <button className="w-full bg-muted-gold text-deep-navy py-4 text-[11px] uppercase font-bold tracking-[0.2em] hover:bg-white transition-colors">
                     Overfør FDV til Bolig-DNA
                   </button>
                 </div>
               </div>

            </motion.div>
          )}

       </div>
    </motion.div>
  )
}

function JournalTab({ timeline, onOpenDocUpload }: { key?: string, timeline: any[], onOpenDocUpload?: () => void }) {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pt-32 lg:pt-48 px-6 lg:px-12 max-w-5xl mx-auto space-y-24"
    >
      <section className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-12 pb-12 border-b border-deep-navy/10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="w-8 h-[1px] bg-muted-gold"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40">Eiendomsdata</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-medium text-deep-navy tracking-tight leading-tight">
            Boligens Hukommelse.
          </h1>
          <p className="text-xl text-deep-navy/50 font-light max-w-2xl text-balance">
            En tidslinje over boligens utvikling og en oppdatert teknisk oversikt. Bilder, dokumenter, og observasjoner flettet sammen i én historie.
          </p>
        </div>

        <MagneticButton onClick={onOpenDocUpload} className="shrink-0 bg-midnight text-warm-ivory px-8 py-5 flex items-center gap-4 hover:bg-deep-navy transition-colors shadow-xl">
          <FileText size={20} className="text-muted-gold" />
          <span className="text-[11px] uppercase font-bold tracking-[0.2em]">Analyser dokument</span>
        </MagneticButton>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Dimensjoner & Fakta */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
             <Activity className="text-muted-gold" size={18} />
             <h3 className="text-2xl font-display text-deep-navy">Eiendomsfakta</h3>
           </div>
           <div className="grid grid-cols-2 gap-px bg-deep-navy/5 border border-deep-navy/5">
              <div className="bg-white p-6 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Byggeår</div>
                <div className="text-lg font-medium text-deep-navy">2018 (TEK17)</div>
              </div>
              <div className="bg-white p-6 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Bruksareal (BRA)</div>
                <div className="text-lg font-medium text-deep-navy">135 m²</div>
              </div>
              <div className="bg-white p-6 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Tomt</div>
                <div className="text-lg font-medium text-deep-navy">Eiet, 452 m²</div>
              </div>
              <div className="bg-white p-6 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Gnr/Bnr</div>
                <div className="text-lg font-medium text-deep-navy">54 / 1210</div>
              </div>
           </div>
        </div>

        {/* Fargekoder */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
             <Droplets className="text-muted-gold" size={18} />
             <h3 className="text-2xl font-display text-deep-navy">Fargekoder (NCS)</h3>
           </div>
           <div className="space-y-4">
             <div className="flex items-center gap-4 bg-white border border-deep-navy/5 p-4 relative overflow-hidden group hover:border-deep-navy/20 transition-colors">
                <div className="w-12 h-12 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#D4CDC1' }} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-deep-navy">Stue / Kjøkken</div>
                  <div className="text-xs font-mono text-deep-navy/50">Jotun 10678 Space (NCS S1502-Y)</div>
                </div>
             </div>
             <div className="flex items-center gap-4 bg-white border border-deep-navy/5 p-4 relative overflow-hidden group hover:border-deep-navy/20 transition-colors">
                <div className="w-12 h-12 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#576766' }} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-deep-navy">Hovedsoverom</div>
                  <div className="text-xs font-mono text-deep-navy/50">Jotun 6352 Evening Green (NCS S6010-B90G)</div>
                </div>
             </div>
             <div className="flex items-center gap-4 bg-white border border-deep-navy/5 p-4 relative overflow-hidden group hover:border-deep-navy/20 transition-colors">
                <div className="w-12 h-12 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#FAFAFA' }} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-deep-navy">Lister & Tak</div>
                  <div className="text-xs font-mono text-deep-navy/50">Klassisk Hvit (NCS S0500-N)</div>
                </div>
             </div>
           </div>
        </div>

        {/* Teknisk / Rør / Sikringer */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
             <Zap className="text-muted-gold" size={18} />
             <h3 className="text-2xl font-display text-deep-navy">Teknisk & Infrastruktur</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-mild-clay/10 p-6 border border-mild-clay/20 space-y-3">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/60">Hovedstoppekran</div>
                 <div className="text-base text-deep-navy font-medium">Under vasken på vaskerom (1. etg)</div>
                 <div className="text-xs font-light text-deep-navy/60 leading-relaxed mt-2">Sist inspisert: Feb 2024. Rør i rør-system fra 2018. Rørskap i gang nede.</div>
              </div>
              <div className="bg-mild-clay/10 p-6 border border-mild-clay/20 space-y-3">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/60">Sikringsskap</div>
                 <div className="text-base text-deep-navy font-medium">I entré bak speilskap.</div>
                 <div className="text-xs font-light text-deep-navy/60 leading-relaxed mt-2">Hovedsikring 63A. Automatsikringer jordfeilbryter kl. A på alle 16 kurser.</div>
                 <button className="mt-4 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-gold hover:text-deep-navy transition-colors">
                   <FileDown size={14} /> Samsvarserklæring (2018)
                 </button>
              </div>
              <div className="bg-mild-clay/10 p-6 border border-mild-clay/20 space-y-3 sm:col-span-2 relative group hover:border-deep-navy/20 transition-colors">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/60">Ventilasjon (Balansert)</div>
                 <div className="text-base text-deep-navy font-medium">Villavent Flexit UNI 3</div>
                 <div className="text-xs font-light text-deep-navy/60 leading-relaxed mt-2">Aggregat plassert på mørkeloft. Filter: G4 (Art nr. 116422). Skiftes 2 ggr. i året.</div>
                 <div className="pt-4 mt-2 border-t border-deep-navy/5 flex gap-4">
                   <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-gold hover:text-deep-navy transition-colors">
                     <FileDown size={14} /> Brukermanual
                   </button>
                   <button className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-gold hover:text-deep-navy transition-colors">
                     <FileDown size={14} /> Monteringsanvisning
                   </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Abonnementer / Avtaler */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
             <Wifi className="text-muted-gold" size={18} />
             <h3 className="text-2xl font-display text-deep-navy">Tilknyttede Tjenester</h3>
           </div>
           <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-white p-5 border border-deep-navy/5">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Strømleverandør</div>
                  <div className="text-sm font-medium text-deep-navy mt-1">Tibber Spotpris</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-deep-navy/60">Siden: Okt 2021</div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white p-5 border border-deep-navy/5">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Internett & TV</div>
                  <div className="text-sm font-medium text-deep-navy mt-1">Telenor (Fiber 500/500)</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-deep-navy/60">Bindingstid ute</div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white p-5 border border-deep-navy/5">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Boligforsikring</div>
                  <div className="text-sm font-medium text-deep-navy mt-1">Gjensidige HUS Super</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-deep-navy/60 mt-1">Avtalenr. 841295</div>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="pt-24 border-t border-deep-navy/10 mt-12 mb-12">
         <h2 className="text-4xl font-display font-medium text-deep-navy mb-4 text-center">Historikk</h2>
      </div>

      <div className="relative border-l border-deep-navy/10 ml-2 lg:ml-8 pl-8 lg:pl-16 space-y-32 pb-32">
        {timeline.map((group, yearIndex) => (
          <div key={group.year} className="relative">
             {/* Sticky Year Header */}
             <div className="sticky top-20 lg:top-24 z-40 bg-warm-ivory/90 backdrop-blur-md py-6 -ml-8 lg:-ml-16 pl-8 lg:pl-16 mb-16">
                <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-warm-ivory border-[2px] border-muted-gold rounded-full" />
                <h2 className="text-3xl lg:text-5xl font-display text-deep-navy tracking-tight flex items-center gap-4">
                   {group.year}
                </h2>
             </div>
             
             {/* Timeline Items */}
             <div className="space-y-24 lg:space-y-40">
               {group.items.map((item, itemIndex) => {
                 // Determine layout sizing and alignment
                 const isRight = item.align === 'right';
                 const isCenter = item.align === 'center';
                 
                 let containerClass = "flex flex-col group cursor-pointer ";
                 if (isRight) containerClass += "ml-auto w-full lg:w-2/3";
                 else if (isCenter) containerClass += "w-full";
                 else containerClass += "mr-auto w-full lg:w-2/3";

                 let aspectClass = "aspect-[4/3]";
                 if (item.size === 'large') aspectClass = "aspect-[3/4] lg:aspect-[4/5]";
                 else if (item.size === 'full') aspectClass = "aspect-[16/9] lg:aspect-[21/9]";
                 else if (item.size === 'small') aspectClass = "aspect-square lg:aspect-[4/3] max-w-md";

                 return (
                   <motion.div 
                     key={itemIndex} 
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-100px" }}
                     transition={{ duration: 0.8, delay: itemIndex * 0.15, ease: [0.16, 1, 0.3, 1] }}
                     className={containerClass}
                   >
                      <div className="flex gap-4 items-center mb-6">
                         <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-gold">{item.date}</span>
                         <span className="w-1 h-1 bg-deep-navy/20 rounded-full" />
                         <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">{item.type}</span>
                      </div>
                      
                      <div className={`${aspectClass} bg-soft-beige w-full overflow-hidden mb-8 ${!item.img && 'flex items-center justify-center border border-deep-navy/10 group-hover:border-muted-gold/40 transition-colors duration-500'}`}>
                         {item.img ? (
                           <img 
                             src={item.img} 
                             alt={item.title} 
                             className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[2s] ease-out" 
                           />
                         ) : (
                           item.iconType === 'activity' ? 
                           <Activity size={40} className="text-deep-navy/30 group-hover:text-muted-gold transition-colors duration-500" /> : 
                           <FileText size={40} className="text-deep-navy/30 group-hover:text-muted-gold transition-colors duration-500" />
                         )}
                      </div>
                      
                      <h3 className="text-2xl lg:text-4xl font-display text-deep-navy tracking-tight mb-4">{item.title}</h3>
                      <p className="text-deep-navy/60 font-light text-base lg:text-lg max-w-md leading-relaxed text-balance">
                         {item.desc}
                      </p>
                   </motion.div>
                 )
               })}
             </div>
          </div>
        ))}
      </div>
    </motion.main>
  )
}

function EraTab({ onOpenProjectBrief }: { key?: string, onOpenProjectBrief?: () => void }) {
  const [currentIdea, setCurrentIdea] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [chatMode, setChatMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);

  const ideas = [
    {
      tag: "Sesong: Vår",
      title: "Snøen har nylig smeltet. Skal vi gå gjennom tips for sjekk av fukt rundt grunnmuren?",
    },
    {
      tag: "Byggeår: 2018",
      title: "Boligen runder 8 år. Vil du at jeg oppsummerer forventet slitasje på kledningen ifølge referansedata?",
    },
    {
      tag: "Værvarsel",
      title: "Nedbør i Oslo til helgen. Har du renset takrennene siden november?",
    }
  ];

  useEffect(() => {
    if (chatMode) return;
    const timer = setInterval(() => {
      setCurrentIdea((prev) => (prev + 1) % ideas.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [chatMode]);

  const handleSubmit = (e?: React.FormEvent, suggestionText?: string) => {
    if (e) e.preventDefault();
    const text = suggestionText || inputValue;
    if (!text.trim()) return;

    setChatMode(true);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response based on context
    setTimeout(() => {
      setIsTyping(false);
      let aiResponse = "Jeg finner ikke data på dette i boligens hukommelse ennå. Vil du at jeg skal opprette en skan av det neste gang du er ute med kameraet?";
      
      const lowerReq = text.toLowerCase();
      if (lowerReq.includes('kledning') || lowerReq.includes('slitasje') || lowerReq.includes('8 år')) {
         aiResponse = "Registerdata viser at huset er bygget i 2018. Etter 8 år vil kledningen typisk ha redusert beskyttelse i kystnære strøk, spesielt på sør/vest-veggen din som får mye sol og regn. ERA Vision indikerte tørr overflate i siste bilde. Anbefaler maling i år for å unngå bytte av bord.";
      } else if (lowerReq.includes('tak') || lowerReq.includes('takrenne') || lowerReq.includes('vår') || lowerReq.includes('fukt')) {
         aiResponse = "Rensing av takrenner er registrert sist november. Vurder en visuell sjekk med kameraet når du har tid, slik at vi forutser eventuell fuktgjennomtregning mot grunnmuren denne våren.";
      }
      
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    }, 1500);
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pt-32 lg:pt-48 px-6 lg:px-12 max-w-5xl mx-auto space-y-16 lg:space-y-24 min-h-screen pb-32"
    >
       <section className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-12 pb-12 border-b border-deep-navy/10">
         <div className="space-y-6">
           <div className="flex items-center gap-4">
             <span className="w-8 h-[1px] bg-muted-gold"></span>
             <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-deep-navy/40">ERA Konversasjon</span>
           </div>
           <h1 className="text-5xl lg:text-7xl font-display font-medium text-deep-navy tracking-tight leading-tight">
             Spør assistenten.
           </h1>
           <p className="text-xl text-deep-navy/50 font-light max-w-2xl text-balance">
             Hva lurer du på angående boligen din? Spør om vedlikehold, dokumenter, eller historikk.
           </p>
         </div>
         <div className="w-16 h-16 bg-white shadow-xl flex items-center justify-center shrink-0 border border-deep-navy/5">
            <Sparkles size={28} className="text-muted-gold" />
         </div>
       </section>

       {!chatMode ? (
         <div className="space-y-12 max-w-3xl">
            <form onSubmit={handleSubmit} className="relative w-full group">
               <div className="absolute -inset-1 bg-gradient-to-r from-muted-gold/0 via-muted-gold/20 to-muted-gold/0 rounded-none blur opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <input 
                 type="text" 
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 placeholder="Eksempel: Har du rensing av takrenner registrert?" 
                 className="w-full relative z-10 bg-white border border-deep-navy/10 px-6 py-6 lg:py-8 text-lg lg:text-xl text-deep-navy placeholder:text-deep-navy/30 focus:outline-none focus:border-muted-gold/50 transition-shadow transition-colors duration-500 shadow-[0_10px_40px_rgba(8,20,38,0.03)] focus:shadow-[0_10px_40px_rgba(8,20,38,0.08)]" 
               />
               <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-midnight text-white p-3 hover:bg-muted-gold transition-colors">
                 <ArrowRight size={20} />
               </button>
            </form>

            <div className="pt-2 w-full h-32 relative">
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={currentIdea}
                   onClick={() => handleSubmit(undefined, ideas[currentIdea].title)}
                   initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                   animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                   exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                   transition={{ duration: 1.2, ease: "easeInOut" }}
                   className="absolute inset-0 flex flex-col items-start justify-center space-y-3 cursor-pointer group"
                 >
                   <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-deep-navy/40 flex items-center gap-2">
                      <Sparkles size={12} className="text-muted-gold" />
                      {ideas[currentIdea].tag} (Foreslått)
                   </div>
                   <p className="text-lg lg:text-xl text-deep-navy/70 font-light group-hover:text-deep-navy transition-colors duration-500 text-balance">
                     "{ideas[currentIdea].title}"
                   </p>
                 </motion.div>
               </AnimatePresence>
            </div>
         </div>
       ) : (
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="w-full flex flex-col space-y-10 max-w-3xl"
         >
            <div className="flex-1 space-y-8 overflow-y-auto pb-24">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] lg:max-w-[75%] p-6 lg:p-8 relative ${msg.role === 'user' ? 'bg-deep-navy text-warm-ivory' : 'bg-white shadow-[0_10px_40px_rgba(8,20,38,0.03)] border border-deep-navy/5 text-deep-navy'}`}>
                    {msg.role === 'ai' && (
                       <div className="absolute top-8 left-0 -ml-16 w-8 h-8 rounded-full bg-muted-gold/10 text-muted-gold hidden lg:flex items-center justify-center">
                         <Sparkles size={14} />
                       </div>
                    )}
                    <p className="font-light text-base lg:text-lg leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                    {msg.role === 'ai' && msg.content.includes("Anbefaler maling i år") && (
                       <div className="mt-8 pt-6 border-t border-deep-navy/10">
                          <button onClick={onOpenProjectBrief} className="flex items-center gap-3 text-[11px] uppercase font-bold tracking-[0.2em] text-deep-navy hover:text-muted-gold transition-colors">
                             Innhent tilbud for fasademaling
                             <ArrowRight size={14} />
                          </button>
                       </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="p-6 bg-white shadow-[0_10px_40px_rgba(8,20,38,0.03)] border border-deep-navy/5 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-muted-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                     <span className="w-2 h-2 rounded-full bg-muted-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                     <span className="w-2 h-2 rounded-full bg-muted-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="fixed bottom-24 lg:bottom-12 left-0 right-0 px-4">
              <div className="max-w-3xl mx-auto w-full">
                <form onSubmit={handleSubmit} className="relative group">
                   <div className="absolute -inset-2 bg-gradient-to-t from-soft-beige via-soft-beige/90 to-transparent blur-md -z-10" />
                   <input 
                     type="text" 
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     placeholder="Still et oppfølgingsspørsmål..." 
                     className="w-full bg-white border border-deep-navy/10 px-6 py-5 text-base text-deep-navy placeholder:text-deep-navy/30 focus:outline-none focus:border-muted-gold/50 shadow-[0_10px_40px_rgba(8,20,38,0.08)] transition-all" 
                   />
                   <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-midnight text-white p-2.5 hover:bg-muted-gold transition-colors">
                     <ArrowRight size={16} />
                   </button>
                </form>
              </div>
            </div>
         </motion.div>
       )}
    </motion.main>
  )
}

