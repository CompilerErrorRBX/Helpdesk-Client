import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';
import { createSocketioPlugin } from 'vuex-socketio-plugin';

import modules from './modules';

Vue.use(Vuex);

const socket = io();

const Store = new Vuex.Store({
  plugins: [
    createSocketioPlugin(socket),
  ],
  modules,
  state: {
    connected: false,
    client: socket,
    messages: [],
  },
  mutations: {
    SOCKET_CONNECT(state, { client }) {
      state.client = client;
      state.connected = true;
    },
    SOCKET_DISCONNECTED(state) {
      state.connected = false;
    },
  },
  actions: {
    socket_COMMENT(context) {
      // TODO: Remove this garbage for a better design.
      context.dispatch('tickets/getComments', { ticketId: context.state.tickets.selected.id, queryString: `limit=${context.state.tickets.comments.items.length + 1}` });
    },
  },
});

export default Store;
