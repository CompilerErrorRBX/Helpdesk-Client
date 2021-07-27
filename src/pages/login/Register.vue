<template>
  <div>
    <v-card-title>
      <div>
        <h3 class="title">Create your Helpdesk Account</h3>
      </div>
    </v-card-title>
    <v-form v-model="valid" ref="register" @submit.prevent="submit">
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs6>
              <v-text-field
                autofocus
                label="First name"
                :rules="firstnameRules"
                v-model="firstname"
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Last name"
                :rules="lastnameRules"
                v-model="lastname"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Email"
                type="email"
                :rules="emailRules"
                :error-messages="emailErrors"
                v-model="email"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Username"
                :rules="usernameRules"
                :error-messages="usernameErrors"
                v-model="username"
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Password"
                :type="showPasswords ? 'text' : 'password'"
                :rules="passwordRules"
                :error-messages="passwordErrors"
                v-model="password"
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                label="Confirm password"
                :type="showPasswords ? 'text' : 'password'"
                :append-icon="showIcon"
                :append-icon-cb="showPasswordToggle"
                v-model="confirmPassword"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-subheader>
        <router-link class="subheading" to="/login/username">Sign in instead</router-link>
        <v-spacer />
        <v-btn color="primary" type="submit">Next</v-btn>
      </v-subheader>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      showPasswords: false,
      showIcon: 'mdi-visibility_off',
      valid: false,
      firstname: '',
      firstnameRules: [
        v => !!v || 'Enter first name',
      ],
      lastname: '',
      lastnameRules: [
        v => !!v || 'Enter last name',
      ],
      email: '',
      emailErrors: [],
      emailRules: [
        v => !!v || 'Enter an email address',
        v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Email must be valid',
      ],
      username: '',
      usernameErrors: [],
      usernameRules: [
        v => !!v || 'Enter a username',
      ],
      password: '',
      passwordErrors: [],
      passwordRules: [
        v => !!v || 'Enter a password',
      ],
      confirmPassword: '',
    };
  },
  methods: {
    submit() {
      this.$refs.register.validate();
      if (!this.valid) {
        return;
      }
      if (this.username.length < 3) {
        this.usernameErrors = ['Username must be 3 characters or more'];
        return;
      }
      this.usernameErrors = [];
      if (this.password.length < 8) {
        this.passwordErrors = ['Password must be 8 characters or more'];
        return;
      }
      this.passwordErrors = [];
      if (this.password !== this.confirmPassword) {
        this.passwordErrors = ['Passwords do not match'];
        return;
      }
      if (this.username.length) {
        this.$store.dispatch('registration/usernameAvailable', this.username).then(() => {
          this.clearErrors();
          this.$store.dispatch('registration/register', {
            username: this.username,
            firstName: this.firstname,
            lastName: this.lastname,
            password: this.password,
            email: this.email,
          }).then(() => {
            this.$router.push('/login/picture');
          });
        }).catch(() => {
          this.usernameErrors = ['Username already in use'];
        });
      }
    },
    showPasswordToggle() {
      this.showPasswords = !this.showPasswords;
      this.showIcon = this.showPasswords ? 'mdi-visibility' : 'mdi-visibility_off';
    },
    clearErrors() {
      this.passwordErrors = [];
      this.usernameErrors = [];
    },
  },
};
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
