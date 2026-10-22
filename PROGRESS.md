# Wedding Card: Progress & Handoff

The online wedding invitation for **ณัชชนก (Natchanok) & วรัชยา (Waratchaya)**.

- Live: https://vanshrrg.github.io/natchanok-waratchaya/
- Repo: https://github.com/Vanshrrg/natchanok-waratchaya (GitHub Pages serves `main` from the repo root)

## Set up on another PC
Requirements: Git, Node.js (for the local preview only) and the GitHub CLI `gh` (optional).

```bash
git clone https://github.com/Vanshrrg/natchanok-waratchaya.git
cd natchanok-waratchaya
node tools/serve.js
```
Then open http://localhost:5500.

To publish changes:
```bash
git add -A
git commit -m "update card"
git push
```
The live site updates in about a minute.

Note: `assets/palette-ref.jpg` (the colour reference image) is in `.gitignore`, so it is **not** in the repo. Copy it over by hand if you need it.

## What's done
- A static site (HTML/CSS/JS, no build step), mobile first, mostly in Thai.
- **All content is in `config.js`** (names, date, time, venue, map link, RSVP deadline, Google Form IDs).
- Sections: Cover (N W monogram + "เปิดการ์ด" button), then Hero (arch photo frame, names, palette dots, date and time), then Venue (map and calendar buttons: Google Calendar + .ics), then RSVP form, then Footer.
- Design: linen `#EFE8DF` background (not white), cream `#F7F2EB` card, gold `#B8975A`, and accents from the "Colorful Editorial" palette (yellow `#F2C230`, orange `#E8833A`, red `#C0392B`, pink `#D63A6E`, purple `#8E5BD0`, lavender `#B79CF0`, blue `#5B7FE0`). Fonts: Noto Serif Thai, IBM Plex Sans Thai and Cormorant Garamond.
- RSVP: name, attending (yes/no), number of guests (hidden when "no"), optional message. It posts to Google Forms `formResponse` (no-cors) and closes automatically after the deadline.
- Optional assets show up by themselves once the file exists: `assets/logo.png`, `assets/hero.jpg`, `assets/music.mp3` (a ♪ toggle appears and playback starts when the card is opened).
- Share preview `assets/og.jpg` (1200×630). To regenerate it: run `node tools/serve.js`, open http://localhost:5500/tools/og.html and click Save.
- Tested at mobile width (375px): cover, validation, guest toggle, and map and calendar links (18:00 Thai time = 11:00Z). The live URL and og.jpg both return 200.

## Decided against (per the couple)
Guest names in the link, parents' formal wording, countdown, schedule/timeline, photo gallery or lightbox, food restrictions, contact info. Gift/PromptPay is not included unless asked for.

## TODO
- [ ] **Google Form**: create it (see README.md for the 4 questions), then put `formId` and the `entry.xxxx` IDs in `config.js`. Until then, submitting shows "ระบบตอบรับยังไม่เปิดใช้งาน" (RSVP not set up yet).
- [ ] **Confirm the event time**: currently the placeholder `18:00` (with `endTime` 22:00). Update `startTime`, `endTime` and `timeTextTh`.
- [ ] **Confirm the RSVP deadline**: currently the placeholder `2027-02-28`.
- [ ] Add `assets/logo.png`, `assets/hero.jpg` (portrait, ~3:4) and `assets/music.mp3`.
- [ ] Optionally replace `venue.mapsUrl` with the exact Google Maps share link (right now it's a search for the hotel name).
- [ ] If the names or date change, regenerate `og.jpg` and update the `<title>`/`og:` meta tags in `index.html`.

## Files
| File | Purpose |
|---|---|
| `index.html` | Markup and meta/OG tags |
| `style.css` | All styling (colour tokens in `:root`) |
| `script.js` | Fills text from config, cover, music, reveal, calendar, RSVP |
| `config.js` | **All editable content** |
| `README.md` | Edit guide and Google Form setup (Thai) |
| `tools/serve.js` | Local preview server (port 5500) and OG save endpoint |
| `tools/og.html` | Generates `assets/og.jpg` |
