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
  <div class="ws-container">
    <v-select
      v-if="walletName"
      v-model="walletName"
      :items="wallets"
      :label="$t('No-Wallet-Selected')"
      class="ws-select"
      solo
    />

    <v-icon
      v-if="wallet.activeWallet.walletType !== walletTypes.WATCH_ONLY_WALLET
        && wallet.activeWallet && wallet.activeWallet.isWatchOnly"
      class="ws-icons ws-dark"
      :alt="$t('unlock-the-wallet')"
      large
      @click.stop="showPasswordInput = true"
    >
      lock_open
    </v-icon>

    <v-icon
      v-if="wallet.activeWallet.walletType !== walletTypes.WATCH_ONLY_WALLET
        && wallet.activeWallet && !wallet.activeWallet.isWatchOnly"
      class="ws-icons ws-dark"
      large
      @click.stop="showLockWallet = true"
    >
      lock
    </v-icon>

    <v-menu
      transition="slide-y-transition"
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-icon
          class="ws-icons pointer ws-wallet"
          large
          v-on="on"
        >
          payment
        </v-icon>
      </template>
      <v-list>
        <v-list-tile>
          <v-list-tile-avatar>
            <v-icon>list</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title
            class="pointer"
            @click.stop="goToWallet"
          >
            {{ $t('My-wallets') }}
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-avatar>
            <v-icon>add_box</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title
            class="pointer"
            @click.stop="showWalletCreationDialog = true"
          >
            {{ $t('New-Wallet') }}
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-avatar>
            <v-icon>add_box</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title
            class="pointer"
            @click.stop="showWoWalletCreationDialog = true"
          >
            {{ $t('New-Watch-Only-Wallet') }}
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-avatar>
            <v-icon>add_box</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title
            class="pointer"
            @click.stop="showWalletImportDialog = true"
          >
            {{ $t('Import-From-Private-Key') }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <v-icon
      v-if="application.darkMode"
      class="ws-icons ws-dark"
      large
      @click="$store.dispatch('application/TOGGLE_DARK_MODE')"
    >
      wb_sunny
    </v-icon>
    <v-icon
      v-if="!application.darkMode"
      class="ws-icons ws-dark"
      large
      @click="$store.dispatch('application/TOGGLE_DARK_MODE')"
    >
      brightness_2
    </v-icon>

    <v-chip
      :color="chipColor"
      text-color="white"
      class="ws-height"
      style="cursor: pointer !important"
      @click.stop="showNodes=true"
    >
      <span class="pointer">
        <div
          style="
          display: block;
          float: left;
          height: 32px;
          padding-top: 6px;"
        >
          {{ application.listenerStatus === 'OK'
            ? application.blockNumber.toLocaleString()
            : application.listenerStatus }}
        </div>

        <v-icon
          v-if="application.blockNumber !== 'error'"
          style="
            margin-left: 12px;
            margin-right: -8px;
            padding-top: 2px;
            height: 32px;
            display: block;
            float: left;"
          right
        >
          power
        </v-icon>
        <v-icon
          v-if="application.blockNumber === 'error'"
          style="
            margin-left: 12px;
            margin-right: -8px;
            padding-top: 2px;
            height: 32px;
            display: block;
            float: left;"
          right
        >
          power_off
        </v-icon>
      </span>
    </v-chip>

    <WalletCreationDialog
      :visible="showWalletCreationDialog"
      @close="showWalletCreationDialog=false"
    />
    <WalletImportDialog
      :visible="showWalletImportDialog"
      @close="showWalletImportDialog=false"
    />
    <WoWalletCreationDialog
      :visible="showWoWalletCreationDialog"
      @close="showWoWalletCreationDialog=false"
    />
    <Nodes
      :visible="showNodes"
      @close="showNodes=false"
    />
    <PasswordInput
      :visible="showPasswordInput"
      :wallet-name="wallet.activeWallet.name"
      :wallet-type="wallet.activeWallet.walletType"
      @close="showPasswordInput = false"
    />
    <LockWallet
      :visible="showLockWallet"
      :wallet-name="wallet.activeWallet.name"
      :wallet-type="wallet.activeWallet.walletType"
      @close="showLockWallet = false"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import store from '../../store/index';
import WalletCreationDialog from '../wallet/WalletCreationDialog.vue';
import WoWalletCreationDialog from '../wallet/WoWalletCreationDialog.vue';
import WalletImportDialog from '../wallet/WalletImportDialog.vue';
import Nodes from './Nodes.vue';
import PasswordInput from '../wallet/PasswordInput.vue';
import LockWallet from '../wallet/LockWallet.vue';
import { walletTypes } from '../../infrastructure/wallet/wallet-types';

export default {
  store,
  components: {
    WalletCreationDialog,
    WalletImportDialog,
    WoWalletCreationDialog,
    Nodes,
    PasswordInput,
    LockWallet,
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    wallets: Array,
  },
  data() {
    return {
      showWoWalletCreationDialog: false,
      showWalletCreationDialog: false,
      showWalletImportDialog: false,
      showPasswordInput: false,
      showLockWallet: false,
      showNodes: false,
      walletTypes,
    };
  },
  computed: {
    ...mapState([
      'application',
      'wallet',
    ]),
    chipColor() {
      if (this.application.listenerStatus === 'off') return 'false';
      if (this.application.blockNumber === 'error') return 'red';
      if (this.application.blockNumber === 'loading') return 'blue';
      return 'green';
    },
    walletName: {
      get() {
        return this.$store.getters['wallet/GET_ACTIVE_WALLET'].name;
      },

      set(newActiveWalletName) {
        this.$store.dispatch('wallet/SET_ACTIVE_WALLET', newActiveWalletName);
      },
    },
  },
  methods: {
    goToWallet() {
      this.$router.push('/wallet');
    },
  },
};
</script>
