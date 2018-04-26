<template>
  <div>
    <v-layout fill-height>
      <v-flex xs8>
        <router-view />
      </v-flex>
      <v-flex xs4>
        <v-slide-y-transition>
          <div v-if="tickets">
            <v-card
              v-for="ticket in tickets.items"
              :key="ticket.id"
              hover
              ripple
              tile
              class="mb-1"
              :class="{
                'elevation-10': selected && ticket.id === selected.id,
                'selected-ticket': selected && ticket.id === selected.id,
              }"
              :to="`/tickets/${ticket.id}/${ticket.name}`"
            >
              <v-card-text>
                <div class="body-2 grey--text d-block">
                  {{ `Ticket - ${ticket.id}` }}
                  <v-icon small>navigate_next</v-icon>
                  {{ `${ticket.requester.firstName} ${ticket.requester.lastName}` }}
                </div>
                <h2 class="subheading truncate">{{ ticket.title }}</h2>
                <v-layout align-center row>
                  <v-chip
                    class="chip--x-small"
                    :color="statuses[ticket.status]"
                    disabled
                  >{{ ticket.status }}</v-chip>
                  <div class="caption ml-1">{{ ticket.createdAt | timeSince }}</div>
                  <v-spacer />
                  <span v-if="ticket.technicians.length">
                    <v-icon small>supervisor_account</v-icon>
                    <span class="caption">{{ ticket.technicians.length }}</span>
                  </span>
                  <span class="ml-1" v-if="ticket.comments.length">
                    <v-icon small>comment</v-icon>
                    <span class="caption">{{ ticket.comments.length }}</span>
                  </span>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>
        </v-slide-y-transition>
      </v-flex>
    </v-layout>
    <ticket-modal>
      <v-btn
        fab
        fixed
        bottom
        right
        color="amber"
        slot="activator"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </ticket-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

import Avatar from '../components/Avatar';
import TicketModal from '../components/TicketModal';

export default {
  name: 'Tickets',
  components: { Avatar, TicketModal },
  computed: {
    ...mapState({
      user: state => state.app.user,
      tickets: state => state.tickets.tickets,
      selected: state => state.tickets.selected,
      comments: state => state.tickets.comments,
      technicians: state => state.tickets.technicians,
    }),
  },
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
    dateTime: date => (moment(date).format('DD MMM YYYY, h:mm a')),
    timeSince: date => (moment(date).fromNow()),
  },
  methods: {
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('tickets/getTickets').then((tickets) => {
      if (to.name === 'Tickets') {
        this.$router.push(`/tickets/${tickets.items[0].id}/${tickets.items[0].name}`);
      }
    });
    next();
  },
};
</script>

<style lang="scss">
  .card.card--tile.selected-ticket {
    background-color: rgba(0,0,0,0.05);
  }

  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chip-xs {
    font-size: 10px;
    height: 16px;
  }

  .card-avatar-body {
    padding-left: 72px;
  }

  .ticket-body {
    ol, ul, dl {
      padding-left: 1rem;
    }
  }

  blockquote {
    border-left: 4px rgba(0,0,0,0.1) solid;
    border-radius: 0 2px 2px 0;
    padding: 8px 0 0 12px;
    margin-bottom: 16px;
    font-size: 1rem;
    font-style: italic;

    p:last-of-type {
      margin: 0;
      padding-bottom: 8px;
    }
  }

  .comment-field .input-group .input-group--solo {
    .input-group__input, label {
      padding-left: 0;
    }
  }

  p {
    img {
      max-width: 100%;
      margin-left: auto;
      height: auto;
    }
  }
</style>
