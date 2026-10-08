const ACCOUNT_STORAGE_KEY = "libraryAccounts";

const accountForm = document.getElementById("accountForm");
const addAccountButton = document.getElementById("addAccountButton");
const cancelAccountButton = document.getElementById("cancelAccountButton");
const accountFormContainer = document.getElementById("accountFormContainer");
const accountTableBody = document.querySelector(".table tbody");

// ACCOUNT STORAGE

function getAccounts() {
  const accounts = localStorage.getItem(ACCOUNT_STORAGE_KEY);

  if (!accounts) {
    return [];
  }

  try {
    return JSON.parse(accounts);
  } catch (error) {
    console.error("Unable to load accounts:", error);
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

// FORM SHOW / HIDE

function openAccountForm() {
  if (accountFormContainer) {
    accountFormContainer.classList.remove("d-none");
  }

  if (accountForm) {
    accountForm.reset();
  }
}

function closeAccountForm() {
  if (accountFormContainer) {
    accountFormContainer.classList.add("d-none");
  }

  if (accountForm) {
    accountForm.reset();
  }

  accountForm.removeAttribute("data-edit-id");
}

// GENERATE ACCOUNT ID

function generateAccountId() {
  const accounts = getAccounts();

  if (accounts.length === 0) {
    return "ACC-001";
  }

  const numbers = accounts.map((account) => {
    const number = parseInt(account.id?.replace("ACC-", ""), 10);
    return isNaN(number) ? 0 : number;
  });

  const nextNumber = Math.max(...numbers) + 1;

  return `ACC-${String(nextNumber).padStart(3, "0")}`;
}

function displayAccounts() {
  const accounts = getAccounts();

  if (!accountTableBody) {
    return;
  }

  accountTableBody.innerHTML = "";

  if (accounts.length === 0) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td colspan="5" class="text-center">
        No accounts found.
      </td>
    `;

    accountTableBody.appendChild(row);
    return;
  }

  accounts.forEach((account) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${account.id}</td>

      <td>
        ${account.lastname}, ${account.firstname}
      </td>

      <td>
        ${account.status || "Active"}
      </td>

      <td>
        ${account.role}
      </td>

      <td>
        <div class="d-flex items-center gap-2">
          <button
            type="button"
            class="btn-outline edit-account"
            data-id="${account.id}"
            title="Edit Account"
          >
            <span class="fa-solid fa-pen"></span>
          </button>

          <button
            type="button"
            class="btn-danger delete-account"
            data-id="${account.id}"
            title="Delete Account"
          >
            <span class="fa-solid fa-trash"></span>
          </button>
        </div>
      </td>
    `;

    accountTableBody.appendChild(row);
  });
}

// SAVE ACCOUNT

function saveAccount(event) {
  event.preventDefault();

  const lastname = document.getElementById("lastname").value.trim();
  const firstname = document.getElementById("firstname").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const contactNo = document.getElementById("contact-no").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!lastname || !firstname || !username || !password || !role || !contactNo || !email) {
    alert("Please complete all fields.");
    return;
  }

  const accounts = getAccounts();
  const editId = accountForm.getAttribute("data-edit-id");

  // EDIT ACCOUNT

  if (editId) {
    const accountIndex = accounts.findIndex((account) => account.id === editId);

    if (accountIndex !== -1) {
      accounts[accountIndex] = {
        ...accounts[accountIndex],
        lastname,
        firstname,
        username,
        password,
        role,
        contactNo,
        email,
      };
    }
  }

  // ADD ACCOUNT
  else {
    const usernameExists = accounts.some((account) => account.username.toLowerCase() === username.toLowerCase());

    if (usernameExists) {
      alert("Username already exists.");
      return;
    }

    const newAccount = {
      id: generateAccountId(),
      lastname,
      firstname,
      username,
      password,
      role,
      contactNo,
      email,
    };

    accounts.push(newAccount);
  }

  saveAccounts(accounts);
  displayAccounts();
  closeAccountForm();

  alert(editId ? "Account updated successfully." : "Account added successfully.");
}

// EDIT ACCOUNT

function editAccount(id) {
  const accounts = getAccounts();

  const account = accounts.find((item) => item.id === id);

  if (!account) {
    return;
  }

  document.getElementById("lastname").value = account.lastname;
  document.getElementById("firstname").value = account.firstname;
  document.getElementById("username").value = account.username;
  document.getElementById("password").value = account.password;
  document.getElementById("role").value = account.role;
  document.getElementById("contact-no").value = account.contactNo;
  document.getElementById("email").value = account.email;

  accountForm.setAttribute("data-edit-id", account.id);

  openAccountForm();
}

// DELETE ACCOUNT

function deleteAccount(id) {
  const accounts = getAccounts();

  const account = accounts.find((item) => item.id === id);

  if (!account) {
    return;
  }

  const confirmed = confirm(`Are you sure you want to delete ${account.firstname} ${account.lastname}?`);

  if (!confirmed) {
    return;
  }

  const updatedAccounts = accounts.filter((item) => item.id !== id);

  saveAccounts(updatedAccounts);
  displayAccounts();
}

// BUTTON EVENTS

// + Add Account
if (addAccountButton) {
  addAccountButton.addEventListener("click", openAccountForm);
}

// Cancel
if (cancelAccountButton) {
  cancelAccountButton.addEventListener("click", closeAccountForm);
}

// Form submit
if (accountForm) {
  accountForm.addEventListener("submit", saveAccount);
}

// Edit / Delete buttons
if (accountTableBody) {
  accountTableBody.addEventListener("click", (event) => {
    const editButton = event.target.closest(".edit-account");
    const deleteButton = event.target.closest(".delete-account");

    if (editButton) {
      editAccount(editButton.dataset.id);
    }

    if (deleteButton) {
      deleteAccount(deleteButton.dataset.id);
    }
  });
}

// INITIALIZE

// Keep form hidden when page loads
closeAccountForm();

// Display saved accounts
displayAccounts();
