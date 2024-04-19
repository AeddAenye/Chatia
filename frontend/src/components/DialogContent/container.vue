<template>
  <Menu />
  <div class="dialog-container">
    <Dialog v-for="chat in chats" :key="chat.id"
    :dialogName="chat.friendname" @click="openChat(chat)"/>
  </div>
</template>


<script setup>
import { ref, inject, computed, onMounted, watch } from 'vue'

const store = inject('store')
const socket = inject('socket')

let chats = ref([])

watch(() => store.state.chats, (newVal) => {
  chats.value = newVal
})

const openChat = (chat) => {
  store.commit('setFriendname', chat.friendname)
  console.log(chat)
  store.commit('setActiveChat', chat)


  socket.emit('openchat', {
            ownername: store.getters.getUsername,
            friendname: store.getters.getFriendname,
            chat_id: store.getters.getActiveChat.id,
          })
}

onMounted(() => {
  store.dispatch('chats').then(() => {
    chats.value = store.getters.getChats
    console.log("ПОСЛЕ ДИСПАТЧА", chats.value)

  });
})

socket.on('newchat', () => {
  console.log("ПОЛУЧЕН ЭМИТ ")
  console.log(chats.value)
  store.dispatch('chats').then(() => {
    chats.value = store.getters.getChats
    console.log("ПОСЛЕ ДИСПАТЧА", chats.value)
  });
})

</script>

<script>
import Dialog from './singleDialog.vue'
import Menu from './menu.vue'

export default {
    name: 'DialogContainer',
  components: {
    Dialog,
    Menu
  }
}
</script>

<style scoped>
.dialog-container {
  height: 100%;
  overflow-y: auto;
}
</style>

