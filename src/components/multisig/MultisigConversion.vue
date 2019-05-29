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

<template>
  <v-layout
    column
    class="mt-2 mb-3"
  >
    <v-container>
      <v-layout
        row
        wrap
      >
        <v-flex
          v-if="multisig.loading_getMultisigInfo"
          xs12
        >
          <v-progress-linear
            :indeterminate="true"
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="minApprovalDelta"
            error-count="1"
            label="Min approval"
            type="number"
            required
            number
          />
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs12>
          <v-text-field
            v-model="minRemovalDelta"
            class="ma-0 pa-0"
            label="Min removal"
            type="number"
            required
            number
          />
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="maxFee"
            class="ma-0 pa-0"
            label="Max Fee"
            required
          />
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex
          sm
        >
          <v-layout row>
            <v-flex xs10>
              <v-text-field
                v-model="currentPublicKey"
                label="New consignatory's public key"
                solo
              />
            </v-flex>

            <v-flex xs2>
              <v-btn
                :disabled="currentPublicKey == ''"
                color="primary"
                @click="addPublicKey"
              >
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>


          <template v-for="(publicKey, index) in publicKeyList">
            <v-list
              :key="index"
              two-line
            >
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>style</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  Cosignatory Publickey:{{ index + 1 }}
                  <br>
                  {{ publicKey }}
                </v-list-tile-content>
                <v-btn
                  fab
                  small
                  color="error"
                  @click="removeCosignatory(index)"
                >
                  <v-icon>remove</v-icon>
                </v-btn>
              </v-list-tile>
            </v-list>
          </template>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-layout
          v-if="!multisig.loading_getMultisigInfo
            && multisig.multisigInfo[wallet.activeWallet.name]"
          row
          justify-space-around
          align-center
        >
          <v-btn
            :disabled="!(typeof multisig
              .multisigInfo[wallet.activeWallet.name].account === 'undefined'
              || !multisig.multisigInfo[wallet.activeWallet.name].isMultisig())"
            @click="showDialog"
          >
            Send Transaction
          </v-btn>
        </v-layout>

        <Confirmation
          v-model="isDialogShow"
          :transactions="transactions"
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

            <v-list-tile
              v-for="(publicKey,index) in publicKeyList"
              :key="index"
            >
              <v-list-tile-action>
                <v-icon />
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ publicKey }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </Confirmation>
      </v-layout>

      <v-layout column>
        <SendConfirmation
          :tx-send-data="txSendResults"
        />
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>

import { mapState } from 'vuex';
import {
  ModifyMultisigAccountTransaction,
  MultisigCosignatoryModification,
  MultisigCosignatoryModificationType,
  NetworkType,
  Deadline,
  PublicAccount,
} from 'nem2-sdk';
import Confirmation from '../Confirmation.vue';
import SendConfirmation from './SendConfirmation.vue';

export default {
  name: 'AssetCreation',
  components: {
    Confirmation,
    SendConfirmation,
  },
  data() {
    return {
      currentPublicKey: '',
      publicKeyList: [],
      isDialogShow: false,
      txSendResults: [],
      dialogDetails: [],
      transactions: [],
      minApprovalDelta: 1,
      minRemovalDelta: 1,
      maxFee: 0,
    };
  },
  computed: mapState(['multisig', 'wallet']),
  methods: {
    addPublicKey() {
      if (this.publicKeyList.length <= 10) {
        this.publicKeyList.push(this.currentPublicKey);
        this.currentPublicKey = '';
      } else {
        // eslint-disable-next-line no-console
        console.log('multisig accounts can have up to 10 cosignatories.');
      }
    },
    showDialog() {
      const { minApprovalDelta, minRemovalDelta, publicKeyList } = this;
      const networkType = NetworkType.MIJIN_TEST;

      const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
        Deadline.create(),
        minApprovalDelta,
        minRemovalDelta,
        publicKeyList.map(co => new MultisigCosignatoryModification(
          MultisigCosignatoryModificationType.Add,
          PublicAccount.createFromPublicKey(co, networkType),
        )),
        networkType,
      );
      this.transactions = [modifyMultisigAccountTransaction];
      this.dialogDetails = [
        this.dialogDetails,
        ...{
          icon: 'add',
          key: 'Min Approval',
          value: this.minApprovalDelta,
        },
        {
          icon: 'add',
          key: 'Min Removal',
          value: this.minRemovalDelta,
        },
        {
          icon: 'add',
          key: 'Max Fee',
          value: this.maxFee,
        },
        {
          icon: 'add',
          key: 'Cosignatory List',
          value: '',
        },
      ];
      this.isDialogShow = true;
    },
    removeCosignatory(index) {
      this.publicKeyList.splice(index, 1);
    },
    txSent(result) {
      this.txSendResults.push({
        txHash: result.txHash,
        nodeURL: result.nodeURL,
      });
    },
    txError(error) {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  },
};

</script>