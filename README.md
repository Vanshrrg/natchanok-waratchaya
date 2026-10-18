# การ์ดเชิญงานแต่ง · ณัชชนก & วรัชยา

ลิงก์การ์ด: **https://vanshrrg.github.io/natchanok-waratchaya/**

## แก้ไขข้อมูล
แก้ทุกอย่างที่ไฟล์ **`config.js`** (ชื่อ วันที่ เวลา สถานที่ ลิงก์แผนที่ วันปิดรับ RSVP Google Form)

## ใส่รูป / โลโก้ / เพลง
วางไฟล์ในโฟลเดอร์ `assets/` ด้วยชื่อนี้ — การ์ดจะแสดงเองอัตโนมัติ

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| `assets/logo.png` | โลโก้บนหน้าปก (แทนตัวอักษร N W) — แนะนำ PNG พื้นใส |
| `assets/hero.jpg` | รูปในกรอบโค้ง (แนวตั้ง ~ 3:4) |
| `assets/music.mp3` | เพลงพื้นหลัง — ปุ่ม ♪ จะโผล่เองเมื่อมีไฟล์ |
| `assets/og.jpg` | รูปพรีวิวเวลาแชร์ใน LINE/Facebook (1200×630) |

## ตั้งค่า Google Form (RSVP)
1. สร้าง Google Form ใหม่ มี 4 คำถามตามนี้
   - **ชื่อ - นามสกุล** — Short answer
   - **เข้าร่วมงานหรือไม่** — Multiple choice: `เข้าร่วม` / `ไม่สะดวกเข้าร่วม`
   - **จำนวนผู้ร่วมงาน** — Short answer
   - **คำอวยพร** — Paragraph
2. แท็บ Responses → Link to Sheets (เพื่อดูคำตอบใน Google Sheets)
3. เมนู ⋮ → **Get pre-filled link** → กรอกทุกช่องเป็นค่าอะไรก็ได้ → Get link → Copy
   ลิงก์จะหน้าตาแบบนี้
   `https://docs.google.com/forms/d/e/1FAIpQL...xyz/viewform?entry.123456=...&entry.789012=...`
4. ใส่ใน `config.js`
   - `formId` = ส่วน `1FAIpQL...xyz`
   - `fields.name / attending / guests / message` = `entry.xxxx` ของแต่ละคำถามตามลำดับ
5. ทดสอบส่งจากการ์ด แล้วดูว่าคำตอบเข้า Sheet

## อัปเดตการ์ดออนไลน์
```bash
git add -A
git commit -m "update card"
git push
```
GitHub Pages จะอัปเดตภายใน ~1 นาที

## ดูตัวอย่างในเครื่อง
```bash
node tools/serve.js
```
แล้วเปิด http://localhost:5500 — ถ้าเปลี่ยนชื่อ/วันที่ ให้สร้างรูปแชร์ใหม่ที่ http://localhost:5500/tools/og.html → กด Save
