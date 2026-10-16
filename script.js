/**
 * Om Prasad Nayak (@doomsday-07) - Systems & Backend Portfolio
 * Core Client Engine: Interactive Terminal, B-Tree Simulator, Command Palette
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

      const subject = encodeURIComponent(`[Engineering Inquiry] From ${senderName}`);
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
  // INTERACTIVE TERMINAL EMULATOR (resctl / sysmon v0.4.2)
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
<span class="c-cyan">AVAILABLE SUBSYSTEM COMMANDS:</span>
  <span class="c-yellow">sysinfo</span>      - Inspect node hardware telemetry & runtime stats
  <span class="c-yellow">benchmarks</span>   - Execute simulated lock-free concurrency test
  <span class="c-yellow">projects</span>     - List featured production codebases & repos
  <span class="c-yellow">skills</span>       - Print architectural competencies matrix
  <span class="c-yellow">cat education</span>- View university degrees and hackathons
  <span class="c-yellow">contact</span>      - Output direct communication endpoints
  <span class="c-yellow">repo &lt;name&gt;</span>  - Open GitHub repository directly
  <span class="c-yellow">clear</span>        - Clear the terminal console buffer
  <span class="c-yellow">uptime</span>       - Print telemetry daemon uptime
`;
    },

    sysinfo: () => {
      return `
<span class="c-cyan">HOST ARCHITECTURE TELEMETRY:</span>
  <span class="c-dim">Hardware Node :</span> x86_64 / Apple Silicon Unified Architecture
  <span class="c-dim">Kernel / OS   :</span> Darwin 24.3 / Linux 6.8.9-zen (POSIX compliant)
  <span class="c-dim">Telemetry RSS :</span> <span class="c-green">4.28 MB</span> (Low-overhead resctl daemon)
  <span class="c-dim">CPU Sampling  :</span> 0.02% overhead over continuous polling
  <span class="c-dim">Runtimes      :</span> rustc 1.82-nightly | go 1.22.4 | python 3.11
  <span class="c-dim">Storage Core  :</span> ultra-bDB (Lock-free concurrent B-Tree)
  <span class="c-dim">Telemetry Pipe:</span> sysfs / procfs zero-copy ingestion
  <span class="c-dim">Status        :</span> <span class="c-green">ONLINE / NOMINAL</span>
`;
    },

    benchmarks: () => {
      setTimeout(() => {
        appendTermLine('<span class="c-dim">[1/3] Spawning 16 concurrent goroutines...</span>');
      }, 150);
      setTimeout(() => {
        appendTermLine('<span class="c-dim">[2/3] Executing 100,000 lock-free B-tree lookups...</span>');
      }, 350);
      setTimeout(() => {
        appendTermLine(`
<span class="c-green">BENCHMARK EXECUTION SUMMARY (ultra-bDB vs Mutex):</span>
  <span class="c-dim">Total Ops     :</span> 100,000 requests
  <span class="c-dim">Throughput    :</span> <span class="c-cyan">1,480,210 ops/sec</span>
  <span class="c-dim">Avg Latency   :</span> <span class="c-green">0.18 µs / op</span>
  <span class="c-dim">Contention    :</span> <span class="c-white">0% (Zero mutex stalls)</span>
  <span class="c-dim">Race Detector :</span> <span class="c-green">PASS (go test -race clean)</span>
`);
      }, 650);
      return '<span class="c-yellow">Initializing concurrency benchmark suite...</span>';
    },

    projects: () => {
      return `
<span class="c-cyan">FEATURED SYSTEMS REPOSITORIES (@doomsday-07):</span>
  1. <span class="c-white">sysmon / resctl</span>       [Rust]   - Real-time low-overhead system monitoring CLI
  2. <span class="c-white">ultra-bDB / Redorb</span>    [Go]     - Embedded ACID storage engine & lock-free B-tree
  3. <span class="c-white">respro2</span>               [Python] - Retail sales BI & inventory anomaly detection
  4. <span class="c-white">ecommerce-retention</span>   [Python] - ML churn modeling (86% recall) & cohort LTV
  5. <span class="c-white">ink-app</span>               [Python] - macOS digital inking + fine-tuned OCR transformer
  6. <span class="c-white">Email Writer Assist</span>   [Java]   - Spring Boot REST APIs with prompt chaining

<span class="c-dim">Visit GitHub: </span><a href="https://github.com/doomsday-07" target="_blank" class="c-cyan">https://github.com/doomsday-07</a>
`;
    },

    skills: () => {
      return `
<span class="c-cyan">TECHNICAL ARSENAL:</span>
  • <span class="c-white">Systems:</span> Rust, Go, Concurrency (Atomics, Channels), B-Trees, C/C++, pprof
  • <span class="c-white">Infra:</span>   Docker, Kubernetes, Terraform, OpenTelemetry, Grafana, Redis
  • <span class="c-white">Data:</span>    PostgreSQL, ACID Transactions, Spring Boot (Java), High-Throughput BI
  • <span class="c-white">ML & AI:</span> PyTorch, Transformers, EasyOCR Fine-tuning, Apple Vision, Scikit-Learn
`;
    },

    'cat education': () => {
      return `
<span class="c-cyan">ACADEMIC & INTENSIVE TRAINING:</span>
  • <span class="c-white">B.Tech in Computer Science & Engineering</span> (2023 - 2027)
    Silicon Institute Of Technology, Sambalpur | CGPA: 7.14
  • <span class="c-white">5-Day AI Agents Intensive Program</span> (2026)
    Google Vibe Coding & Autonomous Agentic Pipelines
  • <span class="c-white">Hack2Skill India Run Hackathon</span> (2026 Edition)
    High-concurrency distributed data processing prototype
  • <span class="c-white">D.A.V. Public School, Paradeep</span>
    +2 Science (72%) | Matriculation (88%)
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
  // B-TREE ENGINE SIMULATOR (ultra-bDB)
  // ==========================================================================
  const btreeViewport = document.getElementById('btree-viewport');
  const btreeKeyInput = document.getElementById('btree-key-input');
  const btnInsertKey = document.getElementById('btn-insert-key');
  const btnSampleTree = document.getElementById('btn-sample-tree');
  const btnBenchmarkReads = document.getElementById('btn-benchmark-reads');
  const btnResetTree = document.getElementById('btn-reset-tree');
  const simTreeStats = document.getElementById('sim-tree-stats');
  const simStatusMsg = document.getElementById('sim-status-msg');
  const benchmarkResults = document.getElementById('benchmark-results');

  // Mini B-Tree Model (Order 4, Max 3 keys per node)
  class BTreeNode {
    constructor(isLeaf = true) {
      this.keys = [];
      this.children = [];
      this.isLeaf = isLeaf;
    }
  }

  class BTree {
    constructor(order = 4) {
      this.order = order;
      this.maxKeys = order - 1; // 3
      this.root = new BTreeNode(true);
    }

    insert(key) {
      if (this.search(this.root, key)) {
        return false; // key already exists
      }

      const root = this.root;
      if (root.keys.length === this.maxKeys) {
        const newRoot = new BTreeNode(false);
        newRoot.children.push(this.root);
        this.splitChild(newRoot, 0, this.root);
        this.root = newRoot;
        this.insertNonFull(newRoot, key);
      } else {
        this.insertNonFull(root, key);
      }
      return true;
    }

    insertNonFull(node, key) {
      let i = node.keys.length - 1;

      if (node.isLeaf) {
        while (i >= 0 && key < node.keys[i]) {
          i--;
        }
        node.keys.splice(i + 1, 0, key);
      } else {
        while (i >= 0 && key < node.keys[i]) {
          i--;
        }
        i++;
        if (node.children[i].keys.length === this.maxKeys) {
          this.splitChild(node, i, node.children[i]);
          if (key > node.keys[i]) {
            i++;
          }
        }
        this.insertNonFull(node.children[i], key);
      }
    }

    splitChild(parent, index, child) {
      const mid = Math.floor(child.keys.length / 2);
      const promotedKey = child.keys[mid];

      const newNode = new BTreeNode(child.isLeaf);
      newNode.keys = child.keys.slice(mid + 1);
      child.keys = child.keys.slice(0, mid);

      if (!child.isLeaf) {
        newNode.children = child.children.slice(mid + 1);
        child.children = child.children.slice(0, mid + 1);
      }

      parent.children.splice(index + 1, 0, newNode);
      parent.keys.splice(index, 0, promotedKey);
    }

    search(node, key) {
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) {
        i++;
      }
      if (i < node.keys.length && key === node.keys[i]) {
        return true;
      }
      if (node.isLeaf) {
        return false;
      }
      return this.search(node.children[i], key);
    }

    getStats() {
      let nodeCount = 0;
      let depth = 0;

      const traverse = (node, curDepth) => {
        nodeCount++;
        if (curDepth > depth) depth = curDepth;
        if (!node.isLeaf) {
          node.children.forEach((c) => traverse(c, curDepth + 1));
        }
      };

      traverse(this.root, 1);
      return { nodeCount, depth };
    }
  }

  const btree = new BTree(4);

  function renderBTree(highlightKey = null) {
    if (!btreeViewport) return;
    btreeViewport.innerHTML = '';

    // Collect levels via BFS
    const levels = [];
    const queue = [{ node: btree.root, level: 0 }];

    while (queue.length > 0) {
      const { node, level } = queue.shift();
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);

      if (!node.isLeaf) {
        node.children.forEach((c) => queue.push({ node: c, level: level + 1 }));
      }
    }

    levels.forEach((nodeList, lvlIdx) => {
      const levelDiv = document.createElement('div');
      levelDiv.className = 'btree-level';

      nodeList.forEach((node) => {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'btree-node';

        if (node.keys.length === 0) {
          nodeDiv.innerHTML = '<span class="btree-key c-dim">[empty root]</span>';
        } else {
          node.keys.forEach((k) => {
            const keySpan = document.createElement('span');
            keySpan.className = 'btree-key';
            if (k === highlightKey) {
              keySpan.classList.add('active-key');
            }
            keySpan.textContent = k;
            nodeDiv.appendChild(keySpan);
          });
        }
        levelDiv.appendChild(nodeDiv);
      });

      btreeViewport.appendChild(levelDiv);
    });

    const stats = btree.getStats();
    if (simTreeStats) {
      simTreeStats.textContent = `Nodes: ${stats.nodeCount} | Depth: ${stats.depth} | Max Keys/Node: 3 (Order 4)`;
    }
  }

  // Initial Sample Data
  [12, 34, 56].forEach((k) => btree.insert(k));
  renderBTree();

  if (btnInsertKey && btreeKeyInput) {
    btnInsertKey.addEventListener('click', () => {
      const val = parseInt(btreeKeyInput.value, 10);
      if (isNaN(val)) {
        if (simStatusMsg) simStatusMsg.textContent = 'Please enter a valid number';
        return;
      }
      btreeKeyInput.value = '';

      const inserted = btree.insert(val);
      if (inserted) {
        renderBTree(val);
        if (simStatusMsg) simStatusMsg.textContent = `Inserted key [${val}] successfully`;
        showToast(`B-Tree: Key [${val}] indexed`);
      } else {
        if (simStatusMsg) simStatusMsg.textContent = `Key [${val}] already exists in tree`;
      }
    });

    btreeKeyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnInsertKey.click();
    });
  }

  if (btnSampleTree) {
    btnSampleTree.addEventListener('click', () => {
      const sampleKeys = [10, 25, 40, 55, 70, 85];
      sampleKeys.forEach((k) => btree.insert(k));
      renderBTree();
      if (simStatusMsg) simStatusMsg.textContent = `Inserted sample batch [${sampleKeys.join(', ')}]`;
      showToast('Inserted balanced sample keys into B-Tree');
    });
  }

  if (btnResetTree) {
    btnResetTree.addEventListener('click', () => {
      btree.root = new BTreeNode(true);
      renderBTree();
      if (simStatusMsg) simStatusMsg.textContent = 'Tree reset to empty root';
      if (benchmarkResults) benchmarkResults.style.display = 'none';
      showToast('B-Tree reset');
    });
  }

  if (btnBenchmarkReads && benchmarkResults) {
    btnBenchmarkReads.addEventListener('click', () => {
      if (simStatusMsg) simStatusMsg.textContent = 'Simulating 100,000 lock-free concurrent lookups...';
      benchmarkResults.style.display = 'block';

      const bmOps = document.getElementById('bm-ops');
      const bmLat = document.getElementById('bm-lat');

      if (bmOps) bmOps.textContent = 'Benchmarking...';
      if (bmLat) bmLat.textContent = '...';

      setTimeout(() => {
        const ops = (1450000 + Math.floor(Math.random() * 80000)).toLocaleString();
        const lat = (0.16 + Math.random() * 0.05).toFixed(2);

        if (bmOps) bmOps.textContent = `${ops} ops/s`;
        if (bmLat) bmLat.textContent = `${lat} µs`;
        if (simStatusMsg) simStatusMsg.textContent = `Completed 100,000 lookups with 0% mutex lock stalls`;
        showToast('Benchmark completed: 1.48M ops/sec with zero contention');
      }, 500);
    });
  }

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
      } else if (action === 'goto-simulator') {
        document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'copy-email') {
        copyToClipboard(EMAIL, 'Copied ' + EMAIL);
      } else if (action === 'open-github') {
        window.open('https://github.com/doomsday-07', '_blank');
      }
    });
  }

  // Console message for curious developers
  console.log(
    '%c OPN // doomsday-07 %c Systems & Backend Engineer %c https://github.com/doomsday-07 ',
    'background: #00f0ff; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #1e293b; color: #f8fafc; padding: 4px 8px;',
    'background: #0f172a; color: #00f0ff; padding: 4px 8px; border-radius: 0 4px 4px 0;'
  );
})();
