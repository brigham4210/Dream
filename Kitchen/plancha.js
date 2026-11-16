/* The comal counter, for Mexican food and pupusas: a steel flat-top set into a marble worktop with pupusas and tortillas
   on it, beside a bowl of masa, a molcajete of guacamole, a jar of curtido, salsa roja, limes, avocados, a basket of warm
   tortillas, and a ristra of dried chiles on the wall. build() adds it to whatever `scene` it is given: the wall is z = 0,
   the front towards +z, the floor is y = 0, metres. Click the knob to heat the comal, a pupusa or tortilla to flip it. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Comal', title: 'Comal for tortillas and pupusas', line: 'A steel flat-top in marble · click the knob to heat it, a pupusa or tortilla to flip it',
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
// masa browned in patches where it met the steel
const spots = (base, seed) => tex(128, 128, (c, w) => { let s = seed; const r = () => (s = s * 16807 % 2147483647) / 2147483647; c.fillStyle = base; c.fillRect(0, 0, w, w); for (let i = 0; i < 26; i++) { c.fillStyle = `rgba(${110 + r() * 50},${60 + r() * 30},20,${0.2 + r() * 0.4})`; c.beginPath(); c.ellipse(r() * w, r() * w, 4 + r() * 12, 3 + r() * 8, r() * 3, 0, 7); c.fill(); } });
const pupusa = std(0xffffff, 0.8, 0, { map: spots('#ecd9a6', 5) }), tortilla = std(0xffffff, 0.85, 0, { map: spots('#f0e0b4', 11) }), blue = std(0xffffff, 0.85, 0, { map: spots('#5a6078', 17) });
const flips = [[0.12, 0.2, 0.068, 0.016, pupusa], [0.29, 0.22, 0.07, 0.016, pupusa], [0.14, 0.42, 0.066, 0.016, pupusa], [0.31, 0.43, 0.07, 0.016, pupusa], [0.5, 0.21, 0.075, 0.004, tortilla], [0.68, 0.24, 0.075, 0.004, blue], [0.55, 0.42, 0.075, 0.004, tortilla]].map(([x, z, r, h, mat]) => {
  const m = mk(new THREE.CylinderGeometry(r, r, h, 32), mat, g, x, CY + h / 2, z); m.scale.z = 0.94 + rnd() * 0.1; m.rotation.y = rnd() * 3; const s = { m, y: CY + h / 2, t: -1, side: 0 };
  m.userData.click = () => { if (s.t < 0) { s.t = 0; sound.toss(); } }; return s; });
{ const s = grp(0.72, CY + 0.004, 0.44); s.rotation.y = -0.5; box(-0.045, 0.045, 0, 0.002, -0.05, 0.05, M.steel, s); const h = box(-0.008, 0.008, 0, 0.004, 0.05, 0.14, M.steel, s); h.rotation.x = -0.3; h.position.y = 0.02; cyl(0.012, 0.1, M.oak, 0, 0.055, 0.2, s, 12).rotation.x = Math.PI / 2 - 0.3; }
const puffs = steam(g, 0.38, CY + 0.03, 0.32, 8, 0.22, 0.5);
parts.heat = { set: v => { kn.rotation.z = -v * 1.9; plate.emissiveIntensity = 0.012 * v; } };
kn.userData.click = () => { const p = parts.heat; p.t = p.t ? 0 : 1; sound.click(); sound.loop('griddle', p.t); };

/* ------------------------------------------ masa, guacamole, curtido, salsa */
const Y = TOP, clay = std(0xa8552e, 0.7, 0, { side: THREE.DoubleSide });
lathe([[0.05, 0], [0.1, 0.02], [0.135, 0.09]], clay, g, -0.62, Y, 0.3); mk(new THREE.SphereGeometry(0.1, 32, 16), std(0xf0e2b6, 0.85), g, -0.62, Y + 0.075, 0.3).scale.y = 0.6;
for (const [x, z] of [[-0.42, 0.44], [-0.36, 0.38]]) mk(new THREE.SphereGeometry(0.034, 20, 14), std(0xf0e2b6, 0.85), g, x, Y + 0.03, z).scale.y = 0.85;                       // balls of masa waiting to be patted out
{ const m = grp(-0.3, Y, 0.17), stone = std(0x3a3a3d, 0.95, 0, { side: THREE.DoubleSide });                                                                            // the molcajete
  lathe([[0, 0.05], [0.06, 0.055], [0.1, 0.1], [0.11, 0.1], [0.085, 0.04], [0, 0.035]], stone, m, 0, 0, 0, 24); for (let i = 0; i < 3; i++) cyl(0.018, 0.045, stone, Math.cos(i * 2.09) * 0.055, 0.0225, Math.sin(i * 2.09) * 0.055, m, 8);
  mk(new THREE.SphereGeometry(0.088, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(0x8db33a, 0.7), m, 0, 0.07, 0).scale.y = 0.3; for (let i = 0; i < 12; i++) { const a = rnd() * 6.28, d = rnd() * 0.06; mk(new THREE.BoxGeometry(0.01, 0.006, 0.01), std(i % 2 ? 0xc8321e : 0xf1f1e6, 0.6), m, Math.cos(a) * d, 0.094, Math.sin(a) * d); }
  const t = cyl(0.02, 0.09, stone, 0.06, 0.12, 0.03, m, 10); t.rotation.set(0.3, 0, -0.6); }
{ const x = -0.78, z = 0.14, h = 0.2; mk(new THREE.CylinderGeometry(0.065, 0.065, h, 28, 1, true), M.glass, g, x, Y + h / 2, z).userData.through = true; cyl(0.059, h * 0.85, std(0xe6e4c4, 0.9), x, Y + h * 0.43, z); cyl(0.067, 0.02, M.brass, x, Y + h + 0.01, z);            // curtido
  for (let i = 0; i < 26; i++) { const a = rnd() * 6.28; mk(new THREE.BoxGeometry(0.02, 0.004, 0.003), std(i % 3 ? 0xe8802a : 0xa3305a, 0.7), g, x + Math.cos(a) * 0.0595, Y + 0.02 + rnd() * h * 0.78, z + Math.sin(a) * 0.0595).rotation.set(rnd(), -a, rnd() * 3); } }
lathe([[0.03, 0], [0.06, 0.012], [0.075, 0.05]], clay, g, -0.52, Y, 0.12, 32); cyl(0.066, 0.004, new THREE.MeshPhysicalMaterial({ color: 0xa3200f, roughness: 0.2, clearcoat: 1 }), -0.52, Y + 0.04, 0.12, g, 32);
for (const [x, z] of [[-0.8, 0.42], [-0.74, 0.47], [-0.79, 0.5]]) mk(new THREE.SphereGeometry(0.026, 16, 12), std(0x5f9a2f, 0.5), g, x, Y + 0.026, z);
for (const [x, z, r] of [[-0.14, 0.42, 0.4], [-0.2, 0.5, 2]]) { const a = mk(new THREE.SphereGeometry(0.04, 20, 14), std(0x26351c, 0.75), g, x, Y + 0.036, z); a.scale.set(1, 0.9, 1.45); a.rotation.y = r; }
// tortillas kept warm in a cloth-lined basket
{ const b = grp(-0.14, Y, 0.14); mk(new THREE.CylinderGeometry(0.1, 0.085, 0.06, 32, 1, true), std(0xb58a4a, 0.9, 0, { side: THREE.DoubleSide }), b, 0, 0.03, 0); cyl(0.085, 0.006, std(0xb58a4a, 0.9), 0, 0.003, 0, b, 32);
  mk(new THREE.CylinderGeometry(0.108, 0.09, 0.012, 32), std(0xc8402a, 0.95), b, 0, 0.062, 0); for (let i = 0; i < 5; i++) cyl(0.078, 0.004, tortilla, (rnd() - 0.5) * 0.01, 0.07 + i * 0.0045, (rnd() - 0.5) * 0.01, b, 32); }
// dried chiles on a string
cyl(0.003, 0.2, std(0xc9b48a, 0.9), -0.45, 1.95, 0.03, g, 6); for (let i = 0; i < 26; i++) { const a = i * 2.4, y = 1.84 - i * 0.02, c = mk(new THREE.ConeGeometry(0.014, 0.1, 8), new THREE.MeshPhysicalMaterial({ color: i % 4 ? 0x8a1410 : 0x5a0f0c, roughness: 0.35, clearcoat: 0.6 }), g, -0.45 + Math.cos(a) * 0.03, y, 0.05 + Math.abs(Math.sin(a)) * 0.03); c.rotation.set(Math.PI + Math.sin(a) * 0.5, 0, Math.cos(a) * 0.6); }

g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = o.receiveShadow = true; });
function tick(dt) { puffs(dt, parts.heat.v * 0.8);
  for (const s of flips) { if (s.t < 0) continue; s.t += dt; const k = Math.min(1, s.t / 0.55); s.m.position.y = s.y + 0.13 * Math.sin(k * Math.PI); s.m.rotation.x = (s.side + k) * Math.PI; if (k >= 1) { s.t = -1; s.side = 1 - s.side; } } }
return { parts, tick };
  } });
