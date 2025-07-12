"use client"
import { X, Twitter, Link } from "lucide-react"

interface ProoferDetailModalProps {
  isOpen: boolean
  onClose: () => void
  proofer: {
    username: string
    pesan: string
    lat: string
    lng: string
    // Tambahkan properti opsional untuk detail lebih lanjut
    twitterUrl?: string
    portfolioUrl?: string
    longStory?: string
  } | null
}

export default function ProoferDetailModal({ isOpen, onClose, proofer }: ProoferDetailModalProps) {
  if (!isOpen || !proofer) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 w-full max-w-md relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%)",
          borderColor: "rgba(254, 17, 197, 0.2)",
        }}
      >
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

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative z-10 text-center">
          <img
            src={`https://unavatar.io/x/${proofer.username}?fallback=https://randomuser.me/api/portraits/men/32.jpg`}
            alt={proofer.username}
            width={96}
            height={96}
            className="rounded-full mx-auto mb-6 shadow-lg"
            style={{ border: "4px solid #FE11C5" }}
          />
          <h3 className="font-bold text-3xl text-gray-900 mb-2">@{proofer.username}</h3>
          <div className="text-sm text-gray-500 bg-gray-100 rounded-full px-4 py-2 inline-flex font-mono mb-4">
            📍 {Number.parseFloat(proofer.lat).toFixed(4)}, {Number.parseFloat(proofer.lng).toFixed(4)}
          </div>

          <div
            className="rounded-xl p-4 border-2 mb-6"
            style={{
              background: "linear-gradient(135deg, rgba(254, 17, 197, 0.08) 0%, rgba(233, 30, 99, 0.08) 100%)",
              borderColor: "rgba(254, 17, 197, 0.2)",
            }}
          >
            <p className="text-base text-gray-700 italic leading-relaxed font-medium">"{proofer.pesan}"</p>
          </div>

          {proofer.longStory && (
            <div className="mb-6 text-gray-800 text-left">
              <h4 className="font-semibold text-lg mb-2">My Story:</h4>
              <p>{proofer.longStory}</p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            {proofer.twitterUrl && (
              <a
                href={proofer.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-white font-semibold transition-transform hover:scale-105"
                style={{ background: "linear-gradient(135deg, #FE11C5 0%, #E91E63 100%)" }}
              >
                <Twitter className="w-5 h-5" />
                <span>Twitter</span>
              </a>
            )}
            {proofer.portfolioUrl && (
              <a
                href={proofer.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-white font-semibold transition-transform hover:scale-105"
                style={{ background: "linear-gradient(135deg, #FE11C5 0%, #E91E63 100%)" }}
              >
                <Link className="w-5 h-5" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
