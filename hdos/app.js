"use strict";
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pct = x => x == null ? "–" : x < 1 ? "<1%" : Math.round(x) + "%";
  const slow = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const I = {
    slides: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="13" height="14" rx="2"/><path d="M19 7v10"/></svg>',
    answer: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
    tests: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3M8 3h8"/></svg>',
    probs: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    plus: '<svg class="plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-11"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  };
  let CASES = [], cur = null, busy = false;

  fetch("cases.json", { cache: "no-store" }).then(r => r.json()).then(d => { CASES = d.cases || []; home(); })
    .catch(() => { $("#cases").innerHTML = '<p class="hint">The cases could not be loaded.</p>'; });

  function home() {
    cur = null; busy = false;
    $("#thread").innerHTML = ""; $("#hero").hidden = false; $("#new").hidden = true;
    $("#cases").innerHTML = CASES.map((c, i) => `<button class="case" type="button" role="listitem" data-i="${i}">
      <span class="w">${esc(c.who)}</span><span class="t">${esc(c.title)}</span></button>`).join("");
    document.querySelectorAll(".case").forEach(b => b.addEventListener("click", () => open(Number(b.dataset.i))));
    window.scrollTo({ top: 0 });
  }
  $("#home").addEventListener("click", home);
  $("#new").addEventListener("click", home);

  function open(i) {
    cur = { c: CASES[i], k: 0 };
    $("#hero").hidden = true; $("#new").hidden = false;
    show(0);
  }

  function show(k) {
    if (busy) return;
    busy = true;
    const t = cur.c.turns[k];
    document.querySelectorAll(".turn").forEach(x => x.classList.add("past"));
    const el = document.createElement("article");
    el.className = "turn";
    el.innerHTML = `<h2 class="q${t.result ? " result" : ""}">${esc(t.heading)}</h2>
      <div class="status" role="status"><div class="stage on"><span class="b"></span>Reading the findings</div>
      <div class="stage"><span class="b"></span>Weighing every condition</div><div class="stage"><span class="b"></span>Choosing the next tests</div></div>`;
    $("#thread").appendChild(el);
    el.scrollIntoView({ behavior: slow ? "smooth" : "auto", block: "start" });
    const st = [...el.querySelectorAll(".stage")];
    const marks = slow ? [350, 800] : [0, 0];
    setTimeout(() => { st[0].className = "stage ok"; st[1].className = "stage on"; }, marks[0]);
    setTimeout(() => { st[1].className = "stage ok"; st[2].className = "stage on"; }, marks[1]);
    setTimeout(() => { render(el, t, k); busy = false; }, slow ? 1300 : 0);
  }

  function render(el, t, k) {
    const meta = [`Step ${t.step}`].concat(t.done ? ["work-up complete"] : []);
    let h = `<h2 class="q${t.result ? " result" : ""}">${esc(t.heading)}</h2><div class="meta">${meta.map(esc).join('<span class="dot"></span>')}</div>`;
    if (t.slides.length) {
      h += `<section class="sec" aria-label="Breakdown"><div class="sech">${I.slides}Breakdown<span class="nav">
        <button type="button" aria-label="Previous card" data-d="-1">${I.left}</button><button type="button" aria-label="Next card" data-d="1">${I.right}</button></span></div>
        <div class="slides" role="list">${t.slides.map(s => `<div class="slide ${esc(s.kind)}" role="listitem"><span class="lab">${esc(s.label)}</span>
        <h3>${esc(s.title)}</h3>${s.lines.map(l => `<p>${esc(l)}</p>`).join("")}</div>`).join("")}</div></section>`;
    }
    h += `<section class="sec answer"><div class="sech">${I.answer}Answer</div>${t.answer.split(/\n+/).map(p => `<p>${esc(p)}</p>`).join("")}`;
    if (t.open.length) h += `<ul class="open" aria-label="Still open">${t.open.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
    if (t.sources.length) h += `<div class="chips" aria-label="References">${t.sources.map(s => `<a class="chip" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><b>${s.who === "WHO" ? "WHO" : "REF"}</b>${esc(s.label)}</a>`).join("")}</div>`;
    h += `</section>`;
    if (t.tests.length) {
      h += `<section class="sec"><div class="sech">${I.tests}${t.done ? "Optional follow-up" : "Next tests"}</div><ul class="rel">${t.tests.map((x, i) => `
        <li><button type="button" class="rowb" aria-expanded="false" aria-controls="p${k}-${i}"><span><span class="t">${esc(x.name)}</span>${x.best && !t.done ? '<span class="tag best">Best next</span>' : ""}${x.picked ? '<span class="tag taken">Taken here</span>' : ""}${x.since ? `<span class="tag since">from step ${esc(x.since)}</span>` : ""}
          ${x.checks.length ? `<span class="c">Checks ${esc(x.checks.join(", "))}</span>` : ""}</span>${I.plus}</button>
          <div class="panel" id="p${k}-${i}" hidden><dl>${x.expect ? `<dt>Would mean</dt><dd>${esc(x.expect)}</dd>` : ""}${x.why ? `<dt>Why now</dt><dd>${esc(x.why)}</dd>` : ""}</dl>
          ${x.picked ? `<div class="form">${x.fields.map(f => `<div class="fv">${esc(f.label)}<span class="v">${esc(f.value)}<span class="u">${esc(f.unit)}</span></span></div>`).join("")}</div>
            <button type="button" class="btn go">Add the result</button>`
          : `<p class="hint">${t.done ? "Not needed to finish this work-up." : "Not part of this recorded case; the one taken here is marked."}</p>`}</div></li>`).join("")}</ul></section>`;
    }
    h += `<section class="sec"><div class="sech">${I.probs}Probabilities</div>`;
    if (t.confirmed.length) h += `<div class="conf">${t.confirmed.map(c => `<div class="cf">${I.check}<span class="n">${esc(c.name)}</span><span class="h">${esc(c.how)}</span></div>`).join("")}</div>`;
    const row = c => `<div class="pr"><span class="n">${esc(c.name)}${c.cant_miss ? " ⚠" : ""}</span><span class="track" aria-hidden="true"><span class="fill" data-w="${Math.max(1, Math.min(100, Math.round(c.p)))}"></span></span><span class="pct">${pct(c.p)}</span></div>`;
    h += t.likely.slice(0, 6).map(row).join("");
    if (t.likely.length > 6) h += `<details class="more"><summary>${t.likely.length - 6} more possibilities</summary>${t.likely.slice(6).map(row).join("")}</details>`;
    if (t.out.length) h += `<details class="more"><summary>Set aside or ruled out (${t.out.length})</summary><ul>${t.out.map(o => `<li><b>${esc(o.name)}</b>: ${esc(o.state)}${o.why ? " — " + esc(o.why) : ""}</li>`).join("")}</ul></details>`;
    h += `<p class="hint gap">Likelihood of each condition after this step. Confirmed conditions meet published criteria. ⚠ can't miss.</p></section>`;
    const last = k === cur.c.turns.length - 1;
    if (last) h += `<div class="end"><p class="hint">${t.done ? "Every abnormal reading is explained." : "End of this recorded case."}</p><button type="button" class="btn again">Try another patient</button></div>`;
    el.innerHTML = h;
    el.querySelectorAll(".fill").forEach(f => { f.style.width = f.dataset.w + "%"; });  // no inline styles (CSP)
    wire(el, k);
  }

  function wire(el, k) {
    const deck = $(".slides", el);
    el.querySelectorAll(".nav button").forEach(b => b.addEventListener("click", () => deck.scrollBy({ left: Number(b.dataset.d) * 284, behavior: slow ? "smooth" : "auto" })));
    el.querySelectorAll(".rel > li").forEach(li => {
      const b = $(".rowb", li), p = $(".panel", li);
      b.addEventListener("click", () => {
        const opened = b.getAttribute("aria-expanded") === "true";
        el.querySelectorAll(".rowb").forEach(x => { x.setAttribute("aria-expanded", "false"); $(".panel", x.parentElement).hidden = true; });
        b.setAttribute("aria-expanded", String(!opened)); p.hidden = opened;
      });
      const go = $(".go", li);
      if (go) go.addEventListener("click", () => {
        if (el.classList.contains("past") || busy || k + 1 >= cur.c.turns.length) return;
        go.disabled = true; show(k + 1);
      });
    });
    const again = $(".again", el);
    if (again) again.addEventListener("click", home);
    if (k === 0) {  // the recorded test opens itself the first time, so the next move is obvious
      const li = [...el.querySelectorAll(".rel > li")].find(x => $(".go", x));
      if (li && !matchMedia("(max-width:600px)").matches) $(".rowb", li).click();
    }
  }
})();
