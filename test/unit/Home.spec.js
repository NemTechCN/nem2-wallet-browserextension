import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Home from '../../src/components/Home.vue';
import {
  transactionTypesFilters,
} from '../../src/infrastructure/transactions/transactions-types';

describe('Home.vue', () => {
  Vue.use(Vuetify, {});
  it('renders component', () => {
    const wrapper = shallowMount(Home, {
      computed: {
        wallet() {
          return {
            wallets: [],
          };
        },
        accountInfo() {
          return {
            accountInfo: false,
            loading_getAccountInfo: false,
          };
        },
        application() {
          return {
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
            activeNode: false,
            generationHashes: false,
            officialNodes: false,
          };
        },
        transactions() {
          return {
            transactions: false,
            erroredTransactions: [],
            loading_getAccountTransactionsById: false,
            transactionTypesFilters: transactionTypesFilters(),
            activeTransaction: false,
            createdURI: [],
            receivedURI: [],
          };
        },
        assets() {
          return {
            assets: false,
            networkAssets: false,
            loading_getMosaicsByAddress: false,
          };
        },
        namespaces() {
          return {
            namespaces: false,
            loading_getNamespacesByAddress: false,
          };
        },
        QR() { return ''; },
        ownedAssets() { return false; },
        ownedNamespaces() { return false; },
      },
    });
    expect(wrapper.html()).toContain('A wallet should be selected to visualize this page');
  });
});
