<template>
    <Header />
    <div class="wrapper dialog_wrapper" v-if="friendname == ''">
        <Dialogs />
    </div>
    <div class="wrapper chat-wrapper" v-if="friendname != ''">
        <Chat />
    </div>
</template>

<script>
import Header from './components/HeaderContent/container.vue';
import Dialogs from './components/DialogContent/container.vue';
import Chat from './components/ChatContent/container.vue';
export default {
  name: 'App',
  components: {
    Header,
    Dialogs,
    Chat
  }
  }
</script>

<script setup>
import { provide, ref, watch, onBeforeMount,onMounted , computed } from 'vue'
import { useStore } from 'vuex'
import { io } from 'socket.io-client'

const store = useStore()
let socket;
provide('store', store)



let friendname = computed(() => store.getters.getFriendname)

onBeforeMount(() => {
    socket = io('http://localhost:3000')
    provide('socket', socket)
})

onMounted(() => {


    if (store.getters.getAuthorized){
        socket.emit('authenticate', store.getters.getUsername)
        store.dispatch('chats')
    }
})
</script>

<style scoped>
.wrapper{
    background-color: var(--accent-bg-color);
    border-radius: 20px;
    padding: 0% 3svw;

    width: 50%;
    height: 85%;

    display: flex;
    flex-direction: column;

}

.chat-wrapper{
    position: relative;
}

@media screen and (max-width: 900px) {
    .wrapper{
        width: 70%;
    }
}

@media screen and (max-width: 700px) {
    .wrapper{
        width: 96%;
        border: none;
        padding: 2%;
    }
}

@media screen and (max-width: 500px) {
    .wrapper{
        height: 90%;
    }
    
}
</style>