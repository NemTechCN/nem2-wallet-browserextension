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
    :value="value"
    :max-width="maxWidth"
    @input="toggleDialog"
  >
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-0">
          {{ title }}
        </h3>
        <div>
          {{ body }}
        </div>
      </v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          @click="toggleDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="info"
          @click="getTransaction"
        >
          Yes, send it!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import request from 'request';
import { mapState } from 'vuex';
import { filter, timeout } from 'rxjs/operators';
import {
  TransactionHttp, Listener, TransactionType, CosignatureTransaction, PublicAccount, NetworkType,
} from 'nem2-sdk';
import store from '../../store/index';


function sendSequential(unsignedTransactions, transactions, endpoint, address, emitter, webhook) {
  const wsEndpoint = endpoint.replace('http', 'ws');
  const listener = new Listener(wsEndpoint, WebSocket);
  const txHttp = new TransactionHttp(endpoint);
  listener.open().then(() => {
    const subscription = listener.confirmed(address).pipe(
      filter(transaction => transaction.transactionInfo !== undefined),
      timeout(transactions.length * 60000),
    ).subscribe((transaction) => {
      const confirmedHash = transaction.transactionInfo.hash;
      const confirmedTxIndex = transactions.findIndex(tx => tx.hash === confirmedHash);
      if (confirmedTxIndex === -1) return;
      if (transactions[confirmedTxIndex + 1] !== undefined) {
        const signedTx = transactions[confirmedTxIndex + 1];
        txHttp.announceAggregateBonded(signedTx).subscribe((x) => {
        // txHttp.announce(signedTx).subscribe((x) => {
          emitter('sent', {
            message: x,
            transaction: unsignedTransactions[confirmedTxIndex + 1],
            txHash: signedTx.hash,
            nodeURL: endpoint,
          });
        }, (e) => {
          emitter('error', {
            message: e,
            transaction: unsignedTransactions[confirmedTxIndex + 1],
            txHash: signedTx.hash,
            nodeURL: endpoint,
          });
        });
      } else {
        // eslint-disable-next-line no-console
        console.log('connection closed');
        subscription.unsubscribe();
        listener.close();
      }
    }, (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      // eslint-disable-next-line no-console
      console.log('connection closed');
      listener.close();
    });
    const firstSignedTx = transactions[0];
    txHttp.announce(firstSignedTx).subscribe((x) => {
      if (webhook) {
        const options = {
          uri: webhook,
          method: 'POST',
          body: {
            action: 'AnnounceTransaction',
            data: {
              hash: firstSignedTx.hash,
              signer: firstSignedTx.signer,
            },
          },
          json: true,
        };
        request(options, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            // eslint-disable-next-line no-console
            console.log(body.id);
          } else {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        });
      }
      emitter('sent', {
        message: x,
        transaction: unsignedTransactions[0],
        txHash: firstSignedTx.hash,
        nodeURL: endpoint,
      });
    }, (e) => {
      emitter('error', {
        message: e,
        transaction: unsignedTransactions[0],
        txHash: firstSignedTx.hash,
        nodeURL: endpoint,
      });
    });
  });
}

export default {
  name: 'Confirmation',
  store,
  props: {
    value: {
      type: Boolean,
      default() {
        return false;
      },
    },
    transactions: {
      type: Array,
      default() {
        return [];
      },
    },
    isCosign: {
      type: Boolean,
      default() {
        return false;
      },
    },
    generationHash: {
      type: String,
      default() {
        return '';
      },
    },
    title: {
      type: String,
      default() {
        return 'Send this transaction?';
      },
    },
    body: {
      type: String,
      default() {
        return 'Are you sure that you want to send a transaction with the following details?';
      },
    },
    maxWidth: {
      type: Number,
      default() {
        return 500;
      },
    },
    // eslint-disable-next-line vue/require-default-prop
    webhook: {
      type: String,
    },
  },
  computed: mapState(
    ['wallet', 'application'],
  ),
  methods: {
    toggleDialog() {
      this.$emit('input', !this.value);
    },
    getTransaction() {
      if (this.isCosign) {
        this.cosignAndAnnounce();
      } else {
        this.signAndAnnounce();
      }
    },


    async signAndAnnounce() {
      if (!this.wallet.activeWallet) return;
      try {
        const endpoint = this.application.activeNode;
        const { address } = this.wallet.activeWallet.account;
        const unsignedTransactions = this.transactions;

        const transactions = await this.signTransactions({
          transactions: this.transactions,
          wallet: this.wallet.activeWallet,
          generationHash: this.generationHash,
          endpoint,
        });

        const emitter = (type, value) => {
          this.$emit(type, value);
        };
        sendSequential(
          unsignedTransactions,
          transactions,
          endpoint,
          address,
          emitter,
          this.webhook,
        );
        this.toggleDialog();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, 'ERROR at signAndAnnounce');
      }
    },


    cosignAndAnnounce() {
      if (!this.wallet.activeWallet) return;
      const endpoint = this.application.activeNode;
      const { account } = this.wallet.activeWallet;
      const transactionHttp = new TransactionHttp(endpoint);
      const emitter = (type, value) => {
        this.$emit(type, value);
      };
      const cosignatureTransaction = CosignatureTransaction.create(this.transactions[0]);
      const cosignedTx = account.signCosignatureTransaction(cosignatureTransaction);
      transactionHttp.announceAggregateBondedCosignature(cosignedTx).subscribe((x) => {
        emitter('sent', {
          message: x,
          transaction: this.transactions[0],
          txHash: cosignedTx.hash,
          nodeURL: endpoint,
        }, (e) => {
          emitter('error', {
            message: e,
            transaction: this.transactions[0],
            txHash: cosignedTx.hash,
            nodeURL: endpoint,
          });
        });
      });
    },


    signTransactions({
      transactions,
      wallet,
      generationHash,
      endpoint,
    }) {
      return new Promise(async (resolve, reject) => {
        const { account } = wallet;
        const signerPublicAccount = PublicAccount
          .createFromPublicKey(account.publicKey, NetworkType.MIJIN_TEST);
        const t = transactions.map((tx, index, txs) => {
          if (tx.type === TransactionType.LOCK) return { tx, lockToSign: true };

          const signedTx = account.sign(tx, generationHash);

          const txWithHash = {
            ...txs[index],
            signer: signerPublicAccount,
            transactionInfo: { hash: signedTx.hash },
            endpoint,
            generationHash,
          };

          return { signedTx, txWithHash };
        }).map((object, index, txs) => {
          if (!object.lockToSign) return object;

          const txWithHash = { tx: object.tx, hash: txs[index + 1].hash };
          const signedTx = account.sign(txWithHash, generationHash);
          return {
            signedTx,
            txWithHash: {
              ...txWithHash,
              signer: signerPublicAccount,
              transactionInfo: { hash: signedTx.hash },
              endpoint,
              generationHash,
            },
          };
        });

        try {
          const transactionsToFormat = t
            .map(({ txWithHash }) => ({ ...txWithHash }));
          const transactionsToAnnounce = t.map(({ signedTx }) => signedTx);

          this.$store.dispatch('transactions/HANDLE_ANNOUNCED_TRANSACTIONS', {
            transactions: transactionsToFormat,
            wallet,
            generationHash,
          });

          resolve(transactionsToAnnounce);
        } catch (error) {
          reject(error);
        }
      });
    },
  },
};

</script>
