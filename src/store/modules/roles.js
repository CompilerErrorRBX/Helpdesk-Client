import axios from 'axios';

export default {
  namespaced: true,
  state: {
    roles: [],
  },
  mutations: {
    setRoles(state, roles) {
      state.roles = roles;
    },
  },
  actions: {
    getRoles: (state) => {
      const promise = new Promise((resolve, reject) => {
        axios.get('api/roles')
          .then((response) => {
            state.commit('setRoles', response.data);
            resolve(response.data);
          })
          .catch(() => reject('Internal Server Error.'));
      });

      return promise;
    },
  },
};
