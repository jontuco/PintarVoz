let sliderSatu;
let dibujos = []; 


let datosHSB;
let paletaE1;  
let puntosE1; 

function preload() {
  let marcaInicio = millis();
  datosHSB = loadJSON("paletaColoresHSB_E1_E2_E3_bordes.json");
  let marcaFin = millis();
  console.log(marcaInicio);
  console.log(marcaFin);
}

function setup() {
  createCanvas(800, 600);
  background(170);
  rectMode(CENTER);
  sliderSatu = new Slider(400, 540, 0, 100);
  colorMode(HSB);
  cargarDibujo1();
}


function draw() {
  fill(360, sliderSatu.intensidad, 100);
  rect(width/2, height/2, 160, 80);
  dibujos[0].dibujar(sliderSatu.intensidad);
  sliderSatu.dibujar();
}

function mouseDragged() {
  sliderSatu.moverSlider();
}
