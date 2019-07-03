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
  <v-dialog
    v-model="show"
    max-width="680px"
  >
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-3">
          {{ $t('Import-a-wallet-from-private-key') }}
        </h3>
        <p class="mb-0 clearfix">
          {{ $t('This-wallet-will-be-saved-in-your-browser-storage') }}&nbsp;
          {{ $t('safely-encrypted-with-your-password.') }}
        </p>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="node"
          class="ma-0 pa-0"
          :label="$t('NEM2-default-node-URL')"
        >
          {{ node }}
        </v-text-field>

        <v-select
          v-if="application.officialNodes"
          v-model="selectedOfficialNode"
          :items="application.officialNodes"
          class="ma-0 pa-0"
          :label="$t('Pick-a-node-from-the-official-list')"
          @input="afterselection"
        />

        <v-text-field
          v-model="walletName"
          class="ma-0 pa-0"
          :label="$t('Wallet-name')"
        />

        <v-text-field
          v-model.lazy="privateKey"
          class="ma-0 pa-0"
          :label="$t('Private-Key')"
        />

        <v-text-field
          v-model.lazy="password"
          class="ma-0 pa-0"
          :label="$t('Password')"
        />

        <v-switch
          v-model="keepUnlocked"
          class="ma-0 pa-0"
          :label="$t('Keep-the-wallet-unlocked-session')"
        />

        <div
          v-if="isValidAccount"
        >
          <v-divider class="mt-4" />

          <v-text-field
            v-if="isValidAccount"
            :value="isValidAccount ? account.address.pretty() : ''"
            class="mt-4 pt-4 monospaced"
            :label="$t('Address')"
            readonly
          />

          <v-text-field
            v-if="isValidAccount"
            :value="isValidAccount ? account.publicKey : ''"
            class="ma-0 pa-0 monospaced"
            :label="$t('Public-Key')"
            readonly
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          @click.stop="$emit('close')"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="node === '' || walletName === ''
            || !isValidAccount || !validPassword"
          color="primary mx-0"
          @click="save"
        >
          Create Wallet
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { NetworkType, Account, Password } from 'nem2-sdk';
import store from '../../store/index';

export default {
  name: 'WalletImportDialog',
  store,
  props: {
    visible: Boolean,
  },
  data() {
    return {
      node: '',
      walletName: '',
      account: {},
      privateKey: '',
      isValidAccount: false,
      selectedOfficialNode: null,
      password: '',
      validPassword: false,
      keepUnlocked: true,
    };
  },


  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
        }
      },
    },
    ...mapState([
      'application',
    ]),
  },


  watch: {
    privateKey() {
      this.createFromPrivateKey(this.privateKey);
    },
    password: {
      handler(e) {
        try {
          const password = new Password(e);
          this.validPassword = !!password.value;
        } catch (error) {
          // do nothing
        }
      },
    },
  },


  methods: {
    async save() {
      const newWallet = {
        name: this.walletName,
        account: this.account,
        node: this.node,
        locked: !this.keepUnlocked,
        password: this.password,
      };
      this.$store.dispatch('wallet/ADD_WALLET', newWallet);
      this.node = '';
      this.walletName = '';
      this.privateKey = '';
      this.account = {};
      this.$emit('close');
    },
    createFromPrivateKey() {
      const key = this.privateKey.length === 64
        ? this.privateKey.toUpperCase() : false;
      if (key) {
        try {
          this.account = Account.createFromPrivateKey(
            key,
            NetworkType.MIJIN_TEST,
          );
          this.isValidAccount = true;
        } catch (error) {
          this.isValidAccount = false;
        }
      } else {
        this.account = {};
        this.isValidAccount = false;
      }
    },
    afterselection(e) {
      if (e) this.node = e;
      this.selectedOfficialNode = [];
    },
  },
};
</script>
