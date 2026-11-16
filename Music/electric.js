/* The electric guitar and the electric bass, hung on the slatted wall beside the acoustic, each on its own wall hanger.
   build() adds one to whatever `scene` it is given: the wall is the plane z = 0, the instrument faces +z, the floor is y = 0, metres.
   Each string plucks on its own; a click on the body plays them all. The two share everything but their sizes, colours and tuning. */
const electricInstrument = ({ bass = false, ...entry }) => ({ ...entry,
  build({ THREE, scene, sound }) {
const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
const gloss = (color, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05, ...extra });
const chrome = std(0xe4e6e9, 0.15, 1), black = std(0x111113, 0.45, 0.2), maple = std(0xe2c48e, 0.45), rosewood = std(0x2a1710, 0.5), pearl = std(0xf2ecdc, 0.35);
const root = new THREE.Group(); scene.add(root);
const mk = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const V2 = (x, y) => new THREE.Vector2(x, y), Y = new THREE.Vector3(0, 1, 0);
const closed = (pts, n = 140) => new THREE.Shape(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], 0)), true, 'centripetal').getPoints(n).map(p => V2(p.x, p.y)));

/* ------------------------------------------------------------- dimensions */
// y = 0 at the bottom of the body, the neck runs up +y. The bass is the same idea, larger, with longer horns and a longer neck.
const SX = bass ? 1.1 : 1, SY = bass ? 1.12 : 1, T = bass ? 0.042 : 0.044, ZF = T / 2;
const SCALE = bass ? 0.864 : 0.648, BRIDGE = bass ? 0.085 : 0.095, NUT = BRIDGE + SCALE, FRETS = bass ? 20 : 22;
const OPEN = bass ? [41.2, 55, 73.42, 98] : [82.41, 110, 146.83, 196, 246.94, 329.63], N = OPEN.length;
const HANG = bass ? 0.84 : 1.05, HEAD = bass ? 0.21 : 0.18;
const gtr = new THREE.Group(); gtr.position.set(0, HANG, 0.045); gtr.rotation.x = 0.02; root.add(gtr);

/* ------------------------------------------------------------------- body */
const outline = [[0, 0], [0.1, 0.012], [0.155, 0.065], [0.165, 0.15], [0.14, 0.225], [0.128, 0.27], [0.148, 0.33], [0.158, 0.395], [0.14, 0.44], [0.112, 0.432], [0.085, 0.39],
  [0.05, 0.365], [0.03, 0.385], [-0.03, 0.385], [-0.05, 0.36], [-0.085, 0.37], [-0.112, 0.405], [-0.138, 0.402], [-0.15, 0.35], [-0.135, 0.29], [-0.13, 0.24], [-0.158, 0.16], [-0.152, 0.07], [-0.1, 0.012]]
  .map(([x, y]) => [x * SX, y * SY + (bass && y > 0.38 && Math.abs(x) > 0.09 ? 0.045 : 0)]);
const shape = closed(outline), B = 0.006, W = 0.4 * SX, H = 0.5 * SY + 0.05;
const paint = bass ? gloss(0x2a140a) : gloss(0x7e0d12);
mk(new THREE.ExtrudeGeometry(shape, { depth: T - 2 * B, bevelEnabled: true, bevelThickness: B, bevelSize: B, bevelOffset: -B, bevelSegments: 4, curveSegments: 4 }).translate(0, 0, -(T - 2 * B) / 2), paint, gtr);
{ // the painted front, with its pickguard
  const top = canvasTex(800, 1100, (c, w, h) => {
    const X = x => (x + W / 2) / W * w, Yc = y => h - y / H * h, r = (x, y, rad) => c.createRadialGradient(X(x), Yc(y), 0, X(x), Yc(y), rad / W * w);
    let g; if (bass) { g = r(0.01, 0.2 * SY, 0.21); g.addColorStop(0, '#f0b347'); g.addColorStop(0.45, '#d47a1e'); g.addColorStop(0.75, '#6a250c'); g.addColorStop(1, '#1e0c05'); }
    else { g = r(-0.04, 0.27, 0.26); g.addColorStop(0, '#d0303a'); g.addColorStop(0.6, '#9a1018'); g.addColorStop(1, '#5a070c'); }
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    const guard = [[0.045, 0.13], [0.13, 0.12], [0.152, 0.19], [0.13, 0.27], [0.08, 0.29], [0.05, 0.24]].map(([x, y]) => [X(x * SX), Yc(y * SY)]);
    const poly = () => { c.beginPath(); guard.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.closePath(); };
    poly(); c.fillStyle = '#f4f2ea'; c.fill(); c.save(); c.translate(-4, -4); poly(); c.fillStyle = '#121214'; c.fill(); c.restore();
    c.fillStyle = 'rgba(255,255,255,.08)'; c.beginPath(); c.ellipse(X(-0.07 * SX), Yc(0.33 * SY), 30, 120, 0.4, 0, 7); c.fill(); });
  top.repeat.set(1 / W, 1 / H); top.offset.set(0.5, 0);
  const inset = new THREE.Shape(shape.getPoints().map(p => V2(p.x * (1 - B / 0.16), 0.2 * SY + (p.y - 0.2 * SY) * (1 - B / 0.22))));
  const face = mk(new THREE.ShapeGeometry(inset), gloss(0xffffff, { map: top }), gtr, 0, 0, ZF + 0.0004);
  face.userData.click = () => strum();
}
// hardware on the face: bridge, pickups, knobs
const box = (w, h, d, mat, x, y, z) => mk(new THREE.BoxGeometry(w, h, d), mat, gtr, x, y, z);
const sb = bass ? 0.019 : 0.0105, sn = bass ? 0.0105 : 0.0073;
if (bass) { box(0.085, 0.07, 0.005, chrome, 0, BRIDGE - 0.022, ZF + 0.0025); for (let i = 0; i < N; i++) box(0.012, 0.022, 0.011, chrome, (i - 1.5) * sb, BRIDGE - 0.004, ZF + 0.0055); }
else { box(0.082, 0.012, 0.012, chrome, 0, BRIDGE, ZF + 0.006); for (let i = 0; i < N; i++) box(0.0075, 0.008, 0.004, chrome, (i - 2.5) * sb, BRIDGE, ZF + 0.013);
  box(0.088, 0.014, 0.01, chrome, 0, BRIDGE - 0.042, ZF + 0.005); }
for (const y of bass ? [BRIDGE + 0.045, BRIDGE + 0.17] : [BRIDGE + 0.04, BRIDGE + 0.15]) {
  const w = bass ? 0.095 : 0.07, h = bass ? 0.024 : 0.038;
  box(w + 0.01, h + 0.01, 0.004, bass ? black : chrome, 0, y, ZF + 0.002); box(w, h, 0.008, black, 0, y, ZF + 0.004);
  for (let i = 0; i < N; i++) mk(new THREE.CylinderGeometry(0.0026, 0.0026, 0.002, 12).rotateX(Math.PI / 2), chrome, gtr, (i - (N - 1) / 2) * (sb * 0.9 + sn * 0.1), y + (bass ? 0 : 0.008), ZF + 0.0085);
}
for (const [x, y] of [[0.105, 0.165], [0.125, 0.21], [0.115, 0.25]].slice(0, bass ? 3 : 2)) {
  mk(new THREE.CylinderGeometry(0.011, 0.012, 0.014, 24).rotateX(Math.PI / 2), black, gtr, x * SX, y * SY, ZF + 0.007);
  mk(new THREE.CylinderGeometry(0.0095, 0.0095, 0.001, 24).rotateX(Math.PI / 2), chrome, gtr, x * SX, y * SY, ZF + 0.0145); }
if (!bass) { mk(new THREE.CylinderGeometry(0.0025, 0.002, 0.03, 10).rotateZ(0.5), pearl, gtr, -0.11, 0.37, ZF + 0.01); }   // pickup switch

/* --------------------------------------------------------- neck, headstock */
const Y0 = BRIDGE + SCALE / Math.pow(2, (FRETS + 0.6) / 12), wB = bass ? 0.064 : 0.056, wN = bass ? 0.042 : 0.043, wAt = y => wB + (wN - wB) * (y - Y0) / (NUT - Y0);
const strip = (w0, w1, y0, y1) => new THREE.Shape([V2(-w0 / 2, y0), V2(w0 / 2, y0), V2(w1 / 2, y1), V2(-w1 / 2, y1)]);
mk(new THREE.ExtrudeGeometry(strip(wB, wN, Y0, NUT), { depth: 0.012, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.003, bevelOffset: -0.003, bevelSegments: 4 }), maple, gtr, 0, 0, ZF - 0.004);
mk(new THREE.ExtrudeGeometry(strip(wB, wN, Y0, NUT), { depth: 0.005, bevelEnabled: false }), rosewood, gtr, 0, 0, ZF + 0.014);
const FB = ZF + 0.019;
for (let n = 1; n <= FRETS; n++) { const y = BRIDGE + SCALE / Math.pow(2, n / 12); box(wAt(y), 0.002, 0.0016, chrome, 0, y, FB + 0.0006);
  if ([3, 5, 7, 9, 12, 15, 17, 19, 21].includes(n)) { const ym = (y + BRIDGE + SCALE / Math.pow(2, (n - 1) / 12)) / 2; for (const x of n === 12 ? [-wAt(ym) / 5, wAt(ym) / 5] : [0]) mk(new THREE.CircleGeometry(0.0032, 16), pearl, gtr, x, ym, FB + 0.0003); } }
box(wN, 0.005, 0.006, pearl, 0, NUT + 0.0025, FB + 0.003);
// an inline headstock: every tuner on the bass side, buttons sticking out to the left
const head = new THREE.Group(); head.position.set(0, NUT + 0.005, ZF + 0.004); gtr.add(head);
const hw = wN / 2, hs = closed([[hw, 0], [hw + 0.006, 0.035], [hw + 0.002, HEAD * 0.55], [hw + 0.012, HEAD * 0.9], [hw - 0.004, HEAD], [-0.03, HEAD * 0.98], [-0.058, HEAD * 0.86], [-0.064, HEAD * 0.35], [-0.045, 0.05], [-hw, 0.002]], 80);
mk(new THREE.ExtrudeGeometry(hs, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.0015, bevelSize: 0.0015, bevelOffset: -0.0015, bevelSegments: 2 }), maple, head);
const posts = [];
for (let i = 0; i < N; i++) { const y = 0.035 + i * (HEAD * 0.82 - 0.035) / (N - 1), x = -0.032 - (bass ? 0.006 : 0.004) * Math.sin(i / (N - 1) * Math.PI);
  mk(new THREE.CylinderGeometry(bass ? 0.006 : 0.004, bass ? 0.006 : 0.004, 0.012, 14).rotateX(Math.PI / 2), chrome, head, x, y, 0.018);
  mk(new THREE.CylinderGeometry(0.0025, 0.0025, 0.05, 8).rotateZ(Math.PI / 2), chrome, head, x - 0.025, y, -0.006);
  mk(new THREE.BoxGeometry(0.004, bass ? 0.03 : 0.018, bass ? 0.022 : 0.012), chrome, head, x - 0.052, y, -0.006);
  posts.push(new THREE.Vector3(x, y, 0.02).add(head.position)); }
posts.reverse();   // the low string goes to the tuner furthest up the headstock

/* ---------------------------------------------------------------- strings */
const unseen = new THREE.MeshBasicMaterial({ visible: false }), wound = std(0xbfc3c8, 0.3, 1), plain = std(0xeef0f2, 0.15, 1), strings = [];
const span = (A, Bv, r, mat, box = false) => { const m = mk(box ? new THREE.BoxGeometry(1, 1, 1) : new THREE.CylinderGeometry(1, 1, 1, 6), mat, gtr); m.position.copy(A).add(Bv).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(Y, Bv.clone().sub(A).normalize()); m.scale.set(r, A.distanceTo(Bv), box ? 0.006 : r); return m; };
OPEN.forEach((hz, i) => {
  const k = i - (N - 1) / 2, A = new THREE.Vector3(k * sb, BRIDGE, ZF + 0.013), Bv = new THREE.Vector3(k * sn, NUT, FB + 0.006), r = bass ? 0.0011 - i * 0.00012 : 0.00062 - i * 0.00007;
  const m = span(A, Bv, r, bass || i < 3 ? wound : plain); span(Bv, posts[i], r * 0.9, bass || i < 3 ? wound : plain);
  const hit = span(A, Bv, Math.min(sb, sn) * 1.3, unseen, true); hit.position.z += 0.003; hit.userData.proxy = true;
  const s = { m, r, t: 0, live: false, hz }; strings.push(s); hit.userData.click = () => pluck(s);
});
const voice = bass ? 'bass' : 'electric';
const pluck = (s, when = 0) => { sound.pluck(s.hz, when, voice); s.t = -when; s.live = true; };
const strum = () => strings.forEach((s, i) => pluck(s, i * (bass ? 0.05 : 0.03)));

/* ------------------------------------------------------------ wall hanger */
// a walnut block screwed to the wall, with a padded yoke whose two prongs catch the headstock just above the nut
const tube = (a, b, r, mat) => { const A = new THREE.Vector3(...a), Bv = new THREE.Vector3(...b), m = mk(new THREE.CylinderGeometry(r, r, A.distanceTo(Bv), 10), mat, root); m.position.copy(A).add(Bv).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(Y, Bv.clone().sub(A).normalize()); return m; };
{ gtr.updateMatrix(); const yoke = new THREE.Vector3(0, NUT + 0.025, ZF + 0.004).applyMatrix4(gtr.matrix), Yh = yoke.y - 0.006, Z = yoke.z, rubber = std(0x0c0c0d, 0.9);
  mk(new THREE.BoxGeometry(0.075, 0.13, 0.022), gloss(0x4a2a16), root, 0, Yh + 0.02, 0.011);
  for (const s of [-1, 1]) mk(new THREE.CylinderGeometry(0.0035, 0.0035, 0.004, 10).rotateX(Math.PI / 2), chrome, root, 0, Yh + 0.02 + s * 0.045, 0.0235);
  tube([0, Yh, 0.022], [0, Yh - 0.004, Z - 0.03], 0.006, black);
  for (const s of [-1, 1]) { tube([0, Yh - 0.004, Z - 0.03], [s * 0.03, Yh, Z - 0.016], 0.005, black); tube([s * 0.03, Yh, Z - 0.016], [s * 0.032, Yh + 0.004, Z + 0.004], 0.008, rubber); } }

root.traverse(o => { if (o.isMesh && o.material.visible) o.castShadow = o.receiveShadow = true; });
function tick(dt) { for (const s of strings) if (s.live) { s.t += dt; if (s.t < 0) continue; const a = Math.exp(-s.t * (bass ? 1.6 : 2.2)); s.m.scale.x = s.r * (1 + 3 * a * (0.6 + 0.4 * Math.sin(s.t * 90))); if (a < 0.02) { s.m.scale.x = s.r; s.live = false; } } }
return { parts: {}, tick };
  } });

(window.DREAM_MUSIC = window.DREAM_MUSIC || []).push(
  electricInstrument({ name: 'Electric', title: 'Electric guitar', line: 'Cherry red, two pickups · click a string to pluck it, the body to strum',
    at: [-0.13, -2.758], turn: 0, view: { target: [0, 1.45, 0.1], cam: [0.45, 1.6, 2.5] } }),
  electricInstrument({ bass: true, name: 'Bass', title: 'Electric bass', line: 'Sunburst, four strings · click a string to pluck it, the body to play all four',
    at: [-0.66, -2.758], turn: 0, view: { target: [0, 1.4, 0.1], cam: [0.45, 1.55, 2.8] } }));
