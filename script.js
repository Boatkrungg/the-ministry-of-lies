/*
  คู่มือไฟล์นี้ (JavaScript)
  - โค้ดนี้ทำให้ปุ่มกดได้ รับข้อมูลจากฟอร์ม และสร้างเอกสารผลลัพธ์
  - ถ้าจะแก้ "ข้อความตลก" ให้แก้เฉพาะส่วนข้อมูลด้านล่างได้เลย
  - ข้อความต้องอยู่ในเครื่องหมาย "..." และถ้ามีเครื่องหมาย " อยู่ในข้อความ
    ให้พิมพ์เป็น \\" แทน เพื่อไม่ให้โค้ดพัง
*/

// ===== 1) ข้อมูลประเภทคำร้อง =====
// ถ้าจะเพิ่มหมวดใหม่: คัดลอก 1 บรรทัด เช่น sleep: {...} แล้วเปลี่ยนชื่อด้านหน้า
// จากนั้นต้องเพิ่มปุ่มที่มี data-type ชื่อตรงกันใน index.html ด้วย
const documentTypes = {
  sleep: {
    title: "Request: five more minutes of sleep",
    subject: "An urgent request for a five-minute sleep extension",
    line: "My alarm clock has displayed a shocking lack of compassion, empathy, or understanding of a duvet's gravitational pull."
  },
  money: {
    title: "Complaint: friend borrowed money and vanished",
    subject: "Investigation into a suspiciously unavailable debtor",
    line: "The individual has been observed posting stories, ordering iced coffee, and somehow never seeing my message about the money."
  },
  ignore: {
    title: "Permit: ignore messages on my day off",
    subject: "Application for temporary digital invisibility",
    line: "I require one business day of pretending notifications are merely distant birds and not a forty-seven-message emergency."
  },
  adult: {
    title: "Request: a break from being an adult",
    subject: "Temporary suspension of adult responsibilities",
    line: "Bills, decisions, and pretending to understand insurance have become an unreasonable amount of plot for one character."
  },
  salary: {
    title: "Complaint: salary vanished upon arrival",
    subject: "Formal inquiry into missing salary funds",
    line: "The money arrived beautifully, made eye contact, and immediately eloped with rent, transport, and a tiny iced latte."
  },
  other: {
    title: "Custom complaint, couture edition",
    subject: "A matter too specific for regular customer service",
    line: "This incident is so uniquely inconvenient that even the group chat replied with three typing bubbles and then silence."
  }
};

// เพิ่มประโยคใน [ ] ได้เลย โดยคั่นแต่ละประโยคด้วยเครื่องหมาย comma (,)
// \n หมายถึงขึ้นบรรทัดใหม่บนตราประทับ
const stamps = [
  "SEEN\nBY VIBES",
  "FILED UNDER\nOH DEAR",
  "PENDING\nFOREVER-ISH",
  "SERVED WITH\nA SIDE EYE",
  "VERY CUTE\nNOT APPROVED"
];

const statuses = [
  "Received with a tiny sigh",
  "Forwarded to someone imaginary",
  "Awaiting the manager's emotional return",
  "Under review by a crystal ball",
  "Approved in spirit, not in practice"
];

// ข้อความจบในเอกสาร แยกตามระดับ Humour intensity ในฟอร์ม
const endings = {
  mild: ["I respectfully request your consideration, a small snack, and perhaps an email confirming that my feelings have been placed in the correct tray."],
  cheeky: ["I respectfully request swift consideration before I turn this minor inconvenience into a PowerPoint presentation with transitions."],
  dark: ["I respectfully request consideration. If declined, please send the standard-issue velvet chaise lounge for my completely graceful collapse."]
};

// ===== 2) ตัวแปรสำหรับจำตัวเลือกของผู้ใช้ =====
let selectedType = "sleep"; // ค่าเริ่มต้น หากยังไม่ได้เลือกหมวด
let toastTimer; // ใช้เก็บเวลาของกล่องข้อความเล็ก ๆ ด้านล่าง

const screens = document.querySelectorAll(".screen");

// สลับหน้าที่แสดง: home, types, form หรือ result
const showScreen = (id) => {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// สุ่ม 1 ข้อความจากรายการ เช่น สุ่มตราหรือสถานะ
const randomItem = (list) => list[Math.floor(Math.random() * list.length)];

// ป้องกันอักขระพิเศษจากผู้ใช้ทำให้ไฟล์ SVG ที่ดาวน์โหลดเสีย
const escapeHtml = (value) => value.replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#039;",
  '"': "&quot;"
}[char]));

// ===== 3) ปุ่มนำทางและฟอร์ม =====
document.getElementById("startButton").addEventListener("click", () => showScreen("types"));

// โลโก้ด้านบนต้องพากลับหน้าแรกจริง แม้ผู้ใช้กำลังอยู่หน้า form หรือ result
document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  showScreen("home");
});

document.querySelectorAll(".back-home").forEach((button) => {
  button.addEventListener("click", () => showScreen("home"));
});

// ผู้ใช้กดการ์ดหมวดใด ระบบจะบันทึกหมวดนั้น แล้วพาไปหน้าฟอร์ม
document.getElementById("typeGrid").addEventListener("click", (event) => {
  const card = event.target.closest(".type-card");
  if (!card) return;

  selectedType = card.dataset.type;
  document.getElementById("formTitle").textContent = documentTypes[selectedType].title;
  document.getElementById("formError").textContent = "";
  showScreen("form");
});

document.getElementById("changeType").addEventListener("click", () => showScreen("types"));

// นับจำนวนตัวอักษรใต้ช่อง Tell us the scandal
document.getElementById("details").addEventListener("input", (event) => {
  document.getElementById("count").textContent = event.target.value.length;
});

// เมื่อกด Generate: ตรวจช่องบังคับก่อน แล้วส่งข้อมูลไปสร้างเอกสาร
document.getElementById("requestForm").addEventListener("submit", (event) => {
  event.preventDefault(); // ไม่ให้เบราว์เซอร์รีเฟรชหน้า

  const name = document.getElementById("requesterName").value.trim();
  const target = document.getElementById("subjectName").value.trim();
  const details = document.getElementById("details").value.trim();
  const humor = document.querySelector("input[name='humor']:checked").value;
  const error = document.getElementById("formError");

  if (!name || !target) {
    error.textContent = "Please complete the required fields. Even this fictional office needs a name to gossip about.";
    return;
  }

  error.textContent = "";
  createDocument({ name, target, details, humor });
});

// ===== 4) สร้างและเติมข้อมูลลงในเอกสารผลลัพธ์ =====
function createDocument(data) {
  const type = documentTypes[selectedType];

  // เปลี่ยน ML เป็นอักษรย่ออื่นได้ หากอยากเปลี่ยนรูปแบบเลขคำร้อง
  const requestId = `ML-${String(Math.floor(Math.random() * 9000) + 1000)}/${String(new Date().getFullYear()).slice(-2)}`;
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  // ถ้าผู้ใช้ไม่พิมพ์รายละเอียด ระบบจะใช้มุกประจำหมวดแทน
  const detail = data.details || `${type.line} Please consider this matter with the urgency usually reserved for a sale ending in nine minutes.`;

  document.getElementById("requestNo").textContent = requestId;
  document.getElementById("documentDate").textContent = date;
  document.getElementById("resultSubject").textContent = type.subject;
  document.getElementById("resultName").textContent = data.name;
  document.getElementById("resultTarget").textContent = data.target;
  document.getElementById("signatureName").textContent = `(${data.name})`;
  document.getElementById("resultDetails").textContent = detail;
  document.getElementById("bureaucraticText").textContent = randomItem(endings[data.humor]);
  document.getElementById("stampText").innerHTML = randomItem(stamps).replace("\n", "<br>");
  document.getElementById("statusBadge").textContent = randomItem(statuses);

  document.getElementById("successMessage").textContent = randomItem([
    "Your complaint has been moisturized and sent upstairs.",
    "A fictional assistant has stamped this with alarming confidence.",
    "Filed successfully. The vibes are questionable, but immaculate."
  ]);

  showScreen("result");
}

// กล่องข้อความสั้น ๆ ที่เด้งขึ้นหลัง copy หรือ download
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// ===== 5) ปุ่มบนหน้าผลลัพธ์ =====
document.getElementById("newRequest").addEventListener("click", () => {
  document.getElementById("requestForm").reset();
  document.getElementById("count").textContent = "0";
  showScreen("types");
});

// เปิดกล่อง Print ของเบราว์เซอร์ ผู้ใช้เลือก Save as PDF ได้จากกล่องนี้
document.getElementById("printButton").addEventListener("click", () => window.print());

// คัดลอกข้อความสั้น ๆ เพื่อเอาไปวางในแชตหรือโพสต์
document.getElementById("copyButton").addEventListener("click", async () => {
  const message = `I filed a luxury complaint with The Ministry of Lies:\n${document.getElementById("resultSubject").textContent}\nStatus: ${document.getElementById("statusBadge").textContent}\n#MinistryOfLies`;

  try {
    await navigator.clipboard.writeText(message);
    showToast("The tea has been copied. Deploy responsibly.");
  } catch {
    showToast("Copying failed. Highlight the document like it is 2009.");
  }
});

// สร้างไฟล์รูป SVG: แก้ข้อความใน <text> ได้ แต่ไม่ควรลบ ${get("...")}
// เพราะส่วนนั้นคือข้อมูลที่ผู้ใช้กรอกในฟอร์ม
document.getElementById("downloadButton").addEventListener("click", () => {
  const get = (id) => escapeHtml(document.getElementById(id).textContent);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="#f8f0e6"/><rect x="70" y="65" width="940" height="1220" fill="#fffdfa" stroke="#171217" stroke-width="5"/><rect x="70" y="1138" width="940" height="147" fill="#4a102d"/><text x="120" y="150" fill="#8e2357" font-family="serif" font-size="27" font-weight="bold">THE DEPARTMENT OF EMOTIONAL PAPERWORK</text><text x="120" y="215" fill="#171217" font-family="serif" font-size="45" font-weight="bold">Certificate of Extremely Valid Feelings</text><text x="120" y="272" fill="#171217" font-family="sans-serif" font-size="23">RECEIPT: ${get("requestNo")}  •  ISSUED: ${get("documentDate")}</text><line x1="120" y1="312" x2="960" y2="312" stroke="#171217" stroke-width="3"/><text x="120" y="378" fill="#171217" font-family="sans-serif" font-size="28" font-weight="bold">RE: ${get("resultSubject")}</text><text x="120" y="442" fill="#171217" font-family="sans-serif" font-size="27">Applicant: ${get("resultName")}</text><text x="120" y="494" fill="#171217" font-family="sans-serif" font-size="27">Regarding: ${get("resultTarget")}</text><foreignObject x="120" y="552" width="840" height="440"><div xmlns="http://www.w3.org/1999/xhtml" style="font:29px sans-serif;line-height:1.55;color:#171217">${get("resultDetails")}</div></foreignObject><text x="120" y="1080" fill="#8e2357" font-family="sans-serif" font-size="27" font-weight="bold">STATUS: ${get("statusBadge")}</text><text x="120" y="1210" fill="#fff0d4" font-family="sans-serif" font-size="21">SATIRICAL PROJECT • NOT A GOVERNMENT AGENCY • NOT VALID FOR ANYTHING SERIOUS</text></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "ministry-of-lies-luxury-complaint.svg";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Saved. Your complaint is now gallery-ready.");
});
