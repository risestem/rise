// loadHeader.js
async function loadHeader() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer) return;
  
  const response = await fetch('https://cdn.jsdelivr.net/gh/risestem/rise/header.html' + Date.now());
  if (!response.ok) {
    console.error('Failed to load header.html');
    return;
  }
  
  const headerHTML = await response.text();
  headerContainer.innerHTML = headerHTML;
  
  // Initialize header functionality after HTML is loaded
  initializeHeader();
}

function initializeHeader() {
  // Hamburger toggle
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navbar = document.getElementById("navbar-sticky");
  
  if (hamburgerBtn && navbar) {
    hamburgerBtn.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      navbar.classList.toggle("hidden", isExpanded);
      this.setAttribute("aria-expanded", !isExpanded);
    });
  }

  // Highlight current page
  highlightCurrentPage();
}

function highlightCurrentPage() {
  const currentURL = window.location.href;
  const navLinks = document.querySelectorAll('nav a');

  console.log("Current page URL:", currentURL);
  console.log("Checking navigation links...");

  navLinks.forEach(link => {
    console.log(`Checking link: ${link.href}`);
    
    if (link.href === currentURL) {
      console.log(`Match found! Highlighting link: ${link.href}`);
      link.classList.add('text-purple-950');
      link.classList.remove('text-gray-500');

      if (link.closest('li.group')) {
        console.log("Link is inside a dropdown. Highlighting parent link.");
        const aboutParent = document.querySelector('li.group > a');
        if (aboutParent) {
          aboutParent.classList.add('text-purple-950');
          aboutParent.classList.remove('text-gray-500');
        } else {
          console.warn("Could not find the dropdown parent anchor.");
        }
      }
    }
  });
}

// Load the header
loadHeader();
