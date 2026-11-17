/* Shared bits for the kitchen: the materials everything is made of (green paint, marble, oak, brass, steel) and a few
   small builders (a shaker cabinet front, a handle, a stone slab, a wisp of steam). kitchenKit(THREE) makes them once. */
window.kitchenKit = (() => { let K = null; return THREE => K || (K = make(THREE));
function make(THREE) {
  const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const rand = seed => () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const rnd = rand(7);

  // mk / box / cyl / grp that add to a given group unless told otherwise
  const tools = g => {
    const mk = (geo, mat, parent = g, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
    const box = (x0, x1, y0, y1, z0, z1, mat, parent = g) => mk(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat, parent, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    const cyl = (r, h, mat, x, y, z, parent = g, seg = 24) => mk(new THREE.CylinderGeometry(r, r, h, seg), mat, parent, x, y, z);
    const grp = (x = 0, y = 0, z = 0, parent = g) => { const o = new THREE.Group(); o.position.set(x, y, z); parent.add(o); return o; };
    return { mk, box, cyl, grp };
  };

  /* -------------------------------------------------------------- materials */
  const marbleTex = tex(1024, 1024, (g, w, h) => { g.fillStyle = '#f3f1ed'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { const x = rnd() * w, y = rnd() * h, r = 80 + rnd() * 220, gr = g.createRadialGradient(x, y, 0, x, y, r), a = 0.03 + rnd() * 0.05;
      gr.addColorStop(0, `rgba(120,125,135,${a})`); gr.addColorStop(1, 'rgba(120,125,135,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    for (let i = 0; i < 30; i++) { let x = rnd() * w, y = rnd() * h, a = 0.4 + rnd() * 0.9; g.strokeStyle = `rgba(95,100,112,${0.1 + rnd() * 0.3})`; g.lineWidth = 0.6 + rnd() * 2.6; g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < 40; k++) { a += (rnd() - 0.5) * 0.5; x += Math.cos(a) * 22; y += Math.sin(a) * 22; g.lineTo(x, y); } g.stroke(); } });
  marbleTex.wrapS = marbleTex.wrapT = THREE.MirroredRepeatWrapping; marbleTex.repeat.set(1 / 2.2, 1 / 2.2);
  const wood = (base, dark, n) => tex(256, 512, (x, w, h) => { x.fillStyle = base; x.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) { x.strokeStyle = `rgba(${dark},${0.05 + rnd() * 0.12})`; x.lineWidth = 0.6 + rnd() * 1.6; x.beginPath(); const x0 = rnd() * w;
      x.moveTo(x0, 0); x.bezierCurveTo(x0 + 10 - rnd() * 20, 170, x0 + 12 - rnd() * 24, 340, x0 + 8 - rnd() * 16, h); x.stroke(); } });
  const M = {
    paint: std(0xffffff, 0.5, 0, { map: wood('#e6cfa6', '150,105,55', 50) }),   // the cabinets: light natural wood
    marble: std(0xffffff, 0.22, 0, { map: marbleTex }),
    oak: std(0xffffff, 0.55, 0, { map: wood('#cfa878', '120,75,35', 70) }),
    brass: std(0xc9a252, 0.28, 1),
    steel: std(0xd3d6d9, 0.3, 1),
    iron: std(0x141415, 0.7, 0.3),
    black: std(0x0e0e0f, 0.5, 0.1),
    ceramic: std(0xf4f0e8, 0.3, 0, { side: THREE.DoubleSide }),
    terracotta: std(0xb5653f, 0.85),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xdcecee, roughness: 0.03, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false }),
  };

  /* --------------------------------------------------------------- builders */
  // a cabinet front, centred on (x, y, z) and facing +z: a framed (shaker) panel, or a plain slab when it is too low for a frame
  const front = (w, h, mat, parent, x = 0, y = 0, z = 0) => { const f = new THREE.Group(); f.position.set(x, y, z); parent.add(f); const { box } = tools(f), s = 0.06;
    if (h < 0.2) { box(-w / 2, w / 2, -h / 2, h / 2, -0.008, 0.014, mat); return f; }
    box(-w / 2, w / 2, -h / 2, h / 2, -0.008, 0.008, mat);
    for (const k of [-1, 1]) { box(k * w / 2 - (k > 0 ? s : 0), k * w / 2 + (k < 0 ? s : 0), -h / 2, h / 2, 0.008, 0.014, mat);
      box(-w / 2 + s, w / 2 - s, k * h / 2 - (k > 0 ? s : 0), k * h / 2 + (k < 0 ? s : 0), 0.008, 0.014, mat); }
    return f; };
  // a bar handle on two posts, standing off the surface at z; a round knob
  const pull = (parent, x, y, z, len, upright = false, mat = M.brass) => { const p = new THREE.Group(); p.position.set(x, y, z); if (!upright) p.rotation.z = Math.PI / 2; parent.add(p); const { cyl } = tools(p);
    cyl(0.006, len, mat, 0, 0, 0.028, p, 12); for (const k of [-1, 1]) cyl(0.004, 0.028, mat, 0, k * (len / 2 - 0.02), 0.014, p, 8).rotation.x = Math.PI / 2; return p; };
  const knob = (parent, x, y, z, mat = M.brass) => { const { mk, cyl } = tools(parent); cyl(0.005, 0.02, mat, x, y, z + 0.01, parent, 8).rotation.x = Math.PI / 2; return mk(new THREE.SphereGeometry(0.014, 16, 12), mat, parent, x, y, z + 0.026); };
  // a slab of stone lying flat, with softened edges and (optionally) a rectangular hole [x0, x1, z0, z1] cut for a sink
  const slab = (x0, x1, z0, z1, y0, y1, mat, hole) => { const s = new THREE.Shape(); s.moveTo(x0, -z1); s.lineTo(x1, -z1); s.lineTo(x1, -z0); s.lineTo(x0, -z0); s.closePath();
    if (hole) { const [a, b, c, d] = hole, p = new THREE.Path(); p.moveTo(a, -d); p.lineTo(a, -c); p.lineTo(b, -c); p.lineTo(b, -d); p.closePath(); s.holes.push(p); }
    const geo = new THREE.ExtrudeGeometry(s, { depth: y1 - y0 - 0.006, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 2 }); geo.rotateX(-Math.PI / 2); geo.translate(0, y0 + 0.003, 0);
    return new THREE.Mesh(geo, mat); };
  // steam: a few soft puffs that rise and fade; returns tick(dt, amount) with amount 0..1
  const puff = tex(64, 64, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
  const steam = (parent, x, y, z, n = 6, size = 0.14, rise = 0.4) => { const ps = [];
    for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puff, transparent: true, opacity: 0, depthWrite: false })); s.userData.through = true; s.visible = false; parent.add(s); ps.push({ s, p: i / n, k: i * 2.4 }); }
    return (dt, amount) => { for (const q of ps) { q.p = (q.p + dt * 0.32) % 1; q.s.visible = amount > 0.01; if (!q.s.visible) continue;
      q.s.position.set(x + Math.sin(q.p * 7 + q.k) * 0.025, y + q.p * rise, z + Math.cos(q.p * 5 + q.k) * 0.02); q.s.scale.setScalar(size * (0.35 + q.p)); q.s.material.opacity = amount * 0.4 * Math.sin(q.p * Math.PI); } }; };
  // a pot of herbs: a terracotta pot with a clump of leaves
  const herb = (parent, x, y, z, r = rnd, color = 0x4f7a3a, size = 1) => { const p = new THREE.Group(); p.position.set(x, y, z); p.scale.setScalar(size); parent.add(p); const { mk } = tools(p), leaf = std(color, 0.8);
    mk(new THREE.CylinderGeometry(0.048, 0.036, 0.085, 24), M.terracotta, p, 0, 0.0425, 0); mk(new THREE.CylinderGeometry(0.051, 0.051, 0.014, 24), M.terracotta, p, 0, 0.08, 0);
    for (let i = 0; i < 16; i++) { const a = r() * 6.28, d = r() * 0.045, m = mk(new THREE.IcosahedronGeometry(0.02 + r() * 0.018, 1), leaf, p, Math.cos(a) * d, 0.1 + r() * 0.09, Math.sin(a) * d); m.scale.set(1, 0.6 + r() * 0.5, 1); }
    return p; };

  return { std, tex, rand, tools, M, front, pull, knob, slab, steam, herb };
}
})();
