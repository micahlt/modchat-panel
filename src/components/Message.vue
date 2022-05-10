<template>
  <div class="message">
    <img :src="msg.profile_picture" :alt="msg.username" @click="openUser" />
    <div class="message-content">
      <p class="title" @click="openUser">
        <b>{{ msg.username }}</b>
      </p>
      <p class="message-text">{{ msg.message }}</p>
      <p class="message-timestamp">
        {{
          new Date(msg.time).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        }}
      </p>
    </div>
    <div class="options-parent" v-click-outside="closeOptions">
      <a
        class="material-symbols-outlined options-toggle"
        role="button"
        @click="toggleOptions"
        >more_vert</a
      >
      <div :class="{ options: true, visible: optsOpen }">
        <a class="option" @click="ban">Ban user</a>
        <a class="option">Mute user</a>
        <a class="option" @click="del">Delete message</a>
        <a class="option" @click="ignore">Ignore report</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",
  emits: ["ignore", "delete", "ban", "mute"],
  props: {
    msg: Object,
  },
  data() {
    return {
      optsOpen: false,
    };
  },
  methods: {
    openUser() {
      window.open(`https://scratch.mit.edu/users/${this.msg.username}`);
    },
    toggleOptions() {
      this.optsOpen = !this.optsOpen;
    },
    closeOptions() {
      if (this.optsOpen == true) {
        this.optsOpen = false;
      }
    },
    ignore() {
      this.closeOptions();
      this.$emit("ignore", this.msg);
    },
    del() {
      this.closeOptions();
      this.$emit("delete", this.msg);
    },
    ban() {
      this.closeOptions();
      this.$emit("ban", this.msg);
    },
  },
};
</script>

<style scoped>
.message {
  border: 1px solid #c1c1c1;
  background: #fbfbfb;
  border-radius: 0.25rem;
  display: flex;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.3rem;
  position: relative;
  width: calc(100% - 2.75rem);
}

img {
  height: 2rem;
  width: 2rem;
  padding: 0.5rem;
  border-radius: 50%;
  margin-right: 0.25rem;
  cursor: pointer;
}

.message-text {
  font-size: 0.9em;
  margin-right: 0.75rem;
  word-break: break-word;
}

.title {
  cursor: pointer;
}

.message:last-of-type {
  margin-bottom: 1rem;
}

.options-toggle {
  position: absolute;
  top: 0.25rem;
  right: 0;
  line-height: 1;
  color: #c1c1c1;
  cursor: pointer;
  transition: 0.2s;
  user-select: none;
}

.options-toggle:hover {
  color: black;
}

.options {
  display: none;
  position: absolute;
  top: 0.5rem;
  right: 1.3rem;
  flex-direction: column;
  background: #fbfbfb;
  font-size: 0.9em;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  z-index: 1;
  border-radius: 0.25rem;
}

.options.visible {
  display: flex;
}

.option {
  margin-bottom: 0.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  cursor: pointer;
}

.option:hover {
  background: #c1c1c1;
}

.message-timestamp {
  font-size: 0.6em;
  margin-top: 0.2rem;
  color: #adadad;
}
</style>
