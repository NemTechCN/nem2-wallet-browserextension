/**
 * Copyright (C) 2019 Contributors as noted in the AUTHORS file
 *
 * This file is part of nem2-wallet-browserextension.
 *
 * nem2-wallet-browserextension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * nem2-wallet-browserextension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with nem2-wallet-browserextension.  If not, see <http://www.gnu.org/licenses/>.
 */

import Vue from 'vue';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import Home from './components/Home.vue';
import Handler from './components/Handler.vue';
import Send from './components/send/Send.vue';
import Namespace from './components/namespace/Namespace.vue';
import Asset from './components/asset/Asset.vue';
import Wallet from './components/wallet/Wallet.vue';
import DeveloperMode from './components/developermode/DeveloperMode.vue';
import About from './components/About.vue';
import store from './store';
import Filter from './components/filter/Filter.vue';

import 'vuetify/dist/vuetify.min.css';

const routes = [
  { path: '/send', component: Send, name: 'Send a transaction' },
  { path: '/namespace', component: Namespace, name: 'Namespaces' },
  { path: '/asset', component: Asset, name: 'Assets' },
  { path: '/wallet', component: Wallet, name: 'Wallets' },
  { path: '/developer-mode', component: DeveloperMode, name: 'Developer mode' },
  { path: '/handler', component: Handler, name: 'Handler' },
  { path: '/about', component: About, name: 'About' },
  { path: '/', component: Home, name: 'Home' },
  { path: '/filter', component: Filter, name: 'Filters' },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  store.dispatch('application/NAVIGATE', { to });
  next();
});

Vue.use(Vuetify, {
  iconfont: 'md',
});
Vue.use(VueRouter);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  components: {
    App,
  },
  render(h) {
    return h('app');
  },
  router,
});
