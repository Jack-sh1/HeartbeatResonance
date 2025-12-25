import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Download, Check } from 'lucide-react';

const ConfessionCard: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const fullText = "罗颖女士,愿意做我女朋友么?";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    // Create a simple blob and download it as a "memory"
    const element = document.createElement("a");
    const file = new Blob([`致宝：\n\n${fullText}\n\n这份心动已在星空永久保存。\n日期：${new Date().toLocaleDateString()}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "我们的告白瞬间.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="max-w-md w-[90%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative sparkle in corner */}
      <div className="absolute top-0 right-0 p-4">
        <Sparkles className="text-yellow-400 animate-pulse" size={24} />
      </div>

      <div className="flex justify-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart size={64} className="text-red-500 fill-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
        </motion.div>
      </div>

      <div className="min-h-[100px] flex items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center tracking-wide leading-relaxed">
          {typedText}
        </h2>
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-4">
        <button 
          onClick={handleSave}
          className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
            isSaved 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          {isSaved ? (
            <>
              <Check size={20} />
              已保存心动
            </>
          ) : (
            <>
              <Download size={20} />
              保存这份心动
            </>
          )}
        </button>
      </div>

      <p className="mt-8 text-center text-white/30 text-[10px] uppercase tracking-[0.2em] font-light">
        Permanently Resonating in the Stars
      </p>
    </motion.div>
  );
};

export default ConfessionCard;
