import NewDialog from '@/components/ModalWindows/newDialog.vue'
import { createStore } from 'vuex'
import { io } from'socket.io-client'

const socket = io('http://localhost:3000')

export default createStore({
  state: {
    authorized: localStorage.getItem('authorized') === 'true',
    username: localStorage.getItem('username'),
    friendname: '',
    chats: [],
    messages: [],
    activeChat: '',
    error: ''
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
      state.activeChat = payload
    },

    setChats(state, payload) {
      state.chats = payload.map(elem => {
        const existingChat = state.chats.find(chat => chat.id === elem.chat_id);
        if (existingChat) {
          return existingChat;
        } else {
          return {
            id: elem.chat_id,
            friendname: elem.ownername === this.state.username ? elem.friendname : elem.ownername
          };
        }
      });
    },
    

    clearChats (state) {
      state.chats = []
    },

    setError(state, payload) {
      state.error = payload
    },

    setMessages(state, payload) {
      state.messages = payload
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
          commit('setError', json.message)
          throw new Error(json.message || 'Failed to login');
        }
      } catch (error) {
        throw error;
      }
    },
    async logout({ commit }) {
      commit('setAuthorized', false)
      commit('setUsername', '')
      commit('setFriendname', '')
      commit('clearChats')

      console.log('Logged out', this.state.chats);
    },

    async chats({ commit }) {
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
        console.log("CHATS ", json.chats);
        if (response.ok) {
          console.log("JSON chats", json.chats);
          await commit('setChats', json.chats)
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
        const response = await fetch(url, requestOptions);
        const json = await response.json();
        console.log("JSON newchat", json);
        if (response.ok) {
          commit('setChats', json.chats)
          socket.emit('newchat', {
            ownername: data.ownername,
            friendname: data.friendname
          })
        } else {
          commit('setError', json.message)
          throw new Error(json.message || 'Failed to create chat');
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async newMessage({ commit }, data) {
      const url = 'http://localhost:3000/api/newmessage';
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      try {
        const response = await fetch(url, requestOptions);
        const json = await response.json();
        console.log("JSON newmessage", json);
        if (response.ok) {
          socket.emit('newmessage', {
            ownername: data.ownername,
            friendname: data.friendname,
            message: data.message,
            chat_id: data.chat_id,
          })
        } else {
          commit('setError', json.message)
          throw new Error(json.message || 'Failed to create message');
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async chatMessages({ commit }) {
      const chat = this.state.activeChat
      const url = 'http://localhost:3000/api/chatmessages?chat_id=' + chat.id;
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        let response = await fetch(url, requestOptions);
        let json = await response.json();
        console.log("JSON chatmessages", json);
        if (response.ok) {
          await commit('setMessages', json.messages)
        } else {
          throw new Error('Failed to get chats');
        }
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
    },

    getError(state) {
      return state.error
    },
    getMessages(state) {
      return state.messages
    }
  }
})
