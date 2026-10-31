import React from "react";
export default function Logo({ size = "md", showTagline = true }) {
  const sizes = {
    sm: { mark: "w-8 h-8 rounded-xl p-1", word: "text-base", tagline: "text-[8px]" },
    md: { mark: "w-10 h-10 rounded-[14px] p-1", word: "text-[19px]", tagline: "text-[9px]" },
    lg: { mark: "w-14 h-14 rounded-[18px] p-1.5", word: "text-2xl sm:text-3xl", tagline: "text-[10px]" }
  }[size] || { mark: "w-10 h-10 rounded-[14px] p-1", word: "text-[19px]", tagline: "text-[9px]" };

  return (
    <div className="flex items-center gap-2.5 group select-none">
      <div className={`${sizes.mark} relative shrink-0 grid place-items-center bg-[#F7FAF7] border border-white/70 shadow-[0_7px_18px_rgba(22,163,106,0.2)] transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105`}>
        <img src="/logo.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col min-w-0">
        <div className={`${sizes.word} leading-none tracking-[-0.055em] font-bold font-heading whitespace-nowrap`}>
          <span className="text-[#F5F7F5]">Click </span><span className="text-[#8BE0B0]">2 Clean</span>
        </div>
        {showTagline && <div className={`${sizes.tagline} font-medium tracking-[0.08em] mt-1.5 text-[#A5B3AA] whitespace-nowrap`}>CLEANER STREETS, SMARTER CITIES</div>}
      </div>
    </div>
  );
}
