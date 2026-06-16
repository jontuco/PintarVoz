// --- SHADERS ---
const vertSrc = `
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  varying vec2 vTexCoord;
  void main() {
    vTexCoord = aTexCoord;
    vec4 pos = vec4(aPosition, 1.0);
    pos.xy = pos.xy * 2.0 - 1.0;
    gl_Position = pos;
  }
`;

const fragSrc = `
  precision mediump float;
  varying vec2 vTexCoord;
  uniform sampler2D uTextura;
  uniform float uTiempo;
  uniform float uAmplitud;
  void main() {
    vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y);
    uv.x += sin(uv.y * 12.0 + uTiempo * 1.5) * uAmplitud;
    uv.y += cos(uv.x * 9.0 + uTiempo * 1.2) * uAmplitud * 0.6;
    gl_FragColor = texture2D(uTextura, uv);
  }
`;

// --- VARIABLES GLOBALES ---
let dibujos = [];
let ondaShader;
let buffer;

// --- VARIABLES DE SONIDO ---
let mic, gestorAmp;
let audioIniciado = false;
let intensidad = 0;
let opC1 = 10, opC2 = 0, opC3 = 0, vibActual = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  buffer = createGraphics(800, 600);
  ondaShader = createShader(vertSrc, fragSrc);

  mic = new p5.AudioIn();
  gestorAmp = new GestorSenial(0.001, 0.13);

  cargarDibujo1();
  cargarDibujo2();
  cargarDibujo3();
}

function draw() {
  if (!audioIniciado) {
    // Dibujamos en el buffer 2D
    buffer.background(150);
    buffer.fill(255);
    buffer.textAlign(CENTER, CENTER);
    buffer.textSize(40);
    buffer.text("Haz click para comenzar", 400, 300); // 400 y 300 son el centro de 800x600

    // Ahora mostramos el buffer en el canvas WEBGL
    resetShader();
    image(buffer, -width / 2, -height / 2, width, height);
    return; 
  }

  // 1. Procesar Sonido
  let amp = mic.getLevel();
  gestorAmp.actualizar(amp);
  intensidad = gestorAmp.filtrada;

  // 2. Calcular ESTADOS (Mapeo de Intensidad -> Visual)
  let targetOp1 = map(intensidad, 0.0, 0.2, 10, 100, true);
  let targetOp2 = map(intensidad, 0.2, 0.6, 0, 100, true);
  let targetOp3 = map(intensidad, 0.5, 1.0, 0, 100, true);
  let targetVib = map(intensidad, 0.1, 1.0, 0, 5, true);

  // 3. Suavizado (La "respiración")
  opC1 = lerp(opC1, targetOp1, 0.05);
  opC2 = lerp(opC2, targetOp2, 0.05);
  opC3 = lerp(opC3, targetOp3, 0.05);
  vibActual = lerp(vibActual, targetVib, 0.05);

  // 4. Selección Automática de Dibujo
 if (intensidad < 0.2) {
    dibujos[0].dibujar(buffer, opC1, vibActual); // Dibujo 1
  } else if (intensidad < 0.6) {
    dibujos[1].dibujar(buffer, opC2, vibActual); // Dibujo 2
  } else {
    dibujos[2].dibujar(buffer, opC1, opC3, vibActual); // Dibujo 3
  }

  // 5. Shader Siempre Activo
  mostrarLienzo();
}

function mostrarLienzo() {
  shader(ondaShader);
  let ampOnda = map(intensidad, 0, 1, 0.002, 0.02);
  ondaShader.setUniform('uTextura', buffer);
  ondaShader.setUniform('uTiempo', millis() / 1000.0);
  ondaShader.setUniform('uAmplitud', ampOnda);
  rect(-width / 2, -height / 2, width, height);
}

async function iniciarAudio() {
  if (audioIniciado) return;
  await userStartAudio();
  mic.start();
  audioIniciado = true;
}

function mousePressed() {
  iniciarAudio();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}