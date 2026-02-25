"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Calendar, Tag, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { launches } from "./data";

function LaunchCard({ launch, index }) {
  return (
    <Link href={`/launches/${launch.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
        className="group relative flex-shrink-0 w-[320px] md:w-[380px] rounded-2xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden cursor-pointer transition-all duration-500 hover:border-yellow-500/20 hover:shadow-[0_8px_40px_rgba(234,179,8,0.06)]"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video w-full bg-[#080808] overflow-hidden">
          <Image
            src={launch.thumbnailUrl}
            alt={`${launch.companyName} launch`}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
            unoptimized
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-60" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.4)]"
            >
              <Play className="w-5 h-5 text-[#0a0a0a] ml-0.5" fill="#0a0a0a" />
            </motion.div>
          </div>
          {/* Tag overlay */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[11px] font-medium text-yellow-400/80 border border-yellow-500/10">
              {launch.tags.split(" / ")[0]}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="text-[17px] font-semibold text-white/90 group-hover:text-yellow-400 transition-colors duration-300 tracking-[-0.01em]">
            {launch.companyName}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5 text-[13px] text-white/30 font-light">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(launch.launchDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-white/20 group-hover:text-yellow-400/60 transition-colors duration-300">
              <span>Watch</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function LaunchesPage() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId;
    const scrollSpeed = 0.4;

    function scroll() {
      if (!isPaused && container) {
        container.scrollLeft += scrollSpeed;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    }

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const duplicatedLaunches = [...launches, ...launches];

  return (
    <div
      className="relative min-h-screen text-white overflow-hidden"
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      {/* Deep dark background */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Subtle gradient accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_-10%,_rgba(234,179,8,0.06)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_110%,_rgba(245,158,11,0.04)_0%,_transparent_60%)]" />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px 128px" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav bar */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between px-8 md:px-12 pt-8"
        >
          <Link href="/" className="text-white/30 text-sm hover:text-white/60 transition-colors">
            &larr; Home
          </Link>
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
            <span>{launches.length} launches</span>
          </div>
        </motion.nav>

        {/* Hero */}
        <div className="flex flex-col items-center pt-16 md:pt-24 pb-16 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/10 bg-yellow-500/[0.03] mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500/50" />
            <span className="text-[13px] text-yellow-500/50 font-medium tracking-wide">
              Curated Collection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] mb-6 leading-[0.9]"
          >
            <span className="text-white/90">Launch</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Videos
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg text-white/30 max-w-md leading-relaxed font-light"
          >
            Watch how the best companies introduced themselves to the world.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent mt-10"
          />
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex-1 flex items-center"
        >
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 z-20 w-24 h-full bg-gradient-to-r from-[#050505] to-transparent" />
          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 z-20 w-24 h-full bg-gradient-to-l from-[#050505] to-transparent" />

          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-5 overflow-x-auto px-8 py-6"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {duplicatedLaunches.map((launch, index) => (
              <LaunchCard
                key={`${launch.id}-${index}`}
                launch={launch}
                index={index % launches.length}
              />
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-6 pb-10 text-white/15 text-[13px] font-light"
        >
          <span>Hover to pause</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>Click to watch</span>
        </motion.div>
      </div>
    </div>
  );
}
