const STORAGE_KEY = "libraryGradeStrands";
const SCHOOL_YEAR_KEY = "librarySchoolYears";

const addButton = document.getElementById("addGradeStrandButton");
const modal = document.getElementById("gradeStrandModal");
const closeButton = document.getElementById("closeGradeStrandModal");
const cancelButton = document.getElementById("cancelGradeStrandButton");
const form = document.getElementById("gradeStrandForm");

const gradeInput = document.getElementById("grade_level");
const strandInput = document.getElementById("strand");
const descriptionInput = document.getElementById("description");

const searchInput = document.getElementById("gradeStrandSearch");
const tableBody = document.getElementById("gradeStrandTableBody");
const recordCount = document.getElementById("gradeStrandRecordCount");

let gradeStrands = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let schoolYears = JSON.parse(localStorage.getItem(SCHOOL_YEAR_KEY)) || [];
let editingId = null;

// Create a School Year dropdown if it is not already in the form.
let schoolYearSelect = document.getElementById("strandSchoolYear");

if (!schoolYearSelect) {
  schoolYearSelect = document.createElement("select");
  schoolYearSelect.id = "strandSchoolYear";
  schoolYearSelect.name = "school_year";
  schoolYearSelect.className = "input";
  schoolYearSelect.required = true;

  const wrapper = document.createElement("div");
  const label = document.createElement("label");

  label.htmlFor = "strandSchoolYear";
  label.textContent = "School Year:";

  wrapper.append(label, schoolYearSelect);

  const gradeWrapper = gradeInput.closest("div");
  form.insertBefore(wrapper, gradeWrapper);
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gradeStrands));
}

function loadSchoolYears(selectedId = "") {
  schoolYears = JSON.parse(localStorage.getItem(SCHOOL_YEAR_KEY)) || [];

  schoolYearSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select School Year";

  schoolYearSelect.appendChild(defaultOption);

  schoolYears.forEach((schoolYear) => {
    const option = document.createElement("option");

    option.value = schoolYear.id;
    option.textContent = schoolYear.schoolYear;

    if (String(schoolYear.id) === String(selectedId)) {
      option.selected = true;
    }

    schoolYearSelect.appendChild(option);
  });
}

function openModal() {
  editingId = null;
  form.reset();
  loadSchoolYears();
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

function getSchoolYearName(schoolYearId) {
  const schoolYear = schoolYears.find((item) => String(item.id) === String(schoolYearId));

  return schoolYear ? schoolYear.schoolYear : "Unknown School Year";
}

function renderTable(searchTerm = "") {
  tableBody.innerHTML = "";

  schoolYears = JSON.parse(localStorage.getItem(SCHOOL_YEAR_KEY)) || [];

  const filteredRecords = gradeStrands.filter((record) => {
    const text = [record.grade, record.strand, record.description, getSchoolYearName(record.schoolYearId)]
      .join(" ")
      .toLowerCase();

    return text.includes(searchTerm.toLowerCase());
  });

  if (filteredRecords.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 4;
    cell.className = "text-center";
    cell.textContent = "No grade and strand records found.";

    row.appendChild(cell);
    tableBody.appendChild(row);
  } else {
    filteredRecords.forEach((record) => {
      const row = document.createElement("tr");

      const gradeCell = document.createElement("td");
      gradeCell.className = "text-center";
      gradeCell.textContent = record.grade;

      const strandCell = document.createElement("td");
      strandCell.className = "text-center";
      strandCell.textContent = record.strand;

      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = record.description || "—";

      const actionsCell = document.createElement("td");
      const actions = document.createElement("div");

      actions.className = "d-flex items-center justify-center gap-2";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn-outline";
      editButton.title = "Edit";
      editButton.dataset.edit = record.id;
      editButton.innerHTML = '<span class="fa-solid fa-pen"></span>';

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn-danger";
      deleteButton.title = "Delete";
      deleteButton.dataset.delete = record.id;
      deleteButton.innerHTML = '<span class="fa-solid fa-trash"></span>';

      actions.append(editButton, deleteButton);
      actionsCell.appendChild(actions);

      row.append(gradeCell, strandCell, descriptionCell, actionsCell);

      tableBody.appendChild(row);
    });
  }

  recordCount.textContent = `Showing ${filteredRecords.length} registered grade and strand record${filteredRecords.length === 1 ? "" : "s"}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const schoolYearId = schoolYearSelect.value;
  const grade = gradeInput.value.trim();
  const strand = strandInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!schoolYearId || !grade || !strand) {
    alert("Please select a school year and enter the grade and strand.");
    return;
  }

  if (
    gradeStrands.some(
      (record) =>
        String(record.schoolYearId) === String(schoolYearId) &&
        record.grade.toLowerCase() === grade.toLowerCase() &&
        record.strand.toLowerCase() === strand.toLowerCase() &&
        record.id !== editingId,
    )
  ) {
    alert("This grade and strand already exists for the selected school year.");
    return;
  }

  if (!confirm("Confirm saving this grade and strand?")) {
    return;
  }

  if (editingId !== null) {
    gradeStrands = gradeStrands.map((record) =>
      record.id === editingId
        ? {
            ...record,
            schoolYearId,
            grade,
            strand,
            description,
          }
        : record,
    );
  } else {
    gradeStrands.push({
      id: Date.now(),
      schoolYearId,
      grade,
      strand,
      description,
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
    const record = gradeStrands.find((item) => item.id === id);

    if (!record) return;

    editingId = record.id;

    loadSchoolYears(record.schoolYearId);

    gradeInput.value = record.grade;
    strandInput.value = record.strand;
    descriptionInput.value = record.description || "";

    modal.classList.remove("d-none");
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.delete);

    if (confirm("Delete this grade and strand? Sections connected to it will no longer be selectable.")) {
      gradeStrands = gradeStrands.filter((record) => record.id !== id);

      saveRecords();
      renderTable(searchInput.value.trim());
    }
  }
});

loadSchoolYears();
renderTable();
