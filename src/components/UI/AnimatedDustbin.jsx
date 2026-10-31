import React, { useState, useEffect } from "react";
import { Sparkles, Check, RefreshCw } from "lucide-react";

/**
 * AnimatedDustbin Component
 * A sleek, high-tech IoT Smart Waste Bin with:
 * - Interactive opening lid (on hover, drag over, or controlled via props)
 * - Waste particles dropping into the bin with smooth physics
 * - Subtle mint/green confirmation glow on disposal
 * - Rotating recycling emblem
 * - 3-color scheme support (Green = Recyclable, Blue = Organic, Yellow = Mixed)
 */
export default function AnimatedDustbin({
  size = "md",
  category = "green", // "green" | "blue" | "yellow" | "smart"
  forceOpen = false,
  isSuccess = false,
  interactive = true,
  showParticles = true,
  fillPercentage = 38,
  label = "IoT Smart Sorting Receptacle"
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [particlesActive, setParticlesActive] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(isSuccess);

  const open = forceOpen || (interactive && isHovered);

  // Sync external isSuccess prop
  useEffect(() => {
    if (isSuccess) {
      setSuccessTriggered(true);
      setParticlesActive(true);
      const timer = setTimeout(() => {
        setParticlesActive(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Color mapping based on category
  const colorMap = {
    green: {
      accent: "#16A36A",
      mint: "#8BE0B0",
      glow: "rgba(22, 163, 106, 0.45)",
      name: "Recyclable Waste",
      code: "REC-01"
    },
    blue: {
      accent: "#3987F5",
      mint: "#90c2ff",
      glow: "rgba(57, 135, 245, 0.45)",
      name: "Wet / Organic Waste",
      code: "ORG-02"
    },
    yellow: {
      accent: "#F4C542",
      mint: "#fce58d",
      glow: "rgba(244, 197, 66, 0.45)",
      name: "Mixed / Other Waste",
      code: "MIX-03"
    },
    smart: {
      accent: "#16A36A",
      mint: "#8BE0B0",
      glow: "rgba(139, 224, 176, 0.5)",
      name: "AI Autonomous Receptacle",
      code: "AUT-00"
    }
  };

  const activeColor = colorMap[category] || colorMap.green;

  // Size configurations
  const dimensions = {
    sm: { width: 140, height: 180, scale: 0.7 },
    md: { width: 220, height: 280, scale: 1 },
    lg: { width: 300, height: 380, scale: 1.35 }
  }[size] || { width: 220, height: 280, scale: 1 };

  const handleDropTrigger = () => {
    if (!interactive) return;
    setParticlesActive(true);
    setSuccessTriggered(true);
    setTimeout(() => {
      setParticlesActive(false);
    }, 2400);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      onClick={handleDropTrigger}
      title={interactive ? "Click or hover to test smart disposal interaction" : ""}
      style={{ cursor: interactive ? "pointer" : "default" }}
    >
      {/* Glow Aura Backdrop */}
      <div
        className="absolute -inset-4 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${
            successTriggered ? activeColor.glow : open ? "rgba(22, 163, 106, 0.25)" : "rgba(22, 163, 106, 0.08)"
          } 0%, transparent 70%)`
        }}
      />

      {/* SVG Dustbin */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 200 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform duration-300"
      >
        <defs>
          {/* Bin Body Gradient */}
          <linearGradient id={`binBodyGrad-${category}`} x1="30" y1="90" x2="170" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1D2B25" />
            <stop offset="50%" stopColor="#142820" />
            <stop offset="100%" stopColor="#0D1814" />
          </linearGradient>

          {/* Lid Gradient */}
          <linearGradient id={`lidGrad-${category}`} x1="30" y1="45" x2="170" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#283A32" />
            <stop offset="100%" stopColor="#16231E" />
          </linearGradient>

          {/* Waste level fill gradient */}
          <linearGradient id={`fillGrad-${category}`} x1="45" y1="210" x2="155" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={activeColor.accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={activeColor.mint} stopOpacity="0.4" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- SHADOW AT BASE --- */}
        <ellipse cx="100" cy="245" rx="58" ry="10" fill="#070D0B" opacity="0.7" />

        {/* --- DUSTBIN MAIN BODY --- */}
        {/* Outer Receptacle Shell */}
        <path
          d="M 45 92 L 56 235 C 57 241 63 245 70 245 L 130 245 C 137 245 143 241 144 235 L 155 92 Z"
          fill={`url(#binBodyGrad-${category})`}
          stroke="#2B3F36"
          strokeWidth="2"
        />

        {/* Inner Waste Fill Level Gauge (Behind glass or cut-out) */}
        <path
          d="M 60 236 L 55 170 C 75 167 125 167 145 170 L 140 236 Z"
          fill={`url(#fillGrad-${category})`}
          opacity="0.35"
        />

        {/* Sleek Vertical Accent Ribs for Structural Tech Feel */}
        <line x1="80" y1="105" x2="84" y2="225" stroke="#2B3F36" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="100" y1="105" x2="100" y2="225" stroke="#2B3F36" strokeWidth="1.5" />
        <line x1="120" y1="105" x2="116" y2="225" stroke="#2B3F36" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Center Illuminated Receptacle Badge / Status Display */}
        <rect
          x="72"
          y="135"
          width="56"
          height="54"
          rx="12"
          fill="#101A17"
          stroke={activeColor.accent}
          strokeWidth="1.5"
          filter="url(#softGlow)"
        />

        {/* Rotating Circular Recycling Emblem */}
        <g
          transform="translate(100, 162)"
          className="transition-transform duration-700"
          style={{
            transformOrigin: "100px 162px",
            animation: open ? "spinSlow 4s linear infinite" : "spinSlow 16s linear infinite"
          }}
        >
          {/* 3-Arrow Recycling Symbol Paths */}
          <path
            d="M 0 -14 L 4 -8 L -1 -8 C 5 -8 11 -3 12 3 L 9 4 C 8 -1 3 -5 -1 -5 L 3 -2 Z"
            fill={activeColor.mint}
          />
          <path
            d="M 12 5 L 14 12 L 9 10 C 12 15 9 21 3 23 L 2 20 C 6 18 9 14 6 10 L 4 14 Z"
            fill={activeColor.accent}
          />
          <path
            d="M -11 6 L -16 2 L -13 -2 C -17 -6 -23 -3 -24 3 L -21 4 C -20 -1 -16 -4 -13 -1 L -15 3 Z"
            fill={activeColor.mint}
          />
        </g>

        {/* Category LED Indicator Bar */}
        <rect
          x="78"
          y="198"
          width="44"
          height="4"
          rx="2"
          fill={activeColor.accent}
          className={open ? "animate-pulse" : ""}
        />

        {/* Optical Sensor Aperture Bar */}
        <rect x="52" y="86" width="96" height="8" rx="3" fill="#0A120F" stroke="#2B3F36" strokeWidth="1" />
        <circle cx="100" cy="90" r="3" fill={open ? activeColor.mint : "#24362F"} />
        <circle cx="70" cy="90" r="1.5" fill="#16A36A" opacity="0.6" />
        <circle cx="130" cy="90" r="1.5" fill={activeColor.accent} opacity="0.6" />

        {/* Ultrasonic Sensor Beam Effect when lid is open */}
        {open && (
          <g opacity="0.8">
            <line x1="85" y1="80" x2="70" y2="30" stroke={activeColor.mint} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <line x1="100" y1="78" x2="100" y2="25" stroke={activeColor.mint} strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="115" y1="80" x2="130" y2="30" stroke={activeColor.mint} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          </g>
        )}

        {/* --- DUSTBIN HINGED LID GROUP --- */}
        {/* Lid pivots at left hinge (40, 78) */}
        <g
          style={{
            transformOrigin: "42px 82px",
            transform: open ? "rotate(-38deg) translateY(-8px)" : "rotate(0deg)",
            transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          {/* Lid Main Dome */}
          <path
            d="M 38 82 C 38 72 50 64 70 60 L 130 60 C 150 64 162 72 162 82 Z"
            fill={`url(#lidGrad-${category})`}
            stroke="#344D42"
            strokeWidth="2"
          />

          {/* Lid Handle / Solar Sensor Strip */}
          <path
            d="M 80 60 L 80 50 C 80 47 84 45 88 45 L 112 45 C 116 45 120 47 120 50 L 120 60 Z"
            fill="#101A17"
            stroke="#344D42"
            strokeWidth="1.5"
          />
          {/* Handle Mint Core */}
          <rect x="87" y="49" width="26" height="5" rx="2" fill={activeColor.accent} opacity="0.8" />

          {/* Left / Right Hinge Points */}
          <circle cx="42" cy="82" r="4.5" fill="#0A120F" stroke="#344D42" strokeWidth="1.5" />
          <circle cx="158" cy="82" r="4.5" fill="#0A120F" stroke="#344D42" strokeWidth="1.5" />
        </g>

        {/* --- FALLING WASTE PARTICLES (When Open or Triggered) --- */}
        {(open || particlesActive) && showParticles && (
          <g className="transition-opacity duration-300">
            {/* Particle 1: Recyclable Bottle / Polygon */}
            <g
              style={{
                animation: "gentleFloat 1.8s ease-in-out infinite",
                transformOrigin: "90px 40px"
              }}
            >
              <rect x="85" y="32" width="10" height="18" rx="3" fill={activeColor.mint} opacity="0.85" />
              <rect x="87" y="27" width="6" height="5" rx="1" fill="#FFFFFF" opacity="0.9" />
            </g>

            {/* Particle 2: Small glowing paper / scrap */}
            <circle
              cx="115"
              cy="48"
              r="4.5"
              fill={activeColor.accent}
              opacity="0.8"
              style={{
                animation: "gentleFloat 2.2s ease-in-out infinite reverse"
              }}
            />

            {/* Particle 3: Micro particle */}
            <circle cx="76" cy="55" r="2.5" fill="#F5F7F5" opacity="0.6" />
            <circle cx="128" cy="38" r="2" fill={activeColor.mint} opacity="0.7" />
          </g>
        )}

        {/* --- CONFIRMATION CHECKMARK ON SUCCESS --- */}
        {successTriggered && (
          <g
            transform="translate(100, 115)"
            className="animate-fadeIn"
            style={{ filter: "drop-shadow(0 0 8px rgba(139, 224, 176, 0.8))" }}
          >
            <circle cx="0" cy="0" r="16" fill="#16A36A" />
            <path
              d="M -6 0 L -2 4 L 6 -4"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        )}
      </svg>

      {/* Label & Live Status Caption */}
      <div className="mt-2 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#F5F7F5]">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: activeColor.accent }}
          />
          <span className="font-heading">{activeColor.name}</span>
        </div>
        <p className="text-[11px] text-[#A5B3AA] font-mono mt-0.5">
          {label} • {open ? "Lid Open (Ready)" : "Proximity Standby"}
        </p>
      </div>
    </div>
  );
}
