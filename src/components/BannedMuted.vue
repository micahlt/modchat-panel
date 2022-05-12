<template>
  <div class="bannedMuted">
    <img :src="msg.scratch_picture" :alt="msg.username" @click="openUser" />
    <div class="content">
      <p class="title" @click="openUser">
        <b>{{ msg.username }}</b>
      </p>
      <p v-if="msg.banned === true" class="message-text">
        {{ msg.ban_reason }}
      </p>
      <p v-if="msg.banned === true" class="message-timestamp">
        Banned Until:
        {{
          new Date(msg.ban_expiry).toLocaleString("en-US", {
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
      <p class="message-timestamp">
        Muted Until:
        {{
          new Date(msg.mutedFor).toLocaleString("en-US", {
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
        <a class="option" @click="unban">Unban user</a>
        <a class="option" @click="unmute">Unmute user</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BannedMuted",
  emits: ["unban", "unmute", "bannedMutedIgnore"],
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
    unban() {
      this.closeOptions();
      if (this.msg.banned === true) {
        this.$emit("unban", this.msg);
        this.$emit("bannedMutedIgnore", this.msg);
      }
    },
    unmute() {
      this.closeOptions();
      if (Date.now() < this.msg.mutedFor) {
        this.$emit("unban", this.msg);
        this.$emit("bannedMutedIgnore", this.msg);
      }
    },
  },
};
</script>

<style scoped>
.bannedMuted {
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
