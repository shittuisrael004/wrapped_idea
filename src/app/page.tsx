"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Button3D from "@/components/ui/Button3D";
import { WrappedSummary } from "@/types/wrapped";
import SlideIntro from "@/components/slides/SlideIntro";
import Stepper from "@/components/ui/Stepper";

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
    // Main Container: Flex column, full height
    <main className="min-h-screen w-full flex flex-col relative overflow-hidden">
      
      {/* 1. FIXED HEADER (Smaller Logo) */}
      <div className="fixed top-0 left-0 w-full flex justify-center z-50 pt-4 pb-2 bg-gradient-to-b from-[#B1E4E3] to-transparent pointer-events-none">
        <h1 className="font-logo text-2xl md:text-3xl text-white uppercase tracking-wider drop-shadow-md text-stroke-sm pointer-events-auto">
          <span className="text-white">WRAPPED</span>
          <span className="text-[#B1E4E3] ml-2" style={{ textShadow: "1.5px 1.5px 0 #000" }}>ONCHAIN</span>
        </h1>
      </div>

      {/* CONTENT AREA: Center the Card Vertically & Horizontally */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-4 pt-20 pb-10">
        
        {/* STEPPER */}
        <div className="mb-6 z-10 scale-90 md:scale-100">
           <Stepper step={currentStep} />
        </div>

        {/* 3. THE CARD (Taller, Soft Shadow, Centered) */}
        <div className="z-10 w-full max-w-lg bg-white rounded-[3rem] shadow-[var(--shadow-soft)] p-8 md:p-12 relative flex flex-col justify-center min-h-[550px] transition-all duration-500">
          
          {!data ? (
            /* START SCREEN */
            <div className="flex flex-col items-center text-center space-y-10 h-full justify-center">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-logo text-slate-900 leading-tight">
                  CHECK YOUR<br/>2025
                </h2>
                <p className="text-slate-500 font-medium text-lg px-4">
                  Connect your wallet to generate your yearly on-chain recap.
                </p>
              </div>
               
               {isConnected ? (
                 <div className="w-full max-w-xs space-y-4">
                   <Button3D onClick={fetchWrapped} disabled={loading} variant="brand">
                     {loading ? "SCANNING..." : "GENERATE WRAPPED 🚀"}
                   </Button3D>
                   <button onClick={() => disconnect()} className="text-xs font-bold text-slate-400 hover:text-black uppercase tracking-widest mt-4">
                     Disconnect Wallet
                   </button>
                 </div>
               ) : (
                 <div className="w-full max-w-xs">
                   <Button3D onClick={() => connect({ connector: injected() })} variant="black">
                     CONNECT WALLET
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
                  className="text-xs font-bold text-slate-300 hover:text-slate-500 uppercase tracking-widest transition-colors"
                >
                   Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center opacity-30 font-logo text-[10px] tracking-[0.2em]">
        POWERED BY COVALENT
      </div>
    </main>
  );
}