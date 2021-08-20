const submitButton = document.querySelector(".form__button");
const textInput = document.querySelector(".form__input");
const sectionTodolist = document.querySelector(".mainContent");
const form = document.querySelector(".form");
const buttonSortSuccess = document.getElementById("success");
const buttonSortUnsuccess = document.getElementById("unsuccess");
const buttonSortReset = document.getElementById("reset");
class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }


  getInitialTodolist() {
    return fetch(`${this.baseUrl}/todolist`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.text();
        }
        return Promise.reject(`Ошибка: ${res.status}`)
      })
      .then((html) => {
        sectionTodolist.innerHTML = html;
        const buttonsDeleteTodo = document.querySelectorAll(".todolist__button");
        Array.from(buttonsDeleteTodo).map((item) => {
          item.addEventListener("click", deleteTodo);
        });
        const statusesTodo = document.querySelectorAll(".status");
        Array.from(statusesTodo).map((item) => {
          item.addEventListener("click", changeStatus);
        })
      });
  }

  addItem(item) {
    return fetch(`${this.baseUrl}/todolist`, {
      method: "POST",
      body: JSON.stringify({
        name: item.name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        return res.text();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка: ${res.status}`);
    }).then((html) => {
      const ulSection = sectionTodolist.querySelector('.ulCollection');
      ulSection.insertAdjacentHTML("beforeEnd", html);
      const buttonsDeleteTodos = ulSection.querySelectorAll(".todolist__button");
      const buttonDeleteTodo = buttonsDeleteTodos[buttonsDeleteTodos.length - 1];
      buttonDeleteTodo.addEventListener("click", deleteTodo);
      const statuses = document.querySelectorAll(".status");
      const status = statuses[statuses.length - 1];
      status.addEventListener("click", changeStatus);
    })
  }

  editTodolist(item, id) {
    return fetch(`${this.baseUrl}/todolist/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flag: item,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        // если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
      }).then((result) => {
        const element = document.getElementById(`${result.id}`);
        element.querySelector(".status").textContent = result.flag;
      })
  }

  deleteTodolist(cardId, card) {
    return fetch(`${this.baseUrl}/todolist/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        card.remove();
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }

  getSortSuccessTodolist() {
    return fetch(`${this.baseUrl}/todolist/success`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.text();
        }
        return Promise.reject(`Ошибка: ${res.status}`)
      })
      .then((html) => {
        sectionTodolist.innerHTML = html;
        const buttonsDeleteTodo = document.querySelectorAll(".todolist__button");
        Array.from(buttonsDeleteTodo).map((item) => {
          item.addEventListener("click", deleteTodo);
        });
        const statusesTodo = document.querySelectorAll(".status");
        Array.from(statusesTodo).map((item) => {
          item.addEventListener("click", changeStatus);
        })
      });
  }

  getSortUnsuccessTodolist() {
    return fetch(`${this.baseUrl}/todolist/unsuccess`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.text();
        }
        return Promise.reject(`Ошибка: ${res.status}`)
      })
      .then((html) => {
        sectionTodolist.innerHTML = html;
        const buttonsDeleteTodo = document.querySelectorAll(".todolist__button");
        Array.from(buttonsDeleteTodo).map((item) => {
          item.addEventListener("click", deleteTodo);
        });
        const statusesTodo = document.querySelectorAll(".status");
        Array.from(statusesTodo).map((item) => {
          item.addEventListener("click", changeStatus);
        })
      });
  }
  // другие методы работы с API
}
const api = new Api("http://178.154.198.59/api");
api.getInitialTodolist();
function addTodo(evt) {
  evt.preventDefault();
  api.addItem({ name: textInput.value });
  form.reset();
}
submitButton.addEventListener("click", addTodo);
buttonSortReset.addEventListener("click", resetSort);
buttonSortSuccess.addEventListener("click", sortSuccess);
buttonSortUnsuccess.addEventListener("click", sortUnsuccess);
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
