// ==================== LÓGICA DEL GENERADOR DE MACROS ====================

let currentClass = null;
let currentRace = null;
let currentLevel = 60;
let sequence = []; // Array de { name, nameEn, icon, level, type }

// Inicializar selects
function initSelects() {
  const classSelect = document.getElementById('classSelect');
  const talentClassSelect = document.getElementById('talentClassSelect');
  
  Object.entries(CLASSES).forEach(([key, val]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = `${val.name} (${val.nameEn})`;
    classSelect.appendChild(opt);
    
    const opt2 = document.createElement('option');
    opt2.value = key;
    opt2.textContent = `${val.name} (${val.nameEn})`;
    talentClassSelect.appendChild(opt2);
  });
}

function onClassChange() {
  currentClass = document.getElementById('classSelect').value;
  updateRaceOptions();
  updateSpellPool();
  updateOptions();
}

function onRaceChange() {
  currentRace = document.getElementById('raceSelect').value;
  updateSpellPool();
}

function onLevelChange() {
  currentLevel = parseInt(document.getElementById('levelInput').value) || 60;
  updateSpellPool();
}

function updateRaceOptions() {
  const raceSelect = document.getElementById('raceSelect');
  raceSelect.innerHTML = '<option value="">— Selecciona raza —</option>';
  
  if (!currentClass) return;
  
  // Todas las razas disponibles para simplificar (en Classic hay restricciones, pero Forever puede variar)
  Object.entries(RACES).forEach(([key, val]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = `${val.name} (${val.nameEn})`;
    raceSelect.appendChild(opt);
  });
}

let allAbilitiesCache = [];

function updateSpellPool() {
  const pool = document.getElementById('spellPool');
  pool.innerHTML = '';
  const search = document.getElementById('spellSearch');
  if (search) search.value = '';

  if (!currentClass) {
    allAbilitiesCache = [];
    pool.innerHTML = '<div class="empty-hint">Selecciona clase y raza para ver los hechizos disponibles.</div>';
    return;
  }

  const spells = (typeof SPELLS !== 'undefined' && SPELLS[currentClass]) ? SPELLS[currentClass] : [];
  const racials = (typeof RACIALS !== 'undefined' && currentRace && RACIALS[currentRace]) ? RACIALS[currentRace] : [];
  const extra = (typeof RACIALS !== 'undefined' && currentRace && RACIALS[currentRace + '_extra']) ? RACIALS[currentRace + '_extra'] : [];

  allAbilitiesCache = [
    ...spells.map(s => ({ ...s, type: 'spell' })),
    ...racials.map(r => ({ ...r, type: 'racial' })),
    ...extra.map(r => ({ ...r, type: 'racial' }))
  ].filter(a => a.level <= currentLevel);

  renderSpellPool(allAbilitiesCache);
}

function filterSpellPool() {
  const q = (document.getElementById('spellSearch')?.value || '').toLowerCase().trim();
  if (!q) { renderSpellPool(allAbilitiesCache); return; }
  renderSpellPool(allAbilitiesCache.filter(a => (a.name + ' ' + (a.nameEn || '')).toLowerCase().includes(q)));
}

function renderSpellPool(abilities) {
  const pool = document.getElementById('spellPool');
  pool.innerHTML = '';
  if (!abilities || abilities.length === 0) {
    pool.innerHTML = '<div class="empty-hint">No hay hechizos disponibles para este nivel/filtro.</div>';
    return;
  }
  abilities.forEach(ability => {
    const div = document.createElement('div');
    div.className = 'spell-item';
    div.draggable = true;
    div.dataset.name = ability.name;
    div.dataset.nameEn = ability.nameEn || ability.name;
    div.dataset.icon = ability.icon || '';
    div.dataset.level = ability.level || 1;
    div.dataset.type = ability.type || 'spell';
    div.dataset.role = ability.role || '';
    div.dataset.desc = ability.desc || '';

    const img = document.createElement('img');
    img.src = `https://wow.zamimg.com/images/wow/icons/small/${ability.icon}.jpg`;
    img.alt = ability.name;
    img.onerror = function () {
      this.onerror = null;
      this.src = `assets/icons/small/${ability.icon}.jpg`;
      this.onerror = function () { this.style.display = 'none'; };
    };

    const span = document.createElement('span');
    span.textContent = ability.name;
    const levelBadge = document.createElement('small');
    levelBadge.style.color = 'var(--text-muted)';
    levelBadge.style.fontSize = '10px';
    levelBadge.textContent = `Nv.${ability.level}`;
    div.appendChild(img);
    div.appendChild(span);
    div.appendChild(levelBadge);
    div.addEventListener('dragstart', onDragStart);
    pool.appendChild(div);
  });
}

function updateOptions() {
  const container = document.getElementById('macroOptions');
  container.innerHTML = '';
  
  MACRO_OPTIONS.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'option-item';
    div.dataset.tooltip = opt.desc;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `opt_${opt.id}`;
    checkbox.checked = opt.default;
    
    const labelDiv = document.createElement('div');
    const label = document.createElement('div');
    label.className = 'option-label';
    label.textContent = opt.label;
    
    const desc = document.createElement('div');
    desc.className = 'option-desc';
    desc.textContent = opt.desc.substring(0, 80) + (opt.desc.length > 80 ? '...' : '');
    
    labelDiv.appendChild(label);
    labelDiv.appendChild(desc);
    
    div.appendChild(checkbox);
    div.appendChild(labelDiv);
    
    container.appendChild(div);
  });
}

// Drag & Drop
let draggedItem = null;

function onDragStart(e) {
  draggedItem = {
    name: e.target.dataset.name,
    nameEn: e.target.dataset.nameEn,
    icon: e.target.dataset.icon,
    level: parseInt(e.target.dataset.level),
    type: e.target.dataset.type,
    role: e.target.dataset.role || '',
    desc: e.target.dataset.desc || ''
  };
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/plain', e.target.dataset.name);
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  document.getElementById('sequenceZone').classList.add('drag-over');
}

function onDragLeave(e) {
  document.getElementById('sequenceZone').classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  document.getElementById('sequenceZone').classList.remove('drag-over');
  if (!draggedItem) return;
  sequence.push({ ...draggedItem });
  renderSequence();
  draggedItem = null;
}

function renderSequence() {
  const zone = document.getElementById('sequenceZone');
  if (sequence.length === 0) {
    zone.innerHTML = '<div class="empty-hint">Arrastra hechizos aquí para construir tu macro.<br>El orden importa: el primero se ejecutará primero.</div>';
    return;
  }
  zone.innerHTML = '';
  sequence.forEach((item, index) => {
    const slot = document.createElement('div');
    slot.className = 'sequence-slot';
    slot.draggable = true;
    const idx = document.createElement('span');
    idx.className = 'slot-index';
    idx.textContent = `${index + 1}.`;
    const img = document.createElement('img');
    img.src = `https://wow.zamimg.com/images/wow/icons/small/${item.icon}.jpg`;
    img.onerror = function () {
      this.onerror = null;
      this.src = `assets/icons/small/${item.icon}.jpg`;
      this.onerror = function () { this.style.display = 'none'; };
    };
    const name = document.createElement('span');
    name.textContent = item.name;
    name.style.fontSize = '13px';
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '✕';
    removeBtn.onclick = () => { sequence.splice(index, 1); renderSequence(); };
    slot.appendChild(idx);
    slot.appendChild(img);
    slot.appendChild(name);
    slot.appendChild(removeBtn);
    zone.appendChild(slot);
  });
}

function isHelpful(ability) {
  if (!ability) return false;
  if (ability.role === 'heal' || ability.role === 'buff') return true;
  const t = `${ability.name} ${ability.nameEn} ${ability.desc || ''}`.toLower();
  return /heal|curaci|bendici|blessing|renew|sanaci|light|shield|resur|fortitude|mark|rejuven|regrowth|aura|salva|protecci/.test(t);
}
function isHarmful(ability) {
  if (!ability) return false;
  if (ability.role === 'damage' || ability.role === 'debuff') return true;
  const t = `${ability.name} ${ability.nameEn} ${ability.desc || ''}`.toLower();
  return /golpe|strike|smite|bolt|fire|frost|shadow|ejecut|rend|mortal|wrath|shot|sting|sinister|evisc|curse|drain|doom|fear/.test(t);
}

function generateMacro() {
  if (sequence.length === 0) {
    document.getElementById('macroOutput').textContent = '⚠️ Añade al menos un hechizo a la secuencia.';
    window.__lastMacroText = '';
    document.getElementById('copyBtn').style.display = 'none';
    return;
  }

  const lines = [];
  const warnings = [];
  const first = sequence[0];

  let useHelp = !!document.getElementById('opt_help')?.checked;
  let useHarm = !!document.getElementById('opt_harm')?.checked;
  const useMouseover = !!document.getElementById('opt_mouseover')?.checked;
  const useNodead = !!document.getElementById('opt_nodead')?.checked;
  const useExists = !!document.getElementById('opt_exists')?.checked;
  const useCombat = !!document.getElementById('opt_combat')?.checked;

  if (useHelp && isHarmful(first) && !isHelpful(first)) {
    warnings.push('[help] omitido: el primer hechizo parece de daño/hostil.');
    useHelp = false;
  }
  if (useHarm && isHelpful(first) && !isHarmful(first)) {
    warnings.push('[harm] omitido: el primer hechizo parece de curación/buff/amistoso.');
    useHarm = false;
  }
  if (useMouseover && !useHelp && !useHarm) {
    warnings.push('[@mouseover] sin [help]/[harm]: puede fallar en objetivos no válidos; añade una condición de objetivo.');
  }

  if (document.getElementById('opt_showtooltip')?.checked) lines.push('#showtooltip');
  if (document.getElementById('opt_stopcasting')?.checked) lines.push('/stopcasting');
  if (document.getElementById('opt_startattack')?.checked) lines.push('/startattack');
  if (document.getElementById('opt_petattack')?.checked) lines.push('/petattack');
  if (document.getElementById('opt_cancelaura')?.checked) {
    const auraName = prompt('Nombre del aura a cancelar (ej: Bloque de Hielo):', 'Bloque de Hielo');
    if (auraName) lines.push(`/cancelaura ${auraName}`);
  }

  const condParts = [];
  if (useMouseover) condParts.push('@mouseover');
  if (useHarm) condParts.push('harm');
  if (useHelp) condParts.push('help');
  if (useNodead) condParts.push('nodead');
  if (useExists) condParts.push('exists');
  if (useCombat) condParts.push('combat');
  const condStr = condParts.length ? `[${condParts.join(',')}]` : '';

  const mods = [];
  if (document.getElementById('modShift')?.checked) mods.push('shift');
  if (document.getElementById('modCtrl')?.checked) mods.push('ctrl');
  if (document.getElementById('modAlt')?.checked) mods.push('alt');
  const useCastsequence = !!document.getElementById('opt_castsequence')?.checked;

  if (useCastsequence) {
    const spellNames = sequence.map(s => s.name).join(', ');
    lines.push(`/castsequence reset=target ${condStr ? condStr + ' ' : ''}${spellNames}`);
    if (mods.length) warnings.push('Modificadores no aplicados a /castsequence (la secuencia ya usa todos los hechizos).');
  } else if (mods.length) {
    // Ramas condicionales reales: [mod:X] h1; [mod:Y] h2; hDefault
    const modConds = mods.map(m => condStr ? `[mod:${m},${condParts.join(',')}]` : `[mod:${m}]`);
    const fallbackCond = condStr || '';
    const branches = [];
    modConds.forEach((mc, i) => {
      const spell = sequence[Math.min(i, sequence.length - 1)].name;
      branches.push(`${mc} ${spell}`);
    });
    const defaultSpell = sequence[Math.min(mods.length, sequence.length - 1)].name;
    branches.push(fallbackCond ? `${fallbackCond} ${defaultSpell}` : defaultSpell);
    lines.push(`/cast ${branches.join('; ')}`);
  } else {
    sequence.forEach(spell => {
      lines.push(`/cast ${condStr ? condStr + ' ' : ''}${spell.name}`);
    });
  }

  const macroText = lines.join('\n');
  window.__lastMacroText = macroText; // solo macro (sin advertencias) para copiar
  const out = warnings.length
    ? macroText + '\n\n# Advertencias:\n' + warnings.map(w => '# - ' + w).join('\n')
    : macroText;
  document.getElementById('macroOutput').textContent = out;
  document.getElementById('copyBtn').style.display = 'inline-block';
}

function copyMacro() {
  let text = (typeof window.__lastMacroText === 'string') ? window.__lastMacroText : document.getElementById('macroOutput').textContent;
  // Defensa: nunca copiar el bloque de advertencias; conservar #showtooltip y líneas válidas.
  const cut = text.indexOf('\n# Advertencias:');
  if (cut !== -1) text = text.slice(0, cut);
  text = text.trimEnd();
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    const original = btn.textContent;
    btn.textContent = '✅ ¡Copiado!';
    setTimeout(() => btn.textContent = original, 1500);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    alert('Macro copiada al portapapeles.');
  });
}

