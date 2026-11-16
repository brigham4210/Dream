/* The cajón: a wooden box drum you sit on and play with your hands. build() adds it to whatever `scene` it is given:
   the playing face (the tapa) towards +z, the sound hole at the back, the floor is y = 0, metres.
   Like the real thing, it has two sounds: a deep bass from the middle of the tapa and a sharp slap from its top edge. */
(window.DREAM_MUSIC = window.DREAM_MUSIC || []).push({
  name: 'Cajón', title: 'Cajón', line: 'Birch box, walnut front · click the top edge to slap, the middle for bass',
  at: [-2.2, 1.95], turn: 0.5, view: { target: [0, 0.32, 0], cam: [0.35, 0.8, 1.55] },
  build({ THREE, scene, sound }) {
const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
const g = new THREE.Group(); scene.add(g);
const mk = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m; };
const wood = (base, dark, n, plies) => { const c = document.createElement('canvas'); c.width = 256; c.height = 512; const x = c.getContext('2d');
  x.fillStyle = base; x.fillRect(0, 0, 256, 512);
  for (let i = 0; i < n; i++) { x.strokeStyle = `rgba(${dark},${0.05 + Math.random() * 0.12})`; x.lineWidth = 0.6 + Math.random() * 1.6; x.beginPath(); const x0 = Math.random() * 256;
    x.moveTo(x0, 0); x.bezierCurveTo(x0 + 10 - Math.random() * 20, 170, x0 + 12 - Math.random() * 24, 340, x0 + 8 - Math.random() * 16, 512); x.stroke(); }
  if (plies) { x.fillStyle = 'rgba(120,80,40,.35)'; for (const y of [0, 509]) x.fillRect(0, y, 256, 3); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const W = 0.3, D = 0.3, H = 0.48, T = 0.012;
const birch = std(0xffffff, 0.55, 0, { map: wood('#d9b98a', '140,90,40', 60, true) }), tapaMat = new THREE.MeshPhysicalMaterial({ map: wood('#5a3520', '25,12,5', 90), roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.2 });
const steel = std(0xd8dadd, 0.25, 1), rubber = std(0x0c0c0d, 0.9);

// the box: two sides, a top and a bottom, and a back with the sound hole; the corners are lightly rounded by thin edge strips
for (const s of [1, -1]) mk(new THREE.BoxGeometry(T, H, D), birch, s * (W / 2 - T / 2), H / 2 + 0.012, 0);
for (const y of [0.012 + T / 2, H + 0.012 - T / 2]) mk(new THREE.BoxGeometry(W - 2 * T, T, D), birch, 0, y, 0);
{ const back = new THREE.Shape([[-W / 2 + T, 0], [W / 2 - T, 0], [W / 2 - T, H - 2 * T], [-W / 2 + T, H - 2 * T]].map(p => new THREE.Vector2(...p)));
  back.holes.push(new THREE.Path().absarc(0, (H - 2 * T) * 0.62, 0.055, 0, Math.PI * 2, true));
  const m = mk(new THREE.ExtrudeGeometry(back, { depth: 0.008, bevelEnabled: false }), birch, 0, 0.012 + T, -D / 2); m.rotation.y = Math.PI; m.position.z = -D / 2 + 0.008;
  mk(new THREE.CircleGeometry(0.055, 32).rotateY(Math.PI), std(0x0a0806, 1), 0, 0.012 + T + (H - 2 * T) * 0.62, -D / 2 + 0.03); }
for (const x of [-1, 1]) for (const z of [-1, 1]) mk(new THREE.CylinderGeometry(0.014, 0.016, 0.012, 16), rubber, x * (W / 2 - 0.03), 0.006, z * (D / 2 - 0.03));
// the tapa: one thin sheet over the front, here in two parts so the top edge (slap) and the middle (bass) can be told apart
const TOP = 0.11, ZT = D / 2 + 0.002;
const slap = mk(new THREE.BoxGeometry(W, TOP, 0.004), tapaMat, 0, 0.012 + H - TOP / 2, ZT);
const low = mk(new THREE.BoxGeometry(W, H - TOP, 0.004), tapaMat, 0, 0.012 + (H - TOP) / 2, ZT);
for (const x of [-1, 1]) for (const y of [0.03, 0.17, 0.31, 0.45]) mk(new THREE.CylinderGeometry(0.0035, 0.0035, 0.002, 12).rotateX(Math.PI / 2), steel, x * (W / 2 - 0.012), 0.012 + y, ZT + 0.002);
for (const x of [-1, 1]) mk(new THREE.CylinderGeometry(0.0035, 0.0035, 0.002, 12).rotateX(Math.PI / 2), steel, x * 0.07, 0.012 + H - 0.012, ZT + 0.002);

g.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
let t = -1;
slap.userData.click = () => { sound.drum('cajonSlap'); t = 0; };
low.userData.click = () => { sound.drum('cajonBass'); t = 0; };
function tick(dt) { if (t < 0) return; t += dt; const a = Math.exp(-t * 16); g.position.z = 0.0025 * a * Math.cos(t * 55); if (a < 0.01) { g.position.z = 0; t = -1; } }
return { parts: {}, tick };
  } });
