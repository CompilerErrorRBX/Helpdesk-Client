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
              <!-- <v-card
                v-for="ticket in tickets.items"
                :key="ticket.id"
                hover
                ripple
                tile
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
              </v-card> -->
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
        <!-- <v-list v-show="showHistory" three-line width="300px">
          <v-list-tile>
            <v-list-tile-avatar>
              <avatar :user="user" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ user.firstName }} {{ user.lastName }}
              </v-list-tile-title>
              <span class="caption">{{ selected.createdAt | timeSince }}</span>
              <v-list-tile-sub-title>
                Updated status to {{ selected.status }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list> -->
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

export default {
  name: 'Tickets',
  components: { Avatar, TicketModal, ListTicket },
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
