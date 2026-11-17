/* The dance barre: two beech rails, one above the other, on steel posts standing just off the mirrors.
   build() adds it to whatever `scene` it is given: the wall is at z = 0, the room is +z, the floor is y = 0, metres. */
(window.DREAM_GYM = window.DREAM_GYM || []).push({
  name: 'Barre', title: 'Dance barre', line: 'Two beech rails along the wall of mirrors, at hip and waist height',
  at: [-1.2, -2.8], view: { target: [0, 1, 0.2], cam: [1.1, 1.55, 4.8] },
  build({ THREE, scene, kit }) {
const { M, tools, shadows } = kit, g = new THREE.Group(); scene.add(g);
const { mk, cyl, rod, tube } = tools(g);
const L = 4.4, Z = 0.27, HI = 1.08, LO = 0.86, ZLO = Z - 0.085;
for (const [y, z] of [[HI, Z], [LO, ZLO]]) { const r = rod(0.021, L, M.beech, 0, y, z, g, 32); r.material.map.repeat.set(1, 1);
  for (const s of [-1, 1]) mk(new THREE.SphereGeometry(0.021, 24, 16), M.beech, g, s * L / 2, y, z); }
for (const x of [-1.95, -0.65, 0.65, 1.95]) {
  cyl(0.065, 0.008, M.steel, x, 0.004, Z); cyl(0.019, HI - 0.03, M.steel, x, (HI - 0.03) / 2, Z);
  // a saddle under the top rail, an arm reaching back to the lower one
  mk(new THREE.CylinderGeometry(0.03, 0.019, 0.03, 24), M.steel, g, x, HI - 0.035, Z); rod(0.026, 0.05, M.steel, x, HI - 0.004, Z).scale.set(1, 0.6, 1);
  tube([x, LO - 0.03, Z], [x, LO - 0.03, ZLO], 0.011, M.steel); tube([x, LO - 0.03, ZLO], [x, LO - 0.012, ZLO], 0.011, M.steel); rod(0.026, 0.05, M.steel, x, LO - 0.004, ZLO).scale.set(1, 0.6, 1);
}
shadows(g);
return { parts: {} };
  } });
