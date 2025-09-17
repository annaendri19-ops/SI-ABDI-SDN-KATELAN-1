let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

function updateStudentList() {
  const list = document.getElementById("studentList");
  const select = document.getElementById("attendanceName");
  list.innerHTML = "";
  select.innerHTML = '<option value="">-- Pilih Nama Siswa --</option>';

  students.forEach((s) => {
    const img = s.photo ? `<img src="${s.photo}" width="50"/>` : "";
    list.innerHTML += `<div>${img} ${s.name} (${s.nis})</div>`;
    select.innerHTML += `<option value="${s.name}">${s.name}</option>`;
  });
}

document.getElementById("studentForm").addEventListener("submit", (e) => {
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

document.getElementById("attendanceForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("attendanceName").value;
  const status = document.getElementById("attendanceStatus").value;
  if (!name) return alert("Pilih nama siswa!");

  attendance.push({ name, status, date: new Date().toISOString().split("T")[0] });
  localStorage.setItem("attendance", JSON.stringify(attendance));
  updateAttendanceTable();
  showDailyRecap();
  showMonthlyRecap();
});

  todayData.forEach((a) => {
    if (!grouped[a.name]) grouped[a.name] = { Hadir: 0, Alfa: 0, Sakit: 0, Izin: 0 };
    grouped[a.name][a.status]++;
    summary[a.status]++;
  });

  tbody.innerHTML = "";
  Object.keys(grouped).forEach((name) => {
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

function showDailyRecap() {
  const selectedDate = document.getElementById("dailySelector").value;
  const tbody = document.querySelector("#dailyRecap tbody");
  tbody.innerHTML = "";

  attendance.forEach((a) => {
    if (a.date === selectedDate) {
      tbody.innerHTML += `<tr>
        <td>${a.name}</td>
        <td>${a.status}</td>
      </tr>`;
    }
  });
}

function showMonthlyRecap() {
  const selectedMonth = document.getElementById("monthlySelector").value;
  const tbody = document.querySelector("#monthlyRecap tbody");
  const filtered = {};

  attendance.forEach((a) => {
    const month = a.date.split("-")[1];
    if (month === selectedMonth) {
      if (!filtered[a.name]) {
        filtered[a.name] = { Hadir: 0, Alfa: 0, Sakit: 0, Izin: 0 };
      }
      filtered[a.name][a.status]++;
    }
  });

  tbody.innerHTML = "";
  Object.keys(filtered).forEach((name) => {
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

document.getElementById("saveAttendanceBtn").addEventListener("click", () => {
  localStorage.setItem("attendance", JSON.stringify(attendance));
  alert("Absensi berhasil disimpan!");
});

document.getElementById("resetTodayBtn").addEventListener("click", () => {
  const today = new Date().toISOString().split("T")[0];
  attendance = attendance.filter((a) => a.date !== today);
  localStorage.setItem("attendance", JSON.stringify(attendance));
  updateAttendanceTable();
  showDailyRecap();
  showMonthlyRecap();
  alert("Absensi hari ini telah dihapus.");
});

window.addEventListener("DOMContentLoaded", () => {
  updateStudentList();
  updateAttendanceTable();

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dailySelector").value = today;
  showDailyRecap();

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  document.getElementById("monthlySelector").value = currentMonth;
  showMonthlyRecap();
});
