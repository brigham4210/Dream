/* The Korean barbecue and hotpot table: an oak table with a charcoal grill and a divided hotpot set into a stone top,
   bowls and chopsticks around them, four stools, and two copper extractor ducts that come down
   from the ceiling to draw the smoke and steam away. build() adds it to whatever `scene` it is given, centred on
   x = z = 0, long side along x, the floor is y = 0, metres. Click the grill or the pot to start it, a duct to raise or lower it. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'BBQ & hotpot', title: 'Korean barbecue and hotpot table', line: 'Charcoal grill and a divided hotpot under two extractor ducts · click the grill, the pot or a duct',
  at: [1.45, 2.75], turn: Math.PI / 2, view: { target: [0, 1.0, 0], cam: [-3.3, 2.5, 1.5] },
  build({ THREE, scene, sound, kit, RH }) {
const { std, tex, rand, tools, M, steam } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), rnd = rand(29), parts = {}, top = RH || 2.9;
const HX = 0.75, HZ = 0.45, TY = 0.76, GX = -0.33, PX = 0.33, copper = std(0xc0703f, 0.25, 1, { side: THREE.DoubleSide }), stone = std(0x1d1e20, 0.3);
const lathe = (pts, mat, parent, x = 0, y = 0, z = 0, seg = 40) => mk(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(...p)), seg), mat, parent, x, y, z);
const gloss = c => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.2, clearcoat: 1 });

/* ---------------------------------------------------------- table, stools */
box(-HX, HX, TY - 0.045, TY - 0.005, -HZ, HZ, M.oak); box(-HX + 0.07, HX - 0.07, TY - 0.005, TY, -HZ + 0.07, HZ - 0.07, stone); box(-HX + 0.06, HX - 0.06, TY - 0.13, TY - 0.045, -HZ + 0.06, HZ - 0.06, M.oak);
for (const x of [-1, 1]) for (const z of [-1, 1]) box(x * (HX - 0.09) - 0.03, x * (HX - 0.09) + 0.03, 0, TY - 0.045, z * (HZ - 0.09) - 0.03, z * (HZ - 0.09) + 0.03, M.iron);
for (const x of [-0.36, 0.36]) for (const z of [-0.73, 0.73]) { const s = grp(x, 0, z); mk(new THREE.CylinderGeometry(0.16, 0.15, 0.04, 40), M.oak, s, 0, 0.45, 0); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4, l = grp(Math.cos(a) * 0.1, 0.43, Math.sin(a) * 0.1, s); l.rotation.y = -a; l.rotation.z = 0.14; cyl(0.011, 0.44, M.iron, 0, -0.22, 0, l, 10); } mk(new THREE.TorusGeometry(0.135, 0.006, 8, 32).rotateX(Math.PI / 2), M.iron, s, 0, 0.16, 0); }

/* ------------------------------------------------------------------ grill */
const grill = grp(GX, TY, 0);
const coalTex = tex(128, 128, (c, w) => { c.fillStyle = '#000'; c.fillRect(0, 0, w, w); for (let i = 0; i < 90; i++) { const x = rnd() * w, y = rnd() * w, r = 4 + rnd() * 9, gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,${120 + rnd() * 90},40,${0.5 + rnd() * 0.5})`); gr.addColorStop(1, 'rgba(255,60,0,0)'); c.fillStyle = gr; c.fillRect(x - r, y - r, 2 * r, 2 * r); } });
const coals = std(0x151312, 1, 0, { emissive: 0xffffff, emissiveMap: coalTex, emissiveIntensity: 0 });
mk(new THREE.TorusGeometry(0.175, 0.012, 10, 48).rotateX(Math.PI / 2), M.brass, grill, 0, 0.006, 0); cyl(0.168, 0.004, coals, 0, 0.002, 0, grill, 40);
const mesh = tex(256, 256, (c, w) => { c.clearRect(0, 0, w, w); c.strokeStyle = '#b9bcc0'; c.lineWidth = 3; for (let i = 6; i < w; i += 16) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, w); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } });
mk(new THREE.CircleGeometry(0.165, 48).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: mesh, alphaTest: 0.4, metalness: 0.9, roughness: 0.35, side: THREE.DoubleSide }), grill, 0, 0.026, 0).userData.through = true;
mk(new THREE.TorusGeometry(0.165, 0.005, 8, 48).rotateX(Math.PI / 2), M.steel, grill, 0, 0.026, 0);
grill.userData.click = () => { const p = parts.grill; p.t = p.t ? 0 : 1; if (p.t) sound.ignite(); else sound.click(); sound.loop('bbq', p.t); };
parts.grill = { set() {} };
{ const t = grp(-0.02, TY + 0.006, 0.02); t.rotation.y = 1.3; for (const k of [-1, 1]) { const a = box(-0.1, 0.1, 0, 0.003, -0.007, 0.007, M.steel, t); a.rotation.y = k * 0.07; a.position.z = k * 0.01; } }                                            // tongs

/* ----------------------------------------------------------------- hotpot */
const pot = grp(PX, TY, 0), steel = std(0xd3d6d9, 0.25, 1, { side: THREE.DoubleSide });
cyl(0.2, 0.004, M.black, 0, 0.002, 0, pot, 48); lathe([[0, 0.006], [0.15, 0.006], [0.185, 0.03], [0.19, 0.095], [0.198, 0.097]], steel, pot, 0, 0, 0, 48); box(-0.186, 0.186, 0.01, 0.092, -0.003, 0.003, steel, pot);
for (const k of [-1, 1]) box(k * 0.2 - 0.025, k * 0.2 + 0.025, 0.08, 0.09, -0.04, 0.04, M.black, pot);
const BY = 0.078;
const bits = [];
const bubbles = [];
pot.userData.click = () => { const p = parts.pot; p.t = p.t ? 0 : 1; sound.click(); sound.loop('bubble', p.t); };
parts.pot = { set() {} };

/* ------------------------------------------------- rice bowls and chopsticks */
for (const x of [-0.36, 0.36]) for (const z of [-0.37, 0.37]) { lathe([[0.02, 0], [0.03, 0.01], [0.048, 0.04]], M.ceramic, g, x, TY, z, 24); for (const k of [-1, 1]) { const c = cyl(0.003, 0.22, M.steel, x + 0.1 + k * 0.007, TY + 0.003, z, g, 6); c.rotation.z = Math.PI / 2; c.rotation.y = Math.PI / 2 + k * 0.02; } }

/* ------------------------------------------------------- extractor ducts */
const smokes = [GX, PX].map((x, i) => { cyl(0.1, 0.02, M.brass, x, top - 0.01, 0, g, 32); cyl(0.058, top - 1.95, copper, x, (top + 1.95) / 2, 0, g, 24);
  const d = grp(x, 0, 0); cyl(0.05, 0.8, copper, 0, 0.52, 0, d, 24); mk(new THREE.CylinderGeometry(0.05, 0.17, 0.13, 40, 1, true), copper, d, 0, 0.065, 0); mk(new THREE.TorusGeometry(0.17, 0.007, 8, 40).rotateX(Math.PI / 2), M.brass, d, 0, 0, 0); mk(new THREE.TorusGeometry(0.052, 0.006, 8, 24).rotateX(Math.PI / 2), M.brass, d, 0, 0.13, 0);
  const p = parts['duct' + i] = { on: 1, set: v => { d.position.y = 1.85 - v * 0.62; } }; d.userData.click = () => { p.t = p.t ? 0 : 1; sound.click(); };
  return { p, puffs: steam(g, x, TY + 0.06, 0, 8, i ? 0.2 : 0.24, 0.42) }; });

g.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.alphaTest) o.castShadow = o.receiveShadow = true; });
let time = 0;
function tick(dt) { time += dt; const gv = parts.grill.v, pv = parts.pot.v;
  coals.emissiveIntensity = gv * (1.6 + 0.4 * Math.sin(time * 5) + 0.2 * Math.sin(time * 13)); smokes[0].puffs(dt, gv); smokes[1].puffs(dt, pv * 0.8);
  for (const b of bits) b.m.position.y = b.y + pv * 0.004 * Math.sin(time * 6 + b.k);
  for (const b of bubbles) { const ph = (time * b.s + b.k) % 1; b.m.visible = pv > 0.1; b.m.position.y = BY - 0.006 + ph * 0.012; b.m.scale.setScalar(pv * (0.4 + ph)); } }
return { parts, tick };
  } });
