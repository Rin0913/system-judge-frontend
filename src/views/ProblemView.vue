<template>
  <p>{{ message }}</p>
  <div v-if="ready">
    <div
      class="description"
      id="problem-description"
      v-html="description"
    ></div>
    <hr />
    <p class="float-left">{{ submitMessage }}</p>
    <a
      href="#"
      @click="submit"
      class="button hover:bg-white hover:text-gray-900 float-right mt-2 font-semibold py-2 px-4 border rounded"
      >Submit</a
    >
    <div style="clear: both"></div>
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
      submitMessage: "",
      ready: 0,
      data: {},
      description: "",
    };
  },
  mounted() {
    this.fetchProblem();
  },
  methods: {
    submit() {
      const token = Cookies.get("token");
      const id = this.$route.query.id;
      let api = new URL(`submit/${id}`, baseAPI).toString();

      axios
        .post(
          api,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          window.location.href = "/submissions";
        })
        .catch((error) => {
          this.ready = 0;
          if (error.response && error.response.status == 401) {
            Cookies.remove("token");
            window.location.href = "/login";
          } else
            this.submitMessage =
              "Unable to submit a test request to the server side.";
        });
    },
    async fetchProblem() {
      const token = Cookies.get("token");
      const id = this.$route.query.id;
      if (!id) window.location.href = "/problems";
      let api = new URL(`problems/${id}`, baseAPI).toString();
      axios
        .get(api, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          this.message = "";
          this.data = response.data;
          this.ready = 1;
          this.process(response.data);
        })
        .catch((error) => {
          this.ready = 0;
          console.log(error);
          this.message = "Unable to fetch problem data from the server side.";
        });
    },
    async process(data) {
      this.description = md.render(this.data["description"]);
    },
  },
};
</script>

<style>
.light {
  font-size: 1rem;
}
h1 {
  font-size: 3.5rem;
}

h2 {
  font-size: 2.7rem;
}

h3 {
  font-size: 2.2rem;
}

h4 {
  font-size: 1.9rem;
}

h5 {
  font-size: 1.7rem;
}

h6 {
  font-size: 1.5rem;
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
