/* ===========================
   roli.js — реєстрація через сервер
   ArenaFlow
   =========================== */

const PERMS = {
    'Адміністратор': ['👥 Створювати та видаляти команди','🎭 Змінювати ролі будь-кому','🏆 Керувати рейтингом','🗂 Створювати турніри','⚙️ Повний доступ до системи'],
    'Учасник':       ['👥 Вступити до команди за кодом','📂 Завантажити проєкт','📊 Переглядати свій рейтинг'],
    'Журі':          ['⚖️ Оцінювати роботи команд','🏆 Виставляти бали','📊 Переглядати всі результати'],
    'Організатор':   ['🗂 Створювати турніри','👥 Додавати команди за кодом','👁 Переглядати всіх учасників','📊 Моніторинг подій']
};

const RULES = {
    minLength: 3,
    maxLength: 24,
    pattern: /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ'\- ]+$/,
    patternHint: 'Тільки літери (латиниця або кирилиця), пробіл, дефіс'
};

/* ── VALIDATION ── */
function validateName(value) {
    if (value.length < RULES.minLength)
        return `Мінімум ${RULES.minLength} символи`;
    if (value.length > RULES.maxLength)
        return `Максимум ${RULES.maxLength} символів`;
    if (!RULES.pattern.test(value))
        return RULES.patternHint;
    return null;
}

function setFieldError(inputId, hintId, msg) {
    const input = document.getElementById(inputId);
    const hint  = document.getElementById(hintId);
    if (msg) {
        input.classList.add('input-error');
        hint.textContent = msg;
        hint.classList.add('visible');
    } else {
        input.classList.remove('input-error');
        hint.textContent = '';
        hint.classList.remove('visible');
    }
}

// Live-validation при введенні
document.getElementById('username').addEventListener('input', function () {
    const err = validateName(this.value.trim());
    setFieldError('username', 'nameHint', err);
    updateCounter('username', 'nameCounter');
});

function updateCounter(inputId, counterId) {
    const val = document.getElementById(inputId).value;
    const el  = document.getElementById(counterId);
    el.textContent = val.length + ' / ' + RULES.maxLength;
    el.style.color = val.length > RULES.maxLength ? '#ff6060' : 'rgba(255,255,255,0.3)';
}

/* ── ROLE SELECTION ── */
document.querySelectorAll('.role-option').forEach(el => {
    el.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('roleHint').classList.remove('visible');
    });
});

/* ── TOAST ── */
function toast(msg, ok = true) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = ok ? '#00e5ff' : '#e05555';
    t.style.color = ok ? 'black' : 'white';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
}

/* ── REGISTER ── */
async function register() {
    const name   = document.getElementById('username').value.trim();
    const roleEl = document.querySelector('.role-option.selected');

    const nameErr = validateName(name);
    setFieldError('username', 'nameHint', nameErr);

    if (!roleEl) {
        const rh = document.getElementById('roleHint');
        rh.textContent = 'Оберіть роль';
        rh.classList.add('visible');
    }

    if (nameErr || !roleEl) return;

    const role = roleEl.dataset.role;
    const res  = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role })
    });

    if (!res.ok) { toast(await res.text(), false); return; }

    const user = await res.json();
    sessionStorage.setItem('af_me', JSON.stringify(user));
    showProfile(user);
    toast('✅ Ласкаво просимо, ' + user.name + '!');
}

function showProfile(user) {
    document.getElementById('regForm').classList.add('hidden');
    document.getElementById('avatarLetter').textContent = user.name[0].toUpperCase();
    document.getElementById('profileName').textContent  = user.name;
    const badge = document.getElementById('profileBadge');
    badge.textContent = user.role;
    badge.className   = 'badge badge-' + user.role;
    document.getElementById('profileCode').textContent = user.code;
    const perms = document.getElementById('permsList');
    perms.innerHTML = (PERMS[user.role] || []).map(p =>
        `<div class="perm-item">${p}</div>`).join('');
    document.getElementById('profileCard').classList.remove('hidden');
    if (user.role === 'Адміністратор') {
        document.getElementById('adminPanel').classList.remove('hidden');
        loadAdminTable();
    }
}

function copyCode(id) {
    const val = document.getElementById(id).textContent;
    navigator.clipboard.writeText(val).then(() => toast('📋 Скопійовано: ' + val));
}

function logout() {
    sessionStorage.removeItem('af_me');
    document.getElementById('profileCard').classList.add('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('regForm').classList.remove('hidden');
    document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
    document.getElementById('username').value = '';
    setFieldError('username', 'nameHint', null);
    document.getElementById('nameCounter').textContent = '0 / ' + RULES.maxLength;
    toast('👋 Вийшли з системи');
}

async function loadAdminTable() {
    const res   = await fetch('/api/users');
    const users = await res.json();
    const tbody = document.getElementById('usersTableBody');
    document.getElementById('noUsers').classList.toggle('hidden', users.length > 0);
    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${u.name}</td>
            <td><span class="badge badge-${u.role}" style="padding:2px 8px;font-size:11px">${u.role}</span></td>
            <td style="font-family:monospace;color:#00e5ff;font-size:13px">${u.code}</td>
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

// Відновити сесію
const me = JSON.parse(sessionStorage.getItem('af_me') || 'null');
if (me) showProfile(me);
