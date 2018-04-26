<template>
  <v-slide-x-reverse-transition>
    <v-card v-if="ticket" raised tile>
      <v-toolbar card>
        <avatar :user="ticket.requester" no-actions popover />
        <div class="pl-3">
          <v-list-tile-title class="subheading">
            {{ `${ticket.requester.firstName}` }}
            {{ `${ticket.requester.lastName}` }}
          </v-list-tile-title>
          <v-list-tile-sub-title class="caption">
            {{ ticket.createdAt | dateTime }}
          </v-list-tile-sub-title>
        </div>
        <v-spacer />
        <v-menu
          offset-y
          v-if="(user.isTechnician() && user.hasJob(ticket.id)) || user.id === ticket.requester.id"
        >
          <v-btn slot="activator" class="mr-0" icon>
            <v-icon>access_time</v-icon>
          </v-btn>
          <v-list dense>
            <v-list-tile
              v-for="status in statuses" :key="status.title" @click="updateStatus(status.title)">
              <v-list-tile-title>{{ status.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu offset-y v-if="user.id === ticket.requester.id || user.hasRole('Admin')">
          <v-btn slot="activator" class="mr-0" icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list dense>
            <v-list-tile @click="edit">
              <v-list-tile-title>
                <v-icon>edit</v-icon>
                Edit
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-toolbar class="info-section" dense card>
        <v-avatar size="36px">
          <v-icon>info</v-icon>
        </v-avatar>
        <span class="caption ml-1">
          Ticket - {{ ticket.id }}
        </span>
        <v-spacer />
        <v-chip :color="statuses[ticket.status].color">
          <v-avatar>
            <v-icon>{{ statuses[ticket.status].icon }}</v-icon>
          </v-avatar>
          {{ statuses[ticket.status].title }}
        </v-chip>
        <v-chip outline>
          <v-avatar>
            <v-icon>attach_money</v-icon>
          </v-avatar>
          {{ ticket.bounty }}
        </v-chip>
      </v-toolbar>
      <v-card-text class="card-avatar-body">
        <div class="title mb-3">{{ ticket.title }}</div>
        <div v-show="!editing" class="ticket-body" v-html="markdown" />
        <div
          ref="comment"
          v-show="editing"
          @blur="blur"
          @input="input"
          @paste="paste"
          @keydown="keydown"
          contenteditable
          class="description-edit py-0"
        >
          <pre>{{ editText }}</pre>
        </div>
      </v-card-text>
      <v-divider />
      <v-toolbar class="info-section" dense card>
        <v-avatar size="36px">
          <v-icon>supervisor_account</v-icon>
          {{ technicians.length }}
        </v-avatar>
        <v-spacer />
        <v-progress-circular v-if="!technicians" indeterminate color="amber" />
        <avatar
          v-for="tech in technicians"
          :key="tech.id"
          :user="tech"
          size="32px"
          no-actions
          popover
          class="ml-1"
        />
        <v-btn
          flat
          icon
          v-if="user.isTechnician() && !user.hasJob(ticket.id)"
          @click="addTechnician"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-expansion-panel v-if="comments.totalResults > 0" class="elevation-0" :value="true">
        <v-expansion-panel-content lazy :value="true">
          <div slot="header">
            <v-icon>comment</v-icon>
            {{ comments.totalResults }}
          </div>
          <v-divider />
          <div
            :class="{ scrolling: loadMoreComments }"
            v-scroll:#container="onScroll"
            ref="container"
            id="container"
          >
            <comment v-for="comment in comments.items" :key="comment.id" :comment="comment" />
            <v-layout v-if="commentsLoading" align-center justify-center class="my-2">
              <v-progress-circular indeterminate color="amber" />
            </v-layout>
            <v-btn
              v-if="!loadMoreComments && comments.moreResults"
              @click="loadComments"
              block
              flat
              color="primary"
            >
              View More Comments
            </v-btn>
          </div>
          <v-divider />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <comment-box placeholder="Add a comment..." />
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

import Avatar from '../../components/Avatar';
import Comment from '../../components/Comment';
import CommentBox from '../../components/CommentBox';

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
  name: 'Ticket',
  components: { Avatar, Comment, CommentBox },
  computed: {
    markdown() {
      return md.render(this.ticket.description);
    },
    ...mapState({
      user: state => state.app.user,
      ticket: state => state.tickets.selected,
      comments: state => state.tickets.comments,
      technicians: state => state.tickets.technicians,
    }),
  },
  data: () => ({
    loadMoreComments: false,
    commentsLoading: false,
    commentScroll: 0,
    statuses: {
      Pending: { title: 'Pending', color: 'amber', icon: 'access_time' },
      'In Progress': { title: 'In Progress', color: 'blue-grey white--text', icon: 'group' },
      Resolved: { title: 'Resolved', color: 'green white--text', icon: 'check' },
      Closed: { title: 'Closed', color: 'red white--text', icon: 'do_not_disturb' },
    },
    editing: false,
    editText: '',
    changed: false,
  }),
  filters: {
    dateTime: date => (moment(date).format('DD MMM YYYY, h:mm a')),
  },
  methods: {
    onScroll(e) {
      this.commentScroll = e.target.scrollTop;
      if (this.$store.state.tickets.comments.moreResults) {
        const scrollBottom = e.target.scrollTop + e.target.clientHeight;
        if (scrollBottom / e.target.scrollHeight > 0.9 && !this.commentsLoading) {
          this.loadComments();
        }
      }
    },
    loadComments() {
      this.loadMoreComments = true;
      if (this.$store.state.tickets.comments.moreResults) {
        this.commentsLoading = true;
        this.$store.dispatch('tickets/getComments', {
          ticketId: this.$store.state.tickets.selected.id,
          queryString: `limit=5&offset=${this.comments.items.length}`,
          append: true,
        }).finally(() => {
          this.commentsLoading = false;
        });
      }
    },
    addTechnician() {
      this.$store.dispatch('tickets/addTicketTechnician', this.ticket.id);
    },
    updateStatus(status) {
      this.$store.dispatch('tickets/updateTicketStatus', { id: this.ticket.id, status });
    },
    blur() {
      this.editing = false;
      if (this.changed) {
        this.$store.dispatch(
          'tickets/updateTicketDescription',
          {
            id: this.ticket.id,
            description: this.ticket.description,
          },
        );
      }
    },
    edit() {
      this.editing = true;
      this.changed = false;
      this.$nextTick(() => this.$refs.comment.focus());
    },
    input() {
      this.changed = true;
      this.ticket.description = this.$refs.comment.innerText;
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
  },
  watch: {
    ticket() {
      if (this.ticket) {
        this.editText = this.ticket.description;
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('tickets/clearTicket');
    this.loadMoreComments = false;
    this.$store.dispatch('tickets/getTicket', {
      name: to.params.ticketName,
      id: to.params.ticketId,
    });
    next();
  },
};
</script>

<style lang="scss">
  .description-edit {
    pre {
      tab-size: 2;
      font-family: Roboto;
      white-space: pre-wrap;
    }
  }

  p:last-of-type {
    margin: 0;
  }

  .scrolling {
    max-height: 1000px;
    overflow-y: scroll;
  }

  .expansion-panel__header {
    padding-left: 18px;
    padding-right: 14px;
  }

  .toolbar.info-section {
    background-color: inherit;
  }
</style>
