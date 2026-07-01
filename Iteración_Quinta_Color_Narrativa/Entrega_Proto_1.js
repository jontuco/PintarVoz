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
    // CORE DEL SHADER GLSL - RECIBE LA AMPLITUD DESDE P5JS PARA AUMENTAR LA ONDULACION
    uv.x += sin(uv.y * 10.0 + uTiempo * 1.5) * uAmplitud;
    uv.y += cos(uv.x * 9.0 + uTiempo * 1.2) * uAmplitud * 0.6;
    gl_FragColor = texture2D(uTextura, uv);
  }
`;


// --- VARIABLES GLOBALES ---
let dibujos = [];        //almacena los 3 macro estados - contiene 3 clases maestras (Curvas_1, Curvas_2, Curvas_3) (se construyen con toda la paleta de colores y crea todos los objetos curva y o bordes con cada coordenada de curveVertex) - sus metodos .dibujar llaman al metodo .dibujar de cada objeto curva curva_2 curva_3 y curva_4 del estado correspondiente, recien ahí se termina de establecer como se van a dibujar
let ondaShader;          //almacena la declaración del shader creado con createShader
let buffer;              //gestor del buffer grafico
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
let umbralRuido = 0.1;  // funciona bien casa ara microfono c922
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

let teclaTBloqueada = false; // function keyPressed

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

  cargarDibujo1();  //Estado 1 - solo figuras
  cargarDibujo2();  //Estado 2 - figuras mas bordes
  cargarDibujo3();  //Estado 3 - solo bordes

  // Verifica cuántos dibujos cargaron
  console.log("Cantidad de dibujos cargados: " + dibujos.length);
  if (dibujos.length < 3) {
    console.error("¡ALERTA! No se cargaron los 3 dibujos. Revisa el orden en setup().");
  }
}

function draw() {

  if (!audioIniciado) {
    resetShader();
    image(buffer, -width / 2, -height / 2, width, height);
    return;
  }

  // 1. procesar sonido
  amp = mic.getLevel();
  gestorAmp.actualizar(amp);
  
  intensidad = gestorAmp.filtrada; //tomamos la intensidad filtrada por el objeto gestorAmp
  altura = gestorFrec.filtrada;  //tomamos la altura filtrada por el objeto gestorFrec
  
  // 2. LÓGICA TEMPORAL 
  let haySonido = intensidad > umbralRuido; //configurable
  let empezoElSonido = haySonido && !antesHabiaSonido;
  let terminoElSonido = !haySonido && antesHabiaSonido;

  if (empezoElSonido) {
    marcaInicioSonido = millis(); 
    sonidoLargo = false;  //volvemos a la logica de variables booleanas  // la usamos para cambiar entre los 3 macro estados
    sonidoCorto = false;  // la usamos para rebarajar los colores en cada estado
  }

  if (haySonido) {
    durSonido = millis() - marcaInicioSonido; //medimos la duracion del sonido para usar inputs de sonidoCorto y sonidoLargo
    sonidoLargo = durSonido >= umbralDuracionSonido;
    sonidoCorto = durSonido < umbralDuracionSonido;  //atenti al usar esta variable, hay que limitarla añadiendo otras condicionales, sino se ejecuta al menor ruido y se repite en el bucle del draw
  }

  // input de SONIDO LARGO - cambio de macro estado 
  if (sonidoLargo) {   
    indiceObra = (indiceObra + 1) % dibujos.length; // Cicla entre 0, 1 y 2 - en 6 segundos de sonido continuo pasa por los 3 estados
    umbralDuracionSonido += 2000;   //pateamos para delante el humbral de duracion para que no cambie al siguiente frame de cumplirse la condicion 
  }

  // input SONIDO CORTO (palmada/silvido/grito) - reordena la paleta de colores
  if (sonidoCorto && intensidad > 0.4 && !cooldown) { //sumamos una condicion de intensidad media y un cooldown
    cambiarColores();  //esta es la función encargada de llamar a los metodos en los contenedores de curvas y en lo
    cooldown = true; //desactiva la condición en el primer ciclo del draw para que los colores no parpadeen
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
  let targetOpInvertida = map(intensidad, 0.2, 1.0, 90, 50, true); //{2}

  //agrega relleno en dibujo[1,2]
  let targetOp = map(intensidad, 0.0, 1.0, 20, 100, true);

  //diversifica el relleno de la figura fondo en dibujo[1]
  let targetOp3 = map(intensidad, 0.2, 0.8, 80, 10, true); //

  

  //hace vibrar las cuvas en dibujo[0,1,2]
  let targetVib = map(intensidad, 0.1, 1.0, 0, 5, true);

  let tiempo = 0;
  tiempo += 1;
  if (tiempo > 100) {
    tiempo = 0;
  }
  let targetVibTiempo = map(tiempo, 0, 100, -10, 10, true);



  

// Suavizado (la "respiracion")
  opC1 = lerp(opC1, targetOp, 0.1);
  opC3 = lerp(opC3, targetOp3, 0.1);  //
  vibActual = lerp(vibActual, targetVib, 0.1);
  vibActualTiempo = lerp(vibActualTiempo, targetVibTiempo, 0.1);
  //buffer.background(220);

  opC2 = lerp(opC2, targetOpInvertida, 0.1); //{3}


  // Uso de la altura de la voz para controlar el hug 
  let targetAlt;
  if (indiceObra === 0) {
    if (altura < 0.5) {
      //si el sonido es grave aumenta el valor de hug (tiende a verdes)
      targetAlt = map(altura, 0.1, 0.5, 0, 20, true);
    } else if (altura >= 0.5) {
      //si el sonido es agudo reduce el valor de hug (tiende a rojos)
      targetAlt = map(altura, 0.5, 1.0, 0, -30, true);
    }
  }
  hug = lerp(hug, targetAlt, 0.1);



  let targetSat = map(altura, 0.0, 1.0, 0, 20, true);   // esta es la variable por ahora es la que define cuanto varia la saturacion, no esta vinculada a el sonido, sino al mouseX, hay que cambiarlo
  
  //Uso de la altura de la voz para controlar el grosor de los bordes en el estado 2
  let targetStrWC4 = 10;
  if (indiceObra === 1) {
    //si el sonido es grave aumenta el grosor de los bordes
    if (altura < 0.5) {
      targetStrWC4 = map(altura, 0.1, 0.5, 10, 16, true);
      targetSat = map(altura, 0.1, 0.5, 0, 30, true);
    //si el sonido es agudo disminuye el grosor de los bordes
    } else if (altura >= 0.5) {
      targetStrWC4 = map(altura, 0.5, 1.0, 10, 4, true);
      targetSat = map(altura, 0.5, 1.0, 0, -30, true);
    }
  }
  strWC4 = lerp(strWC4, targetStrWC4, 0.1);
  saturacion = lerp(saturacion, targetSat, 0.1);
  
  if (indiceObra === 2) {
    if (durSonido % 200 === 0) {
      cambiarColores();
    }
  }
 




  //seleccion automatica de dibujo   //{4}
  // --- 5. SELECCIÓN AUTOMÁTICA DE DIBUJO ---

  let i = constrain(indiceObra, 0, dibujos.length - 1);

  if (i === 0) {
    // Obra 1: Curvas_1 (pg, vib, hug, satu, brill, op)
    dibujos[0].dibujar(buffer, vibActual, hug, saturacion, brillo, opC2);
  }
  else if (i === 1) {
    // Definimos la opacidad que reacciona al sonido (de 20 a 100)
    let opSonido = map(intensidad, 0.0, 1.0, 80, 60, true);

    // 100 es fijo para el fondo, opSonido es dinámico para las inestables de arriba
    dibujos[1].dibujar(buffer, opSonido, 100, strWC4, vibActual, saturacion);

  }
  else if (i === 2) {
    // Obra 2: Curvas_2
    // Pasamos el 6to parámetro: 'intensidad'
    dibujos[2].dibujar(buffer, 100, vibActual, vibActualTiempo, saturacion, intensidad);
  }

  // 5. SHADER siempre activo
  //mostrarLienzo();
  //mostrarMonitor();
  //(-width / 2, -height / 2, width, height);
  // 6. ACA se proyecta el buffer y el shader

  mostrarLienzo();
  

  // Debug para ver si el micrófono está captando algo
  if (frameCount % 60 === 0) {
    console.log("Intensidad actual: " + intensidad.toFixed(3));
    console.log("¿Está superando el umbral?: " + (intensidad > umbralRuido));
  }
}


let pantalla = 0;
function mostrarLienzo() {
  if (pantalla === 0) {
    shader(ondaShader);

    // Ajustamos la gelatina según la obra
    let ampBase = map(intensidad, 0, 1, 0.002, 0.02);
    let ampFinal = ampBase;

    // Si estamos en la Obra 3, podemos hacerla más "dura" o más "líquida"
    if (indiceObra === 2) {
      ampFinal = ampBase * 1.9; // La obra 3 se mueve 50% más
    }

    ondaShader.setUniform('uTextura', buffer);
    ondaShader.setUniform('uTiempo', millis() / 1000.0);
    ondaShader.setUniform('uAmplitud', ampFinal);

    rect(-width / 2, -height / 2, width, height);
    resetShader();
  }
}

//Esta funcion es la que se llama cada vez que hay un sonido corto y cambia los colores de las formas y los bordes sin romper la paleta original
function cambiarColores() {
  let quePaleta;
  //según el estado toma una paleta de color distinta del json para barajarla
  if (indiceObra === 0) {
    quePaleta = paletaE1;
  } else if (indiceObra === 1) {
    quePaleta = paletaE2;
  } else if (indiceObra === 2) {
    quePaleta = paletaBordesE3;
  }
  dibujos[indiceObra].reasignarColores(quePaleta);
}

async function iniciarAudio() {
  if (audioIniciado) return;
  await userStartAudio();
  mic.start(startPitch);  // x  startPitch se llama cuando el stream está listo
  audioIniciado = true;
}

function keyPressed() {
  if (key === 'w' || key === 'W') {
    indiceObra = (indiceObra + 1) % dibujos.length;
    console.log("Cambiando a obra: " + indiceObra);
  }

  if ((key === 't' || key === 'T') && !teclaTBloqueada) {
    teclaTBloqueada = true;
    let panel = document.getElementById('panel-ajustes');
    if (panel) {
      panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    }
  }
}

function keyReleased() {
  if (key === 't' || key === 'T') {
    teclaTBloqueada = false;
  }
}
function mousePressed() {
  if (!audioIniciado) {
    iniciarAudio();
    // Oculta el div de HTML una vez que se hace el primer click
    document.getElementById('pantalla-inicio').style.display = 'none';
  }
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
