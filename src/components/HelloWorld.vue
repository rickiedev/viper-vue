<template>
  <v-btn @click="addCount">{{ count }}</v-btn>
  <v-card>{{ info }}</v-card>
</template>

<script lang="ts">
import { TestPresenter, ITestView } from "@/presenters/test.presenter";
import { defineComponent } from "vue";
import { onMounted } from "vue";
import { ref, ComponentPublicInstance, getCurrentInstance } from "vue";

export default defineComponent({
  name: "TestComponent",
  setup() {
    const count = ref<number>(0);
    const info = ref<string>("test...");

    const presenter = new TestPresenter(
      getCurrentInstance()?.proxy as ComponentPublicInstance<ITestView>
    );

    function addCount() {
      count.value++;
    }

    function showMessage(msg: string): void {
      info.value = msg;
    }

    async function getMessage() {
      await presenter.showData();
    }

    onMounted(() => {
      getMessage();
    });

    // getMessage();


    return {
      count,
      info,
      addCount,
      showMessage,
      getMessage,
    };
  },
});
</script>
