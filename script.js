// --- IMAGE ZOOM LOGIC ---
        function openImage(src) {
            const lightbox = document.getElementById('lightbox');
            const img = document.getElementById('lightbox-img');
            img.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scrolling when open
        }

        function closeImage() {
            const lightbox = document.getElementById('lightbox');
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Enable scrolling back
        }

        // --- SEQUENCE ORCHESTRATION ---
        document.addEventListener("DOMContentLoaded", () => {
            
            // 1. Text Animation Start
            setTimeout(() => {
                document.getElementById('intro-text').classList.add('animate');
            }, 500);

            setTimeout(() => {
                document.getElementById('intro-sub').classList.add('animate');
            }, 1500);

            // 2. Cake & Celebration Start (at 3.5s)
            setTimeout(() => {
                document.getElementById('cake-model').classList.add('visible');
                startConfetti();
            }, 3500);

            // 3. Transition to Main Site (at 9s)
            setTimeout(() => {
                transitionToHome();
            }, 9000);
        });

        function transitionToHome() {
            const overlay = document.getElementById('intro-overlay');
            const main = document.getElementById('main-site');
            
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                overlay.style.display = 'none';
                stopConfetti(); // Save resources
                
                main.style.display = 'block';
                // Force reflow
                void main.offsetWidth;
                main.style.opacity = '1';
                
                // Initialize Scroll Observer
                initScrollReveal();
            }, 1500);
        }

        // --- SCROLL REVEAL ANIMATION ---
        function initScrollReveal() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal');
                    }
                });
            }, { threshold: 0.15 });

            document.querySelectorAll('section').forEach(section => {
                observer.observe(section);
            });
        }

        // --- PARTICLE SYSTEM (Fireworks/Confetti) ---
        const canvas = document.getElementById('celebration-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        // Resize
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.velY = -Math.random() * 10 - 5; // Upward burst
                this.velX = Math.random() * 6 - 3;
                this.size = Math.random() * 5 + 2;
                this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
                this.gravity = 0.2;
                this.drag = 0.98;
                this.shrink = 0.96;
            }
            update() {
                this.velY += this.gravity;
                this.velY *= this.drag;
                this.velX *= this.drag;
                this.x += this.velX;
                this.y += this.velY;
                this.size *= this.shrink;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Streamer Class (Rectangular Confetti)
        class Streamer {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = -20;
                this.w = Math.random() * 10 + 5;
                this.h = Math.random() * 20 + 10;
                this.velY = Math.random() * 5 + 2;
                this.velX = Math.random() * 4 - 2;
                this.color = `hsl(${Math.random() * 50 + 320}, 90%, 60%)`; // Pinks/Reds
                this.angle = 0;
                this.spin = Math.random() * 0.2 - 0.1;
            }
            update() {
                this.y += this.velY;
                this.x += Math.sin(this.y * 0.01) + this.velX;
                this.angle += this.spin;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
                ctx.restore();
            }
        }

        function startConfetti() {
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Add new particles occasionally
                if (Math.random() < 0.3) {
                    for(let i=0; i<5; i++) particles.push(new Particle()); // Bursts
                }
                if (Math.random() < 0.5) {
                    particles.push(new Streamer()); // Falling streamers
                }

                // Update & Draw
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.update();
                    p.draw();
                    
                    // Remove dead particles
                    if (p.size < 0.1 || p.y > canvas.height + 50) {
                        particles.splice(i, 1);
                    }
                }
                animationId = requestAnimationFrame(animate);
            }
            animate();
        }

        function stopConfetti() {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // --- VAULT LOGIC ---
        function unlockVault() {
            const pass = document.getElementById('vault-pass').value;
            const error = document.getElementById('vault-error');
            const gallery = document.getElementById('hidden-gallery');
            
            // Your special date
            if (pass === '17032005') {
                error.textContent = "";
                gallery.classList.add('open');
            } else {
                error.textContent = "Incorrect Code. Hint: Special Date.";
                document.getElementById('vault-pass').value = '';
            }
        }
