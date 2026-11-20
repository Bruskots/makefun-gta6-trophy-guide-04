// Leonida Trophy Guide — tracker: loads the trophy data, renders the cards,
// saves progress in localStorage, and filters by kind, grade, search and
// spoiler mode. Deep-links work through the hash: #trophy=28, #kind=missable,
// #view=roadmap, #spoiler=1.
import { renderRoadmap } from './roadmap.js';

const KEY = 'leonida-guide-progress-v1';
const $ = (id) => document.getElementById(id);
const cardsEl = $('cards');
const emptyEl = $('empty');

const state = {
  earned: new Set(),
  kind: 'all',
  grade: 'all',
  query: '',
  spoiler: false,
  earnedOnly: false,
  view: 'tracker',
  focusId: null,
};

let doc = null;

function loadSaved() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (raw && Array.isArray(raw.earned)) state.earned = new Set(raw.earned);
    if (raw && typeof raw.spoiler === 'boolean') state.spoiler = raw.spoiler;
  } catch {
    state.earned = new Set();
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify({ earned: [...state.earned], spoiler: state.spoiler }));
}

function gradeLabel(grade) {
  return grade[0].toUpperCase() + grade.slice(1);
}

function kindLabel(kind) {
  return { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' }[kind] ?? kind;
}

function countLabel(trophy) {
  if (trophy.count == null) return null;
  return trophy.count >= 1000 ? `$${trophy.count.toLocaleString('en-US')}` : `× ${trophy.count}`;
}

function sourceLinks(trophy) {
  const wrap = document.createElement('p');
  wrap.className = 'sources';
  wrap.textContent = 'Sources: ';
  const names = trophy.sources ?? [];
  names.forEach((key, i) => {
    const info = doc.sources[key];
    if (!info) return;
    if (i > 0) wrap.append(document.createTextNode(' · '));
    if (info.url) {
      const a = document.createElement('a');
      a.href = info.url;
      a.textContent = info.name;
      a.target = '_blank';
      a.rel = 'noopener';
      wrap.append(a);
    } else {
      wrap.append(document.createTextNode(info.name));
    }
  });
  return wrap;
}

function trophyCard(trophy) {
  const earned = state.earned.has(trophy.id);
  const hidden = state.spoiler && trophy.kind === 'story' && !earned;
  const card = document.createElement('article');
  card.className = 'card' + (earned ? ' earned' : '') + (trophy.missable ? ' missable' : '');
  card.id = `trophy-${trophy.id}`;

  const top = document.createElement('div');
  top.className = 'card-top';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'tick';
  box.checked = earned;
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) state.earned.add(trophy.id);
    else state.earned.delete(trophy.id);
    save();
    render();
  });
  const title = document.createElement('h3');
  if (hidden) {
    const span = document.createElement('span');
    span.className = 'spoiled';
    span.textContent = 'Hidden story trophy — earn it to reveal';
    title.append(span);
  } else {
    title.textContent = trophy.name;
  }
  top.append(box, title);
  card.append(top);

  if (!hidden) {
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = trophy.description;
    card.append(desc);
  }

  const meta = document.createElement('p');
  meta.className = 'meta';
  const grade = document.createElement('span');
  grade.className = `pill ${trophy.grade}`;
  grade.textContent = gradeLabel(trophy.grade);
  meta.append(grade);
  const kind = document.createElement('span');
  kind.className = 'pill';
  kind.textContent = kindLabel(trophy.kind);
  meta.append(kind);
  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'pill missable';
    flag.textContent = 'Missable';
    meta.append(flag);
  }
  const count = countLabel(trophy);
  if (count) {
    const chip = document.createElement('span');
    chip.className = 'pill count';
    chip.textContent = count;
    meta.append(chip);
  }
  card.append(meta);

  if (!hidden) {
    const guide = document.createElement('p');
    guide.className = 'guide';
    guide.textContent = trophy.guide;
    card.append(guide);
    if (trophy.steps && trophy.steps.length) {
      const list = document.createElement('ol');
      list.className = 'steps';
      for (const step of trophy.steps) {
        const li = document.createElement('li');
        li.textContent = step;
        list.append(li);
      }
      card.append(list);
    }
    card.append(sourceLinks(trophy));
  } else {
    const note = document.createElement('p');
    note.className = 'guide';
    note.textContent = 'Spoiler-free mode hides this story trophy until you earn it. Untick the mode above, or tick the box, to see its guide.';
    card.append(note);
  }
  return card;
}

function visibleTrophies() {
  const q = state.query.trim().toLowerCase();
  return doc.trophies.filter((t) => {
    if (state.kind !== 'all' && t.kind !== state.kind) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.earnedOnly && !state.earned.has(t.id)) return false;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderProgress() {
  const total = doc.trophies.length;
  const done = state.earned.size;
  $('progress-text').textContent = `${done} of ${total} earned`;
  const byGrade = (grade) => doc.trophies.filter((t) => t.grade === grade && state.earned.has(t.id)).length;
  const totals = (grade) => doc.trophies.filter((t) => t.grade === grade).length;
  $('progress-detail').textContent =
    `Platinum ${byGrade('platinum')}/${totals('platinum')} · Gold ${byGrade('gold')}/${totals('gold')} · Silver ${byGrade('silver')}/${totals('silver')} · Bronze ${byGrade('bronze')}/${totals('bronze')}`;
  $('progress-fill').style.width = `${Math.round((done / total) * 100)}%`;
}

function render() {
  renderProgress();
  const list = visibleTrophies();
  cardsEl.replaceChildren(...list.map(trophyCard));
  emptyEl.hidden = list.length > 0;
  if (state.focusId) {
    const el = document.getElementById(`trophy-${state.focusId}`);
    if (el) el.scrollIntoView({ block: 'start' });
  }
}

function renderSources() {
  const ul = $('source-list');
  for (const info of Object.values(doc.sources)) {
    const li = document.createElement('li');
    if (info.url) {
      const a = document.createElement('a');
      a.href = info.url;
      a.textContent = info.name;
      a.target = '_blank';
      a.rel = 'noopener';
      li.append(a);
    } else {
      li.textContent = info.name;
    }
    ul.append(li);
  }
}

function showView(view) {
  state.view = view;
  $('view-tracker').hidden = view !== 'tracker';
  $('view-roadmap').hidden = view !== 'roadmap';
  $('tab-tracker').classList.toggle('active', view === 'tracker');
  $('tab-roadmap').classList.toggle('active', view === 'roadmap');
  $('tab-tracker').removeAttribute('aria-current');
  if (view === 'tracker') $('tab-tracker').setAttribute('aria-current', 'page');
  else $('tab-roadmap').setAttribute('aria-current', 'page');
}

function readHash() {
  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get('view') === 'roadmap') state.view = 'roadmap';
  if (hash.get('kind')) state.kind = hash.get('kind');
  if (hash.get('grade')) state.grade = hash.get('grade');
  if (hash.get('spoiler') === '1') state.spoiler = true;
  const trophy = Number.parseInt(hash.get('trophy') ?? '', 10);
  if (Number.isInteger(trophy) && trophy >= 1 && trophy <= 55) {
    state.focusId = trophy;
    state.kind = 'all';
    state.grade = 'all';
    state.query = '';
  }
}

function syncControls() {
  $('kind').value = state.kind;
  $('grade').value = state.grade;
  $('spoiler').checked = state.spoiler;
  $('earned-only').checked = state.earnedOnly;
  $('search').value = state.query;
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ earned: [...state.earned].sort((a, b) => a - b), exported: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importProgress(file) {
  const raw = JSON.parse(await file.text());
  const ids = Array.isArray(raw) ? raw : raw.earned;
  if (!Array.isArray(ids)) throw new Error('not a progress file');
  state.earned = new Set(ids.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55));
  save();
  render();
}

$('search').addEventListener('input', (e) => { state.query = e.target.value; render(); });
$('kind').addEventListener('change', (e) => { state.kind = e.target.value; state.focusId = null; render(); });
$('grade').addEventListener('change', (e) => { state.grade = e.target.value; render(); });
$('spoiler').addEventListener('change', (e) => { state.spoiler = e.target.checked; save(); render(); });
$('earned-only').addEventListener('change', (e) => { state.earnedOnly = e.target.checked; render(); });
$('export').addEventListener('click', exportProgress);
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try { await importProgress(file); } catch { alert('That file is not a progress export from this guide.'); }
  e.target.value = '';
});
$('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies?')) return;
  state.earned.clear();
  save();
  render();
});
$('tab-tracker').addEventListener('click', () => showView('tracker'));
$('tab-roadmap').addEventListener('click', () => showView('roadmap'));
window.addEventListener('hashchange', () => {
  state.focusId = null;
  readHash();
  syncControls();
  showView(state.view);
  render();
});

doc = await (await fetch('data/trophies.json')).json();
loadSaved();
readHash();
syncControls();
renderSources();
renderRoadmap($('roadmap'), doc);
showView(state.view);
render();
