document.addEventListener('DOMContentLoaded', () => {
    const maintenanceForm = document.getElementById('maintenance-form');
    const maintenanceInput = document.getElementById('maintenance-input');
    const maintenanceList = document.getElementById('maintenance-list');

    maintenanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newMaintenanceText = maintenanceInput.value.trim();

        if (newMaintenanceText !== '') {
            const newMaintenanceItem = document.createElement('li');
            newMaintenanceItem.className = 'list-group-item';
            newMaintenanceItem.textContent = newMaintenanceText;

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.addEventListener('click', () => {
                newMaintenanceItem.classList.toggle('completed');
            });

            newMaintenanceItem.appendChild(completeButton);
            maintenanceList.appendChild(newMaintenanceItem);

            maintenanceInput.value = '';
        }
    });
});
