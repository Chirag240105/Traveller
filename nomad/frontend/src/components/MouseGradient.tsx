import React, { useRef, useState } from 'react'

interface MouseGradientProps {
  children: React.ReactNode
  className?: string
  gradientColor?: string
}

export const MouseGradient: React.FC<MouseGradientProps> = ({
  children,
  className = '',
  gradientColor = 'rgba(255, 107, 53, 0.08)',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return

    const { left, top } = container.getBoundingClientRect()
    setCoords({
      x: e.clientX - left,
      y: e.clientY - top,
    })
    setOpacity(1)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${gradientColor}, transparent 80%)`,
          opacity: opacity,
        }}
      />
      {children}
    </div>
  )
}

export default MouseGradient
