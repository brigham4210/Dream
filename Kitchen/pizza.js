/* The Italian corner: a domed wood-fired pizza oven on a plastered base with a log store, a pizza in its mouth and a peel
   on the wall, beside olive oil, tinned tomatoes, parmesan, a bowl of tomatoes, basil and a braid of garlic.
   build() adds it to whatever `scene` it is given: the wall is z = 0, the front towards +z, the floor is y = 0, metres.
   Click the oven to light or put out the fire. */
(window.DREAM_KITCHEN = window.DREAM_KITCHEN || []).push({
  name: 'Pizza oven', title: 'Wood-fired pizza oven', line: 'A brick dome on a plastered base · click the oven to light the fire',
  at: [3.6, 2.3], turn: -Math.PI / 2, view: { target: [0.05, 1.05, 0.4], cam: [-0.9, 1.8, 2.3] },
  build({ THREE, scene, sound, kit, RH }) {
const { std, tex, rand, tools, M, slab, herb } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, cyl, grp } = tools(g), rnd = rand(61), parts = {}, top = RH || 2.9;
const HX = 0.9, D = 0.8, TOP = 0.95, OX = 0.38, OZ = 0.4, plaster = std(0xe9e2d4, 0.95), dark = std(0x141210, 1);
const bricks = tex(256, 128, (c, w, h) => { c.fillStyle = '#8a8378'; c.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) for (let i = -1; i < 9; i++) { c.fillStyle = `hsl(${14 + rnd() * 10}, ${42 + rnd() * 14}%, ${38 + rnd() * 12}%)`; c.fillRect(i * 32 + (r % 2) * 16 + 1.5, r * 16 + 1.5, 29, 13); } });
bricks.wrapS = bricks.wrapT = THREE.RepeatWrapping;
const brick = (rx, ry) => { const t = bricks.clone(); t.repeat.set(rx, ry); return std(0xffffff, 0.9, 0, { map: t }); };

/* ------------------------------------------------------------- base, oven */
box(-HX, HX, 0, TOP - 0.05, 0, D, plaster); g.add(slab(-HX - 0.02, HX + 0.02, 0, D + 0.05, TOP - 0.05, TOP, std(0xb9775a, 0.8)));
box(OX - 0.3, OX + 0.3, 0.12, 0.62, D - 0.3, D + 0.002, dark); for (let i = 0; i < 9; i++) { const l = cyl(0.045 + rnd() * 0.012, 0.3, std(0x8a5a34, 0.9), OX - 0.22 + (i % 5) * 0.11 + (i > 4 ? 0.055 : 0), 0.17 + (i > 4 ? 0.085 : 0), D - 0.15, g, 10); l.rotation.x = Math.PI / 2; mk(new THREE.CircleGeometry(0.04, 10), std(0xd9b98a, 0.9), l, 0, 0.151, 0).rotation.x = -Math.PI / 2; }
const dome = mk(new THREE.SphereGeometry(0.44, 48, 20, Math.PI / 2 + 0.55, Math.PI * 2 - 1.1, 0, Math.PI / 2), brick(10, 4), g, OX, TOP, OZ); dome.scale.y = 0.82;
cyl(0.075, top - TOP - 0.3, M.iron, OX, (top + TOP + 0.3) / 2, OZ - 0.12, g, 20); cyl(0.09, 0.03, M.iron, OX, TOP + 0.36, OZ - 0.12, g, 20);
// the mouth: a brick arch standing out from the dome, dark inside, the fire at the back
const AR = 0.2, arch = new THREE.Shape(); arch.moveTo(-AR - 0.07, 0); arch.lineTo(-AR - 0.07, 0.1); arch.absarc(0, 0.1, AR + 0.07, Math.PI, 0, true); arch.lineTo(AR + 0.07, 0); arch.lineTo(AR, 0); arch.lineTo(AR, 0.1); arch.absarc(0, 0.1, AR, 0, Math.PI, false); arch.lineTo(-AR, 0); arch.closePath();
mk(new THREE.ExtrudeGeometry(arch, { depth: 0.46, bevelEnabled: false }), brick(6, 6), g, OX, TOP, OZ);
const back = new THREE.Shape(); back.moveTo(-AR, 0); back.lineTo(-AR, 0.1); back.absarc(0, 0.1, AR, Math.PI, 0, true); back.lineTo(AR, 0); back.closePath();
const fireMat = new THREE.MeshBasicMaterial({ color: 0x0a0806 }); mk(new THREE.ShapeGeometry(back), fireMat, g, OX, TOP, OZ + 0.02);
const flameMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.8, 1.1, 0.25), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
const flames = grp(OX, TOP + 0.01, OZ + 0.06); flames.visible = false; for (let i = 0; i < 7; i++) { const f = mk(new THREE.ConeGeometry(0.03, 0.16, 8).translate(0, 0.08, 0), flameMat, flames, -0.14 + i * 0.047, 0, (i % 2) * 0.02); f.userData.through = true; f.userData.k = i * 1.7; }
for (const x of [-0.08, 0.06]) cyl(0.03, 0.2, std(0x2a1a10, 1), OX + x, TOP + 0.03, OZ + 0.1, g, 8).rotation.z = Math.PI / 2 + x;
const glow = new THREE.PointLight(0xff8a3a, 0, 2.4, 1.5); glow.position.set(OX, TOP + 0.15, OZ + 0.5); g.add(glow);
// a margherita on the hearth
{ const p = grp(OX, TOP + 0.002, OZ + 0.31); cyl(0.14, 0.012, std(0xd9a85a, 0.8), 0, 0.006, 0, p, 40); mk(new THREE.TorusGeometry(0.135, 0.012, 8, 40).rotateX(Math.PI / 2), std(0xc98a3c, 0.8), p, 0, 0.012, 0); cyl(0.122, 0.004, std(0xc8321e, 0.6), 0, 0.014, 0, p, 40);
  for (let i = 0; i < 7; i++) { const a = i * 0.9 + 0.3, r = i ? 0.07 : 0; cyl(0.026 + rnd() * 0.008, 0.004, std(0xfbf7ea, 0.5), Math.cos(a) * r, 0.017, Math.sin(a) * r, p, 16); }
  for (let i = 0; i < 5; i++) { const a = i * 1.26 + 0.9, l = mk(new THREE.CircleGeometry(0.014, 10).rotateX(-Math.PI / 2), std(0x3f8f3a, 0.7, 0, { side: THREE.DoubleSide }), p, Math.cos(a) * 0.045, 0.021, Math.sin(a) * 0.045); l.scale.set(1.5, 1, 0.8); l.rotation.y = a; } }
const hit = mk(new THREE.BoxGeometry(0.9, 0.5, 0.95), new THREE.MeshBasicMaterial({ visible: false }), g, OX, TOP + 0.25, OZ + 0.03);   // an unseen box to click
hit.userData.click = () => { const p = parts.fire; p.t = p.t ? 0 : 1; if (p.t) sound.ignite(); else sound.click(); sound.loop('fire', p.t); };
parts.fire = { set: v => { flames.visible = v > 0.02; flames.userData.v = v; glow.intensity = 1.1 * v; fireMat.color.setRGB(0.04 + 2.2 * v, 0.03 + 0.7 * v, 0.02 + 0.12 * v); } };
// the peel, hung on the wall
{ const p = grp(-0.3, 1.3, 0.02); box(-0.15, 0.15, 0, 0.34, 0, 0.012, M.oak, p); cyl(0.014, 0.75, M.oak, 0, 0.7, 0.006, p, 12); cyl(0.008, 0.03, M.brass, 0, 1.06, 0.015, p, 8).rotation.x = Math.PI / 2; }

/* --------------------------------------------------------- Italian staples */
const Y = TOP, bottle = (x, z, c, h) => { const m = std(c, 0.12, 0, { transparent: true, opacity: 0.9 }); cyl(0.032, h * 0.62, m, x, Y + h * 0.31, z); mk(new THREE.CylinderGeometry(0.012, 0.032, h * 0.2, 20), m, g, x, Y + h * 0.72, z); cyl(0.012, h * 0.14, m, x, Y + h * 0.89, z, g, 12); cyl(0.014, h * 0.05, M.brass, x, Y + h * 0.975, z, g, 12); cyl(0.0325, h * 0.26, std(0xf2ead2, 0.8), x, Y + h * 0.3, z); };
bottle(-0.78, 0.14, 0x4f6b1a, 0.32); bottle(-0.69, 0.12, 0x5d7a22, 0.28);
for (const [x, y, z] of [[-0.56, 0, 0.14], [-0.46, 0, 0.13], [-0.51, 0.112, 0.135]]) { cyl(0.042, 0.11, M.steel, x, Y + y + 0.055, z); cyl(0.0425, 0.085, std(0xb5271e, 0.7), x, Y + y + 0.055, z); cyl(0.043, 0.02, std(0xf2ead2, 0.7), x, Y + y + 0.055, z); }
{ const b = grp(-0.6, Y, 0.48); b.rotation.y = 0.3; box(-0.16, 0.16, 0, 0.02, -0.11, 0.11, M.oak, b); mk(new THREE.CylinderGeometry(0.17, 0.17, 0.09, 24, 1, false, 0, 0.75), std(0xf0dc9a, 0.8, 0, { side: THREE.DoubleSide }), b, -0.1, 0.065, -0.06); mk(new THREE.CylinderGeometry(0.172, 0.172, 0.09, 24, 1, true, 0, 0.75), std(0xc9a252, 0.8, 0, { side: THREE.DoubleSide }), b, -0.1, 0.065, -0.06);
  box(0.03, 0.05, 0.02, 0.026, -0.06, 0.08, M.steel, b); box(0.03, 0.05, 0.02, 0.04, -0.1, -0.06, M.oak, b); }
mk(new THREE.LatheGeometry([[0.04, 0], [0.08, 0.012], [0.115, 0.06]].map(p => new THREE.Vector2(...p)), 32), M.ceramic, g, -0.22, Y, 0.56); for (let i = 0; i < 8; i++) { const a = i * 0.9, r = i < 6 ? 0.055 : 0.015; mk(new THREE.SphereGeometry(0.034, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0xc8321e, roughness: 0.3, clearcoat: 0.6 }), g, -0.22 + Math.cos(a) * r, Y + 0.05 + (i < 6 ? 0 : 0.045), 0.56 + Math.sin(a) * r); }
herb(g, -0.25, Y, 0.16, rnd, 0x4f9a3a, 1.3);
for (let i = 0; i < 9; i++) { const y = 1.82 - i * 0.055; for (const k of i ? [-1, 1] : [0]) mk(new THREE.SphereGeometry(0.03, 12, 10), std(0xf1ead8, 0.7), g, -0.72 + k * 0.022, y, 0.035 + (i % 2) * 0.012).scale.set(1, 1.1, 0.9); } cyl(0.004, 0.14, std(0xc9b48a, 0.9), -0.72, 1.9, 0.03, g, 6);

g.traverse(o => { if (o.isMesh && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = o.receiveShadow = true; });
let time = 0; function tick(dt) { time += dt; if (!flames.visible) return; const v = flames.userData.v; for (const f of flames.children) f.scale.set(1, v * (0.7 + 0.35 * Math.sin(time * 9 + f.userData.k) + 0.2 * Math.sin(time * 23 + f.userData.k * 2)), 1); glow.intensity = v * (1.0 + 0.25 * Math.sin(time * 13)); }
return { parts, tick };
  } });
