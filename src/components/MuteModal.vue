<script>
export default {
  name: "Modal",
  emits: ["removeNotif", "close"],
  props: {
    at: String,
    username: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      user: "",
      reason: "",
      expiry: "",
    };
  },
  mounted() {
    this.user = this.username;
  },
  methods: {
    mute() {
      fetch(`https://modchatserver.micahlindley.com/api/session/mute`, {
        method: "POST",
        body: JSON.stringify({
          username: String(this.user),
          access_token: String(this.at),
          timeStamp: Number(this.expiry * 60000),
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "include",
      }).then((res) => {
        if (res.status) {
          this.$emit("removeNotif");
        }
      });
    },
  },
};
</script>

<template>
  <div class="modal-parent" @click="$emit('close')">
    <div class="modal" @click.stop>
      <h2>Mute User</h2>
      <div class="input-wrapper">
        <input
          type="text"
          name="username"
          v-model="user"
          placeholder="username"
        />
        <span></span>
      </div>
      <div class="input-wrapper">
        <input
          type="text"
          name="duration"
          v-model="expiry"
          placeholder="duration (minutes)"
        />
        <span></span>
      </div>
      <a href="#" class="button" @click.prevent="mute">MUTE</a>
        <span></span>
    </div>
  </div>
</template>

<style scoped>
.modal-parent {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
}

.modal {
  background-color: white;
  padding: 1em;
  height: max-content;
  width: 55vw;
  min-width: 360px;
  border-radius: 0.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

h2 {
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  width: max-content;
  margin-bottom: 0.5rem;
}

.input-wrapper.long {
  width: 100%;
}

.input-wrapper.long input {
  width: calc(100% - 1rem);
}

input[type="text"] {
  color: black;
  font-size: inherit;
  font-family: inherit;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom-color: #c1c1c1;
  padding: 0.3em;
}

input[type="text"]:focus {
  outline: none;
}

input[type="text"]:disabled {
  color: black;
}

input[type="text"]::placeholder {
  color: #c1c1c1;
  font-family: "Inter", sans-serif;
}

span {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100%;
  height: 1px;
  opacity: 0;
  background-color: #3c30ff;
  transform-origin: center;
  transform: translate(-50%, 0) scaleX(0);
  transition: all 0.3s ease;
}

input[type="text"]:focus ~ span {
  transform: translate(-50%, 0) scaleX(1);
  opacity: 1;
}

.button {
  margin-top: 0.5rem;
  background: #3c30ff;
  color: white;
  border-radius: 4em;
  font-size: 0.8em;
  text-decoration: none;
  padding: 0.8em 1.2em;
  transition: all 0.2s;
  box-shadow: 0 1px 0.1em rgba(0, 0, 0, 0.7);
  text-transform: uppercase;
  will-change: box-shadow, filter;
  display: block;
  width: max-content;
}

.button:hover {
  filter: brightness(0.9);
  transition: all 0.2s;
  box-shadow: 0 2px 0.7em rgba(0, 0, 0, 0.4);
}
</style>
