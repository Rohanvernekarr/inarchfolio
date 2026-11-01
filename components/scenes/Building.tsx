"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scene, syncScene } from "@/lib/scene";

function MaterialBox({
  w,
  h,
  d,
  position,
  color,
  metalness = 0.04,
  roughness = 0.88,
  opacity = 1,
  edges = true,
}: {
  w: number;
  h: number;
  d: number;
  position: [number, number, number];
  color: string;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  edges?: boolean;
}) {
  const geometry = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);
  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  return (
    <group position={position}>
      <mesh geometry={geometry} castShadow receiveShadow userData={{ kind: "solid", baseOpacity: opacity }}>
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          transparent={opacity < 1}
          opacity={opacity}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      {edges ? (
        <lineSegments geometry={edgeGeometry} userData={{ kind: "wire" }}>
          <lineBasicMaterial color="#d6b77a" transparent opacity={0.75} depthWrite={false} />
        </lineSegments>
      ) : null}
    </group>
  );
}

function Ground() {
  return (
    <group>
      <mesh position={[0, -0.16, 0]} receiveShadow userData={{ kind: "solid", baseOpacity: 1 }}>
        <boxGeometry args={[22, 0.28, 18]} />
        <meshStandardMaterial color="#3f2e20" roughness={1} />
      </mesh>
      <gridHelper args={[18, 18, "#6b5436", "#2a2118"]} position={[0, 0.01, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 6]} userData={{ kind: "solid", baseOpacity: 1 }}>
        <planeGeometry args={[1.15, 6]} />
        <meshStandardMaterial color="#2c241c" roughness={1} />
      </mesh>
      <MaterialBox w={16} h={0.36} d={0.14} position={[0, 0.18, -7.2]} color="#2a241c" edges={false} />
      <MaterialBox w={0.14} h={0.36} d={12} position={[-8, 0.18, -1]} color="#2a241c" edges={false} />
      <MaterialBox w={0.14} h={0.36} d={12} position={[8, 0.18, -1]} color="#2a241c" edges={false} />
    </group>
  );
}

function Foundation() {
  return (
    <group>
      <MaterialBox w={7.6} h={0.22} d={6.6} position={[0, -0.02, 0.1]} color="#2a2118" edges={false} />
      <MaterialBox w={7.2} h={0.16} d={0.55} position={[0, 0.08, 2.7]} color="#5c5a57" roughness={0.95} />
      <MaterialBox w={7.2} h={0.16} d={0.55} position={[0, 0.08, -2.7]} color="#5c5a57" roughness={0.95} />
      <MaterialBox w={0.55} h={0.16} d={5.4} position={[-3.15, 0.08, 0]} color="#6a6763" roughness={0.95} />
      <MaterialBox w={0.55} h={0.16} d={5.4} position={[3.15, 0.08, 0]} color="#6a6763" roughness={0.95} />
      {[
        [-3.15, -2.4],
        [3.15, -2.4],
        [-3.15, 2.4],
        [3.15, 2.4],
      ].map(([x, z]) => (
        <MaterialBox key={`${x}${z}`} w={0.7} h={0.2} d={0.7} position={[x, 0.1, z]} color="#7a7874" roughness={0.9} edges={false} />
      ))}
    </group>
  );
}

function Columns() {
  const posts = [
    [-3.15, -2.4],
    [3.15, -2.4],
    [-3.15, 2.4],
    [3.15, 2.4],
    [-1.05, -0.85],
    [1.05, -0.85],
    [-1.05, 0.85],
    [1.05, 0.85],
  ] as const;

  return (
    <group>
      {posts.map(([x, z]) => (
        <MaterialBox key={`${x}${z}`} w={0.22} h={1.25} d={0.22} position={[x, 0.62, z]} color="#6a4630" roughness={0.7} />
      ))}
    </group>
  );
}

function WindowFront({
  position,
  w = 0.72,
  h = 0.58,
}: {
  position: [number, number, number];
  w?: number;
  h?: number;
}) {
  const [x, y, z] = position;
  return (
    <group>
      <MaterialBox w={w} h={h} d={0.16} position={[x, y, z]} color="#140f0c" roughness={1} edges={false} />
      <MaterialBox w={w + 0.16} h={0.07} d={0.2} position={[x, y + h / 2 + 0.02, z + 0.02]} color="#6a4630" edges={false} />
      <MaterialBox w={w + 0.16} h={0.07} d={0.2} position={[x, y - h / 2 - 0.02, z + 0.02]} color="#6a4630" edges={false} />
      <MaterialBox w={0.06} h={h} d={0.18} position={[x - w / 2, y, z + 0.04]} color="#6a4630" edges={false} />
      <MaterialBox w={0.06} h={h} d={0.18} position={[x + w / 2, y, z + 0.04]} color="#6a4630" edges={false} />
      <MaterialBox w={0.035} h={h - 0.06} d={0.05} position={[x, y, z + 0.08]} color="#f3e6cc" edges={false} />
      <MaterialBox w={w - 0.12} h={0.035} d={0.05} position={[x, y, z + 0.08]} color="#f3e6cc" edges={false} />
    </group>
  );
}

function Jaali({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position;
  const bars = [-0.22, -0.11, 0, 0.11, 0.22];
  return (
    <group>
      <MaterialBox w={0.18} h={0.7} d={0.62} position={[x, y, z]} color="#140f0c" roughness={1} edges={false} />
      {bars.map((offset) => (
        <MaterialBox
          key={`v${offset}`}
          w={0.045}
          h={0.62}
          d={0.035}
          position={[x + 0.08, y, z + offset]}
          color="#f0e2c4"
          edges={false}
        />
      ))}
      {bars.map((offset) => (
        <MaterialBox
          key={`h${offset}`}
          w={0.045}
          h={0.035}
          d={0.56}
          position={[x + 0.08, y + offset, z]}
          color="#f0e2c4"
          edges={false}
        />
      ))}
    </group>
  );
}

function Walls() {
  return (
    <group>
      <MaterialBox w={2.05} h={1.25} d={0.34} position={[-2.2, 0.62, 2.9]} color="#e4d2b0" />
      <MaterialBox w={2.05} h={1.25} d={0.34} position={[2.2, 0.62, 2.9]} color="#dcc6a2" />
      <MaterialBox w={1.05} h={0.95} d={0.1} position={[0, 0.55, 2.78]} color="#1a140f" roughness={1} edges={false} />
      <MaterialBox w={1.28} h={0.08} d={0.16} position={[0, 1.08, 2.92]} color="#6a4630" edges={false} />
      <MaterialBox w={0.08} h={0.95} d={0.16} position={[-0.52, 0.55, 2.92]} color="#6a4630" edges={false} />
      <MaterialBox w={0.08} h={0.95} d={0.16} position={[0.52, 0.55, 2.92]} color="#6a4630" edges={false} />
      <WindowFront position={[-2.2, 0.7, 3.02]} />
      <WindowFront position={[2.2, 0.7, 3.02]} />
      <MaterialBox w={6.5} h={1.25} d={0.34} position={[0, 0.62, -2.9]} color="#d8c4a4" />
      <WindowFront position={[-1.6, 0.72, -2.72]} />
      <WindowFront position={[1.6, 0.72, -2.72]} />
      <MaterialBox w={0.34} h={1.25} d={1.7} position={[-3.15, 0.62, 1.9]} color="#ead8b6" />
      <MaterialBox w={0.34} h={1.25} d={1.7} position={[-3.15, 0.62, -1.9]} color="#ead8b6" />
      <MaterialBox w={0.34} h={0.32} d={1.15} position={[-3.15, 1.08, 0]} color="#ead8b6" />
      <Jaali position={[-3.02, 0.62, 0]} />
      <MaterialBox w={0.34} h={1.25} d={5.4} position={[3.15, 0.62, 0]} color="#e2d0ae" />
    </group>
  );
}

function Upper() {
  return (
    <group>
      <MaterialBox w={6.3} h={0.12} d={5.5} position={[0, 0.06, 0]} color="#b89a72" />
      <MaterialBox w={1.7} h={0.1} d={0.85} position={[0, 0.16, 3.15]} color="#d6b77a" metalness={0.2} roughness={0.45} />
      <MaterialBox w={1.9} h={0.9} d={0.16} position={[0, 0.62, 3.45]} color="#f4e7cf" />
      <MaterialBox w={0.14} h={0.9} d={0.7} position={[-0.95, 0.62, 3.2]} color="#e7d3b0" />
      <MaterialBox w={0.14} h={0.9} d={0.7} position={[0.95, 0.62, 3.2]} color="#e7d3b0" />
      {[-0.55, 0, 0.55].map((x) => (
        <MaterialBox key={x} w={0.42} h={0.55} d={0.08} position={[x, 0.58, 3.52]} color="#1a140f" edges={false} />
      ))}
      {[-0.78, -0.32, 0.32, 0.78].map((x) => (
        <MaterialBox key={`rail${x}`} w={0.04} h={0.28} d={0.04} position={[x, 0.28, 3.5]} color="#6a4630" edges={false} />
      ))}
      <MaterialBox w={1.7} h={0.05} d={0.05} position={[0, 0.42, 3.5]} color="#6a4630" edges={false} />
      <MaterialBox w={2.15} h={0.08} d={0.9} position={[0, 1.12, 3.25]} color="#7d3d2e" />
      <MaterialBox w={6.2} h={0.9} d={0.28} position={[0, 0.55, -2.55]} color="#d7c4a2" />
      <WindowFront position={[-1.5, 0.55, -2.38]} />
      <WindowFront position={[1.5, 0.55, -2.38]} />
      <MaterialBox w={0.28} h={0.9} d={4.7} position={[-2.95, 0.55, 0]} color="#ead7b4" />
      <MaterialBox w={0.28} h={0.9} d={4.7} position={[2.95, 0.55, 0]} color="#e2ceb0" />
      <Jaali position={[-2.78, 0.55, 0.4]} />
    </group>
  );
}

function Roof() {
  return (
    <group>
      <MaterialBox w={7.1} h={0.1} d={6.1} position={[0, 0.05, 0]} color="#f4ead8" edges={false} />
      <MaterialBox w={7.1} h={0.08} d={0.22} position={[0, 0.12, 2.95]} color="#7d3d2e" edges={false} />
      <MaterialBox w={7.1} h={0.18} d={0.12} position={[0, 0.25, 3.02]} color="#efe4d0" edges={false} />
      <MaterialBox w={7.1} h={0.18} d={0.12} position={[0, 0.25, -3.02]} color="#efe4d0" edges={false} />
      <MaterialBox w={0.12} h={0.18} d={5.92} position={[-3.49, 0.25, 0]} color="#efe4d0" edges={false} />
      <MaterialBox w={0.12} h={0.18} d={5.92} position={[3.49, 0.25, 0]} color="#efe4d0" edges={false} />
      <MaterialBox w={1.15} h={0.4} d={1} position={[-1.3, 0.3, -0.8]} color="#c4a36a" edges={false} />
    </group>
  );
}

const REST = [0, 0, 0.02, 0.34, 0.34, 1.62, 1.72, 2.78];
const ARRIVE = [
  { x: 0, y: -2.4, z: 0 },
  { x: 0, y: -1.6, z: 0 },
  { x: 0, y: -2.2, z: 0 },
  { x: 0, y: 6.5, z: 0 },
  { x: -8, y: 1.2, z: 0 },
  { x: 8, y: 2.4, z: 0 },
  { x: 0, y: 4.5, z: -6 },
  { x: 0, y: 8, z: 0 },
];

function smooth(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

export function Building() {
  const root = useRef<THREE.Group>(null);
  const stages = useRef<(THREE.Group | null)[]>([]);
  const solids = useRef<{ material: THREE.MeshStandardMaterial; base: number; stage: number | null }[]>([]);
  const wires = useRef<{ material: THREE.LineBasicMaterial; stage: number | null }[]>([]);
  const last = useRef({ build: -1, explode: -1, solid: -1, wire: -1 });

  useEffect(() => {
    const rootGroup = root.current;
    if (!rootGroup) return;
    const nextSolids: { material: THREE.MeshStandardMaterial; base: number; stage: number | null }[] = [];
    const nextWires: { material: THREE.LineBasicMaterial; stage: number | null }[] = [];
    rootGroup.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh && object.type !== "LineSegments") return;
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (!material || Array.isArray(material)) return;
      let stage: number | null = null;
      let parent: THREE.Object3D | null = mesh.parent;
      while (parent) {
        const index = stages.current.indexOf(parent as THREE.Group);
        if (index >= 0) {
          stage = index;
          break;
        }
        parent = parent.parent;
      }
      if (mesh.userData.kind === "solid") {
        nextSolids.push({
          material: material as THREE.MeshStandardMaterial,
          base: Number(mesh.userData.baseOpacity ?? 1),
          stage,
        });
      }
      if (mesh.userData.kind === "wire") {
        nextWires.push({ material: material as THREE.LineBasicMaterial, stage });
      }
    });
    solids.current = nextSolids;
    wires.current = nextWires;
  }, []);


  useFrame(() => {
    syncScene();
    const build = scene.build;
    const explode = scene.explode;
    const solid = scene.solid;
    const wire = scene.wire;
    const prev = last.current;
    if (
      Math.abs(prev.build - build) < 0.001 &&
      Math.abs(prev.explode - explode) < 0.001 &&
      Math.abs(prev.solid - solid) < 0.001 &&
      Math.abs(prev.wire - wire) < 0.001
    ) {
      return;
    }
    prev.build = build;
    prev.explode = explode;
    prev.solid = solid;
    prev.wire = wire;

    const gap = explode * 1.05;
    const slice = 1 / REST.length;
    const locals = stages.current.map((_, index) => smooth((build - index * slice) / slice));

    stages.current.forEach((stage, index) => {
      if (!stage) return;
      const local = locals[index];
      const from = ARRIVE[index];
      stage.visible = local > 0.015;
      stage.position.x = THREE.MathUtils.lerp(from.x, 0, local);
      stage.position.z = THREE.MathUtils.lerp(from.z, 0, local);
      stage.position.y = THREE.MathUtils.lerp(REST[index] + from.y, REST[index] + gap * index, local);
    });

    for (const item of solids.current) {
      const amount = item.stage === null ? solid : locals[item.stage];
      const opacity = amount * item.base;
      item.material.opacity = opacity;
      item.material.transparent = opacity < 0.99;
    }
    for (const item of wires.current) {
      const amount = item.stage === null ? solid : locals[item.stage];
      item.material.opacity = item.stage === null ? wire * amount : amount * wire;
    }
  });

  return (
    <group ref={root}>
      <group
        ref={(node) => {
          stages.current[0] = node;
        }}
      >
        <Ground />
      </group>
      <group
        ref={(node) => {
          stages.current[1] = node;
        }}
      >
        <Foundation />
      </group>
      <group
        ref={(node) => {
          stages.current[2] = node;
        }}
      >
        <MaterialBox w={8.4} h={0.16} d={7.2} position={[0, 0.16, 0.2]} color="#6e5438" />
        <MaterialBox w={7.2} h={0.18} d={6} position={[0, 0.3, 0]} color="#c4a36a" />
        <MaterialBox w={3.4} h={0.08} d={1.5} position={[0, 0.4, 3.7]} color="#b8956a" />
        <MaterialBox w={1.6} h={0.08} d={0.7} position={[0, 0.46, 4.15]} color="#d8c4a0" />
      </group>
      <group
        ref={(node) => {
          stages.current[3] = node;
        }}
      >
        <Columns />
      </group>
      <group
        ref={(node) => {
          stages.current[4] = node;
        }}
      >
        <Walls />
      </group>
      <group
        ref={(node) => {
          stages.current[5] = node;
        }}
      >
        <MaterialBox w={7.4} h={0.1} d={6.4} position={[0, 0.06, 0.15]} color="#8d7352" />
        <MaterialBox w={3.6} h={0.08} d={1.15} position={[0, 0.12, 3.35]} color="#a68458" />
      </group>
      <group
        ref={(node) => {
          stages.current[6] = node;
        }}
      >
        <Upper />
      </group>
      <group
        ref={(node) => {
          stages.current[7] = node;
        }}
      >
        <Roof />
      </group>
    </group>
  );
}
