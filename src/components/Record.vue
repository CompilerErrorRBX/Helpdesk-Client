<template>
  <v-slide-y-transition>
    <v-card flat>
      <v-list-item avatar>
        <v-list-item-avatar>
          <avatar :user="record.user" no-actions popover />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="body-2">
            {{ `${record.user.firstName} ${record.user.lastName}` }}
            <span class="caption">{{ record.createdAt | timeSince }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card-text class="pt-0 pb-2 record-inset" v-html="markdown" />
      <v-divider style="margin-left: 72px; margin-right: 16px;" />
    </v-card>
  </v-slide-y-transition>
</template>

<script>
import moment from 'moment';
import MarkdownIt from 'markdown-it';

import Avatar from './Avatar';

const md = new MarkdownIt();

export default {
  name: 'Record',
  computed: {
    markdown() {
      return md.render(this.record.description);
    },
  },
  components: { Avatar },
  filters: {
    timeSince: date => (moment(date).fromNow()),
  },
  props: {
    record: Object,
  },
};
</script>

<style lang="scss">
  .record-inset {
    padding-left: 72px;
  }
</style>
