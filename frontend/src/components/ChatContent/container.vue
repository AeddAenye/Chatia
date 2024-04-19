<template>
  <ChatMenu />
  <div class="chat__container" ref="chatContainer">
    <Message v-for="(message, index) in messages" :key="index" :message="message" />
  </div>
  <Input />
</template>

<script setup>
import { ref, watch, onUnmounted, inject, nextTick, onMounted } from 'vue';
import ChatMenu from './menu.vue';
import Message from './message.vue';
import Input from './input.vue';

const messages = ref([]);
const chatContainer = ref(null);

const store = inject('store');
const socket = inject('socket');

socket.on('newmessage', () => {
  store.dispatch('chatMessages').then(() => {
    messages.value = store.getters.getMessages;
    scrollToBottom();
  });
});

const scrollToBottom = () => {
  nextTick(() => {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  });
};

watch(messages, () => {
  const gridRows = messages.value.length + 1;
  document.documentElement.style.setProperty('--grid-rows', gridRows);
});


</script>

<style scoped>
.chat__container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px 10px;
  grid-auto-flow: row;
  --grid-rows: auto;
  grid-template-rows: repeat(var(--grid-rows), auto);
  overflow-y: scroll;
  padding-bottom: 100px;
}

.chat__container>div {
  grid-row-end: span 1;
}
</style>
