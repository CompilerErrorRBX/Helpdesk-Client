<template>
  <div class="underlay">
    <v-dialog
      :value="true"
      persistent
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="600"
      hide-overlay
    >
      <v-card class="elevation-4">
        <v-card-title>
          <span class="headline">Terms of Service</span>
        </v-card-title>
        <v-card-text>
          I will not sue for any reason.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat="flat" @click="disagree">Disagree</v-btn>
          <v-btn color="primary" @click="agree">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Terms',
  methods: {
    agree() {
      this.$store.dispatch('user/acceptTerms').then(() => {
        this.$router.push('/tickets');
      });
    },
    disagree() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
  .underlay {
    position: fixed;
    background-color: #eee;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
