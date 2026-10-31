import React from "react";

export default function Logo({ size = "md", variant = "default", showTagline = true }) {
  const sizeClasses = {
    sm: {
      imgSize: "w-8 h-8",
      title: "text-base",
      pill: "text-[11px] px-1 py-0.2",
      tagline: "text-[9px]"
    },
    md: {
      imgSize: "w-10 h-10",
      title: "text-xl",
      pill: "text-xs px-1.5 py-0.5",
      tagline: "text-[10px]"
    },
    lg: {
      imgSize: "w-14 h-14",
      title: "text-2xl sm:text-3xl",
      pill: "text-sm px-2 py-0.5",
      tagline: "text-xs"
    }
  }[size] || {
    imgSize: "w-10 h-10",
    title: "text-xl",
    pill: "text-xs px-1.5 py-0.5",
    tagline: "text-[10px]"
  };

  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Exact User-Uploaded Circular Green 'C' with Leaf Logo */}
      <div className={`relative ${sizeClasses.imgSize} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <img
          src="/logo.png"
          alt="Click 2 Clean Brand Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(22,163,106,0.35)]"
        />
      </div>

      {/* Brand Typographic Wordmark */}
      <div className="flex flex-col">
        <div className={`font-black ${sizeClasses.title} tracking-tight leading-none flex items-center gap-1.5 font-heading`}>
          <span className="text-[#F5F7F5] font-extrabold">Click</span>
          <span className={`font-black rounded-md ${sizeClasses.pill} bg-[#16A36A] text-white shadow-sm shadow-[#16A36A]/40`}>
            2
          </span>
          <span className="text-[#8BE0B0] font-black">
            Clean
          </span>
        </div>

        {showTagline && (
          <div className={`${sizeClasses.tagline} font-semibold tracking-wider uppercase mt-1 text-[#A5B3AA]`}>
            Cleaner Streets. Smarter Cities.
          </div>
        )}
      </div>
    </div>
  );
}
