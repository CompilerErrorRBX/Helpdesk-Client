<template>
  <v-scale-transition>
    <div class="title" v-if="user">
      <v-avatar v-if="!popover" :color="!src ? color : 'transparent'" :size="size">
        <img v-if="src" :src="src" />
        <span v-else class="avatar-alt">{{ alt }}</span>
        <slot />
      </v-avatar>
      <v-menu v-else offset-y left :close-on-content-click="false" :nudge-width="200" absolute>
        <v-avatar slot="activator" :color="!src ? color : 'transparent'" :size="size">
          <img v-if="src" :src="src" />
          <span v-else class="avatar-alt">{{ alt }}</span>
          <slot />
        </v-avatar>
        <v-card>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <v-avatar :color="!src ? color : 'transparent'" size="42px">
                  <img v-if="src" :src="src" />
                  <span v-else class="avatar-alt">{{ alt }}</span>
                </v-avatar>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ fullname }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ user.username }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn :to="`/profile/${user.username}`" icon>
                  <v-icon>person</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <div class="px-2">
              <v-chip small v-for="role in user.roles" :key="role.id">
                {{ role.role }}
              </v-chip>
            </div>
          </v-list>
          <v-divider v-if="!noActions" />
          <v-card-actions v-if="!noActions">
            <v-spacer></v-spacer>
            <slot name="actions" />
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </v-scale-transition>
</template>

<script>
export default {
  name: 'Avatar',
  computed: {
    src() {
      if (!this.user) {
        return null;
      }
      return this.user.picture;
    },
    fullname() {
      if (!this.user) {
        return null;
      }
      return `${this.user.firstName} ${this.user.lastName}`;
    },
    alt() {
      if (!this.user) {
        return null;
      }
      return this.fullname.replace(/\B[a-z][ ]*/g, '');
    },
  },
  props: {
    noActions: Boolean,
    user: Object,
    popover: Boolean,
    size: {
      type: String,
      default: '36px',
    },
    color: {
      type: String,
      default: 'light-blue white--text',
    },
  },
};
</script>

<style scoped>
  .avatar-alt {
    font-size: inherit;
  }
</style>
