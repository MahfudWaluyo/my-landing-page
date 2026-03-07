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

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // 1. Simpan posisi (Logika lama tetap dipertahankan)
    localStorage.setItem('userScrollPos', scrollY);
    
    // 2. Logika Progress Bar Baru
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Rumus Matematika Persentase:
    // $$ \text{Scrolled} = \left( \frac{\text{winScroll}}{\text{height}} \right) \times 100 $$
    const scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
    
    // 3. Toggle Scroll to Top Button
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

// --- Form Submit & Validation (Refactored for Formspree AJAX) ---
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Menghentikan reload halaman

    // 1. Ambil Data
    const form = e.target;
    const data = new FormData(form);
    const successEl = document.getElementById('success-msg');
    const submitBtn = form.querySelector('.btn-send');

    // 2. Reset UI Error
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    successEl.style.display = 'none';

    // 3. Validasi Lokal
    let isValid = true;
    if (nameInput.value.length < 3) { showError('name-error', 'Minimal 3 karakter!'); isValid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('email').value)) { showError('email-error', 'Email tidak valid!'); isValid = false; }
    if (!document.getElementById('message').value.trim()) { showError('message-error', 'Pesan kosong!'); isValid = false; }

    if (!isValid) return; // Berhenti jika tidak valid

    // 4. Proses Pengiriman (AJAX/Fetch)
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sedang Mengirim...';

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Berhasil!
            successEl.textContent = `✅ Terima kasih, ${nameInput.value}! Pesan Anda telah terkirim.`;
            successEl.style.display = 'block';
            successEl.style.color = '#2ecc71';
            form.reset(); // Kosongkan form
        } else {
            // Gagal dari sisi server
            const errorData = await response.json();
            showError('message-error', 'Ups! Ada masalah saat mengirim: ' + errorData.errors[0].message);
        }
    } catch (error) {
        // Gagal koneksi
        showError('message-error', 'Koneksi bermasalah. Silakan coba lagi nanti.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Pesan';
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