const footerHTML = `
<footer class="w-full bg-gray-50 text-gray-600 px-6 sm:px-12 md:px-24 lg:px-32 pt-8 pb-4 font-semibold text-sm sm:text-base">
  <div class="flex flex-col gap-3"><!-- reduced gap for less vertical space -->

    <!-- Top Row: Logo + Contact Info + Navigation (all inline, compact) -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <a href="/home" class="flex items-center">
          <img src="/public/logo1.svg" alt="RISE STEM Logo" class="h-12 sm:h-16 w-12 sm:w-16" />
        </a>
        <div class="flex flex-col justify-center text-sm sm:text-base leading-tight">
          <div>
            <a class="hover:text-gray-500 text-gray-500 font-semibold">Email:</a>
            <a href="mailto:rise.stemedu@gmail.com" class="text-gray-500 hover:text-blue-500 hover:underline font-medium">rise.stemedu@gmail.com</a>
          </div>
          <div>
            <a class="hover:text-gray-500 text-gray-500 font-semibold">Phone:</a>
            <a href="tel:+17064241613" class="text-gray-500 hover:underline hover:text-blue-500 font-medium">+1 (706)-424-1613</a>
          </div>
        </div>
      </div>

      <!-- Navigation, Policy, Socials (all in 1 row, right of logo+contact) -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-sm sm:text-base">
        <!-- Navigation Links -->
        <div class="flex space-x-3">
          <a href="/about" class="hover:text-purple-950">About</a>
          <a href="/questions" class="hover:text-purple-950">FAQ</a>
          <a href="/news" class="hover:text-purple-950">News</a>
        </div>
        <!-- Policies -->
        <div class="flex space-x-2">
          <a href="/privacy-policy" class="hover:text-purple-950">Privacy Policy</a>
          <span class="text-gray-300">|</span>
          <a href="/terms" class="hover:text-purple-950">Terms of Use</a>
        </div>
        <!-- Social Icons -->
        <div class="flex items-center space-x-3">
          <a href="#" aria-label="YouTube" class="hover:text-purple-950" title="YouTube">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
          </a>
          <a href="#" aria-label="Instagram" class="hover:text-purple-950" title="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="#" aria-label="LinkedIn" class="hover:text-purple-950" title="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="text-s text-center text-gray-400 mt-3 border-t border-gray-200 pt-3">
      © 2025 RISE STEM, Inc. All rights reserved.
    </div>
  </div>
</footer>
`;

document.getElementById("footer-container").innerHTML = footerHTML;
