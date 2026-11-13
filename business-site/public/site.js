/* Shared by every page of butterbitedigital.com. */
  // On a branch preview (<branch>-butterbite-site.<sub>.workers.dev), open that branch's demos preview,
  // so unmerged designs show; the live site keeps the live demo links.
  (function () {
    var m = location.hostname.match(/^(.+)-butterbite-site\.(.+\.workers\.dev)$/);
    if (m) document.querySelectorAll(".example").forEach(function (ex) {
      ex.href = ex.href.replace("demos.butterbite.workers.dev", m[1] + "-demos." + m[2]);
    });
  })();

  // Contact form: send to /api/contact (worker.ts), which emails us. Nothing is stored.
  (function () {
    var form = document.getElementById("contact-form"); if (!form) return;
    var started = Date.now(), err = form.querySelector(".form-error"), btn = form.querySelector("button[type=submit]");
    var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var f = form.elements, bad = null;
      [["name", f.name.value.trim().length >= 2], ["practice", f.practice.value.trim().length >= 2], ["email", emailOk(f.email.value.trim())]].forEach(function (c) {
        f[c[0]].setAttribute("aria-invalid", c[1] ? "false" : "true"); if (!c[1] && !bad) bad = f[c[0]];
      });
      if (bad) { err.textContent = form.dataset.error; err.hidden = false; bad.focus(); return; }
      err.hidden = true; btn.disabled = true; btn.textContent = "Sending…";
      try {
        var res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
          name: f.name.value, practice: f.practice.value, email: f.email.value, phone: f.phone.value, note: f.note.value, source: form.dataset.source, company: f.company.value, startedAt: started }) });
        if (!res.ok) throw new Error(res.status);
        form.hidden = true; var done = document.getElementById("contact-sent"); done.hidden = false; done.focus();
      } catch (x) {
        err.innerHTML = "Sorry, that didn’t send. Please email us at <a href=\"mailto:hello@butterbitedigital.com\">hello@butterbitedigital.com</a>.";
        err.hidden = false; btn.disabled = false; btn.textContent = form.dataset.label;
      }
    });
  })();

  // Scroll animations: cards fade up and the "automatic" flows play once when they come into view.
  (function () {
    var els = document.querySelectorAll("[data-reveal],[data-flow]"); if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-on"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-on"); io.unobserve(e.target); } });
    }, { threshold: 0.2, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  })();
