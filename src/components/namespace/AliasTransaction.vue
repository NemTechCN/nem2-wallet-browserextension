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
      <v-toolbar card>
        <v-card-title primary-title>
          <h3 class="headline mb-3">
            {{ namespaceName }}
          </h3>
        </v-card-title>
        <v-spacer />
        <v-btn
          href="https://nemtech.github.io/guides/namespace/extending-a-namespace-registration-period.html"
          target="_new"
          icon
        >
          <v-icon>local_library</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          v-if="!currentAlias"
          v-model="aliasInput"
          class="ma-0 pa-0"
          label="Alias (MosaicId / Address)"
          required
        />
        <v-subheader v-if="currentAlias">
          {{ currentAlias }}
        </v-subheader>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          @click="$emit('close')"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="disabledSendTransaction
            || wallet.activeWallet.isWatchOnly"
          color="primary mx-0"
          @click="showDialog"
        >
          {{ !!currentAlias ? $t('Unlink') : $t('Link') }}
        </v-btn>
      </v-card-actions>
      <SendConfirmation
        :tx-send-data="txSendResults"
      />
    </v-card>
    <Confirmation
      v-model="isDialogShow"
      :transactions="transactions"
      :generation-hash="application.generationHashes[application.activeNode]"
      @sent="txSent"
      @error="txError"
    >
      <v-list>
        <v-list-tile
          v-for="detail in dialogDetails"
          :key="detail.key"
        >
          <v-list-tile-action>
            <v-icon>{{ detail.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ detail.key }}: {{ detail.value }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </Confirmation>
  </v-dialog>
</template>
<script>

import { mapState } from 'vuex';
import {
  NetworkType, NamespaceType, Deadline,
  AliasActionType, MosaicId, NamespaceId, AddressAliasTransaction,
  MosaicAliasTransaction, AliasType,
  Address,
} from 'nem2-sdk';

import Confirmation from '../signature/Confirmation.vue';
import SendConfirmation from '../signature/SendConfirmation.vue';

function mosaicOrAddress(input) {
  if (input.length === 16) {
    return 'mosaic';
  }
  return 'address';
}

export default {
  components: {
    Confirmation,
    SendConfirmation,
  },
  props: {
    visible: Boolean,
    namespaceName: {
      type: String,
      default: '',
    },
    currentAliasType: {
      type: Number,
      default: AliasType.None,
    },
    currentAlias: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      aliasInput: '',
      transactions: [],
      isDialogShow: false,
      dialogDetails: [],
      txSendResults: [],
    };
  },

  computed: {
    ...mapState(['application', 'wallet']),
    isSubNamespace() {
      return this.namespaceType === NamespaceType.SubNamespace;
    },
    disabledSendTransaction() {
      if (this.currentAlias) {
        return false;
      }
      return !this.aliasInput;
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
  methods: {
    showDialog() {
      const {
        namespaceName, currentAlias, currentAliasType, aliasInput,
      } = this;
      const aliasActionType = currentAliasType === AliasType.None
        ? AliasActionType.Link : AliasActionType.Unlink;

      let transaction;
      if (aliasActionType === AliasActionType.Link) {
        const input = mosaicOrAddress(aliasInput);
        if (input === 'mosaic') {
          transaction = MosaicAliasTransaction.create(
            Deadline.create(),
            aliasActionType,
            new NamespaceId(namespaceName),
            new MosaicId(aliasInput),
            NetworkType.MIJIN_TEST,
          );
        } else {
          transaction = AddressAliasTransaction.create(
            Deadline.create(),
            aliasActionType,
            new NamespaceId(namespaceName),
            Address.createFromRawAddress(aliasInput),
            NetworkType.MIJIN_TEST,
          );
        }
      } else if (currentAliasType === AliasType.Mosaic) {
        transaction = MosaicAliasTransaction.create(
          Deadline.create(),
          aliasActionType,
          new NamespaceId(namespaceName),
          new MosaicId(currentAlias),
          NetworkType.MIJIN_TEST,
        );
      } else {
        transaction = AddressAliasTransaction.create(
          Deadline.create(),
          aliasActionType,
          new NamespaceId(namespaceName),
          Address.createFromRawAddress(currentAlias),
          NetworkType.MIJIN_TEST,
        );
      }
      this.transactions = [transaction];
      this.dialogDetails = [
        {
          icon: 'add',
          key: this.$t('Alias-action-type'),
          value: this.aliasActionType === 0 ? this.$t('Link') : this.$t('Unlink'),
        },
        {
          icon: 'add',
          key: this.$t('Namespace-name'),
          value: this.namespaceName,
        },
        {
          icon: 'add',
          key: this.$t('Alias'),
          value: this.currentAlias ? this.currentAlias : this.aliasInput,
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
