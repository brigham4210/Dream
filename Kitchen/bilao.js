/* The Filipino spread, laid out on the island: a woven bilao lined with banana leaf holding pancit and lumpia, bottles of
   suka, toyo and patis, a bowl of calamansi and a stone almires. build() adds it to whatever `scene` it is given, in the
   island's frame (centred on x = z = 0, the stools towards +z, the floor is y = 0, metres), standing on the marble at y = 0.92. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Bilao', title: 'Bilao of pancit and lumpia', line: 'On banana leaf, with suka, toyo, patis and calamansi',
  at: [0.3, 0.45], turn: 0, view: { target: [0.35, 0.98, 0.3], cam: [0.75, 1.75, 1.75] },
  build({ THREE, scene, kit }) {
const { std, tex, rand, tools, M } = kit, g = new THREE.Group(); g.position.set(0.3, 0.92, 0.3); scene.add(g);
const { mk, cyl, grp } = tools(g), rnd = rand(51);
const lathe = (pts, mat, parent, x = 0, y = 0, z = 0, seg = 40) => mk(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(...p)), seg), mat, parent, x, y, z);

/* ------------------------------------------------------------------ bilao */
const weave = tex(256, 256, (c, w) => { c.fillStyle = '#c9a25e'; c.fillRect(0, 0, w, w); for (let y = 0; y < w; y += 8) for (let x = 0; x < w; x += 8) { c.fillStyle = (x / 8 + y / 8) % 2 ? 'rgba(90,55,20,.35)' : 'rgba(255,235,180,.3)'; c.fillRect(x, y, 8, 8); } });
weave.wrapS = weave.wrapT = THREE.RepeatWrapping; weave.repeat.set(3, 3);
const b = grp(0, 0, 0); b.rotation.y = 0.4;
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

/* ----------------------------------------------- sawsawan, calamansi, almires */
const bottle = (x, z, c, h, cap, opts = {}) => { const m = std(c, 0.1, 0, opts); cyl(0.028, h * 0.62, m, x, h * 0.31, z); mk(new THREE.CylinderGeometry(0.011, 0.028, h * 0.18, 20), m, g, x, h * 0.71, z); cyl(0.011, h * 0.15, m, x, h * 0.875, z, g, 12); cyl(0.013, h * 0.05, std(cap, 0.5), x, h * 0.975, z, g, 12); };
bottle(0.36, -0.03, 0xf3efe0, 0.24, 0xb5271e, { transparent: true, opacity: 0.75 }); for (let i = 0; i < 4; i++) cyl(0.004, 0.025, std(i % 2 ? 0xc8321e : 0x4f9a3a, 0.5), 0.355 + i * 0.004, 0.03 + i * 0.03, -0.03, g, 6).rotation.z = 0.6;   // suka with chilies
bottle(0.44, 0.03, 0x160a06, 0.22, 0x1c1d1f); bottle(0.4, -0.1, 0xb8742a, 0.2, 0xd9a441, { transparent: true, opacity: 0.85 });                                                      // toyo, patis
lathe([[0.025, 0], [0.045, 0.01], [0.062, 0.04]], M.ceramic, g, -0.3, 0, 0.2, 32); for (let i = 0; i < 12; i++) { const a = i * 2.4, r = 0.008 + (i % 4) * 0.011; mk(new THREE.SphereGeometry(0.014, 12, 10), std(i % 5 ? 0x5f9a2f : 0x8db33a, 0.5), g, -0.3 + Math.cos(a) * r, 0.03 + (i % 3) * 0.008, 0.2 + Math.sin(a) * r); }
{ const stone = std(0x77777a, 0.9, 0, { side: THREE.DoubleSide }); lathe([[0, 0.02], [0.03, 0.02], [0.055, 0.075], [0.064, 0.075], [0.05, 0], [0, 0]], stone, g, -0.34, 0, -0.02, 24); const p = cyl(0.014, 0.12, stone, -0.325, 0.085, -0.01, g, 12); p.rotation.set(0.3, 0, -0.5); }

g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = o.receiveShadow = true; });
return { parts: {} };
  } });
