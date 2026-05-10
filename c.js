/**
 * FunTech 競賽頁面自動檢測腳本
 * 貼到 Console 後自動偵測目前頁面應有的 ID / Class / Tag
 * 並顯示 ✅ 通過 / ❌ 缺少 / ⚠️ 警告
 */
(function () {
  // ============================================================
  // 各頁面的檢測規格（依試題規格定義）
  // ============================================================
  const PAGE_SPECS = {

    // ---------- 首頁 index.php ----------
    home: {
      name: '🏠 首頁 (index.php)',
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
            { sel: '.user-area a.login-link',    desc: '登入連結（未登入時）' },
            { sel: '.user-area a.register-link', desc: '註冊連結（未登入時）' },
          ]
        },
        {
          label: '已登入狀態',
          check: () => !!document.querySelector('.user-area .user-badge'),
          rules: [
            { sel: '.user-area .user-badge',    desc: '使用者徽章（已登入）' },
            { sel: '.user-area a.profile-link', desc: '個人頁面連結（已登入）' },
            { sel: '.user-area a.logout-link',  desc: '登出連結（已登入）' },
          ]
        },
      ]
    },

    // ---------- 文章內容頁 article.php ----------
    article: {
      name: '📄 文章內容頁 (article.php)',
      detect: () => !!document.querySelector('#article'),
      rules: [
        { sel: '#article',                           desc: '文章頁根容器' },
        { sel: '#article header.article-header',     desc: '文章標題區塊' },
        { sel: '.article-header h1.article-title',   desc: '文章標題 h1' },
        { sel: '.article-header time.article-date',  desc: '文章發布日期' },
        { sel: '#article section.article-body',      desc: '文章內容區塊' },
      ]
    },

    // ---------- 個人頁面 profile.php ----------
    profile: {
      name: '👤 個人頁面 (profile.php)',
      detect: () => !!document.querySelector('#profile-page'),
      rules: [
        { sel: '#profile-page',                             desc: '個人頁根容器' },
        { sel: 'section.profile-header',                    desc: '使用者資訊區塊' },
        { sel: '.profile-header img.profile-avatar',        desc: '使用者頭像' },
        { sel: '.profile-header .profile-username',         desc: '使用者名稱' },
        { sel: '.profile-header .profile-bio',              desc: '簡介文字' },
        { sel: 'section.profile-articles',                  desc: '使用者文章區塊' },
        { sel: '.profile-articles .article-item',           desc: '文章項目（或空訊息）',
          optional: '.profile-articles .empty-article-message' },
        { sel: '.article-item .article-title',              desc: '文章標題' },
        { sel: '.article-item time.article-date',           desc: '發佈日期' },
        { sel: '.article-item a.article-readmore',          desc: '閱讀文章連結' },
      ],
      conditional: [
        {
          label: '自己的個人頁（已登入本人）',
          check: () => !!document.querySelector('a.new-post-link'),
          rules: [
            { sel: 'a.new-post-link',                           desc: '發表新文章連結' },
            { sel: 'form.article-create-form',                  desc: '文章發布表單容器' },
            { sel: '.article-create-form input.article-title-input',    desc: '文章標題輸入欄' },
            { sel: '.article-create-form textarea.article-content-input', desc: '文章內容輸入欄' },
            { sel: '.article-create-form button.article-submit-button',  desc: '發布文章按鈕' },
          ]
        },
        {
          label: '簡介編輯功能（自己的頁面）',
          check: () => !!document.querySelector('textarea.profile-bio-input'),
          rules: [
            { sel: '.profile-header textarea.profile-bio-input', desc: '簡介輸入 textarea' },
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

    // ---------- 登入頁面 login.php ----------
    login: {
      name: '🔐 登入頁面 (login.php)',
      detect: () => !!document.querySelector('form.login-form'),
      rules: [
        { sel: 'form.login-form',                          desc: '登入表單容器' },
        { sel: '.login-form input.username-input',         desc: '帳號輸入欄' },
        { sel: '.login-form input.password-input',         desc: '密碼輸入欄' },
        { sel: '.login-form button.login-submit-button',   desc: '登入送出按鈕' },
      ]
    },

    // ---------- 註冊頁面 register.php ----------
    register: {
      name: '📝 註冊頁面 (register.php)',
      detect: () => !!document.querySelector('form.register-form'),
      rules: [
        { sel: 'form.register-form',                              desc: '註冊表單容器' },
        { sel: '.register-form input.username-input',             desc: '帳號輸入欄' },
        { sel: '.register-form input.email-input',                desc: '電子郵件輸入欄' },
        { sel: '.register-form input.password-input',             desc: '密碼輸入欄' },
        { sel: '.register-form input.password-confirm-input',     desc: '確認密碼輸入欄' },
        { sel: '.register-form button.register-submit',           desc: '註冊送出按鈕' },
      ]
    },

    // ---------- 好友頁面 friends.php ----------
    friends: {
      name: '👫 好友頁面 (friends.php)',
      detect: () => !!document.querySelector('#friends-page'),
      rules: [
        { sel: '#friends-page',                                       desc: '好友頁主容器' },
        { sel: '#friends-page .friend-search-section',                desc: '搜尋功能區塊' },
        { sel: '#friends-page .friend-list-section',                  desc: '好友列表區塊' },
        { sel: '#friends-page .incoming-requests-section',            desc: '收到的好友申請區塊' },
        { sel: '#friends-page .sent-requests-section',                desc: '送出的好友申請區塊' },
        { sel: 'form.friend-search-form',                             desc: '搜尋表單容器' },
        { sel: '.friend-search-form input.search-input',              desc: '搜尋輸入欄' },
        { sel: '.friend-search-form button.search-submit-button',     desc: '搜尋按鈕' },
        { sel: '.friend-search-section .search-result-list',          desc: '搜尋結果容器' },
        { sel: '.friend-list-section .section-title',                 desc: '好友列表標題' },
        { sel: '.incoming-requests-section .section-title',           desc: '收到申請標題' },
        { sel: '.sent-requests-section .section-title',               desc: '送出申請標題' },
      ]
    },

    // ---------- 遊戲列表頁 games.php ----------
    games: {
      name: '🎮 遊戲列表頁 (games.php)',
      detect: () => !!document.querySelector('#games'),
      rules: [
        { sel: '#games',                           desc: '遊戲列表根容器' },
        { sel: '#games section.game-list',         desc: '遊戲列表容器' },
        { sel: '.game-list .game-item',            desc: '遊戲項目（至少1筆）' },
        { sel: '.game-item img.game-cover',        desc: '遊戲封面圖片' },
        { sel: '.game-item .game-title',           desc: '遊戲名稱' },
        { sel: '.game-item .game-description',     desc: '遊戲簡介' },
        { sel: '.game-item a.play-game-link',      desc: '開始遊戲連結' },
      ]
    },

    // ---------- 遊戲內容頁 game_play.php ----------
    gamePlay: {
      name: '🕹️ 遊戲內容頁 (game_play.php)',
      detect: () => !!document.querySelector('#game-play'),
      rules: [
        { sel: '#game-play',                                  desc: '遊戲內容根容器' },
        { sel: '.current-game-title',                         desc: '目前遊戲名稱' },
        { sel: '#game-play section.game-area',                desc: '遊戲區域容器' },
        { sel: 'section.game-area iframe.game-frame',         desc: '遊戲 iframe' },
        { sel: 'aside.game-leaderboard',                      desc: '排行榜區塊' },
        { sel: '.game-leaderboard .leaderboard-title',        desc: '排行榜標題' },
        { sel: '.game-leaderboard .leaderboard-item',         desc: '排行榜資料（或空訊息）',
          optional: true },
        { sel: '.leaderboard-item .player-rank',              desc: '玩家名次', optional: true },
      ]
    },
  };

  // ============================================================
  // 工具函式
  // ============================================================
  const pass  = (msg) => console.log(`%c  ✅ ${msg}`, 'color:#22c55e;font-weight:500');
  const fail  = (msg) => console.log(`%c  ❌ ${msg}`, 'color:#ef4444;font-weight:600');
  const warn  = (msg) => console.log(`%c  ⚠️  ${msg}`, 'color:#f59e0b;font-weight:500');
  const info  = (msg) => console.log(`%c${msg}`,        'color:#60a5fa;font-weight:700;font-size:13px');
  const title = (msg) => console.log(`%c${msg}`,        'color:#a78bfa;font-weight:800;font-size:15px');
  const line  = ()    => console.log('%c' + '─'.repeat(55), 'color:#334155');

  function checkRule(rule) {
    const exists = !!document.querySelector(rule.sel);
    if (exists) {
      pass(`${rule.desc}\n     └─ ${rule.sel}`);
      return true;
    }
    // 有 optional 備案時改 warn
    if (rule.optional) {
      const alt = typeof rule.optional === 'string'
        ? document.querySelector(rule.optional)
        : null;
      if (typeof rule.optional === 'string' && alt) {
        warn(`${rule.desc} → 顯示空訊息元素代替\n     └─ ${rule.sel}`);
        return true;
      }
      warn(`${rule.desc}（可選）\n     └─ ${rule.sel}`);
      return true;
    }
    fail(`${rule.desc}\n     └─ ${rule.sel}`);
    return false;
  }

  // ============================================================
  // 主程式：偵測目前頁面並執行對應規格
  // ============================================================
  function run() {
    console.clear();
    title('╔══════════════════════════════════════╗');
    title('║  FunTech 頁面 DOM 自動檢測工具 v1.0  ║');
    title('╚══════════════════════════════════════╝');
    console.log(`%c  🌐 目前 URL：${location.href}`, 'color:#94a3b8');
    line();

    let matched = false;

    for (const [key, spec] of Object.entries(PAGE_SPECS)) {
      if (!spec.detect()) continue;
      matched = true;

      info(`\n${spec.name}`);
      line();

      let total = 0, passed = 0;

      // 基本規則
      for (const rule of spec.rules) {
        total++;
        if (checkRule(rule)) passed++;
      }

      // 條件規則
      if (spec.conditional) {
        for (const group of spec.conditional) {
          if (group.check()) {
            info(`\n  📌 條件區塊：${group.label}`);
            for (const rule of group.rules) {
              total++;
              if (checkRule(rule)) passed++;
            }
          }
        }
      }

      // 頁面摘要
      line();
      const pct = Math.round((passed / total) * 100);
      const color = pct === 100 ? '#22c55e' : pct >= 70 ? '#f59e0b' : '#ef4444';
      console.log(
        `%c  📊 ${spec.name} 結果：${passed} / ${total} 通過（${pct}%）`,
        `color:${color};font-weight:700;font-size:13px`
      );
      line();
    }

    if (!matched) {
      console.log('%c  ❓ 無法識別此頁面，請確認是否在 FunTech 網站中', 'color:#f87171;font-size:13px');
      console.log('%c  💡 偵測依據：#home / #article / #profile-page / form.login-form / form.register-form / #friends-page / #games / #game-play', 'color:#94a3b8');
    }

    // ── 全站導覽列快速驗證（任何頁面都跑）──
    info('\n🔗 全站導覽列快速驗證');
    line();
    const navRules = [
      { sel: 'header.site-header',                       desc: '頁首容器' },
      { sel: '.site-header .brand a.brand-link',         desc: 'Logo 品牌連結' },
      { sel: '.site-header nav.main-nav',                desc: '主導覽列' },
      { sel: '.site-header nav.main-nav a.home-link',    desc: '首頁連結' },
      { sel: '.site-header nav.main-nav a.games-link',   desc: '遊戲連結' },
      { sel: '.site-header nav.main-nav a.friends-link', desc: '好友連結' },
      { sel: '.site-header .user-area',                  desc: '使用者區域' },
    ];
    navRules.forEach(r => checkRule(r));
    line();

    console.log('%c\n  ✔ 檢測完成！請修正所有 ❌ 項目', 'color:#60a5fa;font-weight:700');
  }

  run();
})();
