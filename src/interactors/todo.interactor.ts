import { TodoModel } from "@/models/todo.model";
import { ITodoService, Todo, TodoService } from "@/services/todo.service";
import { BadRequestError, DataError, NotFoundError } from "@/utils/error";

export class TodoInteractor {
  private todoService: ITodoService;

  constructor(postService: ITodoService | null = null) {
    this.todoService = postService ?? new TodoService();
  }

  async getAll(): Promise<Todo[]> {
    try {
      return this.todoService.getAll();
    } catch (error) {
      if (error instanceof DataError) {
        throw new Error("Data is empty");
      } else if (error instanceof BadRequestError) {
        throw new Error("Invalid response from the repository");
      } else if (error instanceof NotFoundError) {
        throw new Error("Todo can not found");
      } else {
        throw new Error("Error system");
      }
    }
  }

  async create(todo: Todo): Promise<void> {
    try {
      const newTodo = new TodoModel();
      newTodo.userId = todo.userId;
      newTodo.title = todo.title;

      this.todoService.create(newTodo.todoModel);
    } catch (error) {
      if (error instanceof DataError) {
        throw new Error("Data input invalid");
      } else if (error instanceof BadRequestError) {
        throw new Error("Invalid response from the repository");
      } else if (error instanceof NotFoundError) {
        throw new Error("Todo can not found");
      } else {
        throw new Error("Error system");
      }
    }
  }

  async update(todo: Todo): Promise<void> {
    try {
      const updatedTodo = new TodoModel();
      updatedTodo.id = todo.id!;
      updatedTodo.userId = todo.userId;
      updatedTodo.title = todo.title;
      updatedTodo.completed = todo.completed;

      this.todoService.update(updatedTodo.todoModel);
    } catch (error) {
      if (error instanceof DataError) {
        throw new Error("Data input invalid");
      } else if (error instanceof BadRequestError) {
        throw new Error("Invalid response from the repository");
      } else if (error instanceof NotFoundError) {
        throw new Error("Todo can not found");
      } else {
        throw new Error("Error system");
      }
    }
  }
}
