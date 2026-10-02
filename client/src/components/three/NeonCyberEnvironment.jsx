import { useMemo } from 'react'
import { Environment, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function NeonCyberEnvironment({ neonColor = '#22d3ee' }) {
  const neon = useMemo(() => new THREE.Color(neonColor), [neonColor])

  return (
    <>
      <color attach="background" args={['#030508']} />
      <fog attach="fog" args={['#030508', 10, 48]} />

      <ambientLight intensity={0.18} />
      <spotLight
        position={[10, 18, 12]}
        angle={0.35}
        penumbra={1}
        intensity={260}
        color={neonColor}
        castShadow
      />
      <pointLight position={[-10, 8, -6]} intensity={110} color={neonColor} />

      <Environment preset="city" />

      {/* Glowing floor with cinematic reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.04, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <MeshReflectorMaterial
          blur={[900, 500]}
          resolution={1024}
          mixBlur={4}
          mixStrength={55}
          depthScale={1.2}
          minDepthThreshold={0.4}
          color="#020617"
          metalness={0.15}
          roughness={0.75}
          // subtle neon wash
          emissive={neon}
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Floating fog lights */}
      <mesh position={[6, 1.2, -4]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshBasicMaterial color={neonColor} transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <mesh position={[-5, 1.6, 5]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.14} toneMapped={false} />
      </mesh>
    </>
  )
}

