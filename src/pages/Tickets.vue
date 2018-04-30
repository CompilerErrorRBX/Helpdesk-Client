<template>
  <div>
    <v-layout fill-height>
      <v-flex xs12 sm3>
        <v-card>
          <v-toolbar card>
            <v-toolbar-title class="title">
              Tickets
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon>
              <v-icon>filter_list</v-icon>
            </v-btn>
          </v-toolbar>
          <v-slide-y-transition>
            <v-list two-line v-if="tickets">
              <list-ticket
                v-for="ticket in tickets.items"
                :key="ticket.id"
                :ticket="ticket"
              />
            </v-list>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
      <v-flex xs1 sm9>
        <router-view />
      </v-flex>
    </v-layout>
    <v-navigation-drawer
      :clipped="true"
      class="pb-0 elevation-1 nav-drawer-history"
      fixed
      app
      right
      stateless
      :width="showHistory ? 348 : 48"
      :value="selected"
    >
      <v-layout fill-height row>
        <v-navigation-drawer
          mini-variant
          mini-variant-width="48"
          stateless
          value="true"
          class="history-drawer"
        >
          <v-list class="pt-0">
            <v-list-tile @click="showHistory = !showHistory">
              <v-list-tile-action>
                <v-icon small style="transform: rotate(90deg);">menu</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile @click="1">
              <v-list-tile-action>
                <v-icon>history</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
        <!-- History items -->
        <div class="records" v-if="records">
          <v-list v-show="showHistory">
            <ticket-record v-for="record in records.items" :key="record.id" :record="record" />
          </v-list>
        </div>
        <v-layout align-center justify-center v-else>
          <v-progress-circular indeterminate color="secondary" />
        </v-layout>
      </v-layout>
    </v-navigation-drawer>
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
import ListTicket from './profile/ListTicket';
import TicketRecord from '../components/Record';

export default {
  name: 'Tickets',
  components: { Avatar, TicketModal, ListTicket, TicketRecord },
  computed: {
    ...mapState({
      user: state => state.app.user,
      tickets: state => state.tickets.tickets,
      selected: state => state.tickets.selected,
      comments: state => state.tickets.comments,
      technicians: state => state.tickets.technicians,
      records: state => state.tickets.records,
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
    showHistory: true,
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
  .records {
    max-height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .history-drawer {
    border-left: 1px;
    .list {
      a {
        padding: 0;
      }
    }
  }

  .card.card--tile.selected-ticket {
    background-color: rgb(240,240,240);
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
