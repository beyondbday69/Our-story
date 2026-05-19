/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Cat, 
  Sparkles,
  Camera,
  MessageCircleHeart,
  Star,
  X,
  Mail,
  MailOpen
} from "lucide-react";

// --- Types ---
interface Memory {
  id: number;
  title: string;
  image: string;
  note: string;
}

// --- Components ---

const EntryGate = ({ onOpen }: { onOpen: () => void; key?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.2,
        filter: "blur(20px)",
        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
      }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6"
    >
      <div className="absolute inset-0 z-0 opacity-40">
         {[...Array(10)].map((_, i) => (
          <FloatingElement key={`gate-heart-${i}`} emoji="❤️" delay={i * 1.5} />
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative z-10 flex flex-col items-center space-y-12 text-center"
      >
        <div className="space-y-4">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="inline-block p-4 bg-primary/10 rounded-full"
          >
            <Cat size={48} className="text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display text-primary">A Message for Rimjhim</h1>
          <p className="text-on-surface/60 font-medium">Click the envelope to see what's inside...</p>
        </div>

        <motion.button
          onClick={onOpen}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.1, rotate: -2 }}
          whileTap={{ scale: 0.9 }}
          className="relative group cursor-pointer"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-8 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative bg-white w-48 h-32 md:w-64 md:h-44 rounded-[24px] shadow-kitty flex items-center justify-center border-2 border-primary/10 overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            
            {/* Envelope Flap Animation */}
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-primary"
                >
                  <MailOpen size={64} strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="closed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-primary"
                >
                  <Mail size={64} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-4 right-6 text-primary/40">
              <Heart size={20} fill="currentColor" />
            </div>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [0, 5, 0], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-8 text-primary font-bold uppercase tracking-[0.2em] text-xs"
          >
            Open with Love
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const Lightbox = ({ memory, onClose }: { memory: Memory; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 overflow-hidden"
    >
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      
      {/* Content */}
      <motion.div 
        layoutId={`memory-card-${memory.id}`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative z-10 w-full max-w-3xl bg-white rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <X size={24} />
        </button>

        <div className="w-full relative bg-black flex items-center justify-center">
          <img 
            src={memory.image} 
            alt={memory.title}
            className="w-full h-auto object-contain max-h-[90vh]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

interface FloatingElementProps {
  emoji: string;
  delay: number;
  key?: string;
}

const MemoryCard = ({ memory, onSelect }: { memory: Memory; onSelect: () => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex-shrink-0 w-[280px] md:w-[320px] snap-center perspective-1000">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-full h-[380px] md:h-[450px] preserve-3d cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-white p-4 rounded-[32px] shadow-sm backface-hidden flex flex-col group border border-primary/5">
          <div className="aspect-[4/5] rounded-[24px] overflow-hidden relative mb-3 flex-grow">
            <img 
              src={memory.image} 
              alt={memory.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6"
            >
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl flex items-center gap-2 scale-90 translate-y-4 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500">
                <Camera size={18} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">View Full</span>
              </div>
            </div>
          </div>
          <div className="mt-auto flex justify-between items-center px-1 pb-1">
            <div className="flex gap-1">
              <Star size={10} className="text-primary/20" />
              <Star size={10} className="text-primary/20" />
            </div>
            <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest flex items-center gap-1">
              Flip me <Heart size={8} fill="currentColor" />
            </span>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 bg-primary rounded-[32px] shadow-kitty flex flex-col items-center justify-center text-center p-8 text-white backface-hidden border-2 border-white/20"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary-variant)_0%,_transparent_70%)] opacity-30" />
          
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative z-10"
          >
            <Heart size={72} fill="currentColor" className="mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
          </motion.div>
          
          <h3 className="text-4xl font-display mb-4 relative z-10">I Love You</h3>
          <div className="w-12 h-1 bg-white/30 rounded-full mb-6 relative z-10" />
          
          <p className="text-base opacity-90 font-light leading-relaxed relative z-10 max-w-[200px]">
            Every moment with you is a gift. Forever isn't long enough ❤️
          </p>
          
          <div className="mt-8 pt-6 border-t border-white/10 w-full relative z-10">
            <span className="font-display text-sm opacity-60 italic">Your favorite kitty</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FloatingElement = ({ emoji, delay }: FloatingElementProps) => {
  const [position, setPosition] = useState({ x: Math.random() * 100, y: -10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setPosition({ x: Math.random() * 100, y: 110 });
    }, 10000 + delay * 1000);
    return () => clearInterval(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ y: "-10vh", x: `${position.x}vw`, opacity: 0, rotate: 0 }}
      animate={{ 
        y: "110vh", 
        opacity: [0, 1, 1, 0],
        rotate: [0, 45, -45, 0],
        x: [`${position.x}vw`, `${position.x + (Math.random() * 10 - 5)}vw`]
      }}
      transition={{ 
        duration: 15, 
        repeat: Infinity, 
        delay: delay,
        ease: "linear" 
      }}
      className="absolute pointer-events-none text-2xl z-0"
    >
      {emoji}
    </motion.div>
  );
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songData = {
    title: "Bairan",
    artist: "Banjaare",
    image: "https://c.saavncdn.com/238/Bairan-Unknown-2026-20260223182954-500x500.jpg",
    audioUrl: "https://aac.saavncdn.com/238/a7604f7d49918d0e11520cc03e33c267_320.mp4",
  };

  const memories: Memory[] = [
    {
      id: 1,
      title: "The First Smile",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-bwXhB5UOH0_XS1qWiRBWtTQ3kyEmWERui6bOvSuHEF_-m89uCLhGCgpUUEOm-dnISSlRZTc014mhMRdO2w_lUV4H8WXA75s_52mTwF4JSzmXc-HDC1QPXb2HKMyABsBk3AQaB8orEVcFoAAVD5cObquq0-LVoriHbttyQdAoUmEBXb7Z9T5RMU6hrotUDdFR5zKSe0F95xWoEfWSUtLw8OJlWdt93MJvhq7XH0eioXe-hX3-c_4EpfXN79zXKgeKY5uqSymIyXm6",
      note: "That day everything changed ✨"
    },
    {
      id: 2,
      title: "Warm Hugs",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGO6A7BoRg_xO3g3ifdth3I5N4rcU-PERA8-lx9ZWVfcERP9umkS2F6_L-Yxf7GHEGB4Sxug0HHww5A4dpCG3-uUHRyBG4NNXPT6wt4pxE2Yn4GAm2xexiTFTGmXPDb2z9PF5MxUStftCc1vylaZ3POtKbibkRyxHH21SdSAwcKKgW8MGkNt39oD9gvKWBigCjUrI0tGSWgpvLOJKhL5BXkSsErt8ykxGfoFwtbZgnOAMXN2hckYm4LI3o6cWrrV0crHF1OrX_te5d",
      note: "Safety found in your arms ❤️"
    },
    {
      id: 3,
      title: "Forever Us",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYGYUwQxdbqq13758nW9Jiiv4ZdTRXFub7cp8KJySjS44WVvH--MGGJbk-Vny8YFQ5CkBPsQzr8McOiLiExjEJ_YdT3SEd68_X4gcSwVhPMCcLBLdYJACO7zuUMOxge8U_ytfFPuLEguvpIJp5Nnoj8SJSbh_mrVzJHiBTj3eEo1bgyjg9zS6QVn8QyzRuQC8fbsh-1Y-6H6NIJCVqN-qvvyi4avsPh8OHiu2GWwxV1qTQyU84dOdtO4KR05LT58_eVTyAt9JhAhMc",
      note: "Together, always and forever 🎀"
    }
  ];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(songData.audioUrl);
    }
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!isOpen && <EntryGate key="gate" onOpen={() => setIsOpen(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMemory && (
          <Lightbox 
            memory={selectedMemory} 
            onClose={() => setSelectedMemory(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full flex flex-col items-center"
          >
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <FloatingElement key={`heart-${i}`} emoji="❤️" delay={i * 2} />
              ))}
              {[...Array(10)].map((_, i) => (
                <FloatingElement key={`star-${i}`} emoji="✨" delay={i * 3 + 1} />
              ))}
              {[...Array(5)].map((_, i) => (
                <FloatingElement key={`bow-${i}`} emoji="🎀" delay={i * 5 + 2} />
              ))}
            </div>

            {/* Header / Brand */}
            <header className="relative z-10 w-full max-w-5xl px-6 py-8 flex items-center justify-between">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-kitty kitty-bounce">
                  <Cat size={28} />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="hidden md:flex gap-6 text-sm font-semibold tracking-wider text-primary/70 uppercase"
              >
                <a href="#memories" className="hover:text-primary transition-colors text-primary/70">Memories</a>
                <a href="#music" className="hover:text-primary transition-colors text-primary/70">Soundtrack</a>
                <a href="#message" className="hover:text-primary transition-colors text-primary/70">Letter</a>
              </motion.div>
            </header>

            <main className="relative z-10 w-full max-w-5xl px-6 space-y-24 pb-32">
              
              {/* Hero Section */}
              <section className="flex flex-col items-center text-center pt-12 md:pt-24 space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, type: "spring", delay: 1.2 }}
                  className="relative"
                >
                  <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                  <h1 className="text-6xl md:text-8xl font-display text-primary drop-shadow-sm leading-tight">
                    Hey You ✨
                  </h1>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="text-lg md:text-2xl text-on-surface/80 max-w-2xl leading-relaxed font-light"
                >
                  Some people become memories.<br />
                  <span className="font-semibold text-primary">But you became my favorite dream come true.</span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  <button className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-kitty hover:bg-primary-variant transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                    <Heart size={18} fill="currentColor" />
                    Spread Love
                  </button>
                </motion.div>
              </section>

              {/* Heartfelt Message */}
              <section id="message" className="relative group">
                <div className="absolute -inset-px bg-gradient-to-r from-primary/30 to-primary-variant/30 rounded-[40px] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="frosted-glass rounded-[40px] p-10 md:p-16 text-center space-y-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                    <Cat size={200} className="text-primary" />
                  </div>
                  
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="inline-block p-4 bg-primary/10 rounded-3xl"
                  >
                    <MessageCircleHeart size={48} className="text-primary" />
                  </motion.div>

                  <h2 className="text-3xl md:text-4xl font-display text-primary">My Dearest Rimjhim</h2>
                  
                  <p className="text-lg md:text-xl text-on-surface/90 leading-loose italic">
                    "Every moment apart is just another moment closer to when we'll be together again. 
                    I find myself looking at our photos and playing our songs just to feel your presence. 
                    This distance is temporary, but what we have is forever."
                  </p>

                  <div className="flex justify-center gap-4 pt-4">
                    <Sparkles className="text-primary-variant animate-pulse" />
                    <div className="w-16 h-px bg-primary/20 self-center" />
                    <Star className="text-primary-variant animate-pulse" />
                  </div>
                </motion.div>
              </section>

              {/* Memory Grid */}
              <section id="memories" className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-display text-primary">Our Sweet Memories</h2>
                  <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full" />
                </div>

                <div className="flex overflow-x-auto gap-8 pb-8 snap-x no-scrollbar -mx-6 px-6">
                  {memories.map((memory, i) => (
                    <motion.div
                      key={memory.id}
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className="flex-shrink-0 snap-center"
                    >
                      <MemoryCard 
                        memory={memory} 
                        onSelect={() => setSelectedMemory(memory)} 
                      />
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Music Player */}
              <section id="music" className="relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-[48px] -z-10" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="frosted-glass rounded-[40px] p-8 md:p-12 overflow-hidden relative"
                >
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                  
                  <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    {/* Album Cover */}
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          rotate: isPlaying ? 360 : 0
                        }}
                        transition={{ 
                          duration: 10, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        className="w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-white p-2 shadow-kitty bg-white overflow-hidden"
                      >
                        <img 
                          src={songData.image} 
                          alt="Album Art" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </motion.div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Music className="text-primary w-4 h-4 md:w-6 md:h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Player UI */}
                    <div className="flex-1 w-full space-y-8">
                      <div className="text-center md:text-left">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                          Now Playing
                        </span>
                        <h3 className="text-3xl md:text-4xl font-display text-primary">{songData.title}</h3>
                        <p className="text-on-surface/60 font-medium tracking-wide uppercase text-sm mt-1">{songData.artist}</p>
                      </div>

                      {/* Progress */}
                      <div className="space-y-3">
                        <div className="relative h-2 w-full bg-white/50 rounded-full overflow-hidden">
                          <motion.div 
                            className="absolute inset-y-0 left-0 bg-primary"
                            animate={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-primary/60 tracking-wider">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center md:justify-start gap-10">
                        <button className="text-primary/40 hover:text-primary transition-colors p-2 text-primary">
                          <SkipBack size={28} />
                        </button>
                        
                        <motion.button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-kitty hover:bg-primary-variant transition-all"
                        >
                          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                        </motion.button>

                        <button className="text-primary/40 hover:text-primary transition-colors p-2 text-primary">
                          <SkipForward size={28} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-primary/30 pt-6 border-t border-primary/10">
                        <Volume2 size={20} />
                        <div className="h-1 flex-1 bg-primary/10 rounded-full relative">
                          <div className="absolute inset-y-0 left-0 bg-primary/40 w-2/3 rounded-full" />
                        </div>
                        <motion.div
                          animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Heart size={20} className="text-primary" fill="currentColor" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

            </main>

            {/* Footer */}
            <footer className="w-full bg-white/40 backdrop-blur-md border-t border-primary/10 py-12 px-6 flex flex-col items-center space-y-6">
              <p className="text-primary/60 text-sm font-medium tracking-wide">
                Created with lots of <Heart size={14} className="inline mx-1 text-primary" fill="currentColor" /> and Care
              </p>
              
              <div className="flex gap-4 opacity-50">
                <Star size={16} className="text-primary" />
                <Star size={16} className="text-primary" />
                <Star size={16} className="text-primary" />
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
