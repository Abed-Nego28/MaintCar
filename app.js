document.addEventListener('DOMContentLoaded', () => {
    const maintenanceForm = document.getElementById('maintenance-form');
    const maintenanceInput = document.getElementById('maintenance-input');
    const categorySelect = document.getElementById('category-select');
    const dueDateInput = document.getElementById('due-date');
    const prioritySelect = document.getElementById('priority-select');
    const maintenanceList = document.getElementById('maintenance-list');

    const filterAllButton = document.getElementById('filter-all');
    const filterCompleteButton = document.getElementById('filter-complete');
    const filterIncompleteButton = document.getElementById('filter-incomplete');

    const sortDateButton = document.getElementById('sort-date');
    const sortPriorityButton = document.getElementById('sort-priority');

    const filterTasks = (status) => {
        const items = maintenanceList.querySelectorAll('.list-group-item');
        items.forEach(item => {
            if (status === 'all') {
                item.style.display = 'flex';
            } else if (status === 'complete') {
                item.style.display = item.classList.contains('completed') ? 'flex' : 'none';
            } else if (status === 'incomplete') {
                item.style.display = !item.classList.contains('completed') ? 'flex' : 'none';
            }
        });
    };

    const sortTasks = (criteria) => {
        const items = Array.from(maintenanceList.querySelectorAll('.list-group-item'));
        items.sort((a, b) => {
            if (criteria === 'date') {
                return new Date(a.dataset.dueDate) - new Date(b.dataset.dueDate);
            } else if (criteria === 'priority') {
                const priorities = { 'High': 1, 'Medium': 2, 'Low': 3 };
                return priorities[a.dataset.priority] - priorities[b.dataset.priority];
            }
        });
        items.forEach(item => maintenanceList.appendChild(item));
    };

    maintenanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newMaintenanceText = maintenanceInput.value.trim();
        const category = categorySelect.value;
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;

        if (newMaintenanceText && category && dueDate && priority) {
            const newMaintenanceItem = document.createElement('li');
            newMaintenanceItem.className = `list-group-item priority-${priority.toLowerCase()}`;
            newMaintenanceItem.dataset.dueDate = dueDate;
            newMaintenanceItem.dataset.priority = priority;
            
            newMaintenanceItem.innerHTML = `
                <div>
                    <strong>${newMaintenanceText}</strong><br>
                    <small>Category: ${category}</small><br>
                    <small>Due: ${new Date(dueDate).toLocaleDateString()}</small><br>
                    <small>Priority: ${priority}</small>
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
            });

            const editButton = newMaintenanceItem.querySelector('.edit-btn');
            editButton.addEventListener('click', () => {
                maintenanceInput.value = newMaintenanceText;
                categorySelect.value = category;
                dueDateInput.value = dueDate;
                prioritySelect.value = priority;
                maintenanceList.removeChild(newMaintenanceItem);
            });

            const deleteButton = newMaintenanceItem.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => {
                maintenanceList.removeChild(newMaintenanceItem);
            });

            maintenanceList.appendChild(newMaintenanceItem);

            maintenanceInput.value = '';
            categorySelect.value = '';
            dueDateInput.value = '';
            prioritySelect.value = '';
        }
    });

    filterAllButton.addEventListener('click', () => filterTasks('all'));
    filterCompleteButton.addEventListener('click', () => filterTasks('complete'));
    filterIncompleteButton.addEventListener('click', () => filterTasks('incomplete'));

    sortDateButton.addEventListener('click', () => sortTasks('date'));
    sortPriorityButton.addEventListener('click', () => sortTasks('priority'));

    // Check for overdue tasks every 24 hours
    setInterval(() => {
        const items = maintenanceList.querySelectorAll('.list-group-item');
        items.forEach(item => {
            const dueDate = new Date(item.dataset.dueDate);
            if (dueDate < new Date() && !item.classList.contains('completed')) {
                item.classList.add('overdue');
                if (!item.querySelector('.alert')) {
                    const alert = document.createElement('div');
                    alert.className = 'alert alert-warning';
                    alert.textContent = 'This task is overdue!';
                    item.appendChild(alert);
                }
            }
        });
    }, 24 * 60 * 60 * 1000); // 24 hours
});
