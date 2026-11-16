/* The music room itself: plaster walls, an oak floor, a slatted timber wall behind the piano and a round rug under it.
   buildMusicRoom({ THREE, scene, renderer }) builds it around x = 0 (y up, +z towards the door, metres).
   Walls face inward only, so a wall between the camera and the room simply disappears. */
window.buildMusicRoom = function ({ THREE, scene, renderer }) {
  const HX = 3.7, ZB = -2.8, ZF = 4.8, RH = 2.95, ZC = (ZB + ZF) / 2, DZ = ZF - ZB;
  const room = new THREE.Group(); scene.add(room);
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };
  const std = (color, roughness = 0.7, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const glow = (r, g, b) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });
  let seed = 9; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;

  const wallMat = std(0xffffff, 0.94, 0, { emissive: 0xffffff, emissiveIntensity: 0.16, map: tex(8, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.1, '#e9e6e0'); gr.addColorStop(0.7, '#d9d5ce'); gr.addColorStop(1, '#b7b3ab'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }) });
  wallMat.emissiveMap = wallMat.map;
  const skirt = std(0xf4f2ee, 0.6);
  const wall = (w, x, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, RH), wallMat); m.position.set(x, RH / 2, z); m.rotation.y = ry; m.receiveShadow = true; room.add(m);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.1), skirt); s.position.set(0, -RH / 2 + 0.05, 0.004); m.add(s);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.035), glow(2.1, 2.1, 2)); c.position.set(0, RH / 2 - 0.02, 0.004); m.add(c); };
  wall(2 * HX, 0, ZB, 0); wall(2 * HX, 0, ZF, Math.PI); wall(DZ, -HX, ZC, Math.PI / 2); wall(DZ, HX, ZC, -Math.PI / 2);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(2 * HX, DZ), std(0xf4f4f2, 1, 0, { emissive: 0xffffff, emissiveIntensity: 0.45 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, RH, ZC); room.add(ceil);
  for (const z of [-0.6, 1.4, 3.2]) for (const x of [-2, -0.7, 0.7, 2]) { const p = new THREE.Mesh(new THREE.CircleGeometry(0.07, 32), glow(3.2, 3.1, 2.9)); p.rotation.x = Math.PI / 2; p.position.set(x, RH - 0.01, z); room.add(p); }

  const floorTex = tex(1024, 1024, (g, w, h) => {
    const rows = 8, rh = h / rows;
    for (let r = 0; r < rows; r++) { const off = rnd() * w; for (let k = 0; k < 2; k++) {
      const x = (off + k * w / 2) % w; g.fillStyle = `hsl(${30 + rnd() * 5}, ${24 + rnd() * 7}%, ${60 + rnd() * 8}%)`;
      for (const ox of [-w, 0]) g.fillRect(x + ox, r * rh, w / 2, rh);
      for (let i = 0; i < 46; i++) { g.fillStyle = `rgba(80,50,25,${0.03 + rnd() * 0.07})`; const gx = x + rnd() * w / 2, gy = r * rh + rnd() * rh, gl = 60 + rnd() * 240; for (const ox of [-w, 0, w]) g.fillRect(gx + ox, gy, Math.min(gl, x + w / 2 - gx), 1.5); }
      g.fillStyle = 'rgba(40,25,10,.35)'; for (const ox of [-w, 0]) g.fillRect(x + ox, r * rh, 2, rh); }
      g.fillStyle = 'rgba(40,25,10,.3)'; g.fillRect(0, r * rh, w, 2); } });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(2 * HX / 2.4, DZ / 1.1);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2 * HX, DZ), std(0xffffff, 0.34, 0, { map: floorTex })); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, ZC); floor.receiveShadow = true; room.add(floor);

  // back wall: walnut slats over black felt, the kind that tames a room's echo
  const slats = tex(1024, 256, (g, w, h) => { g.fillStyle = '#17120e'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 32) { const gr = g.createLinearGradient(x, 0, x + 22, 0), l = 30 + rnd() * 8; gr.addColorStop(0, `hsl(26, 38%, ${l - 8}%)`); gr.addColorStop(0.25, `hsl(26, 40%, ${l + 6}%)`); gr.addColorStop(1, `hsl(26, 38%, ${l - 4}%)`); g.fillStyle = gr; g.fillRect(x, 0, 22, h);
      for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(30,15,5,${0.08 + rnd() * 0.12})`; g.fillRect(x + rnd() * 20, 0, 1.2, h); } } });
  slats.wrapS = slats.wrapT = THREE.RepeatWrapping; slats.repeat.set(4.6 / 1.2, 1);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.5, 0.04), std(0xffffff, 0.55, 0, { map: slats })); panel.position.set(-1.35, 1.35, ZB + 0.022); panel.receiveShadow = true; room.add(panel);

  // a wool rug under the piano
  const wool = tex(512, 512, (g, w, h) => { g.fillStyle = '#b8ad9c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 12000; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '70,55,40' : '255,255,255'},${0.05 + rnd() * 0.1})`; g.beginPath(); g.arc(rnd() * w, rnd() * h, 1 + rnd() * 2.5, 0, 7); g.fill(); } });
  wool.wrapS = wool.wrapT = THREE.RepeatWrapping; wool.repeat.set(5, 5);
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, 0.014, 96), new THREE.MeshPhysicalMaterial({ map: wool, roughness: 1, sheen: 1, sheenRoughness: 0.5 })); rug.position.set(-1.25, 0.007, -0.1); rug.receiveShadow = true; room.add(rug);

  return { room };
};
