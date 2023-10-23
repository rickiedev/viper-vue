import { TodoInteractor } from "@/interactors/todo.interactor";
import { Todo } from "@/services/todo.service";

export interface ITodoView {
  loadData(todos: Todo[]): void;
  resetInput(): void;
  showError(error: string): void;
}

export class TodoPresenter {
  private view: ITodoView;
  private interactor: TodoInteractor;

  constructor(view: ITodoView, interactor: TodoInteractor | null = null) {
    this.view = view;
    this.interactor = interactor ?? new TodoInteractor();
  }

  async getAll(): Promise<Todo[]> {
    try {
      return await this.interactor.getAll();
    } catch (error: any) {
      this.view.showError(error.message);
      return [];
    }
  }

  async create(todo: Todo): Promise<void> {
    try {
      await this.interactor.create(todo);
      this.view.loadData(await this.interactor.getAll());
      this.view.resetInput();
    } catch (error: any) {
      this.view.showError(error.message);
      this.view.resetInput();

    }
  }

  async update(todo: Todo): Promise<void> {
    try {
      await this.interactor.update(todo);
      this.view.loadData(await this.interactor.getAll());
      this.view.resetInput();
    } catch (error: any) {
      this.view.showError(error.message);
      this.view.resetInput();

    }
  }
}
