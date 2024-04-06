// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));



// Todo: create a function to generate a unique task id
function generateTaskId() {
 const TaskNumber = Math.floor(Math.random()* 1000);
 return TaskNumber;
};



// // Todo: create a function to create a task card
function createTaskCard(task) {
  const TaskCard = $(`<div class="task-card draggable" id="${task.TaskNumber}"></div>`);
  TaskCard.css("z-index", 1);

  const cardDeleteBtn = $('<button class="delete-btn">Delete</button>');
  cardDeleteBtn.attr("id", task.TaskNumber);
  cardDeleteBtn.on("click", handleDeleteTask);

  TaskCard.append($("<h3>").text(task.title));
  TaskCard.append($("<p>").text(task.dueDate));
  TaskCard.append($("<p>").text(task.description));

  if (task.dueDate && task.status !== "done") {
    const now = dayjs();
    const TaskDate = dayjs(task.dueDate, "DD/MM/YYYY");

    if (now.isSame(TaskDate, "day")) {
      TaskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(TaskDate)) {
      TaskCard.addClass("bg-danger text-white");
      cardDeleteBtn.addClass("border-light");
    }
  }

  TaskCard.append(cardDeleteBtn);

  TaskCard.draggable();
  return TaskCard;
}



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    
  const toDo =$('#todo-cards')
  toDo.empty ()
  const inProgress = $('#in-progress-cards')
  inProgress.empty ()
  const done = $('#done-cards')
  done.empty()
  let projects =[]
  taskList = JSON.parse(localStorage.getItem("tasks"));

  console.log(taskList)
  if (taskList){
        projects = taskList

      }
      console.log(projects)
    for (let i = 0; i < projects.length; i++) {
      let singleTask = projects[i];
        if (singleTask.status === 'to-do'){
            toDo.append(createTaskCard(singleTask))
        }else  if (singleTask.status === 'in-progress'){
            inProgress.append(createTaskCard(singleTask))
    } else if (singleTask.status === 'done'){
        done.append(createTaskCard(singleTask))
    }}
};

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const title = $('#TaskTitle').val();
  const dueDate = $('#TaskDate').val();
  const description = $('#TaskDiscription').val();
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

 
  const newTask = {
      TaskNumber: generateTaskId(),
      title: title,
      dueDate: dueDate,
      description: description,
      status: 'to-do',
  };

  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  console.log("Saved tasks:", tasks); 

  
  $('.btn-close').click();
  renderTaskList();
};


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  event.preventDefault();

  const taskId = $(this).attr("id");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let upDatedTasks = tasks.filter((tasks) => tasks.TaskNumber != taskId);
  localStorage.setItem("tasks", JSON.stringify(upDatedTasks));

  $(`#${taskId}`).closest(".task-card").remove();

  renderTaskList();
};



// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui)  {
    const taskId = ui.draggable.attr("id");
    const newStatus = $(this).attr("id");
    const taskIndex = taskList.findIndex((task) => task.TaskNumber === taskId);

    console.log(taskId)
console.log(newStatus)

    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const task = tasks.find((task) => task.TaskNumber == taskId);
    task.status = newStatus;
    console.log(tasks);
    console.log(task);
  

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTaskList();
  }



// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  $('#TaskDate').datepicker();

  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
 
  $('#form').on('submit', handleAddTask);
  renderTaskList();
}); 
