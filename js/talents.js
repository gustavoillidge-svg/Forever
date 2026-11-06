// Talentos: 9 clases x 3 árboles. Estructura funcional; valores/nombres [VERIFICAR Forever] (wowhead.com/forever/talent-calc, seemeta, foreverdb).
const TALENT_DATA = {
  warrior: { trees: [
    { name: 'Árbol 1', nameEn: 'Tree 1', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever] Confirmar en wowhead.com/forever/talent-calc / seemeta / foreverdb.', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 2', nameEn: 'Tree 2', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 3', nameEn: 'Tree 3', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]}
  ]},
  paladin: { trees: [
    { name: 'Árbol 1', nameEn: 'Tree 1', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever] Confirmar en wowhead.com/forever/talent-calc / seemeta / foreverdb.', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 2', nameEn: 'Tree 2', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 3', nameEn: 'Tree 3', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]}
  ]},
  hunter: { trees: [
    { name: 'Árbol 1', nameEn: 'Tree 1', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever] Confirmar en wowhead.com/forever/talent-calc / seemeta / foreverdb.', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 2', nameEn: 'Tree 2', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 3', nameEn: 'Tree 3', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]}
  ]},
  rogue: { trees: [
    { name: 'Árbol 1', nameEn: 'Tree 1', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever] Confirmar en wowhead.com/forever/talent-calc / seemeta / foreverdb.', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 2', nameEn: 'Tree 2', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 3', nameEn: 'Tree 3', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]}
  ]},
  priest: { trees: [
    { name: 'Árbol 1', nameEn: 'Tree 1', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever] Confirmar en wowhead.com/forever/talent-calc / seemeta / foreverdb.', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 2', nameEn: 'Tree 2', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 3', nameEn: 'Tree 3', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]}
  ]},
  shaman: { trees: [
    { name: 'Árbol 1', nameEn: 'Tree 1', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever] Confirmar en wowhead.com/forever/talent-calc / seemeta / foreverdb.', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 2', nameEn: 'Tree 2', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 3', nameEn: 'Tree 3', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]}
  ]},
  mage: { trees: [
    { name: 'Árbol 1', nameEn: 'Tree 1', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever] Confirmar en wowhead.com/forever/talent-calc / seemeta / foreverdb.', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 2', nameEn: 'Tree 2', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 3', nameEn: 'Tree 3', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]}
  ]},
  warlock: { trees: [
    { name: 'Árbol 1', nameEn: 'Tree 1', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever] Confirmar en wowhead.com/forever/talent-calc / seemeta / foreverdb.', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 2', nameEn: 'Tree 2', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 3', nameEn: 'Tree 3', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]}
  ]},
  druid: { trees: [
    { name: 'Árbol 1', nameEn: 'Tree 1', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever] Confirmar en wowhead.com/forever/talent-calc / seemeta / foreverdb.', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 2', nameEn: 'Tree 2', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]},
    { name: 'Árbol 3', nameEn: 'Tree 3', talents: [
      { name: 'Talento base', nameEn: 'Base Talent', maxRank: 5, desc: '[VERIFICAR Forever]', benefit: 'Bonificación progresiva.' },
      { name: 'Talento intermedio', nameEn: 'Mid Talent', maxRank: 3, desc: '[VERIFICAR Forever]', benefit: 'Mejora de especialización.' },
      { name: 'Talento clave', nameEn: 'Key Talent', maxRank: 1, desc: '[VERIFICAR Forever]', benefit: 'Habilidad/bono clave.' }
    ]}
  ]}
};
let talentState = {};
let talentPointsSpent = 0;
function onTalentClassChange() {
  const classKey = document.getElementById('talentClassSelect').value;
  if (!classKey || typeof TALENT_DATA === 'undefined' || !TALENT_DATA[classKey]) {
    document.getElementById('talentTrees').innerHTML = '<div class="empty-hint" style="width:100%;">Datos de talentos no disponibles para esta clase. [VERIFICAR Forever]</div>';
    return;
  }
  talentState = {}; talentPointsSpent = 0; renderTalentTrees(classKey); updatePointsRemaining();
}
function onTalentLevelChange() { updatePointsRemaining(); }
function updatePointsRemaining() {
  const level = parseInt(document.getElementById('talentLevelInput').value) || 60;
  const maxPoints = Math.max(0, Math.min(51, level - 9));
  document.getElementById('pointsRemaining').textContent = `Puntos disponibles: ${maxPoints - talentPointsSpent} / ${maxPoints}`;
}
function renderTalentTrees(classKey) {
  const data = TALENT_DATA[classKey]; if (!data) return;
  const container = document.getElementById('talentTrees'); container.innerHTML = '';
  data.trees.forEach((tree, treeIdx) => {
    const treeDiv = document.createElement('div'); treeDiv.className = 'talent-tree';
    const h4 = document.createElement('h4'); h4.textContent = `${tree.name} (${tree.nameEn})`; treeDiv.appendChild(h4);
    tree.talents.forEach((talent, talentIdx) => {
      const row = document.createElement('div'); row.className = 'talent-row';
      const node = document.createElement('div'); node.className = 'talent-node';
      node.dataset.tree = treeIdx; node.dataset.talent = talentIdx; node.dataset.class = classKey;
      const currentRank = talentState[classKey]?.[treeIdx]?.[talentIdx] || 0;
      if (currentRank > 0) node.classList.add(`rank-${Math.min(currentRank, 3)}`);
      node.textContent = talent.name.split(' ').map(w => w[0]).join('').substring(0, 2);
      if (currentRank > 0) { const badge = document.createElement('span'); badge.className = 'rank-badge'; badge.textContent = `${currentRank}/${talent.maxRank}`; node.appendChild(badge); }
      node.addEventListener('mouseenter', () => showTalentInfo(talent, currentRank));
      node.addEventListener('click', () => addTalentPoint(classKey, treeIdx, talentIdx, talent));
      row.appendChild(node); treeDiv.appendChild(row);
    });
    container.appendChild(treeDiv);
  });
}
function addTalentPoint(classKey, treeIdx, talentIdx, talent) {
  const level = parseInt(document.getElementById('talentLevelInput').value) || 60;
  const maxPoints = Math.max(0, Math.min(51, level - 9));
  if (!talentState[classKey]) talentState[classKey] = {};
  if (!talentState[classKey][treeIdx]) talentState[classKey][treeIdx] = {};
  const currentRank = talentState[classKey][treeIdx][talentIdx] || 0;
  if (currentRank >= talent.maxRank) { talentState[classKey][treeIdx][talentIdx] = 0; talentPointsSpent = Math.max(0, talentPointsSpent - 1); }
  else {
    if (talentPointsSpent >= maxPoints) { alert('No tienes más puntos de talento disponibles. Sube de nivel para obtener más.'); return; }
    talentState[classKey][treeIdx][talentIdx] = currentRank + 1; talentPointsSpent++;
  }
  renderTalentTrees(classKey); updatePointsRemaining(); showTalentInfo(talent, talentState[classKey][treeIdx][talentIdx] || 0);
}
function showTalentInfo(talent, currentRank) {
  document.getElementById('talentInfoPanel').innerHTML = `<h4>${talent.name} <small style="color:var(--text-muted);font-size:13px;">(${talent.nameEn})</small></h4><div class="talent-desc">${talent.desc}</div><div class="talent-benefit"><strong>Beneficio:</strong> ${talent.benefit}</div><div style="font-size:12px;color:var(--text-muted);margin-top:10px;">Rango actual: ${currentRank} / ${talent.maxRank}</div>`;
}
