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
    max-width="600px"
  >
    <v-layout>
      <v-flex
        xs12
      >
        <v-card>
          <v-card-title primary-title>
            <div class="monospaced">
              <h3 class="headline mb-0">
                {{ tx.type2 }} {{ tx.type1 }}
              </h3>

              <div v-if="!tx.rejected">
                <span class="clearfix bold">
                  ID
                </span>
                <span class="clearfix  mb-2">
                  {{ tx.id }}
                </span>
              </div>

              <div v-if="!tx.rejected && !tx.unconfirmed">
                <span class="clearfix bold">
                  {{ $t('Block-Number') }}
                </span>
                <span class="clearfix  mb-2">
                  {{ tx.blockNumber.toLocaleString() }}
                </span>
              </div>

              <span class="clearfix bold">
                {{ $t('Transaction-hash') }}
              </span>
              <span class="clearfix  mb-2">
                {{ tx.transactionHash }}
              </span>

              <span class="clearfix bold">
                {{ $t('Signer') }}
              </span>
              <span class="clearfix  mb-2">
                {{ tx.signer }}
              </span>

              <div v-if="tx.recipient !== ''">
                <span class="clearfix bold">
                  {{ $t('Recipient') }}
                </span>
                <span class="clearfix  mb-2">
                  {{ tx.recipient }}
                </span>
              </div>

              <div v-if="tx.amount > 0">
                <span class="clearfix bold">
                  {{ $t('Amount') }}
                </span>
                <span class="clearfix  mb-2">
                  {{ tx.amount.toLocaleString() }}
                </span>
              </div>

              <span class="clearfix bold">
                {{ $t('Fee') }}
              </span>
              <span class="clearfix  mb-2">
                {{ tx.fee }}
              </span>

              <div
                v-for="(bodyItem, index) in tx.body"
                :key="index"
              >
                <span class="clearfix bold">
                  {{ bodyItem.key }}
                </span>
                <span class="clearfix  mb-2">
                  {{ bodyItem.value }}
                </span>
              </div>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="info"
              @click.stop="show=false"
            >
              {{ $t('Close') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import store from '../../store/index';

export default {
  name: 'TransactionModal',
  store,
  props: {
    visible: Boolean,
  },
  computed: {
    ...mapState([
      'transactions',
    ], {
      transactions: state => state.transactions,
    }),
    tx() {
      return this.transactions.activeTransaction;
    },
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
  },
};
</script>
