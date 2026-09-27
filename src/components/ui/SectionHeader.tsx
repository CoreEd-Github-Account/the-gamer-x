import React from "react";

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  actionHref = "#",
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between mb-5 ${className}`}>
      <h2 className="text-sm sm:text-base md:text-lg font-black tracking-widest uppercase text-white">
        {title}
      </h2>
      {actionText && (
        <a
          href={actionHref}
          className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
        >
          <span>{actionText}</span>
          <span className="transform transition-transform duration-150 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </a>
      )}
    </div>
  );
};

export default SectionHeader;
