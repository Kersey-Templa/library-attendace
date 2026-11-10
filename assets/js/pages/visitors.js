const STORAGE_KEY = "libraryVisitors";

// HTML ELEMENTS
const addVisitorButton = document.getElementById("addVisitorButton");
const visitorModal = document.getElementById("visitorModal");
const closeVisitorModal = document.getElementById("closeVisitorModal");
const cancelVisitorButton = document.getElementById("cancelVisitorButton");
const visitorForm = document.getElementById("visitorForm");

const visitorName = document.getElementById("visitorName");
const visitorType = document.getElementById("visitorType");
const visitorStudentId = document.getElementById("visitorStudentId");
const visitorPurpose = document.getElementById("visitorPurpose");

const visitorSearch = document.getElementById("visitorSearch");
const visitorTypeFilter = document.getElementById("visitorTypeFilter");
const visitorPurposeFilter = document.getElementById("visitorPurposeFilter");
const visitorDateFilter = document.getElementById("visitorDateFilter");

const visitorTableBody = document.getElementById("visitorTableBody");
const visitorRecordCount = document.getElementById("visitorRecordCount");

// LOAD SAVED RECORDS
let visitors = [];

try {
  visitors = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch (error) {
  console.error("Unable to load visitor records:", error);
}

// SAVE RECORDS
function saveVisitors() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
}

// GET LOCAL DATE
function getCurrentDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// GET CURRENT TIME
function getCurrentTime() {
  return new Date().toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// FORMAT DATE FOR TABLE
function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// GENERATE VISITOR ID
function generateVisitorId() {
  const highestNumber = visitors.reduce((highest, visitor) => {
    const number = Number(String(visitor.visitorId || "").replace("V-", ""));

    return Number.isFinite(number) ? Math.max(highest, number) : highest;
  }, 0);

  return `V-${String(highestNumber + 1).padStart(3, "0")}`;
}

// OPEN MODAL
function openVisitorModal() {
  visitorForm.reset();
  visitorModal.classList.remove("d-none");
}

// CLOSE MODAL
function closeModal() {
  visitorModal.classList.add("d-none");
  visitorForm.reset();
}

addVisitorButton.addEventListener("click", openVisitorModal);

closeVisitorModal.addEventListener("click", closeModal);

cancelVisitorButton.addEventListener("click", closeModal);

// CREATE TABLE CELL
function createCell(value, className = "") {
  const cell = document.createElement("td");

  cell.textContent = value || "—";

  if (className) {
    cell.className = className;
  }

  return cell;
}

// CREATE ACTION BUTTON
function createActionButton(text, className, action, visitorId) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = className;
  button.textContent = text;
  button.dataset.action = action;
  button.dataset.id = visitorId;

  return button;
}

// DISPLAY VISITORS
function renderVisitors() {
  visitorTableBody.innerHTML = "";

  const searchTerm = visitorSearch.value.trim().toLowerCase();
  const selectedType = visitorTypeFilter.value;
  const selectedPurpose = visitorPurposeFilter.value;
  const selectedDate = visitorDateFilter.value;

  const filteredVisitors = visitors.filter((visitor) => {
    const searchableText = [
      visitor.visitorId,
      visitor.fullName,
      visitor.studentId,
      visitor.type,
      visitor.purpose,
      visitor.status,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);

    const matchesType = selectedType === "" || visitor.type === selectedType;

    const matchesPurpose = selectedPurpose === "" || visitor.purpose === selectedPurpose;

    const matchesDate = selectedDate === "" || visitor.date === selectedDate;

    return matchesSearch && matchesType && matchesPurpose && matchesDate;
  });

  // EMPTY TABLE MESSAGE
  if (filteredVisitors.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 10;
    cell.className = "text-center";
    cell.textContent = visitors.length === 0 ? "No visitor records found." : "No matching visitor records found.";

    row.appendChild(cell);
    visitorTableBody.appendChild(row);
  } else {
    // DISPLAY EACH VISITOR
    filteredVisitors.forEach((visitor) => {
      const row = document.createElement("tr");

      row.appendChild(createCell(visitor.visitorId, "text-center"));

      row.appendChild(createCell(visitor.fullName, "text-center"));

      row.appendChild(createCell(visitor.type, "text-center"));

      row.appendChild(createCell(visitor.studentId, "text-center"));

      row.appendChild(createCell(visitor.purpose, "text-center"));

      row.appendChild(createCell(formatDate(visitor.date), "text-center"));

      row.appendChild(createCell(visitor.timeIn, "text-center"));

      row.appendChild(createCell(visitor.timeOut || "—", "text-center"));

      row.appendChild(createCell(visitor.status, "text-center"));

      // ACTIONS
      const actionCell = document.createElement("td");
      const actionContainer = document.createElement("div");

      actionContainer.className = "d-flex items-center justify-center gap-2";

      if (visitor.status === "Inside") {
        const timeOutButton = createActionButton("Time Out", "btn-primary", "timeout", visitor.visitorId);

        actionContainer.appendChild(timeOutButton);
      } else {
        const viewButton = createActionButton("View", "btn-outline", "view", visitor.visitorId);

        actionContainer.appendChild(viewButton);
      }

      actionCell.appendChild(actionContainer);
      row.appendChild(actionCell);

      visitorTableBody.appendChild(row);
    });
  }

  // UPDATE RECORD COUNT
  visitorRecordCount.textContent = `Showing ${filteredVisitors.length} of ${visitors.length} visitor${visitors.length === 1 ? "" : "s"}`;
}

// ADD VISITOR
visitorForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fullName = visitorName.value.trim();
  const type = visitorType.value;
  const studentId = visitorStudentId.value.trim();
  const purpose = visitorPurpose.value;

  if (!fullName || !type || !purpose) {
    alert("Please complete all required fields.");
    return;
  }

  if (!confirm("Confirm adding this visitor?")) {
    return;
  }

  const newVisitor = {
    visitorId: generateVisitorId(),
    fullName,
    type,
    studentId: type === "Student" ? studentId : "",
    purpose,
    date: getCurrentDate(),
    timeIn: getCurrentTime(),
    timeOut: "",
    status: "Inside",
  };

  visitors.push(newVisitor);

  saveVisitors();
  renderVisitors();
  closeModal();

  alert("Visitor successfully added.");
});

// SEARCH
visitorSearch.addEventListener("input", renderVisitors);

// FILTER BY TYPE
visitorTypeFilter.addEventListener("change", renderVisitors);

// FILTER BY PURPOSE
visitorPurposeFilter.addEventListener("change", renderVisitors);

// FILTER BY DATE
visitorDateFilter.addEventListener("change", renderVisitors);

// TABLE ACTIONS
visitorTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const visitorId = button.dataset.id;
  const action = button.dataset.action;

  const visitor = visitors.find((item) => item.visitorId === visitorId);

  if (!visitor) return;

  // TIME OUT
  if (action === "timeout") {
    if (!confirm(`Confirm time out for ${visitor.fullName}?`)) {
      return;
    }

    visitor.timeOut = getCurrentTime();
    visitor.status = "Checked Out";

    saveVisitors();
    renderVisitors();

    alert("Visitor successfully checked out.");
  }

  // VIEW DETAILS
  if (action === "view") {
    alert(
      `VISITOR DETAILS\n\n` +
        `Visitor ID: ${visitor.visitorId}\n` +
        `Full Name: ${visitor.fullName}\n` +
        `Type: ${visitor.type}\n` +
        `Student ID: ${visitor.studentId || "—"}\n` +
        `Purpose: ${visitor.purpose}\n` +
        `Date: ${formatDate(visitor.date)}\n` +
        `Time In: ${visitor.timeIn}\n` +
        `Time Out: ${visitor.timeOut || "—"}\n` +
        `Status: ${visitor.status}`,
    );
  }
});

// INITIAL DISPLAY
renderVisitors();
