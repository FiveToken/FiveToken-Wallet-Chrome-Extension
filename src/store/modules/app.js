const state = {
  activenNetworks: [],
  rpc: '',
  rpcName: '',
  accountList: [],
  activeAccount: [],
  address: '',
  privateKey: '',
  digest: '',
  accountName: '',
  symbol: '',
  ids: '',
  browser: '',
  networks: [],
  networkType: '',
  filecoinAddress0: '',
  currency: '',
  language: '',
  currencyConversion: 0,
  decimals: 0,
  owenChain: true,
  rpcImage: '',
  deriveIndex: 0
}

const getters = {

}

const mutations = {
  SET_DERIVEINDEX (state, data) {
    state.deriveIndex = data
  },
  SET_RPCIMAGE (state, data) {
    state.rpcImage = data
  },
  SET_OWENCHAIN (state, data) {
    state.owenChain = data
  },
  SET_DECIMALS (state, data) {
    state.decimals = data
  },
  SET_LANGUAGE (state, data) {
    state.language = data
  },
  SET_CURRENCY (state, data) {
    state.currency = data
  },
  SET_CURRENCYCONVERSION (state, data) {
    state.currencyConversion = data
  },
  SET_NETWORKTYPE (state, data) {
    state.networkType = data
  },
  SET_FILECOINADDRESS0 (state, data) {
    state.filecoinAddress0 = data
  },
  SET_RPC (state, data) {
    state.rpc = data
  },
  SET_IDS (state, data) {
    state.ids = data
  },
  SET_RPCNAME (state, data) {
    state.rpcName = data
  },
  SET_BROWSER (state, data) {
    state.browser = data
  },
  SET_ACTIVENETWORKS (state, data) {
    state.activenNetworks = data
  },
  SET_ACTIVEACCOUNT (state, data) {
    state.activeAccount = data
  },
  SET_ACCOUNTLIST (state, data) {
    state.accountList = data
  },
  SET_ADDRESS (state, data) {
    state.address = data
  },
  SET_PRIVATEKEY (state, data) {
    state.privateKey = data
  },
  SET_DIGEST (state, data) {
    state.digest = data
  },
  SET_ACCOUNTNAME (state, data) {
    state.accountName = data
  },
  SET_SYMBOL (state, data) {
    state.symbol = data
  },
  SET_NETWORKS (state, data) {
    state.networks = data
  }
}

const actions = {
  async featchGetToken ({ commit }, data) {

  }
}

export default { namespaced: true, state, mutations, actions, getters }
