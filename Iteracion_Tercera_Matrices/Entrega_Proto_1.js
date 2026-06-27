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
    // CORE DEL SHADER GLSL - RECIBE LA AMPLITUD DESDE P5JS
    uv.x += sin(uv.y * 10.0 + uTiempo * 1.5) * uAmplitud;
    uv.y += cos(uv.x * 9.0 + uTiempo * 1.2) * uAmplitud * 0.6;
    gl_FragColor = texture2D(uTextura, uv);
  }
`;


// --- VARIABLES GLOBALES ---
let dibujos = [];        //gestor de los 3 estados - contiene 3 clases maestras (Curvas_1, Curvas_2, Curvas_3) (se construyen con toda la paleta de colores y crea todos los objetos curva y o bordes con cada coordenada de curveVertex) - sus metodos .dibujar llaman al metodo .dibujar de cada objeto curva del estado correspondiente, recien ahí se termina de establecer como se van a dibujar
let ondaShader;          //gestor del shader - SE ACTIVA CON KEY m M
let buffer;              //gestor del buffer grafico
let guia;                //gestor del grafico secundario - SE AVTIVA CON b B
let mostrar = false;     //activador del shader - KEY m M
let indiceObra = 0;      // seleccionador de estado - DE 0 A 3
let fuente;              //aca almaceamos la fuente tipografica para poder escribir en el canvas webgl


// --- GESTION DEL ARCHIVO JSON ---
let datosHSB;            //aca almacenamos el archivo JSON - contiene los colores y los puntos de las curvas en arreglos bidimensionales
//variables que acceden al archivo JSON
//ESTADO 1
let paletaE1;            // aca almacenamos el arreglo del JSON de COLORES HSB del estado 1
let puntosE1;            // aca almacenamos el arreglo del JSON de puntos/coordenadas de las CURVAS del estado 1
let puntosE1Original; // este va a ser el arreglo complejo sin modificar
let columnaDeCadaCurvaE1; //este es un arreglo simple con los mismo indices que curvas hay, pero el valor que contienen es 0 1 2 3 o 4 según a que columna de la matriz pertenece el indice paralelo al de los de las curvas
//ESTADO 2    
let paletaE2;            // aca almacenamos el arreglo del JSON de COLORES HSB del estado 2 (solo para las curvas)
let puntosE2;            // aca almacenamos el arreglo del JSON de puntos/coordenadas de las CURVAS del estado 2
//NO HAY UN ARREGLO DE COLORES PARA LOS BORDES PORQUE TODOS TIENEN EL MISMO COLOR - se define primero en cargarDibujo3
let puntosBordesE2;      // aca almacenamos el arreglo del JSON de puntos/coordenadas de los BORDES del estado 2
//ESTADO 3
let paletaBordesE3;      // aca almacenamos el arreglo del JSON de COLORES HSB del estado 3
let puntosBordesE3;      // aca almacenamos el arreglo del JSON de puntos/coordenadas de los BORDES estado 3

// --- VARIABLES DE SONIDO ---
let mic;
let audioIniciado = false;
//GESTION AMPPLITUD
let AMP_MIN = 0.001;
let AMP_MAX = 0.3;
let gestorAmp;
let amp = 0;
let intensidad = 0;
//GESTION FRECUENCIA
let NOTA_MIN = 44;
let NOTA_MAX = 70;
let gestorFrec;
let pitch;
const model_url =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";
let frec = 0;
let notaMidi = 0;
let altura = 0;      // no lo estamos usando
let difAltura = 0;   // no lo estamos usando

let umbralDuracionSonido = 2000; // 2 segundo   //{5}
let marcaInicioSonido = 0;
let marcaFinSonido = 0;
let haySonido = false;
let antesHabiaSonido = false;
let durSonido = 0;
let sonidoLargo = false;
let sonidoCorto = false;
let cooldown = false;

//CAMBIAR SEGUN EL RUIDO AMBIENTE
let umbralRuido = 0.3;  // funciona bien casa ara microfono c922
//let umbralRuido = 0.1;  //configuracion que maso anda en el aula

// --- Variables dependientes de mapeos entre señales de audio y rangos especificos y suavizados por lerp. son las encargadas de modificar el resultado de los metodos .dibujar de cada curva individual a travez de los objetos maestros se pàsan hasta cada curva
let opC1 = 10;                       //define la oacidad de los bordes del estado 2 - depende de intensidad - de transparente a opaco
let opC2 = 0;                        //define opacidad de las curvas del estado 1 - depende de la intensidad - de opaco a transparente
let opC3 = 0;                        //define la opacidad de las curvas del estdo 2 - depende de la intensidad - de transparente a opaco
let strWC4 = 13;                     //define el strokjeWeight() de los bordes del estadpo 2 - depende de la intensidad - de grueso a fino (13 a 6) (6 es el valor estatico que reciben los bordes del estado 3)
let vibActual = 0;                   //define en rango del valor aleatorio que se añade a las coordenadas de los vertices de curveVertex((), ()) cada vez que se dibujan - genera un desplazamiento de las coordenadas originales relativamente estable - depende de la intensidad - su valor final es entre 0 y 5;
let vibActualTiempo = 0;
let hug = 0;
let saturacion = 0;                  // variable que almacena el mapeo entre la intensidad de 0 a 1 y la pasa a entre 20 y 100 (100 en es valor maximo para un parametro de color en el modo hsb) - la variazion del resultado del mapeo se atenua usando un lerp al 10% - es pasado como parametro al metodo .dibujar del objeto maestro contenido en el arreglo dibujos, es decir, a los objetos de las 3 clases maestras. Estos a su vez se lo pasan desde su propios metodos .dibujar a los metodos .dibujar de las clases que definen como es cada curva o borde - la cadena de procesado de la saturacion llega a su resultado final en la variable local "let col = color(hue(), saturation(); brightness()); del metodo .dibujar de los objetos Curva Curva_2 Curva_3 Curva_4 como parametro que se asigna, como ya hemos dicho, en primer lugar en function draw al invocar dibujos[N].dibujar(acá es donde se pueden meter parametros que afecten al dibujo y dependan de las variaciones del sonido)
let brillo = 0;
//       puntos de control con frecuencia
let umbralRuidoPruebaEnFrec = 0.1;  //mismos valores que para amp e intensidad
let umbralDuracionSonidoFrec = 2000;          //mismos valores que para amp e intensidad


function preload() {
  datosHSB = loadJSON("paletaColoresHSB_E1_E2_E3_bordes.json"); //{}
  fuente = loadFont("assets/CafeCn.ttf");  //{}
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(fuente);  //{}

  puntosE1Original = structuredClone(datosHSB.puntosE1); //es casi intuitivo, estamos copiando toooda la estructura compleja del arreglo bidimensional en una copia nueva, no renombrandolo. no usamos el operados ... de js porque solo copiaria el primer nivel del arreglo complejo/bidimensional
  columnaDeCadaCurvaE1 = datosHSB.columnaDeCadaCurvaE1; //almacenamos el arreglo simple del json

  buffer = createGraphics(800, 600);
  guia = createGraphics(800, 600);  //{aca se dibujan cuadrantes por modulos de la matriz} 
  ondaShader = createShader(vertSrc, fragSrc);

  noStroke();  //borra los bordes de los triangulos que forman el plano 3d del canvas WEBGL  
  //modo HSB - HUE - SATURATION - BRIGHTNESS - ALPHA
  colorMode(HSB, 360, 100, 100, 100);  //{}
  buffer.colorMode(HSB, 360, 100, 100, 100); //{}
  guia.colorMode(HSB, 360, 100, 100, 100); //{}

  mic = new p5.AudioIn();
  gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
  gestorFrec = new GestorSenial(NOTA_MIN, NOTA_MAX);  //{}

  cargarDibujo1();  //{0}
  cargarDibujo3();
  cargarDibujo2();
}

function draw() {
  if (!audioIniciado) {
    // Dibujamos en el buffer 2D
    buffer.push();
    buffer.colorMode(RGB);
    buffer.background(150);
    buffer.fill(255);
    buffer.textAlign(CENTER, CENTER);
    buffer.textSize(40);
    buffer.text("Haz click para comenzar", 400, 300); // 400 y 300 son el centro de 800x600
    buffer.pop();
    // Ahora mostramos el buffer pasado como textura en el plano 3d del canvas WEBGL
    texture(buffer);  //{}
    plane(width, height);  //{}
    return;
  }

  // 1. procesar sonido
  amp = mic.getLevel();
  gestorAmp.actualizar(amp);
  // amplitud y frecuencia
  intensidad = gestorAmp.filtrada; // [3]
  // altura y frecuencia
  altura = gestorFrec.filtrada;   // {aca la altura sale entre }
  //esto es por si usamos la derivada
  difAltura = gestorFrec.derivada * 10;  //x
  // 2. LÓGICA TEMPORAL 
  let haySonido = intensidad > umbralRuido; // [1]  //configurable
  // 
  let empezoElSonido = haySonido && !antesHabiaSonido;
  let terminoElSonido = !haySonido && antesHabiaSonido;

  if (empezoElSonido) {
    marcaInicioSonido = millis(); // [1]
    //por si sirve para retroceder en el flujo
    durSilencio = millis() - marcaFinSonido;  //{x}
    sonidoLargo = false;  //{x} por debugear
    sonidoCorto = false;
  }

  if (haySonido) {
    durSonido = millis() - marcaInicioSonido; // [2]
    sonidoLargo = durSonido >= umbralDuracionSonido;
    sonidoCorto = durSonido < umbralDuracionSonido;  //atenti al usar esta variable, hay que limitarla añadiendo condicionales, sino se ejecuta al menor ruido
  }

  // SONIDO LARGO : cambia la opacidad
  if (sonidoLargo) {   //{6}
    //cambiamos el estado de la obra
    indiceObra = (indiceObra + 1) % dibujos.length; // Cicla entre 0, 1 y 2 - en 6 segundos de sonido continuo pasa por los 3 estados
    //pateamos para delante el humbral de duracion 
    umbralDuracionSonido += 2000;
    //console.log("Sonido largo: cambiando colores..."); 
  }

  // SONIDO CORTO DE PALMADA: cambia de obra
  if (sonidoCorto && intensidad > 0.4 && !cooldown) {
    cambiarColores();
    cooldown = true; //desactiva la condición en el primer ciclo del draw para que los colores no parpadeen
    //indiceObra = (indiceObra + 1) % dibujos.length; // Cicla entre 0, 1 y 2
  }

  if (terminoElSonido) {
    cooldown = false;
    console.log("indiceObra = " + indiceObra);
    //restablecemos el humbral de sonido
    umbralDuracionSonido = 2000;  //{7}
    marcaFinSonido = millis();
    sonidoLargo = false;
    sonidoCorto = false;
  }




  if (frameCount % 120 === 0) {
    console.log("intensidad = " + intensidad);
    console.log("haySonido = " + haySonido);
    console.log("umbralDuracionSonido = " + umbralDuracionSonido);
    console.log("altura = " + altura);
    console.log("durSonido = " + durSonido);
  }

  if (!haySonido) {
    durSilencio = millis() - marcaFinSonido;
  }


  antesHabiaSonido = haySonido;
  //saca relleno en dibujo[0]
  let targetOpInvertida = map(intensidad, 0.2, 1.0, 100, 100, true); //{2}
  //agrega relleno en dibujo[1,2]
  let targetOp = map(intensidad, 0.0, 1.0, 20, 100, true);
  //diversifica el relleno de la figura fondo en dibujo[1]
  let targetOp3 = map(intensidad, 0.2, 0.8, 80, 10, true); //
  //grosor borde dibujo[1]
  let targetStrWC4 = map(intensidad, 0.2, 1.0, 13, 6, true);
  //hace vibrar las cuvas en dibujo[0,1,2]
  let targetVib = map(intensidad, 0.1, 1.0, 0, 5, true);
  let tiempo = 0;
  tiempo += 1;
  if (tiempo > 100) {
    tiempo = 0;
  }
  let targetVibTiempo = map(tiempo, 0, 100, -10, 10, true);
  let targetAlt;

  if (altura < 0.5) {
    targetAlt = map(altura, 0.1, 0.5, 0, 30, true);
    hug = lerp(hug, targetAlt, 0.1);
  } else if (altura >= 0.5) {
    targetAlt = map(altura, 0.5, 1.0, 0, 30, true);
    hug = lerp(hug, targetAlt, 0.1);
  }

  // Suavizado (la "respiracion")

  opC1 = lerp(opC1, targetOp, 0.1);
  opC3 = lerp(opC3, targetOp3, 0.1);  //
  strWC4 = lerp(strWC4, targetStrWC4, 0.1);
  vibActual = lerp(vibActual, targetVib, 0.1);
  vibActualTiempo = lerp(vibActualTiempo, targetVibTiempo, 0.1);
  //buffer.background(220);

    opC2 = lerp(opC2, targetOpInvertida, 0.1); //{3}

    let cuanto = map(altura, 0.0, 1.0, 0, 20, true);   // esta es la variable por ahora es la que define cuanto varia la saturacion, no esta vinculada a el sonido, sino al mouseX, hay que cambiarlo
    saturacion = lerp(saturacion, cuanto, 0.1);

  


  //seleccion automatica de dibujo   //{4}
  if (indiceObra === 0) {
    dibujos[indiceObra].dibujar(buffer, vibActual, hug, saturacion, brillo, opC2); // dibujo 1 y 2
  } else if (indiceObra === 1) { //estado 2
    dibujos[indiceObra].dibujar(buffer, opC3, opC1, strWC4, vibActual, vibActualTiempo, saturacion); // dibujo 3
  } else {
    /*if (opC1 > 70) {
      
      targetOp = map(intensidad, 0.0, 1.0, 100, 70, true);
      opC1 = lerp(opC1, targetOp, 0.1);
      //aca voy a crear un umbralDeTipoCronomero especifica para que funcione solo si no llega a pasar al dibujo 3
      //  ESTA TAREA REQUIERE DEFINIR UNA TEMPORALIDAD EN EL FLUIR DE LA IMAGEN GENERADA
      //  me la imagino como un estado continuo pero que al dar una palmada se añada un "boost" de energia,movimiento,tension,color 
      // dependiendo de en que punto del ciclo este se encuentre el "boost" produce una mirada distinta 
    }  else if (durSonido < umbralDuracionSonido > du)
     */
    dibujos[indiceObra].dibujar(buffer, opC1, vibActual, saturacion); // dibujo 1 y 2
  }
  //background(0);
  guia.push();
  guia.colorMode(RGB);
  guia.clear();
  guia.fill(0, 0, 0, 0);
  guia.ellipse(0, 0, 100, 100);
  guia.ellipse(800, 0, 100, 100);
  guia.ellipse(0, 600, 100, 100);
  guia.ellipse(800, 600, 100, 100);
  guia.stroke(0, 255, 0);
  guia.strokeWeight(6);

  let idAreaModulo;
  for (let x = 0; x <= 800 - 800 / 5; x += 800 / 5) {
    for (let y = 0; y <= 600 - 600 / 5; y += 600 / 5) {
      guia.rect(x, y, 800 / 5, 600 / 5);
    }
  }
  guia.stroke(255, 0, 0);
  guia.strokeWeight(2);

  guia.rect(0, 0, 800 / 5, 600 / 5);
  guia.line(800 / 5, 0, 800 / 5, height);
  guia.line((800 / 5) * 2, 0, (800 / 5) * 2, height);
  guia.line((800 / 5) * 3, 0, (800 / 5) * 3, height);
  guia.line((800 / 5) * 4, 0, (800 / 5) * 4, height);

  guia.line(0, 600 / 5, width, 600 / 5);
  guia.line(0, (600 / 5) * 2, width, (600 / 5) * 2);
  guia.line(0, (600 / 5) * 3, width, (600 / 5) * 3);
  guia.line(0, (600 / 5) * 4, width, (600 / 5) * 4);


  guia.pop();
  // 5. SHADER siempre activo
  //mostrarLienzo();
  //mostrarMonitor();
  //(-width / 2, -height / 2, width, height);
  // 6. ACA se proyecta el buffer y el shader

  mostrarLienzo();
  push();
  colorMode(RGB);
  fill(255, 0, 0);
  stroke(0, 255, 0);
  strokeWeight(2);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("intensidad = ", 0, -100); // 400 y 300 son el centro de 800x600
  text(intensidad.toFixed(4), 0, -50);
  text("altura = ", 0, 0);
  text(altura.toFixed(4), 0, 50);
  text("notaMidi = ", 0, 100);
  text(notaMidi, 0, 150);
  pop();
  fill(30, 100, 50);

  //image(buffer, -width / 2, -height / 2, width, height)
}

let pantalla = 0;
function mostrarLienzo() {
  //background(40, 1, 82, 100);

  if (mostrar) {
    shader(ondaShader);
    let ampOnda = map(intensidad, 0, 1, 0.002, 0.02);
    ondaShader.setUniform('uTextura', buffer);
    ondaShader.setUniform('uTiempo', millis() / 1000.0);
    ondaShader.setUniform('uAmplitud', ampOnda);
    rect(-width / 2, -height / 2, width, height);
    //image(guia, -width / 2, -height / 2, width, height)
    resetShader();
  } else if (pantalla === 0) {
    resetShader();
    noStroke(); // y
    texture(buffer); // y
    plane(width, height); // y
  } else if (pantalla === 1) {
    resetShader();
    noStroke(); // y
    texture(guia); // y
    plane(width, height); // y
  }
}

function cambiarColores() {

  let quePaleta;

  if (indiceObra === 0) {
    quePaleta = paletaE1;
  } else if (indiceObra === 1) {
    quePaleta = paletaE2;
  } else if (indiceObra === 2) {
    quePaleta = paletaBordesE3;
  }

  dibujos[indiceObra].reasignarColores(quePaleta);

  cooldown = true; //desactiva la condición en el primer ciclo del draw para que los colores no parpadeen
}

function mostrarMonitor() {
  if (mostrar) {

    //resetShader();
    //image(bufferMonitor, -width / 2, -height / 2);
  }

}

async function iniciarAudio() {
  if (audioIniciado) return;
  await userStartAudio();
  mic.start(startPitch);  // x  startPitch se llama cuando el stream está listo
  audioIniciado = true;
}

function keyPressed() {
  if (key === 'm' || key === 'M') {
    mostrar = !mostrar;
  }
}

function keyReleased() {
  if (key === 'b' || key === 'B') {
    if (pantalla === 0) {
      pantalla = 1;
    } else if (pantalla === 1) {
      pantalla = 0;
    }
  }
}

function mousePressed() {
  iniciarAudio();
  console.log("coorX es =" + mouseX);
  console.log("coorY es =" + mouseY);

  console.log("buffer.coorX es =" + buffer.mouseX);
  console.log("buffer.coorY es =" + buffer.mouseY);

  console.log("ancho =" + width + "alto =" + height);

}

// --- DETECCION DE FRECUENCIA ---
// inicia el modelo de Machine Learning para deteccion de pitch
function startPitch() {
  // Conecta el modelo CREPE al stream de entrada actual.
  pitch = ml5.pitchDetection(      ////
    model_url,                     ////
    getAudioContext(),             ////
    mic.stream,                     ////
    modelLoaded,                   ////
  );                                ////
}
//TOMA LA ENTRADA DE la frecuencia sin filtrar
function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (err) {
      console.error(err);
      getPitch();
      return;
    }

    if (frequency) {
      frec = frequency;
      // Traduce frecuencia continua a escala MIDI para analizar altura musical.
      notaMidi = freqToMidi(frequency);
    } else {
      frec = 0;
      notaMidi = 0;
    }

    gestorFrec.actualizar(notaMidi);
    // Consulta continua para mantener actualización de altura en tiempo real.
    getPitch();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
