import axios from 'axios';

export default {
  namespaced: true,
  state: {
    tickets: [],
    selected: null,
    comments: {
      totalResults: 0,
      items: [],
    },
    records: null,
    technicians: [],
  },
  mutations: {
    setTickets(state, tickets) {
      state.tickets = tickets;
    },
    setSelected(state, selected) {
      state.selected = selected;
    },
    setComments(state, comments) {
      state.comments = comments;
    },
    appendComments(state, comments) {
      state.comments.items = [...state.comments.items, ...comments.items];
      state.comments.moreResults = comments.moreResults;
    },
    setRecords(state, records) {
      state.records = records;
    },
    appendRecords(state, records) {
      state.comments.items = [...state.records.items, ...records.items];
      state.comments.moreResults = records.moreResults;
    },
    setTechnicians(state, techs) {
      state.technicians = techs;
    },
  },
  actions: {
    clearTicket: (state) => {
      state.commit('setSelected', null);
      state.commit('setComments', {
        totalResults: 0,
        items: [],
      });
      state.commit('setRecords', null);
      state.commit('setTechnicians', []);
    },
    getTickets: (state) => {
      state.commit('setTickets', null);
      const promise = new Promise((resolve, reject) => {
        axios.get('api/tickets').then((response) => {
          state.commit('setTickets', response.data);
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    getTicket: (state, ticket) => {
      const promise = new Promise((resolve, reject) => {
        axios.get(`api/tickets/${ticket.id}/${ticket.name}`).then((response) => {
          state.dispatch('setSelected', response.data);
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    setSelected: (state, ticket) => {
      state.commit('setSelected', ticket);
      state.dispatch('getComments', { ticketId: ticket.id, queryString: 'limit=3' });
      state.dispatch('getRecords', { ticketId: ticket.id, queryString: 'limit=20' });
      state.dispatch('getTechnicians', ticket.id);
    },
    getComments: (state, options) => {
      const promise = new Promise((resolve, reject) => {
        axios.get(`api/ticket/${options.ticketId}/comments?${options.queryString}`).then((response) => {
          if (!options.append) {
            state.commit('setComments', response.data);
          } else {
            state.commit('appendComments', response.data);
          }
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    getRecords: (state, options) => {
      const promise = new Promise((resolve, reject) => {
        axios.get(`api/ticket/${options.ticketId}/records?${options.queryString}`).then((response) => {
          if (!options.append) {
            state.commit('setRecords', response.data);
          } else {
            state.commit('appendRecords', response.data);
          }
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    getTechnicians: (state, ticketId) => {
      const promise = new Promise((resolve, reject) => {
        axios.get(`api/ticket/${ticketId}/technicians`).then((response) => {
          state.commit('setTechnicians', response.data);
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    addTicketComment: (state, comment) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(`api/ticket/${comment.ticketId}/comment`, comment.comment).then((response) => {
          state.dispatch('getComments', {
            ticketId: comment.ticketId,
            queryString: 'limit=3',
          });
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    addTicketTechnician: (state, ticketId) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(`api/ticket/${ticketId}/technician`).then((response) => {
          state.dispatch('getTechnicians', ticketId);
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    updateTicketStatus: (state, ticket) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(`api/ticket/${ticket.id}/status/${ticket.status}`).then((response) => {
          state.dispatch('setSelected', response.data.jobUpdate);
          state.dispatch('getTickets');
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    updateTicketDescription: (state, ticket) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(`api/ticket/${ticket.id}/description`, { description: ticket.description }).then((response) => {
          state.dispatch('setSelected', response.data.jobUpdate);
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    createTicket: (state, ticket) => {
      const promise = new Promise((resolve, reject) => {
        axios.post('api/tickets', ticket).then((response) => {
          state.dispatch('setSelected', response.data);
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
  },
};
