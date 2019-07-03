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
    wrap
  >
    <v-flex xs12>
      <v-card>
        <v-toolbar
          card
          prominent
        >
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            @click.stop="refresh(wallet.activeWallet)"
          >
            <v-icon>refresh</v-icon>
          </v-btn>

          <v-btn
            icon
            @click.stop="loadMore(wallet.activeWallet)"
          >
            <v-icon>playlist_add</v-icon>
          </v-btn>
          <v-btn
            icon
            @click.stop="showFilters=true"
          >
            <v-icon>filter_list</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container
            fluid
          >
            <v-layout
              row
              wrap
            >
              <v-flex xs12>
                <v-alert
                  v-if="transactions.transactions[wallet.activeWallet.name]
                    && transactions.transactions[wallet.activeWallet.name][0] === 'Error'"

                  :value="true"
                  type="error"
                >
                  {{ $t('An-error-occured-when-getting-the-transaction-list') }}
                </v-alert>
              </v-flex>
              <v-flex xs12>
                <v-progress-linear
                  v-if="transactions.loading_getAccountTransactionsById"
                  :indeterminate="true"
                />
              </v-flex>
            </v-layout>
            <v-layout
              v-if="transactions.transactions[wallet.activeWallet.name]
                && transactions.transactions[wallet.activeWallet.name][0] !== 'Error'
                && transactions.transactions[wallet.activeWallet.name].length > 0"
              child-flex
              row
              wrap
            >
              <v-flex xs12>
                <v-data-table
                  :headers="headers"
                  :items="transactions.transactions[wallet.activeWallet.name]"
                  disable-initial-sort
                  :rows-per-page-items="rowsPerPageOptions"
                >
                  <template
                    slot="headerCell"
                    slot-scope="props"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <span v-on="on">
                          {{ props.header.text }}
                        </span>
                      </template>
                      <span>
                        {{ props.header.hoverText }}
                      </span>
                    </v-tooltip>
                  </template>
                  <template v-slot:items="props">
                    <tr
                      v-show="
                        transactions.transactionTypesFilters[
                          props.item.type1.replace(/ /g, '_').replace(/\./g, '8')
                        ]"
                      class="pointer"
                      @click.stop="
                        showTransactionModal=true
                        $store.dispatch(
                          'transactions/UPDATE_ACTIVE_TRANSACTION',
                          props.item,
                        );
                      "
                    >
                      <td class="text-xs-left">
                        <span
                          v-if="props.item.unconfirmed"
                          class="clearfix"
                        >
                          <pre>{{ $t('unconfirmed') }}</pre>
                        </span>
                        <span
                          v-if="!props.item.unconfirmed"
                          class="clearfix"
                        >
                          <pre>{{ props.item.blockNumber.toLocaleString() }}</pre>
                        </span>
                        <span
                          v-if="!props.item.unconfirmed"
                          class="clearfix"
                        >
                          <pre>{{ props.item.date }}</pre>
                        </span>
                        <span class="clearfix">
                          <pre>{{ props.item.type1 }}</pre>
                        </span>
                        <span
                          v-if="props.item.type2 !== ''"
                          class="clearfix"
                        >
                          <pre>{{ props.item.type2 }}</pre>
                        </span>
                      </td>
                      <td class="text-xs-left">
                        <div
                          v-for="(mainProp, index) in props.item.mainProps"
                          :key="index"
                        >
                          <span
                            class="clearfix"
                            style="text-align:left"
                          >
                            <pre>{{ mainProp.key }}&nbsp;{{ mainProp.value }}</pre>
                          </span>
                        </div>
                      </td>
                      <td class="text-xs-left">
                        <span class="clearfix">
                          <pre>{{ props.item.signerTiny }}</pre>
                        </span>
                        <span class="clearfix">
                          <pre>{{ props.item.recipientTiny }}</pre>
                        </span>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>

      <TransactionModal
        v-if="tx"
        :visible="showTransactionModal"
        @close="showTransactionModal=false"
      />

      <WoWalletCreationDialog
        :visible="showWoWalletCreationDialog"
        @close="showWoWalletCreationDialog=false"
      />

      <div v-if="transactions.activeTransaction">
        <TransactionListFilters
          :visible="showFilters"
          preset-filter="presetFilter"
          @close="showFilters=false"
        />
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex';
import store from '../../store/index';
import TransactionModal from './TransactionModal.vue';
import { GET_TRANSACTIONS_MODES } from '../../infrastructure/transactions/transactions-types';
import WoWalletCreationDialog from '../wallet/WoWalletCreationDialog.vue';
import TransactionListFilters from './transactionListFilters.vue';

export default {
  name: 'Transactions',
  store,
  components: {
    TransactionModal,
    WoWalletCreationDialog,
    TransactionListFilters,
  },
  props: {
    presetFilter: {
      type: String,
      default() {
        return '';
      },
    },
    title: {
      type: String,
      default() {
        return 'Recent Transactions';
      },
    },
  },
  data() {
    return {
      headers: [
        {
          text: this.$t('Block / Type'),
          value: 'blockNumber',
          hoverText: 'sort by block number',
        },
        {
          text: this.$t('Main properties'),
          value: '',
          hoverText: 'no sorting action',
        },
        {
          text: this.$t('Signer / Recipient'),
          value: 'recipient',
          hoverText: 'sort by recipient',
        },
      ],
      rowsPerPageOptions: [
        25, 50, { text: 'All', value: -1 },
      ],
      modal: false,
      showFilters: false,
      showWoWalletCreationDialog: false,
      showTransactionModal: false,
    };
  },
  computed: {
    ...mapState([
      'transactions',
      'wallet',
    ], {
      transactions: state => state.transactions,
    }),
    tx() {
      return this.transactions.activeTransaction;
    },
  },
  mounted() {
    if (this.presetFilter === false) return;
    if (this.presetFilter === '') {
      this.$store.dispatch('transactions/RESET_TRANSACTION_FILTERS');
    } else {
      this.$store.dispatch(
        'transactions/UPDATE_TRANSACTION_TYPES_PRESET_FILTER',
        [this.presetFilter],
      );
    }
  },
  methods: {
    refresh(wallet) {
      this.$store.dispatch(
        'transactions/GET_TRANSACTIONS_BY_ID',
        { wallet, mode: GET_TRANSACTIONS_MODES.REFRESH },
      );
    },
    loadMore(wallet) {
      this.$store.dispatch(
        'transactions/GET_TRANSACTIONS_BY_ID',
        { wallet, mode: GET_TRANSACTIONS_MODES.MORE },
      );
    },
  },
};
</script>
