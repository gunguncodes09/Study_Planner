// Animate circular progress
const progressCircle = document.getElementById("progress");
const percentageText = document.getElementById("percentage");

let progress = 0;
const target = 75; // target percentage
const radius = 50;
const circumference = 2 * Math.PI * radius;

function updateProgress(value) {
  const offset = circumference - (value / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;
  percentageText.textContent = `${value}%`;
}

// Animate from 0 → target
let interval = setInterval(() => {
  if (progress >= target) {
    clearInterval(interval);
  } else {
    progress++;
    updateProgress(progress);
  }
}, 30);

updateProgress(0);

document.addEventListener("DOMContentLoaded", () => {
  const authModal = document.getElementById("authModal");
  const modalTitle = document.getElementById("modalTitle");
  const nameField = document.getElementById("nameField");
  const extraFields = document.getElementById("extraFields");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const closeModal = document.getElementById("closeModal");
  const educationSelect = document.getElementById("education");
  const dynamicFields = document.getElementById("dynamicFields");

  // Open Login Modal
  loginBtn.addEventListener("click", () => {
    modalTitle.textContent = "Login";
    nameField.classList.add("hidden");
    extraFields.classList.add("hidden");
    authModal.classList.remove("hidden");
  });

  // Open Signup Modal
  signupBtn.addEventListener("click", () => {
    modalTitle.textContent = "Sign Up";
    nameField.classList.remove("hidden");
    extraFields.classList.remove("hidden");
    authModal.classList.remove("hidden");
  });

  // Close Modal
  closeModal.addEventListener("click", () => {
    authModal.classList.add("hidden");
  });

  // Dynamic Education Fields
  educationSelect.addEventListener("change", () => {
    dynamicFields.innerHTML = "";
    const value = educationSelect.value;

    if (value === "be" || value === "me") {
      dynamicFields.innerHTML = `
        <div>
          <label class="block font-medium text-gray-700">Branch</label>
          <select class="w-full px-4 py-2 border rounded-lg">
            <option>Computer</option>
            <option>IT</option>
            <option>Civil</option>
            <option>Mechanical</option>
            <option>Electrical</option>
          </select>
        </div>
        <div>
          <label class="block font-medium text-gray-700">Year</label>
          <input type="number" class="w-full px-4 py-2 border rounded-lg" placeholder="Year">
        </div>
        <div>
          <label class="block font-medium text-gray-700">Semester</label>
          <input type="number" class="w-full px-4 py-2 border rounded-lg" placeholder="Semester">
        </div>
      `;
    } else if (value === "school") {
      dynamicFields.innerHTML = `
        <div>
          <label class="block font-medium text-gray-700">Standard</label>
          <input type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="E.g. 10th, 12th">
        </div>
      `;
    }
  });
});