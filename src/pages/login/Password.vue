<template>
  <div>
    <v-card-title>
      <div>
        <h3 class="headline">Welcome</h3>
        <div class="subtitle">
          <v-icon color="primary">mdi-account_circle</v-icon>
          {{ username }}
        </div>
      </div>
    </v-card-title>
    <v-form v-model="valid" ref="password" @submit.prevent="submit">
      <v-card-text>
        <v-text-field
          autofocus
          label="Enter your password"
          id="password"
          :rules="passwordRules"
          :error-messages="passwordErrors"
          type="password"
          v-model="password"
        />
      </v-card-text>
      <v-flex>
        <v-subheader>
          <router-link class="subheading" to="/forgot">Forgot password?</router-link>
          <v-spacer />
          <v-btn color="primary" type="submit">Next</v-btn>
        </v-subheader>
      </v-flex>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'LoginPassword',
  data() {
    return {
      valid: false,
      password: '',
      passwordErrors: [],
      passwordRules: [
        v => !!v || 'Enter a password',
      ],
      username: localStorage.getItem('username'),
    };
  },
  methods: {
    submit() {
      this.$refs.password.validate();
      if (this.password.length) {
        this.$store.dispatch('app/login', { username: this.username, password: this.password })
          .then(() => {
            this.passwordErrors = [];
            this.$router.push('/');
          })
          .catch(() => {
            this.passwordErrors = ['Wrong password. Try again or click Forgot password to reset it'];
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
