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
  <v-container
    grid-list-md
  >
    <v-layout
      row
      wrap
      align-content-center
      justify-center
    >
      <template v-for="(wallet, index) in wallet.wallets">
        <v-flex
          :key="wallet.name"
          style="max-width:450px;"
          grow
        >
          <v-card
            avatar
            ripple
            style="padding: 0 15px;"
          >
            <v-card-title primary-title>
              <h3 class="headline mb-0">
                {{ wallet.name }}
              </h3>
            </v-card-title>
            {{ wallet.publicAccount.address.pretty() }}
            <div class="clearfix">
              <div class="clearfix">
                {{ $t('Default-node') }}: {{ wallet.node }}
              </div>
              <div class="clearfix">
                {{ $t('Type') }}: {{ wallet.walletType }}
              </div>
              <div class="clearfix">
                {{ $t('Locked') }}: {{ $t(wallet.isWatchOnly
                  ? 'true' : 'false') }}
              </div>
            </div>
            <v-card-actions>
              <v-btn
                v-if="wallet.walletType !== walletTypes.WATCH_ONLY_WALLET
                  && wallet.isWatchOnly"
                icon
                ripple
                @click="
                  clickedWalletName = wallet.name;
                  clickedWalletType = wallet.type;
                  showPasswordInput = true;"
              >
                <v-icon>
                  lock_open
                </v-icon>
              </v-btn>

              <v-btn
                v-if="wallet.walletType !== walletTypes.WATCH_ONLY_WALLET
                  && !wallet.isWatchOnly"
                icon
                ripple
                @click="
                  clickedWalletName=wallet.name;
                  clickedWalletType = wallet.type;
                  showLockWallet = true;"
              >
                <v-icon>
                  lock
                </v-icon>
              </v-btn>

              <v-btn
                icon
                ripple
                @click="removeWallet(wallet.name)"
              >
                <v-icon>
                  delete_forever
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-divider
            v-if="index + 1 < wallet.walletsNumber"
            :key="index"
          />
        </v-flex>
      </template>

      <PasswordInput
        :visible="showPasswordInput"
        :wallet-name="clickedWalletName"
        :wallet-type="clickedWalletType"
        @close="showPasswordInput = false"
      />
      <LockWallet
        :visible="showLockWallet"
        :wallet-name="clickedWalletName"
        :wallet-type="clickedWalletType"
        @close="showLockWallet = false"
      />
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import store from '../../store/index';
import { walletTypes } from '../../infrastructure/wallet/wallet-types';
import PasswordInput from './PasswordInput.vue';
import LockWallet from './LockWallet.vue';

export default {
  name: 'WalletList',
  store,
  components: {
    PasswordInput,
    LockWallet,
  },
  data() {
    return {
      showPasswordInput: false,
      showLockWallet: false,
      clickedWalletName: '',
      clickedWalletType: '',
      walletTypes,
    };
  },
  computed: mapState(['wallet']),
  methods: {
    removeWallet(walletName) {
      this.$store.dispatch('wallet/REMOVE_WALLET', walletName);
    },
  },
};
</script>
