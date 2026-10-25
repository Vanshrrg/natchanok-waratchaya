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
  // each logo replaces the monogram letters next to it once its file loads
  document.querySelectorAll(".logo").forEach((logo) => {
    const probe = new Image();
    probe.onload = () => {
      logo.hidden = false;
      logo.parentElement.querySelector(".monogram").hidden = true;
    };
    probe.src = logo.getAttribute("src");
  });

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
  // each version has its own song; music-sky.mp3 plays at 0.8x speed
  const TRACKS = {
    orange: { src: "assets/music-sky.mp3", rate: 0.8 },
    sky: { src: "assets/music.mp3", rate: 1 },
  };
  const isSky = () => document.documentElement.classList.contains("sky");
  const setTrack = () => {
    const t = TRACKS[isSky() ? "sky" : "orange"];
    if (audio.getAttribute("src") !== t.src) audio.src = t.src;
    audio.defaultPlaybackRate = audio.playbackRate = t.rate; // default: kept when a new src loads
  };
  setTrack();

  // cover monogram: gold for orange, cool blue (green leaves) for the blue version
  const coverLogo = $(".moon .logo");
  const setLogo = () => coverLogo.setAttribute("src", isSky() ? "assets/logo-cool.png" : "assets/logo.png");
  setLogo();
  // show the ♪ toggle only once the file is known to exist
  audio.addEventListener("loadedmetadata", () => { musicBtn.hidden = false; });
  const setPlaying = (on) => musicBtn.classList.toggle("playing", on);
  // every start fades in from silence up to 60% volume. iOS ignores audio.volume,
  // so the fade runs through a Web Audio gain node (needs http(s), not file://)
  const VOLUME = 0.6, FADE_S = 10;
  let ctx, gain, fadeTimer;
  const initGain = () => {
    if (ctx !== undefined) return;
    ctx = null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || location.protocol === "file:") return;
    try {
      const c = new AC();
      const g = c.createGain();
      c.createMediaElementSource(audio).connect(g).connect(c.destination);
      ctx = c; gain = g;
    } catch (e) { /* fall back to audio.volume */ }
  };
  const fadeIn = () => {
    if (gain) {
      ctx.resume();
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(VOLUME, t + FADE_S);
      return;
    }
    clearInterval(fadeTimer);
    const start = performance.now();
    audio.volume = 0;
    fadeTimer = setInterval(() => {
      const k = Math.min(1, (performance.now() - start) / (FADE_S * 1000));
      audio.volume = VOLUME * k;
      if (k === 1) clearInterval(fadeTimer);
    }, 50);
  };
  const play = () => (initGain(), fadeIn(), audio.play())
    .then(() => { musicBtn.hidden = false; setPlaying(true); })
    .catch(() => setPlaying(false));
  musicBtn.addEventListener("click", () => {
    if (audio.paused) play();
    else { audio.pause(); setPlaying(false); }
  });

  // ---------- theme toggle (orange <-> blue) ----------
  $("#themeBtn").addEventListener("click", () => {
    document.documentElement.classList.toggle("sky");
    const wasPlaying = !audio.paused;
    setLogo();
    setTrack();
    if (wasPlaying) play();
  });

  // ---------- cover ----------
  $("#open").addEventListener("click", () => {
    // the envelope opens (style.css: envelope-open / card-out, 1.4s)
    const cover = $("#cover");
    cover.classList.add("opened");
    document.body.classList.remove("locked");
    document.body.classList.add("opening");
    window.scrollTo(0, 0);
    // start the music on this tap (phones only allow audio after a tap; iOS won't preload it)
    play();
    setTimeout(() => {
      cover.hidden = true;
      document.body.classList.remove("opening");
    }, 1500);
  });

  // ---------- scroll cue (phones: page 2 starts on the painting) ----------
  const cue = $("#scrollCue");
  cue.addEventListener("click", (e) => {
    e.preventDefault();
    $("#card").scrollIntoView({ behavior: "smooth" });
  });
  window.addEventListener("scroll", () => {
    cue.classList.toggle("gone", window.scrollY > 40);
  }, { passive: true });

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
  const title = `งานมงคลสมรส ${W.bride.th} & ${W.groom.th}`;
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
  const deadlineTime = W.rsvpDeadlineTime || "23:59";
  const deadline = new Date(`${W.rsvpDeadline}T${deadlineTime}:00+07:00`);
  // no deadline hint is shown; the form just closes at the deadline
  if (Date.now() > deadline) {
    form.hidden = true;
    $("#rsvpClosed").hidden = false;
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

    if (!W.rsvpEndpoint) {
      err.textContent = "ระบบตอบรับยังไม่เปิดใช้งาน";
      return;
    }

    const yes = attending === "yes";
    const data = new URLSearchParams();
    data.append("name", name);
    data.append("attending", attending);
    data.append("guests", yes ? guests.value : "0");
    data.append("message", form.elements.message.value.trim());

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "กำลังส่ง…";
    try {
      // Apps Script web apps don't allow CORS reads; no-cors still delivers the row.
      await fetch(W.rsvpEndpoint, { method: "POST", mode: "no-cors", body: data });
      form.hidden = true;
      $("#thanksMsg").textContent = yes
        ? `เราได้รับคำตอบของคุณ ${name} แล้ว แล้วพบกันในวันงาน`
        : `ขอบคุณ ${name} สำหรับคำอวยพร`;
      $("#rsvpThanks").hidden = false;
    } catch {
      err.textContent = "ส่งไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง";
      btn.disabled = false;
      btn.textContent = "ส่งคำตอบ";
    }
  });
})();
