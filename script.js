(function () {
  const W = window.WEDDING;
  const $ = (s) => document.querySelector(s);
  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), W);

  // ---------- fill text ----------
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const v = get(el.dataset.bind);
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll("[data-mono]").forEach((el) => {
    el.textContent = W.monogram[+el.dataset.mono];
  });

  // ---------- schedule ----------
  const schedule = $("#schedule");
  W.schedule.forEach(([time, what]) => {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = time;
    dd.textContent = what;
    schedule.append(dt, dd);
  });

  // ---------- logo / hero photo (shown only once the files exist) ----------
  const probe = new Image();
  probe.onload = () => {
    document.querySelectorAll(".logo").forEach((el) => { el.hidden = false; });
    $(".moon .monogram").hidden = true;
    $(".footer .monogram").hidden = true;
  };
  probe.src = $(".logo").getAttribute("src");

  const hero = new Image();
  hero.onload = () => {
    const el = $("#heroPhoto");
    el.style.backgroundImage = `url("${hero.src}")`;
    el.classList.add("loaded");
    el.parentElement.classList.add("has-photo");
  };
  hero.src = "assets/hero.jpg";

  // ---------- music ----------
  const audio = $("#music");
  const musicBtn = $("#musicBtn");
  let hasMusic = false;
  audio.addEventListener("loadedmetadata", () => { hasMusic = true; });
  const setPlaying = (on) => musicBtn.classList.toggle("playing", on);
  const play = () => audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  musicBtn.addEventListener("click", () => {
    if (audio.paused) play();
    else { audio.pause(); setPlaying(false); }
  });

  // ---------- cover ----------
  $("#open").addEventListener("click", () => {
    $("#cover").classList.add("opened");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    if (hasMusic) { musicBtn.hidden = false; play(); }
    setTimeout(() => ($("#cover").hidden = true), 1100);
  });

  // ---------- reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ---------- venue / calendar ----------
  $("#mapBtn").href = W.venue.mapsUrl;

  const toUtc = (time) => new Date(`${W.date}T${time}:00+07:00`);
  const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = stamp(toUtc(W.startTime));
  const end = stamp(toUtc(W.endTime));
  const title = `งานมงคลสมรส ${W.groom.th} & ${W.bride.th}`;
  const where = `${W.venue.name} ${W.venue.room}`;

  $("#gcalLink").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}&dates=${start}/${end}` +
    `&location=${encodeURIComponent(where)}&details=${encodeURIComponent(location.href.split("?")[0])}`;

  $("#icsLink").addEventListener("click", (e) => {
    e.preventDefault();
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//wedding//card//TH",
      "BEGIN:VEVENT",
      `UID:${start}-wedding@card`, `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${start}`, `DTEND:${end}`,
      `SUMMARY:${title}`, `LOCATION:${where}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    a.download = "wedding.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  const calBtn = $("#calBtn");
  calBtn.addEventListener("click", () => {
    const menu = $("#calMenu");
    menu.hidden = !menu.hidden;
    calBtn.setAttribute("aria-expanded", String(!menu.hidden));
  });

  // ---------- RSVP ----------
  const form = $("#rsvpForm");
  const err = $("#rsvpError");
  const deadline = new Date(`${W.rsvpDeadline}T23:59:59+07:00`);
  const thaiDate = deadline.toLocaleDateString("th-TH", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Bangkok",
  });

  if (Date.now() > deadline) {
    form.hidden = true;
    $("#rsvpHint").hidden = true;
    $("#rsvpClosed").hidden = false;
  } else {
    $("#rsvpHint").textContent = `กรุณาตอบกลับภายในวันที่ ${thaiDate}`;
  }

  const guests = form.elements.guests;
  for (let i = 1; i <= W.maxGuests; i++) guests.add(new Option(`${i} ท่าน`, i));

  form.addEventListener("change", (e) => {
    if (e.target.name === "attending") {
      $("#guestsField").hidden = e.target.value !== "yes";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";
    const name = form.elements.name.value.trim();
    const attending = form.elements.attending.value;
    if (!name) { err.textContent = "กรุณากรอกชื่อ"; form.elements.name.focus(); return; }
    if (!attending) { err.textContent = "กรุณาเลือกว่าจะมาร่วมงานหรือไม่"; return; }

    const gf = W.googleForm;
    if (!gf.formId) {
      err.textContent = "ระบบตอบรับยังไม่เปิดใช้งาน (ยังไม่ได้ตั้งค่า Google Form)";
      return;
    }

    const yes = attending === "yes";
    const data = new URLSearchParams();
    data.append(gf.fields.name, name);
    data.append(gf.fields.attending, yes ? gf.attendingYes : gf.attendingNo);
    data.append(gf.fields.guests, yes ? guests.value : "0");
    data.append(gf.fields.message, form.elements.message.value.trim());

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "กำลังส่ง…";
    try {
      // Google Forms doesn't allow CORS reads; no-cors still delivers the response.
      await fetch(`https://docs.google.com/forms/d/e/${gf.formId}/formResponse`, {
        method: "POST", mode: "no-cors", body: data,
      });
      form.hidden = true;
      $("#rsvpHint").hidden = true;
      $("#thanksMsg").textContent = yes
        ? `เราได้รับคำตอบของคุณ ${name} แล้ว แล้วพบกันในวันงาน`
        : `ขอบคุณ ${name} สำหรับคำอวยพร`;
      $("#rsvpThanks").hidden = false;
    } catch {
      err.innerHTML = `ส่งไม่สำเร็จ กรุณาลองอีกครั้ง หรือ <a href="https://docs.google.com/forms/d/e/${gf.formId}/viewform" target="_blank" rel="noopener">ตอบผ่าน Google Form</a>`;
      btn.disabled = false;
      btn.textContent = "ส่งคำตอบ";
    }
  });
})();
