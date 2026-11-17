/* The comal counter, for Mexican food and pupusas: a steel flat-top set into a marble worktop, with a spatula on it,
   beside a clay bowl, a molcajete and a cloth-lined tortilla basket. build() adds it to whatever `scene` it is given: the wall is z = 0,
   the front towards +z, the floor is y = 0, metres. Click the knob to heat the comal. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Comal', title: 'Comal for tortillas and pupusas', line: 'A steel flat-top in marble · click the knob to heat it',
  at: [-3.6, 2.7], turn: Math.PI / 2, view: { target: [0.05, 1.0, 0.3], cam: [0.45, 1.75, 2.0] },
  build({ THREE, scene, sound, kit }) {
const { std, tex, rand, tools, M, front, pull, slab, steam } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), rnd = rand(43), parts = {};
const HX = 0.9, D = 0.6, H = 0.88, TOP = 0.92;
const lathe = (pts, mat, parent, x = 0, y = 0, z = 0, seg = 40) => mk(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(...p)), seg), mat, parent, x, y, z);

/* --------------------------------------------------------------- cabinets */
box(-HX, HX, 0.1, H, 0, D, M.paint); box(-HX + 0.05, HX - 0.05, 0, 0.1, 0, D - 0.06, M.black);
for (let i = 0; i < 3; i++) { const w = 2 * HX / 3, f = front(w - 0.006, H - 0.11, M.paint, g, -HX + (i + 0.5) * w, (H + 0.1) / 2, D + 0.008); pull(f, 0, (H - 0.11) / 2 - 0.1, 0.014, 0.16); }
g.add(slab(-HX - 0.01, HX + 0.01, 0, D + 0.05, H, TOP, M.marble));

/* ------------------------------------------------------------------ comal */
const CX0 = -0.02, CX1 = 0.8, CZ0 = 0.1, CZ1 = 0.54, CY = TOP + 0.022, plate = std(0x242528, 0.38, 0.8, { emissive: 0xff5a1a, emissiveIntensity: 0 });
box(CX0 - 0.02, CX1 + 0.02, TOP, TOP + 0.012, CZ0 - 0.02, CZ1 + 0.02, M.steel); box(CX0, CX1, TOP + 0.012, CY, CZ0, CZ1, plate); box(CX0 - 0.02, CX1 + 0.02, TOP, TOP + 0.07, CZ0 - 0.03, CZ0 - 0.02, M.steel);
box(CX0 + 0.1, CX1 - 0.1, H - 0.06, H - 0.003, D + 0.02, D + 0.04, M.black); const kn = grp(0.6, H - 0.03, D + 0.04); cyl(0.022, 0.03, M.brass, 0, 0, 0.015, kn, 24).rotation.x = Math.PI / 2; box(-0.003, 0.003, 0.004, 0.02, 0.03, 0.032, M.black, kn);
const flips = [];
{ const s = grp(0.72, CY + 0.004, 0.44); s.rotation.y = -0.5; box(-0.045, 0.045, 0, 0.002, -0.05, 0.05, M.steel, s); const h = box(-0.008, 0.008, 0, 0.004, 0.05, 0.14, M.steel, s); h.rotation.x = -0.3; h.position.y = 0.02; cyl(0.012, 0.1, M.oak, 0, 0.055, 0.2, s, 12).rotation.x = Math.PI / 2 - 0.3; }
const puffs = steam(g, 0.38, CY + 0.03, 0.32, 8, 0.22, 0.5);
parts.heat = { set: v => { kn.rotation.z = -v * 1.9; plate.emissiveIntensity = 0.012 * v; } };
kn.userData.click = () => { const p = parts.heat; p.t = p.t ? 0 : 1; sound.click(); };

/* ------------------------------ a clay bowl, the molcajete, a tortilla basket */
const Y = TOP, clay = std(0xa8552e, 0.7, 0, { side: THREE.DoubleSide });
lathe([[0.05, 0], [0.1, 0.02], [0.135, 0.09]], clay, g, -0.62, Y, 0.3);
{ const m = grp(-0.3, Y, 0.17), stone = std(0x3a3a3d, 0.95, 0, { side: THREE.DoubleSide });
  lathe([[0, 0.05], [0.06, 0.055], [0.1, 0.1], [0.11, 0.1], [0.085, 0.04], [0, 0.035]], stone, m, 0, 0, 0, 24); for (let i = 0; i < 3; i++) cyl(0.018, 0.045, stone, Math.cos(i * 2.09) * 0.055, 0.0225, Math.sin(i * 2.09) * 0.055, m, 8);
  const t = cyl(0.02, 0.09, stone, 0.05, 0.1, 0.02, m, 10); t.rotation.set(0.3, 0, -0.9); }
{ const b = grp(-0.14, Y, 0.14); mk(new THREE.CylinderGeometry(0.1, 0.085, 0.06, 32, 1, true), std(0xb58a4a, 0.9, 0, { side: THREE.DoubleSide }), b, 0, 0.03, 0); cyl(0.085, 0.006, std(0xb58a4a, 0.9), 0, 0.003, 0, b, 32); mk(new THREE.CylinderGeometry(0.108, 0.09, 0.012, 32), std(0xc8402a, 0.95), b, 0, 0.062, 0); }

g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = o.receiveShadow = true; });
function tick(dt) {
  for (const s of flips) { if (s.t < 0) continue; s.t += dt; const k = Math.min(1, s.t / 0.55); s.m.position.y = s.y + 0.13 * Math.sin(k * Math.PI); s.m.rotation.x = (s.side + k) * Math.PI; if (k >= 1) { s.t = -1; s.side = 1 - s.side; } } }
return { parts, tick };
  } });
