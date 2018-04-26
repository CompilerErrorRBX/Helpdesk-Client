import axios from 'axios';

export default {
  namespaced: true,
  state: {
    userProfile: null,
  },
  mutations: {
    setUserProfile(state, user) {
      state.userProfile = user;
    },
  },
  actions: {
    acceptTerms: () => {
      const promise = new Promise((resolve, reject) => {
        axios.patch('api/user', { agreedTOS: true }).then((response) => {
          resolve(response.data);
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    getUser: (state, username) => {
      const promise = new Promise((resolve, reject) => {
        axios.get(`api/users?username=${username}&limit=1`).then(response => resolve(response.data[0]))
          .catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    getUserData: (state, username) => {
      const promise = new Promise((resolve, reject) => {
        axios.get(`api/user/${username}/data`)
          .then((response) => {
            state.commit('setUserProfile', response.data);
            resolve(response.data);
          })
          .catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
    addRole: (state, data) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(`api/user/${data.username}/addRole/${data.role}`)
          .then((response) => {
            state.dispatch('getUserData', data.username);
            resolve(response.data);
          })
          .catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
  },
};
