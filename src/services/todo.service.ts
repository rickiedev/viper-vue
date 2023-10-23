import { request } from "@/utils/request";
import { BadRequestError, DataError, NotFoundError } from "@/utils/error";

export type Todo = {
  id?: number;
  userId: number;
  title: string;
  completed: boolean;
};

export interface ITodoService {
  getAll(): Promise<Todo[]>;
  create(newPost: Todo): Promise<void>;
  update(newPost: Todo): Promise<void>;
}

export class TodoService implements ITodoService {
  async getAll(): Promise<Todo[]> {
    try {
      const res = await request.get("/users/1/todos");

      if (!res.data) {
        throw new NotFoundError();
      }

      const data: Todo[] = res.data.splice(0, 3);

      return data;
    } catch (error: any) {
      const status = error.response.status;
      switch (status) {
        case 400:
          throw new BadRequestError();
        case 404:
          throw new NotFoundError();

        default:
          throw error;
      }
    }
  }

  async create(todo: Todo): Promise<void> {
    try {
      const res = await request.post("/todos", todo);

      if (!res.data) {
        throw new NotFoundError();
      }
    } catch (error: any) {
      const status = error.response.status;
      switch (status) {
        case 400:
          throw new BadRequestError();
        case 404:
          throw new NotFoundError();

        default:
          throw error;
      }
    }
  }

  async update(todo: Todo): Promise<void> {
    try {
      const res = await request.put(`/todos/${todo.id}`, todo);

      if (!res.data) {
        throw new NotFoundError();
      }
    } catch (error: any) {
      const status = error.response.status;
      switch (status) {
        case 400:
          throw new BadRequestError();
        case 404:
          throw new NotFoundError();

        default:
          throw error;
      }
    }
  }
}
