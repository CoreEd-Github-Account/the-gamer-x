import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "cyan" | "blue" | "ghost";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "blue",
  className = "",
}) => {
  const baseStyles = "inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-widest";
  
  const variantStyles = {
    blue: "text-blue-400",
    cyan: "text-blue-400",
    primary: "text-blue-400 bg-blue-950/50 border border-blue-500/30 px-2 py-0.5 rounded",
    secondary: "text-slate-400 bg-slate-800/60 border border-white/5 px-2 py-0.5 rounded",
    outline: "text-white border border-white/20 px-2 py-0.5 rounded",
    ghost: "text-slate-400",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant] || variantStyles.blue} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
