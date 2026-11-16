/* The dining table: a round oak table for four on a wool rug, under a woven pendant, laid for a Filipino meal:
   a bilao of pancit and lumpia on banana leaf in the middle, bottles of suka, toyo and patis, a bowl of calamansi
   and a stone almires. build() adds it to whatever `scene` it is given, centred on x = z = 0, the floor is y = 0, metres. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Table', title: 'Dining table', line: 'Oak, for four, with a bilao of pancit and lumpia · click a chair to pull it out, the lamp to switch it',
  at: [-1.2, 2.6], turn: 0, view: { target: [0, 0.8, 0], cam: [1.1, 2.3, 3.3] },
  build({ THREE, scene, sound, kit, RH }) {
const { std, tex, rand, tools, M } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), rnd = rand(51), parts = {}, top = RH || 2.9, TY = 0.775;
const lathe = (pts, mat, parent, x = 0, y = 0, z = 0, seg = 40) => mk(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(...p)), seg), mat, parent, x, y, z);

/* ------------------------------------------------------ rug, table, chairs */
const wool = tex(256, 256, (c, w) => { c.fillStyle = '#8f9c86'; c.fillRect(0, 0, w, w); for (let i = 0; i < 5000; i++) { c.fillStyle = `rgba(${rnd() < 0.5 ? '50,60,45' : '255,255,255'},${0.05 + rnd() * 0.1})`; c.beginPath(); c.arc(rnd() * w, rnd() * w, 0.8 + rnd() * 1.8, 0, 7); c.fill(); } });
wool.wrapS = wool.wrapT = THREE.RepeatWrapping; wool.repeat.set(4, 4);
mk(new THREE.CylinderGeometry(1.35, 1.35, 0.012, 96), new THREE.MeshPhysicalMaterial({ map: wool, roughness: 1, sheen: 1, sheenRoughness: 0.5 }), g, 0, 0.006, 0);
cyl(0.62, 0.035, M.oak, 0, TY - 0.0175, 0, g, 96); mk(new THREE.CylinderGeometry(0.6, 0.56, 0.02, 96), M.oak, g, 0, TY - 0.045, 0);
cyl(0.055, 0.7, M.oak, 0, 0.38, 0, g, 24); mk(new THREE.CylinderGeometry(0.07, 0.3, 0.06, 48), M.iron, g, 0, 0.045, 0); cyl(0.3, 0.015, M.iron, 0, 0.0195, 0, g, 48);
for (let i = 0; i < 4; i++) { const p = grp(0, 0, 0); p.rotation.y = Math.PI / 4 + i * Math.PI / 2; const c = grp(0, 0, 0.78, p);
  box(-0.21, 0.21, 0.435, 0.47, -0.2, 0.2, M.oak, c); for (const x of [-0.18, 0.18]) { cyl(0.014, 0.435, M.iron, x, 0.2175, -0.17, c, 10); cyl(0.014, 0.9, M.iron, x, 0.45, 0.185, c, 10); }
  box(-0.2, 0.2, 0.8, 0.9, 0.172, 0.198, M.oak, c); for (const x of [-0.09, 0, 0.09]) cyl(0.007, 0.34, M.iron, x, 0.635, 0.185, c, 8);
  const q = parts['chair' + i] = { set: v => { c.position.z = 0.78 + v * 0.32; } }; c.userData.click = () => { q.t = q.t ? 0 : 1; sound.tap(); };
  // a place: plate, spoon and fork, a glass
  cyl(0.125, 0.006, M.ceramic, 0, TY + 0.003, 0.43, p, 48); mk(new THREE.TorusGeometry(0.118, 0.006, 8, 48).rotateX(Math.PI / 2), M.ceramic, p, 0, TY + 0.008, 0.43);
  for (const k of [-1, 1]) { box(k * 0.16 - 0.004, k * 0.16 + 0.004, TY, TY + 0.003, 0.38, 0.5, M.steel, p); mk(new THREE.SphereGeometry(0.014, 12, 8), M.steel, p, k * 0.16, TY + 0.003, 0.365).scale.set(k > 0 ? 1 : 0.8, 0.2, 1.5); }
  mk(new THREE.CylinderGeometry(0.032, 0.026, 0.1, 24, 1, true), M.glass, p, 0.13, TY + 0.05, 0.3).userData.through = true; }

/* ------------------------------------------------------------------ bilao */
const weave = tex(256, 256, (c, w) => { c.fillStyle = '#c9a25e'; c.fillRect(0, 0, w, w); for (let y = 0; y < w; y += 8) for (let x = 0; x < w; x += 8) { c.fillStyle = (x / 8 + y / 8) % 2 ? 'rgba(90,55,20,.35)' : 'rgba(255,235,180,.3)'; c.fillRect(x, y, 8, 8); } });
weave.wrapS = weave.wrapT = THREE.RepeatWrapping; weave.repeat.set(3, 3);
const b = grp(0, TY, 0); b.rotation.y = 0.4;
cyl(0.24, 0.008, std(0xffffff, 0.85, 0, { map: weave }), 0, 0.006, 0, b, 64); mk(new THREE.TorusGeometry(0.24, 0.014, 10, 64).rotateX(Math.PI / 2), std(0x9a6f35, 0.8), b, 0, 0.016, 0);
{ const leaf = tex(64, 64, (c, w) => { c.fillStyle = '#2f6b34'; c.fillRect(0, 0, w, w); c.strokeStyle = 'rgba(160,210,120,.35)'; c.lineWidth = 1; for (let i = 0; i < w; i += 4) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + 6, w); c.stroke(); } });
  cyl(0.215, 0.003, std(0xffffff, 0.45, 0, { map: leaf }), 0, 0.0125, 0, b, 48);
  // pancit: a heap of noodles with vegetables through it
  const heap = mk(new THREE.SphereGeometry(0.12, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), std(0xe2b866, 0.7), b, -0.07, 0.014, 0); heap.scale.set(1, 0.38, 1.25);
  for (let i = 0; i < 40; i++) { const a = rnd() * 6.28, d = Math.sqrt(rnd()) * 0.1, n = mk(new THREE.TorusGeometry(0.012 + rnd() * 0.012, 0.0022, 5, 12, 2 + rnd() * 3), std(0xedc878, 0.65), b, -0.07 + Math.cos(a) * d, 0.016 + 0.045 * (1 - d * d / 0.0105), Math.sin(a) * d * 1.25); n.rotation.set(Math.PI / 2 + rnd() - 0.5, 0, rnd() * 3); }
  for (let i = 0; i < 22; i++) { const a = rnd() * 6.28, d = Math.sqrt(rnd()) * 0.09, v = mk(new THREE.BoxGeometry(0.02, 0.004, 0.006), std([0xe8802a, 0x4f9a3a, 0x7fb04a, 0xe9d3a5][i % 4], 0.6), b, -0.07 + Math.cos(a) * d, 0.02 + 0.045 * (1 - d * d / 0.0105), Math.sin(a) * d * 1.25); v.rotation.y = rnd() * 3; }
  // lumpia, stacked like logs, and calamansi halves
  for (let i = 0; i < 9; i++) { const row = i < 5 ? 0 : 1, l = cyl(0.014, 0.1, std(0xc98a3c, 0.6), 0.11 + (row ? 0.004 : 0), 0.028 + row * 0.024, -0.075 + (i - row * 5) * 0.03 + row * 0.015, b, 12); l.rotation.z = Math.PI / 2; l.rotation.y = 0.08 * (i % 3 - 1); }
  for (const [x, z] of [[0.09, 0.13], [0.13, 0.11], [0.05, 0.16]]) { const c = mk(new THREE.SphereGeometry(0.016, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0x5f9a2f, 0.5), b, x, 0.03, z); c.rotation.x = Math.PI; mk(new THREE.CircleGeometry(0.0155, 16).rotateX(-Math.PI / 2), std(0xe9c94a, 0.4), b, x, 0.0305, z); } }

/* ------------------------------------- sawsawan, calamansi, almires, saucers */
const bottle = (x, z, c, h, cap, opts = {}) => { const m = std(c, 0.1, 0, opts); cyl(0.028, h * 0.62, m, x, TY + h * 0.31, z); mk(new THREE.CylinderGeometry(0.011, 0.028, h * 0.18, 20), m, g, x, TY + h * 0.71, z); cyl(0.011, h * 0.15, m, x, TY + h * 0.875, z, g, 12); cyl(0.013, h * 0.05, std(cap, 0.5), x, TY + h * 0.975, z, g, 12); };
bottle(0.36, -0.03, 0xf3efe0, 0.24, 0xb5271e, { transparent: true, opacity: 0.75 }); for (let i = 0; i < 4; i++) cyl(0.004, 0.025, std(i % 2 ? 0xc8321e : 0x4f9a3a, 0.5), 0.355 + i * 0.004, TY + 0.03 + i * 0.03, -0.03, g, 6).rotation.z = 0.6;   // suka with chilies
bottle(0.44, 0.03, 0x160a06, 0.22, 0x1c1d1f); bottle(0.4, -0.1, 0xb8742a, 0.2, 0xd9a441, { transparent: true, opacity: 0.85 });                                                           // toyo, patis
lathe([[0.025, 0], [0.045, 0.01], [0.062, 0.04]], M.ceramic, g, 0.0, TY, 0.36, 32); for (let i = 0; i < 12; i++) { const a = i * 2.4, r = 0.008 + (i % 4) * 0.011; mk(new THREE.SphereGeometry(0.014, 12, 10), std(i % 5 ? 0x5f9a2f : 0x8db33a, 0.5), g, Math.cos(a) * r, TY + 0.03 + (i % 3) * 0.008, 0.36 + Math.sin(a) * r); }
{ const stone = std(0x77777a, 0.9, 0, { side: THREE.DoubleSide }); lathe([[0, 0.02], [0.03, 0.02], [0.055, 0.075], [0.064, 0.075], [0.05, 0], [0, 0]], stone, g, -0.38, TY, 0.0, 24); const p = cyl(0.014, 0.12, stone, -0.365, TY + 0.085, 0.01, g, 12); p.rotation.set(0.3, 0, -0.5); }
for (const [x, z, c] of [[0.02, -0.36, 0x160a06], [0.14, -0.33, 0xe9e2d0]]) { lathe([[0.02, 0], [0.04, 0.006], [0.048, 0.02]], M.ceramic, g, x, TY, z, 24); cyl(0.04, 0.003, new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.1, clearcoat: 1 }), x, TY + 0.012, z, g, 24); }

/* ----------------------------------------------------------------- pendant */
const shade = std(0xffffff, 0.9, 0, { map: weave, side: THREE.DoubleSide, emissive: 0xffc98a, emissiveIntensity: 0 }), bulb = new THREE.MeshBasicMaterial({ color: 0x000000 });
const LY = 1.9, lamp = grp(0, LY, 0); cyl(0.003, top - LY - 0.3, M.black, 0, 0.3 + (top - LY - 0.3) / 2, 0, lamp, 6); cyl(0.05, 0.02, M.brass, 0, top - LY - 0.01, 0, lamp);
mk(new THREE.SphereGeometry(0.32, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), shade, lamp).scale.y = 0.95; mk(new THREE.SphereGeometry(0.04, 20, 14), bulb, lamp, 0, 0.1, 0);
const light = new THREE.PointLight(0xffe2bd, 0, 4.5, 1.6); light.position.set(0, 0.05, 0); lamp.add(light);
lamp.userData.click = () => { const p = parts.lamp; p.t = p.t ? 0 : 1; sound.click(); };
parts.lamp = { on: 1, set: v => { light.intensity = 2 * v; bulb.color.setRGB(3.4 * v, 3 * v, 2.3 * v); shade.emissiveIntensity = 0.25 * v; } };

g.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = o.receiveShadow = true; });
return { parts };
  } });
