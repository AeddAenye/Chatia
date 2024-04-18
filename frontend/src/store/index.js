import NewDialog from '@/components/ModalWindows/newDialog.vue'
import { createStore } from 'vuex'

export default createStore({
  state: {
    authorized: localStorage.getItem('authorized') === 'true',
    username: localStorage.getItem('username'),
    friendname: '',
    chats: [],
    activeChat: ''
  },

  mutations: {
    setAuthorized(state, payload) {
      state.authorized = payload
      localStorage.setItem('authorized', payload)
    },
    setUsername(state, payload) {
      state.username = payload
      localStorage.setItem('username', payload)
    },
    setFriendname(state, payload) {
      state.friendname = payload
    },

    setActiveChat(state, payload) {
      state.chatId = payload
    },

    setChats(state, payload) {
      payload.forEach(elem => {
        if (elem.ownername === this.state.username) {
          state.chats.push(elem = {id: elem.id, friendname: elem.friendname})          
        }
        else {
          state.chats.push(elem = {id: elem.id, friendname: elem.ownername})
        }
      })
      console.log(state.chats);
    }
  },

  actions: {
    async login({ commit }, data) {
      const url = 'http://localhost:3000/api/login';
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      try {
        let response = await fetch(url, requestOptions);
        let json = await response.json();

        if (response.ok) {
          commit('setUsername', data.username)
          commit('setAuthorized', true)
        } else {
          throw new Error('Failed to login');
        }
      } catch (error) {
        throw error;
      }
    },

    async getChats({ commit }) {
      const url = 'http://localhost:3000/api/chats?username=' + this.state.username;
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        let response = await fetch(url, requestOptions);
        let json = await response.json();
        if (response.ok) {
          commit('setChats', json.chats)
        } else {
          throw new Error('Failed to get chats');
        }
      } catch (error) {
        throw error;
      }
    },

    async newChat({ commit }, data) {
      const url = 'http://localhost:3000/api/newchat';
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      try {
        await fetch(url, requestOptions);
      } catch (error) {
        throw error;
      }
    }
  },

  getters: {
    getAuthorized(state) {
      return state.authorized
    },
    getUsername(state) {
      return state.username
    },
    getFriendname(state) {
      return state.friendname
    },

    getChats(state) {
      return state.chats
    },

    getActiveChat(state) {
      return state.activeChat
    }
  }
})
