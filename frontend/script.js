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
          return res.json();
        }
        // если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
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
const api = new Api("http://178.154.198.59");
api.getInitialTodolist();
