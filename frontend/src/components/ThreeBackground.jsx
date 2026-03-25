import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Stars } from '@react-three/drei'

const AnimatedSphere = () => {
  const sphereRef = useRef()

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.2
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <Sphere ref={sphereRef} visible args={[1, 100, 200]} scale={2.5} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#8352FD"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
      />
    </Sphere>
  )
}

const ThreeBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-slate-900 overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <AnimatedSphere />
      </Canvas>
    </div>
  )
}

export default ThreeBackground
