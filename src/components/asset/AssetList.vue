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
  <v-layout column>
    <div v-if="assets.loading_getMosaicsByAddress">
      <v-progress-linear :indeterminate="true" />
    </div>
    <div
      v-if="!assets.loading_getMosaicsByAddress
        && assets.assets[wallet.activeWallet.name]
        && assets.assets[wallet.activeWallet.name].length === 0"
    >
      <v-flex xs12>
        <v-alert
          :value="true"
          type="info"
        >
          {{ $t('This-account-does-not-own-any-asset') }}
        </v-alert>
      </v-flex>
    </div>
    <div
      v-if="!assets.loading_getMosaicsByAddress
        && assets.assets[wallet.activeWallet.name]
        && assets.assets[wallet.activeWallet.name].length > 0"
    >
      <div>
        <v-tabs
          v-model="defaultTab"
          fixed-tabs
        >
          <v-tab :key="0">
            {{ $t('Assets-balance') }}
          </v-tab>

          <v-tab-item :key="0">
            <AssetTab :assets="filterZeros(assets.assets[wallet.activeWallet.name])" />
          </v-tab-item>

          <v-tab :key="1">
            {{ $t('My-Assets') }}
          </v-tab>
          <v-tab-item :key="1">
            <AssetTab
              :assets="filterByOwner(
                assets.assets[wallet.activeWallet.name],
                wallet.activeWallet.isWatchOnly
                  ? wallet.activeWallet.publicAccount.address.pretty()
                  : wallet.activeWallet.account.address.pretty()
              )"
              owned-assets
            />
          </v-tab-item>
        </v-tabs>
      </div>
    </div>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';
import store from '../../store/index';
import AssetTab from './AssetTab.vue';

export default {
  name: 'AssetList',
  store,
  components: {
    AssetTab,
  },
  props: {
    defaultTab: {
      type: Number,
      default() { return 0; },
    },
  },
  computed: mapState([
    'wallet',
    'assets',
  ]),
  methods: {
    filterByOwner(array, owner) {
      return array.filter(x => x.owner === owner);
    },
    filterZeros(array) {
      return array.filter(x => x.balance > 0);
    },
  },
};
</script>
