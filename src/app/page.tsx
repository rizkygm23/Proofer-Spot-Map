"use client"

import type React from "react"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import CityInput from "./components/CityInput"
import NetworkBackground from "./components/NetworkBackgound"
import cities from "./data/cities.json"
import { supabase } from "./lib/supabase"
import { MapPin, Users, Globe, Sparkles, Zap } from "lucide-react"

const SpotMap = dynamic(() => import("./components/spotMap"), { ssr: false })

interface City {
  name: string
  lat: string
  lng: string
  country: string
}

interface Marker {
  username: string
  lat: string
  lng: string
  pesan: string
}

export default function Home() {
  const [username, setUsername] = useState("")
  const [city, setCity] = useState("")
  const [pesan, setPesan] = useState("")
  const [markers, setMarkers] = useState<Marker[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch all markers from Supabase on load
  useEffect(() => {
    fetchMarkers()
  }, [])

  async function fetchMarkers() {
    setLoading(true)
    const { data, error } = await supabase.from("Location").select("*")
    if (data)
      setMarkers(
        data.map((row) => {
          const [lat, lng] = row.koordinat.split(",")
          return { username: row.username, lat, lng, pesan: row.pesan }
        }),
      )
    setLoading(false)
  }

  // Handle submit form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true) // Set loading true saat submit
    const found = (cities as City[]).find((c) => c.name === city)
    if (!found) {
      alert("Pilih kota dari saran!")
      setLoading(false) // Reset loading jika ada error
      return
    }

    const lat = found.lat
    const lng = found.lng
    const koordinat = `${lat},${lng}`

    // Cek apakah sudah ada
    const { data: exists } = await supabase.from("Location").select("*").eq("username", username).single()

    if (exists) {
      // update lokasi + pesan
      await supabase.from("Location").update({ koordinat, pesan }).eq("username", username)
    } else {
      // insert lokasi baru
      await supabase.from("Location").insert([{ username, koordinat, pesan }])
    }

    await fetchMarkers()
    setUsername("")
    setCity("")
    setPesan("")
    setLoading(false) // Reset loading setelah selesai

    // Scroll ke bagian map setelah sukses
    const mapSection = document.getElementById("map-section")
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Handler update lokasi marker (drag end)
  async function handleMarkerMove(idx: number, newLat: number, newLng: number) {
    const marker = markers[idx]
    const koordinat = `${newLat},${newLng}`
    await supabase.from("Location").update({ koordinat }).eq("username", marker.username)
    // Update local state biar langsung terlihat
    setMarkers((prev) => prev.map((m, i) => (i === idx ? { ...m, lat: newLat.toString(), lng: newLng.toString() } : m)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Hero Section with Animated Network Background */}
      <div
        className="relative overflow-hidden text-white min-h-[40vh] flex items-center" // Mengurangi tinggi hero lagi
        style={{
          background: "linear-gradient(135deg, #FE11C5 0%, #E91E63 50%, #FF6B9D 100%)",
        }}
      >
        {/* Animated Network Background */}
        <NetworkBackground />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 z-20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-12">
            {/* Left side: Text content */}
            <div className="text-center lg:text-left lg:w-1/2">
              <div className="flex justify-center lg:justify-start mb-6">
                <div
                  className="p-6 rounded-full backdrop-blur-sm animate-pulse relative"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 0 40px rgba(254, 17, 197, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <MapPin className="w-16 h-16" />
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      backgroundColor: "rgba(254, 17, 197, 0.3)",
                    }}
                  ></div>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                Proofer Spot Map
              </h1>

              <p className="text-xl md:text-3xl mb-8 text-pink-100 max-w-4xl mx-auto font-light leading-relaxed drop-shadow-md">
                Connect with fellow proofers around the world. Share your location, stories, and build a
                <span className="font-semibold text-white"> global community</span>.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-pink-100 mb-8">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <Users className="w-6 h-6" />
                  <span className="font-semibold text-lg">{markers.length} Proofers</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <Globe className="w-6 h-6" />
                  <span className="font-semibold text-lg">Global Network</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <Zap className="w-6 h-6" />
                  <span className="font-semibold text-lg">Real-time Updates</span>
                </div>
              </div>
            </div>

            {/* Right side: Form Section - Moved here */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, #FE11C5 1px, transparent 0)`,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full" style={{ backgroundColor: "rgba(254, 17, 197, 0.1)" }}>
                        <Sparkles className="w-8 h-8" style={{ color: "#FE11C5" }} />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Join the Community</h2>
                    <p className="text-pink-100">Add your location and connect with proofers worldwide</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-pink-100 flex items-center space-x-2">
                        <span>Twitter Username</span>
                        <Sparkles className="w-4 h-4" style={{ color: "#FFB3E6" }} />
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 border-2 border-white/20 rounded-2xl transition-all duration-200 bg-white/5 placeholder-primary text-white focus:outline-none focus:ring-4 focus:ring-white/30"
                        onFocus={(e) => {
                          e.target.style.borderColor = "#FFB3E6"
                          e.target.style.boxShadow = "0 0 0 4px rgba(255, 255, 255, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255, 255, 255, 0.2)"
                          e.target.style.boxShadow = "none"
                        }}
                        placeholder="Enter your X (Twitter) username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-pink-100 flex items-center space-x-2">
                        <span>Your City</span>
                        <MapPin className="w-4 h-4" style={{ color: "#FFB3E6" }} />
                      </label>
                      <CityInput city={city} setCity={setCity} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-pink-100">Share Your Story</label>
                      <textarea
                        className="w-full p-4 border-2 border-white/20 rounded-2xl transition-all duration-200 bg-white/5 placeholder-primary text-white resize-none focus:outline-none focus:ring-4 focus:ring-white/30"
                        onFocus={(e) => {
                          e.target.style.borderColor = "#FFB3E6"
                          e.target.style.boxShadow = "0 0 0 4px rgba(255, 255, 255, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255, 255, 255, 0.2)"
                          e.target.style.boxShadow = "none"
                        }}
                        placeholder="Share a quote or fun fact about your city"
                        value={pesan}
                        onChange={(e) => setPesan(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>

                    <button
                      className="w-full text-white p-4 rounded-2xl font-bold text-lg transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #FE11C5 0%, #E91E63 100%)",
                      }}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Adding to Map...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <MapPin className="w-5 h-5" />
                          <span>Add Me to the Map</span>
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Map Section - Sekarang lebar penuh */}
        <div id="map-section" className="space-y-6 mb-12">
          {" "}
          {/* Tambahkan ID di sini */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, #FE11C5 1px, transparent 0)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: "rgba(254, 17, 197, 0.1)" }}>
                    <Globe className="w-8 h-8" style={{ color: "#FE11C5" }} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Global Proofer Network</h2>
                <p className="text-gray-600">Drag markers to update your location in real-time</p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <SpotMap markers={markers} onMarkerMove={handleMarkerMove} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card - Sekarang di bawah peta, lebar penuh */}
        <div className="w-full">
          <div
            className="rounded-3xl p-6 border backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, rgba(254, 17, 197, 0.1) 0%, rgba(233, 30, 99, 0.1) 100%)",
              borderColor: "rgba(254, 17, 197, 0.2)",
            }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5" style={{ color: "#FE11C5" }} />
              <span>Community Stats</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/50 rounded-2xl">
                <div className="text-3xl font-bold" style={{ color: "#FE11C5" }}>
                  {markers.length}
                </div>
                <div className="text-sm text-gray-600">Active Proofers</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-2xl">
                <div className="text-3xl font-bold" style={{ color: "#FE11C5" }}>
                  {new Set(markers.map((m) => m.lat + m.lng)).size}
                </div>
                <div className="text-sm text-gray-600">Unique Locations</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
