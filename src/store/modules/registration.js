import axios from 'axios';

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    register: (state, user) => {
      const promise = new Promise((resolve, reject) => {
        axios.post(
          'api/register',
          user,
        ).then((result) => {
          localStorage.setItem('jwt', result.data.token);
          localStorage.setItem('user', result.data.user);
          axios.defaults.headers.common.Authorization = localStorage.getItem('jwt');
          resolve(result.data.user);
        }).catch(() => {
          reject();
        });
      });

      return promise;
    },
    usernameAvailable: (state, username) => {
      const promise = new Promise((resolve, reject) => {
        axios.get(`api/users?username=${username}&limit=1`).then((response) => {
          if (response.data.length) {
            return reject();
          }
          return resolve();
        }).catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
  },
};
