class Slider {

  constructor(posX_, posY_, minimo_, maximo_) {
    this.posX = posX_;
    this.posY = posY_;
    this.ancho = width - ( this.posX + 100 );
    this.alto = height - (this.posY + 20 );

    this.azul = 255;
    this.agrandar = 0;
    this.margen = 0;

    this.nivel = posX_;

    this.intensidad = 50;

    this.minimo = minimo_;
    this.maximo = maximo_;

    this.puedoCambiar = false;
    this.habilitarSlider();
    this.moverSlider();
    this.cambiarIntensidad();
  }

  dibujar() {
    this.habilitarSlider();
    push();
    colorMode(RGB);
    fill(255);
    rect(this.posX, this.posY, this.ancho, this.alto, 90);
    fill(0);
    line(this.posX-this.ancho/2, this.posY, this.posX+this.ancho/2, this.posY);
    fill(0, 0, this.azul);
    ellipse(this.nivel, this.posY, 16+this.agrandar, 16+this.agrandar);
    pop();
  }

  habilitarSlider() {
    if (mouseX<this.nivel+16/2+this.margen && mouseX>this.nivel-16/2-this.margen && mouseY<this.posY+16/2+this.margen && mouseY>this.posY-16/2-this.margen) {
      this.puedoCambiar = true;
      this.azul = 200;
      this.agrandar = 4;
      this.margen = 40;
    } else {
      this.puedoCambiar = false;
      this.azul = 255;
      this.agrandar = 0;
      this.margen = 0;
    }
  }

  moverSlider() {
    if (this.puedoCambiar && mouseX>this.posX-this.ancho/2+16/2 && mouseX<this.posX+this.ancho/2-16/2) {
      this.nivel = mouseX;
    }
    this.cambiarIntensidad();
  }

  cambiarIntensidad() {
    this.intensidad = map(this.nivel, this.posX-this.ancho/2, this.posX+this.ancho/2, 0, -100);
  }
}
