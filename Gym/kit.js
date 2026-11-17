/* Shared bits for the workout room: the materials everything is made of (black steel, chrome, rubber, beech, the plate colours)
   and a few small builders (boxes, rods, tubes between two points, a rubber floor mat, a rep that goes up and comes back).
   gymKit(THREE) makes them once. */
window.gymKit = (() => { let K = null; return THREE => K || (K = make(THREE));
function make(THREE) {
  const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const rand = seed => () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const rnd = rand(11), Y = new THREE.Vector3(0, 1, 0);

  // mk / box / cyl (upright) / rod (lying along x) / tube (between two points) / grp, all adding to a given group unless told otherwise
  const tools = g => {
    const mk = (geo, mat, parent = g, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
    const box = (x0, x1, y0, y1, z0, z1, mat, parent = g) => mk(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat, parent, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    const cyl = (r, h, mat, x, y, z, parent = g, seg = 24) => mk(new THREE.CylinderGeometry(r, r, h, seg), mat, parent, x, y, z);
    const rod = (r, len, mat, x, y, z, parent = g, seg = 24) => mk(new THREE.CylinderGeometry(r, r, len, seg).rotateZ(Math.PI / 2), mat, parent, x, y, z);
    const tube = (a, b, r, mat, parent = g, seg = 12) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), m = mk(new THREE.CylinderGeometry(r, r, A.distanceTo(B), seg), mat, parent);
      m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(Y, B.clone().sub(A).normalize()); return m; };
    const grp = (x = 0, y = 0, z = 0, parent = g) => { const o = new THREE.Group(); o.position.set(x, y, z); parent.add(o); return o; };
    return { mk, box, cyl, rod, tube, grp };
  };

  /* -------------------------------------------------------------- materials */
  const beech = tex(256, 512, (x, w, h) => { x.fillStyle = '#d9b98c'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) { x.strokeStyle = `rgba(130,85,40,${0.05 + rnd() * 0.12})`; x.lineWidth = 0.6 + rnd() * 1.6; x.beginPath(); const x0 = rnd() * w;
      x.moveTo(x0, 0); x.bezierCurveTo(x0 + 10 - rnd() * 20, 170, x0 + 12 - rnd() * 24, 340, x0 + 8 - rnd() * 16, h); x.stroke(); } });
  const flecks = tex(512, 512, (g, w, h) => { g.fillStyle = '#1d1d1f'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { g.fillStyle = rnd() < 0.7 ? `rgba(150,155,165,${0.25 + rnd() * 0.5})` : `rgba(60,110,190,${0.3 + rnd() * 0.5})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2.4, 1 + rnd() * 2.4); } });
  flecks.wrapS = flecks.wrapT = THREE.RepeatWrapping;
  const M = {
    frame: std(0x18191b, 0.5, 0.45),          // powder-coated steel
    chrome: std(0xe2e4e7, 0.16, 1),
    steel: std(0xaeb1b5, 0.36, 1),
    iron: std(0x1c1c1e, 0.72, 0.35),
    rubber: std(0x131314, 0.88),
    vinyl: std(0x17171a, 0.42),
    beech: std(0xffffff, 0.42, 0, { map: beech }),
    red: std(0xc4261d, 0.6), blue: std(0x1f55b5, 0.6), yellow: std(0xe0b21c, 0.6), green: std(0x2f8a45, 0.6), white: std(0xe9e7e2, 0.6),
    unseen: new THREE.MeshBasicMaterial({ visible: false }),
  };

  /* --------------------------------------------------------------- builders */
  // a speckled rubber mat lying on the floor between x0..x1 and z0..z1
  const mat = (parent, x0, x1, z0, z1) => { const t = flecks.clone(); t.needsUpdate = true; t.repeat.set((x1 - x0) / 0.9, (z1 - z0) / 0.9);
    const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.014, z1 - z0), std(0xffffff, 0.92, 0, { map: t })); m.position.set((x0 + x1) / 2, 0.007, (z0 + z1) / 2); m.receiveShadow = true; parent.add(m); return m; };
  // everything in a group throws and takes shadows, except the unseen click targets
  const shadows = g => g.traverse(o => { if (o.isMesh && o.material.visible) o.castShadow = o.receiveShadow = true; });
  // reps: add(secs, apply, done) returns a function that starts one rep; apply(k) is called with k going 0 → 1 → 0, done() when it is back down
  const reps = () => { const list = [];
    const add = (secs, apply, done) => { const r = { t: -1 }; list.push(r); r.step = dt => { r.t += dt / secs; if (r.t >= 1) { r.t = -1; apply(0); if (done) done(); } else apply(0.5 - 0.5 * Math.cos(2 * Math.PI * r.t)); };
      return () => { if (r.t < 0) r.t = 0; }; };
    const tick = dt => { for (const r of list) if (r.t >= 0) r.step(dt); };
    return { add, tick }; };

  return { std, tex, rand, tools, M, mat, shadows, reps };
}
})();
