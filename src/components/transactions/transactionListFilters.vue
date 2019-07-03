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
    max-width="515"
  >
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-3">
          {{ $t('Transaction-filters') }}
        </h3>
      </v-card-title>
      <v-card-text>
        <template
          v-for="(val, key) in txCategories"
        >
          <h4 :key="`txFilterCategory_${key}`">
            {{ key }}
          </h4>
          <div
            v-for="typeid in txCategories[key]"
            :key="typeid"
          >
            <v-switch
              v-model="transactions.transactionTypesFilters[
                txFilterNameFromName(txTypeNameFromTypeId(typeid))]"
              :label="txTypeNameFromTypeId(typeid)"
              @click.stop="updateTxFilterProp(
                txFilterNameFromName(txTypeNameFromTypeId(typeid)))"
            />
          </div>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="info"
          @click.stop="show=false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import store from '../../store/index';
import { txCategories, txTypeNameFromTypeId, txFilterNameFromName } from '../../infrastructure/transactions/transactions-types';

export default {
  name: 'TransactionListFilters',
  store,
  props: {
    visible: Boolean,
  },
  data() {
    return {
      txCategories,
      txTypeNameFromTypeId,
      txFilterNameFromName,
    };
  },
  computed: {
    ...mapState([
      'transactions',
      'application',
    ]),
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
  methods: {
    updateTxFilterProp(prop) {
      this.$store.dispatch(
        'transactions/TOGGLE_TRANSACTION_TYPES_FILTERS', prop,
      );
    },
  },
};
</script>
