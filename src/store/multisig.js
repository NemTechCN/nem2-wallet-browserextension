/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
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

import Vue from 'vue';
import { AccountHttp } from 'nem2-sdk';
// @TODO: rationalize get modes, make generic ones
import { GET_MULTISIG_MODES } from '../infrastructure/multisig/multisig-types';

const state = {
  multisigInfo: false,
  loading_getMultisigInfo: false,
};

const getters = {
  GET_MULTISIG_INFO(state, getters, rootState) {
    return state.multisigInfo[rootState.wallet.activeWallet.name];
  },
};

const mutations = {
  setAccountMultisigInfo(state, { wallet, multisigInfo }) {
    if (!state.multisigInfo) state.multisigInfo = {};
    Vue.set(state.multisigInfo, wallet.name, multisigInfo);
  },
  setLoading_getMultisigInfo(state, bool) {
    state.loading_getMultisigInfo = bool;
  },
};


const actions = {
  async CLEAR_MULTISIG_INFO({ commit }, wallet) {
    commit('setAccountMultisigInfo', { wallet, multisigInfo: false });
  },


  async REFRESH_MULTISIG_INFO({ commit, getters, rootState }, { wallet, mode }) {
    if (mode === GET_MULTISIG_MODES.ON_WALLET_CHANGE && getters.GET_MULTISIG_INFO) {
      commit('setLoading_getMultisigInfo', false);
      return;
    }
    await commit('setLoading_getMultisigInfo', true);
    try {
      const accountHttp = new AccountHttp(rootState.application.activeNode);
      const address = wallet.isWatchOnly
        ? wallet.publicAccount.address : wallet.account.address;
      const multisigInfo = await accountHttp.getMultisigAccountInfo(address).toPromise();
      commit('setAccountMultisigInfo', { wallet, multisigInfo });
    } catch (error) {
      if (error.statusMessage !== 'Not Found') {
        // eslint-disable-next-line no-console
        console.error(error, 'GET_MULTISIG_INFO');
      }
      commit('setAccountMultisigInfo', { wallet, multisigInfo: false });
    }
    commit('setLoading_getMultisigInfo', false);
  },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
