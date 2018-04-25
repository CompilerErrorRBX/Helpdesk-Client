import axios from 'axios';

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    updateComment: (state, comment) => {
      const promise = new Promise((resolve, reject) => {
        axios.patch(`api/comment/${comment.id}`, comment).then(() => {
          resolve();
        }).catch(err => reject(err));
      });

      return promise;
    },

    deleteComment: (state, commentId) => {
      const promise = new Promise((resolve, reject) => {
        axios.delete(`api/comment/${commentId}`).then(() => {
          resolve();
        }).catch(err => reject(err));
      });

      return promise;
    },
  },
};
