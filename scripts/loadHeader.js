// loadHeader.js
async function loadHeader() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer) return;

  const response = await fetch('https://cdn.jsdelivr.net/gh/risestem/rise/header.html');
  if (!response.ok) {
    console.error('Failed to load header.html');
    return;
  }
  const headerHTML = await response.text();
  headerContainer.innerHTML = headerHTML;
}
loadHeader();
