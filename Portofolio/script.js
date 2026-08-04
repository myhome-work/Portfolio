// Ambil tombol toggle
const themeToggle = document.getElementById("themeToggle");

// Cek tema yang tersimpan di localStorage
let currentTheme = localStorage.getItem("theme");

// Kalau ada tema tersimpan, apply
if (currentTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "🌙"; // dark mode icon
} else {
  themeToggle.textContent = "☀"; // light mode icon
}

// Event listener untuk tombol toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // Update ikon
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "☀";
    localStorage.setItem("theme", "light");
  }
});