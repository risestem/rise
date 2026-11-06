function revealOnScroll() {
    const elements = document.querySelectorAll('.fadeInUp-animation');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.remove('fadeInUp-pending');
            entry.target.classList.add('fadeInUp-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

    elements.forEach(element => {
        // Nested reveals compound the motion and make text feel sluggish.
        if (element.parentElement.closest('.fadeInUp-animation')) return;
        element.classList.add('fadeInUp-pending');
        observer.observe(element);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealOnScroll, { once: true });
} else {
    revealOnScroll();
}
