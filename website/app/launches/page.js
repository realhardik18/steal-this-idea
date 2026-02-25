"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Play, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { launches } from "./data";

function LaunchCard({ launch, index }) {
  return (
    <Link href={`/launches/${launch.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group relative flex-shrink-0 w-[300px] md:w-[350px] rounded-xl border border-yellow-500/20 bg-white/5 overflow-hidden cursor-pointer transition-all duration-300 hover:border-yellow-500/40 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video w-full bg-black/50 overflow-hidden">
          <Image
            src={launch.thumbnailUrl}
            alt={`${launch.companyName} launch`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-yellow-500/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
            {launch.companyName}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-sm text-white/40">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(launch.launchDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-yellow-400/60">
            <Tag className="w-3 h-3" />
            <span>{launch.tags}</span>
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
    let scrollSpeed = 0.5;

    function scroll() {
      if (!isPaused && container) {
        container.scrollLeft += scrollSpeed;

        // Reset to beginning when we've scrolled past the first set
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    }

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Duplicate items for infinite scroll effect
  const duplicatedLaunches = [...launches, ...launches];

  return (
    <div className="relative min-h-screen bg-black font-mono text-white overflow-hidden">
      {/* Yellow gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(234,179,8,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(245,158,11,0.12)_0%,_transparent_50%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(250,204,21,0.08)_0%,_transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex flex-col items-center pt-20 pb-12 px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-yellow-500/30 bg-yellow-500/10 mb-6"
          >
            <Rocket className="w-7 h-7 text-yellow-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
          >
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Launches
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed"
          >
            A curated collection of the best product launch videos. Watch how great companies introduced themselves to the world.
          </motion.p>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 flex items-center"
        >
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-6 overflow-x-auto px-6 py-4 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
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

        {/* Footer hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center pb-8 text-white/30 text-sm"
        >
          Hover to pause &middot; Click to watch
        </motion.div>
      </div>
    </div>
  );
}
