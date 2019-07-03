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
          {{ $t('Lookup-another-address') }}
        </h3>
        <p class="mb-0">
          {{ $t('Need-to-check-this-address-again') }}
        </p>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="address"
          class="ma-0 pa-0"
          label="address"
          type="text"
          required
        />
        <v-text-field
          v-model="node"
          class="ma-0 pa-0"
          :label="$t('Default-node')"
          type="text"
          required
        />
        <v-select
          v-if="application.officialNodes"
          v-model="selectedOfficialNode"
          :items="application.officialNodes"
          class="ma-0 pa-0"
          :label="$t('Pick-a-node-from-the-official-list')"
          @input="afterselection"
        />
        <v-text-field
          v-model="name"
          class="ma-0 pa-0"
          :label="$t('name-leave-blank-use-address')"
          type="text"
        />
        <v-switch
          v-model="isToBeSaved"
          :label="$t('store-as-watch-only-wallet')"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          @click.stop="$emit('close')"
        >
          close
        </v-btn>
        <v-btn
          flat
          :disabled="disabledValidation"
          @click.stop="validateAddress"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { Address } from 'nem2-sdk';
import store from '../../store/index';

export default {
  name: 'WoWalletCreationDialog',
  store,
  props: {
    visible: Boolean,
  },
  data() {
    return {
      address: '',
      validAddress: false,
      name: '',
      node: this.$store.getters['wallet/GET_ACTIVE_WALLET'].node,
      disabledValidation: true,
      isToBeSaved: true,
      selectedOfficialNode: null,
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
    address: {
      handler(e) {
        try {
          const address = Address.createFromRawAddress(e);
          this.validAddress = address;
          this.disabledValidation = false;
        } catch (error) {
          this.validAddress = false;
          this.disabledValidation = true;
        }
      },
    },
    name: {
      handler(e) {
        this.disabledValidation = !(typeof e === 'string');
      },
    },
    node: {
      handler(e) {
        this.disabledValidation = !(typeof e === 'string');
      },
    },
    isToBeSaved: {
      handler(e) {
        this.disabledValidation = !(typeof e === 'boolean');
      },
    },
  },
  methods: {
    validateAddress() {
      if (this.disabledValidation || !this.validAddress) return;
      this.$store.dispatch('wallet/ADD_WATCH_ONLY_WALLET',
        {
          address: this.validAddress,
          name: this.name === '' ? this.validAddress.pretty() : this.name,
          node: this.node,
          isToBeSaved: this.isToBeSaved,
        });
      this.$emit('close');
    },
    afterselection(e) {
      if (e) this.node = e;
      this.selectedOfficialNode = [];
    },
  },
};
</script>
