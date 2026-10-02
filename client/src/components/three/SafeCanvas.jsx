import { Canvas } from '@react-three/fiber'

/**
 * Prevents full black-screen if WebGL/GLB loading fails.
 * Shows a minimal fallback background + grid even if Suspense never resolves.
 */
export default function SafeCanvas({ children, className, ...props }) {
  return (
    <div className={className}>
      <Canvas
        {...props}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x030508, 1)
        }}
      >
        {/* Always-present fallback visuals */}
        <color attach="background" args={['#030508']} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.04, 0]} receiveShadow>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial color="#020617" metalness={0.2} roughness={0.85} />
        </mesh>
        {children}
      </Canvas>
    </div>
  )
}

