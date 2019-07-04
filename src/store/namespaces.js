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
import { getNamespacesByAddress } from '../infrastructure/namespaces/getNamespacesByAddress';
import { GET_NAMESPACES_MODES } from '../infrastructure/namespaces/namespaces-types';

const state = {
  namespaces: false,
  loading_getNamespacesByAddress: false,
};

const getters = {
  GET_NAMESPACES(state, getters, rootState) {
    return state.namespaces[rootState.wallet.activeWallet.name];
  },
};

const mutations = {
  setAccountNamespaces(state, { wallet, namespaces }) {
    if (!state.namespaces) state.namespaces = {};
    Vue.set(state.namespaces, wallet.name, namespaces);
  },
  setLoading_getNamespacesByAddress(state, bool) {
    state.loading_getNamespacesByAddress = bool;
  },
};

const actions = {
  async CLEAR_NAMESPACES({ commit }, wallet) {
    commit('setAccountNamespaces', { wallet, namespaces: false });
  },


  async GET_NAMESPACES_BY_ADDRESS({
    commit,
    dispatch,
    getters,
    rootState,
  }, { wallet, mode }) {
    if (mode === GET_NAMESPACES_MODES.ON_WALLET_CHANGE && getters.GET_NAMESPACES) return;

    await commit('setLoading_getNamespacesByAddress', true);

    try {
      const namespaces = await getNamespacesByAddress(wallet, rootState.application.activeNode);
      commit('setAccountNamespaces', { wallet, namespaces });
      commit('setLoading_getNamespacesByAddress', false);
    } catch (error) {
      dispatch('application/SET_ERROR', { errorMessage: error, wallet }, { root: true });
      commit('setLoading_getNamespacesByAddress', false);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
