/* 1966 Chevrolet C10 Pickup: the 3D model.
   Shared by this car's own page (1966 Chevrolet C10 Pickup.html) and by the garage (index.html).
   build() adds the car, wheels on y = 0 and nose towards +x, to whatever `scene` it is given. */
(window.DREAM_CARS = window.DREAM_CARS || []).push({
  file: '1966 Chevrolet C10 Pickup.html', name: '1966 Chevrolet C10 Pickup', line: 'Stepside short bed · tan · lowered on five-spoke wheels', size: 1.45,
  info: { year: '1966', name: 'CHEVROLET C10', sub: 'STEPSIDE · SHORT BED',
    colour: '#bd9b6c', colourName: 'TAN', colourNote: 'ONE COLOUR, CAB AND BED',
    big: '115', bigLabel: 'INCH WHEELBASE', bigNote: 'LOWERED · FIVE-SPOKE WHEELS', plate: '66 C10', plateBg: '#f3f2ec', plateInk: '#3b2a14' },
  build({ THREE, mergeVertices, scene }) {
/* -------------------------------------------------------------- materials */
const CITRON = 0xb9976a;   // the photo's tan
const DS = THREE.DoubleSide;
const std = (color, roughness = 0.6, metalness = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
const paint = new THREE.MeshPhysicalMaterial({ color: CITRON, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.035, side: DS });
const bonnetBlack = std(0x121212, 0.7, 0, { side: DS });
const chrome = std(0xf3f5f7, 0.045, 1, { side: DS });
const alloy = std(0xb9bcc0, 0.4, 0.8);
const rubber = std(0x0b0b0b, 0.75, 0, { side: DS });
const blackSatin = std(0x0d0d0d, 0.45, 0.4);
const matteBlack = std(0x060606, 0.95, 0, { side: DS });
const vinyl = std(0x141313, 0.55, 0, { side: DS });
const cloth = std(0x37322c, 1);
const carpet = std(0x18181a, 1);
const tyreMat = std(0x17171a, 0.86, 0, { side: DS });
const rimMat = std(0x8f9291, 0.5, 0.55, { side: DS });
const lens = (c, e = 0) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.18, clearcoat: 1, emissive: c, emissiveIntensity: e });
const amber = lens(0xff8a00, 0.12), red = lens(0xc80a0a, 0.12);
// glass: see-through head-on, mirror-like at a glancing angle
function glassMat(opacity) {
  const m = new THREE.MeshPhysicalMaterial({ color: 0x1b2824, roughness: 0.03, metalness: 0, transparent: true, opacity, side: DS, depthWrite: false, envMapIntensity: 0.8 });
  m.onBeforeCompile = s => {
    s.fragmentShader = s.fragmentShader.replace('#include <opaque_fragment>', `
      vec3 gSp = min(totalSpecular, vec3(0.6));
      float gA = clamp(diffuseColor.a + max(gSp.r, max(gSp.g, gSp.b)), 0.0, 1.0);
      gl_FragColor = vec4((totalDiffuse * diffuseColor.a + gSp) / max(gA, 1e-4), gA);`);
  };
  return m;
}
const glass = glassMat(0.34), lampGlass = glassMat(0.1);

const car = new THREE.Group();
scene.add(car);
const mk = (geo, mat, parent = car, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const hinge = (x, y, z) => { const pivot = new THREE.Group(); pivot.position.set(x, y, z); const g = new THREE.Group(); g.position.set(-x, -y, -z); pivot.add(g); car.add(pivot); return { pivot, g }; };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const cyl = (r, h, ax, mat, x, y, z, parent = car, seg = 20) => { const g = new THREE.CylinderGeometry(r, r, h, seg); if (ax === 'x') g.rotateZ(Math.PI / 2); if (ax === 'z') g.rotateX(Math.PI / 2); return mk(g, mat, parent, x, y, z); };

/* ------------------------------------------------------------- dimensions */
// 1966 Chevrolet C10 Stepside, short bed, 115 in wheelbase, lowered. x = forward, y = up, z = right, metres.
// The body is modelled at stock height and the whole truck is then dropped by DROP; the wheels are lifted back by the same amount.
const XF = 2.40, XR = -2.39, HW = 0.99, AXF = 1.60, AXR = -1.32, DROP = 0.17, BW = 0.66, RAIL = 1.11, FX0 = AXR - 0.68, FX1 = AXR + 0.64;
car.position.y = -DROP;
const BELT = 1.16, ROCK = 0.42, RT = 0.08, RC = 0.10, GRT = 0.93, GRB = 0.67;
const DX0 = -0.30, DX1 = 0.88, HOODZ = 0.795, HOODX = 1.09, BEDX = -0.415, BEDY = 0.62, BEDZ = 0.84;
const white = new THREE.MeshPhysicalMaterial({ color: 0xeceae2, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.05, side: DS });
const seatMat = std(0x6e2a14, 0.6, 0, { side: DS }), polished = std(0xe8eaec, 0.14, 1, { side: DS }), engineOrange = std(0xd4501c, 0.55, 0.1);
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const box = (x0, x1, y0, y1, z0, z1, mat, parent = car) => mk(new THREE.BoxGeometry(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)), mat, parent, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

{ // ambient occlusion under the truck, darkest where the tyres touch down (200 px per metre)
  const c = document.createElement('canvas'); c.width = 1240; c.height = 640;
  const g = c.getContext('2d'), far = 3000;
  const soft = (blur, alpha, draw) => { g.shadowColor = `rgba(0,0,0,${alpha})`; g.shadowBlur = blur; g.shadowOffsetX = far; g.fillStyle = '#000'; g.beginPath(); draw(); g.fill(); };
  soft(80, 0.5, () => g.roundRect(620 + XR * 200 + 14 - far, 320 - 186, (XF - XR) * 200 - 28, 372, 50));
  soft(38, 0.5, () => g.roundRect(620 + XR * 200 + 30 - far, 320 - 172, (XF - XR) * 200 - 60, 344, 40));
  for (const x of [AXF, AXR]) for (const sz of [1, -1]) soft(15, 0.95, () => g.ellipse(620 + x * 200 - far, 320 + sz * 0.81 * 200, 36, 26, 0, 0, 7));
  const m = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.003; scene.add(m);
}

/* ---------------------------------------------------------- body surfaces */
// The lower body is a "curtain" hung along a plan-view path: each column runs from the sill (or wheel-arch edge) up to the
// fender / belt line, follows the body's cross-section (a crease at 0.90 m, tucked under at the sill) and rolls over at the top.
const arch = (x, xa) => { const d = Math.abs(x - xa) / 0.47; return d >= 1 ? 0 : 0.44 * Math.pow(1 - Math.pow(d, 2.15), 1 / 2.15); };
const yLow = x => Math.max(x > AXF ? 0.50 : x < AXR ? 0.47 : ROCK, ROCK + arch(x, AXF), ROCK + arch(x, AXR));
const yTop = x => BELT - (0.02 + 0.065 * clamp((x - 1) / 1.35, 0, 1)) * sm(0.94, 1.06, x);
const inset = y => 0.032 * sm(0.955, 0.915, y) + 0.03 * sm(0.62, 0.42, y);   // a ledge below the shoulder, tucked under at the sill
function curtain(path, s, yl = p => yLow(p.x), yt = p => yTop(p.x), NL = 46, NR = 10) {
  const pos = [], idx = [], NV = NL + NR + 1;
  for (const p of path) { const a = yl(p), b = yt(p) - RT;
    for (let j = 0; j < NV; j++) { let y, d;
      if (j <= NL) { y = a + (b - a) * j / NL; d = inset(y); } else { const t = (j - NL) / NR * Math.PI / 2; y = b + RT * Math.sin(t); d = inset(b) + RT * (1 - Math.cos(t)); }
      pos.push(p.x - p.nx * d, y, s * (p.z - p.nz * d)); } }
  for (let i = 0; i < path.length - 1; i++) for (let j = 0; j < NV - 1; j++) { const a = i * NV + j, b = a + NV; s > 0 ? idx.push(a, b, a + 1, a + 1, b, b + 1) : idx.push(a, a + 1, b, a + 1, b + 1, b); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
function surf(nu, nv, f) {   // a gridded surface from f(u, v) -> [x, y, z]
  const pos = [], idx = [];
  for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) pos.push(...f(i / nu, j / nv));
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + nv + 1; idx.push(a, a + 1, b, a + 1, b + 1, b); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
const line = (x0, x1, step = 0.02) => { const n = Math.max(1, Math.round(Math.abs(x1 - x0) / step)); return Array.from({ length: n + 1 }, (_, i) => ({ x: x0 + (x1 - x0) * i / n, z: HW, nx: 0, nz: 1 })); };
const arcP = (cx, cz, r, a0, a1, n = 10) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return { x: cx + r * Math.cos(a), z: cz + r * Math.sin(a), nx: Math.cos(a), nz: Math.sin(a) }; });
const frontZ = (z0, z1, n) => Array.from({ length: n + 1 }, (_, i) => ({ x: XF, z: z0 + (z1 - z0) * i / n, nx: 1, nz: 0, front: true }));
const cabRearPath = line(BEDX + 0.03, DX0 - 0.004), doorPath = line(DX0 + 0.004, DX1 - 0.004);
const fenderPath = [...line(DX1 + 0.004, XF - RC), ...arcP(XF - RC, HW - RC, RC, Math.PI / 2, 0).slice(1), ...frontZ(HW - RC, 0.8851, 1).slice(1), ...frontZ(0.8849, HOODZ + 0.004, 3)];
const fenderYl = p => p.front ? (p.z < 0.885 ? GRT : 0.50) : yLow(p.x);

const zO = y => 0.915 - 0.16 * (y - BELT);   // the cab leans in above the belt line
function sidePiece(pts, holes, s, mat, parent = car, depth = 0.04, zoff = 0) {
  const sh = new THREE.Shape(pts.map(p => new THREE.Vector2(p[0], p[1])));
  for (const h of holes) sh.holes.push(new THREE.Path(h.map(p => new THREE.Vector2(p[0], p[1]))));
  const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false }), a = g.attributes.position;
  for (let i = 0; i < a.count; i++) a.setZ(i, s * (zO(a.getY(i)) - zoff - a.getZ(i)));
  g.computeVertexNormals(); return mk(g, mat, parent);
}
function insetPoly(P, d) {   // convex polygons only
  const n = P.length; let area = 0;
  for (let i = 0; i < n; i++) area += P[i][0] * P[(i + 1) % n][1] - P[(i + 1) % n][0] * P[i][1];
  const sg = area > 0 ? 1 : -1;
  const L = P.map((p, i) => { const q = P[(i + 1) % n], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [p[0] - dy / l * sg * d, p[1] + dx / l * sg * d, dx, dy]; });
  return P.map((_, i) => { const a = L[(i + n - 1) % n], b = L[i], t = ((b[0] - a[0]) * b[3] - (b[1] - a[1]) * b[2]) / (a[2] * b[3] - a[3] * b[2]); return [a[0] + a[2] * t, a[1] + a[3] * t]; });
}
const rbox = (w, h, d, r) => { const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: r * 0.5, bevelSize: r * 0.5, bevelSegments: 3, curveSegments: 6, steps: 30 }).translate(0, 0, -d / 2); };

/* ------------------------------------------------------------ fixed body */
for (const s of [1, -1]) {
  mk(curtain(cabRearPath, s), paint); mk(curtain(fenderPath, s, fenderYl), paint);
  // fender top beside the hood
  mk(surf(40, 4, (u, v) => { const x = 1.0 + (XF - RC - 1.0) * u; return [x, yTop(x), s * (HOODZ + 0.004 + (0.915 - HOODZ - 0.004) * v)]; }), paint);
  // cab side: windscreen pillar, roof rail and rear pillar around the door opening
  sidePiece([[0.99, BELT], [0.89, BELT], [0.475, 1.63], [0.525, 1.68]], [], s, paint);
  sidePiece([[0.525, 1.68], [0.475, 1.63], [-0.30, 1.63], [-0.39, 1.68]], [], s, paint);
  sidePiece([[-0.30, BELT], [-0.30, 1.63], [-0.39, 1.68], [-0.41, BELT]], [], s, paint);
  // stepside bed: flat box side with a rolled top rail, a separate rear fender, and a step ahead of it
  box(XR + 0.03, BEDX, 0.47, RAIL, s * (BW - 0.03), s * BW, paint);
  cyl(0.032, BEDX - XR - 0.03, 'x', paint, (XR + 0.03 + BEDX) / 2, RAIL, s * (BW + 0.004));
  box(XR + 0.03, BEDX, 0.85, 0.868, s * BW, s * (BW + 0.008), paint);
  for (const x of [XR + 0.10, BEDX - 0.07]) box(x - 0.035, x + 0.035, 0.70, RAIL - 0.03, s * BW, s * (BW + 0.022), paint);
  mk(surf(56, 30, (u, v) => { const U = u * 2 - 1, x = (FX0 + FX1) / 2 + U * (FX1 - FX0) / 2, e = Math.pow(1 - Math.pow(Math.abs(U), 2.7), 1 / 2.7);
    const T = 0.50 + 0.50 * e, zo = BW + 0.305 * Math.pow(e, 0.55), B = Math.min(T, Math.max(0.47, ROCK + arch(x, AXR) * 1.02));
    const a = v * Math.PI / 2; return [x, B + (T - B) * Math.pow(Math.cos(a), 0.6), s * (BW + (zo - BW) * Math.pow(Math.sin(a), 0.6))]; }), paint);
  box(FX1 - 0.06, BEDX + 0.02, 0.465, 0.50, s * BW, s * 0.955, paint);
  box(FX1 - 0.06, BEDX + 0.02, 0.40, 0.47, s * (BW + 0.02), s * BW, paint);
  // tail lamp on a short stalk
  box(XR + 0.02, XR + 0.07, 0.80, 0.83, s * BW, s * (BW + 0.07), blackSatin);
  cyl(0.052, 0.05, 'x', chrome, XR + 0.045, 0.815, s * (BW + 0.105), car, 28); cyl(0.044, 0.01, 'x', red, XR + 0.017, 0.815, s * (BW + 0.105), car, 28);
  // inner wheel housings
  for (const x of [AXF]) {
    mk(new THREE.CylinderGeometry(0.52, 0.52, 0.36, 40, 1, true, Math.PI / 2, Math.PI).rotateX(Math.PI / 2), matteBlack, car, x, 0.38, s * 0.79);
    const d = mk(new THREE.CircleGeometry(0.52, 40, 0, Math.PI), matteBlack, car, x, 0.38, s * 0.61); d.rotation.y = s > 0 ? 0 : Math.PI;
  }
}
// cowl between hood and windscreen
mk(surf(4, 20, (u, v) => { const x = 0.97 + (HOODX - 0.004 - 0.97) * u; return [x, yTop(x), (v * 2 - 1) * (HOODZ + 0.004)]; }), paint);
// roof: a softly crowned panel with rolled edges
mk(surf(40, 40, (u, v) => { const a = Math.sin((u - 0.5) * Math.PI), b = Math.sin((v - 0.5) * Math.PI);
  const h = Math.pow(1 - Math.pow(Math.abs(a), 4), 0.25) * Math.pow(1 - Math.pow(Math.abs(b), 4), 0.25);
  return [0.085 + a * 0.505, 1.662 + 0.085 * h, b * 0.848]; }), paint);
// windscreen, gently wrapped
mk(surf(20, 6, (u, v) => { const z = u * 2 - 1, zm = 0.89 - 0.078 * v; return [1.0 - 0.49 * v + 0.065 * (1 - z * z), BELT + 0.005 + 0.505 * v, z * zm]; }), glass);
{ // back of the cab: lower panel, upper panel with the rear window
  box(BEDX + 0.005, BEDX + 0.03, ROCK, BELT, -0.91, 0.91, paint);
  const sh = new THREE.Shape([[-0.915, BELT], [0.915, BELT], [0.835, 1.675], [-0.835, 1.675]].map(p => new THREE.Vector2(...p)));
  const h = new THREE.Path(), r = 0.06, z0 = -0.62, z1 = 0.62, y0 = 1.25, y1 = 1.60;
  h.moveTo(z0 + r, y0); h.lineTo(z1 - r, y0); h.quadraticCurveTo(z1, y0, z1, y0 + r); h.lineTo(z1, y1 - r); h.quadraticCurveTo(z1, y1, z1 - r, y1); h.lineTo(z0 + r, y1); h.quadraticCurveTo(z0, y1, z0, y1 - r); h.lineTo(z0, y0 + r); h.quadraticCurveTo(z0, y0, z0 + r, y0);
  sh.holes.push(h);
  mk(new THREE.ExtrudeGeometry(sh, { depth: 0.03, bevelEnabled: false }).rotateY(-Math.PI / 2), paint, car, BEDX + 0.035, 0, 0);
  mk(new THREE.PlaneGeometry(1.26, 0.37).rotateY(Math.PI / 2), glass, car, BEDX + 0.02, 1.425, 0);
}
// bed: front wall, wood floor with steel strips, roll pan under the tailgate
box(BEDX - 0.035, BEDX - 0.005, 0.56, RAIL, -BW, BW, paint);
box(XR + 0.04, BEDX, BEDY - 0.03, BEDY, -BW + 0.03, BW - 0.03, paint);
{ const t = canvasTex(1024, 1024, (g, w, h) => { g.fillStyle = '#8a5a2e'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) { g.fillStyle = `hsl(28, 48%, ${30 + (i * 37 % 9)}%)`; g.fillRect(0, i * 128 + 6, w, 116);
      for (let k = 0; k < 60; k++) { g.fillStyle = `rgba(40,20,5,${0.05 + Math.random() * 0.08})`; g.fillRect(Math.random() * w, i * 128 + 6 + Math.random() * 116, 80 + Math.random() * 300, 1.5); } }
    for (let i = 0; i <= 8; i++) { g.fillStyle = '#b9bcc0'; g.fillRect(0, i * 128 - 7, w, 14); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, i * 128 + 6, w, 2); } });
  mk(new THREE.PlaneGeometry(BEDX - XR - 0.05, 2 * (BW - 0.03)).rotateX(-Math.PI / 2), std(0xffffff, 0.6, 0, { map: t }), car, (BEDX + XR + 0.05) / 2, BEDY + 0.002, 0); }
box(XR + 0.01, XR + 0.05, 0.54, BEDY, -BW, BW, paint);
// floor pans, firewall and chassis
box(BEDX, XF - 0.15, 0.43, 0.455, -0.82, 0.82, matteBlack); box(XR + 0.1, BEDX, 0.50, 0.56, -BW + 0.02, BW - 0.02, matteBlack);
box(BEDX, 1.0, 0.44, 0.47, -0.9, 0.9, carpet);
box(0.985, 1.0, 0.44, 1.12, -0.9, 0.9, matteBlack);
for (const s of [1, -1]) box(XR + 0.15, XF - 0.2, 0.42, 0.50, s * 0.36, s * 0.43, blackSatin);
cyl(0.045, 1.5, 'z', blackSatin, AXR, 0.355 + DROP, 0); mk(new THREE.SphereGeometry(0.13, 20, 14), blackSatin, car, AXR, 0.355 + DROP, 0);
cyl(0.035, 1.5, 'z', blackSatin, AXF, 0.30 + DROP, 0);
cyl(0.03, 1.6, 'x', std(0x5a5550, 0.6, 0.6), -0.9, 0.44, 0.25);

/* ------------------------------------------------------------- front end */
{ // grille: bright frame and horizontal bars, with a headlamp in a rectangular bezel at each end
  const GW = 0.885, ym = (GRT + GRB) / 2;
  mk(new THREE.PlaneGeometry(2 * GW, GRT - GRB).rotateY(Math.PI / 2), matteBlack, car, XF - 0.07, ym, 0);
  box(XF - 0.07, XF - 0.02, GRT - 0.004, GRT + 0.004, -GW, GW, matteBlack);
  const ring = (w, h, t, d, hole) => { const sh = new THREE.Shape([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(p => new THREE.Vector2(...p)));
    sh.holes.push(hole || new THREE.Path([[-w / 2 + t, -h / 2 + t], [w / 2 - t, -h / 2 + t], [w / 2 - t, h / 2 - t], [-w / 2 + t, h / 2 - t]].map(p => new THREE.Vector2(...p))));
    return new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 40 }).rotateY(Math.PI / 2); };
  mk(ring(2 * GW - 0.01, GRT - GRB, 0.02, 0.02), chrome, car, XF - 0.03, ym, 0);
  for (let i = 0; i < 5; i++) mk(rbox(0.022, 0.016, 1.26, 0.005), i === 2 ? chrome : alloy, car, XF - 0.03, GRB + 0.045 + i * (GRT - GRB - 0.09) / 4, 0);
  for (const z of [-0.42, 0, 0.42]) box(XF - 0.05, XF - 0.035, GRB + 0.02, GRT - 0.02, z - 0.006, z + 0.006, alloy);
  for (const s of [1, -1]) {
    const z = s * 0.755;
    mk(ring(0.245, GRT - GRB - 0.03, 0, 0.022, new THREE.Path().absarc(0, 0, 0.093, 0, Math.PI * 2, true)), chrome, car, XF - 0.03, ym, z);
    mk(new THREE.TorusGeometry(0.089, 0.008, 12, 48).rotateY(Math.PI / 2), chrome, car, XF - 0.004, ym, z);
    mk(new THREE.SphereGeometry(0.086, 40, 20).scale(0.42, 1, 1), std(0xffffff, 0.08, 1, { envMapIntensity: 1.6 }), car, XF - 0.045, ym, z);
    mk(new THREE.SphereGeometry(0.088, 40, 20).scale(0.3, 1, 1), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.14, roughness: 0.05, depthWrite: false }), car, XF - 0.022, ym, z);
  }
  box(XF - 0.06, XF - 0.012, 0.50, GRB + 0.004, -GW, GW, paint);   // valance
}
function bumper(x, dir) {
  const g = rbox(0.075, 0.15, 2.04, 0.03), a = g.attributes.position;
  for (let i = 0; i < a.count; i++) { const t = Math.abs(a.getZ(i)) / 1.02; a.setX(i, a.getX(i) - dir * 0.10 * t * t * t * t); }
  g.computeVertexNormals(); mk(g, chrome, car, x, 0.565, 0);
  for (const s of [1, -1]) box(x - dir * 0.02 - 0.03, x - dir * 0.02 + 0.03 - dir * 0.08, 0.50, 0.56, s * 0.42, s * 0.47, blackSatin);
}
bumper(XF + 0.065, 1); bumper(XR - 0.065, -1);
{ const t = canvasTex(620, 320, (g, w, h) => { g.fillStyle = '#f3f2ec'; g.beginPath(); g.roundRect(0, 0, w, h, 26); g.fill(); g.strokeStyle = '#16335c'; g.lineWidth = 10; g.beginPath(); g.roundRect(14, 14, w - 28, h - 28, 18); g.stroke();
    g.fillStyle = '#16335c'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 170px Arial, Helvetica, sans-serif'; g.fillText('66 C10', w / 2, h / 2 + 12); });
  mk(new THREE.PlaneGeometry(0.31, 0.16).rotateY(-Math.PI / 2), std(0xffffff, 0.5, 0, { map: t }), car, XR - 0.108, 0.565, 0); }

/* ------------------------------------------------------------- hood, tailgate */
const hood = hinge(HOODX, yTop(HOODX), 0);
{ const xe = XF - RT - 0.001;
  mk(surf(46, 40, (u, v) => { const x = HOODX + (xe - HOODX) * u, z = (v * 2 - 1) * HOODZ, zn = z / HOODZ, f = sm(xe, xe - 0.3, x) * sm(HOODX, HOODX + 0.2, x);
    return [x, yTop(x) + 0.016 * (1 - zn * zn) * f, z]; }), paint, hood.g);
  mk(curtain(frontZ(HOODZ, -HOODZ, 40), 1, () => GRT + 0.006, p => yTop(p.x), 8, 10), paint, hood.g);
  // the slot across the hood's leading edge, with a parking lamp at each end
  box(XF - 0.02, XF + 0.002, 0.95, 0.988, -0.74, 0.74, matteBlack, hood.g);
  for (const s of [1, -1]) box(XF - 0.01, XF + 0.006, 0.953, 0.985, s * 0.60, s * 0.735, amber, hood.g);
  hood.g.userData.action = 'hood';
}
{ // under the hood: a small-block V8
  const none = new THREE.MeshBasicMaterial({ visible: false }), tub = std(0x0a0a0a, 0.9, 0, { side: THREE.BackSide });
  mk(new THREE.BoxGeometry(XF - 0.1 - 1.0, 0.56, 1.58), [tub, tub, none, tub, tub, tub], car, (XF - 0.1 + 1.0) / 2, 0.80, 0);
  box(1.28, 1.92, 0.56, 0.86, -0.22, 0.22, engineOrange);
  for (const s of [1, -1]) { const v = box(1.32, 1.88, 0.86, 0.93, s * 0.14, s * 0.28, chrome); v.rotation.x = s * 0.5;
    cyl(0.03, 0.6, 'x', std(0x3a3632, 0.7, 0.5), 1.6, 0.70, s * 0.33); }
  cyl(0.19, 0.075, 'y', blackSatin, 1.60, 0.99, 0, car, 40); cyl(0.20, 0.012, 'y', chrome, 1.60, 1.033, 0, car, 40); cyl(0.05, 0.08, 'y', alloy, 1.60, 0.92, 0);
  box(2.20, 2.26, 0.58, 1.04, -0.42, 0.42, blackSatin); cyl(0.21, 0.03, 'x', std(0x222222, 0.6, 0.3), 2.12, 0.80, 0, car, 12);
  box(2.0, 2.2, 0.80, 0.98, 0.50, 0.74, std(0x101010, 0.5)); for (const z of [0.56, 0.68]) cyl(0.012, 0.03, 'y', alloy, 2.1, 0.99, z);
  cyl(0.11, 0.12, 'x', blackSatin, 1.08, 0.95, -0.45, car, 24);
}
const gate = hinge(XR + 0.03, BEDY, 0);
{ box(XR + 0.004, XR + 0.054, BEDY, RAIL, -BW + 0.035, BW - 0.035, paint, gate.g);
  const t = canvasTex(2048, 256, (g, w, h) => { g.fillStyle = '#efe3c8'; g.textBaseline = 'middle'; g.font = '700 190px Arial, Helvetica, sans-serif';
    const s = 'CHEVROLET', gap = 60; let tw = 0; for (const ch of s) tw += g.measureText(ch).width + gap; let x = (w - tw + gap) / 2; for (const ch of s) { g.fillText(ch, x, h / 2 + 8); x += g.measureText(ch).width + gap; } });
  mk(new THREE.PlaneGeometry(1.08, 0.135).rotateY(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.5, depthWrite: false }), gate.g, XR + 0.002, 0.90, 0);
  gate.g.userData.action = 'tailgate'; }

/* ------------------------------------------------------------------ doors */
const doors = {};
for (const [k, s] of [['R', 1], ['L', -1]]) {
  const d = hinge(DX1, 0.8, s * (HW - 0.03)), g = d.g;
  mk(curtain(doorPath, s), paint, g);
  const D = [[0.885, BELT], [0.47, 1.625], [-0.295, 1.625], [-0.295, BELT]], I = insetPoly(D, 0.033);
  sidePiece(D, [I], s, paint, g);
  sidePiece(I, [], s, glass, g, 0.004, 0.02);
  sidePiece([[0.50, BELT + 0.03], [0.515, BELT + 0.03], [0.475, 1.60], [0.46, 1.60]], [], s, chrome, g, 0.02, 0.01);
  box(DX0 + 0.02, DX1 - 0.02, ROCK + 0.04, BELT - 0.01, s * 0.875, s * 0.90, seatMat, g);
  box(0.0, 0.42, 0.86, 0.90, s * 0.83, s * 0.875, seatMat, g);
  box(-0.235, -0.12, 1.005, 1.03, s * (HW - 0.012), s * (HW + 0.022), chrome, g); cyl(0.014, 0.012, 'z', chrome, -0.255, 1.017, s * (HW + 0.002), g);
  g.userData.action = 'door' + k; doors[k] = d;
}
cyl(0.034, 0.012, 'z', chrome, -0.345, 1.02, -(HW - 0.012), car, 24);   // fuel filler, driver's side

/* --------------------------------------------------------------- interior */
mk(rbox(0.56, 0.17, 1.58, 0.05), seatMat, car, 0.0, 0.70, 0);
{ const b = mk(rbox(0.15, 0.56, 1.58, 0.05), seatMat, car, -0.24, 0.99, 0); b.rotation.z = 0.13; }
mk(rbox(0.22, 0.17, 1.70, 0.05), std(0x3a1a10, 0.6), car, 0.89, 1.06, 0);
box(0.775, 0.79, 1.0, 1.10, -0.62, -0.22, std(0x0c0c0c, 0.4, 0.2));
{ const col = cyl(0.02, 0.36, 'x', blackSatin, 0.72, 1.07, -0.42); col.rotation.z = 0.32;
  const w = new THREE.Group(); w.position.set(0.56, 1.125, -0.42); w.rotation.z = 0.32; car.add(w);
  mk(new THREE.TorusGeometry(0.2, 0.013, 12, 48).rotateY(Math.PI / 2), std(0x101010, 0.4), w);
  mk(new THREE.BoxGeometry(0.014, 0.03, 0.39), std(0x101010, 0.4), w); mk(new THREE.CylinderGeometry(0.04, 0.045, 0.03, 20).rotateZ(Math.PI / 2), chrome, w); }

/* ----------------------------------------------------------------- wheels */
function wheel(x, s, R, w) {   // polished five-spoke wheel on a low-profile tyre
  const g = new THREE.Group(); g.position.set(x, R + DROP, s * (x > 0 ? 0.82 : 0.80)); if (s < 0) g.rotation.y = Math.PI; car.add(g);
  const lathe = (pts, mat, seg = 72) => mk(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg).rotateX(Math.PI / 2), mat, g);
  const RR = 0.255, h = w / 2;
  lathe([[RR, -h], [RR + 0.03, -h - 0.012], [R - 0.022, -h - 0.006], [R, -h + 0.035], [R, h - 0.035], [R - 0.022, h + 0.006], [RR + 0.03, h + 0.012], [RR, h]], tyreMat);
  lathe([[RR + 0.008, h + 0.006], [RR, h - 0.006], [RR - 0.012, h - 0.03], [RR - 0.016, h - 0.09], [RR - 0.016, -h], [RR, -h - 0.004]], polished);
  const pts = [];
  for (let k = 0; k < 5; k++) { const t = k * 2 * Math.PI / 5 + Math.PI / 2, da = 0.125;
    pts.push([0.245 * Math.cos(t - da), 0.245 * Math.sin(t - da)], [0.245 * Math.cos(t + da), 0.245 * Math.sin(t + da)], [0.088 * Math.cos(t + Math.PI / 5), 0.088 * Math.sin(t + Math.PI / 5)]); }
  mk(new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(p => new THREE.Vector2(...p))), { depth: 0.026, bevelEnabled: true, bevelThickness: 0.009, bevelSize: 0.008, bevelSegments: 3 }), polished, g, 0, 0, h - 0.085);
  mk(new THREE.CylinderGeometry(0.04, 0.046, 0.03, 28).rotateX(Math.PI / 2), chrome, g, 0, 0, h - 0.04);
  mk(new THREE.CylinderGeometry(0.18, 0.18, 0.022, 40).rotateX(Math.PI / 2), std(0x6a6d70, 0.35, 0.9), g, 0, 0, h - 0.12);
  mk(new THREE.BoxGeometry(0.11, 0.07, 0.06), std(0xb01410, 0.4, 0.1), g, 0.02, 0.135, h - 0.12);
  mk(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 24).rotateX(Math.PI / 2), blackSatin, g, 0, 0, -0.02);
}
for (const s of [1, -1]) { wheel(AXF, s, 0.335, 0.235); wheel(AXR, s, 0.355, 0.27); }

car.traverse(o => { if (o.isMesh) { const m = Array.isArray(o.material) ? o.material[0] : o.material; o.castShadow = !m.transparent && !m.alphaTest; o.receiveShadow = !m.transparent; } });
const parts = {
  doorR: { set: v => doors.R.pivot.rotation.y = v * 1.1 },
  doorL: { set: v => doors.L.pivot.rotation.y = -v * 1.1 },
  hood: { set: v => hood.pivot.rotation.z = v * 0.85 },
  tailgate: { set: v => gate.pivot.rotation.z = v * Math.PI / 2 },
};
return { car, parts };
  } });
