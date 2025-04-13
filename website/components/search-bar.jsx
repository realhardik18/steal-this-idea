"use client"

import { Search, X } from "lucide-react"

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
        <input
          type="text"
          placeholder="Search tweets..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-black border border-white/30 rounded-lg text-white placeholder:text-white/50 font-mono text-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50 transition-all"
        />
        {value && (
          <button 
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
