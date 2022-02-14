import { ethers } from 'ethers'
import { Message } from 'element-ui'

export class BSCChainAPI {
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
    try {
      const res = await this.walletWithProvider.sendTransaction(tx)
      return res
    } catch (err) {
      if (err.error && err.error.message) {
        Message({
          type: 'error',
          message: err.error && err.error.message
        })
      } else {
        Message({
          type: 'error',
          message: 'Failed to send'
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
      return res
    } catch (error) {
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
      return null
    }
  }
}
