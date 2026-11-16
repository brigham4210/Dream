/* The grand piano. build() adds it to whatever `scene` it is given: keyboard towards +z, feet on y = 0, metres.
   All 88 keys play; the lid lifts on its hinge along the bass side. */
(window.DREAM_MUSIC = window.DREAM_MUSIC || []).push({
  name: 'Piano', title: 'Grand piano', line: 'Polished ebony · 88 keys · click a key to play it, click the lid to lift it',
  at: [-1.25, -0.25], turn: 0.5, view: { target: [0, 0.8, -0.2], cam: [2.3, 2.0, 3.7] },
  build({ THREE, scene, sound }) {
const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
const ebony = new THREE.MeshPhysicalMaterial({ color: 0x08080a, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.03 });
const brass = std(0xd4b25e, 0.25, 1), ivory = std(0xf6f3ea, 0.25), jet = std(0x101012, 0.3), felt = std(0x8a1418, 0.95), leather = std(0x141416, 0.55);
const g = new THREE.Group(); scene.add(g);
const mk = (geo, mat, parent = g, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const box = (x0, x1, y0, y1, z0, z1, mat, parent = g) => mk(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat, parent, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

/* ------------------------------------------------------------------- case */
// Plan outline, drawn as (x, s) with s running from the keyboard back to the tail (s = -z): straight bass side, curved treble side.
const HW = 0.74, FRONT = -0.25, TAIL = 1.5, Y0 = 0.62, Y1 = 0.96, LID0 = 0.06;
const outline = from => { const s = new THREE.Shape(); s.moveTo(-HW, from); s.lineTo(HW, from); s.lineTo(HW, 0.3);
  s.bezierCurveTo(HW, 0.85, 0.3, 0.75, 0.22, 1.15); s.bezierCurveTo(0.17, 1.42, 0, TAIL, -0.3, TAIL); s.bezierCurveTo(-0.6, TAIL, -HW, 1.4, -HW, 1.15); s.closePath(); return s; };
const flat = (shape, depth, bevel = 0) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel, bevelSegments: 3, curveSegments: 40 }).rotateX(-Math.PI / 2);
const inner = new THREE.Shape(outline(FRONT).getPoints(40).map(p => new THREE.Vector2(p.x * 0.945, Math.max(0.05, 0.62 + (p.y - 0.62) * 0.95))));
mk(flat(outline(FRONT), 0.25), ebony, g, 0, Y0, 0);                                    // the body, up to the soundboard
{ const rim = outline(FRONT); rim.holes.push(new THREE.Path(inner.getPoints())); mk(flat(rim, Y1 - 0.86), ebony, g, 0, 0.86, 0); }
// inside: the gilded iron plate with its strings, seen when the lid is up
{ const t = canvasTex(1024, 1100, (c, w, h) => {
    const X = x => (x + 0.72) / 1.44 * w, S = s => h - s / 1.55 * h;
    const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#b8923f'); gr.addColorStop(0.5, '#d9b866'); gr.addColorStop(1, '#a8842f'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.fillStyle = '#8a5a2a'; c.fillRect(0, S(1.5), w, S(0.34) - S(1.5)); c.fillStyle = gr; for (const x of [-0.42, -0.08, 0.3]) { c.beginPath(); c.moveTo(X(x) - 9, S(0.1)); c.lineTo(X(x) + 9, S(0.1)); c.lineTo(X(x * 0.5 - 0.2) + 9, S(1.5)); c.lineTo(X(x * 0.5 - 0.2) - 9, S(1.5)); c.fill(); }
    for (let i = 0; i < 88; i++) { const x = -0.6 + 1.2 * i / 87, len = 1.42 - (x + 0.6) * 0.78; c.strokeStyle = i < 26 ? '#b06a3a' : '#e8e8ea'; c.lineWidth = i < 26 ? 2.2 : 1; c.beginPath(); c.moveTo(X(x), S(0.1)); c.lineTo(X(x * 0.82 - (i < 26 ? -0.25 : 0.05)), S(len)); c.stroke(); }
    c.fillStyle = '#16161a'; c.fillRect(X(-0.62), S(0.27), X(0.62) - X(-0.62), S(0.22) - S(0.27)); c.fillStyle = '#8a1418'; c.fillRect(X(-0.62), S(0.2), X(0.62) - X(-0.62), 5);
    c.fillStyle = '#d8d8dc'; for (let i = 0; i < 88; i++) for (const s of [0.09, 0.115, 0.14]) { c.beginPath(); c.arc(X(-0.6 + 1.2 * i / 87) + (s * 300 % 5), S(s), 2.2, 0, 7); c.fill(); }
    c.fillStyle = '#2a1d0c'; for (const [x, s] of [[-0.45, 1.25], [-0.3, 1.36], [-0.5, 1.0], [0.0, 1.05]]) { c.beginPath(); c.arc(X(x), S(s), 22, 0, 7); c.fill(); } });
  t.repeat.set(1 / 1.44, 1 / 1.55); t.offset.set(0.5, 0);
  mk(new THREE.ShapeGeometry(inner, 30).rotateX(-Math.PI / 2), std(0xffffff, 0.35, 0.6, { map: t }), g, 0, 0.872, 0); }

// front: the keyboard well between two cheek blocks, the fallboard behind the keys, the fixed part of the top with the music desk
const KZ0 = 0.252, KZ1 = 0.4, KX = 0.61, KY = 0.74;
box(-HW, HW, Y0, 0.715, 0.25, 0.445, ebony); box(-KX, KX, 0.7, 0.724, KZ1 + 0.002, 0.445, ebony);
for (const s of [1, -1]) box(s * KX, s * HW, Y0, 0.8, 0.25, 0.445, ebony);
box(-KX, KX, 0.715, Y1, 0.236, 0.251, ebony); box(-KX, KX, 0.742, 0.748, 0.25, 0.256, felt);
box(-HW, HW, Y1, Y1 + 0.016, -LID0, 0.252, ebony);
{ const desk = new THREE.Group(); desk.position.set(0, Y1 + 0.016, 0.06); desk.rotation.x = -0.28; g.add(desk);
  box(-0.34, 0.34, 0, 0.25, -0.006, 0.006, ebony, desk); box(-0.34, 0.34, 0, 0.018, 0.006, 0.04, ebony, desk);
  const page = canvasTex(512, 360, (c, w, h) => { c.fillStyle = '#fbf9f2'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a2a2a'; c.fillStyle = '#1c1c1c';
    for (const x0 of [14, 268]) for (let st = 0; st < 5; st++) { const y0 = 34 + st * 64; c.lineWidth = 1; for (let l = 0; l < 5; l++) { c.beginPath(); c.moveTo(x0, y0 + l * 7); c.lineTo(x0 + 230, y0 + l * 7); c.stroke(); }
      for (let n = 0; n < 11; n++) { const x = x0 + 18 + n * 19, y = y0 + 3.5 * Math.round(4 + 3.5 * Math.sin(n * 1.3 + st * 2.1 + x0)); c.beginPath(); c.ellipse(x, y, 4.2, 3, -0.3, 0, 7); c.fill(); c.lineWidth = 1.3; c.beginPath(); c.moveTo(x + 4, y); c.lineTo(x + 4, y - 20); c.stroke(); } }
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.stroke(); });
  mk(new THREE.PlaneGeometry(0.44, 0.31), std(0xffffff, 0.8, 0, { map: page }), desk, 0, 0.17, 0.008); }

/* ------------------------------------------------------------------- keys */
// 52 white and 36 black, A0 to C8. Each is its own mesh; a click plays its note and dips it for a moment.
const keys = [], W = 2 * KX / 52, whiteGeo = new THREE.BoxGeometry(W - 0.0012, 0.022, KZ1 - KZ0), blackGeo = new THREE.BoxGeometry(W * 0.56, 0.013, 0.095);
let wi = 0;
for (let midi = 21; midi <= 108; midi++) {
  const black = [1, 3, 6, 8, 10].includes(midi % 12);
  const m = black ? mk(blackGeo, jet, g, -KX + wi * W, KY + 0.0075, KZ0 + 0.0475) : mk(whiteGeo, ivory, g, -KX + (wi + 0.5) * W, KY - 0.011, (KZ0 + KZ1) / 2);
  if (!black) wi++;
  const key = { m, y: m.position.y, t: -1 };
  m.userData.click = () => { sound.piano(midi); key.t = 0; }; keys.push(key);
}

/* -------------------------------------------------------------------- lid */
const hinge = new THREE.Group(); hinge.position.set(-HW, Y1, 0); g.add(hinge);
const lid = mk(flat(outline(LID0), 0.018, 0.005), ebony, hinge, HW, 0, 0); lid.userData.click = () => { parts.lid.t = parts.lid.t ? 0 : 1; };
const prop = mk(new THREE.CylinderGeometry(0.008, 0.008, 1, 10).translate(0, 0.5, 0), ebony, g, 0.5, Y1 - 0.02, -0.35); prop.visible = false;
const tip = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

/* ----------------------------------------------------- legs, pedals, bench */
const leg = (x, z) => { mk(new THREE.CylinderGeometry(0.052, 0.036, 0.54, 4).rotateY(Math.PI / 4), ebony, g, x, 0.35, z); mk(new THREE.SphereGeometry(0.03, 16, 12), brass, g, x, 0.035, z); mk(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12), brass, g, x, 0.07, z); };
leg(-0.64, 0.14); leg(0.64, 0.14); leg(-0.2, -1.22);
for (const s of [1, -1]) box(s * 0.1 - 0.018, s * 0.1 + 0.018, 0.17, Y0, 0.15, 0.19, ebony);
box(-0.15, 0.15, 0.1, 0.17, 0.11, 0.24, ebony);
for (const x of [-0.075, 0, 0.075]) { const p = box(x - 0.016, x + 0.016, 0.108, 0.12, 0.24, 0.345, brass); p.rotation.x = 0.12; }
{ const bench = new THREE.Group(); bench.position.set(0, 0, 0.98); g.add(bench);
  box(-0.39, 0.39, 0.45, 0.52, -0.18, 0.18, leather, bench); box(-0.38, 0.38, 0.41, 0.45, -0.17, 0.17, ebony, bench);
  for (const x of [-0.34, 0.34]) for (const z of [-0.13, 0.13]) mk(new THREE.CylinderGeometry(0.026, 0.02, 0.41, 4).rotateY(Math.PI / 4), ebony, bench, x, 0.205, z); }

g.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
const parts = { lid: { set: v => { hinge.rotation.z = v * 0.62; prop.visible = v > 0.03;
  // the prop stick runs from the rim to wherever the underside of the lid now is
  tip.set(HW + 0.5, 0, -0.35).applyAxisAngle(new THREE.Vector3(0, 0, 1), hinge.rotation.z).add(hinge.position).sub(prop.position);
  prop.scale.y = Math.max(0.02, tip.length()); prop.quaternion.setFromUnitVectors(up, tip.normalize()); } } };
function tick(dt) { for (const k of keys) if (k.t >= 0) { k.t += dt; const d = Math.max(0, 1 - k.t / 0.28); k.m.position.y = k.y - 0.007 * d; if (!d) k.t = -1; } }
return { parts, tick };
  } });
