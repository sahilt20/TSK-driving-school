'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Video, Copy, Check, ExternalLink, Smartphone, Monitor } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function StreamSetupPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<any[]>([])
  const [selectedMatch, setSelectedMatch] = useState<string>('')
  const [streamKey, setStreamKey] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLiveMatches()
    // Load saved stream key from localStorage
    const saved = localStorage.getItem('youtube_stream_key')
    if (saved) setStreamKey(saved)
  }, [])

  async function fetchLiveMatches() {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(*),
        team_b:teams!matches_team_b_id_fkey(*)
      `)
      .in('status', ['live', 'scheduled'])
      .order('match_date', { ascending: false })

    if (data) {
      setMatches(data)
      if (data.length > 0 && !selectedMatch) {
        setSelectedMatch(data[0].id)
      }
    }
    setLoading(false)
  }

  function saveStreamKey() {
    localStorage.setItem('youtube_stream_key', streamKey)
    alert('Stream key saved!')
  }

  function copyOverlayUrl() {
    const url = `${window.location.origin}/stream-overlay?match=${selectedMatch}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const overlayUrl = selectedMatch ? `${typeof window !== 'undefined' ? window.location.origin : ''}/stream-overlay?match=${selectedMatch}` : ''

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Live Streaming Setup</h1>
              <p className="text-red-100">Stream your matches live to YouTube with scoreboard overlay</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Quick Start Steps */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Quick Start Guide</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
              <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Setup YouTube</h3>
              <p className="text-sm text-gray-700">Get your stream key from YouTube Studio</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
              <div className="text-3xl font-bold text-green-600 mb-2">2</div>
              <h3 className="font-bold text-gray-900 mb-2">Choose Method</h3>
              <p className="text-sm text-gray-700">Mobile app or Desktop OBS streaming</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Add Overlay</h3>
              <p className="text-sm text-gray-700">Include live score overlay in your stream</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Match Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📺 Select Match</h2>

            {matches.length === 0 ? (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
                <p className="text-yellow-900 font-bold mb-2">No Live Matches</p>
                <p className="text-sm text-yellow-800 mb-4">Start a match to begin streaming</p>
                <Link
                  href="/matches"
                  className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700"
                >
                  Go to Matches
                </Link>
              </div>
            ) : (
              <>
                <select
                  value={selectedMatch}
                  onChange={(e) => setSelectedMatch(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 font-semibold text-gray-900"
                >
                  {matches.map((match) => (
                    <option key={match.id} value={match.id}>
                      {match.team_a?.name} vs {match.team_b?.name}
                    </option>
                  ))}
                </select>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
                  <p className="text-sm font-bold text-green-900 mb-2">✅ Overlay URL (Copy this)</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={overlayUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border-2 border-green-400 rounded text-sm font-mono text-gray-900"
                    />
                    <button
                      onClick={copyOverlayUrl}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <button
                    onClick={() => window.open(overlayUrl, '_blank')}
                    className="mt-2 text-sm text-green-700 hover:text-green-800 font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview Overlay
                  </button>
                </div>
              </>
            )}
          </div>

          {/* YouTube Stream Key */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔑 YouTube Stream Key</h2>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Stream Key (from YouTube Studio)
              </label>
              <input
                type="password"
                value={streamKey}
                onChange={(e) => setStreamKey(e.target.value)}
                placeholder="xxxx-xxxx-xxxx-xxxx-xxxx"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-gray-900"
              />
              <button
                onClick={saveStreamKey}
                disabled={!streamKey}
                className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Save Stream Key
              </button>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <p className="text-sm font-bold text-blue-900 mb-2">📍 How to get Stream Key:</p>
              <ol className="text-sm text-blue-900 space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://studio.youtube.com" target="_blank" className="underline font-bold">YouTube Studio</a></li>
                <li>Click "Go Live" or "Create"</li>
                <li>Copy your Stream Key</li>
                <li>Paste it here and save</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Streaming Methods */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mobile Streaming */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-lg shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">📱 Mobile Streaming</h2>
            </div>

            <p className="text-purple-100 mb-4 text-lg">
              Stream directly from your phone to YouTube with live scoreboard!
            </p>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
              <h3 className="font-bold mb-3 text-yellow-300 text-lg">🎯 Step-by-Step Setup:</h3>

              <div className="space-y-4">
                <div className="bg-black/20 p-3 rounded-lg">
                  <p className="font-bold text-white mb-2">STEP 1: Download Larix Broadcaster</p>
                  <p className="text-sm text-purple-100">Free app available for iOS and Android</p>
                  <div className="flex gap-2 mt-2">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.wmspanel.larix_broadcaster"
                      target="_blank"
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm font-bold text-center hover:bg-green-700"
                    >
                      📥 Android
                    </a>
                    <a
                      href="https://apps.apple.com/app/larix-broadcaster/id1042474385"
                      target="_blank"
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold text-center hover:bg-blue-700"
                    >
                      📥 iOS
                    </a>
                  </div>
                </div>

                <div className="bg-black/20 p-3 rounded-lg">
                  <p className="font-bold text-white mb-2">STEP 2: Add YouTube Connection</p>
                  <ol className="text-sm space-y-1 text-purple-100 list-decimal list-inside ml-2">
                    <li>Open Larix app</li>
                    <li>Tap ⚙️ Settings → Connections</li>
                    <li>Tap + to add new connection</li>
                    <li>Select "RTMP/RTMPS"</li>
                    <li>Name: <span className="font-mono bg-black/30 px-1">YouTube Live</span></li>
                    <li>URL: <span className="font-mono bg-black/30 px-1 text-xs">rtmps://a.rtmp.youtube.com:443/live2</span></li>
                    <li>Stream Key: Paste your key (from above)</li>
                    <li>Save connection</li>
                  </ol>
                </div>

                <div className="bg-yellow-500/20 border-2 border-yellow-400 p-3 rounded-lg">
                  <p className="font-bold text-yellow-300 mb-2">🎬 STEP 3: Add Live Score Overlay</p>
                  <ol className="text-sm space-y-1 text-purple-100 list-decimal list-inside ml-2">
                    <li>In Larix, tap ⚙️ Settings</li>
                    <li>Tap "Text & Graphics" or "Overlays"</li>
                    <li>Tap + to add new overlay</li>
                    <li>Select "Web Page" or "Browser Source"</li>
                    <li>Paste the Overlay URL (copied above)</li>
                    <li>Set Position: <span className="font-bold">Bottom</span></li>
                    <li>Set Size: Width 100%, Height 25%</li>
                    <li>Enable "Transparent Background"</li>
                    <li>Save overlay</li>
                  </ol>
                </div>

                <div className="bg-black/20 p-3 rounded-lg">
                  <p className="font-bold text-white mb-2">STEP 4: Start Streaming</p>
                  <ol className="text-sm space-y-1 text-purple-100 list-decimal list-inside ml-2">
                    <li>Grant camera and microphone permissions</li>
                    <li>Select "YouTube Live" connection</li>
                    <li>Position phone in landscape mode</li>
                    <li>Tap the red 🔴 button to start</li>
                    <li>You're live on YouTube with scores!</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-green-600/30 border-2 border-green-400 rounded-lg p-4 mt-4">
              <p className="font-bold text-green-100 mb-2">✅ What You'll Get:</p>
              <ul className="text-sm space-y-1 text-green-50 list-disc list-inside ml-2">
                <li>Live video from your phone camera</li>
                <li>Real-time scoreboard overlay at bottom</li>
                <li>Automatic score updates every ball</li>
                <li>Professional cricket broadcast</li>
                <li>Viewers see batsmen, bowler, and score live!</li>
              </ul>
            </div>
          </div>

          {/* Desktop Streaming */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-lg shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Monitor className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Desktop Streaming (OBS)</h2>
            </div>

            <p className="text-green-100 mb-4">
              Professional streaming setup using OBS Studio
            </p>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
              <h3 className="font-bold mb-3">💻 Setup with OBS Studio</h3>
              <ol className="text-sm space-y-2 list-decimal list-inside text-green-100">
                <li>Download OBS Studio (free)</li>
                <li>Settings → Stream → YouTube - RTMPS</li>
                <li>Paste your stream key</li>
                <li>Add Video Capture Device (your camera)</li>
                <li>Add Browser Source (overlay URL)</li>
                <li>Position browser source at bottom</li>
                <li>Start streaming!</li>
              </ol>
            </div>

            <a
              href="https://obsproject.com/download"
              target="_blank"
              className="block bg-white text-green-700 px-4 py-3 rounded-lg font-bold text-center hover:bg-green-50 transition-colors"
            >
              Download OBS Studio
            </a>
          </div>
        </div>

        {/* Advanced: Direct Browser Streaming */}
        <div className="mt-6 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">🔬 Advanced: Browser-based Streaming</h2>
          <p className="text-orange-100 mb-4">
            Stream directly from browser with camera + overlay (Experimental - requires server setup)
          </p>
          <Link
            href={`/stream-live?match=${selectedMatch}`}
            className="inline-block bg-white text-orange-700 px-6 py-3 rounded-lg font-bold hover:bg-orange-50 transition-colors"
          >
            Try Browser Streaming (Beta)
          </Link>
          <p className="text-xs text-orange-200 mt-2">
            Note: This feature requires additional server configuration for production use
          </p>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Pro Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="text-2xl">📶</div>
              <div>
                <h3 className="font-bold text-gray-900">Stable Connection</h3>
                <p className="text-sm text-gray-700">Use WiFi or 4G/5G with good signal. Test before the match!</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🔋</div>
              <div>
                <h3 className="font-bold text-gray-900">Power Management</h3>
                <p className="text-sm text-gray-700">Keep your device plugged in or use a power bank</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">📏</div>
              <div>
                <h3 className="font-bold text-gray-900">Camera Position</h3>
                <p className="text-sm text-gray-700">Mount phone/camera on tripod for stable footage</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🎬</div>
              <div>
                <h3 className="font-bold text-gray-900">Test Stream</h3>
                <p className="text-sm text-gray-700">Do a test stream 30 mins before match starts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
