// Navigation entre les sections
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    animateSkillBars();
    addTypingEffect();
    addParticles();
    window.addEventListener('scroll', handleScroll);
});

// Gestion de la navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            sections.forEach(section => section.classList.remove('active'));
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.classList.add('active');
                    animateSkillBars();
                }, 100);
            }
            playClickSound();
        });
    });
}

// Animation des barres de compétences
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = progress + '%'; }, 200);
    });
}

// Effet de typing pour le sous-titre
function addTypingEffect() {
    const subtitle = document.querySelector('.subtitle');
    if (!subtitle) return;
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 100);
}

// Effet sonore cyberpunk
function playClickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Animation au scroll
function handleScroll() {
    const cards = document.querySelectorAll('.cyber-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (cardTop < windowHeight * 0.8) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

// Particules cyberpunk
function addParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0'; canvas.style.left = '0';
    canvas.style.width = '100%'; canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; canvas.style.zIndex = '1';
    canvas.style.opacity = '0.3';
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const particles = [];
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0; if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0; if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color; ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    for (let i = 0; i < 50; i++) particles.push(new Particle());
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// Cursor personnalisé
const cursor = document.createElement('div');
cursor.style.cssText = `position:fixed;width:20px;height:20px;border:2px solid #00ffff;border-radius:50%;pointer-events:none;z-index:10000;mix-blend-mode:difference;`;
document.body.appendChild(cursor);
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX - 10 + 'px'; cursor.style.top = e.clientY - 10 + 'px';
});

// Modal infos
function initInfoModal() {
    const infoBtns = document.querySelectorAll('.info-btn');
    const modal = document.getElementById('info-modal');
    if (!modal) return;
    infoBtns.forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); modal.classList.add('active'); }));
    modal.querySelector('.simple-modal-close').addEventListener('click', () => modal.classList.remove('active'));
}
document.addEventListener('DOMContentLoaded', initInfoModal);

// --- GESTION DU DIAPORAMA AVEC SUPERPOSITION ---
/* */
/* */
function initAvatarSlideshow() {
    const container = document.getElementById('avatar-slideshow');
    if (!container) return;
    
    const imgs = container.querySelectorAll('.avatar-img');
    let currentIndex = 0;

    if (imgs.length > 0) {
        setInterval(() => {
            // Désactiver l'image actuelle
            imgs[currentIndex].classList.remove('active');
            
            // Passer à la suivante
            currentIndex = (currentIndex + 1) % imgs.length;
            
            // Activer la nouvelle image
            imgs[currentIndex].classList.add('active');
        }, 3500); // 3.5 secondes
    }
}

// Filtres du portfolio
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.portfolio-grid .project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cards.forEach(card => {
                const visible = filter === 'all' || card.getAttribute('data-category') === filter;
                card.classList.toggle('is-hidden', !visible);
            });
        });
    });
}

// Recherche dans les compétences
function initSkillsSearch() {
    const input = document.getElementById('skills-search-input');
    if (!input) return;
    const categories = document.querySelectorAll('.skill-category');
    const count = document.querySelector('.skills-search-count');
    const empty = document.querySelector('.skills-empty');
    // Ignore majuscules et accents : "securite" trouve "Sécurité"
    const normalize = text => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    input.addEventListener('input', () => {
        const query = normalize(input.value.trim());
        let total = 0;

        categories.forEach(category => {
            const titleMatch = normalize(category.querySelector('h3').textContent).includes(query);
            let visibleItems = 0;
            category.querySelectorAll('.skill-item').forEach(item => {
                const visible = !query || titleMatch || normalize(item.textContent).includes(query);
                item.hidden = !visible;
                if (visible) visibleItems++;
            });
            category.hidden = visibleItems === 0;
            total += visibleItems;
        });

        count.textContent = query ? `${total} résultat${total > 1 ? 's' : ''}` : '';
        empty.hidden = total > 0;
    });
}

// Liens internes vers une section (ex. bandeau d'accueil -> portfolio)
function initSectionLinks() {
    document.querySelectorAll('[data-goto]').forEach(link => {
        link.addEventListener('click', () => {
            const target = document.querySelector(`.nav-btn[data-section="${link.getAttribute('data-goto')}"]`);
            if (!target) return;
            target.click();
            document.querySelector('.cyber-nav').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initAvatarSlideshow();
    initPortfolioFilters();
    initSkillsSearch();
    initSectionLinks();
});