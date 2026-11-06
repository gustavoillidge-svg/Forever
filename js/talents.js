// ==================== LÓGICA DEL SIMULADOR DE TALENTOS ====================

// Datos simplificados de talentos por clase (3 árboles, niveles 10-60)
// Cada talento: { name, nameEn, maxRank, desc, benefit }
const TALENT_DATA = {
  warrior: {
    trees: [
      { name: 'Armas', nameEn: 'Arms', talents: [
        { name: 'Golpe Mejorado', nameEn: 'Improved Strike', maxRank: 3, desc: 'Aumenta el daño de Golpe Heroico y Rend.', benefit: '+15% daño en habilidades básicas.' },
        { name: 'Especialización en Hachas', nameEn: 'Axe Specialization', maxRank: 5, desc: 'Aumenta la probabilidad de crítico con hachas.', benefit: '+5% crítico con hachas.' },
        { name: 'Golpe Mortal', nameEn: 'Mortal Strike', maxRank: 1, desc: 'Habilidad activa que causa daño y reduce curación.', benefit: 'Desbloquea Golpe Mortal: 200% daño de arma, -50% curación en objetivo.' },
        { name: 'Sed de Sangre', nameEn: 'Bloodthirst', maxRank: 1, desc: 'Habilidad activa que cura al guerrero.', benefit: 'Desbloquea Sed de Sangre: daño + curación propia.' }
      ]},
      { name: 'Furia', nameEn: 'Fury', talents: [
        { name: 'Rabia Mejorada', nameEn: 'Improved Berserker Rage', maxRank: 3, desc: 'Aumenta la generación de ira.', benefit: '+9 ira por uso de Rabia.' },
        { name: 'Ejecución Mejorada', nameEn: 'Improved Execute', maxRank: 2, desc: 'Reduce el costo de ira de Ejecutar.', benefit: '-5 ira en Ejecutar.' },
        { name: 'Torbellino Mejorado', nameEn: 'Improved Whirlwind', maxRank: 3, desc: 'Aumenta el daño de Torbellino.', benefit: '+15% daño de Torbellino.' },
        { name: 'Muerte Repentina', nameEn: 'Sudden Death', maxRank: 3, desc: 'Permite usar Ejecutar sin importar la vida del objetivo.', benefit: '15% probabilidad de Ejecutar gratis.' }
      ]},
      { name: 'Protección', nameEn: 'Protection', talents: [
        { name: 'Resistencia', nameEn: 'Toughness', maxRank: 5, desc: 'Aumenta la armadura.', benefit: '+10% armadura.' },
        { name: 'Muro de Escudo Mejorado', nameEn: 'Improved Shield Wall', maxRank: 2, desc: 'Aumenta la duración de Muro de Escudo.', benefit: '+3s duración.' },
        { name: 'Provocación Mejorada', nameEn: 'Improved Taunt', maxRank: 2, desc: 'Reduce el tiempo de reutilización de Provocar.', benefit: '-2s CD.' },
        { name: 'Escudo de la Tempestad', nameEn: 'Shield Slam', maxRank: 1, desc: 'Habilidad activa de daño y generación de amenaza.', benefit: 'Desbloquea Golpe de Escudo: alto daño + amenaza.' }
      ]}
    ]
  },
  mage: {
    trees: [
      { name: 'Arcano', nameEn: 'Arcane', talents: [
        { name: 'Concentración Arcana', nameEn: 'Arcane Concentration', maxRank: 5, desc: 'Aumenta la probabilidad de lanzamiento sin costo de maná.', benefit: '10% probabilidad de hechizo gratis.' },
        { name: 'Misiles Mejorados', nameEn: 'Improved Arcane Missiles', maxRank: 3, desc: 'Reduce el tiempo de lanzamiento.', benefit: '-0.5s lanzamiento.' },
        { name: 'Poder Arcano', nameEn: 'Arcane Power', maxRank: 1, desc: 'Aumenta el daño y costo de maná temporalmente.', benefit: '+30% daño, +30% costo maná por 15s.' },
        { name: 'Presencia Mental', nameEn: 'Presence of Mind', maxRank: 1, desc: 'El siguiente hechizo se lanza instantáneamente.', benefit: 'Hechizo instantáneo cada 3 min.' }
      ]},
      { name: 'Fuego', nameEn: 'Fire', talents: [
        { name: 'Impacto', nameEn: 'Impact', maxRank: 5, desc: 'Da a los hechizos de fuego probabilidad de aturdir.', benefit: '10% probabilidad de aturdir.' },
        { name: 'Ignición', nameEn: 'Ignite', maxRank: 5, desc: 'Los críticos de fuego causan daño adicional en el tiempo.', benefit: '40% del daño crítico como DoT.' },
        { name: 'Piroexplosión', nameEn: 'Pyroblast', maxRank: 1, desc: 'Hechizo de fuego de alto daño y lento.', benefit: 'Desbloquea Piroexplosión: gran daño + DoT.' },
        { name: 'Combustión', nameEn: 'Combustion', maxRank: 1, desc: 'Aumenta la probabilidad de crítico de fuego.', benefit: '+10% crítico por 15s.' }
      ]},
      { name: 'Escarcha', nameEn: 'Frost', talents: [
        { name: 'Escarcha Mejorada', nameEn: 'Improved Frostbolt', maxRank: 5, desc: 'Reduce el tiempo de lanzamiento de Escarcha.', benefit: '-0.5s lanzamiento.' },
        { name: 'Nova Mejorada', nameEn: 'Improved Frost Nova', maxRank: 2, desc: 'Reduce el tiempo de reutilización de Nova de Escarcha.', benefit: '-4s CD.' },
        { name: 'Barrera de Hielo', nameEn: 'Ice Barrier', maxRank: 1, desc: 'Escudo que absorbe daño.', benefit: 'Desbloquea Barrera de Hielo: absorbe daño.' },
        { name: 'Bloque de Hielo', nameEn: 'Ice Block', maxRank: 1, desc: 'Inmunidad temporal pero no puedes actuar.', benefit: 'Desbloquea Bloque de Hielo: inmunidad 10s.' }
      ]}
    ]
  },
  // Añadir más clases según sea necesario... (por brevedad, solo 2 clases en este bloque)
  // El usuario puede expandir TALENT_DATA siguiendo el mismo formato.
};

let talentState = {}; // { classKey: { treeIndex: { talentIndex: rank } } }
let talentPointsSpent = 0;

function onTalentClassChange() {
  const classKey = document.getElementById('talentClassSelect').value;
  if (!classKey || !TALENT_DATA[classKey]) {
    document.getElementById('talentTrees').innerHTML = '<div class="empty-hint" style="width:100%;">Datos de talentos no disponibles para esta clase en la demo. Puedes expandir TALENT_DATA en el código.</div>';
    return;
  }
  
  talentState = {};
  talentPointsSpent = 0;
  renderTalentTrees(classKey);
  updatePointsRemaining();
}

function onTalentLevelChange() {
  updatePointsRemaining();
}

function updatePointsRemaining() {
  const level = parseInt(document.getElementById('talentLevelInput').value) || 60;
  const maxPoints = Math.max(0, level - 9); // Nivel 10 = 1 punto, nivel 60 = 51 puntos
  const remaining = maxPoints - talentPointsSpent;
  document.getElementById('pointsRemaining').textContent = `Puntos disponibles: ${remaining} / ${maxPoints}`;
}

function renderTalentTrees(classKey) {
  const data = TALENT_DATA[classKey];
  if (!data) return;
  
  const container = document.getElementById('talentTrees');
  container.innerHTML = '';
  
  data.trees.forEach((tree, treeIdx) => {
    const treeDiv = document.createElement('div');
    treeDiv.className = 'talent-tree';
    
    const h4 = document.createElement('h4');
    h4.textContent = `${tree.name} (${tree.nameEn})`;
    treeDiv.appendChild(h4);
    
    tree.talents.forEach((talent, talentIdx) => {
      const row = document.createElement('div');
      row.className = 'talent-row';
      
      const node = document.createElement('div');
      node.className = 'talent-node';
      node.dataset.tree = treeIdx;
      node.dataset.talent = talentIdx;
      node.dataset.class = classKey;
      
      const currentRank = talentState[classKey]?.[treeIdx]?.[talentIdx] || 0;
      if (currentRank > 0) {
        node.classList.add(`rank-${Math.min(currentRank, 3)}`);
      }
      
      // Contenido del nodo: iniciales o icono
      const initials = talent.name.split(' ').map(w => w[0]).join('').substring(0, 2);
      node.textContent = initials;
      
      if (currentRank > 0) {
        const badge = document.createElement('span');
        badge.className = 'rank-badge';
        badge.textContent = `${currentRank}/${talent.maxRank}`;
        node.appendChild(badge);
      }
      
      // Tooltip / click
      node.addEventListener('mouseenter', () => showTalentInfo(talent, currentRank));
      node.addEventListener('click', () => addTalentPoint(classKey, treeIdx, talentIdx, talent));
      
      row.appendChild(node);
      treeDiv.appendChild(row);
    });
    
    container.appendChild(treeDiv);
  });
}

function addTalentPoint(classKey, treeIdx, talentIdx, talent) {
  const level = parseInt(document.getElementById('talentLevelInput').value) || 60;
  const maxPoints = Math.max(0, level - 9);
  
  if (talentPointsSpent >= maxPoints) {
    alert('No tienes más puntos de talento disponibles. Sube de nivel para obtener más.');
    return;
  }
  
  if (!talentState[classKey]) talentState[classKey] = {};
  if (!talentState[classKey][treeIdx]) talentState[classKey][treeIdx] = {};
  
  const currentRank = talentState[classKey][treeIdx][talentIdx] || 0;
  
  if (currentRank >= talent.maxRank) {
    // Resetear si ya está al máximo (opcional)
    talentState[classKey][treeIdx][talentIdx] = 0;
    talentPointsSpent--;
  } else {
    talentState[classKey][treeIdx][talentIdx] = currentRank + 1;
    talentPointsSpent++;
  }
  
  renderTalentTrees(classKey);
  updatePointsRemaining();
  showTalentInfo(talent, talentState[classKey][treeIdx][talentIdx] || 0);
}

function showTalentInfo(talent, currentRank) {
  const panel = document.getElementById('talentInfoPanel');
  panel.innerHTML = `
    <h4>${talent.name} <small style="color:var(--text-muted);font-size:13px;">(${talent.nameEn})</small></h4>
    <div class="talent-desc">${talent.desc}</div>
    <div class="talent-benefit">
      <strong>Beneficio:</strong> ${talent.benefit}
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:10px;">
      Rango actual: ${currentRank} / ${talent.maxRank}
    </div>
  `;
}

