/* The kitchen itself: plaster walls, a back wall of glazed white tiles, an oak floor and a wool runner between the range and the island.
   buildKitchenRoom({ THREE, scene, renderer }) builds it around x = 0 (y up, +z towards you, metres).
   Walls face inward only, so a wall between the camera and the room simply disappears. */
window.buildKitchenRoom = function ({ THREE, scene, renderer }) {
  const HX = 3.6, ZB = -2.6, ZF = 3.9, RH = 2.9, ZC = (ZB + ZF) / 2, DZ = ZF - ZB;
  const room = new THREE.Group(); scene.add(room);
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };
  const std = (color, roughness = 0.7, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const glow = (r, g, b) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });
  let seed = 23; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;

  const wallMat = std(0xffffff, 0.94, 0, { emissive: 0xffffff, emissiveIntensity: 0.16, map: tex(8, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.1, '#ece8e0'); gr.addColorStop(0.7, '#ddd8ce'); gr.addColorStop(1, '#bcb6ab'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }) });
  wallMat.emissiveMap = wallMat.map;
  // hand-made tiles: each a slightly different white, none quite flat
  const tiles = tex(1024, 1024, (g, w, h) => { const n = 16, s = w / n; g.fillStyle = '#cfcbc2'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const l = 88 + rnd() * 8, x = i * s + 1.5, y = j * s + 1.5, gr = g.createLinearGradient(x, y, x + s * (0.4 + rnd()), y + s);
      gr.addColorStop(0, `hsl(${40 + rnd() * 20}, 18%, ${l}%)`); gr.addColorStop(1, `hsl(${40 + rnd() * 20}, 14%, ${l - 3 - rnd() * 4}%)`); g.fillStyle = gr; g.fillRect(x, y, s - 3, s - 3); } });
  tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping; tiles.repeat.set(2 * HX / 1.6, RH / 1.6);
  const tileMat = std(0xffffff, 0.16, 0, { map: tiles, emissive: 0xffffff, emissiveMap: tiles, emissiveIntensity: 0.1 });
  const skirt = std(0xf4f2ee, 0.6);
  const wall = (w, x, z, ry, mat = wallMat) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, RH), mat); m.position.set(x, RH / 2, z); m.rotation.y = ry; m.receiveShadow = true; room.add(m);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.1), skirt); s.position.set(0, -RH / 2 + 0.05, 0.004); m.add(s);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.035), glow(2.1, 2.1, 2)); c.position.set(0, RH / 2 - 0.02, 0.004); m.add(c); };
  wall(2 * HX, 0, ZB, 0, tileMat); wall(2 * HX, 0, ZF, Math.PI); wall(DZ, -HX, ZC, Math.PI / 2); wall(DZ, HX, ZC, -Math.PI / 2);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(2 * HX, DZ), std(0xf4f4f2, 1, 0, { emissive: 0xffffff, emissiveIntensity: 0.45 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, RH, ZC); room.add(ceil);
  for (const z of [-1.3, 0.8, 2.8]) for (const x of [-2.4, -0.8, 0.8, 2.4]) { const p = new THREE.Mesh(new THREE.CircleGeometry(0.07, 32), glow(3.2, 3.1, 2.9)); p.rotation.x = Math.PI / 2; p.position.set(x, RH - 0.01, z); room.add(p); }

  const floorTex = tex(1024, 1024, (g, w, h) => {
    const rows = 8, rh = h / rows;
    for (let r = 0; r < rows; r++) { const off = rnd() * w; for (let k = 0; k < 2; k++) {
      const x = (off + k * w / 2) % w; g.fillStyle = `hsl(${32 + rnd() * 5}, ${22 + rnd() * 7}%, ${66 + rnd() * 8}%)`;
      for (const ox of [-w, 0]) g.fillRect(x + ox, r * rh, w / 2, rh);
      for (let i = 0; i < 46; i++) { g.fillStyle = `rgba(90,60,30,${0.03 + rnd() * 0.06})`; const gx = x + rnd() * w / 2, gy = r * rh + rnd() * rh, gl = 60 + rnd() * 240; for (const ox of [-w, 0, w]) g.fillRect(gx + ox, gy, Math.min(gl, x + w / 2 - gx), 1.5); }
      g.fillStyle = 'rgba(50,30,12,.3)'; for (const ox of [-w, 0]) g.fillRect(x + ox, r * rh, 2, rh); }
      g.fillStyle = 'rgba(50,30,12,.26)'; g.fillRect(0, r * rh, w, 2); } });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(2 * HX / 2.4, DZ / 1.1);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2 * HX, DZ), std(0xffffff, 0.36, 0, { map: floorTex })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, ZC); floor.receiveShadow = true; room.add(floor);

  // a striped wool runner in front of the range
  const wool = tex(512, 128, (g, w, h) => { g.fillStyle = '#c9bfae'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#7d8a74'; for (const x of [28, 60, w - 76, w - 44]) g.fillRect(x, 0, 16, h);
    for (let i = 0; i < 6000; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '70,55,40' : '255,255,255'},${0.05 + rnd() * 0.1})`; g.beginPath(); g.arc(rnd() * w, rnd() * h, 0.8 + rnd() * 1.6, 0, 7); g.fill(); } });
  const rug = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.012, 0.8), new THREE.MeshPhysicalMaterial({ map: wool, roughness: 1, sheen: 1, sheenRoughness: 0.5 })); rug.position.set(0.3, 0.006, -1.05); rug.receiveShadow = true; room.add(rug);

  return { room, RH };
};
