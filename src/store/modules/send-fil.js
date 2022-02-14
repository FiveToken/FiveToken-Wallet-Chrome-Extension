
import { bigNumbers } from '@/utils'
const state = {
  addressBook: [],
  addressRecordLast: [],
  accountList: [],
  address: '',
  tokenList: [],
  serviceGas: null
}

const getters = {
  gettersAccountList (state) {
    let filterList = []
    if (state.accountList.length) {
      const accountList = state.accountList
      filterList = accountList.reduce((total, current) => {
        current.address !== state.address && total.push(current)
        return total
      }, [])
    }
    return filterList
  },
  handlingFee (state) {
    if (state.serviceGas) {
      try {
        let fee = 0
        const _gas = state.serviceGas
        switch (state.serviceGas.rpcType) {
          case 'ethereumMain':
            fee = bigNumbers(_gas.maxFeePerGas).multipliedBy(_gas.gasLimit)
            break
          case 'filecoin':
            fee = (bigNumbers(_gas.gasPremium).plus(_gas.gasFeeCap)).multipliedBy(_gas.gasLimit)
            break
          case 'ethereumOthers':
            fee = bigNumbers(_gas.gasPrice).multipliedBy(_gas.gasLimit)
            break
          default:
            fee = bigNumbers(0)
        }
        return fee.toNumber()
      } catch (error) {
        return 0
      }
    } else {
      return 0
    }
  }
}

const mutations = {
  SET_ADDRESS (atate, data) {
    state.address = data
  },
  SET_SERVICEGAS (state, data) {
    state.serviceGas = data
  },
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
