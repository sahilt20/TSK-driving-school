'use client'

import { useStreamStore } from '@/lib/stores/streamStore'
import { useStreamRecorder } from '@/lib/hooks/useStreamRecorder'
import { Clock, Download, Database, Activity } from 'lucide-react'

export default function StreamMonitor() {
  const { stats } = useStreamStore()
  const { isRecording, formattedDuration, downloadRecording } = useStreamRecorder()

  if (!isRecording) return null

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatBitrate = (bps: number): string => {
    const mbps = bps / 1000000
    return mbps.toFixed(2) + ' Mbps'
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Stream Monitor</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-red-600">RECORDING</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Duration */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Duration</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{formattedDuration}</p>
        </div>

        {/* Data Transferred */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Data</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {formatBytes(stats.bytesTransferred)}
          </p>
        </div>

        {/* Current Bitrate */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Bitrate</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {formatBitrate(stats.bitrate)}
          </p>
        </div>

        {/* Connection Quality */}
        <div className={`bg-gradient-to-br rounded-lg p-4 ${
          stats.connectionQuality === 'excellent' ? 'from-green-50 to-green-100' :
          stats.connectionQuality === 'good' ? 'from-blue-50 to-blue-100' :
          stats.connectionQuality === 'fair' ? 'from-yellow-50 to-yellow-100' :
          'from-red-50 to-red-100'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-5 h-5 rounded-full ${
              stats.connectionQuality === 'excellent' ? 'bg-green-600' :
              stats.connectionQuality === 'good' ? 'bg-blue-600' :
              stats.connectionQuality === 'fair' ? 'bg-yellow-600' :
              'bg-red-600'
            }`} />
            <span className={`text-sm font-medium ${
              stats.connectionQuality === 'excellent' ? 'text-green-900' :
              stats.connectionQuality === 'good' ? 'text-blue-900' :
              stats.connectionQuality === 'fair' ? 'text-yellow-900' :
              'text-red-900'
            }`}>Quality</span>
          </div>
          <p className={`text-2xl font-bold capitalize ${
            stats.connectionQuality === 'excellent' ? 'text-green-700' :
            stats.connectionQuality === 'good' ? 'text-blue-700' :
            stats.connectionQuality === 'fair' ? 'text-yellow-700' :
            'text-red-700'
          }`}>
            {stats.connectionQuality}
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadRecording}
        className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
      >
        <Download className="w-5 h-5" />
        <span>Download Recording</span>
      </button>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          Stream is being recorded locally. For YouTube streaming, connect to a streaming server in settings.
        </p>
      </div>
    </div>
  )
}
