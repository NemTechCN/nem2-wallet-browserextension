<template>
  <v-layout
    column
    xs12
  >
    <v-layout
      row
      mb-4
    >
      <v-layout
        row
        fill-height
        justify-start
        pl-3
        xs3
      />
      <v-layout
        row
        fill-height
        justify-end
        xs9
      />
    </v-layout>
    <Errors
      :watch-only-warning="true"
      :application-warnings="false"
      class="mb-4"
    />
    <v-card
      v-if="wallet.wallets.length > 0
        && wallet.activeWallet
        && !wallet.activeWallet.isWatchOnly
        && !application.error"
      style="height: auto;padding:0 !important"
      class="card--flex-toolbar"
    >
      <v-toolbar
        card
        prominent
      >
        <v-toolbar-title>{{ $t('Link-or-Unlink-an-account') }}</v-toolbar-title>
      </v-toolbar>

      <LinkConfigure />
      <AccountLinkInfo />
    </v-card>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';
import LinkConfigure from './LinkConfigure.vue';
import AccountLinkInfo from './AccountLinkInfo.vue';
import Errors from '../Errors.vue';

export default {
  name: 'AccountLink',
  components: {
    AccountLinkInfo,
    LinkConfigure,
    Errors,
  },
  computed: mapState([
    'wallet',
    'application',
    'assets',
  ]),
};
</script>
