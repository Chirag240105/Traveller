import React from 'react'
import { FaMapLocationDot } from 'react-icons/fa6'

type MapProps = {
  lat: number
  long: number
  hotelName: string
  address: string
}

const MapboxMap: React.FC<MapProps> = ({ lat, long, hotelName, address }) => {
  // Validate coordinates
  const validLat = typeof lat === 'number' && !isNaN(lat) ? lat : 0
  const validLng = typeof long === 'number' && !isNaN(long) ? long : 0

  if (!validLat || !validLng) {
    return (
      <div className="flex h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center gap-3">
        <FaMapLocationDot className="text-brand-400" size={28} />
        <p className="text-sm text-slate-400">Map location unavailable for this property.</p>
      </div>
    )
  }

  // OpenStreetMap embed — completely free, no token needed
  const bbox = `${validLng - 0.015},${validLat - 0.01},${validLng + 0.015},${validLat + 0.01}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${validLat},${validLng}`
  const fullMapUrl = `https://www.openstreetmap.org/?mlat=${validLat}&mlon=${validLng}#map=15/${validLat}/${validLng}`

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/10 dark:border-slate-800 shadow-xl">
      {/* Map iframe */}
      <div className="relative">
        <iframe
          title={`Map for ${hotelName}`}
          src={src}
          width="100%"
          height="280"
          className="w-full border-0 block"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Overlay gradient at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 min-w-0">
          <FaMapLocationDot className="text-brand-400 shrink-0" size={14} />
          <p className="text-xs text-slate-400 truncate">{address}</p>
        </div>
        <a
          href={fullMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-[10px] font-semibold text-brand-300 hover:bg-brand-500/20 transition"
        >
          Open Map ↗
        </a>
      </div>
    </div>
  )
}

export default MapboxMap
