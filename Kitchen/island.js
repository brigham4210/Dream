/* The island: green cabinets under one long slab of marble that overhangs on the near side for three oak stools,
   with a bowl of fruit, a loaf on a board and a vase on top, and three brass pendant lamps hanging over it.
   build() adds it to whatever `scene` it is given: centred on x = z = 0, the stools towards +z, the floor is y = 0, metres. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Island', title: 'Island', line: 'One slab of marble, three stools · click a lamp to switch the pendants, a stool to spin it',
  at: [0.3, 0.45], turn: 0, view: { target: [0, 1.05, 0], cam: [1.6, 2.5, 4.6] },
  build({ THREE, scene, sound, kit, RH }) {
const { std, rand, tools, M, front, pull, slab } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), rnd = rand(77), parts = {};
const HX = 1.26, Z0 = -0.5, Z1 = 0.24, H = 0.87, TOP = 0.92, KICK = 0.1, top = RH || 2.9;

/* ------------------------------------------------------------------- body */
box(-HX, HX, KICK, H, Z0, Z1, M.paint); box(-HX + 0.06, HX - 0.06, 0, KICK, Z0 + 0.06, Z1 - 0.06, M.black);
const fh = H - KICK - 0.01, fy = KICK + 0.005 + fh / 2;
for (let i = 0; i < 4; i++) { const w = 2 * HX / 4, x = -HX + (i + 0.5) * w;
  front(w - 0.006, fh, M.paint, g, x, fy, Z1 + 0.008);                                                                  // panelled side towards the stools
  const f = front(w - 0.006, fh, M.paint, g, x, fy, Z0 - 0.008); f.rotation.y = Math.PI; pull(f, 0, fh / 2 - 0.1, 0.014, 0.16); }   // cupboards towards the range
for (const k of [-1, 1]) { const f = front(Z1 - Z0 - 0.006, fh, M.paint, g, k * (HX + 0.008), fy, (Z0 + Z1) / 2); f.rotation.y = k * Math.PI / 2; }
g.add(slab(-HX - 0.05, HX + 0.05, Z0 - 0.05, Z1 + 0.34, H, TOP, M.marble));

/* ----------------------------------------------------------------- stools */
[-0.8, 0, 0.8].forEach((x, i) => { const s = grp(x, 0, Z1 + 0.42), seat = grp(0, 0, 0, s);
  mk(new THREE.CylinderGeometry(0.17, 0.155, 0.04, 40), M.oak, seat, 0, 0.66, 0); mk(new THREE.CylinderGeometry(0.155, 0.12, 0.012, 40), M.oak, seat, 0, 0.634, 0);
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4, l = grp(Math.cos(a) * 0.11, 0.63, Math.sin(a) * 0.11, s); l.rotation.y = -a; l.rotation.z = 0.13; cyl(0.011, 0.64, M.iron, 0, -0.32, 0, l, 12); }
  mk(new THREE.TorusGeometry(0.16, 0.007, 8, 40).rotateX(Math.PI / 2), M.brass, s, 0, 0.24, 0);
  const p = parts['stool' + i] = { set: v => { seat.rotation.y = v * Math.PI * 2; } };
  s.userData.click = () => { p.t = p.t ? 0 : 1; }; });

/* ------------------------------------------------------------- on the top */
// a bowl of fruit
{ const b = grp(-0.72, TOP, -0.08); mk(new THREE.LatheGeometry([[0.05, 0], [0.09, 0.012], [0.15, 0.05], [0.175, 0.095], [0.18, 0.095], [0.155, 0.045], [0.09, 0.004], [0.05, 0]].map(p => new THREE.Vector2(...p)), 48), M.ceramic, b);
  const fruit = (c, x, y, z, r, sy = 1, sx = 1) => { const f = mk(new THREE.SphereGeometry(r, 24, 16), std(c, 0.45), b, x, y, z); f.scale.set(sx, sy, 1); f.rotation.y = rnd() * 3; return f; };
  fruit(0xf0c419, -0.06, 0.07, 0.03, 0.034, 1, 1.3); fruit(0xf0c419, 0.02, 0.075, -0.07, 0.034, 1, 1.3); fruit(0xf3cf2d, 0.0, 0.13, 0.0, 0.034, 1, 1.3);
  fruit(0xf08a1c, 0.07, 0.085, 0.03, 0.045); fruit(0xf08a1c, -0.04, 0.085, -0.05, 0.045); fruit(0x8db33a, 0.0, 0.08, 0.075, 0.04, 0.92); fruit(0xb5271e, -0.085, 0.1, -0.02, 0.038, 0.92); fruit(0x8db33a, 0.075, 0.12, -0.04, 0.038, 0.92); }
// a loaf on an oak board, a few slices cut, and the knife
{ const b = grp(0.42, TOP, 0.02); b.rotation.y = 0.22; box(-0.24, 0.24, 0, 0.022, -0.15, 0.15, M.oak, b); cyl(0.012, 0.03, M.black, -0.21, 0.011, -0.12, b, 16).rotation.x = 0;
  const crust = std(0xa9682c, 0.8), crumb = std(0xf0dfbd, 0.9);
  const loaf = mk(new THREE.CapsuleGeometry(0.06, 0.16, 8, 24).rotateZ(Math.PI / 2), crust, b, -0.04, 0.07, -0.03); loaf.scale.set(1, 0.85, 1.1);
  for (let i = 0; i < 3; i++) { const s = grp(0.13 + i * 0.03, 0.022, -0.03 + i * 0.012, b); s.rotation.z = -1.1 - i * 0.12; const sl = mk(new THREE.CylinderGeometry(0.058, 0.058, 0.014, 24).rotateZ(Math.PI / 2), crumb, s, 0.008, 0.05, 0); sl.scale.set(1, 0.85, 1.1); mk(new THREE.TorusGeometry(0.058, 0.004, 6, 24).rotateY(Math.PI / 2), crust, s, 0.008, 0.05, 0).scale.set(1, 0.85, 1.1); }
  const k = grp(0.02, 0.026, 0.1, b); k.rotation.y = 0.15; box(-0.2, 0.02, -0.002, 0.002, -0.016, 0.016, M.steel, k); box(0.02, 0.13, -0.008, 0.008, -0.012, 0.012, M.black, k); }
// a glass vase of eucalyptus
{ const v = grp(0.98, TOP, -0.22), leaf = std(0x6f8f76, 0.8, 0, { side: THREE.DoubleSide });
  mk(new THREE.CylinderGeometry(0.055, 0.07, 0.24, 32, 1, true), M.glass, v, 0, 0.12, 0).userData.through = true; cyl(0.068, 0.006, M.glass, 0, 0.003, 0, v).userData.through = true;
  for (let i = 0; i < 7; i++) { const a = i * 0.9, st = grp(0, 0.02, 0, v); st.rotation.y = a; st.rotation.z = -0.1 - rnd() * 0.3; const len = 0.5 + rnd() * 0.25; cyl(0.003, len, std(0x5a6b4a, 0.8), 0, len / 2, 0, st, 6);
    for (let k = 0; k < 9; k++) { const l = mk(new THREE.CircleGeometry(0.022 + rnd() * 0.008, 12), leaf, st, (k % 2 ? 1 : -1) * 0.02, 0.26 + k * (len - 0.27) / 9, 0); l.rotation.set(rnd() * 1.2 - 0.6, rnd() * 3, 0); } } }

/* --------------------------------------------------------------- pendants */
const shade = std(0xc9a252, 0.3, 1, { side: THREE.DoubleSide }), bulb = new THREE.MeshBasicMaterial({ color: 0x000000 }), inner = std(0xfff4dc, 0.6, 0, { side: THREE.BackSide, emissive: 0xffd9a0, emissiveIntensity: 0 });
const lamps = [-0.85, 0, 0.85].map(x => { const l = grp(x, 1.72, 0.05); cyl(0.003, top - 1.72 - 0.19, M.black, 0, 0.19 + (top - 1.72 - 0.19) / 2, 0, l, 6); cyl(0.05, 0.02, M.brass, 0, top - 1.72 - 0.01, 0, l);
  mk(new THREE.SphereGeometry(0.17, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), shade, l); mk(new THREE.SphereGeometry(0.166, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), inner, l); cyl(0.022, 0.05, M.brass, 0, 0.185, 0, l);
  mk(new THREE.SphereGeometry(0.035, 20, 14), bulb, l, 0, 0.07, 0);
  const p = new THREE.PointLight(0xffe9cc, 0, 4, 1.6); p.position.set(0, 0.02, 0); l.add(p);
  l.userData.click = () => { const q = parts.lamps; q.t = q.t ? 0 : 1; sound.click(); }; return p; });
parts.lamps = { on: 1, set: v => { for (const p of lamps) p.intensity = 1.5 * v; bulb.color.setRGB(3.4 * v, 3 * v, 2.3 * v); inner.emissiveIntensity = 1.1 * v; } };

g.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = o.receiveShadow = true; });
return { parts };
  } });
