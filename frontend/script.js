const submitButton = document.querySelector(".form__button");
const textInput = document.querySelector(".form__input");
const sectionTodolist = document.querySelector(".mainContent");
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
        sectionTodolist.body.innerHTML = html;
      })
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
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }

  editTodolist(item) {
    return fetch(`${this.baseUrl}/todolist/${item._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flag: item.flag,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        // если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
      });
  }

  deleteTodolist(card) {
    return fetch(`${this.baseUrl}/todolist/${card}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }
  // другие методы работы с API
}
const api = new Api("http://178.154.198.59/api");
api.getInitialTodolist();
function addTodo(evt) {
  evt.preventDefault();
  api.addItem({ name: textInput.textContent });
  api.getInitialTodolist();
}
submitButton.addEventListener("click", addTodo);
