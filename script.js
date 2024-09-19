function setParticleContainerHeight() {
    var particlesContainer = document.getElementById('particles-js');
    particlesContainer.style.height = window.innerHeight + 'px';
}

window.addEventListener('load', setParticleContainerHeight);
window.addEventListener('resize', setParticleContainerHeight);


window.addEventListener('scroll', function() {
    var scrollIndicator = document.querySelector('.scroll-indicator');
    var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    var bottomReached = (window.scrollY + window.innerHeight) >= scrollableHeight;

    if (bottomReached) {
        scrollIndicator.classList.add('hidden');
        
    } else {
        scrollIndicator.classList.remove('hidden');
    }
});

// Function to add 'visible' class to sections when they come into view
function handleScroll() {
    var sections = document.querySelectorAll('.section');
    var triggerBottom = window.innerHeight / 1.3; // Adjust to trigger visibility earlier

    sections.forEach(function(section) {
        var sectionTop = section.getBoundingClientRect().top;

        // Add 'visible' class when the section is in view
        if (sectionTop < triggerBottom) {
            section.classList.add('visible');
        } else {
            section.classList.remove('visible');
        }
    });
}

// Run the scroll handler on page load and when scrolling
window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);



// Load Particles.js and set particles to cover the viewport
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('Particles.js config loaded');
});
