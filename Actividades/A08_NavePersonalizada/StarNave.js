// =====================================================
// ESTRELLAS (A y B) + COLISIÓN CON AUDIO
// =====================================================

// Imágenes de cada tipo de estrella.
// (Originalmente ambas usaban "StarB.png"; cambia aquí si tienes otra imagen para A)
var SRC_ESTRELLA_A = "StarB.png";
var SRC_ESTRELLA_B = "StarB.png";

// -----------------------------------------------------
// CLASE BASE: Estrella
// -----------------------------------------------------
function Estrella(src) {
  this.x = 0;
  this.y = 0;
  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  this.tocando = false;   // bandera para detectar el INICIO del contacto

  // --- Imagen ---
  this.image = new Image();
  this.radius = 50;       // valor por defecto mientras la imagen carga
  var self = this;
  this.image.onload = function () {
    self.radius = self.image.width / 2;
  };
  this.image.src = src;

  // --- Parámetros para oscilación de escala (coseno) ---
  this.angleScale  = 0;     // ángulo actual de la onda
  this.centerScale = 1;     // escala central
  this.rangeScale  = 0.5;   // amplitud del cambio de escala
  this.speedScale  = 0.05;  // velocidad de la onda
}

/**
 * Hace que la estrella aumente y disminuya de tamaño
 * siguiendo una onda de COSENO.
 * scale = centerScale + cos(angleScale) * rangeScale
 */
Estrella.prototype.scaleCosine = function () {
  var escala = this.centerScale + Math.cos(this.angleScale) * this.rangeScale;
  this.scaleX = escala;
  this.scaleY = escala;
  this.angleScale += this.speedScale;
};

/**
 * Dibuja la estrella aplicando su posición, rotación y escala actuales.
 */
Estrella.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);

  context.drawImage(this.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2);

  context.restore();
};

// -----------------------------------------------------
// ESTRELLAS A y B (mismo comportamiento, distinta imagen)
// -----------------------------------------------------
function EstrellaA() {
  Estrella.call(this, SRC_ESTRELLA_A);
}
EstrellaA.prototype = Object.create(Estrella.prototype);
EstrellaA.prototype.constructor = EstrellaA;

function EstrellaB() {
  Estrella.call(this, SRC_ESTRELLA_B);
}
EstrellaB.prototype = Object.create(Estrella.prototype);
EstrellaB.prototype.constructor = EstrellaB;

// -----------------------------------------------------
// CREAR Y DIBUJAR
// -----------------------------------------------------

/**
 * Crea varias estrellas del tipo indicado (Clase) en las coordenadas dadas.
 * Cada una pulsa con un pequeño desfase para que no todas lo hagan igual.
 * @param {Function} Clase  EstrellaA o EstrellaB.
 * @param {Array<{x:number, y:number}>} coordenadas
 * @param {object} opciones  Opcional: {rangeScale, speedScale, centerScale, desfase}
 * @return {Array} arreglo de estrellas.
 */
function crearEstrellas(Clase, coordenadas, opciones) {
  opciones = opciones || {};
  var rangeScale  = (opciones.rangeScale  !== undefined) ? opciones.rangeScale  : 0.5,
      speedScale  = (opciones.speedScale  !== undefined) ? opciones.speedScale  : 0.05,
      centerScale = (opciones.centerScale !== undefined) ? opciones.centerScale : 1,
      desfase     = (opciones.desfase     !== undefined) ? opciones.desfase     : 0.3;

  return coordenadas.map(function (coord, i) {
    var e = new Clase();
    e.x = coord.x;
    e.y = coord.y;
    e.rangeScale  = rangeScale;
    e.speedScale  = speedScale;
    e.centerScale = centerScale;
    e.angleScale  = i * desfase;
    return e;
  });
}

// Funciones con los nombres que ya usa tu HTML
function crearEstrellasEnCoordenadas(coordenadas, opciones) {
  return crearEstrellas(EstrellaA, coordenadas, opciones);
}

function crearEstrellasBEnCoordenadas(coordenadasB, opciones) {
  return crearEstrellas(EstrellaB, coordenadasB, opciones);
}

/**
 * Actualiza (escala) y dibuja un arreglo de estrellas en cada frame.
 */
function dibujarEstrellas(context, estrellas) {
  estrellas.forEach(function (e) {
    e.scaleCosine();
    e.draw(context);
  });
}

function dibujarEstrellasB(context, estrellasB) {
  dibujarEstrellas(context, estrellasB);
}

// -----------------------------------------------------
// SONIDO AL COLISIONAR
// -----------------------------------------------------
var audioColision = new Audio("SonidoContacto.wav");

/**
 * Reproduce el sonido de contacto. Usa un clon para que varios contactos
 * seguidos no se corten entre sí, y captura el error si el navegador
 * bloquea el audio (por no haber interacción previa del usuario).
 */
function reproducirSonidoContacto() {
  var sonido = audioColision.cloneNode();
  var promesa = sonido.play();
  if (promesa !== undefined) {
    promesa.catch(function () { /* audio bloqueado hasta que haya interacción */ });
  }
}

/**
 * Revisa colisión circular entre la nave y cada estrella (distancia entre
 * centros vs. suma de radios, considerando la escala actual de cada una).
 * El sonido solo se dispara al INICIAR el contacto, no en cada frame.
 *
 * @param {Ship} navecita  Debe tener x, y y radius (opcional: scaleX).
 * @param {Array<Estrella>} estrellas
 */
function revisarColision(navecita, estrellas) {
  var radioBase = (navecita.radius !== undefined) ? navecita.radius : navecita.width / 2,
      escalaNave = (navecita.scaleX !== undefined) ? Math.abs(navecita.scaleX) : 1,
      radioNavecita = radioBase * escalaNave;

  estrellas.forEach(function (estrella) {
    var dx = navecita.x - estrella.x,
        dy = navecita.y - estrella.y,
        distancia = Math.sqrt(dx * dx + dy * dy),
        radioEstrella = estrella.radius * Math.abs(estrella.scaleX),
        hayContacto = distancia < (radioNavecita + radioEstrella);

    if (hayContacto && !estrella.tocando) {
      reproducirSonidoContacto();
    }

    estrella.tocando = hayContacto; // guarda el estado para el próximo frame
  });
}

// Funciones con los nombres que ya usa tu HTML
function revisarColisionConAudio(navecita, estrellasA) {
  revisarColision(navecita, estrellasA);
}

function revisarColisionConAudioB(navecita, estrellasB) {
  revisarColision(navecita, estrellasB);
}