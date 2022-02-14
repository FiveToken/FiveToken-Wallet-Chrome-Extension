const state = {
  messageList: [],
  tokenList: []
}

const getters = {
  sortedMessageList (state) {
    const pendingList = state.messageList.filter(n => n.type === 'pending')
    const sortPending = pendingList.sort(function (a, b) {
      return b.createTime - a.createTime
    })
    const othersList = state.messageList.filter(n => n.type !== 'pending')
    const sortOthers = othersList.sort(function (a, b) {
      return b.createTime - a.createTime
    })
    const result = [
      ...sortPending,
      ...sortOthers
    ]
    return result
  }
}

const mutations = {
  SET_MESSAGELIST (atate, data) {
    state.messageList = data
  },
  SET_TOKENLIST (state, data) {
    state.tokenList = data
  }
}

const actions = {

}

export default { namespaced: true, state, mutations, actions, getters }
