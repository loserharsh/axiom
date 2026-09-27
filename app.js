// Zenith Study Vault & Deathline Tracker - Application Core
// Responsive Mobile/PWA Engine, iOS Slide-down Focus Lockscreen with Timer,
// Syllabus Management, and Real TypeSafe Jev System 1 Decision Integration

document.addEventListener('DOMContentLoaded', () => {
  function getOffsetDate(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  }

  function safeJsonParse(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      if (!val) return fallback;
      const parsed = JSON.parse(val);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (e) {
      console.warn(`[StudyVault] Safely recovering corrupted localStorage key '${key}':`, e);
      return fallback;
    }
  }

  function getSyllabus(key) {
    const fallbackSyllabus = {
      jee: { name: "JEE (Main & Advanced)", target: "IIT JEE", subjects: [] },
      neet: { name: "NEET (UG Medical)", target: "NEET UG", subjects: [] },
      cbse12: { name: "Class 12 Boards (Science)", target: "CBSE 12th", subjects: [] }
    };
    const catalog = (typeof window !== 'undefined' && window.SYLLABUS_DATA) || 
                    (typeof SYLLABUS_DATA !== 'undefined' ? SYLLABUS_DATA : null) || fallbackSyllabus;
    return catalog[key] || catalog.jee || fallbackSyllabus.jee;
  }

  // --- APPLICATION STATE ---
  const defaultHabits = [
    {
      id: 'h1',
      title: 'Physics PYQ & Concept Drill',
      subject: 'physics',
      streak: 0,
      history: Array(49).fill(0),
      checkedToday: false
    },
    {
      id: 'h2',
      title: 'Chemistry Reactions & Problem Sets',
      subject: 'chemistry',
      streak: 0,
      history: Array(49).fill(0),
      checkedToday: false
    },
    {
      id: 'h3',
      title: 'Mathematics Calculus / Biology NCERT',
      subject: 'mathematics',
      streak: 0,
      history: Array(49).fill(0),
      checkedToday: false
    },
    {
      id: 'h4',
      title: 'Daily Mock Test & Error Analysis',
      subject: 'test',
      streak: 0,
      history: Array(49).fill(0),
      checkedToday: false
    }
  ];

  const defaultJev = {
    readiness_score: 0,
    deadline_risk_prob: 0.0,
    priority_subject: 'physics',
    burnout_hazard: 'Not yet evaluated',
    daily_strategy: 'Complete calibration & mark first chapter',
    latency_ms: 0,
    last_updated: null
  };

  const state = {
    activeView: 'home', // 'home' | 'syllabus' | 'streak' | 'stats'
    isCalibrated: localStorage.getItem('sv_is_calibrated') === 'true',
    userName: localStorage.getItem('sv_username') || 'Student',
    examKey: localStorage.getItem('sv_exam') || 'jee',
    startDate: localStorage.getItem('sv_start_date') || getOffsetDate(-30),
    deadlineDate: localStorage.getItem('sv_deadline_date') || getOffsetDate(150),
    apiKey: localStorage.getItem('sv_typesafe_key') || '',
    chapterStatuses: safeJsonParse('sv_chapter_statuses', {}),
    studyHoursToday: parseFloat(localStorage.getItem('sv_study_hours') || '0.0'),
    habits: safeJsonParse('sv_habits', defaultHabits),
    studyTasks: safeJsonParse('sv_tasks', []),
    jevAnalysis: safeJsonParse('sv_jev_analysis', defaultJev)
  };

  // Focus Mode Stopwatch state
  let focusInterval = null;
  let focusSeconds = 0;

  // --- DOM SELECTORS ---
  const appContainer = document.querySelector('.app-container');
  const viewContent = document.getElementById('view-content');
  const navItems = document.querySelectorAll('.nav-item');
  const focusOverlay = document.getElementById('focus-lockscreen-overlay');
  const calibrationModal = document.getElementById('calibration-modal');
  const apiKeyModal = document.getElementById('api-key-modal');
  const addTaskModal = document.getElementById('add-task-modal');
  const toastMsg = document.getElementById('toast-msg');

  // --- INITIALIZATION ---
  function init() {
    try {
      bindEvents();
    } catch (e) {
      console.error("[StudyVault] bindEvents error:", e);
    }
    try {
      renderCurrentView();
    } catch (e) {
      console.error("[StudyVault] renderCurrentView error:", e);
    }
    try {
      updateRealtimeClock();
    } catch (e) {
      console.error("[StudyVault] updateRealtimeClock error:", e);
    }
    setInterval(() => {
      try {
        updateRealtimeClock();
      } catch (e) {
        console.error("[StudyVault] clock tick error:", e);
      }
    }, 1000);

    // If never calibrated, auto-prompt calibration modal on first open (like Vault)
    if (!state.isCalibrated) {
      setTimeout(() => {
        try { openCalibrationModal(); } catch (e) {}
      }, 600);
    }
  }

  function saveState() {
    localStorage.setItem('sv_is_calibrated', state.isCalibrated);
    localStorage.setItem('sv_username', state.userName);
    localStorage.setItem('sv_exam', state.examKey);
    localStorage.setItem('sv_start_date', state.startDate);
    localStorage.setItem('sv_deadline_date', state.deadlineDate);
    localStorage.setItem('sv_chapter_statuses', JSON.stringify(state.chapterStatuses));
    localStorage.setItem('sv_study_hours', state.studyHoursToday.toString());
    localStorage.setItem('sv_habits', JSON.stringify(state.habits));
    localStorage.setItem('sv_tasks', JSON.stringify(state.studyTasks));
    localStorage.setItem('sv_jev_analysis', JSON.stringify(state.jevAnalysis));
    localStorage.setItem('sv_typesafe_key', state.apiKey);
  }

  function showToast(text, icon = '✓') {
    if (!toastMsg) return;
    toastMsg.innerHTML = `<span>${icon}</span><span>${text}</span>`;
    toastMsg.classList.add('show');
    setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 2800);
  }

  function getRealtimeGreeting(name) {
    const now = new Date();
    const hour = now.getHours();
    let salutation = 'Good Morning';
    let emoji = '☀️';
    let subtitle = 'Ready to crush today’s study goals?';

    if (hour >= 5 && hour < 12) {
      salutation = 'Good Morning';
      emoji = '☀️';
      subtitle = 'Ready to crush today’s study goals?';
    } else if (hour >= 12 && hour < 17) {
      salutation = 'Good Afternoon';
      emoji = '🌤️';
      subtitle = 'Keep up the momentum in your study sprint.';
    } else if (hour >= 17 && hour < 22) {
      salutation = 'Good Evening';
      emoji = '🌇';
      subtitle = 'Consolidate today’s topics and review errors.';
    } else {
      salutation = 'Late Night Focus';
      emoji = '🌙';
      subtitle = 'Quiet hours. High retention & deep work.';
    }

    return {
      salutation,
      emoji,
      title: `${salutation}, ${name} ${emoji}`,
      subtitle
    };
  }

  // =========================================================================
  // ODOMETER COUNTER FX (Mechanical Rolling Digits)
  // =========================================================================
  function updateOdometer(container, timeStr, ampm = null) {
    if (!container) return;

    let wrapper = container.querySelector('.odometer-wrapper');
    const expectedSlots = timeStr.length + (ampm ? 1 : 0);

    // If wrapper does not exist or layout changed, initialize DOM
    if (!wrapper || wrapper.dataset.len !== String(expectedSlots)) {
      container.innerHTML = '';
      wrapper = document.createElement('span');
      wrapper.className = 'odometer-wrapper';
      wrapper.dataset.len = String(expectedSlots);

      for (let i = 0; i < timeStr.length; i++) {
        const char = timeStr[i];
        if (char >= '0' && char <= '9') {
          const dEl = document.createElement('span');
          dEl.className = 'odometer-digit';
          dEl.dataset.curr = char;

          const ribbon = document.createElement('span');
          ribbon.className = 'odometer-ribbon';
          // 2 cycles of 0-9 (20 spans) for forward-rolling wrap-arounds
          for (let cycle = 0; cycle < 2; cycle++) {
            for (let n = 0; n <= 9; n++) {
              const span = document.createElement('span');
              span.textContent = n;
              ribbon.appendChild(span);
            }
          }

          const num = parseInt(char, 10);
          ribbon.style.transition = 'none';
          ribbon.style.transform = `translateY(-${num * 1.15}em)`;
          dEl.appendChild(ribbon);
          wrapper.appendChild(dEl);

          // Restore transition on next animation frame
          requestAnimationFrame(() => {
            ribbon.style.transition = '';
          });
        } else if (char === ':') {
          const sep = document.createElement('span');
          sep.className = 'odometer-sep';
          sep.textContent = ':';
          wrapper.appendChild(sep);
        }
      }

      if (ampm) {
        const badge = document.createElement('span');
        badge.className = 'odometer-ampm-badge';
        badge.textContent = ampm;
        wrapper.appendChild(badge);
      }

      container.appendChild(wrapper);
      return;
    }

    // Smooth incremental roll of existing digits
    const digitEls = wrapper.querySelectorAll('.odometer-digit');
    let dIdx = 0;

    for (let i = 0; i < timeStr.length; i++) {
      const char = timeStr[i];
      if (char >= '0' && char <= '9') {
        const dEl = digitEls[dIdx];
        if (dEl) {
          const prev = parseInt(dEl.dataset.curr || '0', 10);
          const next = parseInt(char, 10);

          if (prev !== next) {
            dEl.dataset.curr = String(next);
            const ribbon = dEl.querySelector('.odometer-ribbon');

            if (ribbon) {
              if (next > prev) {
                // Stepping forward within cycle 1
                ribbon.style.transition = 'transform 0.42s cubic-bezier(0.2, 0.9, 0.35, 1.15)';
                ribbon.style.transform = `translateY(-${next * 1.15}em)`;
              } else {
                // Wrap-around: roll forward into cycle 2
                const targetIdx = 10 + next;
                ribbon.style.transition = 'transform 0.42s cubic-bezier(0.2, 0.9, 0.35, 1.15)';
                ribbon.style.transform = `translateY(-${targetIdx * 1.15}em)`;

                // Once animation completes, silently snap back to cycle 1
                setTimeout(() => {
                  if (dEl.dataset.curr === String(next)) {
                    ribbon.style.transition = 'none';
                    ribbon.style.transform = `translateY(-${next * 1.15}em)`;
                    void ribbon.offsetHeight; // Force reflow
                    ribbon.style.transition = '';
                  }
                }, 440);
              }
            }
          }
        }
        dIdx++;
      }
    }

    if (ampm) {
      const badge = wrapper.querySelector('.odometer-ampm-badge');
      if (badge && badge.textContent !== ampm) {
        badge.textContent = ampm;
      }
    }
  }

  function updateRealtimeClock() {
    const now = new Date();
    
    // Time format
    const hours24 = now.getHours();
    const hours12 = hours24 % 12 || 12;
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const timeFormatted = `${String(hours12).padStart(2, '0')}:${mins}:${secs}`;
    const statusTimeStr = `${String(hours24).padStart(2, '0')}:${mins}`;

    // Date formatting
    const dayNum = now.getDate();
    const monthName = now.toLocaleString('default', { month: 'long' }).toUpperCase();
    const yearStr = now.getFullYear();
    const weekdayLong = now.toLocaleString('default', { weekday: 'long' });
    const weekdayShort = now.toLocaleString('default', { weekday: 'short' });

    // Status bar clock (desktop view)
    const statusTimeEl = document.getElementById('status-time');
    if (statusTimeEl) statusTimeEl.textContent = statusTimeStr;

    // Home greeting & live clock
    const greetingData = getRealtimeGreeting(state.userName);
    const greetingTitleEl = document.getElementById('home-greeting-title');
    if (greetingTitleEl) {
      greetingTitleEl.textContent = greetingData.title;
    }

    const homeClockEl = document.getElementById('home-live-clock');
    if (homeClockEl) updateOdometer(homeClockEl, timeFormatted, ampm);

    const homeDayEl = document.getElementById('home-day-label');
    if (homeDayEl) homeDayEl.textContent = weekdayLong;

    const homeDateEl = document.getElementById('home-date-large');
    if (homeDateEl) homeDateEl.textContent = dayNum;

    const homeMonthEl = document.getElementById('home-month-large');
    if (homeMonthEl) homeMonthEl.textContent = monthName;

    // Lockscreen live date & clock
    const lockDateEl = document.getElementById('focus-lock-date-num');
    if (lockDateEl) lockDateEl.textContent = dayNum;

    const lockMonthEl = document.getElementById('focus-lock-month-year');
    if (lockMonthEl) lockMonthEl.textContent = monthName;

    const lockYearEl = document.getElementById('focus-lock-year');
    if (lockYearEl) lockYearEl.textContent = yearStr;

    const lockDayEl = document.getElementById('focus-lock-dayname');
    if (lockDayEl) lockDayEl.textContent = weekdayShort;

    const lockClockEl = document.getElementById('focus-lock-clock');
    if (lockClockEl) updateOdometer(lockClockEl, timeFormatted, ampm);
  }

  // --- VIEW ROUTER ---
  function setView(viewName) {
    if (viewName === 'lockscreen') {
      openFocusLockscreen();
      return;
    }

    state.activeView = viewName;
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewName);
    });

    if (viewName === 'stats') {
      appContainer.classList.add('dark-theme-active');
      appContainer.style.background = 'var(--bg-dark)';
    } else {
      appContainer.classList.remove('dark-theme-active');
      appContainer.style.background = 'var(--bg-home)';
    }

    renderCurrentView();
  }

  function renderCurrentView() {
    switch (state.activeView) {
      case 'home':
        renderHomeView();
        break;
      case 'syllabus':
        renderSyllabusView();
        break;
      case 'streak':
        renderStreakView();
        break;
      case 'stats':
        renderStatsView();
        break;
      default:
        renderHomeView();
    }
  }

  // =========================================================================
  // VIEW 1: HOME (Image 1 Style)
  // =========================================================================
  function renderHomeView() {
    const today = new Date();
    const dayNum = today.getDate();
    const monthName = today.toLocaleString('default', { month: 'long' }).toUpperCase();
    const weekdayName = today.toLocaleString('default', { weekday: 'long' });

    const totalDaysRemaining = getDaysBetween(today, new Date(state.deadlineDate));
    const counts = getChapterCounts();
    const currentExamName = getSyllabus(state.examKey).name.split(' ')[0] || 'EXAM';
    const greetingData = getRealtimeGreeting(state.userName);

    viewContent.innerHTML = `
      <div class="home-view">
        <!-- Top Greeting Bar with Real-Time Greeting and Set Calibrate Button -->
        <div class="home-header">
          <div>
            <div class="greeting-title" id="home-greeting-title">${greetingData.title}</div>
            <div class="greeting-subtitle" id="home-greeting-sub">${greetingData.subtitle} · Deathline in ${totalDaysRemaining}d</div>
          </div>
          <div class="home-header-actions">
            <button class="calibrate-vault-pill" onclick="app.openCalibrationModal()" title="Set Calibrate">
              <span>⚡</span>
              <span>Calibrate</span>
            </button>
            <div class="avatar-circle" onclick="app.openCalibrationModal()" title="Profile & Setup">
              ${state.userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <!-- If Uncalibrated: Show Prominent Vault Calibration Banner -->
        ${!state.isCalibrated ? `
          <div class="calibrate-hero-banner">
            <div class="cal-hero-info">
              <div class="cal-hero-title">
                <span>⚡</span>
                <span>Prep Vault Uncalibrated</span>
              </div>
              <div class="cal-hero-sub">
                Set your target exam, starting baseline, deathline & Jev API key to start System 1 scoring.
              </div>
            </div>
            <button class="cal-hero-btn" onclick="app.openCalibrationModal()">Set Calibrate</button>
          </div>
        ` : ''}

        <!-- Filter Pill Row -->
        <div class="filter-pill-row">
          <button class="pill-btn active">Today</button>
          <button class="pill-btn" onclick="app.showToast('Tomorrow schedule synced', '📅')">Tomorrow</button>
          <button class="pill-btn" onclick="app.setView('syllabus')">All Syllabus</button>
          <button class="pill-add-btn" onclick="app.openAddTaskModal()" title="Add Study Block">+</button>
        </div>

        <!-- Date Hero Banner (Image 1 Left) with Real-Time Clock -->
        <div class="date-hero-row">
          <div>
            <div class="day-label" id="home-day-label">${weekdayName}</div>
            <div class="date-large" id="home-date-large">${dayNum}</div>
            <div class="month-large" id="home-month-large">${monthName}</div>
          </div>
          <div class="exam-target-badge">
            <div class="live-clock-tag" id="home-live-clock">--:--:--</div>
            <div class="live-clock-sub">${currentExamName} TARGET</div>
            <div style="margin-top: 6px;">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#16A34A; margin-right:4px;"></span>
              <span style="font-size:11px; font-weight:700;">${counts.green} Mastered</span>
            </div>
          </div>
        </div>

        <!-- Quick Focus Lockscreen Card Trigger -->
        <div class="quick-focus-trigger-card" onclick="app.openFocusLockscreen()">
          <div>
            <div class="qf-title">
              <span>⏳</span>
              <span>Slide Down Lockscreen & Focus</span>
            </div>
            <div class="qf-sub">Full screen brutalist dot matrix with live focus stopwatch</div>
          </div>
          <div class="qf-arrow-pill">Focus Now ›</div>
        </div>

        <!-- Today's Study Task Cards (Image 1 Style) -->
        <div class="task-card-list">
          ${state.studyTasks.length === 0 ? `
            <div class="empty-state-box">
              <div class="empty-state-icon">📖</div>
              <div class="empty-state-title">No Study Blocks Today</div>
              <div class="empty-state-sub">Tap the <strong>+</strong> button above to schedule your first sprint or calibrate your vault.</div>
            </div>
          ` : state.studyTasks.map((task, index) => `
            <div class="study-task-card ${task.theme}" data-index="${index}">
              <div class="card-top-row">
                <div class="card-title">${task.title}</div>
                <div class="card-time">${task.time}</div>
              </div>
              <div class="card-bottom-row">
                <div class="card-location-meta">
                  <span>📍</span>
                  <span>${task.subject} · ${task.location}</span>
                </div>
                <div class="card-avatars">
                  <span>${task.avatarText}</span>
                  <span style="background:${task.done ? '#16A34A' : '#F59E0B'}">${task.done ? '✓' : '⚡'}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Upcoming Schedule Timeline Strips (Image 1 Middle Phone) -->
        <div class="timeline-strip-container">
          <div style="font-size:13px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-top:8px;">
            Upcoming Sprint Slots
          </div>
          
          <div class="timeline-strip-card" style="background:#262626;">
            <div class="strip-date-col">
              <div class="strip-day">TOMORROW</div>
              <div class="strip-num">${dayNum + 1}</div>
            </div>
            <div class="strip-slots">
              <div class="strip-slot">
                <span class="slot-time">08:00</span>
                <span class="slot-name">Kinematics</span>
              </div>
              <div class="strip-slot">
                <span class="slot-time">11:30</span>
                <span class="slot-name">Thermodynamics</span>
              </div>
              <div class="strip-slot">
                <span class="slot-time">19:00</span>
                <span class="slot-name">PYQ Sprint</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Task completion toggles
    document.querySelectorAll('.study-task-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = card.dataset.index;
        state.studyTasks[idx].done = !state.studyTasks[idx].done;
        saveState();
        showToast(state.studyTasks[idx].done ? 'Task marked completed!' : 'Task resumed', state.studyTasks[idx].done ? '✓' : '↺');
        renderHomeView();
      });
    });
    updateRealtimeClock();
  }

  // =========================================================================
  // VIEW 2: SYLLABUS & CHAPTER MATRIX
  // =========================================================================
  function renderSyllabusView() {
    const currentSyllabus = getSyllabus(state.examKey);
    const counts = getChapterCounts();

    viewContent.innerHTML = `
      <div class="syllabus-view">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h2 style="font-size:20px; font-weight:800;">Target Syllabus</h2>
            <div style="font-size:12px; color:var(--text-muted);">${currentSyllabus.name} · Tap colors to update</div>
          </div>
          <button class="pill-btn" onclick="app.openCalibrationModal()" style="font-size:11px; padding:4px 10px;">Switch Exam</button>
        </div>

        <!-- Course Switcher Bar -->
        <div class="course-selector-bar">
          <button class="course-tab-btn ${state.examKey === 'jee' ? 'active' : ''}" data-exam="jee">JEE Main/Adv</button>
          <button class="course-tab-btn ${state.examKey === 'neet' ? 'active' : ''}" data-exam="neet">NEET UG</button>
          <button class="course-tab-btn ${state.examKey === 'cbse12' ? 'active' : ''}" data-exam="cbse12">CBSE 12th</button>
        </div>

        <!-- Legend Bar with Live Counts -->
        <div class="syllabus-legend">
          <div class="legend-item" title="Mastered / Confident">
            <span class="legend-dot" style="background:#16A34A;"></span>
            <span>Mastered (${counts.green})</span>
          </div>
          <div class="legend-item" title="Needs Revision">
            <span class="legend-dot" style="background:#EAB308;"></span>
            <span>Revision (${counts.yellow})</span>
          </div>
          <div class="legend-item" title="Weak / Unprepared">
            <span class="legend-dot" style="background:#EF4444;"></span>
            <span>Weak (${counts.red})</span>
          </div>
          <div class="legend-item" title="Untouched">
            <span class="legend-dot" style="background:#71717A;"></span>
            <span>Untouched (${counts.gray})</span>
          </div>
        </div>

        <!-- Subject Wise Chapters -->
        ${currentSyllabus.subjects.map(subject => {
          return `
            <div class="subject-accordion">
              <div class="subject-header" style="border-left-color:${subject.color};">
                <div class="subject-title">${subject.name}</div>
                <div class="subject-stat-pill">
                  ${subject.chapters.length} Chapters
                </div>
              </div>
              <div class="chapter-list">
                ${subject.chapters.map(chap => {
                  const currentStatus = state.chapterStatuses[chap.id] || 'gray';
                  return `
                    <div class="chapter-item">
                      <div class="chapter-title">
                        <span class="chapter-class-badge">Class ${chap.class}</span>
                        <span>${chap.title}</span>
                      </div>
                      <div class="status-button-group">
                        <button class="status-toggle-btn green ${currentStatus === 'green' ? 'active' : ''}" 
                                data-id="${chap.id}" data-status="green" title="I know this chapter">🟢</button>
                        <button class="status-toggle-btn yellow ${currentStatus === 'yellow' ? 'active' : ''}" 
                                data-id="${chap.id}" data-status="yellow" title="Needs Revision">🟡</button>
                        <button class="status-toggle-btn red ${currentStatus === 'red' ? 'active' : ''}" 
                                data-id="${chap.id}" data-status="red" title="Weak / Unprepared">🔴</button>
                        <button class="status-toggle-btn gray ${currentStatus === 'gray' ? 'active' : ''}" 
                                data-id="${chap.id}" data-status="gray" title="No idea / Untouched">⚪</button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Handle course switch
    document.querySelectorAll('.course-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.examKey = btn.dataset.exam;
        saveState();
        renderSyllabusView();
        showToast(`Switched to ${getSyllabus(state.examKey).name}`);
      });
    });

    // Handle chapter status changes
    document.querySelectorAll('.status-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chapId = btn.dataset.id;
        const newStatus = btn.dataset.status;
        state.chapterStatuses[chapId] = newStatus;
        saveState();

        const parent = btn.parentElement;
        parent.querySelectorAll('.status-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        updateLegendCounts();
      });
    });
  }

  function updateLegendCounts() {
    const counts = getChapterCounts();
    const legend = document.querySelector('.syllabus-legend');
    if (legend) {
      legend.innerHTML = `
        <div class="legend-item"><span class="legend-dot" style="background:#16A34A;"></span><span>Mastered (${counts.green})</span></div>
        <div class="legend-item"><span class="legend-dot" style="background:#EAB308;"></span><span>Revision (${counts.yellow})</span></div>
        <div class="legend-item"><span class="legend-dot" style="background:#EF4444;"></span><span>Weak (${counts.red})</span></div>
        <div class="legend-item"><span class="legend-dot" style="background:#71717A;"></span><span>Untouched (${counts.gray})</span></div>
      `;
    }
  }

  function getChapterCounts() {
    const currentSyllabus = getSyllabus(state.examKey);
    let green = 0, yellow = 0, red = 0, gray = 0;

    currentSyllabus.subjects.forEach(sub => {
      sub.chapters.forEach(chap => {
        const s = state.chapterStatuses[chap.id] || 'gray';
        if (s === 'green') green++;
        else if (s === 'yellow') yellow++;
        else if (s === 'red') red++;
        else gray++;
      });
    });

    const total = green + yellow + red + gray;
    return { green, yellow, red, gray, total };
  }

  // =========================================================================
  // VIEW 3: STREAK & HABIT GRID (Image 2 Style - Streak Part Only)
  // =========================================================================
  function renderStreakView() {
    const completedTodayCount = state.habits.filter(h => h.checkedToday).length;

    viewContent.innerHTML = `
      <div class="streak-view">
        <div style="margin-bottom:18px;">
          <h2 style="font-size:22px; font-weight:800; letter-spacing:-0.5px;">My Study Streaks</h2>
          <div style="font-size:13px; color:var(--text-muted); margin-top:2px;">
            Build routines for ${getSyllabus(state.examKey).name.split(' ')[0]}
          </div>
        </div>

        <!-- Top Stat Counter Box (Image 2 style) -->
        <div class="streak-top-stats">
          <div class="streak-stat-box">
            <div class="streak-stat-num">${state.habits.length}</div>
            <div class="streak-stat-label">Total Routines</div>
          </div>
          <div class="streak-stat-box">
            <div class="streak-stat-num" style="color:#10B981;">${completedTodayCount}</div>
            <div class="streak-stat-label">Completed Today</div>
          </div>
        </div>

        <!-- Habit Streak Cards with Heatmap Matrices -->
        ${state.habits.map((habit, hIdx) => `
          <div class="habit-streak-card">
            <div class="habit-card-header">
              <div class="habit-title-box">
                <span>⚡</span>
                <span>${habit.title}</span>
              </div>
              <div class="habit-streak-count">🔥 ${habit.streak} Days</div>
            </div>

            <!-- 7x7 Heatmap Matrix -->
            <div class="heatmap-grid-container">
              <div class="heatmap-matrix">
                ${habit.history.map(level => `
                  <div class="heatmap-cell ${level > 0 ? 'level-' + level : ''}" title="Intensity: Level ${level}"></div>
                `).join('')}
              </div>
            </div>

            <div class="habit-action-row">
              <div class="habit-days-row">
                <span class="active-day">Su</span>
                <span class="active-day">Mo</span>
                <span class="active-day">Tu</span>
                <span class="active-day">We</span>
                <span class="active-day">Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>
              <button class="checkin-btn ${habit.checkedToday ? 'checked' : ''}" data-index="${hIdx}">
                <span>${habit.checkedToday ? '✓ Done' : '+ Check in'}</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Habit check-in trigger
    document.querySelectorAll('.checkin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.index;
        const habit = state.habits[idx];
        habit.checkedToday = !habit.checkedToday;

        if (habit.checkedToday) {
          habit.streak += 1;
          habit.history[habit.history.length - 1] = 4;
          showToast(`Checked in: ${habit.title}! Streak: ${habit.streak}d 🔥`);
        } else {
          habit.streak = Math.max(0, habit.streak - 1);
          habit.history[habit.history.length - 1] = 0;
          showToast(`Check-in undone`);
        }

        saveState();
        renderStreakView();
      });
    });
  }

  // =========================================================================
  // VIEW 4: STATISTICS & JEV INTELLIGENCE (Image 3 Style - Dark Theme)
  // =========================================================================
  function renderStatsView() {
    const counts = getChapterCounts();
    const readiness = state.jevAnalysis?.readiness_score || (counts.total > 0 ? Math.round((counts.green / counts.total) * 100) : 0);
    const deadlineRisk = Math.round((state.jevAnalysis?.deadline_risk_prob || 0.0) * 100);

    const currentSyllabus = getSyllabus(state.examKey);
    const subjects = currentSyllabus.subjects;

    const subBreakdowns = subjects.map((sub, i) => {
      const subChaps = sub.chapters;
      const grn = subChaps.filter(c => state.chapterStatuses[c.id] === 'green').length;
      const pct = subChaps.length > 0 ? Math.round((grn / subChaps.length) * 100) : 0;
      const colors = ['#38BDF8', '#A3E635', '#F59E0B', '#FB7185'];
      return {
        name: sub.name,
        color: colors[i % colors.length],
        pct: pct
      };
    });

    viewContent.innerHTML = `
      <div class="stats-view">
        <div class="stats-header-bar">
          <div class="stats-title">Intelligence & Statistics</div>
          <button class="run-jev-pill" id="run-jev-btn" title="Run TypeSafe Jev System 1 Analysis">
            <span>⚡</span>
            <span>Run Jev Now</span>
          </button>
        </div>

        <!-- Hero Readiness Card (Image 3 top style) -->
        <div class="readiness-card">
          <div class="readiness-label-row">
            <span>PREDICTED READINESS</span>
            <span>${getSyllabus(state.examKey).name.split(' ')[0]}</span>
          </div>
          <div class="readiness-main-val">${readiness}% SCORE</div>
          <div class="readiness-sub-meta">
            <span>🟢 ${counts.green} Ready</span>
            <span>🟡 ${counts.yellow} Revise</span>
            <span>🔴 ${counts.red} Backlog</span>
            <span>⏳ ${getDaysBetween(new Date(), new Date(state.deadlineDate))}d left</span>
          </div>
        </div>

        <!-- Dual Chart Row (Donut Ring + Pie Distribution) -->
        <div class="dual-chart-row">
          <!-- Donut Gauge (Image 3 Left Chart) -->
          <div class="chart-card-half">
            <div class="chart-title-tag">Target Gauge</div>
            <div class="donut-container">
              <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform: rotate(-90deg);">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1E293B" stroke-width="3.5"></circle>
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#38BDF8" stroke-width="3.5"
                        stroke-dasharray="${readiness} ${100 - readiness}" stroke-dashoffset="0" stroke-linecap="round"></circle>
              </svg>
              <div class="donut-inner-label">${readiness}%</div>
            </div>
            <div class="chart-breakdown-list">
              <div class="chart-breakdown-row">
                <span><span class="color-indicator" style="background:#38BDF8;"></span>Ready</span>
                <span style="font-weight:700;">${readiness}%</span>
              </div>
              <div class="chart-breakdown-row">
                <span><span class="color-indicator" style="background:#EF4444;"></span>Deficit</span>
                <span style="font-weight:700;">${100 - readiness}%</span>
              </div>
            </div>
          </div>

          <!-- Subject Split (Image 3 Right Chart) -->
          <div class="chart-card-half">
            <div class="chart-title-tag">Subject Split</div>
            <div class="donut-container">
              <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform: rotate(-90deg);">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#A3E635" stroke-width="3.5"
                        stroke-dasharray="45 55" stroke-dashoffset="0"></circle>
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F59E0B" stroke-width="3.5"
                        stroke-dasharray="30 70" stroke-dashoffset="-45"></circle>
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#FB7185" stroke-width="3.5"
                        stroke-dasharray="25 75" stroke-dashoffset="-75"></circle>
              </svg>
              <div class="donut-inner-label" style="font-size:13px; color:#A3E635;">${subjects.length} SUB</div>
            </div>
            <div class="chart-breakdown-list">
              ${subBreakdowns.map(sb => `
                <div class="chart-breakdown-row">
                  <span><span class="color-indicator" style="background:${sb.color};"></span>${sb.name}</span>
                  <span style="font-weight:700;">${sb.pct}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Wave Line Trend Graph (Image 3 Bottom Chart) -->
        <div class="trend-wave-card">
          <div class="trend-card-header">
            <div>
              <div style="font-size:11px; color:var(--text-dark-muted); font-weight:700;">STUDY VELOCITY</div>
              <div style="font-size:18px; font-weight:800;">${state.studyHoursToday.toFixed(1)} Hrs Logged Today</div>
            </div>
            <div class="trend-badge-val">${counts.green} / ${counts.total} Chaps</div>
          </div>

          <!-- Glowing SVG Line Chart -->
          <svg class="svg-trend-wave" viewBox="0 0 300 80">
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#A3E635" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#A3E635" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <path d="M 0,65 Q 60,50 120,55 T 220,32 T 300,15 L 300,80 L 0,80 Z" fill="url(#waveGrad)" />
            <path d="M 0,65 Q 60,50 120,55 T 220,32 T 300,15" fill="none" stroke="#A3E635" stroke-width="3" stroke-linecap="round" />
            <circle cx="300" cy="15" r="4.5" fill="#A3E635" />
          </svg>

          <div class="trend-months-row">
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span style="color:#A3E635; font-weight:700;">Now</span>
          </div>
        </div>

        <!-- Real Jev Decision Engine Breakdown -->
        <div class="jev-card">
          <div class="jev-header-row">
            <div class="jev-badge">
              <span>●</span>
              <span>TypeSafe Jev System 1 Engine</span>
            </div>
            <div class="jev-latency">${state.jevAnalysis?.latency_ms ? state.jevAnalysis.latency_ms + 'ms' : 'Ready'}</div>
          </div>

          <div class="jev-results-grid">
            <div class="jev-result-row">
              <span class="jev-q-name">Deadline Failure Risk (Noul):</span>
              <span class="jev-q-val" style="color:${deadlineRisk > 50 ? '#EF4444' : '#10B981'};">
                ${deadlineRisk}% Prob
              </span>
            </div>
            <div class="jev-result-row">
              <span class="jev-q-name">Immediate Subject Focus (Choice):</span>
              <span class="jev-q-val" style="text-transform:capitalize;">
                ${state.jevAnalysis?.priority_subject || 'Physics'}
              </span>
            </div>
            <div class="jev-result-row">
              <span class="jev-q-name">Burnout Hazard (Score):</span>
              <span class="jev-q-val">
                ${state.jevAnalysis?.burnout_hazard || 'Healthy pace'}
              </span>
            </div>
            <div class="jev-result-row">
              <span class="jev-q-name">Recommended Tactical Action:</span>
              <span class="jev-q-val" style="color:#38BDF8;">
                ${state.jevAnalysis?.daily_strategy || 'Tackle Red Backlog'}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('run-jev-btn')?.addEventListener('click', runJevCalculation);
  }

  // =========================================================================
  // VIEW 5: iOS SLIDE-DOWN FOCUS LOCKSCREEN OVERLAY (Image 4 + Live Timer)
  // =========================================================================
  function openFocusLockscreen() {
    const today = parseDateMidnight(new Date());
    const dayNum = today.getDate();
    const monthYear = today.toLocaleString('default', { month: 'long' }).toUpperCase();
    const yearStr = today.getFullYear();
    const weekdayShort = today.toLocaleString('default', { weekday: 'short' });

    const start = parseDateMidnight(state.startDate);
    const deadline = parseDateMidnight(state.deadlineDate);

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Total days in preparation cycle: EXACTLY X dots
    const diffTime = deadline.getTime() - start.getTime();
    const totalDays = Math.max(1, Math.round(diffTime / MS_PER_DAY) + 1);

    const passedDays = Math.max(0, Math.round((today.getTime() - start.getTime()) / MS_PER_DAY));
    const remainingDays = Math.max(0, Math.round((deadline.getTime() - today.getTime()) / MS_PER_DAY));

    // Populate Lockscreen Text
    const dateNumEl = document.getElementById('focus-lock-date-num');
    if (dateNumEl) dateNumEl.textContent = dayNum;

    const monthYearEl = document.getElementById('focus-lock-month-year');
    if (monthYearEl) monthYearEl.textContent = monthYear;

    const yearEl = document.getElementById('focus-lock-year');
    if (yearEl) yearEl.textContent = yearStr;

    const daynameEl = document.getElementById('focus-lock-dayname');
    if (daynameEl) daynameEl.textContent = weekdayShort;

    const examShort = getSyllabus(state.examKey).name.split(' ')[0] || 'EXAM';
    const countdownEl = document.getElementById('focus-lock-countdown');
    if (countdownEl) {
      countdownEl.innerHTML = `
        <div style="font-weight:800; letter-spacing:0.5px;">${remainingDays} DAYS UNTIL ${examShort} DEATHLINE</div>
        <div style="font-size:11px; opacity:0.65; margin-top:4px; font-weight:600; letter-spacing:0.5px;">
          ${passedDays} ELAPSED · ${totalDays} TOTAL DAYS (${totalDays} DOTS)
        </div>
      `;
    }

    // Dynamic responsive sizing so X dots look balanced and clean on all screen sizes
    let dotSize = 22;
    let dotGap = 12;
    if (totalDays > 250) {
      dotSize = 9;
      dotGap = 4;
    } else if (totalDays > 150) {
      dotSize = 11;
      dotGap = 5;
    } else if (totalDays > 80) {
      dotSize = 14;
      dotGap = 7;
    } else if (totalDays > 42) {
      dotSize = 17;
      dotGap = 9;
    }

    const dotMatrixEl = document.getElementById('focus-lock-dot-matrix');
    dotMatrixEl.style.setProperty('--dot-size', `${dotSize}px`);
    dotMatrixEl.style.setProperty('--dot-gap', `${dotGap}px`);

    // Calendar alignment with 7-column header: M T W T F S S
    // 0 = Sunday, 1 = Monday ... 6 = Saturday in JS
    // Convert to Monday = 0, ..., Sunday = 6
    const startDayOfWeek = (start.getDay() + 6) % 7;
    let html = '';

    // Empty spacers for weekday alignment before the start date
    for (let s = 0; s < startDayOfWeek; s++) {
      html += `<div class="matrix-empty-spacer" aria-hidden="true"></div>`;
    }

    // Generate EXACTLY X number of dots (totalDays)
    const todayTime = today.getTime();
    for (let i = 0; i < totalDays; i++) {
      const curDate = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const curTime = curDate.getTime();
      const dateFormatted = curDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
      const weekdayName = curDate.toLocaleDateString('default', { weekday: 'short' });

      let dotClass = '';
      let dotStatus = '';

      if (curTime < todayTime) {
        dotClass = 'past-black';
        dotStatus = 'Elapsed';
      } else if (curTime === todayTime) {
        dotClass = 'today-orange';
        dotStatus = 'TODAY';
      } else {
        dotClass = 'future-outline';
        dotStatus = 'Remaining';
      }

      html += `<div class="matrix-dot ${dotClass}" 
                    data-day="${i + 1}"
                    data-date="${curDate.toISOString().split('T')[0]}"
                    title="Day ${i + 1} of ${totalDays} · ${weekdayName}, ${dateFormatted} (${dotStatus})"></div>`;
    }

    dotMatrixEl.innerHTML = html;

    // Update Lockscreen Odometer Clock
    updateRealtimeClock();

    // Trigger iOS Slide-Down Animation
    focusOverlay.classList.add('focus-active');

    // Start Live Focus Stopwatch
    startFocusStopwatch();
  }

  function closeFocusLockscreen() {
    if (!focusOverlay.classList.contains('focus-active')) return;

    // Stop Stopwatch & log focus time
    stopFocusStopwatch();

    // Slide up animation
    focusOverlay.classList.remove('focus-active');

    // Set active tab back to current view
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === state.activeView);
    });
  }

  function startFocusStopwatch() {
    focusSeconds = 0;
    updateStopwatchDisplay();
    clearInterval(focusInterval);
    focusInterval = setInterval(() => {
      focusSeconds++;
      updateStopwatchDisplay();
    }, 1000);
  }

  function stopFocusStopwatch() {
    clearInterval(focusInterval);
    focusInterval = null;

    if (focusSeconds >= 10) {
      const minutesFocused = Math.round(focusSeconds / 60 * 10) / 10;
      const addedHours = Math.round((focusSeconds / 3600) * 100) / 100;
      state.studyHoursToday += Math.max(0.1, addedHours);
      saveState();

      showToast(`Logged ${focusSeconds >= 60 ? minutesFocused + 'm' : focusSeconds + 's'} focus session! 🔥`, '⚡');
      if (state.activeView === 'stats') renderStatsView();
      if (state.activeView === 'home') renderHomeView();
    }
  }

  function updateStopwatchDisplay() {
    const hrs = String(Math.floor(focusSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((focusSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(focusSeconds % 60).padStart(2, '0');
    const disp = document.getElementById('focus-stopwatch-display');
    if (disp) updateOdometer(disp, `${hrs}:${mins}:${secs}`);
  }

  function parseDateMidnight(dateInput) {
    if (!dateInput) return new Date();
    if (dateInput instanceof Date) {
      return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
    }
    const parts = String(dateInput).split('T')[0].split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    const d = new Date(dateInput);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function getDaysBetween(d1, d2) {
    const p1 = parseDateMidnight(d1);
    const p2 = parseDateMidnight(d2);
    const diffMs = Math.abs(p2.getTime() - p1.getTime());
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }

  // =========================================================================
  // REAL TYPESAFE JEV API INTEGRATION
  // =========================================================================
  async function runJevCalculation() {
    if (!state.apiKey) {
      openApiKeyModal();
      return;
    }

    const counts = getChapterCounts();
    const remainingDays = getDaysBetween(new Date(), new Date(state.deadlineDate));
    const currentSyllabus = getSyllabus(state.examKey);

    showToast('Sending state to TypeSafe Jev System 1...', '⚡');

    const statePayload = `Student Target: ${currentSyllabus.name}. Total Chapters: ${counts.total}. Mastered (Green): ${counts.green}. Revision Needed (Yellow): ${counts.yellow}. Weak/Unprepared (Red): ${counts.red}. Untouched (Gray): ${counts.gray}. Days remaining until exam deathline: ${remainingDays} days. Average daily study time: ${state.studyHoursToday.toFixed(1)} hours.`;

    const requestBody = {
      model: "jev-latest",
      state: statePayload,
      questions: {
        "readiness_score": {
          "type": "score",
          "instructions": "Rate the student's probability of securing a top competitive rank given remaining red and yellow chapters.",
          "criteria": ["unprepared", "basic coverage", "moderately ready", "strong competitive rank", "exceptional / 99th percentile"]
        },
        "deadline_risk": {
          "type": "noul",
          "instructions": "Given the days remaining and red backlog chapters, is the student at high risk of running out of preparation time?"
        },
        "priority_subject": {
          "type": "choice",
          "instructions": "Which subject domain needs immediate remedial focus today?",
          "criteria": {
            "physics": "Mechanics, Electromagnetism, or Optics backlog",
            "chemistry": "Organic reaction mechanisms or Physical stoichiometry",
            "mathematics": "Calculus, 3D Geometry, or Algebra practice",
            "biology": "Genetics, Physiology, or Ecology memorization"
          }
        },
        "burnout_hazard": {
          "type": "score",
          "instructions": "Assess if student's pacing shows fatigue or unsustainable cramming.",
          "criteria": ["healthy pace", "moderate fatigue", "high burnout hazard"]
        },
        "daily_strategy": {
          "type": "choice",
          "instructions": "What tactical action should dominate today's schedule?",
          "criteria": {
            "tackle_red_backlog": "Cover unmastered red chapters first",
            "rapid_yellow_pyqs": "Solve 50 PYQs on yellow revision chapters",
            "mock_speed_test": "Take a 3-hour timed exam simulation",
            "formula_consolidation": "Review formula sheets and short notes"
          }
        }
      }
    };

    const startTime = performance.now();

    try {
      const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? "/api/systemone"
        : "https://api.typesafe.ai/v1/systemone";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${state.apiKey.trim()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const latencyMs = Math.round(performance.now() - startTime);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const answers = data.answers || {};

      let mappedScore = 50;
      if (answers.readiness_score) {
        const scoreVal = answers.readiness_score.score || 2.0;
        mappedScore = Math.min(100, Math.round((scoreVal / 4) * 100));
      }

      const riskProb = answers.deadline_risk?.noul ?? 0.25;
      const topSubject = answers.priority_subject?.choice || 'physics';
      const burnout = answers.burnout_hazard?.legend?.[Math.round(answers.burnout_hazard.score || 0)] || 'Healthy pace';
      const strategy = answers.daily_strategy?.choice ? answers.daily_strategy.choice.replace(/_/g, ' ') : 'Tackle Red Backlog';

      state.jevAnalysis = {
        readiness_score: mappedScore,
        deadline_risk_prob: riskProb,
        priority_subject: topSubject,
        burnout_hazard: burnout,
        daily_strategy: strategy,
        latency_ms: latencyMs,
        last_updated: new Date().toISOString()
      };

      saveState();
      showToast(`Jev evaluated in ${latencyMs}ms! Score: ${mappedScore}%`, '🚀');
      if (state.activeView === 'stats') {
        renderStatsView();
      }
    } catch (err) {
      console.error("TypeSafe Jev API call failed:", err);
      showToast(`Jev API: ${err.message}`, '⚠️');
    }
  }

  // --- MODAL CONTROLS ---
  function openCalibrationModal() {
    document.getElementById('cal-name-input').value = state.userName || 'Student';
    document.getElementById('cal-exam-select').value = state.examKey;
    document.getElementById('cal-start-date').value = state.startDate;
    document.getElementById('cal-deadline-date').value = state.deadlineDate;
    document.getElementById('cal-api-key').value = state.apiKey;
    calibrationModal.classList.add('open');
  }

  function closeCalibrationModal() {
    calibrationModal.classList.remove('open');
  }

  function openApiKeyModal() {
    document.getElementById('api-key-input').value = state.apiKey;
    apiKeyModal.classList.add('open');
  }

  function closeApiKeyModal() {
    apiKeyModal.classList.remove('open');
  }

  function openAddTaskModal() {
    addTaskModal.classList.add('open');
  }

  function closeAddTaskModal() {
    addTaskModal.classList.remove('open');
  }

  // --- EVENT BINDINGS ---
  function bindEvents() {
    // Navigation bar click
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const view = item.dataset.view;
        if (view === 'lockscreen') {
          openFocusLockscreen();
        } else {
          setView(view);
        }
      });
    });

    // Lockscreen Full Screen Hitbox: Tap or swipe anywhere to close & log time
    let touchStartY = 0;
    focusOverlay.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    focusOverlay.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      // Close on tap or upward swipe
      if (diffY > 15 || Math.abs(diffY) < 15) {
        closeFocusLockscreen();
      }
    }, { passive: true });

    focusOverlay.addEventListener('click', () => {
      closeFocusLockscreen();
    });

    // Save Calibration
    document.getElementById('save-calibration-btn')?.addEventListener('click', () => {
      const nameVal = document.getElementById('cal-name-input').value.trim();
      state.userName = nameVal || 'Student';
      state.examKey = document.getElementById('cal-exam-select').value;
      state.startDate = document.getElementById('cal-start-date').value || state.startDate;
      state.deadlineDate = document.getElementById('cal-deadline-date').value || state.deadlineDate;
      const keyVal = document.getElementById('cal-api-key').value.trim();
      if (keyVal) state.apiKey = keyVal;

      state.isCalibrated = true;
      saveState();
      closeCalibrationModal();
      showToast(`Vault calibrated for ${state.userName}!`, '⚡');
      renderCurrentView();

      if (state.apiKey) {
        runJevCalculation();
      }
    });

    // Save API Key
    document.getElementById('save-api-key-btn')?.addEventListener('click', () => {
      const val = document.getElementById('api-key-input').value.trim();
      if (!val) {
        alert('Please enter your TypeSafe API Key.');
        return;
      }
      state.apiKey = val;
      saveState();
      closeApiKeyModal();
      showToast('TypeSafe API Key saved!', '🔑');
      runJevCalculation();
    });

    document.getElementById('cancel-api-key-btn')?.addEventListener('click', closeApiKeyModal);

    // Save Task
    document.getElementById('save-task-btn')?.addEventListener('click', () => {
      const title = document.getElementById('task-title-input').value.trim();
      const subject = document.getElementById('task-subject-input').value.trim() || 'General';
      const time = document.getElementById('task-time-input').value.trim() || '10:00 - 12:00';
      const theme = document.getElementById('task-theme-select').value;

      if (!title) {
        alert('Please enter a session topic or chapter.');
        return;
      }

      state.studyTasks.push({
        id: 't_' + Date.now(),
        title,
        subject,
        time,
        theme,
        location: 'Study Desk',
        avatarText: subject.slice(0, 3).toUpperCase(),
        done: false
      });

      saveState();
      closeAddTaskModal();
      showToast('Study session scheduled!');
      if (state.activeView === 'home') renderHomeView();
    });

    document.getElementById('cancel-task-btn')?.addEventListener('click', closeAddTaskModal);
  }

  // Public exports for HTML button actions
  window.app = {
    setView,
    showToast,
    openCalibrationModal,
    closeCalibrationModal,
    openApiKeyModal,
    openAddTaskModal,
    openFocusLockscreen,
    closeFocusLockscreen,
    runJevCalculation
  };

  // Launch app
  init();
});
