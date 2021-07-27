<template>
  <v-list-item
    ripple
    active-class="selected-ticket primary--text"
    :to="`/tickets/${ticket.id}/${ticket.name}`"
  >
    <v-card-text class="px-0">
      <div class="body-2 d-block truncate">
        {{ `Ticket - ${ticket.id}` }}
        <v-icon small>mdi-navigate_next</v-icon>
        <span>{{ ticket.requester.firstName }} {{ ticket.requester.lastName }}</span>
      </div>
      <div class="subheading d-block truncate">
        {{ ticket.title }}
      </div>
      <v-layout align-center row>
        <v-chip
          class="chip--x-small"
          :color="statuses[ticket.status]"
          disabled
        >{{ ticket.status }}</v-chip>
        <div class="caption ml-1">{{ ticket.createdAt | dateTime }}</div>
        <v-spacer />
        <span v-if="ticket.technicians.length">
          <v-icon small>mdi-supervisor_account</v-icon>
          <span class="caption">{{ ticket.technicians.length }}</span>
        </span>
        <span class="ml-1" v-if="ticket.comments.length">
          <v-icon small>mdi-comment</v-icon>
          <span class="caption">{{ ticket.comments.length }}</span>
        </span>
      </v-layout>
    </v-card-text>
  </v-list-item>
</template>

<script>
import moment from 'moment';

export default {
  data: () => ({
    statuses: {
      Pending: 'amber',
      'In Progress': 'blue-grey white--text',
      Resolved: 'green white--text',
      Closed: 'red white--text',
      Archived: 'purple white--text',
    },
  }),
  filters: {
    dateTime: date => (moment(date).fromNow()),
  },
  props: {
    ticket: Object,
  },
};
</script>

<style lang="scss">
  a.list__tile.selected-ticket {
    background-color: rgba(0,0,0,0.05);
  }
</style>
