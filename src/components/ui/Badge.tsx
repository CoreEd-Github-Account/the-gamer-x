import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "cyan" | "ghost";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "cyan",
  className = "",
}) => {
  const baseStyles = "inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-widest";
  
  const variantStyles = {
    cyan: "text-cyan-400",
    primary: "text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded",
    secondary: "text-slate-400 bg-slate-800/60 border border-white/5 px-2 py-0.5 rounded",
    outline: "text-white border border-white/20 px-2 py-0.5 rounded",
    ghost: "text-slate-400",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant] || variantStyles.cyan} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
