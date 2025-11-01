import Link from 'next/link'
import { Video, Settings, Monitor, Smartphone } from 'lucide-react'

export default function StreamSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Live Streaming Setup Guide</h1>
          <p className="text-xl text-red-100">
            Stream your cricket matches live to YouTube with professional score overlays
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* YouTube Setup */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold">1. YouTube Live Setup</h2>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold mb-2">Enable Live Streaming</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Go to <a href="https://studio.youtube.com" target="_blank" className="text-blue-600 hover:underline">YouTube Studio</a></li>
                  <li>Click &quot;Create&quot; → &quot;Go Live&quot;</li>
                  <li>Verify your account (if first time)</li>
                  <li>Wait 24 hours for activation (first time only)</li>
                </ol>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold mb-2">Get Stream Key</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>In YouTube Studio, click &quot;Create&quot; → &quot;Go Live&quot;</li>
                  <li>Choose &quot;Stream&quot; (for streaming software)</li>
                  <li>Copy your <strong>Stream Key</strong> (keep it secret!)</li>
                  <li>Copy the <strong>Stream URL</strong> (usually rtmps://a.rtmps.youtube.com:443/live2)</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Never share your stream key publicly. It allows anyone to stream to your channel!
                </p>
              </div>
            </div>
          </section>

          {/* OBS Setup */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold">2. OBS Studio Setup</h2>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold mb-2">Download & Install</h3>
                <p className="text-gray-700 mb-2">
                  Download OBS Studio from <a href="https://obsproject.com" target="_blank" className="text-blue-600 hover:underline">obsproject.com</a>
                </p>
                <p className="text-sm text-gray-600">
                  Available for Windows, Mac, and Linux. Free and open-source.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold mb-2">Configure Stream Settings</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Open OBS Studio</li>
                  <li>Go to Settings → Stream</li>
                  <li>Service: <strong>YouTube - RTMPS</strong></li>
                  <li>Server: <strong>Primary YouTube ingest server</strong></li>
                  <li>Stream Key: Paste your YouTube stream key</li>
                  <li>Click Apply</li>
                </ol>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold mb-2">Configure Video Settings</h3>
                <div className="text-gray-700 space-y-2">
                  <p><strong>Settings → Output:</strong></p>
                  <ul className="list-disc list-inside ml-4 text-sm">
                    <li>Video Bitrate: 4500 kbps (adjust based on your upload speed)</li>
                    <li>Encoder: x264 (or hardware encoder if available)</li>
                    <li>Audio Bitrate: 160 kbps</li>
                  </ul>
                  <p className="mt-3"><strong>Settings → Video:</strong></p>
                  <ul className="list-disc list-inside ml-4 text-sm">
                    <li>Base Resolution: 1920x1080</li>
                    <li>Output Resolution: 1920x1080 (or 1280x720 for lower bandwidth)</li>
                    <li>FPS: 30</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Add Score Overlay */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">3. Add Score Overlay</h2>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold mb-2">Add Browser Source in OBS</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Start a match and get the Match ID</li>
                  <li>In OBS, click &quot;+&quot; in Sources panel</li>
                  <li>Select &quot;Browser&quot;</li>
                  <li>Name it &quot;Score Overlay&quot;</li>
                  <li>Enter URL: <code className="bg-gray-100 px-2 py-1 rounded text-sm">http://localhost:3001/overlay?match=YOUR_MATCH_ID</code></li>
                  <li>Set Width: 1920, Height: 1080</li>
                  <li>Set FPS: 30</li>
                  <li>Click OK</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Pro Tip:</strong> The overlay updates in real-time as you score. No refresh needed!
                </p>
                <p className="text-sm text-blue-700">
                  You can customize the theme by adding &theme=dark or &theme=blue to the URL.
                </p>
              </div>
            </div>
          </section>

          {/* Mobile Streaming */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold">4. Mobile Streaming</h2>
            </div>

            <p className="text-gray-700 mb-4">
              Stream directly from your mobile phone using our Progressive Web App with camera access and recording capabilities.
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-bold mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Live camera preview with front/back camera switching</li>
                  <li>Adjustable quality settings (Low, Medium, High, HD)</li>
                  <li>Local recording with download capability</li>
                  <li>Real-time stream health monitoring</li>
                  <li>Connection quality indicators</li>
                  <li>Wake lock to prevent screen sleep</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold mb-2">Getting Started</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Open the mobile streaming page on your phone</li>
                  <li>Grant camera and microphone permissions</li>
                  <li>Adjust quality based on your internet speed</li>
                  <li>Start the camera and begin recording</li>
                  <li>Download or stream your recording</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Recommended:</strong> Use Medium quality (720p @ 30fps) for most situations. This provides good quality with reasonable bandwidth usage.
                </p>
                <p className="text-sm text-blue-700">
                  For YouTube live streaming, recordings can be uploaded after the match or connected to a streaming server.
                </p>
              </div>

              <Link
                href="/mobile-stream"
                className="block w-full text-center bg-orange-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Open Mobile Streaming
              </Link>
            </div>
          </section>

          {/* Recommended Settings */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Recommended Settings by Internet Speed</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">5-10 Mbps Upload</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>Resolution: 1280x720 (720p)</li>
                  <li>FPS: 30</li>
                  <li>Bitrate: 2500-4000 kbps</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 border-green-500 bg-green-50">
                <h3 className="font-bold text-lg mb-2">10-20 Mbps Upload</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>Resolution: 1920x1080 (1080p)</li>
                  <li>FPS: 30</li>
                  <li>Bitrate: 4000-6000 kbps</li>
                </ul>
                <p className="text-xs text-green-600 mt-2">Recommended</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">20+ Mbps Upload</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>Resolution: 1920x1080 (1080p)</li>
                  <li>FPS: 60</li>
                  <li>Bitrate: 6000-9000 kbps</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Quick Start Checklist</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5" />
                <span>YouTube account verified and live streaming enabled</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5" />
                <span>OBS Studio installed and configured</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5" />
                <span>Stream key added to OBS</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5" />
                <span>Camera/video source added in OBS</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5" />
                <span>Score overlay browser source added</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5" />
                <span>Match created and ready to score</span>
              </label>
            </div>

            <div className="mt-6 flex gap-4">
              <Link
                href="/matches"
                className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50"
              >
                Create a Match
              </Link>
              <a
                href="https://obsproject.com"
                target="_blank"
                className="bg-green-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-900"
              >
                Download OBS
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
