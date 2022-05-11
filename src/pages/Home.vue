<template>
  <main>
    <div class="gridcol">
      <div class="col-heading">
        <h2>Reported Messages</h2>
        <a
          href="#"
          class="refresher material-symbols-outlined"
          @click.prevent="getReported"
          title="Refresh"
          >refresh</a
        >
        <a href="#" class="button" @click.prevent>Quick Mode</a>
      </div>
      <transition-group name="messages" tag="div" class="messages-parent">
        <Message
          v-for="m in reportedMessages"
          :msg="m"
          :key="m._id"
          @ignore="ignore"
          @delete="del"
          @ban="$emit('banModal', $event)"
          @mute="$emit('muteModal', $event)"
        />
      </transition-group>
    </div>
    <div class="gridcol">
      <div class="col-heading">
        <h2>Banned &amp; Muted Users</h2>
        <a
          href="#"
          class="refresher material-symbols-outlined"
          @click.prevent="getNewBannedMuted"
          title="Refresh"
          >refresh</a
        >
      </div>
      <transition-group name="messages" tag="div" class="content">
        <BannedMuted
          v-for="m in bannedMuted"
          :msg="m"
          :key="m._id"
          @unmute="$emit('unmute', $event)"
          @unban="$emit('unban', $event)"
          @bannedMutedIgnore="bannedMutedDelete"
        />
      </transition-group>
    </div>
  </main>
</template>

<script>
export default {
  name: "Home",
  emits: ["banModal", "unban", "unmute"],
  props: {
    at: String,
  },
  data() {
    return {
      reportedMessages: [],
      bannedMuted: [],
    };
  },
  mounted() {
    this.getReported();
    this.getNewBannedMuted();
    setInterval(this.getReported, 45000);
    setInterval(this.getNewBannedMuted, 45000);
  },
  methods: {
    getReported() {
      fetch(`https://s.modchatserver.micahlindley.com/api/reported`, {
        method: "POST",
        body: JSON.stringify({
          access_token: this.at,
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
          this.reportedMessages = data;
        });
    },
    getNewBannedMuted() {
      fetch(`https://s.modchatserver.micahlindley.com/api/bannedMuted`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          this.bannedMuted = data;
        });
    },
    ignore(msg) {
      console.log(msg);
      fetch(`https://s.modchatserver.micahlindley.com/api/messages/report`, {
        method: "POST",
        body: JSON.stringify({
          username: window.localStorage.getItem("u"),
          room: msg.room,
          access_token: this.at,
          id: msg.id,
          type: false,
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "include",
      }).then((res) => {
        if (res.status == 200) {
          const index = this.reportedMessages.findIndex((m) => {
            return m.id == msg.id;
          });
          this.reportedMessages.splice(index, 1);
        }
      });
    },
    bannedMutedDelete(data) {
          const index = this.bannedMuted.findIndex((m) => {
            return m.id == data.id;
          });
          this.bannedMuted.splice(index, 1);
    },
    del(msg) {
      fetch(`https://s.modchatserver.micahlindley.com/api/messages/delete`, {
        method: "POST",
        body: JSON.stringify({
          room: msg.room,
          access_token: this.at,
          id: msg.id,
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "include",
      }).then((res) => {
        if (res.status == 200) {
          this.ignore(msg);
        }
      });
    },
  },
};
</script>

<style scoped>
main {
  height: calc(100% - 3rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.gridcol {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  margin: 3vw;
  border-radius: 0.25rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.col-heading {
  display: flex;
  padding: 1rem;
  align-items: center;
}

.col-heading h2 {
  font-size: 1.1em;
  flex-grow: 1;
}

.button {
  font-size: 0.9em;
  background: #e6e6e6;
  text-decoration: none;
  padding: 0.5em 1em;
  line-height: 1;
  color: black;
  border-radius: 0.25em;
  transition: 0.2s;
}

.button:hover {
  color: #e6e6e6;
  background: #3c30ff;
}

.messages-move, /* apply transition to moving elements */
.messages-enter-active,
.messages-leave-active {
  transition: all 0.5s ease;
}

.messages-enter-from,
.messages-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.messages-leave-active {
  position: absolute;
}

.messages-parent {
  position: relative;
}

.refresher {
  text-decoration: none;
  color: #3c30ff;
  margin-right: 0.5rem;
  font-size: 1.2rem;
}
</style>