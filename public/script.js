
        document.addEventListener('DOMContentLoaded', () => {
            const taskForm = document.getElementById('task-form');
            const taskInput = document.getElementById('task-input');
            const taskList = document.getElementById('task-list');
            const taskCount = document.getElementById('task-count');
            const clearCompletedBtn = document.getElementById('clear-completed');
            const filters = document.getElementById('filters');
            const taskFooter = document.getElementById('task-footer');

            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            let currentFilter = 'all';

            // --- Main Render Function ---
            function renderTasks() {
                // Filter tasks based on the current filter
                const filteredTasks = tasks.filter(task => {
                    if (currentFilter === 'active') return !task.completed;
                    if (currentFilter === 'completed') return task.completed;
                    return true; // 'all'
                });

                // Clear current list
                taskList.innerHTML = '';

                // Render tasks or empty state
                if (filteredTasks.length === 0) {
                    renderEmptyState();
                } else {
                    filteredTasks.forEach(task => {
                        const taskElement = createTaskElement(task);
                        taskList.appendChild(taskElement);
                    });
                }
                
                updateUI();
                saveTasks();
            }

            // --- Create Task Element ---
            function createTaskElement(task) {
                const li = document.createElement('li');
                li.className = `task-item flex items-center justify-between p-3 rounded-md transition duration-200 ${task.completed ? 'completed bg-gray-50 dark:bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700'}`;
                li.dataset.id = task.id;

                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'flex items-center gap-3 flex-grow';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.className = 'custom-checkbox flex-shrink-0';
                checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

                const taskText = document.createElement('span');
                taskText.textContent = task.text;
                taskText.className = 'flex-grow break-all';

                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(taskText);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '×';
                deleteBtn.className = 'delete-btn text-red-500 font-bold text-xl leading-none px-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors';
                deleteBtn.addEventListener('click', () => deleteTask(task.id));

                li.appendChild(checkboxContainer);
                li.appendChild(deleteBtn);

                return li;
            }

            // --- Render Empty State ---
            function renderEmptyState() {
                let message = "You're all done for now! 🎉";
                if (currentFilter === 'active') {
                    message = "No active tasks. Time for a break!";
                } else if (currentFilter === 'completed') {
                    message = "No completed tasks yet.";
                } else if (tasks.length === 0) {
                     message = "No tasks yet. Add one to get started!";
                }
                
                taskList.innerHTML = `<li class="text-center text-gray-500 dark:text-gray-400 p-4">${message}</li>`;
            }

            // --- Update UI elements ---
            function updateUI() {
                const activeTasksCount = tasks.filter(t => !t.completed).length;
                taskCount.textContent = activeTasksCount;
                
                // Show/hide footer based on if there are any tasks
                if(tasks.length > 0) {
                    taskFooter.classList.remove('hidden');
                } else {
                    taskFooter.classList.add('hidden');
                }

                // Update active filter button style
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    if (btn.dataset.filter === currentFilter) {
                        btn.classList.add('text-indigo-600', 'dark:text-indigo-400', 'font-medium');
                        btn.classList.remove('text-gray-500');
                    } else {
                        btn.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'font-medium');
                        btn.classList.add('text-gray-500');
                    }
                });
            }

            // --- Event Handlers ---
            function addTask(e) {
                e.preventDefault();
                const text = taskInput.value.trim();
                if (text) {
                    const newTask = {
                        id: Date.now(),
                        text: text,
                        completed: false
                    };
                    tasks.push(newTask);
                    taskInput.value = '';
                    renderTasks();
                }
            }

            function toggleTaskCompletion(id) {
                const task = tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    renderTasks();
                }
            }

            function deleteTask(id) {
                tasks = tasks.filter(t => t.id !== id);
                renderTasks();
            }
            
            function handleFilterClick(e) {
                if(e.target.matches('.filter-btn')) {
                    currentFilter = e.target.dataset.filter;
                    renderTasks();
                }
            }

            function clearCompletedTasks() {
                tasks = tasks.filter(t => !t.completed);
                renderTasks();
            }

            // --- Local Storage ---
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            // --- Initial Setup ---
            taskForm.addEventListener('submit', addTask);
            clearCompletedBtn.addEventListener('click', clearCompletedTasks);
            filters.addEventListener('click', handleFilterClick);
            
            renderTasks(); // Initial render
        });
        
  window.watsonAssistantChatOptions = {
    integrationID: "86bd86cd-2289-45be-83ff-bd17eb2c7005", // The ID of this integration.
    region: "au-syd", // The region your integration is hosted in.
    serviceInstanceID: "bb290488-d04c-46bd-b9b9-0229ebc6d4d3", // The ID of your service instance.
    onLoad: async (instance) => { await instance.render(); }
  };
  setTimeout(function(){
    const t=document.createElement('script');
    t.src="https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
  });
