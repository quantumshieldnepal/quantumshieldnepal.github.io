/* ===================================================================
   Quantum Shield Nepal - Interactions
   Sticky nav · Mobile nav · Reveal · Counters · Console · Form
   ------------------------------------------------------------------- */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------- year ----------------
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---------------- nav scroll state ----------------
  const navEl = document.querySelector('.qs-nav');
  if (navEl) {
    const onScroll = () => {
      if (window.scrollY > 8) navEl.classList.add('is-scrolled');
      else navEl.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------------- mobile nav ----------------
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const open = !mobileNav.classList.contains('hidden');
      if (open) {
        mobileNav.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileNav.classList.remove('hidden');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------------- reveal on scroll ----------------
  const revealTargets = document.querySelectorAll('.qs-svc, .qs-cert, .qs-hof, .qs-step, .qs-metric, .qs-operator, .qs-feat, .qs-float-card');
  revealTargets.forEach(el => el.classList.add('qs-reveal'));
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('is-visible'), i * 35);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  // ---------------- animated counters ----------------
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = reduceMotion ? 0 : 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / Math.max(1, duration));
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  // ---------------- terminal ----------------
  const termOutput = document.getElementById('termOutput');
  const termForm = document.getElementById('termForm');
  const termInput = document.getElementById('termInput');
  const startTime = Date.now();
  const uptimeEl = document.querySelector('.qs-term__meta');
  if (uptimeEl) {
    setInterval(() => {
      const s = Math.floor((Date.now() - startTime) / 1000);
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const sec = (s % 60).toString().padStart(2, '0');
      uptimeEl.textContent = `UPTIME ${m}:${sec}`;
    }, 1000);
  }

  const history = [];
  let hIndex = -1;

  const writeLine = (html) => {
    if (!termOutput) return;
    const div = document.createElement('div');
    div.innerHTML = html;
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
  };

  const writeBlock = (html) => writeLine(`<span class="ln-block">${html}</span>`);

  const renderPrompt = (cmd) =>
    `<span><span class="ln-prompt">visitor@qsn:~$</span><span class="ln-cmd">${cmd}</span></span>`;

  const commands = {
    help() {
      writeBlock(`
        <span class="ln-out--accent">Available commands:</span>
        <table>
          <tr><td>help</td><td>List available commands</td></tr>
          <tr><td>whoami</td><td>About Quantum Shield Nepal</td></tr>
          <tr><td>services</td><td>Service matrix overview</td></tr>
          <tr><td>certifications</td><td>Verified credentials</td></tr>
          <tr><td>contact</td><td>Secure communication channels</td></tr>
          <tr><td>clear</td><td>Clear console output</td></tr>
        </table>
      `);
    },
    whoami() {
      writeBlock(`
        <span class="ln-out--accent">Quantum Shield Nepal - Offensive Security &amp; AI Research Unit</span>
        <span class="ln-out">A specialist 5-person cell. Kathmandu, Nepal.</span>
        <span class="ln-out">Mandate: red teaming, AD exploitation, application &amp; mobile security,</span>
        <span class="ln-out">adversary simulation, and AI-driven security engineering for serious estates.</span>
      `);
    },
    services() {
      writeBlock(`
        <table>
          <tr><td>01</td><td>Offensive Security Operations - AD, Kerberos, lateral movement</td></tr>
          <tr><td>02</td><td>Application Security - Web, API, mobile, runtime</td></tr>
          <tr><td>03</td><td>AI Security Engineering - Gemini, Ollama, pipelines</td></tr>
          <tr><td>04</td><td>Network Security - External/internal pentesting, segmentation, lateral movement</td></tr>
          <tr><td>05</td><td>Mobile Security - iOS/Android, Frida instrumentation, SSL bypass</td></tr>
          <tr><td>06</td><td>Security Research &amp; Tooling - Detection, malware, automation</td></tr>
        </table>
      `);
    },
    certifications() {
      writeBlock(`
        <table>
          <tr><td>eWPTX</td><td>Web Application Pentester eXtreme</td></tr>
          <tr><td>WEBRTA</td><td>Web Red Team Analyst</td></tr>
          <tr><td>CRTA</td><td>Certified Red Team Analyst</td></tr>
          <tr><td>CPIA</td><td>Certified Process Injection Analyst</td></tr>
          <tr><td>MCRTA</td><td>Multi-Cloud Red Team Analyst</td></tr>
          <tr><td>CEH</td><td>Certified Ethical Hacker</td></tr>
          <tr><td>CMPEN</td><td>Certified Mobile Pentester</td></tr>
          <tr><td>CAPEN</td><td>Certified Application Pentester</td></tr>
        </table>
      `);
    },
    contact() {
      writeBlock(`
        <span class="ln-out--accent">Get in touch:</span>
        <span class="ln-out">  · email     info@quantumshieldnepal.com</span>
        <span class="ln-out">  · location  Kathmandu, Nepal</span>
        <span class="ln-out">  · response  within one business day</span>
      `);
    },
    clear() {
      if (termOutput) termOutput.innerHTML = '';
    }
  };

  const banner = () => {
    writeBlock(`
      <span class="ln-out--accent">QSN secure-shell · v1.0</span>
      <span class="ln-out">Welcome, visitor. Type <span style="color:var(--c-crimson)">help</span> to enumerate commands.</span>
    `);
  };

  if (termOutput) banner();

  if (termForm && termInput) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = termInput.value;
      const cmd = raw.trim().toLowerCase();
      writeLine(renderPrompt(raw || ''));
      if (raw && history[history.length - 1] !== raw) history.push(raw);
      hIndex = history.length;

      if (cmd === '') {
        // no-op
      } else if (commands[cmd]) {
        commands[cmd]();
      } else {
        writeBlock(`<span class="ln-err">command not found: ${escapeHtml(cmd)}</span><span class="ln-out">type 'help' for available commands.</span>`);
      }
      termInput.value = '';
      termOutput.scrollTop = termOutput.scrollHeight;
    });

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length === 0) return;
        hIndex = Math.max(0, hIndex - 1);
        termInput.value = history[hIndex] || '';
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (history.length === 0) return;
        hIndex = Math.min(history.length, hIndex + 1);
        termInput.value = history[hIndex] || '';
      }
    });

    document.querySelector('.qs-term')?.addEventListener('click', (e) => {
      if (!(e.target instanceof HTMLAnchorElement || e.target instanceof HTMLButtonElement)) {
        termInput.focus();
      }
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------------- contact form ----------------
  const challengeQ = document.getElementById('challengeQ');
  const cChallenge = document.getElementById('cChallenge');
  let challengeAnswer = 0;
  const newChallenge = () => {
    const a = 2 + Math.floor(Math.random() * 8);
    const b = 2 + Math.floor(Math.random() * 8);
    challengeAnswer = a + b;
    if (challengeQ) challengeQ.textContent = `${a} + ${b} = ?`;
  };
  newChallenge();

  const cForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (cForm) {
    const WEB3FORMS_ACCESS_KEY = 'edb735e1-47e9-4f83-a4a0-98fe40bb62d8';
    const submitBtn = cForm.querySelector('button[type="submit"]');
    const submitOriginal = submitBtn ? submitBtn.innerHTML : '';

    cForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.style.color = '';
      const name = document.getElementById('cName').value.trim();
      const org = document.getElementById('cOrg').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      const scope = document.getElementById('cScope').value;
      const message = document.getElementById('cMsg').value.trim();
      const ans = parseInt(cChallenge.value, 10);

      if (!name || !email || !message) {
        formStatus.textContent = '✗ Name, email, and message are required.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formStatus.textContent = '✗ Please enter a valid email address.';
        return;
      }
      if (ans !== challengeAnswer) {
        formStatus.textContent = '✗ Quick check failed. A new question has been issued.';
        newChallenge();
        cChallenge.value = '';
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending…';
      }
      formStatus.style.color = 'var(--c-ink-700)';
      formStatus.textContent = 'Sending message…';

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name,
            email,
            organization: org || '-',
            scope,
            message,
            subject: `New Submission from Quantum Shield Website - ${scope}`,
            from_name: 'Quantum Shield Website'
          })
        });

        const json = await response.json().catch(() => ({}));

        if (response.status === 200 && json.success) {
          formStatus.style.color = 'var(--c-ink-700)';
          formStatus.textContent = '✓ Transmission successful. Secure channel established.';
          cForm.reset();
          newChallenge();
        } else {
          formStatus.style.color = '';
          formStatus.textContent = '✗ ' + (json.message || 'Transmission failed. Connection refused.');
        }
      } catch (error) {
        formStatus.style.color = '';
        formStatus.textContent = '✗ You have been Rate-Limited, Try again after an hour.';
        console.error(error);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitOriginal;
        }
      }
    });
  }

  // ---------------- subtle hero diagram parallax ----------------
  if (!reduceMotion) {
    const dia = document.querySelector('.qs-diagram');
    if (dia) {
      let raf = 0;
      const onMove = (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const rect = dia.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / rect.width;
          const dy = (e.clientY - cy) / rect.height;
          dia.style.transform = `translate(${dx * 4}px, ${dy * 4}px)`;
          raf = 0;
        });
      };
      window.addEventListener('mousemove', onMove, { passive: true });
    }
  }

})();
