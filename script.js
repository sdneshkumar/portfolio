document.documentElement.classList.add('js');

// Theme toggle (defaults to device theme; toggle applies to the current visit)
const html = document.documentElement;
document.getElementById('themeToggle').addEventListener('click', () => {
    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    html.setAttribute('data-theme', e.matches ? 'light' : 'dark');
});

// Mobile nav
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => {
    const open = navMobile.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
});
navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
}));

// Nav border on scroll + active link
const nav = document.getElementById('nav');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Copy email
const copyBtn = document.querySelector('.copy-email');
let copyTimer;
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('sdineshkumar1208@gmail.com').then(() => {
        copyBtn.style.minWidth = copyBtn.offsetWidth + 'px';
        copyBtn.textContent = 'Copied ✓';
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => { copyBtn.textContent = 'Copy email address'; }, 2000);
    });
});

document.getElementById('currentYear').textContent = new Date().getFullYear();

// Scroll progress bar
const progress = document.getElementById('progress');
function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// Resume snapshot dialog
const resumeDialog = document.getElementById('resumeDialog');
function openResume() {
    if (!resumeDialog.showModal) {
        window.open('dinesh_kumar_cv.pdf', '_blank', 'noopener');
        return;
    }
    resumeDialog.showModal();
}
document.getElementById('previewResumeHero').addEventListener('click', openResume);
function closeResume() {
    if (!resumeDialog.open || resumeDialog.classList.contains('closing')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { resumeDialog.close(); return; }
    resumeDialog.classList.add('closing');
    resumeDialog.addEventListener('animationend', () => {
        resumeDialog.classList.remove('closing');
        resumeDialog.close();
    }, { once: true });
}
document.getElementById('closeResume').addEventListener('click', closeResume);
resumeDialog.addEventListener('click', (e) => { if (e.target === resumeDialog) closeResume(); });
resumeDialog.addEventListener('cancel', (e) => { e.preventDefault(); closeResume(); });
