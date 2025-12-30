/* 
   Quantum Shield Nepal - Interactive Logic
   Handles Particles, Captcha, and Form interactions.
*/

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCaptcha();
    initNavigation();
    initForm();

});



/* --- Particle System --- */
function initParticles() {
    const container = document.getElementById('particles');
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const particleCount = 50;
    const connectionDistance = 150;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.size = Math.random() * 2 + 1;
            this.color = '#00f3ff'; // Neon Blue
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Draw connections
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist / connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    animate();
}

/* --- Math Captcha --- */
let captchaAnswer = 0;

function initCaptcha() {
    const questionEl = document.getElementById('captcha-question');
    if (!questionEl) return;

    // Simple math: A + B (1-10)
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    // Sometimes force multiplication for variety? No, keep it simple addition to start.
    // Let's do a switch for variety.
    const operators = ['+', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    if (operator === '+') {
        captchaAnswer = num1 + num2;
    } else {
        // Keep numbers smaller for multiplication logic
        const smallNum1 = Math.floor(Math.random() * 5) + 1;
        const smallNum2 = Math.floor(Math.random() * 5) + 1;
        captchaAnswer = smallNum1 * smallNum2;
        questionEl.textContent = `${smallNum1} x ${smallNum2} = ?`;
        return;
    }

    questionEl.textContent = `${num1} + ${num2} = ?`;
}

/* --- Form Handling --- */
/* --- Form Handling --- */
function initForm() {
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const userCaptcha = parseInt(document.getElementById('captcha').value);

        if (userCaptcha !== captchaAnswer) {
            statusEl.textContent = "Security Breach! Incorrect Captcha. Access Denied.";
            statusEl.className = 'form-status error';

            // Shake effect or reset
            initCaptcha();
            document.getElementById('captcha').value = '';
            return;
        }

        // Get Form Data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // UI Feedback
        const btn = form.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerHTML;
        btn.innerHTML = 'Transmitting Data... <i class="fas fa-satellite-dish fa-spin"></i>';
        btn.disabled = true;

        // Trigger Web3Forms AJAX
        // IMPORTANT: Replace 'YOUR_ACCESS_KEY' with your actual access key from web3forms.com
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: "edb735e1-47e9-4f83-a4a0-98fe40bb62d8", // Quantum Shield Nepal Key
                name: name,
                email: email,
                message: message,
                subject: "New Submission from Quantum Shield Website"
            })
        }).then(async (response) => {
            const json = await response.json();
            if (response.status == 200) {
                statusEl.textContent = "Transmission Successful. Secure channel established.";
                statusEl.className = 'form-status success';
                form.reset();
                initCaptcha();
            } else {
                statusEl.textContent = json.message || "Transmission Failed. Connection refused.";
                statusEl.className = 'form-status error';
            }
        }).catch(error => {
            statusEl.textContent = "Network Error. Signal lost.";
            statusEl.className = 'form-status error';
            console.error(error);
        }).finally(() => {
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
        });
    });
}

/* --- Navigation --- */
function initNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        // Toggle mobile menu
        if (links.style.display === 'flex') {
            links.style.display = 'none';
        } else {
            links.style.display = 'flex';
            links.style.flexDirection = 'column';
            links.style.position = 'absolute';
            links.style.top = '80px';
            links.style.left = '0';
            links.style.width = '100%';
            links.style.background = '#0a1124';
            links.style.padding = '20px';
            links.style.borderBottom = '1px solid var(--primary)';
        }
    });

    // Close menu on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                links.style.display = 'none';
            }
        });
    });
}
