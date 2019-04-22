/**
 * Copyright (C) 2019 Contributors as noted in the AUTHORS file
 *
 * This file is part of nem2-wallet-browserextension.
 *
 * nem2-wallet-browserextension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * nem2-wallet-browserextension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with nem2-wallet-browserextension.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Account, NetworkType } from 'nem2-sdk';
import getAccountInfo from '../components/utils/getAccountInfo';
import getMosaicsByAddress from '../components/utils/getMosaicsByAddress';
import { getNamespacesByAddress } from '../components/utils/getNamespacesByAddress';
import getAccountTransactionsById from '../components/utils/getAccountTransactionsById';
import { removeDuplicatesAndSortByBlockNumber } from '../components/utils/formatTransactions';
/* eslint-disable class-methods-use-this */


const jsonToWallets = json => JSON.parse(json).map(wallet => ({
  name: wallet.name,
  account: Account.createFromPrivateKey(wallet.privateKey, NetworkType.MIJIN_TEST),
  node: wallet.node,
}));

// Ports & Adapters
class StateRepository {
  constructor() {
/*     const wallets = localStorage.getItem('wallets');
    this.state = {
      wallets: wallets != null ? jsonToWallets(wallets) : [],
      accountInfo: false,
      transactions: false,
      namespaces: false,
      activeWallet: false,
      loading_getAccountInfo: false,
      loading_getMosaicsByAddress: false,
      loading_getAccountTransactionsById: false,
      loading_getNamespacesByAddress: false,
    }; */
  }

  wallets() {
    return this.state.wallets;
  }

  async onWalletChange(walletName) {
    try {
      this.resetWalletData();
      this.state.loading_getAccountInfo = true;
      this.resetErrors(); // errors/RESET_ERRORS
      const activeWallet = await this.currentWallet(walletName);
      this.state.accountInfo = await getAccountInfo(activeWallet);
      this.state.loading_getAccountInfo = false;
      this.loadMosaics();
      this.loadNamespaces();
      this.getAccountTransactionsById('init');
    } catch (error) {
      this.state.error = true;
      this.state.errorMessage = error.toString() === 'Error: ResourceNotFound'
        ? 'This wallet is not known by the network'
        : 'An error occured while getting the wallet account information';
      // eslint-disable-next-line no-console
      console.error(error);
      this.state.loading_getAccountInfo = false;
    }
  }

  currentWallet(walletName) {
    return new Promise((resolve, reject) => {
      const activeWallet = this.state.wallets.find(x => x.name === walletName);
      if (activeWallet) {
        this.state.activeWallet = activeWallet;
        resolve(activeWallet);
      } else {
        reject(new Error('This wallet is undefined'));
      }
    });
  }

  async loadMosaics() {
    try {
      this.state.assets = false;
      this.state.loading_getMosaicsByAddress = true;
      this.state.assets = await getMosaicsByAddress(this.state.activeWallet);
      this.state.loading_getMosaicsByAddress = false;
    } catch (error) {
      this.error = true;
      this.errorMessage = 'Error while loading mosaics';
      this.state.loading_getMosaicsByAddress = false;
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async loadNamespaces() {
    try {
      this.state.namespaces = false;
      this.state.loading_getNamespacesByAddress = true;
      this.state.namespaces = await getNamespacesByAddress(this.state.activeWallet);
      this.state.loading_getNamespacesByAddress = false;
    } catch (error) {
      this.error = true;
      this.errorMessage = 'Error while loading mosaics';
      this.state.loading_getNamespacesByAddress = false;
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async getAccountTransactionsById(mode) {
    let currentId;
    try {
      if (this.state.accountInfo) {
        switch (mode) {
        case 'more':
          currentId = this.state.transactions.length > 0
            ? this.state.transactions[this.state.transactions.length - 1].id
            : undefined;
          break;
        case 'init':
        case 'refresh':
        default:
          currentId = undefined;
          break;
        }
      }

      if (mode === 'init') this.state.transactions = false;
      this.state.loading_getAccountTransactionsById = true;
      const newTransactions = await getAccountTransactionsById(
        this.state.activeWallet.node,
        this.state.accountInfo,
        currentId,
      );

      const oldTransactions = this.state.transactions !== false ? this.state.transactions : [];
      this.state.transactions = removeDuplicatesAndSortByBlockNumber([
        ...oldTransactions,
        ...newTransactions,
      ]);
      this.state.loading_getAccountTransactionsById = false;
    } catch (error) {
      this.error = true;
      this.errorMessage = 'Error while loading transactions';
      this.loading_getAccountTransactionsById = false;
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  resetErrors() { // errors/RESET_ERRORS
    this.state.error = false;
    this.state.errorMessage = '';
  }

  resetWalletData() {
    this.state.accountInfo = false;
    this.state.assets = false;
    this.state.transactions = false;
    this.state.namespaces = false;
  }
}

const stateRepository = new StateRepository();

export default stateRepository;
