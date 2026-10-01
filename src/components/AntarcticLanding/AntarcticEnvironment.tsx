/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DhruvaTwin Antarctic 3D Cinematic Environment
 * Full-screen Three.js canvas featuring Aurora Australis, snow mountains,
 * interactive 3D Emperor Penguins, Maitri Research Station, 3-layer snowfall,
 * and mouse-driven parallax depth.
 * 
 * National Centre for Polar and Ocean Research (NCPOR) / MoES
 * Smart India Hackathon 2026 - PS 26060 - Team HackFinity007
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PENGUIN_FOCUS_TARGETS } from './penguinData';

interface AntarcticEnvironmentProps {
  onPenguinHover?: (isHovered: boolean, penguinName?: string) => void;
  onPenguinClick?: (penguinIndex?: number, penguinName?: string) => void;
  onStationClick?: () => void;
  activeFocus?: 'overview' | 'station' | 'wildlife' | 'ice' | 'climate' | 'research';
  focusedPenguinIndex?: number;
}

export const AntarcticEnvironment: React.FC<AntarcticEnvironmentProps> = ({
  onPenguinHover,
  onPenguinClick,
  onStationClick,
  activeFocus = 'overview',
  focusedPenguinIndex = -1,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseVecRef = useRef(new THREE.Vector2(-999, -999));
  const isHoveringPenguinRef = useRef(false);

  // References for camera targeting and focus transition
  const cameraFocusTarget = useRef<{ pos: THREE.Vector3; look: THREE.Vector3 }>({
    pos: new THREE.Vector3(0, 3.8, 22),
    look: new THREE.Vector3(0, 2.2, 0),
  });

  useEffect(() => {
    if (focusedPenguinIndex !== undefined && focusedPenguinIndex >= 0) {
      const target = PENGUIN_FOCUS_TARGETS[focusedPenguinIndex % PENGUIN_FOCUS_TARGETS.length];
      if (target) {
        cameraFocusTarget.current.pos.set(target.cameraPos.x, target.cameraPos.y, target.cameraPos.z);
        cameraFocusTarget.current.look.set(target.cameraLook.x, target.cameraLook.y, target.cameraLook.z);
        return;
      }
    }

    if (activeFocus === 'wildlife') {
      cameraFocusTarget.current.pos.set(2.4, 2.2, 16);
      cameraFocusTarget.current.look.set(2.2, 1.2, 10);
    } else if (activeFocus === 'station') {
      cameraFocusTarget.current.pos.set(14, 5.5, 8);
      cameraFocusTarget.current.look.set(16, 2.5, -12);
    } else if (activeFocus === 'ice') {
      cameraFocusTarget.current.pos.set(-8, 3.5, 18);
      cameraFocusTarget.current.look.set(-6, 0.5, 2);
    } else {
      cameraFocusTarget.current.pos.set(0, 3.8, 22);
      cameraFocusTarget.current.look.set(0, 2.2, 0);
    }
  }, [activeFocus, focusedPenguinIndex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // ── 1. Three.js Scene & Fog ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // Deep Polar Navy
    scene.fog = new THREE.FogExp2(0x060E1C, 0.012);

    // ── 2. Perspective Camera ──
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.8, 22);
    const currentLookAt = new THREE.Vector3(0, 2.2, 0);
    camera.lookAt(currentLookAt);

    // ── 3. WebGL Renderer ──
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── 4. Lighting Rig ──
    // Polar Hemisphere light (Cold sky blue down to midnight icy ground)
    const hemiLight = new THREE.HemisphereLight(0x4A9EFF, 0x060B14, 0.65);
    scene.add(hemiLight);

    // Directional Polar Moon / Aurora light
    const dirLight = new THREE.DirectionalLight(0xCBE4FF, 1.4);
    dirLight.position.set(-18, 28, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Subtle Cyan Fill Light (Digital Twin Signal & Ice Sub-surface scatter)
    const cyanFill = new THREE.DirectionalLight(0x00E0C6, 0.55);
    cyanFill.position.set(22, 12, 15);
    scene.add(cyanFill);

    // ── 5. Starfield Cosmos ──
    const createStarTexture = () => {
      const c = document.createElement('canvas');
      c.width = 16;
      c.height = 16;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.4, 'rgba(200,230,255,0.7)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(c);
    };
    const starTex = createStarTexture();

    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 600;
      starPos[i + 1] = Math.random() * 200 + 15;
      starPos[i + 2] = (Math.random() - 0.5) * 600 - 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      map: starTex,
      size: 2.2,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ── 6. Aurora Australis Dynamic Ribbon ──
    const auroraPoints = [
      new THREE.Vector3(-140, 48, -120),
      new THREE.Vector3(-70, 68, -80),
      new THREE.Vector3(0, 56, -95),
      new THREE.Vector3(80, 64, -75),
      new THREE.Vector3(150, 46, -110),
    ];
    const auroraCurve = new THREE.CatmullRomCurve3(auroraPoints);
    const auroraGeo = new THREE.TubeGeometry(auroraCurve, 40, 10, 8, false);
    const auroraMat = new THREE.MeshBasicMaterial({
      color: 0x00FFB2,
      transparent: true,
      opacity: 0.38,
      wireframe: true,
    });
    const auroraMesh = new THREE.Mesh(auroraGeo, auroraMat);
    scene.add(auroraMesh);

    // Secondary subtle cyan aurora ribbon
    const auroraPoints2 = [
      new THREE.Vector3(-120, 54, -100),
      new THREE.Vector3(-40, 60, -70),
      new THREE.Vector3(30, 68, -85),
      new THREE.Vector3(120, 52, -95),
    ];
    const auroraCurve2 = new THREE.CatmullRomCurve3(auroraPoints2);
    const auroraGeo2 = new THREE.TubeGeometry(auroraCurve2, 32, 6, 6, false);
    const auroraMat2 = new THREE.MeshBasicMaterial({
      color: 0x00E0C6,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
    });
    const auroraMesh2 = new THREE.Mesh(auroraGeo2, auroraMat2);
    scene.add(auroraMesh2);

    // ── 7. Distant Antarctic Mountains (Nunatak Ridges) ──
    const mountainGroup = new THREE.Group();
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x162235,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true,
    });
    const snowCapMat = new THREE.MeshStandardMaterial({
      color: 0xE8F2FC,
      roughness: 0.6,
      metalness: 0.05,
      flatShading: true,
    });

    const peaks = [
      { x: -90, z: -110, scaleY: 34, scaleX: 38 },
      { x: -50, z: -95, scaleY: 42, scaleX: 42 },
      { x: -15, z: -125, scaleY: 48, scaleX: 48 },
      { x: 25, z: -105, scaleY: 38, scaleX: 36 },
      { x: 75, z: -115, scaleY: 44, scaleX: 42 },
      { x: 120, z: -130, scaleY: 36, scaleX: 45 },
    ];

    peaks.forEach((peak) => {
      // Main mountain cone
      const mCone = new THREE.Mesh(
        new THREE.ConeGeometry(peak.scaleX, peak.scaleY, 6),
        mountainMat
      );
      mCone.position.set(peak.x, peak.scaleY / 2 - 4, peak.z);
      mCone.rotation.y = Math.sin(peak.x) * 2;
      mountainGroup.add(mCone);

      // White snow-capped apex
      const sCap = new THREE.Mesh(
        new THREE.ConeGeometry(peak.scaleX * 0.45, peak.scaleY * 0.45, 6),
        snowCapMat
      );
      sCap.position.set(peak.x, peak.scaleY * 0.78 - 4, peak.z);
      sCap.rotation.y = mCone.rotation.y;
      mountainGroup.add(sCap);
    });
    scene.add(mountainGroup);

    // ── 8. Glacial Terrain & Ice Plain ──
    const terrainGeo = new THREE.PlaneGeometry(350, 350, 60, 60);
    terrainGeo.rotateX(-Math.PI / 2);
    // Procedural gentle snow undulation
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const distFromCenter = Math.sqrt(x * x + z * z);
      // Gentle snow dunes
      let y = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 1.4;
      y += Math.sin(x * 0.02 + z * 0.02) * 1.8;
      // Keep foreground flatter for penguins
      if (distFromCenter < 30) {
        y *= 0.3;
      }
      posAttr.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xDDEAF8,
      roughness: 0.75,
      metalness: 0.12,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = -0.6;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Crevasse / Iceberg Fissure glowing blue line
    const fissureCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-45, -0.4, 8),
      new THREE.Vector3(-25, -0.45, -12),
      new THREE.Vector3(-10, -0.4, -30),
      new THREE.Vector3(5, -0.45, -60),
    ]);
    const fissureGeo = new THREE.TubeGeometry(fissureCurve, 32, 0.4, 6, false);
    const fissureMat = new THREE.MeshBasicMaterial({
      color: 0x00E0C6,
      transparent: true,
      opacity: 0.6,
    });
    const fissure = new THREE.Mesh(fissureGeo, fissureMat);
    scene.add(fissure);

    // ── 9. Antarctic Research Station (Maitri Base) ──
    const stationGroup = new THREE.Group();
    stationGroup.position.set(16, 0.4, -14);

    // Heavy Elevated Steel Stilt Pylons
    const stiltMat = new THREE.MeshStandardMaterial({ color: 0x1A2533, metalness: 0.8, roughness: 0.3 });
    const stiltPositions = [
      [-6, -4], [6, -4], [-6, 4], [6, 4],
      [0, -4], [0, 4]
    ];
    stiltPositions.forEach(([sx, sz]) => {
      const stilt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.6, 8), stiltMat);
      stilt.position.set(sx, 0.5, sz);
      stationGroup.add(stilt);
    });

    // Main Station Aerodynamic Habitat Hull
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x1E2B3C,
      roughness: 0.35,
      metalness: 0.6,
    });
    const hull = new THREE.Mesh(new THREE.BoxGeometry(14, 3.2, 9), hullMat);
    hull.position.set(0, 2.5, 0);
    hull.castShadow = true;
    hull.receiveShadow = true;
    stationGroup.add(hull);

    // Orange Safety Identity Trim (NCPOR / Indian Antarctic Program branding)
    const orangeTrimMat = new THREE.MeshStandardMaterial({ color: 0xFF6B2B, roughness: 0.4 });
    const trim = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.3, 9.2), orangeTrimMat);
    trim.position.set(0, 3.7, 0);
    stationGroup.add(trim);

    // Warm Glowing Observation Windows (Golden Amber interior glow)
    const windowMat = new THREE.MeshBasicMaterial({ color: 0xFFB366 });
    for (let w = -5; w <= 5; w += 2) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.1), windowMat);
      win.position.set(w, 2.5, 4.52);
      stationGroup.add(win);
    }
    // Interior warm point light casting through windows onto snow
    const stationWarmLight = new THREE.PointLight(0xFFB066, 2.5, 25);
    stationWarmLight.position.set(0, 2.5, 5);
    stationGroup.add(stationWarmLight);

    // Radome Comms Satellite Dish & Tower
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.7 });
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 5, 8), towerMat);
    tower.position.set(-4.5, 5.5, -2);
    stationGroup.add(tower);

    const radomeMat = new THREE.MeshStandardMaterial({ color: 0xE8F0F8, roughness: 0.2 });
    const radome = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), radomeMat);
    radome.position.set(-4.5, 8.2, -2);
    stationGroup.add(radome);

    // Spinning Radar Antenna Dish
    const dishMat = new THREE.MeshStandardMaterial({ color: 0x00E0C6, metalness: 0.8, roughness: 0.2 });
    const radarDish = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.1, 0.2, 12), dishMat);
    radarDish.rotation.x = Math.PI / 4;
    radarDish.position.set(4, 5.2, 0);
    stationGroup.add(radarDish);

    // Red Pulsing Aviation Obstruction Beacon
    const beaconLight = new THREE.PointLight(0xFF2233, 1.8, 15);
    beaconLight.position.set(-4.5, 9.6, -2);
    stationGroup.add(beaconLight);

    // Interactive Station Click/Hover Target Box
    const stationHitBox = new THREE.Mesh(
      new THREE.BoxGeometry(16, 8, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    stationHitBox.position.set(0, 3, 0);
    stationHitBox.userData = { type: 'STATION' };
    stationGroup.add(stationHitBox);

    scene.add(stationGroup);

    // ── 10. Interactive 3D Emperor Penguins ──
    const penguinsGroup = new THREE.Group();

    // ── Penguin Materials ──
    const coatMat = new THREE.MeshStandardMaterial({
      color: 0x0A121E,
      roughness: 0.35,
      metalness: 0.15,
    });
    const bellyMat = new THREE.MeshStandardMaterial({
      color: 0xFAFDFF,
      roughness: 0.45,
      metalness: 0.05,
    });
    const emperorCollarMat = new THREE.MeshStandardMaterial({
      color: 0xFFB300,
      roughness: 0.3,
    });
    const beakMat = new THREE.MeshStandardMaterial({
      color: 0xFF6F00,
      roughness: 0.35,
    });
    const feetMat = new THREE.MeshStandardMaterial({
      color: 0x221B14,
      roughness: 0.8,
    });

    // ── FOREGROUND HERO PENGUIN (Large, Detailed, Interactive) ──
    const heroPenguin = new THREE.Group();
    heroPenguin.position.set(2.4, -0.15, 10.5);
    heroPenguin.scale.set(1.5, 1.5, 1.5);

    // Torso / Body (Aerodynamic capsule)
    const heroBody = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.48, 1.45, 16), coatMat);
    heroBody.position.y = 0.85;
    heroBody.castShadow = true;
    heroPenguin.add(heroBody);

    // Snowy White Belly
    const heroBelly = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.46, 1.38, 16, 1, false, -Math.PI / 2, Math.PI),
      bellyMat
    );
    heroBelly.position.set(0, 0.85, 0.05);
    heroPenguin.add(heroBelly);

    // Emperor Golden Throat & Collar Collar
    const heroCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.39, 0.35, 16, 1, false, -Math.PI / 2, Math.PI),
      emperorCollarMat
    );
    heroCollar.position.set(0, 1.32, 0.06);
    heroPenguin.add(heroCollar);

    // Head Group (for head tracking rotation)
    const heroHeadGroup = new THREE.Group();
    heroHeadGroup.position.set(0, 1.68, 0);

    const heroHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), coatMat);
    heroHead.castShadow = true;
    heroHeadGroup.add(heroHead);

    // Head auroral patches (ear coverts)
    const earPatchL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), emperorCollarMat);
    earPatchL.position.set(-0.25, 0.05, 0.08);
    earPatchL.scale.set(0.5, 1.2, 0.8);
    heroHeadGroup.add(earPatchL);

    const earPatchR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), emperorCollarMat);
    earPatchR.position.set(0.25, 0.05, 0.08);
    earPatchR.scale.set(0.5, 1.2, 0.8);
    heroHeadGroup.add(earPatchR);

    // Slender curved Emperor Beak
    const heroBeak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.42, 8), beakMat);
    heroBeak.rotation.x = Math.PI / 2;
    heroBeak.position.set(0, 0.02, 0.38);
    heroHeadGroup.add(heroBeak);

    // Hero Eyes (with blinking support)
    const heroEyeMat = new THREE.MeshBasicMaterial({ color: 0x05070A });
    const heroEyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const heroEyeL = new THREE.Mesh(heroEyeGeo, heroEyeMat);
    heroEyeL.position.set(-0.18, 0.08, 0.22);
    heroHeadGroup.add(heroEyeL);

    const heroEyeR = new THREE.Mesh(heroEyeGeo, heroEyeMat);
    heroEyeR.position.set(0.18, 0.08, 0.22);
    heroHeadGroup.add(heroEyeR);

    heroPenguin.add(heroHeadGroup);

    // Wings (Flippers)
    const heroWingL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.8, 0.24), coatMat);
    heroWingL.position.set(-0.46, 0.85, 0);
    heroWingL.rotation.z = 0.22;
    heroPenguin.add(heroWingL);

    const heroWingR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.8, 0.24), coatMat);
    heroWingR.position.set(0.46, 0.85, 0);
    heroWingR.rotation.z = -0.22;
    heroPenguin.add(heroWingR);

    // Feet
    const heroFootL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.38), feetMat);
    heroFootL.position.set(-0.2, 0.06, 0.16);
    heroPenguin.add(heroFootL);

    const heroFootR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.38), feetMat);
    heroFootR.position.set(0.2, 0.06, 0.16);
    heroPenguin.add(heroFootR);

    // Ground Shadow Plate
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x030812,
      transparent: true,
      opacity: 0.45,
    });
    const heroShadow = new THREE.Mesh(new THREE.CircleGeometry(0.7, 16), shadowMat);
    heroShadow.rotation.x = -Math.PI / 2;
    heroShadow.position.y = 0.02;
    heroPenguin.add(heroShadow);

    // Interactive Hit Sphere for Foreground Hero Penguin
    const heroHitBox = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 12, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    heroHitBox.position.set(0, 0.9, 0);
    heroHitBox.userData = {
      type: 'PENGUIN',
      id: 'hero',
      name: 'Emperor Mascot',
      role: 'Station Wildlife Guardian',
      index: 0,
    };
    heroPenguin.add(heroHitBox);
    penguinsGroup.add(heroPenguin);

    // Hitboxes collection for clicking/hovering any penguin
    const allPenguinHitBoxes: THREE.Mesh[] = [heroHitBox];

    // ── 11. Antarctic Emperor Penguin Colony Architecture (Active Colony Members) ──
    interface ColonyPenguin {
      id?: string;
      name?: string;
      role?: string;
      group: THREE.Group;
      headGroup: THREE.Group;
      wingL?: THREE.Mesh;
      wingR?: THREE.Mesh;
      footL?: THREE.Mesh;
      footR?: THREE.Mesh;
      eyeL?: THREE.Mesh;
      eyeR?: THREE.Mesh;
      behavior: 'walk' | 'idle' | 'huddle' | 'lookout' | 'peck' | 'duo' | 'slide' | 'visitor';

      // Safe walking trajectory parameters (inside open landscape corridor X in [0.2, 7.5])
      pathMinX: number;
      pathMaxX: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      baseRotY: number;
      initialDirection: 1 | -1; // 1 = left to right, -1 = right to left
      walkSpeed: number;
      walkDuration: number;
      turnDuration: number;
      cycleDuration: number;

      // Natural waddling parameters
      waddleFreq: number;
      waddleRoll: number;
      waddleBob: number;

      // Dynamics & Timings
      animSpeed: number;
      phaseOffset: number;
      blinkInterval: number;
      trackMouse?: boolean;
    }

    const colonyPenguins: ColonyPenguin[] = [];

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x05070A });
    const eyeGeo = new THREE.SphereGeometry(0.045, 6, 6);

    // Multi-destination route for Social Visitor Penguin (visiting one to another penguin continuously)
    const VISITOR_WAYPOINTS = [
      { x: 1.8, z: 9.8, pauseDur: 0.65, targetName: 'Hero Mascot', faceRotY: 0.6 },
      { x: 1.6, z: 5.8, pauseDur: 0.65, targetName: 'Social Duo', faceRotY: -0.6 },
      { x: 3.4, z: 4.6, pauseDur: 0.65, targetName: 'Colony Huddle', faceRotY: 1.0 },
      { x: 2.2, z: 7.2, pauseDur: 0.65, targetName: 'Central Ridge', faceRotY: 0.0 },
    ];

    const buildPenguin = (config: {
      id?: string;
      name?: string;
      role?: string;
      x: number;
      y: number;
      z: number;
      scale: number;
      rotY?: number;
      detail: 'high' | 'med' | 'low';
      behavior: 'walk' | 'idle' | 'huddle' | 'lookout' | 'peck' | 'duo' | 'slide' | 'visitor';
      pathMinX?: number;
      pathMaxX?: number;
      initialDirection?: 1 | -1;
      walkSpeed?: number;
      pauseDuration?: number;
      turnDuration?: number;
      waddleFreq?: number;
      waddleRoll?: number;
      waddleBob?: number;
      animSpeed?: number;
      phaseOffset?: number;
      blinkInterval?: number;
      trackMouse?: boolean;
    }) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(config.x, config.y, config.z);
      pGroup.scale.set(config.scale, config.scale, config.scale);
      if (config.rotY !== undefined) {
        pGroup.rotation.y = config.rotY;
      }

      // Torso / Body
      const bodyGeo =
        config.detail === 'low'
          ? new THREE.CylinderGeometry(0.24, 0.34, 1.0, 8)
          : new THREE.CylinderGeometry(0.36, 0.48, 1.45, config.detail === 'high' ? 16 : 10);
      const body = new THREE.Mesh(bodyGeo, coatMat);
      body.position.y = config.detail === 'low' ? 0.55 : 0.85;
      body.castShadow = config.detail !== 'low';
      pGroup.add(body);

      // Snowy White Belly
      const bellyGeo =
        config.detail === 'low'
          ? new THREE.CylinderGeometry(0.22, 0.32, 0.95, 8, 1, false, -Math.PI / 2, Math.PI)
          : new THREE.CylinderGeometry(
              0.34,
              0.46,
              1.38,
              config.detail === 'high' ? 16 : 10,
              1,
              false,
              -Math.PI / 2,
              Math.PI
            );
      const belly = new THREE.Mesh(bellyGeo, bellyMat);
      belly.position.set(0, config.detail === 'low' ? 0.55 : 0.85, 0.04);
      pGroup.add(belly);

      // Emperor Golden Collar (high and med detail)
      if (config.detail !== 'low') {
        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.35,
            0.39,
            0.35,
            config.detail === 'high' ? 16 : 10,
            1,
            false,
            -Math.PI / 2,
            Math.PI
          ),
          emperorCollarMat
        );
        collar.position.set(0, 1.32, 0.05);
        pGroup.add(collar);
      }

      // Head & Beak Group
      const headGroup = new THREE.Group();
      headGroup.position.set(0, config.detail === 'low' ? 1.15 : 1.68, 0);

      const headGeo =
        config.detail === 'low'
          ? new THREE.SphereGeometry(0.2, 8, 8)
          : new THREE.SphereGeometry(
              0.32,
              config.detail === 'high' ? 14 : 10,
              config.detail === 'high' ? 14 : 10
            );
      const head = new THREE.Mesh(headGeo, coatMat);
      head.castShadow = config.detail === 'high';
      headGroup.add(head);

      // Auroral Ear Patches (high and med detail)
      if (config.detail !== 'low') {
        const earL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), emperorCollarMat);
        earL.position.set(-0.25, 0.05, 0.08);
        earL.scale.set(0.5, 1.2, 0.8);
        headGroup.add(earL);

        const earR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), emperorCollarMat);
        earR.position.set(0.25, 0.05, 0.08);
        earR.scale.set(0.5, 1.2, 0.8);
        headGroup.add(earR);
      }

      // Curved Emperor Beak
      const beakGeo =
        config.detail === 'low'
          ? new THREE.ConeGeometry(0.06, 0.22, 4)
          : new THREE.ConeGeometry(0.09, 0.42, 6);
      const beak = new THREE.Mesh(beakGeo, beakMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.02, config.detail === 'low' ? 0.22 : 0.38);
      headGroup.add(beak);

      // Blinking Eyes
      let eyeL: THREE.Mesh | undefined;
      let eyeR: THREE.Mesh | undefined;
      if (config.detail !== 'low') {
        eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.16, 0.08, 0.22);
        headGroup.add(eyeL);

        eyeR = new THREE.Mesh(eyeGeo, eyeMat);
        eyeR.position.set(0.16, 0.08, 0.22);
        headGroup.add(eyeR);
      }

      pGroup.add(headGroup);

      // Wings / Flippers
      let wingL: THREE.Mesh | undefined;
      let wingR: THREE.Mesh | undefined;
      if (config.detail !== 'low') {
        const wingGeo = new THREE.BoxGeometry(0.08, 0.78, 0.22);
        wingL = new THREE.Mesh(wingGeo, coatMat);
        wingL.position.set(-0.45, 0.85, 0);
        wingL.rotation.z = 0.2;
        pGroup.add(wingL);

        wingR = new THREE.Mesh(wingGeo, coatMat);
        wingR.position.set(0.45, 0.85, 0);
        wingR.rotation.z = -0.2;
        pGroup.add(wingR);
      }

      // Stepping Feet (high and med detail)
      let footL: THREE.Mesh | undefined;
      let footR: THREE.Mesh | undefined;
      if (config.detail !== 'low') {
        const footGeo = new THREE.BoxGeometry(0.19, 0.07, 0.36);
        footL = new THREE.Mesh(footGeo, feetMat);
        footL.position.set(-0.19, 0.06, 0.15);
        pGroup.add(footL);

        footR = new THREE.Mesh(footGeo, feetMat);
        footR.position.set(0.19, 0.06, 0.15);
        pGroup.add(footR);
      }

      // Soft Ground Contact Shadow Plate
      const shadowRadius = config.detail === 'low' ? 0.35 : 0.65;
      const shadow = new THREE.Mesh(new THREE.CircleGeometry(shadowRadius, 10), shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.02;
      pGroup.add(shadow);

      // Interactive Click/Hover Hit Sphere
      const pHitGeo = new THREE.SphereGeometry(config.detail === 'high' ? 1.1 : 0.85, 8, 8);
      const pHitBox = new THREE.Mesh(pHitGeo, new THREE.MeshBasicMaterial({ visible: false }));
      pHitBox.position.set(0, 0.8, 0);
      const penguinIndex = allPenguinHitBoxes.length;
      pHitBox.userData = {
        type: 'PENGUIN',
        id: config.id,
        name: config.name || 'Emperor Penguin',
        role: config.role || 'Colony Member',
        index: penguinIndex,
      };
      pGroup.add(pHitBox);
      allPenguinHitBoxes.push(pHitBox);

      penguinsGroup.add(pGroup);

      // Calculate path parameters for continuous movement (no dead stops)
      const minX = config.pathMinX !== undefined ? config.pathMinX : config.x;
      const maxX = config.pathMaxX !== undefined ? config.pathMaxX : config.x;
      const pathDist = Math.max(0.1, maxX - minX);
      const speed = config.walkSpeed || 0.55;
      const walkDur = pathDist / speed;
      const turnDur = config.turnDuration || 0.85; // Continuous rapid U-turn without stopping
      const legDur = walkDur + turnDur;
      const cycleDur = legDur * 2;

      colonyPenguins.push({
        id: config.id,
        name: config.name,
        role: config.role,
        group: pGroup,
        headGroup,
        wingL,
        wingR,
        footL,
        footR,
        eyeL,
        eyeR,
        behavior: config.behavior,
        pathMinX: minX,
        pathMaxX: maxX,
        baseX: config.x,
        baseY: config.y,
        baseZ: config.z,
        baseRotY: config.rotY !== undefined ? config.rotY : 0,
        initialDirection: config.initialDirection || 1,
        walkSpeed: speed,
        walkDuration: walkDur,
        turnDuration: turnDur,
        cycleDuration: cycleDur,
        waddleFreq: config.waddleFreq || 1.7,
        waddleRoll: config.waddleRoll || 0.15,
        waddleBob: config.waddleBob || 0.07,
        animSpeed: config.animSpeed || 1.0,
        phaseOffset: config.phaseOffset !== undefined ? config.phaseOffset : Math.random() * Math.PI * 4,
        blinkInterval: config.blinkInterval || (3.8 + Math.random() * 2.0),
        trackMouse: config.trackMouse,
      });
    };

    // ── 1. FOREGROUND PENGUINS (Depth Layer 1: High Detail, Continuous Prominent Motion) ──
    // Foreground Companion Walker (Continuous LEFT → RIGHT → LEFT traverse across central landscape)
    buildPenguin({
      id: 'companion',
      name: 'Foreground Companion',
      role: 'Ice Shelf Explorer',
      x: 1.0,
      y: -0.18,
      z: 10.0,
      scale: 1.35,
      detail: 'high',
      behavior: 'walk',
      pathMinX: 1.0,
      pathMaxX: 4.4,
      initialDirection: 1,
      walkSpeed: 0.44,
      waddleFreq: 1.6,
      waddleRoll: 0.16,
      waddleBob: 0.08,
      animSpeed: 1.0,
      phaseOffset: 1.2,
      blinkInterval: 4.2,
      trackMouse: true,
    });

    // Foreground Juvenile Lookout (Active continuous walking & observing)
    buildPenguin({
      id: 'lookout_fg',
      name: 'Juvenile Lookout',
      role: 'Sky & Ridge Surveyor',
      x: 0.6,
      y: -0.22,
      z: 11.2,
      scale: 1.15,
      detail: 'high',
      behavior: 'walk',
      pathMinX: 0.5,
      pathMaxX: 1.8,
      initialDirection: 1,
      walkSpeed: 0.44,
      waddleFreq: 2.0,
      waddleRoll: 0.18,
      waddleBob: 0.09,
      animSpeed: 1.05,
      phaseOffset: 2.8,
      blinkInterval: 3.8,
      trackMouse: true,
    });

    // ── SOCIAL VISITOR PENGUIN (CONTINUOUSLY MOVING FROM ONE PENGUIN TO ANOTHER) ──
    buildPenguin({
      id: 'visitor',
      name: 'Social Visitor Penguin',
      role: 'Colony Envoy (Visiting Friends)',
      x: 1.8,
      y: -0.22,
      z: 9.8,
      scale: 1.12,
      detail: 'high',
      behavior: 'visitor',
      walkSpeed: 0.62,
      animSpeed: 1.0,
      phaseOffset: 0.0,
      blinkInterval: 4.2,
      trackMouse: true,
    });

    // ── 2. MIDGROUND PENGUINS (Depth Layer 2: Medium Size, Continuous Colony Movement) ──
    // CARAVAN LEADER (Continuously marching across snow trail, followed one after another)
    buildPenguin({
      id: 'caravan_leader',
      name: 'Caravan Leader Penguin',
      role: 'Expedition Guide (Leader)',
      x: 0.8,
      y: -0.30,
      z: 6.2,
      scale: 0.86,
      detail: 'med',
      behavior: 'walk',
      pathMinX: 0.8,
      pathMaxX: 5.8,
      initialDirection: 1,
      walkSpeed: 0.62,
      waddleFreq: 1.8,
      waddleRoll: 0.14,
      waddleBob: 0.07,
      animSpeed: 1.0,
      phaseOffset: 3.5,
      blinkInterval: 4.6,
    });

    // CARAVAN FOLLOWER 1 (Continuously marching directly behind Leader, one after another!)
    buildPenguin({
      id: 'caravan_follower_1',
      name: 'Caravan Follower 1',
      role: 'Trail Companion (Marching Behind Leader)',
      x: 0.8,
      y: -0.30,
      z: 6.0,
      scale: 0.82,
      detail: 'med',
      behavior: 'walk',
      pathMinX: 0.8,
      pathMaxX: 5.8,
      initialDirection: 1,
      walkSpeed: 0.62,
      waddleFreq: 1.8,
      waddleRoll: 0.14,
      waddleBob: 0.07,
      animSpeed: 1.0,
      phaseOffset: 3.5 - 1.4, // Lag behind leader creating continuous procession
      blinkInterval: 4.9,
    });

    // CARAVAN FOLLOWER 2 (Continuously marching directly behind Follower 1, one after another!)
    buildPenguin({
      id: 'caravan_follower_2',
      name: 'Caravan Follower 2',
      role: 'Rear Guard (Marching in Sequence)',
      x: 0.8,
      y: -0.30,
      z: 5.8,
      scale: 0.78,
      detail: 'med',
      behavior: 'walk',
      pathMinX: 0.8,
      pathMaxX: 5.8,
      initialDirection: 1,
      walkSpeed: 0.62,
      waddleFreq: 1.8,
      waddleRoll: 0.14,
      waddleBob: 0.07,
      animSpeed: 1.0,
      phaseOffset: 3.5 - 2.8, // 3-penguin procession line
      blinkInterval: 5.3,
    });

    // Midground Walker 2 (Continuous RIGHT → LEFT traverse across ice field)
    buildPenguin({
      id: 'ice_scout',
      name: 'Ice Plain Scout',
      role: 'Perimeter Surveyor',
      x: 6.2,
      y: -0.32,
      z: 3.6,
      scale: 0.82,
      detail: 'med',
      behavior: 'walk',
      pathMinX: 1.4,
      pathMaxX: 6.2,
      initialDirection: -1,
      walkSpeed: 0.60,
      waddleFreq: 1.7,
      waddleRoll: 0.15,
      waddleBob: 0.07,
      animSpeed: 0.95,
      phaseOffset: 8.2,
      blinkInterval: 5.1,
    });

    // Midground Waddling Explorer (Continuous LEFT → RIGHT patrol near central ridge)
    buildPenguin({
      id: 'ridge_explorer',
      name: 'Ridge Explorer',
      role: 'Snow Ridge Pathfinder',
      x: 0.6,
      y: -0.28,
      z: 4.8,
      scale: 0.84,
      detail: 'med',
      behavior: 'walk',
      pathMinX: 0.6,
      pathMaxX: 3.8,
      initialDirection: 1,
      walkSpeed: 0.54,
      waddleFreq: 1.9,
      waddleRoll: 0.16,
      waddleBob: 0.08,
      animSpeed: 1.05,
      phaseOffset: 5.1,
      blinkInterval: 4.0,
    });

    // Midground Colony Huddle - Member 1 (Continuous communal thermal shuffle & micro-orbit)
    buildPenguin({
      id: 'huddle_1',
      name: 'Huddle Member 1',
      role: 'Thermal Core Sentinel',
      x: 3.6,
      y: -0.32,
      z: 4.2,
      scale: 0.85,
      rotY: 0.4,
      detail: 'med',
      behavior: 'huddle',
      animSpeed: 0.85,
      phaseOffset: 0.5,
      blinkInterval: 4.5,
    });

    // Midground Colony Huddle - Member 2 (Continuous communal thermal shuffle)
    buildPenguin({
      x: 4.3,
      y: -0.32,
      z: 4.6,
      scale: 0.82,
      rotY: -0.5,
      detail: 'med',
      behavior: 'huddle',
      animSpeed: 0.95,
      phaseOffset: 1.8,
      blinkInterval: 5.4,
    });

    // Midground Colony Huddle - Member 3 (Continuous communal thermal shuffle)
    buildPenguin({
      x: 3.9,
      y: -0.32,
      z: 5.1,
      scale: 0.88,
      rotY: 2.6,
      detail: 'med',
      behavior: 'huddle',
      animSpeed: 0.8,
      phaseOffset: 3.2,
      blinkInterval: 4.8,
    });

    // Midground Ridge Scout (Continuously patrolling midground ridge)
    buildPenguin({
      x: 0.2,
      y: -0.30,
      z: 5.8,
      scale: 0.86,
      detail: 'med',
      behavior: 'walk',
      pathMinX: 0.2,
      pathMaxX: 1.6,
      initialDirection: 1,
      walkSpeed: 0.44,
      waddleFreq: 1.7,
      waddleRoll: 0.15,
      waddleBob: 0.07,
      animSpeed: 1.0,
      phaseOffset: 4.1,
      blinkInterval: 4.2,
    });

    // Midground Ice Pecker (Continuously walking and pecking ice surface)
    buildPenguin({
      x: -0.5,
      y: -0.38,
      z: -1.2,
      scale: 0.72,
      detail: 'med',
      behavior: 'peck',
      pathMinX: -0.9,
      pathMaxX: 0.4,
      initialDirection: 1,
      walkSpeed: 0.40,
      waddleFreq: 1.8,
      waddleRoll: 0.15,
      waddleBob: 0.07,
      animSpeed: 0.95,
      phaseOffset: 2.1,
      blinkInterval: 5.0,
    });

    // Mid-Distant Social Pair 1 (Continuous Communicative Dance & Reciprocal Steps)
    buildPenguin({
      x: 1.2,
      y: -0.40,
      z: -2.2,
      scale: 0.65,
      rotY: 0.8,
      detail: 'med',
      behavior: 'duo',
      animSpeed: 0.9,
      phaseOffset: 1.5,
      blinkInterval: 4.7,
    });

    // Mid-Distant Social Pair 2 (Continuous Communicative Dance & Reciprocal Steps)
    buildPenguin({
      x: 1.9,
      y: -0.40,
      z: -2.6,
      scale: 0.62,
      rotY: -2.3,
      detail: 'med',
      behavior: 'duo',
      animSpeed: 0.9,
      phaseOffset: 4.6,
      blinkInterval: 5.2,
    });

    // Midground Belly Slider (Continuous TOBOGGANING on belly along snow dip)
    buildPenguin({
      x: 1.5,
      y: -0.40,
      z: -4.0,
      scale: 0.75,
      rotY: -Math.PI / 4,
      detail: 'med',
      behavior: 'slide',
      pathMinX: 1.0,
      pathMaxX: 5.0,
      walkSpeed: 0.85,
      animSpeed: 1.0,
      phaseOffset: 0.0,
    });

    // ── 3. BACKGROUND PENGUINS (Depth Layer 3: Distant Atmospheric Scouts, Continuously Patrolling) ──
    // Background Station Walker (Continuously walking toward Maitri Base perimeter)
    buildPenguin({
      x: 3.2,
      y: -0.42,
      z: -8.5,
      scale: 0.46,
      detail: 'low',
      behavior: 'walk',
      pathMinX: 3.2,
      pathMaxX: 7.6,
      initialDirection: 1,
      walkSpeed: 0.42,
      waddleFreq: 1.4,
      waddleRoll: 0.12,
      waddleBob: 0.04,
      animSpeed: 0.85,
      phaseOffset: 6.2,
      blinkInterval: 6.0,
    });

    // Background Station Perimeter Sentinel (Continuously patrolling perimeter ridge)
    buildPenguin({
      x: 8.5,
      y: -0.40,
      z: -10.8,
      scale: 0.42,
      detail: 'low',
      behavior: 'walk',
      pathMinX: 6.8,
      pathMaxX: 8.8,
      initialDirection: -1,
      walkSpeed: 0.36,
      waddleFreq: 1.4,
      waddleRoll: 0.12,
      waddleBob: 0.04,
      animSpeed: 0.75,
      phaseOffset: 5.0,
      blinkInterval: 5.5,
    });

    // Background Mountain Ridge Scout (Continuously surveying ridge)
    buildPenguin({
      x: 3.0,
      y: -0.45,
      z: -7.5,
      scale: 0.40,
      detail: 'low',
      behavior: 'walk',
      pathMinX: 2.2,
      pathMaxX: 4.2,
      initialDirection: 1,
      walkSpeed: 0.34,
      waddleFreq: 1.4,
      waddleRoll: 0.12,
      waddleBob: 0.04,
      animSpeed: 0.85,
      phaseOffset: 2.0,
      blinkInterval: 5.8,
    });

    // Background Ridge Companion (Continuously pacing snow ridge)
    buildPenguin({
      x: 4.4,
      y: -0.45,
      z: -8.8,
      scale: 0.38,
      detail: 'low',
      behavior: 'walk',
      pathMinX: 4.0,
      pathMaxX: 5.8,
      initialDirection: -1,
      walkSpeed: 0.32,
      waddleFreq: 1.4,
      waddleRoll: 0.12,
      waddleBob: 0.04,
      animSpeed: 0.75,
      phaseOffset: 4.3,
      blinkInterval: 6.2,
    });

    scene.add(penguinsGroup);



    // ── Mouse & Interaction Listeners ──
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;
      mouseVecRef.current.set(nx, ny);
    };

    const handleClick = () => {
      raycasterRef.current.setFromCamera(mouseVecRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects([...allPenguinHitBoxes, stationHitBox]);
      if (intersects.length > 0) {
        const uData = intersects[0].object.userData;
        if (uData?.type === 'PENGUIN' && onPenguinClick) {
          onPenguinClick(uData.index, uData.name);
        } else if (uData?.type === 'STATION' && onStationClick) {
          onStationClick();
        }
      }
    };

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    container.addEventListener('click', handleClick);

    // ── Animation Loop ──
    let animationFrameId: number;
    let clock = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.016;

      // Mouse Parallax smooth lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Camera position interpolation with parallax
      const targetCamX = cameraFocusTarget.current.pos.x + mouseRef.current.x * 2.5;
      const targetCamY = cameraFocusTarget.current.pos.y + mouseRef.current.y * 1.2;
      const targetCamZ = cameraFocusTarget.current.pos.z;

      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;

      currentLookAt.x += (cameraFocusTarget.current.look.x - currentLookAt.x) * 0.04;
      currentLookAt.y += (cameraFocusTarget.current.look.y - currentLookAt.y) * 0.04;
      currentLookAt.z += (cameraFocusTarget.current.look.z - currentLookAt.z) * 0.04;
      camera.lookAt(currentLookAt);

      // ── Detect Reduced Motion Preference ──
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // ── Animate Hero Penguin (Foreground Mascot) ──
      // Subtle natural respiration breathing
      const breath = Math.sin(clock * 2.2);
      heroBody.scale.set(1 + breath * 0.02, 1, 1 + breath * 0.025);
      heroBelly.scale.set(1 + breath * 0.02, 1, 1 + breath * 0.025);

      // Hero eye blinking (natural 4.2s cycle, 140ms blink duration)
      const heroBlinkTime = clock % 4.2;
      const isHeroBlinking = heroBlinkTime < 0.14;
      heroEyeL.scale.y = isHeroBlinking ? 0.05 : 1.0;
      heroEyeR.scale.y = isHeroBlinking ? 0.05 : 1.0;

      // Head tracks mouse cursor smoothly (subtle cinematic rotation)
      if (!prefersReducedMotion) {
        const targetHeadRotY = mouseRef.current.x * 0.65;
        const targetHeadRotX = -mouseRef.current.y * 0.35;
        heroHeadGroup.rotation.y += (targetHeadRotY - heroHeadGroup.rotation.y) * 0.08;
        heroHeadGroup.rotation.x += (targetHeadRotX - heroHeadGroup.rotation.x) * 0.08;
      }

      // Wing flipper subtle idle adjustments & breathing balance
      heroWingL.rotation.z = 0.22 + Math.sin(clock * 1.5) * 0.04;
      heroWingR.rotation.z = -0.22 - Math.sin(clock * 1.5) * 0.04;

      // Continuous active weight-shifting waddle & alternating foot shuffle
      if (!prefersReducedMotion) {
        const heroWaddle = Math.sin(clock * 1.8);
        heroPenguin.rotation.z = heroWaddle * 0.035;
        heroPenguin.position.y = -0.15 + Math.abs(heroWaddle) * 0.02;
        heroFootL.rotation.x = heroWaddle * 0.16;
        heroFootR.rotation.x = -heroWaddle * 0.16;
        heroFootL.position.y = 0.06 + Math.max(0, heroWaddle) * 0.02;
        heroFootR.position.y = 0.06 + Math.max(0, -heroWaddle) * 0.02;
      }

      // ── Animate Antarctic Colony Penguins (Continuous Fluid Motion) ──
      const smoothStep = (t: number) => {
        const clamped = Math.max(0, Math.min(1, t));
        return clamped * clamped * (3 - 2 * clamped);
      };

      for (let i = 0; i < colonyPenguins.length; i++) {
        const cp = colonyPenguins[i];
        const pTime = clock * cp.animSpeed + cp.phaseOffset;

        // 1. Natural Eye Blinking (each penguin has its own interval & phase)
        if (cp.eyeL && cp.eyeR) {
          const blinkMod = pTime % cp.blinkInterval;
          const isBlink = blinkMod < 0.14;
          cp.eyeL.scale.y = isBlink ? 0.05 : 1.0;
          cp.eyeR.scale.y = isBlink ? 0.05 : 1.0;
        }

        // 2. Behavior-Specific Motion Patterns
        if (cp.behavior === 'walk') {
          if (prefersReducedMotion) {
            cp.group.position.x = (cp.pathMinX + cp.pathMaxX) / 2;
            cp.group.position.y = cp.baseY;
            cp.group.rotation.z = 0;
            cp.group.rotation.y = cp.initialDirection === 1 ? Math.PI / 2 : -Math.PI / 2;
            continue;
          }

          const legDur = cp.walkDuration + cp.turnDuration;
          const tCycle = pTime % cp.cycleDuration;
          const isLeg1 = tCycle < legDur;
          const tLeg = isLeg1 ? tCycle : tCycle - legDur;

          // Determine walking direction on current leg:
          const isMovingLeftToRight =
            (cp.initialDirection === 1 && isLeg1) ||
            (cp.initialDirection === -1 && !isLeg1);

          if (tLeg < cp.walkDuration) {
            // ── PHASE 1: ACTIVE CONTINUOUS WALKING (NO PAUSES) ──
            const pNorm = tLeg / cp.walkDuration;
            const curX = isMovingLeftToRight
              ? cp.pathMinX + pNorm * (cp.pathMaxX - cp.pathMinX)
              : cp.pathMaxX - pNorm * (cp.pathMaxX - cp.pathMinX);
            cp.group.position.x = curX;
            cp.group.rotation.y = isMovingLeftToRight ? Math.PI / 2 : -Math.PI / 2;
          } else {
            // ── PHASE 2: FLUID CONTINUOUS 180° TURNAROUND (FEET KEEP STEPPING!) ──
            const tTurn = tLeg - cp.walkDuration;
            const turnP = smoothStep(tTurn / cp.turnDuration);

            // Pivot smoothly with gentle arc curve facing camera
            if (isMovingLeftToRight) {
              cp.group.position.x = cp.pathMaxX - Math.sin(Math.PI * turnP) * 0.05;
              cp.group.rotation.y = Math.PI / 2 - turnP * Math.PI;
            } else {
              cp.group.position.x = cp.pathMinX + Math.sin(Math.PI * turnP) * 0.05;
              cp.group.rotation.y = -Math.PI / 2 + turnP * Math.PI;
            }
          }

          // ── CONTINUOUS UNBROKEN WADDLE, BOBBING, STEPPING & BALANCE ──
          // Runs continuously across both walking and turnaround
          const waddleAngle = pTime * cp.waddleFreq * 5.4;
          const waddle = Math.sin(waddleAngle);

          // Side-to-side body roll (iconic continuous penguin waddle)
          cp.group.rotation.z = waddle * cp.waddleRoll;

          // Continuous vertical step bobbing
          cp.group.position.y = cp.baseY + Math.abs(waddle) * cp.waddleBob;

          // Continuous alternating feet stepping
          if (cp.footL && cp.footR) {
            cp.footL.rotation.x = waddle * 0.32;
            cp.footR.rotation.x = -waddle * 0.32;
            cp.footL.position.y = 0.06 + Math.max(0, waddle) * 0.04;
            cp.footR.position.y = 0.06 + Math.max(0, -waddle) * 0.04;
          }

          // Continuous flipper wing counter-balance
          if (cp.wingL && cp.wingR) {
            cp.wingL.rotation.z = 0.24 + waddle * 0.08;
            cp.wingR.rotation.z = -0.24 + waddle * 0.08;
          }

          // Head keeps horizon level while torso rolls
          cp.headGroup.rotation.z = -cp.group.rotation.z * 0.6;
          cp.headGroup.rotation.y = 0;
          cp.headGroup.rotation.x = 0.02;

        } else if (cp.behavior === 'slide') {
          // ── BELLY SLIDING / TOBOGGANING (Continuous Snow Dip Glide) ──
          if (!prefersReducedMotion) {
            cp.group.rotation.x = -Math.PI / 2.3; // Flat on belly
            cp.group.position.y = cp.baseY - 0.2; // Low snow clearance
            const slideRange = (cp.pathMaxX - cp.pathMinX) / 2;
            const slideCenter = (cp.pathMinX + cp.pathMaxX) / 2;
            const slideSin = Math.sin(pTime * cp.walkSpeed * 0.9);

            cp.group.position.x = slideCenter + slideSin * slideRange;
            cp.group.rotation.y = slideSin >= 0 ? Math.PI / 2.1 : -Math.PI / 2.1;

            // Flippers paddling on snow surface
            if (cp.wingL && cp.wingR) {
              const paddle = Math.sin(pTime * 6.0) * 0.26;
              cp.wingL.rotation.y = paddle;
              cp.wingR.rotation.y = -paddle;
            }

            // Feet kicking behind
            if (cp.footL && cp.footR) {
              const kick = Math.sin(pTime * 6.0) * 0.28;
              cp.footL.rotation.x = kick;
              cp.footR.rotation.x = -kick;
            }
          }

        } else if (cp.behavior === 'huddle') {
          // ── COLONY HUDDLE (Continuous Communal Thermal Shuffle & Micro-Orbit) ──
          // Continuous micro-orbit around huddle cluster
          cp.group.position.x = cp.baseX + Math.sin(pTime * 0.7) * 0.14;
          cp.group.position.z = cp.baseZ + Math.cos(pTime * 0.7) * 0.12;
          cp.group.rotation.y = cp.baseRotY + Math.sin(pTime * 0.85) * 0.22;

          // Continuous foot shuffle
          const huddleStep = Math.sin(pTime * 4.2);
          if (cp.footL && cp.footR) {
            cp.footL.rotation.x = huddleStep * 0.18;
            cp.footR.rotation.x = -huddleStep * 0.18;
            cp.footL.position.y = 0.06 + Math.max(0, huddleStep) * 0.025;
            cp.footR.position.y = 0.06 + Math.max(0, -huddleStep) * 0.025;
          }

          // Continuous torso roll & vertical bob
          cp.group.rotation.z = Math.sin(pTime * 2.1) * 0.05;
          cp.group.position.y = cp.baseY + Math.abs(Math.sin(pTime * 2.1)) * 0.03;

          // Continuous wing thermal flutter
          if (cp.wingL && cp.wingR) {
            const flutter = Math.sin(pTime * 2.8) * 0.06;
            cp.wingL.rotation.z = 0.20 + flutter;
            cp.wingR.rotation.z = -0.20 - flutter;
          }

          // Companion glances
          cp.headGroup.rotation.y = Math.sin(pTime * 0.8) * 0.28;
          cp.headGroup.rotation.x = Math.sin(pTime * 1.2) * 0.12;

        } else if (cp.behavior === 'duo') {
          // ── SOCIAL PAIR (Continuous Communicative Dance & Reciprocal Steps) ──
          // Continuous reciprocal pacing forward & back
          const duoPacing = Math.sin(pTime * 1.4) * 0.22;
          cp.group.position.x = cp.baseX + duoPacing;
          cp.group.position.z = cp.baseZ + Math.cos(pTime * 1.4) * 0.08;

          // Continuous waddle & vertical bob
          const duoWaddle = Math.sin(pTime * 3.6);
          cp.group.rotation.z = duoWaddle * 0.08;
          cp.group.position.y = cp.baseY + Math.abs(duoWaddle) * 0.04;

          // Continuous foot stepping
          if (cp.footL && cp.footR) {
            cp.footL.rotation.x = duoWaddle * 0.25;
            cp.footR.rotation.x = -duoWaddle * 0.25;
            cp.footL.position.y = 0.06 + Math.max(0, duoWaddle) * 0.03;
            cp.footR.position.y = 0.06 + Math.max(0, -duoWaddle) * 0.03;
          }

          // Expressive communicative head & wing gestures
          cp.headGroup.rotation.x = Math.sin(pTime * 2.4) * 0.22;
          cp.headGroup.rotation.y = Math.sin(pTime * 1.2) * 0.28;
          if (cp.wingL && cp.wingR) {
            const wingAnim = Math.sin(pTime * 2.0) * 0.08;
            cp.wingL.rotation.z = 0.22 + wingAnim;
            cp.wingR.rotation.z = -0.22 - wingAnim;
          }

        } else if (cp.behavior === 'visitor') {
          // ── SOCIAL VISITOR PENGUIN (Continuously Moving from One Penguin to Another) ──
          if (prefersReducedMotion) {
            cp.group.position.set(VISITOR_WAYPOINTS[0].x, cp.baseY, VISITOR_WAYPOINTS[0].z);
            cp.group.rotation.y = VISITOR_WAYPOINTS[0].faceRotY;
            continue;
          }

          const speed = 0.60;
          const turnDur = 0.65; // Rapid continuous pivot
          const numWps = VISITOR_WAYPOINTS.length;

          // Compute segment durations and total cycle
          let totalCycle = 0;
          const segTimes: { turnDur: number; walkDur: number; pauseDur: number; total: number }[] = [];
          for (let k = 0; k < numWps; k++) {
            const nextK = (k + 1) % numWps;
            const dx = VISITOR_WAYPOINTS[nextK].x - VISITOR_WAYPOINTS[k].x;
            const dz = VISITOR_WAYPOINTS[nextK].z - VISITOR_WAYPOINTS[k].z;
            const dist = Math.hypot(dx, dz);
            const walkDur = dist / speed;
            const pauseDur = VISITOR_WAYPOINTS[nextK].pauseDur;
            const segTotal = turnDur + walkDur + pauseDur;
            segTimes.push({ turnDur, walkDur, pauseDur, total: segTotal });
            totalCycle += segTotal;
          }

          const tInCycle = pTime % totalCycle;
          let acc = 0;
          let activeSeg = 0;
          let tSeg = tInCycle;

          for (let k = 0; k < numWps; k++) {
            if (tInCycle < acc + segTimes[k].total) {
              activeSeg = k;
              tSeg = tInCycle - acc;
              break;
            }
            acc += segTimes[k].total;
          }

          const currWp = VISITOR_WAYPOINTS[activeSeg];
          const nextWp = VISITOR_WAYPOINTS[(activeSeg + 1) % numWps];
          const seg = segTimes[activeSeg];
          const dx = nextWp.x - currWp.x;
          const dz = nextWp.z - currWp.z;
          const travelHeading = Math.atan2(dx, dz);

          if (tSeg < seg.turnDur) {
            // Phase 1: Rapid turn towards next penguin destination (continuous stepping!)
            const pTurn = smoothStep(tSeg / seg.turnDur);
            cp.group.position.x = currWp.x;
            cp.group.position.y = cp.baseY;
            cp.group.position.z = currWp.z;
            cp.group.rotation.z = 0;

            const startHeading = currWp.faceRotY;
            let dAngle = travelHeading - startHeading;
            while (dAngle > Math.PI) dAngle -= Math.PI * 2;
            while (dAngle < -Math.PI) dAngle += Math.PI * 2;
            cp.group.rotation.y = startHeading + dAngle * pTurn;

            // Continuous foot shuffle during pivot
            const shuffle = Math.sin(tSeg * 18.0);
            if (cp.footL && cp.footR) {
              cp.footL.rotation.x = shuffle * 0.18;
              cp.footR.rotation.x = -shuffle * 0.18;
              cp.footL.position.y = 0.06 + Math.max(0, shuffle) * 0.025;
              cp.footR.position.y = 0.06 + Math.max(0, -shuffle) * 0.025;
            }
          } else if (tSeg < seg.turnDur + seg.walkDur) {
            // Phase 2: Active continuous waddling toward the destination penguin!
            const tWalk = tSeg - seg.turnDur;
            const pWalk = tWalk / seg.walkDur;

            cp.group.position.x = currWp.x + pWalk * dx;
            cp.group.position.z = currWp.z + pWalk * dz;
            cp.group.rotation.y = travelHeading;

            const waddleAngle = pTime * 1.8 * 5.4;
            const waddle = Math.sin(waddleAngle);

            cp.group.rotation.z = waddle * 0.15;
            cp.group.position.y = cp.baseY + Math.abs(waddle) * 0.07;

            if (cp.footL && cp.footR) {
              cp.footL.rotation.x = waddle * 0.32;
              cp.footR.rotation.x = -waddle * 0.32;
              cp.footL.position.y = 0.06 + Math.max(0, waddle) * 0.04;
              cp.footR.position.y = 0.06 + Math.max(0, -waddle) * 0.04;
            }
            if (cp.wingL && cp.wingR) {
              cp.wingL.rotation.z = 0.24 + waddle * 0.08;
              cp.wingR.rotation.z = -0.24 + waddle * 0.08;
            }

            cp.headGroup.rotation.z = -cp.group.rotation.z * 0.6;
            cp.headGroup.rotation.y = 0;
            cp.headGroup.rotation.x = 0.02;
          } else {
            // Phase 3: BRIEF ENERGETIC GREETING at destination penguin (continuous stepping & bow!)
            const tVisit = tSeg - (seg.turnDur + seg.walkDur);
            cp.group.position.x = nextWp.x;
            cp.group.position.y = cp.baseY;
            cp.group.position.z = nextWp.z;
            cp.group.rotation.z = 0;
            cp.group.rotation.y = nextWp.faceRotY;

            // Feet keep actively shuffling on snow
            const greetShuffle = Math.sin(tVisit * 16.0);
            if (cp.footL && cp.footR) {
              cp.footL.rotation.x = greetShuffle * 0.18;
              cp.footR.rotation.x = -greetShuffle * 0.18;
              cp.footL.position.y = 0.06 + Math.max(0, greetShuffle) * 0.025;
              cp.footR.position.y = 0.06 + Math.max(0, -greetShuffle) * 0.025;
            }

            // Antarctic Greeting Ritual: Bow head, flap flippers rapidly
            cp.headGroup.rotation.x = 0.32 + Math.sin(tVisit * 5.0) * 0.16;
            cp.headGroup.rotation.y = Math.sin(tVisit * 3.0) * 0.18;
            cp.headGroup.rotation.z = Math.sin(tVisit * 4.0) * 0.08;

            if (cp.wingL && cp.wingR) {
              const flap = Math.max(0, Math.sin(tVisit * 6.0)) * 0.12;
              cp.wingL.rotation.z = 0.24 + flap;
              cp.wingR.rotation.z = -0.24 - flap;
            }

            // If visiting Hero Mascot (activeSeg === 3), Hero Mascot bows back!
            if (activeSeg === 3 && !prefersReducedMotion) {
              heroHeadGroup.rotation.y = -0.4 + Math.sin(tVisit * 4.0) * 0.12;
              heroHeadGroup.rotation.x = 0.18 + Math.sin(tVisit * 5.0) * 0.10;
            }
          }

        } else if (cp.behavior === 'peck') {
          // ── GROUND INSPECTOR (Continuous Walking & Pecks along Snow Patch) ──
          if (!prefersReducedMotion) {
            const legDur = cp.walkDuration + cp.turnDuration;
            const tCycle = pTime % cp.cycleDuration;
            const isLeg1 = tCycle < legDur;
            const tLeg = isLeg1 ? tCycle : tCycle - legDur;
            const isMovingLeftToRight =
              (cp.initialDirection === 1 && isLeg1) ||
              (cp.initialDirection === -1 && !isLeg1);

            if (tLeg < cp.walkDuration) {
              const pNorm = tLeg / cp.walkDuration;
              const curX = isMovingLeftToRight
                ? cp.pathMinX + pNorm * (cp.pathMaxX - cp.pathMinX)
                : cp.pathMaxX - pNorm * (cp.pathMaxX - cp.pathMinX);
              cp.group.position.x = curX;
              cp.group.rotation.y = isMovingLeftToRight ? Math.PI / 2 : -Math.PI / 2;
            } else {
              const tTurn = tLeg - cp.walkDuration;
              const turnP = smoothStep(tTurn / cp.turnDuration);
              if (isMovingLeftToRight) {
                cp.group.position.x = cp.pathMaxX - Math.sin(Math.PI * turnP) * 0.05;
                cp.group.rotation.y = Math.PI / 2 - turnP * Math.PI;
              } else {
                cp.group.position.x = cp.pathMinX + Math.sin(Math.PI * turnP) * 0.05;
                cp.group.rotation.y = -Math.PI / 2 + turnP * Math.PI;
              }
            }

            // Continuous waddling and feet stepping
            const waddleAngle = pTime * cp.waddleFreq * 5.4;
            const waddle = Math.sin(waddleAngle);
            cp.group.rotation.z = waddle * cp.waddleRoll;
            cp.group.position.y = cp.baseY + Math.abs(waddle) * cp.waddleBob;
            if (cp.footL && cp.footR) {
              cp.footL.rotation.x = waddle * 0.28;
              cp.footR.rotation.x = -waddle * 0.28;
              cp.footL.position.y = 0.06 + Math.max(0, waddle) * 0.035;
              cp.footR.position.y = 0.06 + Math.max(0, -waddle) * 0.035;
            }
            if (cp.wingL && cp.wingR) {
              cp.wingL.rotation.z = 0.22 + waddle * 0.06;
              cp.wingR.rotation.z = -0.22 + waddle * 0.06;
            }

            // Rhythmic pecking downwards at ice while walking
            cp.headGroup.rotation.x = 0.35 + Math.sin(pTime * 3.2) * 0.28;
            cp.headGroup.rotation.y = Math.sin(pTime * 1.2) * 0.2;
            cp.group.rotation.x = 0.06 + Math.sin(pTime * 3.2) * 0.04;
          }

        } else {
          // ── ACTIVE SENTINEL / PATROL FALLBACK (Continuous Stepping & Sway) ──
          const waddle = Math.sin(pTime * 3.2);
          cp.group.rotation.z = waddle * 0.06;
          cp.group.position.y = cp.baseY + Math.abs(waddle) * 0.03;
          if (cp.footL && cp.footR) {
            cp.footL.rotation.x = waddle * 0.2;
            cp.footR.rotation.x = -waddle * 0.2;
            cp.footL.position.y = 0.06 + Math.max(0, waddle) * 0.025;
            cp.footR.position.y = 0.06 + Math.max(0, -waddle) * 0.025;
          }
          cp.headGroup.rotation.y = Math.sin(pTime * 0.8) * 0.35;
          cp.headGroup.rotation.x = Math.sin(pTime * 1.4) * 0.12;
        }

        // 3. Subtle Foreground Cursor Tracking (for designated close observers)
        if (cp.trackMouse && !prefersReducedMotion) {
          const mouseInfluence = 0.28;
          const targetY = mouseRef.current.x * mouseInfluence;
          const targetX = -mouseRef.current.y * 0.18;
          cp.headGroup.rotation.y += (targetY - cp.headGroup.rotation.y) * 0.06;
          cp.headGroup.rotation.x += (targetX - cp.headGroup.rotation.x) * 0.06;
        }
      }

      // ── Animate Station Elements ──
      radarDish.rotation.y += 0.02;
      beaconLight.intensity = Math.sin(clock * 5) > 0.3 ? 2.5 : 0.2;

      // ── Animate Aurora Undulation ──
      auroraMesh.rotation.z = Math.sin(clock * 0.5) * 0.04;
      auroraMesh2.rotation.z = Math.cos(clock * 0.6) * 0.05;

      // ── Raycasting Hover Test ──
      raycasterRef.current.setFromCamera(mouseVecRef.current, camera);
      const hit = raycasterRef.current.intersectObjects([...allPenguinHitBoxes, stationHitBox]);
      const hitPenguinObj = hit.find((h) => h.object.userData?.type === 'PENGUIN');
      const hoveringPenguin = !!hitPenguinObj;
      const hoveringStation = hit.length > 0 && hit[0].object.userData?.type === 'STATION';

      if (hoveringPenguin || hoveringStation) {
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'default';
      }

      if (hoveringPenguin !== isHoveringPenguinRef.current) {
        isHoveringPenguinRef.current = hoveringPenguin;
        if (onPenguinHover) {
          onPenguinHover(hoveringPenguin, hitPenguinObj?.object.userData?.name);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup on Unmount ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleClick);

      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      auroraGeo.dispose();
      auroraMat.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [onPenguinHover, onPenguinClick, onStationClick]);

  return (
    <div
      ref={mountRef}
      className="dhruva-3d-canvas-container absolute inset-0 w-full h-full pointer-events-auto"
      style={{ touchAction: 'none', zIndex: 1 }}
      aria-label="DhruvaTwin Antarctic 3D Interactive Digital Twin Scene"
    />
  );
};
