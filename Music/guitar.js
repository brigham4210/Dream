/* The acoustic guitar on its stand. build() adds it to whatever `scene` it is given: face towards +z, stand on y = 0, metres.
   Each string plucks on its own; a click on the body strums all six. */
(window.DREAM_MUSIC = window.DREAM_MUSIC || []).push({
  name: 'Guitar', title: 'Acoustic guitar', line: 'Spruce top, mahogany back · click a string to pluck it, the body to strum',
  at: [1.15, 1.7], turn: -0.35, view: { target: [0, 0.56, 0], cam: [0.5, 0.95, 3.1] },
  build({ THREE, scene, sound }) {
const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
const gloss = (color, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08, ...extra });
const mahogany = gloss(0x5a2c16), rosewood = std(0x2a1710, 0.5), steel = std(0xdfe1e4, 0.2, 1), bone = std(0xf2ecdc, 0.4), black = std(0x141416, 0.5, 0.3), rubber = std(0x0c0c0d, 0.9);
const root = new THREE.Group(); scene.add(root);
const gtr = new THREE.Group(); gtr.position.set(0, 0.12, 0.02); gtr.rotation.x = -0.2; root.add(gtr);   // leaning back in the stand
const mk = (geo, mat, parent = gtr, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

/* ------------------------------------------------------------------- body */
// front-view outline of a dreadnought: y = 0 at the bottom of the body, the neck leaves at the top
const DEPTH = 0.105, BODY = 0.5, HOLE = 0.365, SADDLE = 0.165, SCALE = 0.645, NUT = SADDLE + SCALE, ZT = DEPTH / 2 + 0.006;
const half = [[0, 0], [0.09, 0.004], [0.165, 0.045], [0.197, 0.13], [0.185, 0.215], [0.135, 0.3], [0.132, 0.36], [0.148, 0.425], [0.115, 0.485], [0, BODY]];
const shape = new THREE.Shape(); shape.moveTo(0, 0); shape.splineThru(half.slice(1).map(p => new THREE.Vector2(p[0], p[1]))); shape.splineThru(half.slice(0, -1).reverse().map(p => new THREE.Vector2(-p[0], p[1])));
mk(new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelOffset: -0.005, bevelSegments: 3, curveSegments: 40 }).translate(0, 0, -DEPTH / 2), mahogany);
{ const top = canvasTex(800, 1000, (c, w, h) => {
    const X = x => (x + 0.2) / 0.4 * w, Y = y => h - y / 0.5 * h, pts = shape.getPoints(40);
    c.fillStyle = '#dcae6c'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(${Math.random() < 0.5 ? '120,70,20' : '255,235,190'},${0.03 + Math.random() * 0.06})`; c.fillRect(Math.random() * w, 0, 1 + Math.random() * 2, h); }
    c.strokeStyle = '#f4ecd8'; c.lineWidth = 16; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(X(p.x), Y(p.y)) : c.moveTo(X(p.x), Y(p.y))); c.closePath(); c.stroke();
    c.strokeStyle = '#1c1410'; c.lineWidth = 3; c.stroke();
    c.fillStyle = '#2a1408'; c.beginPath(); c.moveTo(X(0.03), Y(HOLE + 0.03)); c.bezierCurveTo(X(0.1), Y(HOLE + 0.05), X(0.14), Y(HOLE - 0.06), X(0.1), Y(HOLE - 0.13)); c.bezierCurveTo(X(0.07), Y(HOLE - 0.16), X(0.03), Y(HOLE - 0.1), X(0.03), Y(HOLE - 0.05)); c.fill();
    for (const [r, lw, col] of [[0.068, 9, '#2a1a10'], [0.06, 3, '#f4ecd8'], [0.074, 2, '#f4ecd8']]) { c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); c.arc(X(0), Y(HOLE), r / 0.4 * w, 0, 7); c.stroke(); }
    c.fillStyle = '#0a0706'; c.beginPath(); c.arc(X(0), Y(HOLE), 0.05 / 0.4 * w, 0, 7); c.fill(); });
  top.repeat.set(1 / 0.4, 1 / 0.5); top.offset.set(0.5, 0);
  const face = mk(new THREE.ShapeGeometry(shape, 40), gloss(0xffffff, { map: top }), gtr, 0, 0, ZT - 0.0006);
  face.userData.click = () => strum(); }
// bridge with its saddle and pins
mk(new THREE.BoxGeometry(0.155, 0.03, 0.009), rosewood, gtr, 0, SADDLE - 0.004, ZT); mk(new THREE.BoxGeometry(0.075, 0.003, 0.004), bone, gtr, 0, SADDLE, ZT + 0.006);

/* ------------------------------------------------------- neck and headstock */
const NECK0 = BODY - 0.012, FB0 = HOLE + 0.056, ZN = ZT + 0.004;
{ const neck = new THREE.Shape([[-0.028, NECK0], [0.028, NECK0], [0.022, NUT], [-0.022, NUT]].map(p => new THREE.Vector2(...p)));
  mk(new THREE.ExtrudeGeometry(neck, { depth: 0.018, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.004, bevelOffset: -0.004, bevelSegments: 4 }).translate(0, 0, ZN - 0.024), mahogany);
  mk(new THREE.BoxGeometry(0.06, 0.07, DEPTH * 0.55), mahogany, gtr, 0, BODY + 0.02, -DEPTH * 0.2);   // heel
  const wAt = y => 0.0285 - (0.0285 - 0.0225) * (y - FB0) / (NUT - FB0);
  const fb = new THREE.Shape([[-wAt(FB0), FB0], [wAt(FB0), FB0], [0.0225, NUT], [-0.0225, NUT]].map(p => new THREE.Vector2(...p)));
  mk(new THREE.ExtrudeGeometry(fb, { depth: 0.005, bevelEnabled: false }), rosewood, gtr, 0, 0, ZN);
  for (let n = 1; n <= 20; n++) { const y = SADDLE + SCALE / Math.pow(2, n / 12); mk(new THREE.BoxGeometry(2 * wAt(y), 0.0022, 0.0016), steel, gtr, 0, y, ZN + 0.0055);
    if ([3, 5, 7, 9, 15, 17].includes(n) || n === 12) { const ym = (y + SADDLE + SCALE / Math.pow(2, (n - 1) / 12)) / 2; for (const x of n === 12 ? [-0.011, 0.011] : [0]) mk(new THREE.CircleGeometry(0.003, 16), bone, gtr, x, ym, ZN + 0.0052); } }
  mk(new THREE.BoxGeometry(0.045, 0.005, 0.007), bone, gtr, 0, NUT + 0.0025, ZN + 0.0045);
  const head = new THREE.Group(); head.position.set(0, NUT + 0.005, ZN - 0.004); head.rotation.x = -0.22; gtr.add(head);
  const hs = new THREE.Shape(); hs.moveTo(-0.024, 0); hs.lineTo(0.024, 0); hs.lineTo(0.036, 0.03); hs.lineTo(0.039, 0.165); hs.quadraticCurveTo(0, 0.185, -0.039, 0.165); hs.lineTo(-0.036, 0.03); hs.closePath();
  mk(new THREE.ExtrudeGeometry(hs, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelOffset: -0.002, bevelSegments: 2 }).translate(0, 0, -0.012), gloss(0x1a0d08), head);
  for (let i = 0; i < 3; i++) for (const s of [1, -1]) { const y = 0.045 + i * 0.045;
    mk(new THREE.CylinderGeometry(0.0035, 0.0035, 0.014, 12).rotateX(Math.PI / 2), steel, head, s * 0.022, y, 0.006);
    mk(new THREE.CylinderGeometry(0.0025, 0.0025, 0.022, 8).rotateZ(Math.PI / 2), steel, head, s * 0.048, y, -0.008); mk(new THREE.SphereGeometry(0.0085, 12, 8).scale(0.6, 1, 1.2), steel, head, s * 0.061, y, -0.008); } }

/* ---------------------------------------------------------------- strings */
// low E on the left as you face it. Each has an unseen, wider strip in front of it so it is easy to hit.
const OPEN = [82.41, 110, 146.83, 196, 246.94, 329.63], strings = [], unseen = new THREE.MeshBasicMaterial({ visible: false });
OPEN.forEach((hz, i) => {
  const x0 = (i - 2.5) * 0.0108, x1 = (i - 2.5) * 0.0074, len = Math.hypot(SCALE, x1 - x0), holder = new THREE.Group();
  holder.position.set((x0 + x1) / 2, SADDLE + SCALE / 2, ZN + 0.0085); holder.rotation.z = -Math.atan2(x1 - x0, SCALE); gtr.add(holder);
  const m = mk(new THREE.CylinderGeometry(1, 1, len, 6), i < 4 ? std(0xc9a25e, 0.35, 1) : steel, holder); m.scale.set(0.0009 - i * 0.00011, 1, 0.0009 - i * 0.00011);
  const hit = mk(new THREE.BoxGeometry(0.0088, len, 0.004), unseen, holder, 0, 0, 0.003); hit.userData.proxy = true;
  const s = { m, r: m.scale.x, t: -1, hz }; strings.push(s);
  hit.userData.click = () => pluck(s);
});
const pluck = (s, when = 0) => { sound.pluck(s.hz, when); s.t = -when; s.live = true; };
const strum = () => strings.forEach((s, i) => pluck(s, i * 0.035));

/* ------------------------------------------------------------------ stand */
const tube = (a, b, r = 0.009, mat = black) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), m = mk(new THREE.CylinderGeometry(r, r, A.distanceTo(B), 10), mat, root); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); return m; };
tube([0, 0.02, -0.3], [0, 0.72, -0.06]); tube([0, 0.3, -0.2], [-0.2, 0.02, 0.16]); tube([0, 0.3, -0.2], [0.2, 0.02, 0.16]);
for (const s of [1, -1]) { tube([s * 0.06, 0.2, -0.165], [s * 0.1, 0.1, 0.12]); tube([s * 0.1, 0.1, 0.12], [s * 0.1, 0.16, 0.14], 0.012, rubber); }
tube([-0.045, 0.72, -0.06], [0.045, 0.72, -0.06], 0.012, rubber);

root.traverse(o => { if (o.isMesh && o.material.visible) o.castShadow = o.receiveShadow = true; });
function tick(dt) { for (const s of strings) if (s.live) { s.t += dt; if (s.t < 0) continue; const a = Math.exp(-s.t * 2.6); s.m.scale.x = s.r * (1 + 3.2 * a * (0.6 + 0.4 * Math.sin(s.t * 90))); if (a < 0.02) { s.m.scale.x = s.r; s.live = false; } } }
return { parts: {}, tick };
  } });
