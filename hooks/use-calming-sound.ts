"use client"

import { useCallback } from 'react'

export function useCalmingSound() {
  const playSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return

      const ctx = new AudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // Calming sine wave
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(440, ctx.currentTime) // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1) // Slide up to A5

      // Soft envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)

      oscillator.start()
      oscillator.stop(ctx.currentTime + 1.5)
    } catch (e) {
      console.error("Audio play failed", e)
    }
  }, [])

  return playSound
}
