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
  <v-card>
    <v-card-title>
      <span class="title">
        Account Tools
      </span>
    </v-card-title>
    <v-card-text>
      <v-flex xs12>
        <v-form>
          <v-text-field
            v-model="privateKey"
            :label="$t('Private-Key')"
            :error="privateKeyErr"
            :messages="privateKeyErrMessage"
            @change="recalculateAccount"
          />
          <v-text-field
            v-model="publicKey"
            :label="$t('Public-Key')"
            @change="recalculatePublicAccount"
          />
          <v-radio-group
            v-model="networkID"
            row
            @change="recalculatePublicAccount"
          >
            <v-radio
              v-for="k in networkName"
              :key="k"
              :label="`${k}`"
              :value="networkType[k]"
            />
          </v-radio-group>
          <v-text-field
            v-model="addressPlain"
            :label="$t('Address-plain')"
            @change="calculateAddress"
          />
          <v-text-field
            v-model="addressPretty"
            :label="$t('Address-pretty')"
            @change="calculateAddress"
          />
          <v-text-field
            v-model="addressEncoded"
            :label="$t('Address-encoded')"
            @change="decodeAddress"
          />
        </v-form>
      </v-flex>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        @click="generateAccount"
      >
        {{ $t('Generate-private-key') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  Account,
  Address,
  NetworkType,
  PublicAccount,
} from 'nem2-sdk';
import {
  address as libAddress,
  convert as libConvert,
} from 'nem2-library';

export default {
  data() {
    return {
      privateKey: '',
      publicKey: '',
      addressPlain: '',
      addressPretty: '',
      addressEncoded: '',
      publicAccount: null,
      networkType: NetworkType,
      networkID: NetworkType.MIJIN_TEST,
      privateKeyErr: false,
      privateKeyErrMessage: '',
    };
  },
  computed: {
    networkName() {
      // Hide MAIN_NET and TEST_NET until catapult release
      // return Object.keys(NetworkType)
      //   // eslint-disable-next-line no-restricted-globals
      //   .filter(key => !isNaN(Number(NetworkType[key])));
      return ['MIJIN', 'MIJIN_TEST'];
    },
  },
  methods: {
    isPrivatePublicKeyMatch() {
      const acc = Account.createFromPrivateKey(this.privateKey, this.networkID);
      return acc.publicKey.toUpperCase() === this.publicKey.toUpperCase();
    },
    checkPrivatePublicKeyMatch() {
      if (!this.isPrivatePublicKeyMatch()) {
        this.privateKeyErr = true;
        this.privateKeyErrMessage = this.$t('Private-Key-does-not-match-public-key');
        return;
      }
      this.privateKeyErr = false;
      this.privateKeyErrMessage = '';
    },
    recalculateAccount() {
      const pp = this.privateKey;
      if (pp.length === 64) {
        try {
          const acc = Account.createFromPrivateKey(pp, this.networkID);
          this.publicKey = acc.publicKey;
          this.recalculatePublicAccount();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
    },
    recalculatePublicAccount() {
      const pk = this.publicKey;
      if (pk.length === 64) {
        try {
          this.publicAccount = PublicAccount.createFromPublicKey(pk, this.networkID);
          this.updateAddress();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
      this.checkPrivatePublicKeyMatch();
    },
    updateAddress() {
      const acc = this.publicAccount;
      this.addressPlain = acc.address.plain();
      this.addressPretty = acc.address.pretty();
      this.addressEncoded = libConvert.uint8ToHex(libAddress.stringToAddress(this.addressPlain));
    },
    generateAccount() {
      const account = Account.generateNewAccount(this.networkID);
      this.privateKey = account.privateKey.toString();
      this.recalculateAccount();
    },
    calculateAddress(a) {
      const address = Address.createFromRawAddress(a);
      this.addressPlain = address.plain();
      this.addressPretty = address.pretty();
      this.addressEncoded = libConvert.uint8ToHex(libAddress.stringToAddress(this.addressPlain));
    },
    decodeAddress() {
      const address = Address.createFromEncoded(this.addressEncoded);
      this.addressPlain = address.plain();
      this.addressPretty = address.pretty();
    },
  },
};
</script>
