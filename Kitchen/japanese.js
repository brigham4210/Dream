/* The Japanese counter: the left half of the second island. Nigiri and maki on a wooden geta, a hangiri of sushi rice,
   a block of salmon under a yanagiba, a bowl of ramen, a konro grill of yakitori and an iron teapot.
   build() adds it to whatever `scene` it is given, centred on x = z = 0, you stand at +z, the floor is y = 0, metres.
   Click the konro to light it. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Japanese', title: 'Japanese counter', line: 'Sushi, ramen and yakitori · click the konro grill to light it',
  at: [-1.675, 2.6], turn: 0, view: { target: [0, 0.98, 0], cam: [0.45, 1.95, 2.2] },
  build({ THREE, scene, sound, kit }) {
const { std, tex, rand, tools, M, front, steam } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), rnd = rand(83), parts = {};
const HX = 0.625, HZ = 0.4, H = 0.86, Y = 0.92, hinoki = std(0xf0d9b0, 0.6), lacquer = new THREE.MeshPhysicalMaterial({ color: 0x15100e, roughness: 0.2, clearcoat: 1 });
const lathe = (pts, mat, parent, x = 0, y = 0, z = 0, seg = 40) => mk(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(...p)), seg), mat, parent, x, y, z);
const gloss = (c, r = 0.3) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, clearcoat: 0.8 });

/* ---------------------------------------------------------------- counter */
box(-HX, HX, 0.1, H, -HZ + 0.03, HZ - 0.03, M.paint); box(-HX + 0.05, HX - 0.05, 0, 0.1, -HZ + 0.08, HZ - 0.08, M.black); box(-HX, HX, H, Y, -HZ, HZ, M.oak);
for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { const f = front(HX - 0.006, H - 0.11, M.paint, g, -HX / 2 + i * HX, (H + 0.1) / 2, s * (HZ - 0.022)); if (s < 0) f.rotation.y = Math.PI; }
{ const f = front(2 * HZ - 0.066, H - 0.11, M.paint, g, -HX - 0.008, (H + 0.1) / 2, 0); f.rotation.y = -Math.PI / 2; }

/* ------------------------------------------------------------------ sushi */
{ const s = grp(-0.3, Y, 0.17); s.rotation.y = 0.08; box(-0.2, 0.2, 0.025, 0.045, -0.11, 0.11, hinoki, s); for (const x of [-0.14, 0.14]) box(x - 0.015, x + 0.015, 0, 0.025, -0.11, 0.11, hinoki, s);
  const rice = std(0xfbfaf4, 0.85), nori = std(0x12160f, 0.7), tops = [0xf08a4a, 0xb5202a, 0xf08a4a, 0xf2c94a, 0xb5202a, 0xf4e6dc];
  tops.forEach((c, i) => { const n = grp(-0.15 + i * 0.06, 0.045, -0.045, s); n.rotation.y = 0.5; mk(new THREE.CapsuleGeometry(0.014, 0.03, 6, 12).rotateZ(Math.PI / 2), rice, n, 0, 0.013, 0).scale.set(1, 0.85, 1.1);
    const t = mk(new THREE.BoxGeometry(0.066, 0.008, 0.03), gloss(c), n, 0, 0.03, 0); t.rotation.z = 0.04; if (i === 3) box(-0.006, 0.006, 0, 0.036, -0.017, 0.017, nori, n); if (i === 5) for (const x of [-0.02, 0, 0.02]) box(x - 0.003, x + 0.003, 0.034, 0.0345, -0.015, 0.015, std(0xf08a4a, 0.5), n); });
  for (let i = 0; i < 6; i++) { const x = -0.15 + i * 0.045; cyl(0.02, 0.026, nori, x, 0.058, 0.055, s, 20); cyl(0.0175, 0.027, rice, x, 0.058, 0.055, s, 20); cyl(0.007, 0.028, gloss(i % 2 ? 0x4f9a3a : 0xb5202a), x, 0.058, 0.055, s, 10); }
  for (let i = 0; i < 6; i++) mk(new THREE.CircleGeometry(0.016, 10).rotateX(-Math.PI / 2 + 0.5), std(0xf2b8c0, 0.6, 0, { side: THREE.DoubleSide }), s, 0.15 + rnd() * 0.02, 0.05 + i * 0.003, 0.05 + rnd() * 0.02).rotation.y = rnd() * 3;
  mk(new THREE.ConeGeometry(0.012, 0.016, 10), std(0x8db33a, 0.8), s, 0.16, 0.053, -0.05); }
lathe([[0.012, 0], [0.03, 0.004], [0.036, 0.014]], M.ceramic, g, -0.03, Y, 0.32, 24); cyl(0.03, 0.002, gloss(0x160a06, 0.1), -0.03, Y + 0.008, 0.32, g, 20);
cyl(0.024, 0.07, gloss(0x160a06, 0.1), 0.05, Y + 0.035, 0.33, g, 20); mk(new THREE.CylinderGeometry(0.012, 0.024, 0.02, 20), std(0xb5271e, 0.4), g, 0.05, Y + 0.08, 0.33);
// sushi rice in its tub, with the paddle
{ const h = grp(-0.4, Y, -0.2); mk(new THREE.CylinderGeometry(0.15, 0.15, 0.075, 48, 1, true), std(0xf0d9b0, 0.6, 0, { side: THREE.DoubleSide }), h, 0, 0.0375, 0); cyl(0.15, 0.008, hinoki, 0, 0.004, 0, h, 48); for (const y of [0.015, 0.058]) cyl(0.152, 0.008, std(0xc0703f, 0.3, 1), 0, y, 0, h, 48);
  mk(new THREE.SphereGeometry(0.143, 32, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0xfdfcf8, 0.95), h, 0, 0.045, 0).scale.y = 0.16; const p = grp(0.04, 0.075, 0.02, h); p.rotation.set(0.25, 0.7, 0); box(-0.03, 0.03, 0, 0.005, -0.045, 0.045, hinoki, p); box(-0.01, 0.01, 0, 0.005, 0.045, 0.17, hinoki, p); }
// salmon and the long knife
{ const b = grp(0.0, Y, -0.22); b.rotation.y = -0.1; box(-0.19, 0.19, 0, 0.018, -0.1, 0.1, hinoki, b); const stripes = tex(64, 32, (c, w, h) => { c.fillStyle = '#f08a4a'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(255,235,220,.8)'; c.lineWidth = 2; for (let i = -2; i < 9; i++) { c.beginPath(); c.moveTo(i * 9, 0); c.lineTo(i * 9 + 12, h); c.stroke(); } });
  box(-0.15, 0.0, 0.018, 0.05, -0.06, 0.0, std(0xffffff, 0.35, 0, { map: stripes }), b); for (let i = 0; i < 4; i++) { const s = box(0.02 + i * 0.03, 0.026 + i * 0.03, 0.018, 0.048, -0.06, 0.0, std(0xffffff, 0.35, 0, { map: stripes }), b); s.rotation.z = -0.9; s.position.y = 0.028; }
  box(-0.16, 0.08, 0.018, 0.02, 0.04, 0.062, M.steel, b); box(0.08, 0.17, 0.016, 0.03, 0.04, 0.06, std(0x6b4423, 0.6), b); }

/* ------------------------------------------------------------------ ramen */
{ const r = grp(0.13, Y, 0.16); lathe([[0.04, 0], [0.05, 0.012], [0.1, 0.06], [0.115, 0.085], [0.118, 0.085], [0.104, 0.058], [0.05, 0.004]], std(0x1d2a3a, 0.3, 0, { side: THREE.DoubleSide }), r); cyl(0.106, 0.004, gloss(0xc9955a, 0.15), 0, 0.066, 0, r, 40);
  for (let i = 0; i < 26; i++) { const a = rnd() * 6.28, d = Math.sqrt(rnd()) * 0.05; mk(new THREE.TorusGeometry(0.014 + rnd() * 0.012, 0.0022, 5, 12, 2 + rnd() * 3).rotateX(Math.PI / 2), std(0xf0d68a, 0.6), r, Math.cos(a) * d, 0.07 + rnd() * 0.006, Math.sin(a) * d).rotation.y = rnd() * 3; }
  for (const [x, z] of [[-0.05, -0.04], [-0.015, -0.06]]) { const c = cyl(0.03, 0.006, std(0xc9a48a, 0.6), x, 0.078, z, r, 20); c.rotation.x = 0.2; mk(new THREE.TorusGeometry(0.03, 0.003, 6, 20).rotateX(Math.PI / 2), std(0x7a4a2a, 0.6), c); }
  for (const [x, z] of [[0.05, -0.03], [0.06, 0.02]]) { const e = mk(new THREE.SphereGeometry(0.022, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0xfbfaf4, 0.5), r, x, 0.07, z); e.scale.set(1, 0.5, 1.25); mk(new THREE.CircleGeometry(0.012, 14).rotateX(-Math.PI / 2), gloss(0xf2a51d), e, 0, 0.0225, 0); }
  box(-0.035, 0.035, 0.07, 0.15, 0.075, 0.077, std(0x12160f, 0.7), r).rotation.x = -0.3; cyl(0.018, 0.004, std(0xfbfaf4, 0.6), -0.03, 0.078, 0.04, r, 16); mk(new THREE.TorusGeometry(0.008, 0.003, 6, 14).rotateX(Math.PI / 2), std(0xe86a8a, 0.6), r, -0.03, 0.081, 0.04);
  for (let i = 0; i < 12; i++) mk(new THREE.TorusGeometry(0.005, 0.002, 5, 8).rotateX(Math.PI / 2), std(0x4f9a3a, 0.6), r, 0.01 + rnd() * 0.04, 0.076, 0.03 + rnd() * 0.04);
  for (const k of [-1, 1]) { const c = cyl(0.003, 0.24, lacquer, 0.02, 0.092, -0.02 + k * 0.006, r, 6); c.rotation.z = Math.PI / 2; c.rotation.y = 0.5 + k * 0.03; } }
const ramenSteam = steam(g, 0.13, Y + 0.1, 0.16, 4, 0.14, 0.3);

/* ------------------------------------------------------- konro and yakitori */
const coalTex = tex(64, 64, (c, w) => { c.fillStyle = '#000'; c.fillRect(0, 0, w, w); for (let i = 0; i < 40; i++) { const x = rnd() * w, y = rnd() * w, r = 3 + rnd() * 7, gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,${130 + rnd() * 80},40,.9)`); gr.addColorStop(1, 'rgba(255,60,0,0)'); c.fillStyle = gr; c.fillRect(x - r, y - r, 2 * r, 2 * r); } });
const coals = std(0x151312, 1, 0, { emissive: 0xffffff, emissiveMap: coalTex, emissiveIntensity: 0 }), k = grp(0.42, Y, -0.18), clay = std(0xcbb894, 0.9);
for (const z of [-0.07, 0.07]) box(-0.16, 0.16, 0.012, 0.11, z - 0.012, z + 0.012, clay, k); for (const x of [-0.16, 0.16]) box(x - 0.012, x + 0.012, 0.012, 0.11, -0.07, 0.07, clay, k); box(-0.172, 0.172, 0.012, 0.03, -0.082, 0.082, clay, k); for (const x of [-0.13, 0.13]) box(x - 0.02, x + 0.02, 0, 0.012, -0.07, 0.07, M.black, k);
box(-0.148, 0.148, 0.07, 0.075, -0.058, 0.058, coals, k); for (let i = 0; i < 13; i++) box(-0.15 + i * 0.025 - 0.0015, -0.15 + i * 0.025 + 0.0015, 0.111, 0.114, -0.08, 0.08, M.steel, k); for (const z of [-0.08, 0.08]) box(-0.16, 0.16, 0.111, 0.114, z - 0.002, z + 0.002, M.steel, k);
for (let i = 0; i < 5; i++) { const s = grp(-0.12 + i * 0.06, 0.12, 0, k); cyl(0.0022, 0.24, std(0xd9b97c, 0.7), 0, 0, 0.03, s, 6).rotation.x = Math.PI / 2; for (let j = 0; j < 4; j++) mk(new THREE.BoxGeometry(0.024, 0.016, 0.022), gloss(j % 2 && i % 2 ? 0x4f9a3a : 0xa9622a, 0.35), s, 0, 0.002, -0.055 + j * 0.028).rotation.y = rnd(); }
const smoke = steam(g, 0.42, Y + 0.14, -0.18, 6, 0.16, 0.4);
parts.konro = { set() {} }; k.userData.click = () => { const p = parts.konro; p.t = p.t ? 0 : 1; if (p.t) sound.ignite(); else sound.click(); sound.loop('konro', p.t); };

/* -------------------------------------------------------------------- tea */
{ const iron = std(0x1c1d1f, 0.6, 0.5), t = grp(0.47, Y, 0.2); lathe([[0, 0], [0.05, 0], [0.075, 0.03], [0.07, 0.065], [0.04, 0.08], [0, 0.082]], iron, t, 0, 0, 0, 32); cyl(0.012, 0.014, iron, 0, 0.088, 0, t, 12); mk(new THREE.CylinderGeometry(0.008, 0.013, 0.05, 12), iron, t, -0.08, 0.05, 0).rotation.z = 1.0; mk(new THREE.TorusGeometry(0.06, 0.004, 8, 24, Math.PI), iron, t, 0, 0.07, 0);
  for (const [x, z] of [[-0.14, 0.1], [-0.05, 0.14]]) { mk(new THREE.CylinderGeometry(0.028, 0.022, 0.04, 20, 1, true), M.ceramic, t, x, 0.02, z); cyl(0.022, 0.003, M.ceramic, x, 0.0015, z, t, 20); cyl(0.025, 0.002, gloss(0x8fa84a, 0.15), x, 0.03, z, t, 20); } }

g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = o.receiveShadow = true; });
let time = 0; function tick(dt) { time += dt; const v = parts.konro.v; coals.emissiveIntensity = v * (1.6 + 0.4 * Math.sin(time * 6)); smoke(dt, v * 0.8); ramenSteam(dt, 0.6); }
return { parts, tick };
  } });
