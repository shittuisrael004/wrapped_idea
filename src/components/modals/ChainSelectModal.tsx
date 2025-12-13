import { XMarkIcon } from "@heroicons/react/24/solid";
import { CHAIN_IDS, CHAIN_CONFIG } from "@/constants/contracts";

interface ChainSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (chainId: number) => void;
}

export default function ChainSelectModal({ isOpen, onClose, onSelect }: ChainSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] p-6 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full">
          <XMarkIcon className="w-6 h-6 text-black" />
        </button>

        <h2 className="text-2xl font-black text-center uppercase mb-2">Choose Network</h2>
        
        <div className="space-y-4 mt-6">
          {/* BASE OPTION */}
          <button 
            onClick={() => onSelect(CHAIN_IDS.BASE)}
            className="w-full flex items-center justify-between p-4 border-[3px] border-black rounded-xl hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full border-2 border-black flex items-center justify-center text-white font-bold">B</div>
              <div className="text-left">
                <div className="font-black text-lg">BASE</div>
                <div className="text-xs font-bold text-slate-400">Fast & Cheap</div>
              </div>
            </div>
            <div className="font-black text-lg">{CHAIN_CONFIG[CHAIN_IDS.BASE].price} ETH</div>
          </button>

          {/* CELO OPTION */}
          <button 
            onClick={() => onSelect(CHAIN_IDS.CELO)}
            className="w-full flex items-center justify-between p-4 border-[3px] border-black rounded-xl hover:bg-green-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FCFF52] rounded-full border-2 border-black flex items-center justify-center text-black font-bold">C</div>
              <div className="text-left">
                <div className="font-black text-lg">CELO</div>
                <div className="text-xs font-bold text-slate-400">Mobile First</div>
              </div>
            </div>
            <div className="font-black text-lg">{CHAIN_CONFIG[CHAIN_IDS.CELO].price} CELO</div>
          </button>
        </div>
      </div>
    </div>
  );
}