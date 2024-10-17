<template>
  <p>{{ message }}</p>
  <div v-if="ready">
    <div
      class="description"
      id="problem-description"
      v-html="description"
    ></div>
    <hr />
    <a
      href="#"
      @click="submit"
      class="button hover:bg-white hover:text-gray-900 float-right mt-2 font-semibold py-2 px-4 border rounded"
      >Submit</a
    >
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

import markdownit from "markdown-it";
const md = markdownit();

const baseAPI = import.meta.env.VITE_API_BASE_URL;

export default {
  data() {
    return {
      message: "Fetching.",
      ready: 0,
      data: {},
      description: "",
    };
  },
  mounted() {
    this.fetchProblem();
  },
  methods: {
    async fetchProblem() {
      const id = this.$route.query.id;
      if (!id) window.location.href = "/problems";
      let api = new URL(`problems/${id}`, baseAPI).toString();
      axios
        .get(api)
        .then((response) => {
          this.message = "";
          this.data = response.data;
          this.ready = 1;
          console.log(this.data);
          this.process(response.data);
        })
        .catch((error) => {
          this.ready = 0;
          console.log(error);
          this.message = "Unable to fetch user data from the server side.";
        });
    },
    async process(data) {
      this.description = md.render(this.data["description"]);
      console.log(this.description);
    },
  },
};
</script>

<style>
.light {
  font-size: 1rem;
}
h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 2.25rem;
}

h3 {
  font-size: 2rem;
}

h4 {
  font-size: 1.75rem;
}

h5 {
  font-size: 1.5rem;
}

h6 {
  font-size: 1.25rem;
}

img {
  margin-top: 1em;
  margin-bottom: 1em;
  display: block;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 768px) {
  img {
    width: 50%;
  }
}

.description ul {
  list-style-type: disc;
  padding-left: 20px;
}
</style>
