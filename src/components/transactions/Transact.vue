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
    <v-container
      fluid
      pa-0
      ma-0
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
        >
          <Errors class="mb-4" />

          <v-tabs
            v-model="tab"
            grow
            icons-and-text
          >
            <v-tabs-slider color="yellow" />


            <v-tab key="0">
              {{ $t('Transfer') }}
              <v-icon>send</v-icon>
            </v-tab>
            <v-tab-item key="0">
              <Transfer v-if="wallet.activeWallet" />
            </v-tab-item>


            <v-tab key="1">
              URI
              <v-icon>http</v-icon>
            </v-tab>
            <v-tab-item key="1">
              <URI />
            </v-tab-item>


            <v-tab key="2">
              {{ $t('Filters') }}
              <v-icon>filter_list</v-icon>
            </v-tab>
            <v-tab-item key="2">
              <Filters />
            </v-tab-item>


            <v-tab key="3">
              {{ $t('Account-Link') }}
              <v-icon>record_voice_over</v-icon>
            </v-tab>
            <v-tab-item key="3">
              <AccountLink />
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';
import Errors from '../Errors.vue';
import Transfer from './tabs/Transfer.vue';
import URI from './tabs/URI.vue';
import Filters from './tabs/Filters.vue';
import AccountLink from './tabs/AccountLink.vue';

export default {
  components: {
    Errors,
    Transfer,
    URI,
    Filters,
    AccountLink,
  },
  data() {
    return {
      tab: 0,
      tabsWithTransactionFilter: [0, 1, 2, 3],
      tabsTransactionFilters: {
        0: 'Transfer',
        1: '',
        2: 'Account filter',
        3: 'Link account',
      },
    };
  },
  computed: mapState(['wallet']),
  watch: {
    tab(tabNumber) {
      this.updateTransactionFilters(tabNumber);
    },
  },
  mounted() {
    this.updateTransactionFilters(this.tab);
  },
  methods: {
    updateTransactionFilters(tabNumber) {
      if (this.tabsWithTransactionFilter.indexOf(tabNumber) === -1) return;

      if (this.tabsTransactionFilters[tabNumber] === '') {
        this.$store.dispatch('transactions/RESET_TRANSACTION_FILTERS');
      } else {
        this.$store.dispatch(
          'transactions/UPDATE_TRANSACTION_TYPES_PRESET_FILTER',
          [this.tabsTransactionFilters[tabNumber]],
        );
      }
    },
  },
};

</script>
