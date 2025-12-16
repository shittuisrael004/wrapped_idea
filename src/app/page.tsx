"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Button3D from "@/components/ui/Button3D";
import { WrappedData } from "@/types/wrapped"; 
import StoryCarousel from "@/components/slides/StoryCarousel"; 
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
  const [manualAddress, setManualAddress] = useState(""); 
  const [data, setData] = useState<WrappedData | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // SCANNING TEXT STATE
  const [scanText, setScanText] = useState("GENERATE WRAPPED");

  const currentStep = data ? 3 : isConnected ? 2 : 1;

  // FIX: SLOWER CYCLE (1200ms instead of 500ms)
  const cycleScanText = () => {
    const phases = ["SCANNING ETHEREUM...", "SCANNING BASE...", "SCANNING OPTIMISM...", "SCANNING ARBITRUM...", "CALCULATING GAS...", "ANALYZING TRAITS..."];
    let i = 0;
    return setInterval(() => {
      setScanText(phases[i]);
      i = (i + 1) % phases.length;
    }, 1200); 
  };

  const fetchWrapped = async (targetAddress?: string) => {
    const activeAddress = targetAddress || address;
    if (!activeAddress) return;
    if (!activeAddress.startsWith("0x")) { alert("Please enter a valid 0x address"); return; }

    setLoading(true);
    const interval = cycleScanText(); 

    try {
      const res = await fetch(`/api/wrapped?address=${activeAddress}`);
      const json = await res.json();
      if (json.error) { alert(json.error); return; }
      setData(json);
      setIsRevealed(false);
    } catch (err) { console.error(err); } 
    finally { 
      setLoading(false); 
      clearInterval(interval); 
      setScanText("GENERATE WRAPPED"); 
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col relative overflow-hidden font-sans">
      
      {/* 1. BACKGROUND */}
      <CryptoBackground />
      <div className={`fixed inset-0 bg-slate-950 transition-opacity duration-1000 pointer-events-none z-0 ${isRevealed ? 'opacity-95' : 'opacity-0'}`} />

      {/* 2. HEADER */}
      <header className={`fixed top-0 left-0 w-full flex justify-center z-50 pt-4 pb-6 transition-all duration-500 ${isRevealed ? 'opacity-0 -translate-y-20' : 'opacity-100'}`}>
        <h1 className="font-logo text-2xl md:text-5xl text-center leading-[0.85] uppercase drop-shadow-md pointer-events-auto flex flex-col items-center">
          <span className="text-white text-stroke-sm tracking-wide block">WRAPPED</span>
          <span className="text-[#B1E4E3] text-stroke-sm tracking-wide block">ONCHAIN</span>
        </h1>
      </header>

      {/* WALLET STATUS */}
      <div className={`absolute top-6 right-6 z-50 transition-opacity duration-500 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}>
        <div className="hidden md:block"><WalletStatus /></div>
        <button
          onClick={() => isConnected ? disconnect() : connect({ connector: injected() })}
          className="md:hidden bg-white p-2 rounded-full border-2 border-black shadow-[2px_2px_0px_#000]"
        >
          <WalletIcon className="w-6 h-6 text-slate-900" />
        </button>
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-4 pt-10 pb-12 z-10">
        
        {/* STEPPER */}
        <div className={`mb-10 scale-90 md:scale-100 transition-opacity duration-500 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}>
           <Stepper step={currentStep} />
        </div>

        {/* CONTAINER MORPH LOGIC - THIS FIXES THE "ENCASED" NFT */}
        <div className={`
          z-10 w-full transition-all duration-700 ease-in-out relative
          ${!data ? 'max-w-lg bg-white rounded-[3rem] shadow-[var(--shadow-deep)]' : ''}
          ${data && !isRevealed ? 'max-w-lg bg-white rounded-[3rem] shadow-[var(--shadow-deep)] min-h-[600px] overflow-hidden' : ''}
          ${isRevealed ? 'max-w-full bg-transparent min-h-[600px] overflow-visible scale-100 shadow-none' : ''} 
        `}>
          
          <div className="relative z-10 h-full">
            
            {!data ? (
              /* --- INPUT SCREEN --- */
              <div className="p-8 md:p-12 flex flex-col justify-center items-center text-center space-y-8 min-h-[500px] relative overflow-hidden">
                <div className="absolute inset-0 magicpattern opacity-50 pointer-events-none" />
                
                <div className="space-y-3 z-10">
                  <h2 className="text-3xl md:text-4xl font-logo text-slate-900 leading-tight uppercase">
                    CHECK YOUR 2025<br/><span className="text-[#B1E4E3]">ONCHAIN ACTIVITY</span>
                  </h2>
                  <p className="text-slate-500 font-medium text-lg px-6 leading-relaxed">Connect wallet to see your year.</p>
                </div>
                 
                 {isConnected ? (
                   <div className="w-full max-w-xs space-y-4 flex flex-col items-center z-10">
                     <Button3D onClick={() => fetchWrapped()} disabled={loading} variant="brand">
                       {loading ? (
                         <span className="flex items-center gap-2 justify-center text-[10px] md:text-xs font-bold uppercase">
                           <ArrowPathIcon className="w-4 h-4 animate-spin" /> {scanText}
                         </span>
                       ) : (
                         <span className="flex items-center gap-2 justify-center">
                           <SparklesIcon className="w-5 h-5" /> GENERATE WRAPPED
                         </span>
                       )}
                     </Button3D>
                     <button onClick={() => disconnect()} className="w-full text-xs font-bold text-slate-400 hover:text-red-500 mt-4">Disconnect</button>
                   </div>
                 ) : (
                   <div className="w-full max-w-xs flex flex-col items-center gap-4 z-10">
                     <Button3D onClick={() => connect({ connector: injected() })} variant="black">
                       <span className="flex gap-2"><WalletIcon className="w-5 h-5 text-white" /> CONNECT WALLET</span>
                     </Button3D>
                     <div className="flex items-center w-full gap-2"><div className="h-px bg-slate-200 flex-1" /><span className="text-[10px] font-bold text-slate-400">OR PASTE</span><div className="h-px bg-slate-200 flex-1" /></div>
                     <div className="w-full flex gap-2">
                        <input type="text" placeholder="0x..." value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} className="flex-grow bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" />
                        <button onClick={() => fetchWrapped(manualAddress)} disabled={!manualAddress || loading} className="bg-slate-900 text-white rounded-xl px-4">{loading ? <ArrowPathIcon className="w-5 h-5 animate-spin"/> : <MagnifyingGlassIcon className="w-5 h-5" />}</button>
                     </div>
                   </div>
                 )}
              </div>
            ) : (
              /* --- STORY MODE --- */
              <div className="h-full relative">
                 {/* Only show paper texture if NOT revealed */}
                 {!isRevealed && <div className="absolute inset-0 magicpattern opacity-30 pointer-events-none z-0" />}
                 
                 <StoryCarousel 
                    data={data} 
                    onReveal={(val) => setIsRevealed(val)} 
                 />
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