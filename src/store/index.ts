import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
  state: {
    loginSuccessData: null,
    deviceList: [],
    deviceModelDialogOpened: false,
    newDeviceModelDialogOpened: false
  },
  mutations: {
    storeLoginSuccessData(state, data:any) {
      state.loginSuccessData = data;
    },
    storeIntoDeviceList(state, list:any) {
      state.deviceList = list;
    },
    openDeviceModelDialog(state, status:boolean) {
      state.deviceModelDialogOpened = status;
    },
    openNewDeviceModelDialog(state, status:boolean) {
      state.newDeviceModelDialogOpened = status;
    }
  },
  actions: {
  },
  modules: {
  }
})
