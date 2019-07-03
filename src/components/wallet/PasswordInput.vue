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
          {{ $t('Unlock') }} {{ walletName }}
        </h3>
      </v-card-title>
      <v-card-text>
        <span
          v-if="message"
          style="
            margin-bottom: 20px;
            display: block;"
        >
          {{ message }}
        </span>
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'visibility' : 'visibility_off'"
          :type="show1 ? 'text' : 'password'"
          :label="$t('Password')"
          hint="At least 8 characters"
          counter
          @click:append="show1 = !show1"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            @click.stop="$emit('close')"
          >
            {{ $t('Close') }}
          </v-btn>
          <v-btn
            :disabled="!validPassword"
            color="primary mx-0"
            @click="unlock"
          >
            {{ $t('Unlock-wallet') }}
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { Password } from 'nem2-sdk';
import { walletTypes } from '../../infrastructure/wallet/wallet-types';
import store from '../../store/index';

export default {
  name: 'PasswordInput',
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
      password: '',
      validPassword: false,
      message: false,
      show1: false,
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
  watch: {
    password: {
      handler(e) {
        try {
          const password = new Password(e);
          this.validPassword = !!password.value;
        } catch (error) {
          // do nothing
        }
      },
    },
  },
  methods: {
    async unlock() {
      try {
        const { walletName, password } = this;
        const message = await this.$store.dispatch(
          'wallet/UNLOCK_WALLET', { walletName, password },
        );
        if (message === true) {
          this.password = '';
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
