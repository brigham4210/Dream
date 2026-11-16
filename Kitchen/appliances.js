/* What stands on the worktop: a stand mixer, a blender, a toaster and a kettle under the shelves; soy, vinegar, chili oil,
   rice bowls and a clay pot beside them; a cleaver on its block, a knife block and a rice cooker on the other side of the
   range; and a microwave built into a cupboard on the wall. build() adds them to whatever `scene` it is given, in the
   same frame as the counter: the wall is z = 0, x = 0 is the middle of the room, the floor is y = 0, metres. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Appliances', title: 'On the worktop', line: 'Mixer, blender, toaster, kettle, rice cooker, microwave · click each one to run or open it',
  at: [0, -2.6], turn: 0, view: { target: [-1.75, 1.15, 0.3], cam: [-1.45, 1.6, 2.42] },
  build({ THREE, scene, sound, kit }) {
const { std, tex, tools, M, steam, front, knob, pull } = kit, room = new THREE.Group(), g = new THREE.Group(); scene.add(room); g.position.y = 0.92; room.add(g);
const { mk, box, cyl, grp } = tools(g), parts = {}, ticks = [];
const coat = (color, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15, ...extra });
const chrome = std(0xe4e6e8, 0.14, 1), chromeIn = std(0xe4e6e8, 0.14, 1, { side: THREE.DoubleSide }), cream = coat(0xe9dfc8), white = coat(0xf6f4ef, { side: THREE.DoubleSide });
const lathe = (pts, mat, parent, x = 0, y = 0, z = 0, seg = 40) => mk(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(...p)), seg), mat, parent, x, y, z);
const toggle = (name, loop) => () => { const p = parts[name]; p.t = p.t ? 0 : 1; sound.click(); if (loop) sound.loop(loop, p.t); };
let time = 0; ticks.push(dt => { time += dt; });

/* ------------------------------------------------------------ stand mixer */
{ const m = grp(-2.35, 0, 0.3); m.rotation.y = -0.35; m.userData.click = toggle('mixer', 'mixer');
  box(-0.13, 0.16, 0, 0.03, -0.1, 0.1, cream, m); box(-0.13, -0.05, 0.03, 0.27, -0.05, 0.05, cream, m);
  mk(new THREE.CapsuleGeometry(0.062, 0.17, 8, 24).rotateZ(Math.PI / 2), cream, m, 0.02, 0.31, 0); cyl(0.064, 0.014, chrome, 0.12, 0.31, 0, m, 32).rotation.z = Math.PI / 2;
  cyl(0.014, 0.014, M.brass, -0.02, 0.31, 0.062, m, 16).rotation.x = Math.PI / 2; cyl(0.03, 0.03, cream, 0.075, 0.245, 0, m);
  lathe([[0, 0.005], [0.05, 0.005], [0.092, 0.05], [0.102, 0.13], [0.106, 0.13]], chromeIn, m, 0.075, 0.03, 0);
  const beater = grp(0.075, 0.23, 0, m); cyl(0.005, 0.05, chrome, 0, -0.025, 0, beater, 8); mk(new THREE.TorusGeometry(0.04, 0.004, 6, 24), chrome, beater, 0.012, -0.095, 0).scale.set(0.8, 1.3, 1); mk(new THREE.TorusGeometry(0.04, 0.004, 6, 24).rotateY(Math.PI / 2), chrome, beater, 0.012, -0.095, 0).scale.set(1, 1.3, 0.8);
  parts.mixer = { set() {} }; ticks.push(dt => { beater.rotation.y += dt * 24 * parts.mixer.v; }); }

/* ---------------------------------------------------------------- blender */
{ const b = grp(-2.03, 0, 0.3); b.userData.click = toggle('blender', 'blender');
  mk(new THREE.CylinderGeometry(0.07, 0.086, 0.12, 32), M.black, b, 0, 0.06, 0); cyl(0.02, 0.012, M.brass, 0, 0.05, 0.079, b, 20).rotation.x = Math.PI / 2;
  mk(new THREE.CylinderGeometry(0.076, 0.05, 0.25, 32, 1, true), M.glass, b, 0, 0.245, 0).userData.through = true; cyl(0.079, 0.02, M.black, 0, 0.38, 0, b, 32); cyl(0.03, 0.015, M.black, 0, 0.397, 0, b);
  mk(new THREE.TorusGeometry(0.055, 0.007, 8, 20, Math.PI).rotateZ(-Math.PI / 2), M.black, b, 0.068, 0.26, 0);
  const sm = mk(new THREE.CylinderGeometry(0.061, 0.047, 0.14, 32).translate(0, 0.07, 0), std(0xb8436b, 0.4), b, 0, 0.125, 0);
  parts.blender = { set() {} }; ticks.push(dt => { const v = parts.blender.v; sm.rotation.y += dt * 30 * v; sm.scale.y = 1 + v * (0.1 + 0.05 * Math.sin(time * 37)); }); }

/* ---------------------------------------------------------------- toaster */
{ const t = grp(-1.72, 0, 0.3); t.rotation.y = 0.12; const glowMat = new THREE.MeshBasicMaterial({ color: 0x050505 }), bread = std(0xf0dfbd, 0.9);
  box(-0.14, 0.14, 0.015, 0.19, -0.085, 0.085, chrome, t); for (const k of [-1, 1]) { box(k * 0.145 - 0.006, k * 0.145 + 0.006, 0.01, 0.186, -0.08, 0.08, M.black, t); for (const z of [-0.06, 0.06]) cyl(0.01, 0.015, M.black, k * 0.11, 0.0075, z, t, 12); }
  for (const z of [-0.036, 0.036]) box(-0.1, 0.1, 0.186, 0.192, z - 0.015, z + 0.015, glowMat, t);
  const up = grp(0, 0.125, 0, t), lever = box(0.151, 0.172, -0.012, 0.012, -0.022, 0.022, M.black, up);
  for (const z of [-0.036, 0.036]) { box(-0.06, 0.06, -0.06, 0.05, z - 0.008, z + 0.008, bread, up); mk(new THREE.CylinderGeometry(0.06, 0.06, 0.016, 24, 1, false, 0, Math.PI).rotateX(Math.PI / 2).rotateZ(Math.PI / 2), bread, up, 0, 0.05, z).scale.y = 0.45; }
  const pale = new THREE.Color(0xf0dfbd), done = new THREE.Color(0xb47430); let s = -1;     // s: seconds into toasting, or -1 when idle
  t.userData.click = () => { if (s >= 0) return; s = 0; bread.color.copy(pale); sound.click(); };
  ticks.push(dt => { const down = s >= 0; if (down) { s += dt; bread.color.lerpColors(pale, done, Math.min(1, s / 5)); if (s > 5) { s = -1; sound.pop(); } }
    up.position.y += ((down ? 0.062 : 0.125) - up.position.y) * Math.min(1, dt * (down ? 10 : 22)); const h = down ? 0.6 + 0.1 * Math.sin(time * 9) : 0; glowMat.color.setRGB(0.02 + 3 * h, 0.02 + 0.8 * h, 0.02 + 0.1 * h); }); }

/* ----------------------------------------------------------------- kettle */
{ const k = grp(-1.45, 0, 0.3); k.rotation.y = 0.5; const led = new THREE.MeshBasicMaterial({ color: 0x000000 }), puffs = steam(g, -1.51, 0.22, 0.33, 6, 0.13, 0.36);
  cyl(0.088, 0.02, M.black, 0, 0.01, 0, k, 32); lathe([[0, 0.02], [0.083, 0.02], [0.086, 0.05], [0.07, 0.2], [0.058, 0.215], [0, 0.218]], M.steel, k); cyl(0.014, 0.02, M.black, 0, 0.228, 0, k, 16);
  mk(new THREE.CylinderGeometry(0.011, 0.02, 0.055, 16), M.steel, k, -0.078, 0.185, 0).rotation.z = 0.95; mk(new THREE.TorusGeometry(0.062, 0.009, 10, 24, Math.PI).rotateZ(-Math.PI / 2), M.black, k, 0.07, 0.12, 0);
  mk(new THREE.SphereGeometry(0.008, 12, 10), led, k, 0.03, 0.012, 0.083);
  parts.kettle = { set: v => led.color.setRGB(0.1 * v, 1.2 * v, 3 * v) }; k.userData.click = toggle('kettle', 'boil');
  let on = 0, heat = 0; ticks.push(dt => { const p = parts.kettle; if (p.t) { on += dt; heat = Math.min(1, heat + dt / 5); if (on > 11) { p.t = 0; sound.loop('boil', 0); sound.click(); } } else { on = 0; heat = Math.max(0, heat - dt / 8); }
    puffs(dt, Math.max(0, heat - 0.35) / 0.65); }); }

/* ------------------------------------- soy, vinegar, chili oil; bowls; clay pot */
{ const bottle = (x, z, c, h, cap, band) => { cyl(0.03, h * 0.66, std(c, 0.15), x, h * 0.33, z); mk(new THREE.CylinderGeometry(0.012, 0.03, h * 0.16, 20), std(c, 0.15), g, x, h * 0.74, z); cyl(0.012, h * 0.14, std(c, 0.15), x, h * 0.89, z, g, 12); cyl(0.014, h * 0.05, std(cap, 0.5), x, h * 0.975, z, g, 12); cyl(0.0305, h * 0.3, std(band, 0.8), x, h * 0.36, z); };
  bottle(-1.24, 0.11, 0x160a06, 0.24, 0xb5271e, 0xb5271e); bottle(-1.165, 0.1, 0x24100a, 0.22, 0xd9a441, 0xe8d9a8); bottle(-1.09, 0.11, 0x2a1a08, 0.2, 0x2f6b34, 0xf2efe6);
  cyl(0.036, 0.085, std(0xa3200f, 0.2), -1.01, 0.0425, 0.11); cyl(0.038, 0.014, M.steel, -1.01, 0.092, 0.11);
  const blue = std(0xf3f4f6, 0.25, 0, { side: THREE.DoubleSide, map: tex(128, 32, (c, w, h) => { c.fillStyle = '#f3f4f6'; c.fillRect(0, 0, w, h); c.fillStyle = '#2c4f9a'; c.fillRect(0, 2, w, 5); for (let i = 0; i < 8; i++) { c.beginPath(); c.arc(8 + i * 16, 18, 4.5, 0, 7); c.fill(); } }) });
  for (let i = 0; i < 4; i++) lathe([[0.025, 0], [0.03, 0.012], [0.056, 0.04], [0.062, 0.06]], blue, g, -1.2, i * 0.014, 0.42, 32);
  for (const k of [-1, 1]) { const c = cyl(0.003, 0.23, std(0x3a2416, 0.5), -1.2 + k * 0.008, 0.106, 0.42, g, 8); c.rotation.set(Math.PI / 2, 0, 0.5 + k * 0.03); }
  const pot = grp(-0.96, 0, 0.36), sand = std(0xc9a372, 0.85), glaze = std(0x5a3520, 0.35);
  lathe([[0, 0], [0.085, 0], [0.12, 0.04], [0.125, 0.09], [0.115, 0.11]], sand, pot); mk(new THREE.SphereGeometry(0.12, 40, 10, 0, Math.PI * 2, 0, Math.PI / 2), glaze, pot, 0, 0.108, 0).scale.y = 0.35; cyl(0.022, 0.02, glaze, 0, 0.155, 0, pot);
  cyl(0.014, 0.11, sand, 0.17, 0.085, 0, pot, 12).rotation.z = Math.PI / 2 - 0.25; }

/* --------------------------- cleaver and block, knife block, rice cooker */
{ const b = grp(1.47, 0, 0.36); cyl(0.17, 0.07, M.oak, 0, 0.035, 0, b, 48); cyl(0.171, 0.012, M.iron, 0, 0.035, 0, b, 48);
  const c = grp(-0.02, 0.073, 0.02, b); c.rotation.y = 0.5; box(-0.11, 0.09, 0, 0.004, -0.045, 0.045, M.steel, c); cyl(0.013, 0.11, M.oak, 0.145, 0.006, -0.03, c, 12).rotation.z = Math.PI / 2;
  for (let i = 0; i < 5; i++) { const s = grp(-0.25 + i * 0.012, 0.006, 0.02 + i * 0.011, b); s.rotation.y = 0.2 + i * 0.03; cyl(0.005, 0.2, std(0x4f9a3a, 0.7), 0, 0, 0, s, 8).rotation.x = Math.PI / 2; cyl(0.0055, 0.07, std(0xf1f1e6, 0.7), 0, 0, 0.13, s, 8).rotation.x = Math.PI / 2; }
  for (const [x, z, r] of [[0.21, 0.1, 0.022], [0.235, 0.085, 0.017], [0.2, 0.125, 0.015]]) mk(new THREE.SphereGeometry(r, 12, 10), std(0xcdb07c, 0.85), b, x, r * 0.8, z).scale.set(1.3, 0.8, 1); }
{ const k = grp(2.78, 0, 0.2); k.rotation.y = -0.25; const s = new THREE.Shape([[-0.07, 0], [0.09, 0], [0.09, 0.1], [-0.02, 0.23], [-0.07, 0.2]].map(p => new THREE.Vector2(...p)));
  mk(new THREE.ExtrudeGeometry(s, { depth: 0.11, bevelEnabled: false }).rotateY(-Math.PI / 2).translate(0.055, 0, 0), M.oak, k);
  for (const [t, x] of [[0.3, -0.032], [0.3, 0], [0.3, 0.032], [0.72, -0.018], [0.72, 0.018]]) { const h = grp(x, 0.1 + t * 0.13, 0.09 - t * 0.11, k); h.rotation.x = 0.868; box(-0.009, 0.009, 0, 0.085, -0.006, 0.006, M.black, h); for (const y of [0.025, 0.06]) cyl(0.003, 0.014, M.steel, 0, y, 0, h, 8).rotation.x = Math.PI / 2; } }
{ const r = grp(3.27, 0, 0.3), puffs = steam(g, 3.27, 0.2, 0.3, 6, 0.16, 0.3);
  mk(new THREE.CylinderGeometry(0.136, 0.124, 0.16, 48, 1, true), white, r, 0, 0.085, 0); cyl(0.124, 0.006, white, 0, 0.005, 0, r, 48); mk(new THREE.TorusGeometry(0.129, 0.008, 8, 48).rotateX(Math.PI / 2), white, r, 0, 0.163, 0);
  mk(new THREE.CylinderGeometry(0.121, 0.112, 0.13, 40, 1, true), chromeIn, r, 0, 0.095, 0); mk(new THREE.SphereGeometry(0.119, 32, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0xfdfcf8, 0.95), r, 0, 0.118, 0).scale.y = 0.2;
  box(-0.05, 0.05, 0.04, 0.115, 0.125, 0.139, M.black, r); mk(new THREE.SphereGeometry(0.007, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.2, 0.2) }), r, 0.025, 0.09, 0.139);
  const lid = grp(0, 0.168, -0.13, r); mk(new THREE.SphereGeometry(0.138, 48, 12, 0, Math.PI * 2, 0, Math.PI / 2), white, lid, 0, 0, 0.13).scale.y = 0.4; cyl(0.13, 0.006, M.steel, 0, 0.002, 0.13, lid, 40); box(-0.03, 0.03, 0.03, 0.05, 0.22, 0.262, M.black, lid);
  parts.rice = { set: v => { lid.rotation.x = -v * 1.3; } }; r.userData.click = () => { const p = parts.rice; p.t = p.t ? 0 : 1; sound.tap(); }; ticks.push(dt => puffs(dt, parts.rice.v)); }

/* ------------------------------------------- microwave in a wall cupboard */
{ const w = tools(room), X0 = 2.9, X1 = 3.6, Y0 = 1.42, YM = 1.78, Y1 = 2.32, D = 0.36;
  for (const x of [X0, X1 - 0.018]) w.box(x, x + 0.018, Y0, Y1, 0, D, M.paint); for (const y of [Y0, YM - 0.009, Y1 - 0.018]) w.box(X0, X1, y, y + 0.018, 0, D, M.paint); w.box(X0, X1, Y0, Y1, 0, 0.012, M.oak);
  for (const s of [-1, 1]) { const hw = (X1 - X0) / 2, h = Y1 - YM - 0.012, hinge = w.grp(s < 0 ? X0 : X1, 0, D + 0.01); const f = front(hw - 0.004, h, M.paint, hinge, -s * hw / 2, YM + 0.01 + h / 2, 0); knob(f, -s * (hw / 2 - 0.035), -h / 2 + 0.08, 0.014);
    const p = parts['cup' + s] = { set: v => { hinge.rotation.y = s * v * 1.6; } }; hinge.userData.click = () => { p.t = p.t ? 0 : 1; sound.tap(); }; }
  for (let i = 0; i < 8; i++) w.mk(new THREE.CylinderGeometry(0.035, 0.03, 0.12, 24, 1, true), M.glass, room, X0 + 0.09 + (i % 4) * 0.17, YM + 0.07, 0.1 + (i > 3 ? 0.12 : 0)).userData.through = true;
  // the oven: a lit box behind a dark glass door, a turntable, and a strip of controls
  const MX = 3.4, lit = std(0xf2efe6, 0.6, 0, { side: THREE.BackSide, emissive: 0xffe2b0, emissiveIntensity: 0 }), dark = new THREE.MeshPhysicalMaterial({ color: 0x0c0e10, roughness: 0.1, transparent: true, opacity: 0.6 });
  w.mk(new THREE.BoxGeometry(MX - X0 - 0.04, YM - Y0 - 0.05, D - 0.03), lit, room, (X0 + 0.02 + MX) / 2, (Y0 + YM) / 2 + 0.004, D / 2 + 0.015);
  const plate = w.grp(3.15, Y0 + 0.035, 0.19); w.cyl(0.14, 0.006, M.glass, 0, 0, 0, plate, 40).userData.through = true; lathe([[0.03, 0], [0.07, 0.012], [0.085, 0.05]], M.ceramic, plate, 0.02, 0.004, 0); w.cyl(0.074, 0.004, std(0xd9772a, 0.5), 0.02, 0.04, 0, plate, 32);
  w.box(MX, X1 - 0.018, Y0 + 0.018, YM - 0.009, D - 0.03, D + 0.022, M.black);
  const digits = tex(128, 48, (c, wd, h) => { c.fillStyle = '#04120a'; c.fillRect(0, 0, wd, h); c.fillStyle = '#4dff9a'; c.font = '700 34px monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('0:30', wd / 2, h / 2 + 2); });
  w.mk(new THREE.PlaneGeometry(0.12, 0.045), new THREE.MeshBasicMaterial({ map: digits }), room, (MX + X1 - 0.018) / 2, YM - 0.06, D + 0.023);
  const dial = w.grp((MX + X1 - 0.018) / 2, Y0 + 0.11, D + 0.022); w.cyl(0.032, 0.02, chrome, 0, 0, 0.01, dial, 32).rotation.x = Math.PI / 2; w.box(-0.003, 0.003, 0.005, 0.03, 0.02, 0.022, M.black, dial);
  const door = w.grp(X0 + 0.02, Y0 + 0.02, D + 0.002), dw = MX - X0 - 0.022, dh = YM - Y0 - 0.032;
  for (const k of [0, 1]) { w.box(k ? dw - 0.04 : 0, k ? dw : 0.04, 0, dh, 0, 0.02, M.steel, door); w.box(0.04, dw - 0.04, k ? dh - 0.04 : 0, k ? dh : 0.04, 0, 0.02, M.steel, door); }
  w.box(0.04, dw - 0.04, 0.04, dh - 0.04, 0.006, 0.014, dark, door); pull(door, dw - 0.02, dh / 2, 0.02, 0.24, true, chrome);
  let run = -1; const glow = () => { lit.emissiveIntensity = Math.max(parts.micro.v, run >= 0 ? 1 : 0) * 0.9; };
  parts.micro = { set: v => { door.rotation.y = -v * 1.7; glow(); } };
  door.userData.click = () => { if (run >= 0) return; const p = parts.micro; p.t = p.t ? 0 : 1; sound.tap(); };
  dial.userData.click = () => { if (run >= 0 || parts.micro.t) return; run = 0; sound.click(); sound.loop('micro', 1); glow(); };
  ticks.push(dt => { if (run < 0) return; run += dt; plate.rotation.y += dt * 1.2; dial.rotation.z = -run; if (run > 6) { run = -1; dial.rotation.z = 0; sound.loop('micro', 0); sound.ding(); glow(); } }); }

room.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = o.receiveShadow = true; });
return { parts, tick: dt => { for (const t of ticks) t(dt); } };
  } });
