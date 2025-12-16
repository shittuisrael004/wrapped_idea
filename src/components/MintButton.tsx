"use client";

import { useState, useEffect } from "react";
import { 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  useSwitchChain, 
  useAccount, 
  useConnect 
} from "wagmi";
import { injected } from "wagmi/connectors"; // Needed for the lazy connect
import { parseEther } from "viem";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { WrappedData } from "@/types/wrapped";
import Button3D from './ui/Button3D';
import ChainSelectModal from './modals/ChainSelectModal'; 
import { PERSONA_CONTRACT_ABI, CHAIN_CONFIG } from '../constants/contracts';
import confetti from "canvas-confetti"; 

export default function MintButton({ data }: { data: WrappedData }) {
  // --- UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // --- WAGMI HOOKS ---
  const { isConnected, chain } = useAccount();
  const { connect } = useConnect(); // Added for Lazy Connect
  const { switchChainAsync } = useSwitchChain(); 
  
  const { 
    data: hash, 
    isPending: isWalletLoading, 
    error: walletError, 
    writeContract 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ hash });

  // --- EFFECT: Confetti on Success ---
  useEffect(() => {
    if (isConfirmed) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B1E4E3', '#000000', '#ffffff']
      });
    }
  }, [isConfirmed]);

  // --- 1. THE "LAZY" CLICK HANDLER ---
  // This replaces your old handleOpenModal. 
  // It checks connection FIRST, then opens modal.
  const handleLazyClick = () => {
    setUploadError(''); // Clear previous errors
    
    if (!isConnected) {
      // If not connected, trigger wallet popup immediately
      connect({ connector: injected() });
    } else {
      // If connected, proceed to chain selection
      setIsModalOpen(true);
    }
  };

  // --- 2. HANDLE SELECTION, UPLOAD & MINT (RESTORED FULL LOGIC) ---
  const handleChainSelect = async (targetChainId: number) => {
    setIsModalOpen(false); 
    setIsUploading(true); 

    try {
      // Step A: Switch Network if needed
      if (chain?.id !== targetChainId) {
        try {
          await switchChainAsync({ chainId: targetChainId });
        } catch (switchError) {
          throw new Error("User rejected network switch");
        }
      }

      // Step B: Upload to IPFS (RESTORED)
      // We upload AFTER selection so we can tag the metadata with the network name
      const metadataPayload = {
        name: data.persona.title,
        description: data.persona.description,
        attributes: [
          { trait_type: "Year", value: data.year },
          { trait_type: "Total Transactions", value: data.summary.total_tx },
          { trait_type: "Top Chain", value: data.favorites.top_chain },
          { trait_type: "Minted Network", value: CHAIN_CONFIG[targetChainId as keyof typeof CHAIN_CONFIG].name } 
        ],
        // Ideally, you'd generate the dynamic image here before this step
        image: "ipfs://QmYourDefaultPlaceholderImage" 
      };

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadataPayload),
      });

      const resData = await response.json();
      if (!resData.success) throw new Error('IPFS Upload Failed');

      // Step C: Execute Mint
      const config = CHAIN_CONFIG[targetChainId as keyof typeof CHAIN_CONFIG]; 

      writeContract({
        address: config.address as `0x${string}`, 
        abi: PERSONA_CONTRACT_ABI,
        functionName: 'mintNft',
        args: [resData.ipfsUri],
        value: parseEther(config.price), 
      });

    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Process cancelled.');
    } finally {
      setIsUploading(false);
    }
  };

  // --- RENDER ---

  if (isConfirmed) {
    return (
      <div className="w-full text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 border-[3px] border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000]">
          <h3 className="text-xl font-black text-black uppercase">Minted! 🏆</h3>
          <p className="text-xs text-green-800 font-bold mt-1">
             Immortalized on {chain?.name}
          </p>
          <a 
            href={`${CHAIN_CONFIG[chain?.id as keyof typeof CHAIN_CONFIG]?.explorer}/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
            className="block mt-2 text-xs underline font-bold"
          >
            View Transaction
          </a>
        </div>
      </div>
    );
  }

  // Determine button text based on state
  const buttonText = isUploading ? 'Preparing...' 
                   : isWalletLoading ? 'Check Wallet...' 
                   : isConfirming ? 'Minting...' 
                   : 'MINT CARD'; // "Lazy" text (doesn't say 'Connect')

  return (
    <>
      <div className="w-full relative">
         {/* RESTORED ERROR BANNER */}
         {(uploadError || walletError) && (
            <div className="absolute -top-16 left-0 right-0 mx-auto w-max max-w-[90%] text-center text-xs font-bold bg-red-100 text-red-600 border-2 border-red-500 p-2 rounded mb-2 z-10 animate-in fade-in slide-in-from-bottom-2">
              ⚠️ {uploadError || (walletError as any)?.shortMessage || 'Transaction Failed'}
            </div>
         )}

        <Button3D 
          onClick={handleLazyClick} 
          disabled={isUploading || isWalletLoading || isConfirming}
          variant="brand"
          className="w-full"
        >
          <span className="flex items-center gap-2 justify-center">
            {buttonText} <SparklesIcon className="w-5 h-5" />
          </span>
        </Button3D>
      </div>

      <ChainSelectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleChainSelect} 
      />
    </>
  );
}