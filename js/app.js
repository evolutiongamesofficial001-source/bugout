/* ============================================================
   BugOut — front-end completo (HTML/CSS/JS puro)
   Banco: Firebase Realtime Database (REST) • Imagens: Cloudflare R2
   ============================================================ */
(() => {
'use strict';
const CFG = window.BUGOUT_CONFIG;
const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const AREAS = ['Software', 'Game Dev', 'Web Dev', 'Fullstack', 'Backend', 'Frontend', 'Vibe Code', 'Outro'];
const GENDERS = ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não dizer', 'Outro'];
const BANNERS = {
  violet: 'linear-gradient(135deg,#8b1cff,#2a0a63 60%,#050507)',
  yellow: 'linear-gradient(135deg,#ffd60a,#ff9f0a 50%,#3a2a00)',
  night: 'linear-gradient(135deg,#050507,#1b0f3a 50%,#8b1cff)',
  sunset: 'linear-gradient(135deg,#ffd60a,#ff4d8d 50%,#8b1cff)',
  matrix: 'linear-gradient(135deg,#02140a,#0b6b3a 60%,#ffd60a)'
};
const DEFAULTS = {
  accent: 'purple', radius: 'soft', fontSize: 16, compact: false, contrast: false,
  anim: true, glow: true,
  privateProfile: false, showBirth: false, showFollowers: true, showOnline: true, allowMsgs: true,
  nLikes: true, nComments: true, nFollowers: true, nNews: false, nSound: false,
  autolock: false, feedDefault: 'all', lang: 'pt-BR'
};

/* ---------- ícones ---------- */
const P = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  settings: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  left: '<polyline points="15 18 9 12 15 6"/>',
  right: '<polyline points="9 18 15 12 9 6"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'
};
const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;
const VBADGE = '<svg class="vb" viewBox="0 0 24 24" aria-label="Verificado"><path fill="currentColor" d="M12 1l2.6 2.1 3.3-.2 1.2 3.1 2.8 1.8-.9 3.2.9 3.2-2.8 1.8-1.2 3.1-3.3-.2L12 23l-2.6-2.1-3.3.2-1.2-3.1L2.1 16.2 3 13l-.9-3.2 2.8-1.8 1.2-3.1 3.3.2z"/><path d="M8 12.3l2.7 2.7L16.3 9.4" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const badge = (u) => (u && u.verified === true ? VBADGE : '');

/* ---------- storage local ---------- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} }
};

/* ---------- estado ---------- */
const S = { me: null, users: null, usersAt: 0, posts: {}, settings: { ...DEFAULTS, ...LS.get('bo_settings', {}) },
  tk: 0, after: null, feedTab: null, sTab: 'users', q: '', pgTab: 'all', pfTab: 'posts', pvDev: 'phone',
  pFile: null, draft: null, pj: null, regTimer: null };
const R = { step: 0, d: { areas: [] } };

/* ---------- helpers ---------- */
const fixUrl = (u) => { u = (u || '').trim(); if (!u) return ''; return /^https?:\/\//i.test(u) ? u : 'https://' + u; };
const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'agora'; if (s < 3600) return Math.floor(s / 60) + ' min';
  if (s < 86400) return Math.floor(s / 3600) + ' h'; if (s < 2592000) return Math.floor(s / 86400) + ' d';
  return new Date(ts).toLocaleDateString('pt-BR');
};
function toast(msg, type = '') {
  const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg;
  $('#toasts').appendChild(t); setTimeout(() => { t.style.transition = 'all .4s'; t.style.opacity = 0; t.style.transform = 'translateX(30px)'; setTimeout(() => t.remove(), 400); }, 3200);
}
function openModal(html, wide) {
  closeModal();
  const bg = document.createElement('div'); bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog">${html}</div>`;
  bg.addEventListener('mousedown', (e) => { if (e.target === bg) closeModal(); });
  $('#modal-root').appendChild(bg); return bg;
}
function closeModal() { $('#modal-root').innerHTML = ''; }
const modalHead = (t) => `<div class="modal-h"><h3>${t}</h3><button class="x" data-act="closeModal" aria-label="Fechar">${ic('x')}</button></div>`;
function loading(btn, on) { if (!btn) return; btn.disabled = on; btn.classList.toggle('loading', on); }
function pickImage() {
  return new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = () => res(i.files[0] || null); i.click(); });
}
const av = (u, cls = '') => u && u.avatar
  ? `<img class="av ${cls}" src="${esc(u.avatar)}" alt="" loading="lazy">`
  : `<div class="av ${cls}">${esc(((u && (u.name || u.username)) || '?')[0].toUpperCase())}</div>`;
const bannerStyle = (u) => u && u.banner ? `background-image:url('${esc(u.banner)}')` : `background:${BANNERS[(u && u.bannerColor)] || BANNERS.violet}`;
async function getUsers(force) {
  if (!S.users || force || Date.now() - S.usersAt > 20000) { S.users = (await DB.get('users')) || {}; S.usersAt = Date.now(); }
  return S.users;
}
const sk = (n = 3) => Array.from({ length: n }, () => '<div class="sk" style="height:130px"></div>').join('');
const emptyBox = (t) => `<div class="empty anim-in"><img src="assets/logo-icon.svg" alt="">${t}</div>`;

/* ---------- configurações visuais ---------- */
function applySettings(s) {
  const r = document.documentElement;
  r.dataset.accent = s.accent === 'yellow' ? 'yellow' : 'purple';
  r.dataset.radius = s.radius === 'sharp' ? 'sharp' : 'soft';
  r.style.setProperty('--fs', (s.fontSize || 16) + 'px');
  r.classList.toggle('no-anim', !s.anim);
  r.classList.toggle('no-glow', !s.glow);
  r.classList.toggle('compact', !!s.compact);
  r.classList.toggle('hc', !!s.contrast);
}

/* ============================================================
   AUTENTICAÇÃO
   ============================================================ */
function renderAuth(mode = 'login') {
  const snippets = ['const bug = null;', 'git commit -m "fix"', 'while(true){ ship(); }', '<div id="app"/>', 'npm run dev', 'SELECT * FROM devs;'];
  $('#app').innerHTML = `
  <div class="auth">
    <section class="auth-hero">
      ${snippets.map((s, i) => `<span class="code-float" style="top:${8 + i * 15}%;left:${(i * 23) % 70 + 5}%;animation-delay:${i * .8}s">${esc(s)}</span>`).join('')}
      <img class="bug" src="assets/logo-icon.svg" alt="BugOut">
      <div class="wordmark">BUG<span>OUT</span></div>
      <p>A rede social de quem programa. Mostre seus projetos, publique código e conecte com outros devs.</p>
      <ul class="feats">
        <li>${ic('zap')} Feed com posts, código e imagens</li>
        <li>${ic('layers')} Páginas para apresentar seus projetos</li>
        <li>${ic('user')} Perfil totalmente personalizável</li>
      </ul>
    </section>
    <section class="auth-side">
      <div class="auth-card anim-in">
        <div class="tabs">
          <button class="tab ${mode === 'login' ? 'on' : ''}" data-act="authTab" data-m="login">Entrar</button>
          <button class="tab ${mode === 'register' ? 'on' : ''}" data-act="authTab" data-m="register">Criar conta</button>
        </div>
        <div id="authBody"></div>
      </div>
    </section>
  </div>`;
  mode === 'login' ? loginForm() : (R.step = 0, R.d = { areas: [] }, regStep());
}
function loginForm() {
  $('#authBody').innerHTML = `
  <form data-form="login" class="anim-in" autocomplete="on">
    <div class="step-title">Bem-vindo de volta</div>
    <p class="mut" style="margin-bottom:16px">Entre para continuar codando.</p>
    <div class="field"><label>E-mail ou usuário</label><input class="input" name="id" autocomplete="username" required></div>
    <div class="field"><label>Senha</label><input class="input" type="password" name="pass" autocomplete="current-password" required></div>
    <div class="err-msg" id="authErr"></div>
    <button class="btn block" type="submit">Entrar</button>
  </form>`;
}
function regStep() {
  const st = R.step, d = R.d;
  const titles = ['Conta', 'Perfil', 'Área'];
  const steps = titles.map((s, i) => `<div class="step ${i === st ? 'on' : ''} ${i < st ? 'done' : ''}"><i>${i < st ? ic('check') : i + 1}</i><span>${s}</span></div>`).join('<b></b>');
  let body = '';
  if (st === 0) body = `
    <div class="step-title">Parte 1 · Sua conta</div><p class="mut" style="margin-bottom:14px">Dados de acesso.</p>
    <div class="field"><label>E-mail</label><input class="input" type="email" name="email" value="${esc(d.email || '')}" autocomplete="email" required></div>
    <div class="field"><label>Senha</label><input class="input" type="password" name="password" value="${esc(d.password || '')}" minlength="6" autocomplete="new-password" required><span class="hint">Mínimo de 6 caracteres.</span></div>
    <div class="field"><label>Confirmar senha</label><input class="input" type="password" name="password2" value="${esc(d.password2 || '')}" autocomplete="new-password" required></div>`;
  if (st === 1) body = `
    <div class="step-title">Parte 2 · Seu perfil</div><p class="mut" style="margin-bottom:14px">Como as pessoas vão te conhecer.</p>
    <div class="field"><label>Usuário</label><input class="input" name="username" value="${esc(d.username || '')}" placeholder="seu_usuario" autocomplete="username" required><span class="hint">Escolha como quiser — só não pode ser igual a um já existente.</span></div>
    <div class="field"><label>Bio</label><textarea class="input" name="bio" maxlength="160" placeholder="Fale um pouco sobre você e o que você constrói...">${esc(d.bio || '')}</textarea></div>
    <div class="two">
      <div class="field"><label>Gênero</label><select class="input select" name="gender" required><option value="">Selecione</option>${GENDERS.map((g) => `<option ${d.gender === g ? 'selected' : ''}>${g}</option>`).join('')}</select></div>
      <div class="field"><label>Data de nascimento</label><input class="input" type="date" name="birth" value="${esc(d.birth || '')}" max="${new Date().toISOString().slice(0, 10)}" required></div>
    </div>`;
  if (st === 2) body = `
    <div class="step-title">Parte 3 · Sua área</div><p class="mut" style="margin-bottom:14px">Escolha uma ou mais.</p>
    <div class="chips" id="areaChips">${areaChips(d.areas, 'area')}</div>
    <div class="field" id="otherBox" style="margin-top:14px;${d.areas.includes('Outro') ? '' : 'display:none'}"><label>Qual é a sua área?</label><input class="input" name="areaOther" value="${esc(d.areaOther || '')}" maxlength="40" placeholder="Ex.: DevOps, Mobile, IA..."></div>`;
  $('#authBody').innerHTML = `
  <form data-form="reg" autocomplete="on">
    <div class="steps">${steps}</div>
    <div class="anim-in" key="${st}">${body}</div>
    <div class="err-msg" id="authErr"></div>
    <div class="row">
      ${st > 0 ? `<button class="btn ghost" type="button" data-act="regBack">Voltar</button>` : ''}
      <button class="btn ${st === 2 ? 'yellow' : ''}" type="submit">${st === 2 ? 'Criar conta' : 'Continuar'}</button>
    </div>
  </form>`;
}
const areaChips = (sel, act) => AREAS.map((a) => `<button type="button" class="chip ${sel.includes(a) ? 'on' : ''}" data-act="${act}" data-v="${a}">${a}</button>`).join('');

async function createAccount(d) {
  const uname = d.username.trim(), uk = unameKey(uname), ek = emailKey(d.email);
  if (!uk) throw new Error('Escolha um nome de usuário.');
  const [e1, e2] = await Promise.all([DB.get('emails/' + ek), DB.get('usernames/' + uk)]);
  if (e1) throw new Error('Este e-mail já está cadastrado.');
  if (e2) throw new Error('Este nome de usuário já existe.');
  const id = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const salt = randHex(8), passHash = await sha256(d.password + salt);
  const areas = d.areas.map((a) => (a === 'Outro' && d.areaOther ? 'Outro: ' + d.areaOther : a));
  const user = {
    username: uname, name: d.username, bio: d.bio || '', gender: d.gender, birthdate: d.birth,
    areas, avatar: '', banner: '', bannerColor: 'violet', site: '', github: '',
    verified: false,               // ← toda conta nasce NÃO verificada
    createdAt: Date.now(), settings: {}
  };
  await DB.set('users/' + id, user);
  await DB.set('accounts/' + id, { email: d.email.toLowerCase(), passHash, salt, createdAt: Date.now() });
  await DB.set('emails/' + ek, id);
  await DB.set('usernames/' + uk, id);
  return { id, ...user };
}
async function login(idv, pass) {
  idv = idv.trim();
  if (!idv) throw new Error('Informe seu e-mail ou usuário.');
  let uid = idv.includes('@') ? await DB.get('emails/' + emailKey(idv)) : null;
  if (!uid) uid = await DB.get('usernames/' + unameKey(idv));
  if (!uid) throw new Error('Conta não encontrada.');
  const acc = await DB.get('accounts/' + uid);
  if (!acc || (await sha256(pass + acc.salt)) !== acc.passHash) throw new Error('Senha incorreta.');
  if (acc.appLock) LS.set('bo_lock_' + uid, acc.appLock);
  const u = await DB.get('users/' + uid);
  return { id: uid, ...u };
}
function startSession(u, fresh) {
  S.me = u; LS.set('bo_session', u.id);
  S.settings = { ...DEFAULTS, ...(u.settings || {}) }; LS.set('bo_settings', S.settings); applySettings(S.settings);
  S.feedTab = null; sessionStorage.setItem('bo_unlocked', '1');
  location.hash = '#/feed'; route();
  if (fresh) toast('Conta criada! Bem-vindo ao BugOut 🐞', 'ok');
}
function logout() {
  LS.del('bo_session'); sessionStorage.removeItem('bo_unlocked'); S.me = null; S.users = null; location.hash = ''; route();
}

/* ============================================================
   TRAVA DO APP (senha opcional)
   ============================================================ */
const lockData = () => S.me && LS.get('bo_lock_' + S.me.id, null);
const isLocked = () => !!lockData() && sessionStorage.getItem('bo_unlocked') !== '1';
function renderLock() {
  $('#app').innerHTML = `<div class="lock anim-in"><img src="assets/logo-icon.svg" alt=""><h2>App bloqueado</h2><p class="mut">Digite a senha do app para entrar.</p>
  <form data-form="unlock" style="display:grid;gap:12px;width:100%;max-width:300px"><input class="input" type="password" name="p" placeholder="Senha do app" autofocus required><div class="err-msg" id="lockErr"></div><button class="btn block" type="submit">Desbloquear</button></form>
  <button class="btn ghost sm" data-act="logout">Sair da conta</button></div>`;
}

/* ============================================================
   SHELL + ROTAS
   ============================================================ */
const NAV = [['feed', 'home', 'Feed'], ['search', 'search', 'Buscar'], ['pages', 'layers', 'Páginas'], ['profile', 'user', 'Meu perfil'], ['settings', 'settings', 'Configurações']];
function renderShell() {
  if ($('#shell')) { const m = $('#meBox'); if (m) m.innerHTML = meBox(); return; }
  $('#app').innerHTML = `
  <header class="topbar"><a class="brand" href="#/feed"><img src="assets/logo-icon.svg" alt="">BUG<span>OUT</span></a><a href="#/settings" class="x" aria-label="Configurações">${ic('settings')}</a></header>
  <div id="shell">
    <aside class="side">
      <a class="brand" href="#/feed"><img src="assets/logo-icon.svg" alt="">BUG<span>OUT</span></a>
      ${NAV.map(([p, i, l]) => `<a class="nav" data-p="${p}" href="#/${p}">${ic(i)}<span>${l}</span></a>`).join('')}
      <button class="btn yellow post-btn" data-act="newPost">${ic('plus')}<span>Postar</span></button>
      <div class="me" id="meBox">${meBox()}</div>
    </aside>
    <main class="main"><div id="view"></div></main>
    <aside class="col-r" id="colR"><form class="rsearch" data-form="rsearch">${ic('search')}<input id="rq" placeholder="Buscar no BugOut" autocomplete="off"></form><div id="rBody"></div></aside>
  </div>
  <nav class="bottom">${NAV.slice(0, 4).map(([p, i, l]) => `<a data-p="${p}" href="#/${p}">${ic(i)}<span>${l === 'Meu perfil' ? 'Perfil' : l}</span></a>`).join('')}</nav>`;
}
const meBox = () => `${av(S.me)}<div><b>${esc(S.me.name)}${badge(S.me)}</b><small class="mut">@${esc(S.me.username)}</small></div>`;
function setActive(p) { $$('[data-p]').forEach((a) => a.classList.toggle('on', a.dataset.p === p)); }

async function route() {
  if (!S.me) return renderAuth();
  if (isLocked()) return renderLock();
  renderShell();
  const [page, a, b] = (location.hash.replace(/^#\/?/, '') || 'feed').split('/');
  const tk = ++S.tk, v = $('#view');
  setActive(page === 'u' ? (a === S.me.id ? 'profile' : 'search') : page === 'project' ? 'pages' : page);
  v.className = page === 'feed' ? 'flat' : 'pad'; v.innerHTML = sk(); S.after = null; window.scrollTo(0, 0);
  try {
    let html;
    if (page === 'feed') html = await feedView();
    else if (page === 'search') html = searchView();
    else if (page === 'pages') html = await pagesView();
    else if (page === 'project') html = await projectView(a);
    else if (page === 'profile') html = a === 'edit' ? editView() : await profileView(S.me.id);
    else if (page === 'u') { if (a === S.me.id) { location.hash = '#/profile'; return; } html = await profileView(a); }
    else if (page === 'settings') html = settingsView();
    else { location.hash = '#/feed'; return; }
    if (tk !== S.tk) return;
    v.innerHTML = html; if (S.after) S.after(); loadRight();
  } catch (e) {
    if (tk === S.tk) v.innerHTML = `<div class="card empty">Não foi possível carregar.<br><small>${esc(e.message)}</small><br><br><button class="btn sm" data-act="reload">Tentar de novo</button></div>`;
  }
}

/* ============================================================
   FEED
   ============================================================ */
async function loadRight() {
  const box = $('#rBody'); if (!box) return;
  try {
    const [users, fing] = await Promise.all([getUsers(), DB.keys('following/' + S.me.id)]);
    const sug = Object.entries(users).map(([id, u]) => ({ id, ...u })).filter((u) => u.id !== S.me.id && !fing.includes(u.id))
      .sort((a, b) => (b.verified === true) - (a.verified === true) || b.createdAt - a.createdAt).slice(0, 4);
    const cnt = {};
    Object.values(users).forEach((u) => (u.areas || []).forEach((a) => { a = a.startsWith('Outro:') ? a.slice(6).trim() : a; if (a && a !== 'Outro') cnt[a] = (cnt[a] || 0) + 1; }));
    const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6);
    box.innerHTML = `
    <section class="card rcard anim-in"><h3>Quem seguir</h3>
      ${sug.length ? sug.map((u) => `<div class="r-u">${av(u)}<div class="info" data-act="goUser" data-id="${u.id}"><b>${esc(u.name)}${badge(u)}</b><small>@${esc(u.username)}</small></div><button class="btn sm" data-act="rfollow" data-id="${u.id}">Seguir</button></div>`).join('') : '<p class="mut" style="padding:0 16px 10px">Você já segue todo mundo 🎉</p>'}
    </section>
    <section class="card rcard anim-in" style="--i:1"><h3>Áreas em alta</h3>
      ${top.length ? top.map(([a, n], i) => `<button class="r-tr" data-act="areaSearch" data-v="${esc(a)}"><small>#${i + 1} · Dev</small><b>${esc(a)}</b><small>${n} dev${n > 1 ? 's' : ''}</small></button>`).join('') : '<p class="mut" style="padding:0 16px 10px">Sem dados ainda.</p>'}
    </section>
    <footer class="r-foot">BugOut · feito para quem programa<br>© 2026</footer>`;
  } catch (e) { box.innerHTML = ''; }
}

async function feedView() {
  if (!S.feedTab) S.feedTab = S.settings.feedDefault || 'all';
  const [posts, users] = await Promise.all([DB.get('posts'), getUsers()]);
  S.posts = posts || {};
  let list = Object.entries(S.posts).map(([id, p]) => ({ id, ...p })).sort((a, b) => b.createdAt - a.createdAt);
  if (S.feedTab === 'following') {
    const f = await DB.keys('following/' + S.me.id);
    list = list.filter((p) => f.includes(p.uid) || p.uid === S.me.id);
  }
  S.pFile = null;
  S.after = () => { if (S.focus) { S.focus = false; const t = $('.composer textarea'); if (t) t.focus(); } };
  return `
  <div class="feed-h"><div class="feed-tabs"><button class="${S.feedTab === 'all' ? 'on' : ''}" data-act="feedTab" data-v="all">Para você</button><button class="${S.feedTab === 'following' ? 'on' : ''}" data-act="feedTab" data-v="following">Seguindo</button></div></div>
  <form class="card composer anim-in" data-form="post" style="--i:1">
    <div class="top">${av(S.me)}<textarea name="text" placeholder="O que você está construindo hoje?" maxlength="1000" rows="2"></textarea></div>
    <textarea class="code-in" name="code" id="codeIn" placeholder="// cole seu código aqui" style="display:none" spellcheck="false"></textarea>
    <div id="pImgBox"></div>
    <div class="tools">
      <button type="button" class="tool" data-act="postImg">${ic('image')} Imagem</button>
      <button type="button" class="tool" data-act="postCode">${ic('code')} Código</button>
      <button class="btn sm" type="submit">Publicar</button>
    </div>
  </form>
  <div id="posts" class="list">${list.length ? list.map((p, i) => postHTML(p.id, p, users, i)).join('') : emptyBox('Nenhum post ainda. Seja o primeiro a publicar!')}</div>`;
}
function actsHTML(id, p) {
  const likes = Object.keys(p.likes || {}), liked = likes.includes(S.me.id), cm = Object.keys(p.comments || {}).length;
  return `<button class="act ${liked ? 'liked' : ''}" data-act="like" data-id="${id}">${ic('heart')}<span>${likes.length}</span></button>
  <button class="act" data-act="comments" data-id="${id}">${ic('msg')}<span>${cm}</span></button>
  ${p.uid === S.me.id ? `<button class="act del" data-act="delPost" data-id="${id}" aria-label="Excluir">${ic('trash')}</button>` : ''}`;
}
function postHTML(id, p, users, i = 0) {
  const u = users[p.uid] || { name: 'Usuário removido', username: 'removido' };
  return `<article class="card post anim-in" id="post-${id}" style="--i:${Math.min(i, 8)}">
    <div class="p-av" data-act="goUser" data-id="${p.uid}">${av(u)}</div>
    <div class="p-main">
      <div class="p-head" data-act="goUser" data-id="${p.uid}"><b>${esc(u.name)}${badge(u)}</b><span>@${esc(u.username)} · ${timeAgo(p.createdAt)}</span></div>
      ${p.text ? `<div class="post-t">${esc(p.text)}</div>` : ''}
      ${p.code ? `<pre><code>${esc(p.code)}</code></pre>` : ''}
      ${p.image ? `<img class="post-img" src="${esc(p.image)}" alt="Imagem do post" loading="lazy">` : ''}
      <div class="acts" id="acts-${id}">${actsHTML(id, p)}</div>
      <div class="comments" id="cm-${id}" hidden></div>
    </div>
  </article>`;
}
function commentsHTML(id) {
  const p = S.posts[id], users = S.users || {};
  const cms = Object.values(p.comments || {}).sort((a, b) => a.at - b.at);
  return cms.map((c) => { const u = users[c.uid] || { name: '?' };
    return `<div class="cm">${av(u)}<div><b>${esc(u.name)}${badge(u)}</b> <small class="mut">${timeAgo(c.at)}</small><br>${esc(c.text)}</div></div>`; }).join('') +
    `<form class="cm-in" data-form="comment" data-id="${id}"><input class="input" name="t" placeholder="Escreva um comentário..." maxlength="300" required><button class="btn sm" type="submit">Enviar</button></form>`;
}

/* ============================================================
   BUSCAR
   ============================================================ */
function searchView() {
  S.after = () => doSearch();
  return `
  <div class="page-h anim-in"><h2>Buscar</h2></div>
  <div class="searchbox anim-in" style="--i:1">${ic('search')}<input class="input" id="q" type="search" placeholder="Buscar usuários ou projetos..." value="${esc(S.q)}" autocomplete="off"></div>
  <div class="seg anim-in" style="--i:2;justify-self:start"><button class="${S.sTab === 'users' ? 'on' : ''}" data-act="sTab" data-v="users">${ic('user')} Usuários</button><button class="${S.sTab === 'projects' ? 'on' : ''}" data-act="sTab" data-v="projects">${ic('layers')} Projetos</button></div>
  <div id="results" class="list"></div>`;
}
async function doSearch() {
  const box = $('#results'); if (!box) return;
  const q = S.q.trim().toLowerCase();
  try {
    const users = await getUsers();
    if (S.sTab === 'users') {
      let arr = Object.entries(users).map(([id, u]) => ({ id, ...u }));
      if (q) arr = arr.filter((u) => [u.name, u.username, u.bio, (u.areas || []).join(' ')].join(' ').toLowerCase().includes(q));
      else arr.sort((a, b) => (b.verified === true) - (a.verified === true) || b.createdAt - a.createdAt);
      box.innerHTML = arr.length ? arr.slice(0, 40).map((u, i) => `
        <div class="card hover u-row anim-in" style="--i:${Math.min(i, 8)}" data-act="goUser" data-id="${u.id}">${av(u, 'md')}
        <div class="info"><b>${esc(u.name)}${badge(u)}</b><p>@${esc(u.username)}${u.bio ? ' · ' + esc(u.bio) : ''}</p></div></div>`).join('') : emptyBox('Nenhum usuário encontrado.');
    } else {
      const pj = (await DB.get('projects')) || {};
      let arr = Object.entries(pj).map(([id, p]) => ({ id, ...p })).sort((a, b) => b.createdAt - a.createdAt);
      if (q) arr = arr.filter((p) => [p.name, p.desc, (users[p.uid] || {}).name].join(' ').toLowerCase().includes(q));
      box.innerHTML = arr.length ? `<div class="grid">${arr.slice(0, 40).map((p, i) => projectCard(p.id, p, users, i)).join('')}</div>` : emptyBox('Nenhum projeto encontrado.');
    }
  } catch (e) { box.innerHTML = emptyBox('Erro ao buscar.'); }
}

/* ============================================================
   PÁGINAS (projetos)
   ============================================================ */
function projectCard(id, p, users, i = 0) {
  const u = users[p.uid] || { name: '?' }, img = (p.images || [])[0];
  return `<article class="card hover pj anim-in" style="--i:${Math.min(i, 8)}" data-act="openProject" data-id="${id}">
    <div class="cover">${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : ic('layers')}</div>
    <div class="body"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><div class="by">${av(u)}<span>${esc(u.name)}${badge(u)}</span></div></div></article>`;
}
async function pagesView() {
  const [pj, users] = await Promise.all([DB.get('projects'), getUsers()]);
  let arr = Object.entries(pj || {}).map(([id, p]) => ({ id, ...p })).sort((a, b) => b.createdAt - a.createdAt);
  if (S.pgTab === 'mine') arr = arr.filter((p) => p.uid === S.me.id);
  return `
  <div class="page-h anim-in"><h2>Páginas</h2><button class="btn sm" data-act="newProject">${ic('plus')} Nova página</button></div>
  <div class="seg anim-in" style="--i:1;justify-self:start"><button class="${S.pgTab === 'all' ? 'on' : ''}" data-act="pgTab" data-v="all">Todas</button><button class="${S.pgTab === 'mine' ? 'on' : ''}" data-act="pgTab" data-v="mine">Minhas</button></div>
  ${arr.length ? `<div class="grid">${arr.map((p, i) => projectCard(p.id, p, users, i)).join('')}</div>` : emptyBox(S.pgTab === 'mine' ? 'Você ainda não criou nenhuma página de projeto.' : 'Nenhum projeto publicado ainda.')}`;
}
async function projectView(id) {
  const [p, users] = await Promise.all([DB.get('projects/' + id), getUsers()]);
  if (!p) return emptyBox('Projeto não encontrado.');
  const u = users[p.uid] || { name: '?', username: '?' }, imgs = p.images || [], mine = p.uid === S.me.id;
  return `
  <div class="page-h anim-in"><button class="btn ghost sm" data-act="back">${ic('left')} Voltar</button>
    ${mine ? `<div style="display:flex;gap:8px"><button class="btn ghost sm" data-act="editProject" data-id="${id}">${ic('edit')} Editar</button><button class="btn danger sm" data-act="delProject" data-id="${id}">${ic('trash')}</button></div>` : ''}</div>
  <article class="card anim-in" style="--i:1;display:grid;gap:14px">
    ${imgs.length ? `<div class="carousel" data-i="0" data-n="${imgs.length}"><div class="car-track">${imgs.map((s) => `<img src="${esc(s)}" alt="">`).join('')}</div>
      ${imgs.length > 1 ? `<button class="car-btn l" data-act="car" data-d="-1" aria-label="Anterior">${ic('left')}</button><button class="car-btn r" data-act="car" data-d="1" aria-label="Próxima">${ic('right')}</button><div class="dots">${imgs.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>` : ''}</div>` : ''}
    <h2 style="font-size:1.8rem">${esc(p.name)}</h2>
    <div class="u-row" data-act="goUser" data-id="${p.uid}">${av(u)}<div class="info"><b>${esc(u.name)}${badge(u)}</b><p>@${esc(u.username)} · ${timeAgo(p.createdAt)}</p></div></div>
    <p style="white-space:pre-wrap;word-break:break-word">${esc(p.desc)}</p>
    ${p.showBtn && p.link ? `<a class="btn yellow" style="justify-self:start" href="${esc(fixUrl(p.link))}" target="_blank" rel="noopener noreferrer">${esc(p.btnLabel || 'Visitar projeto')} ${ic('link')}</a>` : ''}
  </article>`;
}
function renderSlots() {
  $('#slots').innerHTML = S.pj.images.map((im, i) => `<div class="slot" data-act="slot" data-i="${i}">${im ? `<img src="${esc(im.prev || im.url)}" alt=""><button type="button" class="x" data-act="slotDel" data-i="${i}">${ic('x')}</button>` : ic('plus')}</div>`).join('');
}
function projectForm(id, p) {
  const imgs = [0, 1, 2].map((i) => ((p && p.images) || [])[i] ? { url: p.images[i] } : null);
  S.pj = { id, images: imgs };
  p = p || { showBtn: true };
  openModal(`${modalHead(id ? 'Editar página' : 'Nova página de projeto')}
  <form data-form="project">
    <div class="field"><label>Fotos (até 3)</label><div class="slots" id="slots"></div></div>
    <div class="field"><label>Nome do projeto</label><input class="input" name="name" maxlength="60" value="${esc(p.name || '')}" required></div>
    <div class="field"><label>Descrição</label><textarea class="input" name="desc" maxlength="1200" required>${esc(p.desc || '')}</textarea></div>
    <div class="field"><label>Botão opcional</label>
      <div class="set" style="border:0;padding:0"><div class="t"><small>Mostrar botão que redireciona para o site</small></div><label class="sw"><input type="checkbox" name="showBtn" ${p.showBtn ? 'checked' : ''}><i></i></label></div>
      <input class="input" name="btnLabel" placeholder="Texto do botão (ex.: Ver site)" maxlength="30" value="${esc(p.btnLabel || '')}">
      <input class="input" name="link" type="text" placeholder="Link (ex.: meusite.com)" value="${esc(p.link || '')}"></div>
    <div class="err-msg" id="pjErr"></div>
    <button class="btn block" type="submit">${id ? 'Salvar' : 'Publicar página'}</button>
  </form>`, true);
  renderSlots();
}

/* ============================================================
   PERFIL
   ============================================================ */
async function profileView(uid) {
  const user = await DB.get('users/' + uid);
  if (!user) return emptyBox('Perfil não encontrado.');
  const [fers, fing, pj, posts, users] = await Promise.all([DB.keys('followers/' + uid), DB.keys('following/' + uid), DB.get('projects'), DB.get('posts'), getUsers()]);
  S.posts = posts || {};
  const me = uid === S.me.id, isF = fers.includes(S.me.id), set = user.settings || {};
  const projs = Object.entries(pj || {}).map(([id, p]) => ({ id, ...p })).filter((p) => p.uid === uid).sort((a, b) => b.createdAt - a.createdAt);
  const ps = Object.entries(S.posts).map(([id, p]) => ({ id, ...p })).filter((p) => p.uid === uid).sort((a, b) => b.createdAt - a.createdAt);
  const hideF = !me && set.showFollowers === false;
  const gh = (user.github || '').replace(/[^A-Za-z0-9-]/g, '');
  return `
  <article class="card pf anim-in">
    <div class="pf-banner" style="${bannerStyle(user)}"></div>
    <div class="pf-body">
      ${av(user, 'lg pf-av')}
      <div class="pf-name">${esc(user.name)}${badge(user)}</div>
      <div class="mut">@${esc(user.username)}</div>
      ${user.bio ? `<p class="pf-bio">${esc(user.bio)}</p>` : ''}
      <div class="stats">
        <div class="stat"><b>${hideF ? '—' : fers.length}</b><small>Seguidores</small></div>
        <div class="stat"><b>${hideF ? '—' : fing.length}</b><small>Seguindo</small></div>
        <div class="stat"><b>${projs.length}</b><small>Páginas</small></div>
      </div>
      <div class="chips" style="justify-content:center">${(user.areas || []).map((a) => `<span class="chip static">${esc(a)}</span>`).join('')}</div>
      ${(user.site || gh) ? `<div class="links">${user.site ? `<a href="${esc(fixUrl(user.site))}" target="_blank" rel="noopener noreferrer">${ic('link')} Site</a>` : ''}${gh ? `<a href="https://github.com/${gh}" target="_blank" rel="noopener noreferrer">${ic('code')} GitHub</a>` : ''}</div>` : ''}
      ${set.showBirth && user.birthdate ? `<small class="mut">🎂 ${new Date(user.birthdate + 'T00:00').toLocaleDateString('pt-BR')}</small>` : ''}
      <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;justify-content:center">
        ${me ? `<a class="btn" href="#/profile/edit">${ic('edit')} Editar perfil</a><a class="btn ghost" href="#/settings">${ic('settings')} Configurações</a>`
            : `<button class="btn ${isF ? 'ghost' : ''}" data-act="follow" data-id="${uid}" data-on="${isF ? 1 : 0}">${isF ? 'Seguindo' : 'Seguir'}</button>`}
      </div>
    </div>
  </article>
  <div class="seg anim-in" style="--i:2;justify-self:center"><button class="${S.pfTab === 'posts' ? 'on' : ''}" data-act="pfTab" data-v="posts">Posts (${ps.length})</button><button class="${S.pfTab === 'pages' ? 'on' : ''}" data-act="pfTab" data-v="pages">Páginas (${projs.length})</button></div>
  ${S.pfTab === 'posts'
    ? `<div class="list">${ps.length ? ps.map((p, i) => postHTML(p.id, p, users, i)).join('') : emptyBox('Nenhum post ainda.')}</div>`
    : (projs.length ? `<div class="grid">${projs.map((p, i) => projectCard(p.id, p, users, i)).join('')}</div>` : emptyBox('Nenhuma página de projeto.'))}`;
}

function previewHTML(d, dev) {
  const inner = `<div class="pv-banner" style="${bannerStyle(d)}"></div>
  <div class="pv-body">${av(d, 'pv-av')}<div class="pv-name">${esc(d.name || 'Seu nome')}${badge(S.me)}</div><small class="mut">@${esc(S.me.username)}</small>
  <div class="pv-bio">${esc(d.bio || 'Sua bio aparece aqui.')}</div>
  <div class="pv-stats"><span><b>0</b>Seguidores</span><span><b>0</b>Seguindo</span><span><b>0</b>Páginas</span></div></div>`;
  return dev === 'phone' ? `<div class="pv pv-phone">${inner}</div>` : `<div class="pv pv-desk">${inner}</div>`;
}
function renderPreview() {
  const b = $('#pvBox'); if (!b) return; b.innerHTML = previewHTML(S.draft, S.pvDev);
  $$('[data-act="pvDev"]').forEach((x) => x.classList.toggle('on', x.dataset.v === S.pvDev));
}
function editView() {
  const m = S.me;
  S.draft = { name: m.name, bio: m.bio || '', avatar: m.avatar || '', banner: m.banner || '', bannerColor: m.bannerColor || 'violet',
    site: m.site || '', github: m.github || '', areas: (m.areas || []).map((a) => (a.startsWith('Outro:') ? 'Outro' : a)), areaOther: (m.areas || []).find((a) => a.startsWith('Outro:'))?.slice(7) || '',
    avatarFile: null, bannerFile: null };
  const d = S.draft; S.after = renderPreview;
  return `
  <div class="page-h anim-in"><h2>Editar perfil</h2><a class="btn ghost sm" href="#/profile">${ic('left')} Voltar</a></div>
  <div class="edit-grid">
    <form class="card anim-in" data-form="editProfile" style="--i:1">
      <div class="field"><label>Foto de perfil</label><div class="upl">${av(d, 'md')}<button type="button" class="btn ghost sm" data-act="pickAvatar">${ic('image')} Trocar foto</button><button type="button" class="btn ghost sm" data-act="rmAvatar">Remover</button></div></div>
      <div class="field"><label>Banner</label>
        <div class="swatches">${Object.keys(BANNERS).map((k) => `<button type="button" class="swatch ${!d.banner && d.bannerColor === k ? 'on' : ''}" style="background:${BANNERS[k]}" data-act="swatch" data-v="${k}" aria-label="${k}"></button>`).join('')}</div>
        <div class="upl" style="margin-top:8px"><button type="button" class="btn ghost sm" data-act="pickBanner">${ic('image')} Enviar imagem de banner</button><button type="button" class="btn ghost sm" data-act="rmBanner">Remover</button></div></div>
      <div class="field"><label>Nome</label><input class="input" data-d="name" value="${esc(d.name)}" maxlength="40" required></div>
      <div class="field"><label>Bio</label><textarea class="input" data-d="bio" maxlength="160">${esc(d.bio)}</textarea></div>
      <div class="two"><div class="field"><label>Site</label><input class="input" data-d="site" value="${esc(d.site)}" placeholder="meusite.com"></div>
      <div class="field"><label>GitHub</label><input class="input" data-d="github" value="${esc(d.github)}" placeholder="usuario"></div></div>
      <div class="field"><label>Áreas</label><div class="chips" id="dAreas">${areaChips(d.areas, 'dArea')}</div></div>
      <div class="field" id="dOther" style="${d.areas.includes('Outro') ? '' : 'display:none'}"><label>Outra área</label><input class="input" data-d="areaOther" value="${esc(d.areaOther)}" maxlength="40"></div>
      <div class="err-msg" id="edErr"></div>
      <div class="row"><a class="btn ghost" href="#/profile">Cancelar</a><button class="btn" type="submit">Salvar alterações</button></div>
    </form>
    <div class="preview-wrap anim-in" style="--i:2">
      <div class="seg"><button class="${S.pvDev === 'phone' ? 'on' : ''}" data-act="pvDev" data-v="phone">${ic('phone')} Celular</button><button class="${S.pvDev === 'desk' ? 'on' : ''}" data-act="pvDev" data-v="desk">${ic('monitor')} PC</button></div>
      <div id="pvBox" style="width:100%;display:grid;justify-items:center"></div>
      <small class="mut">Visualização estática de como seu perfil aparece.</small>
    </div>
  </div>`;
}

/* ============================================================
   CONFIGURAÇÕES
   ============================================================ */
const T = (key, t, s) => ({ type: 'toggle', key, t, s });
const SEL = (key, t, s, opts) => ({ type: 'select', key, t, s, opts });
const BTN = (act, t, s, label, cls = 'ghost') => ({ type: 'btn', act, t, s, label, cls });
const GROUPS = () => [
  { t: 'Aparência', i: 'image', items: [
    SEL('accent', 'Cor de destaque', 'Roxo ou amarelo nos botões e detalhes', [['purple', 'Roxo'], ['yellow', 'Amarelo']]),
    SEL('radius', 'Cantos', 'Arredondados ou retos', [['soft', 'Arredondados'], ['sharp', 'Retos']]),
    { type: 'range', key: 'fontSize', t: 'Tamanho da fonte', s: 'Ajuste o texto do app', min: 13, max: 20 },
    T('compact', 'Modo compacto', 'Menos espaço entre os cards'),
    T('contrast', 'Alto contraste', 'Bordas e textos mais fortes')] },
  { t: 'Animações e efeitos', i: 'zap', items: [
    T('anim', 'Animações', 'Transições e movimento na interface'),
    T('glow', 'Brilho de fundo', 'Gradientes e luzes animadas')] },
  { t: 'Feed', i: 'home', items: [
    SEL('feedDefault', 'Aba inicial do feed', 'O que abrir primeiro', [['all', 'Para você'], ['following', 'Seguindo']])] },
  { t: 'Privacidade', i: 'lock', items: [
    T('privateProfile', 'Perfil privado', 'Só seguidores veem seus posts'),
    T('showBirth', 'Mostrar data de nascimento', 'Exibir no seu perfil'),
    T('showFollowers', 'Mostrar seguidores/seguindo', 'Contagens visíveis para os outros'),
    T('showOnline', 'Mostrar status online', 'Aparecer como ativo'),
    T('allowMsgs', 'Permitir mensagens', 'Receber mensagens de outros devs')] },
  { t: 'Notificações', i: 'msg', items: [
    T('nLikes', 'Curtidas', 'Quando curtirem seus posts'),
    T('nComments', 'Comentários', 'Quando comentarem'),
    T('nFollowers', 'Novos seguidores', 'Quando alguém te seguir'),
    T('nNews', 'Novidades por e-mail', 'Atualizações do BugOut'),
    T('nSound', 'Sons', 'Efeitos sonoros de alerta')] },
  { t: 'Segurança', i: 'lock', items: [
    BTN(lockData() ? 'lockSet' : 'lockSet', 'Senha do app (opcional)', lockData() ? 'Ativada — pedida ao abrir o site/app' : 'Peça uma senha para entrar no site/app', lockData() ? 'Alterar' : 'Definir', 'ghost'),
    ...(lockData() ? [BTN('lockOff', 'Remover senha do app', 'Desativa o bloqueio', 'Remover', 'ghost')] : []),
    T('autolock', 'Bloquear ao sair da aba', 'Pede a senha do app ao voltar'),
    BTN('chPass', 'Alterar senha da conta', 'Troque sua senha de login', 'Alterar')] },
  { t: 'Conta', i: 'user', items: [
    BTN('reqVerify', 'Solicitar verificação', 'Peça o selo de verificado', 'Solicitar'),
    BTN('exportData', 'Exportar meus dados', 'Baixe um arquivo JSON', 'Exportar'),
    BTN('clearCache', 'Limpar cache local', 'Remove dados salvos neste aparelho', 'Limpar'),
    BTN('logout', 'Sair da conta', 'Encerrar sessão neste aparelho', 'Sair'),
    BTN('delAccount', 'Excluir conta', 'Apaga perfil, posts e projetos', 'Excluir', 'danger')] }
];
function settingsView() {
  const s = S.settings;
  const row = (it) => {
    let c = '';
    if (it.type === 'toggle') c = `<label class="sw"><input type="checkbox" data-set="${it.key}" ${s[it.key] ? 'checked' : ''}><i></i></label>`;
    if (it.type === 'select') c = `<select class="input select" data-set="${it.key}">${it.opts.map(([v, l]) => `<option value="${v}" ${s[it.key] === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
    if (it.type === 'range') c = `<input type="range" data-set="${it.key}" min="${it.min}" max="${it.max}" value="${s[it.key]}">`;
    if (it.type === 'btn') c = `<button class="btn sm ${it.cls}" data-act="${it.act}">${it.label}</button>`;
    return `<div class="set"><div class="t"><b>${it.t}</b><small>${it.s}</small></div>${c}</div>`;
  };
  return `<div class="page-h anim-in"><h2>Configurações</h2></div>` +
    GROUPS().map((g, i) => `<section class="card set-group anim-in" style="--i:${i}"><h3>${ic(g.i)} ${g.t}</h3>${g.items.map(row).join('')}</section>`).join('') +
    `<p class="mut" style="text-align:center;font-size:.8rem">BugOut v1.0 · feito para quem programa</p>`;
}
let saveT;
function saveSettings() { LS.set('bo_settings', S.settings); clearTimeout(saveT); saveT = setTimeout(() => DB.update('users/' + S.me.id, { settings: S.settings }).catch(() => {}), 600); }
async function deleteAccount() {
  const id = S.me.id, acc = await DB.get('accounts/' + id) || {};
  const [posts, pj] = await Promise.all([DB.get('posts'), DB.get('projects')]);
  const jobs = [];
  Object.entries(posts || {}).forEach(([k, p]) => p.uid === id && jobs.push(DB.del('posts/' + k)));
  Object.entries(pj || {}).forEach(([k, p]) => p.uid === id && jobs.push(DB.del('projects/' + k)));
  jobs.push(DB.del('users/' + id), DB.del('accounts/' + id), DB.del('usernames/' + unameKey(S.me.username)), DB.del('followers/' + id), DB.del('following/' + id));
  if (acc.email) jobs.push(DB.del('emails/' + emailKey(acc.email)));
  await Promise.all(jobs);
  LS.del('bo_lock_' + id); logout();
}

/* ============================================================
   AÇÕES (cliques)
   ============================================================ */
const ACT = {
  closeModal: closeModal,
  reload: () => route(),
  newPost: () => { S.focus = true; if ((location.hash.replace(/^#\/?/, '') || 'feed') === 'feed') route(); else location.hash = '#/feed'; },
  rfollow: async (t) => {
    loading(t, true);
    try {
      await Promise.all([DB.set(`followers/${t.dataset.id}/${S.me.id}`, true), DB.set(`following/${S.me.id}/${t.dataset.id}`, true)]);
      t.className = 'btn ghost sm'; t.textContent = 'Seguindo'; t.disabled = true;
    } catch (e) { toast(e.message, 'err'); loading(t, false); }
  },
  areaSearch: (t) => { S.q = t.dataset.v; S.sTab = 'users'; if ((location.hash.replace(/^#\/?/, '')) === 'search') route(); else location.hash = '#/search'; },
  back: () => history.length > 1 ? history.back() : (location.hash = '#/pages'),
  logout: () => logout(),
  authTab: (t) => renderAuth(t.dataset.m),
  regBack: () => { R.step--; regStep(); },
  area: (t) => {
    const a = t.dataset.v, l = R.d.areas, i = l.indexOf(a); i > -1 ? l.splice(i, 1) : l.push(a);
    t.classList.toggle('on'); $('#otherBox').style.display = l.includes('Outro') ? '' : 'none';
  },
  goUser: (t) => { location.hash = '#/u/' + t.dataset.id; },
  openProject: (t) => { location.hash = '#/project/' + t.dataset.id; },
  feedTab: (t) => { S.feedTab = t.dataset.v; route(); },
  sTab: (t) => { S.sTab = t.dataset.v; route(); },
  pgTab: (t) => { S.pgTab = t.dataset.v; route(); },
  pfTab: (t) => { S.pfTab = t.dataset.v; route(); },
  postCode: () => { const c = $('#codeIn'); c.style.display = c.style.display === 'none' ? '' : 'none'; if (c.style.display === '') c.focus(); },
  postImg: async () => {
    const f = await pickImage(); if (!f) return; S.pFile = f;
    $('#pImgBox').innerHTML = `<div class="prev-img"><img src="${URL.createObjectURL(f)}" alt=""><button type="button" class="x" data-act="postImgDel">${ic('x')}</button></div>`;
  },
  postImgDel: () => { S.pFile = null; $('#pImgBox').innerHTML = ''; },
  like: (t) => {
    const id = t.dataset.id, p = S.posts[id], me = S.me.id; p.likes = p.likes || {};
    if (p.likes[me]) { delete p.likes[me]; DB.del(`posts/${id}/likes/${me}`).catch(() => {}); }
    else { p.likes[me] = true; DB.set(`posts/${id}/likes/${me}`, true).catch(() => {}); }
    $('#acts-' + id).innerHTML = actsHTML(id, p);
  },
  comments: async (t) => {
    const id = t.dataset.id, box = $('#cm-' + id);
    if (box.hidden) { await getUsers(); box.innerHTML = commentsHTML(id); box.hidden = false; } else box.hidden = true;
  },
  delPost: async (t) => {
    if (!confirm('Excluir este post?')) return;
    const id = t.dataset.id; await DB.del('posts/' + id); delete S.posts[id];
    const el = $('#post-' + id); if (el) el.remove(); toast('Post excluído');
  },
  follow: async (t) => {
    const id = t.dataset.id, on = t.dataset.on === '1'; loading(t, true);
    try {
      if (on) await Promise.all([DB.del(`followers/${id}/${S.me.id}`), DB.del(`following/${S.me.id}/${id}`)]);
      else await Promise.all([DB.set(`followers/${id}/${S.me.id}`, true), DB.set(`following/${S.me.id}/${id}`, true)]);
      route();
    } catch (e) { toast(e.message, 'err'); loading(t, false); }
  },
  /* projetos */
  newProject: () => projectForm(null, null),
  editProject: async (t) => projectForm(t.dataset.id, await DB.get('projects/' + t.dataset.id)),
  delProject: async (t) => { if (!confirm('Excluir esta página de projeto?')) return; await DB.del('projects/' + t.dataset.id); toast('Página excluída'); location.hash = '#/pages'; },
  slot: async (t) => {
    if (t.querySelector('img')) return;
    const f = await pickImage(); if (!f) return;
    S.pj.images[+t.dataset.i] = { file: f, prev: URL.createObjectURL(f) }; renderSlots();
  },
  slotDel: (t, e) => { e.stopPropagation(); S.pj.images[+t.dataset.i] = null; renderSlots(); },
  car: (t) => {
    const c = t.closest('.carousel'), n = +c.dataset.n; let i = (+c.dataset.i + +t.dataset.d + n) % n; c.dataset.i = i;
    $('.car-track', c).style.transform = `translateX(-${i * 100}%)`; $$('.dots i', c).forEach((d, k) => d.classList.toggle('on', k === i));
  },
  /* edição de perfil */
  pvDev: (t) => { S.pvDev = t.dataset.v; renderPreview(); },
  pickAvatar: async () => { const f = await pickImage(); if (!f) return; S.draft.avatarFile = f; S.draft.avatar = URL.createObjectURL(f); renderPreview(); $('.upl .av').outerHTML = av(S.draft, 'md'); },
  rmAvatar: () => { S.draft.avatar = ''; S.draft.avatarFile = null; renderPreview(); $('.upl .av').outerHTML = av(S.draft, 'md'); },
  pickBanner: async () => { const f = await pickImage(); if (!f) return; S.draft.bannerFile = f; S.draft.banner = URL.createObjectURL(f); $$('.swatch').forEach((s) => s.classList.remove('on')); renderPreview(); },
  rmBanner: () => { S.draft.banner = ''; S.draft.bannerFile = null; renderPreview(); },
  swatch: (t) => { S.draft.bannerColor = t.dataset.v; S.draft.banner = ''; S.draft.bannerFile = null; $$('.swatch').forEach((s) => s.classList.toggle('on', s === t)); renderPreview(); },
  dArea: (t) => {
    const a = t.dataset.v, l = S.draft.areas, i = l.indexOf(a); i > -1 ? l.splice(i, 1) : l.push(a);
    t.classList.toggle('on'); $('#dOther').style.display = l.includes('Outro') ? '' : 'none';
  },
  /* configurações */
  lockSet: () => openModal(`${modalHead('Senha do app')}<p class="mut" style="margin-bottom:14px">Esta senha será pedida sempre que abrir o BugOut neste aparelho.</p>
    <form data-form="lockSet"><div class="field"><label>Nova senha do app</label><input class="input" type="password" name="a" minlength="4" required></div>
    <div class="field"><label>Confirmar</label><input class="input" type="password" name="b" required></div><div class="err-msg" id="mErr"></div><button class="btn block" type="submit">Salvar</button></form>`),
  lockOff: async () => { LS.del('bo_lock_' + S.me.id); await DB.update('accounts/' + S.me.id, { appLock: null }).catch(() => {}); toast('Senha do app removida', 'ok'); route(); },
  chPass: () => openModal(`${modalHead('Alterar senha da conta')}<form data-form="chpass">
    <div class="field"><label>Senha atual</label><input class="input" type="password" name="o" required></div>
    <div class="field"><label>Nova senha</label><input class="input" type="password" name="a" minlength="6" required></div>
    <div class="field"><label>Confirmar nova senha</label><input class="input" type="password" name="b" required></div><div class="err-msg" id="mErr"></div><button class="btn block" type="submit">Alterar senha</button></form>`),
  reqVerify: async () => { await DB.update('users/' + S.me.id, { verifyRequested: true }); toast('Solicitação enviada! Analisaremos em breve.', 'ok'); },
  exportData: async () => {
    const [u, a, posts] = await Promise.all([DB.get('users/' + S.me.id), DB.get('accounts/' + S.me.id), DB.get('posts')]);
    if (a) { delete a.passHash; delete a.salt; }
    const data = { perfil: u, conta: a, posts: Object.entries(posts || {}).filter(([, p]) => p.uid === S.me.id).map(([id, p]) => ({ id, ...p })) };
    const el = document.createElement('a'); el.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    el.download = 'bugout-meus-dados.json'; el.click(); toast('Dados exportados', 'ok');
  },
  clearCache: () => { S.users = null; S.posts = {}; toast('Cache limpo', 'ok'); },
  delAccount: () => openModal(`${modalHead('Excluir conta')}<p class="mut" style="margin-bottom:14px">Isso apaga seu perfil, posts e projetos. Não dá para desfazer.</p>
    <form data-form="delAcc"><div class="field"><label>Confirme sua senha</label><input class="input" type="password" name="p" required></div><div class="err-msg" id="mErr"></div><button class="btn danger block" type="submit">Excluir para sempre</button></form>`)
};

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const fn = ACT[t.dataset.act]; if (fn) { if (t.tagName === 'A') e.preventDefault(); fn(t, e); }
});
document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'q') { S.q = t.value; clearTimeout(S.qt); S.qt = setTimeout(doSearch, 250); }
  if (t.dataset.d && S.draft) { S.draft[t.dataset.d] = t.value; if (t.dataset.d !== 'areaOther') renderPreview(); }
  if (t.dataset.set && t.type === 'range') { S.settings[t.dataset.set] = +t.value; applySettings(S.settings); }
});
document.addEventListener('change', (e) => {
  const t = e.target, k = t.dataset.set; if (!k) return;
  S.settings[k] = t.type === 'checkbox' ? t.checked : t.type === 'range' ? +t.value : t.value;
  applySettings(S.settings); saveSettings();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
document.addEventListener('visibilitychange', () => {
  if (S.me && S.settings.autolock && lockData()) { if (document.hidden) sessionStorage.removeItem('bo_unlocked'); else route(); }
});
/* swipe no carrossel */
let tx = null;
document.addEventListener('touchstart', (e) => { if (e.target.closest('.carousel')) tx = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', (e) => {
  const c = e.target.closest('.carousel'); if (!c || tx == null) return;
  const dx = e.changedTouches[0].clientX - tx; tx = null;
  if (Math.abs(dx) > 40) { const b = $(dx < 0 ? '.car-btn.r' : '.car-btn.l', c); if (b) b.click(); }
});

/* ============================================================
   FORMULÁRIOS
   ============================================================ */
const FORMS = {
  async login(f) {
    const err = $('#authErr'), btn = $('button[type=submit]', f), fd = new FormData(f); err.textContent = ''; loading(btn, true);
    try { startSession(await login(fd.get('id'), fd.get('pass'))); } catch (e) { err.textContent = e.message; loading(btn, false); }
  },
  async reg(f) {
    const err = $('#authErr'), btn = $('button[type=submit]', f), fd = new FormData(f), d = R.d; err.textContent = '';
    try {
      if (R.step === 0) {
        const email = fd.get('email').trim(), p = fd.get('password'), p2 = fd.get('password2');
        if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('E-mail inválido.');
        if (p.length < 6) throw new Error('A senha precisa de pelo menos 6 caracteres.');
        if (p !== p2) throw new Error('As senhas não coincidem.');
        Object.assign(d, { email, password: p, password2: p2 }); R.step = 1; regStep();
      } else if (R.step === 1) {
        const u = fd.get('username').trim(), birth = fd.get('birth');
        if (!u) throw new Error('Escolha um nome de usuário.');
        if (!fd.get('gender')) throw new Error('Selecione o gênero.');
        if (!birth) throw new Error('Informe a data de nascimento.');
        const age = (Date.now() - new Date(birth).getTime()) / 31557600000;
        if (age < 13) throw new Error('É necessário ter 13 anos ou mais.');
        if (age > 120) throw new Error('Data de nascimento inválida.');
        Object.assign(d, { username: u, bio: fd.get('bio').trim(), gender: fd.get('gender'), birth }); R.step = 2; regStep();
      } else {
        if (!d.areas.length) throw new Error('Escolha pelo menos uma área.');
        d.areaOther = (fd.get('areaOther') || '').trim();
        if (d.areas.includes('Outro') && !d.areaOther) throw new Error('Escreva qual é a sua área em "Outro".');
        loading(btn, true); const u = await createAccount(d); startSession(u, true);
      }
    } catch (e) { err.textContent = e.message; loading(btn, false); }
  },
  rsearch() {
    S.q = $('#rq').value.trim(); S.sTab = 'users';
    if (location.hash.replace(/^#\/?/, '') === 'search') route(); else location.hash = '#/search';
  },
  async unlock(f) {
    const p = new FormData(f).get('p'), l = lockData();
    if (l && (await sha256(p + l.s)) === l.h) { sessionStorage.setItem('bo_unlocked', '1'); route(); }
    else $('#lockErr').textContent = 'Senha incorreta.';
  },
  async post(f) {
    const btn = $('button[type=submit]', f), fd = new FormData(f), text = fd.get('text').trim(), code = (fd.get('code') || '').trim();
    if (!text && !code && !S.pFile) return toast('Escreva algo ou anexe uma imagem', 'err');
    loading(btn, true);
    try {
      const image = S.pFile ? await Storage.upload(S.pFile, 'post') : '';
      await DB.push('posts', { uid: S.me.id, text, code, image, createdAt: Date.now() });
      S.pFile = null; toast('Publicado!', 'ok'); route();
    } catch (e) { toast(e.message, 'err'); loading(btn, false); }
  },
  async comment(f) {
    const id = f.dataset.id, t = new FormData(f).get('t').trim(); if (!t) return;
    const c = { uid: S.me.id, text: t, at: Date.now() };
    try {
      const r = await DB.push(`posts/${id}/comments`, c);
      S.posts[id].comments = { ...(S.posts[id].comments || {}), [r.name]: c };
      $('#cm-' + id).innerHTML = commentsHTML(id); $('#acts-' + id).innerHTML = actsHTML(id, S.posts[id]);
    } catch (e) { toast(e.message, 'err'); }
  },
  async project(f) {
    const err = $('#pjErr'), btn = $('button[type=submit]', f), fd = new FormData(f); err.textContent = ''; loading(btn, true);
    try {
      const imgs = [];
      for (const im of S.pj.images) { if (!im) continue; imgs.push(im.file ? await Storage.upload(im.file, 'project') : im.url); }
      const data = { uid: S.me.id, name: fd.get('name').trim(), desc: fd.get('desc').trim(), images: imgs,
        link: fd.get('link').trim(), btnLabel: fd.get('btnLabel').trim(), showBtn: !!fd.get('showBtn') };
      if (S.pj.id) { await DB.update('projects/' + S.pj.id, { ...data, images: imgs.length ? imgs : null }); }
      else { data.createdAt = Date.now(); const r = await DB.push('projects', data); S.pj.id = r.name; }
      closeModal(); toast('Página salva!', 'ok'); location.hash = '#/project/' + S.pj.id; route();
    } catch (e) { err.textContent = e.message; loading(btn, false); }
  },
  async editProfile(f) {
    const err = $('#edErr'), btn = $('button[type=submit]', f), d = S.draft; err.textContent = '';
    if (!d.name.trim()) { err.textContent = 'Informe um nome.'; return; }
    loading(btn, true);
    try {
      const avatar = d.avatarFile ? await Storage.upload(d.avatarFile, 'avatar') : d.avatar;
      const banner = d.bannerFile ? await Storage.upload(d.bannerFile, 'banner') : d.banner;
      const areas = d.areas.map((a) => (a === 'Outro' && d.areaOther.trim() ? 'Outro: ' + d.areaOther.trim() : a));
      const patch = { name: d.name.trim(), bio: d.bio.trim(), site: d.site.trim(), github: d.github.trim(), avatar, banner, bannerColor: d.bannerColor, areas };
      await DB.update('users/' + S.me.id, patch); Object.assign(S.me, patch); S.users = null;
      toast('Perfil atualizado!', 'ok'); location.hash = '#/profile';
    } catch (e) { err.textContent = e.message; loading(btn, false); }
  },
  async lockSet(f) {
    const fd = new FormData(f), a = fd.get('a'), b = fd.get('b');
    if (a.length < 4) return ($('#mErr').textContent = 'Mínimo de 4 caracteres.');
    if (a !== b) return ($('#mErr').textContent = 'As senhas não coincidem.');
    const s = randHex(8), h = await sha256(a + s); LS.set('bo_lock_' + S.me.id, { h, s });
    await DB.update('accounts/' + S.me.id, { appLock: { h, s } }).catch(() => {});
    sessionStorage.setItem('bo_unlocked', '1'); closeModal(); toast('Senha do app definida', 'ok'); route();
  },
  async chpass(f) {
    const fd = new FormData(f), acc = await DB.get('accounts/' + S.me.id), e = $('#mErr');
    if ((await sha256(fd.get('o') + acc.salt)) !== acc.passHash) return (e.textContent = 'Senha atual incorreta.');
    if (fd.get('a').length < 6) return (e.textContent = 'A nova senha precisa de 6+ caracteres.');
    if (fd.get('a') !== fd.get('b')) return (e.textContent = 'As senhas não coincidem.');
    const salt = randHex(8); await DB.update('accounts/' + S.me.id, { salt, passHash: await sha256(fd.get('a') + salt) });
    closeModal(); toast('Senha alterada', 'ok');
  },
  async delAcc(f) {
    const acc = await DB.get('accounts/' + S.me.id), e = $('#mErr');
    if ((await sha256(new FormData(f).get('p') + acc.salt)) !== acc.passHash) return (e.textContent = 'Senha incorreta.');
    closeModal(); await deleteAccount(); toast('Conta excluída');
  }
};
document.addEventListener('submit', (e) => {
  const f = e.target.closest('form[data-form]'); if (!f) return;
  e.preventDefault(); const fn = FORMS[f.dataset.form];
  if (fn) Promise.resolve(fn(f)).catch((er) => toast(er.message || 'Erro', 'err'));
});

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
async function boot() {
  applySettings(S.settings);
  const uid = LS.get('bo_session', null);
  if (uid) {
    try {
      const u = await DB.get('users/' + uid);
      if (u) { S.me = { id: uid, ...u }; S.settings = { ...DEFAULTS, ...(u.settings || {}) }; LS.set('bo_settings', S.settings); applySettings(S.settings); }
      else LS.del('bo_session');
    } catch (e) { toast('Sem conexão com o banco de dados', 'err'); }
  }
  setTimeout(() => { const s = $('#splash'); if (s) { s.classList.add('hide'); setTimeout(() => s.remove(), 600); } route(); }, 800);
}
window.addEventListener('hashchange', () => { if (S.me && !isLocked()) route(); });
boot();
})();
