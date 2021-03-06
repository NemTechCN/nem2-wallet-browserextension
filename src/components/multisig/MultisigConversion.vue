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
    row
    pb-2
    mt-4
  >
    <v-container
      fluid
      pa-0
      ma-0
    >
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
        <v-flex
          v-if="!multisig.loading_getMultisigInfo"
          xs12
        >
          <v-card>
            <v-card-text>
              <v-text-field
                v-model="minApprovalDelta"
                error-count="1"
                :label="$t('min-approval')"
                type="number"
                required
                number
              />
              <v-text-field
                v-model="minRemovalDelta"
                class="ma-0 pa-0"
                :label="$t('min-removal')"
                type="number"
                required
                number
              />
              <v-text-field
                v-model="maxFee"
                :label="$t('Max-Fee')"
              />
              <v-text-field
                v-model="generationHash"
                class="ma-0 pa-0"
                :label="$t('Generation-Hash')"
                disabled
                required
              />
              <v-text-field
                v-model="currentPublicKey"
                :label="$t('New-cosignatory-s-public-key')"
              />

              <p class="text-xs-right">
                <v-btn
                  :disabled="currentPublicKey === ''"
                  color="primary"
                  align-end
                  @click="addPublicKey"
                >
                  {{ $t('Add-cosignatory') }}
                </v-btn>
              </p>

              <v-list two-line>
                <v-list-tile
                  v-for="(publicKey, index) in publicKeyList"
                  :key="index"
                >
                  <v-list-tile-action>
                    <v-icon>style</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    {{ $t('Cosignatory-s-public-key') }}:{{ index + 1 }}
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

              <v-card-actions>
                <v-spacer />
                <v-btn
                  :disabled="!wallet.activeWallet.walletType === walletTypes.WATCH_ONLY_WALLET"
                  @click="showDialog"
                >
                  {{ $t('Send-Transaction') }}
                </v-btn>
              </v-card-actions>
              <SendConfirmation :tx-send-data="txSendResults" />
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <Confirmation
      v-model="isDialogShow"
      :transactions="transactions"
      :generation-hash="generationHash"
      :transaction-type="TransactionType.AGGREGATE_BONDED"
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
    <PasswordInput
      :visible="showPasswordInput"
      :wallet-name="wallet.activeWallet.name"
      :wallet-type="wallet.activeWallet.walletType"
      @close="showPasswordInput = false"
    />
    <v-dialog
      v-model="isShowErrorMessage"
      width="500"
    >
      <ErrorMessageComponent
        :error-message="errorMessage"
        @hideErrorMessage="hideErrorMessage"
      />
    </v-dialog>
  </v-layout>
</template>

<script>

import {
  ModifyMultisigAccountTransaction,
  MultisigCosignatoryModification,
  MultisigCosignatoryModificationType,
  NetworkType,
  Deadline,
  PublicAccount,
  TransactionType,
  AggregateTransaction,
  HashLockTransaction,
  NetworkCurrencyMosaic,
  UInt64,
} from 'nem2-sdk';
import { mapState } from 'vuex';
import ErrorMessage from '../../infrastructure/errorMessage/error-message';
import { walletTypes } from '../../infrastructure/wallet/wallet-types';

import PasswordInput from '../wallet/PasswordInput.vue';
import ErrorMessageComponent from '../errorMessage/ErrorMessage.vue';
import Confirmation from '../signature/Confirmation.vue';
import SendConfirmation from '../signature/SendConfirmation.vue';

const multisigCoversionValidator = (pointer) => {
  const {
    minApprovalDelta, minRemovalDelta, txMaxFee, generationHash, publicKeyList,
  } = pointer;
  const errorMessage = {
    message: [],
    disabled: true,
  };
  if (minApprovalDelta < 0) {
    errorMessage.message.push(ErrorMessage.MIN_APPROVAL_ERROR);
    return errorMessage;
  }
  if (minRemovalDelta < 0) {
    errorMessage.message.push(ErrorMessage.MIN_REMOVAL_ERROR);
    return errorMessage;
  }
  if (txMaxFee < 0) {
    errorMessage.message.push(ErrorMessage.MAX_FEE_ERROR);
    return errorMessage;
  }
  if (!generationHash || generationHash.trim() === '') {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_NULL);
    return errorMessage;
  }
  if (generationHash.length !== 64) {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_ERROR);
    return errorMessage;
  }
  if (publicKeyList.length === 0) {
    errorMessage.message.push(ErrorMessage.NO_COSIGNER);
    return errorMessage;
  }
  const publickeyFlag = publicKeyList.every((item) => {
    if (item.trim().length !== 64) {
      errorMessage.message.push(ErrorMessage.PUBLIC_KEY_ERROR);
      return false;
    }
    return true;
  });
  errorMessage.disabled = !publickeyFlag;
  return errorMessage;
};


export default {
  name: 'AssetCreation',
  components: {
    PasswordInput,
    ErrorMessageComponent,
    Confirmation,
    SendConfirmation,
  },
  data() {
    return {
      walletTypes,
      TransactionType,
      currentPublicKey: '',
      publicKeyList: [],
      showPasswordInput: false,
      isDialogShow: false,
      isShowErrorMessage: false,
      txSendResults: [],
      dialogDetails: [],
      transactions: [],
      minApprovalDelta: 1,
      minRemovalDelta: 1,
      maxFee: 0,
      currentGenerationHash: '',
      errorMessage: {},
    };
  },
  computed: {
    ...mapState([
      'wallet',
      'application',
      'assets',
      'multisig',
    ]),
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
    addPublicKey() {
      if (this.publicKeyList.length <= 10) {
        this.publicKeyList.push(this.currentPublicKey);
        this.currentPublicKey = '';
      } else {
        this.errorMessage.push(ErrorMessage.TOO_MUCH_COSIGNER);
      }
    },


    checkForm() {
      this.errorMessage = multisigCoversionValidator(this);
      if (this.errorMessage.disabled) {
        this.isShowErrorMessage = true;
        return false;
      }
      return true;
    },


    showDialog() {
      if (this.wallet.activeWallet.isWatchOnly) {
        this.showPasswordInput = true;
        return;
      }

      if (!this.checkForm()) {
        this.isShowErrorMessage = true;
        return;
      }

      const { account } = this.wallet.activeWallet;
      const { minApprovalDelta, minRemovalDelta, publicKeyList } = this;
      const networkType = NetworkType.MIJIN_TEST;
      const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
        Deadline.create(),
        minApprovalDelta,
        minRemovalDelta,
        publicKeyList.map(cosigner => new MultisigCosignatoryModification(
          MultisigCosignatoryModificationType.Add,
          PublicAccount.createFromPublicKey(cosigner, networkType),
        )),
        networkType,
      );
      const aggregateTransaction = AggregateTransaction.createBonded(
        Deadline.create(),
        [modifyMultisigAccountTransaction.toAggregate(account.publicAccount)],
        NetworkType.MIJIN_TEST,
      );

      const signedTransaction = account.sign(aggregateTransaction, this.generationHash);
      const hashLockTransaction = HashLockTransaction.create(
        Deadline.create(),
        NetworkCurrencyMosaic.createRelative(10),
        UInt64.fromUint(480),
        signedTransaction,
        NetworkType.MIJIN_TEST,
      );
      this.transactions = [hashLockTransaction, aggregateTransaction];
      this.dialogDetails = [
        {
          icon: 'add',
          key: this.$t('min-approval'),
          value: this.minApprovalDelta,
        },
        {
          icon: 'add',
          key: this.$t('min-removal'),
          value: this.minRemovalDelta,
        },
        {
          icon: 'add',
          key: this.$t('Max-Fee'),
          value: this.maxFee,
        },
        {
          icon: 'add',
          key: this.$t('cosignatory-list'),
          value: '',
        },
      ];
      this.isDialogShow = true;
    },
    removeCosignatory(index) {
      this.publicKeyList.splice(index, 1);
    },
    hideErrorMessage() {
      this.isShowErrorMessage = false;
    },
    txSent(result) {
      this.isDialogShow = false;
      this.txSendResults.push(result);
    },
    txError(error) {
      this.isDialogShow = false;
      // eslint-disable-next-line no-console
      console.error(error);
    },
  },
};
</script>
