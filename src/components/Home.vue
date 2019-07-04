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
          <Errors style="margin-bottom:35px !important" />
          <v-card
            v-if="
              wallet.wallets.length > 0 &&
                wallet.activeWallet"
          >
            <v-toolbar
              card
              prominent
            >
              <v-toolbar-title>{{ wallet.activeWallet.name }}</v-toolbar-title>
              <v-spacer />

              <v-btn
                icon
                @click.stop="reloadAccountInfo(wallet.activeWallet)"
              >
                <v-icon>refresh</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-container
                fluid
                grid-list-sm
              >
                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    d-flex
                    xs12
                  >
                    <v-layout column>
                      <v-flex d-flex>
                        <v-card
                          color="blue-grey"
                          dark
                          tile
                          flat
                        >
                          <v-card-text>
                            <v-text-field
                              :value="wallet.activeWallet
                                .publicAccount.address.pretty()"
                              class="mt-4 mr-0 mb-0 ml-0 pa-0 monospaced"
                              :label="$t('Address')"
                              color="white"
                              readonly
                            />

                            <v-text-field
                              :value="wallet.activeWallet
                                .publicAccount.publicKey"
                              class="ma-0 pa-0 monospaced"
                              :label="$t('Public-Key')"
                              color="white"
                              readonly
                            />

                            <v-text-field
                              v-if="showPrivateKey"
                              :value="wallet.activeWallet.isWatchOnly
                                ? 'watch only'
                                : wallet.activeWallet.account.privateKey"
                              class="ma-0 pa-0 monospaced"
                              :label="$t('Private-Key')"
                              color="white"
                              readonly
                            />

                            <v-text-field
                              :value="wallet.activeWallet.node"
                              class="ma-0 pa-0 monospaced"
                              :label="$t('Default-node')"
                              color="white"
                              readonly
                            />
                            <v-text-field
                              :value="application.activeNode"
                              class="ma-0 pa-0 monospaced"
                              :label="$t('Current-node')"
                              color="white"
                              readonly
                            />
                            <div style="text-align: right">
                              <v-btn
                                flat
                                color="white"
                                class="float:right !important"
                                @click.stop="showPrivateKey = !showPrivateKey"
                              >
                                {{ $t(!showPrivateKey ? 'show-private-key' : 'hide-private-key') }}
                              </v-btn>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex
                    d-flex
                    xs12
                    sm4
                  >
                    <v-card
                      color="red lighten-2"
                      dark
                      tile
                      flat
                      pa-0
                    >
                      <h3 style="margin:6px 0px 0px 12px;">
                        {{ $t('Assets-balance') }}
                      </h3>
                      <div
                        v-if="!ownedAssets"
                        style="text-align:center;margin-top:20%"
                      >
                        <v-progress-circular
                          :size="50"
                          color="amber"
                          indeterminate
                        />
                      </div>
                      <v-card-text v-if="ownedAssets==='none'">
                        {{ $t('This-account-does-not-own-any-asset') }}
                      </v-card-text>
                      <div v-if="ownedAssets && ownedAssets!=='none'">
                        <div
                          v-for="(a, i) in ownedAssets"
                          :key="i"
                        >
                          <v-card-text pa-0>
                            {{ a.name ? `${a.name} (${a.id})` : a.id }}:&nbsp;
                            {{ parseInt(a.balance).toLocaleString() }}&nbsp;
                            [{{ (a.amount/Math.pow(10, a.divisibility)).toLocaleString() }}]
                          </v-card-text>
                        </div>
                      </div>
                    </v-card>
                  </v-flex>
                  <v-flex
                    d-flex
                    xs12
                    sm4
                  >
                    <v-card
                      color="red lighten-2"
                      dark
                      tile
                      flat
                      pa-0
                    >
                      <h3 style="margin:6px 0px 0px 12px;">
                        {{ $t('Owned-namespaces') }}
                      </h3>
                      <div
                        v-if="!ownedNamespaces"
                        style="text-align:center;margin-top:20%"
                      >
                        <v-progress-circular
                          :size="50"
                          color="amber"
                          indeterminate
                        />
                      </div>
                      <v-card-text v-if="ownedNamespaces==='none'">
                        {{ $t('This-account-does-not-own-any-namespace') }}
                      </v-card-text>
                      <div v-if="ownedNamespaces && ownedNamespaces!=='none'">
                        <div
                          v-for="(a, i) in ownedNamespaces"
                          :key="i"
                        >
                          <v-card-text pa-0>
                            {{ a.name }}
                          </v-card-text>
                        </div>
                      </div>
                    </v-card>
                  </v-flex>
                  <v-flex
                    d-flex
                    xs12
                    sm4
                  >
                    <v-card
                      color="red lighten-2"
                      dark
                      tile
                      flat
                      pa-0
                      style="text-align: center;"
                    >
                      <img
                        :src="QR"
                        style="
                          margin: 10px 11px 4px 11px !important;
                          height: 200px;
                          width: 200px;"
                      >
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout
        row
        wrap
        style="margin-top: 30px !important;"
      >
        <v-flex
          xs12
        >
          <Transactions
            v-if="wallet.activeWallet
              && transactions.transactions
              && transactions.transactions[wallet.activeWallet.name]"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>
<script>

import { mapState } from 'vuex';
import { NetworkType } from 'nem2-sdk';
import { QRCodeGenerator } from 'nem2-qr-library';
import Errors from './Errors.vue';
import Transactions from './transactions/Transactions.vue';
import { GET_ACCOUNT_INFO_MODES } from '../infrastructure/accountInfo/accountInfo-types';

export default {
  name: 'Home',
  components: {
    Errors,
    Transactions,
  },
  data() {
    return {
      showPrivateKey: false,
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
    QR() {
      const qrData = {
        address: this.wallet.activeWallet.isWatchOnly
          ? this.wallet.activeWallet.publicAccount.address.pretty()
          : this.wallet.activeWallet.account.address.pretty(),
      };

      return QRCodeGenerator.createExportObject(qrData, NetworkType.MIJIN_TEST).toBase64();
    },
    ownedAssets() {
      if (this.assets.loading_getMosaicsByAddress) return false;
      if (!this.assets.assets[this.wallet.activeWallet.name]
       || this.assets.assets[this.wallet.activeWallet.name].length === 0) return 'none';
      return this.assets.assets[this.wallet.activeWallet.name]
        .filter(x => (x.balance > 0 && x.active));
    },
    ownedNamespaces() {
      if (this.namespaces.loading_getNamespacesByAddress) return false;
      if (!this.namespaces.namespaces[this.wallet.activeWallet.name]
       || this.namespaces.namespaces[this.wallet.activeWallet.name].length === 0) return 'none';
      return this.namespaces.namespaces[this.wallet.activeWallet.name];
    },
  },
  methods: {
    reloadAccountInfo(wallet) {
      this.$store.dispatch('accountInfo/FETCH_ACCOUNT_INFO', {
        wallet,
        mode: GET_ACCOUNT_INFO_MODES.RELOAD,
      });
    },
  },
};

</script>
