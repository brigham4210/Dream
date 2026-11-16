/* The fridge: a steel French-door fridge with a freezer drawer, built into a green housing with a cupboard over it.
   build() adds it to whatever `scene` it is given: the wall is z = 0, the doors towards +z, the floor is y = 0, metres.
   Both doors and the freezer drawer open; the light inside comes on with the doors. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Fridge', title: 'Fridge', line: 'French doors over a freezer drawer · click a door or the drawer to open it',
  at: [-3.12, -2.6], turn: 0, view: { target: [0, 1.15, 0.4], cam: [0.55, 1.7, 3.5] },
  build({ THREE, scene, sound, kit, RH }) {
const { std, tools, M, front } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), parts = {};
const HW = 0.44, D = 0.6, MID = 0.76, TOPY = 2.1, top = RH || 2.9;
const liner = std(0xf3f5f6, 0.5, 0, { emissive: 0xeaf4ff, emissiveIntensity: 0 }), clear = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, transparent: true, opacity: 0.3, depthWrite: false });
const pane = (...a) => { const m = box(...a); m.userData.through = true; return m; };

/* ---------------------------------------------------------------- housing */
for (const k of [-1, 1]) box(k * HW - (k < 0 ? 0.04 : 0), k * HW + (k > 0 ? 0.04 : 0), 0, top, 0, D + 0.07, M.paint);
box(-HW, HW, TOPY + 0.02, top, 0, D + 0.05, M.paint); for (const k of [-1, 1]) front(HW - 0.006, top - TOPY - 0.05, M.paint, g, k * HW / 2, (top + TOPY + 0.02) / 2, D + 0.058);
box(-HW, HW, 0, 0.06, 0, D - 0.04, M.black);
// the cabinet: white inside
for (const k of [-1, 1]) box(k * HW - (k > 0 ? 0.03 : 0), k * HW + (k < 0 ? 0.03 : 0), 0.06, TOPY, 0, D, liner);
box(-HW, HW, 0.06, TOPY, 0, 0.03, liner); box(-HW, HW, TOPY - 0.03, TOPY, 0, D, liner); box(-HW, HW, 0.06, 0.09, 0, D, liner); box(-HW, HW, MID - 0.04, MID, 0, D, liner);
const light = new THREE.PointLight(0xeaf4ff, 0, 2.4, 1.4); light.position.set(0, 1.95, 0.4); g.add(light);
mk(new THREE.PlaneGeometry(0.3, 0.08).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.5, 2.6, 2.7) }), g, 0, TOPY - 0.032, 0.3);

/* ----------------------------------------------------------------- inside */
const S = [1.08, 1.38, 1.68], X = HW - 0.03;
for (const y of S) pane(-X, X, y - 0.008, y, 0.03, 0.46, M.glass);
const bottle = (x, y, z, c, h = 0.24, r = 0.036, cap = 0x1c1d1f, parent = g) => { cyl(r, h * 0.68, std(c, 0.2), x, y + h * 0.34, z, parent); mk(new THREE.CylinderGeometry(r * 0.4, r, h * 0.14, 20), std(c, 0.2), parent, x, y + h * 0.75, z); cyl(r * 0.4, h * 0.14, std(c, 0.2), x, y + h * 0.89, z, parent, 16); cyl(r * 0.45, h * 0.05, std(cap, 0.5), x, y + h * 0.975, z, parent, 16); };
const jar = (x, y, z, c, h = 0.11, r = 0.04, lid = 0xc9a252, parent = g) => { cyl(r, h, std(c, 0.2), x, y + h / 2, z, parent); cyl(r * 1.03, 0.014, std(lid, 0.4, 0.6), x, y + h + 0.007, z, parent); };
// crisper drawers full of vegetables
for (const k of [-1, 1]) { pane(k * 0.21 - 0.195, k * 0.21 + 0.195, 0.775, 1.03, 0.04, 0.47, clear); box(k * 0.21 - 0.1, k * 0.21 + 0.1, 0.99, 1.005, 0.47, 0.478, liner); }
for (let i = 0; i < 4; i++) mk(new THREE.IcosahedronGeometry(0.075, 2), std([0x7fb04a, 0x5d9440, 0x8fbf5a, 0x6aa84a][i], 0.9), g, -0.33 + (i % 2) * 0.2, 0.86 + (i > 1 ? 0.08 : 0), 0.18 + (i % 3) * 0.1).scale.y = 0.75;
for (let i = 0; i < 6; i++) mk(new THREE.ConeGeometry(0.018, 0.2, 10).rotateZ(Math.PI / 2), std(0xe8802a, 0.7), g, 0.2 + (i % 2) * 0.03, 0.8 + (i >> 1) * 0.03, 0.12 + i * 0.03);
for (let i = 0; i < 5; i++) mk(new THREE.SphereGeometry(0.04, 20, 14), std(0xc8321e, 0.35), g, 0.1 + (i % 3) * 0.12, 0.83 + (i > 2 ? 0.065 : 0), 0.36 + (i % 2) * 0.05);
// first shelf: milk, juice, eggs, butter
bottle(-0.33, S[0], 0.14, 0xf7f7f2, 0.27, 0.042, 0x3b6fb5); bottle(-0.23, S[0], 0.16, 0xf7f7f2, 0.27, 0.042, 0x3b6fb5); bottle(-0.12, S[0], 0.13, 0xf0961e, 0.25, 0.04, 0xf4f0e8);
box(0.05, 0.35, S[0], S[0] + 0.035, 0.12, 0.26, std(0xb9b3a4, 0.95)); for (let i = 0; i < 10; i++) mk(new THREE.SphereGeometry(0.022, 16, 12), std(i % 3 ? 0xe9d3b5 : 0xf6efe4, 0.6), g, 0.08 + (i % 5) * 0.06, S[0] + 0.045, 0.16 + (i > 4 ? 0.06 : 0)).scale.y = 1.25;
box(0.1, 0.24, S[0], S[0] + 0.012, 0.32, 0.42, M.ceramic); box(0.115, 0.225, S[0] + 0.012, S[0] + 0.05, 0.335, 0.405, std(0xf5df8a, 0.5));
// second shelf: a small pot, cheese, jars
{ const blue = new THREE.MeshPhysicalMaterial({ color: 0x2c4f7a, roughness: 0.3, clearcoat: 1 }); cyl(0.1, 0.09, blue, -0.26, S[1] + 0.045, 0.22, g, 40); cyl(0.105, 0.012, blue, -0.26, S[1] + 0.096, 0.22, g, 40); cyl(0.015, 0.02, M.brass, -0.26, S[1] + 0.112, 0.22); }
mk(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 24, 1, false, 0, 1.0), std(0xf0c64a, 0.6, 0, { side: THREE.DoubleSide }), g, -0.05, S[1] + 0.03, 0.3);
jar(0.12, S[1], 0.16, 0x8f1d2c); jar(0.22, S[1], 0.14, 0x6f8f2f, 0.14); jar(0.32, S[1], 0.17, 0xe0a030, 0.1); jar(0.2, S[1], 0.32, 0xf2efe6, 0.09, 0.045, 0xf2efe6); jar(0.31, S[1], 0.33, 0xf2efe6, 0.09, 0.045, 0xf2efe6);
// third shelf: half a watermelon, a bowl of berries, yoghurt
{ const m = mk(new THREE.SphereGeometry(0.13, 40, 20, 0, Math.PI), std(0x24512a, 0.6), g, -0.22, S[2] + 0.13, 0.24); m.rotation.y = Math.PI + 0.35; const f = mk(new THREE.CircleGeometry(0.122, 40).rotateY(Math.PI), std(0xe2414a, 0.6), m, 0, 0, -0.001); mk(new THREE.RingGeometry(0.122, 0.13, 40).rotateY(Math.PI), std(0xe9f0d0, 0.6), m, 0, 0, -0.001); f.receiveShadow = true; }
mk(new THREE.LatheGeometry([[0.03, 0], [0.07, 0.015], [0.095, 0.06]].map(p => new THREE.Vector2(...p)), 32), M.ceramic, g, 0.08, S[2], 0.3);
for (let i = 0; i < 22; i++) { const a = i * 2.4, r = 0.012 + (i % 5) * 0.013; mk(new THREE.SphereGeometry(0.014, 10, 8), std(i % 3 ? 0x3b3f8a : 0xb0203a, 0.4), g, 0.08 + Math.cos(a) * r, S[2] + 0.045 + (i % 2) * 0.012, 0.3 + Math.sin(a) * r); }
for (let i = 0; i < 4; i++) { const x = 0.24 + (i % 2) * 0.09, z = 0.12 + (i >> 1) * 0.09; mk(new THREE.CylinderGeometry(0.036, 0.03, 0.07, 20), std(0xfafafa, 0.5), g, x, S[2] + 0.035, z); cyl(0.037, 0.003, std([0xd94a6a, 0x5a7fd0, 0xe2b030, 0x6aa84a][i], 0.4, 0.5), x, S[2] + 0.072, z); }

/* ------------------------------------------------------------------ doors */
const DH = TOPY - MID - 0.006, vs = { l: 0, r: 0 };
const glow = () => { const v = Math.max(vs.l, vs.r); light.intensity = 2.2 * v; liner.emissiveIntensity = 0.3 * v; };
for (const s of [1, -1]) { const side = s > 0 ? 'l' : 'r', d = grp(-s * HW, MID + 0.003, D), w = HW - 0.002;      // s = 1: hinged on the left
  box(Math.min(0, s * w), Math.max(0, s * w), 0, DH, 0.002, 0.055, M.steel, d); box(Math.min(s * 0.03, s * (w - 0.02)), Math.max(s * 0.03, s * (w - 0.02)), 0.03, DH - 0.03, -0.012, 0.002, liner, d);
  cyl(0.011, 0.95, M.steel, s * (w - 0.045), DH / 2 - 0.1, 0.1, d, 16); for (const y of [-0.42, 0.42]) cyl(0.007, 0.05, M.steel, s * (w - 0.045), DH / 2 - 0.1 + y, 0.078, d, 10).rotation.x = Math.PI / 2;
  // bins on the inside of the door, with bottles
  [0.12, 0.52, 0.92].forEach((y, i) => { pane(Math.min(s * 0.05, s * (w - 0.04)), Math.max(s * 0.05, s * (w - 0.04)), y, y + 0.09, -0.125, -0.012, clear, d);
    for (let k = 0; k < 3; k++) { const x = s * (0.1 + k * 0.105), c = [[0x2e5a34, 0x7a1f2a, 0xe8e2d0], [0xb5271e, 0xd9a441, 0x3a2416], [0xf7f7f2, 0x6f8f2f, 0x8f1d2c]][i][(k + (s > 0 ? 0 : 1)) % 3];
      if (i === 0) bottle(x, y + 0.008, -0.068, c, 0.3, 0.036, 0xc9a252, d); else if (i === 1) bottle(x, y + 0.008, -0.068, c, 0.2, 0.03, 0xf2efe6, d); else jar(x, y + 0.008, -0.068, c, 0.1, 0.034, 0xc9a252, d); } });
  parts[side] = { set: v => { d.rotation.y = -s * v * (s > 0 ? 1.5 : 1.6); vs[side] = v; glow(); } };
  d.userData.click = () => { const p = parts[side]; p.t = p.t ? 0 : 1; sound.tap(); }; }

/* --------------------------------------------------------- freezer drawer */
const fz = grp(0, 0.09, D);
{ const h = MID - 0.09 - 0.045, w = HW - 0.002; box(-w, w, 0, h, 0.002, 0.055, M.steel, fz); cyl(0.011, 0.66, M.steel, 0, h - 0.07, 0.1, fz, 16).rotation.z = Math.PI / 2; for (const k of [-1, 1]) cyl(0.007, 0.05, M.steel, k * 0.29, h - 0.07, 0.078, fz, 10).rotation.x = Math.PI / 2;
  box(-X + 0.01, X - 0.01, 0.02, 0.03, -0.5, 0, liner, fz); box(-X + 0.01, X - 0.01, 0.02, h - 0.2, -0.5, -0.49, liner, fz); for (const k of [-1, 1]) box(k * (X - 0.01) - (k > 0 ? 0.01 : 0), k * (X - 0.01) + (k < 0 ? 0.01 : 0), 0.02, h - 0.2, -0.5, 0, liner, fz);
  [0xf3e3c3, 0xf2b8c6, 0x9ad0c2, 0x7a5236].forEach((c, i) => { cyl(0.055, 0.1, std(c, 0.6), -0.3 + i * 0.125, 0.08, -0.12, fz); cyl(0.058, 0.012, std(0xfafafa, 0.6), -0.3 + i * 0.125, 0.136, -0.12, fz); });
  box(-0.36, -0.1, 0.03, 0.09, -0.42, -0.24, std(0x4f9a4a, 0.8), fz); box(-0.05, 0.16, 0.03, 0.08, -0.44, -0.22, std(0xc8dff0, 0.3), fz); box(0.2, 0.36, 0.03, 0.12, -0.42, -0.2, std(0xd9a441, 0.8), fz);
  parts.freezer = { set: v => { fz.position.z = D + v * 0.42; } };
  fz.userData.click = () => { const p = parts.freezer; p.t = p.t ? 0 : 1; sound.tap(); }; }

g.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = o.receiveShadow = true; });
return { parts };
  } });
