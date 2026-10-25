(function () {
	const SAVE_KEY = 'fitness-cards:done';
	const ORDER_KEY = 'fitness-cards:order';

	const grid = document.getElementById('grid');
	const filtersEl = document.getElementById('filters');
	const modal = document.getElementById('modal');
	const flip = document.getElementById('flip');
	const faceFront = document.getElementById('face-front');
	const faceBack = document.getElementById('face-back');
	const doneBtn = document.getElementById('done-btn');

	let done = new Set();
	let order = CARDS.map(c => c.id);
	let filter = 'all';
	let openId = null;

	// Storage can throw (private windows, blocked cookies); the app works without it.
	function load() {
		try { done = new Set(JSON.parse(localStorage.getItem(SAVE_KEY)) || []); } catch (e) {}
		try {
			const saved = JSON.parse(localStorage.getItem(ORDER_KEY));
			if (Array.isArray(saved) && saved.length === CARDS.length && CARDS.every(c => saved.includes(c.id))) order = saved;
		} catch (e) {}
	}
	function save() {
		try { localStorage.setItem(SAVE_KEY, JSON.stringify([...done])); } catch (e) {}
		try { localStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch (e) {}
	}

	const byId = id => CARDS.find(c => c.id === id);
	const pad = n => String(n).padStart(3, '0');
	const visible = () => order.map(byId).filter(c => filter === 'all' || c.cat === filter);
	const esc = s => s.replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
	const svg = c => `<svg viewBox="0 0 100 100" aria-hidden="true">${GLYPHS[c.glyph]}</svg>`;
	const colorOf = c => CATEGORIES[c.cat].color;

	function renderFilters() {
		const items = [['all', 'All', null], ...Object.entries(CATEGORIES).map(([k, v]) => [k, v.label, v.color])];
		filtersEl.innerHTML = items.map(([k, label, color]) =>
			`<button class="chip" data-filter="${k}" aria-pressed="${k === filter}" style="${color ? `--chip:${color}` : ''}">${label}</button>`
		).join('');
	}

	function renderGrid() {
		grid.innerHTML = visible().map(c => `
			<button class="card${done.has(c.id) ? ' done' : ''}" data-id="${c.id}" style="--c:${colorOf(c)}" aria-label="Card ${c.id}: ${esc(c.title)}">
				<span class="kicker">Cards for<br>Fitness:</span>
				<span class="num">${pad(c.id)}</span>
				<h2>${esc(c.title)}</h2>
				${svg(c)}
				<span class="done-tag" aria-hidden="true">&#10003;</span>
			</button>`).join('');
		const total = CARDS.length;
		document.getElementById('progress-text').textContent = `${done.size} of ${total} done`;
		document.getElementById('meter-fill').style.width = `${(done.size / total) * 100}%`;
	}

	function openCard(id, keepFace) {
		const c = byId(id);
		openId = id;
		const style = `--c:${colorOf(c)}`;
		faceFront.setAttribute('style', style);
		faceBack.setAttribute('style', style);
		faceFront.innerHTML = `
			<span class="kicker">Cards for Fitness:</span><span class="num">${pad(c.id)}</span>
			<h2>${esc(c.title)}</h2>${svg(c)}<span class="hint">Tap to flip</span>`;
		faceBack.innerHTML = `
			<span class="kicker">${CATEGORIES[c.cat].label}</span><span class="num">${pad(c.id)}</span>
			<h2 style="font-size:22px;margin-bottom:14px">${esc(c.title)}</h2>
			<h3>Why it works</h3><p>${esc(c.tip)}</p>
			<div class="try"><h3>Try it today</h3><p>${esc(c.action)}</p></div>`;
		if (!keepFace) flip.classList.remove('flipped');
		updateDoneBtn();
		modal.hidden = false;
		document.body.style.overflow = 'hidden';
		doneBtn.focus({ preventScroll: true });
	}

	function updateDoneBtn() {
		doneBtn.textContent = done.has(openId) ? 'Mark not done' : 'Mark done';
	}

	function closeModal() {
		modal.hidden = true;
		document.body.style.overflow = '';
		const el = grid.querySelector(`[data-id="${openId}"]`);
		openId = null;
		if (el) el.focus({ preventScroll: true });
	}

	function step(dir) {
		const list = visible();
		if (!list.length) return;
		const i = list.findIndex(c => c.id === openId);
		openCard(list[(i + dir + list.length) % list.length].id);
	}

	function draw() {
		const list = visible();
		if (!list.length) return;
		const todo = list.filter(c => !done.has(c.id));
		const pool = todo.length ? todo : list;
		openCard(pool[Math.floor(Math.random() * pool.length)].id);
	}

	// Same card for everyone on a given day, so "Today's card" is stable between visits.
	function today() {
		const d = new Date();
		const days = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
		return CARDS[days % CARDS.length].id;
	}

	function shuffle() {
		for (let i = order.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[order[i], order[j]] = [order[j], order[i]];
		}
		save();
		renderGrid();
	}

	function toggleDone() {
		if (done.has(openId)) done.delete(openId); else done.add(openId);
		save();
		renderGrid();
		updateDoneBtn();
	}

	grid.addEventListener('click', e => {
		const el = e.target.closest('.card');
		if (el) openCard(Number(el.dataset.id));
	});
	filtersEl.addEventListener('click', e => {
		const el = e.target.closest('.chip');
		if (!el) return;
		filter = el.dataset.filter;
		renderFilters();
		renderGrid();
	});
	modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
	flip.addEventListener('click', () => flip.classList.toggle('flipped'));
	document.getElementById('flip-btn').addEventListener('click', () => flip.classList.toggle('flipped'));
	document.getElementById('prev').addEventListener('click', () => step(-1));
	document.getElementById('next').addEventListener('click', () => step(1));
	doneBtn.addEventListener('click', toggleDone);
	document.getElementById('draw').addEventListener('click', draw);
	document.getElementById('today').addEventListener('click', () => openCard(today()));
	document.getElementById('shuffle').addEventListener('click', shuffle);
	document.addEventListener('keydown', e => {
		if (modal.hidden) return;
		if (e.key === 'Escape') closeModal();
		else if (e.key === 'ArrowLeft') step(-1);
		else if (e.key === 'ArrowRight') step(1);
		else if (e.key === ' ' && e.target === document.body) { e.preventDefault(); flip.classList.toggle('flipped'); }
	});

	load();
	renderFilters();
	renderGrid();
})();
