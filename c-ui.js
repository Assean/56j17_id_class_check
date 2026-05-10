/**
 * FunTech 頁面 DOM 視窗檢測工具 v2.0
 * 貼到 Console 後，頁面上會浮現一個可拖曳的檢測結果視窗
 */
(function () {
  // 避免重複執行
  const OLD = document.getElementById('__ft_checker__');
  if (OLD) OLD.remove();

  // ============================================================
  // 檢測規格（同 check.js）
  // ============================================================
  const PAGE_SPECS = {
    home: {
      name: '🏠 首頁',
      detect: () => !!document.querySelector('#home'),
      rules: [
        { sel: '#home',                                          desc: '首頁根容器' },
        { sel: 'header.site-header',                            desc: '頁首導覽列容器' },
        { sel: '.site-header .brand a.brand-link',              desc: 'Logo 品牌連結' },
        { sel: '.site-header nav.main-nav',                     desc: '主要導覽列容器' },
        { sel: '.site-header nav.main-nav a.home-link',         desc: '「首頁」連結' },
        { sel: '.site-header nav.main-nav a.games-link',        desc: '「遊戲」連結' },
        { sel: '.site-header nav.main-nav a.friends-link',      desc: '「好友」連結' },
        { sel: '.site-header .user-area',                       desc: '使用者區域容器' },
        { sel: 'section.articles',                              desc: '文章區塊容器' },
        { sel: 'section.articles article.article-item',         desc: '文章項目（至少1筆）' },
        { sel: '.article-item .article-title',                  desc: '文章標題' },
        { sel: '.article-item time.article-date',               desc: '文章發佈日期' },
        { sel: '.article-item .article-excerpt',                desc: '文章摘要' },
        { sel: '.article-item a.article-readmore',              desc: '閱讀更多連結' },
        { sel: 'aside.notifications',                           desc: '通知區塊容器' },
        { sel: 'aside.notifications .notification-item',        desc: '通知項目（至少1筆）' },
        { sel: '.notification-item .notification-title',        desc: '通知標題' },
        { sel: '.notification-item time.notification-date',     desc: '通知發佈日期' },
      ],
      conditional: [
        {
          label: '未登入狀態',
          check: () => !document.querySelector('.user-area .user-badge'),
          rules: [
            { sel: '.user-area a.login-link',    desc: '登入連結（未登入）' },
            { sel: '.user-area a.register-link', desc: '註冊連結（未登入）' },
          ]
        },
        {
          label: '已登入狀態',
          check: () => !!document.querySelector('.user-area .user-badge'),
          rules: [
            { sel: '.user-area .user-badge',    desc: '使用者徽章' },
            { sel: '.user-area a.profile-link', desc: '個人頁面連結' },
            { sel: '.user-area a.logout-link',  desc: '登出連結' },
          ]
        },
      ]
    },
    article: {
      name: '📄 文章內容頁',
      detect: () => !!document.querySelector('#article'),
      rules: [
        { sel: '#article',                           desc: '文章頁根容器' },
        { sel: '#article header.article-header',     desc: '文章標題區塊' },
        { sel: '.article-header h1.article-title',   desc: '文章標題 h1' },
        { sel: '.article-header time.article-date',  desc: '文章發布日期' },
        { sel: '#article section.article-body',      desc: '文章內容區塊' },
      ]
    },
    profile: {
      name: '👤 個人頁面',
      detect: () => !!document.querySelector('#profile-page'),
      rules: [
        { sel: '#profile-page',                          desc: '個人頁根容器' },
        { sel: 'section.profile-header',                 desc: '使用者資訊區塊' },
        { sel: '.profile-header img.profile-avatar',     desc: '使用者頭像' },
        { sel: '.profile-header .profile-username',      desc: '使用者名稱' },
        { sel: '.profile-header .profile-bio',           desc: '簡介文字' },
        { sel: 'section.profile-articles',               desc: '使用者文章區塊' },
        { sel: '.profile-articles .article-item',        desc: '文章項目', optional: '.profile-articles .empty-article-message' },
        { sel: '.article-item .article-title',           desc: '文章標題' },
        { sel: '.article-item time.article-date',        desc: '發佈日期' },
        { sel: '.article-item a.article-readmore',       desc: '閱讀文章連結' },
      ],
      conditional: [
        {
          label: '自己的個人頁面',
          check: () => !!document.querySelector('a.new-post-link'),
          rules: [
            { sel: 'a.new-post-link',                                    desc: '發表新文章連結' },
            { sel: 'form.article-create-form',                           desc: '文章發布表單容器' },
            { sel: '.article-create-form input.article-title-input',     desc: '文章標題輸入欄' },
            { sel: '.article-create-form textarea.article-content-input',desc: '文章內容輸入欄' },
            { sel: '.article-create-form button.article-submit-button',  desc: '發布文章按鈕' },
          ]
        },
        {
          label: '好友互動區（他人頁面）',
          check: () => !!document.querySelector('.profile-friend-actions'),
          rules: [
            { sel: '#profile-page .profile-friend-actions', desc: '好友互動操作區塊' },
          ]
        },
      ]
    },
    login: {
      name: '🔐 登入頁面',
      detect: () => !!document.querySelector('form.login-form'),
      rules: [
        { sel: 'form.login-form',                        desc: '登入表單容器' },
        { sel: '.login-form input.username-input',       desc: '帳號輸入欄' },
        { sel: '.login-form input.password-input',       desc: '密碼輸入欄' },
        { sel: '.login-form button.login-submit-button', desc: '登入送出按鈕' },
      ]
    },
    register: {
      name: '📝 註冊頁面',
      detect: () => !!document.querySelector('form.register-form'),
      rules: [
        { sel: 'form.register-form',                             desc: '註冊表單容器' },
        { sel: '.register-form input.username-input',            desc: '帳號輸入欄' },
        { sel: '.register-form input.email-input',               desc: '電子郵件輸入欄' },
        { sel: '.register-form input.password-input',            desc: '密碼輸入欄' },
        { sel: '.register-form input.password-confirm-input',    desc: '確認密碼輸入欄' },
        { sel: '.register-form button.register-submit',          desc: '註冊送出按鈕' },
      ]
    },
    friends: {
      name: '👫 好友頁面',
      detect: () => !!document.querySelector('#friends-page'),
      rules: [
        { sel: '#friends-page',                                    desc: '好友頁主容器' },
        { sel: '#friends-page .friend-search-section',             desc: '搜尋功能區塊' },
        { sel: '#friends-page .friend-list-section',               desc: '好友列表區塊' },
        { sel: '#friends-page .incoming-requests-section',         desc: '收到的申請區塊' },
        { sel: '#friends-page .sent-requests-section',             desc: '送出的申請區塊' },
        { sel: 'form.friend-search-form',                          desc: '搜尋表單容器' },
        { sel: '.friend-search-form input.search-input',           desc: '搜尋輸入欄' },
        { sel: '.friend-search-form button.search-submit-button',  desc: '搜尋按鈕' },
        { sel: '.friend-search-section .search-result-list',       desc: '搜尋結果容器' },
        { sel: '.friend-list-section .section-title',              desc: '好友列表標題' },
        { sel: '.incoming-requests-section .section-title',        desc: '收到申請標題' },
        { sel: '.sent-requests-section .section-title',            desc: '送出申請標題' },
      ]
    },
    games: {
      name: '🎮 遊戲列表頁',
      detect: () => !!document.querySelector('#games'),
      rules: [
        { sel: '#games',                       desc: '遊戲列表根容器' },
        { sel: '#games section.game-list',     desc: '遊戲列表容器' },
        { sel: '.game-list .game-item',        desc: '遊戲項目（至少1筆）' },
        { sel: '.game-item img.game-cover',    desc: '遊戲封面圖片' },
        { sel: '.game-item .game-title',       desc: '遊戲名稱' },
        { sel: '.game-item .game-description', desc: '遊戲簡介' },
        { sel: '.game-item a.play-game-link',  desc: '開始遊戲連結' },
      ]
    },
    gamePlay: {
      name: '🕹️ 遊戲內容頁',
      detect: () => !!document.querySelector('#game-play'),
      rules: [
        { sel: '#game-play',                              desc: '遊戲內容根容器' },
        { sel: '.current-game-title',                     desc: '目前遊戲名稱' },
        { sel: '#game-play section.game-area',            desc: '遊戲區域容器' },
        { sel: 'section.game-area iframe.game-frame',     desc: '遊戲 iframe' },
        { sel: 'aside.game-leaderboard',                  desc: '排行榜區塊' },
        { sel: '.game-leaderboard .leaderboard-title',    desc: '排行榜標題' },
        { sel: '.game-leaderboard .leaderboard-item',     desc: '排行榜資料', optional: true },
        { sel: '.leaderboard-item .player-rank',          desc: '玩家名次', optional: true },
      ]
    },
  };

  // ============================================================
  // 執行檢測，回傳結果陣列
  // ============================================================
  function runChecks() {
    const navRules = [
      { sel: 'header.site-header',                       desc: '頁首容器' },
      { sel: '.site-header .brand a.brand-link',         desc: 'Logo 品牌連結' },
      { sel: '.site-header nav.main-nav',                desc: '主導覽列' },
      { sel: '.site-header nav.main-nav a.home-link',    desc: '首頁連結' },
      { sel: '.site-header nav.main-nav a.games-link',   desc: '遊戲連結' },
      { sel: '.site-header nav.main-nav a.friends-link', desc: '好友連結' },
      { sel: '.site-header .user-area',                  desc: '使用者區域' },
    ];

    const sections = [];

    // 偵測頁面
    let matched = false;
    for (const [, spec] of Object.entries(PAGE_SPECS)) {
      if (!spec.detect()) continue;
      matched = true;

      const items = [];
      spec.rules.forEach(r => {
        const ok = !!document.querySelector(r.sel);
        const altOk = r.optional && typeof r.optional === 'string' && !!document.querySelector(r.optional);
        items.push({ desc: r.desc, sel: r.sel, status: ok ? 'pass' : (altOk || r.optional === true) ? 'warn' : 'fail' });
      });

      if (spec.conditional) {
        spec.conditional.forEach(g => {
          if (!g.check()) return;
          g.rules.forEach(r => {
            const ok = !!document.querySelector(r.sel);
            items.push({ desc: `[${g.label}] ${r.desc}`, sel: r.sel, status: ok ? 'pass' : 'fail' });
          });
        });
      }

      const pass = items.filter(i => i.status === 'pass').length;
      const warn = items.filter(i => i.status === 'warn').length;
      const total = items.length;
      sections.push({ name: spec.name, items, pass, warn, total });
    }

    if (!matched) {
      sections.push({ name: '❓ 未識別頁面', items: [], pass: 0, warn: 0, total: 0, unknown: true });
    }

    // 全站導覽列
    const navItems = navRules.map(r => ({
      desc: r.desc, sel: r.sel,
      status: !!document.querySelector(r.sel) ? 'pass' : 'fail'
    }));
    const navPass = navItems.filter(i => i.status === 'pass').length;
    sections.push({ name: '🔗 全站導覽列', items: navItems, pass: navPass, warn: 0, total: navItems.length, isNav: true });

    return sections;
  }

  // ============================================================
  // 建立浮動視窗 UI
  // ============================================================
  function buildUI(sections) {
    // ── 整體容器 ──
    const wrap = document.createElement('div');
    wrap.id = '__ft_checker__';
    Object.assign(wrap.style, {
      position: 'fixed', top: '20px', right: '20px', zIndex: '2147483647',
      width: '420px', maxHeight: '88vh',
      background: '#0f172a', borderRadius: '14px',
      boxShadow: '0 8px 40px rgba(0,0,0,.7)',
      fontFamily: '"Segoe UI",system-ui,sans-serif', fontSize: '13px',
      color: '#e2e8f0', display: 'flex', flexDirection: 'column',
      border: '1px solid #1e3a5f', overflow: 'hidden', userSelect: 'none',
    });

    // ── 標題列（可拖曳） ──
    const header = document.createElement('div');
    Object.assign(header.style, {
      background: 'linear-gradient(135deg,#1e40af,#7c3aed)',
      padding: '10px 14px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', cursor: 'grab', flexShrink: '0',
    });

    const htitle = document.createElement('span');
    htitle.innerHTML = '🔍 <strong>FunTech DOM 檢測工具</strong>';
    Object.assign(htitle.style, { fontSize: '14px', letterSpacing: '.3px' });

    const hbtns = document.createElement('div');
    hbtns.style.display = 'flex';
    hbtns.style.gap = '6px';

    // 重新整理按鈕
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '↺';
    styleIconBtn(refreshBtn, '#3b82f6');
    refreshBtn.title = '重新檢測';

    // 關閉按鈕
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    styleIconBtn(closeBtn, '#ef4444');
    closeBtn.onclick = () => wrap.remove();

    hbtns.append(refreshBtn, closeBtn);
    header.append(htitle, hbtns);

    // ── URL 列 ──
    const urlBar = document.createElement('div');
    Object.assign(urlBar.style, {
      padding: '5px 14px', background: '#0b1120',
      fontSize: '11px', color: '#64748b', flexShrink: '0',
      borderBottom: '1px solid #1e3a5f', overflow: 'hidden',
      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    });
    urlBar.textContent = '📍 ' + location.href;

    // ── 摘要列 ──
    const summary = document.createElement('div');
    Object.assign(summary.style, {
      padding: '8px 14px', background: '#111827',
      display: 'flex', gap: '10px', flexShrink: '0',
      borderBottom: '1px solid #1e3a5f', flexWrap: 'wrap',
    });

    // ── 內容捲動區 ──
    const body = document.createElement('div');
    Object.assign(body.style, {
      overflowY: 'auto', flex: '1', padding: '10px 0',
    });

    // ── 組裝 ──
    wrap.append(header, urlBar, summary, body);
    document.body.appendChild(wrap);

    // ── 填入內容 ──
    renderContent(sections, body, summary);

    // 重新整理
    refreshBtn.onclick = () => {
      const fresh = runChecks();
      body.innerHTML = '';
      summary.innerHTML = '';
      renderContent(fresh, body, summary);
    };

    // ── 拖曳功能 ──
    makeDraggable(wrap, header);
  }

  function renderContent(sections, body, summary) {
    let totalPass = 0, totalFail = 0, totalWarn = 0;

    sections.forEach(sec => {
      totalPass += sec.pass;
      totalFail += sec.total - sec.pass - sec.warn;
      totalWarn += sec.warn;

      // 區段卡片
      const card = document.createElement('div');
      Object.assign(card.style, {
        margin: '0 10px 10px', borderRadius: '10px',
        border: '1px solid #1e3a5f', overflow: 'hidden',
      });

      // 區段標題列
      const secHead = document.createElement('div');
      const pct = sec.total ? Math.round((sec.pass / sec.total) * 100) : 0;
      const headColor = sec.unknown ? '#475569'
                      : pct === 100 ? '#166534'
                      : pct >= 70  ? '#92400e'
                      : '#7f1d1d';
      Object.assign(secHead.style, {
        background: headColor, padding: '7px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer',
      });

      const secName = document.createElement('span');
      secName.style.fontWeight = '700';
      secName.textContent = sec.unknown ? '❓ 無法識別此頁面' : sec.name;

      const secBadge = document.createElement('span');
      Object.assign(secBadge.style, {
        fontSize: '11px', background: 'rgba(255,255,255,.2)',
        borderRadius: '20px', padding: '2px 8px', fontWeight: '700',
      });
      secBadge.textContent = sec.unknown ? '—' : `${sec.pass}/${sec.total} (${pct}%)`;

      secHead.append(secName, secBadge);

      // 項目列表（可折疊）
      const itemList = document.createElement('div');
      itemList.style.background = '#0f172a';

      if (sec.unknown) {
        const hint = document.createElement('div');
        Object.assign(hint.style, { padding: '10px 14px', color: '#64748b', lineHeight: '1.6' });
        hint.innerHTML = '此頁面未符合任何已知頁面規格。<br>請確認是否在 FunTech 網站中。';
        itemList.appendChild(hint);
      } else {
        sec.items.forEach(item => {
          const row = document.createElement('div');
          Object.assign(row.style, {
            padding: '6px 14px', borderBottom: '1px solid #1e293b',
            display: 'flex', alignItems: 'flex-start', gap: '8px',
          });
          row.style.background = item.status === 'fail' ? 'rgba(239,68,68,.06)' : 'transparent';

          const icon = document.createElement('span');
          icon.style.flexShrink = '0';
          icon.style.marginTop = '1px';
          icon.textContent = item.status === 'pass' ? '✅' : item.status === 'warn' ? '⚠️' : '❌';

          const txt = document.createElement('div');
          const descEl = document.createElement('div');
          descEl.style.fontWeight = '500';
          descEl.style.color = item.status === 'fail' ? '#fca5a5' : item.status === 'warn' ? '#fde68a' : '#86efac';
          descEl.textContent = item.desc;

          const selEl = document.createElement('div');
          Object.assign(selEl.style, { fontSize: '11px', color: '#475569', marginTop: '2px', fontFamily: 'monospace' });
          selEl.textContent = item.sel;

          txt.append(descEl, selEl);
          row.append(icon, txt);
          itemList.appendChild(row);
        });
      }

      // 折疊切換
      let collapsed = false;
      secHead.onclick = () => {
        collapsed = !collapsed;
        itemList.style.display = collapsed ? 'none' : 'block';
      };

      card.append(secHead, itemList);
      body.appendChild(card);
    });

    // ── 摘要數字 ──
    [
      { label: '✅ 通過', val: totalPass, color: '#22c55e' },
      { label: '❌ 失敗', val: totalFail, color: '#ef4444' },
      { label: '⚠️ 警告', val: totalWarn, color: '#f59e0b' },
    ].forEach(({ label, val, color }) => {
      const chip = document.createElement('div');
      Object.assign(chip.style, {
        background: '#1e293b', borderRadius: '8px', padding: '4px 12px',
        display: 'flex', alignItems: 'center', gap: '6px',
      });
      chip.innerHTML = `<span style="color:${color};font-weight:700;font-size:15px">${val}</span>
                        <span style="color:#94a3b8;font-size:11px">${label}</span>`;
      summary.appendChild(chip);
    });
  }

  function styleIconBtn(btn, hoverColor) {
    Object.assign(btn.style, {
      background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '6px',
      color: '#fff', cursor: 'pointer', width: '26px', height: '26px',
      fontSize: '14px', lineHeight: '1', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '0',
    });
    btn.onmouseenter = () => { btn.style.background = hoverColor; };
    btn.onmouseleave = () => { btn.style.background = 'rgba(255,255,255,.15)'; };
  }

  function makeDraggable(el, handle) {
    let dx = 0, dy = 0, x = 0, y = 0;
    handle.onmousedown = (e) => {
      e.preventDefault();
      handle.style.cursor = 'grabbing';
      x = e.clientX; y = e.clientY;
      document.onmousemove = (e) => {
        dx = x - e.clientX; dy = y - e.clientY;
        x = e.clientX; y = e.clientY;
        el.style.top  = (el.offsetTop  - dy) + 'px';
        el.style.left = (el.offsetLeft - dx) + 'px';
        el.style.right = 'auto';
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        handle.style.cursor = 'grab';
      };
    };
  }

  // ============================================================
  // 執行
  // ============================================================
  const results = runChecks();
  buildUI(results);
})();
