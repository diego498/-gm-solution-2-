/* ===========================
   LeadMed – script.js
=========================== */

/* ---- NAV scroll state ---- */
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Mobile burger ---- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ---- Scroll reveal (Intersection Observer) ---- */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Hero elements appear on load ---- */
document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 200 + i * 150);
});

/* ---- Boleta: contador $150.786 → $0 (loop) ---- */
const heroCounter = document.getElementById('heroCounter');
if (heroCounter) {
  const startVal = 150786;
  const duration = 2800;
  const pauseAfter = 1500;

  function runCounter() {
    let startTime = null;
    const tick = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal * (1 - ease));
      heroCounter.textContent = '$' + current.toLocaleString('es-CL');
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        heroCounter.textContent = '$0';
        setTimeout(runCounter, pauseAfter);
      }
    };
    requestAnimationFrame(tick);
  }

  setTimeout(runCounter, 900);
}

/* ---- Counter animation (loop) ---- */
document.querySelectorAll('.stat__num').forEach(el => {
  const target = +el.dataset.target;
  const duration = 1800;
  const pauseAfter = 2500;

  function runCount() {
    el.textContent = '0';
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
        setTimeout(runCount, pauseAfter);
      }
    };
    requestAnimationFrame(tick);
  }

  setTimeout(runCount, 500);
});

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- Parallax subtle on hero ---- */
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
}

/* ---- File upload: mostrar nombre del archivo ---- */
const boletaInput = document.getElementById('boleta');
const fileName = document.getElementById('fileName');
if (boletaInput && fileName) {
  boletaInput.addEventListener('change', () => {
    const file = boletaInput.files[0];
    fileName.textContent = file ? '📎 ' + file.name : '';
  });
}

/* ---- Form submit → Formspree ---- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/TU_FORM_ID', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        window.location.href = 'https://gmsolution.cl/gracias';
      } else {
        throw new Error('error');
      }
    } catch {
      btn.textContent = 'Error al enviar. Intenta de nuevo.';
      btn.style.background = '#c0392b';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }
  });
}


/* ---- FAQ accordion ---- */
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

/* ---- Active nav link highlight ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));


/* ---- Why-us stagger observer ---- */
const whyCards = document.querySelectorAll('.why-card');
if (whyCards.length) {
  const whyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          whyObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  whyCards.forEach(c => whyObserver.observe(c));
}

/* ---- Payment cards stagger observer ---- */
const paymentCards = document.querySelectorAll('.payment-card');
if (paymentCards.length) {
  const payObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          payObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  paymentCards.forEach(c => payObserver.observe(c));
}



/* ---- Calculadora de ahorro solar ---- */
(function () {
  const slider   = document.getElementById('calcSlider');
  const valEl    = document.getElementById('calcValue');
  const barFill  = document.getElementById('calcBarFill');
  const barSav   = document.getElementById('calcBarSaving');
  const resMon   = document.getElementById('resMonthlySaving');
  const resSys   = document.getElementById('resSystemSize');
  const resPay   = document.getElementById('resPayback');
  const resAnn   = document.getElementById('resAnnualSaving');
  const res25    = document.getElementById('res25years');

  if (!slider) return;

  function fmt(n) {
    return '$' + Math.round(n).toLocaleString('es-CL');
  }

  function calc(bill) {
    const savingsRate   = 0.85;            // 85% de reducción de cuenta
    const tariff        = 130;             // CLP/kWh tarifa residencial sur Chile
    const peakSunH      = 3.5;            // horas sol pico, sur de Chile
    const perfFactor    = 0.80;
    const costPerKw     = 850000;          // CLP por kWp instalado

    const monthlyKwh  = bill / tariff;
    const sysKw       = Math.max(2, Math.round(monthlyKwh / (peakSunH * 30 * perfFactor)));
    const sysCost     = sysKw * costPerKw;
    const monthlySav  = bill * savingsRate;
    const annualSav   = monthlySav * 12;
    const paybackYrs  = sysCost / annualSav;
    const payLow      = Math.max(3, Math.floor(paybackYrs * 0.9));
    const payHigh     = Math.ceil(paybackYrs * 1.1);

    return { monthlySav, sysKw, annualSav, payLow, payHigh };
  }

  function update() {
    const bill = parseInt(slider.value);
    const min  = parseInt(slider.min);
    const max  = parseInt(slider.max);
    const pct  = (bill - min) / (max - min) * 100;

    // Actualizar display del valor
    valEl.textContent = bill.toLocaleString('es-CL');

    // Actualizar color del slider
    slider.style.background =
      `linear-gradient(to right, var(--teal) 0%, var(--teal) ${pct}%, #e2e8e6 ${pct}%, #e2e8e6 100%)`;

    // Calcular resultados
    const r = calc(bill);

    // Barra de ahorro (% ahorrado)
    const savPct = 85;
    barFill.style.width = savPct + '%';
    barSav.textContent  = fmt(r.monthlySav) + ' ahorrado';

    // Cards de resultado
    resMon.textContent = fmt(r.monthlySav);
    resSys.textContent = r.sysKw + ' kWp';
    resPay.textContent = r.payLow + '–' + r.payHigh + ' años';
    resAnn.textContent = fmt(r.annualSav);
    res25.textContent  = fmt(r.annualSav * 25);
  }

  slider.addEventListener('input', update);
  update();
})();

/* ---- Timeline bar animation ---- */
const tlBar = document.querySelector('.tl-bar');
if (tlBar) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) tlBar.classList.add('in-view');
  }, { threshold: 0.3 }).observe(tlBar);
}
