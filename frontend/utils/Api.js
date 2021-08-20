class Api {
  constructor(baseUrl, changeStatus, deleteTodo, sectionTodolist) {
    this.baseUrl = baseUrl;
    this.changeStatus = changeStatus;
    this.deleteTodo = deleteTodo;
    this.sectionTodolist = sectionTodolist;
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
        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .then((html) => {
        this.sectionTodolist.innerHTML = html;
        const buttonsDeleteTodo = document.querySelectorAll(".todolist__button");
        Array.from(buttonsDeleteTodo).map((item) => {
          item.addEventListener("click", this.deleteTodo);
        });
        const statusesTodo = document.querySelectorAll(".status");
        Array.from(statusesTodo).map((item) => {
          item.addEventListener("click", this.changeStatus);
        });
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
      const ulSection = this.sectionTodolist.querySelector(".ulCollection");
      ulSection.insertAdjacentHTML("beforeEnd", html);
      const buttonsDeleteTodos = ulSection.querySelectorAll(".todolist__button");
      const buttonDeleteTodo = buttonsDeleteTodos[buttonsDeleteTodos.length - 1];
      buttonDeleteTodo.addEventListener("click", this.deleteTodo);
      const statuses = document.querySelectorAll(".status");
      const status = statuses[statuses.length - 1];
      status.addEventListener("click", this.changeStatus);
    });
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
      });
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
        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .then((html) => {
        this.sectionTodolist.innerHTML = html;
        const buttonsDeleteTodo = document.querySelectorAll(".todolist__button");
        Array.from(buttonsDeleteTodo).map((item) => {
          item.addEventListener("click", this.deleteTodo);
        });
        const statusesTodo = document.querySelectorAll(".status");
        Array.from(statusesTodo).map((item) => {
          item.addEventListener("click", this.changeStatus);
        });
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
        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .then((html) => {
        this.sectionTodolist.innerHTML = html;
        const buttonsDeleteTodo = document.querySelectorAll(".todolist__button");
        Array.from(buttonsDeleteTodo).map((item) => {
          item.addEventListener("click", this.deleteTodo);
        });
        const statusesTodo = document.querySelectorAll(".status");
        Array.from(statusesTodo).map((item) => {
          item.addEventListener("click", this.changeStatus);
        });
      });
  }
  // другие методы работы с API
}

export default Api;
