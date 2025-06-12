async function loadHeader() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer) return;
  
  // Cache busting query string
  const response = await fetch('https://cdn.jsdelivr.net/gh/risestem/rise@72a0449/header.html');
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

  // Highlight current page
  highlightCurrentPage();

  setupContactModal();
}

function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    // Compare only the pathname for robustness (ignores query/hash)
    if (link.pathname === currentPath || currentPath.startsWith(link.pathname)) {
      link.classList.add('text-purple-950');
      link.classList.remove('text-gray-500');

      // If inside dropdown, highlight parent link too
      const parentLi = link.closest('li.group');
      if (parentLi) {
        const parentLink = parentLi.querySelector('a');
        if (parentLink) {
          parentLink.classList.add('text-purple-950');
          parentLink.classList.remove('text-gray-500');
        }
      }
    }
  });
}

// Load the header
loadHeader();

