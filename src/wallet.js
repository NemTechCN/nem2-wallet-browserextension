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
import Handler from './components/uriHandler/Handler.vue';
import Transact from './components/transactions/Transact.vue';
import Namespace from './components/namespace/Namespace.vue';
import Asset from './components/asset/Asset.vue';
import Wallet from './components/wallet/Wallet.vue';
import DeveloperMode from './components/developermode/DeveloperMode.vue';
import About from './components/About.vue';
import store from './store';
import Filters from './components/filter/Filters.vue';
import Multisig from './components/multisig/Multisig.vue';
import AccountLink from './components/accountLink/AccountLink.vue';

import i18n from './plugins/i18n';

import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/dist/vuetify.min.css';

const routes = [
  { path: '/transact', component: Transact, name: 'Transactions' },
  { path: '/namespace', component: Namespace, name: 'Namespaces' },
  { path: '/asset', component: Asset, name: 'Assets' },
  { path: '/wallet', component: Wallet, name: 'Wallets' },
  { path: '/developer-mode', component: DeveloperMode, name: 'Developer mode' },
  { path: '/handler', component: Handler, name: 'URI Transaction Handler' },
  { path: '/multisig', component: Multisig, name: 'Multisig' },
  { path: '/accountLink', component: AccountLink, name: 'AccountLink' },
  { path: '/about', component: About, name: 'About' },
  { path: '/', component: Home, name: 'Home' },
  { path: '/filters', component: Filters, name: 'Filters' },
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
  router,
  i18n,
  components: {
    App,
  },
  render(h) {
    return h('app');
  },
});
