const state = {
  activeNetwork: [],
  rpc: '',
  rpcName: '',
  accountList: [],
  activeAccount: [],
  address: '',
  privateKey: '',
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
  deriveIndex: 0,
  onLine: false
}

const getters = {
  sortedAccountList (state) {
    let sortList = []
    if (state.accountList.length) {
      sortList = state.accountList.sort(function (a, b) {
        return a.createTime - b.createTime
      })
    }
    return sortList
  }
}

const mutations = {
  SET_ONLINE (state, data) {
    state.onLine = data
  },
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
  SET_ACTIVENETWORK (state, data) {
    state.activeNetwork = data
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
  SET_ACCOUNTNAME (state, data) {
    state.accountName = data
  },
  SET_SYMBOL (state, data) {
    state.symbol = data
  },
  SET_NETWORKS (state, data) {
    state.networks = data
  },
  SET_CUSTOMNETWORK (state, data) {
    const { rpc, name, browser, symbol, ids, networkType, filecoinAddress0, decimals, disabled, image, deriveIndex } = data
    state.rpc = rpc
    state.name = name
    state.browser = browser
    state.symbol = symbol
    state.ids = ids
    state.networkType = networkType
    state.filecoinAddress0 = filecoinAddress0
    state.decimals = decimals
    state.disabled = disabled
    state.image = image
    state.deriveIndex = deriveIndex
  }
}

const actions = {
  async featchGetToken ({ commit }, data) {

  }
}

export default { namespaced: true, state, mutations, actions, getters }
