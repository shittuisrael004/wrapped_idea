"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { WrappedData } from "@/types/wrapped";
import Button3D from "@/components/ui/Button3D";
import MintButton from "@/components/MintButton";
import WrappedCard from "@/components/WrappedCard";
import { 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  FireIcon, 
  GlobeAmericasIcon,
  BoltIcon,
  CalendarIcon,
  StarIcon,
  FingerPrintIcon
} from "@heroicons/react/24/solid";

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.9,
    filter: "blur(10px)"
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "circOut" }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 1.1,
    filter: "blur(10px)",
    transition: { duration: 0.4, ease: "circIn" }
  })
};

function Counter({ value, prefix = "" }: { value: number | string, prefix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="inline-block"
    >
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
    </motion.span>
  );
}

export default function StoryCarousel({ data, onReveal }: { data: WrappedData, onReveal: (isRevealed: boolean) => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const TOTAL_SLIDES = 12;

  useEffect(() => {
    onReveal(index === 11);
  }, [index, onReveal]);

  const nextSlide = () => {
    if (index < TOTAL_SLIDES - 1) {
      setDirection(1);
      setIndex(index + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex(index - 1);
    }
  };

  const getBackgroundClass = () => {
    if (index === 11) return "bg-transparent"; // Make carousel transparent for final reveal
    if (index > 7) return "bg-slate-50"; 
    return "bg-white"; 
  };

  const renderContent = () => {
    switch (index) {
      case 0:
        return (
          <div className="text-center space-y-8 max-w-md mx-auto">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-[#B1E4E3]/20 rounded-full blur-xl"
              />
              <FingerPrintIcon className="w-24 h-24 text-slate-900 relative z-10" />
              <motion.div 
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-1 bg-[#B1E4E3] shadow-[0_0_10px_#B1E4E3] z-20 opacity-80"
              />
            </div>
            <div className="space-y-2">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-logo uppercase text-slate-900 tracking-wide"
              >
                ACCESS GRANTED
              </motion.h1>
              <p className="text-slate-500 font-mono text-xs tracking-[0.2em] uppercase">
                Reading Block {data.summary.total_tx}...
              </p>
            </div>
          </div>
        );
      
      // ... (Slides 1-10 remain standard)
      case 1:
        return (
          <div className="text-center space-y-8">
            <GlobeAmericasIcon className="w-24 h-24 text-[#B1E4E3] mx-auto drop-shadow-md" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Primary Jurisdiction</p>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter">
                {data.favorites.top_chain}
              </h2>
            </div>
            <div className="bg-slate-100 inline-block px-6 py-2 rounded-full font-bold text-slate-600 text-sm">
              CITIZENSHIP VERIFIED
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Interactions</p>
            <div className="text-[5rem] md:text-[8rem] leading-none font-logo text-slate-900">
              <Counter value={data.summary.total_tx} />
            </div>
            <p className="text-lg text-slate-500 font-medium max-w-xs mx-auto">
              Every click, swap, and mint added to your legacy.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-8">
            <FireIcon className="w-24 h-24 text-orange-500 mx-auto animate-bounce" />
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900">
                <Counter value={data.summary.total_gas_usd} prefix="$" />
              </h2>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Burnt in Gas</p>
            </div>
            <p className="text-slate-500 italic">"Small price for glory."</p>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
             <CalendarIcon className="w-20 h-20 text-indigo-500 mx-auto" />
             <h2 className="text-6xl font-black text-slate-900">
               <Counter value={data.summary.active_days} />
             </h2>
             <p className="text-xl font-bold uppercase text-slate-400">Days Active</p>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-8">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Peak Performance</div>
            <h2 className="text-5xl md:text-6xl font-logo text-[#B1E4E3] text-stroke-sm uppercase drop-shadow-sm">
              {data.summary.peak_month}
            </h2>
            <p className="text-slate-600 font-medium">
              You were unstoppable this month.
            </p>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-8">
            <BoltIcon className="w-20 h-20 text-yellow-400 mx-auto" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">The Grind Day</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase">
                {data.summary.active_day_date}
              </h2>
            </div>
            <p className="text-slate-500">You didn't sleep that day.</p>
          </div>
        );

      case 7:
        return (
          <div className="text-center space-y-8">
            <StarIcon className="w-24 h-24 text-slate-300 mx-auto animate-spin-slow" />
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">CALCULATING RARITY...</h2>
          </div>
        );

      case 8:
        return (
          <div className="text-center space-y-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Trait Acquired</p>
            <div className="inline-block px-8 py-4 bg-black text-white text-xl md:text-2xl font-bold uppercase rounded-xl shadow-[8px_8px_0px_#B1E4E3] transform -rotate-2">
              #{data.traits[0] || "Normie"}
            </div>
          </div>
        );

      case 9:
        return (
          <div className="text-center space-y-8">
             <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Trait Acquired</p>
            <div className="inline-block px-8 py-4 bg-white border-4 border-black text-black text-xl md:text-2xl font-bold uppercase rounded-xl shadow-[8px_8px_0px_#000] transform rotate-3">
              #{data.traits[1] || "NPC"}
            </div>
          </div>
        );

      case 10: 
        return (
          <div className="text-center space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Your 2025 Identity</p>
            <motion.h1 
              initial={{ scale: 3, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", bounce: 0.5 }}
              className={`text-5xl md:text-7xl font-logo uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r ${data.persona.color_theme}`}
            >
              {data.persona.title}
            </motion.h1>
             <p className="text-xl font-medium text-slate-600 italic">"{data.persona.description}"</p>
          </div>
        );

      // --- SLIDE 11: THE REVEAL (Floating on top) ---
      case 11:
        return (
          <div className="w-full flex flex-col items-center">
             <WrappedCard data={data} />
             <p className="text-[10px] text-white/50 uppercase tracking-widest mt-12 animate-pulse font-bold">
               Soulbound Identity • Covalent
             </p>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className={`w-full h-full flex flex-col justify-between p-4 relative overflow-hidden transition-colors duration-700 ${getBackgroundClass()}`}>
      
      {/* 1. PROGRESS PIPS */}
      <div className={`relative z-20 flex gap-1.5 mb-4 ${index === 11 ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
              i <= index ? 'bg-slate-900' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* 2. THE STAGE (Added pt-12 to push content down from progress bar) */}
      <div className="flex-grow flex items-center justify-center relative w-full pt-12">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full absolute flex flex-col items-center px-4 z-10"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. THE CONTROLS (Z-Index 30 + bg-white/80) */}
      <div className={`relative z-30 w-full max-w-md mx-auto px-2 pb-2 flex items-center justify-between gap-4 ${index === 11 ? "hidden" : "flex"}`}>
        
        <button 
          onClick={prevSlide}
          disabled={index === 0}
          className={`w-12 h-12 rounded-full border-2 border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-0 disabled:pointer-events-none shadow-sm`}
        >
          <ArrowLeftIcon className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex-grow">
           <Button3D onClick={nextSlide} variant={index === 10 ? "brand" : "black"}>
              <span className="flex items-center justify-center gap-2 text-sm">
                 {index === 0 ? "START REVEAL" : index === 10 ? "SEE CARD" : "NEXT"} 
                 <ArrowRightIcon className="w-4 h-4" />
              </span>
            </Button3D>
        </div>

      </div>

      {/* MINT BUTTON FOR REVEAL */}
      {index === 11 && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-30 w-full max-w-xs mx-auto pb-8"
        >
           <MintButton data={data} />
           <button 
              onClick={() => { setIndex(0); onReveal(false); }}
              className="w-full text-center text-[10px] text-white/40 mt-4 hover:text-white uppercase tracking-widest"
           >
             Replay Story
           </button>
        </motion.div>
      )}

    </div>
  );
}