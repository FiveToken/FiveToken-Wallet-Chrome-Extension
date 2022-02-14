import request from '@/utils/request'
import { Message } from 'element-ui'

export class FilecoinAPI {
  constructor () {
    this.rpc = ''
    this.baseParams = {
      id: 0,
      jsonrpc: '2.0'
    }
  }

  // set Filecoin network
  setRpc (rpc) {
    this.rpc = rpc
  }

  /**
     * Returns a network name object
     */
  async getStateNetworkName () {
    try {
      const params = {
        ...this.this.baseParams,
        method: 'Filecoin.StateNetworkName',
        params: []
      }
      const res = await request({
        url: this.rpc,
        method: 'post',
        data: params
      })
      return res
    } catch (error) {
      return null
    }
  }

  /**
     * The balance of the specified address
     * @param { string } address
     * @returns { Object }
     */
  async getBalance (address) {
    try {
      const params = {
        ...this.this.baseParams,
        method: 'Filecoin.WalletBalance',
        params: [address]
      }
      const res = await request({
        url: this.rpc,
        method: 'post',
        data: params
      })
      if (res && res.result) {
        const balance = Number(res.result || 0)
        return balance
      } else {
        return 0
      }
    } catch (error) {
      return 0
    }
  }

  /**
     * The gasfee required to send a message
     * @param { string } from : sending address
     * @param { string } to : receiving address
     * @param { string } nonce : The nonce value of the sending address
     * @returns { Object }
     */
  async getBaseFeeAndGas (from, to, nonce) {
    try {
      const params = {
        ...this.this.baseParams,
        method: 'Filecoin.GasEstimateMessageGas',
        params: [
          {
            Version: 0,
            To: to,
            From: from,
            Nonce: nonce,
            Value: '0',
            GasLimit: 0,
            GasFeeCap: '0',
            GasPremium: '0',
            Method: 0,
            Params: null
          },
          {
            MaxFee: '0'
          },
          []
        ]
      }
      const res = await request({
        url: this.rpc,
        method: 'post',
        data: params
      })
      let gasLimit = 0
      let gasPremium = 0
      let gasFeeCap = 0
      if (res && res.result) {
        gasLimit = res.result.GasLimit
        gasPremium = res.result.GasPremium
        gasFeeCap = res.result.GasFeeCap
      }
      return {
        gasLimit,
        gasPremium,
        gasFeeCap
      }
    } catch (error) {
      return {
        gasLimit: 0,
        gasPremium: 0,
        gasFeeCap: 0
      }
    }
  }

  /**
     * Return the next nonce value of the specified account
     * @param {*} address
     * @returns {Object}
     */
  async getNonce (address) {
    try {
      const params = {
        ...this.this.baseParams,
        method: 'Filecoin.MpoolGetNonce',
        params: [address]
      }
      const res = await request({
        url: this.rpc,
        method: 'post',
        data: params
      })
      if (res && res.result) {
        return res.result
      } else {
        return 0
      }
    } catch (error) {
      return 0
    }
  }

  /**
     * Push a signed message into the memory pool
     * @param {Object} data
     * @returns {Object}
     */
  async MpoolPush (data) {
    try {
      const params = {
        ...this.this.baseParams,
        method: 'Filecoin.MpoolPush',
        params: data
      }
      const res = await request({
        url: this.rpc,
        method: 'post',
        data: params
      })
      if (res && res.result) {
        return res.result['/']
      } else {
        if (res && res.error && res.error.message) {
          Message({
            type: 'error',
            message: res.error.message
          })
        }
        return ''
      }
    } catch (error) {
      return ''
    }
  }

  /**
     * Read the message of the specified CID from the chain block library
     * @param {String} hash : transaction hash
     * @returns {Object}
     */
  async chainGetMessage (hash) {
    try {
      const params = {
        ...this.this.baseParams,
        method: 'Filecoin.ChainGetMessage',
        params: [
          {
            '/': hash
          }
        ]
      }
      const res = await request({
        url: this.rpc,
        method: 'post',
        data: params
      })
      if (res && res.result) {
        return res.result
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }

  /**
     * Return the receipt of the specified message
     * @param {*} hash : transaction hash
     * @returns {Object}
     */
  async stateGetReceipt (hash) {
    try {
      const params = {
        ...this.this.baseParams,
        method: 'Filecoin.StateGetReceipt',
        params: [
          {
            '/': hash
          },
          []
        ]
      }
      const res = await request({
        url: this.rpc,
        method: 'post',
        data: params
      })
      if (res && res.result) {
        return res.result
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }
}
