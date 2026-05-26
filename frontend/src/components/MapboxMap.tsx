import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

type MapboxMapProps = {
  lat: number
  long: number
  hotelName: string
  address: string
}

const MapboxMap: React.FC<MapboxMapProps> = ({ lat, long, hotelName, address }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const { theme } = useTheme()
  const [mapError, setMapError] = useState<string | null>(null)

  // Token must be set via VITE_MAPBOX_TOKEN in your .env file
  // Get a free token at https://account.mapbox.com/
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || ''

  useEffect(() => {
    const mapboxgl = (window as any).mapboxgl

    if (!mapboxgl) {
      setMapError('Mapbox GL JS script failed to load. Please check your internet connection.')
      return
    }

    try {
      mapboxgl.accessToken = mapboxToken

      const mapStyle = theme === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11' 
        : 'mapbox://styles/mapbox/light-v11'

      // Initialize map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: [long, lat],
        zoom: 13,
      })

      // Add zoom and rotation controls
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Create a HTML marker element
      const el = document.createElement('div')
      el.className = 'w-8 h-8 bg-brand-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs transform -translate-y-1/2 cursor-pointer transition hover:scale-110 active:scale-95'
      el.innerHTML = `
        <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="color: #0f172a; padding: 4px;">
          <h4 style="font-weight: 600; margin: 0 0 2px 0; font-family: Outfit, sans-serif;">${hotelName}</h4>
          <p style="font-size: 11px; margin: 0; color: #64748b; line-height: 1.2;">${address}</p>
        </div>
      `)

      // Add marker to map
      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([long, lat])
        .setPopup(popup)
        .addTo(mapRef.current)

    } catch (err: any) {
      console.error('Error loading Mapbox Map:', err)
      setMapError('Failed to initialize Mapbox Map. Check console or access token.')
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [lat, long, theme])

  if (mapError) {
    return (
      <div className="flex h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
        <p className="text-sm font-medium text-amber-400">Map Unavailable</p>
        <p className="mt-2 text-xs text-slate-400 max-w-xs">{mapError}</p>
        <div className="mt-4 text-[10px] text-slate-500">
          Set <code className="bg-slate-950 px-1 py-0.5 rounded text-brand-300">VITE_MAPBOX_TOKEN</code> in your environment file.
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/10 dark:border-slate-800/80 shadow-2xl">
      <div ref={mapContainerRef} className="h-56 w-full" />
      <div className="absolute bottom-2 left-2 z-10 rounded-full bg-slate-950/70 px-3 py-1 text-[10px] text-slate-400 backdrop-blur-md">
        Mapbox Interactive Layer
      </div>
    </div>
  )
}

export default MapboxMap
