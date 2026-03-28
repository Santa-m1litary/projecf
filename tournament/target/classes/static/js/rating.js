/* ===========================
   rating.js — ArenaFlow
   =========================== */

let sortAsc = false;
let currentData = [];

function toast(msg, ok = true) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = ok ? '#00e5ff' : '#e05555';
    t.style.color = ok ? 'black' : 'white';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
}

// Завантажити список турнірів у фільтр
async function loadTournamentFilter() {
    try {
        const res  = await fetch('/api/tournaments');
        const list = await res.json();
        const sel  = document.getElementById('tournamentFilter');
        list.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name + (t.status === 'active' ? ' 🟢' : ' ⚫');
            sel.appendChild(opt);
        });
    } catch(e) {}
}

async function loadRating() {
    const tournamentId = document.getElementById('tournamentFilter').value;
    const table = document.getElementById('ratingTable');

    table.innerHTML = `<div class="r-loading"><div class="spinner"></div><p>Завантаження…</p></div>`;
    document.getElementById('podium').classList.add('hidden');

    try {
        const url = tournamentId
            ? `/api/rating?tournamentId=${tournamentId}`
            : `/api/rating`;
        const res  = await fetch(url);
        const data = await res.json();
        currentData = data;
        renderRating(data);

        document.getElementById('lastUpdated').textContent =
            'Оновлено: ' + new Date().toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'});
    } catch(e) {
        table.innerHTML = `<div class="r-empty">
            <div class="r-empty-icon">⚠️</div>
            <div class="r-empty-title">Помилка завантаження</div>
            <div class="r-empty-hint">Перевірте підключення до сервера</div>
        </div>`;
    }
}

function renderRating(data) {
    const table  = document.getElementById('ratingTable');
    const podium = document.getElementById('podium');

    if (!data || data.length === 0) {
        table.innerHTML = `<div class="r-empty">
            <div class="r-empty-icon">🏆</div>
            <div class="r-empty-title">Рейтинг порожній</div>
            <div class="r-empty-hint">Додайте команди до турніру та виставте бали</div>
        </div>`;
        podium.classList.add('hidden');
        return;
    }

    const sorted = [...data].sort((a, b) => sortAsc ? a.score - b.score : b.score - a.score);
    const maxScore = sorted[0]?.score || 1;

    // Подіум (топ-3)
    if (sorted.length >= 2) {
        const top = sorted.slice(0, 3);
        // Порядок: 2-1-3 (класичний подіум)
        const order = top.length === 3 ? [top[1], top[0], top[2]] : [top[0], top[1]];
        const places = top.length === 3 ? [2, 1, 3] : [1, 2];

        podium.innerHTML = order.map((team, i) => `
            <div class="podium-item place-${places[i]}">
                <div class="podium-avatar">${team.name[0].toUpperCase()}</div>
                <div class="podium-name">${team.name}</div>
                <div class="podium-score">${team.score}</div>
                <div class="podium-pts">балів</div>
                <div class="podium-block">${places[i] === 1 ? '🥇' : places[i] === 2 ? '🥈' : '🥉'}</div>
            </div>`).join('');
        podium.classList.remove('hidden');
    } else {
        podium.classList.add('hidden');
    }

    // Таблиця
    table.innerHTML = sorted.map((team, i) => {
        const place = i + 1;
        const placeClass = place === 1 ? 'gold' : place === 2 ? 'silver' : place === 3 ? 'bronze' : '';
        const placeLabel = place === 1 ? '🥇' : place === 2 ? '🥈' : place === 3 ? '🥉' : place;
        const pct = maxScore > 0 ? Math.round((team.score / maxScore) * 100) : 0;

        return `<div class="r-row" style="animation-delay:${i * 0.05}s">
            <div class="r-place ${placeClass}">${placeLabel}</div>
            <div class="r-avatar">${team.name[0].toUpperCase()}</div>
            <div class="r-info">
                <div class="r-name">${team.name}</div>
                <div class="r-members">${team.memberCount || 0} учасників${team.tournamentName ? ' · ' + team.tournamentName : ''}</div>
            </div>
            <div class="r-bar-wrap">
                <div class="r-bar-bg">
                    <div class="r-bar-fill" style="width:${pct}%"></div>
                </div>
            </div>
            <div>
                <div class="r-score">${team.score}</div>
                <div class="r-pts">балів</div>
            </div>
        </div>`;
    }).join('');
}

function toggleSort() {
    sortAsc = !sortAsc;
    document.getElementById('sortIcon').textContent = sortAsc ? '↑' : '↓';
    document.getElementById('sortLabel').textContent = sortAsc ? 'За зростанням' : 'За балами';
    renderRating(currentData);
}

// Ініціалізація
loadTournamentFilter();
loadRating();
