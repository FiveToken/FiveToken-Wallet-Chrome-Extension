/* eslint-disable camelcase */
import request from '@/utils/request'
const base_api = '/api/yoju1zfpcidq1arp4fg5ntvd'
// api interface address
const api = {
  BalanceNonceByAddress: base_api + '/actor/balance',
  MessageDetails: base_api + '/message',
  MessagePush: base_api + '/message',
  Message: base_api + '/actor/messages',
  MessageBuild: base_api + '/message/build',
  BaseFeeAndGas: base_api + '/recommend/fee',
  addressCheck: base_api + '/address/check',
  pricePoints: base_api + '/token/prices'
}

/**
 * get the fee for sending the transaction
 * @param {*} data : Interface input parameters
 * @param {*} rpc : Interface domain name
 * @returns {Promise}
 */
export function BaseFeeAndGas (data, rpc) {
  return request({
    url: rpc + api.BaseFeeAndGas,
    method: 'get',
    params: {
      method: 'Send',
      actor: data
    }
  })
}

export function AddressCheck (data, rpc) {
  return request({
    url: rpc + api.addressCheck,
    method: 'get',
    params: {
      address: data
    }
  })
}

/**
 * The balance and nonce of the specified address
 * @param {*} data : Interface input parameters
 * @param {*} rpc : Interface domain name
 * @returns {Promise}
 */
export function BalanceNonceByAddress (data, rpc) {
  return request({
    url: rpc + api.BalanceNonceByAddress,
    method: 'get',
    params: {
      actor: data
    }
  })
}

/**
 * Get token exchange rate
 * @param {Object} data : Interface input parameters
 * @returns {Promise}
 */
export function getPricePoints (ids, rpc) {
  const data = [
    {
      id: ids,
      vs: 'usd'
    },
    {
      id: ids,
      vs: 'cny'
    }
  ]
  return request({
    url: rpc + api.pricePoints,
    method: 'post',
    data
  })
}

/**
 * get sending the transaction detail
 * @param {*} data : Interface input parameters
 * @param {*} rpc : Interface domain name
 * @returns {Promise}
 */
export function MessageDetails (data, rpc) {
  return request({
    url: rpc + api.MessageDetails,
    method: 'get',
    params: {
      cid: data
    }
  })
}

/**
 * Push a signed message into the memory pool
 * @param {*} data : Interface input parameters
 * @param {*} rpc : Interface domain name
 * @returns {Promise}
 */
export function MessagePush (data, rpc) {
  return request({
    url: rpc + api.MessagePush,
    method: 'post',
    data
  })
}
