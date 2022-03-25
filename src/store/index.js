import {
  createStore
} from 'vuex'

import actions from './actions.js';
import mutations from './mutations.js';
export default createStore({
  state: {
    map: null,
    get_on_data: null,
    get_off_data: null,
    route_data: null,
  },
  getters: {},
  mutations,
  actions,
  modules: {}
})