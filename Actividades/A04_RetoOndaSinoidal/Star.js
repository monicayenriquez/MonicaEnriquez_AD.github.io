// ESTRALLA CENTRAL

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
  this.speedX  = 0.05;    // velocidad de la onda en X
 
  // --- Parámetros para oscilación en Y ---
  this.angleY  = 0;      // ángulo actual de la onda en Y
  this.centerY = 0;      // posición central (eje Y) alrededor de la cual oscila
  this.rangeY  = 100;     // amplitud del movimiento en Y
  this.speedY  = 0.05;    // velocidad de la onda en Y
}
 
/**
 * Traslada la estrella en el eje X siguiendo una onda sinoidal.
 * x = centerX + sin(angleX) * rangeX
 */
Estrellita.prototype.moveX = function () {
  this.x = this.centerX + Math.sin(this.angleX) * this.rangeX;
  this.angleX += this.speedX;
};
 
/**
 * Traslada la estrella en el eje Y siguiendo una onda sinoidal,
 * limitando el resultado a una coordenada máxima del canvas (limiteY).
 * Esto evita que la estrella se salga del área visible por abajo.
 * @param {number} limiteY  Coordenada Y máxima permitida (por ejemplo canvas.height).
 */
Estrellita.prototype.moveY = function (limiteY) {
  var nuevaY = this.centerY + Math.sin(this.angleY) * this.rangeY;
 
  // Si se define un límite, no dejamos que la estrella lo sobrepase
  if (typeof limiteY === "number") {
    nuevaY = Math.min(nuevaY, limiteY);
  }
 
  this.y = nuevaY;
  this.angleY += this.speedY;
};
 
/**
 * Dibuja la estrella en el contexto del canvas, aplicando su
 * posición, rotación y escala actuales.
 */
Estrellita.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);
 
  context.drawImage(this.estrellita, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
 
  context.restore();
};

// ESTRELLITAS A

function EstrellaA () {
  this.x = 0;
  this.y = 0;
  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;
 
  // --- Imagen ---
  this.estrellaA = new Image();
  this.radius = 50; // valor por defecto mientras la imagen carga
  var self = this;
  this.estrellaA.onload = function () {
    self.radius = self.estrellaA.width / 2;
  };
  this.estrellaA.src = "StarA.png";
 
  // --- Parámetros para oscilación de escala (coseno) ---
  this.angleScale  = 0;    // ángulo actual de la onda de escala
  this.centerScale = 1;    // escala central alrededor de la cual crece/decrece
  this.rangeScale  = 0.5;  // amplitud del cambio de escala
  this.speedScale  = 0.05; // velocidad de la onda de escala
}
 
/**
 * Hace que la imagen EstrellaA aumente y disminuya de tamaño
 * (scaleX/scaleY) siguiendo una onda de COSENO.
 * scale = centerScale + cos(angleScale) * rangeScale
 */
EstrellaA.prototype.scaleCosine = function () {
  var escala = this.centerScale + Math.cos(this.angleScale) * this.rangeScale;
  this.scaleX = escala;
  this.scaleY = escala;
  this.angleScale += this.speedScale;
};
 
/**
 * Dibuja la EstrellaA en el contexto del canvas, aplicando su
 * posición y escala actuales.
 */
EstrellaA.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);
 
  context.drawImage(this.estrellaA, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
 
  context.restore();
};
 
/**
 * Crea varias EstrellaA ubicadas en distintas coordenadas del canvas.
 * Cada estrella oscila su escala con coseno de forma independiente
 * (con un pequeño desfase de ángulo para que no todas "pulsen" igual).
 * @param {Array<{x:number, y:number}>} coordenadas  Lista de posiciones {x, y}.
 * @param {object} opciones  Opcional: {rangeScale, speedScale, centerScale, desfase}
 * @return {Array<EstrellaA>} arreglo de EstrellaA listas para animar y dibujar.
 */
function crearEstrellasEnCoordenadas(coordenadas, opciones) {
  opciones = opciones || {};
  var rangeScale  = (opciones.rangeScale  !== undefined) ? opciones.rangeScale  : 0.5,
      speedScale  = (opciones.speedScale  !== undefined) ? opciones.speedScale  : 0.05,
      centerScale = (opciones.centerScale !== undefined) ? opciones.centerScale : 1,
      desfase     = (opciones.desfase     !== undefined) ? opciones.desfase     : 0.3;
 
  var estrellas = [];
 
  coordenadas.forEach(function (coord, i) {
    var e = new EstrellaA();
    e.x = coord.x;
    e.y = coord.y;
    e.rangeScale  = rangeScale;
    e.speedScale  = speedScale;
    e.centerScale = centerScale;
    e.angleScale  = i * desfase; // desfase para que no oscilen todas al mismo tiempo
    estrellas.push(e);
  });
 
  return estrellas;
}
 
/**
 * Actualiza (escala) y dibuja un arreglo de EstrellaA en cada frame.
 * @param {CanvasRenderingContext2D} context
 * @param {Array<EstrellaA>} estrellas
 */
function dibujarEstrellas(context, estrellas) {
  estrellas.forEach(function (e) {
    e.scaleCosine();
    e.draw(context);
  });
}

// ESTRELLITAS B

function EstrellaB () {
  this.x = 0;
  this.y = 0;
  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;
 
  // --- Imagen ---
  this.estrellaB = new Image();
  this.radius = 50; // valor por defecto mientras la imagen carga
  var self = this;
  this.estrellaB.onload = function () {
    self.radius = self.estrellaA.width / 2;
  };
  this.estrellaB.src = "StarB.png";
 
  // --- Parámetros para oscilación de escala (coseno) ---
  this.angleScale  = 0;    // ángulo actual de la onda de escala
  this.centerScale = 1;    // escala central alrededor de la cual crece/decrece
  this.rangeScale  = 0.5;  // amplitud del cambio de escala
  this.speedScale  = 0.05; // velocidad de la onda de escala
}
 
/**
 * Hace que la imagen EstrellaA aumente y disminuya de tamaño
 * (scaleX/scaleY) siguiendo una onda de COSENO.
 * scale = centerScale + cos(angleScale) * rangeScale
 */
EstrellaB.prototype.scaleCosine = function () {
  var escala = this.centerScale + Math.cos(this.angleScale) * this.rangeScale;
  this.scaleX = escala;
  this.scaleY = escala;
  this.angleScale += this.speedScale;
};
 
/**
 * Dibuja la EstrellaA en el contexto del canvas, aplicando su
 * posición y escala actuales.
 */
EstrellaB.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);
 
  context.drawImage(this.estrellaB, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
 
  context.restore();
};
 
/**
 * Crea varias EstrellaA ubicadas en distintas coordenadas del canvas.
 * Cada estrella oscila su escala con coseno de forma independiente
 * (con un pequeño desfase de ángulo para que no todas "pulsen" igual).
 * @param {Array<{x:number, y:number}>} coordenadas  Lista de posiciones {x, y}.
 * @param {object} opciones  Opcional: {rangeScale, speedScale, centerScale, desfase}
 * @return {Array<EstrellaB>} arreglo de EstrellaA listas para animar y dibujar.
 */
function crearEstrellasBEnCoordenadas(coordenadasB, opciones) {
  opciones = opciones || {};
  var rangeScale  = (opciones.rangeScale  !== undefined) ? opciones.rangeScale  : 0.5,
      speedScale  = (opciones.speedScale  !== undefined) ? opciones.speedScale  : 0.05,
      centerScale = (opciones.centerScale !== undefined) ? opciones.centerScale : 1,
      desfase     = (opciones.desfase     !== undefined) ? opciones.desfase     : 0.3;
 
  var estrellasB = [];
 
  coordenadasB.forEach(function (coord, i) {
    var e = new EstrellaB();
    e.x = coord.x;
    e.y = coord.y;
    e.rangeScale  = rangeScale;
    e.speedScale  = speedScale;
    e.centerScale = centerScale;
    e.angleScale  = i * desfase; // desfase para que no oscilen todas al mismo tiempo
    estrellasB.push(e);
  });
 
  return estrellasB;
}
 
/**
 * Actualiza (escala) y dibuja un arreglo de EstrellaA en cada frame.
 * @param {CanvasRenderingContext2D} context
 * @param {Array<EstrellaB>} estrellasB
 */
function dibujarEstrellasB(context, estrellasB) {
  estrellasB.forEach(function (e) {
    e.scaleCosine();
    e.draw(context);
  });
}


// SONIDO AL COLISIONAR

var audioColision = new Audio("SonidoContacto.wav");
 
/**
 * Revisa si la Estrellita está en contacto con alguna EstrellaA
 * (colisión circular basada en distancia entre centros y radios,
 * tomando en cuenta la escala actual de cada una) y, si es así,
 * reproduce un audio corto.
 *
 * Solo se dispara el sonido justo al INICIAR el contacto (no en cada
 * frame mientras siguen tocándose), gracias a la bandera "tocando"
 * que se guarda en cada EstrellaA.
 *
 * @param {Estrellita} estrellita
 * @param {Array<EstrellaA>} estrellasA
 * @param {Array<EstrellaB>} estrellasB
 */
function revisarColisionConAudio(estrellita, estrellasA) {
  estrellasA.forEach(function (estrellaA) {
    var dx = estrellita.x - estrellaA.x,
        dy = estrellita.y - estrellaA.y,
        distancia = Math.sqrt(dx * dx + dy * dy),
        radioEstrellita = estrellita.radius * Math.abs(estrellita.scaleX),
        radioEstrellaA  = estrellaA.radius * Math.abs(estrellaA.scaleX),
        hayContacto = distancia < (radioEstrellita + radioEstrellaA);
 
    if (hayContacto && !estrellaA.tocando) {
      // Reinicia el audio por si sigue sonando de un contacto anterior
      audioColision.currentTime = 0;
      audioColision.play();
    }
 
    estrellaA.tocando = hayContacto; // guarda el estado para el próximo frame
});
}

function revisarColisionConAudioB(estrellita, estrellasB) {
  estrellasB.forEach(function (estrellaB) {
    var dx = estrellita.x - estrellaB.x,
        dy = estrellita.y - estrellaB.y,
        distancia = Math.sqrt(dx * dx + dy * dy),
        radioEstrellita = estrellita.radius * Math.abs(estrellita.scaleX),
        radioEstrellaB  = estrellaB.radius * Math.abs(estrellaB.scaleX),
        hayContacto = distancia < (radioEstrellita + radioEstrellaB);
 
    if (hayContacto && !estrellaB.tocando) {
      // Reinicia el audio por si sigue sonando de un contacto anterior
      audioColision.currentTime = 0;
      audioColision.play();
    }
 
    estrellaB.tocando = hayContacto; // guarda el estado para el próximo frame
  });

}