document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fadeInUp-animation");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute("data-delay") || "0"; // Default delay is 0s
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add("fadeInUp-visible");
                observer.unobserve(entry.target); // Stop observing after animation plays
            }
        });
    }, { threshold: 0.05 });

    elements.forEach(element => observer.observe(element));
});
