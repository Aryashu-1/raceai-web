"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import { useRouter } from "next/navigation"

// Tesseract-inspired wireframe component
function TesseractWireframe() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <mesh ref={meshRef}>
      {/* Outer cube */}
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial color="#0052CC" wireframe />

      {/* Inner cube */}
      <mesh scale={0.6}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#035ed8" wireframe />

        {/* Core cube */}
        <mesh scale={0.6}>
          <boxGeometry args={[2, 2, 2]} />
          <meshBasicMaterial color="#26C6DA" wireframe />
        </mesh>
      </mesh>
    </mesh>
  )
}

// Mobius strip-inspired torus component
function MobiusRing() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.3
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[3, 0.3, 8, 16]} />
      <meshBasicMaterial color="#035ed8" wireframe />

      {/* Inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.2, 6, 12]} />
        <meshBasicMaterial color="#0052CC" wireframe />
      </mesh>
    </mesh>
  )
}

// Floating particles around the logo
function FloatingParticles() {
  const particlesRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2
    const radius = 4 + Math.sin(i) * 0.5
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = Math.sin(i * 0.5) * 2

    return (
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#26C6DA" />
      </mesh>
    )
  })

  return <group ref={particlesRef}>{particles}</group>
}

// Main 3D Logo Component
interface Logo3DProps {
  size?: number
  onClick?: () => void
  className?: string
}

export default function Logo3D({ size = 120, onClick, className = "" }: Logo3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push("/jarvis")
    }
  }

  return (
    <div
      className={`cursor-pointer transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"
        } ${className}`}
      style={{ width: size, height: size }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Main logo components */}
        <TesseractWireframe />
        <MobiusRing />
        <FloatingParticles />
      </Canvas>
    </div>
  )
}
