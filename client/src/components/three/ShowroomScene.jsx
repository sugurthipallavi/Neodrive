import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Sparkles, CameraControls } from '@react-three/drei'
import PolyCar from './PolyCar'

function NeonPlatform() {
  const ring = useRef(null)
  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.35
  })
  return (
    <group position={[0, -1.02, 0]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.35, 72]} />
        <meshStandardMaterial color="#020617" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[2.55, 3.05, 96]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[2.95, 3.15, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.22} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function ShowroomScene({
  spin,
  neonColor,
  carGlb,
  carScale,
  zoomed,
  viewMode,
}) {
  const cc = useRef(null)

  useEffect(() => {
    const ctrl = cc.current
    if (!ctrl) return
    if (viewMode === 'interior') {
      ctrl.setLookAt(1.15, 0.95, 1.55, 0, 0.45, 0.2, true)
    } else if (zoomed) {
      ctrl.setLookAt(4.2, 1.85, 5.2, 0, 0.15, 0, true)
    } else {
      ctrl.setLookAt(6.5, 2.8, 8.2, 0, 0.1, 0, true)
    }
  }, [viewMode, zoomed])

  return (
    <>
      <color attach="background" args={['#030508']} />
      <fog attach="fog" args={['#030508', 12, 42]} />

      <ambientLight intensity={0.22} />
      <spotLight position={[6, 14, 8]} angle={0.4} penumbra={1} intensity={240} color="#c084fc" />
      <pointLight position={[-6, 5, -4]} intensity={90} color="#22d3ee" />

      <Environment preset="city" />

      <CameraControls ref={cc} minPolarAngle={0.55} maxPolarAngle={1.35} />

      <Sparkles count={90} scale={[10, 5, 10]} size={1.6} speed={0.25} color="#67e8f9" />

      <NeonPlatform />

      <PolyCar
        glbUrl={carGlb}
        scale={carScale * 1.13}
        neonColor={neonColor}
        spinActive={spin}
        position={[0, 0.18, 0]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.03, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#020617" roughness={1} metalness={0.05} />
      </mesh>
    </>
  )
}
