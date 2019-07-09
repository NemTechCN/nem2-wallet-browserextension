<template>
  <v-layout
    column
    class="mt-2"
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
          <v-progress-linear :indeterminate="true" />
        </v-flex>
      </v-layout>

      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <v-radio-group
            v-model="publicKeyInputMode"
          >
            <template v-slot:label>
              <div>{{ $t('Get-transactions-cosigned-by') }}: </div>
            </template>
            <v-radio
              v-for="l in publicKeyInputModes"
              :key="l.type"
              :label="l.label"
              :value="l.type"
            />
          </v-radio-group>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex
          v-if="publicKeyInputMode == PublicKeyInputModes.MULTISIG_ACCOUNT_LIST"
          xs12
        >
          <v-select
            v-if="multisig.multisigInfo[wallet.activeWallet.name]
              && multisig.multisigInfo[wallet.activeWallet.name]
                .multisigAccounts.length > 0"
            v-model="currentMultisigPublicKey"
            :label="$t('Multisig-Account-Public-Key')"
            :items="multisig.multisigInfo[wallet.activeWallet.name]
              .multisigAccounts"
            item-text="publicKey"
          />
          <p
            v-if="!multisig.multisigInfo[wallet.activeWallet.name]
              || multisig.multisigInfo[wallet.activeWallet.name]
                .multisigAccounts.length === 0"
          >
            {{ $t('this-account-does-not-own-any-multisig-account') }}
          </p>
          <p
            v-if="multisig.multisigInfo[wallet.activeWallet.name]
              && multisig.multisigInfo[wallet.activeWallet.name]
                .multisigAccounts.length > 0"
            class="text-xs-right mt-3"
          >
            <v-btn
              :disabled="currentMultisigPublicKey === ''"
              @click="getCosignTransactions"
            >
              {{ $t('Get-transactions') }}
            </v-btn>
          </p>
        </v-flex>


        <v-flex
          v-if="publicKeyInputMode == PublicKeyInputModes.MANUAL_INPUT"
          xs12
        >
          <v-text-field
            v-model="currentInputPublicKey"
            class="ma-0 pa-0"
            :label="$t('Public-Key')"
            required
          />
          <p class="text-xs-right mt-3">
            <v-btn
              :disabled="!validPublicKey"
              @click="getCosignTransactions"
            >
              {{ $t('Get-transactions') }}
            </v-btn>
          </p>
        </v-flex>
      </v-layout>

      <!-- @TODO: Use Transactions component to display transactions to sign  -->
      <div v-if="aggregatedTx.length > 0">
        <v-flex xs12>
          <v-card class="mt-4">
            <v-card-title>
              <div
                v-for="(item, num) in aggregatedTx"
                :key="num"
                class="clearfix homeLine monospaced"
                style="word-break: break-word;"
              >
                <div class="clearfix">
                  {{ $t('Transaction-hash') }}: <br> {{ item.transactionInfo.hash }}
                </div>
                <div>{{ $t('Deadline') }}:<br>{{ item.deadline.value }}</div>
                <div>{{ $t('Network-Type') }}:<br>{{ item.networkType }}</div>
                <div>{{ $t('Signature') }}:<br>{{ item.signature }}</div>
                <div>{{ $t('Signer') }}:<br>{{ item.signer.publicKey }}</div>
                <div
                  v-for="(i,index) in item.innerTransactions"
                  :key="index"
                >
                  {{ $t('Inner-transactions') }} {{ index + 1 }} :<br>
                  <div>{{ $t('Inner-transaction-Id') }}:<br>{{ i.transactionInfo.id }}</div>
                  <div>
                    {{ $t('inner-Transactions-aggregateHash') }}:
                    <br>
                    {{ i.transactionInfo.aggregateHash }}
                  </div>
                </div>
                <p class="text-xs-right mt-3">
                  <v-btn
                    :disabled="!wallet.activeWallet.walletType === walletTypes.WATCH_ONLY_WALLET"
                    @click="cosignTransaction(num)"
                  >
                    {{ $t('Cosign-this-transaction') }}
                  </v-btn>
                </p>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </div>

      <div v-else>
        <v-card
          v-show="isShowResult"
          class="mt-4"
        >
          <v-card-title primary-title>
            <div class="monospaced">
              <div class="clearfix homeLine">
                {{ $t('No-transactions-are-waiting-for-being-cosigned') }}
              </div>
            </div>
          </v-card-title>
        </v-card>
      </div>
    </v-container>
    <PasswordInput
      :visible="showPasswordInput"
      :wallet-name="wallet.activeWallet.name"
      :wallet-type="wallet.activeWallet.walletType"
      @close="showPasswordInput = false"
    />
    <Confirmation
      v-model="isDialogShow"
      :transactions="transactions"
      :is-cosign="true"
      :generation-hash="generationHash"
      @sent="txSent"
      @error="txError"
    />
    <SendConfirmation
      :tx-send-data="txSendResults"
    />
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';
import {
  PublicAccount,
  AccountHttp,
  NetworkType,
} from 'nem2-sdk';
import { walletTypes } from '../../infrastructure/wallet/wallet-types';

import PasswordInput from '../wallet/PasswordInput.vue';
import Confirmation from '../signature/Confirmation.vue';
import SendConfirmation from '../signature/SendConfirmation.vue';

const PublicKeyInputModes = {
  MULTISIG_ACCOUNT_LIST: 0,
  MANUAL_INPUT: 1,
};

export default {
  name: 'MultisigTransactions',
  components: {
    PasswordInput,
    Confirmation,
    SendConfirmation,
  },
  data() {
    return {
      walletTypes,
      txSendResults: [],
      transactions: [],
      showPasswordInput: false,
      isDialogShow: false,
      isShowResult: false,
      PublicKeyInputModes,
      currentInputPublicKey: '',
      currentMultisigPublicKey: '',
      activeWallet: this.$store.getters['wallet/GET_ACTIVE_WALLET'],
      aggregatedTx: [],
      publicKey: '',
      validPublicKey: false,
      publicKeyInputMode: PublicKeyInputModes.MULTISIG_ACCOUNT_LIST,
      publicKeyInputModes: [
        {
          label: 'Wallet-multisig-accounts',
          type: PublicKeyInputModes.MULTISIG_ACCOUNT_LIST,
        }, {
          label: 'public key',
          type: PublicKeyInputModes.MANUAL_INPUT,
        },
      ],
    };
  },
  computed: {
    ...mapState([
      'wallet',
      'application',
      'multisig',
    ], {
      wallet: state => state.wallet,
    }),
    generationHash: {
      get() {
        return this.application.generationHashes[this.application.activeNode];
      },
    },
  },


  watch: {
    currentInputPublicKey: {
      handler(key) {
        try {
          PublicAccount.createFromPublicKey(
            key, NetworkType.MIJIN_TEST,
          );
          this.validPublicKey = true;
        } catch (error) {
          this.validPublicKey = false;
        }
      },
    },
  },


  methods: {
    cosignTransaction(index) {
      if (this.wallet.activeWallet.isWatchOnly) {
        this.showPasswordInput = true;
        return;
      }

      this.isDialogShow = true;
      this.dialogDetails = [
        {
          icon: 'add',
          key: this.$t('Generation-Hash'),
          value: this.generationHash,
        },
      ];
      this.transactions = [this.aggregatedTx[index]];
      this.getCosignTransactions();
    },


    async getCosignTransactions() {
      // @TODO: fetch automatically and store at store level
      if (this.publicKeyInputMode === PublicKeyInputModes.MULTISIG_ACCOUNT_LIST) {
        this.publicKey = this.currentMultisigPublicKey;
      } else {
        this.publicKey = this.currentInputPublicKey;
      }

      const accountHttp = new AccountHttp(this.application.activeNode);
      const publicAccount = PublicAccount.createFromPublicKey(
        this.publicKey, NetworkType.MIJIN_TEST,
      );
      this.aggregatedTx = await accountHttp.aggregateBondedTransactions(publicAccount).toPromise();
      // eslint-disable-next-line no-console
      console.log(this.aggregatedTx);
      this.isShowResult = true;
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
