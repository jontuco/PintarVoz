class Curvas_1 {
  
  constructor(curvas) { this.curvas = curvas; }
  
  dibujar(satu) {
    for (let c of this.curvas) c.dibujar(satu);
  }
}

class Curva {
  constructor(id, col, puntos) { this.id = id; this.c = col; this.puntos = puntos; }
  
  dibujar(satu) {
    let col = color(hue(this.c), constrain(saturation(this.c) - satu, 0, 100), brightness(this.c));
    fill(col); noStroke(); beginShape();
    for (let i = 0; i < this.puntos.length; i += 2)
      curveVertex(this.puntos[i], this.puntos[i + 1]);
    endShape(CLOSE);
  }
}

function cargarDibujo1() {
  paletaE1 = datosHSB.paletaE1;
  puntosE1 = datosHSB.puntosE1;
  let curvas_1 = [];
  for (let i = 0; i < datosHSB.paletaE1.length; i++) {
    let h = paletaE1[i][0];
    let s = paletaE1[i][1];
    let b = paletaE1[i][2];
    let colorCurva = color(h, s, b);
    let puntosCurva = puntosE1[i];
    curvas_1.push(new Curva(i, colorCurva, puntosCurva));
  }
  dibujos.push(new Curvas_1(curvas_1));
}
