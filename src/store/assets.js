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
import getMosaicsByAddress from '../components/utils/getMosaicsByAddress';

const state = {
  assets: false,
  loading_getMosaicsByAddress: false,
};

const getters = {
  GET_ASSETS() {
    return state.assets;
  },
};

const mutations = {
  setAccountAssets(state, assets) {
    state.assets = assets;
  },
  setLoading_getMosaicsByAddress(state, bool) {
    state.loading_getMosaicsByAddress = bool;
  },
  clearAssets(state) {
    state.assets = false;
  },
};

const actions = {
  async CLEAR_ASSETS({ commit }) {
    commit('clearAssets', false);
  },
  async GET_ASSETS_BY_ADDRESS({ commit, dispatch }, { wallet }) {
    await commit('setLoading_getMosaicsByAddress', true);
    try {
      await dispatch('CLEAR_ASSETS');
      const namespaces = await getMosaicsByAddress(wallet);
      commit('setAccountAssets', namespaces);
    } catch (error) {
      dispatch('application/SET_ERROR', error, { root: true });
      // eslint-disable-next-line no-console
      console.error(error, 'GET_ASSETS_BY_ADDRESS');
    }
    commit('setLoading_getMosaicsByAddress', false);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
