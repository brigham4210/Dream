/* The pantry: a tall green cupboard with two doors that open onto oak shelves, with baskets, empty jars and bowls.
   build() adds it to whatever `scene` it is given: the wall is z = 0, the doors towards +z, the floor is y = 0, metres. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Pantry', title: 'Pantry cupboard', line: 'Oak shelves, baskets and empty jars · click a door to open it',
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

// what is on the shelves: baskets, empty jars and bowls, waiting to be filled
const Z = 0.22;
for (const x of [-0.29, 0.29]) box(x - 0.24, x + 0.24, KICK + 0.02, KICK + 0.3, 0.06, D - 0.06, std(0x9a6f35, 0.9));
[0.24, 0.2, 0.26, 0.18, 0.24, 0.2, 0.26, 0.18].forEach((h, i) => { const x = -0.48 + i * 0.137; mk(new THREE.CylinderGeometry(0.05, 0.05, h, 24, 1, true), M.glass, g, x, SH[2] + h / 2, Z).userData.through = true; cyl(0.052, 0.018, M.oak, x, SH[2] + h + 0.009, Z); });
for (const x of [-0.36, 0.0, 0.36]) { mk(new THREE.CylinderGeometry(0.15, 0.1, 0.11, 40, 1, true), M.ceramic, g, x, SH[4] + 0.055, Z); cyl(0.1, 0.006, M.ceramic, x, SH[4] + 0.003, Z, g, 32); }

g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = o.receiveShadow = true; });
return { parts };
  } });
