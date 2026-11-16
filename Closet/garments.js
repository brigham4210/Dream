/* The tailor: turns a line of clothes.js into a 3D garment on a hanger.
   makeTailor(THREE) returns build(item) -> { root, rail, length }. root's origin is the centre of the wardrobe rail it hangs from;
   the garment faces +z, x runs across the chest, metres. rail says which rail it belongs on: 'top', 'low' or 'long'.
   Every garment is a soft slab cut to its front-view outline; seams, buttons, zips and pockets are drawn onto the cloth. */
window.makeTailor = function (THREE) {
  const S = 900, TILE = 256, HOOK = 0.085;   // S: pixels per metre of drawn cloth
  const V = (x, y) => new THREE.Vector2(x, y);
  const rgb = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const tone = (c, k) => '#' + rgb(c).map(v => Math.round(v + ((k < 0 ? 0 : 255) - v) * Math.abs(k)).toString(16).padStart(2, '0')).join('');   // k < 0 darker, k > 0 lighter
  const isDark = c => { const [r, g, b] = rgb(c); return 0.3 * r + 0.59 * g + 0.11 * b < 90; };
  let seed = 11; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  /* ------------------------------------------------------------------ cloth */
  const tiles = {};
  function weave(colour, type) {   // a small repeating swatch
    const key = colour + type; if (tiles[key]) return tiles[key];
    const c = canvas(TILE, TILE), g = c.getContext('2d'); g.fillStyle = colour; g.fillRect(0, 0, TILE, TILE);
    const speck = (n, a, len, vert) => { for (let i = 0; i < n; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '0,0,0' : '255,255,255'},${a * rnd()})`; const l = 1 + rnd() * len; g.fillRect(rnd() * TILE, rnd() * TILE, vert ? 1 : l, vert ? l : 1); } };
    const twill = a => { g.strokeStyle = `rgba(255,255,255,${a})`; g.lineWidth = 1; for (let i = -TILE; i < TILE; i += 4) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + TILE, TILE); g.stroke(); } };
    const ribs = (p, a) => { for (let x = 0; x < TILE; x += p) { g.fillStyle = `rgba(0,0,0,${a})`; g.fillRect(x, 0, p * 0.34, TILE); g.fillStyle = `rgba(255,255,255,${a * 0.6})`; g.fillRect(x + p * 0.5, 0, p * 0.28, TILE); } };
    if (type === 'jersey') speck(2600, 0.06, 2);
    else if (type === 'poplin') speck(1500, 0.04, 1);
    else if (type === 'denim') { twill(0.11); speck(5200, 0.13, 4, true); }
    else if (type === 'fleece') speck(7000, 0.11, 3);
    else if (type === 'rib') { ribs(4, 0.2); speck(1200, 0.05, 1); }
    else if (type === 'knit') { ribs(8, 0.15); speck(2500, 0.06, 2, true); }
    else if (type === 'leather') { for (let i = 0; i < 170; i++) { const x = rnd() * TILE, y = rnd() * TILE, r = 5 + rnd() * 22, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${0.05 * rnd()})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); } speck(900, 0.05, 1); }
    else if (type === 'nylon') speck(700, 0.035, 1);
    else if (type === 'wool') speck(7500, 0.09, 2);
    else if (type === 'twill') { twill(0.05); speck(2200, 0.05, 2); }
    return tiles[key] = c;
  }
  const tileTex = cv => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(S / TILE, S / TILE); t.anisotropy = 8; return t; };
  // soft vertical folds, deeper towards the hem: one normal map shared by every garment
  const FOLDS = (() => {
    const n = 256, c = canvas(n, n), g = c.getContext('2d'), img = g.createImageData(n, n), T = 2 * Math.PI;
    const h = (u, t) => (0.2 + 0.8 * t) * (0.5 * Math.sin(T * (3 * u + 0.12 * Math.sin(T * t))) + 0.3 * Math.sin(T * (5 * u + 0.7 + 0.2 * Math.sin(T * t + 1))) + 0.12 * Math.sin(T * (9 * u + 0.3)));
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const u = x / n, t = y / n, e = 1 / n, dx = (h(u + e, t) - h(u - e, t)) / (2 * e) * 0.035, dy = (h(u, t + e) - h(u, t - e)) / (2 * e) * 0.035, l = Math.hypot(dx, dy, 1), i = (y * n + x) * 4;
      img.data[i] = (-dx / l * 0.5 + 0.5) * 255; img.data[i + 1] = (dy / l * 0.5 + 0.5) * 255; img.data[i + 2] = (1 / l * 0.5 + 0.5) * 255; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const tx = new THREE.CanvasTexture(c); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(1 / 0.62, 1 / 1.2); return tx;
  })();
  const cloth = (map, colour, extra = {}) => new THREE.MeshPhysicalMaterial({ map, roughness: 0.92, sheen: 0.4, sheenRoughness: 0.65,
    sheenColor: new THREE.Color(tone(colour, 0.35)), normalMap: FOLDS, normalScale: V(0.7, 0.7), ...extra });
  const wood = new THREE.MeshStandardMaterial({ color: 0xb98a55, roughness: 0.5 });
  const steel = new THREE.MeshStandardMaterial({ color: 0xd9dbde, roughness: 0.25, metalness: 1 });

  /* ----------------------------------------------------------------- pieces */
  // a slab: the outline pushed out to a thickness, with rolled edges. mats = [back, front]; the edges take the front cloth.
  function slab(shape, depth, mats, bevel) {
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel, bevelSegments: 3, curveSegments: 18 });
    g.translate(0, 0, -depth / 2);
    const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i), p.getY(i));   // cloth is laid on flat, in metres
    if (Array.isArray(mats)) { const n = g.groups[0].count; g.clearGroups(); g.addGroup(0, n / 2, 0); g.addGroup(n / 2, n / 2, 1); g.addGroup(n, p.count - n, 1); }
    return new THREE.Mesh(g, mats);
  }
  const poly = pts => new THREE.Shape(pts.map(p => V(p[0], p[1])));
  function flat(w, h, x, y, z, mat, back) {
    const g = new THREE.PlaneGeometry(w, h); if (back) g.rotateY(Math.PI); g.translate(x, y, z);
    const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i), p.getY(i));
    return new THREE.Mesh(g, mat);
  }
  // the drawn front: a canvas in garment metres (x right, y up), already filled with the cloth
  function panel(tile, XW, y0, y1, draw) {
    const c = canvas(Math.round(2 * XW * S), Math.round((y1 - y0) * S)), g = c.getContext('2d');
    g.fillStyle = g.createPattern(tile, 'repeat'); g.fillRect(0, 0, c.width, c.height);
    g.setTransform(S, 0, 0, -S, XW * S, y1 * S); g.lineCap = g.lineJoin = 'round'; draw(g);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.repeat.set(1 / (2 * XW), 1 / (y1 - y0)); t.offset.set(0.5, -y0 / (y1 - y0)); return t;
  }
  const pat = (g, tile) => { const p = g.createPattern(tile, 'repeat'); p.setTransform(new DOMMatrix([1 / S, 0, 0, -1 / S, 0, 0])); return p; };
  const P = (g, pts, close) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); if (close) g.closePath(); };
  const line = (g, pts, col, w = 0.0016, dash) => { P(g, pts); g.strokeStyle = col; g.lineWidth = w; g.setLineDash(dash || []); g.stroke(); g.setLineDash([]); };
  const stitch = (g, pts, col) => line(g, pts, col, 0.0013, [0.0035, 0.0028]);
  const fill = (g, pts, col) => { P(g, pts, true); g.fillStyle = col; g.fill(); };
  const dot = (g, x, y, r, col) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = col; g.fill(); };
  const button = (g, x, y, r, col, rim) => { dot(g, x + 0.0008, y - 0.0015, r * 1.1, 'rgba(0,0,0,.35)'); dot(g, x, y, r, rim); dot(g, x, y, r * 0.72, col); };
  const zip = (g, pts, w = 0.011) => { line(g, pts, '#0c0c0d', w); line(g, pts, '#c9ccd0', w * 0.42, [0.0018, 0.0018]); };
  const mirror = (pts, s) => pts.map(p => [s * p[0], p[1]]);

  function hanger(body, w, drop) {   // a wooden hanger inside the shoulders, its hook over the rail
    const sh = new THREE.Shape(), t = 0.022, e = -drop - 0.012;
    sh.moveTo(-w, e); sh.quadraticCurveTo(-w * 0.4, -0.012, 0, -0.01); sh.quadraticCurveTo(w * 0.4, -0.012, w, e);
    sh.lineTo(w, e - t * 0.6); sh.quadraticCurveTo(w * 0.4, -0.012 - t, 0, -0.01 - t); sh.quadraticCurveTo(-w * 0.4, -0.012 - t, -w, e - t * 0.6);
    body.add(slab(sh, 0.008, wood, 0.003)); hook(body, -0.02, HOOK);
  }
  function hook(body, y0, yc) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.0028, 0.0028, yc - 0.02 - y0, 8), steel); stem.position.y = (yc - 0.02 + y0) / 2; body.add(stem);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.0028, 8, 30, Math.PI * 1.45).rotateZ(-Math.PI / 2), steel); ring.position.y = yc; body.add(ring);
  }
  const finish = (root, rail, length) => { root.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); return { root, rail, length }; };

  /* ------------------------------------------------------------------- tops */
  // y = 0 at the point where neck meets shoulder; the garment hangs down from there.
  function top(it, p, paint, extras) {
    const o = { NW: 0.085, SH: 0.235, drop: 0.045, CH: 0.26, AH: 0.24, HEM: 0.25, L: 0.7, ND: 0.07, neck: 'crew', rise: 0.012, depth: 0.02, bevel: 0.01,
      SL: 0.62, SA: 0.2, CUFF: 0.115, cuff: 0, tail: 0, blouse: 0, fabric: 'jersey', rib: 0, mat: {}, rail: 'top', ...p };
    const c = it.colour, tile = weave(c, it.fabric || o.fabric), fab = cloth(tileTex(tile), c, o.mat);
    const ribTile = weave(tone(c, o.rib), 'rib'), ribMat = cloth(tileTex(ribTile), c, o.mat);
    const root = new THREE.Group(), body = new THREE.Group(); body.position.y = -HOOK; root.add(body);
    const neck = g => { g.moveTo(-o.NW, 0); if (o.neck === 'v') { g.lineTo(0, -o.ND); g.lineTo(o.NW, 0); } else if (o.neck === 'crew') g.bezierCurveTo(-o.NW, -o.ND * 1.33, o.NW, -o.ND * 1.33, o.NW, 0); else g.lineTo(o.NW, 0); };

    const sh = new THREE.Shape(); neck(sh); sh.lineTo(o.SH, -o.drop); sh.lineTo(o.CH, -o.AH);
    if (o.blouse) { sh.lineTo(o.CH + 0.006, -o.L + o.blouse + 0.05); sh.quadraticCurveTo(o.CH + 0.006, -o.L + o.blouse, o.HEM, -o.L + o.blouse - 0.012); }
    sh.lineTo(o.HEM, -o.L + o.tail);
    if (o.tail) sh.bezierCurveTo(o.HEM * 0.6, -o.L - o.tail * 0.3, -o.HEM * 0.6, -o.L - o.tail * 0.3, -o.HEM, -o.L + o.tail); else sh.lineTo(-o.HEM, -o.L);
    if (o.blouse) { sh.lineTo(-o.HEM, -o.L + o.blouse - 0.012); sh.quadraticCurveTo(-o.CH - 0.006, -o.L + o.blouse, -o.CH - 0.006, -o.L + o.blouse + 0.05); }
    sh.lineTo(-o.CH, -o.AH); sh.lineTo(-o.SH, -o.drop); sh.closePath();

    const XW = Math.max(o.SH, o.CH, o.HEM) + 0.04, k = { c, neck, tile, ribTile, ink: isDark(c) ? 'rgba(255,255,255,.17)' : 'rgba(0,0,0,.26)', XW };
    const front = cloth(panel(tile, XW, -o.L - 0.06, 0.05, g => paint(g, o, k)), c, o.mat);
    body.add(slab(sh, o.depth, [fab, front], o.bevel));
    const ZF = o.depth / 2 + o.bevel;

    if (o.neck !== 'straight') {   // the back of the neck, seen through the neckline
      const w = 2 * (o.NW + 0.012), h = o.ND + 0.035 + o.rise, y = o.rise - h / 2;
      const inside = new THREE.MeshStandardMaterial({ map: fab.map, color: o.lining || 0xc9c9c9, roughness: 1 });
      body.add(flat(w, h, 0, y, -ZF + 0.003, inside), flat(w, h, 0, y, -ZF + 0.002, fab, true));
      if (o.label) body.add(flat(0.03, 0.011, 0, o.rise - 0.014, -ZF + 0.0035, new THREE.MeshStandardMaterial({ color: isDark(c) ? 0xdedbd2 : 0x2a2a2c, roughness: 0.8 })));
    }
    for (const s of [1, -1]) {   // sleeves hang from the shoulder, a little behind the body
      const d = [Math.sin(o.SA), -Math.cos(o.SA)], P1 = [o.SH - 0.004, -o.drop + 0.002], P2 = [o.CH - 0.035, -o.AH - 0.015];
      const O = [P1[0] + d[0] * o.SL, P1[1] + d[1] * o.SL], I = [O[0] - Math.cos(o.SA) * o.CUFF, O[1] - Math.sin(o.SA) * o.CUFF];
      body.add(slab(poly(mirror([P1, O, I, P2], s)), o.depth - 0.006, fab, o.bevel));
      if (o.cuff) { const il = Math.hypot(P2[0] - I[0], P2[1] - I[1]), Oc = [O[0] - d[0] * o.cuff, O[1] - d[1] * o.cuff], Ic = [I[0] + (P2[0] - I[0]) / il * o.cuff, I[1] + (P2[1] - I[1]) / il * o.cuff];
        body.add(slab(poly(mirror([Oc, O, I, Ic], s)), o.depth - 0.002, o.rib ? ribMat : fab, o.bevel)); }
    }
    const pair = (pts, depth, z, mat, bevel = 0.0025) => { for (const s of [1, -1]) { const m = slab(typeof pts === 'function' ? pts(s) : poly(mirror(pts, s)), depth, mat, bevel); m.position.z = z; body.add(m); } };
    if (extras) extras({ body, o, fab, ribMat, ZF, pair, c });
    hanger(body, o.SH - 0.03, o.drop);
    return finish(root, o.rail, HOOK + o.L);
  }
  // shared bits of drawing
  const neckBand = (g, o, k, w, style) => { g.lineCap = 'butt'; for (const [lw, st] of [[w + 0.005, k.ink], [w, style]]) { g.beginPath(); k.neck(g); g.strokeStyle = st; g.lineWidth = lw; g.stroke(); } g.lineCap = 'round'; };
  const hemBand = (g, o, k, h) => { g.fillStyle = pat(g, k.ribTile); g.fillRect(-k.XW, -o.L - 0.06, 2 * k.XW, h + 0.06); line(g, [[-k.XW, -o.L + h], [k.XW, -o.L + h]], k.ink, 0.002); };
  const collar = (x) => ({ pair, o, fab, ZF }) => pair([[o.NW + 0.002, x.top], [o.NW + x.out, -0.008], [x.px, -o.ND - x.py], [0.007, -o.ND + 0.012]], 0.004, ZF + 0.001, fab);
  const bandCollar = mat => ({ pair, o, fab, ribMat, ZF }) => pair(s => { const sh = new THREE.Shape(); sh.moveTo(s * 0.004, -o.ND + 0.014); sh.quadraticCurveTo(s * o.NW * 0.95, -o.ND + 0.02, s * (o.NW - 0.006), 0.032);
    sh.lineTo(s * (o.NW + 0.03), 0.012); sh.quadraticCurveTo(s * (o.NW + 0.02), -o.ND - 0.03, s * 0.004, -o.ND - 0.03); return sh; }, 0.006, ZF, mat === 'rib' ? ribMat : fab, 0.004);

  const KINDS = {
    tee: it => top(it, { SL: 0.21, SA: 0.5, CUFF: 0.17, label: true, ND: 0.075 }, (g, o, k) => {
      neckBand(g, o, k, 0.04, tone(k.c, isDark(k.c) ? 0.07 : -0.05));
      stitch(g, [[-o.HEM, -o.L + 0.022], [o.HEM, -o.L + 0.022]], k.ink);
    }),

    shirt: it => top(it, { fabric: it.denim ? 'denim' : 'poplin', NW: 0.075, SH: 0.23, L: 0.76, tail: 0.04, neck: 'v', rise: 0.036, depth: 0.016, cuff: 0.06, CUFF: 0.11 }, (g, o, k) => {
      const th = it.denim ? '#e0b877' : k.ink, btn = it.denim ? '#f0ede6' : isDark(k.c) ? '#3a3a3e' : '#fbfaf6';
      for (const x of [-0.017, 0.017]) { line(g, [[x, -o.ND + 0.02], [x, -o.L - 0.05]], k.ink); if (it.denim) stitch(g, [[x * 0.72, -o.ND + 0.02], [x * 0.72, -o.L - 0.05]], th); }
      for (let y = -o.ND - 0.04; y > -o.L + 0.06; y -= 0.088) button(g, 0, y, 0.0058, btn, it.denim ? '#b9bcc0' : tone(btn, -0.25));
      if (it.denim) for (const s of [1, -1]) {
        stitch(g, [[s * 0.02, -0.145], [s * 0.27, -0.13]], th);
        const pk = mirror([[0.07, -0.2], [0.18, -0.2], [0.18, -0.305], [0.125, -0.33], [0.07, -0.305]], s); P(g, pk, true); g.strokeStyle = k.ink; g.lineWidth = 0.0018; g.stroke();
        const fl = mirror([[0.066, -0.19], [0.184, -0.19], [0.184, -0.222], [0.125, -0.246], [0.066, -0.222]], s); fill(g, fl, tone(k.c, -0.07)); stitch(g, [...fl, fl[0]], th);
        button(g, s * 0.125, -0.229, 0.0052, btn, '#b9bcc0');
      } else { P(g, [[0.07, -0.205], [0.17, -0.205], [0.17, -0.3], [0.12, -0.322], [0.07, -0.3]], true); g.strokeStyle = k.ink; g.lineWidth = 0.0016; g.stroke(); }
    }, collar({ top: 0.03, out: 0.04, px: 0.082, py: 0.03 })),

    turtleneck: it => top(it, { fabric: 'rib', neck: 'straight', NW: 0.08, L: 0.68, rib: -0.05, cuff: 0.06, rail: 'low' }, (g, o, k) => hemBand(g, o, k, 0.055),
      ({ body, o, ribMat }) => { body.add(slab(poly([[-o.NW - 0.008, -0.02], [o.NW + 0.008, -0.02], [o.NW + 0.004, 0.1], [-o.NW - 0.004, 0.1]]), o.depth * 0.9, ribMat, 0.012));
        const roll = slab(poly([[-o.NW - 0.012, 0.012], [o.NW + 0.012, 0.012], [o.NW + 0.008, 0.102], [-o.NW - 0.008, 0.102]]), o.depth * 0.9 + 0.008, ribMat, 0.013); body.add(roll); }),

    sweatshirt: it => top(it, { fabric: 'fleece', L: 0.68, CH: 0.27, HEM: 0.24, blouse: 0.07, rib: -0.1, cuff: 0.065, depth: 0.026, label: true, rail: 'low' }, (g, o, k) => {
      neckBand(g, o, k, 0.05, pat(g, k.ribTile)); hemBand(g, o, k, 0.065);
      const y = -o.ND - 0.027; stitch(g, [[-0.024, y], [0, y - 0.04], [0.024, y]], k.ink);
    }),

    sweater: it => top(it, { fabric: 'knit', L: 0.68, CH: 0.265, HEM: 0.245, blouse: 0.065, rib: -0.06, cuff: 0.065, depth: 0.028, rail: 'low' }, (g, o, k) => {
      for (const x0 of [-0.13, 0, 0.13]) {   // cables
        for (const dx of [-0.026, 0.026]) { line(g, [[x0 + dx, 0], [x0 + dx, -o.L]], 'rgba(0,0,0,.2)', 0.004); line(g, [[x0 + dx + 0.004, 0], [x0 + dx + 0.004, -o.L]], 'rgba(255,255,255,.3)', 0.003); }
        for (const ph of [0, Math.PI]) { const pts = []; for (let y = 0; y > -o.L; y -= 0.004) pts.push([x0 + 0.013 * Math.sin(y / 0.07 * 2 * Math.PI + ph), y]);
          line(g, pts.map(q => [q[0] + 0.0025, q[1] - 0.002]), 'rgba(0,0,0,.24)', 0.009); line(g, pts, tone(k.c, 0.25), 0.007); }
      }
      neckBand(g, o, k, 0.05, pat(g, k.ribTile)); hemBand(g, o, k, 0.065);
    }),

    hoodie: it => top(it, { fabric: 'fleece', L: 0.69, CH: 0.275, HEM: 0.245, blouse: 0.07, rib: -0.08, cuff: 0.065, depth: 0.028, ND: 0.085, rail: 'low' }, (g, o, k) => {
      hemBand(g, o, k, 0.065);
      const pk = [[-0.115, -0.42], [0.115, -0.42], [0.172, -0.55], [0.172, -o.L + 0.066], [-0.172, -o.L + 0.066], [-0.172, -0.55]];
      fill(g, pk, tone(k.c, -0.04)); P(g, pk, true); g.strokeStyle = k.ink; g.lineWidth = 0.002; g.stroke(); stitch(g, [pk[5], pk[0], pk[1], pk[2]].map(q => [q[0] * 0.95, q[1] - 0.006]), k.ink);
      for (const s of [1, -1]) { dot(g, s * 0.034, -o.ND - 0.05, 0.005, '#b9bcc0'); dot(g, s * 0.034, -o.ND - 0.05, 0.0025, '#333');
        line(g, [[s * 0.034, -o.ND - 0.05], [s * 0.04, -o.ND - 0.15], [s * 0.036, -o.ND - 0.25]], tone(k.c, 0.5), 0.005); line(g, [[s * 0.036, -o.ND - 0.25], [s * 0.036, -o.ND - 0.268]], '#b9bcc0', 0.0055); }
    }, ({ body, o, fab, ZF, pair }) => {
      const hood = new THREE.Shape(); hood.moveTo(-0.14, -0.06); hood.bezierCurveTo(-0.155, 0.06, -0.075, 0.1, 0, 0.1); hood.bezierCurveTo(0.075, 0.1, 0.155, 0.06, 0.14, -0.06); hood.lineTo(0.11, -0.22); hood.lineTo(-0.11, -0.22);
      const back = slab(hood, 0.02, fab, 0.012); back.position.z = -ZF - 0.006; body.add(back);
      pair(s => { const sh = new THREE.Shape(); sh.moveTo(s * 0.006, -o.ND - 0.03); sh.quadraticCurveTo(s * 0.075, -o.ND + 0.015, s * (o.NW + 0.004), 0.05);
        sh.lineTo(s * (o.NW + 0.058), 0.02); sh.quadraticCurveTo(s * 0.115, -o.ND - 0.03, s * 0.006, -o.ND - 0.085); return sh; }, 0.008, ZF + 0.001, fab, 0.005);
    }),

    denimJacket: it => top(it, { fabric: 'denim', NW: 0.08, SH: 0.24, CH: 0.275, HEM: 0.255, L: 0.64, neck: 'v', ND: 0.075, rise: 0.04, depth: 0.026, cuff: 0.055, SA: 0.22, CUFF: 0.125, rail: 'low' }, (g, o, k) => {
      const th = '#d49a50', cu = '#b0703a', wb = -o.L + 0.05;
      for (const x of [-0.022, 0.022]) { line(g, [[x, -o.ND + 0.03], [x, -o.L - 0.06]], k.ink, 0.002); stitch(g, [[x * 0.72, -o.ND + 0.03], [x * 0.72, -o.L - 0.06]], th); }
      line(g, [[-k.XW, wb], [k.XW, wb]], k.ink, 0.002); stitch(g, [[-k.XW, wb - 0.006], [k.XW, wb - 0.006]], th); stitch(g, [[-k.XW, -o.L + 0.012], [k.XW, -o.L + 0.012]], th);
      for (const s of [1, -1]) {
        line(g, [[s * 0.022, -0.2], [s * 0.3, -0.2]], k.ink, 0.002); stitch(g, [[s * 0.022, -0.206], [s * 0.3, -0.206]], th);
        const fl = mirror([[0.075, -0.2], [0.19, -0.2], [0.19, -0.237], [0.1325, -0.264], [0.075, -0.237]], s); fill(g, fl, tone(k.c, -0.08)); stitch(g, [...fl, fl[0]], th); button(g, s * 0.1325, -0.243, 0.0075, cu, '#6e4322');
        stitch(g, [[s * 0.087, -0.245], [s * 0.066, wb]], th); stitch(g, [[s * 0.178, -0.245], [s * 0.118, wb]], th);
        stitch(g, [[s * 0.2, -0.47], [s * 0.185, wb]], th);
      }
      for (let y = -o.ND - 0.035; y > wb + 0.03; y -= 0.098) button(g, 0, y, 0.0085, cu, '#6e4322'); button(g, 0, -o.L + 0.026, 0.0085, cu, '#6e4322');
    }, collar({ top: 0.036, out: 0.056, px: 0.108, py: 0.045 })),

    leatherJacket: it => top(it, { fabric: 'leather', NW: 0.08, SH: 0.24, CH: 0.275, HEM: 0.255, L: 0.64, ND: 0.05, rise: 0.03, depth: 0.03, bevel: 0.012, cuff: 0.05, SA: 0.22, CUFF: 0.125, rail: 'low',
      mat: { roughness: 0.4, sheen: 0, clearcoat: 0.3, clearcoatRoughness: 0.45, normalScale: V(0.5, 0.5) } }, (g, o, k) => {
      const seam = pts => { line(g, pts, 'rgba(0,0,0,.6)', 0.0024); line(g, pts.map(q => [q[0] + 0.0022, q[1] - 0.0012]), 'rgba(255,255,255,.14)', 0.0014); };
      seam([[-k.XW, -o.L + 0.045], [k.XW, -o.L + 0.045]]);
      for (const s of [1, -1]) { seam([[s * 0.012, -0.13], [s * 0.3, -0.115]]); seam([[s * 0.125, -0.125], [s * 0.118, -o.L + 0.045]]);
        zip(g, [[s * 0.06, -0.275], [s * 0.115, -0.25]], 0.009); zip(g, [[s * 0.15, -0.5], [s * 0.2, -0.4]], 0.009); }
      zip(g, [[0, -o.ND + 0.01], [0, -o.L - 0.06]]); fill(g, [[-0.004, -o.ND - 0.012], [0.004, -o.ND - 0.012], [0.005, -o.ND - 0.04], [-0.005, -o.ND - 0.04]], '#c9ccd0');
      button(g, 0.03, -o.L + 0.022, 0.006, '#c9ccd0', '#77797c');
    }, bandCollar()),

    bomber: it => top(it, { fabric: 'nylon', NW: 0.082, SH: 0.245, CH: 0.29, HEM: 0.235, L: 0.64, ND: 0.055, rise: 0.03, depth: 0.036, bevel: 0.015, blouse: 0.075, rib: -0.3, cuff: 0.065, SA: 0.24, CUFF: 0.14, rail: 'low',
      mat: { roughness: 0.55, sheen: 0.25, normalScale: V(1, 1) } }, (g, o, k) => {
      hemBand(g, o, k, 0.065); zip(g, [[0, -o.ND + 0.01], [0, -o.L + 0.065]]);
      for (const s of [1, -1]) { const w = [[s * 0.1, -0.52], [s * 0.165, -0.39]]; line(g, w, tone(k.c, -0.3), 0.012); stitch(g, w.map(q => [q[0] + s * 0.011, q[1] - 0.004]), k.ink); button(g, s * 0.14, -0.455, 0.0055, tone(k.c, -0.35), '#22241a');
        stitch(g, [[s * 0.012, -0.03], [s * 0.012, -o.L + 0.07]], k.ink); }
    }, bandCollar('rib')),

    coat: it => top(it, { fabric: 'wool', NW: 0.085, SH: 0.245, CH: 0.28, AH: 0.25, HEM: 0.29, L: 1.05, neck: 'v', ND: 0.3, rise: 0.035, depth: 0.028, bevel: 0.012, SL: 0.64, SA: 0.17, CUFF: 0.13, lining: 0x4a3a2c, rail: 'long' }, (g, o, k) => {
      line(g, [[0.004, -o.ND], [0.03, -o.ND - 0.05], [0.03, -o.L - 0.06]], k.ink, 0.0022);
      for (const y of [-o.ND - 0.05, -o.ND - 0.2, -o.ND - 0.35]) button(g, 0, y, 0.0115, '#4a3524', '#2a1d13');
      for (const s of [1, -1]) { const fl = mirror([[0.09, -0.62], [0.225, -0.62], [0.225, -0.67], [0.09, -0.67]], s); fill(g, fl, tone(k.c, -0.05)); P(g, fl, true); g.strokeStyle = k.ink; g.lineWidth = 0.002; g.stroke(); }
      line(g, [[0.09, -0.285], [0.17, -0.275]], tone(k.c, -0.22), 0.009);
    }, ({ pair, o, fab, ZF }) => pair([[o.NW + 0.004, 0.024], [o.NW + 0.06, -0.012], [0.132, -0.088], [0.09, -0.12], [0.122, -0.16], [0.008, -o.ND + 0.006]], 0.005, ZF + 0.001, fab, 0.003)),

    jeans: it => pants(it, { fabric: 'denim', HO: 0.212, HI: 0.03 }, (g, o, k) => {
      const th = '#d49a50';
      for (const s of [1, -1]) { const gr = g.createRadialGradient(s * 0.12, -0.45, 0.01, s * 0.12, -0.45, 0.3); gr.addColorStop(0, 'rgba(255,255,255,.2)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.save(); g.scale(1, 1.6); g.translate(0, 0.17); g.fillRect(s > 0 ? 0 : -0.3, -0.9, 0.3, 0.9); g.restore();
        const pk = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pk.push([s * (0.085 * (1 - t) * (1 - t) + 2 * 0.1 * t * (1 - t) + 0.24 * t * t), -0.04 * (1 - t) * (1 - t) - 2 * 0.14 * t * (1 - t) - 0.15 * t * t]); }
        stitch(g, pk, th); stitch(g, pk.map(q => [q[0] - s * 0.005, q[1] - 0.005]), th); dot(g, s * 0.087, -0.047, 0.0035, '#b0703a');
        stitch(g, [[s * 0.03, -o.L + 0.018], [s * 0.22, -o.L + 0.018]], th); }
      stitch(g, [[0.15, -0.075], [0.15, -0.12], [0.2, -0.125]], th);
      fly(g, o, k, th); button(g, 0.006, -0.02, 0.0085, '#b0703a', '#6e4322');
    }),
    chinos: it => pants(it, { fabric: 'twill', HO: 0.2, HI: 0.036 }, (g, o, k) => {
      for (const s of [1, -1]) line(g, [[s * 0.125, -0.04], [s * 0.228, -0.19]], k.ink, 0.002);
      fly(g, o, k, k.ink); button(g, 0.006, -0.02, 0.0065, tone(k.c, -0.45), tone(k.c, -0.6));
    }),
    dressPants: it => pants(it, { fabric: 'wool', HO: 0.208, HI: 0.03 }, (g, o, k) => {
      for (const s of [1, -1]) { line(g, [[s * 0.125, -0.04], [s * 0.228, -0.19]], k.ink, 0.002);
        line(g, [[s * 0.098, -0.05], [s * 0.118, -o.L]], 'rgba(255,255,255,.2)', 0.0028); line(g, [[s * 0.098 + 0.003, -0.05], [s * 0.118 + 0.003, -o.L]], 'rgba(0,0,0,.3)', 0.002); }
      fly(g, o, k, k.ink); fill(g, [[-0.002, -0.006], [0.05, -0.006], [0.056, -0.02], [0.05, -0.034], [-0.002, -0.034]], tone(k.c, 0.06)); line(g, [[0.05, -0.006], [0.056, -0.02], [0.05, -0.034]], k.ink);
    }),
  };

  /* --------------------------------------------------------------- trousers */
  // y = 0 at the top of the waistband; they hang full length from a clip hanger.
  function fly(g, o, k, th) {
    line(g, [[-k.XW, -0.04], [k.XW, -0.04]], k.ink, 0.002); line(g, [[0, -0.04], [0, -o.RISE]], k.ink, 0.002);
    const j = []; for (let i = 0; i <= 10; i++) { const t = i / 10; j.push([0.034 * (1 - t * t), -0.15 - 0.06 * t]); }
    stitch(g, [[0.034, -0.04], ...j], th);
    for (const x of [-0.17, -0.075, 0.075, 0.17]) { fill(g, [[x - 0.006, 0.01], [x + 0.006, 0.01], [x + 0.006, -0.05], [x - 0.006, -0.05]], tone(k.c, -0.1)); P(g, [[x - 0.006, 0.01], [x - 0.006, -0.05], [x + 0.006, -0.05], [x + 0.006, 0.01]]); g.strokeStyle = k.ink; g.lineWidth = 0.0014; g.stroke(); }
  }
  function pants(it, p, paint) {
    const o = { W: 0.19, HIP: 0.232, RISE: 0.27, L: 1.02, HO: 0.21, HI: 0.028, depth: 0.018, bevel: 0.009, fabric: 'twill', ...p }, DROP = HOOK + 0.05;
    const c = it.colour, tile = weave(c, o.fabric), fab = cloth(tileTex(tile), c);
    const root = new THREE.Group(), body = new THREE.Group(); body.position.y = -DROP; root.add(body);
    const sh = new THREE.Shape(); sh.moveTo(-o.W, 0); sh.lineTo(o.W, 0); sh.quadraticCurveTo(o.HIP + 0.004, -0.08, o.HIP, -0.2); sh.lineTo(o.HO, -o.L); sh.lineTo(o.HI, -o.L);
    sh.lineTo(0.007, -o.RISE); sh.lineTo(-0.007, -o.RISE); sh.lineTo(-o.HI, -o.L); sh.lineTo(-o.HO, -o.L); sh.lineTo(-o.HIP, -0.2); sh.quadraticCurveTo(-o.HIP - 0.004, -0.08, -o.W, 0);
    const XW = o.HIP + 0.04, k = { c, tile, XW, ink: isDark(c) ? 'rgba(255,255,255,.17)' : 'rgba(0,0,0,.26)' };
    body.add(slab(sh, o.depth, [fab, cloth(panel(tile, XW, -o.L - 0.04, 0.03, g => paint(g, o, k)), c)], o.bevel));
    const box = (w, h, d, x, y, z = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), steel); m.position.set(x, y, z); body.add(m); };
    box(0.33, 0.007, 0.007, 0, 0.046); for (const s of [1, -1]) box(0.028, 0.056, o.depth + 2 * o.bevel + 0.01, s * 0.14, 0.015);
    hook(body, 0.046, DROP);
    return finish(root, 'long', DROP + o.L);
  }

  return item => { const make = KINDS[item.kind]; if (!make) throw new Error(`clothes.js: no pattern for kind "${item.kind}"`); return make(item); };
};
