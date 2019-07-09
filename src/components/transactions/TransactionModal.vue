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
              <!-- @TODO: aggregate -->
              <h3 class="headline mb-0">
                {{ tx.properties.type }} {{ tx.properties.aggregateProperties
                  ?  ` in Aggregate Transanction [x/x]` : ''}}
              </h3>

              <div v-if="tx.properties.rejectionReason">
                <span class="clearfix bold">
                  {{ $t('Rejected-for') }}
                </span>
                <span class="clearfix  mb-2">
                  {{ tx.properties.rejectionReason }}
                </span>
              </div>

              <div v-if="!tx.properties.rejectionReason">
                <span class="clearfix bold">
                  ID
                </span>
                <span class="clearfix  mb-2">
                  {{ tx.properties.id }}
                </span>
              </div>

              <div v-if="!tx.properties.rejectionReason && !tx.properties.unconfirmed">
                <span class="clearfix bold">
                  {{ $t('Block-Number') }}
                </span>
                <span class="clearfix  mb-2">
                  {{ tx.properties.blockNumber.toLocaleString() }}
                </span>
              </div>

              <a
                :href="application.activeNode
                  ? `${application.activeNode}/transaction/${tx.properties.transactionHash}/status`
                  : '#'"
                target="_blank"
              >
                <span class="clearfix bold">
                  {{ $t('Transaction-hash') }}
                </span>
                <span class="clearfix  mb-2">
                  {{ tx.properties.transactionHash }}
                </span>
              </a>

              <span class="clearfix bold">
                {{ $t('Signer') }}
              </span>
              <span class="clearfix  mb-2">
                {{ tx.properties.signer }}
              </span>

              <div v-if="tx.properties.recipient !== ''">
                <span class="clearfix bold">
                  {{ $t('Recipient') }}
                </span>
                <span class="clearfix  mb-2">
                  {{ tx.properties.recipient }}
                </span>
              </div>

              <span class="clearfix bold">
                {{ $t('Fee') }}
              </span>
              <span class="clearfix  mb-2">
                {{ tx.properties.fee }}
              </span>

              <div
                v-for="(propValue, propKey) in tx.specificProperties.body"
                :key="propKey"
              >
              <div v-if="!(propValue instanceof Array)">
                <span class="clearfix bold">
                  {{ propKey }}
                </span>
                <span class="clearfix  mb-2">
                  {{ propValue }}
                </span>
              </div>
              <div v-if="propValue instanceof Array">
                <span class="clearfix bold">
                  {{ propKey }}
                </span>
                <!-- @TODO: make a table held in a new component -->
                <div
                  v-for="(subPropValue, subPropKey) in propValue"
                  :key="subPropKey"
                >
                  <div
                    v-for="(subPropItemValue, subItemPropKey) in subPropValue"
                    :key="subItemPropKey"
                  >
                    <span class="clearfix bold">
                      {{ subItemPropKey }}
                    </span>
                    <span class="clearfix  mb-2">
                      {{ subPropItemValue }}
                    </span>
                  </div>
                </div>
              </div>
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
      'application',
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
