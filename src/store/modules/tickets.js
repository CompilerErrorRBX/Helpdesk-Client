import axios from 'axios';

export default {
  namespaced: true,
  state: {
    tickets: null,
    selected: null,
    comments: null,
    records: null,
    technicians: null,
    labels: null,
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
      state.records.items = [...state.records.items, ...records.items];
      state.records.moreResults = records.moreResults;
    },
    setLabels(state, labels) {
      state.labels = labels;
    },
    appendLabels(state, labels) {
      state.labels.items = [...state.labels.items, ...labels.items];
      state.labels.moreResults = labels.moreResults;
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
      state.dispatch('getRecords', { ticketId: ticket.id, queryString: 'limit=10' });
      state.dispatch('getLabels', { ticketId: ticket.id, queryString: 'limit=100' });
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
    getLabels: (state, options) => {
      const promise = new Promise((resolve, reject) => {
        axios.get(`api/ticket/${options.ticketId}/labels?${options.queryString}`).then((response) => {
          if (!options.append) {
            state.commit('setLabels', response.data);
          } else {
            state.commit('appendLabels', response.data);
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
          state.dispatch('getRecords', { ticketId: comment.ticketId, queryString: 'limit=10' });
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    addTicketTechnician: (state, ticketId) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(`api/ticket/${ticketId}/technician`).then((response) => {
          state.dispatch('getTechnicians', ticketId);
          state.dispatch('getRecords', { ticketId, queryString: 'limit=10' });
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    addTicketLabels: (state, data) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(`api/ticket/${data.ticketId}/labels`, data).then((response) => {
          state.dispatch('getLabels', { ticketId: data.ticketId, queryString: 'limit=100' });
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    removeTicketLabel: (state, data) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(`api/ticket/${data.ticketId}/label/${data.label}`).then((response) => {
          state.dispatch('getLabels', { ticketId: data.ticketId, queryString: 'limit=100' });
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    updateTicketStatus: (state, ticket) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(`api/ticket/${ticket.id}/status/${ticket.status}`).then((response) => {
          state.state.selected.status = response.data.jobUpdate.status;
          state.dispatch('getRecords', { ticketId: ticket.id, queryString: 'limit=10' });
          state.dispatch('getTickets');
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    updateTicketDescription: (state, ticket) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(`api/ticket/${ticket.id}/description`, { description: ticket.description }).then((response) => {
          state.state.selected.description = response.data.jobUpdate.description;
          state.dispatch('getRecords', { ticketId: ticket.id, queryString: 'limit=10' });
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    createTicket: (state, ticket) => {
      const promise = new Promise((resolve, reject) => {
        axios.post('api/tickets', ticket).then((response) => {
          state.dispatch('addTicketLabels', {
            ticketId: response.data.id,
            labels: ticket.labels,
          });
          state.dispatch('setSelected', response.data);
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
  },
};
