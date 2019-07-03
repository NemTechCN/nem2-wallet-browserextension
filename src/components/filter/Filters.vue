// Copyright (C) 2019 Contributors as noted in the AUTHORS file
//
// This file is part of nem2-wallet-browserextension.
//
// nem2-wallet-browserextension is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// nem2-wallet-browserextension is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with nem2-wallet-browserextension.  If not, see http://www.gnu.org/licenses/.

<template>
  <v-layout
    row
    pb-2
    mt-4
  >
    <v-flex
      xs12
    >
      <Errors
        :watch-only-warning="true"
        :application-warnings="false"
        class="mb-4"
      />
      <v-card
        v-if="wallet.wallets.length > 0
          && wallet.activeWallet
          && !wallet.activeWallet.isWatchOnly"
        style="height: auto;padding:0 !important"
        class="card--flex-toolbar"
      >
        <v-toolbar
          card
          prominent
        >
          <v-toolbar-title>{{ $t('Manage-filters') }}</v-toolbar-title>
        </v-toolbar>
        <v-spacer />
        <v-card-text>
          <AddFilter
            v-if="addFilter"
            @closeFilter="addFilter=false"
          />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';
import AddFilter from './AddFilter.vue';
import Errors from '../Errors.vue';

export default {
  name: 'Filters',
  components: {
    AddFilter,
    Errors,
  },
  data() {
    return {
      addFilter: true,
    };
  },
  computed: {
    ...mapState([
      'wallet',
      'accountInfo',
      'application',
      'transactions',
      'assets',
      'namespaces',
    ], {
      wallet: state => state.wallet,
      assets: state => state.assets,
      namespaces: state => state.namespaces,
    }),
  },
  methods: {
    reloadList() {
    },
  },
};
</script>
