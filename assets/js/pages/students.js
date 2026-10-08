// ==============================================
// STUDENTS PAGE JAVASCRIPT
// ==============================================

const STORAGE_KEY = "libraryStudents";

// ==============================================
// GET HTML ELEMENTS
// ==============================================

const studentSearch = document.getElementById("studentSearch");
const studentTableBody = document.getElementById("studentTableBody");

// ==============================================
// GET STUDENT COUNT ELEMENTS
// ==============================================

const studentCount = document.querySelector(".bg-white .text-sm.text-gray");

const tableFooterText = document.querySelector(".bg-light.border-t .text-xs.text-gray");

// ==============================================
// GET STUDENTS FROM LOCAL STORAGE
// ==============================================

function getStudents() {
  const students = localStorage.getItem(STORAGE_KEY);

  if (!students) {
    return [];
  }

  try {
    return JSON.parse(students);
  } catch (error) {
    console.error("Unable to load students:", error);

    return [];
  }
}

// ==============================================
// SAVE STUDENTS TO LOCAL STORAGE
// ==============================================

function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// ==============================================
// GENERATE STUDENT ID
// ==============================================

function generateStudentId() {
  return Date.now().toString();
}

// ==============================================
// ESCAPE HTML
// Prevents unwanted HTML from being inserted
// into the table.
// ==============================================

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// ==============================================
// FORMAT DATE
// ==============================================

function formatDate(date) {
  const formattedDate = new Date(date);

  return formattedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ==============================================
// DISPLAY STUDENTS
// ==============================================

function displayStudents(students = getStudents()) {
  studentTableBody.innerHTML = "";

  // ============================================
  // NO STUDENTS
  // ============================================

  if (students.length === 0) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td colspan="5" class="text-center">
        <div class="p-6">
          <p class="text-xs text-gray">
            No student records found.
          </p>
        </div>
      </td>
    `;

    studentTableBody.appendChild(row);

    updateStudentCount(0);

    return;
  }

  // ============================================
  // DISPLAY EACH STUDENT
  // ============================================

  students.forEach(function (student) {
    const row = document.createElement("tr");

    row.dataset.studentId = student.id;

    row.innerHTML = `
      <td class="text-center">
        ${escapeHTML(student.studentNumber)}
      </td>

      <td class="font-semibold">
        ${escapeHTML(student.name)}
      </td>

      <td class="text-center">
        ${escapeHTML(student.section)}
      </td>

      <td class="text-center">
        ${escapeHTML(formatDate(student.dateRegistered))}
      </td>

      <td>
        <div class="d-flex items-center justify-center gap-2">

          <button
            type="button"
            class="btn-outline edit-student"
            title="Edit Student"
            data-id="${escapeHTML(student.id)}"
          >
            <span class="fa-solid fa-pen"></span>
          </button>

          <button
            type="button"
            class="btn-danger delete-student"
            title="Delete Student"
            data-id="${escapeHTML(student.id)}"
          >
            <span class="fa-solid fa-trash"></span>
          </button>

        </div>
      </td>
    `;

    studentTableBody.appendChild(row);
  });

  updateStudentCount(students.length);
}

// ==============================================
// UPDATE STUDENT COUNT
// ==============================================

function updateStudentCount(count) {
  if (studentCount) {
    studentCount.textContent = `${count} Student${count === 1 ? "" : "s"}`;
  }

  if (tableFooterText) {
    tableFooterText.textContent = `Showing ${count} registered student${count === 1 ? "" : "s"}`;
  }
}

// ==============================================
// SEARCH STUDENTS
// ==============================================

function searchStudents() {
  const searchValue = studentSearch.value.trim().toLowerCase();

  const students = getStudents();

  if (!searchValue) {
    displayStudents(students);

    return;
  }

  const filteredStudents = students.filter(function (student) {
    return (
      student.studentNumber.toLowerCase().includes(searchValue) ||
      student.name.toLowerCase().includes(searchValue) ||
      student.section.toLowerCase().includes(searchValue)
    );
  });

  displayStudents(filteredStudents);
}

// ==============================================
// ADD STUDENT
// ==============================================

function addStudent() {
  const studentNumber = prompt("Enter student ID number:");

  if (!studentNumber) {
    return;
  }

  const name = prompt("Enter student's full name:");

  if (!name) {
    return;
  }

  const section = prompt("Enter student's section:");

  if (!section) {
    return;
  }

  const students = getStudents();

  // ============================================
  // CHECK DUPLICATE STUDENT ID
  // ============================================

  const existingStudent = students.some(function (student) {
    return student.studentNumber.toLowerCase() === studentNumber.trim().toLowerCase();
  });

  if (existingStudent) {
    alert("A student with that ID number already exists.");

    return;
  }

  // ============================================
  // CREATE STUDENT
  // ============================================

  const newStudent = {
    id: generateStudentId(),

    studentNumber: studentNumber.trim(),

    name: name.trim(),

    section: section.trim(),

    dateRegistered: new Date().toISOString(),
  };

  // ============================================
  // SAVE STUDENT
  // ============================================

  students.push(newStudent);

  saveStudents(students);

  displayStudents();

  alert("Student added successfully.");
}

// ==============================================
// EDIT STUDENT
// ==============================================

function editStudent(studentId) {
  const students = getStudents();

  const student = students.find(function (item) {
    return item.id === studentId;
  });

  if (!student) {
    alert("Student record could not be found.");

    return;
  }

  // ============================================
  // GET UPDATED INFORMATION
  // ============================================

  const studentNumber = prompt("Edit student ID number:", student.studentNumber);

  if (!studentNumber) {
    return;
  }

  const name = prompt("Edit student's full name:", student.name);

  if (!name) {
    return;
  }

  const section = prompt("Edit student's section:", student.section);

  if (!section) {
    return;
  }

  // ============================================
  // CHECK DUPLICATE ID
  // ============================================

  const duplicateStudent = students.some(function (item) {
    return item.id !== studentId && item.studentNumber.toLowerCase() === studentNumber.trim().toLowerCase();
  });

  if (duplicateStudent) {
    alert("Another student already has that ID number.");

    return;
  }

  // ============================================
  // UPDATE STUDENT
  // ============================================

  student.studentNumber = studentNumber.trim();

  student.name = name.trim();

  student.section = section.trim();

  // ============================================
  // SAVE CHANGES
  // ============================================

  saveStudents(students);

  displayStudents();

  alert("Student information updated successfully.");
}

// ==============================================
// DELETE STUDENT
// ==============================================

function deleteStudent(studentId) {
  const students = getStudents();

  const student = students.find(function (item) {
    return item.id === studentId;
  });

  if (!student) {
    alert("Student record could not be found.");

    return;
  }

  // ============================================
  // CONFIRM DELETE
  // ============================================

  const confirmed = confirm(`Delete ${student.name} from the student records?`);

  if (!confirmed) {
    return;
  }

  // ============================================
  // REMOVE STUDENT
  // ============================================

  const updatedStudents = students.filter(function (item) {
    return item.id !== studentId;
  });

  // ============================================
  // SAVE UPDATED LIST
  // ============================================

  saveStudents(updatedStudents);

  displayStudents();

  alert("Student record deleted successfully.");
}

// ==============================================
// TABLE BUTTON EVENTS
// ==============================================

if (studentTableBody) {
  studentTableBody.addEventListener("click", function (event) {
    // ========================================
    // EDIT BUTTON
    // ========================================

    const editButton = event.target.closest(".edit-student");

    if (editButton) {
      const studentId = editButton.dataset.id;

      editStudent(studentId);

      return;
    }

    // ========================================
    // DELETE BUTTON
    // ========================================

    const deleteButton = event.target.closest(".delete-student");

    if (deleteButton) {
      const studentId = deleteButton.dataset.id;

      deleteStudent(studentId);

      return;
    }
  });
}

// ==============================================
// SEARCH EVENT
// ==============================================

if (studentSearch) {
  studentSearch.addEventListener("input", searchStudents);
}

// ==============================================
// ADD STUDENT BUTTON
// ==============================================

// Your current students.html does not have
// an Add Student button.
//
// This creates one using the existing button
// classes from your project.

const searchSection = studentSearch?.closest("section");

if (searchSection) {
  const addStudentButton = document.createElement("button");

  addStudentButton.type = "button";

  addStudentButton.className = "btn-primary";

  addStudentButton.textContent = "+ Add Student";

  addStudentButton.addEventListener("click", addStudent);

  searchSection.appendChild(addStudentButton);
}

// ==============================================
// INITIALIZE STUDENTS PAGE
// ==============================================

displayStudents();
