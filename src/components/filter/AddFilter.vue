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
  <v-layout column>
    <v-layout column>
      <v-layout row>
        <v-flex xs3>
          <v-subheader>{{ $t('Filter-Type') }}</v-subheader>
        </v-flex>
        <v-flex xs9>
          <v-radio-group
            v-model="filterType"
            row
          >
            <v-radio
              v-for="f in filterTypes"
              :key="f.type"
              :label="f.label"
              :value="f.type"
            />
          </v-radio-group>
        </v-flex>
      </v-layout>
    </v-layout>

    <v-layout column>
      <v-layout row>
        <v-flex xs3>
          <v-subheader>Action Type</v-subheader>
        </v-flex>
        <v-flex xs9>
          <v-radio-group
            v-model="actionType"
            row
          >
            <v-radio
              v-for="p in actionTypes"
              :key="p.type"
              :label="p.label"
              :value="p.type"
            />
          </v-radio-group>
        </v-flex>
      </v-layout>
    </v-layout>

    <v-layout column>
      <v-layout row>
        <v-flex xs3>
          <v-subheader>{{ $t('Max-Fee') }}</v-subheader>
        </v-flex>
        <v-flex xs7>
          <v-text-field
            v-model="maxFee"
            class="ma-0 pa-0"
            :label="$t('Max-Fee')"
            solo
            required
          />
        </v-flex>
      </v-layout>
    </v-layout>

    <v-layout column>
      <v-layout row>
        <v-flex xs3>
          <v-subheader>{{ $t('Generation-Hash') }}</v-subheader>
        </v-flex>
        <v-flex xs7>
          <v-text-field
            v-model="generationHash"
            disabled
            class="ma-0 pa-0"
            :label="$t('Generation-Hash')"
            solo
            required
          />
        </v-flex>
      </v-layout>
    </v-layout>

    <FilterTransaction
      v-if="filterType == PropertyType.AllowAddress"
      :action-type="actionType"
      :filter-type="filterType"
      :max-fee="maxFee"
      :generation-hash="generationHash"
      @closeFilter="$emit('closeFilter')"
    />
    <FilterTransaction
      v-if="filterType == PropertyType.AllowMosaic"
      :action-type="actionType"
      :filter-type="filterType"
      :max-fee="maxFee"
      :generation-hash="generationHash"
      @closeFilter="$emit('closeFilter')"
    />
    <FilterTransaction
      v-if="filterType == PropertyType.AllowTransaction"
      :action-type="actionType"
      :filter-type="filterType"
      :max-fee="maxFee"
      :generation-hash="generationHash"
      @closeFilter="$emit('closeFilter')"
    />
  </v-layout>
</template>
<script>

import { mapState } from 'vuex';
import {
  NetworkType, RegisterNamespaceTransaction, NamespaceType, Deadline, UInt64,
  PropertyType,
} from 'nem2-sdk';
import FilterTransaction from './FilterTransaction.vue';

export default {
  components: {
    FilterTransaction,
  },
  data() {
    return {
      PropertyType,
      filterTypes: [
        { label: this.$t('Address'), type: PropertyType.AllowAddress },
        { label: this.$t('Mosaic'), type: PropertyType.AllowMosaic },
        { label: this.$t('Transaction'), type: PropertyType.AllowTransaction },
      ],
      filterType: PropertyType.AllowAddress,
      actionTypes: [
        { label: this.$t('allow'), type: 0 },
        { label: this.$t('block'), type: 0x80 },
      ],
      actionType: 0,
      maxFee: 0,
      isDialogShow: false,
      txSendResults: [],
      currentGenerationHash: '',
    };
  },
  computed: {
    ...mapState(['application']),
    isSubNamespace() {
      return this.namespaceType === NamespaceType.SubNamespace;
    },
    disabledSendTransaction() {
      if (this.namespaceType === NamespaceType.RootNamespace) {
        return this.namespaceName === '' || this.duration === 0;
      }
      return this.namespaceName === '' || this.parentNamespaceName === '';
    },
    generationHash: {
      get() {
        return this.application.generationHashes[this.application.activeNode];
      },
      set(value) {
        this.currentGenerationHash = value;
      },
    },
  },
  methods: {
    showDialog() {
      const { duration } = this;
      const { namespaceName, parentNamespaceName } = this;
      let registerNamespaceTransaction;
      switch (this.namespaceType) {
      case NamespaceType.RootNamespace:
        registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
          Deadline.create(),
          namespaceName,
          UInt64.fromUint(duration),
          NetworkType.MIJIN_TEST,
        );
        break;
      case NamespaceType.SubNamespace:
        registerNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
          Deadline.create(),
          namespaceName,
          parentNamespaceName,
          NetworkType.MIJIN_TEST,
        );
        break;
      default:
        return;
      }
      this.transactions = [registerNamespaceTransaction];
      this.dialogDetails = [
        {
          icon: 'add',
          key: this.$t('Namespace-Type'),
          value: this.namespaceType === 0 ? 'RootNamespace' : 'SubNamespace',
        },
        {
          icon: 'add',
          key: this.$t('Namespace-name'),
          value: this.namespaceType === 0
            ? this.namespaceName : (`${this.parentNamespaceName}.${this.namespaceName}`),
        },
        {
          icon: 'add',
          key: this.$t('Duration'),
          value: this.duration,
        },
      ];
      this.isDialogShow = true;
    },
    txSent(result) {
      this.txSendResults.push(result);
    },
    txError(error) {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  },
};
</script>
