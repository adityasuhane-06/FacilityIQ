import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Float, Sphere, MeshTransmissionMaterial, Stars } from '@react-three/drei'

const ElegantGlassShape = () => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
        <MeshTransmissionMaterial 
          backside 
          samples={4} 
          thickness={3} 
          chromaticAberration={0.025} 
          anisotropy={0.1} 
          distortion={0.1} 
          distortionScale={0.1} 
          temporalDistortion={0.2} 
          clearcoat={1} 
          attenuationDistance={0.5} 
          attenuationColor="#ffffff" 
          color="#3b82f6" 
        />
      </Sphere>
    </Float>
  )
}

const BackgroundOrbs = () => {
    return (
        <>
            <mesh position={[-4, 2, -5]}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
            </mesh>
            <mesh position={[4, -2, -6]}>
                <sphereGeometry args={[3, 32, 32]} />
                <meshBasicMaterial color="#8b5cf6" transparent opacity={0.1} />
            </mesh>
        </>
    )
}

const ThreeBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none" style={{ background: 'linear-gradient(to bottom right, #0f172a, #020617)' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#e0e7ff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#3b82f6" />
        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0.5} fade speed={1} />
        <Sparkles count={150} scale={12} size={2} speed={0.4} opacity={0.3} color="#8b5cf6" />
        <BackgroundOrbs />
        <ElegantGlassShape />
      </Canvas>
    </div>
  )
}

export default ThreeBackground
