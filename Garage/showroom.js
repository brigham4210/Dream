/* The showroom: a clean, bright 3D room that any car page in this folder can park its car in.
   A car page calls buildShowroom({ car, info, ... }) once its car is in the scene (x = forward, y = up, metres, wheels on y = 0);
   the garage calls it with cars: [{ object, info, x }] to hold all of them.
   Walls face inward only, so a wall between the camera and the car simply disappears. */
window.buildShowroom = function ({ THREE, Reflector, scene, renderer, car, info, cars }) {
  cars = cars || [{ object: car, info, x: 0 }];   // one car, or several parked in a row along x
  const span = Math.max(...cars.map(c => Math.abs(c.x)));
  const W = 6.4 + span, ZB = -3.5, ZF = 7.2, H = 3.3, ZC = (ZB + ZF) / 2, DZ = ZF - ZB;
  const room = new THREE.Group(); scene.add(room);
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const FONT = '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif';
  const tex = (w, h, draw) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t;
  };
  const spaced = (g, s, x, y, gap) => { let w = 0; for (const ch of s) w += g.measureText(ch).width + gap; let cx = x - (w - gap) / 2; g.textAlign = 'left'; for (const ch of s) { g.fillText(ch, cx, y); cx += g.measureText(ch).width + gap; } };
  const glow = v => new THREE.MeshBasicMaterial({ color: new THREE.Color(v, v, v * 0.98) });

  /* walls: plaster, a little darker towards the floor, washed with light from a cove at the top */
  const wallMat = new THREE.MeshStandardMaterial({ roughness: 0.94, emissive: 0xffffff, emissiveIntensity: 0.24, map: tex(8, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.1, '#eceae6'); gr.addColorStop(0.7, '#dcdad6'); gr.addColorStop(1, '#b4b3ae');
    g.fillStyle = gr; g.fillRect(0, 0, w, h); }) });
  wallMat.emissiveMap = wallMat.map;
  const skirt = new THREE.MeshStandardMaterial({ color: 0x2a2b2d, roughness: 0.6 });
  const wall = (w, x, z, ry) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, H), wallMat); m.position.set(x, H / 2, z); m.rotation.y = ry; room.add(m);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.07), skirt); s.position.set(0, -H / 2 + 0.035, 0.004); m.add(s);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.035), glow(2.2)); c.position.set(0, H / 2 - 0.02, 0.004); m.add(c);
    return m;
  };
  wall(2 * W, 0, ZB, 0); wall(2 * W, 0, ZF, Math.PI); wall(DZ, -W, ZC, Math.PI / 2); wall(DZ, W, ZC, -Math.PI / 2);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(2 * W, DZ), new THREE.MeshStandardMaterial({ color: 0xf4f4f2, roughness: 1, emissive: 0xffffff, emissiveIntensity: 0.5 }));
  ceil.rotation.x = Math.PI / 2; ceil.position.set(0, H, ZC); room.add(ceil);

  /* light: two long ceiling panels over the car and a glowing band on the front wall */
  const panel = (w, d, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), glow(3)); m.rotation.x = Math.PI / 2; m.position.set(x, H - 0.012, z); room.add(m);
    const rim = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.08, d + 0.08), new THREE.MeshStandardMaterial({ color: 0xd9d9d6, roughness: 0.5 })); rim.rotation.x = Math.PI / 2; rim.position.set(x, H - 0.006, z); room.add(rim); };
  const PL = 5.2 + 2 * span; panel(PL, 0.85, 0, -1.25); panel(PL, 0.85, 0, 1.25); panel(PL, 0.6, 0, 3.9);
  const band = new THREE.Mesh(new THREE.PlaneGeometry(7.4 + 2 * span, 1.35), glow(2)); band.rotation.y = Math.PI; band.position.set(0, 1.95, ZF - 0.012); room.add(band);

  /* floor: pale polished concrete over a faint mirror */
  const geo = new THREE.PlaneGeometry(2 * W, DZ);
  const mirror = new Reflector(geo, { textureWidth: 1536, textureHeight: 1536, color: 0x6a6a6a, clipBias: 0.002 });
  mirror.rotation.x = -Math.PI / 2; mirror.position.set(0, -0.014, ZC); room.add(mirror);
  const floorTex = tex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 520; i++) { const r = 20 + Math.random() * 120, x = Math.random() * w, y = Math.random() * h, a = 0.012 + Math.random() * 0.02;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${a})`); gr.addColorStop(1, 'rgba(128,128,128,0)');
      g.fillStyle = gr; for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) { g.setTransform(1, 0, 0, 1, ox, oy); g.fillRect(x - r, y - r, 2 * r, 2 * r); } }
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = 'rgba(0,0,0,0.05)'; g.fillRect(0, 0, w, h); });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(3.4 * W / 6.4, 2.8);
  const floor = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x8f9090, map: floorTex, roughness: 0.3, transparent: true, opacity: 0.93, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, -0.007, ZC); floor.renderOrder = -10; room.add(floor);

  /* picture frame */
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x151516, roughness: 0.45 });
  const shadowTex = tex(256, 256, (g, w, h) => { g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 26; g.shadowOffsetY = 8; g.fillStyle = '#000'; g.fillRect(44, 40, w - 88, h - 88); });
  const framed = (w, h, map) => {
    const g = new THREE.Group();
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.5, h * 1.5), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.5, depthWrite: false })); sh.position.z = 0.003; g.add(sh);
    const b = new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, h + 0.04, 0.035), frameMat); b.position.z = 0.0175; g.add(b);
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map, roughness: 0.55 })); p.position.z = 0.0357; g.add(p);
    room.add(g); return g;
  };
  /* back wall: a framed road map of the United States */
  const FONTB = `700 100px ${FONT}`;
  const usaMap = tex(2048, 1340, (g, w, h) => {
    const rad = d => d * Math.PI / 180, n = (Math.sin(rad(29.5)) + Math.sin(rad(45.5))) / 2, C = Math.cos(rad(29.5)) ** 2 + 2 * n * Math.sin(rad(29.5));
    const rho = la => Math.sqrt(C - 2 * n * Math.sin(rad(la))) / n, rho0 = rho(37.5), S = 2600;
    const P = ([lo, la]) => { const t = n * rad(lo + 96), r = rho(la); return [w / 2 + 10 + r * Math.sin(t) * S, 172 + (0.236 - (rho0 - r * Math.cos(t))) * S]; };   // Albers equal-area conic
    const path = pts => { g.beginPath(); pts.forEach((p, i) => { const [x, y] = P(p); i ? g.lineTo(x, y) : g.moveTo(x, y); }); };
    g.fillStyle = '#cfe0e6'; g.fillRect(0, 0, w, h);
    const coast = [[-124.7, 48.4], [-122.8, 49], [-95.2, 49], [-95.15, 49.4], [-94.6, 48.7], [-92, 48.3], [-89.6, 48], [-92.1, 46.8], [-90.4, 46.6], [-87.5, 46.6], [-84.6, 46.5], [-83.4, 45.3], [-82.5, 45.3], [-82.4, 43], [-83.1, 42.2], [-83.2, 41.7], [-81.7, 41.5], [-79, 42.7], [-79, 43.3], [-76.3, 43.5], [-76.4, 44.1], [-75, 45], [-71.5, 45], [-70.3, 46.3], [-69.2, 47.45], [-68.3, 47.35], [-67.8, 47.07], [-67.8, 45.7], [-67, 44.8], [-68.6, 44.3], [-70.2, 43.6], [-70.7, 42.7], [-70, 41.8], [-70.6, 41.5], [-71.4, 41.5], [-72.9, 41.2], [-73.7, 40.9], [-74, 40.6], [-74, 39.7], [-74.9, 38.9], [-75.1, 38.4], [-75.9, 37.1], [-76, 36.9], [-75.5, 35.3], [-76.6, 34.7], [-77.9, 33.9], [-79.2, 33.2], [-80.9, 32], [-81.4, 30.7], [-81.3, 29.5], [-80.5, 28.4], [-80, 26.8], [-80.2, 25.3], [-81, 25.1], [-81.8, 26.1], [-82.8, 27.8], [-82.7, 29], [-83.9, 30], [-85.3, 29.7], [-87.2, 30.4], [-88.1, 30.3], [-89.4, 30.2], [-89.3, 29.1], [-90.5, 29.2], [-91.8, 29.6], [-93.8, 29.7], [-94.8, 29.3], [-97, 27.9], [-97.3, 26], [-99.2, 26.5], [-99.5, 27.5], [-100.5, 28.7], [-101.4, 29.8], [-102.6, 29.75], [-103.2, 29], [-104.5, 29.6], [-106.5, 31.8], [-108.2, 31.8], [-108.2, 31.33], [-111.1, 31.33], [-114.8, 32.5], [-117.1, 32.5], [-118.4, 34], [-120.5, 34.5], [-121.9, 36.6], [-122.5, 37.8], [-123.8, 39.8], [-124.3, 40.4], [-124.1, 42], [-124.5, 42.8], [-124, 46.2], [-124.6, 47.9]];
    g.lineJoin = g.lineCap = 'round';
    path(coast); g.closePath(); g.fillStyle = '#f3ead3'; g.fill(); g.strokeStyle = '#6f6552'; g.lineWidth = 3.5; g.stroke();
    g.save(); path(coast); g.closePath(); g.clip();
    g.strokeStyle = 'rgba(111,101,82,.28)'; g.lineWidth = 1.5;   // a light graticule in place of state lines
    for (let lo = -125; lo <= -65; lo += 5) { path(Array.from({ length: 13 }, (_, i) => [lo, 24 + i * 2.2])); g.stroke(); }
    for (let la = 25; la <= 50; la += 5) { path(Array.from({ length: 31 }, (_, i) => [-126 + i * 2, la])); g.stroke(); }
    g.restore();
    const C_ = { SEA: [-122.3, 47.6], PDX: [-122.7, 45.5], SAC: [-121.5, 38.6], SFO: [-122.4, 37.8], LAX: [-118.2, 34.05], SAN: [-117.2, 32.7], LAS: [-115.1, 36.2], PHX: [-112.1, 33.4], TUS: [-110.9, 32.2], ELP: [-106.5, 31.8],
      ABQ: [-106.6, 35.1], FLG: [-111.6, 35.2], BAR: [-117, 34.9], AMA: [-101.8, 35.2], OKC: [-97.5, 35.5], TUL: [-95.9, 36.15], LIT: [-92.3, 34.7], MEM: [-90, 35.1], BNA: [-86.8, 36.2], TYS: [-83.9, 36], RDU: [-78.6, 35.8], ILM: [-77.9, 34.2],
      RNO: [-119.8, 39.5], SLC: [-111.9, 40.8], CYS: [-104.8, 41.1], OMA: [-95.9, 41.3], DSM: [-93.6, 41.6], CHI: [-87.6, 41.9], CLE: [-81.7, 41.5], NYC: [-74, 40.7], GEG: [-117.4, 47.7], BIL: [-108.5, 45.8], RAP: [-103.2, 44.1], FSD: [-96.7, 43.5],
      MSN: [-89.4, 43.1], BUF: [-78.9, 42.9], ALB: [-73.8, 42.7], BOS: [-71.1, 42.4], DEN: [-105, 39.7], MKC: [-94.6, 39.1], STL: [-90.2, 38.6], IND: [-86.2, 39.8], CMH: [-83, 40], PIT: [-80, 40.4], BAL: [-76.6, 39.3], GJT: [-108.6, 39.1], COV: [-112.6, 38.6],
      MIA: [-80.2, 25.8], JAX: [-81.7, 30.3], SAV: [-81.1, 32.1], RIC: [-77.4, 37.5], DCA: [-77, 38.9], PHL: [-75.2, 39.95], PWM: [-70.3, 43.7], BGR: [-68.8, 44.8], LRD: [-99.5, 27.5], SAT: [-98.5, 29.4], DFW: [-96.8, 32.8], ICT: [-97.3, 37.7],
      MSP: [-93.3, 45], DLH: [-92.1, 46.8], BTM: [-112.5, 46], SWG: [-111.9, 48.9], BUW: [-106.7, 44.3], TPA: [-82.5, 28], ATL: [-84.4, 33.7], CHA: [-85.3, 35], CVG: [-84.5, 39.1], DTW: [-83, 42.3], SSM: [-84.4, 46.5], MSY: [-90.1, 30], MOB: [-88, 30.7], HOU: [-95.4, 29.8],
      PEC: [-103.5, 31.4], SHV: [-93.7, 32.5], JAN: [-90.2, 32.3], BHM: [-86.8, 33.5], CAE: [-81, 34], BIS: [-100.8, 46.8], FAR: [-96.8, 46.9], SDF: [-85.8, 38.3], CLT: [-80.8, 35.2], BOI: [-116.2, 43.6], SPI: [-89.6, 39.8] };
    const road = (ids, col, lw) => { g.strokeStyle = col; g.lineWidth = lw; path(ids.split(' ').map(k => C_[k])); g.stroke(); };
    const ROADS = ['SEA PDX SAC LAX SAN', 'LAX PHX TUS ELP SAT HOU MSY MOB JAX', 'BAR FLG ABQ AMA OKC LIT MEM BNA TYS RDU ILM', 'SFO SAC RNO SLC CYS OMA DSM CHI CLE NYC', 'SEA GEG BTM BIL RAP FSD MSN CHI', 'CLE BUF ALB BOS',
      'COV GJT DEN MKC STL IND CMH PIT BAL', 'MIA JAX SAV RIC DCA BAL PHL NYC BOS PWM BGR', 'LRD SAT DFW OKC ICT MKC DSM MSP DLH', 'SAN LAS COV SLC BTM SWG', 'ELP ABQ DEN CYS BUW BIL', 'MIA TPA ATL CHA TYS CVG DTW SSM',
      'MSY JAN MEM STL SPI CHI', 'PEC DFW SHV JAN BHM ATL CAE', 'BIL BIS FAR MSP MSN', 'MOB BHM BNA SDF IND CHI', 'ATL CLT RIC', 'PDX BOI SLC'];
    for (const r of ROADS) road(r, '#f3ead3', 9); for (const r of ROADS) road(r, '#b3261e', 4.5);
    road('CHI SPI STL TUL OKC AMA ABQ FLG BAR LAX', '#f3ead3', 12); road('CHI SPI STL TUL OKC AMA ABQ FLG BAR LAX', '#1d3f72', 6.5);   // Route 66
    g.textBaseline = 'middle';
    const LABEL = { SEA: 'Seattle', SFO: 'San Francisco', LAX: 'Los Angeles', LAS: 'Las Vegas', PHX: 'Phoenix', SLC: 'Salt Lake City', DEN: 'Denver', ABQ: 'Albuquerque', DFW: 'Dallas', HOU: 'Houston', MKC: 'Kansas City', MSP: 'Minneapolis', CHI: 'Chicago', STL: 'St. Louis', MEM: 'Memphis', MSY: 'New Orleans', ATL: 'Atlanta', MIA: 'Miami', DCA: 'Washington', NYC: 'New York', BOS: 'Boston', DTW: 'Detroit', BIL: 'Billings', OKC: 'Oklahoma City', BNA: 'Nashville' };
    for (const k in C_) { const [x, y] = P(C_[k]), big = k in LABEL; g.beginPath(); g.arc(x, y, big ? 8 : 4.5, 0, 7); g.fillStyle = '#fffdf6'; g.fill(); g.strokeStyle = '#2a2622'; g.lineWidth = big ? 3 : 2; g.stroke();
      if (big) { const left = ['DCA', 'MSY', 'DTW'].includes(k); g.font = `600 30px ${FONT}`; g.textAlign = left ? 'right' : 'left'; g.lineWidth = 6; g.strokeStyle = 'rgba(243,234,211,.9)'; g.strokeText(LABEL[k], x + (left ? -14 : 14), y - 13); g.fillStyle = '#2a2622'; g.fillText(LABEL[k], x + (left ? -14 : 14), y - 13); } }
    g.fillStyle = '#f3ead3'; g.fillRect(0, 0, w, 112); g.fillStyle = '#2a2622'; g.fillRect(0, 110, w, 4);
    g.textAlign = 'left'; g.font = `700 50px ${FONT}`; g.fillText('UNITED STATES', 48, 58); g.font = `400 30px ${FONT}`; g.fillText('ROAD MAP · PRINCIPAL HIGHWAYS', 480, 61);
    g.textAlign = 'right'; g.font = `600 24px ${FONT}`; g.fillStyle = '#b3261e'; g.fillRect(w - 500, 53, 70, 6); g.fillStyle = '#2a2622'; g.fillText('Interstate', w - 300, 57); g.fillStyle = '#1d3f72'; g.fillRect(w - 270, 52, 70, 8); g.fillStyle = '#2a2622'; g.fillText('Route 66', w - 48, 57);
    g.strokeStyle = 'rgba(0,0,0,.06)'; g.lineWidth = 3; for (const x of [w / 4, w / 2, 3 * w / 4]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } g.beginPath(); g.moveTo(0, h / 2 + 56); g.lineTo(w, h / 2 + 56); g.stroke();   // fold lines
  });
  framed(2.75, 1.8, usaMap).position.set(0.3, 1.98, ZB);

  /* road signs, hung flat on the left wall */
  function sign(w, h, draw) {
    const px = 512, c = document.createElement('canvas'); c.width = px; c.height = Math.round(px * h / w);
    const g = c.getContext('2d'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; draw(g, c.width, c.height);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso;
    const sc = document.createElement('canvas'); sc.width = Math.round(c.width * 1.3); sc.height = Math.round(c.height * 1.3);
    const sg = sc.getContext('2d'); sg.shadowColor = 'rgba(0,0,0,.6)'; sg.shadowBlur = 22; sg.shadowOffsetX = 4000; sg.shadowOffsetY = 12; sg.drawImage(c, c.width * 0.15 - 4000, c.height * 0.15);
    const grp = new THREE.Group();
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.3, h * 1.3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, opacity: 0.55, depthWrite: false })); sh.position.z = 0.004; grp.add(sh);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.5, roughness: 0.42, metalness: 0.15 })); m.position.z = 0.022; grp.add(m);
    room.add(grp); return grp;
  }
  const poly = (g, pts) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); };
  const ngon = (n, r, cx, cy, rot) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(rot + i * 2 * Math.PI / n), cy + r * Math.sin(rot + i * 2 * Math.PI / n)]);
  const shield = (g, w, h, m) => { g.beginPath(); g.moveTo(m, m + h * 0.04); g.quadraticCurveTo(w * 0.27, m + h * 0.07, w / 2, m); g.quadraticCurveTo(w * 0.73, m + h * 0.07, w - m, m + h * 0.04);
    g.bezierCurveTo(w - m + w * 0.03, h * 0.5, w * 0.86, h * 0.8, w / 2, h - m); g.bezierCurveTo(w * 0.14, h * 0.8, m - w * 0.03, h * 0.5, m, m + h * 0.04); g.closePath(); };
  const SIGNS = {
    stop: [0.76, 0.76, (g, w) => { poly(g, ngon(8, 250, 256, 256, Math.PI / 8)); g.fillStyle = '#fff'; g.fill(); poly(g, ngon(8, 232, 256, 256, Math.PI / 8)); g.fillStyle = '#b8141c'; g.fill(); g.fillStyle = '#fff'; g.font = `700 172px ${FONT}`; g.fillText('STOP', 256, 268); }],
    speed: [0.61, 0.76, (g, w, h) => { g.fillStyle = '#fff'; g.beginPath(); g.roundRect(4, 4, w - 8, h - 8, 34); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 12; g.beginPath(); g.roundRect(22, 22, w - 44, h - 44, 22); g.stroke();
      g.fillStyle = '#111'; g.font = `700 92px ${FONT}`; g.fillText('SPEED', w / 2, 120); g.fillText('LIMIT', w / 2, 218); g.font = `700 300px ${FONT}`; g.fillText('55', w / 2, 452); }],
    route: [0.66, 0.68, (g, w, h) => { shield(g, w, h, 6); g.fillStyle = '#111'; g.fill(); shield(g, w, h, 22); g.fillStyle = '#fff'; g.fill(); g.fillStyle = '#111'; g.fillRect(40, 150, w - 80, 9);
      g.font = `700 70px ${FONT}`; g.fillText('ROUTE', w / 2, 106); g.font = `700 250px ${FONT}`; g.fillText('66', w / 2, 318); }],
    inter: [0.66, 0.68, (g, w, h) => { shield(g, w, h, 6); g.fillStyle = '#fff'; g.fill(); g.save(); shield(g, w, h, 20); g.clip(); g.fillStyle = '#1b3f8a'; g.fillRect(0, 0, w, h); g.fillStyle = '#b8141c'; g.fillRect(0, 0, w, 150); g.fillStyle = '#fff'; g.fillRect(0, 150, w, 12); g.restore();
      g.fillStyle = '#fff'; g.font = `700 56px ${FONT}`; g.fillText('INTERSTATE', w / 2, 104); g.font = `700 230px ${FONT}`; g.fillText('80', w / 2, 320); }],
    curve: [0.86, 0.86, (g) => { poly(g, ngon(4, 250, 256, 256, 0)); g.fillStyle = '#111'; g.fill(); poly(g, ngon(4, 232, 256, 256, 0)); g.fillStyle = '#f5b301'; g.fill(); poly(g, ngon(4, 205, 256, 256, 0)); g.strokeStyle = '#111'; g.lineWidth = 9; g.stroke();
      g.lineWidth = 34; g.lineCap = 'butt'; g.beginPath(); g.moveTo(256, 400); g.bezierCurveTo(256, 300, 330, 290, 300, 230); g.bezierCurveTo(280, 190, 210, 200, 232, 150); g.stroke(); poly(g, [[190, 168], [262, 86], [286, 176]]); g.fillStyle = '#111'; g.fill(); }],
    yield: [0.84, 0.74, (g, w, h) => { const tri = m => [[m * 1.1, m * 0.7], [w - m * 1.1, m * 0.7], [w / 2, h - m * 1.25]]; poly(g, tri(6)); g.fillStyle = '#fff'; g.fill(); poly(g, tri(26)); g.fillStyle = '#b8141c'; g.fill(); poly(g, tri(78)); g.fillStyle = '#fff'; g.fill(); g.fillStyle = '#b8141c'; g.font = `700 60px ${FONT}`; g.fillText('YIELD', w / 2, 150); }],
    oneway: [0.92, 0.31, (g, w, h) => { g.fillStyle = '#fff'; g.beginPath(); g.roundRect(2, 2, w - 4, h - 4, 14); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.roundRect(10, 10, w - 20, h - 20, 9); g.fill();
      poly(g, [[36, h / 2], [112, 34], [112, 58], [w - 36, 58], [w - 36, h - 58], [112, h - 58], [112, h - 34]]); g.fillStyle = '#fff'; g.fill(); g.fillStyle = '#111'; g.font = `700 60px ${FONT}`; g.fillText('ONE WAY', w / 2 + 34, h / 2 + 4); }],
  };
  const hang = (k, x, y, z, ry = 0) => { const [w, h, d] = SIGNS[k], s = sign(w, h, d); s.position.set(x, y, z); s.rotation.y = ry; return s; };
  ['stop', 'speed', 'curve', 'yield', 'route', 'inter', 'oneway'].forEach((k, i) => hang(k, -W, 2.05, -2.8 + i * 1.0 + (i === 6 ? 0.1 : 0), Math.PI / 2));   // all in a row on the left wall

  /* what the paint, chrome and glass reflect: the room itself, seen from a metre above the floor */
  for (const c of cars) c.object.visible = false; mirror.visible = false; scene.position.y = -1.0; scene.updateMatrixWorld(true);
  const pm = new THREE.PMREMGenerator(renderer), env = pm.fromScene(scene, 0.015, 0.1, 60).texture;
  scene.position.y = 0; for (const c of cars) c.object.visible = true; mirror.visible = true; scene.updateMatrixWorld(true); pm.dispose();
  scene.environment = env;
  return { room, floor, mirror };
};
