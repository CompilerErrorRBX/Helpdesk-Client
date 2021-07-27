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
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              :to="child.to"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
              <v-chip v-show="child.label" class="chip--x-small red white--text">
                {{ child.label }}
              </v-chip>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :to="item.to" :key="item.text">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :color="theme.primary"
      dark
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      :clipped-right="$vuetify.breakpoint.lgAndUp"
      fixed
      class="main-toolbar"
    >
      <v-app-bar-title style="width: 300px" class="ml-0 pl-1">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">{{ pageName }}</span>
      </v-app-bar-title>
      <v-text-field
        flat
        solo-inverted
        prepend-icon="mdi-magnify"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-avatar>
        <v-icon v-if="connected">mdi-cloud-check</v-icon>
        <v-progress-circular v-if="!connected" indeterminate color="secondary">
          <v-icon>mdi-cloud-off-outline</v-icon>
        </v-progress-circular>
      </v-avatar>
      <v-spacer></v-spacer>
      <avatar :user="user" popover>
        <v-btn slot="actions" color="primary" flat small @click="logout">Sign out</v-btn>
      </avatar>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
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
      { icon: 'mdi-home', text: 'Home', to: '/' },
      {
        icon: 'mdi-receipt',
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
      { icon: 'mdi-inbox', text: 'Notifications', to: '/notifications' },
      { divider: true, id: 2 },
      { icon: 'mdi-cog', text: 'Settings', to: '/settings' },
      // { icon: 'mdi-feedback', text: 'Send feedback', to: '/feedback' },
      { icon: 'mdi-help-circle', text: 'Help', to: '/help' },
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
