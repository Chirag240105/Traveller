import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  type = 'button',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const xTo = gsap.quickTo(button, 'x', { duration: 0.3, ease: 'power3.out' })
    const yTo = gsap.quickTo(button, 'y', { duration: 0.3, ease: 'power3.out' })

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = button.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2

      const distanceX = clientX - centerX
      const distanceY = clientY - centerY

      // Magnetic range check
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
      const threshold = 100 // activation radius

      if (distance < threshold) {
        const forceX = distanceX * 0.3
        const forceY = distanceY * 0.3
        xTo(forceX)
        yTo(forceY)
      } else {
        xTo(0)
        yTo(0)
      }
    }

    const handleMouseLeave = () => {
      xTo(0)
      yTo(0)
    }

    window.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      className={`relative inline-block ${className}`}
      style={{ touchAction: 'none' }}
    >
      {children}
    </button>
  )
}

export default MagneticButton
