class Figura {

  constructor(id, img, x, y, tam) {
    this.id = id;
    this.img = img;
    this.x = x;
    this.y = y;
    this.tam = tam;
    this.anguloActual = 0;
    this.anguloOrigen = 0;
    this.velocidadGiro = 0;
    this.girando = false;
    this.tiempoInicio = 0;
    this.escalaActual = 1.0;
    this.escalando = false;
    this.desplazX = 0;
    this.desplazY = 0;
    this.arrastrada = false;
  }

  dibujar() {
    push();
    translate(
      this.x + this.desplazX,
      this.y + this.desplazY
      );
    rotate(this.anguloActual);
    scale(this.escalaActual);
    image(
      this.img,
      0,
      0,
      this.tam,
      this.tam
      );
    pop();
  }
}
