<template>
  <div
    class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
  >
    <div class="w-full md:mt-0 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl">
          Sign in to your LDAP account
        </h1>
        <form class="space-y-4 md:space-y-6" @submit.prevent="submit">
          <div>
            <label for="username" class="block mb-2 text-sm font-medium"
              >Username</label
            >
            <input
              type="text"
              name="username"
              id="username"
              class="border rounded-lg block w-full p-2.5 text-gray-900"
              placeholder="username"
              v-model="username"
              required
            />
          </div>
          <div>
            <label for="password" class="block mb-2 text-sm font-medium"
              >Password</label
            >
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              class="border rounded-lg block w-full p-2.5 text-gray-900"
              v-model="password"
              required
            />
            <p>{{ message }}</p>
          </div>
          <button
            type="submit"
            class="hover:bg-white hover:text-gray-900 float-right mt-2 font-semibold py-2 px-4 border rounded"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

const baseAPI = import.meta.env.VITE_API_BASE_URL;
const loginAPI = new URL("login", baseAPI).toString();

export default {
  data() {
    return {
      username: "",
      password: "",
      message: "",
    };
  },
  methods: {
    submit() {
      axios
        .post(loginAPI, {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          this.message = "";
          let expires = new Date(new Date().getTime() + 2 * 60 * 60 * 1000); // 2 Hours
          Cookies.set("token", response.data, { expires: expires });
          window.location.href = "/";
        })
        .catch((error) => {
          console.error(
            "Error:",
            error.response ? error.response.data : error.message,
          );
          if (error.response && error.response.status == 401)
            this.message = "Username and password does not match.";
          else this.message = "Unable to authenticate user on the server side.";
        });
    },
  },
};
</script>
