<template>
  <v-dialog
    :value="true"
    fullscreen
    transition="dialog-transition"
    :overlay="false"
    scrollable
    hide-overlay
  >
    <v-layout align-center>
      <v-card class="elevation-4" width="400" height="500" style="margin: auto; overflow: hidden">
        <v-card-text>
          <transition name="fade">
            <router-view />
          </transition>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-dialog>
</template>

<script>
export default {
  name: 'Login',
};
</script>

<style scoped>
  a {
    text-decoration: none;
  }
  .fade-enter-active, .fade-leave-active {
    transition: transform .15s cubic-bezier(1.0, 0.5, 0.8, 1.0), opacity .15s;
  }

  .fade-enter-active {
    transition-delay: .25s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
    transform: translateX(-15%);
  }
</style>
