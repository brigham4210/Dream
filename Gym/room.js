/* The workout room itself: plaster walls, a sprung maple floor, and a back wall of mirrors that really reflect the room.
   buildGymRoom({ THREE, scene, renderer, Reflector }) builds it around x = 0 (y up, +z towards you, metres).
   Walls face inward only, so a wall between the camera and the room simply disappears. */
window.buildGymRoom = function ({ THREE, scene, renderer, Reflector }) {
  const HX = 3.7, ZB = -2.8, ZF = 4.4, RH = 2.9, ZC = (ZB + ZF) / 2, DZ = ZF - ZB;
  const room = new THREE.Group(); scene.add(room);
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };
  const std = (color, roughness = 0.7, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const glow = (r, g, b) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });
  let seed = 31; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;

  const wallMat = std(0xffffff, 0.94, 0, { emissive: 0xffffff, emissiveIntensity: 0.16, map: tex(8, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.1, '#e8e8e6'); gr.addColorStop(0.7, '#d8d9d8'); gr.addColorStop(1, '#b4b6b6'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }) });
  wallMat.emissiveMap = wallMat.map;
  const skirt = std(0xf4f2ee, 0.6);
  const wall = (w, x, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, RH), wallMat); m.position.set(x, RH / 2, z); m.rotation.y = ry; m.receiveShadow = true; room.add(m);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.1), skirt); s.position.set(0, -RH / 2 + 0.05, 0.004); m.add(s);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.035), glow(2.1, 2.1, 2)); c.position.set(0, RH / 2 - 0.02, 0.004); m.add(c); };
  wall(2 * HX, 0, ZB, 0); wall(2 * HX, 0, ZF, Math.PI); wall(DZ, -HX, ZC, Math.PI / 2); wall(DZ, HX, ZC, -Math.PI / 2);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(2 * HX, DZ), std(0xf4f4f2, 1, 0, { emissive: 0xffffff, emissiveIntensity: 0.45 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, RH, ZC); room.add(ceil);
  for (const z of [-1.6, 0.4, 2.4]) for (const x of [-2.4, -0.8, 0.8, 2.4]) { const p = new THREE.Mesh(new THREE.CircleGeometry(0.07, 32), glow(3.2, 3.1, 2.9)); p.rotation.x = Math.PI / 2; p.position.set(x, RH - 0.01, z); room.add(p); }

  // pale maple strips, the floor of a dance studio
  const floorTex = tex(1024, 1024, (g, w, h) => {
    const rows = 10, rh = h / rows;
    for (let r = 0; r < rows; r++) { const off = rnd() * w; for (let k = 0; k < 2; k++) {
      const x = (off + k * w / 2) % w; g.fillStyle = `hsl(${34 + rnd() * 5}, ${26 + rnd() * 8}%, ${70 + rnd() * 7}%)`;
      for (const ox of [-w, 0]) g.fillRect(x + ox, r * rh, w / 2, rh);
      for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(110,75,35,${0.03 + rnd() * 0.05})`; const gx = x + rnd() * w / 2, gy = r * rh + rnd() * rh, gl = 60 + rnd() * 240; for (const ox of [-w, 0, w]) g.fillRect(gx + ox, gy, Math.min(gl, x + w / 2 - gx), 1.5); }
      g.fillStyle = 'rgba(60,38,15,.28)'; for (const ox of [-w, 0]) g.fillRect(x + ox, r * rh, 2, rh); }
      g.fillStyle = 'rgba(60,38,15,.22)'; g.fillRect(0, r * rh, w, 2); } });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(2 * HX / 2.4, DZ / 0.9);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2 * HX, DZ), std(0xffffff, 0.3, 0, { map: floorTex })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, ZC); floor.receiveShadow = true; room.add(floor);

  // the wall of mirrors: one reflecting sheet from wall to wall, cut into six panes by thin joints, in a slim aluminium frame
  const MW = 2 * HX - 0.12, MH = 2.36, MY = 0.13, PANES = 6, buf = new THREE.Vector2();
  const texSize = () => { renderer.getDrawingBufferSize(buf); const k = Math.min(1, 2048 / Math.max(1, buf.x)); return [Math.max(2, Math.round(buf.x * k)), Math.max(2, Math.round(buf.y * k))]; };
  const [tw, th] = texSize();
  const mirror = new Reflector(new THREE.PlaneGeometry(MW, MH), { color: 0x7b7f7f, textureWidth: tw, textureHeight: th, clipBias: 0.003, multisample: 4 });
  mirror.position.set(0, MY + MH / 2, ZB + 0.012); room.add(mirror);
  const alu = std(0xc9ccd0, 0.35, 1), joint = std(0x3a3d40, 0.5);
  const strip = (w, h, x, y, mat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), mat); m.position.set(x, y, ZB + 0.014); room.add(m); };
  for (let i = 1; i < PANES; i++) strip(0.004, MH, -MW / 2 + i * MW / PANES, MY + MH / 2, joint);
  strip(MW + 0.04, 0.02, 0, MY - 0.01, alu); strip(MW + 0.04, 0.02, 0, MY + MH + 0.01, alu);
  for (const s of [-1, 1]) strip(0.02, MH, s * (MW / 2 + 0.01), MY + MH / 2, alu);

  return { room, RH, HX, ZB, resize() { const [w, h] = texSize(); mirror.getRenderTarget().setSize(w, h); } };
};
