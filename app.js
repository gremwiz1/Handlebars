const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const handlebars = require("express-handlebars");
const { celebrate, errors, Joi } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorsMiddlewares = require("./middlewares/errors");
const errorsRouter = require("./routes/errors");
const Todolist = require("./models/todolist");
const BadRequestError = require("./errors/bad-request-err");
const NotFoundError = require("./errors/not-found-err");

const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
const allowedCors = [
  "http://localhost:3000",
  "https://localhost:3000",
  "http://178.154.198.59",
];
const app = express();
app.use(helmet());
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/todolist", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  const { methodHttp } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const requestHeaders = req.headers["access-control-request-headers"];
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header("Access-Control-Allow-Origin", origin);
  }
  if (methodHttp === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    return res.end();
  }
  return next();
});
app.engine(
  "handlebars",
  handlebars({ defaultLayout: "main" }),
);
app.set("views", "./views");
app.set("view engine", "handlebars");
app.get("/api/todolist", (req, res, next) => {
  Todolist.find({}).lean()
    .then((todolist) => {
      res.status(200).render("home", { todolist });
    })
    .catch(next);
});
app.post("/api/todolist", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2),
  }),
}), (req, res, next) => {
  const { name } = req.body;
  Todolist.create({ name })
    .then((item) => res.status(200).render("home", { item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
      } else {
        next(err);
      }
    });
});
app.delete("/api/todolist/:todoId", (req, res, next) => {
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
});
app.use("*", errorsRouter);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorsMiddlewares);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
