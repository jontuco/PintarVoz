// panel.js

window.addEventListener('DOMContentLoaded', function () {

  const DEFAULTS = {
    umbralRuido:          0.1,
    umbralDuracionSonido: 2000,
    NOTA_MIN:             44,
    NOTA_MAX:             70,
    AMP_MAX:              0.3,
  };

  const panel       = document.getElementById('panel-ajustes');
  const btnReset    = document.getElementById('btn-reset');
  const ctrlUmbral   = document.getElementById('ctrl-umbral');
  const ctrlDuracion = document.getElementById('ctrl-duracion');
  const ctrlNotaMin  = document.getElementById('ctrl-notamin');
  const ctrlNotaMax  = document.getElementById('ctrl-notamax');
  const ctrlAmpMax   = document.getElementById('ctrl-ampmax');
  const valUmbral    = document.getElementById('val-umbral');
  const valDuracion  = document.getElementById('val-duracion');
  const valNotaMin   = document.getElementById('val-notamin');
  const valNotaMax   = document.getElementById('val-notamax');
  const valAmpMax    = document.getElementById('val-ampmax');

  // Verificación en consola para debugear
  if (!panel) { console.error('panel.js: no se encontró #panel-ajustes'); return; }
  console.log('panel.js: panel encontrado OK');

  function actualizarLabels() {
    valUmbral.textContent   = parseFloat(ctrlUmbral.value).toFixed(2);
    valDuracion.textContent = (ctrlDuracion.value / 1000).toFixed(1) + 's';
    valNotaMin.textContent  = ctrlNotaMin.value;
    valNotaMax.textContent  = ctrlNotaMax.value;
    valAmpMax.textContent   = parseFloat(ctrlAmpMax.value).toFixed(2);
  }

  function aplicar() {
    window.umbralRuido          = parseFloat(ctrlUmbral.value);
    window.umbralDuracionSonido = parseInt(ctrlDuracion.value);
    window.NOTA_MIN             = parseInt(ctrlNotaMin.value);
    window.NOTA_MAX             = parseInt(ctrlNotaMax.value);
    window.AMP_MAX              = parseFloat(ctrlAmpMax.value);

    if (window.gestorFrec) {
      window.gestorFrec.min = window.NOTA_MIN;
      window.gestorFrec.max = window.NOTA_MAX;
    }
    if (window.gestorAmp) {
      window.gestorAmp.max = window.AMP_MAX;
    }
    actualizarLabels();
  }

  function resetear() {
    ctrlUmbral.value   = DEFAULTS.umbralRuido;
    ctrlDuracion.value = DEFAULTS.umbralDuracionSonido;
    ctrlNotaMin.value  = DEFAULTS.NOTA_MIN;
    ctrlNotaMax.value  = DEFAULTS.NOTA_MAX;
    ctrlAmpMax.value   = DEFAULTS.AMP_MAX;
    aplicar();
  }

  ctrlUmbral.addEventListener('input',   aplicar);
  ctrlDuracion.addEventListener('input', aplicar);
  ctrlNotaMin.addEventListener('input',  aplicar);
  ctrlNotaMax.addEventListener('input',  aplicar);
  ctrlAmpMax.addEventListener('input',   aplicar);
  btnReset.addEventListener('click',     resetear);

  // Evitar que clicks en el panel lleguen al canvas de p5
  ['mousedown','mouseup','click','touchstart'].forEach(function(ev) {
    panel.addEventListener(ev, function(e) { e.stopPropagation(); });
  });

  // --- Tecla T: toggle del panel ---

  // Labels iniciales
  actualizarLabels();
  console.log('panel.js: inicializado correctamente');
});