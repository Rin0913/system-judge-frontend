<template>
  <p>{{ message }}</p>
  <div v-if="ready">
    <table class="max-md:hidden w-full text-xl text-center border">
      <thead class="text-2xl border">
        <tr>
          <th scope="col">Problem ID</th>
          <th scope="col">Name</th>
          <th scope="col">Deadline</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody v-for="p in data.slice().reverse()">
        <tr class="border">
          <td class="px-6 py-4">{{ p["_id"] }}</td>
          <td class="px-6 py-4">{{ p["problem_name"] }}</td>
          <td class="px-6 py-4">{{ convert_time(p["deadline"]) }}</td>
          <td class="px-6 py-4"><a :href="`/problem?id=${p._id}`">View</a></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="ready" class="text-xl md:hidden overflow-x-auto">
    <p>Problems Table:</p>
    <hr />
    <div v-for="p in data.slice().reverse()" :key="p['_id']">
      <p>
        <a :href="`/problem?id=${p._id}`"
          >Problem. {{ p["_id"] }}: {{ p["problem_name"] }}</a
        >
      </p>
      <hr />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

const baseAPI = import.meta.env.VITE_API_BASE_URL;
const fetchProblemsAPI = new URL("problems", baseAPI).toString();

export default {
  data() {
    return {
      message: "Fetching.",
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
        .toLocaleString("zh-TW", { hour12: false })
        .replace(",", "");
    },
    fetchProblems() {
      axios
        .get(fetchProblemsAPI)
        .then((response) => {
          this.message = "";
          this.data = response.data;
          this.ready = 1;
          console.log(this.data);
        })
        .catch((error) => {
          this.ready = 0;
          this.message = "Unable to fetch user data from the server side.";
        });
    },
  },
};
</script>
