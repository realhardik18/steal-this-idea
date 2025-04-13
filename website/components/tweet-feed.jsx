"use client"

import { useState, useEffect } from "react"
import TweetCard from "@/components/tweet-card"
import { motion } from "framer-motion"

export default function TweetFeed({ tweets }) {
  const [renderedTweets, setRenderedTweets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Stagger the loading of tweets to improve performance
  useEffect(() => {
    setIsLoading(true)
    
    // Reset rendered tweets when tweet list changes
    setRenderedTweets([])
    
    // Batch render tweets for better performance
    const renderBatchSize = 10
    const totalBatches = Math.ceil(tweets.length / renderBatchSize)
    
    const renderNextBatch = (batchIndex) => {
      if (batchIndex >= totalBatches) {
        setIsLoading(false)
        return
      }
      
      const start = batchIndex * renderBatchSize
      const end = Math.min(start + renderBatchSize, tweets.length)
      const batch = tweets.slice(0, end)
      
      setRenderedTweets(batch)
      
      if (batchIndex < totalBatches - 1) {
        setTimeout(() => renderNextBatch(batchIndex + 1), 50)
      } else {
        setIsLoading(false)
      }
    }
    
    if (tweets.length > 0) {
      // Start rendering after a brief delay
      setTimeout(() => renderNextBatch(0), 100)
    } else {
      setIsLoading(false)
    }
    
  }, [tweets])
  
  if (tweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-xl font-mono text-zinc-500">No tweets found</p>
        <p className="text-sm font-mono text-zinc-600 mt-2">Try adjusting your search or filters</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderedTweets.map((tweet, index) => (
          <motion.div
            key={tweet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TweetCard tweet={tweet} />
          </motion.div>
        ))}
      </div>
      
      {isLoading && renderedTweets.length < tweets.length && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2 text-white/70 font-mono text-sm">
            <div className="h-2 w-2 bg-white/70 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-white/70 rounded-full animate-pulse delay-150"></div>
            <div className="h-2 w-2 bg-white/70 rounded-full animate-pulse delay-300"></div>
            <span className="ml-2">Loading more tweets...</span>
          </div>
        </div>
      )}
    </div>
  )
}
