/* The weightlifting rack: a four-post power rack with a loaded barbell on its hooks, spotter arms, a pull-up bar, spare
   plates on horns at the back, and a cable running over two pulleys from a lat bar to a weight stack behind.
   build() adds it to whatever `scene` it is given: the rack opens to +z, its back is to the wall at -z, the floor is y = 0, metres.
   Click the barbell to press it, the lat bar to pull the stack up. */
(window.DREAM_GYM = window.DREAM_GYM || []).push({
  name: 'Rack', title: 'Power rack', line: 'Barbell, pull-up bar, lat pulldown on a cable and weight stack · click the bar or the lat bar',
  at: [2.75, -0.5], turn: -Math.PI / 2, view: { target: [0, 1.2, 0], cam: [1.9, 1.75, 4.9] },
  build({ THREE, scene, sound, kit }) {
const { M, tools, shadows, reps, mat, std } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, rod, tube, grp } = tools(g), R = reps();
mat(g, -1.25, 1.25, -0.95, 1.25);

/* ------------------------------------------------------------------ frame */
const UX = 0.6, UZ = 0.55, H = 2.3, S = 0.03;   // posts at (±UX, ±UZ), 60 mm box section
const hole = new THREE.CircleGeometry(0.009, 12), dark = std(0x050506, 0.9);
for (const sx of [-1, 1]) { for (const sz of [-1, 1]) box(sx * UX - S, sx * UX + S, 0, H, sz * UZ - S, sz * UZ + S, M.frame);
  box(sx * UX - S, sx * UX + S, 0, 0.06, -UZ + S, UZ - S, M.frame); box(sx * UX - S, sx * UX + S, H - 0.06, H, -UZ + S, UZ - S, M.frame);
  for (let y = 0.25; y < H - 0.15; y += 0.075) mk(hole, dark, g, sx * UX, y, UZ + S + 0.001); }
box(-UX + S, UX - S, 0, 0.06, -UZ - S, -UZ + S, M.frame);
for (const z of [-UZ, 0.1]) box(-UX + S, UX - S, H - 0.06, H, z - S, z + S, M.frame);
rod(0.016, 2 * UX, M.chrome, 0, H - 0.03, UZ);                                              // pull-up bar
// hooks for the bar and spotter arms below them
const HY = 1.42, BZ = UZ + S + 0.045;
for (const sx of [-1, 1]) { box(sx * UX - S, sx * UX + S, HY - 0.12, HY + 0.08, UZ + S, UZ + S + 0.012, M.steel); box(sx * UX - S, sx * UX + S, HY - 0.02, HY, UZ + S, BZ + 0.05, M.steel); box(sx * UX - S, sx * UX + S, HY, HY + 0.04, BZ + 0.035, BZ + 0.05, M.steel);
  box(sx * UX - 0.025, sx * UX + 0.025, 0.86, 0.92, UZ + S, UZ + 0.55, M.frame); box(sx * UX - 0.025, sx * UX + 0.025, 0.92, 0.926, UZ + S, UZ + 0.55, M.rubber); box(sx * UX - S, sx * UX + S, 0.78, 1.0, UZ + S, UZ + S + 0.012, M.steel); }

/* ---------------------------------------------------------------- barbell */
// a plate on a bar that lies along x: a rubber disc, a raised rim and a steel hub
const plate = (parent, x, r, t, m) => { rod(r, t, m, x, 0, 0, parent, 48); rod(r * 0.62, t + 0.004, M.rubber, x, 0, 0, parent, 48); rod(r * 0.56, t + 0.006, m, x, 0, 0, parent, 48); rod(0.045, t + 0.01, M.steel, x, 0, 0, parent, 24); };
const bar = grp(0, HY + 0.014, BZ);
rod(0.014, 1.36, M.chrome, 0, 0, 0, bar);
for (const s of [-1, 1]) { rod(0.036, 0.03, M.chrome, s * 0.695, 0, 0, bar); rod(0.025, 0.41, M.chrome, s * 0.895, 0, 0, bar);
  plate(bar, s * 0.74, 0.225, 0.058, M.red); plate(bar, s * 0.797, 0.225, 0.046, M.blue); plate(bar, s * 0.838, 0.225, 0.026, M.green);
  rod(0.034, 0.04, M.steel, s * 0.874, 0, 0, bar); }
for (const s of [-1, 1]) rod(0.0145, 0.3, std(0xb9bcc0, 0.55, 1), s * 0.42, 0, 0, bar);       // knurling
bar.userData.click = R.add(2.4, k => { bar.position.y = HY + 0.014 + 0.46 * k; bar.rotation.x = -k * 0.6; }, () => sound.clank(300));

/* ----------------------------------------------------------- spare plates */
for (const s of [-1, 1]) for (const [y, list] of [[0.42, [[0.2, 0.05, M.yellow], [0.2, 0.05, M.yellow]]], [0.98, [[0.175, 0.036, M.green], [0.13, 0.026, M.white], [0.1, 0.02, M.red]]]]) {
  const h = grp(s * (UX + S), y, -UZ); rod(0.024, 0.26, M.chrome, s * 0.13, 0, 0, h); let x = 0.012;
  for (const [r, t, m] of list) { plate(h, s * (x + t / 2), r, t, m); x += t + 0.004; } }

/* ---------------------------------------------------- cable, pulleys, stack */
const PY = 2.12, PR = 0.05, ZF = -0.05, ZR = -0.73, SZ = -0.78, N = 16, PH = 0.03, LIFT = 5, TRAVEL = 0.55;
box(-0.03, 0.03, H, H + 0.06, -0.9, 0.13, M.frame);                                           // the beam the pulleys hang from
const wheel = z => { for (const s of [-1, 1]) box(s * 0.017 - 0.002, s * 0.017 + 0.002, PY - 0.045, H, z - 0.03, z + 0.03, M.steel);
  const w = grp(0, PY, z); rod(PR + 0.006, 0.006, M.iron, -0.009, 0, 0, w, 32); rod(PR + 0.006, 0.006, M.iron, 0.009, 0, 0, w, 32); rod(PR - 0.003, 0.014, M.red, 0, 0, 0, w, 32); rod(0.012, 0.04, M.steel, 0, 0, 0, w, 12);
  for (let i = 0; i < 3; i++) { const a = i * 2.094; mk(new THREE.CylinderGeometry(0.008, 0.008, 0.026, 10).rotateZ(Math.PI / 2), M.iron, w, 0, 0.03 * Math.cos(a), 0.03 * Math.sin(a)); } return w; };
const wheels = [wheel(ZF), wheel(ZR)], cable = std(0x0c0c0d, 0.5, 0.3);
tube([0, PY + PR, ZR], [0, PY + PR, ZF], 0.004, cable);
const run = z => mk(new THREE.CylinderGeometry(0.004, 0.004, 1, 8), cable, g, 0, 0, z), front = run(ZF + PR), rear = run(SZ);
const span = (m, y0, y1) => { m.position.y = (y0 + y1) / 2; m.scale.y = y1 - y0; };
// the stack: sixteen iron plates on two guide rods, the pin under the fifth
box(-0.2, 0.2, 0, 0.1, SZ - 0.1, SZ + 0.1, M.frame);
for (const s of [-1, 1]) cyl(0.011, H - 0.1, M.chrome, s * 0.1, 0.1 + (H - 0.1) / 2, SZ, g, 12);
const top = grp(0, 0, 0), TOP = 0.1 + N * PH;
for (let i = 0; i < N; i++) { const up = i >= N - LIFT, p = box(-0.15, 0.15, 0.1 + i * PH + 0.001, 0.1 + (i + 1) * PH - 0.001, SZ - 0.055, SZ + 0.055, M.iron, up ? top : g);
  mk(new THREE.PlaneGeometry(0.03, 0.012), up ? M.white : M.steel, p, 0.11, 0, 0.0556); }
box(-0.13, 0.13, TOP, TOP + 0.025, SZ - 0.03, SZ + 0.03, M.steel, top); cyl(0.008, 0.06, M.steel, 0, TOP + 0.05, SZ, top, 10);
mk(new THREE.CylinderGeometry(0.009, 0.009, 0.07, 12).rotateX(Math.PI / 2), M.red, top, 0, 0.1 + (N - LIFT + 0.5) * PH, SZ + 0.08);
// the lat bar: a long chrome bar, bent down at the ends, with rubber grips
const LY = 1.95, lat = grp(0, LY, ZF + PR);
rod(0.013, 0.84, M.chrome, 0, 0, 0, lat);
for (const s of [-1, 1]) { tube([s * 0.42, 0, 0], [s * 0.6, -0.075, 0], 0.013, M.chrome, lat); tube([s * 0.45, -0.0125, 0], [s * 0.59, -0.071, 0], 0.017, M.rubber, lat); mk(new THREE.SphereGeometry(0.013, 12, 8), M.chrome, lat, s * 0.42, 0, 0); }
tube([0, 0, 0], [0, 0.05, 0], 0.007, M.steel, lat); mk(new THREE.TorusGeometry(0.014, 0.004, 8, 20).rotateY(Math.PI / 2), M.steel, lat, 0, 0.062, 0);
mk(new THREE.BoxGeometry(1.24, 0.2, 0.14), M.unseen, lat, 0, -0.02, 0);
const pull = k => { const d = TRAVEL * k; lat.position.y = LY - d; top.position.y = d; span(front, LY - d + 0.07, PY); span(rear, TOP + 0.08 + d, PY); wheels[0].rotation.x = d / PR; wheels[1].rotation.x = d / PR; };
pull(0);
lat.userData.click = R.add(2.6, pull, () => sound.clank(520));

shadows(g);
return { parts: {}, tick: R.tick };
  } });
