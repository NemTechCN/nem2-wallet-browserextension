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

      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <v-radio-group
            v-model="cosignType"
            row
          >
            <template v-slot:label>
              <div>{{ $t('Get-transactions-cosigned-by') }}: </div>
            </template>
            <v-radio
              v-for="l in cosignTypes"
              :key="l.type"
              :label="l.label"
              :value="l.type"
            />
          </v-radio-group>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex
          v-if="cosignType == CosignTypes.MULTISIG_ACCOUNT"
          xs12
        >
          <v-select
            v-model="currentMultisigPublicKey"
            :label="$t('Multisig-Account-Public-Key')"
            :items="multisig.multisigInfo[wallet.activeWallet.name]
              .multisigAccounts"
            item-text="publicKey"
          />
        </v-flex>
        <v-flex
          v-if="cosignType == CosignTypes.INPUT"
          xs12
        >
          <v-text-field
            v-model="currentInputPublicKey"
            class="ma-0 pa-0"
            :label="$t('Public-Key')"
            required
          />
        </v-flex>
      </v-layout>
      <div>
        <v-btn
          color="primary"
          @click="getCosignTransactions"
        >
          {{ $t('Get-transactions') }}
        </v-btn>
      </div>
      <div v-if="aggregatedTx.length > 0">
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <div class="monospaced">
                <div class="clearfix homeLine">
                  <div
                    v-for="(item, num) in aggregatedTx"
                    :key="num"
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
                    <v-btn @click="cosignTransaction(num)">
                      {{ $t('Cosign-this-transaction') }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </div>

      <div v-else>
        <v-card v-show="isShowResult">
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
import Confirmation from '../signature/Confirmation.vue';
import SendConfirmation from '../signature/SendConfirmation.vue';

const CosignTypes = {
  MULTISIG_ACCOUNT: 0,
  INPUT: 1,
};
export default {
  name: 'MultisigTransactions',
  components: {
    SendConfirmation,
    Confirmation,
  },
  data() {
    return {
      txSendResults: [],
      transactions: [],
      isDialogShow: false,
      isShowResult: false,
      CosignTypes,
      currentInputPublicKey: '9C08CF57D9988C4F22DCA406B9A5AE8F877313076BAC0994FD6595D03BC1A093',
      currentMultisigPublicKey: '',
      activeWallet: this.$store.getters['wallet/GET_ACTIVE_WALLET'],
      aggregatedTx: [],
      publicKey: '',
      cosignType: CosignTypes.MULTISIG_ACCOUNT,
      cosignTypes: [
        {
          label: 'multisig accounts',
          type: CosignTypes.MULTISIG_ACCOUNT,
        }, {
          label: 'public key',
          type: CosignTypes.INPUT,
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
  methods: {
    cosignTransaction(index) {
      this.isDialogShow = true;
      this.dialogDetails = [
        {
          icon: 'add',
          key: 'Generation Hash',
          value: this.generationHash,
        },
      ];
      this.transactions = [this.aggregatedTx[index]];
      this.getCosignTransactions();
    },
    async getCosignTransactions() {
      if (this.cosignType === CosignTypes.MULTISIG_ACCOUNT) {
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
