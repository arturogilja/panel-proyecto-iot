<template>
  <div id="app">
    <div class="header bold">
      Smartpack - Panel
    </div>
    <div class="container">
      <div v-for="item in items" :key="item.id" class="card" :class="{ active: item.active, inactive: !item.active }">
        <div class="name semi">{{ item.nombre }}</div>
        <div class="description normal">{{ item.descripcion }}</div>
        <div class="status light">
          {{ item.active ? 'Dentro de mochila' : 'Fuera de mochila' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getItems } from './services/items'
import io from 'socket.io-client'
import audioFile from './assets/notify.mp3'
export default {
  data() {
    return {
      items: [],
      socket: null,
    }
  },
  mounted() {
    this.getData()
    this.checkNotificationPermission()
    this.socket = io('https://arturogil.com.mx', { path: '/iot-api/socket.io' })
    this.socket.on('toggle', (item) => {
      console.log(item)
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(`Un objeto ha ${item.active ? 'entrado a' : 'salido de'} tu mochila`, {
          body: `'${item.nombre}' ha ${item.active ? 'entrado a' : 'salido de'} tu mochila`,
        })
      })
      this.playAudio()
      this.getData()
    })
    this.socket.on('new', (item) => {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Nuevo objeto', {
          body: `Se ha creado el objeto ${item.nombre}`,
        })
      })
      this.playAudio()
      this.getData()
    })
  },
  methods: {
    checkNotificationPermission() {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission()
      }
    },
    getData() {
      getItems().then((res) => {
        this.items = res.data
      })
    },
    playAudio() {
      let audio = new Audio(audioFile)
      audio.play()
    },
  },
}
</script>

<style scoped>
.header {
  height: 75px;
  font-size: 2.3rem;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  background-color: #011627;
  color: white;
}

.active {
  border-color: rgb(28, 68, 46);
  background-color: rgba(18, 185, 93, 0.5);
}

.inactive {
  border-color: #a52a3b;
  background-color: #f07575;
}

.container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: row;
}

.card {
  border-width: 2px;
  border-style: solid;
  padding: 10px;
  border-radius: 8px;
  margin: 20px 10px 0 10px;
  width: 250px;
}

.name {
  text-align: center;
  font-size: 1.4rem;
}

.description {
  margin-top: 5px;
  font-size: 1rem;
  text-align: center;
}

.status {
  margin-top: 15px;
}
</style>
