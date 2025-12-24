
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const MESSAGES = [
  "要一直幸福下去呀！",
  "这也太浪漫了吧 🥺",
  "百年好合 ❤️",
  "被这个心跳暖到了",
  "一定要在一起啊！",
  "这就是爱情的亚子吗？",
  "好美的烟火 ✨",
  "真挚的告白最动人",
  "心跳同频，灵魂共振",
  "我也想要这样的表白！",
  "祝福祝福！",
  "全场最闪耀的星 🌟",
];

const Danmaku: React.FC = () => {
  const [activeComments, setActiveComments] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newComment = {
        id: Date.now(),
        text: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
        top: Math.random() * 40 + 60, // Keep in bottom half
        duration: Math.random() * 5 + 5,
        color: `hsl(${Math.random() * 360}, 70%, 80%)`
      };
      
      setActiveComments(prev => [...prev, newComment]);

      // Cleanup old comments
      setTimeout(() => {
        setActiveComments(prev => prev.filter(c => c.id !== newComment.id));
      }, newComment.duration * 1000);

    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {activeComments.map((comment) => (
        <motion.div
          key={comment.id}
          initial={{ x: '100vw' }}
          animate={{ x: '-100vw' }}
          transition={{ duration: comment.duration, ease: "linear" }}
          className="absolute whitespace-nowrap font-medium text-sm md:text-lg bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10"
          style={{ 
            top: `${comment.top}%`, 
            color: comment.color,
            textShadow: `0 0 8px ${comment.color}44`
          }}
        >
          {comment.text}
        </motion.div>
      ))}
    </div>
  );
};

export default Danmaku;
