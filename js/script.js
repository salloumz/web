(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ----------------------------------------------------------------------
       Reveal sections as they scroll into view.
       The `js-reveal` flag on <html> is what makes .section start hidden, so a
       page with broken/blocked JS still shows all of its content.
       ---------------------------------------------------------------------- */
    function initReveal() {
        var sections = document.querySelectorAll('.section');
        if (!sections.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(sections, function (section) {
                section.classList.add('visible');
            });
            return;
        }

        document.documentElement.classList.add('js-reveal');

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Reveal once; re-hiding on scroll-up made the page flicker.
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -20% 0px' });

        Array.prototype.forEach.call(sections, function (section) {
            observer.observe(section);
        });
    }

    /* ----------------------------------------------------------------------
       Hide the scroll hint once the page is actually at the bottom.
       ---------------------------------------------------------------------- */
    function initScrollIndicator() {
        var scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return; // not present on every page

        var ticking = false;

        function update() {
            ticking = false;
            var doc = document.documentElement;
            var maxScroll = doc.scrollHeight - window.innerHeight;
            // No scrollable area at all: nothing to hint at.
            var atBottom = maxScroll <= 0 || window.scrollY >= maxScroll - 4;
            scrollIndicator.classList.toggle('hidden', atBottom);
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    /* ----------------------------------------------------------------------
       Mark the current page in the navbar.
       ---------------------------------------------------------------------- */
    function initActiveNav() {
        var current = window.location.pathname.split('/').pop() || 'index.html';
        var links = document.querySelectorAll('.navbar-link');

        Array.prototype.forEach.call(links, function (link) {
            var href = link.getAttribute('href');
            if (href === current) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /* ----------------------------------------------------------------------
       Particle backdrop. Purely decorative, so every failure path is silent
       and the config is toned down on small screens / reduced motion.
       ---------------------------------------------------------------------- */
    function initParticles() {
        if (!document.getElementById('particles-js')) return;
        if (typeof window.particlesJS === 'undefined') return; // CDN blocked or offline

        fetch('assets/particles.json')
            .then(function (response) {
                if (!response.ok) throw new Error('Bad response: ' + response.status);
                return response.json();
            })
            .then(function (config) {
                if (window.innerWidth < 700) {
                    config.particles.number.value = 40;
                    config.particles.line_linked.distance = 110;
                }
                if (prefersReducedMotion) {
                    config.particles.move.enable = false;
                }
                window.particlesJS('particles-js', config);
            })
            .catch(function () {
                // Falls back to the library's own loader; if that fails too the
                // page simply renders on the plain black background.
                try {
                    window.particlesJS.load('particles-js', 'assets/particles.json');
                } catch (e) {
                    /* no-op */
                }
            });
    }

    function init() {
        initReveal();
        initScrollIndicator();
        initActiveNav();
        initParticles();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
