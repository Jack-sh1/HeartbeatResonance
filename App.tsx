
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Sparkles, Download } from 'lucide-react';
import { AppState } from './types';
import FireworkCanvas from './components/FireworkCanvas';
import StarryBackground from './components/StarryBackground';
import ConfessionCard from './components/ConfessionCard';

const TARGET_CLICKS = 52; // Set to 52 for meaningful "I Love You" context (520 is too long for a demo)

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [clickCount, setClickCount] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleHeartClick = () => {
    if (state === AppState.IDLE) setState(AppState.CHARGING);
    
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Simple visual haptic feedback would go here
    if (newCount >= TARGET_CLICKS) {
      triggerExplosion();
    }
  };

  const triggerExplosion = () => {
    setState(AppState.EXPLODING);
    setIsExploding(true);
    
    // After firework duration, reveal the card
    setTimeout(() => {
      setState(AppState.REVEALED);
    }, 8000);
  };

  // Calculate dynamic background intensity
  const progress = Math.min(clickCount / TARGET_CLICKS, 1);
  const bgOpacity = progress * 0.4; // Transition from pure black to dark purple

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Layer 1: Stars and Dynamic Background */}
      <StarryBackground intensity={progress} />
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{ 
          background: `radial-gradient(circle at center, rgba(88, 28, 135, ${bgOpacity}) 0%, rgba(0, 0, 0, 1) 100%)` 
        }} 
      />

      {/* Layer 2: Firework Canvas (Active only during explosion/reveal) */}
      {(state === AppState.EXPLODING || state === AppState.REVEALED) && (
        <FireworkCanvas active={isExploding} />
      )}

      {/* Layer 3: Main Interaction UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {state !== AppState.REVEALED && (
            <motion.div
              key="heart-interaction"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
              className="flex flex-col items-center"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleHeartClick}
                className="relative group focus:outline-none"
              >
                {/* Glow Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-red-500 rounded-full blur-3xl"
                  style={{ opacity: progress * 0.6 }}
                />

                <Heart
                  size={120 + progress * 80}
                  className={`transition-all duration-300 ${
                    clickCount > 0 ? 'text-red-500 fill-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'text-gray-600'
                  }`}
                  strokeWidth={1.5}
                />
              </motion.button>

              <div className="mt-12 text-center text-white/60">
                {state === AppState.IDLE && (
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-lg font-light tracking-widest"
                  >
                    It's quiet here. Tap to start the transmission.
                  </motion.p>
                )}
                {state === AppState.CHARGING && (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-white/90 tracking-tighter">
                      SYNCHRONIZING HEARTBEATS
                    </p>
                    <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                      <motion.div 
                        className="h-full bg-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/40 uppercase tracking-widest">
                      Resonance Frequency: {Math.floor(progress * 100)}%
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {state === AppState.REVEALED && (
            <ConfessionCard key="confession-card" />
          )}
        </AnimatePresence>
      </div>

      {/* Layer 4: Danmaku Removed as requested */}
      
      {/* Instruction text at bottom */}
      {state !== AppState.REVEALED && (
        <div className="absolute bottom-8 left-0 right-0 text-center text-white/20 text-xs pointer-events-none">
          DESIGNED FOR A SPECIAL RESONANCE • 52 BEATS TO CLIMAX
        </div>
      )}
    </div>
  );
};

export default App;
