"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Button3D from "@/components/ui/Button3D";
import { WrappedSummary } from "@/types/wrapped";
import Carousel from "@/components/slides/Carousel";
import Stepper from "@/components/ui/Stepper";
import CryptoBackground from "@/components/ui/CryptoBackground";
import { 
  WalletIcon, 
  SparklesIcon, 
  ArrowPathIcon, 
  PowerIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/solid";
import WalletStatus from "@/components/WalletStatus";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [loading, setLoading] = useState(false);
  const [manualAddress, setManualAddress] = useState(""); // NEW: State for manual input
  const [data, setData] = useState<WrappedSummary | null>(null);

  // LOGIC FIX: If data exists, we are at Step 3 (regardless of connection)
  // Else if connected, we are at Step 2. Else Step 1.
  const currentStep = data ? 3 : isConnected ? 2 : 1;

  // Updated to accept an optional specific address (for manual input)
  const fetchWrapped = async (targetAddress?: string) => {
    // Use the passed address OR the connected address
    const activeAddress = targetAddress || address;
    
    if (!activeAddress) return;
    if (!activeAddress.startsWith("0x")) {
      alert("Please enter a valid 0x address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/wrapped?address=${activeAddress}`);
      const json = await res.json();
      if (json.error) { alert(json.error); return; }
      setData(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen w-full flex flex-col relative overflow-hidden font-sans">
      
      {/* 1. BACKGROUND LAYER */}
      <CryptoBackground />

      {/* 2. FIXED HEADER */}
      <header className="fixed top-0 left-0 w-full flex justify-center z-50 pt-4 pb-6 bg-gradient-to-b from-[#B1E4E3] to-transparent pointer-events-none">
        <h1 className="font-logo text-4xl md:text-5xl text-center leading-[0.85] uppercase drop-shadow-md pointer-events-auto flex flex-col items-center">
          <span className="text-white text-stroke-sm tracking-wide block">
            WRAPPED
          </span>
          <span className="text-[#B1E4E3] text-stroke-sm tracking-wide block">
            ONCHAIN
          </span>
        </h1>
      </header>

      {/* SHOW WALLET STATUS ONLY IF CONNECTED AND NO DATA YET (Optional polish) */}
      <div className="absolute top-6 right-6 z-50">
        <WalletStatus />
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-4 pt-32 pb-12 z-10">
        
        {/* STEPPER */}
        <div className="mb-10 scale-90 md:scale-100">
           <Stepper step={currentStep} />
        </div>

        {/* CARD */}
        <div className="z-10 w-full max-w-lg bg-white rounded-[3rem] shadow-[var(--shadow-deep)] relative overflow-hidden flex flex-col justify-center min-h-[500px] transition-all duration-300">
          
          <div className="absolute inset-0 magicpattern opacity-50 pointer-events-none" />

          <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center">
            
            {!data ? (
              /* START SCREEN */
              <div className="flex flex-col items-center text-center space-y-8">
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-logo text-slate-900 leading-tight uppercase">
                    CHECK YOUR 2025<br/>
                    <span className="text-[#B1E4E3]">ONCHAIN ACTIVITY</span>
                  </h2>
                  <p className="text-slate-500 font-medium text-lg px-6 leading-relaxed">
                    Connect wallet to see your year.
                  </p>
                </div>
                 
                 {isConnected ? (
                   /* CONNECTED STATE */
                   <div className="w-full max-w-xs space-y-4 flex flex-col items-center">
                     <Button3D onClick={() => fetchWrapped()} disabled={loading} variant="brand">
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
                       className="w-full group flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest mt-4 transition-colors"
                     >
                       <PowerIcon className="w-4 h-4 group-hover:text-red-500" />
                       Disconnect
                     </button>
                   </div>
                 ) : (
                   /* DISCONNECTED STATE (Manual Input Added) */
                   <div className="w-full max-w-xs flex flex-col items-center gap-4">
                     
                     {/* Connect Button */}
                     <Button3D onClick={() => connect({ connector: injected() })} variant="black">
                       <span className="flex items-center gap-2 justify-center">
                         <WalletIcon className="w-5 h-5 text-white" /> CONNECT WALLET
                       </span>
                     </Button3D>

                     {/* Divider */}
                     <div className="flex items-center w-full gap-2">
                        <div className="h-px bg-slate-200 flex-1" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">OR PASTE ADDRESS</span>
                        <div className="h-px bg-slate-200 flex-1" />
                     </div>

                     {/* Manual Input Group */}
                     <div className="w-full flex gap-2">
                        <input 
                          type="text" 
                          placeholder="0x..." 
                          value={manualAddress}
                          onChange={(e) => setManualAddress(e.target.value)}
                          className="flex-grow bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#B1E4E3] transition-colors"
                        />
                        <button 
                          onClick={() => fetchWrapped(manualAddress)}
                          disabled={!manualAddress || loading}
                          className="bg-slate-900 text-white rounded-xl px-4 hover:bg-[#B1E4E3] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin"/> : <MagnifyingGlassIcon className="w-5 h-5" />}
                        </button>
                     </div>

                     {/* Secure Badge */}
                     <div className="flex items-center gap-2 text-slate-400 mt-2">
                        <ShieldCheckIcon className="w-4 h-4 text-[#B1E4E3]" />
                        <span className="text-[10px] font-bold tracking-wide uppercase">Read-Only Secure Connection</span>
                     </div>
                   </div>
                 )}
              </div>
            ) : (
              /* RESULTS SCREEN */
              <div className="h-full flex flex-col justify-between">
                <Carousel data={data} />
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => { setData(null); setManualAddress(""); }} 
                    className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-slate-500 uppercase tracking-widest transition-colors border-b-2 border-transparent hover:border-slate-300"
                  >
                     <ArrowPathIcon className="w-4 h-4" /> Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center opacity-30 font-logo text-[10px] tracking-[0.2em] pointer-events-none">
        POWERED BY COVALENT
      </footer>
    </main>
  );
}