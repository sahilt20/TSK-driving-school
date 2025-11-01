'use client'

import { useStreamStore } from '@/lib/stores/streamStore'
import { Wifi, WifiOff, Signal } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ConnectionStatus() {
  const { stats } = useStreamStore()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const getQualityColor = () => {
    switch (stats.connectionQuality) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'fair':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getQualityBars = () => {
    switch (stats.connectionQuality) {
      case 'excellent':
        return 4
      case 'good':
        return 3
      case 'fair':
        return 2
      case 'poor':
        return 1
      default:
        return 0
    }
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-100 border-2 border-red-500 rounded-lg">
        <WifiOff className="w-5 h-5 text-red-600" />
        <div>
          <p className="text-sm font-semibold text-red-800">Offline</p>
          <p className="text-xs text-red-600">No internet connection</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg">
      {/* Signal Bars */}
      <div className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1 transition-all ${
              bar <= getQualityBars()
                ? getQualityColor()
                : 'bg-gray-300'
            }`}
            style={{ height: `${bar * 4}px` }}
          />
        ))}
      </div>

      {/* Connection Info */}
      <div className="flex-1">
        <p className={`text-sm font-semibold ${getQualityColor()}`}>
          {stats.connectionQuality.charAt(0).toUpperCase() + stats.connectionQuality.slice(1)}
        </p>
        <p className="text-xs text-gray-500">
          {(stats.bitrate / 1000000).toFixed(2)} Mbps
        </p>
      </div>

      {/* Online Indicator */}
      <Wifi className={`w-5 h-5 ${getQualityColor()}`} />
    </div>
  )
}
