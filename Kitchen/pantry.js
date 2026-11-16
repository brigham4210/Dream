/* The pantry: a tall green cupboard with two doors that open onto oak shelves of jars, tins, boxes, bottles and baskets.
   build() adds it to whatever `scene` it is given: the wall is z = 0, the doors towards +z, the floor is y = 0, metres. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Pantry', title: 'Pantry cupboard', line: 'Six shelves of dry goods · click a door to open it',
  at: [-3.6, 0.6], turn: Math.PI / 2, view: { target: [0, 1.2, 0.3], cam: [1.1, 1.7, 3.3] },
  build({ THREE, scene, sound, kit }) {
const { std, rand, tools, M, front, pull } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), rnd = rand(13), parts = {};
const HW = 0.6, D = 0.45, H = 2.3, KICK = 0.1, SH = [0.5, 0.86, 1.2, 1.54, 1.88];

for (const k of [-1, 1]) box(k * HW - (k > 0 ? 0.02 : 0), k * HW + (k < 0 ? 0.02 : 0), 0, H, 0, D, M.paint);
box(-HW, HW, H - 0.02, H, 0, D, M.paint); box(-HW - 0.015, HW + 0.015, H, H + 0.03, 0, D + 0.03, M.paint); box(-HW, HW, 0, KICK, 0, D - 0.05, M.black);
box(-HW, HW, KICK, H, 0, 0.015, M.oak); box(-HW, HW, KICK, KICK + 0.02, 0, D, M.oak); for (const y of SH) box(-HW + 0.02, HW - 0.02, y - 0.02, y, 0.015, D - 0.03, M.oak);
for (const s of [-1, 1]) { const h = H - KICK - 0.026, hinge = grp(s * HW, 0, D + 0.01), f = front(HW - 0.004, h, M.paint, hinge, -s * HW / 2, KICK + 0.003 + h / 2, 0); pull(f, -s * (HW / 2 - 0.05), -0.05, 0.014, 0.3, true);
  const p = parts['d' + s] = { set: v => { hinge.rotation.y = s * v * 1.75; } }; hinge.userData.click = () => { p.t = p.t ? 0 : 1; sound.tap(); }; }

// what is on the shelves, from the floor up
const Z = 0.22, glassJar = (x, y, c, h, r = 0.05) => { mk(new THREE.CylinderGeometry(r, r, h, 24, 1, true), M.glass, g, x, y + h / 2, Z).userData.through = true; cyl(r * 0.9, h * 0.8, std(c, 0.9), x, y + h * 0.4 + 0.003, Z); cyl(r * 1.04, 0.018, M.oak, x, y + h + 0.009, Z); };
for (const x of [-0.29, 0.29]) { box(x - 0.24, x + 0.24, KICK + 0.02, KICK + 0.3, 0.06, D - 0.06, std(0x9a6f35, 0.9)); for (let i = 0; i < 7; i++) mk(new THREE.SphereGeometry(0.045, 14, 10), std(x < 0 ? 0xb58a4a : 0x8a3a5a, 0.8), g, x - 0.17 + (i % 4) * 0.11, KICK + 0.31, 0.14 + (i > 3 ? 0.14 : 0.04)).scale.set(1.2, 0.8, 1); }
[0x4f6b2a, 0x6b7a2a, 0x2a1a08, 0x8a1c14, 0xe8d9a8, 0x4f6b2a].forEach((c, i) => { const x = -0.47 + i * 0.19, h = 0.27 + (i % 3) * 0.02; cyl(0.036, h * 0.65, std(c, 0.15), x, SH[0] + h * 0.325, Z); mk(new THREE.CylinderGeometry(0.013, 0.036, h * 0.17, 20), std(c, 0.15), g, x, SH[0] + h * 0.735, Z); cyl(0.013, h * 0.15, std(c, 0.15), x, SH[0] + h * 0.895, Z, g, 12); cyl(0.015, 0.014, M.brass, x, SH[0] + h * 0.975, Z, g, 12); });
for (let i = 0; i < 16; i++) { const col = i % 8, row = i >> 3, c = [0xb5271e, 0xd9a441, 0x2f6b34, 0x39506b][(col + row) % 4]; cyl(0.04, 0.11, M.steel, -0.49 + col * 0.14, SH[1] + 0.055 + row * 0.112, Z); cyl(0.0405, 0.075, std(c, 0.7), -0.49 + col * 0.14, SH[1] + 0.055 + row * 0.112, Z); }
[[0xe8d9a8, 0.24], [0x8a5a34, 0.2], [0xf1ead8, 0.26], [0xb9482c, 0.18], [0xd9c7a8, 0.24], [0x3a2416, 0.2], [0xe2b866, 0.26], [0x7a8a4a, 0.18]].forEach(([c, h], i) => glassJar(-0.48 + i * 0.137, SH[2], c, h));
[[0xd9a441, 0.28, 0.17], [0xb5271e, 0.26, 0.15], [0x39506b, 0.29, 0.18], [0xe9e2d0, 0.24, 0.16], [0x2f6b34, 0.27, 0.15], [0xc98a3c, 0.25, 0.17]].reduce((x, [c, h, w]) => { box(x, x + w, SH[3], SH[3] + h, 0.1, 0.16 + rnd() * 0.04 + 0.14, std(c, 0.85)); return x + w + 0.012; }, -0.54);
for (const x of [-0.36, 0.0, 0.36]) { mk(new THREE.CylinderGeometry(0.15, 0.1, 0.11, 40, 1, true), M.ceramic, g, x, SH[4] + 0.055, Z); cyl(0.1, 0.006, M.ceramic, x, SH[4] + 0.003, Z, g, 32); }

g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = o.receiveShadow = true; });
return { parts };
  } });
