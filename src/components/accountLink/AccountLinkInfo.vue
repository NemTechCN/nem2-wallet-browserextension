<template>
  <div>
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <v-card>
          <v-toolbar
            card
            prominent
          >
            <v-toolbar-title>
              {{ wallet.activeWallet.name }}: {{ $t('Multisig-Information') }}
            </v-toolbar-title>
            <v-spacer />

            <v-btn
              icon
              @click.stop="reloadLinkInfo()"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-toolbar>
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
          <v-card-title primary-title>
            <div class="monospaced">
              <div class="clearfix homeLine">
                {{ $t('linked-public-key') }}: {{ linkedAccountKey }}
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import request from 'request';

export default {
  name: 'MultisigInfo',
  data() {
    return {
      linkedAccountKey: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
    };
  },
  computed: mapState([
    'wallet',
    'application',
    'multisig',
  ]),
  created() {
    this.reloadLinkInfo();
  },
  methods: {
    reloadLinkInfo() {
      const url = `${this.application.activeNode}/account/${this.wallet.activeWallet.publicAccount.address.pretty()
        .replace(/-/g, '')}`;
      request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const res = JSON.parse(body);
          this.linkedAccountKey = res.account.linkedAccountKey;
        } else {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      });
    },
  },
};
</script>
