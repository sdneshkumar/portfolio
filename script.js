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
                if (b.classList.contains('btn')) {
                    b.style.minWidth = '';
                    b.textContent = 'Copy Email Address';
                }
            });
            btn.classList.add('copied');
            if (btn.classList.contains('btn')) {
                btn.style.minWidth = btn.offsetWidth + 'px';
                btn.textContent = 'Copied ✓';
            }
            clearTimeout(copyTimer);
            copyTimer = setTimeout(() => {
                btn.classList.remove('copied');
                if (btn.classList.contains('btn')) {
                    btn.style.minWidth = '';
                    btn.textContent = 'Copy Email Address';
                }
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

// ==========================================
// PLAN 1: Visitor Location & Network Tracking + Telegram Alert
// ==========================================

// ⚙️ TELEGRAM BOT CONFIGURATION
// 1. Create a bot on Telegram via @BotFather to get your TELEGRAM_BOT_TOKEN
// 2. Message @userinfobot or @raw_data_bot on Telegram to get your TELEGRAM_CHAT_ID
const TELEGRAM_BOT_TOKEN = '8839441827:AAEf3muGHAHkfrtxBAqY3frH8kHDTpA9EfE';
const TELEGRAM_CHAT_ID = '839631346';

function detectVisitorCategory(userAgent, isp) {
    const ua = (userAgent || '').toLowerCase();
    const net = (isp || '').toLowerCase();

    const botKeywords = ['bot', 'crawler', 'spider', 'headless', 'phantom', 'puppeteer', 'lighthouse', 'pingdom', 'gtmetrix', 'netlify', 'vercel', 'semrush', 'ahrefs', 'googlebot'];
    const cloudNetworks = ['amazon', 'aws', 'hostroyale', 'digitalocean', 'linode', 'hetzner', 'azure', 'google cloud', 'ovh'];

    if (botKeywords.some(k => ua.includes(k)) || cloudNetworks.some(n => net.includes(n))) {
        return '🤖 Automated Bot / Cloud Crawler';
    }
    return '👤 Real Human Visitor';
}

async function sendTelegramAlert(visitorData) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('⚠️ [Telegram Alert] Please set your TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in script.js to receive live phone notifications.');
        return;
    }

    const visitorCategory = detectVisitorCategory(visitorData.userAgent, visitorData.network_isp);
    const headerIcon = visitorCategory.includes('Bot') ? '🤖' : '🔔';

    const message = `${headerIcon} <b>New Portfolio Visit!</b>\n` +
        `<b>Type:</b> ${visitorCategory}\n\n` +
        `📍 <b>Location:</b> ${visitorData.city || 'Unknown'}, ${visitorData.region || ''}, ${visitorData.country || 'Unknown'}\n` +
        `🏢 <b>Network/ISP:</b> ${visitorData.network_isp || 'Unknown'}\n` +
        `🌐 <b>IP Address:</b> ${visitorData.ip || 'Hidden'}\n` +
        `💻 <b>Screen:</b> ${visitorData.screenResolution} (${visitorData.language})\n` +
        `🔗 <b>Source:</b> ${visitorData.referrer}\n` +
        `⏰ <b>Time:</b> ${visitorData.timestamp}`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        const data = await res.json();
        if (data.ok) {
            console.log('✅ [Telegram Alert] Notification sent to your Telegram app!');
        } else {
            console.error('❌ [Telegram Alert] Telegram API Error:', data);
        }
    } catch (err) {
        console.error('❌ [Telegram Alert] Failed to send notification:', err);
    }
}


async function getVisitorIPDetails() {
    // 1. Try ipwho.is first (Works reliably on Mobile Firefox, Safari, Chrome & Brave)
    try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
            const data = await res.json();
            if (data.success !== false) {
                return {
                    ip: data.ip,
                    city: data.city,
                    region: data.region,
                    country: data.country,
                    network_isp: data.connection?.isp || data.connection?.org || 'Mobile/Broadband ISP'
                };
            }
        }
    } catch (e) {
        console.warn('[Visitor Tracker] ipwho.is failed, trying ipapi.co...');
    }

    // 2. Try ipapi.co
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
            const data = await res.json();
            return {
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                network_isp: data.org || data.asn || 'Unknown Network'
            };
        }
    } catch (e) {
        console.warn('[Visitor Tracker] ipapi.co failed, trying freeipapi...');
    }

    // 3. Fallback to freeipapi.com
    try {
        const res = await fetch('https://freeipapi.com/api/json');
        if (res.ok) {
            const data = await res.json();
            return {
                ip: data.ipAddress,
                city: data.cityName,
                region: data.regionName,
                country: data.countryName,
                network_isp: 'Mobile Visitor'
            };
        }
    } catch (e) {
        console.warn('[Visitor Tracker] freeipapi failed:', e);
    }

    return {};
}


async function trackVisitorInfo() {
    try {
        const visitorData = {
            timestamp: new Date().toLocaleString(),
            referrer: document.referrer || 'Direct Visit / Link',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            userAgent: navigator.userAgent,
            path: window.location.pathname + window.location.search
        };

        // Fetch location details with fallback
        const ipDetails = await getVisitorIPDetails();
        Object.assign(visitorData, ipDetails);

        console.log('📍 [Plan 1] Visitor Details Collected:', visitorData);
        
        // Send instant notification to Telegram
        await sendTelegramAlert(visitorData);

        return visitorData;
    } catch (err) {
        console.warn('Visitor location tracking skipped or blocked:', err);
    }
}


// Automatically track on every fresh page load
document.addEventListener('DOMContentLoaded', () => {
    trackVisitorInfo();
});



