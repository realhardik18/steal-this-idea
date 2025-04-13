"use client"

import { Button } from "@/components/ui/button"
import { Filter, ChevronDown, X, Check, User, Loader2 } from "lucide-react"
import { useState } from "react"

export default function FilterBar({ 
  activeFilter, 
  setActiveFilter, 
  minLikes, 
  setMinLikes, 
  dateRange, 
  setDateRange,
  selectedAuthors,
  setSelectedAuthors,
  resultsCount,
  totalCount,
  isFiltering
}) {
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const filters = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular" },
    { id: "recent", label: "Recent" },
    { id: "discussed", label: "Most Discussed" },
  ]
  
  const availableAuthors = [
    { handle: "@paraschopra", name: "Paras Chopra" },
    { handle: "@gregisenberg", name: "Greg Isenberg" }
  ]

  const handleResetFilters = () => {
    setMinLikes(0);
    setDateRange({ start: "", end: "" });
    setActiveFilter("all");
    setSelectedAuthors([]);
  }
  
  const toggleAuthor = (handle) => {
    if (selectedAuthors.includes(handle)) {
      setSelectedAuthors(selectedAuthors.filter(a => a !== handle));
    } else {
      setSelectedAuthors([...selectedAuthors, handle]);
    }
  }

  return (
    <div className="w-full md:w-auto">
      {/* Mobile filter toggle */}
      <Button
        onClick={() => setShowFilters(!showFilters)}
        variant="outline"
        size="sm"
        className="md:hidden w-full justify-between bg-black border-white/30 text-white hover:bg-white/10 mb-2"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter Tweets</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </Button>

      {/* Filter container */}
      <div className={`space-y-3 bg-black border border-white/20 rounded-lg p-3 md:p-4 transition-all duration-300 ${showFilters || window.innerWidth >= 768 ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden md:max-h-[500px] md:opacity-100'}`}>
        {/* Main filters row */}
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={activeFilter === filter.id}
                className={`font-mono text-xs transition-all ${
                  activeFilter === filter.id
                    ? "bg-white text-black hover:bg-zinc-200 hover:text-black shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                    : "bg-black border-white/30 text-white hover:bg-white/10 hover:text-white"
                }`}
              >
                {filter.label}
              </Button>
            ))}
            
            {/* Advanced filters toggle */}
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)} 
              variant="ghost"
              size="sm"
              className="font-mono text-xs bg-transparent text-white/70 hover:bg-white/10 border border-white/10"
            >
              <span>Advanced</span>
              <ChevronDown className={`h-3.5 w-3.5 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {/* Results count display */}
          <div className="flex items-center font-mono text-xs">
            {isFiltering ? (
              <div className="flex items-center text-white/70">
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              <div className="text-white/70">
                Showing <span className="text-white font-semibold">{resultsCount}</span> of <span className="text-white/90">{totalCount}</span> tweets
              </div>
            )}
          </div>
        </div>

        {/* Advanced filters panel with animation */}
        <div className={`transition-all duration-300 space-y-3 ${showAdvanced ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          {/* Author filter section */}
          <div className="border-b border-white/10 pb-3">
            <p className="text-xs font-mono text-white mb-2 flex items-center">
              <User className="h-3.5 w-3.5 mr-1.5" /> Filter by Author:
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {availableAuthors.map(author => (
                <Button
                  key={author.handle}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAuthor(author.handle)}
                  className={`text-xs py-1 px-2 h-auto font-mono flex items-center gap-1 transition-all ${
                    selectedAuthors.includes(author.handle)
                      ? "bg-white/10 text-white border-white/40"
                      : "bg-black text-white/60 border-white/20 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {selectedAuthors.includes(author.handle) && (
                    <Check className="h-3 w-3" />
                  )}
                  {author.handle}
                </Button>
              ))}
            </div>
          </div>

          {/* Filter by minimum likes */}
          <div className="flex items-center flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-white">Minimum Likes:</label>
              <input
                type="number"
                value={minLikes}
                onChange={(e) => setMinLikes(Number(e.target.value))}
                className="w-20 p-1.5 bg-black border border-white/30 rounded text-white text-xs font-mono focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50 transition-all"
              />
            </div>

            {/* Filter by date range */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-mono text-white">Date Range:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="p-1.5 bg-black border border-white/30 rounded text-white text-xs font-mono focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50 transition-all"
              />
              <span className="text-white/60">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="p-1.5 bg-black border border-white/30 rounded text-white text-xs font-mono focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50 transition-all"
              />
            </div>
            
            {/* Reset filters button */}
            <Button 
              onClick={handleResetFilters}
              variant="outline" 
              size="sm"
              className="text-xs font-mono bg-transparent border-white/30 text-white/70 hover:bg-red-900/20 hover:border-red-500/50 hover:text-red-400 ml-auto"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Reset Filters
            </Button>
          </div>
          
          {/* Active filters summary */}
          {(minLikes > 0 || dateRange.start || dateRange.end || selectedAuthors.length > 0) && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs font-mono text-white/60 flex flex-wrap gap-2 items-center">
                Active filters:
                {minLikes > 0 && <span className="text-white bg-white/10 px-2 py-0.5 rounded">{minLikes}+ likes</span>}
                {dateRange.start && <span className="text-white bg-white/10 px-2 py-0.5 rounded">From: {dateRange.start}</span>}
                {dateRange.end && <span className="text-white bg-white/10 px-2 py-0.5 rounded">To: {dateRange.end}</span>}
                {selectedAuthors.map(author => (
                  <span key={author} className="text-white bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <User className="h-3 w-3" /> {author}
                    <button 
                      onClick={() => toggleAuthor(author)} 
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
