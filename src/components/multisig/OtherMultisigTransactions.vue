<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12>
        <v-combobox
          v-model="transactionType"
          :items="transactionTypeLists"
          :label="$t('Multisig-transaction-type')"
        />
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12>
        <v-select
          v-model="currentMultisigPublicKey"
          :label="$t('Multisig-Account-Public-Key')"
          :items="multisig.multisigInfo[wallet.activeWallet.name].multisigAccounts"
          item-text="publicKey"
        />
      </v-flex>
    </v-layout>
    <Transfer :current-multisig-public-key="currentMultisigPublicKey" />
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import Transfer from './otherMultisigTransactionComponents/Transfer.vue';

export default {
  name: 'OtherMultisigTransactions',
  components: {
    Transfer,
  },
  data() {
    return {
      transactionTypeLists: ['transfer'],
      transactionType: '',
      currentMultisigPublicKey: '',
    };
  },
  computed: {
    ...mapState([
      'wallet',
      'accountInfo',
      'application',
      'transactions',
      'multisig',
    ], {
      wallet: state => state.wallet,
    }),
  },
};
</script>
