/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Heart, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songData = {
    title: "Bairan",
    artist: "Banjaare",
    album: "Bairan",
    image: "https://c.saavncdn.com/238/Bairan-Unknown-2026-20260223182954-500x500.jpg",
    audioUrl: "https://aac.saavncdn.com/238/a7604f7d49918d0e11520cc03e33c267_320.mp4",
    url: "https://www.jiosaavn.com/song/bairan/HRoqBycHAnU"
  };

  useEffect(() => {
    // Initialize Audio
    if (!audioRef.current) {
      audioRef.current = new Audio(songData.audioUrl);
    }

    const audio = audioRef.current;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [songData.audioUrl]);

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
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedValue = (x / rect.width) * duration;
    audioRef.current.currentTime = clickedValue;
    setCurrentTime(clickedValue);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const memories = [
    {
      id: 1,
      title: "Sweet Moments",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-bwXhB5UOH0_XS1qWiRBWtTQ3kyEmWERui6bOvSuHEF_-m89uCLhGCgpUUEOm-dnISSlRZTc014mhMRdO2w_lUV4H8WXA75s_52mTwF4JSzmXc-HDC1QPXb2HKMyABsBk3AQaB8orEVcFoAAVD5cObquq0-LVoriHbttyQdAoUmEBXb7Z9T5RMU6hrotUDdFR5zKSe0F95xWoEfWSUtLw8OJlWdt93MJvhq7XH0eioXe-hX3-c_4EpfXN79zXKgeKY5uqSymIyXm6",
      rotation: 2,
    },
    {
      id: 2,
      title: "Your Smile",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGO6A7BoRg_xO3g3ifdth3I5N4rcU-PERA8-lx9ZWVfcERP9umkS2F6_L-Yxf7GHEGB4Sxug0HHww5A4dpCG3-uUHRyBG4NNXPT6wt4pxE2Yn4GAm2xexiTFTGmXPDb2z9PF5MxUStftCc1vylaZ3POtKbibkRyxHH21SdSAwcKKgW8MGkNt39oD9gvKWBigCjUrI0tGSWgpvLOJKhL5BXkSsErt8ykxGfoFwtbZgnOAMXN2hckYm4LI3o6cWrrV0crHF1OrX_te5d",
      rotation: -1.5,
    },
    {
      id: 3,
      title: "Today's Memory",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYGYUwQxdbqq13758nW9Jiiv4ZdTRXFub7cp8KJySjS44WVvH--MGGJbk-Vny8YFQ5CkBPsQzr8McOiLiExjEJ_YdT3SEd68_X4gcSwVhPMCcLBLdYJACO7zuUMOxge8U_ytfFPuLEguvpIJp5Nnoj8SJSbh_mrVzJHiBTj3eEo1bgyjg9zS6QVn8QyzRuQC8fbsh-1Y-6H6NIJCVqN-qvvyi4avsPh8OHiu2GWwxV1qTQyU84dOdtO4KR05LT58_eVTyAt9JhAhMc",
      rotation: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 h-16 flex items-center justify-between ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
          </motion.div>
          <span className="font-serif font-semibold text-xl text-primary tracking-tight">Our Story</span>
        </div>

      </header>

      <main className="pb-24 lg:pb-0">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8I9aL3TOXjjRuWs4gkHLs8e3Rh0q5Zf3HcTR6lB0asu-Ev1mOSUSDrmPSgZdJbOddJ25VYAuwVzsLgevLJtSJy2HCnwDimhQ4bGuf4DxcGy1AwC0yNqnjT51El1gddCdQiIWsUrQ_NFu1asa1aqyjIBCQVa3mjSB8BQ-eKdSvSVynQxvVzJlcRGELmLJ28uU7qHmvEJD1kV9IY28Y0NvW0r2QqmS86hDrMNsUHXCfXeL_b8W3cd8xPPZ1F9nCsREq6ZYrAm9LlPjH')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-10 text-center px-6"
          >
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-on-surface mb-4 drop-shadow-sm leading-tight">
              Counting the Days<br />Until I See You Again
            </h1>
            <p className="font-sans italic text-lg md:text-xl text-on-surface-variant/80 max-w-xl mx-auto">
              Distance means so little when someone means so much.
            </p>
          </motion.div>
        </section>

        {/* Heartfelt Message */}
        <section className="px-6 py-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-surface p-8 md:p-12 rounded-3xl relative shadow-[0_8px_40px_rgba(153,101,21,0.06)] border border-primary/5"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-background p-2 px-4 rounded-full">
              <Heart className="w-10 h-10 text-secondary" fill="currentColor" />
            </div>
            <div className="text-center space-y-6">
              <h2 className="font-serif text-3xl text-primary">My Dearest Rimjhim</h2>
              <p className="text-lg leading-relaxed text-on-surface-variant font-medium">
                Every moment apart is just another moment closer to when we'll be together again. 
                I find myself looking at our photos and playing our songs just to feel your presence. 
                This distance is temporary, but what we have is forever. I'm counting every second, 
                every heartbeat, until your hand is in mine again.
              </p>
              <div className="pt-6 border-t border-primary/10">
                <p className="font-serif italic text-2xl text-secondary">Always yours,</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Memory Gallery */}
        <section className="px-6 py-24 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-on-surface mb-2">Our Memories</h2>
                <p className="text-on-surface-variant font-medium">Frozen moments in time, waiting for new ones.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 pt-6">
              {memories.map((memory, i) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, rotate: memory.rotation * 2, y: 40 }}
                  whileInView={{ opacity: 1, rotate: memory.rotation, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                  whileHover={{ y: -8, scale: 1.02, rotate: memory.rotation * 0.5 }}
                  className="memory-frame"
                >
                  <div className="aspect-square overflow-hidden bg-background mb-4">
                    <img 
                      src={memory.image} 
                      alt={memory.title} 
                      className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <p className="text-center font-serif text-xl text-on-surface-variant italic opacity-80">{memory.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Music Player */}
        <section className="px-6 py-20 bg-primary/5">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">Our Soundtrack</h2>
              <p className="text-on-surface-variant font-medium italic">"Whenever I miss you, I play this on loop..."</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative max-w-2xl mx-auto"
            >
              {/* Card Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[32px] blur-2xl opacity-50" />
              
              <div className="relative bg-surface/80 backdrop-blur-2xl rounded-[28px] border border-white/20 shadow-2xl overflow-hidden p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  {/* Album Art */}
                  <motion.div 
                    className="relative w-48 h-48 md:w-56 md:h-56 shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-black/20 rounded-2xl blur-xl translate-y-4" />
                    <img 
                      src={songData.image} 
                      alt={songData.album}
                      className="w-full h-full object-cover rounded-2xl shadow-lg relative z-10"
                    />
                  </motion.div>

                  {/* Player Controls */}
                  <div className="flex-1 w-full space-y-8">
                    <div className="text-center md:text-left space-y-1">
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">{songData.title}</h3>
                      <p className="text-primary font-bold tracking-widest text-xs uppercase">{songData.artist}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div 
                        className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden relative cursor-pointer group/progress"
                        onClick={handleProgressBarClick}
                      >
                        <motion.div 
                          className="absolute inset-y-0 left-0 bg-primary"
                          animate={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                        />
                        <div className="absolute inset-y-0 left-0 w-full opacity-0 group-hover/progress:opacity-100 transition-opacity">
                          <div className="h-full w-full bg-primary/5" />
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant tracking-tighter">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-center md:justify-start gap-8">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <SkipBack className="w-6 h-6 fill-current" />
                      </button>
                      
                      <motion.button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all font-bold"
                      >
                        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                      </motion.button>

                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <SkipForward className="w-6 h-6 fill-current" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-on-surface-variant/40 pt-4 border-t border-primary/5">
                      <Volume2 className="w-4 h-4" />
                      <div className="h-1 w-24 bg-primary/5 rounded-full" />
                      <div className="ml-auto">
                        <a 
                          href={songData.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold tracking-[0.2em] hover:text-primary transition-colors"
                        >
                          LISTEN ON JIOSAAVN
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex justify-center"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-sm border border-primary/10 rounded-full shadow-sm">
                  <div className={`w-2 h-2 rounded-full bg-secondary ${isPlaying ? 'animate-pulse' : ''}`} />
                  <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                    {isPlaying ? "Resonating in my soul" : "Paused at your last breath"}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-primary/10 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors tracking-widest">OUR SONG</a>
            <span className="text-outline-variant">•</span>
            <a href="#" className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors tracking-widest">OUR PLACE</a>
          </div>
          <p className="text-sm font-medium text-on-surface-variant font-serif italic">Made with all my love, always.</p>
        </footer>
      </main>
    </div>
  );
}
