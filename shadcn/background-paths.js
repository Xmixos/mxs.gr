// browser-ready version of BackgroundPaths
(function (window) {
  class BackgroundPaths {
    constructor(options) {
      this.container = options.container;
      this.particleCount = options.particleCount || 100;
      this.color = options.color || '#00ff88';
      this.speed = options.speed || 0.5;
      this.interactive = options.interactive || false;

      this.canvas = document.createElement('canvas');
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      this.particles = [];
      this.mouse = { x: null, y: null };
      this.resizeCanvas();
      this.createParticles();
      this.bindEvents();
      this.animate();
    }

    resizeCanvas() {
      this.canvas.width = this.container.offsetWidth;
      this.canvas.height = this.container.offsetHeight;
      window.addEventListener('resize', () => {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
      });
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 2 + 1,
          dx: (Math.random() - 0.5) * this.speed,
          dy: (Math.random() - 0.5) * this.speed,
        });
      }
    }

    bindEvents() {
      if (this.interactive) {
        window.addEventListener('mousemove', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          this.mouse.x = e.clientX - rect.left;
          this.mouse.y = e.clientY - rect.top;
        });
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let p of this.particles) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > this.canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.dy *= -1;

        // Draw lines if mouse is near
        if (this.interactive && this.mouse.x && this.mouse.y) {
          const dist = Math.hypot(p.x - this.mouse.x, p.y - this.mouse.y);
          if (dist < 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }
      requestAnimationFrame(this.animate.bind(this));
    }
  }

  window.BackgroundPaths = BackgroundPaths;
})(window);
