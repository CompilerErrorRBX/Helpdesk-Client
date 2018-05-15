<template>
  <v-slide-y-transition>
    <v-card slot="header" class="comment-card py-1" v-if="comment" flat>
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <avatar :user="comment.commenter" no-actions popover />
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title class="body-2">
            {{ `${comment.commenter.firstName} ${comment.commenter.lastName}` }}
            <v-chip
              v-for="role in comment.commenter.roles"
              :key="role.role"
              class="chip--x-small"
              disabled
            >{{ role.role }}</v-chip>
          </v-list-tile-title>
          <v-list-tile-sub-title class="caption">
            {{ comment.createdAt | dateTime }}
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-btn v-if="reply" class="mr-0 hidden-until-hover" small icon>
          <v-icon>reply</v-icon>
        </v-btn>
        <v-menu offset-y v-if="user.id === comment.commenterId || user.hasRole('Admin')">
          <v-btn slot="activator" class="mr-0 hidden-until-hover" icon small>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list dense>
            <v-list-tile @click="edit">
              <v-list-tile-title>
                <v-icon>edit</v-icon>
                Edit
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="destroy">
              <v-list-tile-title>
                <v-icon>delete</v-icon>
                Delete
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-list-tile>
      <v-card-text v-show="!editing" class="card-avatar-body py-0" v-html="markdown" />
      <v-card-text
        ref="comment"
        v-show="editing"
        @blur="blur"
        @input="input"
        @paste="paste"
        @keydown="keydown"
        contenteditable
        class="comment-edit py-0"
      >
        <pre>{{ editText }}</pre>
      </v-card-text>
      <v-subheader v-if="referencedUsers.length" inset>
        <avatar
          v-for="ref in referencedUsers"
          :key="ref.id"
          :user="ref"
          size="26px"
          class="body-2 mr-1"
          no-actions
          popover
        />
      </v-subheader>
    </v-card>
  </v-slide-y-transition>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

import Avatar from '../components/Avatar';
import Comment from '../components/Comment';

const md = new MarkdownIt({
  html: false,
  linkify: true,
  highlight: (code, lang) => {
    const validLang = !!(lang && hljs.getLanguage(lang));
    const highlighted = validLang ? hljs.highlight(lang, code, true).value : code;

    return `<pre><code class="hljs ${lang}">${highlighted}</code></pre>`;
  },
});

export default {
  name: 'Comment',
  components: { Avatar, Comment },
  computed: {
    markdown() {
      return md.render(this.comment.body);
    },
    ...mapState({
      user: state => state.app.user,
      ticket: state => state.tickets.selected,
    }),
  },
  data: () => ({
    editing: false,
    editText: '',
    changed: false,
    referencedUsers: [],
  }),
  filters: {
    dateTime: date => (moment(date).fromNow()),
  },
  methods: {
    destroy() {
      this.$store.dispatch('comments/deleteComment', this.comment.id).then(() => {
        this.$store.dispatch('tickets/getComments', {
          ticketId: this.$store.state.tickets.selected.id,
          queryString: `limit=${Math.max(this.$store.state.tickets.comments.items.length - 1, 3)}`,
        });
      });
    },
    blur() {
      this.editing = false;
      if (this.changed) {
        this.$store.dispatch(
          'comments/updateComment',
          {
            id: this.comment.id,
            body: this.comment.body,
          },
        );
        this.getReferencedUsers();
      }
    },
    edit() {
      this.editing = true;
      this.changed = false;
      this.$nextTick(() => this.$refs.comment.focus());
    },
    input() {
      this.changed = true;
      this.comment.body = this.$refs.comment.innerText;
    },
    paste(e) {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    },
    keydown(e) {
      if (e.keyCode === 9) { // tab key
        e.preventDefault();
        document.execCommand('insertHTML', false, '\t');
      }
    },
    getReferencedUsers() {
      const refRegex = /\B@\w+([.\-_]\w+)*/gi;
      const references = this.comment.body.match(refRegex);
      if (references) {
        const refUsers = {};
        references.forEach((ref) => {
          this.$store.dispatch('user/getUser', ref.replace('@', '')).then((user) => {
            refUsers[user.id] = user;
            this.referencedUsers = Object.values(refUsers);
          });
        });
      }
    },
  },
  mounted() {
    this.editText = this.comment.body;
    this.getReferencedUsers();
  },
  props: {
    comment: Object,
    reply: Boolean,
  },
};
</script>

<style lang="scss">
  .comment .expansion-panel__header {
    padding: 0;
  }

  .comment .comment-expand {
    max-width: 100%;
  }

  .comment-card {

    .hidden-until-hover {
      display: none;
    }

    &:hover {
      .hidden-until-hover {
        display: inline-block;
      }
    }

    p:last-of-type {
      margin: 0;
    }

    ol, ul {
      margin-left: 1rem;
    }

  }

  .comment-edit {
    margin-left: 70px;
    width: calc(100% - 86px);
    padding: 0;

    pre {
      tab-size: 2;
      font-family: Roboto;
      white-space: pre-wrap;
    }
  }

  pre {
    code {
      padding: 8px;
      width: 100%;
      overflow-x: scroll;
      tab-size: 2;
      padding: inherit;
    }
  }

  code {
    padding: 4px;
    &::before, &::after {
      content: '';
    }
  }
</style>
