/* eslint-disable camelcase */
import request from '@/utils/request'

const base_api = '/api/yoju1zfpcidq1arp4fg5ntvd'

const api = {
  // BaseFeeAndGas:'/v1/filscan/BaseFeeAndGas',
  // BalanceNonceByAddress:'/v1/filscan/BalanceNonceByAddress',
  // MessageDetails:'/v1/filscan/MessageDetails',
  // MessagePush:'/v1/chainmessage/MessagePush',
  // pricePoints:'http://8.209.219.115:8090/third/priceByType'
  BalanceNonceByAddress: base_api + '/actor/balance',
  MessageDetails: base_api + '/message',
  MessagePush: base_api + '/message',
  Message: base_api + '/actor/messages',
  MessageBuild: base_api + '/message/build',
  BaseFeeAndGas: base_api + '/recommend/fee',
  pricePoints: 'http://8.209.219.115:8090/third/priceByType'
}

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
export function BalanceNonceByAddress (data, rpc) {
  return request({
    url: rpc + api.BalanceNonceByAddress,
    method: 'get',
    params: {
      actor: data
    }
  })
}

export function getPricePoints (ids) {
  return request({
    url: api.pricePoints,
    method: 'get',
    params: {
      coin: ids
    }
  })
}

export function MessageDetails (data, rpc) {
  return request({
    url: rpc + api.MessageDetails,
    method: 'get',
    params: {
      cid: data
    }
  })
}

export function MessagePush (data, rpc) {
  return request({
    url: rpc + api.MessagePush,
    method: 'post',
    data
  })
}
