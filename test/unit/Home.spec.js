import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Home from '../../src/components/Home.vue';
import wallet from '../../src/store/wallet';

describe('Home.vue', () => {
  Vue.use(Vuetify, {});
  it('renders component when store/wallet state is default state', () => {
    const wrapper = shallowMount(Home, {
      mocks: {
        $t: msg => msg,
      },
      computed: {
        wallet() {
          return wallet.state;
        },
      },
    });
    expect(wrapper.html()).toContain('A-wallet-should-be-selected-to-visualize-this-page');
  });
});
