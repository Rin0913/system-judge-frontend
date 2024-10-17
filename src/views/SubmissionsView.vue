<template>
  <p>{{ message }}</p>
  <div v-if="ready" class="max-md:hidden overflow-x-auto">
    <table class="min-w-full text-sm md:text-lg text-center border">
      <thead class="text-lg md:text-xl border">
        <tr>
          <th scope="col">Submission ID</th>
          <th scope="col">Problem ID</th>
          <th scope="col">Score</th>
          <th scope="col">Status</th>
          <th scope="col">Creation Time</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody v-for="s in data.slice().reverse()" :key="s['_id']">
        <tr class="border">
          <th scope="row" class="">
            {{ s["_id"] }}
          </th>
          <td class="">{{ s["problem_id"] }}</td>
          <td class="">{{ s["point"] }}</td>
          <td class="">{{ s["status"] }}</td>
          <td class="">{{ convert_time(s["creation_time"]) }}</td>
          <td class="">
            <a :href="'/submission?id=' + s['_id']">Details</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="ready" class="max-sm:text-xl md:hidden overflow-x-auto">
    <p>Submissions Table:</p>
    <hr />
    <div v-for="s in data.slice().reverse()" :key="s['_id']">
      <p>
        <a :href="'/submission?id=' + s['_id']">View Details</a> for problem
        {{ s["problem_id"] }} at {{ convert_time(s["creation_time"]) }}.
      </p>
      <hr />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

const baseAPI = import.meta.env.VITE_API_BASE_URL;
const fetchSubmissionsAPI = new URL("submissions", baseAPI).toString();

export default {
  data() {
    return {
      message: "Fetching.",
      ready: 0,
      data: [],
    };
  },
  mounted() {
    this.fetchUserSubmissions();
  },
  methods: {
    convert_time(datetime) {
      return new Date(datetime + " UTC")
        .toLocaleString("en-CA", { hour12: false })
        .replace(",", "");
    },
    fetchUserSubmissions() {
      const token = Cookies.get("token");
      axios
        .get(fetchSubmissionsAPI, {
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
  },
};
</script>
