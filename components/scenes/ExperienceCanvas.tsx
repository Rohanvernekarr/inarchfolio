"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scene, subscribeSceneVisible, syncScene } from "@/lib/scene";
import { Building } from "@/components/scenes/Building";

function CameraRig() {
  const { camera, size } = useThree();
  const mobile = size.width < 768;
  const look = useRef(new THREE.Vector3(0, 1.6, 0));
  const target = useRef(new THREE.Vector3(-14, 7.2, 11));


  useFrame(() => {
    syncScene();

    let radius = 18;
    let angle = -0.9;
    let height = 7.2;
    let lookY = 1.6;

    if (scene.reduced) {
      radius = 16;
      angle = -0.7;
      height = 6.4;
      lookY = 1.5;
    } else if (scene.mode === "intro") {
      const t = Math.max(scene.t, scene.reveal * 0.35);
      radius = THREE.MathUtils.lerp(18, 14.5, t);
      angle = THREE.MathUtils.lerp(-0.95, -0.55, t);
      height = THREE.MathUtils.lerp(7.2, 5.8, t);
      lookY = THREE.MathUtils.lerp(1.4, 1.55, t);
    } else if (scene.mode === "assembly") {
      radius = THREE.MathUtils.lerp(14.5, 20, scene.t);
      angle = THREE.MathUtils.lerp(-0.55, 0.7, scene.t);
      height = THREE.MathUtils.lerp(5.8, 11, scene.t);
      lookY = THREE.MathUtils.lerp(1.55, 3.4, scene.t);
    } else if (scene.mode === "close") {
      radius = THREE.MathUtils.lerp(16, 22, scene.t);
      angle = 0.4;
      height = THREE.MathUtils.lerp(6.5, 9, scene.t);
      lookY = 1.8;
    }

    if (mobile) radius *= 1.18;
    target.current.set(Math.sin(angle) * radius, height, Math.cos(angle) * radius);
    look.current.set(0, lookY, 0);
    camera.position.lerp(target.current, 0.22);
    camera.lookAt(look.current);
  });

  return null;
}

function Lights() {
  return (
    <>

      <fog attach="fog" args={["#0a0a0a", 22, 48]} />
      <ambientLight intensity={0.18} />
      <hemisphereLight args={["#d9d0c2", "#0a0a0a", 0.45]} />
      <directionalLight
        position={[9, 14, 7]}
        intensity={2.6}
        color="#f0e2c8"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <directionalLight position={[-8, 5, -6]} intensity={0.55} color="#8aa0ad" />
    </>
  );
}

function readQuality() {
  if (typeof window === "undefined") return { dpr: 1, shadows: false, mobile: false };
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  return {
    dpr: mobile ? Math.min(window.devicePixelRatio, 1.35) : Math.min(window.devicePixelRatio, 1.25),
    shadows: !mobile,
    mobile,
  };
}

export default function ExperienceCanvas() {
  const [live, setLive] = useState(true);
  const [quality] = useState(readQuality);

  useEffect(() => subscribeSceneVisible(setLive), []);

  return (
    <Canvas
      frameloop={live ? "always" : "never"}
      dpr={quality.dpr}
      shadows={quality.shadows ? "percentage" : false}
      camera={{ position: [-14.6, 7.2, 10.5], fov: quality.mobile ? 48 : 30, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0a0a0a", 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
      }}
    >
      <Lights />
      <CameraRig />
      <Building />
    </Canvas>
  );
}
