/* The video camera on its tripod, for filming a take. build() adds it to whatever `scene` it is given:
   the lens looks towards -z, the monitor faces +z (where the operator stands), feet on y = 0, metres.
   A click starts it rolling: the tally lights go red and the monitor shows, live, what the lens sees. Nothing is saved. */
(window.DREAM_MUSIC = window.DREAM_MUSIC || []).push({
  name: 'Camera', title: 'Video camera', line: 'On a tripod, framed on the piano · click it to roll and see the shot on its monitor',
  at: [0.15, 2.7], turn: 0.47, view: { target: [0, 1.4, 0], cam: [0.75, 1.72, 1.9] },
  build({ THREE, scene, renderer, world }) {
const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
const body = std(0x1a1a1c, 0.5, 0.3), dark = std(0x0d0d0e, 0.7), alloy = std(0x8d9094, 0.35, 0.9), rubber = std(0x0a0a0b, 0.95);
const g = new THREE.Group(); scene.add(g); g.userData.click = () => { parts.rec.t = parts.rec.t ? 0 : 1; };
const mk = (geo, mat, parent = g, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const box = (w, h, d, mat, x, y, z, parent = g) => mk(new THREE.BoxGeometry(w, h, d), mat, parent, x, y, z);
const tube = (a, b, r, mat, parent = g) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), m = mk(new THREE.CylinderGeometry(r, r, A.distanceTo(B), 12), mat, parent); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); return m; };

/* ----------------------------------------------------------------- tripod */
const APEX = 1.22, HEAD = 1.36;
for (let i = 0; i < 3; i++) { const a = i * 2 * Math.PI / 3 + Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
  tube([0.05 * c, APEX, 0.05 * s], [0.27 * c, 0.6, 0.27 * s], 0.016, body); tube([0.25 * c, 0.66, 0.25 * s], [0.46 * c, 0.02, 0.46 * s], 0.012, alloy);
  mk(new THREE.SphereGeometry(0.022, 12, 8), rubber, g, 0.46 * c, 0.02, 0.46 * s); tube([0, 0.5, 0], [0.3 * c, 0.5, 0.3 * s], 0.006, alloy); }
mk(new THREE.CylinderGeometry(0.06, 0.07, 0.07, 24), body, g, 0, APEX, 0); tube([0, 0.5, 0], [0, HEAD - 0.06, 0], 0.014, alloy);
mk(new THREE.CylinderGeometry(0.05, 0.055, 0.06, 24), dark, g, 0, HEAD - 0.04, 0); box(0.1, 0.022, 0.13, dark, 0, HEAD, 0);
{ tube([0.04, HEAD - 0.02, 0.03], [0.2, HEAD - 0.13, 0.4], 0.008, alloy); tube([0.16, HEAD - 0.106, 0.31], [0.2, HEAD - 0.13, 0.4], 0.014, rubber); }

/* ----------------------------------------------------------------- camera */
const cam = new THREE.Group(); cam.position.set(0, HEAD + 0.011, 0); g.add(cam);
box(0.13, 0.105, 0.15, body, 0, 0.0525, 0, cam); box(0.035, 0.09, 0.1, rubber, -0.075, 0.05, -0.01, cam);            // body and grip
box(0.022, 0.05, 0.16, body, 0, 0.155, -0.005, cam); for (const z of [-0.07, 0.06]) box(0.022, 0.05, 0.022, body, 0, 0.125, z, cam);   // top handle
const barrel = (r, l, z, mat) => mk(new THREE.CylinderGeometry(r, r, l, 40).rotateX(Math.PI / 2), mat, cam, 0, 0.055, z);
barrel(0.04, 0.05, -0.1, dark); barrel(0.043, 0.035, -0.142, rubber); barrel(0.04, 0.04, -0.18, dark); barrel(0.05, 0.04, -0.215, dark);
mk(new THREE.CircleGeometry(0.036, 40).rotateY(Math.PI), new THREE.MeshPhysicalMaterial({ color: 0x0b1020, roughness: 0.05, metalness: 0.4, clearcoat: 1 }), cam, 0, 0.055, -0.2);
box(0.03, 0.03, 0.2, dark, 0.03, 0.2, -0.06, cam);   // shotgun microphone on a rail
mk(new THREE.CylinderGeometry(0.016, 0.016, 0.24, 16).rotateX(Math.PI / 2), std(0x2a2a2c, 0.95), cam, 0.03, 0.2, -0.08);
// tally lights, front and back
const tallyMat = std(0x3a0a08, 0.4, 0, { emissive: 0xff1a10, emissiveIntensity: 0 });
mk(new THREE.SphereGeometry(0.008, 12, 8), tallyMat, cam, 0.045, 0.09, -0.076); mk(new THREE.SphereGeometry(0.008, 12, 8), tallyMat, cam, 0.05, 0.085, 0.076);
// the monitor on an arm: it shows the live picture once the camera is rolling
const MW = 0.2, MH = MW * 9 / 16, mon = new THREE.Group(); mon.position.set(-0.13, 0.2, 0.05); mon.rotation.set(-0.12, 0.25, 0); cam.add(mon);
tube([-0.05, 0.1, 0.03], [-0.13, 0.14, 0.04], 0.007, alloy, cam);
box(MW + 0.02, MH + 0.02, 0.02, body, 0, 0, 0, mon);
const feed = new THREE.WebGLRenderTarget(480, 270), off = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.15 }), live = new THREE.MeshBasicMaterial({ map: feed.texture });
const screen = mk(new THREE.PlaneGeometry(MW, MH), off, mon, 0, 0, 0.0105);
const dot = mk(new THREE.CircleGeometry(0.006, 20), new THREE.MeshBasicMaterial({ color: 0xff2a1c }), mon, -MW / 2 + 0.015, MH / 2 - 0.014, 0.0112); dot.visible = false;
const lens = new THREE.PerspectiveCamera(25, 16 / 9, 0.15, 30); lens.position.set(0, 0.055, -0.24); cam.add(lens);
cam.rotation.x = -0.08;   // tilted down a touch, onto the keyboard

g.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
let rolling = false, clock = 0, frame = 0;
const parts = { rec: { set: v => { tallyMat.emissiveIntensity = 3 * v; rolling = v > 0.5; screen.material = rolling ? live : off; if (!rolling) dot.visible = false; } } };
function tick(dt) {
  if (!rolling) return;
  clock += dt; dot.visible = clock % 1 < 0.6;
  if (frame++ % 2) return;   // the monitor refreshes every other frame
  const target = renderer.getRenderTarget(); screen.visible = false;
  renderer.setRenderTarget(feed); renderer.render(world, lens); renderer.setRenderTarget(target); screen.visible = true;
}
return { parts, tick };
  } });
