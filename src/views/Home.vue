<template>
  <v-container ref="todoApp" class="todo-container" fluid>
    <!-- <v-row>
      <v-col>
        <hello-world />
      </v-col>
    </v-row> -->
    <v-row
      align="center"
      justify="center"
      no-gutters
      :style="{ height: '100vh' }"
    >
      <v-col cols="6">
        <v-card color="#D0D4CA">
          <v-card-title class="text-center">Todo App</v-card-title>
          <v-card-item>
            <v-row align="center">
              <v-col cols="10">
                <v-text-field
                  v-model="todo.title"
                  clearable
                  persistent-clear
                  hide-details="auto"
                  label="Task name"
                />
              </v-col>
              <v-col cols="2">
                <v-btn
                  variant="tonal"
                  rounded="0"
                  icon="mdi-plus"
                  @click="addTodo"
                ></v-btn>
              </v-col>
            </v-row>
          </v-card-item>
          <v-list lines="two">
            <v-list-item v-for="todo in todos" :key="todo.id" :ripple="true">
              <v-row justify="space-between">
                <v-col cols="8">
                  <v-sheet>{{ todo.title }}</v-sheet>
                </v-col>
                <v-col cols="4">
                  <v-btn
                    variant="flat"
                    @click="() => handleUpdatedTodo(todo)"
                    :disabled="todo.completed"
                    :style="{ backgroundColor: 'transparent' }"
                  >
                    <v-chip
                      variant="text"
                      v-if="!todo.completed"
                      color="primary"
                      >Doing</v-chip
                    >
                    <v-chip variant="text" color="#4CAF50" v-else
                      >Complete</v-chip
                    >
                  </v-btn>
                </v-col>
              </v-row>

              <template #append>
                <v-btn
                  color="red"
                  icon="mdi-delete"
                  variant="text"
                  @click="() => deleteTodo(todo.id!)"
                ></v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-card-item>
            <v-sheet class="d-flex flex-column">
              <v-snackbar
                v-model="activeToast"
                timeout="5000"
                location="top"
                transition="slide-y-transition"
                variant="tonal"
                color="error"
                @update:model-value="() => (activeToast = false)"
                rounded
                vertical
              >
                {{ errorDisplay }}
              </v-snackbar>
            </v-sheet>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  ComponentPublicInstance,
  getCurrentInstance,
  reactive,
  ref,
} from "vue";
import { Todo } from "@/services/todo.service";
import { ITodoView, TodoPresenter } from "@/presenters/todos.presenter";
import HelloWorld from "@/components/HelloWorld.vue";

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
        const presenter = new TodoPresenter(getCurrentInstance()?.proxy as ComponentPublicInstance<ITodoView>);
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

        const todoViewMethod: ITodoView = {
            resetInput,
            loadData,
            showError,
        };
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
            todoViewMethod,
            getListTodo,
            addTodo,
            handleUpdatedTodo,
            deleteTodo,
        };
    },
    components: { HelloWorld }
};
</script>

<style scoped>
.todo-container {
  background-color: #f5eec8;

  .v-list {
    background-color: transparent;

    .v-sheet {
      background-color: transparent;
    }
  }
}
</style>
