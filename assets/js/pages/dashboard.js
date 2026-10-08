const ATTENDANCE_STORAGE_KEY = "libraryAttendance";
const STUDENT_STORAGE_KEY = "libraryStudents";

// ==============================
// STORAGE
// ==============================

function getAttendance() {
  const data = localStorage.getItem(ATTENDANCE_STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Unable to load attendance records:", error);
    return [];
  }
}

function getStudents() {
  const data = localStorage.getItem(STUDENT_STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Unable to load students:", error);
    return [];
  }
}

// ==============================
// DATE
// ==============================

function getToday() {
  const today = new Date();

  return today.toISOString().split("T")[0];
}

function formatTime(time) {
  if (!time) {
    return "—";
  }

  const date = new Date(time);

  if (isNaN(date.getTime())) {
    return time;
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ==============================
// TODAY'S ATTENDANCE
// ==============================

function getTodayAttendance() {
  const attendance = getAttendance();
  const today = getToday();

  return attendance.filter((record) => {
    const recordDate = record.date || record.dateRegistered || record.timeInDate || record.timeIn;

    if (!recordDate) {
      return false;
    }

    return new Date(recordDate).toISOString().split("T")[0] === today;
  });
}

// ==============================
// DASHBOARD STATISTICS
// ==============================

function updateDashboardStats() {
  const attendance = getTodayAttendance();

  const totalVisitors = attendance.length;

  const timeIn = attendance.filter((record) => {
    return record.timeIn && !record.timeOut;
  }).length;

  const timeOut = attendance.filter((record) => {
    return record.timeOut;
  }).length;

  const totalDays = 1;

  const averageVisitors = totalDays > 0 ? Math.round(totalVisitors / totalDays) : 0;

  const totalVisitorsElement = document.getElementById("totalVisitors");
  const totalTimeInElement = document.getElementById("totalTimeIn");
  const totalTimeOutElement = document.getElementById("totalTimeOut");
  const averageVisitorsElement = document.getElementById("averageVisitors");

  if (totalVisitorsElement) {
    totalVisitorsElement.textContent = totalVisitors;
  }

  if (totalTimeInElement) {
    totalTimeInElement.textContent = timeIn;
  }

  if (totalTimeOutElement) {
    totalTimeOutElement.textContent = timeOut;
  }

  if (averageVisitorsElement) {
    averageVisitorsElement.textContent = averageVisitors;
  }
}

// ==============================
// RECENT ATTENDANCE
// ==============================

function displayRecentAttendance() {
  const tableBody = document.getElementById("recentAttendanceBody");

  if (!tableBody) {
    return;
  }

  const attendance = getTodayAttendance();
  const students = getStudents();

  tableBody.innerHTML = "";

  if (attendance.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">
          No attendance records today.
        </td>
      </tr>
    `;

    return;
  }

  // Show newest records first
  const recentRecords = [...attendance].reverse().slice(0, 5);

  recentRecords.forEach((record) => {
    const student = students.find(
      (item) => item.id === record.studentId || item.studentNumber === record.studentNumber,
    );

    const studentName = record.name || record.studentName || student?.name || "—";

    const grade = record.grade || record.gradeStrand || student?.gradeStrand || "—";

    const section = record.section || student?.section || "—";

    const timeIn = formatTime(record.timeIn);

    const timeOut = formatTime(record.timeOut);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="text-center">${studentName}</td>
      <td class="text-center">${grade}</td>
      <td class="text-center">${section}</td>
      <td class="text-center">${timeIn}</td>
      <td class="text-center">${timeOut}</td>
    `;

    tableBody.appendChild(row);
  });
}

// ==============================
// REFRESH DASHBOARD
// ==============================

function refreshDashboard() {
  updateDashboardStats();
  displayRecentAttendance();
}

// ==============================
// AUTO REFRESH
// ==============================

function startDashboardRefresh() {
  setInterval(() => {
    refreshDashboard();
  }, 5000);
}

// ==============================
// INITIALIZE
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  refreshDashboard();
  startDashboardRefresh();
});
