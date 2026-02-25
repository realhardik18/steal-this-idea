"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Calendar,
  ArrowRight,
  Sparkles,
  Search,
  X,
  SlidersHorizontal,
  DollarSign,
  Users,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { launches } from "./data";
import { useLaunchPath } from "./utils";

// Extract unique categories from tags
const ALL_CATEGORIES = [
  ...new Set(launches.flatMap((l) => l.tags.split(" / ").map((t) => t.trim()))),
].sort();

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "name-asc", label: "A \u2192 Z" },
  { value: "name-desc", label: "Z \u2192 A" },
  { value: "employees-desc", label: "Most employees" },
  { value: "employees-asc", label: "Fewest employees" },
];

function LaunchCard({ launch }) {
  const href = useLaunchPath(`/launches/${launch.id}`);
  return (
    <Link href={href}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="group relative rounded-2xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden cursor-pointer transition-all duration-500 hover:border-yellow-500/20 hover:shadow-[0_8px_40px_rgba(234,179,8,0.06)]"
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
            <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.4)]">
              <Play className="w-5 h-5 text-[#0a0a0a] ml-0.5" fill="#0a0a0a" />
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[11px] font-medium text-yellow-400/80 border border-yellow-500/10">
              {launch.tags.split(" / ")[0]}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[17px] font-semibold text-white/90 group-hover:text-yellow-400 transition-colors duration-300 tracking-[-0.01em]">
              {launch.companyName}
            </h3>
            <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-yellow-400/60 transition-colors mt-0.5 flex-shrink-0" />
          </div>

          <p className="text-[13px] text-white/25 mt-1.5 line-clamp-2 font-light leading-relaxed">
            {launch.companyDescription}
          </p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-[12px] text-white/30 font-light">
              <Calendar className="w-3 h-3" />
              {new Date(launch.launchDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-white/30 font-light">
              <DollarSign className="w-3 h-3" />
              {launch.fundingAtLaunch.split(" (")[0]}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-white/30 font-light">
              <Users className="w-3 h-3" />
              {launch.employeesAtLaunch}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Carousel card (simpler, for the hero section)
function CarouselCard({ launch }) {
  const href = useLaunchPath(`/launches/${launch.id}`);
  return (
    <Link href={href}>
      <div className="group relative flex-shrink-0 w-[280px] md:w-[320px] rounded-2xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden cursor-pointer transition-all duration-500 hover:border-yellow-500/20">
        <div className="relative aspect-video w-full bg-[#080808] overflow-hidden">
          <Image
            src={launch.thumbnailUrl}
            alt={`${launch.companyName} launch`}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
              <Play className="w-4 h-4 text-[#0a0a0a] ml-0.5" fill="#0a0a0a" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-[15px] font-semibold text-white/80 group-hover:text-yellow-400 transition-colors">
            {launch.companyName}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default function LaunchesPage() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);

  // Auto-scroll carousel
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

  // Filtered + sorted launches
  const filteredLaunches = useMemo(() => {
    let results = [...launches];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          l.companyName.toLowerCase().includes(q) ||
          l.tags.toLowerCase().includes(q) ||
          l.companyDescription.toLowerCase().includes(q) ||
          l.founders.toLowerCase().includes(q) ||
          l.headquarters.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter((l) =>
        selectedCategories.some((cat) => l.tags.includes(cat))
      );
    }

    // Sort
    results.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.launchDate) - new Date(a.launchDate);
        case "date-asc":
          return new Date(a.launchDate) - new Date(b.launchDate);
        case "name-asc":
          return a.companyName.localeCompare(b.companyName);
        case "name-desc":
          return b.companyName.localeCompare(a.companyName);
        case "employees-desc":
          return b.employeesAtLaunch - a.employeesAtLaunch;
        case "employees-asc":
          return a.employeesAtLaunch - b.employeesAtLaunch;
        default:
          return 0;
      }
    });

    return results;
  }, [searchQuery, selectedCategories, sortBy]);

  function toggleCategory(cat) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategories([]);
    setSortBy("date-desc");
  }

  const hasActiveFilters =
    searchQuery || selectedCategories.length > 0 || sortBy !== "date-desc";

  return (
    <div
      className="relative min-h-screen text-white"
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      {/* Deep dark background */}
      <div className="fixed inset-0 bg-[#050505]" />

      {/* Subtle gradient accents */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_-10%,_rgba(234,179,8,0.06)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_110%,_rgba(245,158,11,0.04)_0%,_transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Nav bar */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between px-8 md:px-12 pt-8"
        >
          <Link
            href="/"
            className="text-white/30 text-sm hover:text-white/60 transition-colors"
          >
            &larr; Home
          </Link>
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
            <span>{launches.length} launches</span>
          </div>
        </motion.nav>

        {/* Hero */}
        <div className="flex flex-col items-center pt-16 md:pt-20 pb-10 px-6 text-center">
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
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative"
        >
          <div className="pointer-events-none absolute left-0 z-20 w-24 h-full bg-gradient-to-r from-[#050505] to-transparent" />
          <div className="pointer-events-none absolute right-0 z-20 w-24 h-full bg-gradient-to-l from-[#050505] to-transparent" />
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-4 overflow-x-auto px-8 py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {duplicatedLaunches.map((launch, index) => (
              <CarouselCard
                key={`${launch.id}-${index}`}
                launch={launch}
              />
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-8 md:px-12 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* Search & Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-6xl mx-auto px-8 md:px-12"
        >
          {/* Search bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search by company, category, founder, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-yellow-500/20 focus:bg-white/[0.05] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all ${
                showFilters || hasActiveFilters
                  ? "border-yellow-500/20 bg-yellow-500/[0.05] text-yellow-400/80"
                  : "border-white/[0.06] bg-white/[0.03] text-white/40 hover:text-white/60"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-4">
                  {/* Sort */}
                  <div className="mb-5">
                    <h3 className="text-xs uppercase tracking-wider text-white/30 mb-3">
                      Sort by
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSortBy(opt.value)}
                          className={`px-3 py-1.5 rounded-lg text-[13px] border transition-all ${
                            sortBy === opt.value
                              ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                              : "border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/10"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <h3 className="text-xs uppercase tracking-wider text-white/30 mb-3">
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ALL_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-[13px] border transition-all ${
                            selectedCategories.includes(cat)
                              ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                              : "border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/10"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-[13px] text-white/30 hover:text-yellow-400 transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[13px] text-white/20">
              {filteredLaunches.length === launches.length
                ? `${launches.length} launches`
                : `${filteredLaunches.length} of ${launches.length} launches`}
            </p>
            {hasActiveFilters && !showFilters && (
              <button
                onClick={clearFilters}
                className="text-[13px] text-yellow-400/50 hover:text-yellow-400 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-20">
            <AnimatePresence mode="popLayout">
              {filteredLaunches.map((launch) => (
                <LaunchCard key={launch.id} launch={launch} />
              ))}
            </AnimatePresence>

            {filteredLaunches.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <p className="text-white/20 text-lg mb-2">No launches found</p>
                <p className="text-white/10 text-sm">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
