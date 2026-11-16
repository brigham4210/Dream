/* The walk-in closet: a small room fitted on three sides, with a bench and a rug in the middle.
   buildCloset({ THREE, scene, renderer }) builds it around x = 0 (y up, +z out through the doorway, metres) and returns the rails clothes hang from.
   Each rail is { groups, a, b, yaw, fan }: the groups of clothes.js it holds, its two ends, which way its wall faces (rotation about y),
   and how far a garment is turned on it so its front shows from the doorway.
   Walls face inward only, so a wall between the camera and the room simply disappears. */
window.buildCloset = function ({ THREE, scene, renderer }) {
  const HX = 1.75, ZB = -1.35, ZS = 1.35, ZF = 3.4, RH = 2.7;                 // room: half width, back wall, where the fittings end, front wall, ceiling
  const D = 0.64, H = 2.45, T = 0.022, PLINTH = 0.08, RAIL_HI = 2.12, RAIL_LO = 1.1, SHELF = 2.24, CHEST = 0.74;
  const room = new THREE.Group(); scene.add(room);
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };
  const std = (color, roughness = 0.7, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const glow = (r, g, b) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });
  let seed = 5; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;

  /* room: plaster walls washed from a cove at the top, an oak floor, a wool rug */
  const ZC = (ZB + ZF) / 2, DZ = ZF - ZB;
  const wallMat = std(0xffffff, 0.94, 0, { emissive: 0xffffff, emissiveIntensity: 0.2, map: tex(8, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.1, '#ece9e3'); gr.addColorStop(0.7, '#dedad3'); gr.addColorStop(1, '#bcb8b0'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }) });
  wallMat.emissiveMap = wallMat.map;
  const skirt = std(0xf4f2ee, 0.6);
  const wall = (w, x, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, RH), wallMat); m.position.set(x, RH / 2, z); m.rotation.y = ry; m.receiveShadow = true; room.add(m);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.1), skirt); s.position.set(0, -RH / 2 + 0.05, 0.004); m.add(s);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.035), glow(2.2, 2.2, 2.1)); c.position.set(0, RH / 2 - 0.02, 0.004); m.add(c); };
  wall(2 * HX, 0, ZB, 0); wall(2 * HX, 0, ZF, Math.PI); wall(DZ, -HX, ZC, Math.PI / 2); wall(DZ, HX, ZC, -Math.PI / 2);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(2 * HX, DZ), std(0xf4f4f2, 1, 0, { emissive: 0xffffff, emissiveIntensity: 0.5 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, RH, ZC); room.add(ceil);
  for (const z of [-0.2, 1.2]) for (const x of [-0.45, 0.45]) { const p = new THREE.Mesh(new THREE.CircleGeometry(0.07, 32), glow(3.2, 3.1, 2.9)); p.rotation.x = Math.PI / 2; p.position.set(x, RH - 0.01, z); room.add(p); }

  const floorTex = tex(1024, 1024, (g, w, h) => {
    const rows = 8, rh = h / rows;
    for (let r = 0; r < rows; r++) { const off = rnd() * w; for (let k = 0; k < 2; k++) {
      const x = (off + k * w / 2) % w, l = 34 + rnd() * 9; g.fillStyle = `hsl(${30 + rnd() * 5}, ${30 + rnd() * 8}%, ${l + 28}%)`;
      for (const ox of [-w, 0]) g.fillRect(x + ox, r * rh, w / 2, rh);
      for (let i = 0; i < 46; i++) { g.fillStyle = `rgba(90,60,30,${0.03 + rnd() * 0.07})`; const gx = x + rnd() * w / 2, gy = r * rh + rnd() * rh, gl = 60 + rnd() * 240; for (const ox of [-w, 0, w]) g.fillRect(gx + ox, gy, Math.min(gl, x + w / 2 - gx), 1.5); }
      g.fillStyle = 'rgba(40,25,10,.35)'; for (const ox of [-w, 0]) g.fillRect(x + ox, r * rh, 2, rh); }
      g.fillStyle = 'rgba(40,25,10,.3)'; g.fillRect(0, r * rh, w, 2); } });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(DZ / 2.4, 2 * HX / 1.1); floorTex.rotation = Math.PI / 2;   // boards run in from the doorway
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2 * HX, DZ), std(0xffffff, 0.48, 0, { map: floorTex })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, ZC); floor.receiveShadow = true; room.add(floor);
  const wool = (base, n) => tex(512, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '70,55,40' : '255,255,255'},${0.05 + rnd() * 0.1})`; g.beginPath(); g.arc(rnd() * w, rnd() * h, 1 + rnd() * 2.5, 0, 7); g.fill(); } });
  const soft = (map, rx, ry) => { map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(rx, ry); return new THREE.MeshPhysicalMaterial({ map, roughness: 1, sheen: 1, sheenRoughness: 0.5, sheenColor: 0xffffff }); };
  const rbox = (w, h, d, r) => { const s = new THREE.Shape(), x = -w / 2, z = -d / 2;
    s.moveTo(x + r, z); s.lineTo(x + w - r, z); s.quadraticCurveTo(x + w, z, x + w, z + r); s.lineTo(x + w, z + d - r); s.quadraticCurveTo(x + w, z + d, x + w - r, z + d);
    s.lineTo(x + r, z + d); s.quadraticCurveTo(x, z + d, x, z + d - r); s.lineTo(x, z + r); s.quadraticCurveTo(x, z, x + r, z);
    const b = Math.min(h / 2, r * 0.6); return new THREE.ExtrudeGeometry(s, { depth: h - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelOffset: -b, bevelSegments: 6, curveSegments: 10 }).rotateX(-Math.PI / 2).translate(0, b, 0); };
  { const rug = new THREE.Mesh(rbox(1.5, 0.016, 2.1, 0.06), soft(wool('#b9ad9b', 9000), 3, 4)); rug.position.set(0, 0, 0.55); rug.receiveShadow = true; room.add(rug);
    // a cushioned bench to sit on
    const seat = new THREE.Mesh(rbox(1.0, 0.13, 0.4, 0.07), soft(wool('#e6dfd2', 14000), 3, 1.2)); seat.position.set(0, 0.3, -0.05); seat.castShadow = seat.receiveShadow = true; room.add(seat);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.035, 0.32), std(0x9a7a56, 0.5)); base.position.set(0, 0.285, -0.05); base.castShadow = true; room.add(base);
    for (const x of [-0.4, 0.4]) for (const z of [-0.17, 0.07]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.011, 0.27, 12), std(0x9a7a56, 0.5)); leg.position.set(x, 0.135, z); leg.castShadow = true; room.add(leg); } }

  /* fittings: one open unit on each of three walls. A unit is built in its own frame: x along the wall, z from the wall (0) out into the room (D). */
  const frame = std(0xf0eee9, 0.62), lining = std(0x857c72, 0.9), chrome = std(0xe6e8ea, 0.16, 1), black = std(0x1c1c1e, 0.45, 0.3), inner = std(0xd9d6cf, 0.8);
  const rails = [];
  function unit(len, x, z, yaw, fit, open = 0) {   // open: -1 or 1 leaves that end without a side panel, so the rail shows from the doorway
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = yaw; room.add(g);
    const box = (x0, x1, y0, y1, z0, z1, mat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    const X0 = -len / 2, X1 = len / 2;
    if (open >= 0) box(X0, X0 + T, 0, H, 0, D, frame); if (open <= 0) box(X1 - T, X1, 0, H, 0, D, frame);
    box(X0 + T, X1 - T, H - T, H, 0, D, frame); box(X0 + T, X1 - T, PLINTH, PLINTH + T, 0, D, frame);
    box(X0 + T, X1 - T, 0, PLINTH, D - 0.05, D - 0.032, frame); box(X0 + T, X1 - T, PLINTH, H - T, 0, 0.008, lining);
    const api = { X0: X0 + T, X1: X1 - T, box,
      divider: x => box(x - T / 2, x + T / 2, PLINTH + T, H - T, 0.008, D, frame),
      bay(x0, x1) {   // top shelf with a warm strip of light under it
        box(x0, x1, SHELF, SHELF + T, 0.008, D - 0.01, frame);
        const s = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 - 0.06, 0.006, 0.02), glow(3.2, 2.8, 2.2)); s.position.set((x0 + x1) / 2, SHELF - 0.004, D - 0.07); g.add(s);
        const l = new THREE.PointLight(0xffe2bd, 0.8, 3, 1.6); l.position.set((x0 + x1) / 2, SHELF - 0.1, D - 0.02); g.add(l); },
      rail(x0, x1, y, groups, h0, h1, fan) {   // a chrome rail; clothes hang between h0 and h1 along it
        const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0125, 0.0125, x1 - x0, 24).rotateZ(Math.PI / 2), chrome); m.position.set((x0 + x1) / 2, y, D / 2); m.castShadow = true; g.add(m);
        for (const e of [x0 + 0.006, x1 - 0.006]) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.012, 24).rotateZ(Math.PI / 2), chrome); s.position.set(e, y, D / 2); g.add(s); }
        g.updateMatrixWorld(true);
        rails.push({ groups, yaw, fan, a: g.localToWorld(new THREE.Vector3(h0, y, D / 2)), b: g.localToWorld(new THREE.Vector3(h1, y, D / 2)) }); },
      chest(x0, x1, n = 3) {   // drawers
        const y0 = PLINTH + T, dh = (CHEST - T - y0) / n;
        box(x0, x1, y0, CHEST - T, 0.008, D - 0.034, inner); box(x0, x1, CHEST - T, CHEST, 0.008, D - 0.01, frame);
        for (let i = 0; i < n; i++) { const y = y0 + i * dh; box(x0 + 0.004, x1 - 0.004, y + 0.003, y + dh - 0.003, D - 0.034, D - 0.014, frame);
          for (const c of x1 - x0 > 1.4 ? [x0 + (x1 - x0) * 0.25, x0 + (x1 - x0) * 0.75] : [(x0 + x1) / 2]) box(c - 0.09, c + 0.09, y + dh - 0.05, y + dh - 0.042, D - 0.014, D + 0.006, black); } },
      shelf: (x0, x1, y) => box(x0, x1, y, y + T, 0.008, D - 0.01, frame) };
    fit(api); return g;
  }
  const BW = 2 * (HX - D), SL = ZS - (ZB + D), SZ = (ZS + ZB + D) / 2, FAN = 0.95;
  // back wall: T-shirts over knits on the left, shirts over drawers on the right
  unit(BW, 0, ZB, 0, u => { u.divider(0); u.bay(u.X0, -T / 2); u.bay(T / 2, u.X1);
    u.rail(u.X0, -T / 2, RAIL_HI, ['T-shirts'], -0.84, -0.3, FAN); u.rail(u.X0, -T / 2, RAIL_LO, ['Knits & sweats'], -0.84, -0.3, FAN);
    u.rail(T / 2, u.X1, RAIL_HI, ['Shirts'], 0.36, 0.8, -FAN); u.chest(T / 2, u.X1); u.shelf(T / 2, u.X1, 1.13); });
  // left wall: jackets and the coat. Right wall: trousers. Both over drawers.
  unit(SL, -HX, SZ, Math.PI / 2, u => { u.bay(u.X0, u.X1); u.rail(u.X0, u.X1, RAIL_HI, ['Jackets'], 0.55, -0.62, -1.05); u.chest(u.X0, u.X1); }, -1);
  unit(SL, HX, SZ, -Math.PI / 2, u => { u.bay(u.X0, u.X1); u.rail(u.X0, u.X1, RAIL_HI, ['Trousers'], -0.5, 0.5, 1.05); u.chest(u.X0, u.X1); }, 1);
  for (const s of [1, -1]) { const m = new THREE.Mesh(new THREE.BoxGeometry(D, H, D), frame); m.position.set(s * (HX - D / 2), H / 2, ZB + D / 2); room.add(m); }   // the blind corners

  return { room, rails };
};
