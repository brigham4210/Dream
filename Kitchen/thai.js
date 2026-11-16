/* The Thai counter: the right half of the second island. A granite mortar of som tam, a clay charcoal stove with a pot
   of green curry, sticky rice in its bamboo steamer and basket, pad thai, mango sticky rice, and a tray of limes, chilies,
   lemongrass and basil with fish sauce, coconut milk and curry pastes.
   build() adds it to whatever `scene` it is given, centred on x = z = 0, you stand at +z, the floor is y = 0, metres.
   Click the mortar to pound, the stove to simmer the curry. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Thai', title: 'Thai counter', line: 'Som tam, green curry, sticky rice, pad thai · click the mortar to pound, the stove to simmer',
  at: [-0.425, 2.6], turn: 0, view: { target: [0, 0.98, 0], cam: [0.45, 1.95, 2.2] },
  build({ THREE, scene, sound, kit }) {
const { std, tex, rand, tools, M, front, steam } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), rnd = rand(67), parts = {};
const HX = 0.625, HZ = 0.4, H = 0.86, Y = 0.92;
const lathe = (pts, mat, parent, x = 0, y = 0, z = 0, seg = 40) => mk(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(...p)), seg), mat, parent, x, y, z);
const gloss = (c, r = 0.3) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, clearcoat: 0.8 });
const weave = tex(128, 128, (c, w) => { c.fillStyle = '#d2b06a'; c.fillRect(0, 0, w, w); for (let y = 0; y < w; y += 8) for (let x = 0; x < w; x += 8) { c.fillStyle = (x / 8 + y / 8) % 2 ? 'rgba(90,55,20,.35)' : 'rgba(255,240,190,.3)'; c.fillRect(x, y, 8, 8); } });
weave.wrapS = weave.wrapT = THREE.RepeatWrapping; weave.repeat.set(6, 2); const woven = std(0xffffff, 0.85, 0, { map: weave, side: THREE.DoubleSide });

/* ---------------------------------------------------------------- counter */
box(-HX, HX, 0.1, H, -HZ + 0.03, HZ - 0.03, M.paint); box(-HX + 0.05, HX - 0.05, 0, 0.1, -HZ + 0.08, HZ - 0.08, M.black); box(-HX, HX, H, Y, -HZ, HZ, M.oak);
for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { const f = front(HX - 0.006, H - 0.11, M.paint, g, -HX / 2 + i * HX, (H + 0.1) / 2, s * (HZ - 0.022)); if (s < 0) f.rotation.y = Math.PI; }
{ const f = front(2 * HZ - 0.066, H - 0.11, M.paint, g, HX + 0.008, (H + 0.1) / 2, 0); f.rotation.y = Math.PI / 2; }

/* ---------------------------------------------------- the mortar of som tam */
const krok = grp(-0.4, Y, 0.12), pestle = grp(0.02, 0.2, 0, krok); let pound = -1;
{ const stone = std(0x55565a, 0.9, 0, { side: THREE.DoubleSide }); lathe([[0, 0.03], [0.05, 0.035], [0.1, 0.11], [0.118, 0.15], [0.132, 0.15], [0.125, 0.09], [0.09, 0.02], [0.075, 0], [0, 0]], stone, krok, 0, 0, 0, 32);
  mk(new THREE.SphereGeometry(0.105, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0xdfe6b0, 0.8), krok, 0, 0.09, 0).scale.y = 0.35;
  for (let i = 0; i < 46; i++) { const a = rnd() * 6.28, d = Math.sqrt(rnd()) * 0.085, s = mk(new THREE.BoxGeometry(0.035 + rnd() * 0.02, 0.003, 0.004), std([0xe6edc0, 0xe6edc0, 0xf0a04a, 0x4f9a3a][i % 4], 0.7), krok, Math.cos(a) * d, 0.115 + rnd() * 0.02, Math.sin(a) * d); s.rotation.set(rnd() - 0.5, rnd() * 3, rnd() - 0.5); }
  for (let i = 0; i < 5; i++) { const a = i * 1.3; mk(new THREE.SphereGeometry(0.014, 12, 8, 0, Math.PI), gloss(0xc8321e), krok, Math.cos(a) * 0.06, 0.13, Math.sin(a) * 0.06).rotation.y = a; }
  for (let i = 0; i < 4; i++) mk(new THREE.ConeGeometry(0.004, 0.03, 6).rotateZ(Math.PI / 2), gloss(0xb5271e), krok, -0.03 + i * 0.02, 0.135, 0.03 - i * 0.02).rotation.y = i;
  pestle.rotation.z = -0.35; cyl(0.014, 0.2, std(0x8a5a34, 0.6), 0, 0.04, 0, pestle, 12); mk(new THREE.SphereGeometry(0.024, 14, 10), std(0x8a5a34, 0.6), pestle, 0, -0.065, 0).scale.y = 1.3;
  krok.userData.click = () => { if (pound < 0) pound = 0; }; }

/* ------------------------------------- the tao (clay stove) and green curry */
const tao = grp(0.38, Y, -0.13), coalMat = std(0x151312, 1, 0, { emissive: 0xff5a1a, emissiveIntensity: 0 });
{ const clay = std(0xb5744a, 0.9, 0, { side: THREE.DoubleSide }); lathe([[0, 0], [0.09, 0], [0.125, 0.12], [0.135, 0.15], [0.115, 0.15], [0.085, 0.02], [0, 0.02]], clay, tao, 0, 0, 0, 32); cyl(0.137, 0.012, M.steel, 0, 0.1, 0, tao, 32); box(-0.035, 0.035, 0.03, 0.08, 0.09, 0.125, std(0x0c0a08, 1), tao);
  cyl(0.1, 0.01, coalMat, 0, 0.1, 0, tao, 24); for (let i = 0; i < 3; i++) box(-0.012, 0.012, 0.15, 0.165, 0.09, 0.125, clay, tao).rotation.y = i * 2.09;
  const pot = grp(0, 0.165, 0, tao), alu = std(0xcfd1d3, 0.4, 0.9, { side: THREE.DoubleSide }); lathe([[0, 0.004], [0.09, 0.004], [0.115, 0.03], [0.118, 0.09], [0.126, 0.094]], alu, pot, 0, 0, 0, 40); for (const s of [-1, 1]) box(s * 0.13 - 0.02, s * 0.13 + 0.02, 0.078, 0.086, -0.03, 0.03, alu, pot);
  cyl(0.114, 0.004, gloss(0xb9c98a, 0.15), 0, 0.075, 0, pot, 40);
  for (let i = 0; i < 16; i++) { const a = rnd() * 6.28, d = Math.sqrt(rnd()) * 0.09, kind = i % 4; (kind === 0 ? mk(new THREE.SphereGeometry(0.016, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0x9ab86a, 0.6), pot) : kind === 1 ? mk(new THREE.BoxGeometry(0.03, 0.012, 0.02), std(0xf0e2c8, 0.6), pot) : kind === 2 ? mk(new THREE.CircleGeometry(0.014, 8).rotateX(-Math.PI / 2), std(0x2f6b34, 0.6, 0, { side: THREE.DoubleSide }), pot) : mk(new THREE.ConeGeometry(0.004, 0.03, 6).rotateZ(Math.PI / 2), gloss(0xc8321e), pot)).position.set(Math.cos(a) * d, 0.079, Math.sin(a) * d); }
  tao.userData.click = () => { const p = parts.curry; p.t = p.t ? 0 : 1; if (p.t) sound.ignite(); else sound.click(); sound.loop('curry', p.t); }; }
parts.curry = { set() {} }; const currySteam = steam(g, 0.38, Y + 0.27, -0.13, 6, 0.18, 0.4);

/* --------------------------------------------------------------- sticky rice */
{ const p = grp(-0.42, Y, -0.24), alu = std(0xcfd1d3, 0.4, 0.9); lathe([[0, 0], [0.07, 0], [0.095, 0.05], [0.07, 0.13], [0.085, 0.15]], alu, p, 0, 0, 0, 32); mk(new THREE.CylinderGeometry(0.115, 0.02, 0.2, 32, 1, true), woven, p, 0, 0.21, 0);
  mk(new THREE.SphereGeometry(0.1, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0xfdfcf8, 0.95), p, 0, 0.27, 0).scale.y = 0.35;
  const k = grp(0.24, 0, 0.03, p); mk(new THREE.CylinderGeometry(0.07, 0.07, 0.09, 32, 1, true), woven, k, 0, 0.055, 0); cyl(0.07, 0.01, std(0xa9844a, 0.8), 0, 0.005, 0, k, 32); mk(new THREE.CylinderGeometry(0.074, 0.074, 0.04, 32), woven, k, 0, 0.115, 0); cyl(0.05, 0.012, std(0xa9844a, 0.8), 0, 0.006, 0, k, 4).rotation.y = Math.PI / 4; }

/* ------------------------------------------------ pad thai, mango sticky rice */
{ const p = grp(0.0, Y, 0.2); cyl(0.125, 0.008, M.ceramic, 0, 0.004, 0, p, 48); mk(new THREE.SphereGeometry(0.085, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0xd9924a, 0.7), p, -0.01, 0.008, 0).scale.y = 0.4;
  for (let i = 0; i < 36; i++) { const a = rnd() * 6.28, d = Math.sqrt(rnd()) * 0.075; mk(new THREE.TorusGeometry(0.012 + rnd() * 0.014, 0.0025, 5, 12, 2 + rnd() * 3), std(0xe0a25a, 0.6), p, -0.01 + Math.cos(a) * d, 0.02 + 0.03 * (1 - d * d / 0.0056), Math.sin(a) * d).rotation.set(Math.PI / 2 + rnd() - 0.5, 0, rnd() * 3); }
  for (const [x, z] of [[-0.03, 0.02], [0.02, -0.03], [-0.05, -0.03]]) mk(new THREE.TorusGeometry(0.014, 0.007, 8, 14, Math.PI * 1.4).rotateX(Math.PI / 2), gloss(0xf08a6a), p, x, 0.05, z).rotation.y = x * 40;
  for (let i = 0; i < 6; i++) cyl(0.002, 0.06, std(0x4f9a3a, 0.6), 0.02 + rnd() * 0.03, 0.045, 0.01 + rnd() * 0.04, p, 5).rotation.set(Math.PI / 2, 0, rnd() * 3);
  mk(new THREE.SphereGeometry(0.022, 14, 8, 0, Math.PI / 2), gloss(0x6aa82f), p, 0.09, 0.012, 0.03).rotation.set(0, 0.4, Math.PI / 2); for (let i = 0; i < 14; i++) mk(new THREE.SphereGeometry(0.004, 6, 5), std(0xc9a25e, 0.8), p, 0.07 + rnd() * 0.04, 0.011, -0.07 + rnd() * 0.04); }
{ const p = grp(0.33, Y, 0.24); cyl(0.095, 0.008, M.ceramic, 0, 0.004, 0, p, 40); mk(new THREE.SphereGeometry(0.045, 20, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0xfdfcf8, 0.9), p, -0.03, 0.008, 0).scale.set(1, 0.6, 1.2); cyl(0.03, 0.002, gloss(0xfbfaf0, 0.1), -0.03, 0.035, 0, p, 16);
  for (let i = 0; i < 5; i++) { const m = mk(new THREE.SphereGeometry(0.03, 14, 10), gloss(0xf5b21a), p, 0.025 + i * 0.012, 0.016, -0.03 + i * 0.012); m.scale.set(0.35, 0.5, 1.5); m.rotation.y = 0.5; } }

/* ------------------------------------------------- ingredients and bottles */
{ const t = grp(0.02, Y, -0.2); box(-0.15, 0.15, 0, 0.012, -0.1, 0.1, woven, t); for (const [x, z] of [[-0.11, 0.05], [-0.07, 0.01], [-0.11, -0.04]]) mk(new THREE.SphereGeometry(0.024, 14, 10), gloss(0x5f9a2f, 0.5), t, x, 0.036, z);
  for (let i = 0; i < 12; i++) mk(new THREE.ConeGeometry(0.005, 0.045, 6).rotateZ(Math.PI / 2), gloss(i % 3 ? 0xc8321e : 0x3f8f3a), t, -0.01 + rnd() * 0.05, 0.018 + rnd() * 0.008, 0.03 + rnd() * 0.05).rotation.y = rnd() * 3;
  for (let i = 0; i < 4; i++) { const l = cyl(0.007, 0.26, std(0xc9d49a, 0.7), 0.09 + i * 0.012, 0.02 + (i % 2) * 0.008, 0, t, 8); l.rotation.x = Math.PI / 2; l.rotation.z = 0.05 * i; }
  for (let i = 0; i < 14; i++) { const l = mk(new THREE.CircleGeometry(0.018, 8), std(0x3f7a3a, 0.7, 0, { side: THREE.DoubleSide }), t, -0.02 + rnd() * 0.06, 0.02 + rnd() * 0.03, -0.07 + rnd() * 0.04); l.rotation.set(rnd() * 3, rnd() * 3, 0); l.scale.y = 1.5; }
  for (const [x, z] of [[-0.06, -0.07], [-0.09, -0.08]]) mk(new THREE.SphereGeometry(0.018, 10, 8), std(0xd9c7a8, 0.85), t, x, 0.026, z).scale.set(1.4, 0.8, 1); }
{ const b = (x, z, c, h, cap) => { cyl(0.028, h * 0.62, gloss(c, 0.1), x, Y + h * 0.31, z); mk(new THREE.CylinderGeometry(0.011, 0.028, h * 0.18, 20), gloss(c, 0.1), g, x, Y + h * 0.71, z); cyl(0.011, h * 0.15, gloss(c, 0.1), x, Y + h * 0.875, z, g, 12); cyl(0.013, h * 0.05, std(cap, 0.5), x, Y + h * 0.975, z, g, 12); cyl(0.0285, h * 0.25, std(0xf2ead2, 0.8), x, Y + h * 0.32, z); };
  b(0.56, 0.3, 0xa8642a, 0.24, 0xb5271e); b(0.56, 0.21, 0x24100a, 0.2, 0xd9a441); cyl(0.036, 0.1, M.steel, 0.55, Y + 0.05, 0.1); cyl(0.0365, 0.075, std(0x2f6b34, 0.7), 0.55, Y + 0.05, 0.1);
  [0xb5271e, 0x4f8f3a, 0xe2a020].forEach((c, i) => { cyl(0.03, 0.06, gloss(c, 0.2), -0.1 + i * 0.075, Y + 0.03, -0.35); cyl(0.031, 0.012, M.brass, -0.1 + i * 0.075, Y + 0.066, -0.35); }); }

g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = o.receiveShadow = true; });
let time = 0;
function tick(dt) { time += dt; const v = parts.curry.v; coalMat.emissiveIntensity = v * (1.2 + 0.3 * Math.sin(time * 6)); currySteam(dt, v);
  if (pound >= 0) { const before = Math.floor(pound * 3.2 + 0.5); pound += dt; if (Math.floor(pound * 3.2 + 0.5) > before) sound.tap(); pestle.position.y = 0.2 + 0.05 * Math.abs(Math.cos(pound * 3.2 * Math.PI)) - 0.05; if (pound > 1.6) { pound = -1; pestle.position.y = 0.2; } } }
return { parts, tick };
  } });
