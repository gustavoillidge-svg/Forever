// ==================== DATOS DINÁMICOS — WoW Forever ====================
// Capa de acceso a datos con caché localStorage (24h) y fallback a datos embebidos.
// Fuente principal: Forever News Data API (https://wowforever.news/api-docs.html)
// Fuente de respaldo: ForeverDB API (requiere API key, https://foreverdb.net/developers)

const FOREVER_NEWS_BASE = 'https://wowforever.news';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas
const CACHE_PREFIX = 'wf_cache_';

// -------------------- Clases y razas (configuración estática) --------------------
const CLASSES = {
  warrior: { name: 'Guerrero', nameEn: 'Warrior', color: '#C79C6E', icon: 'ability_warrior_savageblow' },
  paladin: { name: 'Paladín', nameEn: 'Paladin', color: '#F58CBA', icon: 'ability_paladin_blessedmending' },
  hunter: { name: 'Cazador', nameEn: 'Hunter', color: '#ABD473', icon: 'ability_hunter_swiftstrike' },
  rogue: { name: 'Pícaro', nameEn: 'Rogue', color: '#FFF569', icon: 'ability_rogue_eviscerate' },
  priest: { name: 'Sacerdote', nameEn: 'Priest', color: '#FFFFFF', icon: 'spell_holy_wordfortitude' },
  shaman: { name: 'Chamán', nameEn: 'Shaman', color: '#0070DE', icon: 'spell_nature_lightningbolt' },
  mage: { name: 'Mago', nameEn: 'Mage', color: '#69CCF0', icon: 'spell_fire_fireball' },
  warlock: { name: 'Brujo', nameEn: 'Warlock', color: '#9482C9', icon: 'spell_shadow_shadowbolt' },
  druid: { name: 'Druida', nameEn: 'Druid', color: '#FF7D0A', icon: 'ability_druid_ferociousbite' }
};

const RACES = {
  human: { name: 'Humano', nameEn: 'Human', faction: 'alliance', icon: 'achievement_character_human_male' },
  dwarf: { name: 'Enano', nameEn: 'Dwarf', faction: 'alliance', icon: 'achievement_character_dwarf_male' },
  nightelf: { name: 'Elfo de la Noche', nameEn: 'Night Elf', faction: 'alliance', icon: 'achievement_character_nightelf_male' },
  gnome: { name: 'Gnomo', nameEn: 'Gnome', faction: 'alliance', icon: 'achievement_character_gnome_male' },
  orc: { name: 'Orco', nameEn: 'Orc', faction: 'horde', icon: 'achievement_character_orc_male' },
  undead: { name: 'No-Muerto', nameEn: 'Undead', faction: 'horde', icon: 'achievement_character_undead_male' },
  tauren: { name: 'Tauren', nameEn: 'Tauren', faction: 'horde', icon: 'achievement_character_tauren_male' },
  troll: { name: 'Trol', nameEn: 'Troll', faction: 'horde', icon: 'achievement_character_troll_male' },
  skyborne_alliance: { name: 'Cielonato de la Orden Eminente', nameEn: 'High Order Skyborne', faction: 'alliance', icon: 'ability_skyborne_walkonair' },
  skyborne_horde: { name: 'Cielonato Formavientos', nameEn: 'Windshaper Skyborne', faction: 'horde', icon: 'spell_nature_skysight' }
};

// Combinaciones raza↔clase (WoW Forever — build 1.60.1.70790, 56 combinaciones)
// Fuente: Wowhead Forever, endgametools, method.gg, warcrafttavern — 6 nuevas vs Classic:
// humano cazador, enano chamán, gnomo sacerdote, orco mago, trol brujo, no-muerto paladín.
// Skyborne: mago solo Alianza, chamán solo Horda; ambos: guerrero, cazador, pícaro, druida.
const RACE_CLASSES = {
  human: ['warrior','paladin','rogue','priest','mage','warlock','hunter'],
  dwarf: ['warrior','paladin','hunter','priest','rogue','shaman'],
  nightelf: ['warrior','hunter','rogue','priest','druid'],
  gnome: ['warrior','rogue','mage','warlock','priest'],
  orc: ['warrior','hunter','rogue','shaman','warlock','mage'],
  undead: ['warrior','rogue','priest','mage','warlock','paladin'],
  tauren: ['warrior','hunter','shaman','druid'],
  troll: ['warrior','hunter','rogue','priest','shaman','mage','warlock'],
  skyborne_alliance: ['warrior','hunter','rogue','mage','druid'],
  skyborne_horde: ['warrior','hunter','rogue','shaman','druid']
};

// -------------------- Raciales (WoW Forever — 2 activas + 2 pasivas por raza) --------------------
// Fuente: Wowhead Forever guide, endgametools, warcrafttavern — build 1.60.1.70790
const RACIALS_STATIC = {
  human: [
    { name: 'Percepción', nameEn: 'Perception', level: 1, icon: 'spell_nature_abolishmagic', desc: 'Detecta enemigos sigilados durante 20 s.' },
    { name: 'Sobrevivir', nameEn: 'Will to Survive', level: 1, icon: 'spell_holy_dispelmagic', desc: 'Elimina efectos de Aturdir. CD 3 min.' },
    { name: 'Despiadado', nameEn: 'Ruthless', level: 1, icon: 'ability_meleedamage', desc: 'Pasiva: +1% probabilidad de crítico con hechizos y habilidades.' },
    { name: 'Espíritu Humano', nameEn: 'The Human Spirit', level: 1, icon: 'spell_holy_holyprotection', desc: 'Pasiva: Espíritu +10%.' }
  ],
  dwarf: [
    { name: 'Forma de Piedra', nameEn: 'Stoneform', level: 1, icon: 'spell_shadow_unholystrength', desc: 'Elimina y otorga inmunidad a Sangrado, Veneno y Enfermedad, reduce daño físico 10% durante 8 s.' },
    { name: 'Cazador de Bestias', nameEn: 'Big Game Hunter', level: 1, icon: 'ability_hunter_snipershot', desc: 'Pasiva: +5% daño a bestias.' },
    { name: 'Precisión del Artesano', nameEn: "Artisan's Precision", level: 1, icon: 'trade_engineering', desc: 'Pasiva: +1% probabilidad de golpe con hechizos y ataques.' },
    { name: 'Encontrar Tesoro', nameEn: 'Find Treasure', level: 1, icon: 'spell_nature_magicimmunity', desc: 'Detecta cofres cercanos.' }
  ],
  nightelf: [
    { name: 'Luz de Elune', nameEn: "Elune's Light", level: 1, icon: 'spell_holy_moonfire', desc: '+10% crítico durante 15 s.' },
    { name: 'Fusión con las Sombras', nameEn: 'Shadowmeld', level: 1, icon: 'ability_stealth', desc: 'Sigilo mientras estás quieto.' },
    { name: 'Rapidez', nameEn: 'Quickness', level: 1, icon: 'ability_rogue_sprint', desc: 'Pasiva: +1% esquiva, +2% velocidad de movimiento.' },
    { name: 'Espíritu de Fuego Fatuo', nameEn: 'Wisp Spirit', level: 1, icon: 'spell_nature_wispsplode', desc: 'Pasiva: al morir, te transformas en fuego fatuo (+75% velocidad).' }
  ],
  gnome: [
    { name: 'Escapista', nameEn: 'Escape Artist', level: 1, icon: 'ability_rogue_sprint', desc: 'Libera de inmovilización y ralentización.' },
    { name: '¡Eureka!', nameEn: 'Eureka!', level: 1, icon: 'spell_arcane_arcane01', desc: 'Reduce costos y +10% daño durante 8 s.' },
    { name: 'Mente Expansiva', nameEn: 'Expansive Mind', level: 1, icon: 'spell_arcane_arcane03', desc: 'Pasiva: +5% maná/ira/energía máxima.' },
    { name: 'Especialización en Ingeniería', nameEn: 'Engineering Specialization', level: 1, icon: 'trade_engineering', desc: 'Pasiva: Dispositivos de ingeniería más fiables.' }
  ],
  orc: [
    { name: 'Furia Sangrienta', nameEn: 'Blood Fury', level: 1, icon: 'spell_shadow_bloodboil', desc: '+10% poder de ataque y poder de hechizo durante 15 s. CD 2 min.' },
    { name: 'Romper Maldición', nameEn: 'Shatter Curse', level: 1, icon: 'spell_shadow_antimagicshell', desc: 'Inmunidad a maldiciones y reduce daño mágico 5% durante 8 s.' },
    { name: 'Dureza', nameEn: 'Hardiness', level: 1, icon: 'spell_nature_stoneclawtotem', desc: 'Pasiva: -20% duración de aturdimiento.' },
    { name: 'Comando', nameEn: 'Command', level: 1, icon: 'ability_hunter_snipershot', desc: 'Pasiva: +5% daño de mascota (Brujo y Cazador).' }
  ],
  undead: [
    { name: 'Toque de la Tumba', nameEn: 'Touch of the Grave', level: 1, icon: 'spell_shadow_lifedrain', desc: '20% probabilidad de drenar Salud al objetivo (hasta 5% de tu vida máxima). ICD 15 s.' },
    { name: 'Voluntad de los Renegados', nameEn: 'Will of the Forsaken', level: 1, icon: 'spell_shadow_raiseundead', desc: 'Elimina efectos de Encanto, Miedo y Sueño.' },
    { name: 'Respiración Subacuática', nameEn: 'Underwater Breathing', level: 1, icon: 'spell_shadow_demonbreath', desc: 'Pasiva: la respiración bajo el agua dura 300% más.' },
    { name: 'Canibalismo', nameEn: 'Cannibalize', level: 1, icon: 'ability_creature_cursed_02', desc: 'Regenera 7% Vida y Maná cada 2 s durante 10 s sobre cadáveres.' }
  ],
  tauren: [
    { name: 'Carrera de la Llanura', nameEn: 'Plainsrunning', level: 1, icon: 'ability_racial_plainsrunning', desc: 'Velocidad aumenta un 2% por pila al moverse, hasta 60%.' },
    { name: 'Cultivo', nameEn: 'Cultivation', level: 1, icon: 'spell_nature_naturetouchgrow', desc: 'Recolecta hierbas adicionales sin Herboristería.' },
    { name: 'Aguante', nameEn: 'Endurance', level: 1, icon: 'spell_nature_reincarnation', desc: 'Pasiva: Vida total +5%.' },
    { name: 'Pisotón de Guerra', nameEn: 'War Stomp', level: 1, icon: 'ability_warstomp', desc: 'Aturde hasta 5 enemigos cercanos durante 2 s. CD 1.5 min.' }
  ],
  troll: [
    { name: 'Rabiar', nameEn: 'Berserking', level: 1, icon: 'racial_troll_berserk', desc: '+10% velocidad de ataque y hechizo durante 15 s.' },
    { name: 'Regeneración', nameEn: 'Regeneration', level: 1, icon: 'spell_nature_regeneration', desc: 'Pasiva: +20% regeneración de vida, continua en combate.' },
    { name: 'Matar Bestias', nameEn: 'Beast Slaying', level: 1, icon: 'ability_hunter_snipershot', desc: 'Pasiva: +5% daño a bestias.' },
    { name: 'Regeneración Rápida', nameEn: 'Rapid Regeneration', level: 1, icon: 'spell_nature_regeneration', desc: 'Regenera 50% de la Vida máxima a lo largo del tiempo.' }
  ],
  skyborne_alliance: [
    { name: 'Ascenso de ráfaga', nameEn: 'Gust Ascent', level: 1, icon: 'ability_skyborne_walkonair', desc: 'Planea hacia abajo durante 10 s. CD 1.5 min.' },
    { name: 'Leer Línea Ley', nameEn: 'Read Ley Line', level: 1, icon: 'spell_arcane_leyline', desc: 'Regen Vida/Maná +50% durante 15 s. En Línea Ley: +100%. No usable con Innervar activa.' },
    { name: 'Bendición del Viento', nameEn: 'Wind Blessed', level: 1, icon: 'spell_nature_windblessed', desc: 'Pasiva: +2% celeridad melee, a distancia y hechizos.' },
    { name: 'Perspicacia Elemental', nameEn: 'Elemental Insight', level: 1, icon: 'spell_nature_elementalinsight', desc: 'Pasiva: +5% daño a elementales.' }
  ],
  skyborne_horde: [
    { name: 'Ascenso de ráfaga', nameEn: 'Gust Ascent', level: 1, icon: 'spell_nature_skysight', desc: 'Planea hacia abajo durante 10 s. CD 1.5 min.' },
    { name: 'Visión del Cielo', nameEn: 'Skysight', level: 1, icon: 'spell_nature_skysight', desc: 'Bendición Elemental +15% velocidad de movimiento durante 15 s. En convergencia elemental: +30% durante 1 h.' },
    { name: 'Bendición del Viento', nameEn: 'Wind Blessed', level: 1, icon: 'spell_nature_windblessed', desc: 'Pasiva: +2% celeridad melee, a distancia y hechizos.' },
    { name: 'Perspicacia Elemental', nameEn: 'Elemental Insight', level: 1, icon: 'spell_nature_elementalinsight', desc: 'Pasiva: +5% daño a elementales.' }
  ]
};

// -------------------- DataService --------------------
const DataService = (function () {
const cache = {};
const pendingAborts = {};

function abortEndpoint(endpoint) {
  if (pendingAborts[endpoint]) { try { pendingAborts[endpoint](); } catch (e) {} pendingAborts[endpoint] = null; }
}

function cacheKey(endpoint) {
    return CACHE_PREFIX + endpoint.replace(/[^a-z0-9]/gi, '_');
  }

  function getCached(endpoint) {
    try {
      const raw = localStorage.getItem(cacheKey(endpoint));
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (Date.now() - data.ts < CACHE_TTL_MS) return data.value;
      localStorage.removeItem(cacheKey(endpoint));
      return null;
    } catch (e) { return null; }
  }

  function setCached(endpoint, value) {
    try {
      localStorage.setItem(cacheKey(endpoint), JSON.stringify({ ts: Date.now(), value: value }));
    } catch (e) {}
  }

async function fetchJson(url, signal) {
  const resp = await fetch(url, { cache: 'no-store', signal });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  return resp.json();
}

  // Transform an API spell record to app format
  function normalizeSpell(rec, macroLang) {
    const name = rec.name || '';
    return {
      name: name,
      nameEn: rec.nameEn || name,
      level: rec.level || 1,
      icon: rec.icon || 'inv_misc_questionmark',
      desc: rec.text || '',
      type: 'spell',
      kind: rec.kind || 'spell'
    };
  }

  // Transform an API talent record to app format
  function normalizeTalent(rec, macroLang) {
    const maxRank = rec.ranks || 1;
    return {
      name: rec.name || '',
      nameEn: rec.nameEn || rec.name || '',
      maxRank: maxRank,
      desc: rec.text || '',
      benefit: rec.text || '',
      tree: rec.tree || '',
      row: rec.row || 1,
      col: rec.col || 1,
      points: rec.points || null,
      requires: rec.requires || [],
      icon: rec.icon || 'inv_misc_questionmark',
      level: rec.level || null,
      spell: rec.spell || null
    };
  }

  return {
    // ---------- Spells ----------
    async getSpells(classKey, macroLang = 'es') {
      const embedded = (EMBEDDED_SPELLS[classKey] || []).map(s => ({ ...s, type: 'spell' }));
      const embeddedNames = new Set(embedded.map(s => (s.nameEn || s.name || '').toLowerCase()));
      const endpoint = `/api/v1/spells?class=${encodeURIComponent(classKey)}&limit=200`;
      abortEndpoint(endpoint);
      const controller = new AbortController();
      pendingAborts[endpoint] = () => controller.abort();
      const cached = getCached(endpoint);
      let records;
      if (cached) {
        records = cached;
      } else {
        try {
          const data = await fetchJson(FOREVER_NEWS_BASE + endpoint, controller.signal);
          records = data.results || data.result || [];
          setCached(endpoint, records);
        } catch (e) {
          if (e.name === 'AbortError') { return embedded; }
          console.warn('Forex News API failed for spells', classKey, e);
          records = null;
        }
      }
      pendingAborts[endpoint] = null;
      if (!records || records.length === 0) {
        return embedded;
      }
      const apiSpells = records.map(rec => normalizeSpell(rec, macroLang));
      const additional = apiSpells.filter(s => !embeddedNames.has((s.nameEn || s.name || '').toLowerCase()));
      return [...embedded, ...additional];
    },

    // ---------- Racials ----------
    async getRacials(raceKey, macroLang = 'es') {
      const embedded = (RACIALS_STATIC[raceKey] || []).map(r => ({ ...r, type: 'racial' }));
      const endpoint = `/api/v1/racials?race=${encodeURIComponent(raceKey)}`;
      abortEndpoint(endpoint);
      const controller = new AbortController();
      pendingAborts[endpoint] = () => controller.abort();
      const cached = getCached(endpoint);
      let records;
      if (cached) {
        records = cached;
      } else {
        try {
          const data = await fetchJson(FOREVER_NEWS_BASE + endpoint, controller.signal);
          records = data.results || data.result || [];
          setCached(endpoint, records);
        } catch (e) {
          if (e.name === 'AbortError') { return embedded; }
          console.warn('Forex News API failed for racials', raceKey, e);
          records = null;
        }
      }
      pendingAborts[endpoint] = null;
      if (!records || records.length === 0) {
        return embedded;
      }
      const apiRacials = records.map(rec => normalizeSpell(rec, macroLang));
      const embeddedNames = new Set(embedded.map(r => (r.nameEn || r.name || '').toLowerCase()));
      const additional = apiRacials.filter(r => !embeddedNames.has((r.nameEn || r.name || '').toLowerCase()));
      return [...embedded, ...additional];
    },

    // ---------- Talents ----------
    async getTalents(classKey) {
      const endpoint = `/api/v1/talents?class=${encodeURIComponent(classKey)}&limit=300`;
      abortEndpoint(endpoint);
      const controller = new AbortController();
      pendingAborts[endpoint] = () => controller.abort();
      const cached = getCached(endpoint);
      let records;
      if (cached) {
        records = cached;
      } else {
        try {
          const data = await fetchJson(FOREVER_NEWS_BASE + endpoint, controller.signal);
          records = data.results || data.result || [];
          setCached(endpoint, records);
        } catch (e) {
          if (e.name === 'AbortError') { return EMBEDDED_TALENTS[classKey] || { trees: [] }; }
          console.warn('Forex News API failed for talents', classKey, e);
          records = null;
        }
      }
      pendingAborts[endpoint] = null;
      if (!records || records.length === 0) {
        return EMBEDDED_TALENTS[classKey] || { trees: [] };
      }

      const treesMap = {};
      records.forEach(rec => {
        const tree = rec.tree || 'Unknown';
        if (!treesMap[tree]) treesMap[tree] = [];
        treesMap[tree].push(normalizeTalent(rec));
      });

      const trees = Object.entries(treesMap).map(([treeName, talents]) => ({
        name: treeName,
        nameEn: treeName,
        talents: talents.sort((a, b) => (a.row || 0) - (b.row || 0) || (a.col || 0) - (b.col || 0))
      }));

      return { trees };
    },

    // ---------- Icon URL ----------
    iconUrl(iconName) {
      if (!iconName) return 'https://wowforever.news/icons/inv_misc_questionmark.png';
      return `https://wowforever.news/icons/${iconName}.png`;
    },

    // ---------- Prefetch all data for a class ----------
    async prefetchClass(classKey, macroLang = 'es') {
      await Promise.all([
        this.getSpells(classKey, macroLang),
        this.getTalents(classKey)
      ]);
    },

    // ---------- Clear cache ----------
    clearCache() {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(CACHE_PREFIX)) localStorage.removeItem(k);
      });
    }
  };
})();

// -------------------- Embedded fallback data --------------------
const EMBEDDED_SPELLS = {
  warrior: [
    { name: 'Golpe Heroico', nameEn: 'Heroic Strike', level: 1, icon: 'ability_rogue_ambush' },
    { name: 'Grito de Batalla', nameEn: 'Battle Shout', level: 1, icon: 'ability_warrior_battleshout' },
    { name: 'Actitud de batalla', nameEn: 'Battle Stance', level: 1, icon: 'ability_warrior_offensivestance' },
    { name: 'Carga', nameEn: 'Charge', level: 4, icon: 'ability_warrior_charge' },
    { name: 'Desgarrar', nameEn: 'Rend', level: 4, icon: 'ability_gouge' },
    { name: 'Disparo de advertencia', nameEn: 'Mocking Blow', level: 6, icon: 'ability_warrior_charge' },
    { name: 'Tronar', nameEn: 'Thunder Clap', level: 6, icon: 'spell_nature_thunderclap' },
    { name: 'Lesión por Muslo', nameEn: 'Hamstring', level: 8, icon: 'ability_shockwave' },
    { name: 'Furia sangrienta', nameEn: 'Bloodrage', level: 10, icon: 'ability_racial_bloodrage' },
    { name: 'Actitud defensiva', nameEn: 'Defensive Stance', level: 10, icon: 'ability_warrior_defensivestance' },
    { name: 'Sajar', nameEn: 'Sunder Armor', level: 10, icon: 'ability_warrior_sunder' },
    { name: 'Provocar', nameEn: 'Taunt', level: 10, icon: 'spell_nature_reincarnation' },
    { name: 'Abrumar', nameEn: 'Overpower', level: 12, icon: 'ability_meleedamage' },
    { name: 'Venganza', nameEn: 'Revenge', level: 14, icon: 'ability_warrior_revenge' },
    { name: 'Grito desmoralizador', nameEn: 'Demoralizing Shout', level: 14, icon: 'ability_warrior_warcry' },
    { name: 'Maestría Táctica', nameEn: 'Tactical Mastery', level: 14, icon: 'spell_nature_enchantarmor' },
    { name: 'Bloqueo con escudo', nameEn: 'Shield Block', level: 16, icon: 'ability_defend' },
    { name: 'Hendedura', nameEn: 'Cleave', level: 20, icon: 'ability_warrior_cleave' },
    { name: 'Golpe Potenciador', nameEn: 'Slam', level: 20, icon: 'ability_warrior_decisivestrike' },
    { name: 'Golpe de Victoria', nameEn: 'Victory Rush', level: 20, icon: 'ability_warrior_devastate' },
    { name: 'Represalias', nameEn: 'Retaliation', level: 20, icon: 'ability_warrior_challange' },
    { name: 'Grito Intimidador', nameEn: 'Intimidating Shout', level: 22, icon: 'ability_golemthunderclap' },
    { name: 'Ejecutar', nameEn: 'Execute', level: 24, icon: 'inv_sword_48' },
    { name: 'Actitud rabiosa', nameEn: 'Berserker Stance', level: 30, icon: 'ability_racial_avatar' },
    { name: 'Rabia Berserker', nameEn: 'Berserker Rage', level: 30, icon: 'spell_nature_ancestralguardian' },
    { name: 'Interceptar', nameEn: 'Intercept', level: 30, icon: 'ability_rogue_sprint' },
    { name: 'Torbellino', nameEn: 'Whirlwind', level: 36, icon: 'ability_whirlwind' },
    { name: 'Golpe Mortal', nameEn: 'Mortal Strike', level: 40, icon: 'ability_warrior_savageblow' },
    { name: 'Escudo de pared', nameEn: 'Shield Wall', level: 28, icon: 'ability_warrior_shieldwall' },
    { name: 'Golpe de Escudo', nameEn: 'Shield Slam', level: 40, icon: 'inv_shield_05' },
    { name: 'Sed de sangre', nameEn: 'Bloodthirst', level: 40, icon: 'spell_nature_bloodlust' },
    { name: 'Temeridad', nameEn: 'Recklessness', level: 50, icon: 'ability_criticalstrike' }
  ],
  paladin: [
    { name: 'Luz sagrada', nameEn: 'Holy Light', level: 1, icon: 'spell_holy_holybolt' },
    { name: 'Sello de rectitud', nameEn: 'Seal of Righteousness', level: 1, icon: 'ability_thunderbolt' },
    { name: 'Sentencia', nameEn: 'Judgement', level: 4, icon: 'spell_holy_righteousfury' },
    { name: 'Bendición de poder', nameEn: 'Blessing of Might', level: 4, icon: 'spell_holy_fistofjustice' },
    { name: 'Protección divina', nameEn: 'Divine Protection', level: 6, icon: 'spell_holy_restoration' },
    { name: 'Martillo de justicia', nameEn: 'Hammer of Justice', level: 8, icon: 'spell_holy_sealofmight' },
    { name: 'Purificar', nameEn: 'Purify', level: 8, icon: 'spell_holy_purify' },
    { name: 'Bendición de Protección', nameEn: 'Blessing of Protection', level: 10, icon: 'spell_holy_sealofprotection' },
    { name: 'Imposición de Manos', nameEn: 'Lay on Hands', level: 10, icon: 'spell_holy_layonhands' },
    { name: 'Furia Justa', nameEn: 'Righteous Fury', level: 10, icon: 'spell_holy_sealoffury' },
    { name: 'Sello de Furia', nameEn: 'Seal of Fury', level: 10, icon: 'spell_holy_retributionaura' },
    { name: 'Bendición de Libertad', nameEn: 'Blessing of Freedom', level: 18, icon: 'spell_holy_sealofvalor' },
    { name: 'Exorcismo', nameEn: 'Exorcism', level: 20, icon: 'spell_holy_excorcism_02' },
    { name: 'Destello de Luz', nameEn: 'Flash of Light', level: 20, icon: 'spell_holy_flashheal' },
    { name: "Templar's Bulwark", nameEn: "Templar's Bulwark", level: 20, icon: 'spell_holy_shieldwall' },
    { name: 'Consagración', nameEn: 'Consecration', level: 30, icon: 'spell_holy_innerfire' },
    { name: 'Golpe Sagrado', nameEn: 'Holy Shock', level: 30, icon: 'spell_holy_searinglight' },
    { name: 'Escudo Divino', nameEn: 'Divine Shield', level: 34, icon: 'spell_holy_divineintervention' },
    { name: 'Martillo de la Rectitud', nameEn: 'Hammer of the Righteous', level: 40, icon: 'ability_paladin_hammeroftherighteous' },
    { name: 'Martillo de la Ira', nameEn: 'Hammer of Wrath', level: 44, icon: 'ability_thunderclap' },
    { name: 'Ira Sagrada', nameEn: 'Holy Wrath', level: 50, icon: 'spell_holy_excorcism' }
  ],
  hunter: [
    { name: 'Disparo Automático', nameEn: 'Auto Shot', level: 1, icon: 'ability_whirlwind' },
    { name: 'Golpe del Raptor', nameEn: 'Raptor Strike', level: 1, icon: 'ability_meleedamage' },
    { name: 'Aspecto del mono', nameEn: 'Aspect of the Monkey', level: 1, icon: 'ability_hunter_quickshot' },
    { name: 'Picadura de serpiente', nameEn: 'Serpent Sting', level: 4, icon: 'ability_hunter_quickshot' },
    { name: 'Disparo arcano', nameEn: 'Arcane Shot', level: 6, icon: 'ability_impalingbolt' },
    { name: 'Disparo de cazador', nameEn: "Hunter's Mark", level: 6, icon: 'ability_hunter_snipershot' },
    { name: 'Disparo de conmoción', nameEn: 'Concussive Shot', level: 8, icon: 'spell_frost_stun' },
    { name: 'Aspecto del halcón', nameEn: 'Aspect of the Hawk', level: 10, icon: 'spell_nature_ravenform' },
    { name: 'Domesticar bestia', nameEn: 'Tame Beast', level: 10, icon: 'ability_hunter_beasttraining' },
    { name: 'Disparo Distracción', nameEn: 'Distracting Shot', level: 12, icon: 'spell_arcane_blink' },
    { name: 'Cortalargata', nameEn: 'Wing Clip', level: 12, icon: 'ability_rogue_trip' },
    { name: 'Disparo múltiple', nameEn: 'Multi-Shot', level: 18, icon: 'ability_upgrademoonglaive' },
    { name: 'Trampa de inmolación', nameEn: 'Immolation Trap', level: 16, icon: 'spell_fire_flameshock' },
    { name: 'Aspecto de la chita', nameEn: 'Aspect of the Cheetah', level: 20, icon: 'ability_mount_jungletiger' },
    { name: 'Disparo de puntería', nameEn: 'Aimed Shot', level: 20, icon: 'inv_spear_07' },
    { name: 'Trampa congelante', nameEn: 'Freezing Trap', level: 20, icon: 'spell_frost_freezingbreath' },
    { name: 'Desenganchar', nameEn: 'Disengage', level: 20, icon: 'ability_rogue_feint' },
    { name: 'Fingir muerte', nameEn: 'Feign Death', level: 30, icon: 'ability_rogue_feigndeath' },
    { name: 'Tiro Rápido', nameEn: 'Rapid Fire', level: 26, icon: 'ability_hunter_runningshot' },
    { name: 'Trampa Explosiva', nameEn: 'Explosive Trap', level: 34, icon: 'spell_fire_selfdestruct' },
    { name: 'Disparo de dispersión', nameEn: 'Scatter Shot', level: 40, icon: 'ability_hunter_scattershot' },
    { name: 'Disparo de Francotirador', nameEn: 'Sniper Shot', level: 40, icon: 'hunter_pvp_snipershot' },
    { name: 'Descarga de Trueno', nameEn: 'Volley', level: 40, icon: 'ability_marksmanship' },
    { name: 'Cólera bestial', nameEn: 'Bestial Wrath', level: 60, icon: 'ability_hunter_bestialwrath' }
  ],
  rogue: [
    { name: 'Eviscerar', nameEn: 'Eviscerate', level: 1, icon: 'ability_rogue_eviscerate' },
    { name: 'Golpe siniestro', nameEn: 'Sinister Strike', level: 1, icon: 'spell_shadow_ritualofsacrifice' },
    { name: 'Sigilo', nameEn: 'Stealth', level: 1, icon: 'ability_stealth' },
    { name: 'Daga emboscada', nameEn: 'Backstab', level: 4, icon: 'ability_backstab' },
    { name: 'Golpe Bajo', nameEn: 'Cheap Shot', level: 4, icon: 'ability_cheapshot' },
    { name: 'Gubia', nameEn: 'Gouge', level: 6, icon: 'ability_gouge' },
    { name: 'Evasión', nameEn: 'Evasion', level: 8, icon: 'spell_shadow_shadowward' },
    { name: 'Sprint', nameEn: 'Sprint', level: 10, icon: 'ability_rogue_sprint' },
    { name: 'Kick', nameEn: 'Kick', level: 12, icon: 'ability_kick' },
    { name: 'Desgarrar', nameEn: 'Rupture', level: 20, icon: 'ability_rogue_rupture' },
    { name: 'Desaparición', nameEn: 'Vanish', level: 22, icon: 'ability_vanish' },
    { name: 'Estocada', nameEn: 'Shank', level: 24, icon: 'ability_theblackarrow' },
    { name: 'Abrumar', nameEn: 'Kidney Shot', level: 30, icon: 'ability_rogue_kidneyshot' },
    { name: 'Preparación', nameEn: 'Preparation', level: 30, icon: 'spell_shadow_antishadow' },
    { name: 'Ceguera', nameEn: 'Blind', level: 34, icon: 'spell_shadow_mindsteal' },
    { name: 'Furia Adrenalínica', nameEn: 'Adrenaline Rush', level: 40, icon: 'spell_shadow_shadowworddominate' },
    { name: 'Marca de la Muerte', nameEn: 'Death Mark', level: 40, icon: 'ability_creature_cursed_02' },
    { name: 'Mutilar', nameEn: 'Mutilate', level: 40, icon: 'ability_rogue_deadlybrew' }
  ],
  priest: [
    { name: 'Curación Menor', nameEn: 'Lesser Heal', level: 1, icon: 'spell_holy_lesserheal' },
    { name: 'Castigo', nameEn: 'Smite', level: 1, icon: 'spell_holy_holysmite' },
    { name: 'Palabra de poder: entereza', nameEn: 'Power Word: Fortitude', level: 1, icon: 'spell_holy_wordfortitude' },
    { name: 'Palabra de las Sombras: Dolor', nameEn: 'Shadow Word: Pain', level: 4, icon: 'spell_shadow_shadowwordpain' },
    { name: 'Palabra de poder: escudo', nameEn: 'Power Word: Shield', level: 6, icon: 'spell_holy_powerwordshield' },
    { name: 'Renovar', nameEn: 'Renew', level: 8, icon: 'spell_holy_renew' },
    { name: 'Desvanecer', nameEn: 'Fade', level: 8, icon: 'spell_magic_lesserinvisibilty' },
    { name: 'Explosión mental', nameEn: 'Mind Blast', level: 10, icon: 'spell_shadow_unholyfrenzy' },
    { name: 'Resurrección', nameEn: 'Resurrection', level: 10, icon: 'spell_holy_resurrection' },
    { name: 'Fuego interno', nameEn: 'Inner Fire', level: 12, icon: 'spell_holy_innerfire' },
    { name: 'Alarido psíquico', nameEn: 'Psychic Scream', level: 14, icon: 'spell_shadow_psychicscream' },
    { name: 'Sanar', nameEn: 'Heal', level: 16, icon: 'spell_holy_heal' },
    { name: 'Disipar magia', nameEn: 'Dispel Magic', level: 18, icon: 'spell_holy_dispelmagic' },
    { name: 'Tortura mental', nameEn: 'Mind Flay', level: 20, icon: 'spell_shadow_siphonmana' },
    { name: 'Fuego Sagrado', nameEn: 'Holy Fire', level: 20, icon: 'spell_holy_searinglight' },
    { name: 'Destello de luz sagrada', nameEn: 'Flash Heal', level: 20, icon: 'spell_holy_flashheal' },
    { name: 'Penitencia', nameEn: 'Penance', level: 30, icon: 'spell_holy_penance' },
    { name: 'Control Mental', nameEn: 'Mind Control', level: 30, icon: 'spell_shadow_shadowworddominate' },
    { name: 'Rezo de sanación', nameEn: 'Prayer of Healing', level: 30, icon: 'spell_holy_prayerofhealing02' },
    { name: 'Oración de Sanación', nameEn: 'Prayer of Mending', level: 40, icon: 'spell_holy_prayerofmendingtga' },
    { name: 'Nova Sagrada', nameEn: 'Holy Nova', level: 40, icon: 'spell_holy_holynova' },
    { name: 'Forma de la sombra', nameEn: 'Shadowform', level: 40, icon: 'spell_shadow_shadowform' },
    { name: 'Gran Sanación', nameEn: 'Greater Heal', level: 40, icon: 'spell_holy_greaterheal' }
  ],
  shaman: [
    { name: 'Descarga de relámpagos', nameEn: 'Lightning Bolt', level: 1, icon: 'spell_nature_lightning' },
    { name: 'Ola de sanación', nameEn: 'Healing Wave', level: 1, icon: 'spell_nature_magicimmunity' },
    { name: 'Choque de tierra', nameEn: 'Earth Shock', level: 4, icon: 'spell_nature_earthshock' },
    { name: 'Tótem de piel de piedra', nameEn: 'Stoneskin Totem', level: 4, icon: 'spell_nature_stoneskintotem' },
    { name: 'Tótem de atadura de tierra', nameEn: 'Earthbind Totem', level: 6, icon: 'spell_nature_strengthofearthtotem02' },
    { name: 'Escudo de Relámpago', nameEn: 'Lightning Shield', level: 8, icon: 'spell_nature_lightningshield' },
    { name: 'Tótem de Garra de Piedra', nameEn: 'Stoneclaw Totem', level: 8, icon: 'spell_nature_stoneclawtotem' },
    { name: 'Choque de llamas', nameEn: 'Flame Shock', level: 10, icon: 'spell_fire_flameshock' },
    { name: 'Tótem Lengua de Fuego', nameEn: 'Searing Totem', level: 10, icon: 'spell_fire_searingtotem' },
    { name: 'Tótem de Fuerza de Tierra', nameEn: 'Strength of Earth Totem', level: 10, icon: 'spell_nature_earthbindtotem' },
    { name: 'Llamar a los Elementos', nameEn: 'Call of the Elements', level: 20, icon: 'spell_shaman_dropall_01' },
    { name: 'Choque de escarcha', nameEn: 'Frost Shock', level: 20, icon: 'spell_frost_frostshock' },
    { name: 'Lobo fantasma', nameEn: 'Ghost Wolf', level: 20, icon: 'spell_nature_spiritwolf' },
    { name: 'Ola de Sanación Menor', nameEn: 'Lesser Healing Wave', level: 20, icon: 'spell_nature_healingwavelesser' },
    { name: 'Tótem de Sanación', nameEn: 'Healing Stream Totem', level: 20, icon: 'inv_spear_04' },
    { name: 'Recuerdo de Tóten', nameEn: 'Totemic Recall', level: 20, icon: 'spell_shaman_totemrecall' },
    { name: 'Escudo de Agua', nameEn: 'Water Shield', level: 20, icon: 'ability_shaman_watershield' },
    { name: 'Tormenta de relámpagos', nameEn: 'Chain Lightning', level: 32, icon: 'spell_nature_chainlightning' },
    { name: 'Llamar a los Antepasados', nameEn: 'Call of the Ancestors', level: 30, icon: 'spell_shaman_dropall_02' },
    { name: 'Tótem Marea de Maná', nameEn: 'Mana Tide Totem', level: 40, icon: 'spell_frost_summonwaterelemental' },
    { name: 'Sanación en Cadena', nameEn: 'Chain Heal', level: 40, icon: 'spell_nature_healingwavegreater' },
    { name: 'Marea de Sangre', nameEn: 'Bloodlust', level: 50, icon: 'spell_nature_bloodlust' },
    { name: 'Ráfaga de Fuego', nameEn: 'Fire Nova', level: 12, icon: 'spell_fire_sealoffire' },
    { name: 'Purga', nameEn: 'Purge', level: 12, icon: 'spell_nature_purge' }
  ],
  mage: [
    { name: 'Bola de fuego', nameEn: 'Fireball', level: 1, icon: 'spell_fire_flamebolt' },
    { name: 'Descarga de escarcha', nameEn: 'Frostbolt', level: 4, icon: 'spell_frost_frostbolt02' },
    { name: 'Proyectil Arcano', nameEn: 'Arcane Missiles', level: 8, icon: 'spell_nature_starfall' },
    { name: 'Transformación', nameEn: 'Polymorph', level: 8, icon: 'spell_nature_polymorph' },
    { name: 'Nova de escarcha', nameEn: 'Frost Nova', level: 10, icon: 'spell_frost_frostnova' },
    { name: 'Deflagración arcana', nameEn: 'Arcane Explosion', level: 14, icon: 'spell_nature_wispsplode' },
    { name: 'Intelecto Arcano', nameEn: 'Arcane Intellect', level: 1, icon: 'spell_holy_magicalsentry' },
    { name: 'Traslación', nameEn: 'Blink', level: 20, icon: 'spell_arcane_blink' },
    { name: 'Blizzard', nameEn: 'Blizzard', level: 20, icon: 'spell_frost_icestorm' },
    { name: 'Contrahechizo', nameEn: 'Counterspell', level: 24, icon: 'spell_frost_iceshock' },
    { name: 'Arcane Blast', nameEn: 'Arcane Blast', level: 20, icon: 'spell_arcane_blast' },
    { name: 'Ice Lance', nameEn: 'Ice Lance', level: 20, icon: 'spell_frost_frostblast' },
    { name: 'Bloque de hielo', nameEn: 'Ice Block', level: 25, icon: 'spell_frost_frost' },
    { name: 'Cono de frío', nameEn: 'Cone of Cold', level: 26, icon: 'spell_frost_glacier' },
    { name: 'Frostfire Bolt', nameEn: 'Frostfire Bolt', level: 40, icon: 'ability_mage_frostfirebolt' },
    { name: 'Ice Barrier', nameEn: 'Ice Barrier', level: 40, icon: 'spell_ice_lament' },
    { name: 'Teletransporte: Dalaran', nameEn: 'Teleport: Dalaran', level: 50, icon: 'spell_arcane_teleporthalloftheguardian' },
    { name: 'Portal: Ventormenta', nameEn: 'Portal: Stormwind', level: 40, icon: 'spell_arcane_portalstormwind' },
    { name: 'Portal: Orgrimmar', nameEn: 'Portal: Orgrimmar', level: 40, icon: 'spell_arcane_portalorgrimmar' }
  ],
  warlock: [
    { name: 'Descarga de las Sombras', nameEn: 'Shadow Bolt', level: 1, icon: 'spell_shadow_shadowbolt' },
    { name: 'Piel de Demonio', nameEn: 'Demon Skin', level: 1, icon: 'spell_shadow_ragingscream' },
    { name: 'Corrupción', nameEn: 'Corruption', level: 4, icon: 'spell_shadow_abominationexplosion' },
    { name: 'Maldición de Debilidad', nameEn: 'Curse of Weakness', level: 4, icon: 'spell_shadow_curseofmannoroth' },
    { name: 'Maldición de agonía', nameEn: 'Curse of Agony', level: 8, icon: 'spell_shadow_curseofsargeras' },
    { name: 'Drenar Alma', nameEn: 'Drain Soul', level: 10, icon: 'spell_shadow_haunting' },
    { name: 'Crear Piedra de Salud', nameEn: 'Create Healthstone', level: 10, icon: 'inv_stone_04' },
    { name: 'Drenar vida', nameEn: 'Drain Life', level: 14, icon: 'spell_shadow_lifedrain02' },
    { name: 'Maldición de Temeridad', nameEn: 'Curse of Recklessness', level: 14, icon: 'spell_shadow_unholystrength' },
    { name: 'Crear Piedra de Alma', nameEn: 'Create Soulstone', level: 18, icon: 'spell_shadow_soulgem' },
    { name: 'Drenar maná', nameEn: 'Drain Mana', level: 24, icon: 'spell_shadow_siphonmana' },
    { name: 'Maldición de Lenguas', nameEn: 'Curse of Tongues', level: 26, icon: 'spell_shadow_curseoftounges' },
    { name: 'Desterrar', nameEn: 'Banish', level: 28, icon: 'spell_shadow_cripple' },
    { name: 'Crear Piedra de Fuego', nameEn: 'Create Firestone', level: 28, icon: 'inv_misc_gem_bloodstone_02' },
    { name: 'Lluvia de Fuego', nameEn: 'Rain of Fire', level: 20, icon: 'spell_shadow_rainoffire' },
    { name: 'Ritual de Invocación', nameEn: 'Ritual of Summoning', level: 20, icon: 'spell_shadow_twilight' },
    { name: 'Conflagrar', nameEn: 'Conflagrate', level: 25, icon: 'spell_fire_fireball' },
    { name: 'Aullido de Terror', nameEn: 'Howl of Terror', level: 40, icon: 'spell_shadow_deathscream' },
    { name: 'Incinerar', nameEn: 'Incinerate', level: 40, icon: 'spell_fire_burnout' },
    { name: 'Espiral de la muerte', nameEn: 'Death Coil', level: 42, icon: 'spell_shadow_deathcoil' },
    { name: 'Maldición de la Perdición', nameEn: 'Curse of Doom', level: 60, icon: 'spell_shadow_curseofmannoroth' },
    { name: 'Portal de Invocación', nameEn: 'Portal of Summoning', level: 60, icon: 'inv_misc_rune_10' }
  ],
  druid: [
    { name: 'Cólera', nameEn: 'Wrath', level: 1, icon: 'spell_nature_wrathv2' },
    { name: 'Toque de sanación', nameEn: 'Healing Touch', level: 1, icon: 'spell_nature_healingtouch' },
    { name: 'Marca de lo Salvaje', nameEn: 'Mark of the Wild', level: 1, icon: 'spell_nature_regeneration' },
    { name: 'Fuego lunar', nameEn: 'Moonfire', level: 4, icon: 'spell_nature_starfall' },
    { name: 'Rejuvenecimiento', nameEn: 'Rejuvenation', level: 4, icon: 'spell_nature_rejuvenation' },
    { name: 'Enredar', nameEn: 'Entangling Roots', level: 8, icon: 'spell_nature_stranglevines' },
    { name: 'Forma de oso', nameEn: 'Bear Form', level: 10, icon: 'ability_racial_bearform' },
    { name: 'Rugido Desmoralizador', nameEn: 'Demoralizing Roar', level: 10, icon: 'ability_racial_bearform' },
    { name: 'Regeneración', nameEn: 'Regrowth', level: 12, icon: 'spell_nature_regenerate' },
    { name: 'Revivir', nameEn: 'Revive', level: 12, icon: 'spell_nature_resistnature' },
    { name: 'Forma de felino', nameEn: 'Cat Form', level: 20, icon: 'ability_druid_catform' },
    { name: 'Zarpa', nameEn: 'Rake', level: 20, icon: 'ability_druid_rake' },
    { name: 'Fuego Estelar', nameEn: 'Starfire', level: 20, icon: 'spell_arcane_starfire' },
    { name: 'Desgarrar', nameEn: 'Rip', level: 24, icon: 'ability_creature_poison_06' },
    { name: 'Mordisco Feraz', nameEn: 'Ferocious Bite', level: 24, icon: 'ability_druid_ferociousbite' },
    { name: 'Cargar Felino', nameEn: 'Feral Charge', level: 20, icon: 'ability_hunter_pet_bear' },
    { name: 'Desencuentro', nameEn: 'Faerie Fire', level: 18, icon: 'spell_nature_faeriefire' },
    { name: 'Forma de viaje', nameEn: 'Travel Form', level: 30, icon: 'ability_druid_travelform' },
    { name: 'Tranquilidad', nameEn: 'Tranquility', level: 30, icon: 'spell_nature_tranquility' },
    { name: "Naturaleza Veloz", nameEn: "Nature's Swiftness", level: 30, icon: 'spell_nature_ravenform' },
    { name: 'Curación Rápida', nameEn: 'Swiftmend', level: 25, icon: 'ability_druid_swiftmend' },
    { name: 'Lacerar', nameEn: 'Lacerate', level: 25, icon: 'ability_druid_ferociousbite' },
    { name: 'Huracán', nameEn: 'Hurricane', level: 40, icon: 'spell_nature_cyclone' },
    { name: 'Estimular', nameEn: 'Innervate', level: 40, icon: 'spell_nature_lightning' },
    { name: 'Huir', nameEn: 'Prowl', level: 20, icon: 'ability_stealth' }
  ]
};

const EMBEDDED_TALENTS = {
  warrior: { trees: [
    { name: 'Armas', nameEn: 'Arms', talents: [
      { name: 'Golpe Mejorado', nameEn: 'Improved Strike', maxRank: 3, desc: 'Aumenta el daño de Golpe Heroico y Rend.', benefit: '+15% daño en habilidades básicas.', tree: 'Armas', row: 1, col: 1, points: null, requires: [], icon: 'ability_rogue_heroicstrike', level: 10, spell: null },
      { name: 'Especialización en Hachas', nameEn: 'Axe Specialization', maxRank: 5, desc: 'Aumenta la probabilidad de crítico con hachas.', benefit: '+5% crítico con hachas.', tree: 'Armas', row: 1, col: 2, points: null, requires: [], icon: 'inv_axe_01', level: 10, spell: null },
      { name: 'Golpe Mortal', nameEn: 'Mortal Strike', maxRank: 1, desc: 'Habilidad activa que causa daño y reduce curación.', benefit: 'Desbloquea Golpe Mortal: 200% daño de arma, -50% curación en objetivo.', tree: 'Armas', row: 2, col: 1, points: 10, requires: [], icon: 'ability_warrior_savageblow', level: 20, spell: 12294 },
      { name: 'Sed de Sangre', nameEn: 'Bloodthirst', maxRank: 1, desc: 'Habilidad activa que cura al guerrero.', benefit: 'Desbloquea Sed de Sangre: daño + curación propia.', tree: 'Armas', row: 2, col: 2, points: 10, requires: [], icon: 'spell_nature_bloodlust', level: 20, spell: 23881 }
    ]},
    { name: 'Furia', nameEn: 'Fury', talents: [
      { name: 'Rabia Mejorada', nameEn: 'Improved Berserker Rage', maxRank: 3, desc: 'Aumenta la generación de ira.', benefit: '+9 ira por uso de Rabia.', tree: 'Furia', row: 1, col: 1, points: null, requires: [], icon: 'spell_nature_ancestralguardian', level: 10, spell: null },
      { name: 'Ejecución Mejorada', nameEn: 'Improved Execute', maxRank: 2, desc: 'Reduce el costo de ira de Ejecutar.', benefit: '-5 ira en Ejecutar.', tree: 'Furia', row: 1, col: 2, points: null, requires: [], icon: 'inv_sword_48', level: 10, spell: null },
      { name: 'Torbellino Mejorado', nameEn: 'Improved Whirlwind', maxRank: 3, desc: 'Aumenta el daño de Torbellino.', benefit: '+15% daño de Torbellino.', tree: 'Furia', row: 2, col: 1, points: 10, requires: [], icon: 'ability_whirlwind', level: 20, spell: null },
      { name: 'Muerte Repentina', nameEn: 'Sudden Death', maxRank: 3, desc: 'Permite usar Ejecutar sin importar la vida del objetivo.', benefit: '15% probabilidad de Ejecutar gratis.', tree: 'Furia', row: 2, col: 2, points: 10, requires: [], icon: 'spell_shadow_deathcoil', level: 20, spell: null }
    ]},
    { name: 'Protección', nameEn: 'Protection', talents: [
      { name: 'Resistencia', nameEn: 'Toughness', maxRank: 5, desc: 'Aumenta la armadura.', benefit: '+10% armadura.', tree: 'Protección', row: 1, col: 1, points: null, requires: [], icon: 'spell_nature_reincarnation', level: 10, spell: null },
      { name: 'Muro de Escudo Mejorado', nameEn: 'Improved Shield Wall', maxRank: 2, desc: 'Aumenta la duración de Muro de Escudo.', benefit: '+3s duración.', tree: 'Protección', row: 1, col: 2, points: null, requires: [], icon: 'ability_warrior_shieldwall', level: 10, spell: null },
      { name: 'Provocación Mejorada', nameEn: 'Improved Taunt', maxRank: 2, desc: 'Reduce el tiempo de reutilización de Provocar.', benefit: '-2s CD.', tree: 'Protección', row: 2, col: 1, points: 10, requires: [], icon: 'spell_nature_reincarnation', level: 20, spell: null },
      { name: 'Escudo de la Tempestad', nameEn: 'Shield Slam', maxRank: 1, desc: 'Habilidad activa de daño y generación de amenaza.', benefit: 'Desbloquea Golpe de Escudo: alto daño + amenaza.', tree: 'Protección', row: 2, col: 2, points: 10, requires: [], icon: 'inv_shield_05', level: 20, spell: 23922 }
    ]}
  ]},
  paladin: { trees: [
    { name: 'Sagrado', nameEn: 'Holy', talents: [] },
    { name: 'Protección', nameEn: 'Protection', talents: [] },
    { name: 'Retribución', nameEn: 'Retribution', talents: [] }
  ]},
  hunter: { trees: [
    { name: 'Dominio de Bestias', nameEn: 'Beast Mastery', talents: [] },
    { name: 'Puntería', nameEn: 'Marksmanship', talents: [] },
    { name: 'Supervivencia', nameEn: 'Survival', talents: [] }
  ]},
  rogue: { trees: [
    { name: 'Asesinato', nameEn: 'Assassination', talents: [] },
    { name: 'Combate', nameEn: 'Combat', talents: [] },
    { name: 'Sutileza', nameEn: 'Subtlety', talents: [] }
  ]},
  priest: { trees: [
    { name: 'Disciplina', nameEn: 'Discipline', talents: [] },
    { name: 'Sagrado', nameEn: 'Holy', talents: [] },
    { name: 'Sombras', nameEn: 'Shadow', talents: [] }
  ]},
  shaman: { trees: [
    { name: 'Elemental', nameEn: 'Elemental', talents: [] },
    { name: 'Mejora', nameEn: 'Enhancement', talents: [] },
    { name: 'Restauración', nameEn: 'Restoration', talents: [] }
  ]},
  mage: { trees: [
    { name: 'Arcano', nameEn: 'Arcane', talents: [] },
    { name: 'Fuego', nameEn: 'Fire', talents: [] },
    { name: 'Escarcha', nameEn: 'Frost', talents: [] }
  ]},
  warlock: { trees: [
    { name: 'Aflicción', nameEn: 'Affliction', talents: [] },
    { name: 'Demonología', nameEn: 'Demonology', talents: [] },
    { name: 'Destrucción', nameEn: 'Destruction', talents: [] }
  ]},
  druid: { trees: [
    { name: 'Equilibrio', nameEn: 'Balance', talents: [] },
    { name: 'Combatiente Feral', nameEn: 'Feral Combat', talents: [] },
    { name: 'Restauración', nameEn: 'Restoration', talents: [] }
  ]}
};

// Compatibilidad: los objetos SPELLS y RACIALS se poblan de forma asíncrona.
// El resto de la app puede leerlos una vez inicializados DataService.
const SPELLS = {};
const RACIALS = {};
