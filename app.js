document.addEventListener('DOMContentLoaded', () => {
    const maintenanceForm = document.getElementById('maintenance-form');
    const maintenanceInput = document.getElementById('maintenance-input');
    const categorySelect = document.getElementById('category-select');
    const dueDateInput = document.getElementById('due-date');
    const prioritySelect = document.getElementById('priority-select');
    const carSelect = document.getElementById('car-select');
    const notesInput = document.getElementById('notes-input');
    const imageUpload = document.getElementById('image-upload');
    const maintenanceList = document.getElementById('maintenance-list');

    const filterAllButton = document.getElementById('filter-all');
    const filterCompleteButton = document.getElementById('filter-complete');
    const filterIncompleteButton = document.getElementById('filter-incomplete');

    const sortDateButton = document.getElementById('sort-date');
    const sortPriorityButton = document.getElementById('sort-priority');

    const importDataButton = document.getElementById('import-data');
    const exportDataButton = document.getElementById('export-data');

    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
    const statsDiv = document.getElementById('stats');
    const completedTasksDiv = document.getElementById('completed-tasks');
    const pendingTasksDiv = document.getElementById('pending-tasks');

    const saveToLocalStorage = () => {
        const items = Array.from(maintenanceList.querySelectorAll('.list-group-item')).map(item => ({
            text: item.querySelector('strong').textContent,
            category: item.querySelector('small').textContent.split('Category: ')[1],
            dueDate: item.dataset.dueDate,
            priority: item.dataset.priority,
            car: item.querySelector('small').textContent.split('Car: ')[1],
            notes: item.querySelector('.notes').textContent,
            image: item.querySelector('img') ? item.querySelector('img').src : null,
            completed: item.classList.contains('completed')
        }));
        localStorage.setItem('maintenanceTasks', JSON.stringify(items));
    };

    const loadFromLocalStorage = () => {
        const tasks = JSON.parse(localStorage.getItem('maintenanceTasks')) || [];
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

            const completeButton = newMaintenanceItem.querySelector('.complete-btn');
            completeButton.addEventListener('click', () => {
                newMaintenanceItem.classList.toggle('completed');
                saveToLocalStorage();
                calculateStatistics();
            });

            const editButton = newMaintenanceItem.querySelector('.edit-btn');
            editButton.addEventListener('click', () => {
                maintenanceInput.value = task.text;
                categorySelect.value = task.category;
                dueDateInput.value = task.dueDate;
                prioritySelect.value = task.priority;
                carSelect.value = task.car;
                notesInput.value = task.notes;
                if (task.image) {
                    imageUpload.dataset.imageSrc = task.image;
                }
                maintenanceList.removeChild(newMaintenanceItem);
                saveToLocalStorage();
                calculateStatistics();
            });

            const deleteButton = newMaintenanceItem.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => {
                maintenanceList.removeChild(newMaintenanceItem);
                saveToLocalStorage();
                calculateStatistics();
            });

            maintenanceList.appendChild(newMaintenanceItem);
        });
        calculateStatistics();
    };

    const calculateStatistics = () => {
        const totalTasks = maintenanceList.querySelectorAll('.list-group-item').length;
        const completedTasks = maintenanceList.querySelectorAll('.list-group-item.completed').length;
        completedTasksDiv.textContent = `Completed Tasks: ${completedTasks}`;
        pendingTasksDiv.textContent = `Pending Tasks: ${totalTasks - completedTasks}`;
    };

    const filterTasks = (filter) => {
        const items = maintenanceList.querySelectorAll('.list-group-item');
        items.forEach(item => {
            switch (filter) {
                case 'all':
                    item.style.display = '';
                    break;
                case 'complete':
                    item.style.display = item.classList.contains('completed') ? '' : 'none';
                    break;
                case 'incomplete':
                    item.style.display = !item.classList.contains('completed') ? '' : 'none';
                    break;
                default:
                    item.style.display = '';
            }
        });
    };

    const setActiveFilter = (filter) => {
        filterAllButton.classList.remove('active');
        filterCompleteButton.classList.remove('active');
        filterIncompleteButton.classList.remove('active');

        if (filter === 'all') {
            filterAllButton.classList.add('active');
        } else if (filter === 'complete') {
            filterCompleteButton.classList.add('active');
        } else if (filter === 'incomplete') {
            filterIncompleteButton.classList.add('active');
        }
    };

    const sortTasks = (criterion) => {
        const items = Array.from(maintenanceList.querySelectorAll('.list-group-item'));
        items.sort((a, b) => {
            const aValue = criterion === 'date' ? new Date(a.dataset.dueDate) : a.dataset.priority;
            const bValue = criterion === 'date' ? new Date(b.dataset.dueDate) : b.dataset.priority;
            return aValue > bValue ? 1 : -1;
        });
        items.forEach(item => maintenanceList.appendChild(item));
    };

    maintenanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newMaintenanceText = maintenanceInput.value.trim();
        const category = categorySelect.value;
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;
        const car = carSelect.value;
        const notes = notesInput.value.trim();
        const image = imageUpload.files[0] ? URL.createObjectURL(imageUpload.files[0]) : null;

        if (newMaintenanceText && category && dueDate && priority && car) {
            const newMaintenanceItem = document.createElement('li');
            newMaintenanceItem.className = `list-group-item priority-${priority.toLowerCase()}`;
            newMaintenanceItem.dataset.dueDate = dueDate;
            newMaintenanceItem.dataset.priority = priority;

            newMaintenanceItem.innerHTML = `
                <div>
                    <strong>${newMaintenanceText}</strong><br>
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

            const completeButton = newMaintenanceItem.querySelector('.complete-btn');
            completeButton.addEventListener('click', () => {
                newMaintenanceItem.classList.toggle('completed');
                saveToLocalStorage();
                calculateStatistics();
            });

            const editButton = newMaintenanceItem.querySelector('.edit-btn');
            editButton.addEventListener('click', () => {
                maintenanceInput.value = newMaintenanceText;
                categorySelect.value = category;
                dueDateInput.value = dueDate;
                prioritySelect.value = priority;
                carSelect.value = car;
                notesInput.value = notes;
                imageUpload.dataset.imageSrc = image;
                maintenanceList.removeChild(newMaintenanceItem);
                saveToLocalStorage();
                calculateStatistics();
            });

            const deleteButton = newMaintenanceItem.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => {
                maintenanceList.removeChild(newMaintenanceItem);
                saveToLocalStorage();
                calculateStatistics();
            });

            maintenanceList.appendChild(newMaintenanceItem);

            maintenanceInput.value = '';
            categorySelect.value = '';
            dueDateInput.value = '';
            prioritySelect.value = '';
            carSelect.value = '';
            notesInput.value = '';
            imageUpload.value = '';
            saveToLocalStorage();
            calculateStatistics();
        }
    });

    filterAllButton.addEventListener('click', () => {
        filterTasks('all');
        setActiveFilter('all');
    });

    filterCompleteButton.addEventListener('click', () => {
        filterTasks('complete');
        setActiveFilter('complete');
    });

    filterIncompleteButton.addEventListener('click', () => {
        filterTasks('incomplete');
        setActiveFilter('incomplete');
    });

    sortDateButton.addEventListener('click', () => {
        sortTasks('date');
    });

    sortPriorityButton.addEventListener('click', () => {
        sortTasks('priority');
    });

    importDataButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const data = JSON.parse(reader.result);
                maintenanceList.innerHTML = '';
                data.forEach(task => {
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

                    const completeButton = newMaintenanceItem.querySelector('.complete-btn');
                    completeButton.addEventListener('click', () => {
                        newMaintenanceItem.classList.toggle('completed');
                        saveToLocalStorage();
                        calculateStatistics();
                    });

                    const editButton = newMaintenanceItem.querySelector('.edit-btn');
                    editButton.addEventListener('click', () => {
                        maintenanceInput.value = task.text;
                        categorySelect.value = task.category;
                        dueDateInput.value = task.dueDate;
                        prioritySelect.value = task.priority;
                        carSelect.value = task.car;
                        notesInput.value = task.notes;
                        if (task.image) {
                            imageUpload.dataset.imageSrc = task.image;
                        }
                        maintenanceList.removeChild(newMaintenanceItem);
                        saveToLocalStorage();
                        calculateStatistics();
                    });

                    const deleteButton = newMaintenanceItem.querySelector('.delete-btn');
                    deleteButton.addEventListener('click', () => {
                        maintenanceList.removeChild(newMaintenanceItem);
                        saveToLocalStorage();
                        calculateStatistics();
                    });

                    maintenanceList.appendChild(newMaintenanceItem);
                });
                calculateStatistics();
            };
            reader.readAsText(file);
        });
        fileInput.click();
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

    toggleDarkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    loadFromLocalStorage();
});
