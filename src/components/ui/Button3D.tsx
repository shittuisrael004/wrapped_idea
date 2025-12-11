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
        "relative w-full px-6 py-4 rounded-xl font-heading font-bold text-xl uppercase tracking-widest transition-all border-[3px] border-black",
        "shadow-hard hover:shadow-hard-hover hover:-translate-y-[2px] active:translate-y-[2px] active:shadow-none",
        variant === "brand" ? "bg-[#B1E4E3] text-black" : "bg-black text-white hover:bg-zinc-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}