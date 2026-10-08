import { initNavBar } from "./components/nav-bar/nav-bar.js";
import { getGreeting, getFormattedDate } from "./modules/utils/date.js";

const main = () => {
  const greetingElement = document.getElementById("greeting");
  const dateElement = document.getElementById("todayDate");

  initNavBar();

  if (greetingElement) {
    greetingElement.textContent = getGreeting();
  }

  if (dateElement) {
    dateElement.textContent = getFormattedDate();
  }
};

main();

function setupDropdown(toggleId, menuId, chevronId) {
  const toggle = document.getElementById(toggleId);
  const menu = document.getElementById(menuId);
  const chevron = document.getElementById(chevronId);

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener("click", (event) => {
    event.preventDefault();

    menu.classList.toggle("d-none");

    if (chevron) {
      chevron.classList.toggle("fa-chevron-down");
      chevron.classList.toggle("fa-chevron-up");
    }
  });
}

setupDropdown("schoolToggle", "schoolMenu", "schoolChevron");
setupDropdown("libraryToggle", "libraryMenu", "libraryChevron");
setupDropdown("staffToggle", "staffMenu", "staffChevron");
