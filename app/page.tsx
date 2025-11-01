import Link from 'next/link'
import { Video, Target, BarChart3, Users, TrendingUp, Wifi } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Cricket Club Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50">
              Complete solution for live streaming, scoring, and match analysis
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/matches"
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Start Scoring
              </Link>
              <Link
                href="/stream-setup"
                className="bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors border-2 border-white"
              >
                Setup Streaming
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Everything Your Club Needs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Live Streaming */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Live Streaming</h3>
              <p className="text-gray-600">
                Stream matches directly to YouTube from your mobile device. Simple setup, professional quality.
              </p>
              <Link href="/stream-setup" className="text-green-600 font-semibold mt-4 inline-block hover:text-green-700">
                Learn More →
              </Link>
            </div>

            {/* Real-time Scoring */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Real-time Scoring</h3>
              <p className="text-gray-600">
                Ball-by-ball scoring with instant updates. Multiple scorers supported with conflict resolution.
              </p>
              <Link href="/matches" className="text-green-600 font-semibold mt-4 inline-block hover:text-green-700">
                Start Scoring →
              </Link>
            </div>

            {/* Score Overlays */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Score Overlays</h3>
              <p className="text-gray-600">
                Professional score tickers for your stream. Customizable themes with real-time WebSocket updates.
              </p>
              <Link href="/overlay" className="text-green-600 font-semibold mt-4 inline-block hover:text-green-700">
                View Overlay →
              </Link>
            </div>

            {/* Match Management */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Match Management</h3>
              <p className="text-gray-600">
                Manage teams, players, tournaments, and schedules all in one place.
              </p>
              <Link href="/matches" className="text-green-600 font-semibold mt-4 inline-block hover:text-green-700">
                Manage Matches →
              </Link>
            </div>

            {/* Analytics */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Analytics & Stats</h3>
              <p className="text-gray-600">
                Detailed player and team statistics. Track performance over time with comprehensive analytics.
              </p>
              <Link href="/analytics" className="text-green-600 font-semibold mt-4 inline-block hover:text-green-700">
                View Stats →
              </Link>
            </div>

            {/* Field Planner */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Field Planner</h3>
              <p className="text-gray-600">
                Design and analyze field formations. Save presets and optimize field placement strategies.
              </p>
              <Link href="/field-planner" className="text-green-600 font-semibold mt-4 inline-block hover:text-green-700">
                Plan Fields →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Setup Your Match</h3>
                  <p className="text-gray-600">
                    Create a match, add teams and players, conduct toss, and set batting order.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Start Streaming</h3>
                  <p className="text-gray-600">
                    Open the streaming app on your phone, connect to YouTube, and start broadcasting.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Add Score Overlay</h3>
                  <p className="text-gray-600">
                    Add the browser source overlay to OBS/StreamYard for professional score display.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Score Live</h3>
                  <p className="text-gray-600">
                    Use the scoring interface to update scores ball-by-ball. Scores sync instantly to the overlay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
            Join cricket clubs around the world using our platform to stream and score their matches
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/matches"
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Create Your First Match
            </Link>
            <Link
              href="/docs"
              className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors border-2 border-white"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold mb-4">Cricket Club Platform</h4>
              <p className="text-sm">Complete solution for cricket clubs worldwide.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/matches" className="hover:text-white">Live Scoring</Link></li>
                <li><Link href="/stream-setup" className="hover:text-white">Streaming</Link></li>
                <li><Link href="/overlay" className="hover:text-white">Overlays</Link></li>
                <li><Link href="/field-planner" className="hover:text-white">Field Planner</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/tutorials" className="hover:text-white">Tutorials</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 Cricket Club Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
