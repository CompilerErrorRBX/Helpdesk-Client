<template>
  <div>
    <v-card-title>
      <div>
        <h3 class="headline">Upload your Profile Picture</h3>
      </div>
    </v-card-title>
    <v-form v-model="valid" ref="username" @submit.prevent="submit">
      <v-card-text>
        <file-upload />
      </v-card-text>
      <v-flex>
        <v-subheader>
          <v-spacer />
          <v-btn color="primary" type="submit">Next</v-btn>
        </v-subheader>
      </v-flex>
    </v-form>
  </div>
</template>

<script>
import FileUpload from '../../components/FileUpload';

export default {
  name: 'PictureUpload',
  components: { FileUpload },
  data() {
    return {
      valid: true,
    };
  },
  methods: {
    submit() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
