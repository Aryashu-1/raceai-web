"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const RotatingCursorCube = () => {
    const meshRef = useRef<THREE.Mesh>(null)
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2
            meshRef.current.rotation.y += delta * 0.25
        }
    })

    return (
        <group>
            <mesh ref={meshRef}>
                <boxGeometry args={[2.5, 2.5, 2.5]} />
                <meshBasicMaterial color="#3B82F6" wireframe transparent opacity={0.6} />
            </mesh>
            <mesh>
                 <sphereGeometry args={[0.2, 16, 16]} />
                 <meshBasicMaterial color="#60A5FA" />
            </mesh>
        </group>
    )
}

export default function Cursor3DCanvas() {
    return (
        <Canvas 
            camera={{ position: [0, 0, 5], fov: 50 }} 
            gl={{ alpha: true, antialias: true }}
            dpr={[1, 2]}
        >
            <ambientLight intensity={0.5} />
            <RotatingCursorCube />
        </Canvas>
    )
}
