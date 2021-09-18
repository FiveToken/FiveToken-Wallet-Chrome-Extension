const state = {
  addressBook: [],
  addressRecordLast: [],
  accountList: [],
  tokenList: []
}

const getters = {

}

const mutations = {
  SET_ACCOUNTLIST (state, data) {
    state.accountList = data
  },
  SET_ADDRESSBOOK (state, data) {
    state.addressBook = data
  },
  SET_ADDRESSRECORDLAST (state, data) {
    state.addressRecordLast = data
  },
  SET_TOKENLIST (state, data) {
    state.tokenList = data
  }
}

const actions = {

}

export default { namespaced: true, state, mutations, actions, getters }
