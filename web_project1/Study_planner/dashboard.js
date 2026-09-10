// dashboard.js: Handles dashboard-specific functionality for StudyPlanner
// Runs after DOM is loaded to ensure all elements are available.

document.addEventListener("DOMContentLoaded", () => {
  // === PROFILE DROPDOWN FUNCTIONALITY ===
  const profileTrigger = document.getElementById("profile-trigger");
  const profileDropdown = document.getElementById("profile-dropdown");
  const logoutBtn = document.getElementById("logout-btn");

  if (profileTrigger && profileDropdown) {
    // Toggle dropdown on avatar click
    profileTrigger.addEventListener("click", () => {
      profileDropdown.classList.toggle("hidden");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!profileTrigger.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.classList.add("hidden");
      }
    });
  }

  if (logoutBtn) {
    // Logout functionality: Clear token and redirect
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userToken");
      alert("Logged out successfully!");
      window.location.href = "index.html";
    });
  }

  // Dynamically set user info from localStorage
  if (profileDropdown) {
    const userName = localStorage.getItem("userName") || "Gungun";
    const userEmail = localStorage.getItem("userEmail") || "gungun@example.com";
    document.querySelector("#profile-dropdown h3").textContent = userName;
    document.querySelector("#profile-dropdown p").textContent = userEmail;
  }

  // Update greeting with current date/time
  const greeting = document.querySelector("h1");
  const dateTime = document.querySelector("h1 + p");
  const tasksInfo = document.querySelector("h1 + p + p");
  if (greeting && dateTime && tasksInfo) {
    const now = new Date();
    const options = {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };
    const formattedDateTime = now.toLocaleString("en-US", options).replace(" at", ", ");
    greeting.textContent = `Good ${now.getHours() < 12 ? "Morning" : now.getHours() < 17 ? "Afternoon" : "Evening"}, ${userName} 👋`;
    dateTime.textContent = `${formattedDateTime} IST`;
    tasksInfo.textContent = "3 tasks pending - 2 assignments due today"; // Static for now; could be dynamic
  }

  // === TIMER FOR DAILY GOAL ===
  const startBtn = document.querySelector(".bg-indigo-600");
  const resetBtn = document.querySelector(".bg-gray-300");
  const progressCircle = document.getElementById("progress");
  const timerText = document.querySelector(".text-sm.text-gray-500");

  if (startBtn && resetBtn && progressCircle && timerText) {
    let timeRemaining = 25 * 60; // 25 minutes in seconds
    let timerInterval = null;
    const totalTime = 25 * 60;
    const circumference = 283; // Matches SVG r=45, 2 * PI * 45

    function updateTimer() {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      timerText.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      const progressFraction = timeRemaining / totalTime;
      const dashOffset = circumference * (1 - progressFraction);
      progressCircle.style.strokeDashoffset = dashOffset;
    }

    function startTimer() {
      if (!timerInterval) {
        timerInterval = setInterval(() => {
          if (timeRemaining > 0) {
            timeRemaining--;
            updateTimer();
          } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Time is up!");
          }
        }, 1000);
      }
    }

    function resetTimer() {
      clearInterval(timerInterval);
      timerInterval = null;
      timeRemaining = totalTime;
      updateTimer();
    }

    startBtn.addEventListener("click", startTimer);
    resetBtn.addEventListener("click", resetTimer);
    updateTimer(); // Initial update
  }

  // === TASK MANAGEMENT ===
  // Task storage: Load from localStorage or initialize
  let tasks = JSON.parse(localStorage.getItem("tasks")) || {
    pending: [],
    overdue: [],
    "daily-goal": [],
    upcoming: [],
    completed: [],
  };

  // Modal and list elements
  const addTaskModal = document.getElementById("add-task-modal");
  const addTaskBtn = document.getElementById("add-task-btn");
  const closeModalBtn = document.querySelector(".close");
  const cancelBtn = document.querySelector(".cancel-btn");
  const addTaskForm = document.getElementById("add-task-form");
  const listMap = {
    pending: document.querySelector(".bg-white p-6 rounded-xl.shadow-lg:nth-child(1) ul"),
    overdue: document.querySelector(".bg-white p-6 rounded-xl.shadow-lg:nth-child(2)"),
    "daily-goal": document.querySelector(".lg:col-span-2 ul"),
    upcoming: document.querySelector(".bg-white p-6 rounded-xl.shadow-lg:nth-child(4) ul"),
    completed: null, // No completed list in HTML yet; add <ul id="completed-list"> if needed
  };

  // Helper: Get priority badge HTML
  function getPriorityBadge(priority) {
    const className = `priority-${priority}`;
    return `<span class="${className} priority-badge">[${priority.toUpperCase()}]</span>`;
  }

  // Helper: Render a single task
  function renderTask(task, category) {
    const listElement = listMap[category];
    if (!listElement) return;

    const taskItem = document.createElement("li");
    taskItem.className = `task-item flex items-center space-x-2 ${task.completed ? "completed" : ""}`;
    taskItem.innerHTML = `
      <input type="checkbox" class="w-4 h-4 text-indigo-600 rounded" ${task.completed ? "checked" : ""}>
      <span>${getPriorityBadge(task.priority)} ${task.title} ${task.due ? `(Due: ${task.due})` : ""}</span>
      ${task.desc ? `<br><small class="text-gray-500">${task.desc}</small>` : ""}
    `;

    // Checkbox event: Toggle completion
    const checkbox = taskItem.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      if (checkbox.checked) {
        task.completedDate = new Date().toISOString().split("T")[0];
        if (listMap.completed) listMap.completed.appendChild(taskItem);
        tasks.completed.push(task);
        tasks[task.category] = tasks[task.category].filter((t) => t !== task);
        task.category = "completed";
      } else {
        task.completedDate = null;
        const originalList = listMap[task.originalCategory || task.category];
        if (originalList) originalList.appendChild(taskItem);
        tasks[task.originalCategory || task.category].push(task);
        tasks.completed = tasks.completed.filter((t) => t !== task);
        task.category = task.originalCategory || task.category;
      }
      saveTasks();
    });

    if (listElement.tagName === "DIV") {
      listElement.innerHTML = `<div class="flex items-center space-x-2 mb-4"><span class="w-2 h-2 bg-orange-500 rounded-full"></span><span class="text-orange-600 font-medium">${task.title}</span></div><p class="text-sm text-gray-500">1 overdue task</p>`;
    } else {
      listElement.appendChild(taskItem);
    }
  }

  // Helper: Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Helper: Add new task
  function addNewTask(newTask) {
    newTask.priority = newTask.priority || "medium";
    newTask.completed = false;
    newTask.createdDate = new Date().toISOString().split("T")[0];
    newTask.originalCategory = newTask.category;
    tasks[newTask.category].push(newTask);
    renderTask(newTask, newTask.category);
    saveTasks();
  }

  // Load and render tasks, check for overdue
  function loadTasks() {
    const today = new Date().toISOString().split("T")[0]; // Current date: 2025-10-08
    Object.keys(tasks).forEach((category) => {
      tasks[category].forEach((task) => renderTask(task, category));
    });

    // Auto-move overdue tasks
    ["pending", "daily-goal", "upcoming"].forEach((cat) => {
      tasks[cat] = tasks[cat].filter((task) => {
        if (task.due && task.due < today && !task.completed) {
          task.category = "overdue";
          renderTask(task, "overdue");
          tasks.overdue.push(task);
          return false;
        }
        return true;
      });
    });
    saveTasks();
  }

  // Modal: Show on + button click
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
      addTaskModal.classList.remove("hidden");
    });
  }

  // Modal: Close buttons
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => addTaskModal.classList.add("hidden"));
  }
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => addTaskModal.classList.add("hidden"));
  }

  // Close on outside click or ESC
  if (addTaskModal) {
    window.addEventListener("click", (event) => {
      if (event.target === addTaskModal) addTaskModal.classList.add("hidden");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") addTaskModal.classList.add("hidden");
    });
  }

  // Form submit: Add task
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = document.getElementById("task-title").value;
      const priority = document.getElementById("task-priority").value;
      const due = document.getElementById("task-due").value;
      const category = document.getElementById("task-category").value;
      const desc = document.getElementById("task-desc").value;

      if (!title) {
        alert("Task title is required!");
        return;
      }

      const newTask = { title, priority, due, category, desc };
      addNewTask(newTask);
      addTaskModal.classList.add("hidden");
      addTaskForm.reset();
      document.getElementById("task-priority").value = "medium"; // Reset to default
    });
  }

  // Load tasks on page load
  loadTasks();
});