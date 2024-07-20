document.addEventListener('DOMContentLoaded', () => {
    const maintenanceForm = document.getElementById('maintenance-form');
    const maintenanceInput = document.getElementById('maintenance-input');
    const categorySelect = document.getElementById('category-select');
    const dueDateInput = document.getElementById('due-date');
    const maintenanceList = document.getElementById('maintenance-list');

    const filterAllButton = document.getElementById('filter-all');
    const filterCompleteButton = document.getElementById('filter-complete');
    const filterIncompleteButton = document.getElementById('filter-incomplete');

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

    maintenanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newMaintenanceText = maintenanceInput.value.trim();
        const category = categorySelect.value;
        const dueDate = dueDateInput.value;

        if (newMaintenanceText && category && dueDate) {
            const newMaintenanceItem = document.createElement('li');
            newMaintenanceItem.className = 'list-group-item';
            
            newMaintenanceItem.innerHTML = `
                <div>
                    <strong>${newMaintenanceText}</strong><br>
                    <small>Category: ${category}</small><br>
                    <small>Due: ${new Date(dueDate).toLocaleDateString()}</small>
                </div>
                <button>Complete</button>
            `;

            const completeButton = newMaintenanceItem.querySelector('button');
            completeButton.addEventListener('click', () => {
                newMaintenanceItem.classList.toggle('completed');
            });

            maintenanceList.appendChild(newMaintenanceItem);

            maintenanceInput.value = '';
            categorySelect.value = '';
            dueDateInput.value = '';
        }
    });

    filterAllButton.addEventListener('click', () => filterTasks('all'));
    filterCompleteButton.addEventListener('click', () => filterTasks('complete'));
    filterIncompleteButton.addEventListener('click', () => filterTasks('incomplete'));
});
