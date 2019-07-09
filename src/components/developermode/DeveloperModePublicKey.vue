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
        {{ $t('Get-address-from-public-key') }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-flex xs12>
        <v-form>
          <v-text-field
            v-model="publicKey"
            :label="$t('Public-Key')"
          />
          <v-radio-group
            v-model="networkID"
            row
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
          />
          <v-text-field
            v-model="addressPretty"
            :label="$t('Address-pretty')"
          />
          <v-text-field
            v-model="addressEncoded"
            :label="$t('Address-encoded')"
          />
        </v-form>
      </v-flex>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  Address,
  NetworkType,
} from 'nem2-sdk';
import {
  address as libAddress,
  convert as libConvert,
} from 'nem2-library';

export default {
  data() {
    return {
      publicKey: '',
      addressPlain: '',
      addressPretty: '',
      addressEncoded: '',
      networkType: NetworkType,
      networkID: NetworkType.MIJIN_TEST,
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
  watch: {
    publicKey: {
      handler() {
        const address = Address.createFromPublicKey(this.publicKey, this.networkType);
        this.addressPlain = address.plain();
        this.addressPretty = address.pretty();
        this.addressEncoded = libConvert.uint8ToHex(libAddress.stringToAddress(address.plain()));
      },
    },
  },
};
</script>
