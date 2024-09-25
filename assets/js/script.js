// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
let taskNameInput = $('#taskTitle');
let taskDueDateInput = $('#taskDueDate');
let taskDescriptionInput = $('#taskDescription');
const saveTaskButton = $('#save-task');
const taskToDo = $('#todo-cards');
const taskInProgress = $('#in-progress-cards');
const taskDone = $('#done-cards');
const swimLanes = $('.swim-lanes');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const id = nextId;
    nextId++;
    localStorage.setItem('nextId', JSON.stringify(nextId))
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $('<div>')
        .addClass('card project-card draggable my-3')
        .attr('tasknumber', task.taskId);

    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger')
        .text('Delete')
        .attr('tasknumber', task.taskId);

    // Add background color based on due date and status
    if (task.dueDate && task.status !== 'done') {
        const today = dayjs();
        const dueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if (today.isSame(dueDate, 'day')) {
            card.addClass('bg-warning text-white');
        } else if (today.isAfter(dueDate)) {
            card.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('bg-light border-light text-dark');
        }
    }

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    card.append(cardHeader, cardBody);
    taskToDo.append(card);
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    taskToDo.empty();
    taskInProgress.empty();
    taskDone.empty();

    for (let task of taskList) {
        const card = createTaskCard(task);
        if (task.status === "to-do") {
            taskToDo.append(card);
        } else if (task.status === "in-progress") {
            taskInProgress.append(card);
        } else if (task.status === "done") {
            taskDone.append(card);
        }
    }

    $('.draggable').draggable({
        zIndex: 100
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    const taskTitle = $('#task-title').val().trim();
    const taskDescription = $('#task-description').val().trim();
    const taskDueDate = $('#task-dueDate').val().trim();

    // need to make sure all fields are required
    if (!taskTitle || !taskDueDate || !taskDescription) {
        alert("Please fill all required fields!");
        return;
    }

    const task = {
        taskId: generateTaskId(),
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        status: 'to-do'
    };

    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();

    taskNameInput.val('');
    taskDueDateInput.val('');
    taskDescriptionInput.val('');
    $('#formModal').modal('hide'); // Hides the modal after saving the task
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const deleteId = parseInt(event.target.getAttribute('tasknumber'), 10);

    taskList = taskList.filter(task => task.taskId !== deleteId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = parseInt(ui.draggable.attr('tasknumber'), 10);
    const newStatus = event.target.id;
    taskList = taskList.map(task => {
        if (task.taskId === taskId) {
            task.status = newStatus;
        }
        return task;
    });

    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    // datepicker on the date input field
    $('.datepicker').datepicker({
        dateFormat: 'mm/dd/yy'
    });

    // make the taskcard droppable into a diff swim lane
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    // add a task
    saveTaskButton.on('click', handleAddTask);
    swimLanes.on('click', '.btn-danger', handleDeleteTask); // delete a task
});
