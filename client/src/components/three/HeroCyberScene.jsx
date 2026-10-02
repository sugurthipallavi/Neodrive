import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid, Sparkles, Float, OrbitControls } from '@react-three/drei'
import PolyCar from './PolyCar'
import NeonCyberEnvironment from './NeonCyberEnvironment'
import { POLY_CARS } from '../../config/carAssets'

/** Orbiting “drone” meshes — cheap cyber city ambience */
function Drone({ radius, height, speed, phase, color }) {
  const ref = useRef(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase
    if (!ref.current) return
    ref.current.position.set(Math.cos(t) * radius, height, Math.sin(t) * radius)
    ref.current.rotation.y = -t
  })
  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.08, 0.55]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive={color}
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.25}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function HeroCyberScene({ neonColor, heroAsset }) {
  const car = heroAsset ?? POLY_CARS.x
  return (
    <>
      <color attach="background" args={['#050a14']} />
      <fog attach="fog" args={['#030508', 14, 52]} />

      <ambientLight intensity={0.25} />
      <hemisphereLight intensity={0.35} groundColor="#1e1b4b" color="#38bdf8" />
      <spotLight
        position={[12, 18, 10]}
        angle={0.35}
        penumbra={0.9}
        intensity={220}
        color="#a855f7"
        castShadow
      />
      <pointLight position={[-10, 6, -8]} intensity={120} color="#00d4ff" />

      <NeonCyberEnvironment neonColor={neonColor} />


      <Grid
        position={[0, -1.05, 0]}
        infiniteGrid
        fadeDistance={48}
        fadeStrength={1}
        sectionSize={3.2}
        sectionThickness={1}
        sectionColor="#22d3ee"
        cellSize={0.65}
        cellThickness={0.6}
        cellColor="#1e293b"
      />

      <Sparkles
        count={160}
        scale={[14, 8, 14]}
        size={2}
        speed={0.35}
        color="#67e8f9"
        opacity={0.55}
      />

      <Drone radius={9} height={3.2} speed={0.35} phase={0} color="#38bdf8" />
      <Drone radius={11} height={4.4} speed={-0.28} phase={2} color="#c084fc" />

      {/* Lift + float so the full car stays in frame above the floor/grid */}
      <group position={[0, 0.16, 0]}>
        <Float
          speed={1.25}
          rotationIntensity={0}
          floatIntensity={0.78}
          floatingRange={[0.1, 0.32]}
        >
          <PolyCar
            glbUrl={car.glb}
            scale={car.scale}
            position={car.position ?? POLY_CARS.x.position}
            rotation={car.rotation ?? POLY_CARS.x.rotation}
            neonColor={neonColor}
          />
        </Float>
      </group>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.065}
        minDistance={5.6}
        maxDistance={16}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2 + 0.28}
        target={[0, 0.14, 0]}
      />

      {/* Soft ground bounce light */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.04, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color="#020617"
          metalness={0.2}
          roughness={0.85}
          envMapIntensity={0.2}
        />
      </mesh>
    </>
  )
}
