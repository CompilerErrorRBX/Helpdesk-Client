<template>
  <v-card flat>
    <div class="comment-box">
      <v-list-tile-avatar>
        <avatar :user="user" />
      </v-list-tile-avatar>
      <div class="comment-container">
        <label v-show="!focused && !text.length" class="placeholder">{{ placeholder }}</label>
        <div
          ref="comment"
          contenteditable
          @focus="selected = true; focused = true"
          @blur="focused = false"
          @input="inputListener"
          @paste="paste"
          @keydown="keydown"
          :placeholder="placeholder"
          class="comment"
        />
      </div>
    </div>
    <v-expansion-panel class="elevation-0">
      <v-expansion-panel-content hide-actions :value="selected">
        <v-card flat>
          <v-toolbar dense card>
            <v-btn class="ml-3 mr-0" icon>
              <v-icon color="grey darken-1">add_a_photo</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon color="grey darken-1">attach_file</v-icon>
            </v-btn>
            <v-spacer />
            <v-btn flat color="primary" @click="submitComment">
              Post
            </v-btn>
          </v-toolbar>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
// import nlp from 'compromise';

import Avatar from '../components/Avatar';

export default {
  name: 'CommentBox',
  components: { Avatar },
  computed: {
    ...mapState({
      user: state => state.app.user,
    }),
  },
  data: () => ({
    text: '',
    selected: false,
    focused: false,
    showUserRef: true,
  }),
  props: {
    placeholder: String,
  },
  methods: {
    paste(e) {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    },
    keydown(e) {
      if (e.keyCode === 9) { // tab key
        e.preventDefault();
        document.execCommand('insertHTML', false, '&#09');
      }
    },
    inputListener() {
      this.text = this.$refs.comment.innerText;
    },
    submitComment() {
      this.$store.dispatch(
        'tickets/addTicketComment',
        {
          ticketId: this.$store.state.tickets.selected.id,
          comment: {
            body: this.text,
          },
        },
      );

      // const processed = nlp(this.text).normalize();
      // console.log(processed.dates().data());

      this.text = '';
      this.$refs.comment.innerText = '';
    },
  },
};
</script>

<style lang="scss" scoped>
  .comment-box {
    display: flex;
    padding: 0 16px;
    min-height: 64px;
    width: 100%;
    align-content: center;
    align-items: center;
    color: inherit;
  }
  .comment-container {
    min-height: 18px;
    padding: 16px 0;
    width: 100%;
    font-size: 14px;
    color: inherit;
  }
  .comment {
    font-size: inherit;
    line-height: 18px;
    min-height: 18px;
    width: 100%;
    overflow: auto;
    height: auto;
    resize: none;
    outline: none;
    white-space: pre-wrap;
    color: inherit;
  }
  .placeholder {
    font-size: inherit;
    pointer-events: none;
    position: absolute;
    color: inherit;
  }
</style>
