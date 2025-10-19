// Canvas Animation - Subtle Background Effect
const canvas = document.getElementById('canvas3d');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

// Subtle Background Particle System (Non-interfering)
class ChartParticle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.isGreen = Math.random() > 0.5;
        this.opacity = Math.random() * 0.15 + 0.05;
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
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = Array.from({ length: 40 }, () => new ChartParticle());

function animate() {
    const isLightMode = document.body.classList.contains('light-mode');
    ctx.fillStyle = isLightMode ? 'rgba(245, 247, 250, 0.15)' : 'rgba(10, 14, 39, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update particles only
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    resizeCanvas();
    particles.forEach(p => p.reset());
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const toggleIcon = themeToggle.querySelector('.toggle-icon');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
        toggleIcon.textContent = '☀️';
        showNotification('Light mode activated! ☀️');
    } else {
        toggleIcon.textContent = '🌙';
        showNotification('Dark mode activated! 🌙');
    }
});

// Navigation with improved dropdown handling
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const dropdowns = document.querySelectorAll('.dropdown');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Dropdown Toggle for Mobile
dropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const isThisActive = dropdown.classList.contains('active');
                dropdowns.forEach(d => d.classList.remove('active'));
                
                if (!isThisActive) {
                    dropdown.classList.add('active');
                }
            }
        });
    }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        if (this.classList.contains('dropdown-toggle') && window.innerWidth <= 768) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navToggle) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    }
});

// Handle dropdown on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
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

// Floating stats animation
const prizeAmount = document.querySelector('.prize-amount');
if (prizeAmount) {
    let scale = 1;
    let growing = true;
    setInterval(() => {
        if (growing) {
            scale += 0.002;
            if (scale >= 1.05) growing = false;
        } else {
            scale -= 0.002;
            if (scale <= 1) growing = true;
        }
        prizeAmount.style.transform = `scale(${scale})`;
    }, 50);
}

// Optimized navbar scroll with throttling
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
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
            ticking = false;
        });
        ticking = true;
    }
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

document.querySelectorAll('[data-target]').forEach(counter => {
    counterObserver.observe(counter);
});
