<template>
  <p>
    Problem Name:
    <input
      v-model="problem_name"
      id="message"
      class="p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-5"
    />
  </p>
  <br />
  <p>
    Deadline:
    <input
      v-model="deadline"
      type="datetime-local"
      id="datetime"
      name="datetime"
      class="text-gray-900"
    />
  </p>
  <br />
  <p>
    Problem Description:
    <textarea
      v-model="description"
      id="message"
      rows="4"
      class="block mt-3 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-5"
    ></textarea>
  </p>
  <br />

  <label class="inline-flex items-center me-5 cursor-pointer">
    Allow New Submission:
    <input
      type="checkbox"
      v-model="allow_submission"
      class="sr-only peer"
      checked
    />
    <div
      class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"
    ></div>
  </label>

  <br />

  <br />
  <hr />
  <br />
  <textarea-list
    ref="SubtaskList"
    :data="subtasks"
    :buttonWord="'Add Subtask'"
    :isSubtask="1"
  ></textarea-list>
  <br />
  <hr />
  <br />
  <textarea-list
    ref="PlaybookList"
    :data="playbooks"
    :buttonWord="'Add Playbook'"
  ></textarea-list>

  <br />
  <hr />
  <br />
  <p class="float-left">{{ message }}</p>
  <a
    href="#"
    @click="submit"
    class="button hover:bg-white hover:text-gray-900 float-right ml-2 mt-2 font-semibold py-2 px-4 border rounded"
    >Submit</a
  >
  <a
    href="#"
    @click="upload"
    class="button hover:bg-white hover:text-gray-900 float-right mt-2 font-semibold py-2 px-4 border rounded"
    >Upload</a
  >
  <div style="clear: both"></div>
</template>

<script>
import TextareaList from "../components/ManyTextareaComponent.vue";
import axios from "axios";
import Cookies from "js-cookie";

const baseAPI = import.meta.env.VITE_API_BASE_URL;

export default {
  components: {
    TextareaList,
  },
  mounted() {
    this.fetchProblem();
  },
  data() {
    return {
      data: null,
      problem_name: "",
      allow_submission: true,
      deadline: null,
      description: "",
      subtasks: [],
      playbooks: [],
      message: "",
    };
  },
  methods: {
    getTextareaValues() {
      console.log(values1, values2);
    },
    convert_time(datetime) {
      return new Date(new Date(datetime + " UTC").getTime())
        .toLocaleString("en-CA", { hour12: false })
        .replace(",", "");
    },
    convert_time_to_utc(datetime) {
      const localDate = new Date(datetime);

      const year = localDate.getUTCFullYear();
      const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(localDate.getUTCDate()).padStart(2, "0");
      const hours = String(localDate.getUTCHours()).padStart(2, "0");
      const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");
      const seconds = String(localDate.getUTCSeconds()).padStart(2, "0");

      const formattedUTCDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      return formattedUTCDate;
    },
    fetchProblem() {
      const token = Cookies.get("token");
      const id = this.$route.query.id;
      if (!id) window.location.href = "/admin/problems";

      let api = new URL(`problems/${id}`, baseAPI).toString();
      axios
        .get(api, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.data = response.data;
          console.log(this.data);
          this.problem_name = this.data.problem_name;
          this.deadline = this.convert_time(this.data.deadline);
          this.description = this.data.description;
          this.allow_submission = this.data.allow_submission;
          this.data.subtasks.forEach((s) => {
            this.subtasks = response.data.subtasks.map((s) => ({
              value: s.script,
              dependencies: s.depends_on.join(" "),
              name: s.task_name,
              point: s.point,
            }));
          });
          this.data.playbooks.forEach((s) => {
            this.playbooks = response.data.playbooks.map((s) => ({
              value: s.script,
              dependencies: "",
              name: s.playbook_name,
              point: 0,
            }));
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submit() {
      var problem_data = this.data;
      problem_data.problem_name = this.problem_name;
      problem_data.deadline = this.convert_time_to_utc(this.deadline);
      problem_data.description = this.description;
      problem_data.subtasks = [];
      problem_data.playbooks = [];
      problem_data.allow_submission = this.allow_submission;
      const subtasks = this.$refs.SubtaskList.getValues();
      const playbooks = this.$refs.PlaybookList.getValues();
      subtasks.forEach((s) => {
        problem_data.subtasks.push({
          task_name: s.name,
          script: s.value,
          depends_on: s.dependencies
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== ""),
          point: s.point,
        });
      });
      playbooks.forEach((s) => {
        problem_data.playbooks.push({
          playbook_name: s.name,
          script: s.value,
        });
      });
      this.modifyProblem(problem_data);
    },
    upload() {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.style.display = "none";

      fileInput.addEventListener("change", (event) => {
        const file = fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const fileContent = event.target.result;
            this.modifyProblem(JSON.parse(fileContent));
            document.body.removeChild(fileInput);
          };
          reader.readAsText(file);
        }
      });
      document.body.appendChild(fileInput);
      fileInput.click();
    },
    modifyProblem(problem_data) {
      const token = Cookies.get("token");
      const id = this.$route.query.id;
      if (!id) window.location.href = "/admin/problems";
      let api = new URL(`problems/${id}`, baseAPI).toString();
      axios
        .put(api, problem_data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          location.reload();
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status == 401)
            this.message = "Your token has been expired. Please login again.";
          else if (
            error.response &&
            error.response.data &&
            error.response.data.message
          )
            this.message = error.response.data.message;
          else
            this.message =
              "Unable to submit. Please press F12 to get detailed information.";
        });
    },
  },
};
</script>
