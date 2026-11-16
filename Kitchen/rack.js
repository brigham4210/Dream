/* The French corner: copper pans on a brass rail and copper pots on an oak shelf, over a marble-topped sideboard set for
   pastry (rolling pin, dough, flour, butter, a berry tart) with baguettes in a basket and cheese under a glass dome.
   build() adds it to whatever `scene` it is given: the wall is z = 0, the front towards +z, the floor is y = 0, metres.
   Click a pan to knock it; click the dome to lift it. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Pot rack', title: 'Copper pans and the pastry sideboard', line: 'Copper on brass, pastry on marble · click a pan to ring it, the glass dome to lift it',
  at: [3.6, -0.6], turn: -Math.PI / 2, view: { target: [0, 1.35, 0.2], cam: [0.25, 1.75, 2.45] },
  build({ THREE, scene, sound, kit }) {
const { std, tex, rand, tools, M, front, pull, slab } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), rnd = rand(91), parts = {};
const copper = std(0xc0703f, 0.22, 1, { side: THREE.DoubleSide }), HX = 0.85, D = 0.45, TOP = 0.9;
const lathe = (pts, mat, parent, x = 0, y = 0, z = 0, seg = 40) => mk(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(...p)), seg), mat, parent, x, y, z);

/* -------------------------------------------------------------- sideboard */
box(-HX, HX, 0.1, TOP - 0.04, 0, D, M.paint); box(-HX + 0.05, HX - 0.05, 0, 0.1, 0, D - 0.05, M.black);
for (let i = 0; i < 3; i++) { const w = 2 * HX / 3, f = front(w - 0.006, TOP - 0.16, M.paint, g, -HX + (i + 0.5) * w, (TOP + 0.07) / 2, D + 0.008); pull(f, 0, (TOP - 0.16) / 2 - 0.1, 0.014, 0.16); }
g.add(slab(-HX - 0.02, HX + 0.02, 0, D + 0.04, TOP - 0.04, TOP, M.marble));
// pastry: flour on the marble, a round of dough under the rolling pin, butter, eggs and a finished tart
mk(new THREE.CircleGeometry(0.2, 40).rotateX(-Math.PI / 2), std(0xffffff, 1, 0, { transparent: true, opacity: 0.5 }), g, -0.42, TOP + 0.001, 0.26).userData.through = true;
cyl(0.15, 0.006, std(0xf0e2bd, 0.85), -0.42, TOP + 0.004, 0.26, g, 48);
{ const p = grp(-0.4, TOP + 0.033, 0.26); p.rotation.y = 0.5; cyl(0.026, 0.26, M.oak, 0, 0, 0, p, 24).rotation.z = Math.PI / 2; for (const k of [-1, 1]) cyl(0.012, 0.09, M.oak, k * 0.175, 0, 0, p, 12).rotation.z = Math.PI / 2; }
box(-0.8, -0.67, TOP, TOP + 0.2, 0.06, 0.15, std(0xe9dfc8, 0.95)); box(-0.8, -0.67, TOP + 0.2, TOP + 0.225, 0.085, 0.125, std(0xd9cdb0, 0.95)); box(-0.775, -0.695, TOP + 0.07, TOP + 0.13, 0.151, 0.152, std(0x39506b, 0.9));
box(-0.72, -0.56, TOP, TOP + 0.008, 0.3, 0.4, M.ceramic); box(-0.7, -0.6, TOP + 0.008, TOP + 0.045, 0.315, 0.385, std(0xf5df8a, 0.5));
lathe([[0.03, 0], [0.06, 0.012], [0.075, 0.045]], M.ceramic, g, -0.12, TOP, 0.12, 32); for (const [x, z] of [[-0.14, 0.11], [-0.1, 0.1], [-0.12, 0.14]]) mk(new THREE.SphereGeometry(0.022, 16, 12), std(0xe9d3b5, 0.6), g, x, TOP + 0.04, z).scale.y = 1.25;
{ const t = grp(-0.1, TOP, 0.33); lathe([[0, 0.003], [0.09, 0.003], [0.11, 0.03], [0.114, 0.03], [0.094, 0], [0, 0]], std(0xc98a3c, 0.75, 0, { side: THREE.DoubleSide }), t); cyl(0.098, 0.004, new THREE.MeshPhysicalMaterial({ color: 0xf2e3b0, roughness: 0.3, clearcoat: 0.6 }), 0, 0.022, 0, t, 40);
  for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 0.012 + Math.sqrt(i / 26) * 0.076; mk(new THREE.SphereGeometry(0.011, 10, 8), new THREE.MeshPhysicalMaterial({ color: i % 4 ? 0xb0203a : 0x3b3f8a, roughness: 0.25, clearcoat: 1 }), t, Math.cos(a) * r, 0.03, Math.sin(a) * r); } }
// bread and cheese
{ const weave = tex(128, 128, (c, w) => { c.fillStyle = '#b58a4a'; c.fillRect(0, 0, w, w); for (let y = 0; y < w; y += 8) for (let x = 0; x < w; x += 16) { c.fillStyle = 'rgba(70,40,15,.4)'; c.fillRect(x + (y / 8 % 2) * 8, y, 8, 7); } });
  weave.wrapS = weave.wrapT = THREE.RepeatWrapping; weave.repeat.set(6, 2);
  mk(new THREE.CylinderGeometry(0.1, 0.08, 0.2, 32, 1, true), std(0xffffff, 0.9, 0, { map: weave, side: THREE.DoubleSide }), g, 0.7, TOP + 0.1, 0.24); cyl(0.08, 0.008, std(0x8a6a3a, 0.9), 0.7, TOP + 0.004, 0.24);
  for (const [dx, dz, rz, rx] of [[-0.03, 0, 0.14, 0.1], [0.03, -0.02, -0.1, -0.12], [0, 0.03, 0.02, 0.2]]) { const b = grp(0.7 + dx, TOP + 0.02, 0.24 + dz); b.rotation.set(rx, 0, rz); mk(new THREE.CapsuleGeometry(0.03, 0.46, 6, 16), std(0xc48a3c, 0.8), b, 0, 0.26, 0); for (let i = 0; i < 4; i++) { const s = box(-0.02, 0.02, 0.2 + i * 0.07, 0.205 + i * 0.07, 0.027, 0.031, std(0xe9d3a5, 0.9), b); s.rotation.z = 0.6; } }
  const c = grp(0.32, TOP, 0.24); cyl(0.17, 0.02, M.oak, 0, 0.01, 0, c, 48);
  mk(new THREE.CylinderGeometry(0.1, 0.1, 0.035, 32, 1, false, 0, 1.1), std(0xf4eedd, 0.7, 0, { side: THREE.DoubleSide }), c, -0.06, 0.038, 0.02); cyl(0.05, 0.03, std(0xf7f3e6, 0.75), 0.07, 0.035, -0.05, c, 32);
  box(0.02, 0.1, 0.02, 0.06, 0.04, 0.09, std(0xe9e2c0, 0.8), c).rotation.y = 0.4; for (let i = 0; i < 9; i++) mk(new THREE.SphereGeometry(0.004, 6, 6), std(0x3a5a6a, 0.8), c, 0.03 + rnd() * 0.06, 0.061, 0.045 + rnd() * 0.04);
  for (let i = 0; i < 14; i++) mk(new THREE.SphereGeometry(0.013, 12, 10), new THREE.MeshPhysicalMaterial({ color: 0x4a1f4a, roughness: 0.3, clearcoat: 0.8 }), c, -0.04 + (i % 4) * 0.022 + rnd() * 0.01, 0.033 + (i % 3) * 0.012, -0.1 + (i >> 2) * 0.02);
  const dome = grp(0, 0.02, 0, c); mk(new THREE.SphereGeometry(0.16, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), M.glass, dome).scale.y = 0.85; mk(new THREE.SphereGeometry(0.018, 16, 12), M.glass, dome, 0, 0.15, 0);
  parts.dome = { set: v => { dome.position.set(v * 0.06, 0.02 + v * 0.3, 0); dome.rotation.z = -v * 0.35; } }; dome.userData.click = () => { const p = parts.dome; p.t = p.t ? 0 : 1; sound.click(); }; }

/* ------------------------------------------------------- shelf, rail, pans */
const SY = 2.08, RY = 1.88, RZ = 0.11;
box(-0.75, 0.75, SY - 0.035, SY, 0, 0.26, M.oak); for (const x of [-0.62, 0.62]) { box(x - 0.006, x + 0.006, SY - 0.28, SY - 0.035, 0, 0.012, M.brass); box(x - 0.006, x + 0.006, SY - 0.047, SY - 0.035, 0, 0.23, M.brass); cyl(0.005, RZ, M.brass, x, RY, RZ / 2, g, 8).rotation.x = Math.PI / 2; }
cyl(0.008, 1.3, M.brass, 0, RY, RZ, g, 12).rotation.z = Math.PI / 2;
[[-0.45, 0.13, 0.13], [-0.1, 0.11, 0.16], [0.22, 0.09, 0.12], [0.5, 0.11, 0.09]].forEach(([x, r, h]) => { mk(new THREE.CylinderGeometry(r, r, h, 40, 1, true), copper, g, x, SY + h / 2, 0.13); cyl(r, 0.004, copper, x, SY + 0.002, 0.13, g, 40); cyl(r + 0.004, 0.008, M.brass, x, SY + h, 0.13, g, 40); const hd = box(x + r, x + r + 0.16, SY + h - 0.03, SY + h - 0.018, 0.12, 0.14, M.brass); hd.rotation.y = 0.5; hd.position.z = 0.17; });
const pans = [[-0.47, 0.14], [-0.2, 0.12], [0.04, 0.105], [0.25, 0.09], [0.43, 0.075]].map(([x, r]) => { const p = grp(x, RY, RZ); mk(new THREE.TorusGeometry(0.014, 0.0025, 6, 16, Math.PI * 1.5), M.brass, p, 0, -0.014, 0).rotation.y = Math.PI / 2;
  box(-0.009, 0.009, -0.24, -0.02, -0.004, 0.004, M.brass, p); lathe([[0, 0], [r * 0.82, 0], [r, 0.05], [r + 0.004, 0.05]], copper, p, 0, -0.235 - r, -0.025).rotation.x = Math.PI / 2;
  const s = { p, t: -1, f: 34 / r }; p.userData.click = () => { s.t = 0; sound.clang(s.f); }; return s; });

g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = o.receiveShadow = true; });
function tick(dt) { for (const s of pans) { if (s.t < 0) continue; s.t += dt; const a = Math.exp(-s.t * 1.1); s.p.rotation.z = 0.22 * a * Math.sin(s.t * 6.5); if (a < 0.02) { s.t = -1; s.p.rotation.z = 0; } } }
return { parts, tick };
  } });
