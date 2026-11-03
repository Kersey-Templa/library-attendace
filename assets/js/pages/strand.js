const STORAGE_KEY = "libraryGradeStrands";

// HTML elements
const addButton = document.getElementById("addGradeStrandButton");
const modal = document.getElementById("gradeStrandModal");
const closeButton = document.getElementById("closeGradeStrandModal");
const cancelButton = document.getElementById("cancelGradeStrandButton");
const form = document.getElementById("gradeStrandForm");

const gradeInput = document.getElementById("grade_level");
const strandInput = document.getElementById("strand");
const descriptionInput = document.getElementById("description");

const tableBody = document.getElementById("gradeStrandTableBody");
const searchInput = document.getElementById("gradeStrandSearch");
const recordCount = document.getElementById("gradeStrandRecordCount");

// Load saved records
let gradeStrands = [];

try {
  gradeStrands = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch (error) {
  console.error("Could not load grade and strand records:", error);
}

let editingId = null;

// Open the modal
addButton.addEventListener("click", () => {
  editingId = null;
  form.reset();
  modal.classList.remove("d-none");
});

// Close the modal
function closeModal() {
  modal.classList.add("d-none");
  form.reset();
  editingId = null;
}

closeButton.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);

// Save records
function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gradeStrands));
}

// Render the table
function renderTable(searchTerm = "") {
  tableBody.innerHTML = "";

  const filteredRecords = gradeStrands.filter((record) => {
    const searchableText = `${record.grade} ${record.strand} ${record.description}`.toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase());
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
      const actionsContainer = document.createElement("div");

      actionsContainer.className = "d-flex items-center justify-center gap-2";

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

      actionsContainer.append(editButton, deleteButton);
      actionsCell.appendChild(actionsContainer);

      row.append(gradeCell, strandCell, descriptionCell, actionsCell);

      tableBody.appendChild(row);
    });
  }

  recordCount.textContent = `Showing ${filteredRecords.length} registered grade${filteredRecords.length === 1 ? "" : "s"} and strand${filteredRecords.length === 1 ? "" : "s"}`;
}

// Submit form
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const grade = gradeInput.value.trim();
  const strand = strandInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!grade || !strand) {
    alert("Please enter the grade level and strand.");
    return;
  }

  const confirmed = confirm("Do you want to save this grade and strand?");

  if (!confirmed) return;

  if (editingId !== null) {
    gradeStrands = gradeStrands.map((record) => {
      if (record.id === editingId) {
        return {
          ...record,
          grade,
          strand,
          description,
        };
      }

      return record;
    });
  } else {
    gradeStrands.push({
      id: Date.now(),
      grade,
      strand,
      description,
    });
  }

  saveRecords();
  renderTable(searchInput.value.trim());
  closeModal();
});

// Search records
searchInput.addEventListener("input", () => {
  renderTable(searchInput.value.trim());
});

// Edit and delete records
tableBody.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    const id = Number(editButton.dataset.edit);
    const record = gradeStrands.find((item) => item.id === id);

    if (!record) return;

    editingId = record.id;

    gradeInput.value = record.grade;
    strandInput.value = record.strand;
    descriptionInput.value = record.description;

    modal.classList.remove("d-none");
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.delete);

    if (confirm("Are you sure you want to delete this record?")) {
      gradeStrands = gradeStrands.filter((record) => record.id !== id);

      saveRecords();
      renderTable(searchInput.value.trim());
    }
  }
});

// Display records on page load
renderTable();
