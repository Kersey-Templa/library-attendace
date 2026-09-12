const dateElement = document.getElementById("todayDate");

const today = new Date();

dateElement.textContent = today.toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
