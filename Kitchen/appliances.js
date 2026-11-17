/* The appliances on the worktop: a stand mixer, a blender and an electric crêpe maker left of the range, a rice cooker on
   the right-hand counter, and a microwave built into a cupboard on the wall. build() adds them to whatever `scene` it is
   given, in the same frame as the counter: the wall is z = 0, x = 0 is the middle of the room, the floor is y = 0, metres. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Appliances', title: 'Appliances', line: 'Stand mixer, blender, crêpe maker, rice cooker, microwave · click each one to run, heat or open it',
  at: [0, -2.6], turn: 0, view: { target: [-1.95, 1.08, 0.3], cam: [-1.6, 1.55, 2.3] },
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
  const sm = grp(0, 0.13, 0, b); for (let i = 0; i < 2; i++) box(-0.034, 0.034, -0.002, 0.002, -0.007, 0.007, M.steel, sm).rotation.y = i * Math.PI / 2; cyl(0.008, 0.02, M.steel, 0, -0.01, 0, sm, 12);
  parts.blender = { set() {} }; ticks.push(dt => { const v = parts.blender.v; sm.rotation.y += dt * 30 * v; }); }

/* ------------------------------------------------------------ crêpe maker */
// an electric crêpe maker: a cast-iron plate on a cream base, a dial that heats it, and the rake and spatula beside it
{ const c = grp(-1.58, 0, 0.3), plate = std(0x1d1e20, 0.4, 0.6, { emissive: 0xff4a10, emissiveIntensity: 0 }), led = new THREE.MeshBasicMaterial({ color: 0x000000 });
  lathe([[0, 0], [0.19, 0], [0.205, 0.02], [0.2, 0.045], [0, 0.045]], cream, c, 0, 0, 0, 64); cyl(0.188, 0.012, plate, 0, 0.051, 0, c, 64); mk(new THREE.TorusGeometry(0.19, 0.005, 8, 64).rotateX(Math.PI / 2), M.steel, c, 0, 0.056, 0);
  for (let i = 0; i < 4; i++) cyl(0.016, 0.01, M.black, Math.cos(i * Math.PI / 2 + 0.78) * 0.15, -0.005, Math.sin(i * Math.PI / 2 + 0.78) * 0.15, c, 12);
  const dial = grp(0, 0.024, 0.205, c); cyl(0.02, 0.016, M.black, 0, 0, 0.008, dial, 24).rotation.x = Math.PI / 2; box(-0.002, 0.002, 0.004, 0.018, 0.016, 0.018, M.brass, dial);
  mk(new THREE.SphereGeometry(0.005, 10, 8), led, c, 0.05, 0.03, 0.201);
  const r = grp(0.27, 0, -0.02, c); r.rotation.y = 0.4; cyl(0.006, 0.18, M.oak, 0, 0.006, 0, r, 10).rotation.x = Math.PI / 2; cyl(0.007, 0.13, M.oak, 0, 0.006, -0.09, r, 10).rotation.z = Math.PI / 2;
  const s = grp(0.25, 0, 0.13, c); s.rotation.y = -0.3; box(-0.015, 0.015, 0, 0.004, -0.17, 0.12, M.oak, s);
  parts.crepe = { set: v => { dial.rotation.z = -v * 2.2; plate.emissiveIntensity = 0.02 * v; led.color.setRGB(3 * v, 0.6 * v, 0.1 * v); } };
  c.userData.click = toggle('crepe'); }

/* ------------------------------------------------------------ rice cooker */
{ const r = grp(3.27, 0, 0.3);
  mk(new THREE.CylinderGeometry(0.136, 0.124, 0.16, 48, 1, true), white, r, 0, 0.085, 0); cyl(0.124, 0.006, white, 0, 0.005, 0, r, 48); mk(new THREE.TorusGeometry(0.129, 0.008, 8, 48).rotateX(Math.PI / 2), white, r, 0, 0.163, 0);
  box(-0.05, 0.05, 0.04, 0.115, 0.125, 0.139, M.black, r); mk(new THREE.SphereGeometry(0.007, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.2, 0.2) }), r, 0.025, 0.09, 0.139);
  const lid = grp(0, 0.168, -0.13, r); mk(new THREE.SphereGeometry(0.138, 48, 12, 0, Math.PI * 2, 0, Math.PI / 2), white, lid, 0, 0, 0.13).scale.y = 0.4; cyl(0.13, 0.006, M.steel, 0, 0.002, 0.13, lid, 40); box(-0.03, 0.03, 0.03, 0.05, 0.22, 0.262, M.black, lid);
  parts.rice = { set: v => { lid.rotation.x = -v * 1.3; } }; r.userData.click = () => { const p = parts.rice; p.t = p.t ? 0 : 1; sound.tap(); }; }

/* ------------------------------------------- microwave in a wall cupboard */
{ const w = tools(room), X0 = 2.9, X1 = 3.6, Y0 = 1.42, YM = 1.78, Y1 = 2.32, D = 0.36;
  for (const x of [X0, X1 - 0.018]) w.box(x, x + 0.018, Y0, Y1, 0, D, M.paint); for (const y of [Y0, YM - 0.009, Y1 - 0.018]) w.box(X0, X1, y, y + 0.018, 0, D, M.paint); w.box(X0, X1, Y0, Y1, 0, 0.012, M.oak);
  for (const s of [-1, 1]) { const hw = (X1 - X0) / 2, h = Y1 - YM - 0.012, hinge = w.grp(s < 0 ? X0 : X1, 0, D + 0.01); const f = front(hw - 0.004, h, M.paint, hinge, -s * hw / 2, YM + 0.01 + h / 2, 0); knob(f, -s * (hw / 2 - 0.035), -h / 2 + 0.08, 0.014);
    const p = parts['cup' + s] = { set: v => { hinge.rotation.y = s * v * 1.6; } }; hinge.userData.click = () => { p.t = p.t ? 0 : 1; sound.tap(); }; }
  for (let i = 0; i < 8; i++) w.mk(new THREE.CylinderGeometry(0.035, 0.03, 0.12, 24, 1, true), M.glass, room, X0 + 0.09 + (i % 4) * 0.17, YM + 0.07, 0.1 + (i > 3 ? 0.12 : 0)).userData.through = true;
  // the oven: a lit box behind a dark glass door, a turntable, and a strip of controls
  const MX = 3.4, lit = std(0xf2efe6, 0.6, 0, { side: THREE.BackSide, emissive: 0xffe2b0, emissiveIntensity: 0 }), dark = new THREE.MeshPhysicalMaterial({ color: 0x0c0e10, roughness: 0.1, transparent: true, opacity: 0.6 });
  w.mk(new THREE.BoxGeometry(MX - X0 - 0.04, YM - Y0 - 0.05, D - 0.03), lit, room, (X0 + 0.02 + MX) / 2, (Y0 + YM) / 2 + 0.004, D / 2 + 0.015);
  const plate = w.grp(3.15, Y0 + 0.035, 0.19); w.cyl(0.14, 0.006, M.glass, 0, 0, 0, plate, 40).userData.through = true;
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
