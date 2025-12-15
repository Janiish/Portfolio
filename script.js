// ========== THEME TOGGLE ==========
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;
const bodyElement = document.body;

// Load theme preference from localStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    bodyElement.classList.add('light-theme');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    bodyElement.classList.toggle('light-theme');
    const isLight = bodyElement.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
});

// ========== KEYBOARD SHORTCUTS ==========
const helpButton = document.querySelector('.help-button');
const helpOverlay = document.querySelector('.help-overlay');
const closeHelp = document.querySelector('.close-help');
const cipherChat = document.querySelector('.cipher-chat');
const chatClose = document.querySelector('.chat-close');
const chatInput = document.querySelector('.chat-input');

// Help menu
helpButton.addEventListener('click', () => helpOverlay.classList.remove('hidden'));
closeHelp.addEventListener('click', () => helpOverlay.classList.add('hidden'));
helpOverlay.addEventListener('click', (e) => {
    if (e.target === helpOverlay) helpOverlay.classList.add('hidden');
});

// Cipher chat
let chatOpen = false;

function toggleChat() {
    chatOpen ? cipherChat.classList.add('hidden') : cipherChat.classList.remove('hidden');
    chatOpen = !chatOpen;
    if (chatOpen) chatInput.focus();
}

chatClose.addEventListener('click', toggleChat);

// Global keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // T - Theme toggle
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
        themeToggle.click();
    }
    // C - Chat with Cipher
    if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        toggleChat();
    }
    // ? - Help
    if (e.key === '?') {
        e.preventDefault();
        helpOverlay.classList.remove('hidden');
    }
    // Esc - Close dialogs
    if (e.key === 'Escape') {
        helpOverlay.classList.add('hidden');
        if (chatOpen) toggleChat();
    }
});

// ========== CIPHER CHAT (backend integration) ==========
chatInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
        e.preventDefault();
        const userMessage = chatInput.value.trim();

        // Add user message to UI
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        userMsg.textContent = userMessage;
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.appendChild(userMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add placeholder for Cipher reply
        const cipherMsg = document.createElement('div');
        cipherMsg.className = 'message cipher-message loading';
        cipherMsg.textContent = 'Typing...';
        chatMessages.appendChild(cipherMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        chatInput.value = '';

        try {
            const resp = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                cipherMsg.textContent = 'Error: ' + (err.error || resp.statusText || 'Request failed');
                cipherMsg.classList.remove('loading');
                chatMessages.scrollTop = chatMessages.scrollHeight;
                return;
            }

            const data = await resp.json();
            const reply = data.reply || '[no reply]';
            // Replace placeholder with actual reply
            cipherMsg.textContent = reply;
            cipherMsg.classList.remove('loading');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            cipherMsg.textContent = 'Network error: ' + (error.message || error);
            cipherMsg.classList.remove('loading');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});

// ========== PARTICLE BACKGROUND ==========
const particlesContainer = document.querySelector('.particles-container');

function createParticles() {
    const particleCount = window.innerWidth > 768 ? 30 : 15;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `var(--accent)`;
        particle.style.borderRadius = '50%';
        particle.style.animation = `float ${Math.random() * 5 + 5}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ========== SVG GRADIENT FOR CIRCULAR CHART ==========
const svg = document.querySelector('.circular-chart');
if (svg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#ff00ff');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#00ff00');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.prepend(defs);
}

// ========== CIPHER MASCOT INTERACTIONS ==========
const cipherMascot = document.querySelector('.cipher-mascot');
if (cipherMascot) {
    cipherMascot.addEventListener('mouseenter', function() {
        this.style.filter = 'drop-shadow(0 0 40px rgba(0, 255, 0, 0.5)) drop-shadow(0 0 80px rgba(255, 0, 255, 0.2))';
    });

    cipherMascot.addEventListener('mouseleave', function() {
        this.style.filter = 'drop-shadow(0 0 30px rgba(0, 255, 0, 0.3)) drop-shadow(0 0 60px rgba(255, 0, 255, 0.1))';
    });

    cipherMascot.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'mascotFloat 3s ease-in-out infinite';
        }, 10);
    });
}

// Mascot hover effect
const mascotStyle = document.createElement('style');
mascotStyle.textContent = `
    .cipher-mascot:hover .circuit-pattern {
        background-image: 
            linear-gradient(90deg, transparent 48%, rgba(0, 255, 0, 0.6) 49%, rgba(0, 255, 0, 0.6) 51%, transparent 52%),
            linear-gradient(0deg, transparent 48%, rgba(0, 255, 0, 0.6) 49%, rgba(0, 255, 0, 0.6) 51%, transparent 52%);
        animation: circuitFlow 1.5s linear infinite;
    }

    .cipher-mascot:hover .cipher-hoodie {
        border-color: rgba(0, 255, 0, 0.5);
        box-shadow: inset 0 0 15px rgba(0, 255, 0, 0.2);
    }

    .cipher-mascot:hover .cipher-glove {
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.6);
        border-color: rgba(0, 255, 0, 0.6);
    }
`;
document.head.appendChild(mascotStyle);

// Mouse tracking effect for cards - 3D Tilt
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 5;
        const rotateY = ((centerX - x) / centerX) * 5;
        
        card.style.setProperty('--rotateX', rotateX + 'deg');
        card.style.setProperty('--rotateY', rotateY + 'deg');
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotateX', '0deg');
        card.style.setProperty('--rotateY', '0deg');
    });
});

// Card tilt effect with CSS variables
const style = document.createElement('style');
style.textContent = `
    .card {
        --rotateX: 0deg;
        --rotateY: 0deg;
        transform: perspective(1000px) rotateX(var(--rotateX)) rotateY(var(--rotateY));
        transition: transform 0.1s ease-out;
    }
    
    .card:hover {
        transition: transform 0.1s ease-out;
    }
    
    .card:not(:hover) {
        --rotateX: 0deg;
        --rotateY: 0deg;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(style);

// Nav button interactions
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Skill row hover effect
document.querySelectorAll('.skill-row').forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(0, 255, 0, 0.05)';
        this.style.borderRadius = '4px';
        this.style.paddingLeft = '15px';
    });
    
    row.addEventListener('mouseleave', function() {
        this.style.background = 'transparent';
        this.style.paddingLeft = '0';
    });
});

// Tool item hover effects
document.querySelectorAll('.tool-item').forEach(tool => {
    tool.addEventListener('mouseenter', function() {
        this.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
    });
    
    tool.addEventListener('mouseleave', function() {
        this.style.textShadow = 'none';
    });
});

// Animate hours number on page load
window.addEventListener('load', () => {
    const hoursNumber = document.querySelector('.hours-number');
    if (hoursNumber) {
        const targetNumber = 14238;
        let currentNumber = 0;
        const increment = targetNumber / 60;
        
        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(counter);
            }
            hoursNumber.textContent = Math.floor(currentNumber).toLocaleString();
        }, 50);
    }
});

// Add glitch effect on click
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.animation = 'glitch 0.3s ease-in-out';
        setTimeout(() => {
            this.style.animation = 'none';
        }, 300);
    });
});

// Glitch animation
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch {
        0% {
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 43%);
            transform: translate(0);
        }
        20% {
            clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 100%);
            transform: translate(2px, 2px);
        }
        40% {
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 43%);
            transform: translate(-2px, -2px);
        }
        60% {
            clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
            transform: translate(2px, -2px);
        }
        80% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            transform: translate(-2px, 2px);
        }
        100% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            transform: translate(0);
        }
    }
`;
document.head.appendChild(glitchStyle);

// Profile icon animation
const profileIcon = document.querySelector('.profile-icon');
if (profileIcon) {
    profileIcon.addEventListener('click', () => {
        profileIcon.style.animation = 'spin 1s ease-in-out';
        setTimeout(() => {
            profileIcon.style.animation = 'none';
        }, 1000);
    });
}

const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinStyle);

// Hobby Items Interactive Effects
document.querySelectorAll('.hobby-item').forEach(hobby => {
    hobby.addEventListener('mouseenter', function() {
        // Add glow effect
        this.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
        this.style.borderColor = 'var(--accent)';
    });

    hobby.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 15px 40px rgba(0, 255, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
        this.style.borderColor = '';
    });

    // Click ripple effect
    hobby.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(0, 255, 0, 0.5) 0%, transparent 70%);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Hobby item text color change on hover
document.querySelectorAll('.hobby-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const h4 = this.querySelector('h4');
        if (h4) {
            h4.style.color = 'var(--accent)';
            h4.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
        }
    });

    item.addEventListener('mouseleave', function() {
        const h4 = this.querySelector('h4');
        if (h4) {
            h4.style.color = 'var(--primary-text)';
            h4.style.textShadow = 'none';
        }
    });
});

// Music wave speed up on hover
document.querySelectorAll('.hobby-music').forEach(music => {
    music.addEventListener('mouseenter', function() {
        const waves = this.querySelectorAll('.music-wave span');
        waves.forEach(wave => {
            wave.style.animationDuration = '0.2s';
        });
    });

    music.addEventListener('mouseleave', function() {
        const waves = this.querySelectorAll('.music-wave span');
        waves.forEach(wave => {
            wave.style.animationDuration = '0.4s';
        });
    });
});

// Book flip animation on hover
document.querySelectorAll('.hobby-reading').forEach(book => {
    book.addEventListener('click', function() {
        const bookElement = this.querySelector('.book');
        if (bookElement) {
            bookElement.style.animation = 'none';
            setTimeout(() => {
                bookElement.style.animation = 'bookFlip 0.6s ease-in-out';
            }, 10);
        }
    });
});

// Camera shutter effect on hover
document.querySelectorAll('.hobby-photography').forEach(camera => {
    camera.addEventListener('click', function() {
        const shutter = this.querySelector('.shutter');
        if (shutter) {
            shutter.style.animation = 'none';
            setTimeout(() => {
                shutter.style.animation = 'shutterClose 0.4s ease-in-out';
            }, 10);
        }
    });
});

// Skill fill animation on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillFill = entry.target.querySelector('.skill-fill');
            if (skillFill) {
                skillFill.style.animation = 'fillCircle 2s ease-out forwards';
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-item').forEach(item => {
    observer.observe(item);
});

// Back to top button visibility
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Typing animation
const helloText = document.querySelector('.hello-text');
if (helloText && helloText.textContent) {
    const originalText = helloText.textContent;
    helloText.textContent = '';
    let index = 0;

    function typeText() {
        if (index < originalText.length) {
            helloText.textContent += originalText[index];
            index++;
            setTimeout(typeText, 50);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(typeText, 300);
    });
}

// Social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.color = 'var(--accent)';
        this.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
    });

    link.addEventListener('mouseleave', function() {
        this.style.color = 'var(--primary-text)';
        this.style.textShadow = 'none';
    });
});

// Utility animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fillCircle {
        from {
            stroke-dashoffset: 565;
        }
        to {
            stroke-dashoffset: 100;
        }
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(-10px) translateX(-10px); }
        75% { transform: translateY(-15px) translateX(5px); }
    }
`;
document.head.appendChild(animationStyles);

// Initialize
console.log('%c🎮 Welcome to Cipher\'s Portfolio! ', 'background: #00ff00; color: #000; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%c📚 Press ? to see keyboard shortcuts', 'color: #00ff00; font-size: 12px;');
console.log('%cPress T to toggle theme, C to chat with Cipher', 'color: #ff00ff; font-size: 12px;');
    music.addEventListener('mouseleave', function() {
        const waves = this.querySelectorAll('.music-wave span');
        waves.forEach(wave => {
            wave.style.animationDuration = '0.6s';
        });
    });
;

// Gaming buttons pulse on hover
document.querySelectorAll('.hobby-gaming').forEach(gaming => {
    const buttons = gaming.querySelectorAll('.btn-x, .btn-o');
    
    gaming.addEventListener('mouseenter', function() {
        buttons.forEach((btn, index) => {
            btn.style.animation = `pulse 0.6s ease-in-out infinite`;
            btn.style.animationDelay = `${index * 0.1}s`;
        });
    });

    gaming.addEventListener('mouseleave', function() {
        buttons.forEach(btn => {
            btn.style.animation = 'none';
        });
    });
});

// Photography camera shutter effect
document.querySelectorAll('.hobby-photo').forEach(photo => {
    photo.addEventListener('mouseenter', function() {
        const shutter = this.querySelector('.camera-shutter span');
        if (shutter) {
            shutter.style.animationDuration = '0.4s';
        }
    });

    photo.addEventListener('mouseleave', function() {
        const shutter = this.querySelector('.camera-shutter span');
        if (shutter) {
            shutter.style.animationDuration = '0.8s';
        }
    });
});

// Coding text matrix effect
document.querySelectorAll('.hobby-coding').forEach(coding => {
    coding.addEventListener('mouseenter', function() {
        const codeText = this.querySelector('.code-text span');
        if (codeText) {
            let iteration = 0;
            const interval = setInterval(() => {
                codeText.textContent = ['<', '/<', '</', '</>', '>'][iteration % 5];
                iteration++;
                if (iteration > 4) clearInterval(interval);
            }, 100);
        }
    });
});

// Add continuous hover glow for hobby items
const glowStyle = document.createElement('style');
glowStyle.textContent = `
    .hobby-item {
        position: relative;
    }

    .hobby-item::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 12px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .hobby-item:hover::after {
        opacity: 0.5;
        box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.3);
    }
`;
document.head.appendChild(glowStyle);
