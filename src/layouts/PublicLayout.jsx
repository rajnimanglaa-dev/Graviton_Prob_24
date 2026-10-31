import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import VideoBackground from "../components/UI/VideoBackground.jsx";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#101A17] text-[#F5F7F5] relative selection:bg-[#16A36A] selection:text-white">
      {/* Real Cinematic Video Animation Background with Dark Green Overlay */}
      <VideoBackground showControls={true} opacity="opacity-35" />

      {/* Main UI Layer */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
