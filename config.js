// ============================================================
//  แก้ไขข้อมูลการ์ดทั้งหมดได้ที่ไฟล์นี้ไฟล์เดียว
//  (All card content lives here — edit this file only)
// ============================================================
window.WEDDING = {
  groom: { th: "ณัชชนก", en: "Great" },
  bride: { th: "วรัชยา", en: "Earth" },

  // Monogram letters (used until assets/logo.png is added)
  monogram: ["G", "E"],

  // Parents (two lines per family), shown above the invitation line
  parents: [
    ["พ.ต.อ.วินทุ ฝังใจ", "นางมรกต ฝังใจ"],
    ["ศ.นพ.โกวิท คำพิทักษ์", "ผศ.พญ. เตือนจิต คำพิทักษ์"],
  ],

  invite: "มีความยินดีขอเรียนเชิญเพื่อเป็นเกียรติ\nเนื่องในพิธีมงคลสมรส ระหว่าง",

  // Event date & time (Thailand time, 24h)
  date: "2027-03-21",
  startTime: "11:00",
  endTime: "14:00",
  dateTextTh: "วันอาทิตย์ที่ 21 มีนาคม พ.ศ. 2570",
  dateTextEn: "Sunday · 21.03.2027",
  timeTextTh: "เวลา 11:00 น.",

  // Schedule (กำหนดการ): time + ceremony, shown in this order
  schedule: [
    ["07.29 น.", "พิธีแห่ขันหมาก"],
    ["08.09 น.", "พิธีสวมแหวนหมั้น"],
    ["08.29 น.", "พิธียกน้ำชา"],
    ["11.00 น.", "งานฉลองมงคลสมรส"],
  ],

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
