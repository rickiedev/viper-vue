import { TodoInteractor } from "@/interactors/todo.interactor";
import { Todo } from "@/services/todo.service";
import { BadRequestError, DataError, NotFoundError } from "@/utils/error";

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
      if (error instanceof DataError) {
        this.view.showError("Data is empty");
      } else if (error instanceof BadRequestError) {
        this.view.showError("Invalid response from the repository");
      } else if (error instanceof NotFoundError) {
        this.view.showError("Todo can not found");
      } else {
        this.view.showError("Error system");
      }
      return [];
    }
  }

  async create(todo: Todo): Promise<void> {
    try {
      await this.interactor.create(todo);
      this.view.loadData(await this.interactor.getAll());
    } catch (error: any) {
      if (error instanceof DataError) {
        this.view.showError("Data input invalid");
      } else if (error instanceof BadRequestError) {
        this.view.showError("Invalid response from the repository");
      } else if (error instanceof NotFoundError) {
        this.view.showError("Todo can not found");
      } else {
        this.view.showError("Error system");
      }
    } finally {
      this.view.resetInput();
    }
  }

  async update(todo: Todo): Promise<void> {
    try {
      await this.interactor.update(todo);
      this.view.loadData(await this.interactor.getAll());
    } catch (error: any) {
      if (error instanceof DataError) {
        this.view.showError("Data input invalid");
      } else if (error instanceof BadRequestError) {
        this.view.showError("Invalid response from the repository");
      } else if (error instanceof NotFoundError) {
        this.view.showError("Todo can not found");
      } else {
        this.view.showError("Error system");
      }
    } finally {
      this.view.resetInput();
    }
  }
}
