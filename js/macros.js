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

function updateSpellPool() {
  const pool = document.getElementById('spellPool');
  pool.innerHTML = '';
  
  if (!currentClass) {
    pool.innerHTML = '<div class="empty-hint">Selecciona clase y raza para ver los hechizos disponibles.</div>';
    return;
  }
  
  const spells = SPELLS[currentClass] || [];
  const racials = currentRace ? (RACIALS[currentRace] || []) : [];
  
  // Combinar y filtrar por nivel
  const allAbilities = [
    ...spells.map(s => ({ ...s, type: 'spell' })),
    ...racials.map(r => ({ ...r, type: 'racial' }))
  ].filter(a => a.level <= currentLevel);
  
  if (allAbilities.length === 0) {
    pool.innerHTML = '<div class="empty-hint">No hay hechizos disponibles para este nivel.</div>';
    return;
  }
  
  allAbilities.forEach(ability => {
    const div = document.createElement('div');
    div.className = 'spell-item';
    div.draggable = true;
    div.dataset.name = ability.name;
    div.dataset.nameEn = ability.nameEn;
    div.dataset.icon = ability.icon;
    div.dataset.level = ability.level;
    div.dataset.type = ability.type;
    
    // Icono (usando Wowhead CDN con el nombre del icono)
    const img = document.createElement('img');
    img.src = `https://wow.zamimg.com/images/wow/icons/small/${ability.icon}.jpg`;
    img.alt = ability.name;
    img.onerror = function() { this.style.display = 'none'; };
    
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
    type: e.target.dataset.type
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
    img.onerror = function() { this.style.display = 'none'; };
    
    const name = document.createElement('span');
    name.textContent = item.name;
    name.style.fontSize = '13px';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '✕';
    removeBtn.onclick = () => {
      sequence.splice(index, 1);
      renderSequence();
    };
    
    slot.appendChild(idx);
    slot.appendChild(img);
    slot.appendChild(name);
    slot.appendChild(removeBtn);
    
    zone.appendChild(slot);
  });
}

function generateMacro() {
  if (sequence.length === 0) {
    document.getElementById('macroOutput').textContent = '⚠️ Añade al menos un hechizo a la secuencia.';
    return;
  }
  
  const lines = [];
  
  // #showtooltip
  if (document.getElementById('opt_showtooltip')?.checked) {
    lines.push('#showtooltip');
  }
  
  // /startattack
  if (document.getElementById('opt_startattack')?.checked) {
    lines.push('/startattack');
  }
  
  // /petattack
  if (document.getElementById('opt_petattack')?.checked) {
    lines.push('/petattack');
  }
  
  // /stopcasting
  if (document.getElementById('opt_stopcasting')?.checked) {
    lines.push('/stopcasting');
  }
  
  // /cancelaura
  if (document.getElementById('opt_cancelaura')?.checked) {
    const auraName = prompt('Nombre del aura a cancelar (ej: Bloque de Hielo):', 'Bloque de Hielo');
    if (auraName) {
      lines.push(`/cancelaura ${auraName}`);
    }
  }
  
  // Construir condiciones
  const conditions = [];
  
  if (document.getElementById('opt_mouseover')?.checked) conditions.push('@mouseover');
  if (document.getElementById('opt_harm')?.checked) conditions.push('harm');
  if (document.getElementById('opt_help')?.checked) conditions.push('help');
  if (document.getElementById('opt_nodead')?.checked) conditions.push('nodead');
  if (document.getElementById('opt_exists')?.checked) conditions.push('exists');
  if (document.getElementById('opt_combat')?.checked) conditions.push('combat');
  
  const conditionStr = conditions.length > 0 ? `[${conditions.join(',')}] ` : '';
  
  // Verificar modificadores
  const modShift = document.getElementById('modShift')?.checked;
  const modCtrl = document.getElementById('modCtrl')?.checked;
  const modAlt = document.getElementById('modAlt')?.checked;
  
  const useCastsequence = document.getElementById('opt_castsequence')?.checked;
  
  if (useCastsequence) {
    // Usar /castsequence
    const spellNames = sequence.map(s => s.name).join(', ');
    lines.push(`/castsequence reset=target ${conditionStr}${spellNames}`);
  } else {
    // Usar /cast normales (prioridad de bloques)
    sequence.forEach((spell, i) => {
      if (i === 0 && conditionStr) {
        lines.push(`/cast ${conditionStr}${spell.name}`);
      } else if (i === 0 && modShift) {
        lines.push(`/cast [mod:shift] ${spell.name}`);
      } else {
        lines.push(`/cast ${spell.name}`);
      }
    });
  }
  
  const macroText = lines.join('\n');
  document.getElementById('macroOutput').textContent = macroText;
  document.getElementById('copyBtn').style.display = 'inline-block';
}

function copyMacro() {
  const text = document.getElementById('macroOutput').textContent;
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

