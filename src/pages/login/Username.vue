<template>
  <div>
    <v-card-title>
      <div>
        <h3 class="headline">Sign in</h3>
        <div class="subtitle">With your Helpdesk Account</div>
      </div>
    </v-card-title>
    <v-form v-model="valid" ref="username" @submit.prevent="submit">
      <v-card-text>
        <v-text-field
          autofocus
          label="Username"
          id="username"
          :rules="usernameRules"
          :error-messages="usernameErrors"
          v-model="username"
        />
      </v-card-text>
      <v-subheader>
        <router-link class="subheading" to="/forgot">Forgot username?</router-link>
      </v-subheader>
      <v-flex>
        <v-subheader>
          <router-link class="subheading" to="/login/register">Create account</router-link>
          <v-spacer />
          <v-btn color="primary" type="submit">Next</v-btn>
        </v-subheader>
      </v-flex>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'LoginUsername',
  data() {
    return {
      valid: false,
      username: '',
      usernameErrors: [],
      usernameRules: [
        v => !!v || 'Enter a username',
      ],
    };
  },
  methods: {
    submit() {
      this.$refs.username.validate();
      if (this.username.length) {
        this.$store.dispatch('app/checkUsername', this.username).then(() => {
          this.usernameErrors = [];
          localStorage.setItem('username', this.username);
          this.$router.push('/login/password');
        }).catch(() => {
          this.usernameErrors = ['Couldn\'t find your Helpdesk Account'];
        });
      }
    },
  },
};
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
