// Theme toggle (always follows device theme on load — toggle works for current session only)
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
});

// React instantly if user changes OS theme while site is open
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
});

// Mobile nav
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
});

navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navMobile.classList.remove('open'));
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 80) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

// Scroll-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Copy email to clipboard
let copyTimer = null;

document.querySelectorAll('.copy-email-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        navigator.clipboard.writeText('sdineshkumar1208@gmail.com').then(() => {
            document.querySelectorAll('.copy-email-trigger').forEach(b => {
                b.classList.remove('copied');
                if (b.classList.contains('btn')) b.textContent = 'Copy Email Address';
            });
            btn.classList.add('copied');
            if (btn.classList.contains('btn')) btn.textContent = 'Copied ✓';
            clearTimeout(copyTimer);
            copyTimer = setTimeout(() => {
                btn.classList.remove('copied');
                if (btn.classList.contains('btn')) btn.textContent = 'Copy Email Address';
            }, 2000);
        });
    });
});

// Dynamic copyright year
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
