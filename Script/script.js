const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const activeCountEl = document.getElementById('activeCount');
const completedCountEl = document.getElementById('completedCount');
const totalCountEl = document.getElementById('totalCount');

let tasks = [];

if (localStorage.getItem('todos')) {
  tasks = JSON.parse(localStorage.getItem('todos'));
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('todos', JSON.stringify(tasks));
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  totalCountEl.textContent = total;
  activeCountEl.textContent = active;
  completedCountEl.textContent = completed;
}

function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = `task-item ${task.completed ? 'completed' : ''}`;
  div.dataset.id = task.id;

  div.innerHTML = `
    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
    <span class="task-text">${task.text}</span>
    <button class="delete-btn">×</button>
  `;

  div.querySelector('.checkbox').addEventListener('change', () => {
    task.completed = !task.completed;
    div.classList.toggle('completed');
    saveTasks();
    updateStats();
  });

  div.querySelector('.delete-btn').addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== task.id);
    div.remove();
    saveTasks();
    updateStats();
  });

  return div;
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    taskList.appendChild(createTaskElement(task));
  });
  updateStats();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(newTask);
  taskList.appendChild(createTaskElement(newTask));
  taskInput.value = '';

  saveTasks();
  updateStats();
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

renderTasks();