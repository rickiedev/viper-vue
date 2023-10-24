# Build Todo List App

## Chuẩn bị

- Định nghĩa các kiểu lỗi

```typescript
export class NotFoundError extends Error {
  constructor() {
    super();
  }
}
```

- Sử dụng Axios để fetch API

```typescript
import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const request = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});
```

## 1. Entity

- Cần khởi tạo lỗi ở tầng này, việc tách biệt lỗi từ hệ thống ngoài và lỗi được định nghĩa từ frontend:
  - Giúp cải thiện quản lý lỗi
  - Cho phép hiển thị lỗi theo class lỗi đã định nghĩa mà không cần phụ thuộc vào lỗi trả về từ hệ thống ngoài
- Ở tầng này ta nên viết business đơn giản và tập trung vào việc quản lý dữ liệu.

### 1.1. Todo Model

- Tầng model định nghĩa cấu trúc dữ liệu, quy tắc truy cập và xử lý dữ liệu
  - Định dạng dữ liệu đầu vào và đầu ra cho ứng dụng
  - Tạo các phương thức truy cập và xử lý nghiệp vụ liên quan đến dữ liệu như tính toán giá trị, xác thực dũ liệu, hoặc chuyển đổi dữ liệu để hiển thị trên giao diện.

```typescript
// models/todo.model.ts
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

  set title(title: string) {
    if (title.length > 20) {
      throw new DataError();
    }
    this._title = title;
  }

  // các method còn lại của TodoModel
}
```

### 1.2. Todo Repo

- Tầng Repo chịu trách nhiệm về việc tương tác với các nguồn dữ liệu bên ngoài như API, database,...
- Xử lý dữ liệu: Tầng này có trách nhiệm đảm bảo dữ liệu được định dạng đúng kiểu dữ liệu. Ví dụ, kiểu `Todo` để định nghĩa cấu trúc của dữ liệu liên quan, để đảm bảo rằng dữ liệu được định dạng đúng
- __Tra cứu và tìm kiếm dữ liệu: cung cấp các phương thức để tra cứu và tìm kiếm dữ liệu từ các nguồn khác nhau__ > sai
- Xử lý lỗi và exception: Chúng ta sử dụng các exception như `BadRequestError`, `NotFoundError` để xử lý các trường hợp lỗi cụ thể để đóng gói mã lỗi trả về từ hệ thống ngoài tách biệt với ứng dụng
- Do giao tiếp với hệ thống ngoài nên ta cần triển khai interface để thuận lợi cho việc testing
- Ta có thể sử dụng khai báo `type` để xác định các trường dữ liệu cần thiết, vì chúng không tạo ra mã ở thời điểm biên dịch

```typescript
// repo/services/todo.service.ts
import { request } from "@/utils/request";
import { BadRequestError, NotFoundError } from "@/utils/error";

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

  // các method còn lại của TodoService
}
```

## 2. Interactor

- Tầng viết business logic các quy tắc, điều kiện và xử lý dữ liệu liên quan đến yêu cầu cụ thể
- Ở tầng này chúng ta sẽ throw trực tiếp lỗi ra tầng Presenter để nó thực hiện hiển thị lỗi sau
- Ở tầng này ta có thể sử dụng trực tiếp class model vì ở tầng Model ta không sử dụng logic liên quan đến hệ thống ngoài nên ta có thể dễ dàng test với nó

```typescript
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

  // các method còn lại của TodoInteractor
}
```

## 3. Presenter

- Presenter chịu trách nhiệm cho tất cả các logic hiển thị liên quan đến tầng View
- Ta định nghĩa một interface `IToDoView`, đóng gói các phương thức cần thiết mà tầng View phải triển khai, giúp đảm bảo tính đồng nhất trong việc tương tác với Presenter
- Trong contructor `TodoPresenter`, chấp nhận 1 đối tượng `ITodoView` và 1 đối tượng `TodoInteractor`. Điều này cho phép truyền mock interactor trong quá trình kiểm thử và sử dụng mặc định khi không có đối tượng nào truyền vào. Đây là một phong cách tốt vì nó tuần theo Dependency Injection, giúp dễ tái sử dụng và kiểm thử
- Trong phương thức `getAll()`, ta xử lý việc hiển thị thông báo lỗi bằng cách kiểm tra các loại lỗi, và sử dụng phương thức `showError` của interface `ITodoView`. Điều này giúp đảm bảo rằng việc đóng gói trong Presenter và không phụ thuộc vào cách cụ thể tầng View hiển thị lỗi

```typescript
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

  // các method còn lại của TodoPresenter
}
```

## 4. View

- Tầng view phụ trách hiển thị và xử lý tương tác cho người dùng qua các sự kiện
- Sử dụng Vue 3 và Compositon API để xây dựng tầng view của ứng dụng. Với Compositon API, ta sử dụng `setup()` để
  - cung cấp kiểu dữ liệu tốt hơn cho typescript,
  - thuận tiện cho dependency injection như props, context, và refs
  - Có thể định nghĩa computed property, watchers, lifecycle hook giúp gom các logic vào với nhau dễ dàng hơn
- Ta phải dùng `setup()` vì `<script setup lang="ts"></script>` không thể liên kết view với presenter

- Đặc biệt trong việc khởi tại presenter khi ta gắn view cần chú ý 2 điều

  - > cần dùng `getCurrentInstance()?.proxy` để có thể lấy instace vue 3
  - > cần ép kiểu `as ComponentPublicInstance<ITodoView>` cho instace vue 3 về interface của View khai báo ở Presenter

- Các method trong interface, hay method sự kiện tương tác thì đều đơn giản và chuyển xử lý cho presenter, không xử lý business logic ở tầng view

```typescript
import {
  ComponentPublicInstance,
  getCurrentInstance,
  reactive,
  ref,
} from "vue";
import { Todo } from "@/services/todo.service";
import { ITodoView, TodoPresenter } from "@/presenters/todos.presenter";

export default {
  setup() {
    const todos = ref<Todo[]>([]);
    const errorDisplay = ref<string>("");
    const todo = reactive<Todo>({
      userId: 1,
      title: "",
      completed: false,
    });
    const activeToast = ref<boolean>(false);

    const presenter = new TodoPresenter(
      getCurrentInstance()?.proxy as ComponentPublicInstance<ITodoView>
    );

    function resetInput() {
      todo.title = "";
    }

    function loadData(updatedTodos: Todo[]) {
      todos.value = [...updatedTodos];
    }

    function showError(error: string) {
      errorDisplay.value = error;
      activeToast.value = true;
      setTimeout(() => {
        activeToast.value = false;
      }, 5000);
    }

    async function getListTodo() {
      todos.value = await presenter.getAll();
    }

    async function addTodo() {
      await presenter.create(todo);
    }

    async function handleUpdatedTodo(todo: Todo) {
      await presenter.update(todo);
    }

    async function deleteTodo(id: number) {
      console.log(id);
    }

    getListTodo();

    return {
      todos,
      errorDisplay,
      todo,
      activeToast,
      resetInput,
      loadData,
      showError,
      getListTodo,
      addTodo,
      handleUpdatedTodo,
      deleteTodo,
    };
  },
};
```
