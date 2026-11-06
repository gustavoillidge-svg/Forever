// ==================== GENERADOR DE MACROS — lógica + UI ====================
// Globals preservados: currentClass,currentRace,currentLevel,sequence,allAbilitiesCache,
// initSelects,onClassChange,onRaceChange,onLevelChange,updateSpellPool,filterSpellPool,
// onDragStart,onDragOver,onDragLeave,onDrop,generateMacro,copyMacro,updateOptions,renderSequence.

let currentClass = null;
let currentRace = null;
let currentLevel = 60;
let macroLang = 'es'; // 'es' | 'en'
let sequence = []; // { name,nameEn,icon,level,type,role,desc,uid }
let allAbilitiesCache = [];
let _drag = { spell: null, seqFrom: null, seqId: null };
const STORAGE_KEY = 'wow_forever_macro_v1';
const _debounceCache = {};
function debounce(fn, wait) {
  const key = fn.name || String(fn);
  if (_debounceCache[key]) return _debounceCache[key];
  let t;
  const g = function(){ const a=arguments, ctx=this; clearTimeout(t); t=setTimeout(function(){ fn.apply(ctx, a); }, wait); };
  _debounceCache[key] = g;
  return g;
}

// Opciones de comportamiento del macro (id, label, desc, default)
const MACRO_OPTIONS = [
  { id: 'showtooltip', label: '#showtooltip', desc: 'Muestra el tooltip del hechizo en el cursor al usar el macro.', default: true },
  { id: 'stopcasting', label: '/stopcasting', desc: 'Cancela el hechizo actual antes de lanzar.', default: false },
  { id: 'startattack', label: '/startattack', desc: 'Inicia ataque automático al objetivo.', default: false },
  { id: 'petattack', label: '/petattack', desc: 'Ordena a la mascota atacar al objetivo.', default: false },
  { id: 'cancelaura', label: '/cancelaura nombre', desc: 'Cancela un aura/buff específico antes de lanzar (ej: Bloque de Hielo).', default: false },
  { id: 'castsequence', label: '/castsequence', desc: 'Lanza los hechizos en secuencia (reset=target). No compatible con modificadores.', default: false },
  { id: 'mouseover', label: '[@mouseover]', desc: 'Lanza el hechizo sobre el puntero del ratón si existe.', default: false },
  { id: 'harm', label: '[harm]', desc: 'Solo si el objetivo es hostil.', default: false },
  { id: 'help', label: '[help]', desc: 'Solo si el objetivo es amistoso.', default: false },
  { id: 'nodead', label: '[nodead]', desc: 'Solo si el objetivo no está muerto.', default: false },
  { id: 'exists', label: '[exists]', desc: 'Solo si el objetivo existe.', default: false },
  { id: 'combat', label: '[combat]', desc: 'Solo si estás en combate.', default: false },
  { id: 'nostance', label: '[nostance]', desc: 'Sin restricción de postura/forma.', default: false },
  { id: 'mod', label: 'Ramas [mod]', desc: 'Genera ramas condicionales por modificador (Shift/Ctrl/Alt).', default: false }
];

// ---------- Utilidades puras (testeables) ----------
function spellDisplayName(s, lang) {
  if (!s) return '';
  return ((lang === 'en' ? (s.nameEn || s.name) : (s.name || s.nameEn)) || '').trim();
}
function isHelpful(ability) {
  if (!ability) return false;
  if (ability.role === 'heal' || ability.role === 'buff') return true;
  const t = `${ability.name || ''} ${ability.nameEn || ''} ${ability.desc || ''}`.toLowerCase();
  return /heal|curaci|bendici|blessing|renew|sanaci|holy light|shield(?! slam)|resur|fortitude|mark of|rejuven|regrowth|innerv|tranquil|salva|protecci|dispel|cleanse|purif/.test(t);
}
function isHarmful(ability) {
  if (!ability) return false;
  if (ability.role === 'damage' || ability.role === 'debuff') return true;
  const t = `${ability.name || ''} ${ability.nameEn || ''} ${ability.desc || ''}`.toLowerCase();
  return /golpe|strike|smite|bolt|fire|frost|shadow word: pain|ejecut|rend\b|mortal|wrath\b|shot\b|sting\b|sinister|evisc|curse|drain|doom|fear\b|charge\b|execute|backstab|gouge|heroic|revenge|whirlwind|hamstring|intercept|taunt/.test(t);
}
function sanitizeAuraName(v) { return String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').replace(/^\s*[#\/]+/, '').trim().slice(0, 80); }
function raceAllowsClass(raceKey, classKey) {
  if (!raceKey || !classKey) return true;
  const map = (typeof RACE_CLASSES !== 'undefined') ? RACE_CLASSES : null;
  if (!map || !map[raceKey]) return true;
  return map[raceKey].indexOf(classKey) !== -1;
}
function validRacesForClass(classKey) {
  if (!classKey || typeof RACES === 'undefined') return Object.keys(typeof RACES !== 'undefined' ? RACES : {});
  return Object.keys(RACES).filter(function (r) { return raceAllowsClass(r, classKey); });
}

function buildMacro(seq, opts) {
  opts = opts || {};
  const lang = opts.lang || 'es';
  const limit = (typeof MACRO_META !== 'undefined' && MACRO_META.charLimit) ? MACRO_META.charLimit : 255;
  const warnings = [];
  const lines = [];
  if (!seq || !seq.length) return { macro: '', warnings: ['Añade al menos un hechizo a la secuencia.'], error: 'empty', charCount: 0, limit };
  const first = seq[0];
  let useHelp = !!opts.help, useHarm = !!opts.harm;
  const useMouseover = !!opts.mouseover;
  if (useHelp && isHarmful(first) && !isHelpful(first)) { warnings.push('[help] omitido: el primer hechizo parece hostil/daño.'); useHelp = false; }
  if (useHarm && isHelpful(first) && !isHarmful(first)) { warnings.push('[harm] omitido: el primer hechizo parece amistoso/curación/buff.'); useHarm = false; }
  if (useMouseover && !useHelp && !useHarm) warnings.push('[@mouseover] sin [help]/[harm]: puede fallar en objetivos no válidos.');
  if (opts.mod && seq.length > 1 && (opts.mods || []).length) warnings.push('Ramas [mod]: usan hechizos por orden de secuencia; verifica la intención.');
  if (opts.showtooltip) lines.push('#showtooltip');
  if (opts.stopcasting) lines.push('/stopcasting');
  if (opts.startattack) lines.push('/startattack');
  if (opts.petattack) lines.push('/petattack');
  if (opts.cancelaura) {
    const aura = sanitizeAuraName(opts.cancelauraName);
    if (aura) lines.push('/cancelaura ' + aura); else warnings.push('/cancelaura sin nombre: línea omitida.');
  }
  const condParts = [];
  if (useMouseover) condParts.push('@mouseover');
  if (useHarm) condParts.push('harm');
  if (useHelp) condParts.push('help');
  if (opts.nodead) condParts.push('nodead');
  if (opts.exists) condParts.push('exists');
  if (opts.combat) condParts.push('combat');
  if (opts.nostance) condParts.push('nostance');
  const condStr = condParts.length ? '[' + condParts.join(',') + ']' : '';
  const mods = Array.isArray(opts.mods) ? opts.mods.filter(Boolean) : [];
  const names = seq.map(function (s) { return spellDisplayName(s, lang); }).filter(Boolean);
  if (!names.length) return { macro: '', warnings: ['No se resolvió el nombre de hechizos. [VERIFICAR]'], error: 'noname', charCount: 0, limit };
  if (opts.castsequence) {
    lines.push('/castsequence reset=target ' + (condStr ? condStr + ' ' : '') + names.join(', '));
    if (mods.length) warnings.push('Modificadores no aplicados a /castsequence.');
  } else if (mods.length) {
    // Rama condicional real por modificador
    // Si solo Shift: /cast [mod:shift] H1; H2
    // Si Shift+Ctrl: /cast [mod:shift] H1; [mod:ctrl] H2; H3
    const branches = mods.map(function (m, i) {
      const mc = condStr ? '[mod:' + m + ',' + condParts.join(',') + ']' : '[mod:' + m + ']';
      return mc + ' ' + names[Math.min(i, names.length - 1)];
    });
    const def = names[Math.min(mods.length, names.length - 1)];
    branches.push(condStr ? condStr + ' ' + def : def);
    lines.push('/cast ' + branches.join('; '));
  } else {
    names.forEach(function (n) { lines.push('/cast ' + (condStr ? condStr + ' ' : '') + n); });
  }
  const macro = lines.join('\n');
  const charCount = macro.length;
  if (charCount > limit) warnings.push('Excede ' + limit + ' caracteres (' + charCount + '). El cliente puede truncarlo.');
  if (opts.showtooltip && lines[0] !== '#showtooltip') warnings.push('#showtooltip debe ir primero.');
  if (((macro.match(/\[/g) || []).length) !== ((macro.match(/\]/g) || []).length)) warnings.push('Condicionales [ ] desbalanceadas. [VERIFICAR]');
  return { macro: macro, warnings: warnings, charCount: charCount, limit: limit, error: null };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { spellDisplayName, isHelpful, isHarmful, sanitizeAuraName, raceAllowsClass, validRacesForClass, buildMacro };
}

// ---------- UI helpers ----------
function showToast(msg, ms) {
  const el = document.getElementById('appToast'); if (!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('show'); }, ms || 2200);
}
function setStatus(text, cls) {
  const el = document.getElementById('macroStatus'); if (!el) return;
  el.textContent = text || ''; el.className = 'macro-status' + (cls ? ' ' + cls : '');
}
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
function renderWarnings(warnings, meta) {
  const el = document.getElementById('macroWarnings'); if (!el) return;
  const ws = (warnings || []).filter(Boolean);
  if (!ws.length && !(meta && meta.charCount)) { el.style.display = 'none'; el.innerHTML = ''; return; }
  let head = '';
  if (meta) {
    const over = meta.charCount > meta.limit;
    head = `<strong>Estado:</strong> ${meta.charCount}/${meta.limit} caracteres${over ? ' — <span class="err">excede límite típico</span>' : ' — OK'}. ${ws.length ? '' : 'Sin advertencias.'}`;
  }
  const list = ws.length ? `<ul>${ws.map(function (w) { return `<li>${escapeHtml(w)}</li>`; }).join('')}</ul>` : '';
  el.innerHTML = head + list; el.style.display = 'block';
}
function iconFallbackImg(img, icon) {
  img.onerror = function () { this.onerror = function () { this.onerror = null; this.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" rx="6" fill="#e8eef2"/><text x="12" y="16" font-size="10" text-anchor="middle" fill="#6e6e73">?</text></svg>'); }; this.src = (typeof DataService !== 'undefined' ? DataService.iconUrl(icon || 'inv_misc_questionmark') : 'https://wow.zamimg.com/images/wow/icons/small/' + (icon || 'inv_misc_questionmark') + '.jpg'); };
}
function uid() { return 's' + Math.random().toString(36).slice(2, 9); }

// ---------- Persistencia ----------
function persistState() {
  try {
    const data = { v: 1, cls: currentClass, race: currentRace, lvl: currentLevel, lang: macroLang, seq: sequence, cancelauraName: (document.getElementById('cancelauraName') || {}).value || '', mods: { shift: !!(document.getElementById('modShift')||{}).checked, ctrl: !!(document.getElementById('modCtrl')||{}).checked, alt: !!(document.getElementById('modAlt')||{}).checked }, opts: {} };
    (typeof MACRO_OPTIONS !== 'undefined' ? MACRO_OPTIONS : []).forEach(function (o) { const cb = document.getElementById('opt_' + o.id); if (cb) data.opts[o.id] = !!cb.checked; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}
function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return;
    const d = JSON.parse(raw); if (!d || d.v !== 1) return;
    macroLang = d.lang === 'en' ? 'en' : 'es';
    const ml = document.getElementById('macroLang'); if (ml) ml.value = macroLang;
    if (d.cls && CLASSES[d.cls]) { currentClass = d.cls; const cs = document.getElementById('classSelect'); if (cs) cs.value = d.cls; }
    updateRaceOptions();
    if (d.race && RACES[d.race] && raceAllowsClass(d.race, currentClass)) { currentRace = d.race; const rs = document.getElementById('raceSelect'); if (rs) rs.value = d.race; }
    currentLevel = Math.max(1, Math.min(60, parseInt(d.lvl, 10) || 60));
    const li = document.getElementById('levelInput'); if (li) li.value = currentLevel;
    if (Array.isArray(d.seq)) sequence = d.seq.filter(Boolean).map(function (s) { return Object.assign({ uid: uid() }, s); }).slice(0, 60);
    if (d.cancelauraName && document.getElementById('cancelauraName')) document.getElementById('cancelauraName').value = sanitizeAuraName(d.cancelauraName);
    if (d.mods) { if (document.getElementById('modShift')) document.getElementById('modShift').checked = !!d.mods.shift; if (document.getElementById('modCtrl')) document.getElementById('modCtrl').checked = !!d.mods.ctrl; if (document.getElementById('modAlt')) document.getElementById('modAlt').checked = !!d.mods.alt; }
    window.__restoreOpts = d.opts || null;
  } catch (e) {}
}

// ---------- Init / selects ----------
function initSelects() {
  const classSelect = document.getElementById('classSelect');
  const talentClassSelect = document.getElementById('talentClassSelect');
  if (classSelect) {
    classSelect.innerHTML = '<option value="">— Selecciona clase —</option>';
    Object.entries(CLASSES).forEach(function (kv) {
      const o = document.createElement('option');
      o.value = kv[0];
      const iconUrl = typeof DataService !== 'undefined' ? DataService.iconUrl(kv[1].icon) : '';
      o.innerHTML = '<img src="' + iconUrl + '" class="select-icon" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;border:1px solid rgba(0,0,0,.12);border-radius:4px;"> <strong>' + escapeHtml(kv[1].name) + '</strong> <span style="color:var(--muted-2);font-size:0.82em;">(' + escapeHtml(kv[1].nameEn) + ')</span>';
      classSelect.appendChild(o);
    });
  }
  if (talentClassSelect) {
    talentClassSelect.innerHTML = '<option value="">— Selecciona clase —</option>';
    Object.entries(CLASSES).forEach(function (kv) {
      const o = document.createElement('option');
      o.value = kv[0];
      const iconUrl = typeof DataService !== 'undefined' ? DataService.iconUrl(kv[1].icon) : '';
      o.innerHTML = '<img src="' + iconUrl + '" class="select-icon" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;border:1px solid rgba(0,0,0,.12);border-radius:4px;"> <strong>' + escapeHtml(kv[1].name) + '</strong> <span style="color:var(--muted-2);font-size:0.82em;">(' + escapeHtml(kv[1].nameEn) + ')</span>';
      talentClassSelect.appendChild(o);
    });
  }
}
async function onClassChange() {
  currentClass = document.getElementById('classSelect').value || null;
  if (currentRace && !raceAllowsClass(currentRace, currentClass)) currentRace = null;
  updateRaceOptions(); await updateSpellPool(); persistState();
}
async function onRaceChange() { currentRace = document.getElementById('raceSelect').value || null; await updateSpellPool(); persistState(); }
function onLevelChange() {
  currentLevel = Math.max(1, Math.min(60, parseInt(document.getElementById('levelInput').value, 10) || 60));
  document.getElementById('levelInput').value = currentLevel; updateSpellPool(); persistState();
}
function onMacroLangChange() { macroLang = (document.getElementById('macroLang') || {}).value === 'en' ? 'en' : 'es'; persistState(); }

async function updateRaceOptions() {
  const raceSelect = document.getElementById('raceSelect'); if (!raceSelect) return;
  const prev = currentRace;
  raceSelect.innerHTML = '<option value="">— Selecciona raza —</option>';
  if (!currentClass) { currentRace = null; return; }
  const allowed = validRacesForClass(currentClass);
  Object.entries(RACES).forEach(function (kv) {
    if (allowed.indexOf(kv[0]) === -1) return;
    const opt = document.createElement('option');
    opt.value = kv[0];
    const iconUrl = typeof DataService !== 'undefined' ? DataService.iconUrl(kv[1].icon) : '';
    opt.innerHTML = '<img src="' + iconUrl + '" class="select-icon" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;border:1px solid rgba(0,0,0,.12);border-radius:4px;"> <strong>' + escapeHtml(kv[1].name) + '</strong> <span style="color:var(--muted-2);font-size:0.82em;">(' + escapeHtml(kv[1].nameEn) + ')</span>';
    raceSelect.appendChild(opt);
  });
  if (prev && allowed.indexOf(prev) !== -1) { raceSelect.value = prev; currentRace = prev; }
  else { currentRace = null; raceSelect.value = ''; }
}

// ---------- Spell pool ----------
async function updateSpellPool() {
  const pool = document.getElementById('spellPool'); if (!pool) return;
  pool.innerHTML = '';
  const search = document.getElementById('spellSearch'); if (search) search.value = '';
  if (!currentClass) { allAbilitiesCache = []; pool.innerHTML = '<div class="empty-hint">Selecciona clase y raza para ver los hechizos disponibles.</div>'; return; }
  if (currentRace && !raceAllowsClass(currentRace, currentClass)) { allAbilitiesCache = []; pool.innerHTML = '<div class="empty-hint">Combinación raza/clase no válida para esta configuración. [VERIFICAR Forever]</div>'; return; }

  // Cargar hechizos desde DataService (API con caché)
  let spells = [];
  try {
    spells = await DataService.getSpells(currentClass, macroLang);
  } catch (e) {
    console.warn('Error cargando hechizos:', e);
    spells = (typeof SPELLS !== 'undefined' && SPELLS[currentClass]) ? SPELLS[currentClass] : [];
  }

  // Cargar raciales desde DataService
  let racials = [];
  if (currentRace) {
    try {
      racials = await DataService.getRacials(currentRace, macroLang);
    } catch (e) {
      console.warn('Error cargando raciales:', e);
      racials = (typeof RACIALS !== 'undefined' && RACIALS[currentRace]) ? RACIALS[currentRace] : [];
    }
  }

  allAbilitiesCache = [].concat(
    spells.map(function (s) { return Object.assign({}, s, { type: 'spell' }); }),
    racials.map(function (r) { return Object.assign({}, r, { type: 'racial' }); })
  ).filter(function (a) { return (a.level || 1) <= currentLevel; });
  renderSpellPool(allAbilitiesCache);
}
function _filterSpellPoolRaw() {
  const q = ((document.getElementById('spellSearch') || {}).value || '').toLowerCase().trim();
  const typeFilter = (document.getElementById('spellTypeFilter') || {}).value || 'all';
  if (!q && typeFilter === 'all') { renderSpellPool(allAbilitiesCache); return; }
  renderSpellPool(allAbilitiesCache.filter(function (a) {
    const matchText = !q || ((a.name || '') + ' ' + (a.nameEn || '')).toLowerCase().indexOf(q) !== -1;
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    return matchText && matchType;
  }));
}
const filterSpellPool = debounce(_filterSpellPoolRaw, 120);
function renderSpellPool(abilities) {
  const pool = document.getElementById('spellPool'); if (!pool) return;
  pool.innerHTML = '';
  if (!abilities || !abilities.length) { pool.innerHTML = '<div class="empty-hint">No hay hechizos disponibles para este nivel/filtro.</div>'; return; }
  abilities.forEach(function (ability) {
    const div = document.createElement('div'); div.className = 'spell-item'; div.draggable = true; div.tabIndex = 0;
    div.title = (ability.desc || '') + (/\[VERIFICAR/.test((ability.name||'')+' '+(ability.desc||'')) ? '' : '');
    const img = document.createElement('img'); img.alt = ability.name || ''; img.src = DataService ? DataService.iconUrl(ability.icon) : ('https://wow.zamimg.com/images/wow/icons/small/' + (ability.icon || 'inv_misc_questionmark') + '.jpg');
    iconFallbackImg(img, ability.icon || 'inv_misc_questionmark');
    const span = document.createElement('span'); span.textContent = ability.name || ability.nameEn || '?';
    if (/\[VERIFICAR/.test(ability.name || '')) span.title = 'Dato no verificado para Forever';
    const badge = document.createElement('small'); badge.style.color = 'var(--muted)'; badge.style.fontSize = '10px'; badge.textContent = 'Nv.' + (ability.level || 1);
    div.appendChild(img); div.appendChild(span); div.appendChild(badge);
    const payload = Object.assign({}, ability);
    div.addEventListener('dragstart', function (e) { _drag.spell = payload; _drag.seqFrom = null; e.dataTransfer.effectAllowed = 'copy'; try { e.dataTransfer.setData('text/plain', ability.name || ''); } catch (x) {} });
    div.addEventListener('dragend', function () { _drag.spell = null; });
    div.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sequence.push(Object.assign({ uid: uid() }, payload)); renderSequence(); persistState(); } });
    pool.appendChild(div);
  });
}

// ---------- Drag & Drop + reorder ----------
function onDragStart(e) { /* legacy hook; pool/slots bind own handlers */ }
function onDragOver(e) { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = _drag.seqFrom != null ? 'move' : 'copy'; const z = document.getElementById('sequenceZone'); if (z) z.classList.add('drag-over'); }
function onDragLeave(e) { const z = document.getElementById('sequenceZone'); if (z) z.classList.remove('drag-over'); }
function onDrop(e) {
  e.preventDefault();
  const z = document.getElementById('sequenceZone'); if (z) z.classList.remove('drag-over');
  if (_drag.seqFrom != null) { // move to end when dropped on zone
    const from = _drag.seqFrom; _drag.seqFrom = null; _drag.seqId = null;
    if (from >= 0 && from < sequence.length) { const it = sequence.splice(from, 1)[0]; sequence.push(it); renderSequence(); persistState(); }
    return;
  }
  if (!_drag.spell) return;
  sequence.push(Object.assign({ uid: uid() }, _drag.spell)); _drag.spell = null; renderSequence(); persistState();
}

function renderSequence() {
  const zone = document.getElementById('sequenceZone'); if (!zone) return;
  if (!sequence.length) { zone.innerHTML = '<div class="empty-hint">Arrastra hechizos aquí para construir tu macro.<br>El orden importa. Arrastra un slot para reordenar.</div>'; return; }
  zone.innerHTML = '';
  sequence.forEach(function (item, index) {
    const slot = document.createElement('div'); slot.className = 'sequence-slot'; slot.draggable = true; slot.tabIndex = 0;
    const idx = document.createElement('span'); idx.className = 'slot-index'; idx.textContent = (index + 1) + '.';
    const img = document.createElement('img'); img.alt = item.name || ''; img.src = DataService ? DataService.iconUrl(item.icon) : ('https://wow.zamimg.com/images/wow/icons/small/' + (item.icon || 'inv_misc_questionmark') + '.jpg'); iconFallbackImg(img, item.icon || 'inv_misc_questionmark');
    const name = document.createElement('span'); name.textContent = spellDisplayName(item, macroLang) || item.name || ''; name.style.fontSize = '13px';
    const removeBtn = document.createElement('button'); removeBtn.className = 'remove-btn'; removeBtn.type = 'button'; removeBtn.textContent = '✕'; removeBtn.title = 'Quitar';
    removeBtn.onclick = function (ev) { ev.stopPropagation(); sequence.splice(index, 1); renderSequence(); persistState(); };
    slot.appendChild(idx); slot.appendChild(img); slot.appendChild(name); slot.appendChild(removeBtn);
    slot.addEventListener('dragstart', function (e) { _drag.seqFrom = index; _drag.seqId = item.uid; _drag.spell = null; slot.classList.add('dragging'); if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', item.name || ''); } catch (x) {} } });
    slot.addEventListener('dragend', function () { slot.classList.remove('dragging'); zone.querySelectorAll('.drag-over-slot').forEach(function (n) { n.classList.remove('drag-over-slot'); }); _drag.seqFrom = null; _drag.seqId = null; });
    slot.addEventListener('dragover', function (e) { if (_drag.seqFrom == null) return; e.preventDefault(); e.stopPropagation(); slot.classList.add('drag-over-slot'); });
    slot.addEventListener('dragleave', function () { slot.classList.remove('drag-over-slot'); });
    slot.addEventListener('drop', function (e) {
      if (_drag.seqFrom == null) return;
      e.preventDefault(); e.stopPropagation(); slot.classList.remove('drag-over-slot');
      const from = _drag.seqFrom, to = index; _drag.seqFrom = null; _drag.seqId = null;
      if (from === to || from < 0 || to < 0 || from >= sequence.length) return;
      const it = sequence.splice(from, 1)[0]; sequence.splice(to, 0, it); renderSequence(); persistState();
    });
    slot.addEventListener('keydown', function (e) { if ((e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); sequence.splice(index, 1); renderSequence(); persistState(); } });
    zone.appendChild(slot);
  });
}

// ---------- Options ----------
function updateOptions() {
  const container = document.getElementById('macroOptions'); if (!container) return;
  container.innerHTML = '';
  const restore = window.__restoreOpts || null;
  (typeof MACRO_OPTIONS !== 'undefined' ? MACRO_OPTIONS : []).forEach(function (opt) {
    const div = document.createElement('div'); div.className = 'option-item'; div.tabIndex = 0;
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.id = 'opt_' + opt.id;
    checkbox.checked = restore && Object.prototype.hasOwnProperty.call(restore, opt.id) ? !!restore[opt.id] : !!opt.default;
    checkbox.addEventListener('change', function () { if (opt.id === 'cancelaura') toggleCancelauraRow(); persistState(); });
    const labelDiv = document.createElement('div');
    const label = document.createElement('div'); label.className = 'option-label'; label.textContent = opt.label;
    const desc = document.createElement('div'); desc.className = 'option-desc'; desc.textContent = (opt.desc || '').slice(0, 110) + ((opt.desc || '').length > 110 ? '…' : '');
    const help = document.createElement('div'); help.className = 'option-help'; help.textContent = opt.desc || '';
    labelDiv.appendChild(label); labelDiv.appendChild(desc); labelDiv.appendChild(help);
    div.appendChild(checkbox); div.appendChild(labelDiv);
    div.addEventListener('click', function (e) { if (e.target === checkbox) return; div.classList.toggle('show-help'); });
    container.appendChild(div);
  });
  toggleCancelauraRow();
}
function toggleCancelauraRow() {
  const row = document.getElementById('cancelauraRow'); const cb = document.getElementById('opt_cancelaura');
  if (row) row.style.display = (cb && cb.checked) ? 'flex' : 'none';
}
function collectOpts() {
  const mods = [];
  if (document.getElementById('modShift') && document.getElementById('modShift').checked) mods.push('shift');
  if (document.getElementById('modCtrl') && document.getElementById('modCtrl').checked) mods.push('ctrl');
  if (document.getElementById('modAlt') && document.getElementById('modAlt').checked) mods.push('alt');
  function on(id) { const e = document.getElementById('opt_' + id); return !!(e && e.checked); }
  return {
    showtooltip: on('showtooltip'), startattack: on('startattack'), petattack: on('petattack'), stopcasting: on('stopcasting'),
    cancelaura: on('cancelaura'), cancelauraName: sanitizeAuraName((document.getElementById('cancelauraName') || {}).value || ''),
    castsequence: on('castsequence'), mouseover: on('mouseover'), harm: on('harm'), help: on('help'), nodead: on('nodead'), exists: on('exists'), combat: on('combat'), nostance: on('nostance'),
    mod: on('mod'), mods: on('mod') ? mods : [], lang: macroLang
  };
}

// ---------- Generate / Copy ----------
function generateMacro() {
  const opts = collectOpts();
  const res = buildMacro(sequence, opts);
  const outEl = document.getElementById('macroOutput');
  const copyBtn = document.getElementById('copyBtn');
  if (res.error === 'empty') {
    window.__lastMacroText = '';
    if (outEl) outEl.textContent = '⚠️ Añade al menos un hechizo a la secuencia.';
    if (copyBtn) copyBtn.style.display = 'none';
    renderWarnings(res.warnings, { charCount: 0, limit: res.limit });
    setStatus('Sin macro', 'warn'); persistState(); return;
  }
  window.__lastMacroText = res.macro; // SOLO macro, nunca advertencias
  if (outEl) outEl.textContent = res.macro;
  if (copyBtn) copyBtn.style.display = 'inline-block';
  renderWarnings(res.warnings, { charCount: res.charCount, limit: res.limit });
  const ok = res.charCount <= res.limit && !res.warnings.some(function (w) { return /excede|desbalance/.test(w); });
  setStatus(ok ? 'Macro listo · ' + res.charCount + '/' + res.limit : 'Macro generado con advertencias · ' + res.charCount + '/' + res.limit, ok ? 'ok' : 'warn');
  persistState();
}

function getSafeMacroText() {
  let text = (typeof window.__lastMacroText === 'string' && window.__lastMacroText) ? window.__lastMacroText : '';
  if (!text) {
    const raw = ((document.getElementById('macroOutput') || {}).textContent || '');
    const cut = raw.indexOf('\n# Advertencias:');
    text = (cut !== -1 ? raw.slice(0, cut) : raw);
  }
  const cut2 = text.indexOf('\n# Advertencias:'); if (cut2 !== -1) text = text.slice(0, cut2);
  text = text.replace(/\n# Advertencias:[\s\S]*$/m, '').trimEnd();
  if (/^⚠️/.test(text)) return '';
  return text;
}

function copyMacro() {
  const text = getSafeMacroText();
  const btn = document.getElementById('copyBtn');
  if (!text) { showToast('Genera un macro válido antes de copiar.'); setStatus('Nada que copiar', 'warn'); return; }
  const done = function () { if (btn) { const o = btn.textContent; btn.textContent = '✅ ¡Copiado!'; setTimeout(function () { btn.textContent = o; }, 1500); } showToast('Macro copiado (solo comandos).'); setStatus('Copiado al portapapeles', 'ok'); };
  const fallback = function () {
    try {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy'); document.body.removeChild(ta);
      if (ok) done(); else { showToast('No se pudo copiar automáticamente. Selecciona el macro y copia manualmente.'); setStatus('Copia manual requerida', 'warn'); }
    } catch (e) { showToast('No se pudo copiar. Selecciona el macro y copia manualmente.'); setStatus('Copia manual requerida', 'warn'); }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done).catch(fallback); } else fallback();
}

// ---------- Boot hook (called from app.js DOMContentLoaded) ----------
function initMacroUI() {
  restoreState();
  initSelects();
  // re-apply restored class/race after selects exist
  try {
    const raw = localStorage.getItem(STORAGE_KEY); const d = raw ? JSON.parse(raw) : null;
    if (d && d.v === 1) {
      if (d.cls && CLASSES[d.cls]) { currentClass = d.cls; const cs = document.getElementById('classSelect'); if (cs) cs.value = d.cls; }
      updateRaceOptions();
      if (d.race && raceAllowsClass(d.race, currentClass)) { currentRace = d.race; const rs = document.getElementById('raceSelect'); if (rs) rs.value = d.race; }
      if (d.opts) window.__restoreOpts = d.opts;
    }
  } catch (e) {}
  updateOptions();
  updateSpellPool();
  renderSequence();
  toggleCancelauraRow();
  ['modShift','modCtrl','modAlt'].forEach(function (id) { const e = document.getElementById(id); if (e) e.addEventListener('change', persistState); });
  const ca = document.getElementById('cancelauraName'); if (ca) ca.addEventListener('input', persistState);
}
