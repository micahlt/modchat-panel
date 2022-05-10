<script>
export default {
  name: "NavBar",
};
</script>

<template>
  <nav>
    <img src="../assets/logo-lightmode.png" alt="Modchat logo" />
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
}

img {
  height: 50%;
  padding-left: 1em;
}
</style>
