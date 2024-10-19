<template>
  <div>
    <div v-for="(input, index) in inputs" :key="index">
      <p>
        Name:
        <input
          v-model="input.name"
          id="message"
          class="p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-5"
        />
        <span v-if="isSubtask">
          Points:
          <input
            v-model="input.point"
            id="message"
            class="p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-5"
          />
        </span>
      </p>
      <textarea
        v-model="input.value"
        id="message"
        rows="4"
        class="block mt-3 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-5"
      ></textarea>
      <div v-if="isSubtask">
        <p>
          Depends On(split by comma):
          <input
            v-model="input.dependencies"
            id="message"
            class="p-2.5 mt-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-5"
          />
        </p>
      </div>
      <button class="float-right" @click="removeTextarea(index)">Remove</button>
      <div style="clear: both"></div>
    </div>
  </div>
  <br />
  <div>
    <a
      href="#"
      @click="addTextarea"
      class="button hover:bg-white hover:text-gray-900 mt-5 font-semibold py-2 px-4 border rounded"
      >{{ buttonWord }}</a
    >
  </div>
</template>

<script>
export default {
  props: {
    buttonWord: {
      type: String,
      default: "Add",
    },
    data: {
      type: Array,
      default: () => [],
    },
    isSubtask: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      inputs: [],
    };
  },
  mounted() {
    const unwatch = this.$watch(
      "data",
      (newData) => {
        if (newData.length > 0) {
          this.inputs = newData.slice();
          unwatch();
        }
      },
      { immediate: true, deep: true },
    );
  },
  methods: {
    addTextarea() {
      this.inputs.push({ value: "", name: "", dependencies: "", point: "" });
    },
    removeTextarea(index) {
      this.inputs.splice(index, 1);
    },
    getValues() {
      const values = this.inputs.map((input) => {
        return {
          value: input.value,
          name: input.name,
          dependencies: input.dependencies,
          point: input.point,
        };
      });
      return values;
    },
  },
};
</script>
