import { TodoModel } from "@/models/todo.model";
import { ITodoService, Todo, TodoService } from "@/services/todo.service";

export class TodoInteractor {
  private todoService: ITodoService;

  constructor(todoService: ITodoService | null = null) {
    this.todoService = todoService ?? new TodoService();
  }

  async getAll(): Promise<Todo[]> {
    try {
      return this.todoService.getAll();
    } catch (error) {
      throw error;
    }
  }

  async create(todo: Todo): Promise<void> {
    try {
      const newTodo = new TodoModel();
      newTodo.userId = todo.userId;
      newTodo.title = todo.title;

      this.todoService.create(newTodo.todoModel);
    } catch (error) {
      throw error;
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
      throw error;
    }
  }
}
