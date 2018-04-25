<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step step="1" :complete="step > 1">Categories</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2" :complete="step > 2">Name of step 2</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3">Name of step 3</v-stepper-step>
    </v-stepper-header>
    <v-stepper-content step="1">
      <v-select
        label="Ticket labels"
        chips
        :items="items"
        append-icon=""
        hint="What type of work needs to be done?"
        persistent-hint
        clearable
        multiple
        item-text="name"
        item-value="name"
        v-model="chips"
        autocomplete
      >
        <template slot="selection" slot-scope="data">
          <v-chip
            close
            @input="remove(data.item)"
            :selected="data.selected"
          >
            <v-avatar>
              <v-icon>{{ data.item.icon }}</v-icon>
            </v-avatar>
            {{ data.item.name }}
          </v-chip>
        </template>
        <template slot="item" slot-scope="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-tile-content v-text="data.item"></v-list-tile-content>
          </template>
          <template v-else>
            <v-list-tile-avatar>
              <v-icon>{{ data.item.icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
            </v-list-tile-content>
          </template>
        </template>
      </v-select>
      <v-btn color="primary" @click.native="step = 2">Continue</v-btn>
      <v-btn flat>Cancel</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
export default {
  name: 'TicketModal',
  data: () => ({
    step: 1,
    chips: [],
    items: [
      { header: 'Phone/Tablet' },
      { name: 'iOS Phone', icon: 'phone_iphone' },
      { name: 'Android Phone', icon: 'phone_android' },
      { name: 'iOS Tablet', icon: 'tablet_mac' },
      { name: 'Android Tablet', icon: 'tablet_android' },
      { divider: true },
      { header: 'Desktop/Laptop' },
      { name: 'Windows PC', icon: 'desktop_windows' },
      { name: 'iMac', icon: 'desktop_mac' },
      { name: 'Windows Laptop', icon: 'laptop_windows' },
      { name: 'Macbook', icon: 'laptop_mac' },
      { name: 'Chromebook', icon: 'laptop_chromebook' },
      { divider: true },
      { header: 'Software' },
      { name: 'Desktop Application', icon: 'code' },
      { name: 'Phone App', icon: 'developer_mode' },
      { name: 'Website', icon: 'language' },
      { name: 'REST API', icon: 'http' },
      { name: 'Database', icon: 'dns' },
      { divider: true },
      { header: 'Other' },
      { name: 'Printer', icon: 'print' },
      { name: 'Scanner', icon: 'scanner' },
      { name: 'TV', icon: 'tv' },
      { name: 'Internet', icon: 'router' },
      { name: 'Email', icon: 'mail' },
    ],
  }),
  methods: {
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
    },
  },
};
</script>

<style>

</style>
