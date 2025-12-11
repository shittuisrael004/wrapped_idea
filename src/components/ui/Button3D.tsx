import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "white";
}

export default function Button3D({ 
  className, 
  variant = "brand", 
  children, 
  ...props 
}: Button3DProps) {
  
  const baseStyles = "relative px-8 py-4 rounded-full font-bold text-lg uppercase tracking-wider transition-all active:translate-y-1 active:shadow-none border-2";
  
  // The 'Shadow' is actually a box-shadow CSS property
  const variants = {
    brand: "bg-[#B1E4E3] border-slate-900 text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5",
    white: "bg-white border-slate-900 text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}