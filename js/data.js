// ==================== DATOS EMBEBIDOS ====================

// Iconos base (usando Wowhead CDN con IDs de hechizos conocidos)
// Para producción, idealmente usar nombres de iconos exactos. Aquí usamos IDs de hechizos clásicos.

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
  draenei: { name: 'Draenei (Forever, si aplica)', nameEn: 'Draenei', faction: 'alliance', icon: 'achievement_character_draenei_male' },
  orc: { name: 'Orco', nameEn: 'Orc', faction: 'horde', icon: 'achievement_character_orc_male' },
  undead: { name: 'No-Muerto', nameEn: 'Undead', faction: 'horde', icon: 'achievement_character_undead_male' },
  tauren: { name: 'Tauren', nameEn: 'Tauren', faction: 'horde', icon: 'achievement_character_tauren_male' },
  troll: { name: 'Trol', nameEn: 'Troll', faction: 'horde', icon: 'achievement_character_troll_male' },
  bloodelf: { name: 'Elfo de Sangre (Forever, si aplica)', nameEn: 'Blood Elf', faction: 'horde', icon: 'achievement_character_bloodelf_male' },
  skyborne_alliance: { name: 'Nacido del Cielo — Orden Suprema (Alianza)', nameEn: 'Skyborne — High Order (Alliance)', faction: 'alliance', icon: 'ability_druid_flightform' },
  skyborne_horde: { name: 'Nacido del Cielo — Moldeavientos (Horda)', nameEn: 'Skyborne — Windshaper (Horde)', faction: 'horde', icon: 'ability_druid_flightform' }
};

// Raciales (habilidades activas que se pueden usar en macros)
const RACIALS = {
  human: [
    { name: 'Percepción', nameEn: 'Perception', level: 1, icon: 'spell_nature_abolishmagic', desc: 'Aumenta la detección de sigilo.' },
    { name: 'Voluntad de los Renegados', nameEn: 'Will to Survive', level: 1, icon: 'spell_holy_sealofvalor', desc: 'Elimina efectos de control.' },
    { name: 'Especialización en Espadas', nameEn: 'Sword Specialization', level: 1, icon: 'ability_meleedamage', desc: 'Pasiva: +2% crítico con espadas.' },
    { name: 'Espíritu Humano', nameEn: 'The Human Spirit', level: 1, icon: 'spell_holy_holyprotection', desc: 'Pasiva: +5% espíritu.' }
  ],
  dwarf: [
    { name: 'Forma de Piedra', nameEn: 'Stoneform', level: 1, icon: 'spell_shadow_unholystrength', desc: 'Inmunidad a sangrado, veneno y enfermedad.' },
    { name: 'Especialización en Mazas', nameEn: 'Mace Specialization', level: 1, icon: 'inv_mace_01', desc: 'Pasiva: +1% daño con mazas.' },
    { name: 'Cazador de Bestias', nameEn: 'Big Game Hunter', level: 1, icon: 'ability_hunter_snipershot', desc: 'Pasiva: +5% daño a bestias.' },
    { name: 'Encontrar Tesoro', nameEn: 'Find Treasure', level: 1, icon: 'spell_nature_magicimmunity', desc: 'Detecta cofres cercanos.' }
  ],
  nightelf: [
    { name: 'Luz de Elune', nameEn: "Elune's Light", level: 1, icon: 'spell_holy_moonfire', desc: '+10% crítico durante 15s.' },
    { name: 'Fusión con las Sombras', nameEn: 'Shadowmeld', level: 1, icon: 'ability_stealth', desc: 'Sigilo mientras está quieto.' },
    { name: 'Rapidez', nameEn: 'Quickness', level: 1, icon: 'ability_rogue_sprint', desc: 'Pasiva: +1% esquiva, +2% velocidad.' },
    { name: 'Espíritu de Fuego Fatuo', nameEn: 'Wisp Spirit', level: 1, icon: 'spell_nature_wispsplode', desc: 'Pasiva: velocidad en forma de fuego fatuo.' }
  ],
  gnome: [
    { name: 'Escapista', nameEn: 'Escape Artist', level: 1, icon: 'ability_rogue_sprint', desc: 'Libera de inmovilización y ralentización.' },
    { name: '¡Eureka!', nameEn: 'Eureka!', level: 1, icon: 'spell_arcane_arcane01', desc: 'Reduce costos y +10% daño/curación en 3 habilidades.' },
    { name: 'Mente Expansiva', nameEn: 'Expansive Mind', level: 1, icon: 'spell_arcane_arcane03', desc: 'Pasiva: +5% maná/ira/energía.' },
    { name: 'Especialización en Ingeniería', nameEn: 'Engineering Specialization', level: 1, icon: 'trade_engineering', desc: 'Pasiva: +15 habilidad ingeniería.' }
  ],
  orc: [
    { name: 'Furia Sangrienta', nameEn: 'Blood Fury', level: 1, icon: 'spell_shadow_bloodboil', desc: '+10% ataque y hechizos durante 15s.' },
    { name: 'Romper Maldición', nameEn: 'Shatter Curse', level: 1, icon: 'spell_shadow_antimagicshell', desc: 'Inmunidad a maldiciones 8s.' },
    { name: 'Especialización en Hachas', nameEn: 'Axe Specialization', level: 1, icon: 'inv_axe_01', desc: 'Pasiva: +1% crítico con hachas.' },
    { name: 'Dureza', nameEn: 'Hardiness', level: 1, icon: 'spell_nature_stoneclawtotem', desc: 'Pasiva: -20% duración de aturdimiento.' }
  ],
  undead: [
    { name: 'Toque de la Tumba', nameEn: 'Touch of the Grave', level: 1, icon: 'spell_shadow_lifedrain', desc: 'Roba vida con ataques.' },
    { name: 'Voluntad de los Renegados', nameEn: 'Will of the Forsaken', level: 1, icon: 'spell_shadow_raiseundead', desc: 'Libera de encanto, miedo y sueño.' },
    { name: 'Canibalismo', nameEn: 'Cannibalize', level: 1, icon: 'ability_creature_cursed_02', desc: 'Come cadáveres para curar.' },
    { name: 'Respiración Subacuática', nameEn: 'Underwater Breathing', level: 1, icon: 'spell_shadow_demonbreath', desc: 'Pasiva: respiración prolongada.' }
  ],
  tauren: [
    { name: 'Carrera de la Llanura', nameEn: 'Plainsrunning', level: 1, icon: 'ability_racial_plainsrunning', desc: 'Velocidad aumenta con el tiempo corriendo.' },
    { name: 'Cultivo', nameEn: 'Cultivation', level: 1, icon: 'spell_nature_naturetouchgrow', desc: 'Recolecta hierbas adicionales.' },
    { name: 'Aguante', nameEn: 'Endurance', level: 1, icon: 'spell_nature_reincarnation', desc: 'Pasiva: +5% vida, +1% golpe.' },
    { name: 'Pisotón de Guerra', nameEn: 'War Stomp', level: 1, icon: 'ability_warstomp', desc: 'Aturde enemigos cercanos 2s.' }
  ],
  troll: [
    { name: 'Berserker', nameEn: 'Berserking', level: 1, icon: 'racial_troll_berserk', desc: '+10-30% velocidad de ataque según vida.' },
    { name: 'Regeneración', nameEn: 'Regeneration', level: 1, icon: 'spell_nature_regeneration', desc: 'Pasiva: +10% regeneración de vida.' },
    { name: 'Lanzador de Hachas', nameEn: 'Throwing Specialization', level: 1, icon: 'inv_weapon_halberd_04', desc: 'Pasiva: +1% crítico con armas arrojadizas.' },
    { name: 'Matar Bestias', nameEn: 'Beast Slaying', level: 1, icon: 'ability_hunter_snipershot', desc: 'Pasiva: +5% daño a bestias.' }
  ],
  draenei: [
    { name: 'Don de los Naaru', nameEn: 'Gift of the Naaru', level: 1, icon: 'spell_holy_holyprotection', desc: '[VERIFICAR Forever] Curación HoT racial (referencia TBC).' },
    { name: 'Presencia Heroica', nameEn: 'Heroic Presence', level: 1, icon: 'inv_helmet_21', desc: '[VERIFICAR Forever] Bono de golpe racial (referencia TBC).' }
  ],
  bloodelf: [
    { name: 'Torrente Arcano', nameEn: 'Arcane Torrent', level: 1, icon: 'spell_shadow_teleport', desc: '[VERIFICAR Forever] Silencio/recupera recurso (referencia TBC).' }
  ],
  // Skyborne / Nacidos del Cielo (WoW Forever, razas nuevas). Datos orientativos basados en guías públicas (Wowhead/Icy Veins/foreverdb); [VERIFICAR] nombres exactos en cliente ES.
  skyborne_alliance: [
    { name: 'Bendición de la Corona', nameEn: 'Crown\'s Blessing', level: 1, icon: 'spell_holy_innerfire', desc: '[VERIFICAR] Activa: beneficio defensivo/soporte (High Order).' },
    { name: 'Postura Real', nameEn: 'Royal Poise', level: 1, icon: 'spell_holy_sealofwisdom', desc: '[VERIFICAR] Pasiva: afinidad a maná/curación o utilidad (High Order).' },
    { name: 'Plumaje Resistente', nameEn: 'Feathered Fortitude', level: 1, icon: 'inv_misc_feather_01', desc: '[VERIFICAR] Pasiva racial Skyborne.' },
    { name: 'Deslizamiento Aéreo', nameEn: 'Aerial Glide', level: 1, icon: 'ability_druid_flightform', desc: '[VERIFICAR] Movilidad/caída controlada racial Skyborne.' }
  ],
  skyborne_horde: [
    { name: 'Impulso del Vendaval', nameEn: 'Gale Surge', level: 1, icon: 'spell_nature_cyclone', desc: '[VERIFICAR] Activa: ráfaga de velocidad/daño o utilidad (Windshaper).' },
    { name: 'Instinto de Tormenta', nameEn: 'Storm Instinct', level: 1, icon: 'spell_nature_lightning', desc: '[VERIFICAR] Pasiva: afinidad ofensiva/utilidad (Windshaper).' },
    { name: 'Plumaje Resistente', nameEn: 'Feathered Fortitude', level: 1, icon: 'inv_misc_feather_01', desc: '[VERIFICAR] Pasiva racial Skyborne.' },
    { name: 'Deslizamiento Aéreo', nameEn: 'Aerial Glide', level: 1, icon: 'ability_druid_flightform', desc: '[VERIFICAR] Movilidad/caída controlada racial Skyborne.' }
  ]
};

// Hechizos por clase (basado en WoW Classic/Forever, nivel de aprendizaje)
// Nota: Lista simplificada de habilidades activas relevantes para macros.
// Los niveles son aproximados según datos comunitarios.
const SPELLS = {
  warrior: [
    { name: 'Carga', nameEn: 'Charge', level: 4, icon: 'ability_warrior_charge' },
    { name: 'Golpe Heroico', nameEn: 'Heroic Strike', level: 1, icon: 'ability_rogue_heroicstrike' },
    { name: 'Grito de Batalla', nameEn: 'Battle Shout', level: 2, icon: 'ability_warrior_battleshout' },
    { name: 'Rendir', nameEn: 'Rend', level: 4, icon: 'ability_gouge' },
    { name: 'Torbellino', nameEn: 'Whirlwind', level: 36, icon: 'ability_whirlwind' },
    { name: 'Golpe Mortal', nameEn: 'Mortal Strike', level: 40, icon: 'ability_warrior_savageblow' },
    { name: 'Ejecutar', nameEn: 'Execute', level: 24, icon: 'inv_sword_48' },
    { name: 'Provocar', nameEn: 'Taunt', level: 10, icon: 'spell_nature_reincarnation' },
    { name: 'Escudo en Bloque', nameEn: 'Shield Block', level: 16, icon: 'ability_defend' },
    { name: 'Muro de Escudo', nameEn: 'Shield Wall', level: 28, icon: 'ability_warrior_shieldwall' },
    { name: 'Represalias', nameEn: 'Retaliation', level: 20, icon: 'ability_warrior_challange' },
    { name: 'Grito de Intimidación', nameEn: 'Intimidating Shout', level: 22, icon: 'ability_groan' },
    { name: 'Interceptar', nameEn: 'Intercept', level: 30, icon: 'ability_warrior_victoryrush' },
    { name: 'Masa Crítica', nameEn: 'Cleave', level: 20, icon: 'ability_warrior_cleave' },
    { name: 'Desgarrar Armadura', nameEn: 'Sunder Armor', level: 10, icon: 'ability_warrior_sunderarmor' },
    { name: 'Romper Armadura', nameEn: 'Sunder Armor', level: 10, icon: 'ability_warrior_sunderarmor' },
    { name: 'Golpe de Escudo', nameEn: 'Shield Slam', level: 40, icon: 'inv_shield_05' },
    { name: 'Venganza', nameEn: 'Revenge', level: 14, icon: 'ability_warrior_revenge' },
    { name: 'Bloquear Escudo', nameEn: 'Shield Block', level: 16, icon: 'ability_defend' },
    { name: 'Rabia', nameEn: 'Berserker Rage', level: 32, icon: 'spell_nature_ancestralguardian' },
    { name: 'Sed de Sangre', nameEn: 'Bloodthirst', level: 40, icon: 'spell_nature_bloodlust' }
  ],
  paladin: [
    { name: 'Luz Sagrada', nameEn: 'Holy Light', level: 1, icon: 'spell_holy_holybolt' },
    { name: 'Fuego Sagrado', nameEn: 'Holy Fire', level: 20, icon: 'spell_holy_searinglight' },
    { name: 'Consagración', nameEn: 'Consecration', level: 20, icon: 'spell_holy_innerfire' },
    { name: 'Sello del Poder', nameEn: 'Seal of Power', level: 22, icon: 'spell_holy_sealofmight' },
    { name: 'Sello de la Luz', nameEn: 'Seal of Light', level: 30, icon: 'spell_holy_healingaura' },
    { name: 'Juicio', nameEn: 'Judgement', level: 4, icon: 'spell_holy_judgement' },
    { name: 'Bendición de Poder', nameEn: 'Blessing of Might', level: 4, icon: 'spell_holy_greaterblessingofkings' },
    { name: 'Bendición de Sabiduría', nameEn: 'Blessing of Wisdom', level: 14, icon: 'spell_holy_sealofwisdom' },
    { name: 'Escudo Divino', nameEn: 'Divine Shield', level: 34, icon: 'spell_holy_divineshield' },
    { name: 'Protección Divina', nameEn: 'Divine Protection', level: 6, icon: 'spell_holy_restoration' },
    { name: 'Sanación', nameEn: 'Flash of Light', level: 20, icon: 'spell_holy_flashheal' },
    { name: 'Exorcismo', nameEn: 'Exorcism', level: 20, icon: 'spell_holy_excorcism_02' },
    { name: 'Reprensión', nameEn: 'Hammer of Wrath', level: 44, icon: 'ability_thunderclap' },
    { name: 'Golpe de Cruzado', nameEn: 'Crusader Strike', level: 50, icon: 'spell_holy_crusaderstrike' },
    { name: 'Aura de Devoción', nameEn: 'Devotion Aura', level: 1, icon: 'spell_holy_devotionaura' },
    { name: 'Aura de Retribución', nameEn: 'Retribution Aura', level: 16, icon: 'spell_holy_auraoflight' },
    { name: 'Imposición de Manos', nameEn: 'Lay on Hands', level: 10, icon: 'spell_holy_layonhands' },
    { name: 'Bendición de Protección', nameEn: 'Blessing of Protection', level: 10, icon: 'spell_holy_sealofprotection' },
    { name: 'Bendición de Libertad', nameEn: 'Blessing of Freedom', level: 18, icon: 'spell_holy_sealofvalor' }
  ],
  hunter: [
    { name: 'Disparo Arcano', nameEn: 'Arcane Shot', level: 6, icon: 'spell_arcane_arcaneshot' },
    { name: 'Disparo Serpiente', nameEn: 'Serpent Sting', level: 4, icon: 'ability_hunter_quickshot' },
    { name: 'Marca del Cazador', nameEn: "Hunter's Mark", level: 1, icon: 'ability_hunter_snipershot' },
    { name: 'Flecha de Fuego', nameEn: 'Fire Shot', level: 20, icon: 'spell_fire_firearrow' },
    { name: 'Disparo Múltiple', nameEn: 'Multi-Shot', level: 18, icon: 'ability_upgrademoonglaive' },
    { name: 'Picadura de Escorpión', nameEn: 'Scorpid Sting', level: 22, icon: 'ability_hunter_criticalshot' },
    { name: 'Disparo de Puntería', nameEn: 'Aimed Shot', level: 20, icon: 'inv_spear_07' },
    { name: 'Trampa Helada', nameEn: 'Frost Trap', level: 28, icon: 'spell_frost_freezingbreath' },
    { name: 'Trampa Explosiva', nameEn: 'Explosive Trap', level: 34, icon: 'spell_fire_selfdestruct' },
    { name: 'Trampa de Fuego', nameEn: 'Immolation Trap', level: 16, icon: 'spell_fire_immolation' },
    { name: 'Aspecto del Halcón', nameEn: 'Aspect of the Hawk', level: 4, icon: 'spell_nature_ravenform' },
    { name: 'Aspecto del Guepardo', nameEn: 'Aspect of the Cheetah', level: 20, icon: 'ability_mount_jungletiger' },
    { name: 'Aspecto del Mono', nameEn: 'Aspect of the Monkey', level: 14, icon: 'ability_hunter_aspectofthemonkey' },
    { name: 'Aspecto de la Bestia', nameEn: 'Aspect of the Beast', level: 30, icon: 'ability_mount_pinktiger' },
    { name: 'Fingir Muerte', nameEn: 'Feign Death', level: 30, icon: 'ability_rogue_feigndeath' },
    { name: 'Ahuyentar', nameEn: 'Scare Beast', level: 14, icon: 'ability_druid_cower' },
    { name: 'Congelar Flecha', nameEn: 'Freezing Arrow', level: 40, icon: 'spell_frost_chainsofice' },
    { name: 'Disparo de Ráfaga', nameEn: 'Burst Shot', level: 40, icon: 'ability_hunter_rapidkilling' }
  ],
  rogue: [
    { name: 'Puñalada', nameEn: 'Sinister Strike', level: 1, icon: 'spell_shadow_ritualofsacrifice' },
    { name: 'Eviscerar', nameEn: 'Eviscerate', level: 1, icon: 'ability_rogue_eviscerate' },
    { name: 'Golpe Bajo', nameEn: 'Cheap Shot', level: 4, icon: 'ability_cheapshot' },
    { name: 'Desgarrar', nameEn: 'Rupture', level: 10, icon: 'ability_rogue_rupture' },
    { name: 'Golpe en la Espalda', nameEn: 'Backstab', level: 4, icon: 'ability_backstab' },
    { name: 'Amago', nameEn: 'Feint', level: 6, icon: 'ability_rogue_feint' },
    { name: 'Evocación', nameEn: 'Evasion', level: 8, icon: 'spell_shadow_shadowward' },
    { name: 'Sprint', nameEn: 'Sprint', level: 10, icon: 'ability_rogue_sprint' },
    { name: 'Kick', nameEn: 'Kick', level: 12, icon: 'ability_kick' },
    { name: 'Veneno de Heridas', nameEn: 'Wound Poison', level: 14, icon: 'inv_misc_herb_16' },
    { name: 'Desarmar', nameEn: 'Disarm Trap', level: 16, icon: 'spell_shadow_teleport' },
    { name: 'Sangrado', nameEn: 'Gouge', level: 6, icon: 'ability_gouge' },
    { name: 'Vanish', nameEn: 'Vanish', level: 22, icon: 'ability_vanish' },
    { name: 'Ceguera', nameEn: 'Blind', level: 24, icon: 'spell_shadow_mindsteal' },
    { name: 'Veneno de Mente', nameEn: 'Mind-numbing Poison', level: 24, icon: 'spell_nature_nullifydisease' },
    { name: 'Abrumar', nameEn: 'Kidney Shot', level: 26, icon: 'ability_rogue_kidneyshot' },
    { name: 'Veneno Crippling', nameEn: 'Crippling Poison', level: 20, icon: 'ability_poisonsting' },
    { name: 'Cold Blood', nameEn: 'Cold Blood', level: 30, icon: 'spell_ice_lament' },
    { name: 'Preparación', nameEn: 'Preparation', level: 30, icon: 'spell_shadow_antishadow' },
    { name: 'Adrenaline Rush', nameEn: 'Adrenaline Rush', level: 40, icon: 'spell_shadow_shadowworddominate' }
  ],
  priest: [
    { name: 'Palabra de Poder: Escudo', nameEn: 'Power Word: Shield', level: 6, icon: 'spell_holy_powerwordshield' },
    { name: 'Renovar', nameEn: 'Renew', level: 8, icon: 'spell_holy_renew' },
    { name: 'Curación Menor', nameEn: 'Lesser Heal', level: 1, icon: 'spell_holy_lesserheal' },
    { name: 'Curación', nameEn: 'Heal', level: 16, icon: 'spell_holy_heal' },
    { name: 'Rezo de Curación', nameEn: 'Prayer of Healing', level: 30, icon: 'spell_holy_prayerofhealing02' },
    { name: 'Palabra Sagrada: Castigo', nameEn: 'Holy Word: Chastise', level: 1, icon: 'spell_holy_chastise' },
    { name: 'Castigo', nameEn: 'Smite', level: 1, icon: 'spell_holy_holysmite' },
    { name: 'Palabra de las Sombras: Dolor', nameEn: 'Shadow Word: Pain', level: 4, icon: 'spell_shadow_shadowwordpain' },
    { name: 'Explosión Mental', nameEn: 'Mind Blast', level: 4, icon: 'spell_shadow_unholyfrenzy' },
    { name: 'Control Mental', nameEn: 'Mind Control', level: 30, icon: 'spell_shadow_shadowworddominate' },
    { name: 'Disipar Magia', nameEn: 'Dispel Magic', level: 20, icon: 'spell_holy_dispelmagic' },
    { name: 'Purificar', nameEn: 'Purify', level: 20, icon: 'spell_holy_purify' },
    { name: 'Miedo', nameEn: 'Psychic Scream', level: 14, icon: 'spell_shadow_psychicscream' },
    { name: 'Fuego Sagrado', nameEn: 'Holy Fire', level: 20, icon: 'spell_holy_searinglight' },
    { name: 'Forma de las Sombras', nameEn: 'Shadowform', level: 40, icon: 'spell_shadow_shadowform' },
    { name: 'Palabra de Poder: Fortaleza', nameEn: 'Power Word: Fortitude', level: 1, icon: 'spell_holy_wordfortitude' },
    { name: 'Palabra de Poder: Entereza', nameEn: 'Power Word: Fortitude', level: 1, icon: 'spell_holy_wordfortitude' },
    { name: 'Rezo de Curación', nameEn: 'Prayer of Healing', level: 30, icon: 'spell_holy_prayerofhealing' },
    { name: 'Nova Sagrada', nameEn: 'Holy Nova', level: 40, icon: 'spell_holy_holynova' },
    { name: 'Aliento de la Naturaleza', nameEn: 'Inner Fire', level: 12, icon: 'spell_holy_innerfire' }
  ],
  shaman: [
    { name: 'Relámpago', nameEn: 'Lightning Bolt', level: 1, icon: 'spell_nature_lightningbolt' },
    { name: 'Choque de Tierra', nameEn: 'Earth Shock', level: 4, icon: 'spell_nature_earthshock' },
    { name: 'Choque de Fuego', nameEn: 'Flame Shock', level: 10, icon: 'spell_fire_flameshock' },
    { name: 'Choque de Escarcha', nameEn: 'Frost Shock', level: 20, icon: 'spell_frost_frostshock' },
    { name: 'Rayo', nameEn: 'Chain Lightning', level: 32, icon: 'spell_nature_chainlightning' },
    { name: 'Curación', nameEn: 'Healing Wave', level: 1, icon: 'spell_nature_healingwavegreater' },
    { name: 'Curación Menor', nameEn: 'Lesser Healing Wave', level: 20, icon: 'spell_nature_healingwavelesser' },
    { name: 'Escudo de Relámpago', nameEn: 'Lightning Shield', level: 8, icon: 'spell_nature_lightningshield' },
    { name: 'Arma de Fuego', nameEn: 'Flametongue Weapon', level: 10, icon: 'spell_fire_flametongue' },
    { name: 'Arma de Escarcha', nameEn: 'Frostbrand Weapon', level: 20, icon: 'spell_frost_frostbrand' },
    { name: 'Arma de Viento', nameEn: 'Windfury Weapon', level: 30, icon: 'spell_nature_cyclone' },
    { name: 'Tótem de Fuerza de Tierra', nameEn: 'Strength of Earth Totem', level: 10, icon: 'spell_nature_earthbindtotem' },
    { name: 'Tótem de Piel de Piedra', nameEn: 'Stoneskin Totem', level: 4, icon: 'spell_nature_stoneskintotem' },
    { name: 'Tótem de Sanación', nameEn: 'Healing Stream Totem', level: 20, icon: 'inv_spear_04' },
    { name: 'Tótem de Maná', nameEn: 'Mana Spring Totem', level: 26, icon: 'spell_nature_manaregentotem' },
    { name: 'Tótem de Cólera', nameEn: 'Searing Totem', level: 10, icon: 'spell_fire_searingtotem' },
    { name: 'Tótem de Magma', nameEn: 'Magma Totem', level: 26, icon: 'spell_fire_selfdestruct' },
    { name: 'Tótem de Temblor', nameEn: 'Tremor Totem', level: 18, icon: 'spell_nature_tremortotem' },
    { name: 'Tótem de Limpieza', nameEn: 'Cleansing Totem', level: 38, icon: 'spell_nature_diseasecleansingtotem' },
    { name: 'Tótem de Resistencia al Fuego', nameEn: 'Fire Resistance Totem', level: 24, icon: 'spell_fire_resistfire' },
    { name: 'Tótem de Resistencia a la Escarcha', nameEn: 'Frost Resistance Totem', level: 26, icon: 'spell_frost_resistfrost' },
    { name: 'Tótem de Gracia del Viento', nameEn: 'Grace of Air Totem', level: 42, icon: 'spell_nature_invisibilitytotem' },
    { name: 'Tótem de Cólera de Viento', nameEn: 'Windfury Totem', level: 30, icon: 'spell_nature_windfury' },
    { name: 'Tótem de Garra de Piedra', nameEn: 'Stoneclaw Totem', level: 8, icon: 'spell_nature_stoneclawtotem' },
    { name: 'Tótem de Fuerza de Voluntad', nameEn: 'Grounding Totem', level: 30, icon: 'spell_nature_groundingtotem' },
    { name: 'Tótem de Marea de Maná', nameEn: 'Mana Tide Totem', level: 40, icon: 'spell_frost_summonwaterelemental' },
    { name: 'Tótem de Cólera de Fuego', nameEn: 'Wrath of Air Totem', level: 44, icon: 'spell_nature_slowingtotem' },
    { name: 'Tótem de Furia de Sangre', nameEn: 'Bloodlust', level: 50, icon: 'spell_nature_bloodlust' },
    { name: 'Tótem de Sanación en Cadena', nameEn: 'Chain Heal', level: 40, icon: 'spell_nature_healingwavegreater' },
    { name: 'Forma de Lobo Espectral', nameEn: 'Ghost Wolf', level: 20, icon: 'spell_nature_spiritwolf' }
  ],
  mage: [
    { name: 'Bola de Fuego', nameEn: 'Fireball', level: 1, icon: 'spell_fire_fireball' },
    { name: 'Escarcha', nameEn: 'Frostbolt', level: 4, icon: 'spell_frost_frostbolt02' },
    { name: 'Proyectil Arcano', nameEn: 'Arcane Missiles', level: 8, icon: 'spell_nature_starfall' },
    { name: 'Explosión Arcana', nameEn: 'Arcane Explosion', level: 14, icon: 'spell_nature_wispsplode' },
    { name: 'Nova de Escarcha', nameEn: 'Frost Nova', level: 10, icon: 'spell_frost_frostnova' },
    { name: 'Cono de Frío', nameEn: 'Cone of Cold', level: 26, icon: 'spell_frost_glacier' },
    { name: 'Blizzard', nameEn: 'Blizzard', level: 20, icon: 'spell_frost_icestorm' },
    { name: 'Lluvia de Fuego', nameEn: 'Rain of Fire', level: 20, icon: 'spell_shadow_rainoffire' },
    { name: 'Piroexplosión', nameEn: 'Pyroblast', level: 20, icon: 'spell_fire_fireball02' },
    { name: 'Escudo de Hielo', nameEn: 'Ice Barrier', level: 40, icon: 'spell_ice_lament' },
    { name: 'Bloque de Hielo', nameEn: 'Ice Block', level: 30, icon: 'spell_frost_frost' },
    { name: 'Intelecto Arcano', nameEn: 'Arcane Intellect', level: 1, icon: 'spell_holy_magicalsentry' },
    { name: 'Armadura de Escarcha', nameEn: 'Frost Armor', level: 1, icon: 'spell_frost_frostarmor02' },
    { name: 'Armadura de Magma', nameEn: 'Molten Armor', level: 30, icon: 'spell_fire_firearmor' },
    { name: 'Armadura de Hielo', nameEn: 'Ice Armor', level: 30, icon: 'spell_frost_frostarmor' },
    { name: 'Polimorfia', nameEn: 'Polymorph', level: 8, icon: 'spell_nature_polymorph' },
    { name: 'Contrahechizo', nameEn: 'Counterspell', level: 24, icon: 'spell_frost_iceshock' },
    { name: 'Remover Maldición', nameEn: 'Remove Curse', level: 18, icon: 'spell_holy_removecurse' },
    { name: 'Teletransporte: Ventormenta', nameEn: 'Teleport: Stormwind', level: 20, icon: 'spell_arcane_teleportstormwind' },
    { name: 'Portal: Ventormenta', nameEn: 'Portal: Stormwind', level: 40, icon: 'spell_arcane_portalstormwind' },
    { name: 'Teletransporte: Forjaz', nameEn: 'Teleport: Ironforge', level: 20, icon: 'spell_arcane_teleportironforge' },
    { name: 'Portal: Forjaz', nameEn: 'Portal: Ironforge', level: 40, icon: 'spell_arcane_portalironforge' },
    { name: 'Teletransporte: Darnassus', nameEn: 'Teleport: Darnassus', level: 20, icon: 'spell_arcane_teleportdarnassus' },
    { name: 'Portal: Darnassus', nameEn: 'Portal: Darnassus', level: 40, icon: 'spell_arcane_portaldarnassus' },
    { name: 'Teletransporte: Orgrimmar', nameEn: 'Teleport: Orgrimmar', level: 20, icon: 'spell_arcane_teleportorgrimmar' },
    { name: 'Portal: Orgrimmar', nameEn: 'Portal: Orgrimmar', level: 40, icon: 'spell_arcane_portalorgrimmar' },
    { name: 'Teletransporte: Entrañas', nameEn: 'Teleport: Undercity', level: 20, icon: 'spell_arcane_teleportundercity' },
    { name: 'Portal: Entrañas', nameEn: 'Portal: Undercity', level: 40, icon: 'spell_arcane_portalundercity' },
    { name: 'Teletransporte: Cima del Trueno', nameEn: 'Teleport: Thunder Bluff', level: 20, icon: 'spell_arcane_teleportthunderbluff' },
    { name: 'Portal: Cima del Trueno', nameEn: 'Portal: Thunder Bluff', level: 40, icon: 'spell_arcane_portalthunderbluff' },
    { name: 'Teletransporte: Marjal Revolcafango', nameEn: 'Teleport: Stonard', level: 20, icon: 'spell_arcane_teleportstonard' },
    { name: 'Teletransporte: Theramore', nameEn: 'Teleport: Theramore', level: 20, icon: 'spell_arcane_teleporttheramore' }
  ],
  warlock: [
    { name: 'Descarga de Sombras', nameEn: 'Shadow Bolt', level: 1, icon: 'spell_shadow_shadowbolt' },
    { name: 'Corrupción', nameEn: 'Corruption', level: 4, icon: 'spell_shadow_abominationexplosion' },
    { name: 'Maldición de Debilidad', nameEn: 'Curse of Weakness', level: 4, icon: 'spell_shadow_curseofsargeras' },
    { name: 'Maldición de Agonía', nameEn: 'Curse of Agony', level: 8, icon: 'spell_shadow_curseofsargeras' },
    { name: 'Miedo', nameEn: 'Fear', level: 8, icon: 'spell_shadow_possession' },
    { name: 'Drenar Alma', nameEn: 'Drain Soul', level: 10, icon: 'spell_shadow_haunting' },
    { name: 'Drenar Vida', nameEn: 'Drain Life', level: 14, icon: 'spell_shadow_lifedrain02' },
    { name: 'Maldición de Temeridad', nameEn: 'Curse of Recklessness', level: 14, icon: 'spell_shadow_unholystrength' },
    { name: 'Maldición de Lenguas', nameEn: 'Curse of Tongues', level: 26, icon: 'spell_shadow_curseoftounges' },
    { name: 'Maldición de los Elementos', nameEn: 'Curse of the Elements', level: 32, icon: 'spell_shadow_chilltouch' },
    { name: 'Maldición de las Sombras', nameEn: 'Curse of Shadow', level: 44, icon: 'spell_shadow_curseofsargeras' },
    { name: 'Maldición de la Perdición', nameEn: 'Curse of Doom', level: 60, icon: 'spell_shadow_curseofmannoroth' },
    { name: 'Sanguijuela de Vida', nameEn: 'Siphon Life', level: 30, icon: 'spell_shadow_requiem' },
    { name: 'Drenar Maná', nameEn: 'Drain Mana', level: 24, icon: 'spell_shadow_siphonmana' },
    { name: 'Aullido de Terror', nameEn: 'Howl of Terror', level: 40, icon: 'spell_shadow_deathscream' },
    { name: 'Golpe de Muerte', nameEn: 'Death Coil', level: 42, icon: 'spell_shadow_deathcoil' },
    { name: 'Piel de Demonio', nameEn: 'Demon Skin', level: 1, icon: 'spell_shadow_ragingscream' },
    { name: 'Armadura Demoníaca', nameEn: 'Demon Armor', level: 20, icon: 'spell_shadow_ragingscream' },
    { name: 'Crear Piedra de Salud', nameEn: 'Create Healthstone', level: 10, icon: 'inv_stone_04' },
    { name: 'Crear Piedra de Alma', nameEn: 'Create Soulstone', level: 18, icon: 'inv_misc_orb_04' },
    { name: 'Crear Piedra de Fuego', nameEn: 'Create Firestone', level: 28, icon: 'inv_misc_gem_bloodstone_02' },
    { name: 'Crear Piedra de Hechizo', nameEn: 'Create Spellstone', level: 36, icon: 'inv_misc_gem_sapphire_01' },
    { name: 'Aliento Inagotable', nameEn: 'Unending Breath', level: 16, icon: 'spell_shadow_demonbreath' },
    { name: 'Ojo de Kilrogg', nameEn: 'Eye of Kilrogg', level: 22, icon: 'spell_shadow_evileye' },
    { name: 'Ritual de Invocación', nameEn: 'Ritual of Summoning', level: 20, icon: 'spell_shadow_twilight' },
    { name: 'Detectar Demonios', nameEn: 'Sense Demons', level: 24, icon: 'spell_shadow_metamorphosis' },
    { name: 'Desterrar', nameEn: 'Banish', level: 28, icon: 'spell_shadow_cripple' },
    { name: 'Esclavizar Demonio', nameEn: 'Enslave Demon', level: 30, icon: 'spell_shadow_enslavedemon' },
    { name: 'Pacto Oscuro', nameEn: 'Dark Pact', level: 40, icon: 'spell_shadow_darkritual' },
    { name: 'Invocar Esbirro', nameEn: 'Summon Imp', level: 1, icon: 'spell_shadow_summonimp' },
    { name: 'Invocar Súcubo', nameEn: 'Summon Succubus', level: 20, icon: 'spell_shadow_summonsuccubus' },
    { name: 'Invocar Abisario', nameEn: 'Summon Voidwalker', level: 10, icon: 'spell_shadow_summonvoidwalker' },
    { name: 'Invocar Cazador de Demonios', nameEn: 'Summon Felhunter', level: 30, icon: 'spell_shadow_summonfelhunter' },
    { name: 'Invocar Corcel Vil', nameEn: 'Summon Felsteed', level: 40, icon: 'spell_nature_swiftness' },
    { name: 'Invocar Corcel de la Muerte', nameEn: 'Summon Dreadsteed', level: 60, icon: 'spell_nature_swiftness' }
  ],
  druid: [
    { name: 'Cólera', nameEn: 'Wrath', level: 1, icon: 'spell_nature_wrathv2' },
    { name: 'Sanar', nameEn: 'Healing Touch', level: 1, icon: 'spell_nature_healingtouch' },
    { name: 'Marca de lo Salvaje', nameEn: 'Mark of the Wild', level: 1, icon: 'spell_nature_regeneration' },
    { name: 'Fuego Lunar', nameEn: 'Moonfire', level: 4, icon: 'spell_nature_starfall' },
    { name: 'Rejuvenecimiento', nameEn: 'Rejuvenation', level: 4, icon: 'spell_nature_rejuvenation' },
    { name: 'Enredar', nameEn: 'Entangling Roots', level: 8, icon: 'spell_nature_stranglevines' },
    { name: 'Forma de Oso', nameEn: 'Bear Form', level: 10, icon: 'ability_racial_bearform' },
    { name: 'Regeneración', nameEn: 'Regrowth', level: 12, icon: 'spell_nature_regenerate' },
    { name: 'Forma de Lobo', nameEn: 'Cat Form', level: 20, icon: 'ability_druid_catform' },
    { name: 'Zarpa', nameEn: 'Claw', level: 20, icon: 'ability_druid_rake' },
    { name: 'Mordisco', nameEn: 'Bite', level: 20, icon: 'ability_druid_ferociousbite' },
    { name: 'Desgarrar', nameEn: 'Rip', level: 24, icon: 'ability_creature_poison_06' },
    { name: 'Forma de Viaje', nameEn: 'Travel Form', level: 30, icon: 'ability_druid_travelform' },
    { name: 'Forma de Lechúcico', nameEn: 'Moonkin Form', level: 40, icon: 'spell_nature_forceofnature' },
    { name: 'Forma de Lobo Espectral', nameEn: 'Ghost Wolf', level: 20, icon: 'spell_nature_spiritwolf' },
    { name: 'Curación Rápida', nameEn: 'Swiftmend', level: 40, icon: 'ability_druid_swiftmend' },
    { name: 'Naturaleza Veloz', nameEn: 'Nature\'s Swiftness', level: 30, icon: 'spell_nature_ravenform' },
    { name: 'Fuego Estelar', nameEn: 'Starfire', level: 20, icon: 'spell_arcane_starfire' },
    { name: 'Huracán', nameEn: 'Hurricane', level: 40, icon: 'spell_nature_cyclone' },
    { name: 'Tranquilidad', nameEn: 'Tranquility', level: 30, icon: 'spell_nature_tranquility' },
    { name: 'Innervar', nameEn: 'Innervate', level: 40, icon: 'spell_nature_lightning' },
    { name: 'Eliminar Maldición', nameEn: 'Remove Curse', level: 24, icon: 'spell_holy_removecurse' },
    { name: 'Abrasar', nameEn: 'Abolish Poison', level: 26, icon: 'spell_nature_nullifypoison_02' },
    { name: 'Curación en Grupo', nameEn: 'Healing Touch', level: 1, icon: 'spell_nature_healingtouch' }
  ]
};

// Opciones de macro con descripciones para tooltips
const MACRO_OPTIONS = [
  { id: 'showtooltip', label: '#showtooltip', desc: 'Muestra el icono y tooltip del primer hechizo en la macro. Siempre recomendado.', default: true },
  { id: 'startattack', label: '/startattack', desc: 'Inicia el ataque automático contra el objetivo actual. Útil para guerreros, pícaros, cazadores, etc.', default: false },
  { id: 'petattack', label: '/petattack', desc: 'Ordena a tu mascota atacar al objetivo actual. Para cazadores, brujos y caballeros de la muerte.', default: false },
  { id: 'stopcasting', label: '/stopcasting', desc: 'Interrumpe el lanzamiento actual. Útil para macros de interrupción o emergencia.', default: false },
  { id: 'cancelaura', label: '/cancelaura [nombre]', desc: 'Cancela un buff o aura específico. Ejemplo: /cancelaura Bloque de Hielo.', default: false },
  { id: 'castsequence', label: '/castsequence reset=...', desc: 'Convierte la secuencia en un castsequence que avanza paso a paso con cada pulsación.', default: false },
  { id: 'mouseover', label: '[@mouseover]', desc: 'El hechizo se lanza sobre el objetivo bajo el cursor, sin necesidad de seleccionarlo.', default: false },
  { id: 'harm', label: '[harm]', desc: 'Solo lanza el hechizo si el objetivo es hostil. Para hechizos de daño.', default: false },
  { id: 'help', label: '[help]', desc: 'Solo lanza el hechizo si el objetivo es amistoso. Para hechizos de curación o buffs.', default: false },
  { id: 'nodead', label: '[nodead]', desc: 'Solo lanza el hechizo si el objetivo está vivo. Evita desperdiciar hechizos en cadáveres.', default: false },
  { id: 'exists', label: '[exists]', desc: 'Solo lanza el hechizo si el objetivo existe. Evita errores cuando no hay objetivo.', default: false },
  { id: 'combat', label: '[combat]', desc: 'Solo lanza el hechizo si estás en combate.', default: false },
  { id: 'nostance', label: '[nostance]', desc: 'Solo lanza el hechizo si no estás en una forma o actitud específica.', default: false },
  { id: 'mod', label: '[mod:shift/ctrl/alt]', desc: 'Añade una rama condicional para modificadores de teclado. Requiere configurar los checkboxes de abajo.', default: false }
];

