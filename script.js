/**
 * LANDING PAGE SCRIPT - MODULAR VERSION
 * Author: Mahfud Waluyo (Vibe Coder)
 * Strategi: Inisialisasi -> Fitur UX -> Fitur Data -> Form & Interaksi
 */

// --- 1. DOM ELEMENTS ---
const elements = {
    body: document.body,
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    scrollBtn: document.getElementById('scroll-to-top'),
    contactForm: document.getElementById('contact-form'),
    nameInput: document.getElementById('name'),
    progressBar: document.getElementById("myBar"),
    visitDisplay: document.getElementById('visit-counter'),
    greeting: document.getElementById('greeting-text'),
    cursor: document.getElementById('custom-cursor'),
    profileImg: document.querySelector('.profile-img')
};

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan semua fitur utama
    setupTheme();
    setupScrollFeatures();
    setupPersonalization();
    setupAnimations();
    setupInteractions();
    setupContactForm();
});

// --- 3. FITUR: THEME (Dark/Light Mode) ---
function setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        elements.body.classList.add('dark-mode');
        elements.darkModeToggle.textContent = '☀️ Light Mode';
    }

    elements.darkModeToggle.addEventListener('click', () => {
        const isDark = elements.body.classList.toggle('dark-mode');
        const theme = isDark ? 'dark' : 'light';
        elements.darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        localStorage.setItem('theme', theme);
    });
}

// --- 4. FITUR: SCROLL (Progress Bar, To Top, Position) ---
function setupScrollFeatures() {
    // Recovery posisi scroll lama
    const savedPos = localStorage.getItem('userScrollPos');
    if (savedPos) window.scrollTo(0, parseInt(savedPos));

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Simpan posisi
        localStorage.setItem('userScrollPos', scrollY);
        
        // Update Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (elements.progressBar) {
            elements.progressBar.style.width = scrolled + "%";
        }
        
        // Toggle Scroll to Top Button
        elements.scrollBtn.style.display = scrollY > 300 ? 'block' : 'none';
    });

    // Smooth scroll untuk link internal
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// --- 5. FITUR: PERSONALIZATION (Greeting, Counter, Name) ---
function setupPersonalization() {
    // Greeting berdasarkan waktu
    const hour = new Date().getHours();
    const msg = hour < 11 ? "Pagi 🌅" : hour < 15 ? "Siang ☀️" : hour < 18 ? "Sore 🌤️" : "Malam 🌙";
    if (elements.greeting) elements.greeting.innerText = `Selamat ${msg}, Vibe Coder!`;

    // Visit Counter
    let visits = parseInt(localStorage.getItem('visitCount') || 0) + 1;
    localStorage.setItem('visitCount', visits);
    if (elements.visitDisplay) elements.visitDisplay.innerText = `Ini kunjungan ke-${visits} Anda`;

    // Autosave & Restore Name
    const savedName = localStorage.getItem('userName');
    if (savedName) elements.nameInput.value = savedName;
    elements.nameInput.addEventListener('input', (e) => localStorage.setItem('userName', e.target.value));

    // Clear Data Button
    document.getElementById('clear-data-btn').addEventListener('click', () => {
        if (confirm("Hapus semua data browser untuk situs ini?")) {
            localStorage.clear();
            location.reload();
        }
    });
}

// --- 6. FITUR: ANIMATIONS (AOS & Typed.js) ---
function setupAnimations() {
    // Inisialisasi AOS
    AOS.init({ once: true, offset: 120 });

    // Inisialisasi Typed.js
    new Typed('#typed', {
        strings: ['Vibe Coder', 'AI Enthusiast', 'Lifelong Learner', 'Building through AI Tools'],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        backDelay: 2000
    });
}

// --- 7. FITUR: INTERACTIONS (Cursor & Spin) ---
function setupInteractions() {
    // Custom Cursor
    window.addEventListener('mousemove', (e) => {
        elements.cursor.style.left = e.clientX + 'px';
        elements.cursor.style.top = e.clientY + 'px';
    });

    const interactiveTags = 'a, button, .project-card, input, textarea';
    document.querySelectorAll(interactiveTags).forEach(el => {
        el.addEventListener('mouseenter', () => {
            elements.cursor.classList.add('active');
            elements.cursor.innerHTML = '🤖';
        });
        el.addEventListener('mouseleave', () => {
            elements.cursor.classList.remove('active');
            elements.cursor.innerHTML = '';
        });
    });

    // Profile Spin Easter Egg
    elements.profileImg.addEventListener('click', () => {
        elements.profileImg.classList.add('spin');
        setTimeout(() => elements.profileImg.classList.remove('spin'), 300);
    });
}

// --- 8. FITUR: CONTACT FORM (Formspree AJAX) ---
function setupContactForm() {
    elements.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('.btn-send');
        const successEl = document.getElementById('success-msg');

        // Reset UI
        document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
        
        // Validasi Sederhana
        if (elements.nameInput.value.length < 3) return showError('name-error', 'Minimal 3 karakter!');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sedang Mengirim...';

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                successEl.style.display = 'block';
                form.reset();
            }
        } catch (err) {
            alert("Maaf, terjadi kesalahan koneksi.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Kirim Pesan';
        }
    });
}

function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
}