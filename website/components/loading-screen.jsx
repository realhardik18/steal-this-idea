"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const ASCII_CHARS = "`~!@#$%^&*()_+-=[]{}|;:,.<>?/\\\"'1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default function LoadingScreen() {
  const [asciiGrid, setAsciiGrid] = useState([])
  const rows = 15
  const cols = 30

  useEffect(() => {
    const initialGrid = Array(rows)
      .fill(0)
      .map(() =>
        Array(cols)
          .fill(0)
          .map(() => getRandomChar())
      )
    setAsciiGrid(initialGrid)

    const interval = setInterval(() => {
      setAsciiGrid((prevGrid) => {
        const newGrid = [...prevGrid]
        const randomRow = Math.floor(Math.random() * rows)
        const randomCol = Math.floor(Math.random() * cols)
        newGrid[randomRow][randomCol] = getRandomChar()
        return newGrid
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  function getRandomChar() {
    return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-white text-center">
        <div className="mb-8 text-center">
          <pre className="inline-block text-xs md:text-sm leading-none font-mono">
            {asciiGrid.map((row, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                {row.map((char, j) => (
                  <motion.span
                    key={`${i}-${j}`}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: ((i * cols + j) * 0.01) % 1,
                    }}
                    className="inline-block w-[1ch]"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            ))}
          </pre>
        </div>
        <motion.p
          className="text-xl font-bold tracking-widest"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          LOADING IDEAS
        </motion.p>
      </motion.div>
    </div>
  )
}
