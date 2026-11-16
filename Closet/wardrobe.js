/* The wardrobe and the room it stands in.
   buildCloset({ THREE, scene, renderer }) adds an open wardrobe centred on x = 0 with its back against the wall (y up, +z out into the room, metres)
   and returns the rails clothes hang from: { top, low, long }, each { x0, x1, y, fan } where fan is how far a garment is turned on the rail.
   Walls face inward only, so a wall between the camera and the wardrobe simply disappears. */
window.buildCloset = function ({ THREE, scene, renderer }) {
  const W = 2.55, D = 0.72, H = 2.45, T = 0.022, DIV = 0.14, PLINTH = 0.08, RAIL_HI = 2.12, RAIL_LO = 1.1, SHELF = 2.24, CHEST = 0.74, FAN = 1.05;
  const room = new THREE.Group(); scene.add(room);
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };
  const std = (color, roughness = 0.7, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const glow = (r, g, b) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });

  /* room: plaster walls washed from a cove at the top, an oak floor */
  const RW = 4.4, ZB = -D / 2 - 0.012, ZF = 7.6, RH = 2.95, ZC = (ZB + ZF) / 2, DZ = ZF - ZB;
  const wallMat = std(0xffffff, 0.94, 0, { emissive: 0xffffff, emissiveIntensity: 0.2, map: tex(8, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.1, '#ece9e3'); gr.addColorStop(0.7, '#dedad3'); gr.addColorStop(1, '#bcb8b0'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }) });
  wallMat.emissiveMap = wallMat.map;
  const skirt = std(0xf4f2ee, 0.6);
  const wall = (w, x, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, RH), wallMat); m.position.set(x, RH / 2, z); m.rotation.y = ry; m.receiveShadow = true; room.add(m);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.1), skirt); s.position.set(0, -RH / 2 + 0.05, 0.004); m.add(s);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.035), glow(2.2, 2.2, 2.1)); c.position.set(0, RH / 2 - 0.02, 0.004); m.add(c); };
  wall(2 * RW, 0, ZB, 0); wall(2 * RW, 0, ZF, Math.PI); wall(DZ, -RW, ZC, Math.PI / 2); wall(DZ, RW, ZC, -Math.PI / 2);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(2 * RW, DZ), std(0xf4f4f2, 1, 0, { emissive: 0xffffff, emissiveIntensity: 0.5 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, RH, ZC); room.add(ceil);
  for (const z of [1.3, 3.6]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.7), glow(3, 3, 2.9)); p.rotation.x = Math.PI / 2; p.position.set(0, RH - 0.012, z); room.add(p); }

  let seed = 5; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const floorTex = tex(1024, 1024, (g, w, h) => {
    const rows = 8, rh = h / rows;
    for (let r = 0; r < rows; r++) { const off = rnd() * w; for (let k = 0; k < 2; k++) {
      const x = (off + k * w / 2) % w, l = 34 + rnd() * 9; g.fillStyle = `hsl(${30 + rnd() * 5}, ${30 + rnd() * 8}%, ${l + 28}%)`;
      for (const ox of [-w, 0]) g.fillRect(x + ox, r * rh, w / 2, rh);
      for (let i = 0; i < 46; i++) { g.fillStyle = `rgba(90,60,30,${0.03 + rnd() * 0.07})`; const gx = x + rnd() * w / 2, gy = r * rh + rnd() * rh, gl = 60 + rnd() * 240; for (const ox of [-w, 0, w]) g.fillRect(gx + ox, gy, Math.min(gl, x + w / 2 - gx), 1.5); }
      g.fillStyle = 'rgba(40,25,10,.35)'; for (const ox of [-w, 0]) g.fillRect(x + ox, r * rh, 2, rh); }
      g.fillStyle = 'rgba(40,25,10,.3)'; g.fillRect(0, r * rh, w, 2); } });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(2 * RW / 2.4, DZ / 1.1);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2 * RW, DZ), std(0xffffff, 0.48, 0, { map: floorTex })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, ZC); floor.receiveShadow = true; room.add(floor);

  /* wardrobe: an open carcass in two bays. Left: two rails, one above the other. Right: one high rail for long things, over a chest of drawers. */
  const frame = std(0xf0eee9, 0.62), lining = std(0x857c72, 0.9), chrome = std(0xe6e8ea, 0.16, 1), black = std(0x1c1c1e, 0.45, 0.3);
  const unit = new THREE.Group(); room.add(unit);
  const box = (x0, x1, y0, y1, z0, z1, mat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.castShadow = m.receiveShadow = true; unit.add(m); return m; };
  const X0 = -W / 2, X1 = W / 2, Z0 = -D / 2, Z1 = D / 2;
  box(X0, X0 + T, 0, H, Z0, Z1, frame); box(X1 - T, X1, 0, H, Z0, Z1, frame);                      // sides
  box(X0 + T, X1 - T, H - T, H, Z0, Z1, frame); box(X0 + T, X1 - T, PLINTH, PLINTH + T, Z0, Z1, frame);   // top, floor
  box(X0 + T, X1 - T, 0, PLINTH, Z1 - 0.05, Z1 - 0.032, frame);                                    // plinth
  box(X0 + T, X1 - T, PLINTH, H - T, Z0, Z0 + 0.008, lining);                                      // back
  box(DIV, DIV + T, PLINTH + T, H - T, Z0 + 0.008, Z1, frame);                                     // divider
  box(X0 + T, DIV, SHELF, SHELF + T, Z0 + 0.008, Z1 - 0.01, frame); box(DIV + T, X1 - T, SHELF, SHELF + T, Z0 + 0.008, Z1 - 0.01, frame);   // top shelf
  const rail = (x0, x1, y) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0125, 0.0125, x1 - x0, 24).rotateZ(Math.PI / 2), chrome); m.position.set((x0 + x1) / 2, y, 0); m.castShadow = true; unit.add(m);
    for (const x of [x0 + 0.006, x1 - 0.006]) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.012, 24).rotateZ(Math.PI / 2), chrome); s.position.set(x, y, 0); unit.add(s); } };
  rail(X0 + T, DIV, RAIL_HI); rail(X0 + T, DIV, RAIL_LO); rail(DIV + T, X1 - T, RAIL_HI);
  { // chest of drawers under the long rail
    const a = DIV + T, b = X1 - T, y0 = PLINTH + T, n = 3, dh = (CHEST - T - y0) / n;
    box(a, b, y0, CHEST - T, Z0 + 0.008, Z1 - 0.034, std(0xd9d6cf, 0.8)); box(a, b, CHEST - T, CHEST, Z0 + 0.008, Z1 - 0.01, frame);
    for (let i = 0; i < n; i++) { const y = y0 + i * dh; box(a + 0.004, b - 0.004, y + 0.003, y + dh - 0.003, Z1 - 0.034, Z1 - 0.014, frame);
      box((a + b) / 2 - 0.09, (a + b) / 2 + 0.09, y + dh - 0.05, y + dh - 0.042, Z1 - 0.014, Z1 + 0.006, black); }
  }
  // a warm strip of light under the top shelf of each bay
  for (const [a, b] of [[X0 + T, DIV], [DIV + T, X1 - T]]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(b - a - 0.06, 0.006, 0.02), glow(3.2, 2.8, 2.2)); s.position.set((a + b) / 2, SHELF - 0.004, Z1 - 0.07); unit.add(s);
    const l = new THREE.PointLight(0xffe2bd, 1.1, 3.2, 1.6); l.position.set((a + b) / 2, SHELF - 0.08, Z1 - 0.02); unit.add(l);
  }

  return { room, unit, size: { W, D, H }, rails: {
    top: { x0: -1.0, x1: -0.1, y: RAIL_HI, fan: FAN },
    low: { x0: -1.0, x1: -0.1, y: RAIL_LO, fan: FAN },
    long: { x0: 0.47, x1: 1.0, y: RAIL_HI, fan: -FAN } } };
};
