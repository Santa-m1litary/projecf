/* ===========================
   tournaments.js — через сервер
   ArenaFlow
   =========================== */

function toast(msg, ok = true) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = ok ? '#00e5ff' : '#e05555';
    t.style.color = ok ? 'black' : 'white';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
}

const me = JSON.parse(sessionStorage.getItem('af_me') || 'null');
const allowed = me && (me.role === 'Адміністратор' || me.role === 'Організатор');

if (allowed) {
    document.getElementById('noAccess').classList.add('hidden');
    document.getElementById('tournamentPanel').classList.remove('hidden');
    const badge = document.getElementById('myRoleBadge');
    badge.textContent = me.role;
    badge.className   = 'badge badge-' + me.role;
    loadTournaments();
}

document.getElementById('tournamentName')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') createTournament();
});

async function createTournament() {
    const input = document.getElementById('tournamentName');
    const name  = input.value.trim();
    if (!name) return;

    const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, createdBy: me.name })
    });
    if (!res.ok) { toast(await res.text(), false); return; }
    input.value = '';
    loadTournaments();
    toast('🏟 Турнір "' + name + '" створено!');
}

async function loadTournaments() {
    const res  = await fetch('/api/tournaments');
    const list = await res.json();
    renderTournaments(list);
}

function renderTournaments(list) {
    const container = document.getElementById('tournamentsList');

    if (list.length === 0) {
        container.innerHTML = '<div style="text-align:center;opacity:0.4;padding:30px;font-size:14px">Турнірів ще немає ☝️</div>';
        return;
    }

    container.innerHTML = list.map(t => `
        <div class="t-card">
            <div class="t-header">
                <div>
                    <div class="t-name">🏟 ${t.name}</div>
                    <div class="t-meta">Створив: ${t.createdBy} · ${t.teams.length} команд</div>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                    <span class="t-status status-${t.status}">${t.status === 'active' ? '🟢 Активний' : '⚫ Завершено'}</span>
                    <div class="t-actions">
                        <button class="btn-icon" onclick="toggleStatus('${t.id}')">${t.status === 'active' ? '⏹' : '▶️'}</button>
                        <button class="btn-icon danger" onclick="deleteTournament('${t.id}')">✖</button>
                    </div>
                </div>
            </div>
            <div class="t-body">
                <div class="add-team-row">
                    <input id="tcode-${t.id}" placeholder="Код команди (TEAM-НАЗВ-123)...">
                    <button class="btn-add-team" onclick="addTeam('${t.id}')">+ Додати команду</button>
                </div>
                <div class="t-teams">
                    ${t.teams.length === 0
                        ? '<div class="no-teams-hint">Команд ще немає</div>'
                        : t.teams.map(tm => `
                            <div class="t-team-chip">
                                👥 ${tm.name}
                                <span style="opacity:0.4;font-size:11px">${tm.members?.length || 0} уч.</span>
                                <button onclick="removeTeam('${t.id}','${tm.id}')" title="Видалити">✖</button>
                            </div>`).join('')}
                </div>
            </div>
        </div>`).join('');
}

async function addTeam(tournamentId) {
    const input    = document.getElementById('tcode-' + tournamentId);
    const teamCode = input.value.trim().toUpperCase();
    if (!teamCode) return;

    const res = await fetch(`/api/tournaments/${tournamentId}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCode })
    });
    if (!res.ok) { toast(await res.text(), false); return; }
    input.value = '';
    loadTournaments();
    toast('✅ Команду додано!');
}

async function removeTeam(tournamentId, teamId) {
    await fetch(`/api/tournaments/${tournamentId}/teams/${teamId}`, { method: 'DELETE' });
    loadTournaments();
    toast('🗑 Команду видалено', false);
}

async function toggleStatus(id) {
    await fetch(`/api/tournaments/${id}/status`, { method: 'PUT' });
    loadTournaments();
}

async function deleteTournament(id) {
    if (!confirm('Видалити турнір?')) return;
    await fetch(`/api/tournaments/${id}`, { method: 'DELETE' });
    loadTournaments();
    toast('🗑 Турнір видалено', false);
}
