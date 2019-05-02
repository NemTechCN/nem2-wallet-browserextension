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
import { timestampNemesisBlock } from '../infrastructure/network/types';
import { formatDate } from '../infrastructure/transactions/formatTransactions';

const state = {
  error: false,
  errorMessage: '',
  listenerStatus: 'off',
  listenerErrorMessage: false,
  routeName: '',
  darkMode: false,
  showSnackbar: false,
  snackbarText: '',
  blockNumber: 'loading',
  blocks: [],
};

const getters = {
  GET_ERROR_STATE() {
    return state.error;
  },
  GET_ERROR_MESSAGE() {
    return state.errorMessage;
  },
};

const mutations = {
  resetErrors(state) {
    state.error = false;
    state.errorMessage = '';
  },
  setError(state, errMsg) {
    state.error = true;
    state.errorMessage = errMsg;
  },
  updateRouteName(state, routeName) {
    state.routeName = routeName;
  },
  toggleDarkMode(state) {
    state.darkMode = !state.darkMode;
  },
  setSnackbarText(state, text) {
    state.snackbarText = text;
  },
  setListenerStatus(state, status, text) {
    state.listenerStatus = status;
    state.listenerErrorMessage = text;
  },
  setBlockNumber(state, blockNumber) {
    state.blockNumber = blockNumber;
  },
  addBlock(state, formattedBlock) {
    if (state.blocks.length >= 100) state.blocks.shift();
    state.blocks.push(formattedBlock);
  },
};

const actions = {
  RESET_ERRORS({ commit }) {
    commit('resetErrors');
  },


  SET_ERROR({ commit }, errorMessage) {
    const errMsg = typeof errorMessage === 'string'
      ? errorMessage : errorMessage.toString();
    commit('setError', errMsg);
  },


  SET_LISTENER_STATUS({ commit }, { status, text }) {
    commit('setListenerStatus', status, text);
  },


  NAVIGATE({ commit }, { to }) {
    commit('updateRouteName', to.name);
  },


  TOGGLE_DARK_MODE({ commit }) {
    commit('toggleDarkMode');
  },


  SET_SNACKBAR_TEXT({ commit }, { text }) {
    commit('setSnackbarText', text);
  },


  SET_BLOCK_NUMBER({ commit }, blockNumber) {
    commit('setBlockNumber', blockNumber);
  },


  ADD_BLOCK({ commit, dispatch }, block) {
    const blockNumber = block.height.compact();
    dispatch('SET_BLOCK_NUMBER', blockNumber);

    const timestamp = block.timestamp.compact() / 1000 + timestampNemesisBlock;
    commit('addBlock', {
      blockNumber,
      timestamp,
      date: formatDate(new Date(timestamp * 1000)),
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
