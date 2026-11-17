/* The island: green cabinets under one long slab of marble that overhangs on the near side for three oak stools,
   with a bowl of fruit, a loaf on a board, a pasta machine and its drying rack, a kaldero and a kawali on top, and three brass pendant lamps hanging over it.
   build() adds it to whatever `scene` it is given: centred on x = z = 0, the stools towards +z, the floor is y = 0, metres. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Island', title: 'Island', line: 'One slab of marble, three stools · click a lamp to switch the pendants, a stool to spin it',
  at: [0.3, 0.45], turn: 0, view: { target: [0, 1.05, 0], cam: [-0.6, 2.4, 3.3] },
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
