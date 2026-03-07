/**
 * LANDING PAGE SCRIPT - REFACTORED VERSION
 * Struktur: Global Vars -> Init -> Helpers -> Events
 */

// --- 1. CONFIGURATION & DOM ELEMENTS ---
const body = document.body;
const darkModeToggle = document.getElementById('dark-mode-toggle');
const scrollBtn = document.getElementById('scroll-to-top');
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');

// Konfigurasi Scroll Restoration
if ('history' in window && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

// --- 2. INITIALIZATION (Jalan saat script dimuat) ---
initApp();

function initApp() {
    restoreTheme();
    restoreScroll();
    updateGreeting();
    handleVisitCounter();
    restoreSavedName();
    initIntersectionObserver();
}

// --- 3. HELPER FUNCTIONS (Logika terpisah) ---

function restoreTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️ Light Mode';
    }
}

function restoreScroll() {
    const pos = localStorage.getItem('userScrollPos');
    if (pos) {
        window.scrollTo(0, parseInt(pos));
        requestAnimationFrame(() => window.scrollTo(0, parseInt(pos)));
    }
}

function handleVisitCounter() {
    let visits = parseInt(localStorage.getItem('visitCount') || 0) + 1;
    localStorage.setItem('visitCount', visits);
    document.getElementById('visit-counter').innerText = `Ini kunjungan ke-${visits} Anda`;
}

function restoreSavedName() {
    const savedName = localStorage.getItem('userName');
    if (savedName) nameInput.value = savedName;
}

function updateGreeting() {
    const greetingElement = document.getElementById('greeting-text');
    const hour = new Date().getHours();
    let msg = hour < 11 ? "Pagi 🌅" : hour < 15 ? "Siang ☀️" : hour < 18 ? "Sore 🌤️" : "Malam 🌙";
    greetingElement.innerText = `Selamat ${msg}, Vibe Coder!`;
}

function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg; // Secure from XSS
    el.style.display = 'block';
}

// --- 4. EVENT LISTENERS ---

// Merged Scroll Listener (Lebih efisien performa)
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Simpan posisi
    localStorage.setItem('userScrollPos', scrollY);
    
    // Update UI Pixel Counter
    document.getElementById('scroll-pixel-counter').innerText = `Scroll: ${Math.round(scrollY)} px`;
    
    // Toggle Scroll to Top Button
    scrollBtn.style.display = scrollY > 300 ? 'block' : 'none';
});

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    const theme = isDark ? 'dark' : 'light';
    
    darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('theme', theme);
    console.log(`[Log] Theme changed to: ${theme}`);
});

// Form Submit & Validation
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        name: nameInput.value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Reset UI
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    
    // Validation
    let isValid = true;
    if (data.name.length < 3) { showError('name-error', 'Minimal 3 karakter!'); isValid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { showError('email-error', 'Email tidak valid!'); isValid = false; }
    if (!data.message.trim()) { showError('message-error', 'Pesan kosong!'); isValid = false; }

    if (isValid) {
        const successEl = document.getElementById('success-msg');
        successEl.textContent = `✅ Terima kasih, ${data.name}!`;
        successEl.style.display = 'block';
        contactForm.reset();
    }
});

// Autosave name
nameInput.addEventListener('input', (e) => localStorage.setItem('userName', e.target.value));

// Clear Data
document.getElementById('clear-data-btn').addEventListener('click', () => {
    if (confirm("Hapus semua data?")) {
        localStorage.clear();
        location.reload();
    }
});

// Smooth Scroll Nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Intersection Observer (Fade-in)
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}