// navigation.js - Handles hamburger menu toggle

document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menu');
    const nav = document.querySelector('.navigation');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
            this.classList.toggle('open');
            nav.classList.toggle('open');
        });

        // Close menu when a link is clicked
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuBtn.classList.remove('open');
                nav.classList.remove('open');
            });
        });
    }
});