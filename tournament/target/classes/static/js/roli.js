/* ===========================
   roli.js — реєстрація / вхід
   ArenaFlow
   =========================== */

const PERMS = {
    'Адміністратор': ['👥 Створювати та видаляти команди','🎭 Змінювати ролі будь-кому','🏆 Керувати рейтингом','🗂 Створювати турніри','⚙️ Повний доступ до системи'],
    'Учасник':       ['👥 Вступити до команди за кодом','📂 Завантажити проєкт','📊 Переглядати свій рейтинг'],
    'Журі':          ['⚖️ Оцінювати роботи команд','🏆 Виставляти бали','📊 Переглядати всі результати'],
    'Організатор':   ['🗂 Створювати турніри','👥 Додавати команди за кодом','👁 Переглядати всіх учасників','📊 Моніторинг подій']
};

const NAME_RULES = {
    minLength: 3, maxLength: 24,
    pattern: /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ'\- ]+$/
};

/* ── TOAST ── */
function toast(msg, ok = true) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = ok ? 'linear-gradient(135deg,#7c6aff,#ff6ab0)' : '#e05555';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── TAB SWITCH ── */
function switchTab(tab) {
    const isLogin = tab === 'login';
    document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
    document.getElementById('regForm').classList.toggle('hidden', isLogin);
    document.getElementById('tabLogin').classList.toggle('active', isLogin);
    document.getElementById('tabRegister').classList.toggle('active', !isLogin);
    clearHints();
}

function clearHints() {
    document.querySelectorAll('.field-hint').forEach(h => {
        h.textContent = ''; h.classList.remove('visible');
    });
    document.querySelectorAll('input').forEach(i => i.classList.remove('input-error'));
}

/* ── FIELD ERROR ── */
function fieldErr(inputId, hintId, msg) {
    const input = document.getElementById(inputId);
    const hint  = document.getElementById(hintId);
    if (msg) {
        input?.classList.add('input-error');
        if (hint) { hint.textContent = msg; hint.classList.add('visible'); }
    } else {
        input?.classList.remove('input-error');
        if (hint) { hint.textContent = ''; hint.classList.remove('visible'); }
    }
}

/* ── NAME VALIDATION ── */
function validateName(val) {
    if (val.length < NAME_RULES.minLength) return `Мінімум ${NAME_RULES.minLength} символи`;
    if (val.length > NAME_RULES.maxLength) return `Максимум ${NAME_RULES.maxLength} символів`;
    if (!NAME_RULES.pattern.test(val))     return 'Тільки літери, пробіл або дефіс';
    return null;
}

/* ── NAME COUNTER ── */
document.getElementById('username')?.addEventListener('input', function () {
    const err = validateName(this.value.trim());
    fieldErr('username', 'nameHint', this.value.trim().length > 0 ? err : null);
    const c = document.getElementById('nameCounter');
    c.textContent = `${this.value.length} / ${NAME_RULES.maxLength}`;
    c.style.color = this.value.length > NAME_RULES.maxLength ? '#ff6060' : '';
});

/* ── PASSWORD STRENGTH ── */
document.getElementById('regPassword')?.addEventListener('input', function () {
    const val = this.value;
    let score = 0;
    if (val.length >= 6)  score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^a-zA-Z0-9]/.test(val)) score++;

    const bar   = document.getElementById('passBar');
    const label = document.getElementById('passStrengthLabel');
    const colors = ['#ff5555','#ff8855','#ffc800','#6dff6d','#7c6aff'];
    const labels = ['Дуже слабкий','Слабкий','Середній','Добрий','Відмінний'];
    const widths = ['20%','40%','60%','80%','100%'];

    if (val.length > 0) {
        bar.style.width     = widths[score - 1] || '20%';
        bar.style.background = colors[score - 1] || colors[0];
        label.textContent   = labels[score - 1] || labels[0];
        label.style.color   = colors[score - 1] || colors[0];
    } else {
        bar.style.width = '0';
        label.textContent = '';
    }
});

/* ── TOGGLE PASSWORD ── */
function togglePass(inputId, btn) {
    const input = document.getElementById(inputId);
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.textContent = isText ? '👁' : '🙈';
}

/* ── LOADING STATE ── */
function setLoading(btnId, textId, spinnerId, loading) {
    document.getElementById(btnId).disabled = loading;
    document.getElementById(textId).classList.toggle('hidden', loading);
    document.getElementById(spinnerId).classList.toggle('hidden', !loading);
}

/* ── LOGIN ── */
async function login() {
    clearHints();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    let valid = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        fieldErr('loginEmail', 'loginEmailHint', 'Введіть коректний email'); valid = false;
    }
    if (!password) {
        fieldErr('loginPassword', 'loginPassHint', 'Введіть пароль'); valid = false;
    }
    if (!valid) return;

    setLoading('loginBtn', 'loginBtnText', 'loginSpinner', true);
    try {
        const res = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const text = await res.text();
        if (!res.ok) { toast(text || 'Помилка входу', false); return; }
        const user = JSON.parse(text);
        sessionStorage.setItem('af_me', JSON.stringify(user));
        showProfile(user);
        toast('✅ Ласкаво просимо, ' + user.name + '!');
    } catch (e) {
        toast('❌ Помилка підключення до сервера', false);
    } finally {
        setLoading('loginBtn', 'loginBtnText', 'loginSpinner', false);
    }
}

/* ── REGISTER ── */
async function register() {
    clearHints();
    const name      = document.getElementById('username').value.trim();
    const email     = document.getElementById('regEmail').value.trim();
    const password  = document.getElementById('regPassword').value;
    const password2 = document.getElementById('regPassword2').value;
    const roleEl    = document.querySelector('.role-option.selected');

    let valid = true;

    const nameErr = validateName(name);
    if (nameErr) { fieldErr('username', 'nameHint', nameErr); valid = false; }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        fieldErr('regEmail', 'emailHint', 'Введіть коректний email'); valid = false;
    }
    if (password.length < 6) {
        fieldErr('regPassword', 'passHint', 'Мінімум 6 символів'); valid = false;
    }
    if (password !== password2) {
        fieldErr('regPassword2', 'pass2Hint', 'Паролі не співпадають'); valid = false;
    }
    if (!roleEl) {
        const rh = document.getElementById('roleHint');
        rh.textContent = 'Оберіть роль'; rh.classList.add('visible'); valid = false;
    }
    if (!valid) return;

    setLoading('regBtn', 'regBtnText', 'regSpinner', true);
    try {
        const res = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role: roleEl.dataset.role })
        });
        const text = await res.text();
        if (!res.ok) { toast(text || 'Помилка реєстрації', false); return; }
        const user = JSON.parse(text);
        sessionStorage.setItem('af_me', JSON.stringify(user));
        showProfile(user);
        toast('✅ Акаунт створено! Ласкаво просимо, ' + user.name + '!');
    } catch (e) {
        toast('❌ Помилка підключення до сервера', false);
    } finally {
        setLoading('regBtn', 'regBtnText', 'regSpinner', false);
    }
}

/* ── ROLE SELECTION ── */
document.querySelectorAll('.role-option').forEach(el => {
    el.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        fieldErr(null, 'roleHint', null);
    });
});

/* ── SHOW PROFILE ── */
function showProfile(user) {
    document.getElementById('authTabs')?.classList.add('hidden');
    document.getElementById('loginForm')?.classList.add('hidden');
    document.getElementById('regForm')?.classList.add('hidden');

    document.getElementById('avatarLetter').textContent = user.name[0].toUpperCase();
    document.getElementById('profileName').textContent  = user.name;
    document.getElementById('profileEmail').textContent = user.email || '';
    document.getElementById('profileCode').textContent  = user.code;

    const badge = document.getElementById('profileBadge');
    badge.textContent = user.role;
    badge.className   = 'badge badge-' + user.role;

    document.getElementById('permsList').innerHTML =
        (PERMS[user.role] || []).map(p => `<div class="perm-item">${p}</div>`).join('');

    document.getElementById('profileCard').classList.remove('hidden');

    // Animate perms
    setTimeout(() => {
        document.querySelectorAll('.perm-item').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 80);
        });
    }, 150);

    if (user.role === 'Адміністратор') {
        document.getElementById('adminPanel').classList.remove('hidden');
        loadAdminTable();
    }
}

/* ── COPY CODE ── */
function copyCode(id) {
    const val = document.getElementById(id).textContent;
    navigator.clipboard.writeText(val).then(() => toast('📋 Скопійовано: ' + val));
}

/* ── LOGOUT ── */
function logout() {
    sessionStorage.removeItem('af_me');
    document.getElementById('profileCard').classList.add('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('authTabs')?.classList.remove('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('regForm').classList.add('hidden');
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabRegister').classList.remove('active');
    clearHints();
    toast('👋 Вийшли з акаунту');
}

/* ── ADMIN TABLE ── */
async function loadAdminTable() {
    const res   = await fetch('/api/users');
    const users = await res.json();
    const tbody = document.getElementById('usersTableBody');
    const noUsers = document.getElementById('noUsers');
    noUsers.classList.toggle('hidden', users.length > 0);

    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${u.name}</td>
            <td class="email-col">${u.email || '—'}</td>
            <td><span class="badge badge-${u.role}" style="padding:2px 8px;font-size:11px">${u.role}</span></td>
            <td style="font-family:monospace;color:#7c6aff;font-size:13px">${u.code}</td>
            <td>
                <select class="role-select" onchange="changeRole('${u.id}',this.value)">
                    ${['Адміністратор','Учасник','Журі','Організатор'].map(r =>
                        `<option ${r===u.role?'selected':''}>${r}</option>`).join('')}
                </select>
            </td>
            <td><button class="btn-del" onclick="deleteUser('${u.id}')">✖</button></td>
        </tr>`).join('');
}

async function changeRole(id, role) {
    await fetch(`/api/users/${id}/role`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
    });
    loadAdminTable(); toast('🔄 Роль змінено');
}

async function deleteUser(id) {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    loadAdminTable(); toast('🗑 Видалено', false);
}

/* ── RESTORE SESSION ── */
const me = JSON.parse(sessionStorage.getItem('af_me') || 'null');
if (me) showProfile(me);
