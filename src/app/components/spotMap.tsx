"use client"

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"
import { Twitter } from "lucide-react" // Import ikon Twitter

interface MarkerType {
  username: string
  lat: string
  lng: string
  pesan: string
  // Tambahkan properti opsional untuk detail lebih lanjut
  twitterUrl?: string
  portfolioUrl?: string
  longStory?: string
}

interface SpotMapProps {
  markers: MarkerType[]
  onMarkerMove: (idx: number, newLat: number, newLng: number) => void
  // Hapus prop ini
  // onMarkerClick: (marker: MarkerType) => void
}

export default function SpotMap({ markers, onMarkerMove }: SpotMapProps) {
  // Hapus onMarkerClick dari destructuring props
  // Fix leaflet icon untuk Next.js
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
  }, [])

  function handleDragEnd(e: any, idx: number) {
    const marker = e.target
    const { lat, lng } = marker.getLatLng()
    onMarkerMove(idx, lat, lng)
  }

  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={4}
      minZoom={2}
      style={{ height: "500px", width: "100%", borderRadius: 16 }}
      className="shadow-inner"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* Render Polylines to connect markers with animation */}
      {markers.length > 1 &&
        markers.map((marker1, i) =>
          markers.slice(i + 1).map((marker2, j) => (
            <Polyline
              key={`${i}-${i + 1 + j}`} // Unique key for each line
              positions={[
                [Number.parseFloat(marker1.lat), Number.parseFloat(marker1.lng)],
                [Number.parseFloat(marker2.lat), Number.parseFloat(marker2.lng)],
              ]}
              color="#FE11C5" // Primary color
              weight={2}
              opacity={0.6}
              pathOptions={{ className: "animated-line" }} // Terapkan class animasi di sini
            />
          )),
        )}

      {markers.map((marker, idx) => {
        const avatarUrl = `https://unavatar.io/x/${marker.username}?fallback=https://randomuser.me/api/portraits/men/32.jpg`
        const twitterProfileUrl = `https://twitter.com/${marker.username}` // URL Twitter

        // Ukuran icon diperbesar menjadi 70x70
        const iconSize = [70, 70]
        const iconAnchor = [35, 70] // Setengah lebar, tinggi penuh
        const popupAnchor = [0, -70] // Di atas icon

        const avatarIcon = L.icon({
          iconUrl: avatarUrl,
          iconSize: iconSize as L.PointExpression,
          iconAnchor: iconAnchor as L.PointExpression,
          popupAnchor: popupAnchor as L.PointExpression,
          className: "avatar-marker", // Base class
        })

        const avatarIconGlow = L.icon({
          iconUrl: avatarUrl,
          iconSize: iconSize as L.PointExpression,
          iconAnchor: iconAnchor as L.PointExpression,
          popupAnchor: popupAnchor as L.PointExpression,
          className: "avatar-marker-glow", // Glow class
        })

        return (
          <Marker
            key={idx}
            position={[Number.parseFloat(marker.lat), Number.parseFloat(marker.lng)]}
            icon={avatarIcon} // Mulai dengan icon dasar
            draggable={true}
            eventHandlers={{
              dragend: (e) => handleDragEnd(e, idx),
              mouseover: (e) => {
                e.target.setIcon(avatarIconGlow)
              },
              mouseout: (e) => {
                e.target.setIcon(avatarIcon)
              },
            }}
          >
            <Popup className="custom-popup">
              <div className="text-center p-3 min-w-[220px]">
                <div className="relative mb-4">
                  <img
                    src={avatarUrl || "/placeholder.svg"}
                    alt={marker.username}
                    width={64}
                    height={64}
                    className="rounded-full mx-auto shadow-lg"
                    style={{ border: "3px solid #FE11C5" }}
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: "#FE11C5" }}
                  >
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-xl text-gray-900">@{marker.username}</h3>
                  <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-4 py-2 font-mono">
                    📍 {Number.parseFloat(marker.lat).toFixed(4)}, {Number.parseFloat(marker.lng).toFixed(4)}
                  </div>
                  <div
                    className="rounded-xl p-4 border-2"
                    style={{
                      background: "linear-gradient(135deg, rgba(254, 17, 197, 0.08) 0%, rgba(233, 30, 99, 0.08) 100%)",
                      borderColor: "rgba(254, 17, 197, 0.2)",
                    }}
                  >
                    <p className="text-sm text-gray-700 italic leading-relaxed font-medium">"{marker.pesan}"</p>
                  </div>
                  {/* Tombol Follow on Twitter */}
                  <a
                    href={twitterProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-full text-white font-semibold transition-transform hover:scale-105 shadow-md"
                    style={{ background: "linear-gradient(135deg, #FE11C5 0%, #E91E63 100%)" }}
                  >
                    <Twitter className="w-5 h-5" color="#f8fafc"/>
                    <span className="text-slate-50">Follow on X</span>
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
