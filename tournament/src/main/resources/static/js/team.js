/* ===========================
   team.js — команди через сервер
   ArenaFlow
   =========================== */

const TEAM_RULES = {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ'\- 0-9]+$/,
    patternHint: 'Тільки літери, цифри, пробіл або дефіс'
};

function validateTeamName(value) {
    if (value.length < TEAM_RULES.minLength)
        return `Мінімум ${TEAM_RULES.minLength} символи`;
    if (value.length > TEAM_RULES.maxLength)
        return `Максимум ${TEAM_RULES.maxLength} символів`;
    if (!TEAM_RULES.pattern.test(value))
        return TEAM_RULES.patternHint;
    return null;
}

function setTeamFieldError(msg) {
    const input = document.getElementById('teamInput');
    const hint  = document.getElementById('teamHint');
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

document.getElementById('teamInput').addEventListener('input', function () {
    const err = validateTeamName(this.value.trim());
    setTeamFieldError(this.value.trim().length > 0 ? err : null);
    const counter = document.getElementById('teamCounter');
    counter.textContent = this.value.length + ' / ' + TEAM_RULES.maxLength;
    counter.style.color = this.value.length > TEAM_RULES.maxLength ? '#ff6060' : 'rgba(255,255,255,0.4)';
});

document.getElementById('teamInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTeam();
});

function toast(msg, ok = true) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = ok ? '#00e5ff' : '#e05555';
    t.style.color = ok ? 'black' : 'white';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
}

async function addTeam() {
    const input = document.getElementById('teamInput');
    const name  = input.value.trim();

    const err = validateTeamName(name);
    setTeamFieldError(err);
    if (err) return;

    const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    if (!res.ok) { toast(await res.text(), false); return; }

    input.value = '';
    setTeamFieldError(null);
    document.getElementById('teamCounter').textContent = '0 / ' + TEAM_RULES.maxLength;
    loadTeams();
    toast('✅ Команду створено!');
}

function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => toast('📋 Скопійовано: ' + code));
}

async function loadTeams() {
    const res   = await fetch('/api/teams');
    const teams = await res.json();
    const container = document.getElementById('teamsContainer');
    container.innerHTML = '';

    if (teams.length === 0) {
        container.innerHTML = '<div class="no-teams">Поки немає команд. Створіть першу! 👆</div>';
        return;
    }

    teams.forEach(team => {
        const card = document.createElement('div');
        card.className = 'teamCard';
        card.id = 'team-' + team.id;

        card.innerHTML = `
            <div class="teamHeader">
                <div>
                    <div class="team-title">👥 ${team.name}</div>
                    <div class="member-count">${team.members.length} учасн.</div>
                </div>
                <button class="menuBtn" onclick="toggleMenu('${team.id}', event)">⋮</button>
            </div>
            <div class="menu" id="menu-${team.id}">
                <button onclick="addMemberPrompt('${team.id}')">➕ Додати вручну</button>
                <button onclick="addByCodePrompt('${team.id}')">🔑 Додати за кодом</button>
                <button class="danger" onclick="deleteTeam('${team.id}')">🗑 Видалити команду</button>
            </div>
            <ul class="members">
                ${team.members.length === 0
                    ? '<li class="empty-team">Учасників ще немає</li>'
                    : team.members.map((m, i) => `
                        <li class="memberItem show">
                            <span>👤 ${m}</span>
                            <button class="deleteMember" onclick="removeMember('${team.id}',${i})">✖</button>
                        </li>`).join('')}
            </ul>
            <div class="team-code-block">
                <span class="team-code-label">Код команди:</span>
                <span class="team-code-value">${team.code}</span>
                <button class="btn-copy-team" onclick="copyCode('${team.code}')">📋</button>
            </div>`;

        container.appendChild(card);
    });
}

function toggleMenu(id, e) {
    e.stopPropagation();
    document.querySelectorAll('.menu').forEach(m => m.style.display = 'none');
    const menu = document.getElementById('menu-' + id);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}
document.addEventListener('click', () => {
    document.querySelectorAll('.menu').forEach(m => m.style.display = 'none');
});

async function addMemberPrompt(teamId) {
    const name = prompt("Імʼя учасника");
    if (!name || !name.trim()) return;
    const res = await fetch(`/api/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
    });
    if (!res.ok) { toast(await res.text(), false); return; }
    loadTeams(); toast('👤 Учасника додано');
}

async function addByCodePrompt(teamId) {
    const code = prompt("Код учасника (наприклад: ОЛЕ-1234)");
    if (!code) return;
    const res = await fetch(`/api/teams/${teamId}/members/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() })
    });
    if (!res.ok) { toast(await res.text(), false); return; }
    loadTeams(); toast('✅ Учасника додано за кодом!');
}

async function removeMember(teamId, index) {
    if (!confirm('Видалити учасника?')) return;
    await fetch(`/api/teams/${teamId}/members/${index}`, { method: 'DELETE' });
    loadTeams(); toast('🗑 Видалено', false);
}

async function deleteTeam(id) {
    if (!confirm('Видалити команду?')) return;
    await fetch(`/api/teams/${id}`, { method: 'DELETE' });
    loadTeams(); toast('🗑 Команду видалено', false);
}

loadTeams();
