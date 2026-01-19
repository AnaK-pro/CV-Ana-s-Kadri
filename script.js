// Navigation entre les sections
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    initNavigation();
    animateSkillBars();
    addTypingEffect();
    addParticles();

    // Animation au scroll
    window.addEventListener('scroll', handleScroll);
});

// Gestion de la navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');

            // Retirer la classe active de tous les boutons
            navButtons.forEach(btn => btn.classList.remove('active'));

            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');

            // Masquer toutes les sections
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Afficher la section cible avec animation
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.classList.add('active');
                    animateSkillBars(); // Réanimer les barres de compétences si c'est la section skills
                }, 100);
            }

            // Effet sonore (optionnel - peut être commenté)
            playClickSound();
        });
    });
}

// Animation des barres de compétences
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');

        // Reset pour réanimer
        bar.style.width = '0%';

        // Animer avec un délai
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 200);
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

// Effet sonore pour les clics (effet cyberpunk)
function playClickSound() {
    // Créer un son synthétique
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

// Particules cyberpunk en arrière-plan
function addParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.3';

    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particules
    const particles = [];
    const particleCount = 50;

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
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Créer les particules
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Connecter les particules proches
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / 100})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Redimensionnement
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Effet de hover sur les cartes avec mouvement 3D
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.cyber-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// Easter egg : Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateMatrixMode();
    }
});

function activateMatrixMode() {
    document.body.style.animation = 'hueRotate 5s infinite';

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes hueRotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Message secret
    console.log('%c🎮 MATRIX MODE ACTIVATED 🎮', 'color: #00ff00; font-size: 20px; text-shadow: 0 0 10px #00ff00;');

    // Désactiver après 10 secondes
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
}

// Glitch aléatoire sur le titre
setInterval(() => {
    const glitchElement = document.querySelector('.glitch');
    if (glitchElement && Math.random() > 0.95) {
        glitchElement.style.animation = 'none';
        setTimeout(() => {
            glitchElement.style.animation = 'glitch 5s infinite';
        }, 50);
    }
}, 1000);

// Cursor personnalisé (effet cyberpunk)
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid #00ffff;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transition: transform 0.1s ease;
    box-shadow: 0 0 10px #00ffff;
    mix-blend-mode: difference;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

// Agrandir le curseur sur hover des éléments interactifs
const interactiveElements = document.querySelectorAll('a, button, .nav-btn');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.borderColor = '#ff00ff';
        cursor.style.boxShadow = '0 0 20px #ff00ff';
    });

    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = '#00ffff';
        cursor.style.boxShadow = '0 0 10px #00ffff';
    });
});

console.log('%c◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤', 'color: #ff00ff; font-size: 14px;');
console.log('%cCV CYBERPUNK 2077', 'color: #00ffff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ffff;');
console.log('%c◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤', 'color: #ff00ff; font-size: 14px;');
console.log('%cTip: Essayez le Konami Code pour un effet spécial! 🎮', 'color: #9d00ff;');

// ==================== DÉMONSTRATIONS 3D ====================

// Variables globales pour Three.js
let scene, camera, renderer, controls;
let animationId;
let currentDemo = null;

// Configuration des démos 3D
const demoProjects = {
    'Security Point': {
        title: 'Security Point',
        description: 'Système de surveillance avec points de contrôle 3D et monitoring en temps réel',
        scene: createSecurityScene
    },
    'E-COMMERCE CYBERPUNK': {
        title: 'E-COMMERCE CYBERPUNK',
        description: 'Une expérience d\'achat futuriste avec des cubes interconnectés représentant les produits',
        scene: createEcommerceScene
    },
    'DASHBOARD ANALYTICS': {
        title: 'DASHBOARD ANALYTICS',
        description: 'Visualisation de données en 3D avec des barres et graphiques animés',
        scene: createDashboardScene
    },
    'APP MOBILE SOCIAL': {
        title: 'APP MOBILE SOCIAL',
        description: 'Réseau de sphères connectées représentant les utilisateurs',
        scene: createSocialScene
    },
    'IA CHATBOT': {
        title: 'IA CHATBOT',
        description: 'Intelligence artificielle représentée par un réseau neuronal 3D',
        scene: createAIScene
    },
    'BLOG TECH': {
        title: 'BLOG TECH',
        description: 'Articles de blog flottants dans un espace 3D',
        scene: createBlogScene
    },
    'PORTFOLIO 3D': {
        title: 'PORTFOLIO 3D',
        description: 'Galerie 3D interactive avec effets WebGL',
        scene: createPortfolioScene
    }
};

// Initialisation des événements de démonstration
document.addEventListener('DOMContentLoaded', function() {
    initDemoEvents();
});



    // Fermer avec Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeDemo();
        }
    });

function openDemo(projectTitle) {
    const modal = document.getElementById('demo-modal');
    const container = document.getElementById('demo-canvas-container');
    const titleElement = document.getElementById('demo-title');
    const descriptionElement = document.getElementById('demo-description');

    const project = demoProjects[projectTitle];

    titleElement.textContent = project.title;
    descriptionElement.textContent = project.description;

    modal.classList.add('active');

    // Nettoyer l'ancienne scène si elle existe
    if (renderer) {
        container.innerHTML = '';
    }

    // Créer la nouvelle scène
    currentDemo = project.scene(container);
}

// --- Simple modal pour Infos de connexion ---
function initInfoModal() {
    const infoBtns = document.querySelectorAll('.info-btn');
    const modal = document.getElementById('info-modal');
    const closeBtn = modal ? modal.querySelector('.simple-modal-close') : null;

    if (!modal) return;

    infoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeInfoModal());
    }

    // Fermer en cliquant sur l'overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeInfoModal();
    });

    // Fermer avec Echap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeInfoModal();
        }
    });
}

function closeInfoModal() {
    const modal = document.getElementById('info-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

// Initialiser le modal après le DOM
document.addEventListener('DOMContentLoaded', initInfoModal);

function closeDemo() {
    const modal = document.getElementById('demo-modal');
    modal.classList.remove('active');

    // Nettoyer
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (renderer) {
        renderer.dispose();
    }

    currentDemo = null;
}

// ==================== SCÈNES 3D ====================

// Scène Security Point: Reconnaissance faciale avec scan en temps réel
function createSecurityScene(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0a0a0f, 1);
    container.appendChild(renderer.domElement);

    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    // Créer un visage 3D détaillé au centre
    const faceGroup = new THREE.Group();

    // Tête principale (forme ovale)
    const headGeometry = new THREE.SphereGeometry(1.2, 64, 64);
    headGeometry.scale(1, 1.3, 0.95);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: 0xffdbac,
        shininess: 40,
        flatShading: false
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    faceGroup.add(head);

    // Yeux
    const createEye = (xPos) => {
        const eyeGroup = new THREE.Group();

        // Blanc de l'œil
        const eyeWhiteGeo = new THREE.SphereGeometry(0.18, 24, 24);
        const eyeWhiteMat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 100
        });
        const eyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
        eyeWhite.scale.set(1, 1, 0.6);
        eyeGroup.add(eyeWhite);

        // Iris
        const irisGeo = new THREE.SphereGeometry(0.1, 24, 24);
        const irisMat = new THREE.MeshPhongMaterial({
            color: 0x4a90e2,
            emissive: 0x2a5a92,
            emissiveIntensity: 0.3
        });
        const iris = new THREE.Mesh(irisGeo, irisMat);
        iris.position.z = 0.15;
        eyeGroup.add(iris);

        // Pupille
        const pupilGeo = new THREE.SphereGeometry(0.05, 16, 16);
        const pupilMat = new THREE.MeshPhongMaterial({
            color: 0x000000,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5
        });
        const pupil = new THREE.Mesh(pupilGeo, pupilMat);
        pupil.position.z = 0.2;
        eyeGroup.add(pupil);

        // Reflet
        const highlightGeo = new THREE.SphereGeometry(0.04, 12, 12);
        const highlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const highlight = new THREE.Mesh(highlightGeo, highlightMat);
        highlight.position.set(0.03, 0.03, 0.23);
        eyeGroup.add(highlight);

        eyeGroup.position.set(xPos, 0.3, 0.9);
        return eyeGroup;
    };

    const leftEye = createEye(-0.35);
    const rightEye = createEye(0.35);
    faceGroup.add(leftEye);
    faceGroup.add(rightEye);

    // Nez
    const noseGeo = new THREE.ConeGeometry(0.12, 0.4, 8);
    const noseMat = new THREE.MeshPhongMaterial({
        color: 0xffdbac,
        shininess: 30
    });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0, 1);
    nose.rotation.x = Math.PI / 2;
    faceGroup.add(nose);

    // Bouche
    const mouthCurve = new THREE.EllipseCurve(0, 0, 0.3, 0.15, 0, Math.PI, false, 0);
    const mouthPoints = mouthCurve.getPoints(30);
    const mouthGeo = new THREE.BufferGeometry().setFromPoints(mouthPoints);
    const mouthMat = new THREE.LineBasicMaterial({
        color: 0x8b4513,
        linewidth: 3
    });
    const mouth = new THREE.Line(mouthGeo, mouthMat);
    mouth.position.set(0, -0.4, 0.95);
    mouth.rotation.x = -Math.PI / 2;
    faceGroup.add(mouth);

    // Oreilles
    const createEar = (xPos) => {
        const earGeo = new THREE.SphereGeometry(0.2, 16, 16);
        earGeo.scale(0.5, 1.2, 0.4);
        const earMat = new THREE.MeshPhongMaterial({
            color: 0xffdbac,
            shininess: 30
        });
        const ear = new THREE.Mesh(earGeo, earMat);
        ear.position.set(xPos, 0, 0.2);
        return ear;
    };

    faceGroup.add(createEar(-1.1));
    faceGroup.add(createEar(1.1));

    // Cheveux
    const hairGeo = new THREE.SphereGeometry(1.25, 32, 32);
    hairGeo.scale(1, 0.7, 0.95);
    const hairMat = new THREE.MeshPhongMaterial({
        color: 0x2c1810,
        shininess: 80
    });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.8, 0);
    faceGroup.add(hair);

    // Cou
    const neckGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 16);
    const neckMat = new THREE.MeshPhongMaterial({
        color: 0xffdbac,
        shininess: 30
    });
    const neck = new THREE.Mesh(neckGeo, neckMat);
    neck.position.set(0, -1.6, 0);
    faceGroup.add(neck);

    scene.add(faceGroup);

    // CADRE DE RECONNAISSANCE FACIALE
    const frameSize = 3.5;
    const frameHeight = 4.5;

    // Cadre principal avec coins
    const corners = [
        {x: -frameSize/2, y: frameHeight/2},
        {x: frameSize/2, y: frameHeight/2},
        {x: -frameSize/2, y: -frameHeight/2},
        {x: frameSize/2, y: -frameHeight/2}
    ];

    corners.forEach(corner => {
        // Lignes horizontales des coins
        const hLineGeo = new THREE.BoxGeometry(0.6, 0.03, 0.03);
        const hLineMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const hLine = new THREE.Mesh(hLineGeo, hLineMat);
        hLine.position.set(corner.x + (corner.x > 0 ? -0.3 : 0.3), corner.y, 1.2);
        scene.add(hLine);

        // Lignes verticales des coins
        const vLineGeo = new THREE.BoxGeometry(0.03, 0.6, 0.03);
        const vLineMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const vLine = new THREE.Mesh(vLineGeo, vLineMat);
        vLine.position.set(corner.x, corner.y + (corner.y > 0 ? -0.3 : 0.3), 1.2);
        scene.add(vLine);
    });

    // Points de reconnaissance faciale (facial landmarks)
    const landmarks = [
        {pos: [-0.35, 0.5, 1.1], label: 'L_EYE'},
        {pos: [0.35, 0.5, 1.1], label: 'R_EYE'},
        {pos: [0, 0.1, 1.15], label: 'NOSE'},
        {pos: [-0.3, -0.4, 1], label: 'L_MOUTH'},
        {pos: [0.3, -0.4, 1], label: 'R_MOUTH'},
        {pos: [0, -0.4, 1], label: 'MOUTH'},
        {pos: [-1.1, 0.2, 0.5], label: 'L_EAR'},
        {pos: [1.1, 0.2, 0.5], label: 'R_EAR'}
    ];

    const landmarkObjects = [];
    landmarks.forEach(landmark => {
        // Point de repère
        const pointGeo = new THREE.SphereGeometry(0.04, 12, 12);
        const pointMat = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.9
        });
        const point = new THREE.Mesh(pointGeo, pointMat);
        point.position.set(...landmark.pos);
        scene.add(point);

        // Cercle autour du point
        const circleGeo = new THREE.RingGeometry(0.05, 0.08, 16);
        const circleMat = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const circle = new THREE.Mesh(circleGeo, circleMat);
        circle.position.set(...landmark.pos);
        circle.position.z += 0.01;
        scene.add(circle);

        landmarkObjects.push({point, circle, pos: landmark.pos});

        // Ligne de connexion vers le centre du visage
        const linePoints = [
            new THREE.Vector3(...landmark.pos),
            new THREE.Vector3(0, 0, 0.8)
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.2
        });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
    });

    // LIGNES DE SCAN HORIZONTALES
    const scanLines = [];
    for (let i = 0; i < 30; i++) {
        const lineGeo = new THREE.PlaneGeometry(frameSize, 0.02);
        const lineMat = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0
        });
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.z = 1.3;
        scene.add(line);
        scanLines.push(line);
    }

    // Grille de scan verticale
    const gridLines = [];
    for (let i = 0; i < 15; i++) {
        const x = -frameSize/2 + (i / 14) * frameSize;
        const points = [
            new THREE.Vector3(x, -frameHeight/2, 1.25),
            new THREE.Vector3(x, frameHeight/2, 1.25)
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.1
        });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
        gridLines.push(line);
    }

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontLight.position.set(0, 2, 10);
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0x00ffff, 0.3);
    backLight.position.set(0, 0, -5);
    scene.add(backLight);

    const keyLight = new THREE.SpotLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 5);
    keyLight.target.position.set(0, 0, 0);
    scene.add(keyLight);
    scene.add(keyLight.target);

    // Animation
    let scanProgress = 0;
    let scanDirection = 1;
    let isScanning = true;

    function animate() {
        animationId = requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Animation légère du visage
        faceGroup.rotation.y = Math.sin(time * 0.3) * 0.15;
        faceGroup.rotation.x = Math.sin(time * 0.4) * 0.08;

        // Animation des yeux (clignement subtil)
        const blinkFactor = Math.max(0, Math.sin(time * 2)) > 0.95 ? 0.3 : 1;
        leftEye.scale.y = blinkFactor;
        rightEye.scale.y = blinkFactor;

        // ANIMATION DU SCAN - effet de balayage vertical
        if (isScanning) {
            scanProgress += 0.015 * scanDirection;

            if (scanProgress >= 1) {
                scanProgress = 1;
                scanDirection = -1;
                setTimeout(() => {
                    scanDirection = 1;
                    scanProgress = 0;
                }, 500);
            }

            scanLines.forEach((line, i) => {
                const lineY = -frameHeight/2 + scanProgress * frameHeight;
                line.position.y = lineY;

                // Opacité basée sur la proximité de la ligne de scan principale
                const distanceFromScan = Math.abs(i - scanProgress * scanLines.length);
                const opacity = Math.max(0, 1 - distanceFromScan / 5);
                line.material.opacity = opacity * 0.8;
            });
        }

        // Animation des landmarks (points de reconnaissance)
        landmarkObjects.forEach((landmark, index) => {
            // Pulsation
            const pulse = Math.sin(time * 3 + index * 0.5) * 0.5 + 0.5;
            landmark.point.scale.set(1 + pulse * 0.3, 1 + pulse * 0.3, 1 + pulse * 0.3);
            landmark.circle.rotation.z += 0.02;

            // Opacité basée sur le scan
            const landmarkY = (landmark.pos[1] + frameHeight/2) / frameHeight;
            const isScanned = scanProgress > landmarkY - 0.1;
            landmark.point.material.opacity = isScanned ? 0.9 : 0.3;
            landmark.circle.material.opacity = isScanned ? 0.6 : 0.2;
        });

        // Animation de la grille verticale
        gridLines.forEach((line, i) => {
            const material = line.material;
            material.opacity = 0.05 + Math.sin(time * 2 + i * 0.2) * 0.05;
        });

        // Effet de lumière pulsante sur le visage
        const lightPulse = Math.sin(time * 1.5) * 0.3 + 1;
        frontLight.intensity = 0.8 * lightPulse;

        // Lumière cyan qui pulse
        backLight.intensity = 0.3 + Math.sin(time * 2) * 0.2;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return { scene, camera, renderer };
}

// Scène 1: E-commerce - Cubes produits
function createEcommerceScene(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0a0a0f, 1);
    container.appendChild(renderer.domElement);

    camera.position.z = 15;

    // Créer un groupe de cubes (produits)
    const cubes = [];
    const colors = [0x00ffff, 0xff00ff, 0x9d00ff, 0x0066ff];

    for (let i = 0; i < 20; i++) {
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshPhongMaterial({
            color: colors[i % colors.length],
            emissive: colors[i % colors.length],
            emissiveIntensity: 0.3,
            shininess: 100
        });

        const cube = new THREE.Mesh(geometry, material);

        // Position aléatoire
        cube.position.x = (Math.random() - 0.5) * 20;
        cube.position.y = (Math.random() - 0.5) * 20;
        cube.position.z = (Math.random() - 0.5) * 20;

        // Rotation aléatoire
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;

        cubes.push(cube);
        scene.add(cube);

        // Ajouter des bordures
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
        cube.add(line);
    }

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Interaction souris
    let mouseX = 0, mouseY = 0;

    container.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / container.clientWidth) * 2 - 1;
        mouseY = -(e.clientY / container.clientHeight) * 2 + 1;
    });

    // Animation
    function animate() {
        animationId = requestAnimationFrame(animate);

        cubes.forEach((cube, index) => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            // Mouvement flottant
            cube.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        });

        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return { scene, camera, renderer };
}

// Scène 2: Dashboard - Barres 3D
function createDashboardScene(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0a0a0f, 1);
    container.appendChild(renderer.domElement);

    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);

    // Créer des barres de données
    const bars = [];
    const barCount = 10;

    for (let i = 0; i < barCount; i++) {
        const height = Math.random() * 8 + 2;
        const geometry = new THREE.BoxGeometry(1, height, 1);
        const material = new THREE.MeshPhongMaterial({
            color: i % 2 === 0 ? 0x00ffff : 0xff00ff,
            emissive: i % 2 === 0 ? 0x00ffff : 0xff00ff,
            emissiveIntensity: 0.5
        });

        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = (i - barCount / 2) * 1.5;
        bar.position.y = height / 2;
        bar.userData.targetHeight = height;
        bar.userData.currentHeight = 0;

        bars.push(bar);
        scene.add(bar);
    }

    // Grille au sol
    const gridHelper = new THREE.GridHelper(20, 20, 0x00ffff, 0x9d00ff);
    scene.add(gridHelper);

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Animation
    function animate() {
        animationId = requestAnimationFrame(animate);

        bars.forEach((bar, index) => {
            // Animer la hauteur
            if (bar.userData.currentHeight < bar.userData.targetHeight) {
                bar.userData.currentHeight += 0.1;
                bar.scale.y = bar.userData.currentHeight / bar.userData.targetHeight;
            }

            // Effet de pulsation
            const pulse = Math.sin(Date.now() * 0.002 + index * 0.5) * 0.1 + 1;
            bar.material.emissiveIntensity = pulse * 0.5;
        });

        camera.position.x = Math.cos(Date.now() * 0.0005) * 15;
        camera.position.z = Math.sin(Date.now() * 0.0005) * 15;
        camera.lookAt(0, 3, 0);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return { scene, camera, renderer };
}

// Scène 3: Réseau social - Sphères connectées
function createSocialScene(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0a0a0f, 1);
    container.appendChild(renderer.domElement);

    camera.position.z = 20;

    // Créer des sphères (utilisateurs)
    const spheres = [];
    const connections = [];

    for (let i = 0; i < 15; i++) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            shininess: 100
        });

        const sphere = new THREE.Mesh(geometry, material);

        // Position aléatoire sur une sphère
        const radius = 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        sphere.position.x = radius * Math.sin(phi) * Math.cos(theta);
        sphere.position.y = radius * Math.sin(phi) * Math.sin(theta);
        sphere.position.z = radius * Math.cos(phi);

        spheres.push(sphere);
        scene.add(sphere);
    }

    // Créer des connexions entre sphères proches
    for (let i = 0; i < spheres.length; i++) {
        for (let j = i + 1; j < spheres.length; j++) {
            if (Math.random() > 0.7) {
                const points = [];
                points.push(spheres[i].position);
                points.push(spheres[j].position);

                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({
                    color: 0xff00ff,
                    transparent: true,
                    opacity: 0.3
                });

                const line = new THREE.Line(geometry, material);
                connections.push(line);
                scene.add(line);
            }
        }
    }

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Animation
    function animate() {
        animationId = requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        spheres.forEach((sphere, index) => {
            sphere.position.x += Math.sin(time + index) * 0.01;
            sphere.position.y += Math.cos(time + index) * 0.01;

            const pulse = Math.sin(time * 2 + index) * 0.3 + 0.7;
            sphere.material.emissiveIntensity = pulse;
        });

        // Les connexions sont déjà créées et n'ont pas besoin d'être mises à jour

        scene.rotation.y += 0.002;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return { scene, camera, renderer };
}

// Scène 4: IA - Réseau neuronal
function createAIScene(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0a0a0f, 1);
    container.appendChild(renderer.domElement);

    camera.position.z = 25;

    // Créer des couches de neurones
    const layers = [];
    const layerCount = 5;
    const neuronsPerLayer = 8;

    for (let l = 0; l < layerCount; l++) {
        const layer = [];

        for (let n = 0; n < neuronsPerLayer; n++) {
            const geometry = new THREE.SphereGeometry(0.3, 16, 16);
            const material = new THREE.MeshPhongMaterial({
                color: 0x9d00ff,
                emissive: 0x9d00ff,
                emissiveIntensity: 0.7
            });

            const neuron = new THREE.Mesh(geometry, material);
            neuron.position.x = (l - layerCount / 2) * 5;
            neuron.position.y = (n - neuronsPerLayer / 2) * 2;
            neuron.position.z = 0;

            layer.push(neuron);
            scene.add(neuron);
        }

        layers.push(layer);
    }

    // Créer les connexions entre couches
    const connections = [];

    for (let l = 0; l < layers.length - 1; l++) {
        for (let i = 0; i < layers[l].length; i++) {
            for (let j = 0; j < layers[l + 1].length; j++) {
                if (Math.random() > 0.3) {
                    const points = [];
                    points.push(layers[l][i].position);
                    points.push(layers[l + 1][j].position);

                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const material = new THREE.LineBasicMaterial({
                        color: 0x00ffff,
                        transparent: true,
                        opacity: 0.2
                    });

                    const line = new THREE.Line(geometry, material);
                    line.userData.pulse = Math.random();
                    connections.push(line);
                    scene.add(line);
                }
            }
        }
    }

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animation
    function animate() {
        animationId = requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        layers.forEach((layer, layerIndex) => {
            layer.forEach((neuron, neuronIndex) => {
                const pulse = Math.sin(time * 2 + layerIndex + neuronIndex * 0.5) * 0.5 + 0.5;
                neuron.material.emissiveIntensity = pulse;
                neuron.scale.set(1 + pulse * 0.2, 1 + pulse * 0.2, 1 + pulse * 0.2);
            });
        });

        connections.forEach(connection => {
            const pulse = Math.sin(time * 3 + connection.userData.pulse * 10) * 0.3 + 0.3;
            connection.material.opacity = pulse;
        });

        camera.position.x = Math.sin(time * 0.3) * 3;
        camera.position.y = Math.cos(time * 0.2) * 3;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return { scene, camera, renderer };
}

// Scène 5: Blog - Articles flottants
function createBlogScene(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0a0a0f, 1);
    container.appendChild(renderer.domElement);

    camera.position.z = 20;

    // Créer des "articles" (plans rectangulaires)
    const articles = [];

    for (let i = 0; i < 12; i++) {
        const geometry = new THREE.PlaneGeometry(3, 4);
        const material = new THREE.MeshPhongMaterial({
            color: i % 3 === 0 ? 0x00ffff : i % 3 === 1 ? 0xff00ff : 0x9d00ff,
            emissive: i % 3 === 0 ? 0x00ffff : i % 3 === 1 ? 0xff00ff : 0x9d00ff,
            emissiveIntensity: 0.3,
            side: THREE.DoubleSide
        });

        const article = new THREE.Mesh(geometry, material);

        // Position en spirale
        const angle = (i / 12) * Math.PI * 4;
        const radius = 8;
        article.position.x = Math.cos(angle) * radius;
        article.position.y = (i - 6) * 1.5;
        article.position.z = Math.sin(angle) * radius;

        article.rotation.y = -angle;

        articles.push(article);
        scene.add(article);

        // Ajouter une bordure
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
        article.add(line);
    }

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Animation
    function animate() {
        animationId = requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        articles.forEach((article, index) => {
            article.rotation.y += 0.005;
            article.position.y += Math.sin(time + index) * 0.01;
        });

        camera.position.x = Math.sin(time * 0.2) * 5;
        camera.position.z = Math.cos(time * 0.2) * 20 + 10;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return { scene, camera, renderer };
}

// Scène 6: Portfolio 3D - Tore géométrique
function createPortfolioScene(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0a0a0f, 1);
    container.appendChild(renderer.domElement);

    camera.position.z = 15;

    // Créer un tore principal
    const torusGeometry = new THREE.TorusGeometry(5, 1.5, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        wireframe: false,
        shininess: 100
    });

    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    // Ajouter des petites sphères orbitales
    const orbitSpheres = [];

    for (let i = 0; i < 30; i++) {
        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: i % 2 === 0 ? 0xff00ff : 0x9d00ff,
            emissive: i % 2 === 0 ? 0xff00ff : 0x9d00ff,
            emissiveIntensity: 0.8
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.userData.angle = (i / 30) * Math.PI * 2;
        sphere.userData.speed = 0.01 + Math.random() * 0.02;

        orbitSpheres.push(sphere);
        scene.add(sphere);
    }

    // Particules de fond
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 2, 50);
    pointLight1.position.set(10, 0, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 2, 50);
    pointLight2.position.set(-10, 0, 0);
    scene.add(pointLight2);

    // Animation
    function animate() {
        animationId = requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Rotation du tore
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.005;

        // Animer les sphères orbitales
        orbitSpheres.forEach(sphere => {
            sphere.userData.angle += sphere.userData.speed;
            const radius = 7;
            sphere.position.x = Math.cos(sphere.userData.angle) * radius;
            sphere.position.y = Math.sin(sphere.userData.angle * 2) * 3;
            sphere.position.z = Math.sin(sphere.userData.angle) * radius;
        });

        // Rotation des particules
        particles.rotation.y += 0.0005;

        // Animer les lumières
        pointLight1.position.x = Math.cos(time) * 10;
        pointLight1.position.z = Math.sin(time) * 10;

        pointLight2.position.x = Math.cos(time + Math.PI) * 10;
        pointLight2.position.z = Math.sin(time + Math.PI) * 10;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return { scene, camera, renderer };
}
