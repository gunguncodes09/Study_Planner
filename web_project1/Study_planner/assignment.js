
// =============================
// 🔹 PROFILE DROPDOWN FUNCTIONALITY
// =============================

// Select the profile trigger (the circle with 'G') and the dropdown menu
const profileTrigger = document.getElementById("profile-trigger");
const profileDropdown = document.getElementById("profile-dropdown");

// When user clicks on the profile icon, toggle dropdown visibility
profileTrigger.addEventListener("click", () => {
  profileDropdown.classList.toggle("hidden");
});

// Close dropdown if user clicks outside the profile area
document.addEventListener("click", (event) => {
  if (!profileTrigger.contains(event.target) && !profileDropdown.contains(event.target)) {
    profileDropdown.classList.add("hidden");
  }
});

// =============================
// 🔹 LOGOUT BUTTON FUNCTIONALITY
// =============================

// Select logout button
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // Optional confirmation popup
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Redirect to homepage after confirmation
      window.location.href = "index.html"; // ✅ redirects to homepage
    }
  });
}

// =============================
// 🔹 SEARCH BAR FUNCTIONALITY
// =============================

// Function to search assignments based on input text
function searchAssignments() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.getElementsByClassName("assignment-card");

  // Loop through each assignment card
  for (let i = 0; i < cards.length; i++) {
    const cardText = cards[i].innerText.toLowerCase();
    if (cardText.includes(input)) {
      cards[i].style.display = ""; // show if match found
    } else {
      cards[i].style.display = "none"; // hide if not matching
    }
  }
}

// =============================
// ✅ END OF FILE
// =============================

// This script handles:
// 1️⃣ Toggling the profile dropdown menu.
// 2️⃣ Closing it when clicking outside.
// 3️⃣ Searching/filtering assignment cards live.
// 4️⃣ Redirecting to homepage (index.html) on logout.





// ===================================
// 🔹 ADD NEW ASSIGNMENT MODAL & FORM 🔹
// ===================================

// Get all the necessary elements from the DOM
const addAssignmentBtn = document.getElementById("add-assignment-btn");
const modal = document.getElementById("add-task-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const addTaskForm = document.getElementById("add-task-form");
const assignmentsGrid = document.querySelector(".grid"); // The container for all assignment cards

// --- MODAL VISIBILITY ---

// Show the modal when the floating button is clicked
addAssignmentBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Hide the modal when the close button (X) is clicked
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Hide the modal if the user clicks on the dark overlay background
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

// --- FORM SUBMISSION ---

// Handle the form submission to create and add a new assignment
addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get values from the form inputs
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const dueDate = document.getElementById("task-due-date").value;
  const priority = document.getElementById("task-priority").value;

  // Create the HTML for the new assignment card using the form data
  const newAssignmentCardHTML = `
    <div class="assignment-card">
      <div class="flex justify-between items-start">
        <h3 class="font-semibold text-lg text-gray-800">${title}</h3>
        <div class="flex space-x-2 text-gray-500">
          <button class="hover:text-indigo-600">✏️</button>
          <button class="hover:text-red-500">🗑️</button>
        </div>
      </div>
      <p class="text-gray-600 text-sm mt-1">${description}</p>
      <div class="flex justify-between items-center mt-3">
        ${getPriorityBadge(priority)}
        <span class="text-sm text-gray-500">Due: ${formatDate(dueDate)}</span>
      </div>
    </div>
  `;

  // Add the new card to the grid
  assignmentsGrid.insertAdjacentHTML('beforeend', newAssignmentCardHTML);
  
  // Reset the form fields for the next entry
  addTaskForm.reset();
  
  // Hide the modal
  modal.classList.add("hidden");
});

// --- HELPER FUNCTIONS ---

// Helper function to create a priority badge based on the selected priority
function getPriorityBadge(priority) {
  if (priority === "high") {
    return '<span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">High Priority</span>';
  } else if (priority === "medium") {
    return '<span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Medium Priority</span>';
  } else {
    return '<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Low Priority</span>';
  }
}

// Helper function to format the date nicely
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString + 'T00:00:00'); // Ensure it's parsed as local time
    return date.toLocaleDateString('en-US', options);
}