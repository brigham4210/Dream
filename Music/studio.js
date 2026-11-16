/* The singing studio: a glazed vocal booth for a corner of the room. build() adds it to whatever `scene` it is given:
   door towards +z, glass side towards -x, the other two sides against the room's walls, floor on y = 0, metres.
   The door opens; the microphone (or the sign over the door) switches the RECORDING light. */
(window.DREAM_MUSIC = window.DREAM_MUSIC || []).push({
  name: 'Studio', title: 'Singing studio', line: 'Vocal booth · click the door to open it, the microphone to start recording',
  at: [2.57, -1.83], turn: 0, view: { target: [-0.1, 1.15, 0.2], cam: [-2.6, 1.75, 4.6] },
  build({ THREE, scene }) {
const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
const g = new THREE.Group(); scene.add(g);
const mk = (geo, mat, parent = g, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const box = (x0, x1, y0, y1, z0, z1, mat, parent = g) => mk(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat, parent, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
const cyl = (r, h, mat, x, y, z, parent = g, seg = 24) => mk(new THREE.CylinderGeometry(r, r, h, seg), mat, parent, x, y, z);
const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const frame = std(0x18181a, 0.45, 0.4), steel = std(0xcfd2d6, 0.25, 1), black = std(0x101012, 0.5, 0.2), rubber = std(0x0c0c0d, 0.9);
const glass = new THREE.MeshPhysicalMaterial({ color: 0xcfe0e2, roughness: 0.03, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false });

/* ------------------------------------------------------------------ booth */
const HX = 1.1, HZ = 0.95, H = 2.3, DOOR_H = 2.02, P = 0.05, HINGE = 0.82, DOOR_W = 0.86;
box(-HX, HX, 0, 0.012, -HZ, HZ, std(0x2b2c30, 1));                              // carpet
box(-HX, HX, H - 0.08, H, -HZ, HZ, frame);                                      // roof
// two solid sides, lined with acoustic foam
const foam = canvasTex(512, 512, (c, w, h) => { const n = 8, s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
  const gr = c.createRadialGradient((i + 0.5) * s, (j + 0.5) * s, 1, (i + 0.5) * s, (j + 0.5) * s, s * 0.72); gr.addColorStop(0, '#5a5c62'); gr.addColorStop(1, '#17181b'); c.fillStyle = gr; c.fillRect(i * s, j * s, s, s); } });
foam.wrapS = foam.wrapT = THREE.RepeatWrapping;
const pad = (w, x, z, ry) => { const t = foam.clone(); t.repeat.set(w / 0.6, (H - 0.1) / 0.6); const m = mk(new THREE.PlaneGeometry(w, H - 0.1), std(0xffffff, 1, 0, { map: t }), g, x, (H - 0.1) / 2 + 0.01, z); m.rotation.y = ry; };
box(-HX, HX, 0, H, -HZ, -HZ + 0.04, frame); box(HX - 0.04, HX, 0, H, -HZ, HZ, frame); pad(2 * HX - 0.08, 0, -HZ + 0.045, 0); pad(2 * HZ - 0.08, HX - 0.045, 0, -Math.PI / 2);
// two glazed sides on black posts
const pane = (x0, x1, z0, z1, y0 = 0.05, y1 = H - 0.1) => { const m = box(x0, x1, y0, y1, z0, z1, glass); m.userData.through = true; m.renderOrder = 5; return m; };
for (const [x, z] of [[-HX, HZ], [-HX, -HZ + 0.04], [-HX, 0.02], [HINGE, HZ], [HINGE - DOOR_W - P, HZ]]) box(x, x + P, 0, H - 0.08, z - P, z, frame);
box(-HX, HX - 0.04, DOOR_H, DOOR_H + 0.05, HZ - P, HZ, frame); box(-HX, -HX + P, 0, 0.05, -HZ, HZ, frame); box(-HX, HINGE - DOOR_W - P, 0, 0.05, HZ - P, HZ, frame);
pane(-HX + 0.02, -HX + 0.03, -HZ + 0.04, -0.03); pane(-HX + 0.02, -HX + 0.03, 0.02, HZ - P);
pane(-HX + P, HINGE - DOOR_W - P, HZ - 0.03, HZ - 0.02, 0.05, DOOR_H); pane(HINGE + P, HX - 0.04, HZ - 0.03, HZ - 0.02, 0.05, DOOR_H);
// the door: glass in a black frame, hinged on the right as you face it
const door = new THREE.Group(); door.position.set(HINGE, 0, HZ - P / 2); g.add(door);
{ const d = new THREE.Group(); door.add(d); d.userData.click = () => { parts.door.t = parts.door.t ? 0 : 1; };
  for (const x of [-DOOR_W, -0.045]) box(x, x + 0.045, 0.02, DOOR_H - 0.01, -0.02, 0.02, frame, d);
  for (const y of [0.02, DOOR_H - 0.055]) box(-DOOR_W, 0, y, y + 0.045, -0.02, 0.02, frame, d);
  box(-DOOR_W + 0.045, -0.045, 0.065, DOOR_H - 0.055, -0.005, 0.005, glass, d).renderOrder = 5;
  for (const z of [-0.05, 0.05]) box(-DOOR_W + 0.07, -DOOR_W + 0.09, 0.85, 1.25, z - 0.01, z + 0.01, steel, d); }

/* ------------------------------------------------- the sign over the door */
const signTex = canvasTex(512, 128, (c, w, h) => { c.fillStyle = '#1a0606'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff3b30'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '700 62px "Helvetica Neue", Helvetica, Arial, sans-serif'; const s = 'RECORDING'; let tw = 0; for (const ch of s) tw += c.measureText(ch).width + 12; let x = (w - tw + 12) / 2; c.textAlign = 'left'; for (const ch of s) { c.fillText(ch, x, h / 2 + 4); x += c.measureText(ch).width + 12; } });
const signMat = std(0xffffff, 0.4, 0, { map: signTex, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.12 });
const SX = HINGE - DOOR_W / 2;
box(SX - 0.27, SX + 0.27, DOOR_H + 0.07, DOOR_H + 0.19, HZ, HZ + 0.045, frame);
const sign = mk(new THREE.PlaneGeometry(0.5, 0.1), signMat, g, SX, DOOR_H + 0.13, HZ + 0.046); sign.userData.click = () => record();
const red = new THREE.PointLight(0xff2a1c, 0, 2.2, 1.6); red.position.set(SX, DOOR_H + 0.1, HZ + 0.25); g.add(red);
const lamp = new THREE.PointLight(0xffe6c8, 2.2, 3.4, 1.5); lamp.position.set(0, H - 0.2, 0); g.add(lamp);
mk(new THREE.CircleGeometry(0.09, 32).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2.8, 2.4) }), g, 0, H - 0.082, 0);

/* ------------------------------------------- microphone, headphones, stand */
const mic = new THREE.Group(); mic.position.set(0.05, 0, -0.2); g.add(mic); mic.userData.click = () => record();
cyl(0.16, 0.022, black, 0, 0.011, 0, mic, 40); cyl(0.012, 1.3, steel, 0, 0.67, 0, mic); cyl(0.017, 0.07, black, 0, 1.0, 0, mic);
{ const boom = cyl(0.008, 0.34, steel, 0, 1.4, 0.08, mic, 12); boom.rotation.x = 1.1;
  const head = new THREE.Group(); head.position.set(0, 1.48, 0.23); mic.add(head);
  mk(new THREE.TorusGeometry(0.047, 0.005, 10, 40).rotateX(Math.PI / 2), black, head, 0, 0.03, 0); mk(new THREE.TorusGeometry(0.047, 0.005, 10, 40).rotateX(Math.PI / 2), black, head, 0, -0.04, 0);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; cyl(0.004, 0.075, black, 0.047 * Math.cos(a), -0.005, 0.047 * Math.sin(a), head, 8); }
  cyl(0.026, 0.11, std(0xb9a98a, 0.3, 0.9), 0, -0.035, 0, head, 32);                                 // body
  const grille = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#8f9296'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a2b2e'; for (let y = 0; y < h; y += 6) for (let x = (y / 6 % 2) * 3; x < w; x += 6) c.fillRect(x, y, 3, 3); });
  grille.wrapS = grille.wrapT = THREE.RepeatWrapping; grille.repeat.set(6, 3);
  mk(new THREE.CapsuleGeometry(0.029, 0.05, 8, 32), std(0xffffff, 0.35, 0.8, { map: grille }), head, 0, 0.065, 0);
  // pop filter on a gooseneck, between the singer and the microphone
  const mesh = canvasTex(128, 128, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(10,10,12,.9)'; c.lineWidth = 1.4; for (let i = 0; i < w; i += 4) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } });
  mesh.wrapS = mesh.wrapT = THREE.RepeatWrapping; mesh.repeat.set(5, 5);
  mk(new THREE.CircleGeometry(0.078, 40), new THREE.MeshStandardMaterial({ map: mesh, transparent: true, side: THREE.DoubleSide, roughness: 0.9, depthWrite: false }), head, 0, 0.05, 0.12).userData.through = true;
  mk(new THREE.TorusGeometry(0.08, 0.005, 10, 48), black, head, 0, 0.05, 0.12);
  const neck = cyl(0.004, 0.26, black, 0.05, -0.07, 0.085, head, 8); neck.rotation.set(0.5, 0, 0.42); }
// headphones hanging on the stand
{ const hp = new THREE.Group(); hp.position.set(0, 0.93, 0.03); hp.rotation.x = 0.12; mic.add(hp);
  mk(new THREE.TorusGeometry(0.085, 0.009, 10, 40, Math.PI), black, hp, 0, 0, 0);
  for (const s of [1, -1]) { cyl(0.045, 0.034, black, s * 0.085, -0.045, 0, hp, 32).rotation.z = Math.PI / 2; cyl(0.04, 0.012, std(0x3a3b40, 0.9), s * 0.064, -0.045, 0, hp, 32).rotation.z = Math.PI / 2; cyl(0.004, 0.05, steel, s * 0.085, -0.01, 0, hp, 8); } }
// a music stand with the lyrics on it
{ const ms = new THREE.Group(); ms.position.set(-0.62, 0, -0.25); ms.rotation.y = 0.5; g.add(ms);
  cyl(0.011, 1.05, black, 0, 0.53, 0, ms); for (let i = 0; i < 3; i++) { const a = i * 2.094, l = cyl(0.008, 0.34, black, 0.13 * Math.cos(a), 0.09, 0.13 * Math.sin(a), ms, 8); l.rotation.set(Math.sin(a) * 1.1, 0, -Math.cos(a) * 1.1); }
  const tray = new THREE.Group(); tray.position.set(0, 1.08, 0); tray.rotation.x = -0.35; ms.add(tray);
  box(-0.24, 0.24, -0.02, 0.32, -0.004, 0.004, black, tray); box(-0.24, 0.24, -0.03, -0.015, 0, 0.045, black, tray);
  const lyric = canvasTex(256, 340, (c, w, h) => { c.fillStyle = '#fbf9f2'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(30,30,30,.55)'; for (let i = 0; i < 16; i++) { if (i % 5 === 4) continue; c.fillRect(22, 26 + i * 18, 90 + (i * 53 % 110), 5); } });
  mk(new THREE.PlaneGeometry(0.21, 0.29), std(0xffffff, 0.85, 0, { map: lyric }), tray, 0, 0.15, 0.006); }

g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = o.receiveShadow = true; });
const parts = {
  door: { set: v => { door.rotation.y = v * 1.45; } },
  rec: { set: v => { signMat.emissiveIntensity = 0.12 + 2.6 * v; red.intensity = 1.6 * v; } },
};
const record = () => { parts.rec.t = parts.rec.t ? 0 : 1; };
return { parts };
  } });
