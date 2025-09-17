let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

function updateStudentList() {
  const list = document.getElementById("studentList");
  const select = document.getElementById("attendanceName");
  list.innerHTML = "";
  select.innerHTML = '<option value="">-- Pilih Nama Siswa --</option>';

  students.forEach((s, i) => {
    const img = s.photo ? `<img src="${s.photo}" width="50"/>` : "";
    list.innerHTML += `<div>${img} ${s.name} (${s.nis})</div>`;
    select.innerHTML += `<option value="${s.name}">${s.name}</option>`;
  });
}

document.getElementById("studentForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const nis = document.getElementById("studentNIS").value.trim();
  const photoFile = document.getElementById("studentPhoto").files[0];

  if (!name || !nis) return alert("Nama dan NIS wajib diisi!");

  const reader = new FileReader();
  reader.onload = () => {
    students.push({ name, nis, photo: reader.result });
    localStorage.setItem("students", JSON.stringify(students));
    updateStudentList();
    e.target.reset();
  };
  if (photoFile) reader.readAsDataURL(photoFile);
  else {
    students.push({ name, nis, photo: null });
    localStorage.setItem("students", JSON.stringify(students));
    updateStudentList();
    e.target.reset();
  }
});

document.getElementById("attendanceForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("attendanceName").value;
  const status = document.getElementById("attendanceStatus").value;
  if (!name) return alert("Pilih nama siswa!");

  attendance.push({ name, status, date: new Date().toISOString().split("T")[0] });
  localStorage.setItem("attendance", JSON.stringify(attendance));
  updateAttendanceTable();
});

function updateAttendanceTable() {
  const tbody = document.querySelector("#dailyAttendance tbody");
  const summary = { Hadir: 0, Alfa: 0, Sakit: 0, Izin: 0 };
  const today = new Date().toISOString().split("T")[0];
  const todayData = attendance.filter(a => a.date === today);
function applyFilters() {
  const selectedDate = document.getElementById("dateSelector").value;
  const selectedMonth = document.getElementById("monthSelector").value;
  const tbody = document.querySelector("#dailyAttendance tbody");
  const summary = { Hadir: 0, Alfa: 0, Sakit: 0, Izin: 0 };
  const filtered = {};

  attendance.forEach(a => {
    const [year, month, day] = a.date.split("-");
    if (selectedDate && a.date !== selectedDate) return;
    if (!selectedDate && selectedMonth && month !== selectedMonth) return;

    if (!filtered[a.name]) filtered[a.name] = { Hadir: 0, Alfa: 0, Sakit: 0, Izin: 0 };
    filtered[a.name][a.status]++;
    summary[a.status]++;
  });

  tbody.innerHTML = "";
  Object.keys(filtered).forEach(name => {
    const row = filtered[name];
    tbody.innerHTML += `<tr>
      <td>${name}</td>
      <td>${row.Hadir || 0}</td>
      <td>${row.Alfa || 0}</td>
      <td>${row.Sakit || 0}</td>
      <td>${row.Izin || 0}</td>
    </tr>`;
  });

  document.getElementById("totalHadir").textContent = summary.Hadir;
  document.getElementById("totalAlfa").textContent = summary.Alfa;
  document.getElementById("totalSakit").textContent = summary.Sakit;
  document.getElementById("totalIzin").textContent = summary.Izin;
}

  const grouped = {};
  todayData.forEach(a => {
    if (!grouped[a.name]) grouped[a.name] = { Hadir: 0, Alfa: 0, Sakit: 0, Izin: 0 };
    grouped[a.name][a.status]++;
    summary[a.status]++;
  });

  tbody.innerHTML = "";
  Object.keys(grouped).forEach(name => {
    const row = grouped[name];
    tbody.innerHTML += `<tr>
      <td>${name}</td>
      <td>${row.Hadir || 0}</td>
      <td>${row.Alfa || 0}</td>
      <td>${row.Sakit || 0}</td>
      <td>${row.Izin || 0}</td>
    </tr>`;
  });

  document.getElementById("totalHadir").textContent = summary.Hadir;
  document.getElementById("totalAlfa").textContent = summary.Alfa;
  document.getElementById("totalSakit").textContent = summary.Sakit;
  document.getElementById("totalIzin").textContent = summary.Izin;
}

function resetData() {
  if (confirm("Yakin ingin menghapus semua data?")) {
    localStorage.clear();
    students = [];
    attendance = [];
    updateStudentList();
    updateAttendanceTable();
  }
}

function exportToPDF() {
  const doc = new window.jspdf.jsPDF();
  doc.text("Rekap Absensi Siswa SD Negeri Katelan 1", 10, 10);
  let y = 20;
  attendance.forEach(a => {
    doc.text(`${a.date} - ${a.name} - ${a.status}`, 10, y);
    y += 10;
  });
  doc.save("rekap-absensi.pdf");
}
function showDailyRecap() {
  const selectedDate = document.getElementById("dailySelector").value;
  const tbody = document.querySelector("#dailyRecap tbody");
  tbody.innerHTML = "";

  attendance.forEach(a => {
    if (a.date === selectedDate) {
      tbody.innerHTML += `<tr>
        <td>${a.name}</td>
        <td>${a.status}</td>
      </tr>`;
    }
  });
}
updateStudentList();
updateAttendanceTable();
window.addEventListener("DOMContentLoaded", () => {
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  const monthSelector = document.getElementById("monthSelector");
  if (monthSelector) {
    monthSelector.value = currentMonth;
    filterByMonth(); // langsung tampilkan data bulan sekarang
  }
});
const today = new Date().toISOString().split("T")[0];
document.getElementById("dateSelector").value = today;
filterByDate();
function importCSV() {
  const fileInput = document.getElementById("csvInput");
  const file = fileInput.files[0];
  if (!file) return alert("Pilih file CSV terlebih dahulu!");

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split("\n");
    lines.forEach((line, index) => {
      if (index === 0) return; // Lewati header
      const [name, nis] = line.split(",");
      if (name && nis) {
        students.push({ name: name.trim(), nis: nis.trim(), photo: null });
      }
    });
    localStorage.setItem("students", JSON.stringify(students));
    updateStudentList();
    alert("Data siswa berhasil diimpor!");
  };
  reader.readAsText(file);
function showMonthlyRecap() {
  const selectedMonth = document.getElementById("monthlySelector").value;
  const tbody = document.querySelector("#monthlyRecap tbody");
  const filtered = {};

  attendance.forEach(a => {
    const month = a.date.split("-")[1];
    if (month === selectedMonth) {
      if (!filtered[a.name]) {
        filtered[a.name] = { Hadir: 0, Alfa: 0, Sakit: 0, Izin: 0 };
      }
      filtered[a.name][a.status]++;
    }
  });

  tbody.innerHTML = "";
  Object.keys(filtered).forEach(name => {
    const row = filtered[name];
    tbody.innerHTML += `<tr>
      <td>${name}</td>
      <td>${row.Hadir || 0}</td>
      <td>${row.Alfa || 0}</td>
      <td>${row.Sakit || 0}</td>
      <td>${row.Izin || 0}</td>
    </tr>`;
  });
}
}
function printSection(tableId) {
  const table = document.getElementById(tableId);
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });

  const guru = "Guru Kelas: Ibu Anna Endri Lestari, S.Pd";
  const newWindow = window.open("", "", "width=800,height=600");
  newWindow.document.write(`
    <html>
      <head>
        <title>Cetak Rekap Absensi</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2, h3 { text-align: center; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; }
          .footer div { width: 45%; text-align: center; }
        </style>
      </head>
      <body>
        <h2>SDN Katelan 1</h2>
        <h3>Rekapitulasi Absensi Siswa</h3>
        <p><strong>Tanggal Cetak:</strong> ${today}</p>
        ${table.outerHTML}
        <div class="footer">
          <div>
            <p>Mengetahui,</p>
            <p>Kepala Sekolah</p>
            <br><br>
            <p>__________________________</p>
          </div>
          <div>
            <p>Disusun oleh,</p>
            <p>${guru}</p>
            <br><br>
            <p>__________________________</p>
          </div>
        </div>
      </body>
    </html>
  `);
  newWindow.document.close();
  newWindow.print();
}
let rekap = {
  hadir: 0,
  izin: 0,
  sakit: 0,
  alfa: 0
};

function setStatus(button, label, color) {
  const container = button.parentElement;
  container.innerHTML = `<span style="font-weight:bold; color:${color};">${label}</span>`;

  // Tambahkan ke rekap
  if (label.includes("Hadir")) rekap.hadir++;
  else if (label.includes("Izin")) rekap.izin++;
  else if (label.includes("Sakit")) rekap.sakit++;
  else if (label.includes("Alfa")) rekap.alfa++;

  // Update tampilan rekap
  document.getElementById("jumlah-hadir").innerText = rekap.hadir;
  document.getElementById("jumlah-izin").innerText = rekap.izin;
  document.getElementById("jumlah-sakit").innerText = rekap.sakit;
  document.getElementById("jumlah-alfa").innerText = rekap.alfa;
}
function saveAttendanceToLocal() {
  localStorage.setItem("attendance", JSON.stringify(attendance));
}

window.addEventListener("DOMContentLoaded", () => {
  const savedAttendance = localStorage.getItem("attendance");
  if (savedAttendance) {
    attendance = JSON.parse(savedAttendance);
  }

  const savedStudents = localStorage.getItem("students");
  if (savedStudents) {
    students = JSON.parse(savedStudents);
  }

  updateStudentList();
  updateAttendanceTable();

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dailySelector").value = today;
  showDailyRecap();

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  document.getElementById("monthlySelector").value = currentMonth;
  showMonthlyRecap();
});
updateAttendanceTable();
document.getElementById("saveAttendanceBtn").addEventListener("click", () => {
  localStorage.setItem("attendance", JSON.stringify(attendance));
  alert("Absensi berhasil disimpan!");
});
document.getElementById("resetTodayBtn").addEventListener("click", () => {
  const today = new Date().toISOString().split("T")[0];
  attendance = attendance.filter(a => a.date !== today);
  localStorage.setItem("attendance", JSON.stringify(attendance));
  updateAttendanceTable();
  showDailyRecap();
  showMonthlyRecap();
  alert("Absensi hari ini telah dihapus.");
});
