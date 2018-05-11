<template>
  <v-app>
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-model="drawer"
    >
      <v-list>
        <template v-for="item in items">
          <v-divider :key="item.id" v-if="item.divider" />
          <v-list-group
            v-else-if="item.children"
            v-model="item.opened"
            :key="item.text"
            :prepend-icon="item.icon"
            no-action
            :to="item.to"
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              :to="child.to"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
              <v-chip v-show="child.label" class="chip--x-small red white--text">
                {{ child.label }}
              </v-chip>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :to="item.to" :key="item.text">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :color="theme.primary"
      dark
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      :clipped-right="$vuetify.breakpoint.lgAndUp"
      fixed
      class="main-toolbar"
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-1">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">{{ pageName }}</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        prepend-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-avatar>
        <v-icon v-if="connected">cloud_done</v-icon>
        <v-progress-circular v-if="!connected" indeterminate color="secondary">
          <v-icon>cloud_off</v-icon>
        </v-progress-circular>
      </v-avatar>
      <v-spacer></v-spacer>
      <avatar :user="user" popover>
        <v-btn slot="actions" color="primary" flat small @click="logout">Sign out</v-btn>
      </avatar>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

import Avatar from '../components/Avatar';

export default {
  name: 'MainLayout',
  data: () => ({
    drawer: true,
    items: [
      { icon: 'home', text: 'Home', to: '/' },
      {
        icon: 'receipt',
        text: 'Tickets',
        to: '/tickets',
        opened: true,
        children: [
          { text: 'Unassigned', to: '/tickets', label: null },
          { text: 'My Tickets', to: '/tickets', label: null },
          { text: 'Open', to: '/tickets', label: null },
          { text: 'Closed', to: '/tickets', label: null },
        ],
      },
      { divider: true, id: 1 },
      { icon: 'notifications', text: 'Notifications', to: '/notifications' },
      { divider: true, id: 2 },
      { icon: 'settings', text: 'Settings', to: '/settings' },
      { icon: 'feedback', text: 'Send feedback', to: '/feedback' },
      { icon: 'help', text: 'Help', to: '/help' },
    ],
  }),
  components: { Avatar },
  computed: mapState({
    theme: state => state.app.theme,
    pageName: state => state.app.pageName,
    user: state => state.app.user,
    connected: state => state.connected,
  }),
  methods: {
    logout() {
      this.$store.dispatch('app/logout');
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss">
  .chip.chip--x-small {
    height: 20px;
    font-size: 0.8rem;
    line-height: 0.8rem;

    .chip__content {
      padding: 6px;
    }
  }
  .main-toolbar {
    z-index: 4;
  }
</style>
