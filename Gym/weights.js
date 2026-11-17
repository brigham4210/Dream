/* The free weights: ten pairs of rubber hex dumbbells on a two-shelf rack, three kettlebells and a flat bench.
   build() adds them to whatever `scene` it is given: the rack's back is to the wall at -z, the floor is y = 0, metres.
   Click a dumbbell or a kettlebell to lift it. */
(window.DREAM_GYM = window.DREAM_GYM || []).push({
  name: 'Free weights', title: 'Free weights', line: 'Ten pairs of dumbbells, three kettlebells and a bench · click a weight to lift it',
  at: [-3.4, -0.2], turn: Math.PI / 2, view: { target: [0.3, 0.5, 0.4], cam: [-1.5, 1.6, 4.2] },
  build({ THREE, scene, sound, kit }) {
const { M, tools, shadows, reps, mat } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, rod, tube, grp } = tools(g), R = reps();
mat(g, -1.15, 2.0, -0.28, 1.45);

/* ------------------------------------------------------------ dumbbell rack */
const W = 1.9, TILT = 0.24;
for (const s of [-1, 1]) { const x = s * (W / 2 + 0.02); box(x - 0.025, x + 0.025, 0, 1.0, -0.2, -0.15, M.frame); box(x - 0.025, x + 0.025, 0, 0.05, -0.2, 0.3, M.frame); tube([x, 0.05, 0.27], [x, 0.62, -0.16], 0.02, M.frame); }
// a dumbbell lying with its handle front to back, on a flat of its hex heads; sizes grow with i = 0..9
const size = i => ({ r: 0.04 + i * 0.005, t: 0.034 + i * 0.0038 });
function dumbbell(parent, x, i) { const { r, t } = size(i), d = grp(x, r * 0.866, 0, parent), HL = 0.125;
  mk(new THREE.CylinderGeometry(0.0145, 0.0145, HL + 0.02, 16).rotateX(Math.PI / 2), M.chrome, d);
  for (const s of [-1, 1]) { const h = mk(new THREE.CylinderGeometry(r, r, t, 6).rotateX(Math.PI / 2), M.rubber, d, 0, 0, s * (HL + t) / 2); h.rotation.z = Math.PI / 6;
    mk(new THREE.CircleGeometry(r * 0.5, 24), M.steel, d, 0, 0, s * (HL / 2 + t + 0.0006)).rotation.y = s > 0 ? 0 : Math.PI; }
  d.userData.click = R.add(1.5, k => { d.position.y = r * 0.866 + 0.2 * k; d.position.z = 0.06 * k; d.rotation.x = -0.5 * k; }, () => sound.clank(900 - i * 55));
  return d; }
[[0.84, -0.02, 0], [0.42, 0.11, 5]].forEach(([y, z, first]) => {
  const shelf = grp(0, y, z); shelf.rotation.x = TILT;
  box(-W / 2, W / 2, -0.02, 0, -0.17, 0.17, M.frame, shelf); box(-W / 2, W / 2, 0, 0.022, 0.158, 0.17, M.frame, shelf); box(-W / 2 + 0.01, W / 2 - 0.01, 0, 0.003, -0.16, 0.155, M.rubber, shelf);
  const rs = []; for (let i = first; i < first + 5; i++) rs.push(i, i);
  const gap = (W - 0.06 - rs.reduce((a, i) => a + 2 * size(i).r, 0)) / (rs.length - 1); let x = -W / 2 + 0.03;
  for (const i of rs) { const r = size(i).r; dumbbell(shelf, x + r, i); x += 2 * r + gap; } });

/* -------------------------------------------------------------- kettlebells */
[[0.085, M.blue], [0.1, M.yellow], [0.115, M.red]].forEach(([r, band], i) => { const k = grp(1.22 + i * 0.27, 0.014, 0.02);
  mk(new THREE.SphereGeometry(r, 32, 24), M.iron, k, 0, r * 0.94, 0).scale.y = 0.94; cyl(r * 0.6, 0.01, M.iron, 0, 0.005, 0, k);
  mk(new THREE.TorusGeometry(r * 0.62, r * 0.16, 12, 32), M.iron, k, 0, r * 1.9, 0).scale.set(1, 0.95, 1);
  mk(new THREE.TorusGeometry(r * 0.985, 0.006, 8, 48).rotateX(Math.PI / 2), band, k, 0, r * 1.1, 0);
  k.userData.click = R.add(1.7, a => { k.position.y = 0.014 + 0.45 * a; k.rotation.z = 0.5 * a; }, () => sound.thud()); });

/* -------------------------------------------------------------------- bench */
{ const b = grp(0.05, 0, 0.98);
  mk(new THREE.BoxGeometry(1.2, 0.07, 0.29), M.vinyl, b, 0, 0.455, 0); box(-0.52, 0.52, 0.36, 0.42, -0.03, 0.03, M.frame, b);
  for (const s of [-1, 1]) { box(s * 0.5 - 0.025, s * 0.5 + 0.025, 0.02, 0.42, -0.025, 0.025, M.frame, b); box(s * 0.5 - 0.025, s * 0.5 + 0.025, 0.014, 0.06, -0.2, 0.2, M.frame, b);
    for (const z of [-0.2, 0.2]) box(s * 0.5 - 0.03, s * 0.5 + 0.03, 0.014, 0.024, z - 0.03, z + 0.03, M.rubber, b); } }

shadows(g);
return { parts: {}, tick: R.tick };
  } });
