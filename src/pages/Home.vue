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
        <router-link to="/quick" class="button" @click.prevent
          >Quick Mode</router-link
        >
      </div>
      <transition-group name="messages" tag="div" class="messages-parent">
        <Message
          v-for="m in reportedMessages"
          :msg="m"
          :key="m._id"
          @ignore="ignore"
          @del="$emit('del', $event)"
          @banModal="$emit('banModal', $event)"
          @muteModal="$emit('muteModal', $event)"
          @contextModal="$emit('contextModal', $event)"
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
      <transition-group name="messages" tag="div" class="content banned-parent">
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
    <div class="gridcol">
      <div class="col-heading">
        <h2>Admin Actions</h2>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "Home",
  emits: ["banModal", "unban", "unmute", "del"],
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
      fetch(`https://modchatserver.micahlindley.com/api/reported`, {
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
      fetch(`https://modchatserver.micahlindley.com/api/bannedMuted`, {
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
      fetch(`https://modchatserver.micahlindley.com/api/messages/report`, {
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
  },
};
</script>

<style scoped>
main {
  height: calc(100% - 3rem);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

.messages-parent:empty:after {
  content: "No reports for now!";
  width: 100%;
  text-align: center;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
}

.banned-parent:empty,
.messages-parent:empty {
  position: relative;
  height: calc(100% - 5rem);
}

.banned-parent:empty:after {
  content: "No banned/muted users!";
  width: 100%;
  text-align: center;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
}

.refresher {
  text-decoration: none;
  color: #3c30ff;
  margin-right: 0.5rem;
  font-size: 1.2rem;
}
</style>