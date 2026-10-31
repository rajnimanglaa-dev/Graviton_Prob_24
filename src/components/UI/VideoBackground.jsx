import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Video } from "lucide-react";

// Curated scenes with local video primary and high-res city photo fallbacks
const VIDEO_SCENES = [
  {
    id: "local-city-traffic",
    name: "Urban Clean Corridor",
    url: "/videos/city-traffic.mp4",
    poster: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1920&q=80",
    accent: "Green City Infrastructure"
  },
  {
    id: "modern-boulevard",
    name: "Avenue Promenade",
    url: "/videos/city-traffic.mp4",
    poster: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1920&q=80",
    accent: "Canopy & Sustainable Transit"
  }
];

export default function VideoBackground({ showControls = false, opacity = "opacity-30" }) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const currentScene = VIDEO_SCENES[currentSceneIdx];

  // Video playback control
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const nextScene = () => {
    setCurrentSceneIdx((prev) => (prev + 1) % VIDEO_SCENES.length);
    setIsVideoLoaded(false);
  };

  // Ambient organic particle & sunlight caustics simulation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Realistic floating ambient particles (pollen, sunlight motes)
    const particleCount = 24;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.8 + 1.1,
      speedX: Math.random() * 0.3 - 0.15,
      speedY: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.45 + 0.28,
      pulse: Math.random() * 0.02 + 0.005
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.006;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(177, 255, 210, ${Math.max(0.2, Math.min(0.82, p.alpha))})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = "rgba(65, 230, 153, 0.9)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Underlying Cinematic Video Stream */}
      <video
        ref={videoRef}
        key={currentScene.url}
        autoPlay
        loop
        muted
        playsInline
        poster={currentScene.poster}
        onLoadedData={() => setIsVideoLoaded(true)}
        className={`video-background-video w-full h-full object-cover transition-opacity duration-1000 ${opacity} ${
          isVideoLoaded ? "filter saturate-[1.4] contrast-[1.15] brightness-[1.18]" : "opacity-30"
        }`}
        style={{ transform: "scale(1.04)" }}
      >
        <source src={currentScene.url} type="video/mp4" />
      </video>

      {/* 2. Fallback Photo Backdrop with Soft Motion if video is buffering */}
      {!isVideoLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 opacity-20"
          style={{ backgroundImage: `url(${currentScene.poster})` }}
        />
      )}

      {/* 3. Ambient Canvas: Organic Green Motes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-100"
      />

      {/* 4. Film Grading & Dark Green Environmental Masks */}
      {/* Deep environmental dark background overlay ensuring high contrast readability */}
      <div className="video-background-wash absolute inset-0 bg-gradient-to-b from-[#101A17]/60 via-[#101A17]/48 to-[#101A17]/66" />

      {/* Ambient Forest Green cinematic tint */}
      <div className="video-background-tint absolute inset-0 bg-gradient-to-tr from-[#142820]/35 via-transparent to-[#16A36A]/25" />

      {/* Radial perimeter vignette */}
      <div className="video-background-vignette absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_58%,rgba(16,26,23,0.48)_100%)]" />
      <div className="absolute -top-40 -left-32 w-[34rem] h-[34rem] rounded-full bg-[#16A36A]/10 blur-[110px] animate-ambient-drift" />
      <div className="absolute -bottom-56 right-[-8rem] w-[38rem] h-[38rem] rounded-full bg-[#3987F5]/[0.07] blur-[130px] animate-ambient-drift-reverse" />

      {/* 5. Optional Video Controls Dock */}
      {showControls && (
        <div className="pointer-events-auto fixed bottom-4 right-4 z-40 flex items-center gap-2">
          {controlsOpen ? (
            <div className="bg-[#1D2B25]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#273b33] shadow-xl flex items-center gap-3 text-xs animate-fadeIn text-[#F5F7F5]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse" />
                <span className="font-bold text-[#F5F7F5]">
                  {currentScene.name}
                </span>
                <span className="text-[10px] text-[#A5B3AA] font-medium hidden sm:inline">
                  ({currentScene.accent})
                </span>
              </div>

              <div className="flex items-center gap-1 border-l border-[#273b33] pl-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  title={isPlaying ? "Pause video motion" : "Play video motion"}
                  className="p-1.5 rounded-lg text-[#A5B3AA] hover:text-white hover:bg-[#142820] transition"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>

                <button
                  type="button"
                  onClick={nextScene}
                  title="Switch video scene backdrop"
                  className="px-2 py-1 rounded-lg bg-[#16A36A]/20 text-[#8BE0B0] hover:bg-[#16A36A]/30 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <Video size={13} />
                  <span>Scene</span>
                </button>

                <button
                  type="button"
                  onClick={() => setControlsOpen(false)}
                  className="p-1 text-[#A5B3AA] hover:text-white text-xs font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setControlsOpen(true)}
              className="bg-[#1D2B25]/90 backdrop-blur-md hover:bg-[#1D2B25] text-[#A5B3AA] hover:text-[#8BE0B0] px-3 py-1.5 rounded-xl border border-[#273b33] shadow-md text-xs font-bold transition flex items-center gap-1.5 group"
            >
              <Video size={14} className="text-[#16A36A] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Video Stream:</span>
              <span className="text-[#8BE0B0] font-bold">{currentScene.name}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
