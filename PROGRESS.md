# Wedding Card: Progress & Handoff

Online wedding invitation for **นางสาววรัชยา ฝังใจ (Earth) & นายณัชชนก คำพิทักษ์ (Great)**.
Sunday 21 March 2027 (พ.ศ. 2570), reception 11:00, โรงแรมเพชรรัชต์การ์เด้น · ห้องประชุมประดับฟ้า.

- Live: https://vanshrrg.github.io/natchanok-waratchaya/ (`?theme=gold` / `?theme=sky` force a version)
- Repo: https://github.com/Vanshrrg/natchanok-waratchaya (GitHub Pages serves `main` from the repo root, ~1 min to rebuild; files are cached up to 10 min, so check with Ctrl+Shift+R)
- Owner / Google account: greatnk@gmail.com (GitHub: Vanshrrg)
- Source images, fonts and music the couple supplied live in the parent folder (`../`), not in the repo.

## Set up on another PC
```bash
git clone https://github.com/Vanshrrg/natchanok-waratchaya.git
cd natchanok-waratchaya
node tools/serve.js
```
Open http://localhost:5500. To publish: `git add -A && git commit -m "..." && git push`.

**No Node on the current PC.** Previews were served with a small PowerShell HttpListener (same port 5500, also handles the `POST /__save` used by `tools/og.html`). Any static server works for viewing; only the og.jpg Save button needs `tools/serve.js` (or an equivalent).

## How the card works
- Static site, no build step. **All text content is in `config.js`** (names, parents, invite line, date/time, schedule, venue, RSVP deadline, RSVP endpoint, max guests, footer).
- Page 1 (cover): monogram, "The Wedding of", short names `วรัชยา & ณัชชนก`, date, "เปิดการ์ด" button. Tapping it opens page 2 and starts the music.
- Logo readability: `.moon::before` puts a soft linen halo behind the cover monogram, and on screens ≤520px the pink/purple `.glow-tr` is shrunk and pushed into the top-right corner (it used to sit right behind the logo on phones).
- Opening transition (one 1.4s envelope motion, `envelope-open` + `card-out` in style.css): tapping เปิดการ์ด cuts the cover open in a V from the top like an envelope flap, the envelope slides down off-screen, and the card rises from a slightly lowered, smaller position as if pulled out. The cover is hidden after 1.5s (script.js). Reduced-motion users get no animation.
- Phones / portrait tablets (anything not "≥900px and landscape"): page 2 opens on the painting alone with a bouncing "เลื่อนลง" cue (`#scrollCue`, tap = smooth scroll to the card, fades after scrolling); the card starts at 100svh and is followed by 60svh of painting, then the page ends (overscroll bounce disabled).
- Page 2 (card): arch photo → parents (two columns, "และ" between) → invite line → full names with nicknames (bride name, *Earth* below it, &, *Great*, groom name below it; 8px gap between each nickname and its Thai name) → colour dots → date/time → Schedule → Venue (map + calendar) → RSVP → footer (letters-only logo).
- Names: the bride (วรัชยา) comes first everywhere. `config.js`: `bride`/`groom` each have `th` (short), `full` (title + surname) and `en` (nickname).

### Two versions (orange / blue)
- Each visit picks one at random (inline script in `<head>` of `index.html`); the round two-dot button bottom-left toggles. `?theme=sky|gold` forces one.
- Orange = default styles (`style.css`) + `theme-orange.css`. Blue = `theme-sky.css`, everything scoped under `html.sky`.
- What differs per version (switched in `script.js` on load and on toggle):

| | Orange | Blue |
|---|---|---|
| Page-2 painting | `assets/bg-orange.jpg` (couple dancing by a basket shop) | `assets/bg-sky.jpg` (couple on a hill, sky) |
| Arch photo | `assets/hero.jpg` | `assets/hero-sky.jpg` (zoom 130%, position 73% 38%) |
| Cover monogram | `assets/logo.png` (gold; open roses, closed rosebuds and berry buds all yellowish orange) | `assets/logo-cool.png` (blue, green leaves; open roses and closed rosebuds bluish purple-blue, berry buds dark purple-blue) |
| Footer letters | `assets/logo-letters.png` gold | same file, CSS hue-rotate to blue |
| Music | `assets/music.mp3` A Town with an Ocean View (Joe Hisaishi), 1× | `assets/music-sky.mp3` Marry You (string quartet), 0.8× |
| Accent / grey text | gold `#B8975A`, muted `#5C5248` | blue `#4C86C6`, muted `#5B6F87` |

### Backgrounds on wide screens (≥900px and landscape)
Painting drawn at ONE scale everywhere (S = `50vw - 230px`), so the horizon / curb lines up and nothing is stretched:
- `body::before` = left copy (bride / dancing couple), `body::after` = right copy (groom / shop).
- `.scene` (3 `<i>` tiles in `index.html`, behind the card): the empty middle part of the painting plus mirror-image copies each side, so it fills the gap at any width or browser zoom. It is `clip-path`-trimmed 24px each side so its joins always sit under the card (vw includes the scrollbar).
- Phones and portrait tablets: a single painting fixed behind the frosted card.
- Tested at 375×812, 768×1024, 1024×768, 1027×490 (150% zoom), 1280×720, 1920×920, 2400 and 2880 wide (zoomed out).

### Fonts (self-hosted ones are in `assets/fonts`)
- **Kinnari** (TLWG ttf-tlwg 0.7.3, GPL + font exception): all Thai headings (`--serif-th`), incl. "และ". Regular and Bold files.
- **Laksaman** (same TLWG package and licence): the couple's Thai names (the two full names on page 2) and the parents' names incl. their "และ" (`--names-th`, falls back to Kinnari). Regular and Bold files.
- **TH Charmonman** (SIPA national font, free to embed; `assets/fonts/THCharmonman.ttf`, from `../TH Charmonman Regular`): the short names `วรัชยา & ณัชชนก` on the cover only, at 40px. Purisa files are still in `assets/fonts` but unused.
- **IBM Plex Sans Thai** (Google Fonts): body text, form.
- **Cormorant Garamond** (Google Fonts): English text, "&", labels.
- **Katerlin** (fontspace, freeware non-commercial; `assets/fonts/Katerlin.ttf`): the nicknames *Earth* / *Great*. (Replaced Simsatigan, whose file is still in `assets/fonts` but unused.)

### RSVP → Google Sheet
- Form posts (no-cors) to the Apps Script web app in `config.js` `rsvpEndpoint`. The script (`tools/rsvp-apps-script.gs`, bound to the spreadsheet "Copy of WEDDING ค่าใช้จ่ายงานแต่ง") appends one row to the **ตอบรับแขก** tab: เวลา · ชื่อ - นามสกุล · มาร่วมงาน · จำนวนผู้ร่วมงาน · คำอวยพร (adds a bold frozen header if the tab is empty). It never deletes or edits anything else.
- **Working since 25 Oct 2026**: direct test returned "ok". The fix for "การเข้าถึงถูกปฏิเสธ" (403) was the owner approving permissions (Review permissions → Advanced → Go to project → Allow). Deployment: Execute as Me, Who has access: Anyone.
- The deployed script is the version **without** the `authorize()` helper; the repo copy has it (harmless). If the script code changes: Deploy → Manage deployments → ✏️ → New version, so the URL stays the same.
- Closes automatically at `rsvpDeadline` + `rsvpDeadlineTime` (21 Mar 2027, 12:00 Thai time).

### Share image
`assets/og.jpg` (1200×630) is drawn by `tools/og.html` from `config.js` (names, date, monogram letters, dots) in Kinnari + Cormorant. Regenerate after changing names/date/fonts: serve the site, open `/tools/og.html`, click Save. LINE/Facebook cache old previews.

## Open items
- [x] **RSVP deadline**: 21 March 2027 (the wedding day) at 12:00 Thai time (`rsvpDeadline` + `rsvpDeadlineTime` in config.js). No deadline hint is shown (removed at the couple's request); after the deadline the form hides and shows "ปิดรับการตอบรับแล้ว".
- [ ] **Delete the two test rows** in ตอบรับแขก ("ทดสอบระบบ (ลบได้)", "ทดสอบจากการ์ด (ลบได้)"); keep the header row.
- [ ] **Spreadsheet sharing** was set to "Anyone with the link — Editor" while debugging; it should go back to **Restricted** (the RSVP does not need it).
- [x] Map link: `venue.mapsUrl` opens Google Maps on Petcharat Garden Hotel (same place, /g/1tjpmzfw, as the couple's link https://share.google/Y8nZvJx39lYbYFuSx).
- [ ] Optional: the share image still shows plain "G E" letters, not the rose monogram.
- [ ] If names/date change: regenerate `og.jpg` and update `<title>` / `og:` tags in `index.html`.

## Decided against (per the couple)
Guest names in the link, countdown, photo gallery/lightbox, food restrictions, contact info. Gift/PromptPay only if asked.

## Files
| File | Purpose |
|---|---|
| `index.html` | Markup, meta/OG tags, random-theme script, `.scene` tiles |
| `style.css` | Base (orange) styling, tokens in `:root`, @font-face for the self-hosted fonts |
| `theme-orange.css` | Orange page-2 painting and wide-screen layout |
| `theme-sky.css` | Everything for the blue version |
| `script.js` | Fills text from config, logos, photo, music per version, theme toggle, reveal, calendar, RSVP |
| `config.js` | **All editable content** |
| `README.md` | Edit guide and RSVP/Apps Script setup (Thai) |
| `tools/rsvp-apps-script.gs` | Apps Script that writes RSVPs to the sheet |
| `tools/serve.js` | Local preview server (port 5500) + og.jpg save endpoint |
| `tools/og.html` | Generates `assets/og.jpg` |
