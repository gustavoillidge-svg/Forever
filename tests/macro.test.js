// Minimal Node tests for buildMacro (run: node tests/macro.test.js)
const assert = require('assert');
global.CLASSES = {}; global.RACES = {}; global.RACE_CLASSES = {}; global.MACRO_META = { charLimit: 255 };
const { buildMacro, sanitizeAuraName, raceAllowsClass } = require('../js/macros.js');

function ok(name, fn){ try{ fn(); console.log('OK:', name); } catch(e){ console.error('FAIL:', name, e.message); process.exitCode=1; } }

ok('showtooltip first + cast only macro', () => {
  const r = buildMacro([{name:'Cargar',nameEn:'Charge'}], {showtooltip:true});
  assert.strictEqual(r.macro, '#showtooltip\n/cast Cargar');
  assert.strictEqual(r.warnings.length, 0);
});
ok('uses EN names when lang=en', () => {
  const r = buildMacro([{name:'Cargar',nameEn:'Charge'}], {lang:'en'});
  assert.strictEqual(r.macro, '/cast Charge');
});
ok('startattack/stopcasting lines present', () => {
  const r = buildMacro([{name:'Golpe',nameEn:'Strike'}], {showtooltip:true,stopcasting:true,startattack:true});
  assert.ok(r.macro.startsWith('#showtooltip\n/stopcasting\n/startattack\n/cast'));
});
ok('castsequence joins names, no warning copy text', () => {
  const r = buildMacro([{name:'A'},{name:'B'}], {castsequence:true});
  assert.strictEqual(r.macro, '/castsequence reset=target A, B');
  assert.ok(!r.macro.includes('Advertencias'));
});
ok('harm omitted for friendly first spell', () => {
  const r = buildMacro([{name:'Luz Sagrada',nameEn:'Holy Light',role:'heal'}], {harm:true});
  assert.strictEqual(r.macro, '/cast Luz Sagrada');
  assert.ok(r.warnings.some(w=>/harm/i.test(w)));
});
ok('help omitted for hostile first spell', () => {
  const r = buildMacro([{name:'Ejecutar',nameEn:'Execute',role:'damage'}], {help:true});
  assert.strictEqual(r.macro, '/cast Ejecutar');
  assert.ok(r.warnings.some(w=>/help/i.test(w)));
});
ok('mouseover without help/harm warns', () => {
  const r = buildMacro([{name:'X'}], {mouseover:true});
  assert.ok(r.warnings.some(w=>/mouseover/i.test(w)));
});
ok('mod branches generated', () => {
  const r = buildMacro([{name:'A'},{name:'B'}], {mod:true,mods:['shift','ctrl']});
  assert.ok(r.macro.startsWith('/cast [mod:shift] A; [mod:ctrl] B; B'));
});
ok('mods not applied to castsequence', () => {
  const r = buildMacro([{name:'A'}], {castsequence:true,mod:true,mods:['shift']});
  assert.ok(r.warnings.some(w=>/castsequence/i.test(w)));
});
ok('cancelaura sanitized', () => {
  assert.strictEqual(sanitizeAuraName('#/Bloque de Hielo\n'), 'Bloque de Hielo');
  const r = buildMacro([{name:'A'}], {cancelaura:true,cancelauraName:'\n#Hielo'});
  assert.ok(r.macro.includes('/cancelaura Hielo'));
});
ok('char limit warning', () => {
  global.MACRO_META.charLimit = 10;
  const r = buildMacro([{name:'Nombre Muy Largo'}], {});
  assert.ok(r.warnings.some(w=>/Excede|caracter/i.test(w)));
  global.MACRO_META.charLimit = 255;
});
ok('raceAllowsClass permissive when missing', () => {
  assert.strictEqual(raceAllowsClass('unknown','mage'), true);
});
ok('copy safety: macro has no advertencias', () => {
  const r = buildMacro([{name:'X'}], {mouseover:true});
  assert.ok(!r.macro.includes('Advertencias'));
});

console.log('\nDone. exit', process.exitCode||0);
process.exit(process.exitCode||0);
