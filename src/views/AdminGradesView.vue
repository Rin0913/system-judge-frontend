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
            <a href="#" @click="fetch_grades(p._id, 'json')" class="px-2"
              >JSON</a
            >
            <a href="#" @click="fetch_grades(p._id, 'csv')" class="px-2">CSV</a>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="float-left">{{ fetching_message }}</p>
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
    fetchProblems() {
      const token = Cookies.get("token");
      axios
        .get(fetchProblemsAPI, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.message = "";
          this.fetching_message = "";
          this.data = response.data;
          this.ready = 1;
          console.log(this.data);
        })
        .catch((error) => {
          this.ready = 0;
          this.message = "Unable to fetch user data from the server side.";
        });
    },
    fetch_grades(problem_id, type) {
      const token = Cookies.get("token");
      const fetchGradesAPI = new URL(
        `grades/problems/${problem_id}?type=${type}`,
        baseAPI,
      ).toString();
      axios
        .get(fetchGradesAPI, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          var blob = null;

          if (type == "json")
            blob = new Blob([JSON.stringify(response.data)], {
              type: "text/plain",
            });
          else
            blob = new Blob([response.data], {
              type: "text/plain",
            });

          const link = document.createElement("a");

          const url = URL.createObjectURL(blob);
          link.href = url;
          link.setAttribute("download", `problem_${problem_id}_grades.${type}`);

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          this.fetching_message =
            "Unable to fetch user data from the server side.";
        });
    },
  },
};
</script>
