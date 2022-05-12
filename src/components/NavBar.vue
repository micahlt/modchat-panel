<script>
export default {
  name: "NavBar",
  data() {
    return {
      path: "/home",
    };
  },
  mounted() {
    this.$router.afterEach((to) => {
      this.path = to.path;
    });
  },
  methods: {
    openModchat() {
      window.open("https://modchat.micahlindley.com");
    },
  },
};
</script>

<template>
  <nav>
    <img
      src="../assets/logo-lightmode.png"
      alt="Modchat logo"
      @click="openModchat"
      title="Open Modchat in a new tab"
    />
    <router-link to="/home" class="home" v-if="path == '/quick'"
      >back to normal view</router-link
    >
  </nav>
</template>

<style scoped>
nav {
  width: 100%;
  background-color: #e6e6e6;
  height: 3rem;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  justify-content: space-between;
}

img {
  height: 50%;
  padding-left: 1em;
  cursor: pointer;
}

.home {
  text-align: right;
  padding-right: 1em;
  color: inherit;
}
</style>
