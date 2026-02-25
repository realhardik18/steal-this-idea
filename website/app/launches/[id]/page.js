"use client";

import { use, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Tag,
  FileText,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { launches } from "../data";

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "from", "is", "it", "as", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "that", "this", "these", "those",
  "i", "you", "he", "she", "we", "they", "me", "him", "her", "us", "them",
  "my", "your", "his", "its", "our", "their", "what", "which", "who", "whom",
  "how", "when", "where", "why", "all", "each", "every", "both", "few", "more",
  "most", "other", "some", "such", "no", "not", "only", "own", "same", "so",
  "than", "too", "very", "just", "about", "above", "after", "again", "also",
  "any", "because", "before", "between", "down", "during", "even", "get",
  "if", "into", "like", "make", "many", "much", "need", "new", "now", "over",
  "out", "up", "then", "there", "through", "under", "until", "while", "don't",
  "doesn't", "didn't", "won't", "wouldn't", "couldn't", "shouldn't", "let",
  "one", "two", "first", "way", "well", "back", "still", "here", "them",
]);

function analyzeKeywords(transcript) {
  const words = transcript
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const freq = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));
}

const CLOUD_COLORS = [
  "text-yellow-300",
  "text-yellow-400",
  "text-amber-300",
  "text-amber-400",
  "text-yellow-500",
  "text-orange-300",
  "text-yellow-200",
];

function WordCloud({ keywords }) {
  const maxCount = keywords[0]?.count || 1;
  const minCount = keywords[keywords.length - 1]?.count || 1;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 p-6 rounded-xl border border-yellow-500/20 bg-white/5">
      {keywords.map(({ word, count }, i) => {
        const ratio = minCount === maxCount ? 1 : (count - minCount) / (maxCount - minCount);
        const fontSize = 0.75 + ratio * 1.5; // 0.75rem to 2.25rem
        const color = CLOUD_COLORS[i % CLOUD_COLORS.length];
        const opacity = 0.5 + ratio * 0.5;

        return (
          <motion.span
            key={word}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className={`${color} font-semibold cursor-default transition-all hover:scale-110`}
            style={{ fontSize: `${fontSize}rem` }}
            title={`${word}: ${count}`}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}

export default function VideoPage({ params }) {
  const { id } = use(params);
  const launch = launches.find((l) => l.id === id);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const keywords = useMemo(
    () => (launch ? analyzeKeywords(launch.transcript) : []),
    [launch]
  );

  if (!launch) {
    return (
      <div className="min-h-screen bg-black font-mono text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Launch not found</h1>
          <Link
            href="/launches"
            className="text-yellow-400 hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Launches
          </Link>
        </div>
      </div>
    );
  }

  const truncatedTranscript = launch.transcript.slice(0, 300);
  const isLong = launch.transcript.length > 300;

  return (
    <div className="relative min-h-screen bg-black font-mono text-white overflow-hidden">
      {/* Yellow gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(234,179,8,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(245,158,11,0.12)_0%,_transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/launches"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-yellow-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Launches
          </Link>
        </motion.div>

        {/* Video player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative aspect-video w-full rounded-xl overflow-hidden border border-yellow-500/20 bg-black/50 mb-8"
        >
          <iframe
            src={`${launch.videoSrcUrl}?autoplay=0&rel=0`}
            title={`${launch.companyName} launch video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              {launch.companyName}
            </span>
          </h1>

          <div className="flex flex-wrap gap-3 text-white/50">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm">
              <Building2 className="w-3.5 h-3.5" />
              {launch.companyName}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(launch.launchDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-sm text-yellow-400">
              <Tag className="w-3.5 h-3.5" />
              {launch.tags}
            </div>
          </div>
        </motion.div>

        {/* Transcript */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white/90">
            <FileText className="w-5 h-5 text-yellow-400" />
            Transcript
          </h2>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-white/60 leading-relaxed text-sm">
              {showFullTranscript || !isLong
                ? launch.transcript
                : `${truncatedTranscript}...`}
            </p>
            {isLong && (
              <button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="mt-3 inline-flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {showFullTranscript ? (
                  <>
                    Show less <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Word Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white/90">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            Word Cloud
          </h2>
          <WordCloud keywords={keywords} />
        </motion.div>

        {/* Keyword Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-10"
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white/90">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            Keyword Analysis
          </h2>
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
              <span>Keyword</span>
              <span>Count</span>
            </div>
            {keywords.map(({ word, count }, i) => {
              const maxCount = keywords[0]?.count || 1;
              const barWidth = (count / maxCount) * 100;

              return (
                <motion.div
                  key={word}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.5 + i * 0.03 }}
                  className="relative grid grid-cols-[1fr_auto] gap-4 px-5 py-2.5 border-b border-white/5 last:border-0"
                >
                  <div className="relative z-10 text-sm text-white/70">
                    {word}
                  </div>
                  <div className="relative z-10 text-sm text-yellow-400 font-medium tabular-nums">
                    {count}
                  </div>
                  <div
                    className="absolute inset-y-0 left-0 bg-yellow-500/5"
                    style={{ width: `${barWidth}%` }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
