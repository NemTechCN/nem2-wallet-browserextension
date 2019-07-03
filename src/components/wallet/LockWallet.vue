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
  <v-dialog
    v-model="show"
    max-width="680px"
  >
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-3">
          {{ $t('Lock') }} {{ walletName }}
        </h3>
      </v-card-title>
      <v-card-text>
        {{ $t('Lock-the-wallet') }} {{ walletName }}
        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            @click.stop="$emit('close')"
          >
            {{ $t('Close') }}
          </v-btn>
          <v-btn
            color="primary mx-0"
            @click="lock"
          >
            {{ $t('Lock-wallet') }}
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import store from '../../store/index';
import { walletTypes } from '../../infrastructure/wallet/wallet-types';

export default {
  name: 'LockWallet',
  store,
  props: {
    visible: Boolean,
    walletName: {
      type: String,
      default: '',
    },
    walletType: {
      type: String,
      default: walletTypes.WATCH_ONLY_WALLET,
    },
  },
  data() {
    return {
      walletTypes,
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('close');
        }
      },
    },
  },
  methods: {
    async lock() {
      try {
        const { walletName } = this;
        const message = await this.$store.dispatch(
          'wallet/LOCK_WALLET', { walletName },
        );
        if (message === true) {
          this.$emit('close');
        } else {
          this.message = message;
        }
      } catch (error) {
        this.message = error;
      }
    },
  },
};
</script>
