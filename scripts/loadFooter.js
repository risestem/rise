const footerHTML = `
<footer class="w-full bg-gray-50 text-gray-500 px-6 sm:px-12 md:px-24 lg:px-32 pt-8 pb-4">
  <div class="flex flex-wrap justify-between items-start gap-8">

    <!-- Logo -->
    <a href="/rise/home" class="flex items-center">
      <img src="/public/logo1.svg" alt="RISE STEM Logo" class="h-12 sm:h-16 w-12 sm:w-16" />
    </a>

    <!-- Contact Info -->
    <div class="text-sm sm:text-md space-y-1">
      <div><strong>Email:</strong> <a href="mailto:rise.stemedu@gmail.com" class="text-blue-500 hover:underline">rise.stemedu@gmail.com</a></div>
      <div><strong>Phone:</strong> <a href="tel:+17064241613" class="text-blue-500 hover:underline">+1 (706)-424-1613</a></div>
    </div>

    <!-- Navigation Links -->
    <div class="text-sm sm:text-md space-y-1 font-bold">
      <div><a href="/rise/about" class="hover:underline">About</a></div>
      <div><a href="/rise/faq" class="hover:underline">FAQ</a></div>
      <div><a href="/rise/news" class="hover:underline">News</a></div>
    </div>

    <!-- Policies and Socials -->
    <div class="text-sm sm:text-md space-y-2">
      <div>
        <a href="/rise/privacy-policy" class="hover:underline">Privacy Policy</a> &nbsp;|&nbsp;
        <a href="/rise/terms" class="hover:underline">Terms of Use</a>
      </div>
      <div class="flex space-x-4 pt-2">
        <a href="#" aria-label="YouTube" class="hover:text-blue-500">YouTube</a>
        <a href="#" aria-label="Instagram" class="hover:text-blue-500">Instagram</a>
        <a href="#" aria-label="LinkedIn" class="hover:text-blue-500">LinkedIn</a>
      </div>
    </div>

  </div>

  <!-- Copyright -->
  <div class="text-xs text-center text-gray-400 mt-6 border-t border-gray-200 pt-4">
    © 2025 RISE STEM, Inc. All rights reserved.
  </div>
</footer>
`;

document.getElementById("footer-container").innerHTML = footerHTML;
