'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, PauseCircle } from 'lucide-react'

type ScoreData = {
  homeTeam: string
  homeSchool: string
  awayTeam: string
  awaySchool: string
  homeScore: number
  awayScore: number
  homeLogo: string
  awayLogo: string
  quarter: number
  timeLeft: number
  homeTimeouts: number
  awayTimeouts: number
  showScoreboard: boolean
}

export function Page() {
  const [scoreData, setScoreData] = useState<ScoreData>({
    homeTeam: 'Home',
    homeSchool: 'School',
    awayTeam: 'Away',
    awaySchool: 'School',
    homeScore: 0,
    awayScore: 0,
    homeLogo: '/placeholder.svg?height=50&width=50',
    awayLogo: '/placeholder.svg?height=50&width=50',
    quarter: 1,
    timeLeft: 720,
    homeTimeouts: 7,
    awayTimeouts: 7,
    showScoreboard: true,
  })

  useEffect(() => {
    const eventSource = new EventSource('/api/score-updates')
    eventSource.onmessage = (event) => {
      setScoreData(JSON.parse(event.data))
    }
    return () => eventSource.close()
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!scoreData.showScoreboard) {
    return null
  }

  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black text-white w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="grid grid-cols-3 items-center bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 p-4">
          <div className="flex items-center space-x-4">
            <motion.img
              key={scoreData.homeLogo}
              src={scoreData.homeLogo}
              alt={scoreData.homeTeam}
              className="w-16 h-16 object-contain bg-white rounded-full p-1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div>
              <motion.span
                key={scoreData.homeTeam}
                className="text-2xl font-bold font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {scoreData.homeTeam}
              </motion.span>
              <motion.span
                key={scoreData.homeSchool}
                className="text-sm font-medium block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {scoreData.homeSchool}
              </motion.span>
            </div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-6xl font-bold mb-2 font-mono"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {scoreData.homeScore} - {scoreData.awayScore}
            </motion.div>
            <div className="text-xl font-semibold font-sans">
              Q{scoreData.quarter} | <Clock className="inline w-5 h-5 mr-1" />{formatTime(scoreData.timeLeft)}
            </div>
          </div>
          <div className="flex items-center justify-end space-x-4">
            <div className="text-right">
              <motion.span
                key={scoreData.awayTeam}
                className="text-2xl font-bold font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {scoreData.awayTeam}
              </motion.span>
              <motion.span
                key={scoreData.awaySchool}
                className="text-sm font-medium block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {scoreData.awaySchool}
              </motion.span>
            </div>
            <motion.img
              key={scoreData.awayLogo}
              src={scoreData.awayLogo}
              alt={scoreData.awayTeam}
              className="w-16 h-16 object-contain bg-white rounded-full p-1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <div className="flex justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex space-x-2 items-center">
            <span className="text-sm font-medium mr-2">Timeouts:</span>
            <AnimatePresence>
              {Array.from({ length: scoreData.homeTimeouts }).map((_, i) => (
                <motion.div
                  key={`home-timeout-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <PauseCircle className="w-5 h-5 text-blue-500" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex space-x-2 items-center">
            <span className="text-sm font-medium mr-2">Timeouts:</span>
            <AnimatePresence>
              {Array.from({ length: scoreData.awayTimeouts }).map((_, i) => (
                <motion.div
                  key={`away-timeout-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <PauseCircle className="w-5 h-5 text-red-500" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <img
          src="/yoscup-logo.svg"
          alt="YOSCUP Logo"
          className="absolute top-2 right-2 w-16 h-16 opacity-50"
        />
      </motion.div>
    </div>
  )
}