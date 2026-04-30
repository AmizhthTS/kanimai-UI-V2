import React from "react";
import { useLoader } from "@/contexts/LoaderContext";
import logo from "@/assets/kanimai-logo.gif";

const PageLoader: React.FC = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background with shifting blurs */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-xl transition-all duration-700" />

      {/* Animated gradient orbs in the background for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-[100px] animate-bounce-gentle" />

      <div className="relative flex flex-col items-center justify-center gap-12 scale-110">
        {/* The Radiant Orbit System */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer Orbit */}
          <div className="absolute inset-0 rounded-full border border-primary/10 animate-[spin_8s_linear_infinite]" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full blur-[2px] shadow-[0_0_15px_hsl(var(--primary)_/_0.8)] animate-[spin_8s_linear_infinite]" />

          {/* Middle Orbit */}
          <div className="absolute inset-4 rounded-full border border-secondary/10 animate-[spin_5s_linear_infinite_reverse]" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-secondary rounded-full blur-[1px] shadow-[0_0_12px_hsl(var(--secondary)_/_0.8)] animate-[spin_5s_linear_infinite_reverse]" />

          {/* Inner Orbit */}
          <div className="absolute inset-8 rounded-full border border-accent/10 animate-[spin_3s_linear_infinite]" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full blur-[1px] shadow-[0_0_10px_hsl(var(--accent)_/_0.8)] animate-[spin_3s_linear_infinite]" />

          {/* Central Branded Logo with Breathing Effect */}
          <div className="relative z-10 w-40 h-20 flex items-center justify-center animate-[breath_3s_ease-in-out_infinite]">
            <img
              src={logo}
              alt="Just Born Garments Logo"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Text Area with Premium Typography */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse" />
          <p className="text-sm font-bold tracking-[0.4em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-[shimmer_3s_linear_infinite] bg-[length:200%_auto]">
            Processing Your Request
          </p>
          <div className="flex gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-[bounce_1s_infinite_0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-[bounce_1s_infinite_200ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-[bounce_1s_infinite_400ms]" />
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes breath {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.04); filter: brightness(1.1); }
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
      `,
        }}
      />
    </div>
  );
};

export default PageLoader;
