<template>
    <div class="message">
      <div class="message__name">{{ message.ownername }}</div>
      <div class="message__text">{{ message.message }}</div>
      <div class="message__time">{{ getTime(message.send_time) }}</div>
    </div>
  </template>
  
<script>
  export default {
    props: {
      message: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<script setup>
const getTime = (timestamp) => {
    const date = new Date(timestamp);
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return formattedTime;
}

</script>

<style scoped>
.message {
  width: fit-content;
  min-width: 100px;
  max-width: 80%;
  border: 1px solid rgb(80, 80, 80);
  border-radius: 1svw;
  padding: 0.5svw 1svw;
  padding-bottom: 1.3svw;

  justify-self: start;
  align-self: stretch;
  position: relative;
}

.message__name{
  font-size: 1svw;
  font-weight: 600;
  padding-bottom: 0.5svw;
}

.message__time{
  font-size: 0.7svw;
  color: rgb(142, 142, 142);
  position: absolute;
  right: 0.5svw;
  bottom: 0.5svw;
}

@media screen and (max-width: 1200px) {
  .message__name{
    font-size: 1.5svw;
  }
}

@media screen and (max-width: 900px) {
  .message__name{
    font-size: 2svw;
  }
}

@media screen and (max-width: 700px) { 
  .message__name{
    font-size: 2.5svw;
  }
}

@media screen and (max-width: 500px) {
  .message__name{
    font-size: 3svw;
  }
}
</style>

