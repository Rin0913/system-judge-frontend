<template>
  <p>{{ message }}</p>
  <div v-if="ready">
    <div>
      <p class="text-2xl">Wireguard Configuration:</p>
      <textarea
        id="message"
        rows="10"
        class="block p-2.5 mt-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Your wireguard configure will be here."
        readonly
        >{{ wireguard_conf }}</textarea
      >
      <p class="float-left">{{ wg_message }}</p>
      <a
        href="#"
        @click="wg_conf_generate"
        class="button hover:bg-white hover:text-gray-900 float-right mt-2 font-semibold py-2 px-4 border rounded"
      >
        Generate Wireguard Configuration
      </a>
      <div style="clear: both"></div>
    </div>
    <div>
      <p class="text-2xl">Credential Information Configuration:</p>
      <textarea
        id="message"
        rows="15"
        class="block p-2.5 mt-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Copy your credential here."
        v-model="credential"
      ></textarea>
      <p class="float-left">{{ credential_message }}</p>
      <a
        href="#"
        @click="credential_upload"
        class="button hover:bg-white hover:text-gray-900 float-right mt-2 font-semibold py-2 px-4 border rounded"
      >
        Upload Credential Information
      </a>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

const baseAPI = import.meta.env.VITE_API_BASE_URL;
const fetchAPI = new URL("whoami", baseAPI).toString();
const wgAPI = new URL("request_vpn", baseAPI).toString();
const credentialAPI = new URL("set_credential", baseAPI).toString();

export default {
  data() {
    return {
      message: "Fetching.",
      ready: 0,
      wireguard_conf: "",
      credential: "",
      wg_message: "",
      credential_message: "",
    };
  },
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    credential_upload() {
      const token = Cookies.get("token");
      axios
        .put(
          credentialAPI,
          {
            credential: this.credential,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          this.credential_message =
            "Successfully uploaded credential information.";
          this.fetchUserInfo();
        })
        .catch((error) => {
          if (error.response && error.response.status == 401)
            this.credential_message =
              "Your token has been expired. Please login again.";
          else
            this.credential_message =
              "Unable to upload credential information.";
        });
    },
    wg_conf_generate() {
      const token = Cookies.get("token");
      axios
        .post(
          wgAPI,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          this.wg_message = "Successfully generated wireguard configuration.";
          this.fetchUserInfo();
        })
        .catch((error) => {
          if (error.response && error.response.status == 401)
            this.wg_message =
              "Your token has been expired. Please login again.";
          else this.wg_message = "Unable to generate the wireguard config.";
        });
    },
    fetchUserInfo() {
      const token = Cookies.get("token");
      axios
        .get(fetchAPI, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.message = "";
          let userData = response.data;
          if (userData.hasOwnProperty("wireguard_conf"))
            this.wireguard_conf = userData["wireguard_conf"]["user_conf"];
          if (userData.hasOwnProperty("credential"))
            this.credential = userData["credential"];
          this.ready = 1;
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
