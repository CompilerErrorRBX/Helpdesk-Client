<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <slot name="activator" slot="activator" />
    <v-card>
      <v-card-title class="title">Log a Ticket</v-card-title>
      <v-stepper v-model="step" vertical>
        <v-stepper-step step="1" :complete="step > 1" :rules="[() => valid]">
          Subject and Description
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-card>
            <v-form v-model="valid" ref="ticket" @submit.prevent="submit">
              <v-text-field
                label="Subject"
                id="title"
                @keydown="keydown"
                name="description"
                :rules="titleRules"
                v-model="title"
              />
              <v-text-field
                name="description"
                id="description"
                label="Description"
                :rules="descriptionRules"
                @keydown.native="keydown"
                multi-line
                rows="1"
                auto-grow
                hint="Descriptions support Markdown formatting."
                v-model="description"
              ></v-text-field>
              <v-card-actions>
                <v-spacer />
                <v-btn flat @click.native="dialog = false">Cancel</v-btn>
                <v-btn color="primary" type="submit">Next</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-stepper-content>
        <v-stepper-step step="2" :complete="step > 2">
          Details
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-card>
            <v-form ref="ticket">
              <v-flex xs3>
                <v-text-field
                  label="Bounty"
                  id="bounty"
                  name="description"
                  prepend-icon="attach_money"
                  :rules="bountyRules"
                  v-model="bounty"
                />
              </v-flex>
              <v-flex>
                <v-select
                  label="Tags"
                  chips
                  tags
                  :items="items"
                  prepend-icon="label"
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
                      {{ data.item.name || data.item }}
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
              </v-flex>
            </v-form>
            <v-card-actions>
              <v-btn flat @click.native="step = 1">Back</v-btn>
              <v-spacer />
              <v-btn flat @click.native="dialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="step = 3">Next</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
        <v-stepper-step step="3" :complete="step > 3">Review</v-stepper-step>
        <v-stepper-content step="3">
          <v-card flat>
            <v-card-title class="title">
              {{ title }}
            </v-card-title>
            <v-card-text v-html="asMarkdown(description)" />
            <v-card-text>
              <v-chip label v-for="chip in chips" :key="chip">{{ chip }}</v-chip>
            </v-card-text>
            <v-card-actions>
              <v-btn flat @click.native="step = 2">Back</v-btn>
              <v-spacer />
              <v-btn flat @click.native="dialog = false">Cancel</v-btn>
              <v-btn color="primary" @click.native="createTicket">Continue</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const md = new MarkdownIt({
  html: false,
  linkify: true,
  highlight: (code, lang) => {
    const validLang = !!(lang && hljs.getLanguage(lang));
    const highlighted = validLang ? hljs.highlight(lang, code, true).value : code;

    return `<pre><code class="hljs ${lang}">${highlighted}</code></pre>`;
  },
});

export default {
  name: 'TicketModal',
  data: () => ({
    step: 1,
    dialog: false,
    valid: true,
    title: '',
    titleRules: [
      v => !!v || 'Enter a Title',
    ],
    description: '',
    descriptionRules: [
      v => !!v || 'Enter a Description',
    ],
    bounty: 'Pro bono',
    bountyRules: [
      v => !!v || 'Enter a Bounty',
    ],
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
      { name: 'Linux PC', icon: 'desktop_windows' },
      { name: 'iMac', icon: 'desktop_mac' },
      { name: 'Windows Laptop', icon: 'laptop_windows' },
      { name: 'Macbook', icon: 'laptop_mac' },
      { name: 'Chromebook', icon: 'laptop_chromebook' },
      { divider: true },
      { header: 'Software' },
      { name: 'Desktop App', icon: 'code' },
      { name: 'Phone App', icon: 'developer_mode' },
      { name: 'Website', icon: 'language' },
      { name: 'Service', icon: 'http' },
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
    submit() {
      this.$refs.ticket.validate();
      if (this.valid) {
        this.step = 2;
      }
    },
    createTicket() {
      this.$store.dispatch('tickets/createTicket', {
        title: this.title,
        description: this.description,
        bounty: this.bounty,
        labels: this.chips,
      }).then((ticket) => {
        this.step = 1;
        this.title = '';
        this.description = '';
        this.dialog = false;
        this.$router.push(`/tickets/${ticket.id}/${ticket.name}`);
      });
    },
    asMarkdown: text => md.render(text),
    keydown(e) {
      if (e.keyCode === 9) { // tab key
        e.preventDefault();
        document.execCommand('insertHTML', false, '&#09');
      }
    },
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
    },
  },
};
</script>

<style lang="scss">
  .ticket-body {
    ol, ul, dl {
      padding-left: 16px;
    }
  }

  blockquote {
    border-left: 4px rgba(0,0,0,0.1) solid;
    border-radius: 0 2px 2px 0;
    padding: 8px 0 0 12px;
    margin-bottom: 16px;
    font-size: 1rem;
    font-style: italic;

    p:last-of-type {
      margin: 0;
      padding-bottom: 8px;
    }
  }

  pre {
    code {
      padding: 8px;
      width: 100%;
      overflow-x: scroll;
      tab-size: 2;
      padding: inherit;
    }
  }

  code {
    padding: 4px;
    &::before, &::after {
      content: '';
    }
  }

  .comment-field .input-group .input-group--solo {
    .input-group__input, label {
      padding-left: 0;
    }
  }
</style>
