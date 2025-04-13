import Image from "next/image"
import { Heart, MessageCircle, Repeat2, Share2, ExternalLink, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export default function TweetCard({ tweet }) {
  const [expanded, setExpanded] = useState(false)
  const maxChars = 100 // Changed from 180 to 100 characters
  const isLongTweet = tweet.content.length > maxChars
  
  const displayContent = !isLongTweet 
    ? tweet.content 
    : `${tweet.content.substring(0, maxChars)}...`

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [expanded])

  return (
    <>
      <div className="border border-white/20 rounded-lg p-4 bg-black hover:bg-black hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-[1.02] h-full flex flex-col">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Image
              src={tweet.author.avatar || "/placeholder.svg"}
              alt={tweet.author.name}
              width={40}
              height={40}
              className="rounded-full bg-white/10"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1 mb-2">
              <p className="font-mono font-medium text-white truncate max-w-[120px] sm:max-w-none">{tweet.author.name}</p>
              <p className="font-mono text-white/60 truncate max-w-[120px] sm:max-w-none">{tweet.author.handle}</p>
              <span className="text-white/60 hidden sm:inline">·</span>
              <p className="font-mono text-white/60 text-xs sm:text-sm w-full sm:w-auto mt-1 sm:mt-0">{tweet.timestamp}</p>
            </div>
            <div className="mb-4">
              <p className="font-mono text-white leading-relaxed whitespace-pre-wrap">{displayContent}</p>
              {isLongTweet && (
                <button 
                  onClick={() => setExpanded(true)} 
                  className="text-blue-400 hover:text-blue-500 text-sm font-mono mt-2 inline-block"
                >
                  click to read more
                </button>
              )}
            </div>

            {tweet.tags && tweet.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tweet.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs bg-black hover:bg-white/10 border-white/30 text-white">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {tweet.tweet_url && (
              <a
                href={tweet.tweet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white hover:underline text-sm font-mono mb-4 inline-flex items-center gap-1"
              >
                <span>Read on X</span> <ExternalLink className="h-3 w-3" />
              </a>
            )}

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/20">
              <button className="flex items-center space-x-1 text-white/70 hover:text-blue-300 transition-colors tweet-interact">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs font-mono">{tweet.replies}</span>
              </button>
              <button className="flex items-center space-x-1 text-white/70 hover:text-green-400 transition-colors tweet-interact">
                <Repeat2 className="h-4 w-4" />
                <span className="text-xs font-mono">{tweet.retweets}</span>
              </button>
              <button className="flex items-center space-x-1 text-white/70 hover:text-red-400 transition-colors tweet-interact">
                <Heart className="h-4 w-4" />
                <span className="text-xs font-mono">{tweet.likes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for expanded tweet */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-in-out]" 
          onClick={() => setExpanded(false)}
          style={{
            animation: "fadeIn 0.2s ease-in-out"
          }}
        >
          <div 
            className="bg-black border border-white/30 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              transformOrigin: "center"
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Image
                  src={tweet.author.avatar || "/placeholder.svg"}
                  alt={tweet.author.name}
                  width={48}
                  height={48}
                  className="rounded-full bg-white/10"
                />
                <div>
                  <p className="font-mono font-medium text-white">{tweet.author.name}</p>
                  <p className="font-mono text-white/60">{tweet.author.handle}</p>
                </div>
              </div>
              <button 
                onClick={() => setExpanded(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="font-mono text-white text-lg leading-relaxed whitespace-pre-wrap mb-6">{tweet.content}</p>
            
            <p className="font-mono text-white/60 mb-4">{tweet.timestamp}</p>

            {tweet.tags && tweet.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {tweet.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs bg-black hover:bg-white/10 border-white/30 text-white">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center gap-8">
                <div className="flex items-center space-x-1 text-white/70 tweet-interact">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm font-mono">{tweet.likes}</span>
                </div>
                <div className="flex items-center space-x-1 text-white/70 tweet-interact">
                  <Repeat2 className="h-5 w-5" />
                  <span className="text-sm font-mono">{tweet.retweets}</span>
                </div>
                <div className="flex items-center space-x-1 text-white/70 tweet-interact">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-mono">{tweet.replies}</span>
                </div>
              </div>
              {tweet.tweet_url && (
                <a
                  href={tweet.tweet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-white hover:underline text-sm font-mono inline-flex items-center gap-1"
                >
                  <span>View on X</span> <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }

        .tweet-interact {
          transition: transform 0.2s ease;
        }
        
        .tweet-interact:hover {
          transform: scale(1.15);
        }
        
        .tweet-card-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .tweet-card-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s, transform 0.3s;
        }
      `}</style>
    </>
  )
}
