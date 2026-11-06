// ==================== INICIALIZACIÓN ====================
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  
  document.getElementById(`tab-${tabName}`).classList.add('active');
  event.target.classList.add('active');
}

// Iniciar al cargar
document.addEventListener('DOMContentLoaded', () => {
  initSelects();
  updateOptions();
  
  // Inicializar secuencia vacía
  renderSequence();
  
  // Configurar evento para el nivel de talentos
  document.getElementById('talentLevelInput').addEventListener('change', onTalentLevelChange);

  // Registrar Service Worker (PWA)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registrado:', reg.scope))
      .catch(err => console.warn('SW no registrado:', err));
  }
});
