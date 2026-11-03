const STORAGE_KEY = "librarySchoolYears";

// HTML elements
const addButton = document.getElementById("addSchoolYearButton");
const modal = document.getElementById("schoolYearModal");
const closeButton = document.getElementById("closeSchoolYearModal");
const cancelButton = document.getElementById("cancelSchoolYearButton");
const form = document.getElementById("schoolYearForm");

const staffInput = document.getElementById("staff");
const schoolYearInput = document.getElementById("school_year");
const startDateInput = document.getElementById("start_date");
const endDateInput = document.getElementById("end_date");
const activeInput = document.getElementById("is_active");

const searchInput = document.getElementById("schoolYearSearch");
const tableBody = document.getElementById("schoolYearTableBody");
const recordCount = document.getElementById("schoolYearRecordCount");
const modalTitle = document.getElementById("schoolYearModalTitle");

// Load saved school years
let schoolYears = [];

try {
  schoolYears = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch (error) {
  console.error("Could not load school year records:", error);
}

let editingId = null;

// Open modal
addButton.addEventListener("click", () => {
  editingId = null;
  form.reset();
  modalTitle.textContent = "Add School Year";
  modal.classList.remove("d-none");
});

// Close modal
function closeModal() {
  modal.classList.add("d-none");
  form.reset();
  editingId = null;
}

closeButton.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);

// Save records to localStorage
function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schoolYears));
}

// Create table cell
function createCell(value, className = "") {
  const cell = document.createElement("td");
  cell.textContent = value || "—";

  if (className) {
    cell.className = className;
  }

  return cell;
}

// Render table
function renderTable(searchTerm = "") {
  tableBody.innerHTML = "";

  const filteredRecords = schoolYears.filter((record) => {
    const searchableText = `
      ${record.staff}
      ${record.schoolYear}
      ${record.startDate}
      ${record.endDate}
      ${record.isActive}
    `.toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase());
  });

  if (filteredRecords.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 6;
    cell.className = "text-center";
    cell.textContent = "No school year records found.";

    row.appendChild(cell);
    tableBody.appendChild(row);
  } else {
    filteredRecords.forEach((record) => {
      const row = document.createElement("tr");

      row.appendChild(createCell(record.staff, "text-center"));
      row.appendChild(createCell(record.schoolYear, "text-center"));
      row.appendChild(createCell(record.startDate, "text-center"));
      row.appendChild(createCell(record.endDate, "text-center"));
      row.appendChild(createCell(record.isActive, "text-center"));

      const actionsCell = document.createElement("td");
      const actionsContainer = document.createElement("div");

      actionsContainer.className = "d-flex items-center justify-center gap-2";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn-outline";
      editButton.title = "Edit School Year";
      editButton.dataset.edit = record.id;
      editButton.innerHTML = '<span class="fa-solid fa-pen"></span>';

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn-danger";
      deleteButton.title = "Delete School Year";
      deleteButton.dataset.delete = record.id;
      deleteButton.innerHTML = '<span class="fa-solid fa-trash"></span>';

      actionsContainer.append(editButton, deleteButton);
      actionsCell.appendChild(actionsContainer);
      row.appendChild(actionsCell);

      tableBody.appendChild(row);
    });
  }

  recordCount.textContent = `Showing ${filteredRecords.length} registered school year${filteredRecords.length === 1 ? "" : "s"}`;
}

// Add or edit a school year
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const staff = staffInput.value.trim();
  const schoolYear = schoolYearInput.value.trim();
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const isActive = activeInput.value;

  if (!staff || !schoolYear || !startDate || !endDate) {
    alert("Please complete all required fields.");
    return;
  }

  if (endDate < startDate) {
    alert("The end date cannot be earlier than the start date.");
    return;
  }

  const confirmed = confirm("Do you want to save this school year?");

  if (!confirmed) return;

  if (editingId !== null) {
    schoolYears = schoolYears.map((record) => {
      if (record.id === editingId) {
        return {
          ...record,
          staff,
          schoolYear,
          startDate,
          endDate,
          isActive,
        };
      }

      return record;
    });
  } else {
    schoolYears.push({
      id: Date.now(),
      staff,
      schoolYear,
      startDate,
      endDate,
      isActive,
    });
  }

  saveRecords();
  renderTable(searchInput.value.trim());
  closeModal();
});

// Search school years
searchInput.addEventListener("input", () => {
  renderTable(searchInput.value.trim());
});

// Edit and delete records
tableBody.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    const id = Number(editButton.dataset.edit);
    const record = schoolYears.find((item) => item.id === id);

    if (!record) return;

    editingId = record.id;

    staffInput.value = record.staff;
    schoolYearInput.value = record.schoolYear;
    startDateInput.value = record.startDate;
    endDateInput.value = record.endDate;
    activeInput.value = record.isActive;

    modalTitle.textContent = "Edit School Year";
    modal.classList.remove("d-none");
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.delete);

    if (confirm("Are you sure you want to delete this school year?")) {
      schoolYears = schoolYears.filter((record) => record.id !== id);

      saveRecords();
      renderTable(searchInput.value.trim());
    }
  }
});

// Display saved records when the page opens
renderTable();
