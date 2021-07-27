<template>
  <v-container>
    <v-layout align-center>
      <v-form>
        <h2 class="title">Send Feedback</h2>
        <v-snackbar />
        <v-text-field label="Subject" id="subject" />
      </v-form>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Feedback',
};
</script>

<style>
</style>
