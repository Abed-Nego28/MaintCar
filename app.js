document.addEventListener('DOMContentLoaded', () => {
    const maintenanceForm = document.getElementById('maintenance-form');
    const maintenanceInput = document.getElementById('maintenance-input');
    const categorySelect = document.getElementById('category-select');
    const dueDateInput = document.getElementById('due-date-input');
    const prioritySelect = document.getElementById('priority-select');
    const carSelect = document.getElementById('car-select');
    const notesInput = document.getElementById('notes-input');
    const imageUpload = document.getElementById('image-upload');
    const maintenanceList = document.getElementById('maintenance-list');
    const completedTasksDiv = document.getElementById('completed-tasks');
    const pendingTasksDiv = document.getElementById('pending-tasks');
    const filterAllButton = document.getElementById('filter-all');
    const filterCompleteButton = document.getElementById('filter-complete');
    const filterIncompleteButton = document.getElementById('filter-incomplete');
    const sortDateButton = document.getElementById('sort-date');
    const sortPriorityButton = document.getElementById('sort-priority');
    const importDataButton = document.getElementById('import-data');
    const exportDataButton = document.getElementById('export-data');
    const printTasksButton = document.getElementById('print-tasks');
    const emailTasksButton = document.getElementById('email-tasks');
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

    const saveToLocalStorage = () => {
        const tasks = Array.from(maintenanceList.querySelectorAll('.list-group-item')).map(item => ({
            text: item.querySelector('strong').textContent,
            category: item.querySelector('small').textContent.split('Category: ')[1],
            dueDate: item.dataset.dueDate,
            priority: item.dataset.priority,
            car: item.querySelector('small').textContent.split('Car: ')[1],
            notes: item.querySelector('.notes').textContent,
            image: item.querySelector('img') ? item.querySelector('img').src : null,
            completed: item.classList.contains('completed')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadFromLocalStorage = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const newMaintenanceItem = document.createElement('li');
            newMaintenanceItem.className = `list-group-item priority-${task.priority.toLowerCase()}`;
            newMaintenanceItem.dataset.dueDate = task.dueDate;
            newMaintenanceItem.dataset.priority = task.priority;

            newMaintenanceItem.innerHTML = `
                <div>
                    <strong>${task.text}</strong><br>
                    <small>Category: ${task.category}</small><br>
                    <small>Due: ${new Date(task.dueDate).toLocaleDateString()}</small><br>
                    <small>Priority: ${task.priority}</small><br>
                    <small>Car: ${task.car}</small><br>
                    <p class="notes">${task.notes}</p>
                    ${task.image ? `<img src="${task.image}" alt="Maintenance Image" class="mt-2">` : ''}
                </div>
                <div>
                    <button class="complete-btn">Complete</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            if (task.completed) {
                newMaintenanceItem.classList.add('completed');
            }

            maintenanceList.appendChild(newMaintenanceItem);
        });

        updateTaskStatistics();
    };

    const updateTaskStatistics = () => {
        const totalTasks = maintenanceList.querySelectorAll('.list-group-item').length;
        const completedTasks = maintenanceList.querySelectorAll('.list-group-item.completed').length;
        const pendingTasks = totalTasks - completedTasks;

        completedTasksDiv.textContent = `Tâches Complètes: ${completedTasks}`;
        pendingTasksDiv.textContent = `Tâches en Attente: ${pendingTasks}`;
    };

    maintenanceForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const maintenanceText = maintenanceInput.value;
        const category = categorySelect.value;
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;
        const car = carSelect.value;
        const notes = notesInput.value;
        const image = imageUpload.files[0] ? URL.createObjectURL(imageUpload.files[0]) : null;

        const newMaintenanceItem = document.createElement('li');
        newMaintenanceItem.className = `list-group-item priority-${priority.toLowerCase()}`;
        newMaintenanceItem.dataset.dueDate = dueDate;
        newMaintenanceItem.dataset.priority = priority;

        newMaintenanceItem.innerHTML = `
            <div>
                <strong>${maintenanceText}</strong><br>
                <small>Category: ${category}</small><br>
                <small>Due: ${new Date(dueDate).toLocaleDateString()}</small><br>
                <small>Priority: ${priority}</small><br>
                <small>Car: ${car}</small><br>
                <p class="notes">${notes}</p>
                ${image ? `<img src="${image}" alt="Maintenance Image" class="mt-2">` : ''}
            </div>
            <div>
                <button class="complete-btn">Complete</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        maintenanceList.appendChild(newMaintenanceItem);
        saveToLocalStorage();
        updateTaskStatistics();

        maintenanceForm.reset();
        imageUpload.value = '';
    });

    maintenanceList.addEventListener('click', (e) => {
        const target = e.target;
        const item = target.closest('.list-group-item');

        if (target.classList.contains('complete-btn')) {
            item.classList.toggle('completed');
            saveToLocalStorage();
            updateTaskStatistics();
        } else if (target.classList.contains('edit-btn')) {
            const newText = prompt('Modifier la tâche:', item.querySelector('strong').textContent);
            if (newText) {
                item.querySelector('strong').textContent = newText;
                saveToLocalStorage();
            }
        } else if (target.classList.contains('delete-btn')) {
            item.remove();
            saveToLocalStorage();
            updateTaskStatistics();
        }
    });

    filterAllButton.addEventListener('click', () => {
        filterAllButton.classList.add('active');
        filterCompleteButton.classList.remove('active');
        filterIncompleteButton.classList.remove('active');
        maintenanceList.querySelectorAll('.list-group-item').forEach(item => item.style.display = 'block');
    });

    filterCompleteButton.addEventListener('click', () => {
        filterAllButton.classList.remove('active');
        filterCompleteButton.classList.add('active');
        filterIncompleteButton.classList.remove('active');
        maintenanceList.querySelectorAll('.list-group-item').forEach(item => item.style.display = item.classList.contains('completed') ? 'block' : 'none');
    });

    filterIncompleteButton.addEventListener('click', () => {
        filterAllButton.classList.remove('active');
        filterCompleteButton.classList.remove('active');
        filterIncompleteButton.classList.add('active');
        maintenanceList.querySelectorAll('.list-group-item').forEach(item => item.style.display = item.classList.contains('completed') ? 'none' : 'block');
    });

    sortDateButton.addEventListener('click', () => {
        const items = Array.from(maintenanceList.querySelectorAll('.list-group-item'));
        items.sort((a, b) => new Date(a.dataset.dueDate) - new Date(b.dataset.dueDate));
        items.forEach(item => maintenanceList.appendChild(item));
        saveToLocalStorage();
    });

    sortPriorityButton.addEventListener('click', () => {
        const priorityOrder = { 'haute': 1, 'moyenne': 2, 'basse': 3 };
        const items = Array.from(maintenanceList.querySelectorAll('.list-group-item'));
        items.sort((a, b) => priorityOrder[a.dataset.priority.toLowerCase()] - priorityOrder[b.dataset.priority.toLowerCase()]);
        items.forEach(item => maintenanceList.appendChild(item));
        saveToLocalStorage();
    });

    importDataButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const tasks = JSON.parse(event.target.result);
                    maintenanceList.innerHTML = '';
                    tasks.forEach(task => {
                        const newMaintenanceItem = document.createElement('li');
                        newMaintenanceItem.className = `list-group-item priority-${task.priority.toLowerCase()}`;
                        newMaintenanceItem.dataset.dueDate = task.dueDate;
                        newMaintenanceItem.dataset.priority = task.priority;

                        newMaintenanceItem.innerHTML = `
                            <div>
                                <strong>${task.text}</strong><br>
                                <small>Category: ${task.category}</small><br>
                                <small>Due: ${new Date(task.dueDate).toLocaleDateString()}</small><br>
                                <small>Priority: ${task.priority}</small><br>
                                <small>Car: ${task.car}</small><br>
                                <p class="notes">${task.notes}</p>
                                ${task.image ? `<img src="${task.image}" alt="Maintenance Image" class="mt-2">` : ''}
                            </div>
                            <div>
                                <button class="complete-btn">Complete</button>
                                <button class="edit-btn">Edit</button>
                                <button class="delete-btn">Delete</button>
                            </div>
                        `;

                        if (task.completed) {
                            newMaintenanceItem.classList.add('completed');
                        }

                        maintenanceList.appendChild(newMaintenanceItem);
                    });
                    updateTaskStatistics();
                    saveToLocalStorage();
                };
                reader.readAsText(file);
            }
        });
        input.click();
    });

    exportDataButton.addEventListener('click', () => {
        const tasks = Array.from(maintenanceList.querySelectorAll('.list-group-item')).map(item => ({
            text: item.querySelector('strong').textContent,
            category: item.querySelector('small').textContent.split('Category: ')[1],
            dueDate: item.dataset.dueDate,
            priority: item.dataset.priority,
            car: item.querySelector('small').textContent.split('Car: ')[1],
            notes: item.querySelector('.notes').textContent,
            image: item.querySelector('img') ? item.querySelector('img').src : null,
            completed: item.classList.contains('completed')
        }));
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'maintenance-tasks.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    printTasksButton.addEventListener('click', () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Tasks</title>');
        printWindow.document.write('<link rel="stylesheet" href="styles.css">');
        printWindow.document.write('</head><body >');
        printWindow.document.write('<h1>Liste des Tâches de Maintenance</h1>');
        printWindow.document.write(document.getElementById('maintenance-list').outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    });

    emailTasksButton.addEventListener('click', () => {
        const tasks = Array.from(maintenanceList.querySelectorAll('.list-group-item')).map(item => ({
            text: item.querySelector('strong').textContent,
            category: item.querySelector('small').textContent.split('Category: ')[1],
            dueDate: item.dataset.dueDate,
            priority: item.dataset.priority,
            car: item.querySelector('small').textContent.split('Car: ')[1],
            notes: item.querySelector('.notes').textContent,
            image: item.querySelector('img') ? item.querySelector('img').src : null,
            completed: item.classList.contains('completed')
        }));
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const mailtoLink = `mailto:?subject=Liste des Tâches de Maintenance&body=Voici la liste des tâches de maintenance en pièce jointe.%0A%0A${url}`;
        window.location.href = mailtoLink;
        URL.revokeObjectURL(url);
    });

    toggleDarkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    loadFromLocalStorage();
});
