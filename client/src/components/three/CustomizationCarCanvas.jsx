import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import PolyCar from './PolyCar'
import { POLY_CARS } from '../../config/carAssets'

const CAR = POLY_CARS.z
/** Larger preview scale vs previous 1.14× */
const PREVIEW_SCALE_MULT = 1.72

/** Live GLB preview — scales with panel; materials react to studio controls via PolyCar props */
export default function CustomizationCarCanvas({
  neonColor,
  interiorLight,
  interiorIntensity = 2.2,
  bodyColor,
  windowTint,
  wheelColor,
}) {
  return (
    <Canvas shadows camera={{ position: [3.85, 1.95, 4.35], fov: 36 }} dpr={[1, 2]}>
      <color attach="background" args={['#050a14']} />
      <ambientLight intensity={0.38} />
      <spotLight position={[8, 12, 6]} angle={0.42} intensity={200} castShadow />
      <pointLight position={[0, 2.2, 2]} intensity={interiorIntensity * 28} color={interiorLight} />
      <Environment preset="studio" />
      <PolyCar
        glbUrl={CAR.glb}
        scale={CAR.scale * PREVIEW_SCALE_MULT}
        position={[CAR.position[0], CAR.position[1] + 0.28, CAR.position[2]]}
        rotation={CAR.rotation}
        neonColor={neonColor}
        bodyColor={bodyColor}
        windowTint={windowTint}
        wheelColor={wheelColor}
        autoRotate
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#020617" metalness={0.35} roughness={0.85} />
      </mesh>
      <OrbitControls enablePan={false} minDistance={3.15} maxDistance={9.5} target={[0, 0.35, 0]} />
    </Canvas>
  )
}
