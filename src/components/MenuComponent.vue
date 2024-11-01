<template>
  <p class="text-3xl">System Judge</p>
  <br />
  <div v-if="isLogged">
    <p class="text-2xl">{{ username }}</p>
    <ul class="max-w-md space-y-1 list-disc list-inside">
      <li><a href="/profile">Profile</a></li>
      <li><a href="/submissions">Submissions</a></li>
      <li><a href="#" @click="logout">Logout</a></li>
    </ul>
  </div>
  <div v-if="!isLogged">
    <p class="text-2xl">{{ username }}</p>
    <ul class="max-w-md space-y-1 list-disc list-inside">
      <li><a href="/login">Login</a></li>
    </ul>
  </div>
  <br />
  <div>
    <p class="text-2xl"><a href="/problems">Problems</a></p>
    <ul
      class="max-w-md space-y-1 list-disc list-inside"
      v-for="problem in problems"
    >
      <li>
        <a :href="`/problem?id=${problem._id}`">
          {{ problem["problem_name"] }}
        </a>
      </li>
    </ul>
  </div>
  <br />
  <div>
    <p class="text-2xl">Courses</p>
    <ul class="max-w-md space-y-1 list-disc list-inside">
      <li><a href="/">Index</a></li>
      <li>
        <a :href="courseUrl" target="_blank">Course Materials</a>
      </li>
    </ul>
  </div>
  <div v-if="isAdmin">
    <br />
    <p class="text-2xl">Administrator</p>
    <ul class="max-w-md space-y-1 list-disc list-inside">
      <li><a href="/admin/problems">Problems Manager</a></li>
      <li><a href="/admin/grades">Grades Manager</a></li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

const baseAPI = import.meta.env.VITE_API_BASE_URL;
const listProblemAPI = new URL("problems/", baseAPI).toString();

export default {
  props: {
    username: {
      type: String,
      default: "Anonymous",
      isAdmin: 0,
    },
    isLogged: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      problems: [],
      courseUrl: import.meta.env.VITE_COURSE_WEBSITE,
    };
  },
  mounted() {
    this.listProblem();
  },
  methods: {
    listProblem() {
      axios.get(listProblemAPI).then((response) => {
        this.problems = response.data;
      });
    },
    logout() {
      Cookies.remove("token");
      location.reload();
    },
  },
};
</script>
