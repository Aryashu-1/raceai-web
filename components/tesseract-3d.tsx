"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import * as THREE from "three"

const TesseractWireframe = () => {
  const groupRef = useRef<THREE.Group>(null)

  // Define the vertices of a tesseract (4D hypercube projected to 3D)
  const vertices = useMemo(() => {
    const scale = 1.6
    const inner = 0.55 // Slightly smaller inner cube for better parallax

    // Outer cube vertices
    const outer = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // back face
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], // front face
    ].map((v) => v.map((x) => x * scale) as [number, number, number])

    // Inner cube vertices (scaled down)
    const innerCube = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // back face
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], // front face
    ].map((v) => v.map((x) => x * scale * inner) as [number, number, number])

    return { outer, inner: innerCube }
  }, [])

  // Define edges
  const edges = useMemo(() => {
     // Indices for a cube: 0-3 back, 4-7 front
     const cubeEdges = [
       [0, 1], [1, 2], [2, 3], [3, 0], // back face ring
       [4, 5], [5, 6], [6, 7], [7, 4], // front face ring
       [0, 4], [1, 5], [2, 6], [3, 7]  // connecting back to front
     ]
     
     const outerEdges = cubeEdges
     const innerEdges = cubeEdges.map(([start, end]) => [start + 8, end + 8])
     const connections = Array.from({ length: 8 }).map((_, i) => [i, i + 8])

     return [...outerEdges, ...innerEdges, ...connections]
  }, [])

  // Combine all vertices
  const allVertices = useMemo(() => [...vertices.outer, ...vertices.inner], [vertices])

  useFrame((state) => {
    if (groupRef.current) {
      // Very slow, smooth rotation
      // Using sin/cos for a subtle "breathing" rotation effect or just constant slow rotation
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.05
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {edges.map((edge, index) => {
        const start = allVertices[edge[0]]
        const end = allVertices[edge[1]]
        // Subtle color gradient or solid look
        // Outer edges
        const isOuter = index < 12
        const isInner = index >= 12 && index < 24
        
        let color = "#60A5FA" // Blue-400
        let opacity = 0.4
        let width = 1

        if (isOuter) {
            color = "#3B82F6" // Blue-500
            opacity = 0.6
            width = 1.5
        } else if (isInner) {
            color = "#93C5FD" // Blue-300
            opacity = 0.3
            width = 1
        } else {
            // Connecting edges
            color = "#2563EB" // Blue-600
            opacity = 0.2
            width = 0.8
        }

        return (
            <Line 
                key={index} 
                points={[start, end]} 
                color={color} 
                lineWidth={width} 
                transparent 
                opacity={opacity} 
            />
        )
      })}

      {/* Vertices as glowing orbs */}
      {allVertices.map((vertex, index) => (
        <mesh key={`v-${index}`} position={vertex}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#60A5FA" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

export default function Tesseract3D() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas 
        camera={{ position: [0, 0, 9], fov: 40 }} 
        style={{ background: "transparent" }}
        dpr={[1, 2]} // Support high DPI screens for cleanliness
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <TesseractWireframe />
        {/* No OrbitControls to ensure fixed perspective with object rotation only */}
      </Canvas>
    </div>
  )
}
