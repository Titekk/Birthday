document.addEventListener('DOMContentLoaded', () => {
  const giftBox = document.getElementById('gift-box');
  const cardSection = document.getElementById('card-section');
  const btnReopen = document.getElementById('btn-reopen');
  const btnConfetti = document.getElementById('btn-confetti');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const balloonsContainer = document.getElementById('balloons-container');

  const ctx = confettiCanvas ? confettiCanvas.getContext('2d') : null;

  let confettiParticles = [];
  let animationFrameId = null;

  // Resize canvas to full window
  function resizeCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Floating balloons generator
  function initBalloons() {
    if (!balloonsContainer) return;
    const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#e056fd', '#ff7979'];
    const count = window.innerWidth < 600 ? 10 : 18;

    balloonsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = 10 + Math.random() * 8;

      balloon.style.backgroundColor = color;
      balloon.style.left = `${left}%`;
      balloon.style.animationDelay = `${delay}s`;
      balloon.style.animationDuration = `${duration}s`;

      balloonsContainer.appendChild(balloon);
    }
  }

  initBalloons();

  // Confetti Particle Class
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 4;
      this.color = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#e056fd', '#ffffff', '#ff7979'][
        Math.floor(Math.random() * 7)
      ];
      this.speedX = (Math.random() - 0.5) * 12;
      this.speedY = (Math.random() - 0.8) * 14;
      this.gravity = 0.35;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.opacity = 1;
    }

    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.opacity -= 0.008;
    }

    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.globalAlpha = Math.max(0, this.opacity);
      context.fillStyle = this.color;
      context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
      context.restore();
    }
  }

  function triggerConfetti(x, y) {
    const originX = x !== undefined ? x : window.innerWidth / 2;
    const originY = y !== undefined ? y : window.innerHeight / 2;

    const particleCount = window.innerWidth < 600 ? 70 : 120;
    for (let i = 0; i < particleCount; i++) {
      confettiParticles.push(new Particle(originX, originY));
    }

    if (!animationFrameId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles = confettiParticles.filter((p) => p.opacity > 0 && p.y < confettiCanvas.height + 50);

    confettiParticles.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });

    if (confettiParticles.length > 0) {
      animationFrameId = requestAnimationFrame(animateConfetti);
    } else {
      animationFrameId = null;
    }
  }

  // Open Gift Box Handler
  function openGift(e) {
    if (giftBox.classList.contains('opened')) return;

    giftBox.classList.add('opened');

    const rect = giftBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    triggerConfetti(centerX, centerY);

    setTimeout(() => {
      cardSection.classList.remove('hidden');
      cardSection.classList.add('show');
      cardSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  }

  // Keyboard accessibility
  giftBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGift(e);
    }
  });

  giftBox.addEventListener('click', openGift);

  if (btnReopen) {
    btnReopen.addEventListener('click', () => {
      giftBox.classList.remove('opened');
      cardSection.classList.remove('show');
      cardSection.classList.add('hidden');

      setTimeout(() => {
        openGift();
      }, 300);
    });
  }

  if (btnConfetti) {
    btnConfetti.addEventListener('click', (e) => {
      const rect = btnConfetti.getBoundingClientRect();
      triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }
});
