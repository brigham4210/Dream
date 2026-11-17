/* The counter along the back wall: green cabinets under a marble worktop, either side of the range, with a sink under a window
   and two oak shelves of crockery. build() adds it to whatever `scene` it is given: the wall is z = 0, the room is towards +z,
   x = 0 is the middle of the room, the floor is y = 0, metres. Every door and drawer opens; the tap runs. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Counter', title: 'Counter and sink', line: 'Marble on green cabinets · click a door or drawer to open it, the tap to run the water',
  at: [0, -2.6], turn: 0, view: { target: [2.0, 1.1, 0.3], cam: [1.55, 1.85, 2.45] },
  build({ THREE, scene, sound, kit }) {
const { std, tex, rand, tools, M, front, pull, knob, slab, herb } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), rnd = rand(31), parts = {}; let n = 0;
const part = set => { const p = { set }; parts['p' + n++] = p; return () => { p.t = p.t ? 0 : 1; sound.tap(); }; };
const H = 0.88, KICK = 0.1, D = 0.6, TOP = 0.92, FZ = D + 0.01;

/* --------------------------------------------------------------- cabinets */
// one open-fronted box per stretch of counter, divided where the units meet
function carcass(x0, x1, cuts) {
  box(x0, x1, KICK, KICK + 0.018, 0, D, M.oak); box(x0, x1, KICK, H, 0, 0.018, M.oak); box(x0, x1, 0, KICK, 0, D - 0.06, M.black);
  for (const x of cuts) box(x - 0.009, x + 0.009, KICK, H, 0, D, M.oak);
  for (const x of [x0, x1 - 0.018]) box(x, x + 0.018, 0, H, 0, D + 0.002, M.paint);
}
function doors(x0, x1, shelf = true) {
  const w = x1 - x0, two = w > 0.55, dw = two ? w / 2 : w, h = H - KICK - 0.006;
  if (shelf) box(x0 + 0.01, x1 - 0.01, 0.48, 0.498, 0.02, D - 0.03, M.oak);
  for (const s of two ? [-1, 1] : [-1]) { const hinge = grp(s < 0 ? x0 : x1, 0, FZ);
    const f = front(dw - 0.004, h, M.paint, hinge, -s * dw / 2, KICK + 0.003 + h / 2, 0); knob(f, -s * (dw / 2 - 0.035), h / 2 - 0.09, 0.014);
    hinge.userData.click = part(v => { hinge.rotation.y = s * v * 1.6; }); }
}
function drawers(x0, x1, fill) {
  const w = x1 - x0, hw = w / 2 - 0.03; let y = KICK + 0.003;
  [0.3, 0.28, 0.188].forEach((h, i) => { const d = grp((x0 + x1) / 2, y, FZ);
    front(w - 0.004, h, M.paint, d, 0, h / 2, 0); pull(d, 0, h < 0.2 ? h / 2 : h - 0.095, 0.014, 0.16);
    box(-hw, hw, 0.02, 0.03, -D + 0.05, -0.008, M.oak, d); box(-hw, hw, 0.02, h - 0.05, -D + 0.05, -D + 0.062, M.oak, d);
    for (const k of [-1, 1]) box(k * hw - (k > 0 ? 0.012 : 0), k * hw + (k < 0 ? 0.012 : 0), 0.02, h - 0.05, -D + 0.05, -0.008, M.oak, d);
    if (fill) fill(d, i, hw);
    d.userData.click = part(v => { d.position.z = FZ + v * 0.42; });
    y += h + 0.003; });
}
// a dishwasher behind a cabinet front: the door drops down
function dishwasher(x0, x1) {
  const w = x1 - x0, cx = (x0 + x1) / 2, h = H - KICK - 0.006;
  mk(new THREE.BoxGeometry(w - 0.04, H - KICK - 0.04, D - 0.03), std(0xc9ccd0, 0.35, 0.9, { side: THREE.BackSide }), g, cx, (H + KICK) / 2, D / 2 + 0.015);
  for (const [ry, tall] of [[0.2, 0], [0.5, 1]]) { for (const k of [-1, 1]) { box(cx + k * (w / 2 - 0.05) - 0.004, cx + k * (w / 2 - 0.05) + 0.004, ry, ry + 0.008, 0.06, D - 0.04, M.steel); box(cx - w / 2 + 0.05, cx + w / 2 - 0.05, ry, ry + 0.008, k < 0 ? 0.06 : D - 0.048, k < 0 ? 0.068 : D - 0.04, M.steel); }
    for (let i = 0; i < 7; i++) { const x = cx - w / 2 + 0.1 + i * (w - 0.2) / 6;
      if (tall) mk(new THREE.CylinderGeometry(0.03, 0.035, 0.1, 20, 1, true), M.glass, g, x, ry + 0.06, 0.2 + (i % 2) * 0.2).userData.through = true;
      else cyl(0.12, 0.008, M.ceramic, x, ry + 0.13, 0.3, g, 32).rotation.z = Math.PI / 2 - 0.12; } }
  const door = grp(cx, KICK + 0.003, FZ); front(w - 0.004, h, M.paint, door, 0, h / 2, 0); pull(door, 0, h - 0.095, 0.014, 0.3);
  box(-w / 2 + 0.015, w / 2 - 0.015, 0.01, h - 0.01, -0.03, -0.008, M.steel, door);
  door.userData.click = part(v => { door.rotation.x = v * 1.5; });
}
// what is in the drawers: cutlery on top, pans and lids below
const cutlery = (d, i, hw) => { if (i === 2) for (let k = 0; k < 10; k++) box(-hw + 0.05 + k * 0.055, -hw + 0.062 + k * 0.055, 0.03, 0.036, -0.4, -0.2 + (k % 3) * 0.03, M.steel, d);
  else if (i === 1) for (const [x, r] of [[-0.15, 0.12], [0.14, 0.1]]) { cyl(r, 0.09, M.steel, x, 0.075, -0.27, d, 32); cyl(r + 0.004, 0.006, M.brass, x, 0.123, -0.27, d, 32); }
  else for (let k = 0; k < 3; k++) cyl(0.14 - k * 0.012, 0.02, M.iron, 0, 0.04 + k * 0.022, -0.27, d, 32); };
const linens = (d, i, hw) => { if (i > 0) for (let k = 0; k < 3; k++) box(-hw + 0.04 + k * 0.2, -hw + 0.2 + k * 0.2, 0.03, 0.09, -0.45, -0.08, std([0xe8e2d4, 0x9fb0a0, 0xd9c7a8][k], 0.95), d);
  else for (const x of [-0.14, 0.14]) cyl(0.11, 0.14, M.brass, x, 0.1, -0.27, d, 32); };

const L0 = -2.64, L1 = -0.3, R0 = 0.9, R1 = 3.6;
carcass(L0, L1, [-1.9, -1.1]); drawers(L0 + 0.018, -1.9, cutlery); doors(-1.9, -1.1); doors(-1.1, L1 - 0.018);
carcass(R0, R1, [1.6, 2.6, 3.2]); drawers(R0 + 0.018, 1.6, linens); doors(1.6, 2.6, false); dishwasher(2.6, 3.2); doors(3.2, R1 - 0.018);
// something on the shelves behind the doors
for (const [x, y] of [[-1.7, 0.498], [-1.3, 0.118], [-0.9, 0.498], [-0.55, 0.118], [3.38, 0.118]]) { cyl(0.11, 0.1, M.steel, x, y + 0.05, 0.3, g, 32); cyl(0.115, 0.008, M.steel, x, y + 0.104, 0.3, g, 32); }
for (const [x, y] of [[-1.3, 0.498], [-0.6, 0.498], [3.4, 0.498]]) for (let k = 0; k < 5; k++) mk(new THREE.CylinderGeometry(0.11, 0.07, 0.04, 32, 1, true), M.ceramic, g, x, y + 0.02 + k * 0.014, 0.28);

/* ---------------------------------------------------------------- worktop */
const SX0 = 1.82, SX1 = 2.38, SZ0 = 0.14, SZ1 = 0.5, SINK = 0.68;
for (const s of [slab(L0, L1, 0, 0.65, H, TOP, M.marble), slab(R0, R1, 0, 0.65, H, TOP, M.marble, [SX0, SX1, SZ0, SZ1])]) g.add(s);
// the sink: a steel basin under the stone, and a brass tap with a swan neck
box(SX0 - 0.02, SX1 + 0.02, SINK - 0.01, SINK, SZ0 - 0.02, SZ1 + 0.02, M.steel);
for (const k of [0, 1]) { box(k ? SX1 : SX0 - 0.012, k ? SX1 + 0.012 : SX0, SINK, H, SZ0 - 0.012, SZ1 + 0.012, M.steel); box(SX0, SX1, SINK, H, k ? SZ1 : SZ0 - 0.012, k ? SZ1 + 0.012 : SZ0, M.steel); }
const CX = (SX0 + SX1) / 2, TZ = 0.075;
cyl(0.03, 0.004, M.black, CX, SINK + 0.002, 0.3, g, 24);
const tap = grp(CX, TOP, TZ);
cyl(0.024, 0.03, M.brass, 0, 0.015, 0, tap); cyl(0.012, 0.3, M.brass, 0, 0.18, 0, tap, 16);
mk(new THREE.TorusGeometry(0.09, 0.012, 12, 32, Math.PI).rotateY(Math.PI / 2), M.brass, tap, 0, 0.33, 0.09); cyl(0.012, 0.05, M.brass, 0, 0.305, 0.18, tap, 16);
const lever = grp(0.03, 0.05, 0, tap); cyl(0.007, 0.09, M.brass, 0.045, 0, 0, lever, 12).rotation.z = Math.PI / 2; mk(new THREE.SphereGeometry(0.011, 12, 10), M.brass, lever, 0.09, 0, 0);
const water = mk(new THREE.CylinderGeometry(0.006, 0.008, 1, 12).translate(0, -0.5, 0), new THREE.MeshPhysicalMaterial({ color: 0xcfe6f2, roughness: 0.05, transparent: true, opacity: 0.6, depthWrite: false }), tap, 0, 0.28, 0.18);
const pool = mk(new THREE.CircleGeometry(0.07, 32).rotateX(-Math.PI / 2), water.material, g, CX, SINK + 0.004, TZ + 0.18);
water.userData.through = pool.userData.through = true; water.visible = pool.visible = false;
parts.water = { set: v => { water.visible = pool.visible = v > 0.01; water.scale.y = Math.max(0.001, Math.min(1, v * 2.5) * (TOP + 0.28 - SINK)); pool.scale.setScalar(Math.max(0.001, v)); lever.rotation.z = v * 0.7; } };
tap.userData.click = () => { const p = parts.water; p.t = p.t ? 0 : 1; sound.click(); sound.loop('water', p.t); };
// soap by the sink
cyl(0.028, 0.12, std(0x6b4423, 0.25, 0, { transparent: true, opacity: 0.85 }), 2.52, TOP + 0.06, 0.12); cyl(0.008, 0.05, M.black, 2.52, TOP + 0.145, 0.12, g, 10); box(2.505, 2.56, TOP + 0.165, TOP + 0.175, 0.112, 0.128, M.black);

/* ----------------------------------------------------------------- window */
const WX0 = 1.4, WX1 = 2.8, WY0 = 1.24, WY1 = 2.32;
const view = tex(512, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9cc7ee'); gr.addColorStop(0.6, '#e4f1f8'); gr.addColorStop(0.72, '#f3f1dc'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) { const x = rnd() * w, y = h * (0.7 + rnd() * 0.32), r = 40 + rnd() * 70, gg = c.createRadialGradient(x, y, 0, x, y, r); const l = 38 + rnd() * 22;
    gg.addColorStop(0, `hsla(${95 + rnd() * 30}, 40%, ${l}%, .95)`); gg.addColorStop(1, `hsla(105, 40%, ${l}%, 0)`); c.fillStyle = gg; c.fillRect(x - r, y - r, 2 * r, 2 * r); } });
mk(new THREE.PlaneGeometry(WX1 - WX0, WY1 - WY0), new THREE.MeshBasicMaterial({ map: view, color: new THREE.Color(1.25, 1.25, 1.25) }), g, (WX0 + WX1) / 2, (WY0 + WY1) / 2, 0.012);
for (const x of [WX0, (WX0 + WX1) / 2 - 0.02, WX1 - 0.04]) box(x, x + 0.04, WY0, WY1, 0, 0.05, M.black);
for (const y of [WY0, WY0 + (WY1 - WY0) * 0.68, WY1 - 0.04]) box(WX0, WX1, y, y + 0.04, 0, 0.05, M.black);
g.add(slab(WX0 - 0.05, WX1 + 0.05, 0, 0.14, WY0 - 0.03, WY0, M.marble));
[0x4f7a3a, 0x6a8f3c, 0x3f6b45].forEach((c, i) => herb(g, 1.72 + i * 0.36, WY0, 0.075, rnd, c));

/* ---------------------------------------------------------------- shelves */
const X0 = -2.5, X1 = -0.5, SD = 0.27, S1 = 1.52, S2 = 1.94;
for (const y of [S1, S2]) { box(X0, X1, y - 0.035, y, 0, SD, M.oak); for (const x of [X0 + 0.12, (X0 + X1) / 2, X1 - 0.12]) { box(x - 0.006, x + 0.006, y - 0.2, y - 0.035, 0, 0.012, M.brass); box(x - 0.006, x + 0.006, y - 0.047, y - 0.035, 0, SD - 0.03, M.brass); } }
const stack = (x, y, r, k) => { for (let i = 0; i < k; i++) mk(new THREE.CylinderGeometry(r, r * 0.6, 0.016, 40), M.ceramic, g, x + (rnd() - 0.5) * 0.004, y + 0.008 + i * 0.013, 0.14); };
const bowl = [[0.03, 0], [0.05, 0.008], [0.08, 0.04], [0.088, 0.07]].map(p => new THREE.Vector2(...p));
stack(-2.3, S1, 0.125, 8); stack(-2.02, S1, 0.095, 6);
for (let i = 0; i < 5; i++) mk(new THREE.LatheGeometry(bowl, 32), std([0xf4f0e8, 0xf4f0e8, 0x9fb0a0, 0x9fb0a0, 0xd6c3a1][i], 0.3, 0, { side: THREE.DoubleSide }), g, -1.74, S1 + i * 0.016, 0.14);
for (let i = 0; i < 6; i++) mk(new THREE.CylinderGeometry(0.034, 0.028, 0.105, 24, 1, true), M.glass, g, -1.45 + (i % 3) * 0.085, S1 + 0.053, 0.09 + (i > 2 ? 0.09 : 0)).userData.through = true;
for (let i = 0; i < 4; i++) { const m = grp(-1.1 + i * 0.13, S1, 0.14); mk(new THREE.CylinderGeometry(0.04, 0.036, 0.085, 24, 1, true), M.ceramic, m, 0, 0.0425, 0); cyl(0.036, 0.004, M.ceramic, 0, 0.002, 0, m); mk(new THREE.TorusGeometry(0.025, 0.006, 8, 20, Math.PI).rotateZ(-Math.PI / 2), M.ceramic, m, 0.04, 0.045, 0); m.rotation.y = -0.6; }
// empty glass jars, a few cookbooks and a plant on the upper shelf
[[0xe8d9a8, 0.2], [0x8a5a34, 0.16], [0xf1ead8, 0.23], [0xb9482c, 0.13]].forEach(([c, h], i) => { const x = -2.33 + i * 0.16;
  mk(new THREE.CylinderGeometry(0.058, 0.058, h, 28, 1, true), M.glass, g, x, S2 + h / 2, 0.14).userData.through = true; cyl(0.06, 0.02, M.oak, x, S2 + h + 0.01, 0.14); });
[[0xb9482c, 0.24, 0.035], [0xe9e2d0, 0.27, 0.045], [0x2f463c, 0.22, 0.03], [0xd9a441, 0.25, 0.04], [0x39506b, 0.26, 0.03]].reduce((x, [c, h, t]) => { box(x, x + t, S2, S2 + h, 0.05, 0.23, std(c, 0.8)); return x + t + 0.002; }, -1.55);
herb(g, -0.78, S2, 0.14, rnd, 0x4d7f4a, 1.5);

/* ------------------------------------------------- on the worktop by the range */
cyl(0.06, 0.16, std(0xe9e4d8, 0.4), -0.52, TOP + 0.08, 0.2, g, 32);
for (let i = 0; i < 5; i++) { const a = i * 1.3, s = grp(-0.52 + Math.cos(a) * 0.025, TOP + 0.02, 0.2 + Math.sin(a) * 0.025); s.rotation.set(Math.sin(a) * 0.16, 0, -Math.cos(a) * 0.16); cyl(0.006, 0.3, M.oak, 0, 0.15, 0, s, 10); mk(new THREE.SphereGeometry(0.022, 16, 12), M.oak, s, 0, 0.31, 0).scale.set(1, 1.5, 0.4); }
for (const [x, m] of [[1.1, M.oak], [1.2, M.black]]) { mk(new THREE.CylinderGeometry(0.022, 0.03, 0.15, 20), m, g, x, TOP + 0.075, 0.16); mk(new THREE.SphereGeometry(0.024, 16, 12), m, g, x, TOP + 0.16, 0.16); }

g.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = o.receiveShadow = true; });
return { parts };
  } });
