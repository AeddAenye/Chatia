<template>
    <div class="background">
      <div class="reg-container">
        <div class="reg-container__exit">
          <button type="button" @click="close()">X</button>
        </div>
        <input type="text" placeholder="Ваш ник" v-model="username" required minlength="4" maxlength="8">
        <input type="password" name="" placeholder="Ваш пароль" v-model="password" required minlength="8" maxlength="32">
        <button type="button" @click="login()">Войти</button>
        <div class="error"><span>{{ error }}</span></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineEmits, ref, inject, computed} from 'vue'
  import hashPassword from './hashpasswd.js'
  
  const store = inject('store')
  const socket = inject('socket')
  const emits = defineEmits(['close'])
  
  let username = ref('')
  let password = ref('')
  let error = computed(() => store.getters.getError)
  
  const close = () => {
    username.value = ''
    password.value = ''
    emits('close')
  }
  
  const login = async () => {
    let data = {}
      if(username.value !== '' || password.value !== ''){
        data = {
          username: username.value,
          password: hashPassword(password.value)
        }
      }
 
  
    try {
      socket.emit('authenticate', username.value)
      await store.dispatch('login', data);
      
      await store.dispatch('chats')
      
      emits('close');
    } catch (error) {
      console.error('Login Error:', error);
    }
  }
  </script>
  
<style scoped>

.background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100svw;
    height: 100svh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;

    transition: all 0.3s ease;
}

.reg-container__exit {
    position: absolute;
    top: 1svw;
    right: 1svw;
    
}

.reg-container__exit button {
    background-color: red;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 0.7svw;
    color: white;

    display: flex;
    justify-content: center;
    align-items: center;
}
.reg-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 50%;
    height: 50%;
    
    background-color:  rgb(30, 30, 30);
    border-radius: 2svw;
    padding: 2svw;
    box-sizing: border-box;


    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1svw;

}

input{
    width: 70%;
    height: 5vh;
    font-size: 1.5svw;
    border-radius: 2svw;
    padding: 1svw 2svw;
    border: none;
    background-color: rgb(50, 50, 50);
    color: white;

}

button{
    font-size: 1.2svw;
    padding: 0.5svw;
    border-radius: 0.7svw;
    border: none;
}
</style>