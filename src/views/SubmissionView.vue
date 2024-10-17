<template>
  <p>{{ message }}</p>
  <div v-if="ready">
    <table class="w-full text-xl text-center border">
      <thead class="text-2xl border">
        <tr>
          <th scope="col">Task Name</th>
          <th scope="col">Point</th>
          <th scope="col">Output</th>
        </tr>
      </thead>
      <tbody v-for="s in data.subtask_results">
        <tr class="border">
          <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">
            {{ s["task_name"] }}
          </th>
          <td class="px-6 py-4">{{ s["point"] }}</td>
          <td class="px-6 py-4">
            <a href="#" @click="show_log(s['task_name'])">Show</a>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th></th>
          <th>{{ data.point }}</th>
          <th></th>
        </tr>
      </tfoot>
    </table>
    <div class="mt-3">
      <p class="text-2xl">Output:</p>
      <textarea
        id="message"
        rows="15"
        class="block mt-3 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        readonly
        >{{ logToShow }}</textarea
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

const baseAPI = import.meta.env.VITE_API_BASE_URL;

export default {
  data() {
    return {
      message: "Fetching.",
      ready: 0,
      data: {},
      logToShow: "",
    };
  },
  mounted() {
    this.check();
  },
  methods: {
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    show_log(task_name) {
      console.log(this.data.subtask_results.length);
      for (let i = 0; i < this.data.subtask_results.length; i++) {
        console.log(i);
        if (this.data.subtask_results[i].task_name == task_name) {
          this.logToShow = this.data.subtask_results[i].log;
          break;
        }
      }
    },
    async fetchUserSubmissions() {
      const token = Cookies.get("token");
      const id = this.$route.query.id;
      if (!id) window.location.href = "/submissions";
      let api = new URL(`submission/${id}`, baseAPI).toString();
      axios
        .get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.message = "";
          this.data = response.data;
          this.ready = 1;
          console.log(this.data);
        })
        .catch((error) => {
          this.ready = 0;
          if (error.response && error.response.status == 401) {
            Cookies.remove("token");
            window.location.href = "/login";
          } else
            this.message = "Unable to fetch user data from the server side.";
        });
    },
    async check() {
      while (!(this.data && this.data["status"] == "completed")) {
        await this.fetchUserSubmissions();
        await this.sleep(3000);
      }
    },
  },
};
</script>
