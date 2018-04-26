import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Tickets from '@/pages/Tickets';
import TermsOfService from '@/pages/TermsOfService';

import MainLayout from '@/layouts/Main';
import BlankLayout from '@/layouts/Blank';

import LoginUsername from '@/pages/login/Username';
import LoginPassword from '@/pages/login/Password';
import LoginRegister from '@/pages/login/Register';
import LoginPicture from '@/pages/login/PictureUpload';

import TicketsTicket from '@/pages/tickets/Ticket';

import store from '../store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '/',
          name: 'Home',
          component: Home,
          meta: {
            login: true,
            theme: { primary: 'blue' },
          },
        },
        {
          path: '/tickets',
          name: 'Tickets',
          component: Tickets,
          children: [
            {
              path: ':ticketId/:ticketName/',
              name: 'Ticket',
              component: TicketsTicket,
              params: true,
              beforeEnter: (to, origin, next) => {
                store.dispatch('tickets/getTicket', {
                  name: to.params.ticketName,
                  id: to.params.ticketId,
                });
                next();
              },
            },
          ],
          meta: {
            TOS: true, // Require terms of service to be agreed to.
            theme: { primary: 'blue' },
          },
          beforeEnter: (to, origin, next) => {
            store.dispatch('tickets/getTickets').then((tickets) => {
              if (to.name === 'Tickets') {
                router.push(`/tickets/${tickets.items[0].id}/${tickets.items[0].name}`);
              }
            });

            next();
          },
        },
      ],
    },
    {
      path: '/',
      component: BlankLayout,
      children: [
        {
          path: '/profile/:username',
          name: 'Profile',
          component: Profile,
          meta: {
            login: true,
            theme: { primary: 'blue' },
          },
          beforeEnter: (to, origin, next) => {
            store.dispatch('user/getUserData', to.params.username);
            store.dispatch('roles/getRoles');
            next();
          },
        },
        {
          path: '/login',
          name: 'Login',
          component: Login,
          redirect: '/login/username',
          children: [
            {
              name: 'Username',
              path: 'username',
              component: LoginUsername,
            },
            {
              name: 'Password',
              path: 'password',
              component: LoginPassword,
            },
            {
              name: 'Register',
              path: 'register',
              component: LoginRegister,
            },
            {
              name: 'Picture',
              path: 'picture',
              component: LoginPicture,
            },
          ],
        },
        {
          path: '/terms',
          name: 'Terms',
          component: TermsOfService,
        },
      ],
    },
  ],
});

router.beforeEach((to, origin, next) => {
  const parentName = to.meta.parentName ? to.meta.parentName : null;
  const pageName = to.meta.parentName ? to.meta.parentName : to.name;
  document.title = `Heldesk - ${parentName !== null ? parentName : ''} ${to.name}`;
  store.dispatch('app/setPageName', pageName);
  store.dispatch('app/setTheme', to.meta.theme ? to.meta.theme : {});
  if (to.matched.some(record => record.meta.login)) {
    store.dispatch('app/authenticate').then(() => {
      next();
    }).catch(() => {
      router.push('/login');
    });
  }
  if (to.matched.some(record => record.meta.TOS)) {
    store.dispatch('app/authenticate').then((user) => {
      if (!user.agreedTOS) {
        router.push('/terms');
      }
      next();
    }).catch(() => {
      router.push('/login');
    });
  }
  next();
});

export default router;
