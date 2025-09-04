"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Line, OrbitControls } from "@react-three/drei"

const TesseractWireframe = () => {
  const groupRef = useRef()

  // Define the vertices of a tesseract (4D hypercube projected to 3D)
  const vertices = useMemo(() => {
    const scale = 1.5
    const inner = 0.6 // Inner cube scale

    // Outer cube vertices
    const outer = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1], // back face
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1], // front face
    ].map((v) => v.map((x) => x * scale))

    // Inner cube vertices (scaled down)
    const innerCube = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1], // back face
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1], // front face
    ].map((v) => v.map((x) => x * scale * inner))

    return { outer, inner: innerCube }
  }, [])

  // Define edges for both cubes and connections
  const edges = useMemo(() => {
    const outerEdges = [
      // Outer cube edges
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0], // back face
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4], // front face
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7], // connecting edges
    ]

    const innerEdges = [
      // Inner cube edges (offset by 8 for indexing)
      [8, 9],
      [9, 10],
      [10, 11],
      [11, 8], // back face
      [12, 13],
      [13, 14],
      [14, 15],
      [15, 12], // front face
      [8, 12],
      [9, 13],
      [10, 14],
      [11, 15], // connecting edges
    ]

    const connections = [
      // Connect corresponding vertices of inner and outer cubes
      [0, 8],
      [1, 9],
      [2, 10],
      [3, 11],
      [4, 12],
      [5, 13],
      [6, 14],
      [7, 15],
    ]

    return [...outerEdges, ...innerEdges, ...connections]
  }, [])

  // Combine all vertices
  const allVertices = useMemo(() => [...vertices.outer, ...vertices.inner], [vertices])

  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation on multiple axes for hyperdimensional effect
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {edges.map((edge, index) => {
        const start = allVertices[edge[0]]
        const end = allVertices[edge[1]]

        // Different colors for different types of edges
        let color = "#3B82F6" // Default blue
        if (index >= 12 && index < 24) color = "#1E40AF" // Inner cube - darker blue
        if (index >= 24) color = "#60A5FA" // Connections - lighter blue

        return <Line key={index} points={[start, end]} color={color} lineWidth={1.5} transparent opacity={0.6} />
      })}

      {/* Add glowing vertices */}
      {allVertices.map((vertex, index) => (
        <mesh key={index} position={vertex}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={index < 8 ? "#3B82F6" : "#1E40AF"} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

export default function Tesseract3D() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <TesseractWireframe />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          enabled={false} // Disable user interaction to keep it as background
        />
      </Canvas>
    </div>
  )
}
