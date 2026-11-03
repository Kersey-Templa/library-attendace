const STORAGE_KEY = "librarySchoolYears";

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

let schoolYears = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editingId = null;

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schoolYears));
}

function openModal() {
  editingId = null;
  form.reset();
  modalTitle.textContent = "Add School Year";
  modal.classList.remove("d-none");
}

function closeModal() {
  modal.classList.add("d-none");
  form.reset();
  editingId = null;
}

addButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);

function renderTable(searchTerm = "") {
  tableBody.innerHTML = "";

  const filteredRecords = schoolYears.filter((record) => {
    const text = [record.staff, record.schoolYear, record.startDate, record.endDate, record.isActive]
      .join(" ")
      .toLowerCase();

    return text.includes(searchTerm.toLowerCase());
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

      [record.staff, record.schoolYear, record.startDate, record.endDate, record.isActive].forEach((value) => {
        const cell = document.createElement("td");
        cell.className = "text-center";
        cell.textContent = value || "—";
        row.appendChild(cell);
      });

      const actionsCell = document.createElement("td");
      const actions = document.createElement("div");

      actions.className = "d-flex items-center justify-center gap-2";

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

      actions.append(editButton, deleteButton);
      actionsCell.appendChild(actions);
      row.appendChild(actionsCell);

      tableBody.appendChild(row);
    });
  }

  recordCount.textContent = `Showing ${filteredRecords.length} registered school year${filteredRecords.length === 1 ? "" : "s"}`;
}

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
    alert("End date cannot be earlier than start date.");
    return;
  }

  if (
    schoolYears.some(
      (record) => record.schoolYear.toLowerCase() === schoolYear.toLowerCase() && record.id !== editingId,
    )
  ) {
    alert("That school year already exists.");
    return;
  }

  if (!confirm("Confirm saving this school year?")) {
    return;
  }

  // Only one school year can be active at a time.
  if (isActive === "Yes") {
    schoolYears = schoolYears.map((record) => ({
      ...record,
      isActive: "No",
    }));
  }

  if (editingId !== null) {
    schoolYears = schoolYears.map((record) =>
      record.id === editingId
        ? {
            ...record,
            staff,
            schoolYear,
            startDate,
            endDate,
            isActive,
          }
        : record,
    );
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

searchInput.addEventListener("input", () => {
  renderTable(searchInput.value.trim());
});

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

    if (confirm("Delete this school year? Grade and strand records connected to it will no longer be selectable.")) {
      schoolYears = schoolYears.filter((record) => record.id !== id);

      saveRecords();
      renderTable(searchInput.value.trim());
    }
  }
});

renderTable();
