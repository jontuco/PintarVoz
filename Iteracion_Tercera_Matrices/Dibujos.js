// --- prueba de algoritmo de numeros aleatorios en un rango, excluyendo el ya seleccionado---
// --- reordenando el arreglo curvas_1 en uno nuevo con el orden modificado ---
let bolsaCurvas1 = []; // y

//cambiso 27/03/2026

// --- CLASES CONTENEDORAS ---
// --- CLASES CONTENEDORAS ---
class Curvas_1 {
  constructor(fondo, curvas) { this.reordenar = false, this.fondoColor = fondo; this.curvas = curvas; }

  reasignarColores(paleta) {                          // y
    let copiaPaleta = [...paleta];                     // y
    shuffle(copiaPaleta, true);                         // y
    for (let i = 0; i < this.curvas.length; i++) {      // y
      let [h, s, b] = copiaPaleta[i];                   // y
      this.curvas[i].tomarColor(color(h, s, b));          // y
    }                                                    // y
  }

  dibujar(pg, vib, hug ,satu ,brill, opacidad) {
    //if(ruidoCorto && ){
    //  this.reordenar=!reordenar;
    //}

    pg.background(this.fondoColor);
    for (let c of this.curvas) c.dibujar(pg, vib, hug ,satu ,brill, opacidad);
    /*
    if(ruidoCorto){
      pg.background(this.fondoColor); 
    for (let i = 0; i < this.curvas.length; i++) { // y
      let curva = this.obtenerCurvaSinRepetir(); // y
      curva.dibujar(pg, opacidad, vib, cuanto); // y
    } // y
    }*/
  }
}

class Curvas_2 {
  constructor(fondo, curvas) { this.fondoColor = fondo; this.curvas = curvas; }
  
  reasignarColores(paleta) {                          // y
    let copiaPaleta = [...paleta];                     // y
    shuffle(copiaPaleta, true);                         // y
    for (let i = 0; i < this.curvas.length; i++) {      // y
      let [h, s, b] = copiaPaleta[i];                   // y
      this.curvas[i].tomarColor(color(h, s, b));          // y
    }                                                    // y
  }

  dibujar(pg, opacidad, vib, vibActualTiempo, satu) {
    pg.background(this.fondoColor);
    for (let c of this.curvas) c.dibujar(pg, opacidad, vib, vibActualTiempo);
  }
}

class Curvas_3 {
  constructor(fondo, c3, c4) { this.fondoColor = fondo; this.curvas = c3; this.curvasSobre = c4; }
  
  reasignarColores(paleta) {                          // y
    let copiaPaleta = [...paleta];                     // y
    shuffle(copiaPaleta, true);                         // y
    for (let i = 0; i < this.curvas.length; i++) {      // y
      let [h, s, b] = copiaPaleta[i];                   // y
      this.curvas[i].tomarColor(color(h, s, b));          // y
    }                                                    // y
  }

  dibujar(pg, op1, op2, strWC4, vib, satu) {
    pg.background(this.fondoColor);
    for (let c of this.curvas) c.dibujar(pg, op1, vib, satu);
    for (let c of this.curvasSobre) c.dibujar(pg, op2, strWC4, vib);
  }
}

// --- configuracion de color, entrada de coordenadas de cada curva(forma), entrada en metodo dibujar de 4 parametros:
//  el buffer(para dibujar en el buffer), 
// opacidad (del color que se estblece en modo hsb), 
// vibracion (cada vez que se dibuja un punto/vertice de la curva se modifica su posicion en un rango aleatorio entre los valores establecidos, depende del seno(osea la oscilacion que hace el shader que tambien depende del tiempo) y de la amplitud )
// y
// cuantos (que define cuanto se le resta al valor de la saturacion )
class Curva {
  constructor(id, col, puntos) { this.id = id; this.c = col; this.puntos = puntos; }
  
  tomarColor(col) {
    this.c = col;
  }

  dibujar(pg, vib, hug ,satu ,brill, op) {
    let col = color(constrain((hue(this.c) + int(hug)), 0, 360), constrain(saturation(this.c) - satu, 0, 100), brightness(this.c) + brill, op);
    pg.fill(col); pg.noStroke(); pg.beginShape();
    for (let i = 0; i < this.puntos.length; i += 2)
      pg.curveVertex(this.puntos[i] + random(-vib, vib), this.puntos[i + 1] + random(-vib, vib));
    pg.endShape(CLOSE);
  }
}

class Curva_2 {
  constructor(id, col, puntos) { this.id = id; this.colorBorde = col; this.puntos = puntos; }
  
  tomarColor(col) {
    this.colorBorde = col;
  }

  dibujar(pg, op, vib, vibActualTiempo, satu) {
    let col = color(hue(this.colorBorde), saturation(this.colorBorde), brightness(this.colorBorde), op);
    pg.noFill(); pg.stroke(col); pg.strokeWeight(6); pg.beginShape();
    for (let i = 0; i < this.puntos.length; i += 2)
      pg.curveVertex(this.puntos[i] + random(-vib, vib) + vibActualTiempo, this.puntos[i + 1] + random(-vib, vib) + vibActualTiempo);
    pg.endShape();
  }
}

class Curva_3 {
  constructor(id, col, puntos) { this.id = id; this.c = col; this.puntos = puntos; }
  
  tomarColor(col) {
    this.c = col;
  }

  dibujar(pg, op, vib, satu) {
    if (saturation(this.c) > 60) {
      saturacion = lerp(saturacion, satu, 0.1);
    }
    if (saturation(this.c) < 30) {
      saturacion = lerp(saturacion, -satu, 0.1);
    }
    let col = color(hue(this.c), constrain(saturation(this.c) - satu, 0, 100), brightness(this.c), op);
    pg.fill(col); pg.noStroke(); pg.beginShape();
    for (let i = 0; i < this.puntos.length; i += 2)
      pg.curveVertex(this.puntos[i] + random(-vib, vib), this.puntos[i + 1] + random(-vib, vib));
    pg.endShape(CLOSE);
  }
}

class Curva_4 {
  constructor(id, col, puntos) { this.id = id; this.colorBorde = col; this.puntos = puntos; }
  
  dibujar(pg, op, strWC4, vib) {
    let col = color(hue(this.colorBorde), saturation(this.colorBorde), brightness(this.colorBorde), op);
    pg.noFill(); pg.stroke(col); pg.strokeWeight(strWC4); pg.beginShape();
    for (let i = 0; i < this.puntos.length; i += 2)
      pg.curveVertex(this.puntos[i] + random(-vib, vib), this.puntos[i + 1] + random(-vib, vib));
    pg.endShape();
  }
}

// --- FUNCIONES DE CARGA ---

//dibujo estado 1 figuras y bordes
function cargarDibujo1() {
  paletaE1 = datosHSB.paletaE1;
  
  let queMatriz = int(random(2));
  console.log("queMatriz = " + queMatriz);
  //no más logica de estados....se vienen cambios
  //puntosE1 = datosHSB["puntosE1Alt" + queMatriz]; // antes esto era puntosE1 = datosHSB.puntosE1;
  
  //----logica generativa de matrices----
  puntosE1 = generarMatriz(puntosE1Original, columnaDeCadaCurvaE1, queMatriz);  //recibe los puntos y a que columna corresponden ademas del random para definir la matriz
  

  let curvas_1 = [];
  for (let i = 0; i < datosHSB.paletaE1.length; i++) {
    let h = paletaE1[i][0];
    let s = paletaE1[i][1];
    let b = paletaE1[i][2];
    let colorCurva = color(h, s, b);
    let puntosCurva = puntosE1[i];

    let variación = int(random(-10, 10));

    for (let indicepuntos = 0; indicepuntos < puntosCurva.length; indicepuntos++) {
      puntosCurva[indicepuntos] += variación;
    }

    curvas_1.push(new Curva(i, colorCurva, puntosCurva));
  }
  let fondoN = color(40, 1, 82, 100);
  dibujos.push(new Curvas_1(fondoN, curvas_1));
  cambiarColores();
}

//dibujo estado 4 solo bordes de color intenso
function cargarDibujo2() {
  paletaBordesE3 = datosHSB.paletaBordesE3;
  puntosBordesE3 = datosHSB.puntosBordesE3;
  let curvas_2 = [];
  for (let i = 0; i < datosHSB.puntosBordesE3.length; i++) {
    let h = paletaBordesE3[i][0];
    let s = paletaBordesE3[i][1];
    let b = paletaBordesE3[i][2];
    let colorCurva = color(h, s, b);
    let puntosCurva = puntosBordesE3[i];
    curvas_2.push(new Curva_2(i, colorCurva, puntosCurva));
  }
  let fondoN = color(40, 1, 82, 100);
  dibujos.push(new Curvas_2(fondoN, curvas_2));
  cambiarColores();
}

function cargarDibujo3() {
  //estas tres variables globale acceden a los arreglos del archivo JSON, osea son arregos, bidimensionales
  paletaE2 = datosHSB.paletaE2;
  puntosE2 = datosHSB.puntosE2;
  puntosBordesE2 = datosHSB.puntosBordesE2;
  //estos arreglos almacenan todas las curvas y bordes que se crean, son arreglos de una dimension
  let curvas_3 = [];
  let curvas_4 = [];
  //este for recorre la cantidad de curvas que vamos a crear
  for (let i = 0; i < datosHSB.puntosE2.length; i++) {
    //aca estamos tomando los tres valores contenidos en cada indice del arreglo paletaE2
    let h = paletaE2[i][0];
    let s = paletaE2[i][1];
    let b = paletaE2[i][2];
    let colorCurva = color(h, s, b);
    let puntosCurva = puntosE2[i];
    curvas_3.push(new Curva_3(i, colorCurva, puntosCurva));
  }
  //un solo color para todas los bordes
  let coloresBorde = [color('#9c9191')];

  for (let i = 0; i < datosHSB.puntosBordesE2.length; i++) {
    let puntosCurva = puntosBordesE2[i];
    curvas_4.push(new Curva_4(i, coloresBorde[0], puntosCurva));
  }
  let fondoN = color(40, 1, 82, 100);
  dibujos.push(new Curvas_3(fondoN, curvas_3, curvas_4));
  cambiarColores();
}

function generarMatriz(puntosOriginales, columnaDeCadaCurva, queMatriz) {
  let anchoBuffer = 800;
  let cantidadColumnas = 5;
  let anchoColumna = anchoBuffer / cantidadColumnas;

  let puntosNuevos = [];

  for (let indiceCurva = 0; indiceCurva < puntosOriginales.length; indiceCurva++) {
    let puntosCurvaOriginal = puntosOriginales[indiceCurva];

    let columnaOriginal = columnaDeCadaCurva[indiceCurva];

    let nuevaColumna = columnaOriginal - queMatriz;

    if (nuevaColumna < 0) {
      nuevaColumna = nuevaColumna + cantidadColumnas;
    }

    let desplazamientoX = (nuevaColumna - columnaOriginal) * anchoColumna;

    let nuevaCurva = [];

    for (let indiceValor = 0; indiceValor < puntosCurvaOriginal.length; indiceValor++) {
      let valor = puntosCurvaOriginal[indiceValor];

      if (indiceValor % 2 === 0) {
        nuevaCurva[indiceValor] = valor + desplazamientoX;
      } else {
        nuevaCurva[indiceValor] = valor;
      }
    }

    puntosNuevos[indiceCurva] = nuevaCurva;
  }

  return puntosNuevos;
}
