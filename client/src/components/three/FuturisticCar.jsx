import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Stylized procedural EV — metallic shell + neon underglow + headlights.
 * Uses placeholder geometry so the experience stays lightweight without external GLB assets.
 */
export default function FuturisticCar({
  bodyColor = '#151922',
  neonColor = '#00d4ff',
  cabinTint = 0.35,
  interiorLight = '#a855f7',
  interiorIntensity = 2.2,
  autoRotate = true,
  /** Showroom: idle pose offset */
  manualRotationOffset = 0,
  /** Showroom: controller “Rotate” motor */
  spinActive = false,
  wheelDark = '#0b0f14',
}) {
  const group = useRef(null)
  const spinAcc = useRef(0)

  const neon = useMemo(() => new THREE.Color(neonColor), [neonColor])
  const body = useMemo(() => new THREE.Color(bodyColor), [bodyColor])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    g.position.y = Math.sin(t * 0.9) * 0.07

    if (autoRotate) {
      g.rotation.y += delta * 0.18
      return
    }
    if (spinActive) spinAcc.current += delta * 0.95
    g.rotation.y = manualRotationOffset + spinAcc.current
  })

  const wheelGeometry = useMemo(() => new THREE.CylinderGeometry(0.38, 0.38, 0.28, 24), [])

  return (
    <group ref={group} dispose={null}>
      {/* Underglow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
        <ringGeometry args={[1.3, 2.4, 64]} />
        <meshBasicMaterial color={neon} transparent opacity={0.55} toneMapped={false} />
      </mesh>

      {/* Chassis */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[2.15, 0.42, 4.2]} />
        <meshStandardMaterial
          color={body}
          metalness={0.92}
          roughness={0.18}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Cabin glass */}
      <mesh castShadow position={[0, 0.72, -0.15]}>
        <boxGeometry args={[1.75, 0.55, 2.15]} />
        <meshPhysicalMaterial
          color="#0ea5e9"
          metalness={0.15}
          roughness={0.08}
          transmission={0.92}
          thickness={0.6}
          transparent
          opacity={Math.min(1, 0.25 + cabinTint * 0.75)}
        />
      </mesh>

      {/* Interior glow */}
      <pointLight
        position={[0, 0.65, -0.2]}
        intensity={interiorIntensity}
        distance={4}
        color={interiorLight}
      />

      {/* Aero canopy line */}
      <mesh position={[0, 0.52, 1.05]}>
        <boxGeometry args={[1.85, 0.08, 0.85]} />
        <meshStandardMaterial color={body} metalness={0.95} roughness={0.12} />
      </mesh>

      {/* Headlights */}
      <mesh position={[0.72, 0.18, 2.05]}>
        <boxGeometry args={[0.35, 0.14, 0.06]} />
        <meshStandardMaterial
          color="#e0f2fe"
          emissive="#dbeafe"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.72, 0.18, 2.05]}>
        <boxGeometry args={[0.35, 0.14, 0.06]} />
        <meshStandardMaterial
          color="#e0f2fe"
          emissive="#dbeafe"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Rear neon strip */}
      <mesh position={[0, 0.28, -2.06]}>
        <boxGeometry args={[1.85, 0.06, 0.05]} />
        <meshStandardMaterial
          color={neon}
          emissive={neon}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Wheels */}
      {[
        [1.05, -0.35, 1.35],
        [-1.05, -0.35, 1.35],
        [1.05, -0.35, -1.35],
        [-1.05, -0.35, -1.35],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh geometry={wheelGeometry} rotation={[0, 0, Math.PI / 2]} castShadow>
            <meshStandardMaterial color={wheelDark} metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.28, 0.03, 12, 32]} />
            <meshStandardMaterial
              color={neon}
              emissive={neon}
              emissiveIntensity={1.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
