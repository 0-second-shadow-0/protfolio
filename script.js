/**
 * Om Prasad Nayak (@doomsday-07) - Data Analyst & Systems Engineer
 * Core Client Engine: Interactive Terminal, Filtering, Command Palette, Toast Feedback
 */

(function () {
  'use strict';

  // ==========================================================================
  // TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, duration = 3000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="c-cyan">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  // ==========================================================================
  // CLIPBOARD COPY HANDLERS
  // ==========================================================================
  const EMAIL = 'omprasadnayak7@gmail.com';

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (e) {
      showToast('Press Cmd+C to copy: ' + text);
    }
    document.body.removeChild(tempInput);
  }

  const heroCopyBtn = document.getElementById('hero-copy-email');
  if (heroCopyBtn) {
    heroCopyBtn.addEventListener('click', () => {
      copyToClipboard(EMAIL, 'Copied ' + EMAIL + ' to clipboard');
    });
  }

  const cardCopyBtn = document.getElementById('btn-copy-email-card');
  if (cardCopyBtn) {
    cardCopyBtn.addEventListener('click', () => {
      copyToClipboard(EMAIL, 'Copied ' + EMAIL + ' to clipboard');
    });
  }

  // Quick Mail Form
  const quickForm = document.getElementById('quick-contact-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('contact-sender-name')?.value || 'Inquirer';
      const senderEmail = document.getElementById('contact-sender-email')?.value || '';
      const message = document.getElementById('contact-sender-msg')?.value || '';

      const subject = encodeURIComponent(`[Data / Engineering Opportunity] From ${senderName}`);
      const body = encodeURIComponent(`Hi Om Prasad,\n\n${message}\n\nBest regards,\n${senderName}\n(${senderEmail})`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      showToast('Opening default mail client...');
    });
  }

  // ==========================================================================
  // MOBILE NAVIGATION & SCROLL SPY
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // Scroll Spy for Header Active Link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // ==========================================================================
  // PROJECT FILTERING
  // ==========================================================================
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================================================
  // INTERACTIVE TERMINAL EMULATOR (Data & Systems Shell)
  // ==========================================================================
  const termOutput = document.getElementById('term-output');
  const termInput = document.getElementById('term-input');
  const termRunBtn = document.getElementById('term-run-btn');
  const termClearBtn = document.getElementById('term-btn-clear');
  const cmdChips = document.querySelectorAll('.cmd-chip');

  const history = [];
  let historyIndex = -1;

  function appendTermLine(contentHtml, isCommand = false) {
    if (!termOutput) return;
    const line = document.createElement('div');
    line.className = 'term-line';
    if (isCommand) {
      line.innerHTML = `<span class="c-cyan">opn@carbon:~$</span> <span class="c-white">${contentHtml}</span>`;
    } else {
      line.innerHTML = contentHtml;
    }
    termOutput.appendChild(line);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function clearTerminal() {
    if (!termOutput) return;
    termOutput.innerHTML = '';
    appendTermLine('<span class="c-dim">Terminal cleared. Type <span class="c-yellow">help</span> for commands.</span>');
  }

  if (termClearBtn) {
    termClearBtn.addEventListener('click', clearTerminal);
  }

  // Terminal Commands Registry
  const commands = {
    help: () => {
      return `
<span class="c-cyan">AVAILABLE DATA & SYSTEMS COMMANDS:</span>
  <span class="c-yellow">sysinfo</span>      - Inspect hardware telemetry & analytical runtime stats
  <span class="c-yellow">benchmarks</span>   - Run simulated Star Schema SQL aggregation & Go ranker
  <span class="c-yellow">projects</span>     - List all 5 verified repositories on @doomsday-07
  <span class="c-yellow">skills</span>       - Print analytical and systems technical matrix
  <span class="c-yellow">cat education</span>- View chronological degrees and hackathons
  <span class="c-yellow">contact</span>      - Output communication channels
  <span class="c-yellow">repo &lt;name&gt;</span>  - Open GitHub repository directly
  <span class="c-yellow">clear</span>        - Clear terminal console buffer
  <span class="c-yellow">uptime</span>       - Print system uptime
`;
    },

    sysinfo: () => {
      return `
<span class="c-cyan">ANALYTICS & HOST RUNTIME (sysmon telemetry):</span>
  <span class="c-dim">Host Platform :</span> macOS / Linux POSIX environment
  <span class="c-dim">Primary Roles :</span> <span class="c-cyan">Data Analyst, Analytics Engineer, Systems Developer</span>
  <span class="c-dim">Data Engines  :</span> PostgreSQL 16 | Star Schema Data Marts | DuckDB
  <span class="c-dim">BI & Viz      :</span> Tableau 2024.1 | Power BI (25+ DAX Measures) | Excel Models
  <span class="c-dim">Python Stack  :</span> Pandas | NumPy | Scikit-Learn | FastAPI | PyTorch
  <span class="c-dim">Systems Stack :</span> Go (Pure Stdlib) | C/C++ | Hardware Telemetry (sysmon)
  <span class="c-dim">Status        :</span> <span class="c-green">ONLINE / NOMINAL</span>
`;
    },

    benchmarks: () => {
      setTimeout(() => {
        appendTermLine('<span class="c-dim">[1/2] Executing Star Schema analytical aggregation across 100k rows (respro2)...</span>');
      }, 150);
      setTimeout(() => {
        appendTermLine('<span class="c-green">✓ Star Schema Query: GMROI & 14-day Rolling Z-Scores computed in 0.041s (PostgreSQL CTEs).</span>');
      }, 350);
      setTimeout(() => {
        appendTermLine('<span class="c-dim">[2/2] Streaming and ranking 100,000 JSONL candidates via Redorb-Ranker (Go)...</span>');
      }, 500);
      setTimeout(() => {
        appendTermLine(`
<span class="c-green">BENCHMARK EXECUTION SUMMARY:</span>
  <span class="c-dim">Dataset Scale :</span> 100,000+ Transactions & Candidate Records
  <span class="c-dim">Go Ranking Run:</span> <span class="c-cyan">0.384 seconds</span> (260,416 profiles / sec)
  <span class="c-dim">Churn Model   :</span> <span class="c-green">86% Recall</span> on High-Risk Attrition Identification
  <span class="c-dim">Dependencies  :</span> Zero third-party packages in Go ranker & sysmon CLI
`);
      }, 750);
      return '<span class="c-yellow">Initializing Analytics & Systems benchmark test...</span>';
    },

    projects: () => {
      return `
<span class="c-cyan">ACTIVE REPOSITORIES ON GITHUB (@doomsday-07):</span>
  1. <span class="c-white">respro2</span>                       [Python/SQL] - Real-time Retail BI, Star Schema, GMROI & Anomaly Detection
  2. <span class="c-white">ecommerce-retention-analytics</span> [Python/PBI] - 100k+ Transaction RFM Segmentation, 25+ DAX, 86% Recall Churn
  3. <span class="c-white">Redorb-Ranker</span>                 [Go]         - 100k candidate ranker in pure Go for India Runs Challenge
  4. <span class="c-white">sysmon</span>                        [Python]     - Cross-platform system telemetry monitor (zero external deps)
  5. <span class="c-white">ink-app</span>                       [Python/ML]  - Low-latency digital inking with ML handwriting OCR pipeline

<span class="c-dim">GitHub Profile: </span><a href="https://github.com/doomsday-07" target="_blank" class="c-cyan">https://github.com/doomsday-07</a>
`;
    },

    skills: () => {
      return `
<span class="c-cyan">TECHNICAL ARSENAL:</span>
  • <span class="c-white">Data Analytics & BI :</span> Advanced SQL (CTEs, Window Functions), PostgreSQL, Star Schema,
                          Power BI (25+ DAX Measures), Tableau, Excel (openpyxl/xlsxwriter),
                          RFM Segmentation, Cohort Retention Curves, Retail KPIs (GMROI, Sell-Through)
  • <span class="c-white">Machine Learning    :</span> Scikit-Learn (Logistic Regression, Random Forest, 86% Recall Churn),
                          Pandas, NumPy, EDA, PyTorch, Optical Character Recognition
  • <span class="c-white">Systems & Software  :</span> Go (Concurrency, Goroutines, Channels, Zero-Deps), Python (Stdlib),
                          High-Throughput Streaming, C/C++, Hardware Telemetry (sysmon)
  • <span class="c-white">Cloud & ETL         :</span> Python ETL Pipelines, FastAPI, Docker, Docker Compose, Linux internals
`;
    },

    'cat education': () => {
      return `
<span class="c-cyan">CHRONOLOGICAL JOURNEY & CREDENTIALS:</span>
  1. <span class="c-white">Secondary School Examination (Matriculation)</span> [2021]
     D.A.V. Public School, Paradeep | Score: 88%
  2. <span class="c-white">Higher Secondary (+2 Science)</span> [2021 - 2023]
     D.A.V. Public School, Paradeep | Score: 72%
  3. <span class="c-white">B.Tech in Computer Science & Engineering</span> [2023 - 2027 (Expected)]
     Silicon Institute Of Technology, Sambalpur | CGPA: 7.14
  4. <span class="c-white">India Runs Data & AI Challenge</span> [2026]
     Team SlEePeR_cElL | Engineered Redorb-Ranker in Go for Redrob AI
  5. <span class="c-white">5-Day AI Agents Intensive Program</span> [2026]
     Google Vibe Coding & Autonomous Agentic Workflows
`;
    },

    education: () => commands['cat education'](),

    contact: () => {
      return `
<span class="c-cyan">COMMUNICATION CHANNELS:</span>
  • <span class="c-dim">Email    :</span> <a href="mailto:${EMAIL}" class="c-white">${EMAIL}</a>
  • <span class="c-dim">LinkedIn :</span> <a href="https://linkedin.com/in/om-prasad-nayak-5b713a294" target="_blank" class="c-white">linkedin.com/in/om-prasad-nayak-5b713a294</a>
  • <span class="c-dim">GitHub   :</span> <a href="https://github.com/doomsday-07" target="_blank" class="c-cyan">github.com/doomsday-07</a>
  • <span class="c-dim">Location :</span> Paradeep / Sambalpur, Odisha, India
`;
    },

    whoami: () => commands.contact(),

    uptime: () => {
      return `<span class="c-green">up 42 days, 14:08, 1 user, load average: 0.04, 0.08, 0.05</span>`;
    },

    clear: () => {
      clearTerminal();
      return null;
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    history.push(cmd);
    historyIndex = history.length;

    appendTermLine(cmd, true);

    const lower = cmd.toLowerCase();

    // Check specific handlers
    if (lower.startsWith('repo ')) {
      const repoName = lower.replace('repo ', '').trim();
      const url = `https://github.com/doomsday-07/${repoName}`;
      appendTermLine(`<span class="c-dim">Navigating to </span><a href="${url}" target="_blank" class="c-cyan">${url}</a>...`);
      window.open(url, '_blank');
      return;
    }

    if (lower.startsWith('echo ')) {
      appendTermLine(cmd.substring(5));
      return;
    }

    if (commands[lower]) {
      const result = commands[lower]();
      if (result) appendTermLine(result);
    } else {
      appendTermLine(`<span class="c-dim">command not found: </span><span class="c-yellow">${cmd}</span><span class="c-dim">. Type <span class="c-cyan">help</span> for command list.</span>`);
    }
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = termInput.value;
        termInput.value = '';
        executeCommand(value);
      } else if (e.key === 'ArrowUp') {
        if (history.length > 0 && historyIndex > 0) {
          historyIndex--;
          termInput.value = history[historyIndex];
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < history.length - 1) {
          historyIndex++;
          termInput.value = history[historyIndex];
        } else {
          historyIndex = history.length;
          termInput.value = '';
        }
        e.preventDefault();
      }
    });
  }

  if (termRunBtn && termInput) {
    termRunBtn.addEventListener('click', () => {
      const value = termInput.value;
      termInput.value = '';
      executeCommand(value);
      termInput.focus();
    });
  }

  // Quick Chips
  cmdChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        if (termInput) termInput.focus();
      }
    });
  });

  // Project Card "Test in TUI" Buttons
  document.querySelectorAll('.btn-card-terminal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const cmd = btn.getAttribute('data-term-cmd');
      if (cmd) {
        e.preventDefault();
        const termElem = document.getElementById('terminal');
        if (termElem) termElem.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => executeCommand(cmd), 400);
      }
    });
  });

  // ==========================================================================
  // COMMAND PALETTE (CMD+K / CTRL+K)
  // ==========================================================================
  const cmdBackdrop = document.getElementById('cmd-palette-backdrop');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');
  const btnQuickTerminal = document.getElementById('btn-quick-terminal');

  function openPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.add('open');
    cmdBackdrop.setAttribute('aria-hidden', 'false');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
  }

  function closePalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove('open');
    cmdBackdrop.setAttribute('aria-hidden', 'true');
  }

  if (btnQuickTerminal) {
    btnQuickTerminal.addEventListener('click', openPalette);
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdBackdrop && cmdBackdrop.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  if (cmdBackdrop) {
    cmdBackdrop.addEventListener('click', (e) => {
      if (e.target === cmdBackdrop) closePalette();
    });
  }

  // Palette Actions
  if (cmdResults) {
    cmdResults.addEventListener('click', (e) => {
      const item = e.target.closest('.cmd-item');
      if (!item) return;

      const action = item.getAttribute('data-action');
      closePalette();

      if (action === 'goto-systems') {
        document.getElementById('systems')?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'open-terminal') {
        document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('term-input')?.focus();
      } else if (action === 'copy-email') {
        copyToClipboard(EMAIL, 'Copied ' + EMAIL);
      } else if (action === 'open-github') {
        window.open('https://github.com/doomsday-07', '_blank');
      }
    });
  }

  // Developer console badge
  console.log(
    '%c OPN // doomsday-07 %c Data Analyst & Systems Engineer %c https://github.com/doomsday-07 ',
    'background: #00f0ff; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #1e293b; color: #f8fafc; padding: 4px 8px;',
    'background: #0f172a; color: #00f0ff; padding: 4px 8px; border-radius: 0 4px 4px 0;'
  );
})();
