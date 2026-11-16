/* The wall clock: a brass-rimmed dial that shows the real time. build() adds it to whatever `scene` it is given,
   flat on the wall at z = 0 and facing +z, its centre 2.05 m above the floor. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Clock', title: 'Wall clock', line: 'Brass and enamel · it keeps the real time',
  at: [-3.6, -0.9], turn: Math.PI / 2, view: { target: [0, 2.05, 0], cam: [0.35, 2.1, 2.2] },
  build({ THREE, scene, kit }) {
const { std, tex, tools, M } = kit, g = new THREE.Group(); g.position.y = 2.05; scene.add(g);
const { mk, box, cyl } = tools(g), R = 0.2;
const face = tex(512, 512, (c, w) => { c.fillStyle = '#f7f4ec'; c.fillRect(0, 0, w, w); c.translate(w / 2, w / 2); c.fillStyle = '#1c1d1f'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '600 54px "Helvetica Neue", Helvetica, Arial, sans-serif';
  for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6; c.fillText(String(i), Math.sin(a) * 178, -Math.cos(a) * 178 + 4); }
  for (let i = 0; i < 60; i++) { c.save(); c.rotate(i * Math.PI / 30); c.fillRect(-(i % 5 ? 1.5 : 3.5), -238, i % 5 ? 3 : 7, i % 5 ? 12 : 22); c.restore(); } });
cyl(R + 0.018, 0.03, M.brass, 0, 0, 0.015, g, 64).rotation.x = Math.PI / 2; mk(new THREE.CircleGeometry(R, 64), std(0xffffff, 0.5, 0, { map: face }), g, 0, 0, 0.031);
const hand = (w, l, mat, z) => { const h = new THREE.Group(); h.position.z = z; g.add(h); box(-w / 2, w / 2, -l * 0.18, l, 0, 0.002, mat, h); return h; };
const hour = hand(0.012, R * 0.5, M.black, 0.034), minute = hand(0.008, R * 0.8, M.black, 0.037), second = hand(0.003, R * 0.86, std(0xc0271d, 0.5), 0.04);
cyl(0.012, 0.012, M.brass, 0, 0, 0.04, g, 20).rotation.x = Math.PI / 2;
g.traverse(o => { if (o.isMesh) o.castShadow = true; });
function tick() { const d = new Date(), s = d.getSeconds(), m = d.getMinutes() + s / 60, h = d.getHours() % 12 + m / 60; hour.rotation.z = -h * Math.PI / 6; minute.rotation.z = -m * Math.PI / 30; second.rotation.z = -s * Math.PI / 30; }
tick(); return { parts: {}, tick };
  } });
