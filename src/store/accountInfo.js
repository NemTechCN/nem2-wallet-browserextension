/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
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
import getAccountInfo from '../infrastructure/accountInfo/getAccountInfo';

const state = {
  accountInfo: false,
  loading_getAccountInfo: false,
};

const getters = {
  GET_ACCOUNT_INFO(state, getters, rootState) {
    return state.accountInfo[rootState.wallet.activeWallet.name];
  },
};

const mutations = {
  setAccountInfo(state, { wallet, accountInfo }) {
    if (!state.accountInfo) state.accountInfo = {};
    Vue.set(state.accountInfo, wallet.name, accountInfo);
  },
  setLoading_getAccountInfo(state, bool) {
    state.loading_getAccountInfo = bool;
  },
};

const actions = {
  async CLEAR_ACCOUNT_INFO({ commit }, wallet) {
    commit('setAccountInfo', { wallet, accountInfo: false });
    commit('setLoading_getAccountInfo', false);
  },


  FETCH_ACCOUNT_INFO({
    commit,
    dispatch,
    getters,
    rootState,
  }, wallet) {
    return new Promise(async (resolve, reject) => {
      dispatch('application/RESET_ERRORS', null, { root: true });

      if (getters.GET_ACCOUNT_INFO) {
        commit('setLoading_getAccountInfo', false);
        resolve(true);
      }

      commit('setLoading_getAccountInfo', true);
      try {
        const accountInfo = await getAccountInfo(wallet, rootState.application.activeNode);
        commit('setAccountInfo', { wallet, accountInfo });
        commit('setLoading_getAccountInfo', false);
        resolve(true);
      } catch (error) {
        dispatch('application/SET_ERROR', {
          errorMessage: 'This wallet is not known by the network. To activate it, you need to send a transaction to it from another wallet',
          wallet,
        },
        { root: true });
        commit('setLoading_getAccountInfo', false);
        reject(error);
      }
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
