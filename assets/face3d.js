/* Her portrait as a real 3D relief (depth from a face mesh), rendered with WebGL and turned
   into coloured characters by a second shader pass. Exposes window.Face3D(canvas, opts). */
(() => {
  const RAMP = " .`':;,^\"!il~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@";

  /* ---- tiny matrix helpers (column-major) ---- */
  const persp = (fov, asp, n, f) => { const t = 1 / Math.tan(fov / 2), nf = 1 / (n - f); return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) * nf, -1, 0, 0, 2 * f * n * nf, 0]; };
  const mul = (a, b) => { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  function lookAt(e, c, up) {
    const z = nrm(sub(e, c)), x = nrm(cross(up, z)), y = cross(z, x);
    return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1];
  }

  const VS_SCENE = `attribute vec3 aPos;attribute vec3 aNor;attribute vec2 aUv;uniform mat4 uMVP;varying vec2 vUv;varying vec3 vN;varying float vZ;
  void main(){vUv=aUv;vN=aNor;vZ=aPos.z;gl_Position=uMVP*vec4(aPos,1.);}`;
  const FS_SCENE = `precision mediump float;uniform sampler2D uTex;uniform vec3 uL;varying vec2 vUv;varying vec3 vN;varying float vZ;
  void main(){vec3 c=texture2D(uTex,vUv).rgb;float d=max(dot(normalize(vN),uL),0.);
  float rim=pow(1.-max(normalize(vN).z,0.),2.)*.35;
  gl_FragColor=vec4(c*(.74+.42*d)+vec3(.95,.88,.8)*rim*(.3+.7*c.r),1.);}`;
  const VS_QUAD = `attribute vec2 aP;void main(){gl_Position=vec4(aP,0.,1.);}`;
  const FS_ASCII = `precision highp float;uniform sampler2D uScene,uAtlas;uniform vec2 uRes,uCell;uniform float uN,uTime,uNoise,uCut;uniform vec3 uBg,uMouse;
  float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
  void main(){vec2 fc=gl_FragCoord.xy;vec2 cell=floor(fc/uCell);vec2 uv=(cell+.5)*uCell/uRes;
  vec4 c=texture2D(uScene,uv);float l=pow(dot(c.rgb,vec3(.299,.587,.114)),.82);float tq=floor(uTime/110.);
  l=clamp(l+(h(cell+tq)-.5)*uNoise,0.,.999);float k=floor(l*uN);
  vec2 d=(cell+.5)*uCell-uMouse.xy;float f=1.-clamp(dot(d,d)/(uMouse.z*uMouse.z+1.),0.,1.);
  if(f>0.&&h(cell*1.7+tq)<f*.55)k=floor(h(cell.yx+tq)*uN);
  if(c.a<.5||l<.045+uCut){gl_FragColor=vec4(uBg,1.);return;}
  vec2 g=fract(fc/uCell);g.y=1.-g.y;float a=texture2D(uAtlas,vec2((k+g.x)/uN,g.y)).a;
  float m=max(max(c.r,c.g),max(c.b,.094));vec3 col=min(c.rgb*(pow(l,.5)/m)*(1.+f*.8),1.);
  gl_FragColor=vec4(mix(uBg,col,a),1.);}`;

  function Face3D(canvas, o) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
    const prog = (v, f) => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, v)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, f)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw gl.getProgramInfoLog(p); return p; };
    let P1, P2;
    try { P1 = prog(VS_SCENE, FS_SCENE); P2 = prog(VS_QUAD, FS_ASCII); } catch (e) { return null; }
    const U = (p, n) => gl.getUniformLocation(p, n);

    /* glyph atlas */
    const N = RAMP.length, GW = 24, GH = 44;
    const ac = document.createElement('canvas'); ac.width = N * GW; ac.height = GH;
    const ax = ac.getContext('2d'); ax.fillStyle = '#fff'; ax.textBaseline = 'middle'; ax.textAlign = 'center';
    ax.font = `700 ${GH * .78}px ui-monospace, "SFMono-Regular", Menlo, Consolas, "Courier New", monospace`;
    for (let i = 0; i < N; i++) ax.fillText(RAMP[i], i * GW + GW / 2, GH / 2 + 1);
    const tex = (src, lin) => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(w => gl.texParameteri(gl.TEXTURE_2D, w, gl.CLAMP_TO_EDGE));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, lin ? gl.LINEAR : gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, lin ? gl.LINEAR : gl.NEAREST); return t; };
    const atlas = tex(ac, true);

    /* quad */
    const qb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, qb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    /* offscreen scene target */
    const fbo = gl.createFramebuffer(), ftex = gl.createTexture(), rb = gl.createRenderbuffer();
    let fw = 0, fh = 0;
    function target(w, h) {
      if (w === fw && h === fh) return; fw = w; fh = h;
      gl.bindTexture(gl.TEXTURE_2D, ftex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindRenderbuffer(gl.RENDERBUFFER, rb); gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ftex, 0);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    /* mesh from the depth map */
    let mesh = null, ctex = null, SW = 0, SH = 0, EYE = null, ready = false;
    const load = s => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = s; });
    const done = Promise.all([load(o.color), load(o.depth)]).then(([ci, di]) => {
      SW = ci.naturalWidth; SH = ci.naturalHeight; ctex = tex(ci, true);
      const dc = document.createElement('canvas'); dc.width = di.naturalWidth; dc.height = di.naturalHeight;
      const dx = dc.getContext('2d'); dx.drawImage(di, 0, 0); const D = dx.getImageData(0, 0, dc.width, dc.height).data;
      const dw = dc.width, dh = dc.height, zs = o.depthMax / 255;
      const at = (u, v) => { const x = Math.min(dw - 1, Math.max(0, Math.round(u * (dw - 1)))), y = Math.min(dh - 1, Math.max(0, Math.round(v * (dh - 1)))), i = (y * dw + x) * 4; return [D[i] * zs, D[i + 1]]; };
      const GX = o.grid || 150, GY = Math.round(GX * SH / SW);
      const pos = new Float32Array(GX * GY * 3), nor = new Float32Array(GX * GY * 3), uv = new Float32Array(GX * GY * 2), m = new Uint8Array(GX * GY);
      for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
        const u = i / (GX - 1), v = j / (GY - 1), k = j * GX + i, [z, mk] = at(u, v);
        pos.set([(u - .5) * SW, (.5 - v) * SH, z], k * 3); uv.set([u, v], k * 2); m[k] = mk > 128;
      }
      for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
        const k = j * GX + i, l = j * GX + Math.max(0, i - 1), r = j * GX + Math.min(GX - 1, i + 1), t = Math.max(0, j - 1) * GX + i, b = Math.min(GY - 1, j + 1) * GX + i;
        const dzx = (pos[r * 3 + 2] - pos[l * 3 + 2]) / (pos[r * 3] - pos[l * 3] || 1), dzy = (pos[t * 3 + 2] - pos[b * 3 + 2]) / (pos[t * 3 + 1] - pos[b * 3 + 1] || 1);
        const n = nrm([-dzx, -dzy, 1]); nor.set(n, k * 3);
      }
      const idx = [];
      for (let j = 0; j < GY - 1; j++) for (let i = 0; i < GX - 1; i++) {
        const a = j * GX + i, b = a + 1, c = a + GX, d = c + 1;
        if (m[a] && m[b] && m[c] && m[d]) idx.push(a, c, b, b, c, d);
      }
      const buf = (data, tgt = gl.ARRAY_BUFFER) => { const x = gl.createBuffer(); gl.bindBuffer(tgt, x); gl.bufferData(tgt, data, gl.STATIC_DRAW); return x; };
      mesh = { pos: buf(pos), nor: buf(nor), uv: buf(uv), idx: buf(new Uint16Array(idx), gl.ELEMENT_ARRAY_BUFFER), n: idx.length };
      const [ez] = at(o.eye[0], o.eye[1]);
      EYE = [(o.eye[0] - .5) * SW, (.5 - o.eye[1]) * SH, ez + 2];
      ready = true;
    });

    let W = 0, H = 0, dpr = 1;
    function fit() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect(); W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    }

    /* s: {a (0..1 dive), t, yaw, pitch, light:[x,y], mouse:{x,y,r} css px or null, bg:[r,g,b], small, offX, offY, cut} */
    function render(s) {
      if (!ready) return false;
      fit();
      const cellW = Math.round(Math.max(4.5, Math.min(9, (W / dpr) / (s.small ? 80 : 205))) * dpr * 10) / 10, cellH = cellW * 1.85;
      target(Math.max(2, Math.ceil(W / cellW) * 2), Math.max(2, Math.ceil(H / cellH) * 2));
      const fov = s.small ? .62 : .5, asp = W / H;
      // camera: from the whole portrait down into her eye
      const T0 = [0, SH * (s.small ? .02 : .12), 120];
      const Vh = s.small ? Math.max(SH * .5, SW * .66 / asp) : Math.max(SH * .58, SW * .5 / asp), D0 = Vh / 2 / Math.tan(fov / 2);
      const dmin = 9, dist = D0 * Math.exp(-s.a * Math.log(D0 / dmin)), k = Math.pow(dist / D0, 1.15);
      const tg = [EYE[0] + (T0[0] - EYE[0]) * k, EYE[1] + (T0[1] - EYE[1]) * k, EYE[2] + (T0[2] - EYE[2]) * k];
      const turn = Math.pow(dist / D0, .6), yaw = s.yaw * turn, pitch = s.pitch * turn;
      const eye = [tg[0] + dist * Math.sin(yaw) * Math.cos(pitch), tg[1] + dist * Math.sin(pitch), tg[2] + dist * Math.cos(yaw) * Math.cos(pitch)];
      let Pm = persp(fov, asp, Math.max(.5, dist * .05), dist + 2000);
      const ox = (s.offX || 0) * turn, oy = (s.offY || 0) * turn;
      Pm = mul([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ox, oy, 0, 1], Pm);
      const mvp = mul(Pm, lookAt(eye, tg, [0, 1, 0]));
      // pass 1
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.viewport(0, 0, fw, fh);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.enable(gl.DEPTH_TEST);
      gl.useProgram(P1);
      const attr = (p, n, b, sz) => { const l = gl.getAttribLocation(p, n); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, sz, gl.FLOAT, false, 0, 0); return l; };
      const l1 = attr(P1, 'aPos', mesh.pos, 3), l2 = attr(P1, 'aNor', mesh.nor, 3), l3 = attr(P1, 'aUv', mesh.uv, 2);
      gl.uniformMatrix4fv(U(P1, 'uMVP'), false, new Float32Array(mvp));
      gl.uniform3fv(U(P1, 'uL'), nrm([s.light[0] * 1.3, s.light[1] * 1.1 + .25, 1]));
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, ctex); gl.uniform1i(U(P1, 'uTex'), 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.idx); gl.drawElements(gl.TRIANGLES, mesh.n, gl.UNSIGNED_SHORT, 0);
      [l1, l2, l3].forEach(l => gl.disableVertexAttribArray(l));
      // pass 2
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H); gl.disable(gl.DEPTH_TEST);
      gl.useProgram(P2);
      const lq = attr(P2, 'aP', qb, 2);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, ftex); gl.uniform1i(U(P2, 'uScene'), 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, atlas); gl.uniform1i(U(P2, 'uAtlas'), 1);
      gl.uniform2f(U(P2, 'uRes'), W, H); gl.uniform2f(U(P2, 'uCell'), cellW, cellH);
      gl.uniform1f(U(P2, 'uN'), N); gl.uniform1f(U(P2, 'uTime'), s.t); gl.uniform1f(U(P2, 'uNoise'), .06 * (1 - s.a)); gl.uniform1f(U(P2, 'uCut'), s.cut || 0);
      gl.uniform3f(U(P2, 'uBg'), s.bg[0] / 255, s.bg[1] / 255, s.bg[2] / 255);
      const m = s.mouse; gl.uniform3f(U(P2, 'uMouse'), m ? m.x * dpr : -9999, m ? H - m.y * dpr : -9999, m ? m.r * dpr : 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3); gl.disableVertexAttribArray(lq);
      return true;
    }
    return { render, done, get ready() { return ready; } };
  }
  window.Face3D = Face3D;
})();
