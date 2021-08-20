const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const errorsRouter = require("./errors");

const {
  getTodolists,
  getSortSuccessTodolist,
  getSortUnsuccessTodolist,
  addTodolist,
  deleteTodolist,
  changeStatusTodolist,
} = require("../controllers/todolists");

router.get("/api/todolist", getTodolists);
router.get("/api/todolist/success", getSortSuccessTodolist);
router.get("/api/todolist/unsuccess", getSortUnsuccessTodolist);
router.post("/api/todolist", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2),
  }),
}), addTodolist);
router.delete("/api/todolist/:todoId", deleteTodolist);
router.patch("/api/todolist/:todoId", changeStatusTodolist);
router.use("*", errorsRouter);
module.exports = router;
