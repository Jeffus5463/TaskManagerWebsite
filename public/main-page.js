document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskModal = document.getElementById('taskModal');
    const modifyModal = document.getElementById('modifyModal');
    const closeModal = document.querySelectorAll('.close');
    const taskForm = document.getElementById('taskForm');
    const sortSelect = document.getElementById('sortSelect');
    const saveChangesBtn = document.getElementById('saveChanges');
    const logoutBtn = document.getElementById('logoutBtn');

    // Initial fetch tasks in ascending order
    fetchTasks('asc');

    // Show add task modal when "Add Task" button is clicked
    addTaskBtn.addEventListener('click', function() {
        taskModal.style.display = 'block';
    });

    // Close a modal when the close button is clicked
    closeModal.forEach(function(button) {
        button.addEventListener('click', function() {
            taskModal.style.display = 'none';
            modifyModal.style.display = 'none';
        });
    });

    // When user clicks "Submit" button in the add task modal
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Retrieve the values from the form
        const taskName = document.getElementById('taskName').value;
        const course = document.getElementById('course').value;
        const taskDate = document.getElementById('taskDate').value;
        const urgent = document.getElementById('urgent').checked ? 1 : 0;

        // Call add task function and pass parameters, also closes modal
        addTask(taskName, course, taskDate, urgent);
        taskModal.style.display = 'none';
        taskForm.reset();
    });

    // Fetch and display tasks when sort order is changed
    sortSelect.addEventListener('change', function() {
        fetchTasks(this.value);
    });

    // When save changes is clicked, this is during modification of task in the modify modal
    saveChangesBtn.addEventListener('click', function(event) {
        event.preventDefault();

        // Retrieving values from the modify form
        const modifyTaskName = document.getElementById('modifyTaskName').value;
        const modifyCourse = document.getElementById('modifyCourse').value;
        const modifyTaskDate = document.getElementById('modifyTaskDate').value;
        const modifyUrgent = document.getElementById('modifyUrgent').checked ? 1 : 0;
        const taskId = document.getElementById('modifyTaskId').value;

        // Call modify task function and close the modal
        modifyTask(taskId, modifyTaskName, modifyCourse, modifyTaskDate, modifyUrgent);
        modifyModal.style.display = 'none';
    });

    // When user clicks logout in the sidebar
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
<<<<<<< HEAD

        // Destroy the session on the server, then redirect
        fetch('/logout', { method: 'POST' })
            .catch(error => console.error('Error logging out:', error))
            .finally(() => {
                sessionStorage.removeItem('username');
                window.location.href = 'index.html';
            });
=======
        window.location.href = 'index.html';
>>>>>>> 6920664a44bf12a8a64469dfa46b012fa544a47a
    });

    // Fetches the tasks from the server and displays them
    function fetchTasks(sortOrder) {
        let url = '/tasks';
        if (sortOrder) {
            url += `?sort=${sortOrder}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(tasks => {

                // Converts task dates to date objects and sort them
                tasks.forEach(task => {
                    task.date = new Date(task.date);
                });

                tasks.sort((a, b) => {
                    if (sortOrder === 'asc') {
                        return a.date - b.date;
                    } else {
                        return b.date - a.date;
                    }
                });

                // Clear the task list and populate it with sorted tasks
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('task-list-item');

                    const leftContainer = document.createElement('div');
                    leftContainer.classList.add('left-container');

                    const taskNameElement = document.createElement('span');
                    taskNameElement.textContent = task.name;
                    taskNameElement.classList.add('task-detail', 'task-name');

                    const courseElement = document.createElement('span');
                    courseElement.textContent = task.course;
                    courseElement.classList.add('task-detail', 'course');

                    const dateElement = document.createElement('span');
                    dateElement.textContent = formatDate(task.date);
                    dateElement.classList.add('task-detail', 'date');

                    const urgencyElement = document.createElement('span');
                    urgencyElement.textContent = task.urgent ? 'Urgent' : 'Not Urgent';
                    urgencyElement.classList.add('task-detail', 'urgency');

                    leftContainer.appendChild(taskNameElement);
                    leftContainer.appendChild(courseElement);
                    leftContainer.appendChild(dateElement);
                    leftContainer.appendChild(urgencyElement);

                    listItem.appendChild(leftContainer);

                    const rightContainer = document.createElement('div');
                    rightContainer.classList.add('right-container');

                    const buttonContainer = document.createElement('div');
                    buttonContainer.classList.add('button-container');

                    const modifyButton = document.createElement('button');
                    modifyButton.textContent = 'Modify';
                    modifyButton.classList.add('button', 'modify-button');
                    modifyButton.addEventListener('click', function() {
                        fetchTaskDetails(task.id);
                    });

                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('button', 'delete-button');
                    const deleteIcon = document.createElement('img');
                    deleteIcon.src = 'images/trash-can-icon.jpg';
                    deleteIcon.alt = 'Delete';
                    deleteIcon.width = 30;
                    deleteIcon.height = 30;
                    deleteButton.appendChild(deleteIcon);
                    deleteButton.addEventListener('click', function() {
                        deleteTask(task.id);
                    });

                    buttonContainer.appendChild(modifyButton);
                    buttonContainer.appendChild(deleteButton);

                    rightContainer.appendChild(buttonContainer);

                    listItem.appendChild(rightContainer);

                    taskList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Add a new task to the database
    function addTask(name, course, date, urgent) {
        fetch('/add-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                course: course,
                date: date,
                urgent: urgent
            })
        })
        .then(response => {
            if (response.ok) {
                const sortOrder = sortSelect.value;
                fetchTasks(sortOrder);
            } else {
                console.error('Failed to add task');
            }
        })
        .catch(error => console.error('Error adding task:', error));
    }

    // Format the date to a readable string
    function formatDate(date) {
        const d = new Date(date);
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        const day = d.getDate().toString().padStart(2, '0');
        const monthIndex = d.getMonth();
        const year = d.getFullYear();
        return `${monthNames[monthIndex]} ${day}, ${year}`;
    }

    // Format a date for the input fields
    function formatDateForInput(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Delete a task from the database
    function deleteTask(id) {
        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                const sortOrder = sortSelect.value;
                fetchTasks(sortOrder);
            } else {
                console.error('Failed to delete task');
            }
        })
        .catch(error => console.error('Error deleting task:', error));
    }

    // Modify an existing task in the database
    function modifyTask(id, name, course, date, urgent) {
        fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                course: course,
                date: date,
                urgent: urgent
            })
        })
        .then(response => {
            if (response.ok) {
                const sortOrder = sortSelect.value;
                fetchTasks(sortOrder);
            } else {
                console.error('Failed to modify task');
            }
        })
        .catch(error => console.error('Error modifying task:', error));
    }

    // Fetch details of a specific task by ID
    function fetchTaskDetails(id) {
        fetch(`/tasks/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Task not found');
                }
                return response.json();
            })
            .then(task => {
                populateModifyModal(task);
                modifyModal.style.display = 'block';
                document.getElementById('modifyTaskId').value = task.id;
            })
            .catch(error => {
                console.error('Error fetching task details:', error);
            });
    }

    // Populat the modify modal with task details
    function populateModifyModal(task) {
        document.getElementById('modifyTaskName').value = task.name;
        document.getElementById('modifyCourse').value = task.course;
        document.getElementById('modifyTaskDate').value = formatDateForInput(task.date);
        document.getElementById('modifyUrgent').checked = task.urgent === 1;
    }
});