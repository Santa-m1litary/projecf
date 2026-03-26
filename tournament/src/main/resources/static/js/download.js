/* ===========================
   download.js — ArenaFlow
   =========================== */

let selectedFile = null;

function toast(msg, ok = true) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = ok ? '#00e5ff' : '#e05555';
    t.style.color = ok ? 'black' : 'white';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
}

// ── Ініціалізація ──
const me = JSON.parse(sessionStorage.getItem('af_me') || 'null');

if (!me) {
    document.getElementById('noSession').classList.remove('hidden');
} else {
    document.getElementById('uploadPanel').classList.remove('hidden');

    // Заповнити картку юзера
    document.getElementById('userAvatar').textContent = me.name[0].toUpperCase();
    document.getElementById('userName').textContent   = me.name;
    const badge = document.getElementById('userBadge');
    badge.textContent = me.role;
    badge.className   = 'badge badge-' + me.role;

    // Завантажити команду юзера
    loadUserTeam();
    loadSubmissions();
}

async function loadUserTeam() {
    try {
        const res   = await fetch('/api/teams');
        const teams = await res.json();
        // Знайти команду де є цей юзер (по коду або імені)
        const myTeam = teams.find(t =>
            t.members.includes(me.name) ||
            t.members.some(m => m === me.name)
        );
        if (myTeam) {
            document.getElementById('userTeamName').textContent = myTeam.name;
        } else {
            document.getElementById('userTeamName').textContent = 'Не в команді';
            document.getElementById('userTeamName').style.color = 'rgba(255,255,255,.3)';
        }
    } catch(e) {}
}

// ── DRAG & DROP ──
function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('dropZone').classList.add('dragover');
}
function handleDragLeave(e) {
    document.getElementById('dropZone').classList.remove('dragover');
}
function handleDrop(e) {
    e.preventDefault();
    document.getElementById('dropZone').classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) setFile(file);
}
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) setFile(file);
}

function setFile(file) {
    selectedFile = file;

    // Визначити іконку по типу файлу
    const ext = file.name.split('.').pop().toLowerCase();
    const icons = {
        pdf: '📄', zip: '🗜', rar: '🗜', docx: '📝', doc: '📝',
        png: '🖼', jpg: '🖼', jpeg: '🖼', mp4: '🎬', pptx: '📊', xlsx: '📊'
    };
    const icon = icons[ext] || '📁';

    document.getElementById('fileIcon').textContent = icon;
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatSize(file.size);
    document.getElementById('filePreview').classList.remove('hidden');
    document.getElementById('dropZone').style.display = 'none';
    document.getElementById('uploadBtn').disabled = false;
}

function removeFile() {
    selectedFile = null;
    document.getElementById('filePreview').classList.add('hidden');
    document.getElementById('dropZone').style.display = '';
    document.getElementById('uploadBtn').disabled = true;
    document.getElementById('fileInput').value = '';
}

function formatSize(bytes) {
    if (bytes < 1024)       return bytes + ' Б';
    if (bytes < 1048576)    return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / 1048576).toFixed(1) + ' МБ';
}

// ── UPLOAD ──
async function uploadFile() {
    if (!selectedFile) return;

    const comment = document.getElementById('uploadComment').value.trim();
    const btn     = document.getElementById('uploadBtn');

    btn.textContent = '⏳ Завантаження…';
    btn.disabled    = true;

    // Показати прогрес
    const progressHtml = `
        <div class="progress-wrap" id="progressWrap">
            <div class="progress-fill" id="progressFill" style="width:0%"></div>
        </div>`;
    btn.insertAdjacentHTML('afterend', progressHtml);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('uploaderName', me.name);
    formData.append('uploaderCode', me.code || '');
    formData.append('comment', comment);

    try {
        // Симулюємо прогрес поки чекаємо відповідь
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress = Math.min(progress + Math.random() * 15, 90);
            const fill = document.getElementById('progressFill');
            if (fill) fill.style.width = progress + '%';
        }, 200);

        const res = await fetch('/api/uploads', {
            method: 'POST',
            body: formData
        });

        clearInterval(progressInterval);
        const fill = document.getElementById('progressFill');
        if (fill) fill.style.width = '100%';

        if (!res.ok) {
            toast(await res.text(), false);
            resetUploadBtn();
            return;
        }

        setTimeout(() => {
            document.getElementById('progressWrap')?.remove();
            removeFile();
            document.getElementById('uploadComment').value = '';
            resetUploadBtn();
            loadSubmissions();
            toast('✅ Роботу успішно завантажено!');
        }, 500);

    } catch(e) {
        toast('❌ Помилка при завантаженні', false);
        resetUploadBtn();
    }
}

function resetUploadBtn() {
    const btn = document.getElementById('uploadBtn');
    btn.textContent = '📤 Завантажити';
    btn.disabled    = !selectedFile;
    document.getElementById('progressWrap')?.remove();
}

// ── SUBMISSIONS ──
async function loadSubmissions() {
    const list = document.getElementById('submissionsList');
    list.innerHTML = '<div class="s-loading"><div class="spinner"></div><p>Завантаження…</p></div>';

    try {
        const url = me ? `/api/uploads?uploaderName=${encodeURIComponent(me.name)}` : '/api/uploads';
        const res  = await fetch(url);
        const data = await res.json();
        renderSubmissions(data);
    } catch(e) {
        list.innerHTML = '<div class="s-empty"><div class="s-empty-icon">⚠️</div><div class="s-empty-title">Помилка завантаження</div></div>';
    }
}

function renderSubmissions(data) {
    const list = document.getElementById('submissionsList');

    if (!data || data.length === 0) {
        list.innerHTML = `
            <div class="s-empty">
                <div class="s-empty-icon">📂</div>
                <div class="s-empty-title">Робіт ще немає</div>
                <div class="s-empty-hint">Завантажте першу роботу вище</div>
            </div>`;
        return;
    }

    const statusLabel = {
        pending:  '⏳ На перевірці',
        approved: '✅ Прийнято',
        rejected: '❌ Відхилено'
    };

    const ext2icon = name => {
        const e = (name || '').split('.').pop().toLowerCase();
        const m = { pdf:'📄', zip:'🗜', rar:'🗜', docx:'📝', doc:'📝', png:'🖼', jpg:'🖼', jpeg:'🖼', mp4:'🎬', pptx:'📊', xlsx:'📊' };
        return m[e] || '📁';
    };

    list.innerHTML = data.map((s, i) => `
        <div class="s-row" style="animation-delay:${i*0.05}s">
            <div class="s-icon">${ext2icon(s.fileName)}</div>
            <div class="s-info">
                <div class="s-name">${s.fileName || 'Файл'}</div>
                <div class="s-meta">${s.uploaderName} · ${formatDate(s.uploadedAt)}${s.fileSize ? ' · ' + formatSize(s.fileSize) : ''}</div>
                ${s.comment ? `<div class="s-comment">"${s.comment}"</div>` : ''}
            </div>
            <div class="s-status status-${s.status || 'pending'}">
                ${statusLabel[s.status] || '⏳ На перевірці'}
            </div>
        </div>`).join('');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('uk-UA', { day:'2-digit', month:'2-digit', year:'numeric' })
         + ' ' + d.toLocaleTimeString('uk-UA', { hour:'2-digit', minute:'2-digit' });
}
