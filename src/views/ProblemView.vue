<template>
  <p>{{ message }}</p>
  <div v-if="ready">
    <div
      class="description"
      id="problem-description"
      v-html="collapsedDescription"
    ></div>
    <br />
    <hr />
    <p class="float-left">{{ submitMessage }}</p>
    <a
      href="#"
      @click="collapse"
      v-if="description.split('\n').length >= 10"
      class="button hover:bg-white hover:text-gray-900 float-left mt-2 font-semibold py-2 px-4 border rounded"
      >Collapse</a
    >
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

import { marked } from "marked";

const baseAPI = import.meta.env.VITE_API_BASE_URL;

export default {
  data() {
    return {
      message: "Fetching.",
      submitMessage: "",
      ready: 0,
      data: {},
      description: "",
      parsedDescription: "",
      collapsedDescription: "",
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
    collapse() {
      [this.parsedDescription, this.collapsedDescription] = [
        this.collapsedDescription,
        this.parsedDescription,
      ];
    },
    fetchProblem() {
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
          this.description = this.data["description"];
          this.parsedDescription = marked.parse(this.description);
          this.collapsedDescription = marked.parse(
            this.description.split("\n").slice(0, 10).join("\n"),
          );
        })
        .catch((error) => {
          this.ready = 0;
          console.log(error);
          this.message = "Unable to fetch problem data from the server side.";
        });
    },
    async process(data) {},
  },
};
</script>

<style>
.description {
  font-size: 1rem;
}

.description h1 {
  font-size: 3.5rem;
}

.description h2 {
  font-size: 2.7rem;
}

.description h3 {
  font-size: 2.2rem;
}

.description h4 {
  font-size: 1.9rem;
}

.description h5 {
  font-size: 1.7rem;
}

.description h6 {
  font-size: 1.5rem;
}

.description img {
  margin-top: 1em;
  margin-bottom: 1em;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  text-align: center;
}

@media (min-width: 1024px) {
  .description img {
    width: 50%;
  }
}

.description p {
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
.description ul {
  list-style-type: disc;
  padding-left: 20px;
}
</style>
