import { Todo } from "@/services/todo.service";
import { DataError, NotFoundError } from "@/utils/error";

export class TodoModel {
  private _id!: number;
  private _userId!: number;
  private _title!: string;
  private _completed: boolean = false;

  get todoModel(): Todo {
    const todo: Todo = {
      id: this._id,
      userId: this._userId,
      title: this._title,
      completed: this._completed,
    };

    return todo;
  }

  set id(id: number) {
    this._id = id;
  }

  set userId(userId: number) {
    this._userId = userId;
  }

  set title(title: string) {
    if (title.length > 20) {
      throw new DataError();
    }
    this._title = title;
  }

  set completed(completed: boolean) {
    if (completed) {
      throw new DataError();
    }
    this._completed = true;
  }
}
