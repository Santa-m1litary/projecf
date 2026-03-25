/* ===========================
   home.js — скрипти головної сторінки
   ArenaFlow
   =========================== */

// --- Анімація карточок при скролі ---
const cards = document.querySelectorAll('.card');
const featuresTitle = document.querySelector('.features-title');

function checkVisible() {
    cards.forEach(card => {
        const top = card.getBoundingClientRect().top;
        if (top < window.innerHeight) {
            card.classList.add('show');
        }
    });

    if (featuresTitle) {
        const top = featuresTitle.getBoundingClientRect().top;
        if (top < window.innerHeight) {
            featuresTitle.classList.add('show');
        }
    }
}

window.addEventListener('scroll', checkVisible);
// Запустити після повного завантаження сторінки
window.addEventListener('load', checkVisible);
document.addEventListener('DOMContentLoaded', checkVisible);

// --- Підказка "гортай вниз" зникає після скролу ---
const scrollHint = document.querySelector('.scroll-hint');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80 && scrollHint) {
        scrollHint.style.opacity = '0';
        scrollHint.style.pointerEvents = 'none';
    }
});

// --- Клік по підказці — плавний скрол до карточок ---
if (scrollHint) {
    scrollHint.addEventListener('click', () => {
        document.querySelector('.features').scrollIntoView({ behavior: 'smooth' });
    });
}
