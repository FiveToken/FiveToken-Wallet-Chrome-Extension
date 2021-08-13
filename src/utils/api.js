import request from '@/utils/request'
console.log(process.env.NODE_ENV,'process.env.NODE_ENV');
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.filscan.io:8083':'http://192.168.1.161:8081'
const api = {
    BaseFeeAndGas:'/v1/filscan/BaseFeeAndGas',
    BalanceNonceByAddress:'/v1/filscan/BalanceNonceByAddress',
    WalletStatisticalIndicators:'/v1/filscan/WalletStatisticalIndicators',
    MessageByAddressDirection:'/v1/filscan/MessageByAddressDirection',
    MessageDetails:'/v1/filscan/MessageDetails',
    ActorById:'/v1/filscan/ActorById',
    FilPricePoints:'/v1/filscan/FilPricePoints',
    MessagePush:'/v1/chainmessage/MessagePush',
}
// get baseFee
export function BaseFeeAndGas(data){
    return request({
        url: BASE_URL + api.BaseFeeAndGas,
        method: 'post',
        data
    })
}

// get banance nonce 
export function BalanceNonceByAddress(data){
    return request({
        url: BASE_URL + api.BalanceNonceByAddress,
        method: 'post',
        data
    })
}
// get message list
export function MessageByAddressDirection(data){
    return request({
        url: BASE_URL + api.MessageByAddressDirection,
        method: 'post',
        data
    })
}
// get messageDetails
export function MessageDetails(data){
    return request({
        url: BASE_URL + api.MessageDetails,
        method: 'post',
        data
    })
}
// get Fil Price
export function FilPricePoints(data){
    return request({
        url:  BASE_URL + api.FilPricePoints,
        method: 'post',
        data
    })
}
// message push
export function MessagePush(data){
    return request({
        url:  BASE_URL + api.MessagePush,
        method: 'post',
        data
    })
}

export function ActorById(data){
    return request({
        url: BASE_URL + api.ActorById,
        method: 'post',
        data
    })
}

export function WalletStatisticalIndicators(data){
    return request({
        url: BASE_URL + api.WalletStatisticalIndicators,
        method: 'post',
        data
    })
}