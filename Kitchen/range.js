/* The range: a steel six-burner gas cooker with one wide oven, every burner carrying something (a palayok, a skillet,
   bamboo steamers, a wok, a cast-iron pot and a crêpe pan), a rail of utensils on the wall and an extractor hood above. build() adds it to whatever `scene` it is given: the wall is z = 0,
   the front towards +z, the floor is y = 0, metres. The knobs light the burners, the oven door drops, the hood lights switch, the steamer lid lifts and the wok tosses. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Range', title: 'Range cooker', line: 'Six gas burners and a wide oven · click a knob to light a burner, the wok to toss it, the steamer or the oven door to open it',
  at: [0.3, -2.6], turn: 0, view: { target: [0, 1.0, 0.35], cam: [0.45, 1.8, 2.42] },
  build({ THREE, scene, sound, kit, RH }) {
const { std, tools, M, steam } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), parts = {};
const W = 0.598, D = 0.62, TOP = 0.925, FZ = D + 0.04;
const enamel = new THREE.MeshPhysicalMaterial({ color: 0x0b0b0c, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 });

/* ------------------------------------------------------------------- body */
for (const k of [-1, 1]) { box(k * W - (k > 0 ? 0.02 : 0), k * W + (k < 0 ? 0.02 : 0), 0.1, 0.9, 0, D, M.steel); for (const z of [0.06, D - 0.04]) cyl(0.02, 0.1, M.steel, k * (W - 0.05), 0.05, z); }
box(-W, W, 0.1, 0.9, 0, 0.02, M.steel); box(-W, W, 0.1, 0.12, 0, D, M.steel); box(-W, W, 0.9, TOP, 0, FZ, enamel); box(-W, W, TOP, 1.0, 0, 0.03, M.steel);
box(-W, W, 0.78, 0.9, D, FZ, M.steel); box(-W, W, 0.12, 0.195, D, FZ - 0.01, M.steel); box(-W + 0.06, W - 0.06, 0, 0.1, 0.05, D - 0.06, M.black);
// the oven: a dark enamel box you can look into, a shelf, and a tray
const cavity = std(0x1b1d22, 0.5, 0.2, { side: THREE.BackSide, emissive: 0xff9a40, emissiveIntensity: 0 });
mk(new THREE.BoxGeometry(2 * W - 0.1, 0.56, D - 0.03), cavity, g, 0, 0.485, (D + 0.03) / 2);
for (const z of [0.07, D - 0.03]) box(-W + 0.07, W - 0.07, 0.4, 0.406, z, z + 0.006, M.steel);
for (let i = 0; i < 23; i++) { const x = -W + 0.07 + i * (2 * W - 0.14) / 22; box(x - 0.002, x + 0.002, 0.4, 0.404, 0.07, D - 0.024, M.steel); }
box(-0.22, 0.22, 0.406, 0.416, 0.14, 0.5, M.iron);
const ovenLight = new THREE.PointLight(0xffb060, 0, 1.6, 1.5); ovenLight.position.set(0, 0.68, 0.3); g.add(ovenLight);
const door = grp(0, 0.2, D + 0.016);
{ const h = 0.575; box(-W + 0.004, W - 0.004, 0, h, -0.016, 0.014, M.steel, door); box(-0.44, 0.44, 0.1, h - 0.14, 0.014, 0.018, enamel, door);
  cyl(0.011, 1.04, M.brass, 0, h - 0.06, 0.06, door, 16).rotation.z = Math.PI / 2; for (const k of [-1, 1]) cyl(0.008, 0.05, M.brass, k * 0.48, h - 0.06, 0.036, door, 12).rotation.x = Math.PI / 2;
  door.userData.click = () => { const p = parts.oven; p.t = p.t ? 0 : 1; sound.tap(); }; }
parts.oven = { set: v => { door.rotation.x = v * 1.48; ovenLight.intensity = 0.8 * v; cavity.emissiveIntensity = 0.06 * v; } };

/* ---------------------------------------------------------------- burners */
// back-left, front-left, back-middle, front-middle, back-right, front-right: the same order as the knobs, left to right
const B = [[-0.4, 0.19], [-0.4, 0.47], [0, 0.19], [0, 0.47], [0.4, 0.19], [0.4, 0.47]], GY = 0.977, PAN = 1, POT = 4;
const flameMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.25, 0.55, 2.6), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
const tipMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.0, 0.5), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
const flames = B.map(([x, z], i) => {
  cyl(0.052, 0.012, M.brass, x, TOP + 0.006, z, g, 32); cyl(0.036, 0.01, M.iron, x, TOP + 0.017, z, g, 32);
  for (const a of [0, 1, 2, 3]) { const f = grp(x, GY - 0.006, z); f.rotation.y = a * Math.PI / 2 + Math.PI / 4; box(0.03, 0.125, -0.006, 0.006, -0.006, 0.006, M.iron, f); box(0.119, 0.131, -0.046, 0, -0.006, 0.006, M.iron, f); }
  const f = grp(x, TOP + 0.016, z); f.visible = false;
  for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, c = grp(Math.cos(a) * 0.04, 0, Math.sin(a) * 0.04, f); c.rotation.y = -a; c.rotation.z = -0.75;
    mk(new THREE.ConeGeometry(0.0065, 0.03, 6).translate(0, 0.015, 0), flameMat, c).userData.through = true; mk(new THREE.ConeGeometry(0.003, 0.016, 5).translate(0, 0.034, 0), tipMat, c).userData.through = true; }
  // its knob
  const kn = grp(-0.45 + i * 0.18, 0.84, FZ); cyl(0.034, 0.006, M.black, 0, 0, 0.003, kn, 32).rotation.x = Math.PI / 2; cyl(0.025, 0.032, M.brass, 0, 0, 0.022, kn, 32).rotation.x = Math.PI / 2; box(-0.003, 0.003, 0.006, 0.025, 0.038, 0.04, M.black, kn);
  const p = parts['b' + i] = { set: v => { kn.rotation.z = -v * 1.9; f.visible = v > 0.02; f.userData.v = v; } };
  kn.userData.click = () => { p.t = p.t ? 0 : 1; if (p.t) sound.ignite(); else sound.click(); sound.loop('gas', B.filter((_, k) => parts['b' + k].t).length / 3);  };
  return f; });
for (const x of [-0.4, 0, 0.4]) for (const k of [-1, 1]) box(x + k * 0.19 - 0.006, x + k * 0.19 + 0.006, GY - 0.012, GY, 0.04, D - 0.02, M.iron);

/* ------------------------------------------------------ a skillet, a pot */
{ const pan = grp(B[PAN][0], GY, B[PAN][1]); pan.rotation.y = -0.7;
  mk(new THREE.LatheGeometry([[0, 0.004], [0.11, 0.004], [0.132, 0.042], [0.137, 0.042], [0.114, 0], [0, 0]].map(p => new THREE.Vector2(...p)), 48), std(0x161617, 0.65, 0.4, { side: THREE.DoubleSide }), pan);
  box(0.13, 0.31, 0.03, 0.042, -0.014, 0.014, M.iron, pan); cyl(0.014, 0.012, M.iron, 0.31, 0.036, 0, pan, 16); }
{ const pot = grp(B[POT][0], GY, B[POT][1]), red = new THREE.MeshPhysicalMaterial({ color: 0xc4511f, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 });
  mk(new THREE.CylinderGeometry(0.13, 0.12, 0.11, 48), red, pot, 0, 0.055, 0); mk(new THREE.SphereGeometry(0.134, 48, 12, 0, Math.PI * 2, 0, Math.PI / 2), red, pot, 0, 0.11, 0).scale.y = 0.25; cyl(0.136, 0.008, red, 0, 0.11, 0, pot, 48);
  cyl(0.018, 0.02, M.steel, 0, 0.152, 0, pot, 20); for (const k of [-1, 1]) box(k * 0.125 - 0.03, k * 0.125 + 0.03, 0.08, 0.092, -0.035, 0.035, red, pot); }
/* ------------------- a palayok, bamboo steamers, a wok and a crêpe pan */
const lathe = (pts, mat, parent, x = 0, y = 0, z = 0, seg = 40) => mk(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(...p)), seg), mat, parent, x, y, z);
const CLAY = 0, STEAM = 2, WOK = 3, CREPE = 5;
{ const p = grp(B[CLAY][0], GY, B[CLAY][1]), clay = std(0x9a4f2c, 0.8, 0, { side: THREE.DoubleSide });      // the palayok: a round clay pot for adobo or sinigang
  lathe([[0, 0.004], [0.06, 0.004], [0.115, 0.045], [0.122, 0.085], [0.098, 0.12], [0.108, 0.137]], clay, p); mk(new THREE.SphereGeometry(0.1, 32, 10, 0, Math.PI * 2, 0, Math.PI / 2), clay, p, 0, 0.128, 0).scale.y = 0.35; cyl(0.02, 0.022, clay, 0, 0.17, 0, p); }
const steamer = grp(B[STEAM][0], GY, B[STEAM][1]), lid = grp(0, 0.19, 0, steamer);
{ const bamboo = std(0xd9b97c, 0.75, 0, { side: THREE.DoubleSide }), band = std(0xa9844a, 0.8), weave = std(0xc9a765, 0.85);
  cyl(0.125, 0.06, M.steel, 0, 0.03, 0, steamer, 40); for (const k of [-1, 1]) box(k * 0.14 - 0.02, k * 0.14 + 0.02, 0.045, 0.055, -0.02, 0.02, M.steel, steamer);
  for (const y of [0.06, 0.125]) { mk(new THREE.CylinderGeometry(0.116, 0.116, 0.065, 48, 1, true), bamboo, steamer, 0, y + 0.0325, 0); for (const b of [0.008, 0.057]) cyl(0.119, 0.012, band, 0, y + b, 0, steamer, 48).material = band; }
  for (const y of [0.066, 0.131]) cyl(0.114, 0.006, weave, 0, y, 0, steamer, 40);
  mk(new THREE.SphereGeometry(0.119, 48, 10, 0, Math.PI * 2, 0, Math.PI / 2), weave, lid).scale.y = 0.28; cyl(0.121, 0.014, band, 0, 0.004, 0, lid, 48); mk(new THREE.TorusGeometry(0.02, 0.005, 8, 16, Math.PI), band, lid, 0, 0.03, 0);
  parts.steamer = { set: v => { lid.position.set(0, 0.19 + v * 0.07, -v * 0.15); lid.rotation.x = -v * 0.9; } };
  steamer.userData.click = () => { const p = parts.steamer; p.t = p.t ? 0 : 1; sound.tap(); }; }
const wok = grp(B[WOK][0], GY, B[WOK][1]), food = grp(0, 0, 0, wok); let toss = -1;
{ mk(new THREE.TorusGeometry(0.075, 0.007, 8, 32).rotateX(Math.PI / 2), M.iron, g, B[WOK][0], GY + 0.006, B[WOK][1]);
  const R = 0.2, arc = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * 0.92; arc.push([R * Math.sin(a), R * (1 - Math.cos(a))]); }
  lathe(arc, std(0x1d1f22, 0.42, 0.7, { side: THREE.DoubleSide }), wok, 0, 0, 0, 48);
  const h = grp(0, 0.08, 0.155, wok); h.rotation.x = Math.PI / 2 - 0.25; cyl(0.011, 0.06, M.steel, 0, 0.03, 0, h, 12); cyl(0.014, 0.13, M.oak, 0, 0.12, 0, h, 12); mk(new THREE.TorusGeometry(0.03, 0.005, 8, 16, Math.PI), M.steel, wok, 0, 0.08, -0.158).rotation.x = -Math.PI / 2;
  wok.userData.click = () => { if (toss < 0) { toss = 0; sound.toss(); } }; }
{ const c = grp(B[CREPE][0], GY, B[CREPE][1]); c.rotation.y = -0.55;                                    // the flat crêpe pan, and the rake that spreads the batter
  cyl(0.145, 0.01, M.iron, 0, 0.005, 0, c, 48); mk(new THREE.TorusGeometry(0.143, 0.006, 8, 48).rotateX(Math.PI / 2), M.iron, c, 0, 0.012, 0); box(0.14, 0.34, 0.008, 0.02, -0.013, 0.013, M.iron, c);
  const t = grp(-0.03, 0.02, 0.02, c); t.rotation.y = 0.9; cyl(0.006, 0.2, M.oak, 0, 0, 0.02, t, 10).rotation.x = Math.PI / 2; cyl(0.007, 0.13, M.oak, 0, 0, -0.08, t, 10).rotation.z = Math.PI / 2; }
const claySteam = steam(g, B[CLAY][0], GY + 0.17, B[CLAY][1], 6, 0.18, 0.45), bambooSteam = steam(g, B[STEAM][0], GY + 0.24, B[STEAM][1], 7, 0.2, 0.5), wokSteam = steam(g, B[WOK][0], GY + 0.07, B[WOK][1], 5, 0.16, 0.35);
const potSteam = steam(g, B[POT][0], GY + 0.15, B[POT][1], 7, 0.2, 0.5), panSteam = steam(g, B[PAN][0], GY + 0.04, B[PAN][1], 4, 0.12, 0.25);

/* ----------------------------------------------------- utensil rail, hood */
cyl(0.007, 1.0, M.brass, 0, 1.5, 0.045, g, 12).rotation.z = Math.PI / 2; for (const k of [-1, 1]) cyl(0.005, 0.045, M.brass, k * 0.46, 1.5, 0.022, g, 8).rotation.x = Math.PI / 2;
[-0.3, -0.1, 0.1, 0.3].forEach((x, i) => { const u = grp(x, 1.5, 0.045); mk(new THREE.TorusGeometry(0.012, 0.002, 6, 16, Math.PI * 1.5), M.steel, u, 0, -0.012, 0);
  cyl(0.005, 0.24, i === 3 ? M.oak : M.steel, 0, -0.14, 0, u, 10);
  if (i === 0) mk(new THREE.SphereGeometry(0.04, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), std(0xd3d6d9, 0.3, 1, { side: THREE.DoubleSide }), u, 0, -0.27, 0.01);
  else if (i === 1) box(-0.035, 0.035, -0.36, -0.26, -0.002, 0.002, M.steel, u);
  else if (i === 2) for (let k = 0; k < 6; k++) mk(new THREE.TorusGeometry(0.03, 0.0015, 6, 24).rotateY(k * Math.PI / 6), M.steel, u, 0, -0.285, 0).scale.y = 1.7;
  else mk(new THREE.SphereGeometry(0.03, 20, 12), M.oak, u, 0, -0.29, 0).scale.set(1, 1.6, 0.3); });
const top = RH || 2.9;
box(-W, W, 1.745, 1.9, 0, 0.5, M.steel); box(-W - 0.002, W + 0.002, 1.72, 1.745, 0, 0.502, M.brass); box(-0.26, 0.26, 1.9, top, 0, 0.36, M.steel); box(-0.262, 0.262, 1.9, 1.925, 0, 0.362, M.brass);
const bulbs = new THREE.MeshBasicMaterial({ color: 0x000000 }); for (const x of [-0.3, 0.3]) mk(new THREE.CircleGeometry(0.045, 24).rotateX(Math.PI / 2), bulbs, g, x, 1.718, 0.28);
const hoodLight = new THREE.PointLight(0xffe2b8, 0, 2.6, 1.4); hoodLight.position.set(0, 1.6, 0.3); g.add(hoodLight);
const hood = mk(new THREE.BoxGeometry(2 * W, 0.2, 0.52), new THREE.MeshBasicMaterial({ visible: false }), g, 0, 1.82, 0.25);   // an unseen box to click
hood.userData.click = () => { const p = parts.hood; p.t = p.t ? 0 : 1; sound.click(); };
parts.hood = { on: 1, set: v => { hoodLight.intensity = 1.8 * v; bulbs.color.setRGB(3.2 * v, 3 * v, 2.6 * v); } };

g.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = o.receiveShadow = true; });
let time = 0;
function tick(dt) { time += dt;
  flames.forEach((f, i) => { if (!f.visible) return; const v = f.userData.v, s = v * (0.9 + 0.12 * Math.sin(time * 31 + i * 2) + 0.06 * Math.sin(time * 53 + i)); f.scale.set(1, s, 1); });
  potSteam(dt, parts['b' + POT].v); claySteam(dt, parts['b' + CLAY].v); bambooSteam(dt, parts['b' + STEAM].v); wokSteam(dt, parts['b' + WOK].v);
  if (toss >= 0) { toss += dt; const a = Math.sin(Math.min(1, toss / 0.7) * Math.PI); wok.rotation.x = 0.3 * a; food.position.y = 0.1 * a; food.rotation.y += dt * 9 * a; if (toss > 0.7) { toss = -1; wok.rotation.x = 0; food.position.y = 0; } } }
return { parts, tick };
  } });
