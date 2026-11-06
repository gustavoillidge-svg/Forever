// ==================== INICIALIZACIÓN ====================
function switchTab(tabName, ev) {
  // Talentos oculto por diseño (foco en macros); mantener función por compatibilidad.
  if (tabName === 'talents') tabName = 'macros';
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById(`tab-${tabName}`);
  if (panel) panel.classList.add('active');
  const btn = (ev && ev.target) ? ev.target.closest('.tab-btn') : null;
  if (btn) btn.classList.add('active');
}

// Iniciar al cargar
document.addEventListener('DOMContentLoaded', () => {
  initSelects();
  updateOptions();
  renderSequence();
  const tl = document.getElementById('talentLevelInput');
  if (tl) tl.addEventListener('change', onTalentLevelChange);

  // Registrar Service Worker (PWA)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registrado:', reg.scope))
      .catch(err => console.warn('SW no registrado:', err));
  }
});
