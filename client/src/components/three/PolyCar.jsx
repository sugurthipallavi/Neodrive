import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import { POLY_CAR_URLS } from '../../config/carAssets'


/** Warm CDN cache for project cars */
POLY_CAR_URLS.forEach((url) => useGLTF.preload(url))

/**
 * GLB car with neon underglow ring.
 * Placement is controlled by props: position + rotation.
 */
const isWheelMesh = (name) => {
  const n = (name || '').toLowerCase()
  return /wheel|rim|tire|tyre|brake|hub|felge|disc|caliper/.test(n)
}

const isGlassMesh = (name, mat) => {
  const n = (name || '').toLowerCase()
  if (/glass|window|windscreen|windshield|canopy|lens/.test(n)) return true
  if (!mat) return false
  const transmission = mat.transmission ?? 0
  if (transmission > 0.04) return true
  if (mat.transparent && mat.opacity < 0.998) return true
  return false
}

const isLikelyBodyPaint = (mat) => {
  if (!mat || (!mat.isMeshStandardMaterial && !mat.isMeshPhysicalMaterial)) return false
  const r = mat.roughness ?? 0.5
  const m = mat.metalness ?? 0
  return m < 0.82 && r > 0.12 && r < 0.92
}

export default function PolyCar({
  glbUrl,
  scale,
  position = [0, -0.92, 0],
  rotation = [0, Math.PI / 2, 0],
  neonColor = '#22d3ee',
  spinActive = false,
  autoRotate = false,
  bodyColor,
  windowTint,
  wheelColor,
}) {

  const { scene } = useGLTF(glbUrl)
  const root = useRef(null)
  const spinAcc = useRef(0)
  const rotationRef = useRef(rotation)
  rotationRef.current = rotation

  const model = useMemo(() => {
    const g = SkeletonUtils.clone(scene)
    g.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    return g
  }, [scene])

  useLayoutEffect(() => {
    return () => {
      model.traverse((o) => {
        if (!o.isMesh) return
        o.geometry?.dispose()
        const mats = o.material
        if (Array.isArray(mats)) mats.forEach((m) => m.dispose?.())
        else mats?.dispose?.()
      })
    }
  }, [model])

  useLayoutEffect(() => {
    const hasTheme = bodyColor != null || windowTint != null || wheelColor != null
    if (!hasTheme) return

    model.traverse((o) => {
      if (!o.isMesh || !o.material) return
      if (!o.userData._neoMatCloned) {
        o.material = Array.isArray(o.material)
          ? o.material.map((m) => (m?.clone ? m.clone() : m))
          : o.material?.clone?.() ?? o.material
        o.userData._neoMatCloned = true
      }
      const mats = Array.isArray(o.material) ? o.material : [o.material]
      mats.forEach((mat) => {
        if (!mat || (!mat.isMeshStandardMaterial && !mat.isMeshPhysicalMaterial)) return
        const meshName = o.name || ''
        if (wheelColor && isWheelMesh(meshName) && mat.color) {
          mat.color.set(wheelColor)
          mat.needsUpdate = true
          return
        }
        if (windowTint != null && isGlassMesh(meshName, mat)) {
          const t = THREE.MathUtils.clamp((windowTint - 0.15) / 0.7, 0, 1)
          if (mat.color) mat.color.setRGB(0.04 + (1 - t) * 0.2, 0.06 + (1 - t) * 0.22, 0.1 + (1 - t) * 0.28)
          if ('transmission' in mat) mat.transmission = Math.max(0.02, 0.92 - t * 0.75)
          mat.roughness = THREE.MathUtils.clamp(0.02 + t * 0.55, 0, 1)
          mat.opacity = mat.transparent ? Math.max(0.25, 0.92 - t * 0.45) : mat.opacity
          mat.needsUpdate = true
          return
        }
        if (bodyColor && isLikelyBodyPaint(mat) && !isWheelMesh(meshName) && !isGlassMesh(meshName, mat)) {
          mat.color.set(bodyColor)
          mat.needsUpdate = true
        }
      })
    })
  }, [model, bodyColor, windowTint, wheelColor])

  useFrame((_, delta) => {
    const g = root.current
    if (!g) return

    if (spinActive) spinAcc.current += delta * 0.95
    if (autoRotate) spinAcc.current += delta * 0.16

    const r = rotationRef.current
    g.rotation.set(r[0], r[1] + spinAcc.current, r[2])
  })

  const neon = useMemo(() => new THREE.Color(neonColor), [neonColor])

  return (
    <group ref={root} position={position}>
      <Center position={[0, 0.06, 0]}>
        <group scale={scale}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
            <ringGeometry args={[1.25, 2.45, 64]} />
            <meshBasicMaterial color={neon} transparent opacity={0.4} toneMapped={false} />
          </mesh>
          <primitive object={model} />
        </group>
      </Center>
    </group>
  )
}

