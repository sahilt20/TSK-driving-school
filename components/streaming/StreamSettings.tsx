'use client'

import { useStreamStore } from '@/lib/stores/streamStore'
import { StreamQuality, QUALITY_PRESETS } from '@/types/streaming'
import { X, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

interface StreamSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function StreamSettings({ isOpen, onClose }: StreamSettingsProps) {
  const { settings, setQuality, status } = useStreamStore()
  const [selectedQuality, setSelectedQuality] = useState<StreamQuality>(settings.quality)

  useEffect(() => {
    setSelectedQuality(settings.quality)
  }, [settings.quality])

  if (!isOpen) return null

  const handleSave = () => {
    setQuality(selectedQuality)
    onClose()
  }

  const isStreaming = status === 'streaming'

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Stream Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isStreaming && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Settings cannot be changed while streaming. Stop the stream to modify settings.
              </p>
            </div>
          )}

          {/* Quality Presets */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stream Quality</h3>
            <div className="space-y-3">
              {(Object.keys(QUALITY_PRESETS) as StreamQuality[]).map((quality) => {
                const preset = QUALITY_PRESETS[quality]
                const isSelected = selectedQuality === quality

                return (
                  <button
                    key={quality}
                    onClick={() => !isStreaming && setSelectedQuality(quality)}
                    disabled={isStreaming}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-base font-semibold capitalize ${
                            isSelected ? 'text-red-700' : 'text-gray-900'
                          }`}>
                            {quality}
                          </span>
                          {quality === 'medium' && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-0.5">
                          <p>Resolution: {preset.resolution.width}x{preset.resolution.height}</p>
                          <p>Bitrate: {(preset.bitrate / 1000000).toFixed(1)} Mbps</p>
                          <p>Frame Rate: {preset.framerate} FPS</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="ml-4">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Quality Recommendations
            </h4>
            <ul className="text-sm text-blue-800 space-y-1.5">
              <li><strong>Low:</strong> For slow connections (2-5 Mbps)</li>
              <li><strong>Medium:</strong> For average connections (5-10 Mbps) - Recommended</li>
              <li><strong>High:</strong> For fast connections (10-20 Mbps)</li>
              <li><strong>HD:</strong> For very fast connections (20+ Mbps)</li>
            </ul>
          </div>

          {/* Current Settings Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Current Configuration</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Quality</p>
                <p className="font-semibold text-gray-900 capitalize">{settings.quality}</p>
              </div>
              <div>
                <p className="text-gray-600">Resolution</p>
                <p className="font-semibold text-gray-900">
                  {settings.resolution.width}x{settings.resolution.height}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Frame Rate</p>
                <p className="font-semibold text-gray-900">{settings.framerate} FPS</p>
              </div>
              <div>
                <p className="text-gray-600">Bitrate</p>
                <p className="font-semibold text-gray-900">
                  {(settings.bitrate / 1000000).toFixed(1)} Mbps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isStreaming}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
