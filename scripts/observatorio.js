// ---------- Persistencia inicial del tema ----------
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem('osc-theme');
  if (saved === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // Activar animaciones de carga de página
  document.body.classList.add('page-loaded');

  /* ====== Toggle de tema claro/oscuro ====== */
  const checkbox = document.getElementById('toggleTheme');
  if (checkbox) {
    const isDark = root.getAttribute('data-theme') === 'dark';
    checkbox.checked = isDark;

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('osc-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
        localStorage.setItem('osc-theme', 'light');
      }
    });
  }

  /* ====== Router SPA (cambio de vistas) ====== */
  const navBtns = document.querySelectorAll('.nav-btn');
  const views  = document.querySelectorAll('.view');

  const showView = (route, push = true) => {
    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === route);
    });
    views.forEach(view => {
      view.classList.toggle('active', view.id === `view-${route}`);
    });
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
  const pubButtons = document.querySelectorAll('.pub-btn-link');
  if (pubButtons.length) {
    pubButtons.forEach(btn => {
      const link = btn.getAttribute('data-link');
      if (!link) return; // si no hay link, no hace nada
      btn.addEventListener('click', () => {
        window.open(link, '_blank', 'noopener');
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && oscModal && oscModal.classList.contains('open')) {
      closeOscModal();
    }
  });
});
