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
        <v-flex xs12>
          <v-radio-group
            v-model="linkAction"
            row
          >
            <template v-slot:label>
              <div>{{ $t('Link-action') }}: </div>
            </template>
            <v-radio
              v-for="l in linkActions"
              :key="l.type"
              :label="l.label"
              :value="l.type"
            />
          </v-radio-group>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="remoteAccountKey"
            class="ma-0 pa-0"
            :label="$t('Remote-Account-Public-Key')"
            required
          />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="maxFee"
            class="ma-0 pa-0"
            :label="$t('Max-Fee')"
            number
            required
          />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="generationHash"
            disabled
            class="ma-0 pa-0"
            :label="$t('Generation-Hash')"
            string
            required
          />
        </v-flex>
      </v-layout>


      <v-btn
        style="margin-bottom: 20px"
        color="primary mx-0"
        :disabled="disabledSendTransaction"
        depressed
        @click="showDialog"
      >
        Send
      </v-btn>

      <v-layout column>
        <SendConfirmation
          :tx-send-data="txSendResults"
        />
      </v-layout>

      <Confirmation
        v-model="isDialogShow"
        :transactions="transactions"
        :generation-hash="generationHash"
        @sent="txSent"
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
import {
  LinkAction,
  AccountLinkTransaction,
  Deadline,
  NetworkType,
  UInt64,
} from 'nem2-sdk';
import { mapState } from 'vuex';
import SendConfirmation from '../signature/SendConfirmation.vue';
import Confirmation from '../signature/Confirmation.vue';
import ErrorMessageComponent from '../errorMessage/ErrorMessage.vue';
import ErrorMessage from '../../infrastructure/errorMessage/error-message';

const accountLinkValidator = (pointer) => {
  const { remoteAccountKey, generationHash, maxFee } = pointer;
  /* eslint-disable */
  let errorMessage = {
    message: [],
    disabled: true,
  };
  /* eslint-disable */
  if (!generationHash || generationHash.trim() === '') {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_NULL);
    return errorMessage;
  } if (generationHash.length !== 64) {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_ERROR);
    return errorMessage;
  }
  if (remoteAccountKey.trim().length !== 64) {
    errorMessage.message.push(ErrorMessage.PUBLIC_KEY_ERROR);
    return errorMessage;
  }
  if (maxFee < 0) {
    errorMessage.message.push(ErrorMessage.MAX_FEE_ERROR);
    return errorMessage;
  }
  errorMessage.disabled = false;
  return errorMessage;
};

export default {
  components: {
    Confirmation,
    SendConfirmation,
    ErrorMessageComponent,
  },
  data() {
    return {
      isShowErrorMessage: false,
      errorMessage: {},
      maxFee: 0,
      remoteAccountKey: '',
      linkAction: LinkAction.Link,
      linkActions: [
        {
          label: 'Link',
          type: LinkAction.Link,
        }, {
          label: 'Unlink',
          type: LinkAction.Unlink,
        },
      ],
      isDialogShow: false,
      dialogDetails: [],
      transactions: [],
      txSendResults: [],
      currentGenerationHash: '',
    };
  },
  computed: {
    ...mapState([
      'application',
    ]),
    disabledSendTransaction() {
      return this.linkAction === -1 || this.remoteAccountKey === '';
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
      this.errorMessage = accountLinkValidator(this);
      if (this.errorMessage.disabled) {
        this.isShowErrorMessage = true;
        return;
      }
      const { linkAction, remoteAccountKey } = this;
      this.transactions = [new AccountLinkTransaction(
        NetworkType.MIJIN_TEST,
        2,
        Deadline.create(),
        UInt64.fromUint(this.maxFee),
        remoteAccountKey,
        linkAction,
      )];
      this.dialogDetails = [
        {
          icon: 'add',
          key: this.$t('Link-Action'),
          value: this.$t(this.linkAction === 1 ? 'Unlink' : 'Link'),
        },
        {
          icon: 'add',
          key: this.$t('Account-Public-Key'),
          value: this.remoteAccountKey,
        },
        {
          icon: 'add',
          key: this.$t('Max-Fee'),
          value: this.maxFee,
        },
      ];
      this.isDialogShow = true;
    },
    txSent(result) {
      this.txSendResults.push(result);
    },
    hideErrorMessage() {
      this.isShowErrorMessage = false;
    },
  },
};
</script>
