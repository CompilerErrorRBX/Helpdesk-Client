<template>
  <v-card class="profile" flat color="transparent">
    <v-toolbar
      color="primary"
      dark
      flat
      v-if="$vuetify.breakpoint.mdAndUp"
    >
      <v-btn @click="$router.go(-1)" icon>
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-1">
        <span class="hidden-sm-and-down">Profile</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-card class="background" width="100%" height="180px" color="primary" />
    <v-layout fill-height wrap row justify-center>
      <v-flex sm12 md8 lg6>
        <v-slide-x-reverse-transition>
          <div v-if="user">
            <v-card
              class="elevation-5 user-card"
              :class="{ small: $vuetify.breakpoint.smAndDown }"
            >
              <v-parallax
                class="primary"
                style="height: 280px; width: calc(100% + 1px)"
                src="http://demo.geekslabs.com/materialize/v2.3/layout03/images/user-profile-bg.jpg"
              >
                <div>
                  <v-toolbar
                    dark
                    v-if="$vuetify.breakpoint.smAndDown"
                    color="transparent"
                    flat
                  >
                    <v-btn @click="$router.go(-1)" icon>
                      <v-icon>arrow_back</v-icon>
                    </v-btn>
                  </v-toolbar>
                </div>
                <div class="user-title profile-inset">
                  <div class="headline">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="subheading">{{ user.email }}</div>
                </div>
              </v-parallax>
              <div class="secondary" style="height: 5px" />
              <v-avatar size="156px" color="white" class="user-avatar elevation-2">
                <avatar size="148px" :user="user" style="font-size: 3rem !important">
                  <v-btn
                    v-if="currentUser.id === user.id"
                    to="/login/picture"
                    icon
                    class="edit-icon show-on-hover"
                  >
                    <v-icon class="edit-icon show-on-hover" color="white">photo_camera</v-icon>
                  </v-btn>
                </avatar>
              </v-avatar>
              <v-toolbar dense color="transparent" flat>
                <v-spacer />
                <v-btn class="ml-0" icon><v-icon color="grey darken-2">message</v-icon></v-btn>
                <v-btn class="ml-0" icon><v-icon color="grey darken-2">more_vert</v-icon></v-btn>
              </v-toolbar>
              <v-card-text class="profile-bio" v-if="user.profile" v-html="profileMarkdown" />
            </v-card>

            <v-card
              v-if="user.roles.length || currentUser.hasRole('Admin')"
              class="mt-2 elevation-5"
            >
              <v-card-title class="py-0 pr-0">
                <v-flex>
                  <v-subheader class="px-0">
                    Roles
                    <v-spacer />
                    <v-btn icon v-if="currentUser.hasRole('Admin')">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-subheader>
                </v-flex>
              </v-card-title>
              <v-card-text class="pt-0">
                <v-chip small v-for="role in user.roles" :key="role.role">
                  {{ role.role }}
                </v-chip>
              </v-card-text>
            </v-card>

            <v-card v-if="user.requests.length" class="mt-2 elevation-5">
              <v-list two-line class="pt-0">
                <v-subheader>
                  Requests
                </v-subheader>
                <list-ticket
                  v-for="request in user.requests"
                  :key="request.id"
                  :ticket="request"
                />
              </v-list>
            </v-card>

            <v-card v-if="user.jobs.length" class="mt-2 elevation-5">
              <v-list two-line class="pt-0">
                <v-subheader>
                  Jobs
                </v-subheader>
                <list-ticket
                  v-for="job in user.jobs"
                  :key="job.id"
                  :ticket="job"
                />
              </v-list>
            </v-card>
          </div>
        </v-slide-x-reverse-transition>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

import Avatar from '../components/Avatar';
import ListTicket from './profile/ListTicket';

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
  name: 'Profile',
  data: () => ({
  }),
  components: { Avatar, ListTicket },
  computed: {
    profileMarkdown() {
      return this.user.profile.biography ? md.render(this.user.profile.biography) : '';
    },
    ...mapState({
      currentUser: state => state.app.user,
      user: state => state.user.userProfile,
    }),
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.commit('user/setUserProfile', null);
    this.$store.dispatch('user/getUserData', to.params.username);
    next();
  },
};
</script>

<style lang="scss">
  .chip.chip--x-small {
    height: 20px;
    font-size: 0.8rem;
    line-height: 0.8rem;

    .chip__content {
      padding: 6px;
    }
  }
  .parallax__content {
    padding: 0;
    justify-content: space-between;
    .user-title {
      transition: all .2s cubic-bezier(0.95, 0.05, 0.795, 0.035);
      background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.5));
      padding-top: 16px;
      padding-bottom: 4px;
    }
  }
  .profile-inset {
    padding-left: 192px;
  }
  .background {
    position: absolute;
  }
  .user-avatar {
    z-index: 1;
    position: absolute;
    top: 172px;
    left: 16px;

    transition: all .2s cubic-bezier(0.95, 0.05, 0.795, 0.035);

    .edit-icon {
      opacity: 0;
      position: absolute;
      font-size: 4rem;
      background-color: rgba(255,255,255,0.4);
      width: 100%;
      height: 100%;
      margin: 0;
    }

    &:hover {
      .edit-icon {
        opacity: 1;
      }
    }
  }

  .small {
    .user-avatar {
      top: 48px;
    }
    .profile-inset {
      padding-left: 24px;
    }
  }
  .profile-bio {
    ol, ul {
      margin-left: 1rem;
    }

    p {
      img {
        width: 100%;
        height: auto;
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
  }
</style>
