/* 1977 Leyland Mini 1000 Mk IV: the 3D model.
   Shared by this car's own page (1977 Leyland Mini 1000 Mark IV.html) and by the garage (index.html).
   build() adds the car, wheels on y = 0 and nose towards +x, to whatever `scene` it is given. */
(window.DREAM_CARS = window.DREAM_CARS || []).push({
  file: '1977 Leyland Mini 1000 Mark IV.html', name: '1977 Leyland Mini 1000 Mk IV', line: 'Citron Green · matte-black bonnet · SLW 287R · 998 cc', size: 1.0,
  info: { year: '1977', name: 'LEYLAND MINI 1000', sub: 'MARK IV · SALOON',
    colour: '#a3b012', colourName: 'CITRON GREEN', colourNote: 'WITH MATTE BLACK BONNET',
    big: '998', bigLabel: 'CUBIC CENTIMETRES', bigNote: 'A-SERIES · FOUR-SPEED MANUAL', plate: 'SLW 287R' },
  build({ THREE, mergeVertices, scene }) {
{ // ambient occlusion under the body, darkest where the tyres touch down (200 px per metre)
  const c = document.createElement('canvas'); c.width = 960; c.height = 560;
  const g = c.getContext('2d'), far = 2000;
  const soft = (blur, alpha, draw) => { g.shadowColor = `rgba(0,0,0,${alpha})`; g.shadowBlur = blur; g.shadowOffsetX = far; g.fillStyle = '#000'; g.beginPath(); draw(); g.fill(); };
  soft(70, 0.55, () => g.roundRect(480 - 295 - far, 280 - 132, 590, 264, 60));
  soft(34, 0.6, () => g.roundRect(480 - 285 - far, 280 - 125, 570, 250, 50));
  for (const sx of [1, -1]) for (const sz of [1, -1]) soft(13, 0.95, () => g.ellipse(480 + sx * 204 - far, 280 + sz * 120, 26, 15, 0, 0, 7));
  const m = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.8), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.003; scene.add(m);
}

/* -------------------------------------------------------------- materials */
const CITRON = 0x949f0a;
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
function rod(a, b, r, mat, parent = car) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A);
  const m = mk(new THREE.CylinderGeometry(r, r, d.length(), 12), mat, parent);
  m.position.copy(A).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return m;
}

/* ------------------------------------------------------- shape utilities */
function roundedShape(pts, r) {
  const s = new THREE.Shape(), n = pts.length;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n], ri = Array.isArray(r) ? r[i] : r;
    if (ri <= 0) { i ? s.lineTo(p1[0], p1[1]) : s.moveTo(p1[0], p1[1]); continue; }
    const v1 = [p0[0] - p1[0], p0[1] - p1[1]], v2 = [p2[0] - p1[0], p2[1] - p1[1]];
    const l1 = Math.hypot(...v1), l2 = Math.hypot(...v2), d = Math.min(ri, l1 / 2, l2 / 2);
    const a = [p1[0] + v1[0] / l1 * d, p1[1] + v1[1] / l1 * d], b = [p1[0] + v2[0] / l2 * d, p1[1] + v2[1] / l2 * d];
    i ? s.lineTo(a[0], a[1]) : s.moveTo(a[0], a[1]);
    s.quadraticCurveTo(p1[0], p1[1], b[0], b[1]);
  }
  s.closePath(); return s;
}
function offsetPoly(pts, d) {            // convex polygon, +d grows it
  const n = pts.length; let area = 0;
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
  const sg = area > 0 ? 1 : -1, out = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const e1 = [p1[0] - p0[0], p1[1] - p0[1]], e2 = [p2[0] - p1[0], p2[1] - p1[1]];
    const l1 = Math.hypot(...e1), l2 = Math.hypot(...e2);
    const n1 = [e1[1] / l1 * sg, -e1[0] / l1 * sg], n2 = [e2[1] / l2 * sg, -e2[0] / l2 * sg];
    const k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1]);
    out.push([p1[0] + (n1[0] + n2[0]) * k, p1[1] + (n1[1] + n2[1]) * k]);
  }
  return out;
}
const rect = (w, h) => [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
function rbox(sx, sy, sz, r) {           // box with softened edges, centred
  const g = new THREE.ExtrudeGeometry(roundedShape(rect(sx, sy), r), { depth: sz - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelOffset: -r, bevelSegments: 3, curveSegments: 6 });
  return g.translate(0, 0, -(sz - 2 * r) / 2);
}
const sdRB = (px, py, hx, hy, r) => { const qx = Math.abs(px) - hx + r, qy = Math.abs(py) - hy + r; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r; };
function sdPoly(v, px, py) {
  let d = (px - v[0][0]) ** 2 + (py - v[0][1]) ** 2, s = 1;
  for (let i = 0, j = v.length - 1; i < v.length; j = i, i++) {
    const ex = v[j][0] - v[i][0], ey = v[j][1] - v[i][1], wx = px - v[i][0], wy = py - v[i][1];
    const t = clamp((wx * ex + wy * ey) / (ex * ex + ey * ey), 0, 1), bx = wx - ex * t, by = wy - ey * t;
    d = Math.min(d, bx * bx + by * by);
    const c1 = py >= v[i][1], c2 = py < v[j][1], c3 = ex * wy > ey * wx;
    if ((c1 && c2 && c3) || (!c1 && !c2 && !c3)) s = -s;
  }
  return s * Math.sqrt(d);
}

/* ------------------------------------- per-pixel cut-outs (shader helpers) */
const f3 = v => v.toFixed(4);
const v2 = p => `vec2(${f3(p[0])}, ${f3(p[1])})`;
const GLSL_FN = `
varying vec3 vOP;
float sdRB(vec2 p, vec2 h, float r) { vec2 q = abs(p) - h + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float sdQuad(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d) {
  vec2 v[4]; v[0] = a; v[1] = b; v[2] = c; v[3] = d;
  float dd = dot(p - v[0], p - v[0]); float s = 1.0;
  for (int i = 0, j = 3; i < 4; j = i, i++) {
    vec2 e = v[j] - v[i]; vec2 w = p - v[i];
    vec2 bb = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
    dd = min(dd, dot(bb, bb));
    bvec3 cnd = bvec3(p.y >= v[i].y, p.y < v[j].y, e.x * w.y > e.y * w.x);
    if (all(cnd) || all(not(cnd))) s = -s;
  }
  return s * sqrt(dd);
}`;
function inject(mat, mask, shade = {}, defines = null) {
  if (defines) mat.defines = Object.assign({}, mat.defines || {}, defines);
  mat.onBeforeCompile = s => {
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvOP = position;');
    let f = s.fragmentShader.replace('#include <common>', '#include <common>\n' + GLSL_FN).replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\n' + mask);
    if (shade.color) f = f.replace('#include <color_fragment>', '#include <color_fragment>\n' + shade.color);
    if (shade.rough) f = f.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n' + shade.rough);
    if (shade.coat) f = f.replace('#include <lights_physical_fragment>', '#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\n' + shade.coat + '\n#endif');
    s.fragmentShader = f;
  };
  mat.customProgramCacheKey = () => mask + JSON.stringify(shade) + JSON.stringify(defines);
  return mat;
}
const depthFor = (mask, defines) => inject(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: DS }), mask, {}, defines);

/* ---------------------------------------------- lower body: lofted sections
   x = forward, y = up, z = car's right (UK driver's side). Units: metres.   */
const XF = 1.47, XR = -1.48, WHEEL_X = 1.02, WHEEL_R = 0.243, ARCH_R = 0.305;
const DOOR = { x0: -0.36, x1: 0.50, yb: 0.24, zin: 0.57 };
const BON = { cx: 0.9785, hx: 0.4585, hz: 0.56, r: 0.035, rF: 0.13 };   // wide at the scuttle, big rounded corners at the nose
const bonK = x => { const t = Math.min(1, Math.max(0, (x - 0.45) / 1.05)); return 1 - 0.25 * t * t * (3 - 2 * t); };   // bonnet narrows towards the nose
const BOOT = { cx: -1.32, hx: 0.13, hz: 0.40, r: 0.04 };
const GAP = 0.004;
const keys = {
  yt: [[-1.48, 0.45], [-1.45, 0.48], [-1.25, 0.79], [-1.17, 0.85], [-1.10, 0.865], [0.45, 0.865], [0.52, 0.862], [0.8, 0.852], [1.0, 0.838], [1.2, 0.814], [1.34, 0.786], [1.47, 0.748]],
  yb: [[-1.48, 0.25], [-1.25, 0.19], [-0.8, 0.17], [0.8, 0.17], [1.25, 0.19], [1.47, 0.25]],
  hw: [[-1.48, 0.665], [-1.1, 0.70], [-0.3, 0.705], [0.5, 0.70], [1.47, 0.675]],
  rt: [[-1.48, 0.07], [-1.22, 0.07], [-1.10, 0.03], [0.42, 0.03], [0.56, 0.11], [1.0, 0.13], [1.47, 0.155]],
  crown: [[0.45, 0], [0.62, 0.018], [1.47, 0.03]],
};
function lin(k, x) {
  if (x <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (x <= k[i][0]) { const t = (x - k[i - 1][0]) / (k[i][0] - k[i - 1][0]); return k[i - 1][1] + t * (k[i][1] - k[i - 1][1]); }
  return k[k.length - 1][1];
}
function smooth(k, x, w = 0.05) { let s = 0; for (let i = -4; i <= 4; i++) s += lin(k, x + i * w / 4); return s / 9; }
const sq = (d, R, p) => d >= R ? 1 : d <= 0 ? 0 : Math.pow(1 - Math.pow(1 - d / R, p), 1 / p);
const YM_F = 0.50, YM_R = 0.40;
function P(x) {
  let yt = smooth(keys.yt, x), yb = smooth(keys.yb, x), hw = smooth(keys.hw, x), rt = smooth(keys.rt, x, 0.04), crown = smooth(keys.crown, x);
  const df = XF - x, dr = x - XR;
  if (df < 0.3) { hw *= sq(df, 0.20, 3); const e = sq(df, 0.13, 2.4); yt = YM_F + (yt - YM_F) * e; crown *= e; yb = YM_F - (YM_F - yb) * sq(df, 0.10, 2.5); }
  if (dr < 0.3) { hw *= sq(dr, 0.20, 3); yt = YM_R + (yt - YM_R) * sq(dr, 0.05, 2.5); yb = YM_R - (YM_R - yb) * sq(dr, 0.08, 2.5); }
  const h = yt - yb;
  rt = Math.min(rt, hw * 0.9, h * 0.45);
  const rb = Math.min(0.05, hw * 0.9, h * 0.45);
  return { yt, yb, hw, rt, rb, crown };
}
const barrel = y => { const t = (y - 0.55) / 0.35; return 1 - 0.045 * t * t; };   // sides bow out at door-handle height and tuck in towards the sills
function halfSection(p) {              // [z, y] from bottom centre round to top centre
  const { yt, yb, hw, rt, rb, crown } = p, pts = [];
  const NB = 6, NA = 12, NS = 22, NT = 22, NC = 16;
  for (let i = 0; i < NB; i++) pts.push([(hw - rb) * i / NB, yb]);
  for (let i = 0; i < NA; i++) { const a = -Math.PI / 2 + Math.PI / 2 * i / NA; pts.push([hw - rb + rb * Math.cos(a), yb + rb + rb * Math.sin(a)]); }
  for (let i = 0; i < NS; i++) pts.push([hw, yb + rb + (yt - rt - yb - rb) * i / NS]);
  for (let i = 0; i < NT; i++) { const a = Math.PI / 2 * i / NT; pts.push([hw - rt + rt * Math.cos(a), yt - rt + rt * Math.sin(a)]); }
  for (let i = 0; i <= NC; i++) { const u = 1 - i / NC; pts.push([(hw - rt) * u, yt + crown * (1 - u * u)]); }
  return pts.map(([z, y]) => [z * barrel(y), y]);
}
function halfW(p, y) {                 // half-width of a section at height y (-1 if outside)
  const { yt, yb, hw, rt, rb, crown } = p; let z;
  if (y < yb || y > yt + crown) return -1;
  if (y > yt) z = (hw - rt) * Math.sqrt(Math.max(0, 1 - (y - yt) / crown));
  else if (y > yt - rt) { const dy = y - (yt - rt); z = hw - rt + Math.sqrt(Math.max(0, rt * rt - dy * dy)); }
  else if (y < yb + rb) { const dy = yb + rb - y; z = hw - rb + Math.sqrt(Math.max(0, rb * rb - dy * dy)); }
  else z = hw;
  return z * barrel(y);
}
const sideZ = (x, y) => halfW(P(x), y);
const inside = (x, y, z) => halfW(P(x), y) >= Math.abs(z);
function topY(x, z) {                  // height of the upper surface at (x, z)
  const p = P(x), az = Math.abs(z); let lo = p.yt - p.rt, hi = p.yt + p.crown;
  if (halfW(p, hi) >= az) return hi;
  for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; if (halfW(p, m) >= az) lo = m; else hi = m; }
  return lo;
}
function endX(tip, dir, y, z) {         // x of the nose (dir=-1 scanning back) or tail surface
  let x = tip; if (inside(x, y, z)) return x;
  while (!inside(x, y, z) && Math.abs(x - tip) < 1.2) x += dir * 0.004;
  let a = x - dir * 0.004, b = x;
  for (let i = 0; i < 14; i++) { const m = (a + b) / 2; if (inside(m, y, z)) b = m; else a = m; }
  return b;
}
const frontX = (y, z) => endX(XF, -1, y, z);
const rearX = (y, z) => endX(XR, 1, y, z);
function frame(fn, sign, y, z, off = 0) { // matrix: local X = viewer's right, Y = up along surface, Z = outward
  const h = 0.02, x0 = fn(y, z);
  const Ty = new THREE.Vector3((fn(y + h, z) - fn(y - h, z)) / (2 * h), 1, 0).normalize();
  const Tz = new THREE.Vector3((fn(y, z + h) - fn(y, z - h)) / (2 * h), 0, 1).normalize();
  const N = new THREE.Vector3().crossVectors(Ty, Tz).normalize().multiplyScalar(sign);
  const X = new THREE.Vector3().crossVectors(Ty, N).normalize();
  const Y = new THREE.Vector3().crossVectors(N, X);
  return new THREE.Matrix4().makeBasis(X, Y, N).setPosition(x0 + N.x * off, y + N.y * off, z + N.z * off);
}

// the shell: wheel arches, cabin top, door, bonnet and boot apertures are cut per pixel
const LOWER_MASK = `
  float aZ = abs(vOP.z);
  if (aZ > 0.30) {
    vec2 dA = vOP.xy - vec2(${f3(WHEEL_X)}, ${f3(WHEEL_R)}); vec2 dB = vOP.xy - vec2(${f3(-WHEEL_X)}, ${f3(WHEEL_R)});
    float r2 = ${(ARCH_R * ARCH_R).toFixed(5)};
    if (dot(dA, dA) < r2 || dot(dB, dB) < r2) discard;
  }
  if (vOP.y > 0.80 && aZ < 0.655 && vOP.x > -1.10 && vOP.x < 0.45) discard;
  if (aZ > ${f3(DOOR.zin)} && vOP.x > ${f3(DOOR.x0)} && vOP.x < ${f3(DOOR.x1)} && vOP.y > ${f3(DOOR.yb)}) discard;
  if (vOP.y > 0.6 && sdRB(vec2(vOP.x - ${f3(BON.cx)}, vOP.z / (1.0 - 0.25 * smoothstep(0.45, 1.5, vOP.x))), vec2(${f3(BON.hx)}, ${f3(BON.hz)}), vOP.x > ${f3(BON.cx)} ? ${f3(BON.rF)} : ${f3(BON.r)}) < 0.0) discard;
  if (vOP.y > 0.42 && sdRB(vec2(vOP.x - ${f3(BOOT.cx)}, vOP.z), vec2(${f3(BOOT.hx)}, ${f3(BOOT.hz)}), ${f3(BOOT.r)}) < 0.0) discard;`;
const lowerMask = p => {
  const aZ = Math.abs(p.z);
  if (aZ > 0.30 && Math.min((p.x - WHEEL_X) ** 2, (p.x + WHEEL_X) ** 2) + (p.y - WHEEL_R) ** 2 < ARCH_R * ARCH_R) return false;
  if (p.y > 0.80 && aZ < 0.655 && p.x > -1.10 && p.x < 0.45) return false;
  if (aZ > DOOR.zin && p.x > DOOR.x0 && p.x < DOOR.x1 && p.y > DOOR.yb) return false;
  if (p.y > 0.6 && sdRB(p.x - BON.cx, p.z / bonK(p.x), BON.hx, BON.hz, p.x > BON.cx ? BON.rF : BON.r) < 0) return false;
  if (p.y > 0.42 && sdRB(p.x - BOOT.cx, p.z, BOOT.hx, BOOT.hz, BOOT.r) < 0) return false;
  return true;
};
{
  const xs = [], nE = 36, RE = 0.3;
  for (let i = 0; i <= nE; i++) xs.push(XR + RE * (1 - Math.cos(Math.PI / 2 * i / nE)));
  for (let x = XR + RE + 0.0125; x < XF - RE - 0.001; x += 0.0125) xs.push(x);
  for (let i = nE; i >= 0; i--) xs.push(XF - RE * (1 - Math.cos(Math.PI / 2 * i / nE)));
  const pos = []; let M = 0, N = 0;
  for (const x of xs) {
    const h = halfSection(P(x)); N = h.length; M = 2 * N - 2;
    for (let j = 0; j < N; j++) pos.push(x, h[j][1], h[j][0]);
    for (let j = N - 2; j >= 1; j--) pos.push(x, h[j][1], -h[j][0]);
  }
  let idx = [];
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < M; j++) {
    const a = i * M + j, b = i * M + (j + 1) % M, c = (i + 1) * M + j, d = (i + 1) * M + (j + 1) % M;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const probe = (xs.length >> 1) * M + N - 1;
  if (g.attributes.normal.getY(probe) < 0) {
    for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
    g.setIndex(idx); g.computeVertexNormals();
  }
  const nrm = g.attributes.normal;
  for (let j = 0; j < M; j++) { nrm.setXYZ(j, -1, 0, 0); nrm.setXYZ((xs.length - 1) * M + j, 1, 0, 0); }
  const bodyMat = inject(paint.clone(), LOWER_MASK, {
    color: `if (!gl_FrontFacing) diffuseColor.rgb = (vOP.x > -1.0 && vOP.x < 0.5) ? vec3(0.018) : diffuseColor.rgb * 0.6;`,
    rough: `if (!gl_FrontFacing) roughnessFactor = 0.85;`,
    coat: `if (!gl_FrontFacing) material.clearcoat = 0.0;`,
  });
  const shell = mk(g, bodyMat);
  shell.customDepthMaterial = depthFor(LOWER_MASK);
  shell.userData.mask = lowerMask;
}

/* --------------------------- thick panels generated from the same surface */
function gridPanel(nu, nv, fOut, fIn, t = 0.02) {
  const W = nu + 1, pos = [], idx = [], ip = [];
  for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) pos.push(...fOut(i / nu, j / nv));
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * W + i; idx.push(a, a + 1, a + W, a + 1, a + W + 1, a + W); }
  const geo = p => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
  const outer = geo(pos);
  if (fIn) { for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) ip.push(...fIn(i / nu, j / nv)); }
  else { const n = outer.attributes.normal; for (let k = 0; k < n.count; k++) { const s = n.getY(k) > 0 ? -t : t; ip.push(pos[3 * k] + n.getX(k) * s, pos[3 * k + 1] + n.getY(k) * s, pos[3 * k + 2] + n.getZ(k) * s); } }
  const inner = geo(ip);
  const ring = [];
  for (let i = 0; i <= nu; i++) ring.push(i);
  for (let j = 1; j <= nv; j++) ring.push(j * W + nu);
  for (let i = nu - 1; i >= 0; i--) ring.push(nv * W + i);
  for (let j = nv - 1; j >= 1; j--) ring.push(j * W);
  const sp = [], si = [], R = ring.length;
  for (const k of ring) sp.push(pos[3 * k], pos[3 * k + 1], pos[3 * k + 2], ip[3 * k], ip[3 * k + 1], ip[3 * k + 2]);
  for (let k = 0; k < R; k++) { const a = 2 * k, b = 2 * ((k + 1) % R); si.push(a, b, a + 1, b, b + 1, a + 1); }
  const skirt = new THREE.BufferGeometry(); skirt.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); skirt.setIndex(si); skirt.computeVertexNormals();
  return { outer, inner, skirt };
}
function topPanelMap({ cx, hx, hz, r, rF = r }, kf = null) {  // unit square -> rounded rectangle on the upper surface
  hx -= GAP; hz -= GAP; r -= GAP; rF -= GAP;
  return (u, v) => {
    const px = (2 * u - 1) * hx, pz = (2 * v - 1) * hz, rr = px > 0 ? rF : r, ix = clamp(px, -(hx - rr), hx - rr), iz = clamp(pz, -(hz - rr), hz - rr);
    let dx = px - ix, dz = pz - iz; const l = Math.hypot(dx, dz);
    if (l > 1e-9) { const m = Math.max(Math.abs(dx), Math.abs(dz)) / l; dx *= m; dz *= m; }
    const x = cx + ix + dx, z = (iz + dz) * (kf ? kf(x) : 1); return [x, topY(x, z), z];
  };
}

/* ------------------------------------------------------------ greenhouse */
const WG = 0.665, TH = 0.33, WAIST = 0.84;
const tumble = y => 1 - TH * (y - WAIST);
const ghPts = [[0.523, 0.74], [0.22, 1.31], [-0.30, 1.348], [-0.95, 1.31], [-1.156, 0.74]];
const ghR = [0, 0.09, 0.26, 0.09, 0];
const doorWin = [[0.382, 0.868], [0.176, 1.255], [-0.33, 1.255], [-0.33, 0.868]];
const qtrWin = [[-0.41, 0.868], [-0.41, 1.255], [-0.885, 1.255], [-1.025, 0.868]];
const WIN_R = 0.03, doorIn = offsetPoly(doorWin, -WIN_R), qtrIn = offsetPoly(qtrWin, -WIN_R);
const faceOf = (A, B, c, h, r) => { const L = Math.hypot(B[0] - A[0], B[1] - A[1]), u = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], o = A[0] > 0 ? 1 : -1; return { A, u, n: [o * Math.abs(u[1]), Math.abs(u[0])], c, h, r }; };
const WS = faceOf([0.47, 0.84], [0.22, 1.31], 0.24, [0.575, 0.19], 0.05);       // windscreen opening
const RW = faceOf([-1.12, 0.84], [-0.95, 1.31], 0.23, [0.48, 0.155], 0.07);     // rear window opening
const faceGL = F => `{ vec2 a = vOP.xy - ${v2(F.A)}; if (abs(dot(a, ${v2(F.n)})) < 0.02) dWin = min(dWin, sdRB(vec2(vOP.z / tum, dot(a, ${v2(F.u)}) - ${f3(F.c)}), ${v2(F.h)}, ${f3(F.r)})); }`;
const GH_MASK = `
  if (vOP.y < 0.835) discard;
  float aZ = abs(vOP.z);
  float tum = 1.0 - ${f3(TH)} * (vOP.y - ${f3(WAIST)});
  bool sideFace = aZ > 0.632 * tum;
  float dDoor = 1.0; float dWin = 1.0;
  if (sideFace) {
    dDoor = sdQuad(vOP.xy, ${doorIn.map(v2).join(', ')}) - ${f3(WIN_R)};
    dWin = sdQuad(vOP.xy, ${qtrIn.map(v2).join(', ')}) - ${f3(WIN_R)};
  } else { ${faceGL(WS)} ${faceGL(RW)} }
  #if PART == 0
    if (dWin < 0.0 || dDoor < 0.03) discard;
    float rub = step(dWin, 0.013);
  #else
    if (!sideFace || vOP.z * SIDE < 0.0 || dDoor < 0.0 || dDoor > 0.027) discard;
    float rub = step(dDoor, 0.013);
  #endif`;
const faceJS = (F, p, tum) => { const ax = p.x - F.A[0], ay = p.y - F.A[1]; return Math.abs(ax * F.n[0] + ay * F.n[1]) < 0.02 ? sdRB(p.z / tum, ax * F.u[0] + ay * F.u[1] - F.c, F.h[0], F.h[1], F.r) : 1; };
const ghMask = part => p => {
  if (p.y < 0.835) return false;
  const tum = tumble(p.y), side = Math.abs(p.z) > 0.632 * tum; let dDoor = 1, dWin = 1;
  if (side) { dDoor = sdPoly(doorIn, p.x, p.y) - WIN_R; dWin = sdPoly(qtrIn, p.x, p.y) - WIN_R; }
  else dWin = Math.min(faceJS(WS, p, tum), faceJS(RW, p, tum));
  if (part === 0) return !(dWin < 0 || dDoor < 0.03);
  return side && p.z * (part === 1 ? 1 : -1) > 0 && dDoor >= 0 && dDoor <= 0.027;
};
const ghMat = (part, insideCol) => inject(paint.clone(), GH_MASK, {
  color: `if (rub > 0.5) diffuseColor.rgb = vec3(0.012); else if (!gl_FrontFacing) diffuseColor.rgb = ${insideCol};`,
  rough: `if (rub > 0.5 || !gl_FrontFacing) roughnessFactor = 0.85;`,
  coat: `if (rub > 0.5 || !gl_FrontFacing) material.clearcoat = 0.0;`,
}, { PART: part, SIDE: part === 2 ? '-1.0' : '1.0' });
const ghPart = (geo, part, insideCol, parent) => { const m = mk(geo, ghMat(part, insideCol), parent); m.customDepthMaterial = depthFor(GH_MASK, { PART: part, SIDE: part === 2 ? '-1.0' : '1.0' }); m.userData.mask = ghMask(part); return m; };

let ghGeo = new THREE.ExtrudeGeometry(roundedShape(ghPts, ghR), { depth: 2 * WG - 0.08, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelOffset: -0.04, bevelSegments: 12, curveSegments: 28 });
ghGeo.translate(0, 0, -(WG - 0.04));
ghGeo.deleteAttribute('normal'); ghGeo.deleteAttribute('uv');
ghGeo = mergeVertices(ghGeo, 1e-4);
{ const p = ghGeo.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) * tumble(p.getY(i))); ghGeo.computeVertexNormals(); }
ghPart(ghGeo, 0, 'vec3(0.62, 0.59, 0.50)');   // roof + pillars, cream headlining inside

function sidePane(pts, r, side, mat, parent) {
  const sg = new THREE.ShapeGeometry(roundedShape(pts, r), 10), q = sg.attributes.position;
  for (let i = 0; i < q.count; i++) q.setZ(i, side * (WG - 0.002) * tumble(q.getY(i)));
  sg.computeVertexNormals(); return mk(sg, mat, parent);
}
function facePane(F) {
  const pts = [[-F.h[0], F.c - F.h[1]], [F.h[0], F.c - F.h[1]], [F.h[0], F.c + F.h[1]], [-F.h[0], F.c + F.h[1]]];
  const sg = new THREE.ShapeGeometry(roundedShape(offsetPoly(pts, 0.008), F.r + 0.008), 10), q = sg.attributes.position;
  for (let i = 0; i < q.count; i++) {
    const lz = q.getX(i), s = q.getY(i), y = F.A[1] + F.u[1] * s - F.n[1] * 0.002;
    q.setXYZ(i, F.A[0] + F.u[0] * s - F.n[0] * 0.002, y, lz * tumble(y));
  }
  sg.computeVertexNormals(); return mk(sg, glass);
}
facePane(WS); facePane(RW);
for (const s of [1, -1]) sidePane(offsetPoly(qtrWin, 0.008), WIN_R + 0.008, s, glass, car);

{ // roof gutter / pillar seams
  const prof = roundedShape(offsetPoly(ghPts, -0.006), ghR).getPoints(12).filter(v => v.y > 0.875);
  for (const s of [1, -1]) {
    const pts = []; let last = null;
    for (const v of prof) { const q = new THREE.Vector3(v.x, v.y, s * 0.649 * tumble(v.y)); if (!last || last.distanceTo(q) > 1e-3) { pts.push(q); last = q; } }
    mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.0075, 6), paint);
  }
  // wipers
  const wg = new THREE.Group(); wg.position.set(0.47, 0.84, 0); wg.rotation.z = Math.atan2(0.47, 0.883); car.add(wg);
  for (const zc of [-0.33, 0.12]) {
    const blade = mk(new THREE.BoxGeometry(0.01, 0.012, 0.30), blackSatin, wg, 0.012, 0.085, zc); blade.rotation.x = 0.05;
    const arm = mk(new THREE.BoxGeometry(0.006, 0.008, 0.16), blackSatin, wg, 0.018, 0.055, zc + 0.075); arm.rotation.x = 0.38;
  }
}

/* ------------------------------------------------------------------ doors */
const doors = {};
for (const s of [1, -1]) {
  const key = s > 0 ? 'R' : 'L', H = hinge(DOOR.x1, 0, s * sideZ(DOOR.x1, 0.5));
  H.pivot.userData.action = 'door' + key;
  const x0 = DOOR.x0 + GAP, x1 = DOOR.x1 - GAP, yb = DOOR.yb + GAP;
  const at = (u, v) => { const x = x0 + (x1 - x0) * u, p = P(x), y = yb + (p.yt - 0.0005 - yb) * (1 - Math.pow(1 - v, 1.8)); return [x, y, p]; };
  const gp = gridPanel(72, 48, (u, v) => { const [x, y, p] = at(u, v); return [x, y, s * halfW(p, y)]; }, (u, v) => { const [x, y] = at(u, v); return [x, y, s * DOOR.zin]; });
  mk(gp.outer, paint, H.g); mk(gp.skirt, paint, H.g); mk(gp.inner, vinyl, H.g);
  ghPart(ghGeo, s > 0 ? 1 : 2, 'vec3(0.02)', H.g);                         // window frame
  const paneG = new THREE.Group(); H.g.add(paneG);
  const glassPts = offsetPoly(doorWin, 0.008);
  sidePane(glassPts, WIN_R + 0.008, s, glass, paneG).userData.action = 'win' + key;
  const proxy = sidePane(glassPts, WIN_R + 0.008, s, glass, H.g); proxy.visible = false; proxy.userData = { action: 'win' + key, proxy: true };
  // outside: handle, lock, mirror
  mk(new THREE.BoxGeometry(0.115, 0.02, 0.022), chrome, H.g, -0.25, 0.79, s * (sideZ(-0.25, 0.79) + 0.012));
  mk(new THREE.CylinderGeometry(0.011, 0.011, 0.012, 16).rotateX(Math.PI / 2), chrome, H.g, -0.20, 0.755, s * (sideZ(-0.20, 0.755) + 0.004));
  mk(new THREE.CylinderGeometry(0.007, 0.007, 0.11, 8), chrome, H.g, 0.37, 0.90, s * 0.725).rotation.x = s * 0.9;
  mk(rbox(0.024, 0.07, 0.11, 0.008), chrome, H.g, 0.37, 0.945, s * 0.775);
  if (s > 0) {   // slide bolt and padlock on the driver's door
    const bz = y0 => sideZ(-0.29, y0);
    mk(new THREE.BoxGeometry(0.10, 0.032, 0.006), chrome, H.g, -0.29, 0.705, bz(0.705) + 0.004);
    cyl(0.007, 0.11, 'x', chrome, -0.285, 0.705, bz(0.705) + 0.013, H.g, 10);
    rod([-0.31, 0.705, bz(0.705) + 0.013], [-0.31, 0.69, bz(0.69) + 0.022], 0.005, chrome, H.g);
    mk(new THREE.TorusGeometry(0.012, 0.0035, 8, 20), chrome, H.g, -0.245, 0.69, bz(0.69) + 0.016);
    mk(rbox(0.04, 0.036, 0.018, 0.005), std(0xb08d3c, 0.35, 0.9), H.g, -0.245, 0.662, bz(0.662) + 0.016);
  }
  // inside: bin, pull, release, winder
  const zi = s * (DOOR.zin - 0.012);
  mk(rbox(0.56, 0.13, 0.03, 0.01), std(0x232220, 0.8), H.g, 0.05, 0.36, zi);
  mk(rbox(0.17, 0.028, 0.035, 0.01), vinyl, H.g, 0.06, 0.63, zi);
  mk(new THREE.BoxGeometry(0.06, 0.016, 0.014), chrome, H.g, -0.2, 0.70, zi);
  mk(new THREE.CylinderGeometry(0.016, 0.016, 0.02, 16).rotateX(Math.PI / 2), chrome, H.g, 0.24, 0.54, zi);
  rod([0.24, 0.54, zi - s * 0.012], [0.20, 0.50, zi - s * 0.012], 0.005, chrome, H.g);
  mk(new THREE.SphereGeometry(0.012, 12, 8), blackSatin, H.g, 0.20, 0.50, zi - s * 0.016);
  doors[key] = { pivot: H.pivot, pane: paneG, s };
}

/* ---------------------------------------------------------- bonnet + boot */
const bonnet = hinge(BON.cx - BON.hx, 0.86, 0);
bonnet.pivot.userData.action = 'bonnet';
{ const gp = gridPanel(64, 68, topPanelMap(BON, bonK), null, 0.018); mk(gp.outer, bonnetBlack, bonnet.g); mk(gp.inner, paint, bonnet.g); mk(gp.skirt, paint, bonnet.g); }
const stay = rod([1.34, 0.72, 0.40], [0.852, 1.215, 0.40], 0.005, alloy); stay.visible = false;

const boot = hinge(BOOT.cx - BOOT.hx, 0.475, 0);
boot.pivot.userData.action = 'boot';
{ const gp = gridPanel(32, 60, topPanelMap(BOOT), null, 0.018); mk(gp.outer, paint, boot.g); mk(gp.inner, paint, boot.g); mk(gp.skirt, paint, boot.g); }

/* --------------------------------------------------------- body seams etc */
for (const s of [1, -1]) {
  let pts = [];
  for (let y = 0.27; y <= 0.846; y += 0.03) pts.push(new THREE.Vector3(0.565, y, s * (sideZ(0.565, y) + 0.002)));
  mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.0065, 6), paint);
  pts = [];
  for (let y = 0.30; y <= 0.83; y += 0.03) { const x = rearX(y, 0) + 0.11; pts.push(new THREE.Vector3(x, y, s * (sideZ(x, y) + 0.002))); }
  mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.0065, 6), paint);
  // door jambs (painted) and rear side trim
  mk(new THREE.BoxGeometry(0.014, 0.60, 0.115), paint, car, 0.508, 0.50, s * 0.6225);
  mk(new THREE.BoxGeometry(0.014, 0.61, 0.10), paint, car, -0.371, 0.545, s * 0.62);
  mk(new THREE.BoxGeometry(0.60, 0.64, 0.05), vinyl, car, -0.68, 0.53, s * 0.635);
}
mk(new THREE.CylinderGeometry(0.034, 0.034, 0.045, 24).rotateX(Math.PI / 2), chrome, car, -1.17, 0.74, -(sideZ(-1.17, 0.74) + 0.015));
mk(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 16, 1, true).rotateZ(Math.PI / 2), std(0x555555, 0.4, 0.9, { side: DS }), car, -1.45, 0.215, -0.14);

/* --------------------------------------------------------------- interior */
{
  mk(new THREE.BoxGeometry(1.5, 0.022, 1.30), carpet, car, -0.25, 0.184, 0);            // floor
  mk(new THREE.BoxGeometry(1.4, 0.04, 0.12), carpet, car, -0.2, 0.21, 0);               // tunnel
  mk(new THREE.BoxGeometry(0.012, 0.69, 1.13), vinyl, car, 0.50, 0.515, 0);             // bulkhead, cabin side
  mk(new THREE.BoxGeometry(0.012, 0.69, 1.13), paint, car, 0.512, 0.515, 0);            // bulkhead, engine side
  mk(new THREE.BoxGeometry(0.014, 0.66, 1.30), vinyl, car, -0.995, 0.50, 0);            // rear seat board
  mk(new THREE.BoxGeometry(0.16, 0.014, 1.27), vinyl, car, -1.04, 0.833, 0);            // parcel shelf

  const seat = (prof, rad, w, x, y, z, ins) => {
    const g = new THREE.Group(); g.position.set(x, y, z); car.add(g);
    const geo = new THREE.ExtrudeGeometry(roundedShape(prof, rad), { depth: w - 0.07, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelOffset: -0.035, bevelSegments: 5, curveSegments: 8 });
    mk(geo.translate(0, 0, -(w - 0.07) / 2), vinyl, g);
    for (const [bx, by, sx, sy, rot] of ins) mk(rbox(sx, sy, w - 0.15, 0.006), cloth, g, bx, by, 0).rotation.z = rot;
    return g;
  };
  const front = [[-0.10, 0], [0.47, 0.02], [0.49, 0.13], [0.10, 0.10], [-0.03, 0.60], [-0.13, 0.585]];
  for (const z of [0.31, -0.31]) {
    seat(front, [0.03, 0.03, 0.05, 0.03, 0.04, 0.04], 0.47, -0.30, 0.30, z, [[0.30, 0.119, 0.30, 0.016, 0.077], [0.038, 0.35, 0.016, 0.40, 0.254]]);
    mk(new THREE.BoxGeometry(0.36, 0.11, 0.36), blackSatin, car, -0.10, 0.25, z);
  }
  seat([[-0.05, 0], [0.40, 0.02], [0.42, 0.13], [0.08, 0.10], [0.0, 0.52], [-0.09, 0.51]], [0.03, 0.03, 0.05, 0.03, 0.04, 0.04], 0.88, -0.93, 0.30, 0,
    [[0.25, 0.118, 0.26, 0.016, 0.088], [0.043, 0.31, 0.016, 0.34, 0.188]]);
  mk(new THREE.BoxGeometry(0.40, 0.11, 0.86), blackSatin, car, -0.76, 0.25, 0);

  // dashboard: padded rail, open shelf, central speedometer
  mk(rbox(0.14, 0.06, 1.12, 0.025), vinyl, car, 0.425, 0.828, 0);
  mk(new THREE.BoxGeometry(0.20, 0.015, 1.12), vinyl, car, 0.40, 0.665, 0);
  mk(rbox(0.025, 0.06, 1.12, 0.01), vinyl, car, 0.30, 0.69, 0);
  const pod = mk(new THREE.CylinderGeometry(0.085, 0.085, 0.11, 36).rotateZ(Math.PI / 2), vinyl, car, 0.335, 0.765, 0); pod.scale.z = 1.3;
  {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    g.fillStyle = '#0b0b0b'; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = '#ddd'; g.fillStyle = '#eee'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 19px Arial';
    for (let i = 0; i <= 18; i++) {
      const a = Math.PI * (1.22 - 1.44 * i / 18), cx = Math.cos(a), sy = -Math.sin(a), big = i % 2 === 0;
      g.lineWidth = big ? 4 : 2; g.beginPath(); g.moveTo(128 + cx * 112, 128 + sy * 112); g.lineTo(128 + cx * (big ? 94 : 102), 128 + sy * (big ? 94 : 102)); g.stroke();
      if (big) g.fillText(String(i * 5), 128 + cx * 76, 128 + sy * 76);
    }
    g.font = '13px Arial'; g.fillText('MPH', 128, 176);
    g.strokeStyle = '#ff6a1a'; g.lineWidth = 5; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + Math.cos(Math.PI * 1.22) * 96, 128 - Math.sin(Math.PI * 1.22) * 96); g.stroke();
    g.fillStyle = '#222'; g.beginPath(); g.arc(128, 128, 12, 0, 7); g.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    mk(new THREE.CircleGeometry(0.072, 40).rotateY(-Math.PI / 2), std(0xffffff, 0.35, 0, { map: t }), car, 0.279, 0.765, 0);
    mk(new THREE.TorusGeometry(0.074, 0.005, 8, 40).rotateY(Math.PI / 2), chrome, car, 0.279, 0.765, 0);
  }
  mk(new THREE.BoxGeometry(0.02, 0.045, 0.17), vinyl, car, 0.30, 0.625, 0);
  for (const z of [-0.05, 0, 0.05]) rod([0.29, 0.625, z], [0.272, 0.618, z], 0.004, chrome);

  // steering wheel (right-hand drive)
  const sw = new THREE.Group(); sw.position.set(0.20, 0.80, 0.31); sw.rotation.z = -0.878; car.add(sw);
  mk(new THREE.TorusGeometry(0.19, 0.012, 12, 56).rotateY(Math.PI / 2), blackSatin, sw);
  mk(rbox(0.014, 0.036, 0.375, 0.006), blackSatin, sw, 0.012, 0, 0);
  mk(new THREE.CylinderGeometry(0.042, 0.05, 0.05, 24).rotateZ(Math.PI / 2), blackSatin, sw, 0.02, 0, 0);
  mk(new THREE.CylinderGeometry(0.016, 0.016, 0.44, 12).rotateZ(Math.PI / 2), blackSatin, sw, 0.24, 0, 0);
  mk(rbox(0.11, 0.055, 0.06, 0.012), vinyl, sw, 0.085, 0, 0);
  rod([0.07, 0, 0.03], [0.05, 0.01, 0.15], 0.005, blackSatin, sw);
  rod([0.07, 0, -0.03], [0.05, 0.01, -0.15], 0.005, blackSatin, sw);

  rod([0.20, 0.19, 0], [0.06, 0.52, 0], 0.007, chrome); mk(new THREE.SphereGeometry(0.024, 16, 12), blackSatin, car, 0.06, 0.53, 0);   // gear lever
  rod([-0.27, 0.21, 0], [-0.09, 0.30, 0], 0.008, chrome); rod([-0.14, 0.275, 0], [-0.07, 0.31, 0], 0.013, blackSatin);                 // handbrake
  for (const [z, y] of [[0.22, 0.30], [0.31, 0.31], [0.40, 0.31]]) { rod([0.49, y + 0.12, z], [0.44, y, z], 0.005, blackSatin); mk(new THREE.BoxGeometry(0.012, 0.05, 0.05), rubber, car, 0.437, y, z).rotation.z = 0.4; }
  rod([0.25, 1.28, 0], [0.235, 1.245, 0], 0.005, blackSatin);                                                                         // rear-view mirror
  mk(rbox(0.018, 0.05, 0.20, 0.006), blackSatin, car, 0.232, 1.232, 0); mk(new THREE.BoxGeometry(0.002, 0.04, 0.185), chrome, car, 0.222, 1.232, 0);
}

/* ----------------------------------------------------------------- wheels */
function latheZ(pts, mat) { return new THREE.Mesh(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), 96).rotateX(Math.PI / 2), mat); }
const TYRE = [[0.132, -0.064], [0.2, -0.071], [0.228, -0.067], [0.239, -0.054], [0.243, -0.046], [0.243, -0.03], [0.236, -0.028], [0.236, -0.022], [0.243, -0.02], [0.243, -0.005], [0.236, -0.003],
  [0.236, 0.003], [0.243, 0.005], [0.243, 0.02], [0.236, 0.022], [0.236, 0.028], [0.243, 0.03], [0.243, 0.046], [0.239, 0.054], [0.228, 0.067], [0.2, 0.071], [0.132, 0.064]];
{ // moulded tread blocks and sidewall ribs, as a bump map
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
  g.fillStyle = '#808080'; g.fillRect(0, 0, 512, 512);
  for (const top of [true, false]) {
    const y = v => top ? v : 512 - v;
    g.fillStyle = '#b4b4b4'; g.fillRect(0, Math.min(y(22), y(27)), 512, 5); g.fillRect(0, Math.min(y(78), y(82)), 512, 4);
    g.fillStyle = '#a2a2a2'; for (let x = 12; x < 512; x += 128) g.fillRect(x, Math.min(y(42), y(56)), 76, 14);
    g.fillStyle = '#6a6a6a'; for (let x = 0; x < 512; x += 16) g.fillRect(x, Math.min(y(86), y(96)), 5, 10);
  }
  g.strokeStyle = '#161616'; g.lineWidth = 7; g.lineJoin = 'round';
  for (let x = -64; x < 576; x += 64) { g.beginPath(); g.moveTo(x, 104); g.lineTo(x + 20, 180); g.lineTo(x, 256); g.lineTo(x + 20, 332); g.lineTo(x, 408); g.stroke(); }
  g.lineWidth = 3; for (let x = -32; x < 576; x += 64) { g.beginPath(); g.moveTo(x, 120); g.lineTo(x + 14, 190); g.moveTo(x + 14, 322); g.lineTo(x, 392); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.repeat.set(10, 1); t.anisotropy = 8;
  tyreMat.bumpMap = t; tyreMat.bumpScale = 4;
}
function makeWheel() {                   // axis along z, outer face towards +z
  const w = new THREE.Group();
  w.add(latheZ(TYRE, tyreMat));
  w.add(latheZ([[0.001, 0.03], [0.06, 0.03], [0.085, 0.036], [0.1, 0.018], [0.117, 0.02], [0.128, 0.056], [0.139, 0.069], [0.139, -0.069], [0.001, -0.069]], rimMat));
  mk(new THREE.SphereGeometry(0.052, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.42, 1).rotateX(Math.PI / 2), chrome, w, 0, 0, 0.03);
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; const sl = mk(new THREE.BoxGeometry(0.024, 0.009, 0.003), matteBlack, w, Math.cos(a) * 0.108, Math.sin(a) * 0.108, 0.0195); sl.rotation.z = a + Math.PI / 2; }
  for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + 0.4; mk(new THREE.CylinderGeometry(0.007, 0.007, 0.008, 6).rotateX(Math.PI / 2), chrome, w, Math.cos(a) * 0.068, Math.sin(a) * 0.068, 0.036); }
  return w;
}
const tube = (pts, r, mat, parent = car, closed = false) => mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(q => new THREE.Vector3(...q)), closed, 'centripetal'), Math.max(16, pts.length * 10), r, 8, closed), mat, parent);
function underFrame(map, parent, d, r) {   // pressed inner frame on the underside of a lid
  const at = (u, v) => { const e = 0.01, p = new THREE.Vector3(...map(u, v)), a = new THREE.Vector3(...map(u + e, v)).sub(p), b = new THREE.Vector3(...map(u, v + e)).sub(p), n = a.cross(b).normalize(); if (n.y > 0) n.negate(); return p.addScaledVector(n, d).toArray(); };
  const loop = [], c = [[0.1, 0.1], [0.9, 0.1], [0.9, 0.9], [0.1, 0.9]];
  for (let k = 0; k < 4; k++) for (let i = 0; i < 6; i++) { const A = c[k], B = c[(k + 1) % 4], t = i / 6; loop.push(at(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t)); }
  tube(loop, r, paint, parent, true);
  for (const [A, B] of [[c[0], c[2]], [c[1], c[3]]]) { const q = []; for (let i = 0; i <= 6; i++) q.push(at(A[0] + (B[0] - A[0]) * i / 6, A[1] + (B[1] - A[1]) * i / 6)); tube(q, r * 0.8, paint, parent); }
}
const stripes = (w, h, bg, fg, step, lw, vertical) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; for (let i = 0; i < (vertical ? w : h); i += step) vertical ? g.fillRect(i, 0, lw, h) : g.fillRect(0, i, w, lw); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

/* ------------------------------------------------------------- engine bay
   transverse A-series: radiator and fan on the car's left, clutch on the right,
   plugs and distributor facing the grille, carburettor against the bulkhead  */
{
  const eng = std(0x21503a, 0.55, 0.25), cast = std(0x9a9c98, 0.65, 0.6), rust = std(0x6d4a3a, 1, 0.2), steel = std(0x74787b, 0.45, 0.8), brass = std(0xb08d3c, 0.4, 0.9), copper = std(0xb87333, 0.45, 0.9);
  const white = std(0xe9e6dc, 0.5), ht = std(0x141414, 0.6), redWire = std(0xb3221a, 0.6), clear = std(0xf0efe6, 0.4, 0, { transparent: true, opacity: 0.6 });
  const ex = 0.97;
  // gearbox-in-sump, block, head, rocker cover
  mk(rbox(0.34, 0.17, 0.46, 0.03), cast, car, ex, 0.30, 0.02);
  for (let i = 0; i < 6; i++) mk(new THREE.BoxGeometry(0.348, 0.11, 0.008), cast, car, ex, 0.30, -0.16 + i * 0.07);
  mk(rbox(0.22, 0.19, 0.44, 0.012), eng, car, ex, 0.475, 0.01);
  mk(new THREE.BoxGeometry(0.206, 0.006, 0.436), copper, car, ex, 0.572, 0.01);
  mk(rbox(0.20, 0.085, 0.44, 0.012), eng, car, ex, 0.618, 0.01);
  mk(new THREE.BoxGeometry(0.135, 0.006, 0.37), ht, car, ex, 0.661, 0.03);
  mk(rbox(0.125, 0.07, 0.36, 0.03), eng, car, ex, 0.694, 0.03);
  for (const z of [-0.08, 0.14]) { cyl(0.011, 0.012, 'y', chrome, ex, 0.733, z, car, 6); cyl(0.016, 0.003, 'y', steel, ex, 0.729, z); }
  cyl(0.026, 0.02, 'y', ht, ex, 0.738, 0.03); cyl(0.02, 0.012, 'y', ht, ex, 0.752, 0.03);
  for (const z of [-0.12, 0.01, 0.14]) cyl(0.016, 0.004, 'x', brass, ex + 0.111, 0.47, z);
  // spark plugs, HT leads, distributor, coil
  for (let i = 0; i < 4; i++) {
    const z = -0.15 + i * 0.105, dz = 0.11 + (i - 1.5) * 0.022;
    rod([ex + 0.098, 0.625, z], [ex + 0.13, 0.645, z], 0.007, white); rod([ex + 0.125, 0.642, z], [ex + 0.155, 0.66, z], 0.011, ht);
    tube([[ex + 0.155, 0.66, z], [ex + 0.2, 0.645, z * 0.8 + 0.02], [ex + 0.215, 0.575, dz * 1.2], [ex + 0.19, 0.535, dz]], 0.0045, ht);
  }
  rod([ex + 0.105, 0.43, 0.11], [ex + 0.16, 0.485, 0.11], 0.028, cast);
  mk(new THREE.SphereGeometry(0.038, 20, 14), std(0x3b1d14, 0.45), car, ex + 0.175, 0.50, 0.11).scale.set(1, 1.1, 1);
  cyl(0.022, 0.03, 'z', steel, ex + 0.14, 0.455, 0.155);
  cyl(0.027, 0.11, 'x', blackSatin, 0.86, 0.668, 0.535); cyl(0.012, 0.02, 'x', white, 0.925, 0.668, 0.535); mk(new THREE.BoxGeometry(0.03, 0.06, 0.004), steel, car, 0.86, 0.668, 0.565);
  tube([[ex + 0.2, 0.52, 0.11], [ex + 0.23, 0.57, 0.3], [1.06, 0.69, 0.5], [0.935, 0.668, 0.535]], 0.0045, ht);
  // timing cover, pulleys, fan belt, alternator, fan (left end)
  mk(rbox(0.20, 0.25, 0.03, 0.012), eng, car, ex, 0.46, -0.225);
  cyl(0.055, 0.024, 'z', steel, ex, 0.38, -0.252); cyl(0.02, 0.03, 'z', ht, ex, 0.38, -0.256);
  mk(rbox(0.09, 0.08, 0.03, 0.012), cast, car, ex, 0.585, -0.228);
  cyl(0.05, 0.022, 'z', steel, ex, 0.585, -0.252);
  cyl(0.055, 0.12, 'z', cast, ex + 0.145, 0.60, -0.13); cyl(0.047, 0.02, 'z', ht, ex + 0.145, 0.60, -0.062); cyl(0.032, 0.02, 'z', steel, ex + 0.145, 0.60, -0.252);
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; mk(new THREE.BoxGeometry(0.004, 0.02, 0.07), ht, car, ex + 0.145 + Math.cos(a) * 0.054, 0.60 + Math.sin(a) * 0.054, -0.13).rotation.z = a; }
  rod([ex + 0.1, 0.54, -0.2], [ex + 0.135, 0.56, -0.16], 0.008, steel);
  tube([[ex - 0.055, 0.38, -0.252], [ex, 0.325, -0.252], [ex + 0.055, 0.37, -0.252], [ex + 0.178, 0.59, -0.252], [ex + 0.15, 0.633, -0.252], [ex + 0.02, 0.636, -0.252], [ex - 0.05, 0.59, -0.252]], 0.006, rubber, car, true);
  const fan = new THREE.Group(); fan.position.set(ex, 0.585, -0.285); car.add(fan);
  cyl(0.03, 0.03, 'z', steel, 0, 0, 0, fan);
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, bl = mk(new THREE.BoxGeometry(0.05, 0.095, 0.003), std(0xd9d2a6, 0.5), fan, Math.cos(a) * 0.075, Math.sin(a) * 0.075, 0); bl.rotation.order = 'ZYX'; bl.rotation.set(0, 0.45, a - Math.PI / 2); }
  // side radiator, cowl, hoses
  const fins = std(0xffffff, 0.6, 0.5, { map: stripes(256, 256, '#101010', '#6b6b6b', 6, 2, true) });
  mk(new THREE.BoxGeometry(0.30, 0.27, 0.045), [ht, ht, ht, ht, fins, fins], car, ex, 0.52, -0.39);
  mk(rbox(0.31, 0.055, 0.066, 0.02), blackSatin, car, ex, 0.68, -0.39); mk(rbox(0.31, 0.05, 0.066, 0.02), blackSatin, car, ex, 0.365, -0.39);
  cyl(0.027, 0.016, 'y', chrome, ex + 0.08, 0.714, -0.39); cyl(0.02, 0.02, 'y', brass, ex + 0.08, 0.70, -0.39);
  mk(new THREE.CylinderGeometry(0.145, 0.145, 0.05, 36, 1, true).rotateX(Math.PI / 2), matteBlack, car, ex, 0.565, -0.34);
  mk(rbox(0.06, 0.04, 0.045, 0.012), cast, car, ex, 0.678, -0.19);
  tube([[ex, 0.70, -0.19], [ex + 0.01, 0.745, -0.25], [ex + 0.02, 0.75, -0.33], [ex + 0.02, 0.705, -0.385]], 0.017, rubber);
  tube([[ex - 0.06, 0.365, -0.36], [ex - 0.04, 0.34, -0.3], [ex + 0.07, 0.42, -0.262], [ex + 0.04, 0.545, -0.24]], 0.016, rubber);
  tube([[ex + 0.095, 0.70, -0.39], [ex + 0.13, 0.66, -0.43], [ex + 0.13, 0.40, -0.43]], 0.004, clear);
  // clutch cover, starter, oil filter, dipstick
  cyl(0.135, 0.05, 'z', cast, ex, 0.44, 0.255, car, 32); mk(new THREE.SphereGeometry(0.115, 28, 16), cast, car, ex, 0.44, 0.275).scale.z = 0.35;
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; cyl(0.006, 0.01, 'z', steel, ex + Math.cos(a) * 0.122, 0.44 + Math.sin(a) * 0.122, 0.283, car, 6); }
  cyl(0.016, 0.07, 'x', cast, ex + 0.02, 0.60, 0.27); rod([ex - 0.02, 0.60, 0.27], [ex - 0.07, 0.55, 0.275], 0.004, steel);
  cyl(0.038, 0.17, 'z', ht, ex + 0.135, 0.385, 0.12); cyl(0.03, 0.03, 'z', steel, ex + 0.135, 0.385, 0.215);
  cyl(0.04, 0.11, 'y', white, ex + 0.15, 0.30, -0.04); cyl(0.0405, 0.03, 'y', std(0x1f4fa0, 0.5), ex + 0.15, 0.31, -0.04);
  rod([ex + 0.113, 0.50, -0.03], [ex + 0.14, 0.60, -0.04], 0.003, steel); mk(new THREE.TorusGeometry(0.011, 0.003, 6, 16), std(0xe2b500, 0.5), car, ex + 0.143, 0.611, -0.04);
  // manifolds, SU carburettor, air cleaner (bulkhead side)
  mk(rbox(0.05, 0.06, 0.36, 0.015), rust, car, ex - 0.125, 0.585, 0.01);
  tube([[ex - 0.14, 0.56, 0.01], [ex - 0.18, 0.45, 0.01], [ex - 0.19, 0.27, 0], [ex - 0.27, 0.19, 0]], 0.022, rust);
  mk(rbox(0.06, 0.04, 0.2, 0.012), cast, car, ex - 0.13, 0.642, 0.03);
  mk(rbox(0.06, 0.055, 0.06, 0.012), alloy, car, 0.795, 0.655, 0.03);
  cyl(0.034, 0.06, 'y', alloy, 0.795, 0.708, 0.03); mk(new THREE.SphereGeometry(0.034, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), alloy, car, 0.795, 0.738, 0.03).scale.y = 0.5;
  cyl(0.011, 0.018, 'y', ht, 0.795, 0.762, 0.03); cyl(0.022, 0.05, 'y', alloy, 0.795, 0.64, 0.085); cyl(0.024, 0.006, 'y', steel, 0.795, 0.667, 0.085);
  cyl(0.098, 0.06, 'y', blackSatin, 0.69, 0.675, 0.04, car, 40); mk(new THREE.TorusGeometry(0.094, 0.006, 8, 40).rotateX(Math.PI / 2), blackSatin, car, 0.69, 0.705, 0.04);
  cyl(0.01, 0.02, 'y', chrome, 0.69, 0.712, 0.04, car, 6);
  tube([[0.66, 0.675, 0.12], [0.65, 0.68, 0.2], [0.68, 0.665, 0.27], [0.75, 0.62, 0.28]], 0.022, blackSatin);
  tube([[ex - 0.05, 0.715, 0.17], [0.86, 0.73, 0.16], [0.76, 0.70, 0.10]], 0.008, rubber);
  tube([[0.795, 0.66, 0.107], [0.76, 0.62, 0.16], [0.62, 0.60, 0.2], [0.53, 0.56, 0.2]], 0.004, clear);
  tube([[0.80, 0.69, 0.0], [0.72, 0.74, -0.08], [0.60, 0.74, -0.05], [0.53, 0.70, 0.0]], 0.003, ht);
  for (const z of [-0.16, -0.11]) tube([[ex - 0.1, 0.63, z], [0.77, 0.61, z - 0.03], [0.62, 0.63, z + 0.03], [0.525, 0.62, z + 0.05]], 0.011, rubber);
  rod([ex - 0.095, 0.64, 0.2], [0.53, 0.66, 0.26], 0.008, steel);
  // bulkhead: brake + clutch master cylinders, wiper motor, washer bottle, wiring
  for (const [z, k] of [[0.34, 1], [0.23, 0.82]]) {
    cyl(0.02, 0.10, 'x', cast, 0.575, 0.74, z); cyl(0.027 * k, 0.05, 'y', clear, 0.595, 0.785, z); cyl(0.017 * k, 0.03, 'y', std(0xb9a25a, 0.4), 0.595, 0.775, z); cyl(0.03 * k, 0.012, 'y', ht, 0.595, 0.815, z);
    tube([[0.625, 0.735, z], [0.66, 0.70, z + 0.06], [0.67, 0.58, z + 0.1], [0.64, 0.45, 0.42]], 0.003, copper);
  }
  cyl(0.034, 0.10, 'z', ht, 0.575, 0.75, -0.31); mk(rbox(0.05, 0.045, 0.05, 0.01), cast, car, 0.575, 0.75, -0.235);
  mk(rbox(0.09, 0.14, 0.09, 0.02), clear, car, 0.60, 0.66, -0.52); mk(new THREE.BoxGeometry(0.07, 0.07, 0.07), std(0x3d7fc4, 0.3, 0, { transparent: true, opacity: 0.7 }), car, 0.60, 0.635, -0.52);
  cyl(0.022, 0.014, 'y', ht, 0.60, 0.737, -0.52); tube([[0.60, 0.74, -0.52], [0.57, 0.80, -0.45], [0.54, 0.83, -0.3]], 0.003, ht);
  tube([[0.535, 0.80, -0.46], [0.535, 0.81, 0], [0.535, 0.80, 0.46], [0.6, 0.74, 0.58], [1.0, 0.69, 0.6], [1.33, 0.66, 0.5]], 0.008, ht);
  tube([[0.535, 0.80, -0.46], [0.62, 0.74, -0.58], [1.0, 0.69, -0.6], [1.33, 0.66, -0.5]], 0.006, ht);
  mk(new THREE.BoxGeometry(0.07, 0.05, 0.03), ht, car, 0.76, 0.715, 0.6); cyl(0.022, 0.05, 'x', steel, 0.67, 0.715, 0.58);
  tube([[0.67, 0.715, 0.58], [0.9, 0.6, 0.47], [ex + 0.13, 0.45, 0.3], [ex + 0.135, 0.4, 0.215]], 0.007, redWire);
  // slam panel, catch, chassis plate, horn
  mk(new THREE.BoxGeometry(0.05, 0.014, 0.84), paint, car, 1.405, 0.70, 0); mk(new THREE.BoxGeometry(0.03, 0.02, 0.06), chrome, car, 1.40, 0.712, 0);
  mk(new THREE.BoxGeometry(0.035, 0.002, 0.07), alloy, car, 1.405, 0.708, 0.22);
  cyl(0.045, 0.03, 'x', ht, 1.385, 0.50, -0.27); cyl(0.02, 0.035, 'x', steel, 1.385, 0.50, -0.27);
  underFrame(topPanelMap(BON, bonK), bonnet.g, 0.03, 0.012);
}

/* ------------------------------------------------------------------- boot */
{
  const steel = std(0x74787b, 0.45, 0.8), tankM = std(0x2c2f33, 0.45, 0.7), ht = std(0x141414, 0.6), redWire = std(0xb3221a, 0.6);
  mk(new THREE.BoxGeometry(0.43, 0.012, 1.24), std(0xffffff, 0.95, 0, { map: stripes(256, 256, '#1b1b1c', '#2c2c2e', 8, 3, false) }), car, -1.215, 0.262, 0);   // ribbed rubber mat
  mk(new THREE.BoxGeometry(0.008, 0.60, 1.28), std(0x6a5238, 0.9), car, -1.005, 0.52, 0);                               // fibreboard behind the seat
  // spare wheel, laid flat, with its clamp and the wheel brace
  const sp = makeWheel(); sp.rotation.x = -Math.PI / 2; sp.position.set(-1.205, 0.335, 0.05); car.add(sp);
  cyl(0.006, 0.07, 'y', steel, -1.205, 0.39, 0.05); mk(new THREE.BoxGeometry(0.10, 0.006, 0.03), steel, car, -1.205, 0.418, 0.05); cyl(0.014, 0.012, 'y', chrome, -1.205, 0.425, 0.05, car, 6);
  rod([-1.34, 0.413, -0.06], [-1.09, 0.413, 0.2], 0.007, steel); rod([-1.09, 0.413, 0.2], [-1.07, 0.413, 0.14], 0.007, steel); cyl(0.012, 0.03, 'y', steel, -1.07, 0.405, 0.14, car, 6);
  // fuel tank on the left with strap, seam, sender and filler hose
  mk(rbox(0.32, 0.36, 0.2, 0.05), tankM, car, -1.20, 0.47, -0.345);
  mk(rbox(0.336, 0.012, 0.216, 0.005), tankM, car, -1.20, 0.47, -0.345);
  mk(rbox(0.03, 0.372, 0.212, 0.03), ht, car, -1.20, 0.47, -0.345);
  cyl(0.03, 0.01, 'z', steel, -1.13, 0.52, -0.243); cyl(0.008, 0.012, 'z', std(0xb08d3c, 0.4, 0.9), -1.13, 0.52, -0.236); tube([[-1.13, 0.52, -0.232], [-1.1, 0.45, -0.2], [-1.03, 0.30, -0.22]], 0.003, std(0x2f7d32, 0.6));
  cyl(0.03, 0.03, 'y', tankM, -1.20, 0.66, -0.37);
  tube([[-1.20, 0.665, -0.37], [-1.19, 0.715, -0.45], [-1.17, 0.74, -0.58], [-1.17, 0.74, -0.68]], 0.026, rubber);
  for (const q of [[-1.195, 0.69, -0.405], [-1.172, 0.738, -0.6]]) mk(new THREE.TorusGeometry(0.027, 0.003, 6, 20).rotateY(Math.PI / 2).rotateX(q[1] > 0.7 ? 0 : -0.9), steel, car, ...q);
  tube([[-1.25, 0.65, -0.33], [-1.3, 0.72, -0.4], [-1.3, 0.76, -0.55]], 0.005, ht);
  // battery on the right with caps, posts, clamp bar and leads
  mk(rbox(0.22, 0.155, 0.15, 0.01), blackSatin, car, -1.25, 0.347, 0.375); mk(rbox(0.222, 0.02, 0.152, 0.006), std(0x2b2b2e, 0.6), car, -1.25, 0.434, 0.375);
  for (let i = 0; i < 6; i++) cyl(0.011, 0.01, 'y', std(0xd9b400, 0.5), -1.33 + i * 0.032, 0.448, 0.36);
  for (const [x, m] of [[-1.335, ht], [-1.165, redWire]]) { cyl(0.009, 0.022, 'y', std(0x8d8f92, 0.5, 0.9), x, 0.455, 0.415); mk(new THREE.BoxGeometry(0.03, 0.012, 0.024), std(0x8d8f92, 0.5, 0.9), car, x, 0.456, 0.415); mk(new THREE.BoxGeometry(0.02, 0.006, 0.02), m, car, x, 0.468, 0.415); }
  tube([[-1.165, 0.46, 0.43], [-1.11, 0.45, 0.44], [-1.07, 0.36, 0.44], [-1.03, 0.27, 0.42]], 0.008, redWire);
  tube([[-1.335, 0.46, 0.43], [-1.40, 0.44, 0.44], [-1.42, 0.36, 0.42]], 0.008, ht);
  mk(new THREE.BoxGeometry(0.018, 0.01, 0.19), steel, car, -1.25, 0.449, 0.375); for (const z of [0.285, 0.465]) rod([-1.25, 0.45, z], [-1.25, 0.27, z], 0.004, steel);
  mk(new THREE.BoxGeometry(0.001, 0.07, 0.10), std(0xe9e6dc, 0.6), car, -1.3605, 0.35, 0.375);
  // jack, lamp holders and rear wiring
  mk(rbox(0.13, 0.06, 0.09, 0.012), std(0x7a1f1a, 0.6, 0.3), car, -1.075, 0.30, 0.39); rod([-1.14, 0.30, 0.39], [-1.01, 0.30, 0.39], 0.006, steel);
  for (const s of [1, -1]) mk(rbox(0.07, 0.19, 0.04, 0.01), blackSatin).applyMatrix4(frame(rearX, -1, 0.615, s * 0.5, -0.04));
  tube([[-1.33, 0.60, -0.5], [-1.42, 0.47, -0.3], [-1.435, 0.455, 0], [-1.42, 0.47, 0.3], [-1.33, 0.60, 0.5]], 0.006, ht);
  underFrame(topPanelMap(BOOT), boot.g, 0.026, 0.01);
}

/* ------------------------------------------------------ wheels on the car */
for (const sx of [1, -1]) for (const sz of [1, -1]) {
  const w = makeWheel(), xw = sx * WHEEL_X;
  w.position.set(xw, WHEEL_R, sz * 0.60); if (sz < 0) w.rotation.y = Math.PI;
  car.add(w);
  // arch liner
  const a0 = 0.14, a1 = Math.PI - 0.14, sh = new THREE.Shape();
  sh.absarc(0, 0, 0.335, a0, a1, false); sh.absarc(0, 0, ARCH_R + 0.001, a1, a0, true); sh.closePath();
  const zo = sideZ(xw, 0.45) - 0.05, D = 0.20;
  mk(new THREE.ExtrudeGeometry(sh, { depth: D, bevelEnabled: false, curveSegments: 40 }), matteBlack, car, xw, WHEEL_R, sz > 0 ? zo - D : -zo);
  mk(new THREE.BoxGeometry(0.76, 0.40, 0.01), matteBlack, car, xw, 0.46, sz * (zo - D));
}

/* ---------------------------------------------------------------- bumpers */
function bumper(xEnd, xTip, y) {
  const dir = Math.sign(xTip - xEnd), R = Math.abs(xTip - xEnd), right = [];
  for (let i = 0; i < 44; i++) { const x = xTip - dir * R * (1 - Math.sin(Math.PI / 2 * i / 44)); right.push(new THREE.Vector3(x, y, Math.max(0, sideZ(x, y)))); }
  right.push(new THREE.Vector3(xTip, y, 0));
  const all = [...right, ...right.slice(0, -1).reverse().map(p => new THREE.Vector3(p.x, y, -p.z))], pts = [];
  for (const p of all) if (!pts.length || pts[pts.length - 1].distanceTo(p) > 2e-3) pts.push(p);
  const sp = new THREE.CatmullRomCurve3(pts, false, 'centripetal').getSpacedPoints(110);
  const K = 12, pos = [], idx = [], n = sp.length, off = 0.026, a = 0.015, b = 0.031;
  for (let i = 0; i < n; i++) {
    const p = sp[i], t = sp[Math.min(i + 1, n - 1)].clone().sub(sp[Math.max(i - 1, 0)]).normalize();
    let nx = t.z, nz = -t.x; if (nx * p.x + nz * p.z < 0) { nx = -nx; nz = -nz; }
    const s = Math.sqrt(Math.min(1, i / 4, (n - 1 - i) / 4));
    for (let k = 0; k < K; k++) { const f = 2 * Math.PI * k / K, o = off + a * s * Math.cos(f); pos.push(p.x + nx * o, y + b * s * Math.sin(f), p.z + nz * o); }
  }
  for (let i = 0; i < n - 1; i++) for (let k = 0; k < K; k++) { const A = i * K + k, B = i * K + (k + 1) % K, C = A + K, Dd = B + K; idx.push(A, C, B, B, C, Dd); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  mk(g, chrome);
}
bumper(1.27, XF, 0.392);
bumper(-1.27, XR, 0.40);
for (const sx of [1, -1]) for (const s of [1, -1]) {   // rolled lip round each wheel arch
  const pts = [];
  for (let a = -0.14; a <= Math.PI + 0.141; a += 0.07) { const x = sx * WHEEL_X + (ARCH_R + 0.004) * Math.cos(a), y = WHEEL_R + (ARCH_R + 0.004) * Math.sin(a), z = sideZ(x, y); if (z > 0) pts.push([x, y, s * (z + 0.001)]); }
  tube(pts, 0.008, paint);
}

/* ------------------------------------------------------------ front end */
{ // sealed-beam headlamps: chrome reflector bowl and bulb behind a fluted glass lens; amber indicators below
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
  g.fillStyle = '#808080'; g.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 16) { const gr = g.createLinearGradient(x, 0, x + 16, 0); gr.addColorStop(0, '#2c2c2c'); gr.addColorStop(0.5, '#dcdcdc'); gr.addColorStop(1, '#2c2c2c'); g.fillStyle = gr; g.fillRect(x, 0, 16, 512); }
  g.fillStyle = 'rgba(128,128,128,0.8)'; for (const y of [150, 256, 362]) g.fillRect(0, y - 3, 512, 6);
  g.strokeStyle = '#1c1c1c'; g.lineWidth = 7; g.beginPath(); g.arc(256, 256, 238, 0, 7); g.stroke();
  const flute = new THREE.CanvasTexture(c); flute.anisotropy = 8;
  const lensMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, roughness: 0.04, bumpMap: flute, bumpScale: 3, depthWrite: false, envMapIntensity: 1.4 });
  const lensGeo = new THREE.RingGeometry(0.0001, 0.08, 72, 18);
  { const q = lensGeo.attributes.position; for (let i = 0; i < q.count; i++) { const r = Math.hypot(q.getX(i), q.getY(i)) / 0.08; q.setZ(i, 0.022 * (1 - r * r)); } lensGeo.computeVertexNormals(); lensGeo.rotateY(Math.PI / 2); }
  const bowl = new THREE.LatheGeometry(Array.from({ length: 18 }, (_, i) => { const r = 0.005 + 0.076 * i / 17; return new THREE.Vector2(r, -0.052 * (1 - (r / 0.081) ** 2)); }), 64).rotateZ(-Math.PI / 2);
  const bowlMat = std(0xffffff, 0.07, 1, { side: DS, envMapIntensity: 1.7 }), bulbMat = std(0xfbfaf2, 0.12, 0.1, { emissive: 0xfff6dc, emissiveIntensity: 0.08 });
  const cap = new THREE.SphereGeometry(0.02, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2).rotateZ(-Math.PI / 2);
  const ind = lens(0xff7d12, 0.1);
  for (const s of [1, -1]) {
    const hz = s * 0.51, hy = 0.700, x0 = frontX(hy, 0.51);
    mk(new THREE.CylinderGeometry(0.099, 0.095, 0.30, 72, 1, true).rotateZ(-Math.PI / 2), paint, car, x0 - 0.12, hy, hz);
    mk(new THREE.TorusGeometry(0.0885, 0.015, 24, 96).rotateY(Math.PI / 2), chrome, car, x0 + 0.031, hy, hz);
    mk(new THREE.TorusGeometry(0.076, 0.004, 8, 48).rotateY(Math.PI / 2), chrome, car, x0 + 0.04, hy, hz);
    mk(new THREE.CircleGeometry(0.088, 40).rotateY(Math.PI / 2), matteBlack, car, x0 - 0.03, hy, hz);
    mk(bowl, bowlMat, car, x0 + 0.03, hy, hz);
    mk(new THREE.SphereGeometry(0.015, 20, 14), bulbMat, car, x0 - 0.002, hy, hz);
    mk(cap, chrome, car, x0 + 0.004, hy, hz);
    mk(lensGeo, lensMat, car, x0 + 0.03, hy, hz);
    const m = frame(frontX, 1, 0.50, s * 0.505, 0);
    mk(new THREE.CylinderGeometry(0.034, 0.036, 0.018, 28).rotateX(Math.PI / 2), chrome).applyMatrix4(m);
    mk(new THREE.SphereGeometry(0.03, 24, 14).scale(1, 1, 0.55).translate(0, 0, 0.01), ind).applyMatrix4(m);
  }
}
{ // grille: wide chrome surround, broader at the bottom, black slats; it follows the curve of the front panel
  const g = new THREE.Group(), Y0 = 0.438, Y1 = 0.718, outer = [[-0.455, Y0], [0.455, Y0], [0.378, Y1], [-0.378, Y1]], inner = offsetPoly(outer, -0.027), slatMat = std(0x080808, 0.7, 0);
    const fit = geo => { const q = geo.attributes.position; for (let i = 0; i < q.count; i++) q.setZ(i, q.getZ(i) + frontX(q.getY(i), Math.abs(q.getX(i))) - XF); geo.computeVertexNormals(); return geo; };
  const dense = (pts, r) => { const sh = roundedShape(pts, r), out = sh.getSpacedPoints(160); return new THREE.Shape(out); };
  const xFace = XF + 0.005;
  const half = y => 0.455 - (y - Y0) / (Y1 - Y0) * 0.077 - 0.034;
  const fs = dense(outer, [0.075, 0.075, 0.04, 0.04]); fs.holes.push(new THREE.Path(dense(inner, [0.05, 0.05, 0.016, 0.016]).getPoints()));
  mk(fit(new THREE.ExtrudeGeometry(fs, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.007, bevelSegments: 5 }).translate(0, 0, -0.022)), chrome, g, 0, 0, xFace);
  { const bg = new THREE.PlaneGeometry(1, 1, 28, 18), q = bg.attributes.position;   // backing sheet, gridded so it hugs the panel
    for (let i = 0; i < q.count; i++) { const y = Y0 + 0.023 + (q.getY(i) + 0.5) * (Y1 - Y0 - 0.046); q.setXY(i, q.getX(i) * 2 * (half(y) + 0.011), y); }
    mk(fit(bg), matteBlack, g, 0, 0, xFace + 0.002); }
  for (let i = 0; i < 14; i++) { const y = Y0 + 0.036 + i * (Y1 - Y0 - 0.072) / 13; mk(fit(new THREE.BoxGeometry(2 * half(y), 0.0075, 0.012, 28, 1, 1).translate(0, y, 0.007)), slatMat, g, 0, 0, xFace); }
  g.rotation.y = Math.PI / 2; car.add(g);
  // bonnet badge and centre rib
  const bx = 1.365, tilt = Math.atan2(topY(bx + 0.02, 0) - topY(bx - 0.02, 0), 0.04);
  const badge = mk(new THREE.ExtrudeGeometry(roundedShape([[-0.02, -0.022], [0.016, -0.022], [0.024, 0], [0.016, 0.022], [-0.02, 0.022]], 0.006), { depth: 0.005, bevelEnabled: false }).rotateX(-Math.PI / 2), chrome, bonnet.g, bx, topY(bx, 0) + 0.001, 0);
  badge.rotation.z = tilt;
  const rib = []; for (let x = 0.58; x <= 1.33; x += 0.05) rib.push([x, topY(x, 0) + 0.0005, 0]);
  tube(rib, 0.0035, bonnetBlack, bonnet.g);
}
for (const s of [1, -1]) { // sill seam under the doors
  const pts = []; for (let x = -0.70; x <= 0.701; x += 0.05) { const p = P(x), y = p.yb + p.rb; pts.push([x, y, s * (halfW(p, y) + 0.001)]); }
  tube(pts, 0.006, paint);
}

/* ----------------------------------------- number plates, badge, rear end */
function plateTexture(bg) {
  const c = document.createElement('canvas'); c.width = 1040; c.height = 222;
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, 1040, 222);
  g.strokeStyle = '#111'; g.lineWidth = 5; g.beginPath(); g.roundRect(7, 7, 1026, 208, 16); g.stroke();
  g.fillStyle = '#0a0a0a'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 170px "Arial Narrow", "Liberation Sans Narrow", "Helvetica Neue", Arial, sans-serif';
  try { g.letterSpacing = '12px'; } catch (e) {}
  g.fillText('SLW 287R', 524, 122, 950);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const plate = (bg, parent) => mk(new THREE.BoxGeometry(0.52, 0.111, 0.008), [blackSatin, blackSatin, blackSatin, blackSatin, std(0xffffff, 0.4, 0, { map: plateTexture(bg) }), blackSatin], parent);
{
  const f = plate('#f4f4ee', car); f.position.set(frontX(0.335, 0.25) + 0.012, 0.306, 0); f.rotation.y = Math.PI / 2;
  const on = (mesh, y, z, off = 0) => { mesh.applyMatrix4(frame(rearX, -1, y, z, off)); return mesh; };
  on(plate('#f2c40f', boot.g), 0.555, 0, 0.007);
  on(mk(new THREE.BoxGeometry(0.13, 0.024, 0.03), chrome, boot.g), 0.632, 0, 0.012);     // plate lamp
  on(mk(new THREE.BoxGeometry(0.10, 0.022, 0.022), chrome, boot.g), 0.735, 0, 0.01);     // boot handle
  { // "Mini 1000" script
    const c = document.createElement('canvas'); c.width = 512; c.height = 112; const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'italic bold 84px Georgia, "Times New Roman", serif'; g.fillText('Mini 1000', 256, 60, 500);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8;
    on(mk(new THREE.PlaneGeometry(0.17, 0.037), std(0xffffff, 0.25, 1, { map: t, alphaTest: 0.45 }), boot.g), 0.71, 0.27, 0.002);
  }
  for (const s of [1, -1]) {
    const z = s * 0.50;
    on(mk(new THREE.ExtrudeGeometry(roundedShape(rect(0.085, 0.215), 0.016), { depth: 0.014, bevelEnabled: false }), chrome), 0.615, z, -0.002);
    [amber, red, red].forEach((m, i) => on(mk(new THREE.ExtrudeGeometry(roundedShape(rect(0.066, 0.06), 0.01), { depth: 0.02, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.004, bevelSegments: 3 }), m), 0.615 + (1 - i) * 0.056, z, 0.012));
    on(mk(new THREE.BoxGeometry(0.03, 0.04, 0.014), chrome), 0.462, s * 0.25, 0.004);    // boot hinges
  }
}

car.traverse(o => { if (o.isMesh) { const m = Array.isArray(o.material) ? o.material[0] : o.material; o.castShadow = !m.transparent && !m.alphaTest; o.receiveShadow = !m.transparent; } });
const parts = {
  doorR: { set: v => doors.R.pivot.rotation.y = v * 1.15 },
  doorL: { set: v => doors.L.pivot.rotation.y = -v * 1.15 },
  bonnet: { set: v => { bonnet.pivot.rotation.z = v * 0.95; stay.visible = v > 0.985; } },
  boot: { set: v => boot.pivot.rotation.z = v * 1.85 },
  winR: { set: v => doors.R.pane.position.y = -0.40 * v },
  winL: { set: v => doors.L.pane.position.y = -0.40 * v },
};
return { car, parts };
  } });
