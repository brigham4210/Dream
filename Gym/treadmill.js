/* The treadmill. build() adds it to whatever `scene` it is given: the runner faces -z (the mirrors), the console is at the
   -z end, the floor is y = 0, metres. Click it anywhere to start or stop the belt; the console counts the time and distance. */
(window.DREAM_GYM = window.DREAM_GYM || []).push({
  name: 'Treadmill', title: 'Treadmill', line: 'Facing the mirrors · click to start or stop the belt',
  at: [-1.95, 2.45], view: { target: [0, 0.75, -0.1], cam: [2.3, 1.7, 3] },
  build({ THREE, scene, sound, kit }) {
const { M, tools, shadows, std, tex } = kit, g = new THREE.Group(); scene.add(g);
const { mk, box, rod, tube } = tools(g);
const body = std(0x2a2c30, 0.45, 0.3), grey = std(0x8d9196, 0.4, 0.6);

// deck and side rails, with the belt running over a roller at each end
box(-0.36, 0.36, 0.09, 0.172, -0.7, 0.95, M.rubber);
for (const s of [-1, 1]) { box(s * 0.36, s * 0.43, 0.06, 0.2, -0.7, 0.97, body); box(s * 0.365, s * 0.425, 0.2, 0.206, -0.6, 0.9, grey); box(s * 0.3, s * 0.43, 0, 0.06, 0.82, 0.95, M.rubber); }
rod(0.045, 0.7, M.iron, 0, 0.13, 0.96);
const beltTex = tex(256, 256, (c, w, h) => { c.fillStyle = '#1a1b1d'; c.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 8) { c.fillStyle = 'rgba(255,255,255,.035)'; c.fillRect(0, y, w, 3); }
  c.fillStyle = '#d8dadc'; c.fillRect(w * 0.3, 20, w * 0.4, 10); });
beltTex.wrapS = beltTex.wrapT = THREE.RepeatWrapping; beltTex.repeat.set(1, 4);
const BELT = 1.62, belt = mk(new THREE.PlaneGeometry(0.52, BELT).rotateX(-Math.PI / 2), std(0xffffff, 0.8, 0, { map: beltTex }), g, 0, 0.175, 0.13);

// the motor hood, a wedge across the front
{ const s = new THREE.Shape(); [[-1.08, 0.02], [-1.08, 0.2], [-0.98, 0.3], [-0.74, 0.3], [-0.62, 0.2], [-0.62, 0.02]].forEach(([z, y], i) => i ? s.lineTo(z, y) : s.moveTo(z, y)); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.84, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 3 }); geo.rotateY(-Math.PI / 2); geo.translate(0.42, 0, 0); mk(geo, body); }

// two masts up to the console, a bar across them and a handrail down each side
for (const s of [-1, 1]) { tube([s * 0.4, 0.25, -0.98], [s * 0.4, 1.16, -0.74], 0.03, body, g, 16);
  tube([s * 0.4, 1.12, -0.74], [s * 0.4, 1.02, -0.2], 0.019, M.rubber, g, 16); mk(new THREE.SphereGeometry(0.019, 16, 12), M.rubber, g, s * 0.4, 1.02, -0.2); }
rod(0.017, 0.8, grey, 0, 1.0, -0.71);
const con = new THREE.Group(); con.position.set(0, 1.26, -0.76); con.rotation.x = -0.55; g.add(con);
mk(new THREE.BoxGeometry(0.9, 0.34, 0.07), body, con);
for (const s of [-1, 1]) mk(new THREE.CylinderGeometry(0.045, 0.04, 0.012, 24).rotateX(Math.PI / 2), M.rubber, con, s * 0.33, -0.02, 0.04);   // cup holders
const start = mk(new THREE.CylinderGeometry(0.022, 0.022, 0.012, 24).rotateX(Math.PI / 2), std(0x2fa84f, 0.4), con, -0.07, -0.12, 0.04);
mk(new THREE.CylinderGeometry(0.022, 0.022, 0.012, 24).rotateX(Math.PI / 2), M.red, con, 0.07, -0.12, 0.04);

// the screen: speed, time and distance, redrawn a few times a second while the belt turns
const cv = document.createElement('canvas'); cv.width = 512; cv.height = 224; const c2 = cv.getContext('2d');
const scr = new THREE.CanvasTexture(cv); scr.colorSpace = THREE.SRGBColorSpace;
mk(new THREE.PlaneGeometry(0.4, 0.175), new THREE.MeshBasicMaterial({ map: scr }), con, 0, 0.045, 0.0365);
const KMH = 10; let on = false, v = 0, secs = 0, km = 0, drawn = -1;
function draw() { const f = '"Helvetica Neue", Helvetica, Arial, sans-serif';
  c2.fillStyle = '#0b0d10'; c2.fillRect(0, 0, 512, 224); c2.textBaseline = 'alphabetic';
  c2.fillStyle = on ? '#7ee08a' : '#59606a'; c2.font = '700 96px ' + f; c2.textAlign = 'left'; c2.fillText((v * KMH).toFixed(1), 28, 112);
  c2.fillStyle = '#8b939e'; c2.font = '600 24px ' + f; c2.fillText('km/h', 32, 150);
  c2.textAlign = 'right'; c2.fillStyle = '#e9ecef'; c2.font = '600 46px ' + f;
  c2.fillText(String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(Math.floor(secs % 60)).padStart(2, '0'), 484, 82); c2.fillText(km.toFixed(2) + ' km', 484, 150);
  c2.fillStyle = '#59606a'; c2.font = '600 20px ' + f; c2.textAlign = 'left'; c2.fillText(on ? 'RUNNING · click to stop' : 'READY · click to start', 30, 198);
  scr.needsUpdate = true; }
draw();
g.userData.click = () => { on = !on; sound.beep(on ? 1320 : 880); start.material.emissive.setHex(on ? 0x1d7a35 : 0); drawn = -1; };

shadows(g);
function tick(dt) {
  const to = on ? 1 : 0; if (v === to && !on) return;
  v += Math.sign(to - v) * Math.min(Math.abs(to - v), dt * 0.45);
  const ms = v * KMH / 3.6; beltTex.offset.y = (beltTex.offset.y + ms * dt / (BELT / 4)) % 1; sound.loop('belt', v);
  if (v > 0) { secs += dt; km += ms * dt / 1000; }
  const stamp = Math.floor(secs * 4) + v; if (stamp !== drawn) { drawn = stamp; draw(); }
}
return { parts: {}, tick };
  } });
