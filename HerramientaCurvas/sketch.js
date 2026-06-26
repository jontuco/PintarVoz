// ─────────────────────────────────────────────
//  HERRAMIENTA DE DIBUJO CON CURVEVERTEX
//
//  Canvas: windowWidth x windowHeight (igual que el proyecto base)
//  Buffer: 800 x 600 (igual que el buffer del proyecto base)
//
//  El buffer se dibuja centrado en el canvas.
//  Todas las coordenadas de dibujo se mapean al espacio del buffer.
// ─────────────────────────────────────────────

const BUF_W = 800;
const BUF_H = 600;

// Offset del buffer dentro del canvas (se recalcula en setup y windowResized)
let bOffX = 0;
let bOffY = 0;

let buffer;
let imagenFondo;

let dibujando        = false;
let trazoActivo      = false;
let arrastrandoHub   = false;  // true mientras se arrastra el hub → bloquea dibujo

let trazos          = [];
let puntosActuales  = [];

let indicePuntoHover = -1;
const RADIO_HOVER    = 14;

let opacidadPuntos = 200;  // 0–255, controla la opacidad de los círculos de control

let estiloActual = {
  modo:        "curva",
  colorStroke: "#ffffff",
  pesoStroke:  3,
  usarFill:    false,
  colorFill:   "#ff0000",
  alpha:       255,
  cerrar:      false
};

// Referencias DOM del hub
let btnDibujo;
let infoBar;

// ─────────────────────────────────────────────
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);

  // Bloquear menú contextual del navegador sobre el canvas
  canvas.elt.addEventListener("contextmenu", (e) => e.preventDefault());

  recalcularOffset();

  buffer = createGraphics(BUF_W, BUF_H);
  buffer.clear();

  construirHub();
  construirInfoBar();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  recalcularOffset();
}

// Calcula dónde empieza el buffer dentro del canvas (centrado)
function recalcularOffset() {
  bOffX = (windowWidth  - BUF_W) / 2;
  bOffY = (windowHeight - BUF_H) / 2;
}

// ─────────────────────────────────────────────
//  Coordenadas del mouse en el espacio del buffer
// ─────────────────────────────────────────────
function mX() { return mouseX - bOffX; }
function mY() { return mouseY - bOffY; }

function enBuffer() {
  return mX() >= 0 && mX() <= BUF_W && mY() >= 0 && mY() <= BUF_H;
}

// ─────────────────────────────────────────────
function draw() {
  background(20);

  // Marco del área de dibujo (referencia visual)
  push();
  noFill();
  stroke(50);
  strokeWeight(1);
  rect(bOffX, bOffY, BUF_W, BUF_H);
  pop();

  // Imagen de fondo dentro del buffer
  if (imagenFondo) {
    push();
    image(imagenFondo, bOffX, bOffY, BUF_W, BUF_H);
    pop();
  }

  // Buffer con trazos terminados, centrado
  image(buffer, bOffX, bOffY);

  // Preview y puntos de control (solo si está en el buffer)
  if (dibujando && trazoActivo && puntosActuales.length > 0) {
    dibujarPreview();
  }

  if (dibujando && trazoActivo) {
    indicePuntoHover = encontrarPuntoCercano(mX(), mY(), puntosActuales);
    dibujarPuntosControl();
  } else {
    indicePuntoHover = -1;
  }

  if (dibujando && enBuffer() && !arrastrandoHub) {
    dibujarCursor();
  }

  actualizarInfoBar();
}

// ─────────────────────────────────────────────
//  Previsualización del trazo en curso
// ─────────────────────────────────────────────
function dibujarPreview() {
  // El punto temporal del mouse en coords de buffer
  let pts = [...puntosActuales, { x: mX(), y: mY(), marcado: false }];
  if (pts.length < 2) return;

  let e = estiloActual;
  let c = color(e.colorStroke);
  c.setAlpha(e.alpha);

  push();
  // Translada al origen del buffer en pantalla
  translate(bOffX, bOffY);
  stroke(c);
  strokeWeight(e.pesoStroke);
  e.usarFill ? (() => { let cf = color(e.colorFill); cf.setAlpha(e.alpha); fill(cf); })() : noFill();

  if (e.modo === "curva") {
    beginShape();
    curveVertex(pts[0].x, pts[0].y);
    for (let p of pts) curveVertex(p.x, p.y);
    curveVertex(pts[pts.length - 1].x, pts[pts.length - 1].y);
    e.cerrar ? endShape(CLOSE) : endShape();
  } else {
    beginShape();
    for (let p of pts) vertex(p.x, p.y);
    e.cerrar ? endShape(CLOSE) : endShape();
  }

  // Línea punteada del último punto al mouse
  if (puntosActuales.length > 0) {
    let ult = puntosActuales[puntosActuales.length - 1];
    stroke(180, 180, 180, 100);
    strokeWeight(1);
    drawingContext.setLineDash([4, 6]);
    line(ult.x, ult.y, mX(), mY());
    drawingContext.setLineDash([]);
  }
  pop();
}

// ─────────────────────────────────────────────
//  Puntos de control con índice y tooltip
// ─────────────────────────────────────────────
function dibujarPuntosControl() {
  push();
  translate(bOffX, bOffY);
  textFont("monospace");
  textSize(11);

  for (let i = 0; i < puntosActuales.length; i++) {
    let p       = puntosActuales[i];
    let marcado = p.marcado;
    let hover   = (i === indicePuntoHover);
    let r       = hover ? 10 : 7;
    let col     = marcado ? color(220, 50, 220, opacidadPuntos) : color(255, 215, 0, opacidadPuntos);

    noStroke();
    fill(col);
    ellipse(p.x, p.y, r * 2, r * 2);

    if (marcado) {
      fill(255, 255, 255, 210);
      textAlign(CENTER, CENTER);
      text("✦", p.x, p.y);
    }

    // Número de índice
    fill(255, 255, 255, 190);
    textAlign(CENTER, BOTTOM);
    text(i, p.x, p.y - r - 2);
  }

  // Tooltip del punto en hover
  if (indicePuntoHover >= 0) {
    dibujarTooltip(puntosActuales[indicePuntoHover], indicePuntoHover);
  }
  pop();
}

function dibujarTooltip(p, idx) {
  let l1 = `[${idx}]  x: ${round(p.x)}  y: ${round(p.y)}`;
  let l2 = `marcado: ${p.marcado}`;
  let w = 164, h = 40, px = 8, py = 6;
  let tx = p.x + 14, ty = p.y - h - 8;
  if (tx + w > BUF_W) tx = p.x - w - 14;
  if (ty < 0) ty = p.y + 14;

  fill(18, 18, 18, 210);
  stroke(p.marcado ? color(210, 60, 210) : color(255, 215, 0));
  strokeWeight(1);
  rect(tx, ty, w, h, 4);

  noStroke();
  fill(235, 235, 235);
  textSize(11);
  textAlign(LEFT, TOP);
  text(l1, tx + px, ty + py);
  fill(p.marcado ? color(210, 130, 210) : color(160, 160, 160));
  text(l2, tx + px, ty + py + 16);
}

// ─────────────────────────────────────────────
//  Cursor
// ─────────────────────────────────────────────
function dibujarCursor() {
  if (indicePuntoHover >= 0) return;
  push();
  stroke(255, 255, 255, 140);
  strokeWeight(1);
  let s = 11;
  line(mouseX - s, mouseY, mouseX + s, mouseY);
  line(mouseX, mouseY - s, mouseX, mouseY + s);
  pop();
}

// ─────────────────────────────────────────────
//  Eventos de mouse (p5.js)
// ─────────────────────────────────────────────
function mousePressed() {
  if (!dibujando || arrastrandoHub || !enBuffer()) return;

  if (mouseButton === RIGHT) {
    if (trazoActivo) {
      let idx = encontrarPuntoCercano(mX(), mY(), puntosActuales);
      if (idx >= 0) puntosActuales[idx].marcado = !puntosActuales[idx].marcado;
    }
    return;
  }

  trazoActivo = true;
  puntosActuales.push({ x: mX(), y: mY(), marcado: false });
}

function doubleClicked() {
  if (!dibujando || arrastrandoHub || !trazoActivo || !enBuffer()) return;
  terminarTrazo();
}

function keyPressed() {
  if (key === "Enter" && dibujando && trazoActivo) terminarTrazo();
  if ((key === "z" || key === "Z") && dibujando)   deshacerUltimoPunto();
  if ((key === "m" || key === "M") && dibujando && trazoActivo && puntosActuales.length > 0) {
    let ult = puntosActuales[puntosActuales.length - 1];
    ult.marcado = !ult.marcado;
  }
}

// ─────────────────────────────────────────────
//  Lógica de trazos
// ─────────────────────────────────────────────
function terminarTrazo() {
  if (puntosActuales.length < 2) {
    puntosActuales = [];
    trazoActivo = false;
    return;
  }
  let trazo = {
    puntos: puntosActuales.map(p => ({ x: p.x, y: p.y, marcado: p.marcado })),
    estilo: Object.assign({}, estiloActual)
  };
  trazos.push(trazo);
  pintarTrazoEnBuffer(buffer, trazo);
  puntosActuales = [];
  trazoActivo = false;
}

function pintarTrazoEnBuffer(ctx, trazo) {
  let pts = trazo.puntos;
  let e   = trazo.estilo;
  if (pts.length < 2) return;

  let c = ctx.color(e.colorStroke); c.setAlpha(e.alpha);
  ctx.stroke(c);
  ctx.strokeWeight(e.pesoStroke);

  if (e.usarFill) {
    let cf = ctx.color(e.colorFill); cf.setAlpha(e.alpha); ctx.fill(cf);
  } else { ctx.noFill(); }

  ctx.beginShape();
  if (e.modo === "curva") {
    ctx.curveVertex(pts[0].x, pts[0].y);
    for (let p of pts) ctx.curveVertex(p.x, p.y);
    ctx.curveVertex(pts[pts.length - 1].x, pts[pts.length - 1].y);
  } else {
    for (let p of pts) ctx.vertex(p.x, p.y);
  }
  e.cerrar ? ctx.endShape(CLOSE) : ctx.endShape();
}

function deshacerUltimoPunto() {
  if (trazoActivo && puntosActuales.length > 0) {
    puntosActuales.pop();
    if (puntosActuales.length === 0) trazoActivo = false;
  } else if (trazos.length > 0) {
    trazos.pop();
    buffer.clear();
    for (let t of trazos) pintarTrazoEnBuffer(buffer, t);
  }
}

function encontrarPuntoCercano(bx, by, lista) {
  let minD = RADIO_HOVER, idx = -1;
  for (let i = 0; i < lista.length; i++) {
    let d = dist(bx, by, lista[i].x, lista[i].y);
    if (d < minD) { minD = d; idx = i; }
  }
  return idx;
}

// ─────────────────────────────────────────────
//  Exportar
// ─────────────────────────────────────────────
function imprimirArreglo() {
  // Si hay un trazo en curso, lo termina antes de exportar
  if (trazoActivo && puntosActuales.length >= 2) {
    terminarTrazo();
  }
  if (trazos.length === 0) { alert("No hay trazos guardados.\nDibujá al menos 2 puntos y terminá el trazo con Enter o doble click."); return; }

  let salida = trazos.map((t, ti) => ({
    trazo:  ti,
    estilo: t.estilo,
    puntos: t.puntos.map((p, pi) => ({
      indice:  pi,
      x:       round(p.x),
      y:       round(p.y),
      marcado: p.marcado
    }))
  }));

  let json = JSON.stringify(salida, null, 2);
  let timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  let nombreArchivo = `trazos_${timestamp}.json`;

  // Intenta usar File System Access API (permite elegir carpeta de destino)
  if (window.showSaveFilePicker) {
    window.showSaveFilePicker({
      suggestedName: nombreArchivo,
      types: [{ description: "JSON", accept: { "application/json": [".json"] } }]
    }).then(handle => handle.createWritable())
      .then(writable => {
        writable.write(json);
        return writable.close();
      })
      .then(() => console.log("Guardado:", nombreArchivo))
      .catch(err => { if (err.name !== "AbortError") console.error(err); });
  } else {
    // Fallback: descarga estándar del navegador
    let blob = new Blob([json], { type: "application/json" });
    let url  = URL.createObjectURL(blob);
    let a    = document.createElement("a");
    a.href     = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Siempre imprime en consola también
  console.log("=== TRAZOS EXPORTADOS ===");
  salida.forEach(t => {
    console.log(`Trazo ${t.trazo}:`);
    t.puntos.forEach(p =>
      console.log(`  [${p.indice}] x:${p.x} y:${p.y} marcado:${p.marcado}`)
    );
  });
}

// ─────────────────────────────────────────────
//  Info bar (fija abajo)
// ─────────────────────────────────────────────
function construirInfoBar() {
  let div = document.createElement("div");
  div.id = "info-bar";
  div.textContent = "Modo dibujo inactivo.";
  document.body.appendChild(div);
  infoBar = div;
}

function actualizarInfoBar() {
  if (!infoBar) return;
  let marcados = puntosActuales.filter(p => p.marcado).length;
  let estado = dibujando
    ? (trazoActivo
        ? `Dibujando — ${puntosActuales.length} pts (${marcados} marcados) · [Enter]/[doble click] terminar · [Z] deshacer · [M] marcar último · [clic der] marcar punto`
        : "Modo dibujo ON — clic izquierdo en el canvas para agregar el primer punto.")
    : "Modo dibujo OFF.";
  infoBar.textContent = `Trazos: ${trazos.length}  |  Buffer: ${BUF_W}×${BUF_H}  |  ${estado}`;
}

// ─────────────────────────────────────────────
//  Hub flotante — construcción y drag
// ─────────────────────────────────────────────
function construirHub() {
  const hub    = document.getElementById("hub");
  const pill   = document.getElementById("hub-pill");
  const header = document.getElementById("hub-header");
  const body   = document.getElementById("hub-body");
  const toggle = document.getElementById("hub-toggle");
  const inline = document.getElementById("hub-controles-inline");

  // Posición inicial centrada
  const inicX = (windowWidth / 2) - 200;
  hub.style.left      = inicX + "px";
  hub.style.top       = "18px";
  hub.style.transform = "none";

  // ── Toggle abierto/cerrado ──
  let abierto = true;
  hub.classList.add("abierto");

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    abierto = !abierto;
    hub.classList.toggle("abierto", abierto);
    hub.classList.toggle("cerrado", !abierto);
    toggle.textContent = abierto ? "▲" : "▼";
  });

  // ── Drag ──
  let dragging = false;
  let dragStartX = 0, dragStartY = 0;
  let hubStartX  = 0, hubStartY  = 0;

  header.addEventListener("mousedown", (e) => {
    if (e.target === toggle) return;
    dragging       = true;
    arrastrandoHub = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    hubStartX  = parseInt(hub.style.left) || 0;
    hubStartY  = parseInt(hub.style.top)  || 18;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    let dx = e.clientX - dragStartX;
    let dy = e.clientY - dragStartY;
    hub.style.left = (hubStartX + dx) + "px";
    hub.style.top  = (hubStartY + dy) + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging       = false;
    arrastrandoHub = false;
  });

  // ── Inyectar controles en el body del hub ──
  inyectarControles(body, inline);
}

// ─────────────────────────────────────────────
//  Crea los controles dentro del hub body (y versión
//  mini en el inline del header para cuando está cerrado)
// ─────────────────────────────────────────────
function inyectarControles(body, inline) {

  // Helper: crea elemento y lo agrega al contenedor
  function el(tag, parent, attrs = {}, text = "") {
    let e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (text) e.textContent = text;
    parent.appendChild(e);
    return e;
  }

  function sep(parent) {
    let s = document.createElement("span");
    s.className = "sep";
    s.textContent = "|";
    parent.appendChild(s);
  }

  function lbl(parent, txt) {
    let s = document.createElement("span");
    s.className = "lbl";
    s.textContent = txt;
    parent.appendChild(s);
  }

  // ── Botón Dibujo (también en inline) ──
  btnDibujo = el("button", body, {}, "✏ Dibujo: OFF");
  btnDibujo.addEventListener("click", () => {
    dibujando = !dibujando;
    btnDibujo.textContent = dibujando ? "✏ Dibujo: ON" : "✏ Dibujo: OFF";
    dibujando ? btnDibujo.classList.add("activo") : btnDibujo.classList.remove("activo");
    // Sincroniza el mini-botón
    miniBtnDibujo.textContent = dibujando ? "✏ ON" : "✏ OFF";
    dibujando ? miniBtnDibujo.classList.add("activo") : miniBtnDibujo.classList.remove("activo");
  });

  // Mini botón en header (cuando cerrado)
  let miniBtnDibujo = el("button", inline, {}, "✏ OFF");
  miniBtnDibujo.style.padding = "3px 9px";
  miniBtnDibujo.addEventListener("click", () => btnDibujo.click());

  sep(body);

  // ── Modo ──
  lbl(body, "Modo:");
  let selModo = el("select", body);
  [["Curva suave","curva"],["Línea recta","linea"]].forEach(([t,v]) => {
    let o = document.createElement("option");
    o.textContent = t; o.value = v;
    selModo.appendChild(o);
  });
  selModo.addEventListener("change", () => { estiloActual.modo = selModo.value; });

  // ── Cerrar ──
  lbl(body, "Cerrar:");
  let chkCerrar = el("input", body, { type: "checkbox" });
  chkCerrar.addEventListener("change", () => { estiloActual.cerrar = chkCerrar.checked; });

  sep(body);

  // ── Stroke ──
  lbl(body, "Stroke:");
  let inpStroke = el("input", body, { type: "color", value: "#ffffff" });
  inpStroke.style.cssText = "width:26px;height:22px";
  inpStroke.addEventListener("input", () => { estiloActual.colorStroke = inpStroke.value; });

  // ── Grosor ──
  lbl(body, "Grosor:");
  let sldPeso = el("input", body, { type: "range", min: 1, max: 30, step: 1, value: 3 });
  sldPeso.style.width = "70px";
  sldPeso.addEventListener("input", () => { estiloActual.pesoStroke = parseInt(sldPeso.value); });

  sep(body);

  // ── Fill ──
  lbl(body, "Fill:");
  let chkFill = el("input", body, { type: "checkbox" });
  chkFill.addEventListener("change", () => { estiloActual.usarFill = chkFill.checked; });
  let inpFill = el("input", body, { type: "color", value: "#ff0000" });
  inpFill.style.cssText = "width:26px;height:22px";
  inpFill.addEventListener("input", () => { estiloActual.colorFill = inpFill.value; });

  // ── Alpha ──
  lbl(body, "Alpha:");
  let sldAlpha = el("input", body, { type: "range", min: 0, max: 255, step: 1, value: 255 });
  sldAlpha.style.width = "70px";
  sldAlpha.addEventListener("input", () => { estiloActual.alpha = parseInt(sldAlpha.value); });

  // ── Opacidad puntos de control ──
  lbl(body, "Pts:");
  let sldPuntos = el("input", body, { type: "range", min: 0, max: 255, step: 1, value: 200 });
  sldPuntos.style.width = "60px";
  sldPuntos.addEventListener("input", () => { opacidadPuntos = parseInt(sldPuntos.value); });

  sep(body);

  // ── Deshacer ──
  let btnDes = el("button", body, {}, "↩ Deshacer");
  btnDes.addEventListener("click", deshacerUltimoPunto);

  // ── Limpiar ──
  let btnLimp = el("button", body, {}, "🗑 Limpiar");
  btnLimp.addEventListener("click", () => {
    trazos = []; puntosActuales = []; trazoActivo = false; buffer.clear();
  });

  sep(body);

  // ── Imagen de fondo ──
  let btnImg = el("button", body, {}, "🖼 Fondo");
  let inpImg = el("input", body, { type: "file", accept: "image/*" });
  inpImg.style.display = "none";
  btnImg.addEventListener("click", () => inpImg.click());
  inpImg.addEventListener("change", () => {
    let file = inpImg.files[0];
    if (!file) return;
    let url = URL.createObjectURL(file);
    loadImage(url, (img) => { imagenFondo = img; });
  });

  sep(body);

  // ── Exportar ──
  let btnExp = el("button", body, {}, "📋 Exportar");
  btnExp.addEventListener("click", imprimirArreglo);
}
