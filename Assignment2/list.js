document.addEventListener('DOMContentLoaded', function() {
var tasks = [];
document.querySelector('#newt').onsubmit = function (event){
event.preventDefault();
const li = document.createElement('li');

let taskname = document.querySelector('#tname').value;
let taskpriority = document.querySelector('#tpriority').value;

let statusinput = document.querySelectorAll('[name=tstatus]');
for (let i = 0; i< statusinput.length;i++){
if (statusinput[i].checked){
taskstatus = statusinput[i].value;
}
}
let new_task = `<div class = "newtask"> <span> ${taskname} </span> <span>| ${taskpriority} </span> <span> | ${taskstatus} </span> </div>

<button class = "complete"> Mark as Complete </button> <button class = "remove"> Remove </button>`;

li.innerHTML = new_task

tasks.push(taskname);
document.querySelector('#tlist').append(li);
document.querySelector('#tname').value = '';
return false;

}
document.addEventListener('click', function(event){
taskLI = event.target;
if (taskLI.className === 'remove'){
taskLI.parentElement.remove();

}
if (taskLI.className === 'complete' || taskLI.className === 'completed'){

taskLI.parentElement.querySelector('.newtask').style.textDecoration = "line-through";
taskLI.task_status = "completed";
}
})

});
