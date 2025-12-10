// ---------- Persistencia inicial del tema ---------- 
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem('osc-theme');
  if (saved === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // ====== ESC para cerrar cualquiera de los dos modales ======
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    if (oscModal && oscModal.classList.contains('open')) {
      closeOscModal();
    }

    if (reporteModal && reporteModal.classList.contains('open')) {
      closeReporteModal();
    }
  });

  const root = document.documentElement;

  // Activar animaciones de carga de página
  document.body.classList.add('page-loaded');

  
  /* ====== Router SPA (cambio de vistas) ====== */
  const navBtns = document.querySelectorAll('.nav-btn');
  const views  = document.querySelectorAll('.view');

  const showView = (route, push = true) => {
    let found = false;

    navBtns.forEach(btn => {
      const isActive = btn.dataset.route === route;
      btn.classList.toggle('active', isActive);
      if (isActive) found = true;
    });

    views.forEach(view => {
      view.classList.toggle('active', view.id === `view-${route}`);
    });

    // Si la ruta NO existe → vuelve a inicio
    if (!found && route !== 'inicio') {
      return showView('inicio', push);
    }

    if (push) {
      history.pushState({ route }, '', `#${route}`);
    }
  };


  navBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const route = btn.dataset.route;
      showView(route);
    });
  });

  // Ruta inicial desde el hash o 'inicio'
  const initialRoute = (location.hash || '#inicio').replace('#', '');
  showView(initialRoute, false);

  // Manejar botón atrás/adelante del navegador
  window.addEventListener('popstate', e => {
    const route = e.state && e.state.route ? e.state.route : 'inicio';
    showView(route, false);
  });

  /* ====== Sidebar retráctil con persistencia ====== */
  const sidebar = document.querySelector('.nav-sidebar');
  const body    = document.body;
  const btn     = document.getElementById('toggleNav');
  const arrow   = document.getElementById('collapseIcon');
  const KEY     = 'osc-nav-collapsed';

  if (sidebar && btn && arrow) {
    const apply = (collapsed) => {
      sidebar.classList.toggle('collapsed', collapsed);
      body.classList.toggle('nav-collapsed', collapsed);
      arrow.src = collapsed ? 'assets/icons/arrow-right.svg' : 'assets/icons/arrow-left.svg';
      btn.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
      localStorage.setItem(KEY, collapsed ? '1' : '0');
    };

    // Estado inicial desde localStorage
    apply(localStorage.getItem(KEY) === '1');

    // Click para alternar
    btn.addEventListener('click', () => {
      const next = !sidebar.classList.contains('collapsed');
      apply(next);
    });
  }

  /* === PUBLICACIONES: BOTONES QUE ABREN EN NUEVA PESTAÑA === */
  const pubButtons = document.querySelectorAll('.pub-btn-link, .pub-edition-link');
  if (pubButtons.length) {
    pubButtons.forEach(btn => {
      const link = btn.getAttribute('data-link');
      if (!link) return;
      btn.addEventListener('click', () => {
        window.open(link, '_blank');
      });
    });
  }

  /* === REVISTA SABER SERVIR: DESPLEGABLE POR AÑO === */
  const yearToggles = document.querySelectorAll('.pub-year-toggle');

  if (yearToggles.length) {
    yearToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-target');
        const panel = document.getElementById(targetId);
        if (!panel) return;

        const parentCard = toggle.closest('.pub-card-neu');
        const isOpen = panel.classList.contains('open');

        if (parentCard) {
          parentCard.querySelectorAll('.pub-year-panel.open').forEach(p => {
            if (p !== panel) p.classList.remove('open');
          });
          parentCard.querySelectorAll('.pub-year-toggle.open').forEach(t => {
            if (t !== toggle) t.classList.remove('open');
          });
        }

        panel.classList.toggle('open', !isOpen);
        toggle.classList.toggle('open', !isOpen);
      });
    });
  }

  /* ====== MODAL: ¿Qué es el OSC? ====== */
  const infoButton   = document.getElementById('infoButton');
  const oscModal     = document.getElementById('oscModal');
  const oscClose     = document.getElementById('oscModalClose');
  const oscBackdrop  = document.getElementById('oscModalBackdrop');
  const openOscModal = () => {
    if (!oscModal) return;
    oscModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeOscModal = () => {
    if (!oscModal) return;
    oscModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (infoButton && oscModal) {
    infoButton.addEventListener('click', openOscModal);
  }
  if (oscClose) {
    oscClose.addEventListener('click', closeOscModal);
  }
  if (oscBackdrop) {
    oscBackdrop.addEventListener('click', closeOscModal);
  }

  /* ====== MODAL: REPORTE OSC ====== */
  const btnReporteOSC   = document.getElementById('reporteOSC');
  const reporteModal    = document.getElementById('reporteModal');
  const reporteClose    = document.getElementById('reporteModalClose');
  const reporteBackdrop = document.getElementById('reporteModalBackdrop');

  const openReporteModal = () => {
    if (!reporteModal) return;
    reporteModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeReporteModal = () => {
    if (!reporteModal) return;
    reporteModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (btnReporteOSC)   btnReporteOSC.addEventListener('click', openReporteModal);
  if (reporteClose)    reporteClose.addEventListener('click', closeReporteModal);
  if (reporteBackdrop) reporteBackdrop.addEventListener('click', closeReporteModal);
});
