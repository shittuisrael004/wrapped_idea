"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Button3D from "@/components/ui/Button3D";
import { WrappedSummary } from "@/types/wrapped";
import SlideIntro from "@/components/slides/SlideIntro";
import Stepper from "@/components/ui/Stepper";
import { 
  WalletIcon, 
  SparklesIcon, 
  ArrowPathIcon, 
  PowerIcon 
} from "@heroicons/react/24/solid";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WrappedSummary | null>(null);

  const currentStep = !isConnected ? 1 : !data ? 2 : 3;

  const fetchWrapped = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/wrapped?address=${address}`);
      const json = await res.json();
      if (json.error) { alert(json.error); return; }
      setData(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen w-full flex flex-col relative overflow-hidden font-sans">
      
      {/* 1. FIXED HEADER - STACKED & COMPRESSED */}
      <header className="fixed top-0 left-0 w-full flex justify-center z-50 pt-4 pb-6 bg-gradient-to-b from-[#B1E4E3] to-transparent pointer-events-none">
        <h1 className="font-logo text-4xl md:text-5xl text-center leading-[0.85] uppercase drop-shadow-md pointer-events-auto flex flex-col items-center">
          {/* Top Line: White with Black Stroke */}
          <span className="text-white text-stroke-sm tracking-wide block">
            WRAPPED
          </span>
          {/* Bottom Line: Brand Color with Black Stroke */}
          <span className="text-[#B1E4E3] text-stroke-sm tracking-wide block">
            ONCHAIN
          </span>
        </h1>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-4 pt-32 pb-12">
        
        {/* STEPPER */}
        <div className="mb-10 z-10 scale-90 md:scale-100">
           <Stepper step={currentStep} />
        </div>

        {/* CARD */}
        <div className="z-10 w-full max-w-lg bg-white rounded-[3rem] shadow-[var(--shadow-deep)] p-8 md:p-12 relative flex flex-col justify-center min-h-[500px] transition-all duration-300">
          
          {!data ? (
            /* START SCREEN */
            <div className="flex flex-col items-center text-center space-y-10 h-full justify-center">
              
              {/* Heading Group */}
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-logo text-slate-900 leading-[0.9] uppercase tracking-wide">
                  CHECK YOUR<br/>
                  <span className="text-[#B1E4E3] text-stroke-sm">2025</span>
                </h2>
                <p className="text-slate-500 font-medium text-lg px-6 leading-relaxed flex items-center justify-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-yellow-400" />
                  Connect wallet to see your year.
                </p>
              </div>
               
               {/* Actions */}
               {isConnected ? (
                 <div className="w-full max-w-xs space-y-4">
                   <Button3D onClick={fetchWrapped} disabled={loading} variant="brand">
                     {loading ? (
                       <span className="flex items-center gap-2 justify-center">
                         <ArrowPathIcon className="w-5 h-5 animate-spin" /> SCANNING...
                       </span>
                     ) : (
                       <span className="flex items-center gap-2 justify-center">
                         <SparklesIcon className="w-5 h-5" /> GENERATE WRAPPED
                       </span>
                     )}
                   </Button3D>
                   
                   <button 
                     onClick={() => disconnect()} 
                     className="group flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest mt-4 transition-colors"
                   >
                     <PowerIcon className="w-4 h-4 group-hover:text-red-500" />
                     Disconnect
                   </button>
                 </div>
               ) : (
                 <div className="w-full max-w-xs">
                   <Button3D onClick={() => connect({ connector: injected() })} variant="black">
                     <span className="flex items-center gap-2 justify-center">
                       <WalletIcon className="w-5 h-5 text-white" /> CONNECT WALLET
                     </span>
                   </Button3D>
                 </div>
               )}
            </div>
          ) : (
            /* RESULTS SCREEN */
            <div className="h-full flex flex-col justify-between">
              <SlideIntro data={data} />
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => setData(null)} 
                  className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-slate-500 uppercase tracking-widest transition-colors border-b-2 border-transparent hover:border-slate-300"
                >
                   <ArrowPathIcon className="w-4 h-4" /> Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center opacity-30 font-logo text-[10px] tracking-[0.2em] pointer-events-none">
        POWERED BY COVALENT
      </footer>
    </main>
  );
}