/* eslint-disable camelcase */
import { fil2atto, formatDate, bigNumbers } from '@/utils'
import { getT1SignedMsg } from '@/utils/message'
import { Message } from 'element-ui'
import { FilecoinAPI } from '@/api/filecoin.js'
import { BSCChainAPI } from '@/api/ethers.js'
import { ethers } from 'ethers'
import Config from '@/config.js'
import request from '@/utils/request'
import { enumerateNetworkType } from '@/utils/enumeration'
import {
  BalanceNonceByAddress,
  MessagePush,
  MessageDetails,
  BaseFeeAndGas,
  getPricePoints
} from '@/api/proxy.js'

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
        serviceGas
      } = tx
      if (this.networkType === 'proxy') {
        const { gasPremium, gasFeeCap, gasLimit } = serviceGas
        const val = fil2atto(value)
        const msg = {
          Version: 0,
          To: to,
          From: from,
          Nonce: nonce,
          Value: val,
          GasPremium: gasPremium.toString(),
          GasFeeCap: (gasFeeCap).toString(),
          GasLimit: gasLimit,
          Method: 0,
          Params: ''
        }

        const signedMsg = await getT1SignedMsg(msg, privateKey)
        const objparams = {
          raw: JSON.stringify(signedMsg)
        }
        const proxyRes = await MessagePush(objparams, this.rpc)

        if (proxyRes && proxyRes.code === 200) {
          const cid = proxyRes.data
          return {
            cid,
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
            cid: '',
            nonce: nonce + 1
          }
        }
      }
      if (this.networkType === 'ethereum') {
        const { gasPrice, gasLimit, rpcType, maxFeePerGas, maxPriorityFeePerGas } = serviceGas
        let transaction = null
        if (rpcType === enumerateNetworkType.ethereumMain) {
          transaction = {
            maxFeePerGas,
            maxPriorityFeePerGas,
            gasLimit,
            to: to,
            value: ethers.utils.parseEther(value.toString())
          }
        } else {
          transaction = {
            gasLimit,
            gasPrice: ethers.BigNumber.from(gasPrice),
            to: to,
            value: ethers.utils.parseEther(value.toString())
          }
        }

        this.setBSCChainAPI()
        this.BSCChainAPI.setProvider(this.rpc)
        this.BSCChainAPI.setWalletWithProvider(privateKey)
        const ethRes = await this.BSCChainAPI.sendTransaction(transaction)
        if (ethRes && ethRes.hash && ethRes.nonce) {
          return {
            cid: ethRes.hash,
            nonce: ethRes.nonce + 1
          }
        } else {
          return {
            cid: '',
            nonce: 0
          }
        }
      }
      if (this.networkType === 'filecoin') {
        const { GasPremium, GasFeeCap, GasLimit } = serviceGas
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
        this.setFilecoinAPI()
        this.FilecoinAPI.setRpc(this.rpc)
        const filRes = await this.FilecoinAPI.MpoolPush(params)
        if (filRes) {
          return {
            cid: filRes,
            nonce: nonce + 1
          }
        }
      }
    } catch (err) {
      Message({
        type: 'error',
        message: 'Failed to send'
      })
      return null
    }
  }

  /**
   * Returns the transaction with hash or null if the transaction is unknown.
   * @param {String} hash : transaction hash
   * @returns {Object}
   */
  async getTransaction (cid) {
    try {
      if (this.networkType === 'proxy') {
        const result = await MessageDetails(cid, this.rpc)
        if (result && result.code === 200 && result.data) {
          const proxyRes = result.data
          const value = Number(proxyRes.value)
          const allGasFee = Number(proxyRes.gas_fee)
          const totalAmount = Number(value) + Number(allGasFee)
          const blockTime = proxyRes.block_time ? formatDate(proxyRes.block_time, true) : ''

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
            allGasFee,
            totalAmount,
            type,
            cid,
            blockTime,
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
        const ethRes = await this.BSCChainAPI.getTransaction(cid)
        const rptRes = await this.BSCChainAPI.getTransactionReceipt(cid)
        const block = await this.BSCChainAPI.getBlock(ethRes.blockNumber)
        if (ethRes) {
          let type = 'pending'
          if (rptRes && rptRes.status === 1) {
            type = 'success'
          }
          if (rptRes && rptRes.status !== 1) {
            type = 'error'
          }
          const blockTime = formatDate(block.timestamp, true)
          const value = Number(ethRes.value.toString())
          const allGasFee = Number(ethRes.gasPrice.toString()) * Number(rptRes.gasUsed.toString())
          const totalAmount = value + allGasFee
          const detail = {
            from: ethRes.from,
            to: ethRes.to,
            nonce: ethRes.nonce,
            value,
            allGasFee,
            totalAmount,
            type,
            blockTime,
            height: ethRes.blockNumber,
            cid
          }
          return detail
        } else {
          return null
        }
      }
      if (this.networkType === 'filecoin') {
        this.setFilecoinAPI()
        this.FilecoinAPI.setRpc(this.rpc)
        const filRes = await this.FilecoinAPI.chainGetMessage(cid)
        const stateRes = await this.FilecoinAPI.stateGetReceipt(cid)
        if (filRes) {
          const allGasFee = Number(filRes.GasFeeCap) * Number(filRes.GasLimit)
          const totalAmount = Number(filRes.Value) + allGasFee
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
            allGasFee,
            totalAmount,
            type: mType,
            cid,
            blockTime: ''
          }
          return detail
        } else {
          return null
        }
      }
    } catch (err) {
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
  async getGasFee (from, to, nonce, isEthereumMain) {
    try {
      if (this.networkType === 'proxy') {
        const result = await BaseFeeAndGas(to, this.rpc)
        if (result && result.code === 200) {
          const proxyRes = result.data
          const { gas_cap, gas_limit, gas_premium } = proxyRes
          return {
            gasLimit: Number(gas_limit),
            gasPremium: Number(gas_premium),
            gasFeeCap: Number(gas_cap),
            gasPrice: 0,
            maxPriorityFeePerGas: 0,
            maxFeePerGas: 0
          }
        } else {
          return {
            gasPrice: 0,
            maxPriorityFeePerGas: 0,
            maxFeePerGas: 0,
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
        let maxFee = null
        if (isEthereumMain) {
          maxFee = await this.getMaxPriorityFeePerGas()
        }
        return {
          gasLimit: Number(limit.toString()),
          gasPremium: 0,
          gasPrice: Number(gas.toString()),
          gasFeeCap: 0,
          maxPriorityFeePerGas: (maxFee && maxFee.maxPriorityFeePerGas) ?? 0,
          maxFeePerGas: (maxFee && maxFee.maxFeePerGas) ?? 0
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
          gasFeeCap: Number(gasFeeCap),
          gasPrice: 0,
          maxPriorityFeePerGas: 0,
          maxFeePerGas: 0
        }
      }
    } catch (err) {
      return {
        gasLimit: 0,
        gasPremium: 0,
        gasFeeCap: 0,
        gasPrice: 0,
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 0
      }
    }
  }

  async getMaxPriorityFeePerGas () {
    const blockNumber = await this.BSCChainAPI.getBlockNumber()
    const block = await this.BSCChainAPI.getBlock(blockNumber)
    const _baseFeePerGas = bigNumbers(block.baseFeePerGas.toString())
    const _coefficient = bigNumbers(Config.baseFeePerGasToMaxFeePerGas)
    const params = { jsonrpc: '2.0', method: 'eth_maxPriorityFeePerGas', params: [], id: 1 }
    const _res = await request({
      url: this.rpc,
      method: 'post',
      data: params
    })
    const maxFeePerGas = _baseFeePerGas * _coefficient
    const isHexString = ethers.utils.isHexString(_res.result)
    if (isHexString) {
      const maxPriorityFeePerGas = Number(_res.result)
      return {
        maxFeePerGas,
        maxPriorityFeePerGas
      }
    } else {
      return {
        maxFeePerGas: 0,
        maxPriorityFeePerGas: 0
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
      const rpc = 'https://api.fivetoken.io'
      const res = await getPricePoints(ids, rpc)
      if (res && res.code === 200) {
        const data = res.data
        let usd = 0
        let cny = 0
        data.forEach(n => {
          if (n.vs === 'usd') {
            usd = n.price
          }
          if (n.vs === 'cny') {
            cny = n.price
          }
        })
        return {
          usd: usd,
          cny: cny
        }
      } else {
        return {
          usd: 0,
          cny: 0
        }
      }
    } catch (err) {
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
