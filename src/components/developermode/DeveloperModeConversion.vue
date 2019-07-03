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
// along with nem2-wallet-browserextension.  If not, see <http://www.gnu.org/licenses/>.

<template>
  <v-card>
    <v-card-title>
      <span class="title">
        Conversion Tools
      </span>
    </v-card-title>
    <v-card-text>
      <v-flex xs12>
        <span class="subheading">
          String
        </span>
        <v-text-field
          v-model="utf8String"
          :label="$t('UTF-8-String')"
          :placeholder="$t('Just-a-string-a-lonely-string')"
          @change="stringtoHex"
        />
        <v-text-field
          v-model="hexString"
          :label="$t('Hex-String')"
          @change="hextoString"
        />
      </v-flex>
      <v-divider />
      <v-flex xs12>
        <span class="subheading">
          Number
        </span>
        <v-text-field
          v-model="number"
          :label="$t('Number')"
          type="number"
          @change="numberConvert"
        />
        <v-text-field
          v-model="hexNumber"
          :label="$t('Hex-number')"
          @change="hexConvert"
        />
        <v-text-field
          v-model="uint64Array"
          :label="$t('uint64-Array')"
          placeholder="[00...,00...]"
          @change="uint64Convert"
        />
      </v-flex>
    </v-card-text>
  </v-card>
</template>
<script>
import { convert } from 'nem2-library';
import { UInt64 } from 'nem2-sdk';

export default {
  data() {
    return {
      utf8String: '',
      hexString: '',
      number: '',
      hexNumber: '',
      uint64Array: '',
    };
  },
  methods: {
    stringtoHex() {
      this.hexString = convert.utf8ToHex(this.utf8String);
    },
    hextoString() {
      if (convert.isHexString(this.hexString)) {
        this.utf8String = this.hexString.split(/(.{2})/)
          .filter(O => O)
          .map(char => String.fromCharCode(parseInt(char, 16)))
          .join('');
      }
    },
    numberConvert() {
      this.uint64Array = `[${UInt64.fromUint(Number(this.number)).toDTO()}]`;
      this.hexNumber = parseInt(this.number, 10).toString(16);
    },
    hexConvert() {
      this.number = parseInt(this.hexNumber, 16);
      this.uint64Array = `[${UInt64.fromHex(this.hexNumber).toDTO()}]`;
    },
    uint64Convert() {
      const parsedUint64 = new UInt64(this.uint64Array.replace(/(\[|\])/g, '').split(',').map(x => Number(x)));
      this.hexNumber = parsedUint64.toHex().toUpperCase();
      this.number = parseInt(this.hexNumber, 16);
    },
  },
};
</script>
