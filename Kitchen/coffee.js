/* The coffee corner: a polished steel espresso machine and a grinder, standing on the worktop.
   build() adds it to whatever `scene` it is given: the wall is z = 0, the front towards +z, the worktop is y = 0.92, metres.
   Click the machine to pull a shot: the pump runs, the gauge climbs, two streams fill the cup and it steams. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Coffee', title: 'Espresso machine', line: 'Polished steel, one group · click it to pull a shot',
  at: [-1.95, -2.6], turn: 0, view: { target: [0.1, 1.14, 0.35], cam: [0.75, 1.5, 1.9] },
  build({ THREE, scene, sound, kit }) {
const { std, tex, tools, M, steam } = kit, g = new THREE.Group(); g.position.y = 0.92; scene.add(g);
const { mk, box, cyl, grp } = tools(g);
const chrome = std(0xe4e6e8, 0.12, 1), coffee = std(0x2a1508, 0.35), crema = std(0xb07a3c, 0.5);

/* ---------------------------------------------------------------- machine */
const m = grp(0, 0, 0.1); m.userData.click = () => brew();
const b = (...a) => box(...a, m), c = (...a) => { const [r, h, mat, x, y, z, seg] = a; return cyl(r, h, mat, x, y, z, m, seg); };
for (const x of [-0.15, 0.15]) for (const z of [0.03, 0.36]) c(0.016, 0.02, M.black, x, 0.01, z, 16);
b(-0.18, 0.18, 0.02, 0.3, 0, 0.26, chrome); b(-0.18, 0.18, 0.3, 0.4, 0, 0.4, chrome); b(-0.17, 0.17, 0.02, 0.07, 0.26, 0.4, chrome); b(-0.15, 0.15, 0.07, 0.074, 0.27, 0.39, M.black);
for (const k of [-1, 1]) b(k * 0.18 - (k > 0 ? 0.004 : 0), k * 0.18 + (k < 0 ? 0.004 : 0), 0.4, 0.43, 0.01, 0.39, chrome); b(-0.18, 0.18, 0.4, 0.43, 0.386, 0.39, chrome); b(-0.18, 0.18, 0.4, 0.43, 0.01, 0.014, chrome);
// cups warming on top
const cupShape = [[0, 0.004], [0.022, 0.004], [0.033, 0.03], [0.036, 0.056], [0.039, 0.056], [0.036, 0.028], [0.025, 0], [0, 0]].map(p => new THREE.Vector2(...p));
const cup = (x, y, z, parent = m) => { const k = grp(x, y, z, parent); mk(new THREE.LatheGeometry(cupShape, 32), M.ceramic, k); mk(new THREE.TorusGeometry(0.016, 0.004, 8, 20, Math.PI).rotateZ(-Math.PI / 2), M.ceramic, k, 0.036, 0.03, 0); return k; };
for (const [x, z] of [[-0.1, 0.12], [0, 0.1], [0.1, 0.13], [-0.05, 0.25], [0.06, 0.26]]) cup(x, 0.456, z).rotation.set(Math.PI, x * 9, 0);
// the group head, the portafilter locked into it, and the cup underneath
c(0.045, 0.035, chrome, 0, 0.283, 0.33, 32); c(0.04, 0.03, chrome, 0, 0.252, 0.33, 32); c(0.012, 0.13, M.black, 0, 0.25, 0.44, 16).rotation.x = Math.PI / 2 - 0.15; mk(new THREE.SphereGeometry(0.016, 16, 12), M.black, m, 0, 0.24, 0.505);
for (const k of [-1, 1]) c(0.005, 0.03, chrome, k * 0.012, 0.225, 0.33, 10);
const shot = cup(0, 0.074, 0.33), level = mk(new THREE.CircleGeometry(0.03, 32).rotateX(-Math.PI / 2), crema, shot, 0, 0.008, 0); level.visible = false;
const streams = [-1, 1].map(k => { const s = mk(new THREE.CylinderGeometry(0.0022, 0.0018, 1, 8).translate(0, -0.5, 0), coffee, m, k * 0.012, 0.21, 0.33); s.visible = false; s.userData.through = true; return s; });
// gauge, steam wand, hot-water knob, switch
const face = tex(128, 128, (x, w) => { x.fillStyle = '#f6f4ee'; x.beginPath(); x.arc(w / 2, w / 2, w / 2, 0, 7); x.fill(); x.strokeStyle = '#1c1d1f'; x.lineWidth = 3;
  for (let i = 0; i <= 12; i++) { const a = Math.PI * 0.75 + i / 12 * Math.PI * 1.5; x.beginPath(); x.moveTo(w / 2 + Math.cos(a) * 46, w / 2 + Math.sin(a) * 46); x.lineTo(w / 2 + Math.cos(a) * (i % 3 ? 54 : 58), w / 2 + Math.sin(a) * (i % 3 ? 54 : 58)); x.stroke(); }
  x.strokeStyle = '#3a8f4a'; x.lineWidth = 6; x.beginPath(); x.arc(w / 2, w / 2, 40, Math.PI * 0.75 + 0.6 * Math.PI * 1.5, Math.PI * 0.75 + 0.8 * Math.PI * 1.5); x.stroke(); });
c(0.034, 0.012, chrome, -0.1, 0.35, 0.4, 32).rotation.x = Math.PI / 2; mk(new THREE.CircleGeometry(0.03, 32), std(0xffffff, 0.4, 0, { map: face }), m, -0.1, 0.35, 0.4065);
const needle = grp(-0.1, 0.35, 0.408, m); box(-0.0012, 0.0012, -0.004, 0.024, 0, 0.001, std(0xc0271d, 0.5), needle); needle.rotation.z = Math.PI * 0.75;
c(0.012, 0.016, M.brass, 0.1, 0.35, 0.405, 20).rotation.x = Math.PI / 2; box(0.097, 0.103, 0.35, 0.378, 0.41, 0.418, M.brass, m);
c(0.02, 0.03, M.black, 0.195, 0.34, 0.2, 20).rotation.z = Math.PI / 2;
{ const w = grp(0.15, 0.3, 0.36, m); w.rotation.set(0.25, 0, -0.3); cyl(0.005, 0.2, chrome, 0, -0.1, 0, w, 10); cyl(0.007, 0.02, chrome, 0, -0.2, 0, w, 10); }
// a milk jug and a tamper beside it
mk(new THREE.CylinderGeometry(0.04, 0.048, 0.1, 28, 1, true), std(0xe4e6e8, 0.15, 1, { side: THREE.DoubleSide }), g, 0.27, 0.05, 0.45); cyl(0.047, 0.004, chrome, 0.27, 0.002, 0.45); mk(new THREE.TorusGeometry(0.028, 0.004, 8, 20, Math.PI).rotateZ(-Math.PI / 2), chrome, g, 0.315, 0.05, 0.45);

/* ---------------------------------------------------------------- grinder */
{ const x = 0.36, z = 0.22; box(x - 0.07, x + 0.07, 0, 0.26, z - 0.09, z + 0.09, M.black); box(x - 0.075, x + 0.075, 0, 0.015, z - 0.095, z + 0.14, M.black);
  mk(new THREE.CylinderGeometry(0.075, 0.045, 0.15, 32, 1, true), M.glass, g, x, 0.335, z).userData.through = true; mk(new THREE.CylinderGeometry(0.066, 0.045, 0.09, 32), std(0x3a2110, 0.6), g, x, 0.305, z); cyl(0.078, 0.012, M.black, x, 0.416, z, g, 32);
  cyl(0.014, 0.05, chrome, x, 0.17, z + 0.11, g, 16).rotation.x = Math.PI / 2 - 0.5; cyl(0.022, 0.012, M.brass, x + 0.072, 0.2, z, g, 20).rotation.z = Math.PI / 2; }

g.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = o.receiveShadow = true; });
// pulling a shot: 25 seconds in a real cafe, 7 here
const puffs = steam(g, 0, 0.14, 0.43, 5, 0.07, 0.2), PULL = 7; let t = -1, hot = 0;
function brew() { if (t >= 0 && t < PULL) return; t = 0; hot = 0; level.visible = false; sound.click(); sound.loop('pump', 1); }
function tick(dt) {
  puffs(dt, hot); hot = Math.max(0, hot - dt / 40);
  if (t < 0) return; t += dt;
  const run = t > 1 && t < PULL, fill = Math.min(1, Math.max(0, (t - 1.2) / (PULL - 1.2))), y = 0.008 + fill * 0.036;
  for (const s of streams) { s.visible = run; s.scale.y = 0.21 - 0.074 - y; }
  level.visible = fill > 0; level.position.y = y; level.scale.setScalar(0.78 + fill * 0.32);
  needle.rotation.z = Math.PI * 0.75 - Math.min(1, t / 1.2) * Math.min(1, Math.max(0, (PULL + 0.6 - t) / 0.6)) * Math.PI * 1.05;
  if (t > 1.5) hot = 1;
  if (t >= PULL && t - dt < PULL) sound.loop('pump', 0);
  if (t > PULL + 0.7) t = -1;
}
return { parts: {}, tick };
  } });
