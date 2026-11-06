// Talentos: carga desde DataService (Forever News API) con fallback embebido.
// 9 clases x 3 árboles, hasta 51 puntos, tooltips por talento.
let talentState = {};
let talentPointsSpent = 0;
let currentTalentClass = null;
let talentDataCache = {}; // classKey -> { trees: [...] }

async function loadTalents(classKey) {
  if (talentDataCache[classKey]) return talentDataCache[classKey];
  let data;
  try {
    data = await DataService.getTalents(classKey);
  } catch (e) {
    console.warn('Error cargando talentos API:', e);
    data = EMBEDDED_TALENTS[classKey] || { trees: [] };
  }
  if (!data || !data.trees || data.trees.length === 0) {
    data = EMBEDDED_TALENTS[classKey] || { trees: [] };
  }
  talentDataCache[classKey] = data;
  return data;
}

function onTalentLevelChange() { updatePointsRemaining(); }

function updatePointsRemaining() {
  const level = parseInt(document.getElementById('talentLevelInput').value) || 60;
  const maxPoints = Math.max(0, Math.min(51, level - 9));
  const el = document.getElementById('pointsRemaining');
  if (el) el.textContent = `Puntos disponibles: ${maxPoints - talentPointsSpent} / ${maxPoints}`;
}

async function onTalentClassChange() {
  const classKey = document.getElementById('talentClassSelect').value;
  currentTalentClass = classKey || null;
  const container = document.getElementById('talentTrees');
  const infoPanel = document.getElementById('talentInfoPanel');
  if (!classKey) {
    container.innerHTML = '<div class="empty-hint" style="width:100%;">Selecciona una clase para ver los árboles de talentos.</div>';
    if (infoPanel) infoPanel.innerHTML = '<h4>Información del Talento</h4><div class="talent-desc">Selecciona una clase y un talento.</div>';
    return;
  }
  container.innerHTML = '<div class="empty-hint" style="width:100%;">Cargando talentos...</div>';
  talentState = {}; talentPointsSpent = 0;
  try {
    const data = await loadTalents(classKey);
    renderTalentTrees(classKey, data);
    updatePointsRemaining();
  } catch (e) {
    console.error('Error renderizando talentos:', e);
    container.innerHTML = '<div class="empty-hint" style="width:100%;">Error cargando talentos. [VERIFICAR Forever]</div>';
  }
}

function renderTalentTrees(classKey, data) {
  const container = document.getElementById('talentTrees'); if (!container) return;
  container.innerHTML = '';
  if (!data || !data.trees || !data.trees.length) {
    container.innerHTML = '<div class="empty-hint" style="width:100%;">No hay datos de talentos para esta clase. [VERIFICAR Forever]</div>';
    return;
  }
  data.trees.forEach((tree, treeIdx) => {
    const treeDiv = document.createElement('div'); treeDiv.className = 'talent-tree';
    const h4 = document.createElement('h4'); h4.textContent = `${tree.name} (${tree.nameEn})`; treeDiv.appendChild(h4);
    tree.talents.forEach((talent, talentIdx) => {
      const row = document.createElement('div'); row.className = 'talent-row';
      const node = document.createElement('div'); node.className = 'talent-node';
      node.dataset.tree = treeIdx; node.dataset.talent = talentIdx; node.dataset.class = classKey;
      const currentRank = (talentState[classKey] && talentState[classKey][treeIdx] && talentState[classKey][treeIdx][talentIdx]) || 0;
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
  if (currentRank >= talent.maxRank) {
    talentState[classKey][treeIdx][talentIdx] = 0; talentPointsSpent = Math.max(0, talentPointsSpent - 1);
  } else {
    if (talentPointsSpent >= maxPoints) { alert('No tienes más puntos de talento disponibles. Sube de nivel para obtener más.'); return; }
    talentState[classKey][treeIdx][talentIdx] = currentRank + 1; talentPointsSpent++;
  }
  const data = talentDataCache[classKey] || EMBEDDED_TALENTS[classKey] || { trees: [] };
  renderTalentTrees(classKey, data);
  updatePointsRemaining();
  const newRank = talentState[classKey][treeIdx][talentIdx] || 0;
  showTalentInfo(talent, newRank);
}

function showTalentInfo(talent, currentRank) {
  const panel = document.getElementById('talentInfoPanel'); if (!panel) return;
  panel.innerHTML = `<h4>${escapeHtml(talent.name || '')} <small style="color:var(--text-muted);font-size:13px;">(${escapeHtml(talent.nameEn || '')})</small></h4><div class="talent-desc">${escapeHtml(talent.desc || '')}</div><div class="talent-benefit"><strong>Beneficio:</strong> ${escapeHtml(talent.benefit || '')}</div><div style="font-size:12px;color:var(--text-muted);margin-top:10px;">Rango actual: ${currentRank} / ${talent.maxRank || 1}</div>`;
}

function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
