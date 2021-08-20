const Todolist = require("../models/todolist");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");

module.exports.getTodolists = (req, res, next) => {
  Todolist.find({}).lean()
    .then((todolist) => {
      res.status(200).render("home", { todolist });
    })
    .catch(next);
};
module.exports.getSortSuccessTodolist = (req, res, next) => {
  Todolist.find({}).sort({ flag: -1 }).lean()
    .then((todolist) => {
      res.status(200).render("home", { todolist });
    })
    .catch(next);
};
module.exports.getSortUnsuccessTodolist = (req, res, next) => {
  Todolist.find({}).sort({ flag: 1 }).lean()
    .then((todolist) => {
      res.status(200).render("home", { todolist });
    })
    .catch(next);
};
module.exports.addTodolist = (req, res, next) => {
  const { name } = req.body;
  Todolist.create({ name })
    .then((item) => res.status(200).render("item",
      {
        name: item.name, flag: item.flag, date: item.date, _id: item._id, layout: false,
      }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
      } else {
        next(err);
      }
    });
};
module.exports.deleteTodolist = (req, res, next) => {
  Todolist.findById(req.params.todoId)
    .orFail(new Error("NotValidIdTodo"))
    .then((card) => {
      card.remove();
      res.status(200).send({ message: "Карточка успешно удалена" });
    })
    .catch((err) => {
      if (err.message === "NotValidIdTodo") {
        next(new NotFoundError("Карточки с таким id не существует"));
      } else if (err.name === "CastError") {
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
      } else {
        next(err);
      }
    });
};
module.exports.changeStatusTodolist = (req, res, next) => {
  const { flag } = req.body;
  let newFlag = "";
  if (flag === "Не выполнено") newFlag = "выполнено";
  else newFlag = "Не выполнено";
  Todolist.findByIdAndUpdate(req.params.todoId, { flag: newFlag },
    { new: true, runValidators: true, upsert: true })
    .orFail(new Error("NotValidIdTodo"))
    .then((todo) => {
      res.status(200).send({ id: todo.id, flag: todo.flag });
    })
    .catch((err) => {
      if (err.message === "NotValidIdTodo") {
        next(new NotFoundError("Нет пользователя с таким id"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
      } else {
        next(err);
      }
    });
};
