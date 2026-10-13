// =====================================================
// NAVE
// =====================================================
function Ship() {
  this.x = 0;
  this.y = 0;
  this.width = 125;
  this.height = 75;
  this.radius = 30;      // radio de colisión (lo usa revisarColision en Star.js)
  this.scaleX = 1;       // escala (también la usa la colisión)
  this.scaleY = 1;
  this.rotation = 0;
  this.showFlame = false;

  // La imagen se carga una sola vez
  this.image = new Image();
  this.image.src = "Navecita.png";
}

Ship.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);

  // Llama: rotación normal, sale por la parte trasera (lado -x)
  if (this.showFlame) {
    context.lineWidth = 2;
    context.strokeStyle = "#ffffff";
    context.beginPath();
    context.moveTo(-this.width / 2, -8);
    context.lineTo(-this.width / 2 - 20, 0);
    context.lineTo(-this.width / 2, 8);
    context.stroke();
  }

  // Imagen: se gira 180° porque el sprite original mira a la izquierda
  context.rotate(Math.PI);
  context.drawImage(
    this.image,
    -this.width / 2,
    -this.height / 2,
    this.width,
    this.height
  );

  context.restore();
};