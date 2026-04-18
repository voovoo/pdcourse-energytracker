import { useState, useEffect, useRef } from 'react'
import { nextLiveWatts } from '../utils/meter'

const MAX_POINTS = 60 // 2 minutes of history at 2s intervals

export function useLiveData() {
  const [points, setPoints] = useState(() => {
    // Pre-fill with plausible historical data
    return Array.from({ length: MAX_POINTS }, (_, i) => ({
      t: i - MAX_POINTS,
      watts: nextLiveWatts(),
    }))
  })

  const tickRef = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current++
      const watts = nextLiveWatts()
      setPoints(prev => {
        const next = [...prev.slice(-(MAX_POINTS - 1)), { t: tickRef.current, watts }]
        return next
      })
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return points
}
