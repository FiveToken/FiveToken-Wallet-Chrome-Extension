
const state = {
  
}

const getters = {}

const mutations = {
  SET_HEADER(state, data) {
    state.header = data
  }
}

const actions = {
  async featchGetToken({ commit }, data) {
    
    localStorage.setItem('eventToken', res.token)
    return res
  }
}

export default { namespaced: true, state, mutations, actions, getters }
