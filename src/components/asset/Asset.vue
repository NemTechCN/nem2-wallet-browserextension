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
      <Errors class="mb-4" />
      <v-card
        v-if="wallet.wallets.length > 0
          && wallet.activeWallet
          && !application.error"
        style="height: auto;padding:0 !important"
        class="card--flex-toolbar mb-4"
      >
        <v-toolbar
          card
          prominent
        >
          <v-toolbar-title>{{ $t('Assets') }}</v-toolbar-title>

          <v-spacer />

          <v-btn
            icon
            @click.stop="reloadList(wallet.activeWallet)"
          >
            <v-icon>refresh</v-icon>
          </v-btn>

          <v-btn
            icon
            :disabled="wallet.activeWallet.walletType === walletTypes.WATCH_ONLY_WALLET"
            @click.stop="wallet.activeWallet.isWatchOnly
              ? showPasswordInput = true : createAsset = true"
          >
            <v-icon>add_box</v-icon>
          </v-btn>
        </v-toolbar>

        <v-spacer />
        <v-card-text>
          <AssetCreation
            :visible="createAsset"
            @close="createAsset = false"
          />
          <AssetList :default-tab="1" />
        </v-card-text>
      </v-card>
      <Transactions
        v-if="wallet.activeWallet
          && transactions.transactions
          && transactions.transactions[wallet.activeWallet.name]"
        preset-filter="Mosaic"
        :title="$t('Recent-mosaic-transactions')"
      />
    </v-flex>
    <PasswordInput
      :visible="showPasswordInput"
      :wallet-name="wallet.activeWallet.name"
      :wallet-type="wallet.activeWallet.walletType"
      @close="showPasswordInput = false"
    />
  </v-layout>
</template>
<script>
import { mapState } from 'vuex';
import store from '../../store/index';
import { walletTypes } from '../../infrastructure/wallet/wallet-types';

import Errors from '../Errors.vue';
import PasswordInput from '../wallet/PasswordInput.vue';
import AssetCreation from './AssetCreation.vue';
import AssetList from './AssetList.vue';
import Transactions from '../transactions/Transactions.vue';

export default {
  name: 'Assets',
  store,
  components: {
    Errors,
    PasswordInput,
    AssetCreation,
    AssetList,
    Transactions,
  },
  data() {
    return {
      walletTypes,
      showPasswordInput: false,
      createAsset: false,
      reloadAssetNotifier: 0,
    };
  },
  computed: mapState([
    'wallet',
    'application',
    'assets',
    'transactions',
  ]),
  methods: {
    reloadList(wallet) {
      this.$store.dispatch('assets/GET_ASSETS_BY_ADDRESS', { wallet });
    },
  },
};
</script>
