let figuras = [];
let imagenes = [];

let teclaT = false;
let tPresionadaAntes = false;
let mouseXant, mouseYant;
let clicPresionado = false;
let clicPresionadoAntes = false;

function preload() {
  for (let i = 2; i <= 11; i++) {
    imagenes.push(
      loadImage("data/recurso" + i + ".png")
      );
  }
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  mouseXant = 0;
  mouseYant = 0;
  for (let i = 0; i < 120; i++) {
    let img = random(imagenes);
    let x = random(width);
    let y = random(height);
    let tam = random(60, 180);
    figuras.push(new Figura(i, img, x, y, tam));
  }
}

function draw() {

  background(127);
  let ahora = millis();
  let vientoX = mouseX - mouseXant;
  let vientoY = mouseY - mouseYant;
  mouseXant = mouseX;
  mouseYant = mouseY;
  if (clicPresionado) {
    for (let f of figuras) {
      if (f.arrastrada) {
        f.desplazX = lerp(f.desplazX, f.desplazX + vientoX * 0.8, 0.3);
        f.desplazY = lerp(f.desplazY, f.desplazY + vientoY * 0.8, 0.3);
      }
    }
  }

  for (let f of figuras) {
    if (f.girando) {
      f.anguloActual += f.velocidadGiro;
      if (abs(f.anguloActual - f.anguloOrigen) >= TWO_PI) {
        f.anguloActual = f.anguloOrigen;
        f.girando = false;
      }
    }

    if (f.girando && (ahora - f.tiempoInicio) > 4000) {
      f.anguloActual = f.anguloOrigen;
      f.girando = false;
    }
    if (f.escalando) {
      f.escalaActual = lerp(f.escalaActual, 2.0, 0.1);
    } else if (f.escalaActual !== 1.0) {
      f.escalaActual = lerp(f.escalaActual, 1.0, 0.05);
      if (abs(f.escalaActual - 1.0) < 0.01) {
        f.escalaActual = 1.0;
      }
    }
    if (!f.arrastrada) {
      f.desplazX = lerp(f.desplazX, 0, 0.04);
      f.desplazY = lerp(f.desplazY, 0, 0.04);
      if (abs(f.desplazX) < 0.1) f.desplazX = 0;
      if (abs(f.desplazY) < 0.1) f.desplazY = 0;
    }
    f.dibujar();
  }
}

function mousePressed() {
  if (mouseButton === LEFT) {
    clicPresionado = true;
    if (!clicPresionadoAntes) {
      clicPresionadoAntes = true;
      mouseXant = mouseX;
      mouseYant = mouseY;
      let cantidad = floor(random(16, 26));
      let indices = [];
      let disponibles = [];
      for (let i = 0; i < figuras.length; i++) {
        disponibles.push(i);
      }
      cantidad = min(cantidad, disponibles.length);
      while (indices.length < cantidad) {
        let rand = disponibles[floor(random(disponibles.length))];
        if (!indices.includes(rand)) {
          indices.push(rand);
        }
      }
      for (let f of figuras) {
        f.arrastrada = false;
      }
      for (let idx of indices) {
        figuras[idx].arrastrada = true;
      }
    }
  }
}
function mouseReleased() {
  if (mouseButton === LEFT) {
    clicPresionado = false;
    clicPresionadoAntes = false;
    for (let f of figuras) {
      f.arrastrada = false;
    }
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    let cantidad = floor(random(16, 26));
    let indices = []
      let disponibles = [];
    for (let i = 0; i < figuras.length; i++) {
      if (!figuras[i].girando) {
        disponibles.push(i);
      }
    }
    if (disponibles.length === 0) {
      for (let i = 0; i < figuras.length; i++) {
        disponibles.push(i);
      }
    }
    cantidad = min(cantidad, disponibles.length);
    while (indices.length < cantidad) {
      let rand = disponibles[floor(random(disponibles.length))];
      if (!indices.includes(rand)) {
        indices.push(rand);
      }
    }
    for (let idx of indices) {
      let f = figuras[idx];
      if (!f.girando) {
        f.anguloOrigen = f.anguloActual;
        let dir = random(1) > 0.5 ? 1 : -1;
        f.velocidadGiro = dir * random(0.02, 0.08);
        f.girando = true;
        f.tiempoInicio = millis();
      }
    }
  }

  if (key === 't' || key === 'T') {
    teclaT = true;
    if (!tPresionadaAntes) {
      tPresionadaAntes = true;
      let cantidad = floor(random(16, 26));
      let indices = [];
      let disponibles = [];
      for (let i = 0; i < figuras.length; i++) {
        disponibles.push(i);
      }
      cantidad = min(cantidad, disponibles.length);
      while (indices.length < cantidad) {
        let rand = disponibles[floor(random(disponibles.length))];
        if (!indices.includes(rand)) {
          indices.push(rand);
        }
      }
      for (let f of figuras) {
        f.escalando = false;
      }
      for (let idx of indices) {
        figuras[idx].escalando = true;
      }
    }
  }
}

function keyReleased() {
  if (key === 't' || key === 'T') {
    teclaT = false;
    tPresionadaAntes = false;
    for (let f of figuras) {
      f.escalando = false;
    }
  }
}
