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
let indiceObra = 0; 

// --- VARIABLES DE SONIDO ---
let mic, gestorAmp;
let audioIniciado = false;
let intensidad = 0;
let opC1 = 10, opC2 = 0, opC3 = 0, vibActual = 0;
let umbralDuracionSonido = 1000; // 1 segundo
let marcaInicioSonido = 0;
let haySonido = false;
let antesHabiaSonido = false;
let durSonido = 0;
let umbralRuido = 0.1; 

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
  // 1. procesar sonido
  let amp = mic.getLevel();
  gestorAmp.actualizar(amp);
  intensidad = gestorAmp.filtrada; // [3]

  // 2. LÓGICA TEMPORAL 
  let haySonido = intensidad > umbralRuido; // [1]
  let empezoElSonido = haySonido && !antesHabiaSonido;
  let terminoElSonido = !haySonido && antesHabiaSonido;

  if (empezoElSonido) {
    marcaInicioSonido = millis(); // [1]
  }

  if (haySonido) {
    durSonido = millis() - marcaInicioSonido; // [2]
    
    // SONIDO LARGO : cambia la opacidad
    if (durSonido > umbralDuracionSonido) {

       console.log("Sonido largo: cambiando colores..."); 
    }
  }

  /*podria usarse para rotar la orientacion de todos los mòdulos de la obra durante
        el estado 1 y al vez durante es estado 2, pero en este ultimo tendria que "ignorar"
        los bordes semiblancos, y tal vez en ese estado tenga mas importancia otra interaccion
        el sonido deberia ser o muy corto pero estar bien calibrado ara que no haga un cambio muy
        drastico. (tal vez lo de la rotacion de los modulos seria más facil si usamos un sonido largo 
        sostenido, que no provoque un cambio directo con inicio y final asegurado, podria ir aumentando 
        la rotacion mateada con la duracion, y si no llega hasta cierto punto de rotaciòn, desanda 
        la rotacion hasta volver a su estado inicial, pero si dura lo suficiente puede cambiar el patron 
        de los modulos definitivamente. si la duracion del sonido sobrepasa el punto de no retorno, y el 
        sonido sigue sosteniendose, entonces los bordes blancos empiezan a dibujarse desde un grosor muy bajo
        y de color bastante intenso hacia cada vez mas grueso y palido (creo que transparente) hasta un maximo
        (molaria si el strokeWeight empezara a difuminarse. no se si con lerpColor)
        La rotacion tendria que estar suavizada entre el sonido y cuanto gira, tambien la vuelta y final.
        Es incierto que es lo mejor cuanodo la matriz de modulos se reordena, si aprovechar el ruido largo y hacer
        lo de los bordes, ooooo... si "sacarle los poderes al sonido largo" , ya sea anulandolo totalmente, o 
        modificando su efecto grafico (por ejemplo, si hasta ahora venia controlando rotació, al pasar al estado 2 podria 
        empezarun a controlar el grosor de los bordes haciendolos finos (en realidad esto no es sacarle lso poderes,
        esto es darle mucha mas preponderancia al sonido largo [me da la sensacion de que hace falta distintos caminos para 
        desencadenar el cambio de estado, tiro por tirar, por ejemplo, si el sonido es largo y agudo el paso del estado 1
        al estado 2 usa principalmente rotacion y el manejo de color esperable(de intenso a suave y de mas opaco a transparente, 
        pero por ejemplo, si el sonido es largo pero grave, en vez de transicionar de 1 a 2 con rotacion lo podria hacer cambiando
        el tamaño de las curvas)]), y al pasar cierto umbral de tiempo (en este caso tiempo para dar espacio a la interactuar nueva, aunque 
        depende de otras decisiones, duracion del sonido) y de grosor o color 
        Tambien seria interesante, hablando del sonido largo, que a medida que a medida que continua las 
        curvas no roten todas ni todas de la misma forma(aunque la variacion tendria que ser minima para
        no entrar en complicaciones con la composicion). podrian empezar rotando algunas, y al pasar
        x "tiempo" empezarian a rotar más, y en el punto de no retorno todos deberian estar rotando y, por ejempo,
        habiendo pasado una rotacion del 135grados, osea 3/4*py 
      */

  if (terminoElSonido) {

    if(durSonido < 300 && 0.3 < intensidad < 0.6) {
      //sonido corto suaves (es decir: menor a un umbral de duracion y intensidad entre, muy poco, 0.3 y 0.5)
      susurro = true;
    }
    if(durSonido <300 && intensidad >= 0.6) {
      //sonido corto fuerte ()

    }
    if(durSilencio < 300 && 0.6 < intensidad > 0.75) {
      //sonido corto muy fuerte
    }

    if (indiceObra === 1) {

      if(opC1 > 90 && durSonido > 150){

      
    }




    // SONIDO CORTO : cambia de obra
    if (durSonido < umbralDuracionSonido) {
      indiceObra = (indiceObra + 1) % dibujos.length; // Cicla entre 0, 1 y 2
    }
  }
  antesHabiaSonido = haySonido;
  let targetOp = map(intensidad, 0.0, 1.0, 10, 100, true);
  let targetVib = map(intensidad, 0.1, 1.0, 0, 5, true);
  
  // Suavizado (la "respiracion")
  opC1 = lerp(opC1, targetOp, 0.1); 
  vibActual = lerp(vibActual, targetVib, 0.1);
  buffer.background(220); 
  
  //seleccion automatica de dibujo
  if (indiceObra === 2) {
    dibujos[indiceObra].dibujar(buffer, opC1, opC1, vibActual); // dibujo 3
  } else {
    dibujos[indiceObra].dibujar(buffer, opC1, vibActual); // dibujo 1 y 2
  }

  // 5. SHADER siempre activo
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