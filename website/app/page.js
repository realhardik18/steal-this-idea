"use client"

import { useState, useEffect } from "react"
import TweetFeed from "@/components/tweet-feed"
import SearchBar from "@/components/search-bar"
import FilterBar from "@/components/filter-bar"
import LoadingScreen from "@/components/loading-screen"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [tweets, setTweets] = useState([])
  const [filteredTweets, setFilteredTweets] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [minLikes, setMinLikes] = useState(0)
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [selectedAuthors, setSelectedAuthors] = useState([])

  // Load data from public/data.json and show loading screen for exactly 2 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/data.json")
        const data = await response.json()

        // Map data.json structure to the required tweet format
        const mappedTweets = data.map((item, index) => ({
          id: String(index + 1),
          author: {
            name: item.username,
            handle: `@${item.username.toLowerCase().replace(/\s+/g, "")}`,
            avatar: item.profile_img,
          },
          content: item.content,
          tweet_url: item.tweet_url,
          timestamp: item.created_at,
          date: new Date(item.created_at),
          likes: item.likes,
          retweets: item.reposts,
          replies: item.bookmarks,
          tags: [], // Add tags if needed
        }))

        setTweets(mappedTweets)
        setFilteredTweets(mappedTweets)
      } catch (error) {
        console.error("Error loading tweets:", error)
      }
      
      // Always wait exactly 2 seconds before hiding loading screen to ensure everything is rendered
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }

    fetchData()
  }, [])

  // Handle search and filtering
  useEffect(() => {
    // Show filtering state while applying filters
    setIsFiltering(true)
    
    const applyFilters = () => {
      let result = [...tweets]

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        result = result.filter(
          (tweet) =>
            tweet.content.toLowerCase().includes(query) ||
            tweet.author.name.toLowerCase().includes(query) ||
            tweet.author.handle.toLowerCase().includes(query) ||
            tweet.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      }

      if (minLikes > 0) {
        result = result.filter(tweet => tweet.likes >= minLikes)
      }

      if (dateRange.start || dateRange.end) {
        result = result.filter(tweet => {
          const tweetDate = tweet.date.getTime()
          const startDate = dateRange.start ? new Date(dateRange.start).getTime() : 0
          const endDate = dateRange.end ? new Date(dateRange.end).getTime() : Infinity
          return tweetDate >= startDate && tweetDate <= endDate
        })
      }

      if (selectedAuthors.length > 0) {
        result = result.filter(tweet => 
          selectedAuthors.some(author => 
            tweet.author.handle.toLowerCase() === author.toLowerCase()
          )
        );
      }

      if (activeFilter !== "all") {
        switch (activeFilter) {
          case "popular":
            result = result.sort((a, b) => b.likes - a.likes)
            break
          case "recent":
            result = result.sort((a, b) => b.date.getTime() - a.date.getTime())
            break
          case "discussed":
            result = result.sort((a, b) => b.replies - a.replies)
            break
          default:
            break
        }
      }

      setFilteredTweets(result)
      setIsFiltering(false)
    }

    // Debounce filter changes slightly to prevent UI freezing during rapid changes
    const timeoutId = setTimeout(applyFilters, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, activeFilter, tweets, minLikes, dateRange, selectedAuthors])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-mono font-bold tracking-tight text-center sm:text-left">Steal This Idea</h1>
            <div className="text-center sm:text-right text-sm text-white/70 font-mono space-y-1.5">
              <p>thank you <a href="https://x.com/paraschopra" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">@paraschopra</a> & <a href="https://x.com/gregisenberg" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">@gregisenberg</a></p>
              <div className="flex justify-center sm:justify-end gap-2">
                <p><a href="https://hardikster4.gumroad.com/l/steal-this-idea" download className="text-red-400 hover:underline hover:text-red-300 transition-colors">download json</a></p>
                <span>•</span>
                <p><a href="https://github.com/realhardik18/steal-this-idea" target="_blank" rel="noopener noreferrer" className="text-white hover:underline hover:text-white/80 transition-colors">veiw repository</a></p>
              </div>
              <p>made by <a href="https://x.com/realhardik18" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors">@realhardik18</a></p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FilterBar 
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              minLikes={minLikes} 
              setMinLikes={setMinLikes} 
              dateRange={dateRange} 
              setDateRange={setDateRange}
              selectedAuthors={selectedAuthors}
              setSelectedAuthors={setSelectedAuthors}
              resultsCount={filteredTweets.length}
              totalCount={tweets.length}
              isFiltering={isFiltering}
            />
          </div>
        </header>
        
        {isFiltering ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-white/70 font-mono">Updating results...</div>
          </div>
        ) : filteredTweets.length > 0 ? (
          <TweetFeed tweets={filteredTweets} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-white/70 font-mono text-lg mb-2">No matching tweets found</p>
            <p className="text-white/50 font-mono text-sm">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </main>
  )
}
