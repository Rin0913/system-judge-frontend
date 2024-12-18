<template>
  <p>{{ message }}</p>
  <div v-if="ready">
    <table class="w-full text-xl text-center border">
      <thead class="text-2xl border">
        <tr>
          <th scope="col max-sm:hidden">Problem ID</th>
          <th scope="col">Name</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody v-for="p in data.slice().reverse()" class="border">
        <tr>
          <td class="max-sm:hidden px-6 py-4">{{ p["_id"] }}</td>
          <td class="px-6 py-4">{{ p["problem_name"] }}</td>
          <td class="py-4">
            <a :href="`/admin/problem?id=${p._id}`" class="pr-4">Edit</a>
            <a :href="`/problem?id=${p._id}`" class="pr-4">View</a>
            <a href="#" @click="downloadProblem(p._id)" class="pr-4"
              >Download</a
            >
            <a href="#" @click="deleteProblem(p._id)">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="float-left">{{ operationMessage }}</p>
    <a
      href="#"
      @click="createProblem"
      class="button hover:bg-white hover:text-gray-900 float-right mt-2 font-semibold py-2 px-4 border rounded"
      >Create</a
    >
    <div style="clear: both"></div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

const baseAPI = import.meta.env.VITE_API_BASE_URL;
const fetchProblemsAPI = new URL("problems/", baseAPI).toString();

export default {
  data() {
    return {
      message: "Fetching.",
      operationMessage: "",
      ready: 0,
      data: [],
    };
  },
  mounted() {
    this.fetchProblems();
  },
  methods: {
    convert_time(datetime) {
      return new Date(datetime + " UTC")
        .toLocaleString("en-CA", { hour12: false })
        .replace(",", "");
    },
    createProblem() {
      const token = Cookies.get("token");
      axios
        .post(
          fetchProblemsAPI,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((response) => {
          this.operationMessage = "Successfully created a new problem.";
          this.fetchProblems();
        })
        .catch((error) => {
          this.operationMessage = "Unable to create a new problem.";
        });
    },
    deleteProblem(problem_id) {
      const userInput = prompt(
        `To confirm deleting, please enter ${problem_id}:`,
      );
      if (userInput != problem_id.toString()) return;

      const deleteProblemsAPI = new URL(
        `problems/${problem_id}`,
        baseAPI,
      ).toString();
      const token = Cookies.get("token");
      axios
        .delete(deleteProblemsAPI, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.operationMessage = `Successfully deleted problem ${problem_id}.`;
          this.fetchProblems();
        })
        .catch((error) => {
          this.operationMessage = "Unable to delete the problem.";
        });
    },
    downloadProblem(problem_id) {
      const token = Cookies.get("token");
      const fetchProblemAPI = new URL(
        `problems/${problem_id}`,
        baseAPI,
      ).toString();
      axios
        .get(fetchProblemAPI, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const blob = new Blob([JSON.stringify(response.data)], {
            type: "application/json",
          });

          const link = document.createElement("a");

          const url = URL.createObjectURL(blob);
          link.href = url;
          link.setAttribute("download", `problem_${problem_id}_raw.json`);

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.log(error);
          this.operationMessage =
            "Unable to fetch problem data from the server side.";
        });
    },
    fetchProblems() {
      const token = Cookies.get("token");
      axios
        .get(fetchProblemsAPI, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.message = "";
          this.data = response.data;
          this.ready = 1;
          console.log(this.data);
        })
        .catch((error) => {
          this.ready = 0;
          this.message = "Unable to fetch problem data from the server side.";
        });
    },
  },
};
</script>
