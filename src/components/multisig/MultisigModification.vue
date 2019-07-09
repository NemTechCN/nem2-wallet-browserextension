<template>
  <v-layout
    column
    class="mt-2 mb-3"
  >
    <v-container
      v-if="!multisig.multisigInfo[wallet.activeWallet.name]
        || !multisig.multisigInfo[wallet.activeWallet.name].multisigAccounts"
    >
      {{ $t('This-account-does-not-own-any-multisig-to-modify') }}
    </v-container>
    <v-container
      v-if="multisig.multisigInfo[wallet.activeWallet.name]
        && multisig.multisigInfo[wallet.activeWallet.name].multisigAccounts"
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
      </v-layout>
      <v-layout
        v-if="!multisig.loading_getMultisigInfo
          && multisig.multisigInfo[wallet.activeWallet.name]"
        row
      >
        <v-flex xs12>
          <v-select
            v-model="currentMultisigPublicKey"
            :label="$t('Multisig-Account-Public-Key')"
            :items="multisig.multisigInfo[wallet.activeWallet.name].multisigAccounts"
            item-text="publicKey"
            solo
          />
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs12>
          <v-text-field
            v-model="approvalDelta"
            :label="$t('Approval-Delta')"
            type="number"
            required
            number
            class="ma-0 pa-0"
          />
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs12>
          <v-text-field
            v-model="removalDelta"
            :label="$t('Removal-Delta')"
            type="number"
            required
            number
            class="ma-0 pa-0"
          />
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs12>
          <v-text-field
            v-model="maxFee"
            class="ma-0 pa-0"
            :label="$t('Max-Fee')"
            type="number"
            required
            number
          />
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs12>
          <v-text-field
            v-model="generationHash"
            class="ma-0 pa-0"
            :label="$t('Generation-Hash')"
            required
          />
        </v-flex>
      </v-layout>

      <!--      <v-layout-->
      <!--              v-if="showLockFunds"-->
      <!--              row-->
      <!--      >-->
      <!--        <v-flex xs12>-->
      <!--          <v-subheader>Lock Funds Transacion</v-subheader>-->
      <!--        </v-flex>-->
      <!--      </v-layout>-->
      <!--      <v-layout-->
      <!--              v-if="showLockFunds"-->
      <!--              row-->
      <!--      >-->
      <!--        <v-flex xs6>-->
      <!--          <v-text-field-->
      <!--                  v-model="lockFundsMosaicType"-->
      <!--                  class="ma-0 pa-0"-->
      <!--                  required-->
      <!--                  disabled-->
      <!--          />-->
      <!--        </v-flex>-->
      <!--        <v-flex xs6>-->
      <!--          <v-text-field-->
      <!--                  v-model="lockFundsMosaicAmount"-->
      <!--                  class="ma-0 pa-0"-->
      <!--                  type="number"-->
      <!--                  required-->
      <!--                  disabled-->
      <!--                  number-->
      <!--          />-->
      <!--        </v-flex>-->
      <!--      </v-layout>-->
      <!--      <v-layout v-if="showLockFunds">-->
      <!--        <v-flex xs12>-->
      <!--          <v-text-field-->
      <!--                  v-model="lockFundsDuration"-->
      <!--                  label="Lock Funds Duration In Blocks"-->
      <!--                  class="ma-0 pa-0"-->
      <!--                  type="number"-->
      <!--                  required-->
      <!--                  number-->
      <!--          />-->
      <!--        </v-flex>-->
      <!--      </v-layout>-->
      <!--      <v-layout v-if="showLockFunds">-->
      <!--        <v-flex xs12>-->
      <!--          <v-text-field-->
      <!--                  v-model="lockFundsMaxFee"-->
      <!--                  label="Lock Funds Max Fee"-->
      <!--                  class="ma-0 pa-0"-->
      <!--                  type="number"-->
      <!--                  required-->
      <!--                  number-->
      <!--          />-->
      <!--        </v-flex>-->
      <!--      </v-layout>-->

      <v-layout>
        <v-flex sm>
          <v-layout row>
            <v-flex offset-xs1>
              <v-btn
                dark
                :color="isRemove ? 'red' : 'primary'"
                @click="isRemove = !isRemove"
              >
                {{ isRemove? $t('Remove') : $t('Add') }}
                <v-icon
                  dark
                  right
                >
                  {{ isRemove ? 'remove_circle_outline' : 'add_circle_outline' }}
                </v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                v-model="currentCosignatoryPublicKey"
                :placeholder="$t('Input-cosignatory-publickey')"
                solo
              />
            </v-flex>
            <v-flex xs3>
              <v-btn
                :disabled="currentCosignatoryPublicKey === ''"
                color="primary"
                @click="addCosignatory"
              >
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <template v-for="(cosignatory, index) in cosignatoryList">
            <v-list
              :key="index"
              two-line
            >
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>style</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-subheader>
                    {{ cosignatory.modificationType === MultisigCosignatoryModificationType.Add
                      ? $t('Add') : $t('Remove') }}
                  </v-subheader>
                  {{ $t('Cosignatory-s-public-key') }}:
                  {{ cosignatory.cosignatoryPublicKey }}
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
          row
          justify-center
          align-center
        >
          <v-btn
            :disabled="disabledSendLockFundsTransaction"
            @click="showDialog"
          >
            send
          </v-btn>
        </v-layout>

        <Confirmation
          v-model="isDialogShow"
          :transactions="transactions"
          :transaction-type="transactionType"
          :generation-hash="generationHash"
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

            <v-list-tile>
              {{ $t('cosignatory-list') }}：
            </v-list-tile>
            <v-list-tile
              v-for="(cosignatory,index) in cosignatoryList"
              :key="index"
            >
              <v-list-tile-action>
                <v-icon>add</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ cosignatory.modificationType === MultisigCosignatoryModificationType.Add
                    ? $t('Add'): $t('Remove') }}:
                  {{ cosignatory.cosignatoryPublicKey }}
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
    </v-container>
  </v-layout>
</template>

<script>

import { mapState } from 'vuex';
import {
  ModifyMultisigAccountTransaction,
  MultisigCosignatoryModificationType,
  NetworkType,
  Deadline,
  PublicAccount,
  AggregateTransaction,
  TransactionType,
  MultisigCosignatoryModification,
  AccountHttp,
  Address, HashLockTransaction,
  NetworkCurrencyMosaic,
  UInt64,
} from 'nem2-sdk';
import ErrorMessage from '../../infrastructure/errorMessage/error-message';

import PasswordInput from '../wallet/PasswordInput.vue';
import Confirmation from '../signature/Confirmation.vue';
import SendConfirmation from '../signature/SendConfirmation.vue';
import ErrorMessageComponent from '../errorMessage/ErrorMessage.vue';

const multisigModifyValidator = (pointer) => {
  const {
    currentMultisigAccount, cosignatoryDeleteList, cosignatoryAddList,
    removalDelta, approvalDelta, maxFee, generationHash, cosignatoryList,
  } = pointer;
  const { multisigAccounts } = pointer.multisig.multisigInfo[pointer.wallet.activeWallet.name];
  const addAmount = cosignatoryAddList.length;
  const deleteAmount = cosignatoryDeleteList.length;
  const cosignerAmount = multisigAccounts.length;
  const removalResult = removalDelta + currentMultisigAccount.minRemoval;
  const approvalResult = approvalDelta + currentMultisigAccount.minApproval;
  const cosignerResult = addAmount + cosignerAmount - deleteAmount;
  /* eslint-disable */
  let errorMessage = {
    message: [],
    disabled: true,
  };
  if (!currentMultisigAccount) {
    errorMessage.message.push(ErrorMessage.PUBLIC_KEY_ERROR);
    return errorMessage;
  }
  if (removalResult <= 0) {
    errorMessage.message.push(ErrorMessage.REMOVAL_TOO_SMALL);
    return false;
  }
  if (approvalResult <= 0) {
    errorMessage.message.push(ErrorMessage.APPROVAL_TOO_SMALL);
    return false;
  }
  if (removalResult >= 10) {
    errorMessage.message.push(ErrorMessage.REMOVAL_TOO_BIG);
    return false;
  }
  if (approvalResult <= 0) {
    errorMessage.message.push(ErrorMessage.APPROVAL_TOO_BIG);
    return false;
  }
  if (Number(maxFee) < 0) {
    errorMessage.message.push(ErrorMessage.MAX_FEE_ERROR);
    return false;
  }
  if (!generationHash || generationHash.trim().length !== 64) {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_NULL);
    return errorMessage;
  }
  if (generationHash.length !== 64) {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_ERROR);
    return errorMessage;
  }
  if (cosignerResult < 0) {
    errorMessage.message.push(ErrorMessage.TOO_LESS_COSIGNERS);
    return errorMessage;
  }
  if (cosignerResult > 10) {
    errorMessage.message.push(ErrorMessage.TOO_MANY_COSIGNERS);
    return errorMessage;
  }
  console.log(cosignatoryList);
  const publickeyFlag = cosignatoryList.every((item) => {
    if (item.cosignatoryPublicKey.trim().length !== 64) {
      errorMessage.message.push(ErrorMessage.PUBLIC_KEY_ERROR);
      return false;
    }
    return true;
  });
  errorMessage.disabled = publickeyFlag ? false : true;
  return errorMessage;
};

export default {
  name: 'ModifyMultisig',
  components: {
    PasswordInput,
    Confirmation,
    SendConfirmation,
    ErrorMessageComponent,
  },
  data() {
    return {
      MultisigCosignatoryModificationType,
      showPasswordInput: false,
      isShowErrorMessage:false,
      errorMessage: {},
      transactionType: -1,
      showLockFunds: true,
      currentMultisigPublicKey: '',
      currentMultisigAccount: '',
      removalDelta: 0,
      approvalDelta: 0,
      isRemove: false,
      currentCosignatoryPublicKey: '',
      cosignatoryList: [],
      cosignatoryAddList: [],
      cosignatoryDeleteList: [],
      maxFee: 0,
      lockFundsMosaicType: '@cat.currency',
      lockFundsMosaicAmount: 10000000,
      lockFundsDuration: 480,
      lockFundsMaxFee: 0,
      isDialogShow: false,
      transactions: [],
      dialogDetails: [],
      disabledSendLockFundsTransaction: false,
      disabledSendAggregateTransaction: true,
      txSendResults: [],
      activeWallet: this.$store.getters['wallet/GET_ACTIVE_WALLET'],
      aggregateTx: {},
      currentGenerationHash: '',
    };
  },
  computed: {
    ...mapState([
      'wallet',
      'multisig',
      'application',
    ], {
      wallet: state => state.wallet,
    }),
    generationHash: {
      get() {
        return this.application.generationHashes[this.application.activeNode];
      },
      set(value) {
        this.currentGenerationHash = value;
      },
    },
  },
  watch: {
    async currentMultisigPublicKey() {
      const accountHttp = new AccountHttp(this.application.activeNode);
      this.currentMultisigAccount = await accountHttp
        .getMultisigAccountInfo(Address.createFromPublicKey(
          this.currentMultisigPublicKey, NetworkType.MIJIN_TEST,
        )).toPromise();
      if (this.currentMultisigAccount.minApproval > 1) {
        this.showLockFunds = true;
      } else {
        this.showLockFunds = false;
      }
    },
  },
  methods: {
    addCosignatory() {
      const { isRemove, currentCosignatoryPublicKey } = this;
      const cosignerItem = {
        cosignatoryPublicKey: currentCosignatoryPublicKey,
        modificationType: isRemove
          ? MultisigCosignatoryModificationType.Remove
          : MultisigCosignatoryModificationType.Add
      }
      if (isRemove) {
        this.cosignatoryDeleteList.push(cosignerItem);
      } else {
        this.cosignatoryAddList.push(cosignerItem);
      }
      this.cosignatoryList.push(cosignerItem);
      this.currentCosignatoryPublicKey = '';
    },


    removeCosignatory(index) {
      this.cosignatoryList.splice(index, 1);
    },


    checkForm() {
      this.errorMessage = multisigModifyValidator(this);
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
        return;
      }
      this.isDialogShow = true;
      this.dialogDetails = [
        {
          icon: 'add',
          key: this.$t('Removal-Delta'),
          value: this.removalDelta,
        },
        {
          icon: 'add',
          key: this.$t('Approval-Delta'),
          value: this.approvalDelta,
        },
        {
          icon: 'add',
          key: this.$t('Max-Fee'),
          value: this.maxFee,
        },
        {
          icon: 'add',
          key: this.$t('Generation-Hash'),
          value: this.generationHash,
        },
      ];
      if (this.currentMultisigAccount.minApproval > 1) {
        this.transactionType = TransactionType.AGGREGATE_BONDED;
        this.createBondedModifyTransaction();
      } else if (this.cosignatoryList.length > 0) {
        this.transactionType = TransactionType.AGGREGATE_BONDED;
        this.createBondedModifyTransaction();
      } else {
        this.transactionType = TransactionType.AGGREGATE_COMPLETE;
        this.createComplete();
      }
    },


    createComplete() {
      const network = NetworkType.MIJIN_TEST;
      const minApprovalDelta = this.approvalDelta;
      const minRemovalDelta = this.removalDelta;
      const multisigPublicAccount = PublicAccount.createFromPublicKey(
        this.currentMultisigPublicKey, network,
      );
      const modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(
        Deadline.create(),
        Number(minApprovalDelta),
        Number(minRemovalDelta),
        [],
        network,
      );
      const aggregateTransaction = AggregateTransaction.createComplete(
        Deadline.create(),
        [modifyMultisigAccountTx.toAggregate(multisigPublicAccount)],
        network,
        [],
      );
      this.transactions = [aggregateTransaction];
    },

    
    async createBondedModifyTransaction() {
      const { account } = this.wallet.activeWallet;
      const multisigPublicAccount = PublicAccount
        .createFromPublicKey(this.currentMultisigPublicKey, NetworkType.MIJIN_TEST);
      const network = NetworkType.MIJIN_TEST;
      const minApprovalDelta = this.approvalDelta;
      const minRemovalDelta = this.removalDelta;
      const cosignatories = this.cosignatoryList;

      const modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(
        Deadline.create(),
        Number(minApprovalDelta),
        Number(minRemovalDelta),
        cosignatories.map(co => new MultisigCosignatoryModification(
          co.modificationType
            ? MultisigCosignatoryModificationType.Remove
            : MultisigCosignatoryModificationType.Add,
          PublicAccount.createFromPublicKey(co.cosignatoryPublicKey, network),
        )),
        network,
      );

      const aggregateTransaction = AggregateTransaction.createBonded(
        Deadline.create(),
        [
          modifyMultisigAccountTx.toAggregate(multisigPublicAccount),
        ],
        network,
      );
      const signedTransaction = account.sign(
        aggregateTransaction,
        this.generationHash,
      );
      const hashLockTransaction = HashLockTransaction.create(
        Deadline.create(),
        NetworkCurrencyMosaic.createRelative(10),
        UInt64.fromUint(480),
        signedTransaction,
        NetworkType.MIJIN_TEST,
      );
      this.transactions = [hashLockTransaction, aggregateTransaction];
    },
    txSent(result) {
      this.txSendResults.push(result);
    },
    txError(error) {
      // eslint-disable-next-line no-console
      console.error(error);
    },
    hideErrorMessage() {
      this.isShowErrorMessage = false;
    },
  },
};
</script>
