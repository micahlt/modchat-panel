<template>
  <NavBar />
  <router-view v-slot="{ Component }">
    <component
      :is="Component"
      :at="access_token"
      v-if="access_token"
      @banModal="openBan"
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
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      access_token: null,
      banModalOpen: false,
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
      fetch(`https://s.modchatserver.micahlindley.com/api/refresh`, {
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
        `https://s.modchatserver.micahlindley.com/api/session/isMod/${window.localStorage.getItem(
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
