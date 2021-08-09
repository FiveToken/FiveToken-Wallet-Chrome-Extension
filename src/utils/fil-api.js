import request from '@/utils/request'
// https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd,cny

const api = {
    BaseFeeAndGas:'/v1/filscan/BaseFeeAndGas',
    BalanceNonceByAddress:'/v1/filscan/BalanceNonceByAddress',
    MessageDetails:'/v1/filscan/MessageDetails',
    FilPricePoints:'/v1/filscan/FilPricePoints',
    MessagePush:'/v1/chainmessage/MessagePush',
    MessageByAddressDirection:'/v1/filscan/MessageByAddressDirection',
    pricePoints:'http://8.209.219.115:8090/third/priceByType',
    searchHandler:'https://bscscan.com/searchHandler'
}


export function getPricePoints(ids){
    return request({
        url: api.pricePoints,
        method: 'get',
        params:{
            coin:ids
        }
    })
}

export function getTokenImg(term){
    return request({
        url: api.searchHandler,
        method: 'get',
        params:{
            term,
            filterby:'0'
        }
    })
}

export function BaseFeeAndGas(data,rpc){
    return request({
        url: rpc + api.BaseFeeAndGas,
        method: 'post',
        data
    })
}
export function BalanceNonceByAddress(data,rpc){
    return request({
        url: rpc + api.BalanceNonceByAddress,
        method: 'post',
        data
    })
}

export function MessageByAddressDirection(data,rpc){
    return request({
        url: rpc + api.MessageByAddressDirection,
        method: 'post',
        data
    })
}
export function MessageDetails(data,rpc){
    return request({
        url: rpc + api.MessageDetails,
        method: 'post',
        data
    })
}

export function FilPricePoints(data,rpc){
    return request({
        url:  rpc + api.FilPricePoints,
        method: 'post',
        data
    })
}
export function MessagePush(data,rpc){
    return request({
        url:  rpc + api.MessagePush,
        method: 'post',
        data
    })
}