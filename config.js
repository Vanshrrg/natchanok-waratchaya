// ============================================================
//  แก้ไขข้อมูลการ์ดทั้งหมดได้ที่ไฟล์นี้ไฟล์เดียว
//  (All card content lives here — edit this file only)
// ============================================================
window.WEDDING = {
  groom: { th: "ณัชชนก", en: "Natchanok" },
  bride: { th: "วรัชยา", en: "Waratchaya" },

  // Monogram letters (used until assets/logo.png is added)
  monogram: ["G", "E"],

  invite: "ขอเรียนเชิญร่วมเป็นเกียรติ\nในงานมงคลสมรสของ",

  // Event date & time (Thailand time, 24h)
  date: "2027-03-21",
  startTime: "18:00",
  endTime: "22:00",
  dateTextTh: "วันอาทิตย์ที่ 21 มีนาคม พ.ศ. 2570",
  dateTextEn: "Sunday · 21.03.2027",
  timeTextTh: "เวลา 18:00 น.",

  venue: {
    name: "โรงแรมเพชรรัชต์การ์เด้น",
    room: "ห้องประชุมประดับฟ้า",
    // Paste the exact Google Maps share link here if you have one
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("โรงแรมเพชรรัชต์การ์เด้น"),
  },

  // RSVP closes at the end of this day
  rsvpDeadline: "2027-02-28",

  // Google Form — see README.md for setup
  googleForm: {
    // From the form link: https://docs.google.com/forms/d/e/<formId>/viewform
    formId: "",
    fields: {
      name: "entry.0000000000",
      attending: "entry.0000000000",
      guests: "entry.0000000000",
      message: "entry.0000000000",
    },
    // Must match the choice text in the Google Form exactly
    attendingYes: "เข้าร่วม",
    attendingNo: "ไม่สะดวกเข้าร่วม",
  },

  maxGuests: 5,

  footer: "ขอบคุณที่ร่วมเป็นส่วนหนึ่ง\nในวันพิเศษของเรา",
};
