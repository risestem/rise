async function loadHeader() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer) return;
  
  // Cache busting query string
  const response = await fetch('/components/header.html');
  if (!response.ok) {
    console.error('Failed to load header.html');
    return;
  }
  
  const headerHTML = await response.text();
  headerContainer.innerHTML = headerHTML;
  
  // Initialize header functionality after HTML is loaded
  initializeHeader();

  document.dispatchEvent(new Event('header:loaded'));
}

function initializeHeader() {
  // Hamburger toggle
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navbar = document.getElementById("navbar-sticky");
  
  if (hamburgerBtn && navbar) {
    hamburgerBtn.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      navbar.classList.toggle("hidden", isExpanded);
      this.setAttribute("aria-expanded", (!isExpanded).toString());
    });
  }

  setupDropdowns(navbar);
  highlightCurrentPage();

}

function setupDropdowns(navbar) {
  if (!navbar) return;
  const toggles = [...navbar.querySelectorAll('[data-nav-toggle]')];

  function setExpanded(toggle, expanded) {
    toggle.setAttribute('aria-expanded', String(expanded));
    document.getElementById(toggle.getAttribute('aria-controls')).hidden = !expanded;
  }

  toggles.forEach(toggle => {
    const dropdown = toggle.closest('[data-nav-dropdown]');
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggles.forEach(other => setExpanded(other, other === toggle && !expanded));
    });
    dropdown.addEventListener('focusout', event => {
      if (!dropdown.contains(event.relatedTarget)) setExpanded(toggle, false);
    });
    dropdown.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
      setExpanded(toggle, false);
      toggle.focus();
    });
  });

  document.addEventListener('click', event => {
    toggles.forEach(toggle => {
      if (!toggle.closest('[data-nav-dropdown]').contains(event.target)) setExpanded(toggle, false);
    });
  });
}

// Compare normalized local routes, never an external link's pathname.
function normalizePath(path) {
  const normalized = path.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  return normalized === '/' ? '/home' : normalized;
}

function highlightCurrentPage() {
  const currentPath = normalizePath(window.location.pathname);
  document.querySelectorAll('#header-container nav a[href]').forEach(link => {
    const url = new URL(link.href, window.location.href);
    const active = url.origin === window.location.origin &&
      normalizePath(url.pathname) === currentPath;
    link.classList.toggle('text-purple-950', active);
    if (active) {
      link.classList.remove('text-gray-500');
      link.setAttribute('aria-current', 'page');
      const parent = link.closest('[data-nav-dropdown]')?.querySelector('[data-nav-toggle]');
      if (parent) {
        parent.classList.add('text-purple-950');
        parent.classList.remove('text-gray-500');
      }
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Load the header
loadHeader();

