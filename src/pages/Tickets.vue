<template>
  <div class="tickets-container">
    <v-layout fill-height v-if="tickets && tickets.items.length">
      <v-flex xs12 sm4>
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
      <v-flex xs1 sm8>
        <router-view />
      </v-flex>
    </v-layout>
    <v-layout
      fill-height
      column
      align-center
      justify-center
      v-else-if="tickets && !tickets.items.length"
    >
      <v-icon x-large>receipt</v-icon>
      <v-subheader class="headline">No active tickets</v-subheader>
      <ticket-modal>
      <v-btn
        color="primary"
        slot="activator"
      >
        Log a Ticket
      </v-btn>
    </ticket-modal>
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
          <v-list class="pt-2">
            <v-list-tile @click="showHistory = !showHistory">
              <v-list-tile-action>
                <v-icon style="transform: rotate(90deg);">menu</v-icon>
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
        <v-layout column v-show="showHistory">
          <div
            class="records"
            v-if="records && records.items.length"
            v-scroll:#activity-container="onScroll"
            id="activity-container"
            ref="activity-container"
          >
            <v-subheader class="pt-1">
              <v-icon class="pl-2 pr-4">playlist_add_check</v-icon>
              Activity ({{ records.totalResults }})
            </v-subheader>
            <v-list>
              <ticket-record v-for="record in records.items" :key="record.id" :record="record" />
            </v-list>
            <v-btn
              v-if="!showAllRecords && records.moreResults"
              color="primary"
              flat
              block
              @click="loadRecords"
            >
              View All Activity
            </v-btn>
            <v-layout v-if="!records.moreResults && showAllRecords" justify-center>
              <v-subheader>No more Activity</v-subheader>
            </v-layout>
          </div>
          <v-layout align-center justify-center v-else-if="!records">
            <v-progress-circular indeterminate color="secondary" />
          </v-layout>
          <v-layout
            column
            class="pt-3"
            align-center
            justify-center
            v-else-if="records && !records.items.length"
          >
            <v-icon x-large>history</v-icon>
            <v-subheader class="headline">No activity yet</v-subheader>
          </v-layout>
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
    showAllRecords: false,
    recordsLoading: false,
  }),
  filters: {
    dateTime: date => (moment(date).format('DD MMM YYYY, h:mm a')),
    timeSince: date => (moment(date).fromNow()),
  },
  methods: {
    onScroll(e) {
      if (this.records.moreResults && this.showAllRecords) {
        const scrollBottom = e.target.scrollTop + e.target.clientHeight;
        if (scrollBottom / e.target.scrollHeight > 0.9 && !this.recordsLoading) {
          this.loadRecords();
        }
      }
    },
    loadRecords() {
      this.showAllRecords = true;
      if (this.records.moreResults) {
        this.recordsLoading = true;
        this.$store.dispatch('tickets/getRecords', {
          ticketId: this.selected.id,
          queryString: `limit=10&offset=${this.records.items.length}`,
          append: true,
        }).finally(() => {
          this.recordsLoading = false;
        });
      }
    },
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
  .tickets-container {
    height: calc(100% - 62px);
  }

  .records {
    max-height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-bottom: 72px;
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
