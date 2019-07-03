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
  <v-list
    two-line
    class="py-0"
  >
    <v-slide-y-transition
      group
      tag="v-list"
      class="py-0"
    >
      <template v-for="(result) in results">
        <v-list-tile
          :key="result.txHash"
          avatar
          ripple
        >
          <v-list-tile-content class="my-2">
            <v-list-tile-title>Transaction sent was a success! 🚀</v-list-tile-title>
            <v-list-tile-sub-title class="monospaced-bold">
              Hash:
              <a
                :href="result.txStatusUrl"
                target="_blank"
              >
                {{ result.txHash }}
              </a>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-slide-y-transition>
  </v-list>
</template>

<script>
import request from 'request';

export default {
  props: {
    txSendData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    results() {
      const that = this;
      const result = this.txSendData[this.txSendData.length - 1];
      if (!result) {
        return false;
      }
      const { txHash } = result;
      const node = this.$store.state.application.activeNode;
      const url = `${node}/transaction/${txHash}/status`;
      request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const res = JSON.parse(body);
          if (res.group === 'failed') {
            that.$store.dispatch(
              'transactions/TRIGGER_ERRORED_TRANSACTION_SNACKBAR',
              { type1: ` ${res.status}`, transaction: result.transaction },
            );
          }
        } else {
          that.$store.dispatch(
            'transactions/TRIGGER_ERRORED_TRANSACTION_SNACKBAR',
            { type1: ' error in announce', transaction: result.transaction },
          );
          console.error(error);
        }
      });
      return this.txSendData.map(res => ({
        txHash: res.txHash,
        txStatusUrl: `${res.nodeURL}/transaction/${res.txHash}/status`,
      }));
    },
  },
};
</script>
