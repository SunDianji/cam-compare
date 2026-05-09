(function () {
  'use strict';

  const AXIS_MAX = 330;
  const HEAT_MIN = 5;
  const HEAT_MAX = 200;
  const HEAT_STEP = 1;

  const data  = window.CAM_DATA   || [];
  const types = window.CRACK_TYPES || [];

  // Assign stable ids
  data.forEach(c => (c.id = `${c.brand}|${c.size}`));

  const BRAND_ORDER = ['BD C4','BD Z4','DMM Dragon','DMM Dragonfly','WC Friend','WC Zero','Metolius','Totem','Alien'];

  // ---------- State ----------
  let crackWidth  = 25;
  let activeBrands = new Set(['all']); // multi-select brands
  let sortByFit   = false;
  let onlyMine    = false;
  let rack        = loadRack(); // { id: count }

  // Pre-fill user's existing cams on first load
  const DEFAULT_RACK = {
    'BD C4|0.5':        1,
    'DMM Dragon|2':     1,  // 0.75 DMM 绿
    'DMM Dragon|3':     1,  // 1 DMM 红
    'Totem|红':         1,  // 1 Totem 红
    'DMM Dragon|4':     2,  // 2 DMM 黄 × 2
    'DMM Dragon|5':     1,  // 3 DMM 蓝
    'DMM Dragon|6':     1,  // 4 DMM 灰
    'BD C4|6':          1,  // 6 BD 绿
  };
  if (Object.keys(rack).length === 0) {
    rack = { ...DEFAULT_RACK };
    saveRack();
  }

  function loadRack() {
    try { return JSON.parse(localStorage.getItem('cam_rack') || '{}'); }
    catch { return {}; }
  }
  function saveRack() {
    localStorage.setItem('cam_rack', JSON.stringify(rack));
  }
  function owned(id) { return (rack[id] || 0) > 0; }

  // ---------- DOM ----------
  const slider       = document.getElementById('crackSlider');
  const input        = document.getElementById('crackInput');
  const valueLabel   = document.getElementById('crackValue');
  const matchCount   = document.getElementById('matchCount');
  const barsBox      = document.getElementById('barsContainer');
  const crackLine    = document.getElementById('crackLine');
  const tableBody    = document.getElementById('tableBody');
  const brandChips   = document.querySelectorAll('[data-brand]');
  const typeName     = document.getElementById('crackTypeName');
  const typeEn       = document.getElementById('crackTypeEn');
  const typeDesc     = document.getElementById('crackTypeDesc');
  const typeSpectrum = document.getElementById('typeSpectrum');
  const matchCards   = document.getElementById('matchCards');
  const noMatch      = document.getElementById('noMatch');
  const matchSub     = document.getElementById('matchSubtitle');
  const sortChk      = document.getElementById('sortByFit');
  // Rack DOM
  const rackEditor   = document.getElementById('rackEditor');
  const rackTotal    = document.getElementById('rackTotal');
  const rackCoverMin = document.getElementById('rackCoverMin');
  const rackCoverMax = document.getElementById('rackCoverMax');
  const rackGaps     = document.getElementById('rackGaps');
  const heatBar      = document.getElementById('heatBar');
  const clearRackBtn = document.getElementById('clearRack');
  const onlyMineBtn  = document.getElementById('applyOnlyMine');
  const onlyMineChk  = document.getElementById('onlyMineChk');
  const recoBox      = document.getElementById('recoBox');

  // ---------- Crack type lookup ----------
  function getCrackType(mm) {
    for (const t of types) if (mm >= t.min && mm < t.max) return t;
    return types[types.length - 1];
  }

  // ---------- Spectrum ----------
  function renderSpectrum() {
    typeSpectrum.innerHTML = '';
    types.forEach(t => {
      if (t.min >= AXIS_MAX) return;
      const left  = (t.min / AXIS_MAX) * 100;
      const width = ((Math.min(t.max, AXIS_MAX) - t.min) / AXIS_MAX) * 100;
      const seg = document.createElement('div');
      seg.className = 'absolute top-0 h-full flex items-center justify-center text-[10px] text-white font-medium';
      seg.style.left = left + '%';
      seg.style.width = width + '%';
      seg.style.background = t.color;
      seg.title = `${t.name} · ${t.en} · ${t.min}–${t.max} mm`;
      if (width > 6) seg.textContent = t.name;
      typeSpectrum.appendChild(seg);
    });
  }

  // ---------- Bars ----------
  function renderBars() {
    const groups = {};
    data.forEach(c => (groups[c.brand] = groups[c.brand] || []).push(c));
    Object.values(groups).forEach(arr => arr.sort((a, b) => a.min - b.min));

    const rows = [];
    BRAND_ORDER.forEach(b => groups[b] && groups[b].forEach(c => rows.push(c)));

    barsBox.innerHTML = '';
    rows.forEach(cam => {
      const leftPct  = (cam.min / AXIS_MAX) * 100;
      const widthPct = ((cam.max - cam.min) / AXIS_MAX) * 100;
      const isOwned = owned(cam.id);
      const qty = rack[cam.id] || 0;

      const row = document.createElement('div');
      row.className = 'flex items-center py-1.5';
      row.dataset.brand = cam.brand;
      row.dataset.id = cam.id;
      row.dataset.min = cam.min;
      row.dataset.max = cam.max;

      const barStyle = isOwned
        ? `left:${leftPct}%; width:${widthPct}%; background:${cam.colorHex};`
        : `left:${leftPct}%; width:${widthPct}%; background:${cam.colorHex}22; border:1.5px dashed ${cam.colorHex}; opacity:0.7;`;
      const textColor = isOwned ? 'text-white/95' : '';
      const textStyle = isOwned ? '' : `color:${cam.colorHex};`;

      row.innerHTML = `
        <div class="w-40 md:w-52 pr-3 shrink-0 flex items-center gap-2 text-xs">
          <span class="text-slate-500 truncate">${cam.brand}</span>
          <span class="num font-medium text-brand-900">${cam.size}</span>
          ${isOwned ? `<span class="ml-auto num text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">×${qty}</span>` : ''}
        </div>
        <div class="relative flex-1 h-7 axis-line rounded">
          <div class="bar absolute top-1/2 -translate-y-1/2 h-5 rounded-md flex items-center px-2"
               style="${barStyle}"
               title="${cam.brand} ${cam.size} · ${cam.min}–${cam.max} mm${isOwned ? ' (已拥有)' : ''}">
            <span class="num text-[10px] ${textColor} font-medium whitespace-nowrap drop-shadow-sm" style="${textStyle}">
              ${cam.min}–${cam.max}
            </span>
          </div>
        </div>
      `;
      barsBox.appendChild(row);
    });
  }

  // ---------- Table ----------
  function renderTable() {
    tableBody.innerHTML = '';
    data
      .slice()
      .sort((a, b) => {
        const bi = BRAND_ORDER.indexOf(a.brand) - BRAND_ORDER.indexOf(b.brand);
        return bi !== 0 ? bi : a.min - b.min;
      })
      .forEach(cam => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-brand-50 transition-colors';
        tr.dataset.brand = cam.brand;
        tr.dataset.id = cam.id;
        tr.dataset.min = cam.min;
        tr.dataset.max = cam.max;
        const t = getCrackType((cam.min + cam.max) / 2);
        const qty = rack[cam.id] || 0;
        tr.innerHTML = `
          <td class="px-4 py-2.5 text-slate-700">
            ${cam.brand}
            ${qty > 0 ? `<span class="num ml-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">×${qty}</span>` : ''}
          </td>
          <td class="px-4 py-2.5 num font-medium text-brand-900">${cam.size}</td>
          <td class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5">
              <span class="inline-block w-3 h-3 rounded-full border border-slate-200" style="background:${cam.colorHex}"></span>
              <span class="text-xs text-slate-600">${cam.colorName}</span>
            </span>
          </td>
          <td class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style="background:${t.color}22; color:${t.color};">${t.name}</span>
          </td>
          <td class="px-4 py-2.5 num text-right text-slate-700">${cam.min}</td>
          <td class="px-4 py-2.5 num text-right text-slate-700">${cam.max}</td>
          <td class="px-4 py-2.5 num text-right text-slate-500">${(cam.max - cam.min).toFixed(1)}</td>
        `;
        tableBody.appendChild(tr);
      });
  }

  // ---------- Rack editor ----------
  function renderRackEditor() {
    rackEditor.innerHTML = '';
    const groups = {};
    data.forEach(c => (groups[c.brand] = groups[c.brand] || []).push(c));

    BRAND_ORDER.forEach(brand => {
      if (!groups[brand]) return;
      const section = document.createElement('div');
      section.className = 'py-3 border-t border-slate-100 first:border-t-0';
      const list = groups[brand].slice().sort((a, b) => a.min - b.min);

      section.innerHTML = `
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">${brand}</div>
        <div class="flex flex-wrap gap-1.5">
          ${list.map(cam => {
            const qty = rack[cam.id] || 0;
            const active = qty > 0;
            return `
              <div class="inline-flex items-center gap-0.5 rounded-lg overflow-hidden border ${active ? 'border-accent-500 bg-accent-500/10' : 'border-slate-200 bg-white'}">
                <button data-id="${cam.id}" data-delta="-1" class="rack-btn px-2 py-1 text-slate-400 hover:text-red-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" ${qty === 0 ? 'disabled' : ''}>−</button>
                <span class="px-2 py-1 flex items-center gap-1.5">
                  <span class="inline-block w-2.5 h-2.5 rounded-full border border-white/60" style="background:${cam.colorHex}"></span>
                  <span class="num text-xs font-medium text-brand-900">${cam.size}</span>
                  <span class="num text-[10px] ${active ? 'text-accent-600 font-semibold' : 'text-slate-400'}">${qty > 0 ? '×' + qty : ''}</span>
                </span>
                <button data-id="${cam.id}" data-delta="1" class="rack-btn px-2 py-1 text-slate-400 hover:text-emerald-600 cursor-pointer">+</button>
              </div>
            `;
          }).join('')}
        </div>
      `;
      rackEditor.appendChild(section);
    });

    rackEditor.querySelectorAll('.rack-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const delta = parseInt(btn.dataset.delta, 10);
        rack[id] = Math.max(0, (rack[id] || 0) + delta);
        if (rack[id] === 0) delete rack[id];
        saveRack();
        refreshAll();
      });
    });
  }

  // ---------- Coverage & heat bar ----------
  function buildCoverage() {
    // mm -> count
    const cov = [];
    for (let mm = HEAT_MIN; mm <= HEAT_MAX; mm += HEAT_STEP) {
      let count = 0;
      for (const c of data) {
        const qty = rack[c.id] || 0;
        if (qty === 0) continue;
        if (mm >= c.min && mm <= c.max) count += qty;
      }
      cov.push({ mm, count });
    }
    return cov;
  }

  function renderHeatBar() {
    const cov = buildCoverage();
    heatBar.innerHTML = '';

    let segments = [];
    let cur = { mm: cov[0].mm, count: cov[0].count, start: 0 };
    cov.forEach((pt, i) => {
      if (pt.count !== cur.count) {
        segments.push({ ...cur, end: i });
        cur = { mm: pt.mm, count: pt.count, start: i };
      }
    });
    segments.push({ ...cur, end: cov.length });

    segments.forEach(s => {
      const width = ((s.end - s.start) / cov.length) * 100;
      let bg = '#EF4444'; // gap
      if (s.count === 1) bg = '#86EFAC';
      else if (s.count >= 2) bg = '#16A34A';
      const mmStart = HEAT_MIN + s.start * HEAT_STEP;
      const mmEnd   = HEAT_MIN + s.end * HEAT_STEP - 1;
      const seg = document.createElement('div');
      seg.className = 'h-full relative group';
      seg.style.width = width + '%';
      seg.style.background = bg;
      seg.title = `${mmStart}–${mmEnd} mm · ${s.count === 0 ? '缺口' : s.count === 1 ? '单份' : s.count + ' 份'}`;
      heatBar.appendChild(seg);
    });

    // Stats
    const ownedCams = data.filter(c => (rack[c.id] || 0) > 0);
    rackTotal.textContent = ownedCams.reduce((a, c) => a + (rack[c.id] || 0), 0);
    if (ownedCams.length > 0) {
      rackCoverMin.textContent = Math.min(...ownedCams.map(c => c.min)).toFixed(1);
      rackCoverMax.textContent = Math.max(...ownedCams.map(c => c.max)).toFixed(1);
    } else {
      rackCoverMin.textContent = '—';
      rackCoverMax.textContent = '—';
    }
    const gapCount = segments.filter(s => s.count === 0 && s.end - s.start >= 3).length;
    rackGaps.textContent = gapCount;
  }

  // ---------- Recommendations ----------
  function buildRecommendations() {
    recoBox.innerHTML = '';
    const cov = buildCoverage();
    const ownedIds = new Set(Object.keys(rack));

    // Find gap segments (count === 0)
    const gapSegs = [];
    let gapStart = null;
    cov.forEach((pt, i) => {
      if (pt.count === 0 && gapStart === null) gapStart = i;
      if (pt.count > 0 && gapStart !== null) {
        gapSegs.push({ from: HEAT_MIN + gapStart, to: HEAT_MIN + i - 1 });
        gapStart = null;
      }
    });
    if (gapStart !== null) gapSegs.push({ from: HEAT_MIN + gapStart, to: HEAT_MAX });

    // Also find single-coverage segments for Tier 2 (want 2x for hand cracks 30-60)
    const singleSegs = [];
    let singleStart = null;
    cov.forEach((pt, i) => {
      if (pt.count === 1 && singleStart === null) singleStart = i;
      if (pt.count !== 1 && singleStart !== null) {
        singleSegs.push({ from: HEAT_MIN + singleStart, to: HEAT_MIN + i - 1 });
        singleStart = null;
      }
    });
    if (singleStart !== null) singleSegs.push({ from: HEAT_MIN + singleStart, to: HEAT_MAX });

    // Tier 1: smallest gap + largest gap (highest priority)
    const tier1 = new Set();
    gapSegs.forEach(g => {
      if (g.to - g.from < 3) return; // ignore tiny gaps
      const candidates = data
        .filter(c => !ownedIds.has(c.id))
        .map(c => {
          const overlap = Math.max(0, Math.min(c.max, g.to) - Math.max(c.min, g.from));
          return { cam: c, overlap, gap: g };
        })
        .filter(x => x.overlap > 0)
        .sort((a, b) => b.overlap - a.overlap);
      candidates.slice(0, 2).forEach(x => tier1.add(x.cam.id));
    });

    // Tier 2: double-up for hand crack (30-60 mm) if only single coverage
    const tier2 = new Set();
    const handSingles = singleSegs.filter(s => s.from >= 25 && s.to <= 70);
    handSingles.forEach(g => {
      const candidates = data
        .filter(c => !ownedIds.has(c.id) && !tier1.has(c.id))
        .map(c => {
          const overlap = Math.max(0, Math.min(c.max, g.to) - Math.max(c.min, g.from));
          return { cam: c, overlap };
        })
        .filter(x => x.overlap > 0)
        .sort((a, b) => b.overlap - a.overlap);
      candidates.slice(0, 1).forEach(x => tier2.add(x.cam.id));
    });

    // Tier 3: specialty — Totem small, BD C4 #5 extra if already have one, etc.
    const tier3 = new Set();

    const tiers = [
      { name: 'Tier 1 · 必补', subtitle: '填补当前最大缺口,优先级最高', color: '#EF4444', ids: tier1 },
      { name: 'Tier 2 · 建议', subtitle: '把只有单份的关键段位(手缝)升级为双份', color: '#F59E0B', ids: tier2 },
      { name: 'Tier 3 · 可选', subtitle: '针对特定线路类型的进阶补充', color: '#6366F1', ids: tier3 },
    ];

    let anyReco = false;
    tiers.forEach(tier => {
      if (tier.ids.size === 0) return;
      anyReco = true;
      const block = document.createElement('div');
      block.className = 'bg-white rounded-2xl border border-slate-200 p-5';
      const camList = [...tier.ids].map(id => data.find(c => c.id === id)).filter(Boolean);
      block.innerHTML = `
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-block w-2 h-2 rounded-full" style="background:${tier.color}"></span>
          <span class="font-semibold" style="color:${tier.color}">${tier.name}</span>
          <span class="text-xs text-slate-500">· ${tier.subtitle}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${camList.map(c => {
            const t = getCrackType((c.min + c.max) / 2);
            return `
              <div class="border border-slate-200 rounded-xl p-3 hover:border-accent-500 transition-colors">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-slate-500">${c.brand}</span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style="background:${t.color}22; color:${t.color};">${t.name}</span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="num text-xl font-bold text-brand-900">${c.size}</span>
                  <span class="inline-flex items-center gap-1 text-xs text-slate-500">
                    <span class="inline-block w-2.5 h-2.5 rounded-full border border-slate-200" style="background:${c.colorHex}"></span>
                    ${c.colorName}
                  </span>
                </div>
                <div class="num text-xs text-slate-600 mt-1">${c.min}–${c.max} mm</div>
                <button data-id="${c.id}" class="add-to-rack mt-2 w-full px-2 py-1.5 rounded-md bg-brand-800 text-white text-xs font-medium hover:bg-brand-900 cursor-pointer">
                  + 加入装备栏
                </button>
              </div>
            `;
          }).join('')}
        </div>
      `;
      recoBox.appendChild(block);
    });

    if (!anyReco) {
      recoBox.innerHTML = `
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <div class="text-emerald-700 font-semibold mb-1">装备很全面</div>
          <div class="text-sm text-emerald-600">5–200 mm 范围内无明显缺口,可以出发了</div>
        </div>
      `;
    }

    recoBox.querySelectorAll('.add-to-rack').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        rack[id] = (rack[id] || 0) + 1;
        saveRack();
        refreshAll();
      });
    });
  }

  // ---------- Match cards ----------
  function renderMatches() {
    let matches = data.filter(c => {
      const brandOK = activeBrands.has('all') || activeBrands.has(c.brand);
      const fitOK   = crackWidth >= c.min && crackWidth <= c.max;
      const mineOK  = !onlyMine || owned(c.id);
      return brandOK && fitOK && mineOK;
    });

    matches.forEach(c => {
      const center = (c.min + c.max) / 2;
      const span   = c.max - c.min;
      c._fit = 1 - Math.abs(crackWidth - center) / (span / 2);
    });

    if (sortByFit) {
      matches.sort((a, b) => b._fit - a._fit);
    } else {
      matches.sort((a, b) => {
        const bi = BRAND_ORDER.indexOf(a.brand) - BRAND_ORDER.indexOf(b.brand);
        return bi !== 0 ? bi : a.min - b.min;
      });
    }

    matchCards.innerHTML = '';
    if (matches.length === 0) {
      noMatch.classList.remove('hidden');
      matchCards.classList.add('hidden');
    } else {
      noMatch.classList.add('hidden');
      matchCards.classList.remove('hidden');
    }

    matches.forEach(c => {
      const fitPct = Math.max(0, Math.min(100, c._fit * 100)).toFixed(0);
      const fitLabel = c._fit > 0.7 ? '理想' : c._fit > 0.35 ? '可用' : '临界';
      const fitColor = c._fit > 0.7 ? '#10B981' : c._fit > 0.35 ? '#F59E0B' : '#EF4444';
      const crackPct = ((crackWidth - c.min) / (c.max - c.min)) * 100;
      const qty = rack[c.id] || 0;
      const isMine = qty > 0;

      const card = document.createElement('div');
      card.className = `rounded-xl border p-4 transition-all cursor-default ${isMine ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-500' : 'bg-white border-slate-200 border-dashed hover:border-accent-500'}`;
      card.innerHTML = `
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs text-slate-500">${c.brand}</span>
              ${isMine ? `<span class="num text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-semibold">我有 ×${qty}</span>` : ''}
            </div>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="num text-xl font-bold text-brand-900">${c.size}</span>
              <span class="inline-flex items-center gap-1 text-xs text-slate-500">
                <span class="inline-block w-2.5 h-2.5 rounded-full border border-slate-200" style="background:${c.colorHex}"></span>
                ${c.colorName}
              </span>
            </div>
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style="background:${fitColor}22; color:${fitColor};">${fitLabel}</span>
        </div>
        <div class="num text-xs text-slate-600 mt-2">范围 <span class="font-medium text-brand-900">${c.min}–${c.max}</span> mm</div>
        <div class="relative mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="absolute top-0 h-full rounded-full" style="left:0; width:100%; background:${c.colorHex}33;"></div>
          <div class="absolute top-0 h-full" style="left:${crackPct}%; width:2px; background:${fitColor};"></div>
        </div>
        <div class="mt-2 text-[11px] text-slate-500">
          缝宽 <span class="num font-medium text-brand-900">${crackWidth}mm</span>
          · 贴合度 <span class="num font-medium" style="color:${fitColor}">${fitPct}%</span>
        </div>
      `;
      matchCards.appendChild(card);
    });

    matchCount.textContent = matches.length;
    const brandLabel = activeBrands.has('all') ? '' : ` · 仅 ${[...activeBrands].join('/')}`;
    matchSub.textContent = matches.length > 0
      ? `当前 ${crackWidth}mm 能塞进的机械塞 · ${matches.length} 个${brandLabel}${onlyMine ? ' · 仅我拥有' : ''}`
      : '当前缝宽下能塞进的机械塞';
  }

  // ---------- Crack type ----------
  function updateCrackType() {
    const t = getCrackType(crackWidth);
    typeName.textContent = t.name;
    typeName.style.color = t.color;
    typeEn.textContent   = t.en;
    typeDesc.textContent = t.desc;
  }

  // ---------- Bars highlight ----------
  function applyBarsHighlight() {
    const pct = Math.max(0, Math.min(100, (crackWidth / AXIS_MAX) * 100));
    crackLine.style.left = pct + '%';

    barsBox.querySelectorAll('[data-brand]').forEach(row => {
      const brand = row.dataset.brand;
      const id    = row.dataset.id;
      const min = parseFloat(row.dataset.min);
      const max = parseFloat(row.dataset.max);
      const bar = row.querySelector('.bar');
      const brandOK = activeBrands.has('all') || activeBrands.has(brand);
      const fitOK   = crackWidth >= min && crackWidth <= max;
      const mineOK  = !onlyMine || owned(id);
      const show = brandOK && mineOK;
      row.style.display = show ? '' : 'none';
      if (!show) return;
      bar.classList.toggle('match', fitOK);
      bar.classList.toggle('dim', !fitOK);
    });

    tableBody.querySelectorAll('tr').forEach(tr => {
      const brand = tr.dataset.brand;
      const id    = tr.dataset.id;
      const min = parseFloat(tr.dataset.min);
      const max = parseFloat(tr.dataset.max);
      const brandOK = activeBrands.has('all') || activeBrands.has(brand);
      const fitOK   = crackWidth >= min && crackWidth <= max;
      const mineOK  = !onlyMine || owned(id);
      const show = brandOK && mineOK;
      tr.style.display = show ? '' : 'none';
      tr.classList.toggle('bg-amber-50', show && fitOK);
    });
  }

  function refreshAll() {
    renderBars();
    renderTable();
    renderRackEditor();
    renderHeatBar();
    buildRecommendations();
    updateCrackType();
    applyBarsHighlight();
    renderMatches();
  }

  // ---------- Inputs ----------
  function setCrack(v) {
    let n = parseFloat(v);
    if (Number.isNaN(n)) n = 0;
    n = Math.max(5, Math.min(330, n));
    crackWidth = n;
    slider.value = n;
    input.value  = n;
    valueLabel.textContent = n;
    updateCrackType();
    applyBarsHighlight();
    renderMatches();
  }

  slider.addEventListener('input', e => setCrack(e.target.value));
  input .addEventListener('input', e => setCrack(e.target.value));
  sortChk.addEventListener('change', e => { sortByFit = e.target.checked; renderMatches(); });

  brandChips.forEach(btn => {
    btn.addEventListener('click', () => {
      const brand = btn.dataset.brand;

      if (brand === 'all') {
        // "全部" 按钮：切换全选/取消全选
        if (activeBrands.has('all')) {
          activeBrands.clear();
          activeBrands.add('all');
        } else {
          activeBrands.clear();
          activeBrands.add('all');
        }
      } else {
        // 其他品牌：多选逻辑
        if (activeBrands.has('all')) {
          activeBrands.delete('all');
        }

        if (activeBrands.has(brand)) {
          activeBrands.delete(brand);
          // 如果删除后没有选中任何品牌，恢复为"全部"
          if (activeBrands.size === 0) {
            activeBrands.add('all');
          }
        } else {
          activeBrands.add(brand);
        }
      }

      // 更新按钮样式
      brandChips.forEach(b => {
        const bBrand = b.dataset.brand;
        const isActive = activeBrands.has(bBrand) || (bBrand !== 'all' && activeBrands.has('all'));

        if (isActive) {
          b.classList.add('active', 'bg-brand-800', 'text-white');
          b.classList.remove('bg-white', 'border', 'border-slate-200', 'text-slate-700');
        } else {
          b.classList.remove('active', 'bg-brand-800', 'text-white');
          b.classList.add('bg-white', 'border', 'border-slate-200', 'text-slate-700');
        }
      });

      applyBarsHighlight();
      renderMatches();
    });
  });

  clearRackBtn.addEventListener('click', () => {
    if (!confirm('清空所有装备？')) return;
    rack = {};
    saveRack();
    refreshAll();
  });

  onlyMineBtn.addEventListener('click', () => {
    onlyMine = !onlyMine;
    onlyMineChk.checked = onlyMine;
    applyBarsHighlight();
    renderMatches();
  });

  // Init
  renderSpectrum();
  refreshAll();
  setCrack(25);
})();
