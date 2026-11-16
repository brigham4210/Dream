/* The drum kit: a five-piece set with hi-hat, crash and ride. build() adds it to whatever `scene` it is given:
   the kit faces +z (the bass drum's front head), the drummer sits on the throne at -z, the floor is y = 0, metres.
   From the drummer's seat their left is +x: hi-hat, snare and high tom on that side, floor tom and ride on the right.
   Every drum and cymbal plays when clicked; the bass drum also plays from its pedal. */
(window.DREAM_MUSIC = window.DREAM_MUSIC || []).push({
  name: 'Drums', title: 'Drum kit', line: 'Five pieces, hi-hat, crash and ride · click any drum or cymbal to hit it',
  at: [2.35, 1.45], turn: -0.4, view: { target: [0, 0.75, -0.1], cam: [0.75, 1.55, 3.1] },
  build({ THREE, scene, sound }) {
const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
const chrome = std(0xe4e6e9, 0.15, 1), black = std(0x111113, 0.5, 0.2), felt = std(0xe8e2d4, 0.95), seat = std(0x141416, 0.6);
const shellMat = new THREE.MeshPhysicalMaterial({ color: 0x14244a, roughness: 0.32, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.04, side: THREE.DoubleSide });
const head = std(0xefece4, 0.75), bronze = new THREE.MeshPhysicalMaterial({ color: 0xc89a48, roughness: 0.26, metalness: 1, side: THREE.DoubleSide });
const unseen = new THREE.MeshBasicMaterial({ visible: false }), Y = new THREE.Vector3(0, 1, 0);
const kit = new THREE.Group(); scene.add(kit);
const mk = (geo, mat, parent = kit, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const tube = (a, b, r = 0.0095, mat = chrome) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), m = mk(new THREE.CylinderGeometry(r, r, A.distanceTo(B), 10), mat); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(Y, B.clone().sub(A).normalize()); return m; };
const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const hits = [];
const hit = (obj, kind, name) => { const h = { obj, kind, t: -1, y: obj.position.y, rx: obj.rotation.x }; hits.push(h); return () => { sound.drum(name); h.t = 0; }; };

/* ----------------------------------------------------------------- stands */
const tripod = (x, z, top, spread = 0.22) => { for (let i = 0; i < 3; i++) { const a = i * 2.094 + 0.5; tube([x, Math.min(top, 0.3), z], [x + spread * Math.cos(a), 0.01, z + spread * Math.sin(a)], 0.007); }
  tube([x, 0.01, z], [x, top, z], 0.0095); };

/* ------------------------------------------------------------------ drums */
// a drum stands upright in its own group: shell, a head top (batter) and bottom, hoops and lugs
function drum(r, depth, shell = shellMat, lugs = 8, bottom = true) {
  const g = new THREE.Group();
  mk(new THREE.CylinderGeometry(r, r, depth, 48, 1, true), shell, g);
  mk(new THREE.CircleGeometry(r * 0.99, 48).rotateX(-Math.PI / 2), head, g, 0, depth / 2 + 0.002, 0);
  if (bottom) mk(new THREE.CircleGeometry(r * 0.99, 48).rotateX(Math.PI / 2), head, g, 0, -depth / 2 - 0.002, 0);
  for (const s of bottom ? [1, -1] : [1]) mk(new THREE.TorusGeometry(r + 0.003, 0.0055, 8, 64).rotateX(Math.PI / 2), chrome, g, 0, s * (depth / 2 + 0.002), 0);
  for (let i = 0; i < lugs; i++) { const a = i * 2 * Math.PI / lugs, l = mk(new THREE.BoxGeometry(0.014, Math.min(0.07, depth * 0.4), 0.016), chrome, g, (r + 0.008) * Math.cos(a), 0, (r + 0.008) * Math.sin(a)); l.rotation.y = -a; }
  return g;
}
// bass drum, lying on its side with its batter head to the drummer and a black front head to the room
const BD = { r: 0.28, d: 0.4, y: 0.29, z: 0.05 };
{ const g = drum(BD.r, BD.d, shellMat, 10, false); g.rotation.x = -Math.PI / 2; g.position.set(0, BD.y, BD.z); kit.add(g);
  const front = canvasTex(512, 512, (c, w, h) => { c.fillStyle = '#0d0d10'; c.fillRect(0, 0, w, h); c.strokeStyle = '#e9e5da'; c.lineWidth = 6; c.beginPath(); c.arc(w / 2, h / 2, 150, 0, 7); c.stroke();
    c.fillStyle = '#e9e5da'; c.font = '600 54px "Helvetica Neue", Helvetica, Arial, sans-serif'; c.textBaseline = 'middle'; const s = 'DREAM'; let tw = 0; for (const ch of s) tw += c.measureText(ch).width + 18; let x = (w - tw + 18) / 2; for (const ch of s) { c.fillText(ch, x, h / 2 + 2); x += c.measureText(ch).width + 18; } });
  const reso = mk(new THREE.CircleGeometry(BD.r * 0.99, 64), std(0xffffff, 0.6, 0, { map: front }), kit, 0, BD.y, BD.z + BD.d / 2 + 0.002);
  mk(new THREE.TorusGeometry(BD.r + 0.004, 0.009, 8, 64), shellMat, kit, 0, BD.y, BD.z + BD.d / 2 + 0.002); mk(new THREE.TorusGeometry(BD.r + 0.004, 0.009, 8, 64), shellMat, kit, 0, BD.y, BD.z - BD.d / 2 - 0.002);
  const play = hit(g, 'drum', 'kick'); g.userData.click = play; reso.userData.click = play;
  for (const s of [1, -1]) tube([s * 0.2, 0.2, BD.z + 0.12], [s * 0.34, 0.005, BD.z + 0.3], 0.008);   // spurs
  // pedal: footboard, chain wheel and a felt beater just behind the batter head
  const pz = BD.z - BD.d / 2 - 0.02, pedal = new THREE.Group(); kit.add(pedal); pedal.userData.click = play;
  mk(new THREE.BoxGeometry(0.09, 0.012, 0.26), black, pedal, 0, 0.03, pz - 0.17).rotation.x = 0.2;
  mk(new THREE.BoxGeometry(0.16, 0.008, 0.06), black, pedal, 0, 0.006, pz - 0.02);
  for (const s of [1, -1]) tube([s * 0.06, 0.006, pz - 0.02], [s * 0.06, 0.16, pz - 0.02], 0.007);
  tube([-0.06, 0.16, pz - 0.02], [0.06, 0.16, pz - 0.02], 0.006, black);
  tube([0, 0.16, pz - 0.02], [0, 0.29, pz - 0.005], 0.004); mk(new THREE.CylinderGeometry(0.03, 0.03, 0.055, 20).rotateZ(Math.PI / 2), felt, pedal, 0, 0.3, pz - 0.005); }
// rack toms on a mount on top of the bass drum, tilted towards the drummer
const toms = [{ r: 0.127, d: 0.2, x: 0.15, y: 0.79, z: -0.04, name: 'tom1' }, { r: 0.152, d: 0.22, x: -0.17, y: 0.81, z: -0.02, name: 'tom2' }];
tube([0, BD.y + BD.r, BD.z], [0, 0.68, BD.z - 0.02], 0.012);
for (const t of toms) { const g = drum(t.r, t.d); g.position.set(t.x, t.y, t.z); g.rotation.set(-0.38, 0, Math.sign(t.x) * -0.12); kit.add(g); g.userData.click = hit(g, 'drum', t.name);
  tube([0, 0.68, BD.z - 0.02], [t.x * 0.7, t.y - 0.06, t.z + 0.06], 0.008); }
// floor tom on its own legs, at the drummer's right
{ const r = 0.203, d = 0.38, x = -0.5, z = -0.32, y = 0.43, g = drum(r, d); g.position.set(x, y, z); kit.add(g); g.userData.click = hit(g, 'drum', 'floor');
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + 0.3; tube([x + (r + 0.02) * Math.cos(a), y + 0.08, z + (r + 0.02) * Math.sin(a)], [x + (r + 0.07) * Math.cos(a), 0.005, z + (r + 0.07) * Math.sin(a)], 0.007); } }
// snare: a steel shell on a low stand between the drummer's knees, a little to the left
{ const x = 0.32, z = -0.4, g = drum(0.178, 0.14, chrome, 10); g.position.set(x, 0.62, z); g.rotation.set(-0.08, 0, -0.06); kit.add(g); g.userData.click = hit(g, 'drum', 'snare');
  tripod(x, z, 0.55, 0.2); for (let i = 0; i < 3; i++) { const a = i * 2.094; tube([x, 0.55, z], [x + 0.12 * Math.cos(a), 0.56, z + 0.12 * Math.sin(a)], 0.006); } }

/* ---------------------------------------------------------------- cymbals */
// a cymbal is a thin lathed dish with a raised bell; an unseen disc around it makes it easy to click from any side
function cymbal(r, x, y, z, rx, rz, name) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.set(rx, 0, rz); kit.add(g);
  const prof = [[0.006, 0.026], [0.03, 0.024], [0.045, 0.012], [0.06, 0.006], [r * 0.6, -0.002], [r, -0.012]].map(p => new THREE.Vector2(...p));
  mk(new THREE.LatheGeometry(prof, 64), bronze, g); mk(new THREE.CylinderGeometry(0.008, 0.008, 0.02, 12), black, g, 0, 0.03, 0);
  mk(new THREE.CylinderGeometry(r, r, 0.05, 32), unseen, g).userData.proxy = true;
  g.userData.click = hit(g, 'cymbal', name); return g;
}
{ const x = 0.6, z = -0.32; tripod(x, z, 0.9); tube([x, 0.9, z], [x, 1.02, z], 0.005);
  cymbal(0.178, x, 0.955, z, -0.05, 0, 'hat'); const lo = cymbal(0.178, x, 0.935, z, Math.PI, 0, 'hat'); lo.position.y = 0.93;
  mk(new THREE.BoxGeometry(0.08, 0.01, 0.24), black, kit, x, 0.03, z - 0.2).rotation.x = 0.18; }
{ const x = 0.62, z = 0.28; tripod(x, z, 1.15, 0.25); tube([x, 1.15, z], [0.46, 1.33, 0.1], 0.008); cymbal(0.23, 0.46, 1.36, 0.1, -0.28, -0.1, 'crash'); }
{ const x = -0.78, z = 0.15; tripod(x, z, 0.98, 0.25); tube([x, 0.98, z], [-0.62, 1.08, 0.02], 0.008); cymbal(0.26, -0.62, 1.11, 0.02, -0.22, 0.12, 'ride'); }

/* ----------------------------------------------------------------- throne */
{ const x = 0, z = -0.8; tripod(x, z, 0.46, 0.24); mk(new THREE.CylinderGeometry(0.17, 0.165, 0.08, 40), seat, kit, x, 0.5, z);
  mk(new THREE.TorusGeometry(0.168, 0.012, 8, 40).rotateX(Math.PI / 2), seat, kit, x, 0.5, z); }

kit.traverse(o => { if (o.isMesh && o.material.visible) o.castShadow = o.receiveShadow = true; });
function tick(dt) {
  for (const h of hits) { if (h.t < 0) continue; h.t += dt;
    if (h.kind === 'drum') { const a = Math.exp(-h.t * 18); h.obj.position.y = h.y - 0.004 * a * Math.cos(h.t * 60); if (a < 0.01) { h.obj.position.y = h.y; h.t = -1; } }
    else { const a = Math.exp(-h.t * 2.5); h.obj.rotation.x = h.rx + 0.14 * a * Math.sin(h.t * 14); if (a < 0.01) { h.obj.rotation.x = h.rx; h.t = -1; } } }
}
return { parts: {}, tick };
  } });
