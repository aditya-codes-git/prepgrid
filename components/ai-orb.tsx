'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Shared mouse state
const mouse = { x: 0, y: 0 }

// Particles orbiting inside
function Particles({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.25 + Math.random() * 0.4
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [count])
  
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.25
      ref.current.rotation.x += delta * 0.12
    }
  })
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#67e8f9"
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  )
}

// Orbiting ring
function Ring({ radius, rotation, speed }: { radius: number; rotation: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed
  })
  
  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, 0.012, 16, 100]} />
      <meshStandardMaterial
        color="#a5b4fc"
        transparent
        opacity={0.5}
        emissive="#6366f1"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

// Main glass orb with mouse tracking
function GlassOrb() {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const target = useRef({ x: 0, y: 0 })
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    // Smooth mouse follow (lerp towards target)
    target.current.x = mouse.y * 0.5
    target.current.y = mouse.x * 0.5
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      target.current.x,
      delta * 3
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      target.current.y + state.clock.elapsedTime * 0.1,
      delta * 3
    )
    
    // Floating motion
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08
    
    // Pulse the inner glow
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 2.5) * 0.25
    }
    
    // Pulse core brightness
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Outer glass shell - semi-transparent with refraction illusion */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#1e1b4b"
          transparent
          opacity={0.15}
          roughness={0.05}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Glass highlight rim */}
      <mesh>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshStandardMaterial
          color="#c7d2fe"
          transparent
          opacity={0.08}
          roughness={0}
          metalness={0.5}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Inner glow layer */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.75, 48, 48]} />
        <meshStandardMaterial
          color="#6366f1"
          transparent
          opacity={0.35}
          emissive="#6366f1"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Bright core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#a5b4fc"
          emissive="#818cf8"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>
      
      {/* Particles */}
      <Particles count={60} />
      
      {/* Interior lights */}
      <pointLight color="#6366f1" intensity={4} distance={4} />
      <pointLight color="#22d3ee" intensity={2} distance={2.5} position={[0.4, 0.4, 0.4]} />
      
      {/* Orbiting rings */}
      <Ring radius={1.15} rotation={[0.4, 0.2, 0]} speed={0.3} />
      <Ring radius={1.3} rotation={[-0.6, 0.35, 0.2]} speed={-0.22} />
      <Ring radius={1.45} rotation={[0.25, -0.5, 0.15]} speed={0.15} />
    </group>
  )
}

// Scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <directionalLight position={[-5, -5, -5]} intensity={0.2} color="#22d3ee" />
      <GlassOrb />
    </>
  )
}

// CSS fallback
function CSSOrb() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-48 h-48 md:w-64 md:h-64">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20 animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-primary/50 to-secondary/30 blur-sm" />
        <div className="absolute inset-16 rounded-full bg-primary/70" />
        <div className="absolute inset-[-10%] border border-primary/30 rounded-full animate-[spin_20s_linear_infinite]" />
        <div className="absolute inset-[-18%] border border-primary/20 rounded-full animate-[spin_25s_linear_infinite_reverse]" style={{ transform: 'rotateX(60deg)' }} />
      </div>
    </div>
  )
}

// Main component
export function AIOrb({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const [failed, setFailed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setMounted(true)
    
    // Check WebGL
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl')
      if (!gl) setFailed(true)
    } catch {
      setFailed(true)
    }
  }, [])
  
  // Track mouse position relative to container
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      mouse.x = ((e.clientX - cx) / (rect.width / 2))
      mouse.y = -((e.clientY - cy) / (rect.height / 2))
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <CSSOrb />
      
      {mounted && !failed && (
        <div className="absolute inset-0 z-10">
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'default',
              failIfMajorPerformanceCaveat: false,
            }}
            dpr={[1, 1.5]}
            style={{ background: 'transparent' }}
            onError={() => setFailed(true)}
          >
            <Scene />
          </Canvas>
        </div>
      )}
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, rgba(34, 211, 238, 0.1) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}
