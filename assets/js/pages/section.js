const STORAGE_KEY = "librarySections";
const SCHOOL_YEAR_KEY = "librarySchoolYears";
const GRADE_STRAND_KEY = "libraryGradeStrands";

const addButton = document.getElementById("addSectionButton");
const modal = document.getElementById("sectionModal");
const closeButton = document.getElementById("closeSectionModal");
const cancelButton = document.getElementById("cancelSectionButton");
const form = document.getElementById("sectionForm");

const staffInput = document.getElementById("staff");
const sectionNameInput = document.getElementById("section_name");
const descriptionInput = document.getElementById("description");

const searchInput = document.getElementById("studentSearch");
const tableBody = document.getElementById("sectionTableBody");
const recordCount = document.getElementById("sectionRecordCount");

let sections = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let schoolYears = JSON.parse(localStorage.getItem(SCHOOL_YEAR_KEY)) || [];
let gradeStrands = JSON.parse(localStorage.getItem(GRADE_STRAND_KEY)) || [];
let editingId = null;

// Convert existing text inputs into dropdowns.
function createSelectFromInput(inputId, selectId, labelText) {
  let select = document.getElementById(selectId);

  if (select) return select;

  const oldInput = document.getElementById(inputId);

  select = document.createElement("select");
  select.id = selectId;
  select.name = oldInput.name || inputId;
  select.className = oldInput.className || "input";
  select.required = true;

  const wrapper = oldInput.closest("div");

  if (wrapper) {
    const label = wrapper.querySelector("label");

    if (label) {
      label.htmlFor = selectId;
      label.textContent = labelText;
    }

    oldInput.replaceWith(select);
  }

  return select;
}

const schoolYearSelect = createSelectFromInput("school_year", "sectionSchoolYear", "School Year:");

const gradeStrandSelect = createSelectFromInput("grade_strand", "sectionGradeStrand", "Grade and Strand:");

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
}

function refreshSourceRecords() {
  schoolYears = JSON.parse(localStorage.getItem(SCHOOL_YEAR_KEY)) || [];
  gradeStrands = JSON.parse(localStorage.getItem(GRADE_STRAND_KEY)) || [];
}

function loadSchoolYears(selectedId = "") {
  refreshSourceRecords();

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

function loadGradeStrands(selectedId = "") {
  refreshSourceRecords();

  const selectedSchoolYearId = schoolYearSelect.value;

  gradeStrandSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Grade and Strand";

  gradeStrandSelect.appendChild(defaultOption);

  const matchingRecords = gradeStrands.filter((record) => String(record.schoolYearId) === String(selectedSchoolYearId));

  matchingRecords.forEach((record) => {
    const option = document.createElement("option");

    option.value = record.id;
    option.textContent = `${record.grade} - ${record.strand}`;

    if (String(record.id) === String(selectedId)) {
      option.selected = true;
    }

    gradeStrandSelect.appendChild(option);
  });
}

schoolYearSelect.addEventListener("change", () => {
  loadGradeStrands();
});

function getSchoolYearName(id) {
  const record = schoolYears.find((item) => String(item.id) === String(id));

  return record ? record.schoolYear : "Unknown School Year";
}

function getGradeStrandName(id) {
  const record = gradeStrands.find((item) => String(item.id) === String(id));

  return record ? `${record.grade} - ${record.strand}` : "Unknown Grade/Strand";
}

function openModal() {
  editingId = null;
  form.reset();

  loadSchoolYears();
  loadGradeStrands();

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

  refreshSourceRecords();

  const filteredRecords = sections.filter((record) => {
    const text = [
      record.code,
      record.sectionName,
      record.adviser,
      getSchoolYearName(record.schoolYearId),
      getGradeStrandName(record.gradeStrandId),
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(searchTerm.toLowerCase());
  });

  if (filteredRecords.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.className = "text-center";
    cell.textContent = "No section records found.";

    row.appendChild(cell);
    tableBody.appendChild(row);
  } else {
    filteredRecords.forEach((record) => {
      const row = document.createElement("tr");

      const codeCell = document.createElement("td");
      codeCell.className = "text-center";
      codeCell.textContent = record.code;

      const strandCell = document.createElement("td");
      strandCell.className = "text-center";
      strandCell.textContent = getGradeStrandName(record.gradeStrandId);

      const gradeCell = document.createElement("td");
      gradeCell.className = "text-center";

      const gradeStrand = gradeStrands.find((item) => String(item.id) === String(record.gradeStrandId));

      gradeCell.textContent = gradeStrand ? gradeStrand.grade : "—";

      const adviserCell = document.createElement("td");
      adviserCell.className = "text-center";
      adviserCell.textContent = record.adviser || "—";

      const actionsCell = document.createElement("td");
      const actions = document.createElement("div");

      actions.className = "d-flex items-center justify-center gap-2";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn-outline";
      editButton.title = "Edit Section";
      editButton.dataset.edit = record.id;
      editButton.innerHTML = '<span class="fa-solid fa-pen"></span>';

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn-danger";
      deleteButton.title = "Delete Section";
      deleteButton.dataset.delete = record.id;
      deleteButton.innerHTML = '<span class="fa-solid fa-trash"></span>';

      actions.append(editButton, deleteButton);
      actionsCell.appendChild(actions);

      row.append(codeCell, strandCell, gradeCell, adviserCell, actionsCell);

      tableBody.appendChild(row);
    });
  }

  recordCount.textContent = `Showing ${filteredRecords.length} registered section${filteredRecords.length === 1 ? "" : "s"}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const schoolYearId = schoolYearSelect.value;
  const gradeStrandId = gradeStrandSelect.value;
  const adviser = staffInput.value.trim();
  const sectionName = sectionNameInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!schoolYearId || !gradeStrandId || !adviser || !sectionName) {
    alert("Please complete all required fields.");
    return;
  }

  const selectedGradeStrand = gradeStrands.find((record) => String(record.id) === String(gradeStrandId));

  if (!selectedGradeStrand || String(selectedGradeStrand.schoolYearId) !== String(schoolYearId)) {
    alert("Please select a valid school year and grade/strand.");
    return;
  }

  if (!confirm("Confirm saving this section?")) {
    return;
  }

  if (editingId !== null) {
    sections = sections.map((record) =>
      record.id === editingId
        ? {
            ...record,
            schoolYearId,
            gradeStrandId,
            adviser,
            sectionName,
            description,
          }
        : record,
    );
  } else {
    sections.push({
      id: Date.now(),
      code: `SEC-${String(sections.length + 1).padStart(3, "0")}`,
      schoolYearId,
      gradeStrandId,
      adviser,
      sectionName,
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
    const record = sections.find((item) => item.id === id);

    if (!record) return;

    editingId = record.id;

    loadSchoolYears(record.schoolYearId);
    loadGradeStrands(record.gradeStrandId);

    staffInput.value = record.adviser;
    sectionNameInput.value = record.sectionName;
    descriptionInput.value = record.description || "";

    modal.classList.remove("d-none");
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.delete);

    if (confirm("Are you sure you want to delete this section?")) {
      sections = sections.filter((record) => record.id !== id);

      saveRecords();
      renderTable(searchInput.value.trim());
    }
  }
});

loadSchoolYears();
loadGradeStrands();
renderTable();
