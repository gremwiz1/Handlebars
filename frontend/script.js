const Api = require("./utils/Api");

const submitButton = document.querySelector(".form__button");
const textInput = document.querySelector(".form__input");
const sectionTodolist = document.querySelector(".mainContent");
const form = document.querySelector(".form");
const buttonSortSuccess = document.getElementById("success");
const buttonSortUnsuccess = document.getElementById("unsuccess");
const buttonSortReset = document.getElementById("reset");

function addTodo(evt) {
  evt.preventDefault();
  api.addItem({ name: textInput.value });
  form.reset();
}
function deleteTodo(evt) {
  const parentElement = evt.target.closest("li");
  api.deleteTodolist(parentElement.id, parentElement);
}
function changeStatus(evt) {
  const parentElement = evt.target.closest("li");
  api.editTodolist(evt.target.textContent, parentElement.id);
}
function resetSort() {
  const oldTodoList = document.querySelector(".ulCollection");
  oldTodoList.remove();
  api.getInitialTodolist();
}
function sortSuccess() {
  const oldTodoList = document.querySelector(".ulCollection");
  oldTodoList.remove();
  api.getSortSuccessTodolist();
}
function sortUnsuccess() {
  const oldTodoList = document.querySelector(".ulCollection");
  oldTodoList.remove();
  api.getSortUnsuccessTodolist();
}
const api = new Api("http://178.154.198.59/api", changeStatus, deleteTodo, sectionTodolist);
api.getInitialTodolist();
submitButton.addEventListener("click", addTodo);
buttonSortReset.addEventListener("click", resetSort);
buttonSortSuccess.addEventListener("click", sortSuccess);
buttonSortUnsuccess.addEventListener("click", sortUnsuccess);
