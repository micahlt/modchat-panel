<template>
  <main ref="main">
    <div class="message-parent">
      <Message
        :msg="latestReport"
        v-if="latestReport"
        class="quick"
        @ignore="ignore"
        @del="$emit('del', $event)"
        @banModal="$emit('banModal', $event)"
        @muteModal="$emit('muteModal', $event)"
        @contextModal="$emit('contextModal', $event)"
      />
    </div>
    <div class="grid">
      <div class="gridbox red" @click="$emit('banModal', latestReport)">
        <h2>ban</h2>
      </div>
      <div class="gridbox blue" @click="$emit('muteModal', latestReport)">
        <h2>mute</h2>
      </div>
      <div class="gridbox green" @click="ignore(latestReport)">
        <h2>ignore</h2>
      </div>
      <div class="gridbox yellow" @click="$emit('del', latestReport)">
        <h2>delete</h2>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "Quick",
  emits: ["muteModal", "banModal", "del", "contextModal"],
  props: {
    at: String,
  },
  data() {
    return {
      latestReport: null,
      reportedMessages: [],
    };
  },
  mounted() {
    this.getReported();
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
          this.latestReport = data[0];
        });
    },
    ignore(msg) {
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
          this.latestReport = this.reportedMessages[0];
        }
      });
    },
  },
};
</script>

<style scoped>
main {
  height: calc(100% - 3rem);
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.grid {
  display: grid;
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: 100%;
  width: 100%;
}

.gridbox {
  display: grid;
  place-items: center;
  user-select: none;
}

.gridbox h2 {
  font-weight: bold;
  font-size: 3.5rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.gridbox:hover h2 {
  opacity: 1;
}

.red {
  background: #ff5b5b;
  cursor: url("../ban.png"), auto;
}

.yellow {
  background: #fff780;
  cursor: url("../delete.png"), auto;
}

.blue {
  background: #809fff;
  cursor: url("../mute.png"), auto;
}

.green {
  background: #73cd7c;
  cursor: url("../ignore.png"), auto;
}

.quick {
  width: max-content;
  max-width: 70vw;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
}

.message-parent {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  display: grid;
  place-items: center;
}
</style>
