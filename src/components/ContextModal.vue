<script>
export default {
  name: "Modal",
  emits: ["removeNotif", "banModal", "muteModal", "contextModal", "del"],
  props: {
    at: String,
    username: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      messageLog: [],
      msgsBack: 100,
      msgsForward: 100
    };
  },
  mounted() {
    this.msg = window.actionMessage;
    window.actionMessage = null;
    this.user = this.msg.username;
    this.getMessages(this.msg.room, this.msg.id-100, this.msg.id+100);
  },
  methods: {
    getMessages(room, first, last) {
      fetch(`https://modchatserver.micahlindley.com/api/messages/${room}?first=${first}&last=${last}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            return res.json();
          }
        })
        .then((data) => {
          this.messageLog = data;
        });
    },
    moreBefore(msg) {
      this.msgsBack = this.msgsBack + 50;
      this.getMessages(msg.room, msg.id - this.msgsBack, msg.id + this.msgsForward);
    },
    moreAfter(msg) {
      this.msgsForward = this.msgsBack + 50;
      this.getMessages(msg.room, msg.id - this.msgsBack, msg.id + this.msgsForward);
    },
    del(msg) {
      fetch(`https://modchatserver.micahlindley.com/api/messages/delete`, {
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
    ignore(msg) {
          const index = this.messageLog.findIndex((m) => {
            return m.id == msg.id;
          });
          this.messageLog.splice(index, 1);
      }
  }
};
</script>

<template>
  <div class="modal-parent" @click="$emit('close')">
    <div class="modal" @click.stop>
      <h2>Context Log</h2>
      <a href="#" class="button" @click.prevent="moreBefore(msg)">Get more messages before</a>
      <br/>
      <transition-group name="messages" tag="div" class="messages-parent">
        <Message
          v-for="m in messageLog"
          :msg="m"
          :key="m._id"
          @delete="del"
          @ban="$emit('banModal', $event)"
          @mute="$emit('muteModal', $event)"
          @context="$emit('contextModal', $event)"
        />
      </transition-group>
      <a href="#" class="button" @click.prevent="moreAfter(msg)">Get more messages after</a>
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
  z-index: 1;
  top: 0;
  left: 0;
}

.modal {
  background-color: white;
  padding: 1em;
  height: calc(100% - 3rem);
  width: 55vw;
  min-width: 360px;
  border-radius: 0.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  overflow-x: hidden;
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

h2 {
  margin-bottom: 0.5rem;
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
