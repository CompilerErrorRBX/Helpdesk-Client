import axios from 'axios';
import UserHelper from '../../helpers/User';

export default {
  namespaced: true,
  state: {
    theme: {
      primary: 'blue',
      secondary: 'amber',
      accent: 'black',
      error: 'red',
    },
    pageName: 'Home',
    user: null,
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = Object.assign(state.theme, theme);
    },
    setPageName(state, name) {
      state.pageName = name;
    },
    setUser(state, user) {
      state.user = user ? new UserHelper(user) : null;
    },
  },
  actions: {
    setTheme: (state, theme) => {
      state.commit('setTheme', theme);
    },
    setPageName: (state, name) => {
      state.commit('setPageName', name);
    },
    checkUsername: (state, username) => {
      const promise = new Promise((resolve, reject) => {
        axios.get(`api/user/${username}`).then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      });

      return promise;
    },
    login: (state, credentials) => {
      const promise = new Promise((resolve, reject) => {
        axios.post('api/login', { username: credentials.username, password: credentials.password }).then((result) => {
          localStorage.setItem('jwt', result.data.token);
          axios.defaults.headers.common.Authorization = localStorage.getItem('jwt');
          resolve(result.data.user);
        }).catch(() => {
          reject();
        });
      });

      return promise;
    },
    logout: (state) => {
      localStorage.removeItem('jwt');
      state.commit('setUser', null);
    },
    authenticate: (state) => {
      const promise = new Promise((resolve, reject) => {
        axios.post('api/authenticate',
          null,
          { headers: { Authorization: localStorage.getItem('jwt') } },
        ).then((result) => {
          state.commit('setUser', result.data);
          axios.defaults.headers.common.Authorization = localStorage.getItem('jwt');
          resolve(result.data);
        }).catch(() => {
          reject();
        });
      });

      return promise;
    },
  },
};
