// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
 const id = nextId;
 nextId++;
 localStorage.setItem('nextId', JSON.stringify(nextId))
 return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const taskToDo = $('#todo-cards');
    taskToDo.empty();
    taskList.forEach(task => {
        const card = $('<div>').addClass('card').text(task.title);
        taskToDo.append(card);
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    const taskTitle = $('#task-title').val().trim();
    const taskDescription = $('#task-description').val().trim();
    const taskDueDate = $('#task-dueDate').val().trim();

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

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    // datepicker on the date input field
    $('.datepicker').datepicker({
        dateFormat: 'mm/dd/yy'
    });
    // saving task
    $('#save-task').on('click', handleAddTask);
});
