/* The fridge: a steel French-door fridge with a freezer drawer, built into a green housing with a cupboard over it.
   build() adds it to whatever `scene` it is given: the wall is z = 0, the doors towards +z, the floor is y = 0, metres.
   Both doors and the freezer drawer open; the light inside comes on with the doors. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Fridge', title: 'Fridge', line: 'French doors over a freezer drawer · click a door or the drawer to open it',
  at: [-3.12, -2.6], turn: 0, view: { target: [0, 1.15, 0.4], cam: [1.3, 1.7, 3.1] },
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
// crisper drawers
for (const k of [-1, 1]) { pane(k * 0.21 - 0.195, k * 0.21 + 0.195, 0.775, 1.03, 0.04, 0.47, clear); box(k * 0.21 - 0.1, k * 0.21 + 0.1, 0.99, 1.005, 0.47, 0.478, liner); }
/* ------------------------------------------------------------------ doors */
const DH = TOPY - MID - 0.006, vs = { l: 0, r: 0 };
const glow = () => { const v = Math.max(vs.l, vs.r); light.intensity = 2.2 * v; liner.emissiveIntensity = 0.3 * v; };
for (const s of [1, -1]) { const side = s > 0 ? 'l' : 'r', d = grp(-s * HW, MID + 0.003, D), w = HW - 0.002;      // s = 1: hinged on the left
  box(Math.min(0, s * w), Math.max(0, s * w), 0, DH, 0.002, 0.055, M.steel, d); box(Math.min(s * 0.03, s * (w - 0.02)), Math.max(s * 0.03, s * (w - 0.02)), 0.03, DH - 0.03, -0.012, 0.002, liner, d);
  cyl(0.011, 0.95, M.steel, s * (w - 0.045), DH / 2 - 0.1, 0.1, d, 16); for (const y of [-0.42, 0.42]) cyl(0.007, 0.05, M.steel, s * (w - 0.045), DH / 2 - 0.1 + y, 0.078, d, 10).rotation.x = Math.PI / 2;
  // bins on the inside of the door
  [0.12, 0.52, 0.92].forEach((y, i) => { pane(Math.min(s * 0.05, s * (w - 0.04)), Math.max(s * 0.05, s * (w - 0.04)), y, y + 0.09, -0.125, -0.012, clear, d); });
  parts[side] = { set: v => { d.rotation.y = -s * v * (s > 0 ? 1.5 : 1.6); vs[side] = v; glow(); } };
  d.userData.click = () => { const p = parts[side]; p.t = p.t ? 0 : 1; sound.tap(); }; }

/* --------------------------------------------------------- freezer drawer */
const fz = grp(0, 0.09, D);
{ const h = MID - 0.09 - 0.045, w = HW - 0.002; box(-w, w, 0, h, 0.002, 0.055, M.steel, fz); cyl(0.011, 0.66, M.steel, 0, h - 0.07, 0.1, fz, 16).rotation.z = Math.PI / 2; for (const k of [-1, 1]) cyl(0.007, 0.05, M.steel, k * 0.29, h - 0.07, 0.078, fz, 10).rotation.x = Math.PI / 2;
  box(-X + 0.01, X - 0.01, 0.02, 0.03, -0.5, 0, liner, fz); box(-X + 0.01, X - 0.01, 0.02, h - 0.2, -0.5, -0.49, liner, fz); for (const k of [-1, 1]) box(k * (X - 0.01) - (k > 0 ? 0.01 : 0), k * (X - 0.01) + (k < 0 ? 0.01 : 0), 0.02, h - 0.2, -0.5, 0, liner, fz);
  parts.freezer = { set: v => { fz.position.z = D + v * 0.42; } };
  fz.userData.click = () => { const p = parts.freezer; p.t = p.t ? 0 : 1; sound.tap(); }; }

g.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = o.receiveShadow = true; });
return { parts };
  } });
