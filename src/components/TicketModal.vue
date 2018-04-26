<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <slot name="activator" slot="activator" />
    <v-stepper v-model="step" vertical>
      <v-stepper-step step="1" :complete="step > 1" :rules="[() => valid]">
        Create a Ticket
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-card>
          <v-form v-model="valid" ref="ticket" @submit.prevent="submit">
            <v-text-field
              label="Title"
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
            <v-btn color="primary" type="submit">Next</v-btn>
            <v-btn flat @click.native="dialog = false">Cancel</v-btn>
          </v-form>
        </v-card>
      </v-stepper-content>
      <v-stepper-step step="2" :complete="step > 2">Review</v-stepper-step>
      <v-stepper-content step="2">
        <v-card flat>
          <v-card-title class="title">
            {{ title }}
          </v-card-title>
          <v-card-text v-html="asMarkdown(description)" />
          <v-card-actions>
            <v-btn flat @click.native="step = 1">Back</v-btn>
            <v-spacer />
            <v-btn flat @click.native="dialog = false">Cancel</v-btn>
            <v-btn color="primary" @click.native="createTicket">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-stepper>
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
