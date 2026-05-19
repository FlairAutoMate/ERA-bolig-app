import React from 'react';
import { motion } from 'motion/react';
import { X, Database, TrendingUp, Cpu, Zap, Activity } from 'lucide-react';

export function DataModelOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-deep-navy/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
      >
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-deep-navy/5 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-mild-clay/20 flex items-center justify-center">
               <Database size={20} className="text-deep-navy" />
             </div>
             <div>
               <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-deep-navy/40">Datagrunnlag</div>
               <div className="text-lg font-display text-deep-navy">ERA Estimater & Verdi</div>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-deep-navy/5 transition-colors rounded-full text-deep-navy/40 hover:text-deep-navy">
             <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-10 space-y-12">
          <section className="space-y-4">
            <h3 className="text-2xl font-display text-deep-navy tracking-tight">Viktig Informasjon om Estimatene</h3>
            <p className="text-deep-navy/70 font-light leading-relaxed">
              Verdipotensial og kostnadsoverslag vist i ERA-plattformen er <strong className="font-medium">veiledende estimater</strong>, beregnet for din boligtype i ditt geografiske område. ERA utgjør ikke finansiell rådgivning, takst eller garanti. Markedssvingninger, materialvalg og spesifikke tilstander krever alltid kvalifisert befaring for eksakt pris.
            </p>
          </section>

          <section className="space-y-6">
            <h4 className="text-[11px] uppercase font-bold tracking-[0.2em] text-deep-navy/40 border-b border-deep-navy/10 pb-2">Datakilder & Modellering i Sanntid</h4>
            
            <div className="grid gap-6">
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-soft-beige p-2 rounded-full shrink-0"><Database size={16} className="text-deep-navy" /></div>
                <div>
                  <div className="font-medium text-deep-navy">Matrikkelen & Ambita</div>
                  <div className="text-sm text-deep-navy/60 font-light mt-1">Grunnlagsdata for boligens fysiske spesifikasjoner (byggeår, TEK-standard, BRA/BTA) som danner baselinjen for modellens beregninger.</div>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-soft-beige p-2 rounded-full shrink-0"><TrendingUp size={16} className="text-deep-navy" /></div>
                <div>
                  <div className="font-medium text-deep-navy">Prognosesenteret & SSB</div>
                  <div className="text-sm text-deep-navy/60 font-light mt-1">Oppdaterte byggekostnadsindekser og boligprisstatistikk. Brukes for å beregne spennet i estimerte oppgraderingskostnader og potensielt prisløft.</div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-soft-beige p-2 rounded-full shrink-0"><Zap size={16} className="text-deep-navy" /></div>
                <div>
                  <div className="font-medium text-deep-navy">Enova & NVE</div>
                  <div className="text-sm text-deep-navy/60 font-light mt-1">Gjeldende strømpriser for prisområdet og nasjonale støttesatser. Grunnlaget for ROI-beregningene på energitiltak (som Varmepumpe/Solceller).</div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-soft-beige p-2 rounded-full shrink-0"><Cpu size={16} className="text-deep-navy" /></div>
                <div>
                  <div className="font-medium text-deep-navy">ERA Vision & Historikk</div>
                  <div className="text-sm text-deep-navy/60 font-light mt-1">Skanninger lastet opp av eier (eks. kledning/tak) kombinert med loggført vedlikehold analyseres for å justere oppgaver i tid, før reell verdiforringelse oppstår.</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </motion.div>
    </motion.div>
  );
}
