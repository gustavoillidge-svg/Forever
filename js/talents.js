// ==================== LÓGICA DEL SIMULADOR DE TALENTOS ====================
// TALENT_DATA: 9 clases, 3 árboles (base Classic 3.3.5a / comunitaria). [VERIFICAR] nombres/efectos exactos vs WoW Forever.
const TALENT_DATA = {
  warrior: { trees: [
    { name: 'Armas', nameEn: 'Arms', talents: [
      { name: 'Golpe Heroico Mejorado', nameEn: 'Improved Heroic Strike', maxRank: 3, desc: '[VERIFICAR Forever] Reduce coste de Golpe Heroico.', benefit: 'Menor coste de ira.' },
      { name: 'Desvío', nameEn: 'Deflection', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta probabilidad de parada.', benefit: '+Parry.' },
      { name: 'Heridas Profundas', nameEn: 'Deep Wounds', maxRank: 3, desc: '[VERIFICAR Forever] Críticos causan sangrado.', benefit: 'DoT por críticos.' },
      { name: 'Golpe Mortal', nameEn: 'Mortal Strike', maxRank: 1, desc: 'Ataque con arma; reduce curación recibida.', benefit: 'Daño + sanación reducida.' }
    ]},
    { name: 'Furia', nameEn: 'Fury', talents: [
      { name: 'Crueldad', nameEn: 'Cruelty', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta crítico cuerpo a cuerpo.', benefit: '+Crítico.' },
      { name: 'Grito de Batalla Mejorado', nameEn: 'Improved Battle Shout', maxRank: 5, desc: '[VERIFICAR Forever] Mejora poder de ataque del grito.', benefit: '+AP.' },
      { name: 'Torbellino Mejorado', nameEn: 'Improved Whirlwind', maxRank: 2, desc: '[VERIFICAR Forever] Reduce reutilización de Torbellino.', benefit: 'Menor CD.' },
      { name: 'Sed de Sangre', nameEn: 'Bloodthirst', maxRank: 1, desc: 'Ataque instantáneo que cura al guerrero.', benefit: 'Daño + autocuración.' }
    ]},
    { name: 'Protección', nameEn: 'Protection', talents: [
      { name: 'Especialización en Escudo', nameEn: 'Shield Specialization', maxRank: 5, desc: '[VERIFICAR Forever] Mejora bloqueo y genera ira.', benefit: '+Bloqueo/ira.' },
      { name: 'Anticipación', nameEn: 'Anticipation', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta defensa.', benefit: '+Defensa.' },
      { name: 'Muro de Escudo Mejorado', nameEn: 'Improved Shield Wall', maxRank: 2, desc: 'Aumenta duración de Muro de Escudo.', benefit: '+Duración.' },
      { name: 'Golpe de Escudo', nameEn: 'Shield Slam', maxRank: 1, desc: 'Golpe con escudo; alto daño y amenaza.', benefit: 'Daño + amenaza.' }
    ]}
  ]},
  paladin: { trees: [
    { name: 'Sagrado', nameEn: 'Holy', talents: [
      { name: 'Fuerza Divina', nameEn: 'Divine Strength', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta Fuerza.', benefit: '+Fuerza.' },
      { name: 'Intelecto Divino', nameEn: 'Divine Intellect', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta Intelecto.', benefit: '+Intelecto.' },
      { name: 'Iluminación', nameEn: 'Illumination', maxRank: 5, desc: '[VERIFICAR Forever] Críticos de curación devuelven maná.', benefit: 'Eficiencia.' },
      { name: 'Choque Sagrado', nameEn: 'Holy Shock', maxRank: 1, desc: '[VERIFICAR Forever] Hechizo instantáneo daño/curación.', benefit: 'Flexibilidad.' }
    ]},
    { name: 'Protección', nameEn: 'Protection', talents: [
      { name: 'Aura de Devoción Mejorada', nameEn: 'Improved Devotion Aura', maxRank: 5, desc: '[VERIFICAR Forever] Mejora armadura del aura.', benefit: '+Armadura.' },
      { name: 'Reducto', nameEn: 'Redoubt', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta bloqueo tras críticos recibidos.', benefit: '+Bloqueo.' },
      { name: 'Especialización en Escudo', nameEn: 'Shield Specialization', maxRank: 3, desc: '[VERIFICAR Forever] Mejora bloqueo/recursos.', benefit: 'Tanqueo.' },
      { name: 'Escudo del Vengador', nameEn: "Avenger's Shield", maxRank: 1, desc: '[VERIFICAR Forever] Proyectil que daña y puede silenciar.', benefit: 'Pull/amenaza.' }
    ]},
    { name: 'Reprensión', nameEn: 'Retribution', talents: [
      { name: 'Bendición de Poder Mejorada', nameEn: 'Improved Blessing of Might', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta poder de ataque otorgado.', benefit: '+AP.' },
      { name: 'Desvío', nameEn: 'Deflection', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta parada.', benefit: '+Parry.' },
      { name: 'Convicción', nameEn: 'Conviction', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta probabilidad de crítico.', benefit: '+Crítico.' },
      { name: 'Golpe de Cruzado', nameEn: 'Crusader Strike', maxRank: 1, desc: 'Ataque cuerpo a cuerpo (sinergia con sellos según versión).', benefit: 'Daño/sinergia.' }
    ]}
  ]},
  hunter: { trees: [
    { name: 'Dominio de Bestias', nameEn: 'Beast Mastery', talents: [
      { name: 'Aspecto del Halcón Mejorado', nameEn: 'Improved Aspect of the Hawk', maxRank: 5, desc: '[VERIFICAR Forever] Probabilidad de velocidad de ataque.', benefit: '+Velocidad.' },
      { name: 'Entrenamiento de Resistencia', nameEn: 'Endurance Training', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta vida de mascota.', benefit: 'Mascota resistente.' },
      { name: 'Furia Desatada', nameEn: 'Unleashed Fury', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta daño de mascota.', benefit: '+Daño mascota.' },
      { name: 'Cólera Bestial', nameEn: 'Bestial Wrath', maxRank: 1, desc: '[VERIFICAR Forever] Enfurece a la mascota.', benefit: 'Burst.' }
    ]},
    { name: 'Puntería', nameEn: 'Marksmanship', talents: [
      { name: 'Tiro Conmocionador Mejorado', nameEn: 'Improved Concussive Shot', maxRank: 5, desc: '[VERIFICAR Forever] Mejora control del disparo.', benefit: '+Control.' },
      { name: 'Eficiencia', nameEn: 'Efficiency', maxRank: 5, desc: '[VERIFICAR Forever] Reduce coste de maná.', benefit: '-Maná.' },
      { name: 'Tiros Letales', nameEn: 'Lethal Shots', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta crítico a distancia.', benefit: '+Crítico.' },
      { name: 'Disparo de Puntería', nameEn: 'Aimed Shot', maxRank: 1, desc: 'Disparo con casteo y alto daño.', benefit: 'Apertura/burst.' }
    ]},
    { name: 'Supervivencia', nameEn: 'Survival', talents: [
      { name: 'Matanza de Monstruos', nameEn: 'Monster Slaying', maxRank: 3, desc: '[VERIFICAR Forever] +Daño/crítico contra bestias.', benefit: 'Nivelado.' },
      { name: 'Desvío', nameEn: 'Deflection', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta parada.', benefit: '+Parry.' },
      { name: 'Maestría en Trampas', nameEn: 'Trap Mastery', maxRank: 2, desc: '[VERIFICAR Forever] Mejora trampas.', benefit: '+Control.' },
      { name: 'Disparo Dispersor', nameEn: 'Scatter Shot', maxRank: 1, desc: '[VERIFICAR Forever] Desorienta al objetivo.', benefit: 'Control.' }
    ]}
  ]},
  rogue: { trees: [
    { name: 'Asesinato', nameEn: 'Assassination', talents: [
      { name: 'Eviscerar Mejorado', nameEn: 'Improved Eviscerate', maxRank: 3, desc: '[VERIFICAR Forever] Aumenta daño de Eviscerar.', benefit: '+Finisher.' },
      { name: 'Malicia', nameEn: 'Malice', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta probabilidad de crítico.', benefit: '+Crítico.' },
      { name: 'Ataques Implacables', nameEn: 'Remorseless Attacks', maxRank: 2, desc: '[VERIFICAR Forever] Crítico tras matar objetivo.', benefit: 'Cadena.' },
      { name: 'Sangre Fría', nameEn: 'Cold Blood', maxRank: 1, desc: '[VERIFICAR Forever] Siguiente ataque crítico garantizado.', benefit: 'Burst.' }
    ]},
    { name: 'Combate', nameEn: 'Combat', talents: [
      { name: 'Golpe Siniestro Mejorado', nameEn: 'Improved Sinister Strike', maxRank: 2, desc: '[VERIFICAR Forever] Reduce coste de energía.', benefit: '-Energía.' },
      { name: 'Reflejos Rápidos', nameEn: 'Lightning Reflexes', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta esquiva.', benefit: '+Esquiva.' },
      { name: 'Especialización en Armas', nameEn: 'Weapon Specialization', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta daño con armas.', benefit: '+Daño.' },
      { name: 'Subidón de Adrenalina', nameEn: 'Adrenaline Rush', maxRank: 1, desc: '[VERIFICAR Forever] Aumenta regeneración de energía.', benefit: 'Burst.' }
    ]},
    { name: 'Sutileza', nameEn: 'Subtlety', talents: [
      { name: 'Maestro del Engaño', nameEn: 'Master of Deception', maxRank: 5, desc: '[VERIFICAR Forever] Reduce detección en sigilo.', benefit: '+Sigilo.' },
      { name: 'Golpe Bajo Mejorado', nameEn: 'Improved Cheap Shot', maxRank: 2, desc: '[VERIFICAR Forever] Aumenta duración de aturdimiento.', benefit: '+Control.' },
      { name: 'Iniciativa', nameEn: 'Initiative', maxRank: 3, desc: '[VERIFICAR Forever] Probabilidad de punto de combo extra.', benefit: '+Combo.' },
      { name: 'Preparación', nameEn: 'Preparation', maxRank: 1, desc: '[VERIFICAR Forever] Reinicia reutilizaciones.', benefit: 'Utilidad.' }
    ]}
  ]},
  priest: { trees: [
    { name: 'Disciplina', nameEn: 'Discipline', talents: [
      { name: 'Voluntad Férrea', nameEn: 'Unbreakable Will', maxRank: 5, desc: '[VERIFICAR Forever] Resistencia a control.', benefit: '+Resistencia.' },
      { name: 'Palabra de Poder: Escudo Mejorado', nameEn: 'Improved Power Word: Shield', maxRank: 3, desc: '[VERIFICAR Forever] Aumenta absorción.', benefit: '+Escudo.' },
      { name: 'Meditación', nameEn: 'Meditation', maxRank: 3, desc: '[VERIFICAR Forever] Regeneración de maná en combate.', benefit: '+Regen.' },
      { name: 'Infusión de Poder', nameEn: 'Power Infusion', maxRank: 1, desc: '[VERIFICAR Forever] Aumenta velocidad de lanzamiento.', benefit: 'Buff.' }
    ]},
    { name: 'Sagrado', nameEn: 'Holy', talents: [
      { name: 'Renovar Mejorado', nameEn: 'Improved Renew', maxRank: 3, desc: '[VERIFICAR Forever] Aumenta curación de Renovar.', benefit: '+HoT.' },
      { name: 'Especialización Sagrada', nameEn: 'Holy Specialization', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta crítico sagrado.', benefit: '+Crítico.' },
      { name: 'Curación Espiritual', nameEn: 'Spiritual Healing', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta curación.', benefit: '+Curación.' },
      { name: 'Pozo de Luz', nameEn: 'Lightwell', maxRank: 1, desc: '[VERIFICAR Forever] Crea un pozo que cura.', benefit: 'Utilidad.' }
    ]},
    { name: 'Sombra', nameEn: 'Shadow', talents: [
      { name: 'Apagón', nameEn: 'Blackout', maxRank: 5, desc: '[VERIFICAR Forever] Probabilidad de aturdir con sombra.', benefit: '+Control.' },
      { name: 'Palabra de Sombras: Dolor Mejorada', nameEn: 'Improved Shadow Word: Pain', maxRank: 2, desc: '[VERIFICAR Forever] Aumenta duración.', benefit: '+DoT.' },
      { name: 'Enfoque de Sombra', nameEn: 'Shadow Focus', maxRank: 5, desc: '[VERIFICAR Forever] Reduce fallo/resistencia.', benefit: '+Impacto.' },
      { name: 'Forma de Sombra', nameEn: 'Shadowform', maxRank: 1, desc: '[VERIFICAR Forever] Aumenta daño de sombra.', benefit: 'DPS sombra.' }
    ]}
  ]},
  shaman: { trees: [
    { name: 'Elemental', nameEn: 'Elemental', talents: [
      { name: 'Convección', nameEn: 'Convection', maxRank: 5, desc: '[VERIFICAR Forever] Reduce coste de hechizos.', benefit: '-Maná.' },
      { name: 'Conmoción', nameEn: 'Concussion', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta daño de choques/rayos.', benefit: '+Daño.' },
      { name: 'Enfoque Elemental', nameEn: 'Elemental Focus', maxRank: 1, desc: '[VERIFICAR Forever] Críticos otorgan claridad.', benefit: 'Eficiencia.' },
      { name: 'Maestría Elemental', nameEn: 'Elemental Mastery', maxRank: 1, desc: '[VERIFICAR Forever] Crítico garantizado.', benefit: 'Burst.' }
    ]},
    { name: 'Mejora', nameEn: 'Enhancement', talents: [
      { name: 'Conocimiento Ancestral', nameEn: 'Ancestral Knowledge', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta maná máximo.', benefit: '+Maná.' },
      { name: 'Especialización en Escudos', nameEn: 'Shield Specialization', maxRank: 5, desc: '[VERIFICAR Forever] Mejora bloqueo.', benefit: 'Defensa.' },
      { name: 'Maestría con Armas', nameEn: 'Weapon Mastery', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta daño con armas.', benefit: '+Daño.' },
      { name: 'Golpe de Tormenta', nameEn: 'Stormstrike', maxRank: 1, desc: '[VERIFICAR Forever] Potencia daño de naturaleza.', benefit: 'Sinergia.' }
    ]},
    { name: 'Restauración', nameEn: 'Restoration', talents: [
      { name: 'Onda Curativa Mejorada', nameEn: 'Improved Healing Wave', maxRank: 5, desc: '[VERIFICAR Forever] Reduce tiempo de casteo.', benefit: 'Cast rápido.' },
      { name: 'Enfoque de Marea', nameEn: 'Tidal Focus', maxRank: 5, desc: '[VERIFICAR Forever] Reduce coste de curaciones.', benefit: '-Maná.' },
      { name: 'Gracia Curativa', nameEn: 'Healing Grace', maxRank: 3, desc: '[VERIFICAR Forever] Reduce amenaza.', benefit: '-Amenaza.' },
      { name: 'Tótem Marea de Maná', nameEn: 'Mana Tide Totem', maxRank: 1, desc: '[VERIFICAR Forever] Restaura maná al grupo.', benefit: 'Soporte.' }
    ]}
  ]},
  mage: { trees: [
    { name: 'Arcano', nameEn: 'Arcane', talents: [
      { name: 'Sutileza Arcana', nameEn: 'Arcane Subtlety', maxRank: 2, desc: '[VERIFICAR Forever] Reduce amenaza/resistencia.', benefit: 'Utilidad.' },
      { name: 'Enfoque Arcano', nameEn: 'Arcane Focus', maxRank: 5, desc: 'Aumenta probabilidad de impacto arcano.', benefit: '+Impacto.' },
      { name: 'Concentración Arcana', nameEn: 'Arcane Concentration', maxRank: 5, desc: 'Probabilidad de hechizo sin coste.', benefit: 'Eficiencia.' },
      { name: 'Poder Arcano', nameEn: 'Arcane Power', maxRank: 1, desc: 'Aumenta daño y coste de maná temporalmente.', benefit: 'Burst.' }
    ]},
    { name: 'Fuego', nameEn: 'Fire', talents: [
      { name: 'Bola de Fuego Mejorada', nameEn: 'Improved Fireball', maxRank: 5, desc: 'Reduce tiempo de lanzamiento.', benefit: 'Cast rápido.' },
      { name: 'Impacto', nameEn: 'Impact', maxRank: 5, desc: 'Probabilidad de aturdir con fuego.', benefit: 'Control.' },
      { name: 'Ignición', nameEn: 'Ignite', maxRank: 5, desc: 'Críticos aplican daño periódico.', benefit: '+Daño.' },
      { name: 'Combustión', nameEn: 'Combustion', maxRank: 1, desc: 'Aumenta crítico de fuego.', benefit: 'Burst.' }
    ]},
    { name: 'Escarcha', nameEn: 'Frost', talents: [
      { name: 'Descarga de Escarcha Mejorada', nameEn: 'Improved Frostbolt', maxRank: 5, desc: 'Reduce tiempo de lanzamiento.', benefit: 'Cast rápido.' },
      { name: 'Fragmentos de Hielo', nameEn: 'Ice Shards', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta crítico de escarcha.', benefit: '+Crítico.' },
      { name: 'Nova de Escarcha Mejorada', nameEn: 'Improved Frost Nova', maxRank: 2, desc: 'Reduce reutilización.', benefit: 'Control.' },
      { name: 'Barrera de Hielo', nameEn: 'Ice Barrier', maxRank: 1, desc: 'Escudo que absorbe daño.', benefit: 'Supervivencia.' }
    ]}
  ]},
  warlock: { trees: [
    { name: 'Aflicción', nameEn: 'Affliction', talents: [
      { name: 'Corrupción Mejorada', nameEn: 'Improved Corruption', maxRank: 5, desc: '[VERIFICAR Forever] Mejora Corrupción.', benefit: 'Aplicación.' },
      { name: 'Drenar Vida Mejorado', nameEn: 'Improved Drain Life', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta curación.', benefit: 'Sostenimiento.' },
      { name: 'Maldición de Agonía Mejorada', nameEn: 'Improved Curse of Agony', maxRank: 3, desc: '[VERIFICAR Forever] Aumenta daño.', benefit: '+DoT.' },
      { name: 'Succionar Vida', nameEn: 'Siphon Life', maxRank: 1, desc: '[VERIFICAR Forever] DoT que cura.', benefit: 'Supervivencia.' }
    ]},
    { name: 'Demonología', nameEn: 'Demonology', talents: [
      { name: 'Piedra de Salud Mejorada', nameEn: 'Improved Healthstone', maxRank: 2, desc: '[VERIFICAR Forever] Aumenta curación de piedra.', benefit: 'Utilidad.' },
      { name: 'Diablillo Mejorado', nameEn: 'Improved Imp', maxRank: 3, desc: '[VERIFICAR Forever] Mejora diablillo.', benefit: 'Mascota.' },
      { name: 'Dominio Vil', nameEn: 'Fel Domination', maxRank: 1, desc: '[VERIFICAR Forever] Invocación rápida.', benefit: 'Utilidad.' },
      { name: 'Sacrificio Demoníaco', nameEn: 'Demonic Sacrifice', maxRank: 1, desc: '[VERIFICAR Forever] Sacrifica demonio por buff.', benefit: 'Buff.' }
    ]},
    { name: 'Destrucción', nameEn: 'Destruction', talents: [
      { name: 'Descarga de las Sombras Mejorada', nameEn: 'Improved Shadow Bolt', maxRank: 5, desc: '[VERIFICAR Forever] Sinergia tras críticos.', benefit: 'Sinergia.' },
      { name: 'Cataclismo', nameEn: 'Cataclysm', maxRank: 5, desc: '[VERIFICAR Forever] Reduce coste.', benefit: '-Maná.' },
      { name: 'Devastación', nameEn: 'Devastation', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta crítico.', benefit: '+Crítico.' },
      { name: 'Conflagración', nameEn: 'Conflagrate', maxRank: 1, desc: '[VERIFICAR Forever] Consume Inmolar; daño instantáneo.', benefit: 'Burst.' }
    ]}
  ]},
  druid: { trees: [
    { name: 'Equilibrio', nameEn: 'Balance', talents: [
      { name: 'Cólera Mejorada', nameEn: 'Improved Wrath', maxRank: 5, desc: '[VERIFICAR Forever] Reduce casteo de Cólera.', benefit: 'Cast rápido.' },
      { name: 'Fuego Lunar Mejorado', nameEn: "Improved Moonfire", maxRank: 5, desc: '[VERIFICAR Forever] Mejora Fuego Lunar.', benefit: '+Daño.' },
      { name: 'Gracia de la Naturaleza', nameEn: "Nature's Grace", maxRank: 1, desc: '[VERIFICAR Forever] Críticos reducen siguiente casteo.', benefit: 'Fluidez.' },
      { name: 'Fuerza de la Naturaleza', nameEn: 'Force of Nature', maxRank: 1, desc: '[VERIFICAR Forever] Invoca tréants.', benefit: 'Utilidad.' }
    ]},
    { name: 'Combate Feral', nameEn: 'Feral Combat', talents: [
      { name: 'Ferocidad', nameEn: 'Ferocity', maxRank: 5, desc: '[VERIFICAR Forever] Reduce coste feral.', benefit: 'Recursos.' },
      { name: 'Agresión Feral', nameEn: 'Feral Aggression', maxRank: 5, desc: '[VERIFICAR Forever] Mejora utilidad feral.', benefit: 'Utilidad.' },
      { name: 'Presteza Felina', nameEn: 'Feline Swiftness', maxRank: 2, desc: '[VERIFICAR Forever] Esquiva/velocidad felina.', benefit: 'Movilidad.' },
      { name: 'Líder de la Manada', nameEn: 'Leader of the Pack', maxRank: 1, desc: '[VERIFICAR Forever] Aura de crítico felina.', benefit: '+Crítico.' }
    ]},
    { name: 'Restauración', nameEn: 'Restoration', talents: [
      { name: 'Marca de lo Salvaje Mejorada', nameEn: 'Improved Mark of the Wild', maxRank: 5, desc: '[VERIFICAR Forever] Mejora marca.', benefit: '+Stats.' },
      { name: 'Enfoque de la Naturaleza', nameEn: "Nature's Focus", maxRank: 5, desc: '[VERIFICAR Forever] Reduce retroceso al curar.', benefit: 'Estabilidad.' },
      { name: 'Don de la Naturaleza', nameEn: 'Gift of Nature', maxRank: 5, desc: '[VERIFICAR Forever] Aumenta curación.', benefit: '+Curación.' },
      { name: 'Presteza de la Naturaleza', nameEn: "Nature's Swiftness", maxRank: 1, desc: 'Siguiente hechizo de naturaleza instantáneo.', benefit: 'Emergencia.' }
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
  talentState = {}; talentPointsSpent = 0;
  renderTalentTrees(classKey); updatePointsRemaining();
}
function onTalentLevelChange() { updatePointsRemaining(); }
function updatePointsRemaining() {
  const level = parseInt(document.getElementById('talentLevelInput').value) || 60;
  const maxPoints = Math.max(0, Math.min(51, level - 9));
  document.getElementById('pointsRemaining').textContent = Puntos disponibles:  / ;
}
function renderTalentTrees(classKey) {
  const data = TALENT_DATA[classKey]; if (!data) return;
  const container = document.getElementById('talentTrees'); container.innerHTML = '';
  data.trees.forEach((tree, treeIdx) => {
    const treeDiv = document.createElement('div'); treeDiv.className = 'talent-tree';
    const h4 = document.createElement('h4'); h4.textContent = ${tree.name} (); treeDiv.appendChild(h4);
    tree.talents.forEach((talent, talentIdx) => {
      const row = document.createElement('div'); row.className = 'talent-row';
      const node = document.createElement('div'); node.className = 'talent-node';
      node.dataset.tree = treeIdx; node.dataset.talent = talentIdx; node.dataset.class = classKey;
      const currentRank = talentState[classKey]?.[treeIdx]?.[talentIdx] || 0;
      if (currentRank > 0) node.classList.add(ank-);
      node.textContent = talent.name.split(' ').map(w => w[0]).join('').substring(0,2);
      if (currentRank > 0) { const badge = document.createElement('span'); badge.className='rank-badge'; badge.textContent = ${currentRank}/; node.appendChild(badge); }
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
  else { if (talentPointsSpent >= maxPoints) { alert('No tienes más puntos de talento disponibles. Sube de nivel para obtener más.'); return; } talentState[classKey][treeIdx][talentIdx] = currentRank + 1; talentPointsSpent++; }
  renderTalentTrees(classKey); updatePointsRemaining();
  showTalentInfo(talent, talentState[classKey][treeIdx][talentIdx] || 0);
}
function showTalentInfo(talent, currentRank) {
  document.getElementById('talentInfoPanel').innerHTML = <h4> <small style="color:var(--text-muted);font-size:13px;">()</small></h4><div class="talent-desc"></div><div class="talent-benefit"><strong>Beneficio:</strong> </div><div style="font-size:12px;color:var(--text-muted);margin-top:10px;">Rango actual:  / </div>;
}