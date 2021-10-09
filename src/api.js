/* eslint-disable camelcase */
import { ethers } from 'ethers'
import { fil2atto, formatDate } from '@/utils'
import { getT1SignedMsg } from '@/utils/message'
import { Message } from 'element-ui'
import {
  BalanceNonceByAddress,
  MessagePush,
  MessageDetails,
  BaseFeeAndGas,
  getPricePoints
} from '@/fil-api'
import request from '@/utils/request'

class BSCChainAPI {
  constructor () {
    this.provider = null
    this.walletWithProvider = null
  }

  setWalletWithProvider (privateKey) {
    this.walletWithProvider = new ethers.Wallet(privateKey, this.provider)
  }

  // A Provider is an abstraction of a connection to the Ethereum network, providing a concise, consistent interface to standard Ethereum node functionality.
  setProvider (rpc) {
    this.provider = ethers.getDefaultProvider(rpc)
  }

  /**
   * Returns the balance of address as of the blockTag block height.
   * @param {String} address
   * @returns {Number}
   */
  async getBalance (address) {
    try {
      const res = await this.provider.getBalance(address)
      const balance = Number(res.toString())
      return balance
    } catch (err) {
      console.log(err, 'BSCChainAPI.getBalance')
      return 0
    }
  }

  /**
   * Submits transaction to the network to be mined. The transaction must be signed,
   * and be valid (i.e. the nonce is correct and the account has sufficient balance to pay for the transaction).
   * @param {Object} tx
   * @returns {Object}
   */
  async sendTransaction (tx) {
    console.log('ETH sendTransaction')
    try {
      const res = await this.walletWithProvider.sendTransaction(tx)
      return res
    } catch (err) {
      console.log(err, 'BSCChainAPI.sendTransaction')
      if (err.error && err.error.message) {
        Message({
          type: 'error',
          message: err.error && err.error.message
        })
      }
      return null
    }
  }

  /**
   * Returns the transaction with hash or null if the transaction is unknown.
   * @param {String} hash : transaction hash
   * @returns {Object}
   */
  async getTransaction (hash) {
    try {
      const res = await this.provider.getTransaction(hash)
      console.log(res, hash, 'bsc res3444')
      return res
    } catch (error) {
      console.log(error, 'BSCChainAPI.getTransaction error')
      return null
    }
  }

  /**
   * Returns the transaction receipt for hash or null if the transaction has not been mined.
   * To stall until the transaction has been mined, consider the waitForTransaction method below.
   * @param {String} hash : transaction hash
   * @returns {Object}
   */
  async getTransactionReceipt (hash) {
    try {
      const res = await this.provider.getTransactionReceipt(hash)
      return res
    } catch (error) {
      console.log(error, 'BSCChainAPI.getTransactionReceipt error')
      return null
    }
  }

  /**
   * Returns a best guess of the Gas Price to use in a transaction.
   */
  async getGasPrice () {
    try {
      const res = await this.provider.getGasPrice()
      return res
    } catch (err) {
      console.log(err, 'BSCChainAPI.getTransaction')
      return null
    }
  }

  /**
   * Returns an estimate of the amount of gas that would be required to submit transaction to the network.
  */
  async getEstimateGas (transaction) {
    try {
      const res = await this.provider.estimateGas(transaction)
      return res
    } catch (err) {
      console.log(err, 'BSCChainAPI.getTransaction')
      return null
    }
  }

  /**
   * Get the block from the network, where the result.transactions is a list of transaction hashes.
   * @param {String} block
   * @returns {Object}
   */
  async getBlock (block) {
    try {
      const res = await this.provider.getBlock(block)
      return res
    } catch (err) {
      console.log(err, 'BSCChainAPI.getBlock')
      return null
    }
  }

  /**
   * Returns the block number (or height) of the most recently mined block
   * @param {String} rpc
   * @returns {Number}
   */
  async getBlockNumber (rpc) {
    try {
      const res = await this.provider.getBlockNumber()
      return res
    } catch (err) {
      console.log(err, 'BSCChainAPI.getBlockNumber')
      return null
    }
  }
}

class FilecoinAPI {
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
      console.log(error, 'error filecoin StateNetworkName')
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
      console.log(error, 'error filecoin getBalance')
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
      console.log(res, 'getBaseFeeAndGas res')
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
      console.log(error, 'getBaseFeeAndGas err')
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
      console.log(error, 'error2')
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
      console.log(error, 'err chainGetMessage')
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
      console.log(error, 'err StateGetReceipt')
      return null
    }
  }
}

export class GlobalApi {
  constructor () {
    this.rpc = ''
    // proxy  ethereum  filecoin
    this.networkType = ''
    this.BSCChainAPI = null
    this.FilecoinAPI = null
  }

  setBSCChainAPI () {
    this.BSCChainAPI = new BSCChainAPI()
  }

  setFilecoinAPI () {
    this.FilecoinAPI = new FilecoinAPI()
  }

  setRpc (rpc) {
    this.rpc = rpc
  }

  setNetworkType (type) {
    this.networkType = type
  }

  /**
   * The balance of the specified address
   * @param { string } address
   * @returns { Object }
   */
  async getBalance (address) {
    try {
      if (this.networkType === 'proxy') {
        const result = await BalanceNonceByAddress(address, this.rpc)
        if (result && result.code === 200) {
          if (result && result.data) {
            const proxyRes = result && result.data
            const balance = Number((proxyRes && proxyRes.balance) || 0)
            const nonce = proxyRes.nonce
            return {
              balance,
              nonce
            }
          } else {
            return {
              balance: 0,
              nonce: 0
            }
          }
        } else {
          return {
            balance: 0,
            nonce: 0
          }
        }
      }
      if (this.networkType === 'ethereum') {
        this.setBSCChainAPI()
        this.BSCChainAPI.setProvider(this.rpc)
        const ethRes = await this.BSCChainAPI.getBalance(address)
        return {
          balance: ethRes,
          nonce: 0
        }
      }
      if (this.networkType === 'filecoin') {
        this.setFilecoinAPI()
        this.FilecoinAPI.setRpc(this.rpc)
        const filRes = await this.FilecoinAPI.getBalance(address)
        const filNonce = await this.FilecoinAPI.getNonce(address)
        return {
          balance: filRes,
          nonce: filNonce
        }
      }
    } catch (err) {
      console.log(err, 'GlobalApi.getBalance error')
      Message({
        type: 'error',
        message: 'Network Connection Error.'
      })
      return {
        balance: 0,
        nonce: 0
      }
    }
  }

  /**
   * Submits transaction to the network to be mined. The transaction must be signed,
   * and be valid (i.e. the nonce is correct and the account has sufficient balance to pay for the transaction).
   * @param {Object} tx
   * @returns {Object}
   */
  async sendTransaction (tx) {
    try {
      const {
        from,
        to,
        value,
        nonce,
        privateKey,
        GasPremium,
        GasFeeCap,
        GasLimit
      } = tx
      if (this.networkType === 'proxy') {
        const val = fil2atto(value)
        const msg = {
          Version: 0,
          To: to,
          From: from,
          Nonce: nonce,
          Value: val,
          GasPremium: GasPremium.toString(),
          GasFeeCap: (GasFeeCap).toString(),
          GasLimit: GasLimit,
          Method: 0,
          Params: ''
        }

        const signedMsg = await getT1SignedMsg(msg, privateKey)
        const objparams = {
          raw: JSON.stringify(signedMsg)
        }
        const proxyRes = await MessagePush(objparams, this.rpc)

        if (proxyRes && proxyRes.code === 200) {
          const signed_cid = proxyRes.data
          return {
            signed_cid,
            nonce: nonce + 1
          }
        } else {
          if (proxyRes.detail) {
            Message({
              type: 'error',
              message: proxyRes.detail
            })
          }
          return {
            signed_cid: '',
            nonce: nonce + 1
          }
        }
      }
      if (this.networkType === 'ethereum') {
        const ransaction = {
          gasLimit: GasLimit,
          gasPrice: ethers.BigNumber.from(GasFeeCap),
          to: to,
          value: ethers.utils.parseEther(value.toString())
        }
        this.setBSCChainAPI()
        this.BSCChainAPI.setProvider(this.rpc)
        this.BSCChainAPI.setWalletWithProvider(privateKey)
        const ethRes = await this.BSCChainAPI.sendTransaction(ransaction)
        if (ethRes && ethRes.hash && ethRes.nonce) {
          return {
            signed_cid: ethRes.hash,
            nonce: ethRes.nonce + 1
          }
        } else {
          return {
            signed_cid: '',
            nonce: 0
          }
        }
      }
      if (this.networkType === 'filecoin') {
        const filVal = fil2atto(value)
        const filMsg = {
          Version: 0,
          To: to,
          From: from,
          Nonce: nonce,
          Value: filVal,
          GasPremium: GasPremium.toString(),
          GasFeeCap: (GasFeeCap).toString(),
          GasLimit: GasLimit,
          Method: 0,
          Params: ''
        }
        const signMsg = await getT1SignedMsg(filMsg, privateKey)
        const params = [{
          ...signMsg
        }]
        console.log(params, 'params')
        this.setFilecoinAPI()
        this.FilecoinAPI.setRpc(this.rpc)
        const filRes = await this.FilecoinAPI.MpoolPush(params)
        if (filRes) {
          console.log(filRes, 'MpoolPush')
          return {
            signed_cid: filRes,
            nonce: nonce + 1
          }
        }
      }
    } catch (err) {
      console.log(err, 'GlobalApi.sendTransaction.err')
      return null
    }
  }

  /**
   * Returns the transaction with hash or null if the transaction is unknown.
   * @param {String} hash : transaction hash
   * @returns {Object}
   */
  async getTransaction (signed_cid) {
    try {
      if (this.networkType === 'proxy') {
        const result = await MessageDetails(signed_cid, this.rpc)
        if (result && result.code === 200 && result.data) {
          const proxyRes = result.data
          const value = Number(proxyRes.value)
          const all_gas_fee = Number(proxyRes.gas_fee)
          const total_amount = Number(value) + Number(all_gas_fee)
          const block_time = proxyRes.block_time ? formatDate(proxyRes.block_time, true) : ''

          let type = 'pending'
          if (proxyRes.block_epoch && proxyRes.exit_code === 0) {
            type = 'success'
          }
          if (proxyRes.block_epoch && proxyRes.exit_code !== 0) {
            type = 'error'
          }
          const detail = {
            from: proxyRes.from,
            to: proxyRes.to,
            nonce: proxyRes.nonce,
            value,
            all_gas_fee,
            total_amount,
            type,
            signed_cid,
            block_time,
            height: proxyRes.block_epoch
          }
          return detail
        } else {
          return null
        }
      }
      if (this.networkType === 'ethereum') {
        this.setBSCChainAPI()
        this.BSCChainAPI.setProvider(this.rpc)
        const ethRes = await this.BSCChainAPI.getTransaction(signed_cid)
        const rptRes = await this.BSCChainAPI.getTransactionReceipt(signed_cid)
        const block = await this.BSCChainAPI.getBlock(ethRes.blockNumber)
        console.log(ethRes, rptRes, block, 'ethRes 22222')

        if (ethRes) {
          let type = 'pending'
          if (rptRes && rptRes.status === 1) {
            type = 'success'
          }
          if (rptRes && rptRes.status !== 1) {
            type = 'error'
          }
          const block_time = formatDate(block.timestamp, true)
          const value = Number(ethRes.value.toString())
          const all_gas_fee = Number(ethRes.gasPrice.toString()) * Number(ethRes.gasLimit.toString())
          const total_amount = value + all_gas_fee
          const detail = {
            from: ethRes.from,
            to: ethRes.to,
            nonce: ethRes.nonce,
            value,
            all_gas_fee,
            total_amount,
            type,
            block_time,
            height: ethRes.blockNumber,
            signed_cid
          }
          return detail
        } else {
          return null
        }
      }
      if (this.networkType === 'filecoin') {
        this.setFilecoinAPI()
        this.FilecoinAPI.setRpc(this.rpc)
        const filRes = await this.FilecoinAPI.chainGetMessage(signed_cid)
        const stateRes = await this.FilecoinAPI.stateGetReceipt(signed_cid)
        console.log(filRes, stateRes, '888888222222')
        if (filRes) {
          const all_gas_fee = Number(filRes.GasFeeCap) * Number(filRes.GasLimit)
          const total_amount = Number(filRes.Value) + all_gas_fee
          let mType = 'pending'
          if (stateRes && stateRes.ExitCode === 0) {
            mType = 'success'
          }
          if (stateRes && stateRes.ExitCode && stateRes.ExitCode !== 0) {
            mType = 'error'
          }
          const detail = {
            from: filRes.From,
            to: filRes.To,
            nonce: filRes.Nonce,
            value: filRes.Value,
            all_gas_fee,
            total_amount,
            type: mType,
            signed_cid,
            block_time: ''
          }
          return detail
        } else {
          return null
        }
      }
    } catch (err) {
      console.log(err, 'GlobalApi.getTransaction')
      return null
    }
  }

  /**
   * The gasfee required to send a message
   * @param { string } from : sending address
   * @param { string } to : receiving address
   * @param { string } nonce : The nonce value of the sending address
   * @returns { Object }
   */
  async getGasFee (from, to, nonce) {
    try {
      if (this.networkType === 'proxy') {
        const result = await BaseFeeAndGas(to, this.rpc)
        console.log(result, 'result 123456')
        if (result && result.code === 200) {
          const proxyRes = result.data
          const { gas_cap, gas_limit, gas_premium } = proxyRes
          return {
            gasLimit: Number(gas_limit),
            gasPremium: Number(gas_premium),
            gasFeeCap: Number(gas_cap) / Math.pow(10, 9)
          }
        } else {
          return {
            gasLimit: 0,
            gasPremium: 0,
            gasFeeCap: 0
          }
        }
      }
      if (this.networkType === 'ethereum') {
        this.setBSCChainAPI()
        this.BSCChainAPI.setProvider(this.rpc)
        const gas = await this.BSCChainAPI.getGasPrice()
        const tx = {
          to: to,
          value: ethers.utils.parseEther('1.0')
        }
        const limit = await this.BSCChainAPI.getEstimateGas(tx)
        return {
          gasLimit: Number(limit.toString()),
          gasPremium: 0,
          gasFeeCap: Number(gas.toString()) / Math.pow(10, 9)
        }
      }
      if (this.networkType === 'filecoin') {
        this.setFilecoinAPI()
        this.FilecoinAPI.setRpc(this.rpc)
        const filRes = await this.FilecoinAPI.getBaseFeeAndGas(from, to, nonce)
        const { gasLimit, gasPremium, gasFeeCap } = filRes
        return {
          gasLimit,
          gasPremium,
          gasFeeCap: Number(gasFeeCap) / Math.pow(10, 9)
        }
      }
    } catch (err) {
      console.log(err, 'getGasFee.err')
      return {
        gasLimit: 0,
        gasPremium: 0,
        gasFeeCap: 0
      }
    }
  }

  /**
 * Get token exchange rate
 * @param {String} ids
 * @returns {Promise}
 */
  async getPrice (ids) {
    try {
      const res = await getPricePoints(ids)
      if (res && res.data) {
        const data = res.data
        return {
          usd: data.usd,
          cny: data.cny
        }
      } else {
        return {
          usd: 0,
          cny: 0
        }
      }
    } catch (err) {
      console.log(err, 'getPrice.err')
      return {
        usd: 0,
        cny: 0
      }
    }
  }

  /**
   * Returns a network name object
   */
  async getFIleCoinChainHead (rpc) {
    try {
      this.setFilecoinAPI()
      this.FilecoinAPI.setRpc(rpc)
      const res = await this.FilecoinAPI.getStateNetworkName()
      if (res && res.result) {
        if (res.result === 'mainnet') {
          return {
            networkType: 'filecoin',
            filecoinAddress0: 'f'
          }
        } else {
          return {
            networkType: 'filecoin',
            filecoinAddress0: 't'
          }
        }
      } else {
        return {
          networkType: '',
          filecoinAddress0: ''
        }
      }
    } catch (error) {
      console.log(error, 'GlobalApi.getStateNetworkName err')
      return {
        networkType: '',
        filecoinAddress0: ''
      }
    }
  }

  /**
   * Returns the block number (or height) of the most recently mined block
   * @param {String} rpc
   * @returns {Number}
   */
  async getBlockNumber (rpc) {
    try {
      this.setBSCChainAPI()
      this.BSCChainAPI.setProvider(rpc)
      const res = await this.BSCChainAPI.getBlockNumber()
      if (res) {
        return {
          networkType: 'ethereum',
          filecoinAddress0: ''
        }
      } else {
        return {
          networkType: '',
          filecoinAddress0: ''
        }
      }
    } catch (error) {
      return {
        networkType: '',
        filecoinAddress0: ''
      }
    }
  }
}
