import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import PolyCar from './PolyCar'

export default function ShowroomThumb({ glbUrl, scale, neonColor }) {
  return (
    <Canvas shadows camera={{ position: [2.8, 1.4, 4.2], fov: 42 }} dpr={[1, 2]}>
      <color attach="background" args={['#040714']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[3.5, 3.8, 2.5]} angle={0.45} intensity={160} castShadow />
      <pointLight position={[0, 1.2, 0]} intensity={25} color={neonColor} />

      <Suspense fallback={null}>
        <Environment preset="city" />
        <PolyCar
          glbUrl={glbUrl}
          scale={scale}
          neonColor={neonColor}
          spinActive={true}
          autoRotate={false}
        />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#020617" roughness={1} metalness={0.05} />
      </mesh>
    </Canvas>
  )
}

