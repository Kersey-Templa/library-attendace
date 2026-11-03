const STORAGE_KEY = "librarySections";

const addSectionButton = document.getElementById("addSectionButton");
const sectionModal = document.getElementById("sectionModal");
const closeSectionModal = document.getElementById("closeSectionModal");
const cancelSectionButton = document.getElementById("cancelSectionButton");
const sectionForm = document.getElementById("sectionForm");
const sectionTableBody = document.getElementById("sectionTableBody");
const sectionSearch = document.getElementById("studentSearch");
const sectionRecordCount = document.getElementById("sectionRecordCount");

let sections = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editingSectionId = null;

// Open the form
addSectionButton.addEventListener("click", () => {
  editingSectionId = null;
  sectionForm.reset();
  sectionModal.classList.remove("d-none");
});

// Close the form
function closeModal() {
  sectionModal.classList.add("d-none");
  sectionForm.reset();
  editingSectionId = null;
}

closeSectionModal.addEventListener("click", closeModal);
cancelSectionButton.addEventListener("click", closeModal);

// Save records to localStorage
function saveSections() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
}

// Render the table
function renderSections(searchTerm = "") {
  sectionTableBody.innerHTML = "";

  const filteredSections = sections.filter((section) => {
    const searchableText = `
      ${section.code}
      ${section.schoolYear}
      ${section.gradeStrand}
      ${section.gradeLevel}
      ${section.adviser}
      ${section.sectionName}
      ${section.description}
    `.toLowerCase();

    return searchableText.includes(searchTerm.toLowerCase());
  });

  if (filteredSections.length === 0) {
    sectionTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">
          No section records found.
        </td>
      </tr>
    `;
  } else {
    filteredSections.forEach((section) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td class="text-center">${section.code}</td>
        <td class="text-center">${section.gradeStrand}</td>
        <td class="text-center">${section.gradeLevel}</td>
        <td class="text-center">${section.adviser}</td>
        <td>
          <div class="d-flex items-center justify-center gap-2">
            <button
              type="button"
              class="btn-outline"
              title="Edit Section"
              data-edit="${section.id}"
            >
              <span class="fa-solid fa-pen"></span>
            </button>

            <button
              type="button"
              class="btn-danger"
              title="Delete Section"
              data-delete="${section.id}"
            >
              <span class="fa-solid fa-trash"></span>
            </button>
          </div>
        </td>
      `;

      sectionTableBody.appendChild(row);
    });
  }

  sectionRecordCount.textContent = `Showing ${filteredSections.length} registered section${filteredSections.length === 1 ? "" : "s"}`;
}

// Submit form and add a section
sectionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const schoolYear = document.getElementById("school_year").value.trim();
  const gradeStrand = document.getElementById("grade_strand").value.trim();
  const adviser = document.getElementById("staff").value.trim();
  const sectionName = document.getElementById("section_name").value.trim();
  const description = document.getElementById("description").value.trim();

  // Extract grade level from text such as "Grade 11 - STEM"
  const gradeMatch = gradeStrand.match(/grade\s*\d+/i);
  const gradeLevel = gradeMatch ? gradeMatch[0] : gradeStrand;

  if (!confirm("Are you sure you want to save this section?")) {
    return;
  }

  if (editingSectionId) {
    sections = sections.map((section) => {
      if (section.id === editingSectionId) {
        return {
          ...section,
          schoolYear,
          gradeStrand,
          gradeLevel,
          adviser,
          sectionName,
          description,
        };
      }

      return section;
    });
  } else {
    const newSection = {
      id: Date.now(),
      code: `SEC-${String(sections.length + 1).padStart(3, "0")}`,
      schoolYear,
      gradeStrand,
      gradeLevel,
      adviser,
      sectionName,
      description,
    };

    sections.push(newSection);
  }

  saveSections();
  renderSections(sectionSearch.value);
  closeModal();
});

// Search sections
sectionSearch.addEventListener("input", () => {
  renderSections(sectionSearch.value.trim());
});

// Edit or delete section
sectionTableBody.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    const sectionId = Number(editButton.dataset.edit);
    const section = sections.find((item) => item.id === sectionId);

    if (!section) return;

    editingSectionId = section.id;

    document.getElementById("school_year").value = section.schoolYear;
    document.getElementById("grade_strand").value = section.gradeStrand;
    document.getElementById("staff").value = section.adviser;
    document.getElementById("section_name").value = section.sectionName;
    document.getElementById("description").value = section.description;

    sectionModal.classList.remove("d-none");
  }

  if (deleteButton) {
    const sectionId = Number(deleteButton.dataset.delete);

    if (confirm("Are you sure you want to delete this section?")) {
      sections = sections.filter((section) => section.id !== sectionId);

      saveSections();
      renderSections(sectionSearch.value);
    }
  }
});

// Display saved sections when the page opens
renderSections();
