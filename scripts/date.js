// date.js - Handles dynamic dates

document.addEventListener('DOMContentLoaded', function() {
    // Current year
    const yearSpan = document.getElementById('currentyear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Last modified date
    const lastModifiedSpan = document.getElementById('lastModifiedDate');
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }
});