"use client"

import type React from "react"

import { useState } from "react"
import cities from "../data/cities.json" assert { type: "json" }
import { Search, MapPin } from "lucide-react"

interface City {
  name: string
  lat: string
  lng: string
  country: string
  admin1?: string
  admin2?: string
}

export default function CityInput({
  city,
  setCity,
}: {
  city: string
  setCity: (city: string) => void
}) {
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [input, setInput] = useState(city)
  const [isOpen, setIsOpen] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setInput(value)
    setCity(value)
    setIsOpen(true)

    if (value.length > 1) {
      const filtered = (cities as City[]).filter((c) => c.name.toLowerCase().startsWith(value.toLowerCase()))
      setSuggestions(filtered.slice(0, 8))
    } else {
      setSuggestions([])
    }
  }

  function handleSuggestion(city: City) {
    setInput(city.name)
    setCity(city.name)
    setSuggestions([])
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-200 w-5 h-5" />{" "}
        {/* Warna icon disesuaikan */}
        <input
          className="w-full pl-12 pr-4 py-4 border-2 border-white/20 rounded-2xl transition-all duration-200 bg-white/5 placeholder-primary text-white focus:outline-none focus:ring-4 focus:ring-white/30"
          type="text"
          value={input}
          onChange={handleChange}
          onFocus={(e) => {
            setIsOpen(true)
            e.target.style.borderColor = "#FFB3E6" // Warna border saat focus
            e.target.style.boxShadow = "0 0 0 4px rgba(255, 255, 255, 0.1)"
          }}
          onBlur={(e) => {
            setTimeout(() => setIsOpen(false), 200)
            e.target.style.borderColor = "rgba(255, 255, 255, 0.2)" // Warna border saat blur
            e.target.style.boxShadow = "none"
          }}
          placeholder="Search for your city..."
          autoComplete="off"
        />
      </div>

      {suggestions.length > 0 && isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-20">
          {suggestions.map((c, index) => (
            <div
              key={c.name + c.lat}
              className={`p-4 cursor-pointer transition-colors duration-150 flex items-center space-x-3 hover:bg-opacity-50 ${
                index === 0 ? "rounded-t-2xl" : ""
              } ${index === suggestions.length - 1 ? "rounded-b-2xl" : "border-b border-gray-100"}`}
              style={{
                ":hover": {
                  backgroundColor: "rgba(254, 17, 197, 0.1)",
                },
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(254, 17, 197, 0.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
              onClick={() => handleSuggestion(c)}
            >
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#FE11C5" }} />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{c.name}</div>
                <div className="text-sm text-gray-500">{c.country}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
