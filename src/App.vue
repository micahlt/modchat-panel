<template>
  <NavBar />
  <router-view v-slot="{ Component }">
    <component
      :is="Component"
      :at="access_token"
      v-if="access_token"
      @banModal="openBan"
      @muteModal="openMute"
      @unban="unbanPrep"
      @unmute="unmutePrep"
      ref="page"
    />
  </router-view>
  <BanModal
    v-if="banModalOpen"
    @close="closeModals"
    :at="access_token"
    :username="actionUsername"
    :fromMessage="actionMessage"
    @removeNotif="removeNotif"
  />
  <muteModal
    v-if="muteModalOpen"
    @close="closeModals"
    :at="access_token"
    :username="actionUsername"
    :fromMessage="actionMessage"
    @removeNotif="removeNotif"
  />
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      access_token: null,
      banModalOpen: false,
      muteModalOpen: false,
      actionUsername: "",
      actionMessage: {},
    };
  },
  mounted() {
    if (
      window.localStorage.getItem("u") &&
      window.localStorage.getItem("u") != "null" &&
      window.localStorage.getItem("u").length > 0
    ) {
      this.authenticate();
    } else {
      let username = window.prompt("What's your Modchat account username?");
      if (username == null || username.length < 1) {
        window.location.replace("https://modchat.micahlindley.com/");
      }
      window.localStorage.setItem("u", username);
      this.authenticate();
    }
  },
  methods: {
    authenticate() {
      fetch(`https://modchatserver.micahlindley.com/api/refresh`, {
        method: "POST",
        body: JSON.stringify({
          username: window.localStorage.getItem("u"),
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "include",
      })
        .then((res) => {
          if (res.status == 200) {
            return res.json();
          }
        })
        .then((data) => {
          this.access_token = data.access_token;
          this.authorize();
        });
    },
    authorize() {
      fetch(
        `https://modchatserver.micahlindley.com/api/session/isMod/${window.localStorage.getItem(
          "u"
        )}`
      )
        .then((res) => {
          return res.text();
        })
        .then((text) => {
          if (text == "true") {
            console.log("Officially a moderator!");
          }
        });
    },
    unban(username) {
      fetch(`https://modchatserver.micahlindley.com/api/session/unban`, {
        method: "POST",
        body: JSON.stringify({
          username: String(username),
          access_token: String(this.access_token),
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "include",
      });
    },
    unmute(username) {
      fetch(`https://modchatserver.micahlindley.com/api/session/mute`, {
        method: "POST",
        body: JSON.stringify({
          username: String(username),
          access_token: String(this.acesss_token),
          timeStamp: Number(-50),
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "include",
      });
    },
    closeModals() {
      this.actionUsername = "";
      this.actionMessage = {};
      this.banModalOpen = false;
      this.muteModalOpen = false;
    },
    openBan(msg) {
      this.actionUsername = msg.username;
      this.actionMessage = msg;
      this.banModalOpen = true;
    },
    openMute(msg) {
      this.actionUsername = msg.username;
      this.actionMessage = msg;
      this.muteModalOpen = true;
    },
    unmutePrep(msg) {
      this.actionUsername = msg.username;
      this.actionMessage = msg;
      this.unmute(this.actionUsername);
    },
    unbanPrep(msg) {
      this.actionUsername = msg.username;
      this.actionMessage = msg;
      this.unban(this.actionUsername);
    },
    removeNotif() {
      this.$refs.page.ignore(this.actionMessage);
      this.closeModals();
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  font-family: "Inter", sans-serif;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border: solid 3px white;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #adadad;
}
</style>
