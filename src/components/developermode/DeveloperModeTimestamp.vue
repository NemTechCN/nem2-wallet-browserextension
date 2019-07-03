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
        Timestamp Tool
      </span>
    </v-card-title>
    <v-card-text>
      <v-flex x12>
        <span class="subheading">
          NEM2 time
        </span>
        <v-text-field
          v-model="timestampUint64"
          :label="$t('Timestamp-array')"
          @change="toTimestamp"
        />
        <v-text-field
          v-model="timestampDate"
          type="number"
          :label="$t('Unix-Time')"
          @change="fromTimestamp"
        />
        <v-text-field
          v-model="timestampUTC"
          :disabled="true"
          :label="$t('UTC')"
        />
        <v-text-field
          v-model="timestampLocal"
          :disabled="true"
          :label="$t('Local')"
        />
      </v-flex>
    </v-card-text>
  </v-card>
</template>
<script>
import { UInt64 } from 'nem2-sdk';

const nem2epochTimestamp = 1459468800000;

export default {
  data() {
    return {
      timestampDate: '',
      timestampUint64: '',
      timestampUTC: '',
      timestampLocal: '',
    };
  },
  methods: {
    toTimestamp() {
      const parsedUint64 = new UInt64(this.timestampUint64.replace(/(\[|\])/g, '').split(',').map(x => Number(x)));
      const millis = parsedUint64.compact() + nem2epochTimestamp;
      const d = new Date(0);
      d.setUTCMilliseconds(millis);
      this.timestampDate = d.getTime();
      this.timestampUTC = d.toUTCString();
      this.timestampLocal = d.toLocaleString();
    },
    fromTimestamp() {
      const d = new Date(0);
      d.setUTCMilliseconds(this.timestampDate);
      this.timestampUTC = d.toUTCString();
      this.timestampLocal = d.toLocaleString();
      const millis = d.getTime() - nem2epochTimestamp;
      this.timestampUint64 = `[${UInt64.fromUint(millis).toDTO()}]`;
    },
  },
};
</script>
