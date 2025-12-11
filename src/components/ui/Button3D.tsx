import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "black";
}

export default function Button3D({ 
  className, 
  variant = "brand", 
  children, 
  ...props 
}: Button3DProps) {
  return (
    <button 
      className={cn(
        // Base: Rounded FULL, Bold, Uppercase
        "relative w-full px-8 py-4 rounded-full font-bold text-lg uppercase tracking-widest transition-all border-[3px] border-black font-logo",
        
        // Button still needs a bit of 'pop' so we keep a smaller hard shadow here
        "shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[0px_6px_0px_0px_rgba(0,0,0,1)]",
        "active:translate-y-[2px] active:shadow-none",
        
        variant === "brand" ? "bg-[#B1E4E3] text-black" : "bg-black text-white hover:bg-zinc-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}