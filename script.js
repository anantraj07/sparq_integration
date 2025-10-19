// Canvas Animation - Stock Market Chart Effect
const canvas = document.getElementById('canvas3d');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

// Chart Line Particle System
class ChartParticle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2.5 + 1;
        this.isGreen = Math.random() > 0.5;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    
    draw() {
        const isLightMode = document.body.classList.contains('light-mode');
        const color = this.isGreen 
            ? (isLightMode ? 'rgba(67, 160, 71, 0.4)' : 'rgba(0, 230, 118, 0.6)')
            : (isLightMode ? 'rgba(229, 57, 53, 0.4)' : 'rgba(255, 82, 82, 0.6)');
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Candlestick shapes
class Candlestick {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.width = 4;
        this.height = Math.random() * 30 + 10;
        this.wickTop = Math.random() * 10;
        this.wickBottom = Math.random() * 10;
        this.isGreen = Math.random() > 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    
    draw() {
        const isLightMode = document.body.classList.contains('light-mode');
        const color = this.isGreen 
            ? (isLightMode ? `rgba(67, 160, 71, ${this.opacity})` : `rgba(0, 230, 118, ${this.opacity})`)
            : (isLightMode ? `rgba(229, 57, 53, ${this.opacity})` : `rgba(255, 82, 82, ${this.opacity})`);
        
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        
        // Draw wick
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y - this.wickTop);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height + this.wickBottom);
        ctx.stroke();
        
        // Draw body
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Grid lines effect
class GridLine {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.horizontal = Math.random() > 0.5;
        if (this.horizontal) {
            this.x1 = 0;
            this.x2 = canvas.width;
            this.y1 = this.y2 = Math.random() * canvas.height;
        } else {
            this.y1 = 0;
            this.y2 = canvas.height;
            this.x1 = this.x2 = Math.random() * canvas.width;
        }
        this.opacity = Math.random() * 0.1 + 0.05;
    }
    
    draw() {
        const isLightMode = document.body.classList.contains('light-mode');
        ctx.strokeStyle = isLightMode 
            ? `rgba(2, 136, 209, ${this.opacity})` 
            : `rgba(0, 212, 255, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}

const particles = Array.from({ length: 60 }, () => new ChartParticle());
const candlesticks = Array.from({ length: 15 }, () => new Candlestick());
const gridLines = Array.from({ length: 8 }, () => new GridLine());

function animate() {
    const isLightMode = document.body.classList.contains('light-mode');
    ctx.fillStyle = isLightMode ? 'rgba(245, 247, 250, 0.1)' : 'rgba(10, 14, 39, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    gridLines.forEach(line => line.draw());
    
    // Draw and update candlesticks
    candlesticks.forEach(stick => {
        stick.update();
        stick.draw();
    });
    
    // Draw and update particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Draw connecting lines between nearby particles
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                ctx.strokeStyle = p1.isGreen 
                    ? (isLightMode ? `rgba(67, 160, 71, ${0.2 * (1 - dist / 150)})` : `rgba(0, 230, 118, ${0.3 * (1 - dist / 150)})`)
                    : (isLightMode ? `rgba(229, 57, 53, ${0.2 * (1 - dist / 150)})` : `rgba(255, 82, 82, ${0.3 * (1 - dist / 150)})`);
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animate);
}

animate();

// Window Resize Handler
window.addEventListener('resize', () => {
    resizeCanvas();
    particles.forEach(p => p.reset());
    candlesticks.forEach(c => c.reset());
    gridLines.forEach(g => g.reset());
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const toggleIcon = themeToggle.querySelector('.toggle-icon');

// Check for saved theme preference or default to 'dark'
const currentTheme = document.body.dataset.theme || 'dark';
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    toggleIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
        toggleIcon.textContent = '☀️';
        document.body.dataset.theme = 'light';
        showNotification('Light mode activated! ☀️');
    } else {
        toggleIcon.textContent = '🌙';
        document.body.dataset.theme = 'dark';
        showNotification('Dark mode activated! 🌙');
    }
});

// Navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navToggle) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Handle menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    }
});

// Scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.page-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    observer.observe(section);
});

// Poster button notification
document.querySelectorAll('.poster-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('📢 Event poster will be released soon! Stay tuned!');
    });
});

// Notification Function
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #00d4ff, #0096c7);
        color: white;
        padding: 20px 40px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 2000;
        box-shadow: 0 10px 40px rgba(0, 212, 255, 0.5);
        animation: slideDown 0.5s ease;
        max-width: 90%;
        text-align: center;
        font-size: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translate(-50%, -30px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -30px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const heroHeight = hero.offsetHeight;
        if (scrollTop < heroHeight) {
            hero.style.transform = `translateY(${scrollTop * 0.4}px)`;
            hero.style.opacity = 1 - (scrollTop / heroHeight) * 0.5;
        }
    }
}, { passive: true });

// Add ripple effect to buttons
document.querySelectorAll('.btn-hero, .poster-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                .btn-hero, .poster-btn {
                    position: relative;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Animate event cards on scroll
const eventObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 200);
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('.event-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
    card.style.transition = 'all 0.8s ease';
    eventObserver.observe(card);
});

// Animate date cards
const dateObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('.date-card').forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    card.style.transition = 'all 0.6s ease';
    dateObserver.observe(card);
});

// Welcome message on first visit
const welcomeShown = sessionStorage.getItem('welcomeShown');
if (!welcomeShown) {
    setTimeout(() => {
        showNotification('🚀 Welcome to SPARQ 2026! Where Numbers Meet Innovation 📊');
        sessionStorage.setItem('welcomeShown', 'true');
    }, 1000);
}

// Navbar background on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.padding = '15px 40px';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 212, 255, 0.3)';
    } else {
        navbar.style.padding = '20px 40px';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 212, 255, 0.4)';
    }
    
    lastScroll = currentScroll;
}, { passive: true });

// Counter animation for numbers
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target, 2000);
            entry.target.dataset.animated = 'true';
        }
    });
}, {
    threshold: 0.5
});

// Add any counter elements if needed
document.querySelectorAll('[data-target]').forEach(counter => {
    counterObserver.observe(counter);
});
