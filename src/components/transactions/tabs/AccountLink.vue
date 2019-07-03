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
  <div>
    <AccountLink class="mb-4" />
    <Transactions
      v-if="wallet.activeWallet
        && transactions.transactions
        && transactions.transactions[wallet.activeWallet.name]"
      preset-filter="false"
      :title="$t('Recent-account-link-transactions')"
      class="mb-4"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Transactions from '../Transactions.vue';
import AccountLink from '../../accountLink/AccountLink.vue';

export default {
  components: {
    AccountLink,
    Transactions,
  },
  computed: mapState(['transactions', 'wallet']),
};

</script>
