let tasks = [];

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priority');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = parseInt(priorityInput.value);

    if (taskText !== '') {
        const newTask = {
            id: Date.now(), 
            text: taskText,
            priority: priority,
            dueDate: dueDate,
            completed: false
        };

        tasks.push(newTask);
        taskInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = '1'; 
        displayTasks();
        saveTasks();
    }
}

function displayTasks() {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = '';

    const filter = document.getElementById('filter').value;

    const filteredTasks = filterTasks(filter);

    filteredTasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        tasksContainer.appendChild(taskElement);
    });

    makeTasksSortable();
}

function createTaskElement(task, index) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.classList.add(getPriorityClass(task.priority));

    taskElement.dataset.id = task.id; 

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(index, 'completed'));
    taskElement.appendChild(checkbox);

    const taskText = document.createElement('span');
    taskText.textContent = `${task.text} (${task.dueDate})`;
    if (task.completed) {
        taskText.classList.add('completed');
    }
    taskText.addEventListener('click', () => editTask(index));
    taskElement.appendChild(taskText);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(index));
    taskElement.appendChild(deleteButton);

    return taskElement;
}

function filterTasks(filter) {
    switch (filter) {
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'uncompleted':
            return tasks.filter(task => !task.completed);
        case 'today':
            return tasks.filter(task => task.dueDate === getTodayDate() && !task.completed);
        case 'upcoming':
            return tasks.filter(task => task.dueDate > getTodayDate() && !task.completed);
        default:
            return tasks;
    }
}

function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
}

function getPriorityClass(priority) {
    switch (priority) {
        case 1:
            return 'low-priority';
        case 2:
            return 'medium-priority';
        case 3:
            return 'high-priority';
        default:
            return '';
    }
}

function toggleTask(index, property) {
    tasks[index][property] = !tasks[index][property];
    displayTasks();
    saveTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    displayTasks();
    saveTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        displayTasks();
    }
}

function makeTasksSortable() {
    const tasksContainer = document.getElementById('tasks');
    const sortable = new Sortable(tasksContainer, {
        animation: 150,
        ghostClass: 'dragging',
        onEnd: () => saveTasksOrder(),
    });
}

function saveTasksOrder() {
    const tasksContainer = document.getElementById('tasks');
    const taskElements = Array.from(tasksContainer.children);

    tasks = tasks.map(task => {
        const order = taskElements.findIndex(element => element.dataset.id == task.id);
        return { ...task, order };
    });

    saveTasks();
}

function editTask(index) {
    const newText = prompt('Edit task:', tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText.trim();
        displayTasks();
        saveTasks();
    }
}


loadTasks();