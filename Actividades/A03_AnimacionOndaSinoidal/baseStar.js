function Estrellita () {
  this.x = 0;
  this.y = 0;
  this.color = "#ffff00";
  this.scaleX = 1;
  this.scaleY = 1;
  this.rotation = 0;
 
  // --- Imagen ---
  this.estrellita = new Image();
  this.radius = 50; // valor por defecto mientras la imagen carga
  var self = this;
  this.estrellita.onload = function () {
    self.radius = self.estrellita.width / 2;
  };
  this.estrellita.src = "Estrellita.png";
 
  // --- Parámetros para oscilación en X ---
  this.angleX  = 0;      // ángulo actual de la onda en X
  this.centerX = 0;      // posición central (eje X) alrededor de la cual oscila
  this.rangeX  = 100;     // amplitud del movimiento en X
  this.speedX  = 0.015;    // velocidad de la onda en X
    // --- Parámetros para rotación (coseno) ---
  this.angleRotation  = 0;    // ángulo actual de la onda de rotación
  this.centerRotation = 0;    // rotación central (en radianes) alrededor de la cual oscila
  this.rangeRotation  = 0.5;  // amplitud de la rotación (en radianes)
  this.speedRotation  = 0.015;  // velocidad de la onda de rotación

}

Estrellita.prototype.moveX = function () {
  this.x = this.centerX + Math.sin(this.angleX) * this.rangeX;
  this.angleX += this.speedX;
};

Estrellita.prototype.rotateCosine = function () {
  this.rotation = this.centerRotation + Math.cos(this.angleRotation) * this.rangeRotation;
  this.angleRotation += this.speedRotation;
};

Estrellita.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, 262.5);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);
 
  context.drawImage(this.estrellita, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
 
  context.restore();
};
