var Vips = (() => {
  var _scriptDir =
    typeof document !== "undefined" && document.currentScript
      ? document.currentScript.src
      : undefined;

  return function (Vips) {
    Vips = Vips || {};

    var h;
    h || (h = typeof Vips !== "undefined" ? Vips : {});
    var aa, ba;
    h.ready = new Promise(function (a, b) {
      aa = a;
      ba = b;
    });
    var ca;
    h.locateFile =
      h.locateFile ||
      function (a, b) {
        a = b + a;
        return a.endsWith(".worker.js")
          ? ca
            ? ca
            : (ca = URL.createObjectURL(
                new Blob([`importScripts('${a}');`], {
                  type: "application/javascript",
                })
              ))
          : a;
      };
    var da = Object.assign({}, h),
      ea = [],
      fa = "./this.program",
      ha = (a, b) => {
        throw b;
      },
      ia = "object" == typeof window,
      ja = "function" == typeof importScripts,
      ka =
        "object" == typeof process &&
        "object" == typeof process.Bf &&
        "string" == typeof process.Bf.node,
      r = h.ENVIRONMENT_IS_PTHREAD || !1,
      la = "";
    function ma(a) {
      return h.locateFile ? h.locateFile(a, la) : la + a;
    }
    var na, oa, pa;
    if (ia || ja)
      ja
        ? (la = self.location.href)
        : "undefined" != typeof document &&
          document.currentScript &&
          (la = document.currentScript.src),
        _scriptDir && (la = _scriptDir),
        0 !== la.indexOf("blob:")
          ? (la = la.substr(0, la.replace(/[?#].*/, "").lastIndexOf("/") + 1))
          : (la = ""),
        (na = (a) => {
          var b = new XMLHttpRequest();
          b.open("GET", a, !1);
          b.send(null);
          return b.responseText;
        }),
        ja &&
          (pa = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          }),
        (oa = (a, b, c) => {
          var d = new XMLHttpRequest();
          d.open("GET", a, !0);
          d.responseType = "arraybuffer";
          d.onload = () => {
            200 == d.status || (0 == d.status && d.response)
              ? b(d.response)
              : c();
          };
          d.onerror = c;
          d.send(null);
        });
    var v = h.print || console.log.bind(console),
      w = h.printErr || console.warn.bind(console);
    Object.assign(h, da);
    da = null;
    h.arguments && (ea = h.arguments);
    h.thisProgram && (fa = h.thisProgram);
    h.quit && (ha = h.quit);
    function qa(a) {
      ra || (ra = {});
      ra[a] || ((ra[a] = 1), w(a));
    }
    var ra,
      sa = [],
      ta,
      ua = 0,
      va;
    h.wasmBinary && (va = h.wasmBinary);
    var noExitRuntime = h.noExitRuntime || !1;
    "object" != typeof WebAssembly && y("no native wasm support detected");
    var wa,
      xa,
      ya = !1,
      za,
      Aa = new TextDecoder("utf8");
    function Ba(a) {
      for (var b = 0; a[b] && !(NaN <= b); ) ++b;
      return Aa.decode(
        a.buffer
          ? a.buffer instanceof SharedArrayBuffer
            ? a.slice(0, b)
            : a.subarray(0, b)
          : new Uint8Array(a.slice(0, b))
      );
    }
    function z(a, b) {
      if (!a) return "";
      b = a + b;
      for (var c = a; !(c >= b) && A[c]; ) ++c;
      return Aa.decode(A.slice(a, c));
    }
    function Ca(a, b, c, d) {
      if (!(0 < d)) return 0;
      var e = c;
      d = c + d - 1;
      for (var f = 0; f < a.length; ++f) {
        var g = a.charCodeAt(f);
        if (55296 <= g && 57343 >= g) {
          var k = a.charCodeAt(++f);
          g = (65536 + ((g & 1023) << 10)) | (k & 1023);
        }
        if (127 >= g) {
          if (c >= d) break;
          b[c++] = g;
        } else {
          if (2047 >= g) {
            if (c + 1 >= d) break;
            b[c++] = 192 | (g >> 6);
          } else {
            if (65535 >= g) {
              if (c + 2 >= d) break;
              b[c++] = 224 | (g >> 12);
            } else {
              if (c + 3 >= d) break;
              b[c++] = 240 | (g >> 18);
              b[c++] = 128 | ((g >> 12) & 63);
            }
            b[c++] = 128 | ((g >> 6) & 63);
          }
          b[c++] = 128 | (g & 63);
        }
      }
      b[c] = 0;
      return c - e;
    }
    function Da(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c);
        55296 <= d &&
          57343 >= d &&
          (d = (65536 + ((d & 1023) << 10)) | (a.charCodeAt(++c) & 1023));
        127 >= d ? ++b : (b = 2047 >= d ? b + 2 : 65535 >= d ? b + 3 : b + 4);
      }
      return b;
    }
    var Ea = new TextDecoder("utf-16le");
    function Fa(a, b) {
      var c = a >> 1;
      for (b = c + b / 2; !(c >= b) && B[c]; ) ++c;
      return Ea.decode(A.slice(a, c << 1));
    }
    function Ga(a, b, c) {
      void 0 === c && (c = 2147483647);
      if (2 > c) return 0;
      c -= 2;
      var d = b;
      c = c < 2 * a.length ? c / 2 : a.length;
      for (var e = 0; e < c; ++e) (Ha[b >> 1] = a.charCodeAt(e)), (b += 2);
      Ha[b >> 1] = 0;
      return b - d;
    }
    function Ia(a) {
      return 2 * a.length;
    }
    function Ja(a, b) {
      for (var c = 0, d = ""; !(c >= b / 4); ) {
        var e = D[(a + 4 * c) >> 2];
        if (0 == e) break;
        ++c;
        65536 <= e
          ? ((e -= 65536),
            (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
          : (d += String.fromCharCode(e));
      }
      return d;
    }
    function Ka(a, b, c) {
      void 0 === c && (c = 2147483647);
      if (4 > c) return 0;
      var d = b;
      c = d + c - 4;
      for (var e = 0; e < a.length; ++e) {
        var f = a.charCodeAt(e);
        if (55296 <= f && 57343 >= f) {
          var g = a.charCodeAt(++e);
          f = (65536 + ((f & 1023) << 10)) | (g & 1023);
        }
        D[b >> 2] = f;
        b += 4;
        if (b + 4 > c) break;
      }
      D[b >> 2] = 0;
      return b - d;
    }
    function La(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c);
        55296 <= d && 57343 >= d && ++c;
        b += 4;
      }
      return b;
    }
    function Ma(a) {
      var b = Da(a) + 1,
        c = Na(b);
      c && Ca(a, E, c, b);
      return c;
    }
    function Oa(a) {
      var b = Da(a) + 1,
        c = Pa(b);
      Ca(a, E, c, b);
      return c;
    }
    var Qa, E, A, Ha, B, D, F, Ra, Sa, Ta, Ua;
    r && (Qa = h.buffer);
    var Va = h.INITIAL_MEMORY || 1073741824;
    if (r) (wa = h.wasmMemory), (Qa = h.buffer);
    else if (h.wasmMemory) wa = h.wasmMemory;
    else if (
      ((wa = new WebAssembly.Memory({
        initial: Va / 65536,
        maximum: Va / 65536,
        shared: !0,
      })),
      !(wa.buffer instanceof SharedArrayBuffer))
    )
      throw (
        (w(
          "requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"
        ),
        ka &&
          console.log(
            "(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"
          ),
        Error("bad memory"))
      );
    wa && (Qa = wa.buffer);
    Va = Qa.byteLength;
    var G = Qa;
    Qa = G;
    h.HEAP8 = E = new Int8Array(G);
    h.HEAP16 = Ha = new Int16Array(G);
    h.HEAP32 = D = new Int32Array(G);
    h.HEAPU8 = A = new Uint8Array(G);
    h.HEAPU16 = B = new Uint16Array(G);
    h.HEAPU32 = F = new Uint32Array(G);
    h.HEAPF32 = Ra = new Float32Array(G);
    h.HEAPF64 = Ua = new Float64Array(G);
    h.HEAP64 = Sa = new BigInt64Array(G);
    h.HEAPU64 = Ta = new BigUint64Array(G);
    var Wa,
      Xa = [],
      Ya = [],
      Za = [],
      $a = [],
      ab = [],
      bb = !1,
      cb = 0;
    function db() {
      return noExitRuntime || 0 < cb;
    }
    function eb() {
      r ||
        (h.noFSInit || FS.init.kd || FS.init(),
        (FS.Sd = !1),
        (H.root = FS.mount(H, {}, null)),
        fb(Ya));
    }
    function gb() {
      r || (hb(), fb($a), FS.ff(), I.ae(), (bb = !0));
    }
    function ib() {
      var a = h.preRun.shift();
      Xa.unshift(a);
    }
    var jb = 0,
      kb = null,
      lb = null;
    function mb() {
      jb++;
      h.monitorRunDependencies && h.monitorRunDependencies(jb);
    }
    function nb() {
      jb--;
      h.monitorRunDependencies && h.monitorRunDependencies(jb);
      if (0 == jb && (null !== kb && (clearInterval(kb), (kb = null)), lb)) {
        var a = lb;
        lb = null;
        a();
      }
    }
    h.preloadedImages = {};
    h.preloadedAudios = {};
    function y(a) {
      if (r) postMessage({ cmd: "onAbort", arg: a });
      else if (h.onAbort) h.onAbort(a);
      a = "Aborted(" + a + ")";
      w(a);
      ya = !0;
      za = 1;
      a = new WebAssembly.RuntimeError(
        a + ". Build with -s ASSERTIONS=1 for more info."
      );
      ba(a);
      throw a;
    }
    function ob() {
      return pb.startsWith("data:application/octet-stream;base64,");
    }
    var pb;
    pb = "vips.wasm";
    ob() || (pb = ma(pb));
    function qb() {
      var a = pb;
      try {
        if (a == pb && va) return new Uint8Array(va);
        if (pa) return pa(a);
        throw "both async and sync fetching of the wasm failed";
      } catch (b) {
        y(b);
      }
    }
    function rb() {
      return va || (!ia && !ja) || "function" != typeof fetch
        ? Promise.resolve().then(function () {
            return qb();
          })
        : fetch(pb, { credentials: "same-origin" })
            .then(function (a) {
              if (!a.ok)
                throw "failed to load wasm binary file at '" + pb + "'";
              return a.arrayBuffer();
            })
            .catch(function () {
              return qb();
            });
    }
    var sb = {};
    function tb(a) {
      for (var b = B[(a + 6) >> 1]; 13 === b; ) {
        var c = F[(a + 8) >> 2],
          d = F[c >> 2];
        if (0 === d) {
          b = 0;
          break;
        } else if (0 === F[(c >> 2) + 1]) (a = d), (b = B[(d + 6) >> 1]);
        else break;
      }
      return [a, b];
    }
    function ub(a, b) {
      vb = a;
      wb = b;
      if (xb)
        if ((yb || ((cb += 1), (yb = !0)), 0 == a))
          zb = function () {
            var d = Math.max(0, Ab + b - Bb()) | 0;
            setTimeout(Cb, d);
          };
        else if (1 == a)
          zb = function () {
            Db(Cb);
          };
        else if (2 == a) {
          if ("undefined" == typeof setImmediate) {
            var c = [];
            addEventListener(
              "message",
              function (d) {
                if (
                  "setimmediate" === d.data ||
                  "setimmediate" === d.data.target
                )
                  d.stopPropagation(), c.shift()();
              },
              !0
            );
            setImmediate = function (d) {
              c.push(d);
              ja
                ? (void 0 === h.setImmediates && (h.setImmediates = []),
                  h.setImmediates.push(d),
                  postMessage({ target: "setimmediate" }))
                : postMessage("setimmediate", "*");
            };
          }
          zb = function () {
            setImmediate(Cb);
          };
        }
    }
    var Bb;
    Bb = r
      ? () => performance.now() - h.__performance_now_clock_drift
      : () => performance.now();
    function Eb(a) {
      a instanceof Fb || "unwind" == a || ha(1, a);
    }
    function Gb() {
      if (!db())
        try {
          r ? Hb(za) : Ib(za);
        } catch (a) {
          Eb(a);
        }
    }
    function Jb(a) {
      function b() {
        return c < Kb ? (--cb, Gb(), !1) : !0;
      }
      !xb ||
        y(
          "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."
        );
      xb = a;
      var c = Kb;
      yb = !1;
      Cb = function () {
        if (!ya)
          if (0 < Lb.length) {
            var d = Date.now(),
              e = Lb.shift();
            e.Ee(e.vc);
            if (Mb) {
              var f = Mb,
                g = 0 == f % 1 ? f - 1 : Math.floor(f);
              Mb = e.Gf ? g : (8 * f + (g + 0.5)) / 9;
            }
            v(
              'main loop blocker "' +
                e.name +
                '" took ' +
                (Date.now() - d) +
                " ms"
            );
            h.setStatus &&
              ((d = h.statusMessage || "Please wait..."),
              (e = Mb),
              (f = Nb.If),
              e
                ? e < f
                  ? h.setStatus(d + " (" + (f - e) + "/" + f + ")")
                  : h.setStatus(d)
                : h.setStatus(""));
            b() && setTimeout(Cb, 0);
          } else
            b() &&
              ((Ob = (Ob + 1) | 0),
              1 == vb && 1 < wb && 0 != Ob % wb
                ? zb()
                : (0 == vb && (Ab = Bb()),
                  ya ||
                    (h.preMainLoop && !1 === h.preMainLoop()) ||
                    (Pb(a), h.postMainLoop && h.postMainLoop()),
                  b() &&
                    ("object" == typeof SDL &&
                      SDL.audio &&
                      SDL.audio.ef &&
                      SDL.audio.ef(),
                    zb())));
      };
    }
    function Pb(a) {
      if (!bb && !ya)
        try {
          a(), Gb();
        } catch (b) {
          Eb(b);
        }
    }
    function Qb(a) {
      cb += 1;
      setTimeout(function () {
        --cb;
        Pb(a);
      }, 1e4);
    }
    var yb = !1,
      zb = null,
      Kb = 0,
      xb = null,
      vb = 0,
      wb = 0,
      Ob = 0,
      Lb = [],
      Nb = {},
      Ab,
      Cb,
      Mb,
      Rb = !1,
      Sb = !1,
      Tb = [];
    function Ub() {
      function a() {
        Sb =
          document.pointerLockElement === h.canvas ||
          document.mozPointerLockElement === h.canvas ||
          document.webkitPointerLockElement === h.canvas ||
          document.msPointerLockElement === h.canvas;
      }
      h.preloadPlugins || (h.preloadPlugins = []);
      if (!Vb) {
        Vb = !0;
        try {
          Wb = !0;
        } catch (c) {
          (Wb = !1),
            v(
              "warning: no blob constructor, cannot create blobs with mimetypes"
            );
        }
        Xb =
          "undefined" != typeof MozBlobBuilder
            ? MozBlobBuilder
            : "undefined" != typeof WebKitBlobBuilder
            ? WebKitBlobBuilder
            : Wb
            ? null
            : v("warning: no BlobBuilder");
        Yb =
          "undefined" != typeof window
            ? window.URL
              ? window.URL
              : window.webkitURL
            : void 0;
        h.Wd ||
          "undefined" != typeof Yb ||
          (v(
            "warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."
          ),
          (h.Wd = !0));
        h.preloadPlugins.push({
          canHandle: function (c) {
            return !h.Wd && /\.(jpg|jpeg|png|bmp)$/i.test(c);
          },
          handle: function (c, d, e, f) {
            var g = null;
            if (Wb)
              try {
                (g = new Blob([c], { type: Zb(d) })),
                  g.size !== c.length &&
                    (g = new Blob([new Uint8Array(c).buffer], { type: Zb(d) }));
              } catch (n) {
                qa(
                  "Blob constructor present but fails: " +
                    n +
                    "; falling back to blob builder"
                );
              }
            g ||
              ((g = new Xb()),
              g.append(new Uint8Array(c).buffer),
              (g = g.getBlob()));
            var k = Yb.createObjectURL(g),
              l = new Image();
            l.onload = () => {
              l.complete || y("Image " + d + " could not be decoded");
              var n = document.createElement("canvas");
              n.width = l.width;
              n.height = l.height;
              n.getContext("2d").drawImage(l, 0, 0);
              h.preloadedImages[d] = n;
              Yb.revokeObjectURL(k);
              e && e(c);
            };
            l.onerror = () => {
              v("Image " + k + " could not be decoded");
              f && f();
            };
            l.src = k;
          },
        });
        h.preloadPlugins.push({
          canHandle: function (c) {
            return !h.Sf && c.substr(-4) in { ".ogg": 1, ".wav": 1, ".mp3": 1 };
          },
          handle: function (c, d, e, f) {
            function g(q) {
              l || ((l = !0), (h.preloadedAudios[d] = q), e && e(c));
            }
            function k() {
              l || ((l = !0), (h.preloadedAudios[d] = new Audio()), f && f());
            }
            var l = !1;
            if (Wb) {
              try {
                var n = new Blob([c], { type: Zb(d) });
              } catch (q) {
                return k();
              }
              n = Yb.createObjectURL(n);
              var p = new Audio();
              p.addEventListener(
                "canplaythrough",
                function () {
                  g(p);
                },
                !1
              );
              p.onerror = function () {
                if (!l) {
                  v(
                    "warning: browser could not fully decode audio " +
                      d +
                      ", trying slower base64 approach"
                  );
                  for (var q = "", t = 0, m = 0, u = 0; u < c.length; u++)
                    for (t = (t << 8) | c[u], m += 8; 6 <= m; ) {
                      var x = (t >> (m - 6)) & 63;
                      m -= 6;
                      q +=
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                          x
                        ];
                    }
                  2 == m
                    ? ((q +=
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                          (t & 3) << 4
                        ]),
                      (q += "=="))
                    : 4 == m &&
                      ((q +=
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                          (t & 15) << 2
                        ]),
                      (q += "="));
                  p.src = "data:audio/x-" + d.substr(-3) + ";base64," + q;
                  g(p);
                }
              };
              p.src = n;
              Qb(function () {
                g(p);
              });
            } else return k();
          },
        });
        var b = h.canvas;
        b &&
          ((b.requestPointerLock =
            b.requestPointerLock ||
            b.mozRequestPointerLock ||
            b.webkitRequestPointerLock ||
            b.msRequestPointerLock ||
            function () {}),
          (b.exitPointerLock =
            document.exitPointerLock ||
            document.mozExitPointerLock ||
            document.webkitExitPointerLock ||
            document.msExitPointerLock ||
            function () {}),
          (b.exitPointerLock = b.exitPointerLock.bind(document)),
          document.addEventListener("pointerlockchange", a, !1),
          document.addEventListener("mozpointerlockchange", a, !1),
          document.addEventListener("webkitpointerlockchange", a, !1),
          document.addEventListener("mspointerlockchange", a, !1),
          h.elementPointerLock &&
            b.addEventListener(
              "click",
              function (c) {
                !Sb &&
                  h.canvas.requestPointerLock &&
                  (h.canvas.requestPointerLock(), c.preventDefault());
              },
              !1
            ));
      }
    }
    function $b(a, b, c, d) {
      Ub();
      var e = !1;
      h.preloadPlugins.forEach(function (f) {
        !e && f.canHandle(b) && (f.handle(a, b, c, d), (e = !0));
      });
      return e;
    }
    function ac(a, b, c, d) {
      if (b && h.Fd && a == h.canvas) return h.Fd;
      var e;
      if (b) {
        var f = { antialias: !1, alpha: !1, Nf: 1 };
        if (d) for (var g in d) f[g] = d[g];
        if ("undefined" != typeof GL && (e = GL.Hf(a, f)))
          var k = GL.getContext(e).Ef;
      } else k = a.getContext("2d");
      if (!k) return null;
      c &&
        (b ||
          "undefined" == typeof GLctx ||
          y(
            "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"
          ),
        (h.Fd = k),
        b && GL.Of(e),
        (h.Yf = b),
        Tb.forEach(function (l) {
          l();
        }),
        Ub());
      return k;
    }
    var bc = !1,
      cc = void 0,
      dc = void 0;
    function ec(a, b) {
      function c() {
        Rb = !1;
        var f = d.parentNode;
        (document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement ||
          document.webkitFullscreenElement ||
          document.webkitCurrentFullScreenElement) === f
          ? ((d.exitFullscreen = fc),
            cc && d.requestPointerLock(),
            (Rb = !0),
            dc
              ? ("undefined" != typeof SDL &&
                  (D[SDL.screen >> 2] = F[SDL.screen >> 2] | 8388608),
                gc(h.canvas),
                hc())
              : gc(d))
          : (f.parentNode.insertBefore(d, f),
            f.parentNode.removeChild(f),
            dc
              ? ("undefined" != typeof SDL &&
                  (D[SDL.screen >> 2] = F[SDL.screen >> 2] & -8388609),
                gc(h.canvas),
                hc())
              : gc(d));
        if (h.onFullScreen) h.onFullScreen(Rb);
        if (h.onFullscreen) h.onFullscreen(Rb);
      }
      cc = a;
      dc = b;
      "undefined" == typeof cc && (cc = !0);
      "undefined" == typeof dc && (dc = !1);
      var d = h.canvas;
      bc ||
        ((bc = !0),
        document.addEventListener("fullscreenchange", c, !1),
        document.addEventListener("mozfullscreenchange", c, !1),
        document.addEventListener("webkitfullscreenchange", c, !1),
        document.addEventListener("MSFullscreenChange", c, !1));
      var e = document.createElement("div");
      d.parentNode.insertBefore(e, d);
      e.appendChild(d);
      e.requestFullscreen =
        e.requestFullscreen ||
        e.mozRequestFullScreen ||
        e.msRequestFullscreen ||
        (e.webkitRequestFullscreen
          ? function () {
              e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
          : null) ||
        (e.webkitRequestFullScreen
          ? function () {
              e.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
          : null);
      e.requestFullscreen();
    }
    function fc() {
      if (!Rb) return !1;
      (
        document.exitFullscreen ||
        document.cancelFullScreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen ||
        document.webkitCancelFullScreen ||
        function () {}
      ).apply(document, []);
      return !0;
    }
    var ic = 0;
    function Db(a) {
      if ("function" == typeof requestAnimationFrame) requestAnimationFrame(a);
      else {
        var b = Date.now();
        if (0 === ic) ic = b + 1e3 / 60;
        else for (; b + 2 >= ic; ) ic += 1e3 / 60;
        setTimeout(a, Math.max(ic - b, 0));
      }
    }
    function Zb(a) {
      return {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        bmp: "image/bmp",
        ogg: "audio/ogg",
        wav: "audio/wav",
        mp3: "audio/mpeg",
      }[a.substr(a.lastIndexOf(".") + 1)];
    }
    var jc = [];
    function hc() {
      var a = h.canvas;
      jc.forEach(function (b) {
        b(a.width, a.height);
      });
    }
    function gc(a, b, c) {
      b && c ? ((a.Cf = b), (a.Me = c)) : ((b = a.Cf), (c = a.Me));
      var d = b,
        e = c;
      h.forcedAspectRatio &&
        0 < h.forcedAspectRatio &&
        (d / e < h.forcedAspectRatio
          ? (d = Math.round(e * h.forcedAspectRatio))
          : (e = Math.round(d / h.forcedAspectRatio)));
      if (
        (document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement ||
          document.webkitFullscreenElement ||
          document.webkitCurrentFullScreenElement) === a.parentNode &&
        "undefined" != typeof screen
      ) {
        var f = Math.min(screen.width / d, screen.height / e);
        d = Math.round(d * f);
        e = Math.round(e * f);
      }
      dc
        ? (a.width != d && (a.width = d),
          a.height != e && (a.height = e),
          "undefined" != typeof a.style &&
            (a.style.removeProperty("width"), a.style.removeProperty("height")))
        : (a.width != b && (a.width = b),
          a.height != c && (a.height = c),
          "undefined" != typeof a.style &&
            (d != b || e != c
              ? (a.style.setProperty("width", d + "px", "important"),
                a.style.setProperty("height", e + "px", "important"))
              : (a.style.removeProperty("width"),
                a.style.removeProperty("height"))));
    }
    var Vb, Wb, Xb, Yb;
    function fb(a) {
      for (; 0 < a.length; ) {
        var b = a.shift();
        if ("function" == typeof b) b(h);
        else {
          var c = b.Ee;
          "number" == typeof c
            ? void 0 === b.vc
              ? L(c)()
              : L(c)(b.vc)
            : c(void 0 === b.vc ? null : b.vc);
        }
      }
    }
    function kc(a) {
      var b = M();
      a = a();
      N(b);
      return a;
    }
    function lc(a) {
      var b = I.hc[a];
      b && ((D[a >> 2] = 0), I.$d(b.worker));
    }
    function mc(a) {
      var b = I.He();
      if (!b) return 6;
      I.Nc.push(b);
      var c = (I.hc[a.qd] = { worker: b, wd: a.qd });
      b.Bc = c;
      var d = {
        cmd: "run",
        start_routine: a.tf,
        arg: a.vc,
        threadInfoStruct: a.qd,
      };
      b.Mc = () => {
        d.time = performance.now();
        b.postMessage(d, a.zf);
      };
      b.loaded && (b.Mc(), delete b.Mc);
      return 0;
    }
    var I = {
      jc: [],
      Nc: [],
      Yc: [],
      init: function () {
        r ? I.Pe() : I.Oe();
      },
      Oe: function () {
        for (var a = nc() + 3, b = 0; b < a; ++b) I.Ad();
      },
      Pe: function () {
        I.receiveObjectTransfer = I.jf;
        I.threadInit = I.be;
        I.setExitStatus = I.nf;
        noExitRuntime = !1;
      },
      hc: {},
      nf: function (a) {
        za = a;
      },
      ae: function () {
        for (var a in I.hc) {
          var b = I.hc[a];
          b && b.worker && I.$d(b.worker);
        }
        for (a = 0; a < I.jc.length; ++a) I.jc[a].terminate();
        I.jc = [];
      },
      $d: function (a) {
        I.lf(function () {
          delete I.hc[a.Bc.wd];
          I.jc.push(a);
          I.Nc.splice(I.Nc.indexOf(a), 1);
          oc(a.Bc.wd);
          a.Bc = void 0;
        });
      },
      lf: function (a) {
        D[pc >> 2] = 0;
        try {
          a();
        } finally {
          D[pc >> 2] = 1;
        }
      },
      jf: function () {},
      be: function () {
        for (var a in I.Yc) if (I.Yc.hasOwnProperty(a)) I.Yc[a]();
      },
      Ud: function (a, b) {
        a.onmessage = (c) => {
          c = c.data;
          var d = c.cmd;
          a.Bc && (I.xe = a.Bc.wd);
          if (c.targetThread && c.targetThread != qc()) {
            var e = I.hc[c.Wf];
            e
              ? e.worker.postMessage(c, c.transferList)
              : w(
                  'Internal error! Worker sent a message "' +
                    d +
                    '" to target pthread ' +
                    c.targetThread +
                    ", but that thread no longer exists!"
                );
          } else if ("processProxyingQueue" === d)
            rc(c.queue), Atomics.sub(D, c.queue >> 2, 1);
          else if ("spawnThread" === d) mc(c);
          else if ("cleanupThread" === d) lc(c.thread);
          else if ("killThread" === d)
            (c = c.thread),
              (D[c >> 2] = 0),
              (d = I.hc[c]),
              delete I.hc[c],
              d.worker.terminate(),
              oc(c),
              I.Nc.splice(I.Nc.indexOf(d.worker), 1),
              (d.worker.Bc = void 0);
          else if ("cancelThread" === d)
            I.hc[c.thread].worker.postMessage({ cmd: "cancel" });
          else if ("loaded" === d)
            (a.loaded = !0), b && b(a), a.Mc && (a.Mc(), delete a.Mc);
          else if ("print" === d) v("Thread " + c.threadId + ": " + c.text);
          else if ("printErr" === d) w("Thread " + c.threadId + ": " + c.text);
          else if ("alert" === d) alert("Thread " + c.threadId + ": " + c.text);
          else if ("setimmediate" === c.target) a.postMessage(c);
          else if ("onAbort" === d) {
            if (h.onAbort) h.onAbort(c.arg);
          } else d && w("worker sent an unknown command " + d);
          I.xe = void 0;
        };
        a.onerror = (c) => {
          w(
            "worker sent an error! " +
              c.filename +
              ":" +
              c.lineno +
              ": " +
              c.message
          );
          throw c;
        };
        a.postMessage({
          cmd: "load",
          urlOrBlob: h.mainScriptUrlOrBlob || _scriptDir,
          wasmMemory: wa,
          wasmModule: xa,
        });
      },
      Ad: function () {
        var a = ma("vips.worker.js");
        I.jc.push(new Worker(a));
      },
      He: function () {
        0 == I.jc.length && (I.Ad(), I.Ud(I.jc[0]));
        return I.jc.pop();
      },
    };
    h.establishStackSpace = function () {
      var a = qc(),
        b = D[(a + 44) >> 2];
      sc(b, b - D[(a + 48) >> 2]);
      N(b);
    };
    function tc(a) {
      if (r) return O(1, 0, a);
      try {
        Ib(a);
      } catch (b) {
        Eb(b);
      }
    }
    var uc = [];
    function L(a) {
      var b = uc[a];
      b || (a >= uc.length && (uc.length = a + 1), (uc[a] = b = Wa.get(a)));
      return b;
    }
    h.invokeEntryPoint = function (a, b) {
      return L(a)(b);
    };
    function vc(a, b, c, d) {
      return r ? O(2, 1, a, b, c, d) : wc(a, b, c, d);
    }
    function wc(a, b, c, d) {
      if ("undefined" == typeof SharedArrayBuffer)
        return (
          w(
            "Current environment does not support SharedArrayBuffer, pthreads are not available!"
          ),
          6
        );
      var e = [];
      if (r && 0 === e.length) return vc(a, b, c, d);
      a = { tf: c, qd: a, vc: d, zf: e };
      return r ? ((a.Ff = "spawnThread"), postMessage(a, e), 0) : mc(a);
    }
    function xc(a, b) {
      for (var c = 0, d = a.length - 1; 0 <= d; d--) {
        var e = a[d];
        "." === e
          ? a.splice(d, 1)
          : ".." === e
          ? (a.splice(d, 1), c++)
          : c && (a.splice(d, 1), c--);
      }
      if (b) for (; c; c--) a.unshift("..");
      return a;
    }
    function yc(a) {
      var b = "/" === a.charAt(0),
        c = "/" === a.substr(-1);
      (a = xc(
        a.split("/").filter(function (d) {
          return !!d;
        }),
        !b
      ).join("/")) ||
        b ||
        (a = ".");
      a && c && (a += "/");
      return (b ? "/" : "") + a;
    }
    function zc(a) {
      var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
        .exec(a)
        .slice(1);
      a = b[0];
      b = b[1];
      if (!a && !b) return ".";
      b && (b = b.substr(0, b.length - 1));
      return a + b;
    }
    function Ac(a) {
      if ("/" === a) return "/";
      a = yc(a);
      a = a.replace(/\/$/, "");
      var b = a.lastIndexOf("/");
      return -1 === b ? a : a.substr(b + 1);
    }
    function Bc(a, b) {
      return yc(a + "/" + b);
    }
    function Cc() {
      if (
        "object" == typeof crypto &&
        "function" == typeof crypto.getRandomValues
      ) {
        var a = new Uint8Array(1);
        return function () {
          crypto.getRandomValues(a);
          return a[0];
        };
      }
      return function () {
        y("randomDevice");
      };
    }
    function Dc() {
      for (var a = "", b = !1, c = arguments.length - 1; -1 <= c && !b; c--) {
        b = 0 <= c ? arguments[c] : FS.cwd();
        if ("string" != typeof b)
          throw new TypeError("Arguments to path.resolve must be strings");
        if (!b) return "";
        a = b + "/" + a;
        b = "/" === b.charAt(0);
      }
      a = xc(
        a.split("/").filter(function (d) {
          return !!d;
        }),
        !b
      ).join("/");
      return (b ? "/" : "") + a || ".";
    }
    function Ec(a, b) {
      function c(g) {
        for (var k = 0; k < g.length && "" === g[k]; k++);
        for (var l = g.length - 1; 0 <= l && "" === g[l]; l--);
        return k > l ? [] : g.slice(k, l - k + 1);
      }
      a = Dc(a).substr(1);
      b = Dc(b).substr(1);
      a = c(a.split("/"));
      b = c(b.split("/"));
      for (var d = Math.min(a.length, b.length), e = d, f = 0; f < d; f++)
        if (a[f] !== b[f]) {
          e = f;
          break;
        }
      d = [];
      for (f = e; f < a.length; f++) d.push("..");
      d = d.concat(b.slice(e));
      return d.join("/");
    }
    var Fc = [];
    function Gc(a, b) {
      Fc[a] = { input: [], Ub: [], Ac: b };
      FS.registerDevice(a, Hc);
    }
    var Hc = {
        open: function (a) {
          var b = Fc[a.node.Kc];
          if (!b) throw new FS.Gb(43);
          a.Rb = b;
          a.seekable = !1;
        },
        close: function (a) {
          a.Rb.Ac.flush(a.Rb);
        },
        flush: function (a) {
          a.Rb.Ac.flush(a.Rb);
        },
        read: function (a, b, c, d) {
          if (!a.Rb || !a.Rb.Ac.Pd) throw new FS.Gb(60);
          for (var e = 0, f = 0; f < d; f++) {
            try {
              var g = a.Rb.Ac.Pd(a.Rb);
            } catch (k) {
              throw new FS.Gb(29);
            }
            if (void 0 === g && 0 === e) throw new FS.Gb(6);
            if (null === g || void 0 === g) break;
            e++;
            b[c + f] = g;
          }
          e && (a.node.timestamp = Date.now());
          return e;
        },
        write: function (a, b, c, d) {
          if (!a.Rb || !a.Rb.Ac.rd) throw new FS.Gb(60);
          try {
            for (var e = 0; e < d; e++) a.Rb.Ac.rd(a.Rb, b[c + e]);
          } catch (f) {
            throw new FS.Gb(29);
          }
          d && (a.node.timestamp = Date.now());
          return e;
        },
      },
      Jc = {
        Pd: function (a) {
          if (!a.input.length) {
            var b = null;
            "undefined" != typeof window && "function" == typeof window.prompt
              ? ((b = window.prompt("Input: ")), null !== b && (b += "\n"))
              : "function" == typeof readline &&
                ((b = readline()), null !== b && (b += "\n"));
            if (!b) return null;
            a.input = Ic(b, !0);
          }
          return a.input.shift();
        },
        rd: function (a, b) {
          null === b || 10 === b
            ? (v(Ba(a.Ub)), (a.Ub = []))
            : 0 != b && a.Ub.push(b);
        },
        flush: function (a) {
          a.Ub && 0 < a.Ub.length && (v(Ba(a.Ub)), (a.Ub = []));
        },
      },
      Kc = {
        rd: function (a, b) {
          null === b || 10 === b
            ? (w(Ba(a.Ub)), (a.Ub = []))
            : 0 != b && a.Ub.push(b);
        },
        flush: function (a) {
          a.Ub && 0 < a.Ub.length && (w(Ba(a.Ub)), (a.Ub = []));
        },
      },
      P = {
        fc: null,
        mount: function () {
          return P.createNode(null, "/", 16895, 0);
        },
        createNode: function (a, b, c, d) {
          if (FS.isBlkdev(c) || FS.Qe(c)) throw new FS.Gb(63);
          P.fc ||
            (P.fc = {
              dir: {
                node: {
                  dc: P.Ib.dc,
                  Tb: P.Ib.Tb,
                  rc: P.Ib.rc,
                  lc: P.Ib.lc,
                  rename: P.Ib.rename,
                  unlink: P.Ib.unlink,
                  rmdir: P.Ib.rmdir,
                  Lc: P.Ib.Lc,
                  symlink: P.Ib.symlink,
                },
                stream: { llseek: P.Jb.llseek },
              },
              file: {
                node: { dc: P.Ib.dc, Tb: P.Ib.Tb },
                stream: {
                  llseek: P.Jb.llseek,
                  read: P.Jb.read,
                  write: P.Jb.write,
                  Dc: P.Jb.Dc,
                  yc: P.Jb.yc,
                  zc: P.Jb.zc,
                },
              },
              link: {
                node: { dc: P.Ib.dc, Tb: P.Ib.Tb, readlink: P.Ib.readlink },
                stream: {},
              },
              Cd: { node: { dc: P.Ib.dc, Tb: P.Ib.Tb }, stream: FS.ne },
            });
          c = FS.createNode(a, b, c, d);
          FS.isDir(c.mode)
            ? ((c.Ib = P.fc.dir.node), (c.Jb = P.fc.dir.stream), (c.Kb = {}))
            : FS.isFile(c.mode)
            ? ((c.Ib = P.fc.file.node),
              (c.Jb = P.fc.file.stream),
              (c.Ob = 0),
              (c.Kb = null))
            : FS.isLink(c.mode)
            ? ((c.Ib = P.fc.link.node), (c.Jb = P.fc.link.stream))
            : FS.isChrdev(c.mode) &&
              ((c.Ib = P.fc.Cd.node), (c.Jb = P.fc.Cd.stream));
          c.timestamp = Date.now();
          a && ((a.Kb[b] = c), (a.timestamp = c.timestamp));
          return c;
        },
        Lf: function (a) {
          return a.Kb
            ? a.Kb.subarray
              ? a.Kb.subarray(0, a.Ob)
              : new Uint8Array(a.Kb)
            : new Uint8Array(0);
        },
        Kd: function (a, b) {
          var c = a.Kb ? a.Kb.length : 0;
          c >= b ||
            ((b = Math.max(b, (c * (1048576 > c ? 2 : 1.125)) >>> 0)),
            0 != c && (b = Math.max(b, 256)),
            (c = a.Kb),
            (a.Kb = new Uint8Array(b)),
            0 < a.Ob && a.Kb.set(c.subarray(0, a.Ob), 0));
        },
        kf: function (a, b) {
          if (a.Ob != b)
            if (0 == b) (a.Kb = null), (a.Ob = 0);
            else {
              var c = a.Kb;
              a.Kb = new Uint8Array(b);
              c && a.Kb.set(c.subarray(0, Math.min(b, a.Ob)));
              a.Ob = b;
            }
        },
        Ib: {
          dc: function (a) {
            var b = {};
            b.ye = FS.isChrdev(a.mode) ? a.id : 1;
            b.Td = a.id;
            b.mode = a.mode;
            b.Ze = 1;
            b.uid = 0;
            b.Le = 0;
            b.Kc = a.Kc;
            FS.isDir(a.mode)
              ? (b.size = 4096)
              : FS.isFile(a.mode)
              ? (b.size = a.Ob)
              : FS.isLink(a.mode)
              ? (b.size = a.link.length)
              : (b.size = 0);
            b.ie = new Date(a.timestamp);
            b.We = new Date(a.timestamp);
            b.we = new Date(a.timestamp);
            b.je = 4096;
            b.ke = Math.ceil(b.size / b.je);
            return b;
          },
          Tb: function (a, b) {
            void 0 !== b.mode && (a.mode = b.mode);
            void 0 !== b.timestamp && (a.timestamp = b.timestamp);
            void 0 !== b.size && P.kf(a, b.size);
          },
          rc: function () {
            throw FS.fd[44];
          },
          lc: function (a, b, c, d) {
            return P.createNode(a, b, c, d);
          },
          rename: function (a, b, c) {
            if (FS.isDir(a.mode)) {
              try {
                var d = FS.kc(b, c);
              } catch (f) {}
              if (d) for (var e in d.Kb) throw new FS.Gb(55);
            }
            delete a.parent.Kb[a.name];
            a.parent.timestamp = Date.now();
            a.name = c;
            b.Kb[c] = a;
            b.timestamp = a.parent.timestamp;
            a.parent = b;
          },
          unlink: function (a, b) {
            delete a.Kb[b];
            a.timestamp = Date.now();
          },
          rmdir: function (a, b) {
            var c = FS.kc(a, b),
              d;
            for (d in c.Kb) throw new FS.Gb(55);
            delete a.Kb[b];
            a.timestamp = Date.now();
          },
          Lc: function (a) {
            var b = [".", ".."],
              c;
            for (c in a.Kb) a.Kb.hasOwnProperty(c) && b.push(c);
            return b;
          },
          symlink: function (a, b, c) {
            a = P.createNode(a, b, 41471, 0);
            a.link = c;
            return a;
          },
          readlink: function (a) {
            if (!FS.isLink(a.mode)) throw new FS.Gb(28);
            return a.link;
          },
        },
        Jb: {
          read: function (a, b, c, d, e) {
            var f = a.node.Kb;
            if (e >= a.node.Ob) return 0;
            a = Math.min(a.node.Ob - e, d);
            if (8 < a && f.subarray) b.set(f.subarray(e, e + a), c);
            else for (d = 0; d < a; d++) b[c + d] = f[e + d];
            return a;
          },
          write: function (a, b, c, d, e, f) {
            if (!d) return 0;
            a = a.node;
            a.timestamp = Date.now();
            if (b.subarray && (!a.Kb || a.Kb.subarray)) {
              if (f) return (a.Kb = b.subarray(c, c + d)), (a.Ob = d);
              if (0 === a.Ob && 0 === e)
                return (a.Kb = b.slice(c, c + d)), (a.Ob = d);
              if (e + d <= a.Ob) return a.Kb.set(b.subarray(c, c + d), e), d;
            }
            P.Kd(a, e + d);
            if (a.Kb.subarray && b.subarray) a.Kb.set(b.subarray(c, c + d), e);
            else for (f = 0; f < d; f++) a.Kb[e + f] = b[c + f];
            a.Ob = Math.max(a.Ob, e + d);
            return d;
          },
          llseek: function (a, b, c) {
            1 === c
              ? (b += a.position)
              : 2 === c && FS.isFile(a.node.mode) && (b += a.node.Ob);
            if (0 > b) throw new FS.Gb(28);
            return b;
          },
          Dc: function (a, b, c) {
            P.Kd(a.node, b + c);
            a.node.Ob = Math.max(a.node.Ob, b + c);
          },
          yc: function (a, b, c, d, e, f) {
            if (0 !== b) throw new FS.Gb(28);
            if (!FS.isFile(a.node.mode)) throw new FS.Gb(43);
            a = a.node.Kb;
            if (f & 2 || a.buffer !== Qa) {
              if (0 < d || d + c < a.length)
                a.subarray
                  ? (a = a.subarray(d, d + c))
                  : (a = Array.prototype.slice.call(a, d, d + c));
              d = !0;
              c = 65536 * Math.ceil(c / 65536);
              (f = Lc(65536, c)) ? (A.fill(0, f, f + c), (c = f)) : (c = 0);
              if (!c) throw new FS.Gb(48);
              E.set(a, c);
            } else (d = !1), (c = a.byteOffset);
            return { Nb: c, he: d };
          },
          zc: function (a, b, c, d, e) {
            if (!FS.isFile(a.node.mode)) throw new FS.Gb(43);
            if (e & 2) return 0;
            P.Jb.write(a, b, 0, d, c, !1);
            return 0;
          },
        },
      };
    function Mc(a, b, c) {
      var d = "al " + a;
      oa(
        a,
        function (e) {
          e || y('Loading data file "' + a + '" failed (no arrayBuffer).');
          b(new Uint8Array(e));
          d && nb(d);
        },
        function () {
          if (c) c();
          else throw 'Loading data file "' + a + '" failed.';
        }
      );
      d && mb(d);
    }
    var FS = {
      root: null,
      Gc: [],
      Id: {},
      streams: [],
      Xe: 1,
      ec: null,
      Gd: "/",
      kd: !1,
      Sd: !0,
      Gb: null,
      fd: {},
      Ce: null,
      Xc: 0,
      lookupPath: (a, b = {}) => {
        a = Dc(FS.cwd(), a);
        if (!a) return { path: "", node: null };
        b = Object.assign({ ed: !0, ud: 0 }, b);
        if (8 < b.ud) throw new FS.Gb(32);
        a = xc(
          a.split("/").filter((g) => !!g),
          !1
        );
        for (var c = FS.root, d = "/", e = 0; e < a.length; e++) {
          var f = e === a.length - 1;
          if (f && b.parent) break;
          c = FS.kc(c, a[e]);
          d = Bc(d, a[e]);
          FS.qc(c) && (!f || (f && b.ed)) && (c = c.Fc.root);
          if (!f || b.follow)
            for (f = 0; FS.isLink(c.mode); )
              if (
                ((c = FS.readlink(d)),
                (d = Dc(zc(d), c)),
                (c = FS.lookupPath(d, { ud: b.ud + 1 }).node),
                40 < f++)
              )
                throw new FS.Gb(32);
        }
        return { path: d, node: c };
      },
      getPath: (a) => {
        for (var b; ; ) {
          if (FS.Uc(a))
            return (
              (a = a.mount.Vd),
              b ? ("/" !== a[a.length - 1] ? a + "/" + b : a + b) : a
            );
          b = b ? a.name + "/" + b : a.name;
          a = a.parent;
        }
      },
      jd: (a, b) => {
        for (var c = 0, d = 0; d < b.length; d++)
          c = ((c << 5) - c + b.charCodeAt(d)) | 0;
        return ((a + c) >>> 0) % FS.ec.length;
      },
      Qd: (a) => {
        var b = FS.jd(a.parent.id, a.name);
        a.sc = FS.ec[b];
        FS.ec[b] = a;
      },
      Rd: (a) => {
        var b = FS.jd(a.parent.id, a.name);
        if (FS.ec[b] === a) FS.ec[b] = a.sc;
        else
          for (b = FS.ec[b]; b; ) {
            if (b.sc === a) {
              b.sc = a.sc;
              break;
            }
            b = b.sc;
          }
      },
      kc: (a, b) => {
        var c = FS.Te(a);
        if (c) throw new FS.Gb(c, a);
        for (c = FS.ec[FS.jd(a.id, b)]; c; c = c.sc) {
          var d = c.name;
          if (c.parent.id === a.id && d === b) return c;
        }
        return FS.rc(a, b);
      },
      createNode: (a, b, c, d) => {
        a = new FS.ce(a, b, c, d);
        FS.Qd(a);
        return a;
      },
      cd: (a) => {
        FS.Rd(a);
      },
      Uc: (a) => a === a.parent,
      qc: (a) => !!a.Fc,
      isFile: (a) => 32768 === (a & 61440),
      isDir: (a) => 16384 === (a & 61440),
      isLink: (a) => 40960 === (a & 61440),
      isChrdev: (a) => 8192 === (a & 61440),
      isBlkdev: (a) => 24576 === (a & 61440),
      Qe: (a) => 4096 === (a & 61440),
      isSocket: (a) => 49152 === (a & 49152),
      De: { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 },
      Ve: (a) => {
        var b = FS.De[a];
        if ("undefined" == typeof b)
          throw Error("Unknown file open mode: " + a);
        return b;
      },
      Md: (a) => {
        var b = ["r", "w", "rw"][a & 3];
        a & 512 && (b += "w");
        return b;
      },
      oc: (a, b) => {
        if (FS.Sd) return 0;
        if (!b.includes("r") || a.mode & 292) {
          if (
            (b.includes("w") && !(a.mode & 146)) ||
            (b.includes("x") && !(a.mode & 73))
          )
            return 2;
        } else return 2;
        return 0;
      },
      Te: (a) => {
        var b = FS.oc(a, "x");
        return b ? b : a.Ib.rc ? 0 : 2;
      },
      pd: (a, b) => {
        try {
          return FS.kc(a, b), 20;
        } catch (c) {}
        return FS.oc(a, "wx");
      },
      Wc: (a, b, c) => {
        try {
          var d = FS.kc(a, b);
        } catch (e) {
          return e.Mb;
        }
        if ((a = FS.oc(a, "wx"))) return a;
        if (c) {
          if (!FS.isDir(d.mode)) return 54;
          if (FS.Uc(d) || FS.getPath(d) === FS.cwd()) return 10;
        } else if (FS.isDir(d.mode)) return 31;
        return 0;
      },
      Ue: (a, b) =>
        a
          ? FS.isLink(a.mode)
            ? 32
            : FS.isDir(a.mode) && ("r" !== FS.Md(b) || b & 512)
            ? 31
            : FS.oc(a, FS.Md(b))
          : 44,
      ee: 4096,
      Ye: (a = 0, b = FS.ee) => {
        for (; a <= b; a++) if (!FS.streams[a]) return a;
        throw new FS.Gb(33);
      },
      cc: (a) => FS.streams[a],
      bd: (a, b, c) => {
        FS.ad ||
          ((FS.ad = function () {}),
          (FS.ad.prototype = {
            object: {
              get: function () {
                return this.node;
              },
              set: function (d) {
                this.node = d;
              },
            },
          }));
        a = Object.assign(new FS.ad(), a);
        b = FS.Ye(b, c);
        a.bc = b;
        return (FS.streams[b] = a);
      },
      oe: (a) => {
        FS.streams[a] = null;
      },
      ne: {
        open: (a) => {
          a.Jb = FS.Ge(a.node.Kc).Jb;
          a.Jb.open && a.Jb.open(a);
        },
        llseek: () => {
          throw new FS.Gb(70);
        },
      },
      od: (a) => a >> 8,
      Pf: (a) => a & 255,
      makedev: (a, b) => (a << 8) | b,
      registerDevice: (a, b) => {
        FS.Id[a] = { Jb: b };
      },
      Ge: (a) => FS.Id[a],
      Od: (a) => {
        var b = [];
        for (a = [a]; a.length; ) {
          var c = a.pop();
          b.push(c);
          a.push.apply(a, c.Gc);
        }
        return b;
      },
      syncfs: (a, b) => {
        function c(g) {
          FS.Xc--;
          return b(g);
        }
        function d(g) {
          if (g) {
            if (!d.Ae) return (d.Ae = !0), c(g);
          } else ++f >= e.length && c(null);
        }
        "function" == typeof a && ((b = a), (a = !1));
        FS.Xc++;
        1 < FS.Xc &&
          w(
            "warning: " +
              FS.Xc +
              " FS.syncfs operations in flight at once, probably just doing extra work"
          );
        var e = FS.Od(FS.root.mount),
          f = 0;
        e.forEach((g) => {
          if (!g.type.syncfs) return d(null);
          g.type.syncfs(g, a, d);
        });
      },
      mount: (a, b, c) => {
        var d = "/" === c,
          e = !c;
        if (d && FS.root) throw new FS.Gb(10);
        if (!d && !e) {
          var f = FS.lookupPath(c, { ed: !1 });
          c = f.path;
          f = f.node;
          if (FS.qc(f)) throw new FS.Gb(10);
          if (!FS.isDir(f.mode)) throw new FS.Gb(54);
        }
        b = { type: a, Uf: b, Vd: c, Gc: [] };
        a = a.mount(b);
        a.mount = b;
        b.root = a;
        d ? (FS.root = a) : f && ((f.Fc = b), f.mount && f.mount.Gc.push(b));
        return a;
      },
      unmount: (a) => {
        a = FS.lookupPath(a, { ed: !1 });
        if (!FS.qc(a.node)) throw new FS.Gb(28);
        a = a.node;
        var b = a.Fc,
          c = FS.Od(b);
        Object.keys(FS.ec).forEach((d) => {
          for (d = FS.ec[d]; d; ) {
            var e = d.sc;
            c.includes(d.mount) && FS.cd(d);
            d = e;
          }
        });
        a.Fc = null;
        a.mount.Gc.splice(a.mount.Gc.indexOf(b), 1);
      },
      rc: (a, b) => a.Ib.rc(a, b),
      lc: (a, b, c) => {
        var d = FS.lookupPath(a, { parent: !0 }).node;
        a = Ac(a);
        if (!a || "." === a || ".." === a) throw new FS.Gb(28);
        var e = FS.pd(d, a);
        if (e) throw new FS.Gb(e);
        if (!d.Ib.lc) throw new FS.Gb(63);
        return d.Ib.lc(d, a, b, c);
      },
      create: (a, b) => FS.lc(a, ((void 0 !== b ? b : 438) & 4095) | 32768, 0),
      mkdir: (a, b) => FS.lc(a, ((void 0 !== b ? b : 511) & 1023) | 16384, 0),
      Qf: (a, b) => {
        a = a.split("/");
        for (var c = "", d = 0; d < a.length; ++d)
          if (a[d]) {
            c += "/" + a[d];
            try {
              FS.mkdir(c, b);
            } catch (e) {
              if (20 != e.Mb) throw e;
            }
          }
      },
      mkdev: (a, b, c) => {
        "undefined" == typeof c && ((c = b), (b = 438));
        return FS.lc(a, b | 8192, c);
      },
      symlink: (a, b) => {
        if (!Dc(a)) throw new FS.Gb(44);
        var c = FS.lookupPath(b, { parent: !0 }).node;
        if (!c) throw new FS.Gb(44);
        b = Ac(b);
        var d = FS.pd(c, b);
        if (d) throw new FS.Gb(d);
        if (!c.Ib.symlink) throw new FS.Gb(63);
        return c.Ib.symlink(c, b, a);
      },
      rename: (a, b) => {
        var c = zc(a),
          d = zc(b),
          e = Ac(a),
          f = Ac(b);
        var g = FS.lookupPath(a, { parent: !0 });
        var k = g.node;
        g = FS.lookupPath(b, { parent: !0 });
        g = g.node;
        if (!k || !g) throw new FS.Gb(44);
        if (k.mount !== g.mount) throw new FS.Gb(75);
        var l = FS.kc(k, e);
        a = Ec(a, d);
        if ("." !== a.charAt(0)) throw new FS.Gb(28);
        a = Ec(b, c);
        if ("." !== a.charAt(0)) throw new FS.Gb(55);
        try {
          var n = FS.kc(g, f);
        } catch (p) {}
        if (l !== n) {
          b = FS.isDir(l.mode);
          if ((e = FS.Wc(k, e, b))) throw new FS.Gb(e);
          if ((e = n ? FS.Wc(g, f, b) : FS.pd(g, f))) throw new FS.Gb(e);
          if (!k.Ib.rename) throw new FS.Gb(63);
          if (FS.qc(l) || (n && FS.qc(n))) throw new FS.Gb(10);
          if (g !== k && (e = FS.oc(k, "w"))) throw new FS.Gb(e);
          FS.Rd(l);
          try {
            k.Ib.rename(l, g, f);
          } catch (p) {
            throw p;
          } finally {
            FS.Qd(l);
          }
        }
      },
      rmdir: (a) => {
        var b = FS.lookupPath(a, { parent: !0 }).node;
        a = Ac(a);
        var c = FS.kc(b, a),
          d = FS.Wc(b, a, !0);
        if (d) throw new FS.Gb(d);
        if (!b.Ib.rmdir) throw new FS.Gb(63);
        if (FS.qc(c)) throw new FS.Gb(10);
        b.Ib.rmdir(b, a);
        FS.cd(c);
      },
      Lc: (a) => {
        a = FS.lookupPath(a, { follow: !0 }).node;
        if (!a.Ib.Lc) throw new FS.Gb(54);
        return a.Ib.Lc(a);
      },
      unlink: (a) => {
        var b = FS.lookupPath(a, { parent: !0 }).node;
        if (!b) throw new FS.Gb(44);
        a = Ac(a);
        var c = FS.kc(b, a),
          d = FS.Wc(b, a, !1);
        if (d) throw new FS.Gb(d);
        if (!b.Ib.unlink) throw new FS.Gb(63);
        if (FS.qc(c)) throw new FS.Gb(10);
        b.Ib.unlink(b, a);
        FS.cd(c);
      },
      readlink: (a) => {
        a = FS.lookupPath(a).node;
        if (!a) throw new FS.Gb(44);
        if (!a.Ib.readlink) throw new FS.Gb(28);
        return Dc(FS.getPath(a.parent), a.Ib.readlink(a));
      },
      stat: (a, b) => {
        a = FS.lookupPath(a, { follow: !b }).node;
        if (!a) throw new FS.Gb(44);
        if (!a.Ib.dc) throw new FS.Gb(63);
        return a.Ib.dc(a);
      },
      lstat: (a) => FS.stat(a, !0),
      chmod: (a, b, c) => {
        a = "string" == typeof a ? FS.lookupPath(a, { follow: !c }).node : a;
        if (!a.Ib.Tb) throw new FS.Gb(63);
        a.Ib.Tb(a, {
          mode: (b & 4095) | (a.mode & -4096),
          timestamp: Date.now(),
        });
      },
      lchmod: (a, b) => {
        FS.chmod(a, b, !0);
      },
      fchmod: (a, b) => {
        a = FS.cc(a);
        if (!a) throw new FS.Gb(8);
        FS.chmod(a.node, b);
      },
      chown: (a, b, c, d) => {
        a = "string" == typeof a ? FS.lookupPath(a, { follow: !d }).node : a;
        if (!a.Ib.Tb) throw new FS.Gb(63);
        a.Ib.Tb(a, { timestamp: Date.now() });
      },
      lchown: (a, b, c) => {
        FS.chown(a, b, c, !0);
      },
      fchown: (a, b, c) => {
        a = FS.cc(a);
        if (!a) throw new FS.Gb(8);
        FS.chown(a.node, b, c);
      },
      truncate: (a, b) => {
        if (0 > b) throw new FS.Gb(28);
        a = "string" == typeof a ? FS.lookupPath(a, { follow: !0 }).node : a;
        if (!a.Ib.Tb) throw new FS.Gb(63);
        if (FS.isDir(a.mode)) throw new FS.Gb(31);
        if (!FS.isFile(a.mode)) throw new FS.Gb(28);
        var c = FS.oc(a, "w");
        if (c) throw new FS.Gb(c);
        a.Ib.Tb(a, { size: b, timestamp: Date.now() });
      },
      ftruncate: (a, b) => {
        a = FS.cc(a);
        if (!a) throw new FS.Gb(8);
        if (0 === (a.flags & 2097155)) throw new FS.Gb(28);
        FS.truncate(a.node, b);
      },
      utime: (a, b, c) => {
        a = FS.lookupPath(a, { follow: !0 }).node;
        a.Ib.Tb(a, { timestamp: Math.max(b, c) });
      },
      open: (a, b, c, d, e) => {
        if ("" === a) throw new FS.Gb(44);
        b = "string" == typeof b ? FS.Ve(b) : b;
        c = b & 64 ? (("undefined" == typeof c ? 438 : c) & 4095) | 32768 : 0;
        if ("object" == typeof a) var f = a;
        else {
          a = yc(a);
          try {
            f = FS.lookupPath(a, { follow: !(b & 131072) }).node;
          } catch (k) {}
        }
        var g = !1;
        if (b & 64)
          if (f) {
            if (b & 128) throw new FS.Gb(20);
          } else (f = FS.lc(a, c, 0)), (g = !0);
        if (!f) throw new FS.Gb(44);
        FS.isChrdev(f.mode) && (b &= -513);
        if (b & 65536 && !FS.isDir(f.mode)) throw new FS.Gb(54);
        if (!g && (c = FS.Ue(f, b))) throw new FS.Gb(c);
        b & 512 && FS.truncate(f, 0);
        b &= -131713;
        d = FS.bd(
          {
            node: f,
            path: FS.getPath(f),
            flags: b,
            seekable: !0,
            position: 0,
            Jb: f.Jb,
            Af: [],
            error: !1,
          },
          d,
          e
        );
        d.Jb.open && d.Jb.open(d);
        !h.logReadFiles ||
          b & 1 ||
          (FS.td || (FS.td = {}), a in FS.td || (FS.td[a] = 1));
        return d;
      },
      close: (a) => {
        if (FS.Ec(a)) throw new FS.Gb(8);
        a.hd && (a.hd = null);
        try {
          a.Jb.close && a.Jb.close(a);
        } catch (b) {
          throw b;
        } finally {
          FS.oe(a.bc);
        }
        a.bc = null;
      },
      Ec: (a) => null === a.bc,
      llseek: (a, b, c) => {
        if (FS.Ec(a)) throw new FS.Gb(8);
        if (!a.seekable || !a.Jb.llseek) throw new FS.Gb(70);
        if (0 != c && 1 != c && 2 != c) throw new FS.Gb(28);
        a.position = a.Jb.llseek(a, b, c);
        a.Af = [];
        return a.position;
      },
      read: (a, b, c, d, e) => {
        if (0 > d || 0 > e) throw new FS.Gb(28);
        if (FS.Ec(a)) throw new FS.Gb(8);
        if (1 === (a.flags & 2097155)) throw new FS.Gb(8);
        if (FS.isDir(a.node.mode)) throw new FS.Gb(31);
        if (!a.Jb.read) throw new FS.Gb(28);
        var f = "undefined" != typeof e;
        if (!f) e = a.position;
        else if (!a.seekable) throw new FS.Gb(70);
        b = a.Jb.read(a, b, c, d, e);
        f || (a.position += b);
        return b;
      },
      write: (a, b, c, d, e, f) => {
        if (0 > d || 0 > e) throw new FS.Gb(28);
        if (FS.Ec(a)) throw new FS.Gb(8);
        if (0 === (a.flags & 2097155)) throw new FS.Gb(8);
        if (FS.isDir(a.node.mode)) throw new FS.Gb(31);
        if (!a.Jb.write) throw new FS.Gb(28);
        a.seekable && a.flags & 1024 && FS.llseek(a, 0, 2);
        var g = "undefined" != typeof e;
        if (!g) e = a.position;
        else if (!a.seekable) throw new FS.Gb(70);
        b = a.Jb.write(a, b, c, d, e, f);
        g || (a.position += b);
        return b;
      },
      Dc: (a, b, c) => {
        if (FS.Ec(a)) throw new FS.Gb(8);
        if (0 > b || 0 >= c) throw new FS.Gb(28);
        if (0 === (a.flags & 2097155)) throw new FS.Gb(8);
        if (!FS.isFile(a.node.mode) && !FS.isDir(a.node.mode))
          throw new FS.Gb(43);
        if (!a.Jb.Dc) throw new FS.Gb(138);
        a.Jb.Dc(a, b, c);
      },
      yc: (a, b, c, d, e, f) => {
        if (0 !== (e & 2) && 0 === (f & 2) && 2 !== (a.flags & 2097155))
          throw new FS.Gb(2);
        if (1 === (a.flags & 2097155)) throw new FS.Gb(2);
        if (!a.Jb.yc) throw new FS.Gb(43);
        return a.Jb.yc(a, b, c, d, e, f);
      },
      zc: (a, b, c, d, e) => (a && a.Jb.zc ? a.Jb.zc(a, b, c, d, e) : 0),
      Rf: () => 0,
      Sc: (a, b, c) => {
        if (!a.Jb.Sc) throw new FS.Gb(59);
        return a.Jb.Sc(a, b, c);
      },
      readFile: (a, b = {}) => {
        b.flags = b.flags || 0;
        b.encoding = b.encoding || "binary";
        if ("utf8" !== b.encoding && "binary" !== b.encoding)
          throw Error('Invalid encoding type "' + b.encoding + '"');
        var c,
          d = FS.open(a, b.flags);
        a = FS.stat(a).size;
        var e = new Uint8Array(a);
        FS.read(d, e, 0, a, 0);
        "utf8" === b.encoding
          ? (c = Ba(e))
          : "binary" === b.encoding && (c = e);
        FS.close(d);
        return c;
      },
      writeFile: (a, b, c = {}) => {
        c.flags = c.flags || 577;
        a = FS.open(a, c.flags, c.mode);
        if ("string" == typeof b) {
          var d = new Uint8Array(Da(b) + 1);
          b = Ca(b, d, 0, d.length);
          FS.write(a, d, 0, b, void 0, c.me);
        } else if (ArrayBuffer.isView(b))
          FS.write(a, b, 0, b.byteLength, void 0, c.me);
        else throw Error("Unsupported data type");
        FS.close(a);
      },
      cwd: () => FS.Gd,
      chdir: (a) => {
        a = FS.lookupPath(a, { follow: !0 });
        if (null === a.node) throw new FS.Gb(44);
        if (!FS.isDir(a.node.mode)) throw new FS.Gb(54);
        var b = FS.oc(a.node, "x");
        if (b) throw new FS.Gb(b);
        FS.Gd = a.path;
      },
      re: () => {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user");
      },
      qe: () => {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (b, c, d, e) => e,
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        Gc(FS.makedev(5, 0), Jc);
        Gc(FS.makedev(6, 0), Kc);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var a = Cc();
        FS.ac("/dev", "random", a);
        FS.ac("/dev", "urandom", a);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp");
      },
      ue: () => {
        FS.mkdir("/proc");
        var a = FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount(
          {
            mount: () => {
              var b = FS.createNode(a, "fd", 16895, 73);
              b.Ib = {
                rc: (c, d) => {
                  var e = FS.cc(+d);
                  if (!e) throw new FS.Gb(8);
                  c = {
                    parent: null,
                    mount: { Vd: "fake" },
                    Ib: { readlink: () => e.path },
                  };
                  return (c.parent = c);
                },
              };
              return b;
            },
          },
          {},
          "/proc/self/fd"
        );
      },
      ve: () => {
        h.stdin
          ? FS.ac("/dev", "stdin", h.stdin)
          : FS.symlink("/dev/tty", "/dev/stdin");
        h.stdout
          ? FS.ac("/dev", "stdout", null, h.stdout)
          : FS.symlink("/dev/tty", "/dev/stdout");
        h.stderr
          ? FS.ac("/dev", "stderr", null, h.stderr)
          : FS.symlink("/dev/tty1", "/dev/stderr");
        FS.open("/dev/stdin", 0);
        FS.open("/dev/stdout", 1);
        FS.open("/dev/stderr", 1);
      },
      Jd: () => {
        FS.Gb ||
          ((FS.Gb = function (a, b) {
            this.node = b;
            this.mf = function (c) {
              this.Mb = c;
            };
            this.mf(a);
            this.message = "FS error";
          }),
          (FS.Gb.prototype = Error()),
          (FS.Gb.prototype.constructor = FS.Gb),
          [44].forEach((a) => {
            FS.fd[a] = new FS.Gb(a);
            FS.fd[a].stack = "<generic error, no stack>";
          }));
      },
      uf: () => {
        FS.Jd();
        FS.ec = Array(4096);
        FS.mount(P, {}, "/");
        FS.re();
        FS.qe();
        FS.ue();
        FS.Ce = { MEMFS: P };
      },
      init: (a, b, c) => {
        FS.init.kd = !0;
        FS.Jd();
        h.stdin = a || h.stdin;
        h.stdout = b || h.stdout;
        h.stderr = c || h.stderr;
        FS.ve();
      },
      ff: () => {
        FS.init.kd = !1;
        Nc();
        for (var a = 0; a < FS.streams.length; a++) {
          var b = FS.streams[a];
          b && FS.close(b);
        }
      },
      gd: (a, b) => {
        var c = 0;
        a && (c |= 365);
        b && (c |= 146);
        return c;
      },
      Jf: (a, b) => {
        a = FS.analyzePath(a, b);
        return a.dd ? a.object : null;
      },
      analyzePath: (a, b) => {
        try {
          var c = FS.lookupPath(a, { follow: !b });
          a = c.path;
        } catch (e) {}
        var d = {
          Uc: !1,
          dd: !1,
          error: 0,
          name: null,
          path: null,
          object: null,
          $e: !1,
          bf: null,
          af: null,
        };
        try {
          (c = FS.lookupPath(a, { parent: !0 })),
            (d.$e = !0),
            (d.bf = c.path),
            (d.af = c.node),
            (d.name = Ac(a)),
            (c = FS.lookupPath(a, { follow: !b })),
            (d.dd = !0),
            (d.path = c.path),
            (d.object = c.node),
            (d.name = c.node.name),
            (d.Uc = "/" === c.path);
        } catch (e) {
          d.error = e.Mb;
        }
        return d;
      },
      Ed: (a, b) => {
        a = "string" == typeof a ? a : FS.getPath(a);
        for (b = b.split("/").reverse(); b.length; ) {
          var c = b.pop();
          if (c) {
            var d = Bc(a, c);
            try {
              FS.mkdir(d);
            } catch (e) {}
            a = d;
          }
        }
        return d;
      },
      se: (a, b, c, d, e) => {
        a = Bc("string" == typeof a ? a : FS.getPath(a), b);
        return FS.create(a, FS.gd(d, e));
      },
      Qc: (a, b, c, d, e, f) => {
        var g = b;
        a &&
          ((a = "string" == typeof a ? a : FS.getPath(a)),
          (g = b ? Bc(a, b) : a));
        a = FS.gd(d, e);
        g = FS.create(g, a);
        if (c) {
          if ("string" == typeof c) {
            b = Array(c.length);
            d = 0;
            for (e = c.length; d < e; ++d) b[d] = c.charCodeAt(d);
            c = b;
          }
          FS.chmod(g, a | 146);
          b = FS.open(g, 577);
          FS.write(b, c, 0, c.length, 0, f);
          FS.close(b);
          FS.chmod(g, a);
        }
        return g;
      },
      ac: (a, b, c, d) => {
        a = Bc("string" == typeof a ? a : FS.getPath(a), b);
        b = FS.gd(!!c, !!d);
        FS.ac.od || (FS.ac.od = 64);
        var e = FS.makedev(FS.ac.od++, 0);
        FS.registerDevice(e, {
          open: (f) => {
            f.seekable = !1;
          },
          close: () => {
            d && d.buffer && d.buffer.length && d(10);
          },
          read: (f, g, k, l) => {
            for (var n = 0, p = 0; p < l; p++) {
              try {
                var q = c();
              } catch (t) {
                throw new FS.Gb(29);
              }
              if (void 0 === q && 0 === n) throw new FS.Gb(6);
              if (null === q || void 0 === q) break;
              n++;
              g[k + p] = q;
            }
            n && (f.node.timestamp = Date.now());
            return n;
          },
          write: (f, g, k, l) => {
            for (var n = 0; n < l; n++)
              try {
                d(g[k + n]);
              } catch (p) {
                throw new FS.Gb(29);
              }
            l && (f.node.timestamp = Date.now());
            return n;
          },
        });
        return FS.mkdev(a, b, e);
      },
      Nd: (a) => {
        if (a.ld || a.Re || a.link || a.Kb) return !0;
        if ("undefined" != typeof XMLHttpRequest)
          throw Error(
            "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
          );
        if (na)
          try {
            (a.Kb = Ic(na(a.url), !0)), (a.Ob = a.Kb.length);
          } catch (b) {
            throw new FS.Gb(29);
          }
        else throw Error("Cannot load without read() or XMLHttpRequest.");
      },
      createLazyFile: (a, b, c, d, e) => {
        function f() {
          this.nd = !1;
          this.Pc = [];
        }
        f.prototype.get = function (n) {
          if (!(n > this.length - 1 || 0 > n)) {
            var p = n % this.Dd;
            return this.Rc((n / this.Dd) | 0)[p];
          }
        };
        f.prototype.de = function (n) {
          this.Rc = n;
        };
        f.prototype.Bd = function () {
          var n = new XMLHttpRequest();
          n.open("HEAD", c, !1);
          n.send(null);
          if (!((200 <= n.status && 300 > n.status) || 304 === n.status))
            throw Error("Couldn't load " + c + ". Status: " + n.status);
          var p = Number(n.getResponseHeader("Content-length")),
            q,
            t = (q = n.getResponseHeader("Accept-Ranges")) && "bytes" === q;
          n = (q = n.getResponseHeader("Content-Encoding")) && "gzip" === q;
          var m = 1048576;
          t || (m = p);
          var u = this;
          u.de((x) => {
            var C = x * m,
              J = (x + 1) * m - 1;
            J = Math.min(J, p - 1);
            if ("undefined" == typeof u.Pc[x]) {
              var S = u.Pc;
              if (C > J)
                throw Error(
                  "invalid range (" + C + ", " + J + ") or no bytes requested!"
                );
              if (J > p - 1)
                throw Error(
                  "only " + p + " bytes available! programmer error!"
                );
              var K = new XMLHttpRequest();
              K.open("GET", c, !1);
              p !== m && K.setRequestHeader("Range", "bytes=" + C + "-" + J);
              K.responseType = "arraybuffer";
              K.overrideMimeType &&
                K.overrideMimeType("text/plain; charset=x-user-defined");
              K.send(null);
              if (!((200 <= K.status && 300 > K.status) || 304 === K.status))
                throw Error("Couldn't load " + c + ". Status: " + K.status);
              C =
                void 0 !== K.response
                  ? new Uint8Array(K.response || [])
                  : Ic(K.responseText || "", !0);
              S[x] = C;
            }
            if ("undefined" == typeof u.Pc[x]) throw Error("doXHR failed!");
            return u.Pc[x];
          });
          if (n || !p)
            (m = p = 1),
              (m = p = this.Rc(0).length),
              v(
                "LazyFiles on gzip forces download of the whole file when length is accessed"
              );
          this.ge = p;
          this.fe = m;
          this.nd = !0;
        };
        if ("undefined" != typeof XMLHttpRequest) {
          if (!ja)
            throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
          var g = new f();
          Object.defineProperties(g, {
            length: {
              get: function () {
                this.nd || this.Bd();
                return this.ge;
              },
            },
            Dd: {
              get: function () {
                this.nd || this.Bd();
                return this.fe;
              },
            },
          });
          g = { ld: !1, Kb: g };
        } else g = { ld: !1, url: c };
        var k = FS.se(a, b, g, d, e);
        g.Kb ? (k.Kb = g.Kb) : g.url && ((k.Kb = null), (k.url = g.url));
        Object.defineProperties(k, {
          Ob: {
            get: function () {
              return this.Kb.length;
            },
          },
        });
        var l = {};
        Object.keys(k.Jb).forEach((n) => {
          var p = k.Jb[n];
          l[n] = function () {
            FS.Nd(k);
            return p.apply(null, arguments);
          };
        });
        l.read = (n, p, q, t, m) => {
          FS.Nd(k);
          n = n.node.Kb;
          if (m >= n.length) return 0;
          t = Math.min(n.length - m, t);
          if (n.slice) for (var u = 0; u < t; u++) p[q + u] = n[m + u];
          else for (u = 0; u < t; u++) p[q + u] = n.get(m + u);
          return t;
        };
        k.Jb = l;
        return k;
      },
      createPreloadedFile: (a, b, c, d, e, f, g, k, l, n) => {
        function p(m) {
          function u(x) {
            n && n();
            k || FS.Qc(a, b, x, d, e, l);
            f && f();
            nb(t);
          }
          $b(m, q, u, () => {
            g && g();
            nb(t);
          }) || u(m);
        }
        var q = b ? Dc(Bc(a, b)) : a,
          t = "cp " + q;
        mb(t);
        "string" == typeof c ? Mc(c, (m) => p(m), g) : p(c);
      },
      indexedDB: () =>
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB,
      yd: () => "EM_FS_" + window.location.pathname,
      zd: 20,
      Cc: "FILE_DATA",
      Vf: (a, b, c) => {
        b = b || (() => {});
        c = c || (() => {});
        var d = FS.indexedDB();
        try {
          var e = d.open(FS.yd(), FS.zd);
        } catch (f) {
          return c(f);
        }
        e.onupgradeneeded = () => {
          v("creating db");
          e.result.createObjectStore(FS.Cc);
        };
        e.onsuccess = () => {
          var f = e.result.transaction([FS.Cc], "readwrite"),
            g = f.objectStore(FS.Cc),
            k = 0,
            l = 0,
            n = a.length;
          a.forEach((p) => {
            p = g.put(FS.analyzePath(p).object.Kb, p);
            p.onsuccess = () => {
              k++;
              k + l == n && (0 == l ? b() : c());
            };
            p.onerror = () => {
              l++;
              k + l == n && (0 == l ? b() : c());
            };
          });
          f.onerror = c;
        };
        e.onerror = c;
      },
      Mf: (a, b, c) => {
        b = b || (() => {});
        c = c || (() => {});
        var d = FS.indexedDB();
        try {
          var e = d.open(FS.yd(), FS.zd);
        } catch (f) {
          return c(f);
        }
        e.onupgradeneeded = c;
        e.onsuccess = () => {
          var f = e.result;
          try {
            var g = f.transaction([FS.Cc], "readonly");
          } catch (q) {
            c(q);
            return;
          }
          var k = g.objectStore(FS.Cc),
            l = 0,
            n = 0,
            p = a.length;
          a.forEach((q) => {
            var t = k.get(q);
            t.onsuccess = () => {
              FS.analyzePath(q).dd && FS.unlink(q);
              FS.Qc(zc(q), Ac(q), t.result, !0, !0, !0);
              l++;
              l + n == p && (0 == n ? b() : c());
            };
            t.onerror = () => {
              n++;
              l + n == p && (0 == n ? b() : c());
            };
          });
          g.onerror = c;
        };
        e.onerror = c;
      },
    };
    function Oc(a, b, c) {
      if ("/" === b[0]) return b;
      if (-100 === a) a = FS.cwd();
      else {
        a = FS.cc(a);
        if (!a) throw new FS.Gb(8);
        a = a.path;
      }
      if (0 == b.length) {
        if (!c) throw new FS.Gb(44);
        return a;
      }
      return Bc(a, b);
    }
    function Pc(a, b, c) {
      try {
        var d = a(b);
      } catch (e) {
        if (e && e.node && yc(b) !== yc(FS.getPath(e.node))) return -54;
        throw e;
      }
      D[c >> 2] = d.ye;
      D[(c + 4) >> 2] = 0;
      D[(c + 8) >> 2] = d.Td;
      D[(c + 12) >> 2] = d.mode;
      D[(c + 16) >> 2] = d.Ze;
      D[(c + 20) >> 2] = d.uid;
      D[(c + 24) >> 2] = d.Le;
      D[(c + 28) >> 2] = d.Kc;
      D[(c + 32) >> 2] = 0;
      Sa[(c + 40) >> 3] = BigInt(d.size);
      D[(c + 48) >> 2] = 4096;
      D[(c + 52) >> 2] = d.ke;
      D[(c + 56) >> 2] = (d.ie.getTime() / 1e3) | 0;
      D[(c + 60) >> 2] = 0;
      D[(c + 64) >> 2] = (d.We.getTime() / 1e3) | 0;
      D[(c + 68) >> 2] = 0;
      D[(c + 72) >> 2] = (d.we.getTime() / 1e3) | 0;
      D[(c + 76) >> 2] = 0;
      Sa[(c + 80) >> 3] = BigInt(d.Td);
      return 0;
    }
    var Qc = void 0;
    function Rc() {
      Qc += 4;
      return D[(Qc - 4) >> 2];
    }
    function Sc(a) {
      a = FS.cc(a);
      if (!a) throw new FS.Gb(8);
      return a;
    }
    function Tc(a) {
      if (r) return O(4, 1, a);
      try {
        var b = Sc(a);
        return FS.open(b.path, b.flags, 0).bc;
      } catch (c) {
        if ("undefined" == typeof FS || !(c instanceof FS.Gb)) throw c;
        return -c.Mb;
      }
    }
    function Uc(a, b, c, d) {
      if (r) return O(6, 1, a, b, c, d);
      try {
        b = z(b);
        b = Oc(a, b);
        if (c & -8) var e = -28;
        else {
          var f = FS.lookupPath(b, { follow: !0 }).node;
          f
            ? ((a = ""),
              c & 4 && (a += "r"),
              c & 2 && (a += "w"),
              c & 1 && (a += "x"),
              (e = a && FS.oc(f, a) ? -2 : 0))
            : (e = -44);
        }
        return e;
      } catch (g) {
        if ("undefined" == typeof FS || !(g instanceof FS.Gb)) throw g;
        return -g.Mb;
      }
    }
    function Vc(a, b, c) {
      if (r) return O(7, 1, a, b, c);
      Qc = c;
      try {
        var d = Sc(a);
        switch (b) {
          case 0:
            var e = Rc();
            return 0 > e ? -28 : FS.open(d.path, d.flags, 0, e).bc;
          case 1:
          case 2:
            return 0;
          case 3:
            return d.flags;
          case 4:
            return (e = Rc()), (d.flags |= e), 0;
          case 5:
            return (e = Rc()), (Ha[(e + 0) >> 1] = 2), 0;
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            return (D[Wc() >> 2] = 28), -1;
          default:
            return -28;
        }
      } catch (f) {
        if ("undefined" == typeof FS || !(f instanceof FS.Gb)) throw f;
        return -f.Mb;
      }
    }
    function Xc(a, b) {
      if (r) return O(8, 1, a, b);
      try {
        var c = Sc(a);
        return Pc(FS.stat, c.path, b);
      } catch (d) {
        if ("undefined" == typeof FS || !(d instanceof FS.Gb)) throw d;
        return -d.Mb;
      }
    }
    function Yc(a, b, c) {
      if (r) return O(9, 1, a, b, c);
      try {
        return FS.ftruncate(a, b), 0;
      } catch (d) {
        if ("undefined" == typeof FS || !(d instanceof FS.Gb)) throw d;
        return -d.Mb;
      }
    }
    function Zc(a, b) {
      if (r) return O(10, 1, a, b);
      try {
        if (0 === b) return -28;
        var c = FS.cwd();
        if (b < Da(c) + 1) return -68;
        Ca(c, A, a, b);
        return a;
      } catch (d) {
        if ("undefined" == typeof FS || !(d instanceof FS.Gb)) throw d;
        return -d.Mb;
      }
    }
    function $c(a, b, c) {
      if (r) return O(11, 1, a, b, c);
      Qc = c;
      try {
        var d = Sc(a);
        switch (b) {
          case 21509:
          case 21505:
            return d.Rb ? 0 : -59;
          case 21510:
          case 21511:
          case 21512:
          case 21506:
          case 21507:
          case 21508:
            return d.Rb ? 0 : -59;
          case 21519:
            if (!d.Rb) return -59;
            var e = Rc();
            return (D[e >> 2] = 0);
          case 21520:
            return d.Rb ? -28 : -59;
          case 21531:
            return (e = Rc()), FS.Sc(d, b, e);
          case 21523:
            return d.Rb ? 0 : -59;
          case 21524:
            return d.Rb ? 0 : -59;
          default:
            y("bad ioctl syscall " + b);
        }
      } catch (f) {
        if ("undefined" == typeof FS || !(f instanceof FS.Gb)) throw f;
        return -f.Mb;
      }
    }
    function ad(a, b) {
      if (r) return O(12, 1, a, b);
      try {
        return (a = z(a)), Pc(FS.lstat, a, b);
      } catch (c) {
        if ("undefined" == typeof FS || !(c instanceof FS.Gb)) throw c;
        return -c.Mb;
      }
    }
    function bd(a, b, c, d) {
      if (r) return O(13, 1, a, b, c, d);
      try {
        b = z(b);
        var e = d & 256;
        b = Oc(a, b, d & 4096);
        return Pc(e ? FS.lstat : FS.stat, b, c);
      } catch (f) {
        if ("undefined" == typeof FS || !(f instanceof FS.Gb)) throw f;
        return -f.Mb;
      }
    }
    function cd(a, b, c, d) {
      if (r) return O(14, 1, a, b, c, d);
      Qc = d;
      try {
        b = z(b);
        b = Oc(a, b);
        var e = d ? Rc() : 0;
        return FS.open(b, c, e).bc;
      } catch (f) {
        if ("undefined" == typeof FS || !(f instanceof FS.Gb)) throw f;
        return -f.Mb;
      }
    }
    var H = {
      Xb: 8192,
      mount: function () {
        return FS.createNode(null, "/", 16895, 0);
      },
      te: function () {
        var a = { Pb: [], Zd: 2 };
        a.Pb.push({ buffer: new Uint8Array(H.Xb), offset: 0, Yb: 0 });
        var b = H.Hc(),
          c = H.Hc(),
          d = FS.createNode(H.root, b, 4096, 0),
          e = FS.createNode(H.root, c, 4096, 0);
        d.Ic = a;
        e.Ic = a;
        a = FS.bd({ path: b, node: d, flags: 0, seekable: !1, Jb: H.Jb });
        d.stream = a;
        c = FS.bd({ path: c, node: e, flags: 1, seekable: !1, Jb: H.Jb });
        e.stream = c;
        return { hf: a.bc, Df: c.bc };
      },
      Jb: {
        Xd: function (a) {
          var b = a.node.Ic;
          if (1 === (a.flags & 2097155)) return 260;
          if (0 < b.Pb.length)
            for (a = 0; a < b.Pb.length; a++) {
              var c = b.Pb[a];
              if (0 < c.offset - c.Yb) return 65;
            }
          return 0;
        },
        Sc: function () {
          return 28;
        },
        Kf: function () {
          return 28;
        },
        read: function (a, b, c, d) {
          a = a.node.Ic;
          for (var e = 0, f = 0; f < a.Pb.length; f++) {
            var g = a.Pb[f];
            e += g.offset - g.Yb;
          }
          b instanceof ArrayBuffer ||
            b instanceof SharedArrayBuffer ||
            ArrayBuffer.isView(b) ||
            y(void 0);
          b = b.subarray(c, c + d);
          if (0 >= d) return 0;
          if (0 == e) throw new FS.Gb(6);
          c = d = Math.min(e, d);
          for (f = e = 0; f < a.Pb.length; f++) {
            g = a.Pb[f];
            var k = g.offset - g.Yb;
            if (d <= k) {
              var l = g.buffer.subarray(g.Yb, g.offset);
              d < k ? ((l = l.subarray(0, d)), (g.Yb += d)) : e++;
              b.set(l);
              break;
            } else
              (l = g.buffer.subarray(g.Yb, g.offset)),
                b.set(l),
                (b = b.subarray(l.byteLength)),
                (d -= l.byteLength),
                e++;
          }
          e &&
            e == a.Pb.length &&
            (e--, (a.Pb[e].offset = 0), (a.Pb[e].Yb = 0));
          a.Pb.splice(0, e);
          return c;
        },
        write: function (a, b, c, d) {
          a = a.node.Ic;
          b instanceof ArrayBuffer ||
            b instanceof SharedArrayBuffer ||
            ArrayBuffer.isView(b) ||
            y(void 0);
          b = b.subarray(c, c + d);
          c = b.byteLength;
          if (0 >= c) return 0;
          0 == a.Pb.length
            ? ((d = { buffer: new Uint8Array(H.Xb), offset: 0, Yb: 0 }),
              a.Pb.push(d))
            : (d = a.Pb[a.Pb.length - 1]);
          d.offset <= H.Xb || y(void 0);
          var e = H.Xb - d.offset;
          if (e >= c) return d.buffer.set(b, d.offset), (d.offset += c), c;
          0 < e &&
            (d.buffer.set(b.subarray(0, e), d.offset),
            (d.offset += e),
            (b = b.subarray(e, b.byteLength)));
          d = (b.byteLength / H.Xb) | 0;
          e = b.byteLength % H.Xb;
          for (var f = 0; f < d; f++) {
            var g = { buffer: new Uint8Array(H.Xb), offset: H.Xb, Yb: 0 };
            a.Pb.push(g);
            g.buffer.set(b.subarray(0, H.Xb));
            b = b.subarray(H.Xb, b.byteLength);
          }
          0 < e &&
            ((g = {
              buffer: new Uint8Array(H.Xb),
              offset: b.byteLength,
              Yb: 0,
            }),
            a.Pb.push(g),
            g.buffer.set(b));
          return c;
        },
        close: function (a) {
          a = a.node.Ic;
          a.Zd--;
          0 === a.Zd && (a.Pb = null);
        },
      },
      Hc: function () {
        H.Hc.current || (H.Hc.current = 0);
        return "pipe[" + H.Hc.current++ + "]";
      },
    };
    function dd(a) {
      if (r) return O(15, 1, a);
      try {
        if (0 == a) throw new FS.Gb(21);
        var b = H.te();
        D[a >> 2] = b.hf;
        D[(a + 4) >> 2] = b.Df;
        return 0;
      } catch (c) {
        if ("undefined" == typeof FS || !(c instanceof FS.Gb)) throw c;
        return -c.Mb;
      }
    }
    function ed(a, b, c) {
      if (r) return O(16, 1, a, b, c);
      try {
        for (var d = (c = 0); d < b; d++) {
          var e = a + 8 * d,
            f = Ha[(e + 4) >> 1],
            g = 32,
            k = FS.cc(D[e >> 2]);
          k && ((g = 5), k.Jb.Xd && (g = k.Jb.Xd(k)));
          (g &= f | 24) && c++;
          Ha[(e + 6) >> 1] = g;
        }
        return c;
      } catch (l) {
        if ("undefined" == typeof FS || !(l instanceof FS.Gb)) throw l;
        return -l.Mb;
      }
    }
    function fd(a, b, c, d) {
      if (r) return O(17, 1, a, b, c, d);
      try {
        b = z(b);
        b = Oc(a, b);
        if (0 >= d) var e = -28;
        else {
          var f = FS.readlink(b),
            g = Math.min(d, Da(f)),
            k = E[c + g];
          Ca(f, A, c, d + 1);
          E[c + g] = k;
          e = g;
        }
        return e;
      } catch (l) {
        if ("undefined" == typeof FS || !(l instanceof FS.Gb)) throw l;
        return -l.Mb;
      }
    }
    function gd(a) {
      if (r) return O(18, 1, a);
      try {
        return (a = z(a)), FS.rmdir(a), 0;
      } catch (b) {
        if ("undefined" == typeof FS || !(b instanceof FS.Gb)) throw b;
        return -b.Mb;
      }
    }
    function hd(a, b) {
      if (r) return O(19, 1, a, b);
      try {
        return (a = z(a)), Pc(FS.stat, a, b);
      } catch (c) {
        if ("undefined" == typeof FS || !(c instanceof FS.Gb)) throw c;
        return -c.Mb;
      }
    }
    function jd(a, b, c) {
      if (r) return O(20, 1, a, b, c);
      try {
        return (
          (b = z(b)),
          (b = Oc(a, b)),
          0 === c
            ? FS.unlink(b)
            : 512 === c
            ? FS.rmdir(b)
            : y("Invalid flags passed to unlinkat"),
          0
        );
      } catch (d) {
        if ("undefined" == typeof FS || !(d instanceof FS.Gb)) throw d;
        return -d.Mb;
      }
    }
    var kd = {};
    function ld(a) {
      for (; a.length; ) {
        var b = a.pop();
        a.pop()(b);
      }
    }
    function md(a) {
      return this.fromWireType(F[a >> 2]);
    }
    var nd = {},
      od = {},
      pd = {};
    function qd(a) {
      if (void 0 === a) return "_unknown";
      a = a.replace(/[^a-zA-Z0-9_]/g, "$");
      var b = a.charCodeAt(0);
      return 48 <= b && 57 >= b ? "_" + a : a;
    }
    function rd(a, b) {
      a = qd(a);
      return new Function(
        "body",
        "return function " +
          a +
          '() {\n    "use strict";    return body.apply(this, arguments);\n};\n'
      )(b);
    }
    function sd(a) {
      var b = Error,
        c = rd(a, function (d) {
          this.name = a;
          this.message = d;
          d = Error(d).stack;
          void 0 !== d &&
            (this.stack =
              this.toString() + "\n" + d.replace(/^Error(:[^\n]*)?\n/, ""));
        });
      c.prototype = Object.create(b.prototype);
      c.prototype.constructor = c;
      c.prototype.toString = function () {
        return void 0 === this.message
          ? this.name
          : this.name + ": " + this.message;
      };
      return c;
    }
    var td = void 0;
    function ud(a) {
      throw new td(a);
    }
    function vd(a, b, c) {
      function d(k) {
        k = c(k);
        k.length !== a.length && ud("Mismatched type converter count");
        for (var l = 0; l < a.length; ++l) Q(a[l], k[l]);
      }
      a.forEach(function (k) {
        pd[k] = b;
      });
      var e = Array(b.length),
        f = [],
        g = 0;
      b.forEach((k, l) => {
        od.hasOwnProperty(k)
          ? (e[l] = od[k])
          : (f.push(k),
            nd.hasOwnProperty(k) || (nd[k] = []),
            nd[k].push(() => {
              e[l] = od[k];
              ++g;
              g === f.length && d(e);
            }));
      });
      0 === f.length && d(e);
    }
    var wd = void 0;
    function R(a) {
      for (var b = ""; A[a]; ) b += wd[A[a++]];
      return b;
    }
    var xd = void 0;
    function T(a) {
      throw new xd(a);
    }
    function Q(a, b, c = {}) {
      if (!("argPackAdvance" in b))
        throw new TypeError(
          "registerType registeredInstance requires argPackAdvance"
        );
      var d = b.name;
      a || T('type "' + d + '" must have a positive integer typeid pointer');
      if (od.hasOwnProperty(a)) {
        if (c.Ne) return;
        T("Cannot register type '" + d + "' twice");
      }
      od[a] = b;
      delete pd[a];
      nd.hasOwnProperty(a) &&
        ((b = nd[a]), delete nd[a], b.forEach((e) => e()));
    }
    function yd(a) {
      switch (a) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError("Unknown type size: " + a);
      }
    }
    function zd(a, b) {
      switch (b) {
        case 2:
          return Ra;
        case 3:
          return Ua;
        default:
          throw new TypeError("Unknown float type: " + a);
      }
    }
    function Ad(a, b, c) {
      switch (b) {
        case 0:
          return c ? E : A;
        case 1:
          return c ? Ha : B;
        case 2:
          return c ? D : F;
        case 3:
          return c ? Sa : Ta;
        default:
          throw new TypeError("Unknown integer type: " + a);
      }
    }
    function Bd(a) {
      if (null === a) return "null";
      var b = typeof a;
      return "object" === b || "array" === b || "function" === b
        ? a.toString()
        : "" + a;
    }
    function Cd(a, b, c) {
      var d = Ad(a, b, c);
      switch (b) {
        case 0:
          return function (e) {
            return d[e];
          };
        case 1:
          return function (e) {
            return d[e >> 1];
          };
        case 2:
          return function (e) {
            return d[e >> 2];
          };
        case 3:
          return function (e) {
            return d[e >> 3];
          };
      }
    }
    function Dd(a) {
      T(a.Hb.Qb.Lb.name + " instance already deleted");
    }
    var Ed = !1,
      Fd = !1;
    function Gd() {}
    function Hd(a) {
      --a.count.value;
      0 === a.count.value && (a.Wb ? a.Zb.mc(a.Wb) : a.Qb.Lb.mc(a.Nb));
    }
    function Id(a, b, c) {
      if (b === c) return a;
      if (void 0 === c.$b) return null;
      a = Id(a, b, c.$b);
      return null === a ? null : c.ze(a);
    }
    var Jd = {},
      Kd = [];
    function Ld() {
      for (; Kd.length; ) {
        var a = Kd.pop();
        a.Hb.xc = !1;
        a["delete"]();
      }
    }
    var Md = void 0,
      Nd = {};
    function Od(a, b) {
      for (void 0 === b && T("ptr should not be undefined"); a.$b; )
        (b = a.Oc(b)), (a = a.$b);
      return Nd[b];
    }
    function Pd(a, b) {
      (b.Qb && b.Nb) || ud("makeClassHandle requires ptr and ptrType");
      !!b.Zb !== !!b.Wb &&
        ud("Both smartPtrType and smartPtr must be specified");
      b.count = { value: 1 };
      return Qd(Object.create(a, { Hb: { value: b } }));
    }
    function Qd(a) {
      if (Ed) return (Qd = (b) => b.deleteLater()), Qd(a);
      if ("undefined" === typeof FinalizationRegistry)
        return (Qd = (b) => b), a;
      Fd = new FinalizationRegistry((b) => {
        Hd(b.Hb);
      });
      Qd = (b) => {
        var c = b.Hb;
        c.Wb && Fd.register(b, { Hb: c }, b);
        return b;
      };
      Gd = (b) => {
        Fd.unregister(b);
      };
      return Qd(a);
    }
    function Rd() {}
    function Sd(a, b, c) {
      if (void 0 === a[b].Sb) {
        var d = a[b];
        a[b] = function () {
          a[b].Sb.hasOwnProperty(arguments.length) ||
            T(
              "Function '" +
                c +
                "' called with an invalid number of arguments (" +
                arguments.length +
                ") - expects one of (" +
                a[b].Sb +
                ")!"
            );
          return a[b].Sb[arguments.length].apply(this, arguments);
        };
        a[b].Sb = [];
        a[b].Sb[d.wc] = d;
      }
    }
    function Td(a, b, c) {
      h.hasOwnProperty(a)
        ? ((void 0 === c || (void 0 !== h[a].Sb && void 0 !== h[a].Sb[c])) &&
            T("Cannot register public name '" + a + "' twice"),
          Sd(h, a, a),
          h.hasOwnProperty(c) &&
            T(
              "Cannot register multiple overloads of a function with the same number of arguments (" +
                c +
                ")!"
            ),
          (h[a].Sb[c] = b))
        : ((h[a] = b), void 0 !== c && (h[a].Tf = c));
    }
    function Ud(a, b, c, d, e, f, g, k) {
      this.name = a;
      this.constructor = b;
      this.nc = c;
      this.mc = d;
      this.$b = e;
      this.Fe = f;
      this.Oc = g;
      this.ze = k;
      this.df = [];
    }
    function Vd(a, b, c) {
      for (; b !== c; )
        b.Oc ||
          T(
            "Expected null or instance of " +
              c.name +
              ", got an instance of " +
              b.name
          ),
          (a = b.Oc(a)),
          (b = b.$b);
      return a;
    }
    function Wd(a, b) {
      if (null === b)
        return this.md && T("null is not a valid " + this.name), 0;
      b.Hb || T('Cannot pass "' + Bd(b) + '" as a ' + this.name);
      b.Hb.Nb ||
        T("Cannot pass deleted object as a pointer of type " + this.name);
      return Vd(b.Hb.Nb, b.Hb.Qb.Lb, this.Lb);
    }
    function Xd(a, b) {
      if (null === b) {
        this.md && T("null is not a valid " + this.name);
        if (this.Vc) {
          var c = this.sd();
          null !== a && a.push(this.mc, c);
          return c;
        }
        return 0;
      }
      b.Hb || T('Cannot pass "' + Bd(b) + '" as a ' + this.name);
      b.Hb.Nb ||
        T("Cannot pass deleted object as a pointer of type " + this.name);
      !this.Tc &&
        b.Hb.Qb.Tc &&
        T(
          "Cannot convert argument of type " +
            (b.Hb.Zb ? b.Hb.Zb.name : b.Hb.Qb.name) +
            " to parameter type " +
            this.name
        );
      c = Vd(b.Hb.Nb, b.Hb.Qb.Lb, this.Lb);
      if (this.Vc)
        switch (
          (void 0 === b.Hb.Wb &&
            T("Passing raw pointer to smart pointer is illegal"),
          this.sf)
        ) {
          case 0:
            b.Hb.Zb === this
              ? (c = b.Hb.Wb)
              : T(
                  "Cannot convert argument of type " +
                    (b.Hb.Zb ? b.Hb.Zb.name : b.Hb.Qb.name) +
                    " to parameter type " +
                    this.name
                );
            break;
          case 1:
            c = b.Hb.Wb;
            break;
          case 2:
            if (b.Hb.Zb === this) c = b.Hb.Wb;
            else {
              var d = b.clone();
              c = this.gf(
                c,
                U(function () {
                  d["delete"]();
                })
              );
              null !== a && a.push(this.mc, c);
            }
            break;
          default:
            T("Unsupporting sharing policy");
        }
      return c;
    }
    function Yd(a, b) {
      if (null === b)
        return this.md && T("null is not a valid " + this.name), 0;
      b.Hb || T('Cannot pass "' + Bd(b) + '" as a ' + this.name);
      b.Hb.Nb ||
        T("Cannot pass deleted object as a pointer of type " + this.name);
      b.Hb.Qb.Tc &&
        T(
          "Cannot convert argument of type " +
            b.Hb.Qb.name +
            " to parameter type " +
            this.name
        );
      return Vd(b.Hb.Nb, b.Hb.Qb.Lb, this.Lb);
    }
    function Zd(a, b, c, d) {
      this.name = a;
      this.Lb = b;
      this.md = c;
      this.Tc = d;
      this.Vc = !1;
      this.mc = this.gf = this.sd = this.Yd = this.sf = this.cf = void 0;
      void 0 !== b.$b
        ? (this.toWireType = Xd)
        : ((this.toWireType = d ? Wd : Yd), (this.Vb = null));
    }
    function $d(a, b, c) {
      h.hasOwnProperty(a) || ud("Replacing nonexistant public symbol");
      void 0 !== h[a].Sb && void 0 !== c
        ? (h[a].Sb[c] = b)
        : ((h[a] = b), (h[a].wc = c));
    }
    function V(a, b) {
      a = R(a);
      var c = L(b);
      "function" != typeof c &&
        T("unknown function pointer with signature " + a + ": " + b);
      return c;
    }
    var ae = void 0;
    function be(a) {
      a = ce(a);
      var b = R(a);
      W(a);
      return b;
    }
    function de(a, b) {
      function c(f) {
        e[f] || od[f] || (pd[f] ? pd[f].forEach(c) : (d.push(f), (e[f] = !0)));
      }
      var d = [],
        e = {};
      b.forEach(c);
      throw new ae(a + ": " + d.map(be).join([", "]));
    }
    function ee(a) {
      var b = Function;
      if (!(b instanceof Function))
        throw new TypeError(
          "new_ called with constructor type " +
            typeof b +
            " which is not a function"
        );
      var c = rd(b.name || "unknownFunctionName", function () {});
      c.prototype = b.prototype;
      c = new c();
      a = b.apply(c, a);
      return a instanceof Object ? a : c;
    }
    function fe(a, b, c, d, e) {
      var f = b.length;
      2 > f &&
        T(
          "argTypes array size mismatch! Must at least get return value and 'this' types!"
        );
      var g = null !== b[1] && null !== c,
        k = !1;
      for (c = 1; c < b.length; ++c)
        if (null !== b[c] && void 0 === b[c].Vb) {
          k = !0;
          break;
        }
      var l = "void" !== b[0].name,
        n = "",
        p = "";
      for (c = 0; c < f - 2; ++c)
        (n += (0 !== c ? ", " : "") + "arg" + c),
          (p += (0 !== c ? ", " : "") + "arg" + c + "Wired");
      a =
        "return function " +
        qd(a) +
        "(" +
        n +
        ") {\nif (arguments.length !== " +
        (f - 2) +
        ") {\nthrowBindingError('function " +
        a +
        " called with ' + arguments.length + ' arguments, expected " +
        (f - 2) +
        " args!');\n}\n";
      k && (a += "var destructors = [];\n");
      var q = k ? "destructors" : "null";
      n =
        "throwBindingError invoker fn runDestructors retType classParam".split(
          " "
        );
      d = [T, d, e, ld, b[0], b[1]];
      g && (a += "var thisWired = classParam.toWireType(" + q + ", this);\n");
      for (c = 0; c < f - 2; ++c)
        (a +=
          "var arg" +
          c +
          "Wired = argType" +
          c +
          ".toWireType(" +
          q +
          ", arg" +
          c +
          "); // " +
          b[c + 2].name +
          "\n"),
          n.push("argType" + c),
          d.push(b[c + 2]);
      g && (p = "thisWired" + (0 < p.length ? ", " : "") + p);
      a +=
        (l ? "var rv = " : "") +
        "invoker(fn" +
        (0 < p.length ? ", " : "") +
        p +
        ");\n";
      if (k) a += "runDestructors(destructors);\n";
      else
        for (c = g ? 1 : 2; c < b.length; ++c)
          (f = 1 === c ? "thisWired" : "arg" + (c - 2) + "Wired"),
            null !== b[c].Vb &&
              ((a += f + "_dtor(" + f + "); // " + b[c].name + "\n"),
              n.push(f + "_dtor"),
              d.push(b[c].Vb));
      l && (a += "var ret = retType.fromWireType(rv);\nreturn ret;\n");
      n.push(a + "}\n");
      return ee(n).apply(null, d);
    }
    function ge(a, b) {
      for (var c = [], d = 0; d < a; d++) c.push(D[(b >> 2) + d]);
      return c;
    }
    function he(a, b, c) {
      a instanceof Object || T(c + ' with invalid "this": ' + a);
      a instanceof b.Lb.constructor ||
        T(c + ' incompatible with "this" of type ' + a.constructor.name);
      a.Hb.Nb ||
        T("cannot call emscripten binding method " + c + " on deleted object");
      return Vd(a.Hb.Nb, a.Hb.Qb.Lb, b.Lb);
    }
    var ie = [],
      X = [
        {},
        { value: void 0 },
        { value: null },
        { value: !0 },
        { value: !1 },
      ];
    function je(a) {
      4 < a && 0 === --X[a].vd && ((X[a] = void 0), ie.push(a));
    }
    var Y = (a) => {
        a || T("Cannot use deleted val. handle = " + a);
        return X[a].value;
      },
      U = (a) => {
        switch (a) {
          case void 0:
            return 1;
          case null:
            return 2;
          case !0:
            return 3;
          case !1:
            return 4;
          default:
            var b = ie.length ? ie.pop() : X.length;
            X[b] = { vd: 1, value: a };
            return b;
        }
      };
    function le(a, b, c) {
      var d = Ad(a, b, c);
      switch (b) {
        case 0:
          return function (e) {
            return this.fromWireType(d[e]);
          };
        case 1:
          return function (e) {
            return this.fromWireType(d[e >> 1]);
          };
        case 2:
          return function (e) {
            return this.fromWireType(d[e >> 2]);
          };
      }
    }
    function me(a, b) {
      var c = od[a];
      void 0 === c && T(b + " has unknown type " + be(a));
      return c;
    }
    function ne(a, b) {
      var c = zd(a, b);
      switch (b) {
        case 2:
          return function (d) {
            return this.fromWireType(c[d >> 2]);
          };
        case 3:
          return function (d) {
            return this.fromWireType(c[d >> 3]);
          };
      }
    }
    function oe(a, b) {
      for (var c = Array(a), d = 0; d < a; ++d)
        c[d] = me(D[(b >> 2) + d], "parameter " + d);
      return c;
    }
    var pe = {};
    function qe(a) {
      var b = pe[a];
      return void 0 === b ? R(a) : b;
    }
    var re = [];
    function se() {
      return "object" == typeof globalThis
        ? globalThis
        : Function("return this")();
    }
    function te(a) {
      var b = re.length;
      re.push(a);
      return b;
    }
    var ue = [],
      ve = {};
    function we(a, b, c, d, e, f, g, k) {
      if (r) return O(21, 1, a, b, c, d, e, f, g, k);
      try {
        var l = FS.cc(e);
        if (!l) return -8;
        var n = FS.yc(l, a, b, f, c, d),
          p = n.Nb;
        D[g >> 2] = n.he;
        return p;
      } catch (q) {
        if ("undefined" == typeof FS || !(q instanceof FS.Gb)) throw q;
        return -q.Mb;
      }
    }
    function xe(a, b, c, d, e, f) {
      if (r) return O(22, 1, a, b, c, d, e, f);
      try {
        var g = FS.cc(e);
        g && c & 2 && FS.zc(g, A.slice(a, a + b), f, b, d);
      } catch (k) {
        if ("undefined" == typeof FS || !(k instanceof FS.Gb)) throw k;
        return -k.Mb;
      }
    }
    function ye(a, b, c) {
      function d(l) {
        return (l = l.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? l[1] : "GMT";
      }
      if (r) return O(23, 1, a, b, c);
      var e = new Date().getFullYear(),
        f = new Date(e, 0, 1),
        g = new Date(e, 6, 1);
      e = f.getTimezoneOffset();
      var k = g.getTimezoneOffset();
      D[a >> 2] = 60 * Math.max(e, k);
      D[b >> 2] = Number(e != k);
      a = d(f);
      b = d(g);
      a = Ma(a);
      b = Ma(b);
      k < e
        ? ((D[c >> 2] = a), (D[(c + 4) >> 2] = b))
        : ((D[c >> 2] = b), (D[(c + 4) >> 2] = a));
    }
    function ze(a, b, c) {
      ze.le || ((ze.le = !0), ye(a, b, c));
    }
    function nc() {
      return navigator.hardwareConcurrency;
    }
    function O(a, b) {
      var c = arguments.length - 2,
        d = arguments;
      return kc(function () {
        for (var e = 2 * c, f = Pa(8 * e), g = f >> 3, k = 0; k < c; k++) {
          var l = d[2 + k];
          "bigint" == typeof l
            ? ((Sa[g + 2 * k] = BigInt(1)), (Sa[g + 2 * k + 1] = l))
            : ((Sa[g + 2 * k] = BigInt(0)), (Ua[g + 2 * k + 1] = l));
        }
        return Ae(a, e, f, b);
      });
    }
    var Be = [],
      Ce = {};
    function De() {
      if (!Ee) {
        var a = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG:
              (
                ("object" == typeof navigator &&
                  navigator.languages &&
                  navigator.languages[0]) ||
                "C"
              ).replace("-", "_") + ".UTF-8",
            _: fa || "./this.program",
          },
          b;
        for (b in Ce) void 0 === Ce[b] ? delete a[b] : (a[b] = Ce[b]);
        var c = [];
        for (b in a) c.push(b + "=" + a[b]);
        Ee = c;
      }
      return Ee;
    }
    var Ee;
    function Fe(a, b) {
      if (r) return O(24, 1, a, b);
      var c = 0;
      De().forEach(function (d, e) {
        var f = b + c;
        e = D[(a + 4 * e) >> 2] = f;
        for (f = 0; f < d.length; ++f) E[e++ >> 0] = d.charCodeAt(f);
        E[e >> 0] = 0;
        c += d.length + 1;
      });
      return 0;
    }
    function Ge(a, b) {
      if (r) return O(25, 1, a, b);
      var c = De();
      D[a >> 2] = c.length;
      var d = 0;
      c.forEach(function (e) {
        d += e.length + 1;
      });
      D[b >> 2] = d;
      return 0;
    }
    function He(a) {
      if (r) return O(26, 1, a);
      try {
        var b = Sc(a);
        FS.close(b);
        return 0;
      } catch (c) {
        if ("undefined" == typeof FS || !(c instanceof FS.Gb)) throw c;
        return c.Mb;
      }
    }
    function Ie(a, b) {
      if (r) return O(27, 1, a, b);
      try {
        var c = Sc(a),
          d = c.Rb ? 2 : FS.isDir(c.mode) ? 3 : FS.isLink(c.mode) ? 7 : 4;
        E[b >> 0] = d;
        return 0;
      } catch (e) {
        if ("undefined" == typeof FS || !(e instanceof FS.Gb)) throw e;
        return e.Mb;
      }
    }
    function Je(a, b, c, d) {
      if (r) return O(28, 1, a, b, c, d);
      try {
        a: {
          for (var e = Sc(a), f = (a = 0); f < c; f++) {
            var g = D[(b + (8 * f + 4)) >> 2],
              k = FS.read(e, E, D[(b + 8 * f) >> 2], g, void 0);
            if (0 > k) {
              var l = -1;
              break a;
            }
            a += k;
            if (k < g) break;
          }
          l = a;
        }
        D[d >> 2] = l;
        return 0;
      } catch (n) {
        if ("undefined" == typeof FS || !(n instanceof FS.Gb)) throw n;
        return n.Mb;
      }
    }
    function Ke(a, b, c, d) {
      if (r) return O(29, 1, a, b, c, d);
      try {
        var e = Number(b & BigInt(4294967295)) | 0,
          f = Number(b >> BigInt(32)) | 0,
          g = Sc(a);
        a = 4294967296 * f + (e >>> 0);
        if (-9007199254740992 >= a || 9007199254740992 <= a) return -61;
        FS.llseek(g, a, c);
        Sa[d >> 3] = BigInt(g.position);
        g.hd && 0 === a && 0 === c && (g.hd = null);
        return 0;
      } catch (k) {
        if ("undefined" == typeof FS || !(k instanceof FS.Gb)) throw k;
        return k.Mb;
      }
    }
    function Le(a, b, c, d) {
      if (r) return O(30, 1, a, b, c, d);
      try {
        a: {
          for (var e = Sc(a), f = (a = 0); f < c; f++) {
            var g = FS.write(
              e,
              E,
              D[(b + 8 * f) >> 2],
              D[(b + (8 * f + 4)) >> 2],
              void 0
            );
            if (0 > g) {
              var k = -1;
              break a;
            }
            a += g;
          }
          k = a;
        }
        D[d >> 2] = k;
        return 0;
      } catch (l) {
        if ("undefined" == typeof FS || !(l instanceof FS.Gb)) throw l;
        return l.Mb;
      }
    }
    function Me(a) {
      if (r) return O(31, 1, a);
      Ne(a);
    }
    function Oe(a) {
      return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400);
    }
    var Pe = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Qe = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    h.requestFullscreen = function (a, b) {
      ec(a, b);
    };
    h.requestAnimationFrame = function (a) {
      Db(a);
    };
    h.setCanvasSize = function (a, b, c) {
      gc(h.canvas, a, b);
      c || hc();
    };
    h.pauseMainLoop = function () {
      zb = null;
      Kb++;
    };
    h.resumeMainLoop = function () {
      Kb++;
      var a = vb,
        b = wb,
        c = xb;
      xb = null;
      Jb(c);
      ub(a, b);
      zb();
    };
    h.getUserMedia = function () {
      window.getUserMedia ||
        (window.getUserMedia =
          navigator.getUserMedia || navigator.mozGetUserMedia);
      window.getUserMedia(void 0);
    };
    h.createContext = function (a, b, c, d) {
      return ac(a, b, c, d);
    };
    I.init();
    function Re(a, b, c, d) {
      a || (a = this);
      this.parent = a;
      this.mount = a.mount;
      this.Fc = null;
      this.id = FS.Xe++;
      this.name = b;
      this.mode = c;
      this.Ib = {};
      this.Jb = {};
      this.Kc = d;
    }
    Object.defineProperties(Re.prototype, {
      read: {
        get: function () {
          return 365 === (this.mode & 365);
        },
        set: function (a) {
          a ? (this.mode |= 365) : (this.mode &= -366);
        },
      },
      write: {
        get: function () {
          return 146 === (this.mode & 146);
        },
        set: function (a) {
          a ? (this.mode |= 146) : (this.mode &= -147);
        },
      },
      Re: {
        get: function () {
          return FS.isDir(this.mode);
        },
      },
      ld: {
        get: function () {
          return FS.isChrdev(this.mode);
        },
      },
    });
    FS.ce = Re;
    FS.uf();
    h.FS_createPath = FS.Ed;
    h.FS_createDataFile = FS.Qc;
    h.FS_createPreloadedFile = FS.createPreloadedFile;
    h.FS_createLazyFile = FS.createLazyFile;
    h.FS_createDevice = FS.ac;
    h.FS_unlink = FS.unlink;
    td = h.InternalError = sd("InternalError");
    for (var Se = Array(256), Te = 0; 256 > Te; ++Te)
      Se[Te] = String.fromCharCode(Te);
    wd = Se;
    xd = h.BindingError = sd("BindingError");
    Rd.prototype.isAliasOf = function (a) {
      if (!(this instanceof Rd && a instanceof Rd)) return !1;
      var b = this.Hb.Qb.Lb,
        c = this.Hb.Nb,
        d = a.Hb.Qb.Lb;
      for (a = a.Hb.Nb; b.$b; ) (c = b.Oc(c)), (b = b.$b);
      for (; d.$b; ) (a = d.Oc(a)), (d = d.$b);
      return b === d && c === a;
    };
    Rd.prototype.clone = function () {
      this.Hb.Nb || Dd(this);
      if (this.Hb.Jc) return (this.Hb.count.value += 1), this;
      var a = Qd,
        b = Object,
        c = b.create,
        d = Object.getPrototypeOf(this),
        e = this.Hb;
      a = a(
        c.call(b, d, {
          Hb: {
            value: {
              count: e.count,
              xc: e.xc,
              Jc: e.Jc,
              Nb: e.Nb,
              Qb: e.Qb,
              Wb: e.Wb,
              Zb: e.Zb,
            },
          },
        })
      );
      a.Hb.count.value += 1;
      a.Hb.xc = !1;
      return a;
    };
    Rd.prototype["delete"] = function () {
      this.Hb.Nb || Dd(this);
      this.Hb.xc && !this.Hb.Jc && T("Object already scheduled for deletion");
      Gd(this);
      Hd(this.Hb);
      this.Hb.Jc || ((this.Hb.Wb = void 0), (this.Hb.Nb = void 0));
    };
    Rd.prototype.isDeleted = function () {
      return !this.Hb.Nb;
    };
    Rd.prototype.deleteLater = function () {
      this.Hb.Nb || Dd(this);
      this.Hb.xc && !this.Hb.Jc && T("Object already scheduled for deletion");
      Kd.push(this);
      1 === Kd.length && Md && Md(Ld);
      this.Hb.xc = !0;
      return this;
    };
    h.getInheritedInstanceCount = function () {
      return Object.keys(Nd).length;
    };
    h.getLiveInheritedInstances = function () {
      var a = [],
        b;
      for (b in Nd) Nd.hasOwnProperty(b) && a.push(Nd[b]);
      return a;
    };
    h.setAutoDeleteLater = function (a) {
      Ed = a;
    };
    h.flushPendingDeletes = Ld;
    h.setDelayFunction = function (a) {
      Md = a;
      Kd.length && Md && Md(Ld);
    };
    Zd.prototype.Ie = function (a) {
      this.Yd && (a = this.Yd(a));
      return a;
    };
    Zd.prototype.Hd = function (a) {
      this.mc && this.mc(a);
    };
    Zd.prototype.argPackAdvance = 8;
    Zd.prototype.readValueFromPointer = md;
    Zd.prototype.deleteObject = function (a) {
      if (null !== a) a["delete"]();
    };
    Zd.prototype.fromWireType = function (a) {
      function b() {
        return this.Vc
          ? Pd(this.Lb.nc, { Qb: this.cf, Nb: c, Zb: this, Wb: a })
          : Pd(this.Lb.nc, { Qb: this, Nb: a });
      }
      var c = this.Ie(a);
      if (!c) return this.Hd(a), null;
      var d = Od(this.Lb, c);
      if (void 0 !== d) {
        if (0 === d.Hb.count.value)
          return (d.Hb.Nb = c), (d.Hb.Wb = a), d.clone();
        d = d.clone();
        this.Hd(a);
        return d;
      }
      d = this.Lb.Fe(c);
      d = Jd[d];
      if (!d) return b.call(this);
      d = this.Tc ? d.pe : d.pointerType;
      var e = Id(c, this.Lb, d.Lb);
      return null === e
        ? b.call(this)
        : this.Vc
        ? Pd(d.Lb.nc, { Qb: d, Nb: e, Zb: this, Wb: a })
        : Pd(d.Lb.nc, { Qb: d, Nb: e });
    };
    ae = h.UnboundTypeError = sd("UnboundTypeError");
    h.count_emval_handles = function () {
      for (var a = 0, b = 5; b < X.length; ++b) void 0 !== X[b] && ++a;
      return a;
    };
    h.get_first_emval = function () {
      for (var a = 5; a < X.length; ++a) if (void 0 !== X[a]) return X[a];
      return null;
    };
    var Ue = [
      null,
      tc,
      vc,
      function (a) {
        if (r) return O(3, 1, a);
        try {
          return (a = z(a)), FS.chdir(a), 0;
        } catch (b) {
          if ("undefined" == typeof FS || !(b instanceof FS.Gb)) throw b;
          return -b.Mb;
        }
      },
      Tc,
      function (a, b, c) {
        if (r) return O(5, 1, a, b, c);
        try {
          var d = Sc(a);
          if (d.bc === b) return -28;
          var e = FS.cc(b);
          e && FS.close(e);
          return FS.open(d.path, d.flags, 0, b, b).bc;
        } catch (f) {
          if ("undefined" == typeof FS || !(f instanceof FS.Gb)) throw f;
          return -f.Mb;
        }
      },
      Uc,
      Vc,
      Xc,
      Yc,
      Zc,
      $c,
      ad,
      bd,
      cd,
      dd,
      ed,
      fd,
      gd,
      hd,
      jd,
      we,
      xe,
      ye,
      Fe,
      Ge,
      He,
      Ie,
      Je,
      Ke,
      Le,
      Me,
    ];
    function Ic(a, b) {
      var c = Array(Da(a) + 1);
      a = Ca(a, c, 0, c.length);
      b && (c.length = a);
      return c;
    }
    var nf = {
      e: function (a, b, c, d) {
        y(
          "Assertion failed: " +
            z(a) +
            ", at: " +
            [b ? z(b) : "unknown filename", c, d ? z(d) : "unknown function"]
        );
      },
      $a: function (a, b) {
        L(a)(b);
      },
      la: function (a) {
        Ve(a, !ja, 1, !ia);
        I.be();
      },
      ia: function (a) {
        r ? postMessage({ cmd: "cleanupThread", thread: a }) : lc(a);
      },
      Y: function () {
        D[Wc() >> 2] = 63;
        return -1;
      },
      bb: wc,
      Ca: Tc,
      Da: Uc,
      B: Vc,
      ua: Xc,
      qa: Yc,
      pa: Zc,
      Fa: $c,
      ra: ad,
      sa: bd,
      X: cd,
      fb: dd,
      eb: ed,
      _a: fd,
      Ya: gd,
      ta: hd,
      ha: jd,
      ea: function (a) {
        var b = kd[a];
        delete kd[a];
        var c = b.sd,
          d = b.mc,
          e = b.Ld,
          f = e.map((g) => g.Ke).concat(e.map((g) => g.qf));
        vd([a], f, (g) => {
          var k = {};
          e.forEach((l, n) => {
            var p = g[n],
              q = l.Rc,
              t = l.Je,
              m = g[n + e.length],
              u = l.pf,
              x = l.rf;
            k[l.Be] = {
              read: (C) => p.fromWireType(q(t, C)),
              write: (C, J) => {
                var S = [];
                u(x, C, m.toWireType(S, J));
                ld(S);
              },
            };
          });
          return [
            {
              name: b.name,
              fromWireType: function (l) {
                var n = {},
                  p;
                for (p in k) n[p] = k[p].read(l);
                d(l);
                return n;
              },
              toWireType: function (l, n) {
                for (var p in k)
                  if (!(p in n))
                    throw new TypeError('Missing field:  "' + p + '"');
                var q = c();
                for (p in k) k[p].write(q, n[p]);
                null !== l && l.push(d, q);
                return q;
              },
              argPackAdvance: 8,
              readValueFromPointer: md,
              Vb: d,
            },
          ];
        });
      },
      da: function (a, b, c, d, e) {
        b = R(b);
        var f = yd(c);
        Q(a, {
          name: b,
          fromWireType: function (g) {
            for (
              var k = F[g >> 2],
                l = d ? zd(b, f) : Ad(b, f, e),
                n = Array(k),
                p = g + c,
                q = 0;
              q < k;
              ++q
            )
              n[q] = l[(p >> f) + q];
            W(g);
            return n;
          },
          toWireType: function (g, k) {
            "number" == typeof k && (k = [k]);
            Array.isArray(k) ||
              T("Cannot pass non-array to C++ vector type " + b);
            k = Array.prototype.concat.apply([], k);
            var l = k.length,
              n = d ? zd(b, f) : Ad(b, f, e),
              p = Na(c + l * c);
            F[p >> 2] = l;
            for (var q = p + c, t = 0; t < l; ++t) n[(q >> f) + t] = k[t];
            null !== g && g.push(W, p);
            return p;
          },
          argPackAdvance: 8,
          readValueFromPointer: md,
          Vb: function (g) {
            W(g);
          },
        });
      },
      aa: function (a, b, c, d, e) {
        b = R(b);
        c = yd(c);
        var f = b.includes("u");
        f && (e = (BigInt(1) << BigInt(64)) - BigInt(1));
        Q(a, {
          name: b,
          fromWireType: function (g) {
            return g;
          },
          toWireType: function (g, k) {
            if ("bigint" != typeof k)
              throw new TypeError(
                'Cannot convert "' + Bd(k) + '" to ' + this.name
              );
            if (k < d || k > e)
              throw new TypeError(
                'Passing a number "' +
                  Bd(k) +
                  '" from JS side to C/C++ side to an argument of type "' +
                  b +
                  '", which is outside the valid range [' +
                  d +
                  ", " +
                  e +
                  "]!"
              );
            return k;
          },
          argPackAdvance: 8,
          readValueFromPointer: Cd(b, c, !f),
          Vb: null,
        });
      },
      Ka: function (a, b, c, d, e) {
        var f = yd(c);
        b = R(b);
        Q(a, {
          name: b,
          fromWireType: function (g) {
            return !!g;
          },
          toWireType: function (g, k) {
            return k ? d : e;
          },
          argPackAdvance: 8,
          readValueFromPointer: function (g) {
            var k = Ad(b, f, !0);
            return this.fromWireType(k[g >> f]);
          },
          Vb: null,
        });
      },
      z: function (a, b, c, d, e, f, g, k, l, n, p, q, t) {
        p = R(p);
        f = V(e, f);
        k && (k = V(g, k));
        n && (n = V(l, n));
        t = V(q, t);
        var m = qd(p);
        Td(m, function () {
          de("Cannot construct " + p + " due to unbound types", [d]);
        });
        vd([a, b, c], d ? [d] : [], function (u) {
          u = u[0];
          if (d) {
            var x = u.Lb;
            var C = x.nc;
          } else C = Rd.prototype;
          u = rd(m, function () {
            if (Object.getPrototypeOf(this) !== J)
              throw new xd("Use 'new' to construct " + p);
            if (void 0 === S.pc)
              throw new xd(p + " has no accessible constructor");
            var ke = S.pc[arguments.length];
            if (void 0 === ke)
              throw new xd(
                "Tried to invoke ctor of " +
                  p +
                  " with invalid number of parameters (" +
                  arguments.length +
                  ") - expected (" +
                  Object.keys(S.pc).toString() +
                  ") parameters instead!"
              );
            return ke.apply(this, arguments);
          });
          var J = Object.create(C, { constructor: { value: u } });
          u.prototype = J;
          var S = new Ud(p, u, J, t, x, f, k, n);
          x = new Zd(p, S, !0, !1);
          C = new Zd(p + "*", S, !1, !1);
          var K = new Zd(p + " const*", S, !1, !0);
          Jd[a] = { pointerType: C, pe: K };
          $d(m, u);
          return [x, C, K];
        });
      },
      h: function (a, b, c, d, e, f, g) {
        var k = ge(c, d);
        b = R(b);
        f = V(e, f);
        vd([], [a], function (l) {
          function n() {
            de("Cannot call " + p + " due to unbound types", k);
          }
          l = l[0];
          var p = l.name + "." + b;
          b.startsWith("@@") && (b = Symbol[b.substring(2)]);
          var q = l.Lb.constructor;
          void 0 === q[b]
            ? ((n.wc = c - 1), (q[b] = n))
            : (Sd(q, b, p), (q[b].Sb[c - 1] = n));
          vd([], k, function (t) {
            t = fe(p, [t[0], null].concat(t.slice(1)), null, f, g);
            void 0 === q[b].Sb
              ? ((t.wc = c - 1), (q[b] = t))
              : (q[b].Sb[c - 1] = t);
            return [];
          });
          return [];
        });
      },
      A: function (a, b, c, d, e, f) {
        0 < b || y(void 0);
        var g = ge(b, c);
        e = V(d, e);
        vd([], [a], function (k) {
          k = k[0];
          var l = "constructor " + k.name;
          void 0 === k.Lb.pc && (k.Lb.pc = []);
          if (void 0 !== k.Lb.pc[b - 1])
            throw new xd(
              "Cannot register multiple constructors with identical number of parameters (" +
                (b - 1) +
                ") for class '" +
                k.name +
                "'! Overload resolution is currently only performed using the parameter count, not actual type info!"
            );
          k.Lb.pc[b - 1] = () => {
            de("Cannot construct " + k.name + " due to unbound types", g);
          };
          vd([], g, function (n) {
            n.splice(1, 0, null);
            k.Lb.pc[b - 1] = fe(l, n, null, e, f);
            return [];
          });
          return [];
        });
      },
      d: function (a, b, c, d, e, f, g, k) {
        var l = ge(c, d);
        b = R(b);
        f = V(e, f);
        vd([], [a], function (n) {
          function p() {
            de("Cannot call " + q + " due to unbound types", l);
          }
          n = n[0];
          var q = n.name + "." + b;
          b.startsWith("@@") && (b = Symbol[b.substring(2)]);
          k && n.Lb.df.push(b);
          var t = n.Lb.nc,
            m = t[b];
          void 0 === m ||
          (void 0 === m.Sb && m.className !== n.name && m.wc === c - 2)
            ? ((p.wc = c - 2), (p.className = n.name), (t[b] = p))
            : (Sd(t, b, q), (t[b].Sb[c - 2] = p));
          vd([], l, function (u) {
            u = fe(q, u, n, f, g);
            void 0 === t[b].Sb
              ? ((u.wc = c - 2), (t[b] = u))
              : (t[b].Sb[c - 2] = u);
            return [];
          });
          return [];
        });
      },
      w: function (a, b, c, d, e, f, g, k, l, n) {
        b = R(b);
        e = V(d, e);
        vd([], [a], function (p) {
          p = p[0];
          var q = p.name + "." + b,
            t = {
              get: function () {
                de("Cannot access " + q + " due to unbound types", [c, g]);
              },
              enumerable: !0,
              configurable: !0,
            };
          t.set = l
            ? () => {
                de("Cannot access " + q + " due to unbound types", [c, g]);
              }
            : () => {
                T(q + " is a read-only property");
              };
          Object.defineProperty(p.Lb.nc, b, t);
          vd([], l ? [c, g] : [c], function (m) {
            var u = m[0],
              x = {
                get: function () {
                  var J = he(this, p, q + " getter");
                  return u.fromWireType(e(f, J));
                },
                enumerable: !0,
              };
            if (l) {
              l = V(k, l);
              var C = m[1];
              x.set = function (J) {
                var S = he(this, p, q + " setter"),
                  K = [];
                l(n, S, C.toWireType(K, J));
                ld(K);
              };
            }
            Object.defineProperty(p.Lb.nc, b, x);
            return [];
          });
          return [];
        });
      },
      Ja: function (a, b) {
        b = R(b);
        Q(a, {
          name: b,
          fromWireType: function (c) {
            var d = Y(c);
            je(c);
            return d;
          },
          toWireType: function (c, d) {
            return U(d);
          },
          argPackAdvance: 8,
          readValueFromPointer: md,
          Vb: null,
        });
      },
      p: function (a, b, c, d) {
        function e() {}
        c = yd(c);
        b = R(b);
        e.values = {};
        Q(a, {
          name: b,
          constructor: e,
          fromWireType: function (f) {
            return this.constructor.values[f];
          },
          toWireType: function (f, g) {
            return g.value;
          },
          argPackAdvance: 8,
          readValueFromPointer: le(b, c, d),
          Vb: null,
        });
        Td(b, e);
      },
      f: function (a, b, c) {
        var d = me(a, "enum");
        b = R(b);
        a = d.constructor;
        d = Object.create(d.constructor.prototype, {
          value: { value: c },
          constructor: { value: rd(d.name + "_" + b, function () {}) },
        });
        a.values[c] = d;
        a[b] = d;
      },
      $: function (a, b, c) {
        c = yd(c);
        b = R(b);
        Q(a, {
          name: b,
          fromWireType: function (d) {
            return d;
          },
          toWireType: function (d, e) {
            return e;
          },
          argPackAdvance: 8,
          readValueFromPointer: ne(b, c),
          Vb: null,
        });
      },
      H: function (a, b, c, d, e, f) {
        var g = ge(b, c);
        a = R(a);
        e = V(d, e);
        Td(
          a,
          function () {
            de("Cannot call " + a + " due to unbound types", g);
          },
          b - 1
        );
        vd([], g, function (k) {
          $d(a, fe(a, [k[0], null].concat(k.slice(1)), null, e, f), b - 1);
          return [];
        });
      },
      E: function (a, b, c, d, e) {
        b = R(b);
        -1 === e && (e = 4294967295);
        e = yd(c);
        var f = (k) => k;
        if (0 === d) {
          var g = 32 - 8 * c;
          f = (k) => (k << g) >>> g;
        }
        c = b.includes("unsigned")
          ? function (k, l) {
              return l >>> 0;
            }
          : function (k, l) {
              return l;
            };
        Q(a, {
          name: b,
          fromWireType: f,
          toWireType: c,
          argPackAdvance: 8,
          readValueFromPointer: Cd(b, e, 0 !== d),
          Vb: null,
        });
      },
      v: function (a, b, c) {
        function d(f) {
          f >>= 2;
          return new e(Qa, F[f + 1], F[f]);
        }
        var e = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
          BigInt64Array,
          BigUint64Array,
        ][b];
        c = R(c);
        Q(
          a,
          {
            name: c,
            fromWireType: d,
            argPackAdvance: 8,
            readValueFromPointer: d,
          },
          { Ne: !0 }
        );
      },
      _: function (a, b) {
        b = R(b);
        var c = "std::string" === b;
        Q(a, {
          name: b,
          fromWireType: function (d) {
            var e = F[d >> 2];
            if (c)
              for (var f = d + 4, g = 0; g <= e; ++g) {
                var k = d + 4 + g;
                if (g == e || 0 == A[k]) {
                  f = z(f, k - f);
                  if (void 0 === l) var l = f;
                  else (l += String.fromCharCode(0)), (l += f);
                  f = k + 1;
                }
              }
            else {
              l = Array(e);
              for (g = 0; g < e; ++g) l[g] = String.fromCharCode(A[d + 4 + g]);
              l = l.join("");
            }
            W(d);
            return l;
          },
          toWireType: function (d, e) {
            e instanceof ArrayBuffer && (e = new Uint8Array(e));
            var f = "string" == typeof e;
            f ||
              e instanceof Uint8Array ||
              e instanceof Uint8ClampedArray ||
              e instanceof Int8Array ||
              T("Cannot pass non-string to std::string");
            var g = (c && f ? () => Da(e) : () => e.length)(),
              k = Na(4 + g + 1);
            F[k >> 2] = g;
            if (c && f) Ca(e, A, k + 4, g + 1);
            else if (f)
              for (f = 0; f < g; ++f) {
                var l = e.charCodeAt(f);
                255 < l &&
                  (W(k),
                  T("String has UTF-16 code units that do not fit in 8 bits"));
                A[k + 4 + f] = l;
              }
            else for (f = 0; f < g; ++f) A[k + 4 + f] = e[f];
            null !== d && d.push(W, k);
            return k;
          },
          argPackAdvance: 8,
          readValueFromPointer: md,
          Vb: function (d) {
            W(d);
          },
        });
      },
      R: function (a, b, c) {
        c = R(c);
        if (2 === b) {
          var d = Fa;
          var e = Ga;
          var f = Ia;
          var g = 1;
        } else 4 === b && ((d = Ja), (e = Ka), (f = La), (g = 2));
        Q(a, {
          name: c,
          fromWireType: function (k) {
            for (
              var l = F[k >> 2], n = Ad(c, g, !1), p, q = k + 4, t = 0;
              t <= l;
              ++t
            ) {
              var m = k + 4 + t * b;
              if (t == l || 0 == n[m >> g])
                (q = d(q, m - q)),
                  void 0 === p
                    ? (p = q)
                    : ((p += String.fromCharCode(0)), (p += q)),
                  (q = m + b);
            }
            W(k);
            return p;
          },
          toWireType: function (k, l) {
            "string" != typeof l &&
              T("Cannot pass non-string to C++ string type " + c);
            var n = f(l),
              p = Na(4 + n + b);
            F[p >> 2] = n >> g;
            e(l, p + 4, n + b);
            null !== k && k.push(W, p);
            return p;
          },
          argPackAdvance: 8,
          readValueFromPointer: md,
          Vb: function (k) {
            W(k);
          },
        });
      },
      fa: function (a, b, c, d, e, f) {
        kd[a] = { name: R(b), sd: V(c, d), mc: V(e, f), Ld: [] };
      },
      J: function (a, b, c, d, e, f, g, k, l, n) {
        kd[a].Ld.push({
          Be: R(b),
          Ke: c,
          Rc: V(d, e),
          Je: f,
          qf: g,
          pf: V(k, l),
          rf: n,
        });
      },
      La: function (a, b) {
        b = R(b);
        Q(a, {
          Se: !0,
          name: b,
          argPackAdvance: 0,
          fromWireType: function () {},
          toWireType: function () {},
        });
      },
      P: function () {
        return Date.now();
      },
      cb: function () {
        return 2097152;
      },
      wa: function () {
        return !0;
      },
      db: function (a, b, c, d) {
        if (a == b)
          setTimeout(() => {
            qc() && rc(d);
            Atomics.sub(D, d >> 2, 1);
          });
        else if (r)
          postMessage({
            targetThread: a,
            cmd: "processProxyingQueue",
            queue: d,
          });
        else {
          a = (a = I.hc[a]) && a.worker;
          if (!a) return;
          a.postMessage({ cmd: "processProxyingQueue", queue: d });
        }
        return 1;
      },
      na: function () {
        return -1;
      },
      Va: function () {
        throw Infinity;
      },
      l: function (a, b, c) {
        a = Y(a);
        b = me(b, "emval::as");
        var d = [],
          e = U(d);
        D[c >> 2] = e;
        return b.toWireType(d, a);
      },
      V: function (a, b, c, d) {
        a = Y(a);
        c = oe(b, c);
        for (var e = Array(b), f = 0; f < b; ++f) {
          var g = c[f];
          e[f] = g.readValueFromPointer(d);
          d += g.argPackAdvance;
        }
        a = a.apply(void 0, e);
        return U(a);
      },
      Za: function (a, b, c, d, e) {
        a = re[a];
        b = Y(b);
        c = qe(c);
        var f = [];
        D[d >> 2] = U(f);
        return a(b, c, f, e);
      },
      b: je,
      o: function (a) {
        if (0 === a) return U(se());
        a = qe(a);
        return U(se()[a]);
      },
      hb: function (a, b) {
        var c = oe(a, b),
          d = c[0];
        b =
          d.name +
          "_$" +
          c
            .slice(1)
            .map(function (p) {
              return p.name;
            })
            .join("_") +
          "$";
        var e = ue[b];
        if (void 0 !== e) return e;
        e = ["retType"];
        for (var f = [d], g = "", k = 0; k < a - 1; ++k)
          (g += (0 !== k ? ", " : "") + "arg" + k),
            e.push("argType" + k),
            f.push(c[1 + k]);
        var l =
            "return function " +
            qd("methodCaller_" + b) +
            "(handle, name, destructors, args) {\n",
          n = 0;
        for (k = 0; k < a - 1; ++k)
          (l +=
            "    var arg" +
            k +
            " = argType" +
            k +
            ".readValueFromPointer(args" +
            (n ? "+" + n : "") +
            ");\n"),
            (n += c[k + 1].argPackAdvance);
        l += "    var rv = handle[name](" + g + ");\n";
        for (k = 0; k < a - 1; ++k)
          c[k + 1].deleteObject &&
            (l += "    argType" + k + ".deleteObject(arg" + k + ");\n");
        d.Se || (l += "    return retType.toWireType(destructors, rv);\n");
        e.push(l + "};\n");
        a = ee(e).apply(null, f);
        e = te(a);
        return (ue[b] = e);
      },
      W: function (a) {
        a = qe(a);
        return U(h[a]);
      },
      m: function (a, b) {
        a = Y(a);
        b = Y(b);
        return U(a[b]);
      },
      c: function (a) {
        4 < a && (X[a].vd += 1);
      },
      G: function (a, b) {
        a = Y(a);
        b = Y(b);
        return a instanceof b;
      },
      N: function (a) {
        a = Y(a);
        return "number" == typeof a;
      },
      ga: function (a) {
        a = Y(a);
        return "string" == typeof a;
      },
      x: function (a, b, c, d) {
        a = Y(a);
        var e = ve[b];
        if (!e) {
          e = "";
          for (var f = 0; f < b; ++f) e += (0 !== f ? ", " : "") + "arg" + f;
          var g =
            "return function emval_allocator_" +
            b +
            "(constructor, argTypes, args) {\n";
          for (f = 0; f < b; ++f)
            g +=
              "var argType" +
              f +
              " = requireRegisteredType(Module['HEAP32'][(argTypes >>> 2) + " +
              f +
              '], "parameter ' +
              f +
              '");\nvar arg' +
              f +
              " = argType" +
              f +
              ".readValueFromPointer(args);\nargs += argType" +
              f +
              "['argPackAdvance'];\n";
          e = new Function(
            "requireRegisteredType",
            "Module",
            "valueToHandle",
            g +
              ("var obj = new constructor(" +
                e +
                ");\nreturn valueToHandle(obj);\n}\n")
          )(me, h, U);
          ve[b] = e;
        }
        return e(a, c, d);
      },
      n: function (a) {
        return U(qe(a));
      },
      k: function (a) {
        var b = Y(a);
        ld(b);
        je(a);
      },
      K: function (a, b, c) {
        a = Y(a);
        b = Y(b);
        c = Y(c);
        a[b] = c;
      },
      r: function (a, b) {
        a = me(a, "_emval_take_value");
        a = a.readValueFromPointer(b);
        return U(a);
      },
      O: function (a) {
        a = Y(a);
        return U(typeof a);
      },
      xa: function (a, b) {
        a = new Date(1e3 * D[a >> 2]);
        D[b >> 2] = a.getUTCSeconds();
        D[(b + 4) >> 2] = a.getUTCMinutes();
        D[(b + 8) >> 2] = a.getUTCHours();
        D[(b + 12) >> 2] = a.getUTCDate();
        D[(b + 16) >> 2] = a.getUTCMonth();
        D[(b + 20) >> 2] = a.getUTCFullYear() - 1900;
        D[(b + 24) >> 2] = a.getUTCDay();
        D[(b + 28) >> 2] =
          ((a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) /
            864e5) |
          0;
      },
      ya: function (a, b) {
        a = new Date(1e3 * D[a >> 2]);
        D[b >> 2] = a.getSeconds();
        D[(b + 4) >> 2] = a.getMinutes();
        D[(b + 8) >> 2] = a.getHours();
        D[(b + 12) >> 2] = a.getDate();
        D[(b + 16) >> 2] = a.getMonth();
        D[(b + 20) >> 2] = a.getFullYear() - 1900;
        D[(b + 24) >> 2] = a.getDay();
        var c = new Date(a.getFullYear(), 0, 1);
        D[(b + 28) >> 2] = ((a.getTime() - c.getTime()) / 864e5) | 0;
        D[(b + 36) >> 2] = -(60 * a.getTimezoneOffset());
        var d = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
        c = c.getTimezoneOffset();
        D[(b + 32) >> 2] =
          (d != c && a.getTimezoneOffset() == Math.min(c, d)) | 0;
      },
      gb: we,
      ja: xe,
      za: ze,
      j: function () {
        y("");
      },
      ab: function () {
        ja ||
          qa(
            "Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread"
          );
      },
      Ua: function () {
        cb += 1;
        throw "unwind";
      },
      Xa: function () {
        return A.length;
      },
      C: Bb,
      Aa: function (a, b, c) {
        A.copyWithin(a, b, b + c);
      },
      S: nc,
      ma: function (a, b, c) {
        b /= 2;
        Be.length = b;
        c >>= 3;
        for (var d = 0; d < b; d++)
          Be[d] = Sa[c + 2 * d] ? Sa[c + 2 * d + 1] : Ua[c + 2 * d + 1];
        return (0 > a ? sb[-a - 1] : Ue[a]).apply(null, Be);
      },
      Wa: function () {
        y("OOM");
      },
      va: function () {
        throw "unwind";
      },
      Ha: Fe,
      Ia: Ge,
      T: function (a) {
        Ib(a);
      },
      L: He,
      oa: Ie,
      Z: Je,
      ka: Ke,
      Q: Le,
      ba: function (a, b, c, d) {
        var e = F[(a >> 2) + 1],
          f = F[(a >> 2) + 6],
          g = F[(a >> 2) + 2];
        a = tb(F[(a >> 2) + 3])[1];
        var k = M(),
          l = k,
          n = [],
          p = !1;
        if (15 === a) throw Error("complex ret marshalling nyi");
        if (0 > a || 15 < a) throw Error("Unexpected rtype " + a);
        if (4 === a || 13 === a) n.push(c), (p = !0);
        for (var q = 0; q < f; q++) {
          var t = F[(d >> 2) + q],
            m = tb(F[(g >> 2) + q]),
            u = m[0];
          m = m[1];
          switch (m) {
            case 1:
            case 10:
            case 9:
            case 14:
              n.push(F[t >> 2]);
              break;
            case 2:
              n.push(Ra[t >> 2]);
              break;
            case 3:
              n.push(Ua[t >> 3]);
              break;
            case 5:
              n.push(A[t]);
              break;
            case 6:
              n.push(E[t]);
              break;
            case 7:
              n.push(B[t >> 1]);
              break;
            case 8:
              n.push(Ha[t >> 1]);
              break;
            case 11:
            case 12:
              n.push(Ta[t >> 3]);
              break;
            case 4:
              n.push(Ta[t >> 3]);
              n.push(Ta[(t >> 3) + 1]);
              break;
            case 13:
              m = F[u >> 2];
              u = B[(u + 4) >> 1];
              l -= m;
              l &= ~(u - 1);
              E.subarray(l, l + m).set(E.subarray(t, t + m));
              n.push(l);
              break;
            case 15:
              throw Error("complex marshalling nyi");
            default:
              throw Error("Unexpected type " + m);
          }
        }
        if (f != e) {
          var x = [];
          for (q = e - 1; q >= f; q--)
            switch (
              ((t = F[(d >> 2) + q]),
              (m = tb(F[(g >> 2) + q])),
              (u = m[0]),
              (m = m[1]),
              m)
            ) {
              case 5:
              case 6:
                --l;
                l &= -1;
                A[l] = A[t];
                break;
              case 7:
              case 8:
                l -= 2;
                l &= -2;
                B[l >> 1] = B[t >> 1];
                break;
              case 1:
              case 9:
              case 10:
              case 14:
              case 2:
                l -= 4;
                l &= -4;
                F[l >> 2] = F[t >> 2];
                break;
              case 3:
              case 11:
              case 12:
                l -= 8;
                l &= -8;
                F[l >> 2] = F[t >> 2];
                F[(l >> 2) + 1] = F[(t >> 2) + 1];
                break;
              case 4:
                l -= 16;
                l &= -8;
                F[l >> 2] = F[t >> 2];
                F[(l >> 2) + 1] = F[(t >> 2) + 1];
                F[(l >> 2) + 2] = F[(t >> 2) + 1];
                F[(l >> 2) + 3] = F[(t >> 2) + 1];
                break;
              case 13:
                l -= 4;
                l &= -4;
                x.push([l, t, F[u >> 2], B[(u + 4) >> 1]]);
                break;
              case 15:
                throw Error("complex arg marshalling nyi");
              default:
                throw Error("Unexpected argtype " + m);
            }
          n.push(l);
          for (q = 0; q < x.length; q++)
            (e = x[q]),
              (d = e[0]),
              (t = e[1]),
              (m = e[2]),
              (u = e[3]),
              (l -= m),
              (l &= ~(u - 1)),
              E.subarray(l, l + m).set(E.subarray(t, t + m)),
              (F[d >> 2] = l);
        }
        N((l - 0) & -8);
        b = Wa.get(b).apply(null, n);
        N(k);
        if (!p)
          switch (a) {
            case 0:
              break;
            case 1:
            case 9:
            case 10:
            case 14:
              F[c >> 2] = b;
              break;
            case 2:
              Ra[c >> 2] = b;
              break;
            case 3:
              Ua[c >> 3] = b;
              break;
            case 5:
            case 6:
              A[c + 0] = b;
              break;
            case 7:
            case 8:
              B[c >> 1] = b;
              break;
            case 11:
            case 12:
              Ta[c >> 3] = b;
              break;
            case 15:
              throw Error("complex ret marshalling nyi");
            default:
              throw Error("Unexpected rtype " + a);
          }
      },
      g: function () {
        return ua;
      },
      I: We,
      u: Xe,
      s: Ye,
      t: Ze,
      M: $e,
      Sa: af,
      Na: bf,
      U: cf,
      Ra: df,
      Qa: ef,
      q: ff,
      D: gf,
      y: hf,
      F: jf,
      Oa: kf,
      ca: lf,
      Pa: mf,
      a: wa || h.wasmMemory,
      Ea: Me,
      i: function (a) {
        ua = a;
      },
      Ta: function () {
        gb();
      },
      Ma: function (a, b, c, d) {
        function e(m, u, x) {
          for (
            m = "number" == typeof m ? m.toString() : m || "";
            m.length < u;

          )
            m = x[0] + m;
          return m;
        }
        function f(m, u) {
          return e(m, u, "0");
        }
        function g(m, u) {
          function x(J) {
            return 0 > J ? -1 : 0 < J ? 1 : 0;
          }
          var C;
          0 === (C = x(m.getFullYear() - u.getFullYear())) &&
            0 === (C = x(m.getMonth() - u.getMonth())) &&
            (C = x(m.getDate() - u.getDate()));
          return C;
        }
        function k(m) {
          switch (m.getDay()) {
            case 0:
              return new Date(m.getFullYear() - 1, 11, 29);
            case 1:
              return m;
            case 2:
              return new Date(m.getFullYear(), 0, 3);
            case 3:
              return new Date(m.getFullYear(), 0, 2);
            case 4:
              return new Date(m.getFullYear(), 0, 1);
            case 5:
              return new Date(m.getFullYear() - 1, 11, 31);
            case 6:
              return new Date(m.getFullYear() - 1, 11, 30);
          }
        }
        function l(m) {
          var u = m.tc;
          for (m = new Date(new Date(m.uc + 1900, 0, 1).getTime()); 0 < u; ) {
            var x = m.getMonth(),
              C = (Oe(m.getFullYear()) ? Pe : Qe)[x];
            if (u > C - m.getDate())
              (u -= C - m.getDate() + 1),
                m.setDate(1),
                11 > x
                  ? m.setMonth(x + 1)
                  : (m.setMonth(0), m.setFullYear(m.getFullYear() + 1));
            else {
              m.setDate(m.getDate() + u);
              break;
            }
          }
          x = new Date(m.getFullYear() + 1, 0, 4);
          u = k(new Date(m.getFullYear(), 0, 4));
          x = k(x);
          return 0 >= g(u, m)
            ? 0 >= g(x, m)
              ? m.getFullYear() + 1
              : m.getFullYear()
            : m.getFullYear() - 1;
        }
        var n = D[(d + 40) >> 2];
        d = {
          xf: D[d >> 2],
          wf: D[(d + 4) >> 2],
          Zc: D[(d + 8) >> 2],
          xd: D[(d + 12) >> 2],
          $c: D[(d + 16) >> 2],
          uc: D[(d + 20) >> 2],
          ic: D[(d + 24) >> 2],
          tc: D[(d + 28) >> 2],
          Xf: D[(d + 32) >> 2],
          vf: D[(d + 36) >> 2],
          yf: n ? z(n) : "",
        };
        c = z(c);
        n = {
          "%c": "%a %b %d %H:%M:%S %Y",
          "%D": "%m/%d/%y",
          "%F": "%Y-%m-%d",
          "%h": "%b",
          "%r": "%I:%M:%S %p",
          "%R": "%H:%M",
          "%T": "%H:%M:%S",
          "%x": "%m/%d/%y",
          "%X": "%H:%M:%S",
          "%Ec": "%c",
          "%EC": "%C",
          "%Ex": "%m/%d/%y",
          "%EX": "%H:%M:%S",
          "%Ey": "%y",
          "%EY": "%Y",
          "%Od": "%d",
          "%Oe": "%e",
          "%OH": "%H",
          "%OI": "%I",
          "%Om": "%m",
          "%OM": "%M",
          "%OS": "%S",
          "%Ou": "%u",
          "%OU": "%U",
          "%OV": "%V",
          "%Ow": "%w",
          "%OW": "%W",
          "%Oy": "%y",
        };
        for (var p in n) c = c.replace(new RegExp(p, "g"), n[p]);
        var q =
            "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
              " "
            ),
          t =
            "January February March April May June July August September October November December".split(
              " "
            );
        n = {
          "%a": function (m) {
            return q[m.ic].substring(0, 3);
          },
          "%A": function (m) {
            return q[m.ic];
          },
          "%b": function (m) {
            return t[m.$c].substring(0, 3);
          },
          "%B": function (m) {
            return t[m.$c];
          },
          "%C": function (m) {
            return f(((m.uc + 1900) / 100) | 0, 2);
          },
          "%d": function (m) {
            return f(m.xd, 2);
          },
          "%e": function (m) {
            return e(m.xd, 2, " ");
          },
          "%g": function (m) {
            return l(m).toString().substring(2);
          },
          "%G": function (m) {
            return l(m);
          },
          "%H": function (m) {
            return f(m.Zc, 2);
          },
          "%I": function (m) {
            m = m.Zc;
            0 == m ? (m = 12) : 12 < m && (m -= 12);
            return f(m, 2);
          },
          "%j": function (m) {
            for (
              var u = 0, x = 0;
              x <= m.$c - 1;
              u += (Oe(m.uc + 1900) ? Pe : Qe)[x++]
            );
            return f(m.xd + u, 3);
          },
          "%m": function (m) {
            return f(m.$c + 1, 2);
          },
          "%M": function (m) {
            return f(m.wf, 2);
          },
          "%n": function () {
            return "\n";
          },
          "%p": function (m) {
            return 0 <= m.Zc && 12 > m.Zc ? "AM" : "PM";
          },
          "%S": function (m) {
            return f(m.xf, 2);
          },
          "%t": function () {
            return "\t";
          },
          "%u": function (m) {
            return m.ic || 7;
          },
          "%U": function (m) {
            return f(Math.floor((m.tc + 7 - m.ic) / 7), 2);
          },
          "%V": function (m) {
            var u = Math.floor((m.tc + 7 - ((m.ic + 6) % 7)) / 7);
            2 >= (m.ic + 371 - m.tc - 2) % 7 && u++;
            if (u)
              53 == u &&
                ((x = (m.ic + 371 - m.tc) % 7),
                4 == x || (3 == x && Oe(m.uc)) || (u = 1));
            else {
              u = 52;
              var x = (m.ic + 7 - m.tc - 1) % 7;
              (4 == x || (5 == x && Oe((m.uc % 400) - 1))) && u++;
            }
            return f(u, 2);
          },
          "%w": function (m) {
            return m.ic;
          },
          "%W": function (m) {
            return f(Math.floor((m.tc + 7 - ((m.ic + 6) % 7)) / 7), 2);
          },
          "%y": function (m) {
            return (m.uc + 1900).toString().substring(2);
          },
          "%Y": function (m) {
            return m.uc + 1900;
          },
          "%z": function (m) {
            m = m.vf;
            var u = 0 <= m;
            m = Math.abs(m) / 60;
            return (
              (u ? "+" : "-") +
              String("0000" + ((m / 60) * 100 + (m % 60))).slice(-4)
            );
          },
          "%Z": function (m) {
            return m.yf;
          },
          "%%": function () {
            return "%";
          },
        };
        c = c.replace(/%%/g, "\x00\x00");
        for (p in n)
          c.includes(p) && (c = c.replace(new RegExp(p, "g"), n[p](d)));
        c = c.replace(/\0\0/g, "%");
        p = Ic(c, !1);
        if (p.length > b) return 0;
        E.set(p, a);
        return p.length - 1;
      },
      Ga: function (a) {
        throw new TypeError(z(a));
      },
      Ba: function (a) {
        var b = h.Error.buffer();
        h.Error.clear();
        throw Error(z(a) + "\n" + b);
      },
    };
    (function () {
      function a(e, f) {
        h.asm = e.exports;
        I.Yc.push(h.asm.ob);
        Wa = h.asm.kb;
        Ya.unshift(h.asm.ib);
        xa = f;
        if (!r) {
          var g = I.jc.length;
          I.jc.forEach(function (k) {
            I.Ud(k, function () {
              --g || nb("wasm-instantiate");
            });
          });
        }
      }
      function b(e) {
        a(e.instance, e.module);
      }
      function c(e) {
        return rb()
          .then(function (f) {
            return WebAssembly.instantiate(f, d);
          })
          .then(function (f) {
            return f;
          })
          .then(e, function (f) {
            w("failed to asynchronously prepare wasm: " + f);
            y(f);
          });
      }
      var d = { a: nf };
      r || mb("wasm-instantiate");
      if (h.instantiateWasm)
        try {
          return h.instantiateWasm(d, a);
        } catch (e) {
          return (
            w("Module.instantiateWasm callback failed with error: " + e), !1
          );
        }
      (function () {
        return va ||
          "function" != typeof WebAssembly.instantiateStreaming ||
          ob() ||
          "function" != typeof fetch
          ? c(b)
          : fetch(pb, { credentials: "same-origin" }).then(function (e) {
              return WebAssembly.instantiateStreaming(e, d).then(
                b,
                function (f) {
                  w("wasm streaming compile failed: " + f);
                  w("falling back to ArrayBuffer instantiation");
                  return c(b);
                }
              );
            });
      })().catch(ba);
      return {};
    })();
    h.___wasm_call_ctors = function () {
      return (h.___wasm_call_ctors = h.asm.ib).apply(null, arguments);
    };
    var Na = (h._malloc = function () {
      return (Na = h._malloc = h.asm.jb).apply(null, arguments);
    });
    h._main = function () {
      return (h._main = h.asm.lb).apply(null, arguments);
    };
    var W = (h._free = function () {
        return (W = h._free = h.asm.mb).apply(null, arguments);
      }),
      Wc = (h.___errno_location = function () {
        return (Wc = h.___errno_location = h.asm.nb).apply(null, arguments);
      });
    h._emscripten_tls_init = function () {
      return (h._emscripten_tls_init = h.asm.ob).apply(null, arguments);
    };
    var Lc = (h._emscripten_builtin_memalign = function () {
        return (Lc = h._emscripten_builtin_memalign = h.asm.pb).apply(
          null,
          arguments
        );
      }),
      ce = (h.___getTypeName = function () {
        return (ce = h.___getTypeName = h.asm.qb).apply(null, arguments);
      });
    h.___embind_register_native_and_builtin_types = function () {
      return (h.___embind_register_native_and_builtin_types = h.asm.rb).apply(
        null,
        arguments
      );
    };
    var Nc = (h.___stdio_exit = function () {
        return (Nc = h.___stdio_exit = h.asm.sb).apply(null, arguments);
      }),
      hb = (h.___funcs_on_exit = function () {
        return (hb = h.___funcs_on_exit = h.asm.tb).apply(null, arguments);
      }),
      qc = (h._pthread_self = function () {
        return (qc = h._pthread_self = h.asm.ub).apply(null, arguments);
      }),
      Ve = (h.__emscripten_thread_init = function () {
        return (Ve = h.__emscripten_thread_init = h.asm.vb).apply(
          null,
          arguments
        );
      });
    h.__emscripten_thread_crashed = function () {
      return (h.__emscripten_thread_crashed = h.asm.wb).apply(null, arguments);
    };
    var rc = (h._emscripten_proxy_execute_queue = function () {
        return (rc = h._emscripten_proxy_execute_queue = h.asm.xb).apply(
          null,
          arguments
        );
      }),
      Ae = (h._emscripten_run_in_main_runtime_thread_js = function () {
        return (Ae = h._emscripten_run_in_main_runtime_thread_js =
          h.asm.yb).apply(null, arguments);
      }),
      oc = (h.__emscripten_thread_free_data = function () {
        return (oc = h.__emscripten_thread_free_data = h.asm.zb).apply(
          null,
          arguments
        );
      }),
      Hb = (h.__emscripten_thread_exit = function () {
        return (Hb = h.__emscripten_thread_exit = h.asm.Ab).apply(
          null,
          arguments
        );
      }),
      Z = (h._setThrew = function () {
        return (Z = h._setThrew = h.asm.Bb).apply(null, arguments);
      }),
      sc = (h._emscripten_stack_set_limits = function () {
        return (sc = h._emscripten_stack_set_limits = h.asm.Cb).apply(
          null,
          arguments
        );
      }),
      M = (h.stackSave = function () {
        return (M = h.stackSave = h.asm.Db).apply(null, arguments);
      }),
      N = (h.stackRestore = function () {
        return (N = h.stackRestore = h.asm.Eb).apply(null, arguments);
      }),
      Pa = (h.stackAlloc = function () {
        return (Pa = h.stackAlloc = h.asm.Fb).apply(null, arguments);
      }),
      pc = (h.__emscripten_allow_main_runtime_queued_calls = 1314072);
    function af(a, b, c, d, e, f) {
      var g = M();
      try {
        return L(a)(b, c, d, e, f);
      } catch (k) {
        N(g);
        if (k !== k + 0) throw k;
        Z(1, 0);
      }
    }
    function Xe(a, b) {
      var c = M();
      try {
        return L(a)(b);
      } catch (d) {
        N(c);
        if (d !== d + 0) throw d;
        Z(1, 0);
      }
    }
    function Ze(a, b, c, d) {
      var e = M();
      try {
        return L(a)(b, c, d);
      } catch (f) {
        N(e);
        if (f !== f + 0) throw f;
        Z(1, 0);
      }
    }
    function hf(a, b, c, d) {
      var e = M();
      try {
        L(a)(b, c, d);
      } catch (f) {
        N(e);
        if (f !== f + 0) throw f;
        Z(1, 0);
      }
    }
    function Ye(a, b, c) {
      var d = M();
      try {
        return L(a)(b, c);
      } catch (e) {
        N(d);
        if (e !== e + 0) throw e;
        Z(1, 0);
      }
    }
    function ff(a, b) {
      var c = M();
      try {
        L(a)(b);
      } catch (d) {
        N(c);
        if (d !== d + 0) throw d;
        Z(1, 0);
      }
    }
    function We(a) {
      var b = M();
      try {
        return L(a)();
      } catch (c) {
        N(b);
        if (c !== c + 0) throw c;
        Z(1, 0);
      }
    }
    function cf(a, b, c, d, e, f, g) {
      var k = M();
      try {
        return L(a)(b, c, d, e, f, g);
      } catch (l) {
        N(k);
        if (l !== l + 0) throw l;
        Z(1, 0);
      }
    }
    function df(a, b, c, d, e, f, g, k) {
      var l = M();
      try {
        return L(a)(b, c, d, e, f, g, k);
      } catch (n) {
        N(l);
        if (n !== n + 0) throw n;
        Z(1, 0);
      }
    }
    function ef(a, b, c, d, e, f, g, k, l, n, p, q, t) {
      var m = M();
      try {
        return L(a)(b, c, d, e, f, g, k, l, n, p, q, t);
      } catch (u) {
        N(m);
        if (u !== u + 0) throw u;
        Z(1, 0);
      }
    }
    function jf(a, b, c, d, e) {
      var f = M();
      try {
        L(a)(b, c, d, e);
      } catch (g) {
        N(f);
        if (g !== g + 0) throw g;
        Z(1, 0);
      }
    }
    function gf(a, b, c) {
      var d = M();
      try {
        L(a)(b, c);
      } catch (e) {
        N(d);
        if (e !== e + 0) throw e;
        Z(1, 0);
      }
    }
    function $e(a, b, c, d, e) {
      var f = M();
      try {
        return L(a)(b, c, d, e);
      } catch (g) {
        N(f);
        if (g !== g + 0) throw g;
        Z(1, 0);
      }
    }
    function mf(a, b, c, d, e, f, g, k, l, n) {
      var p = M();
      try {
        L(a)(b, c, d, e, f, g, k, l, n);
      } catch (q) {
        N(p);
        if (q !== q + 0) throw q;
        Z(1, 0);
      }
    }
    function kf(a, b, c, d, e, f) {
      var g = M();
      try {
        L(a)(b, c, d, e, f);
      } catch (k) {
        N(g);
        if (k !== k + 0) throw k;
        Z(1, 0);
      }
    }
    function lf(a, b, c, d, e, f, g) {
      var k = M();
      try {
        L(a)(b, c, d, e, f, g);
      } catch (l) {
        N(k);
        if (l !== l + 0) throw l;
        Z(1, 0);
      }
    }
    function bf(a, b, c, d, e, f, g, k, l) {
      var n = M();
      try {
        return L(a)(b, c, d, e, f, g, k, l);
      } catch (p) {
        N(n);
        if (p !== p + 0) throw p;
        Z(1, 0);
      }
    }
    h.addRunDependency = mb;
    h.removeRunDependency = nb;
    h.FS_createPath = FS.Ed;
    h.FS_createDataFile = FS.Qc;
    h.FS_createPreloadedFile = FS.createPreloadedFile;
    h.FS_createLazyFile = FS.createLazyFile;
    h.FS_createDevice = FS.ac;
    h.FS_unlink = FS.unlink;
    h.addFunction = function (a, b) {
      if (!ta) {
        ta = new WeakMap();
        for (var c = Wa.length, d = 0; d < 0 + c; d++) {
          var e = L(d);
          e && ta.set(e, d);
        }
      }
      if (ta.has(a)) return ta.get(a);
      if (sa.length) c = sa.pop();
      else {
        try {
          Wa.grow(1);
        } catch (k) {
          if (!(k instanceof RangeError)) throw k;
          throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
        }
        c = Wa.length - 1;
      }
      try {
        (d = c), Wa.set(d, a), (uc[d] = a);
      } catch (k) {
        if (!(k instanceof TypeError)) throw k;
        if ("function" == typeof WebAssembly.Function) {
          e = { i: "i32", j: "i64", f: "f32", d: "f64" };
          var f = { parameters: [], results: "v" == b[0] ? [] : [e[b[0]]] };
          for (d = 1; d < b.length; ++d) f.parameters.push(e[b[d]]);
          d = new WebAssembly.Function(f, a);
        } else {
          e = [1, 0, 1, 96];
          f = b.slice(0, 1);
          b = b.slice(1);
          var g = { i: 127, j: 126, f: 125, d: 124 };
          e.push(b.length);
          for (d = 0; d < b.length; ++d) e.push(g[b[d]]);
          "v" == f ? e.push(0) : (e = e.concat([1, g[f]]));
          e[1] = e.length - 2;
          b = new Uint8Array(
            [0, 97, 115, 109, 1, 0, 0, 0].concat(
              e,
              [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]
            )
          );
          b = new WebAssembly.Module(b);
          d = new WebAssembly.Instance(b, { e: { f: a } }).exports.f;
        }
        b = c;
        Wa.set(b, d);
        uc[b] = d;
      }
      ta.set(a, c);
      return c;
    };
    h.keepRuntimeAlive = db;
    h.ENV = Ce;
    h.FS = FS;
    h.PThread = I;
    h.deletionQueue = Kd;
    h.PThread = I;
    h.wasmMemory = wa;
    h.ExitStatus = Fb;
    var of;
    function Fb(a) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + a + ")";
      this.status = a;
    }
    lb = function pf() {
      of || qf();
      of || (lb = pf);
    };
    function qf(a) {
      function b() {
        if (!of && ((of = !0), (h.calledRun = !0), !ya)) {
          eb();
          r || fb(Za);
          aa(h);
          if (h.onRuntimeInitialized) h.onRuntimeInitialized();
          if (rf) {
            var c = a,
              d = h._main;
            c = c || [];
            var e = c.length + 1,
              f = Pa(4 * (e + 1));
            D[f >> 2] = Oa(fa);
            for (var g = 1; g < e; g++) D[(f >> 2) + g] = Oa(c[g - 1]);
            D[(f >> 2) + e] = 0;
            try {
              var k = d(e, f);
              Ib(k, !0);
            } catch (l) {
              Eb(l);
            } finally {
            }
          }
          if (!r) {
            if (h.postRun)
              for (
                "function" == typeof h.postRun && (h.postRun = [h.postRun]);
                h.postRun.length;

              )
                (c = h.postRun.shift()), ab.unshift(c);
            fb(ab);
          }
        }
      }
      a = a || ea;
      if (!(0 < jb))
        if (r) aa(h), eb(), postMessage({ cmd: "loaded" });
        else {
          if (h.preRun)
            for (
              "function" == typeof h.preRun && (h.preRun = [h.preRun]);
              h.preRun.length;

            )
              ib();
          fb(Xa);
          0 < jb ||
            (h.setStatus
              ? (h.setStatus("Running..."),
                setTimeout(function () {
                  setTimeout(function () {
                    h.setStatus("");
                  }, 1);
                  b();
                }, 1))
              : b());
        }
    }
    h.run = qf;
    function Ib(a, b) {
      za = a;
      if (!b && r) throw (tc(a), "unwind");
      db() || gb();
      Ne(a);
    }
    function Ne(a) {
      za = a;
      if (!db()) {
        I.ae();
        if (h.onExit) h.onExit(a);
        ya = !0;
      }
      ha(a, new Fb(a));
    }
    if (h.preInit)
      for (
        "function" == typeof h.preInit && (h.preInit = [h.preInit]);
        0 < h.preInit.length;

      )
        h.preInit.pop()();
    var rf = !0;
    h.noInitialRun && (rf = !1);
    qf();

    return Vips.ready;
  };
})();
if (typeof exports === "object" && typeof module === "object")
  module.exports = Vips;
else if (typeof define === "function" && define["amd"])
  define([], function () {
    return Vips;
  });
else if (typeof exports === "object") exports["Vips"] = Vips;
