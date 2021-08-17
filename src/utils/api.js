
import { ethers } from 'ethers'
import { fil2atto,formatDate } from '@/utils'
import { getGasFeeCap,getGasLimit } from '@/utils'
import { getT1SignedMsg } from '@/utils/message'
import { Message } from 'element-ui'
import { 
    BalanceNonceByAddress,
    MessagePush,
    MessageDetails,
    BaseFeeAndGas,
    FilPricePoints,
    getPricePoints
} from '@/utils/fil-api'
import request from '@/utils/request'

class GlobalApi{
    constructor(){
        this.rpc = ''
        // proxy  ethereum  filecoin
        this.networkType = ''
        this.BSCChainAPI = null
        this.FilecoinAPI = null
    }
    setBSCChainAPI(){
        this.BSCChainAPI = new BSCChainAPI()
    }
    setFilecoinAPI(){
        this.FilecoinAPI = new FilecoinAPI()
    }
    setRpc(rpc){
        this.rpc = rpc
    }
    setNetworkType(type){
        this.networkType = type
    }
    async getBalance(address){
        try{
            switch (this.networkType){
                case 'proxy':
                    let result = await BalanceNonceByAddress([{address}],this.rpc)
                    let proxyRes = result && result.data
                    let balance = Number(proxyRes.balance || 0)
                    let nonce = proxyRes.nonce
                    return {
                        balance,
                        nonce
                    }
                    break;
                case 'ethereum':
                    this.setBSCChainAPI()
                    this.BSCChainAPI.setProvider(this.rpc)
                    let ethRes = await this.BSCChainAPI.getBalance(address)
                    return {
                        balance:ethRes,
                        nonce:0
                    }
                    break;
                case 'filecoin':
                    this.setFilecoinAPI()
                    this.FilecoinAPI.setRpc(this.rpc)
                    let filRes = await this.FilecoinAPI.getBalance(address)
                    let filNonce = await this.FilecoinAPI.getNonce(address)
                    return {
                        balance:filRes,
                        nonce:filNonce
                    }
                    break;
            }
        }catch(err){
            console.log(err,'GlobalApi.getBalance')
            return {
                balance:0,
                nonce:0
            }
        }
    }
    async sendTransaction(tx){
        try{
            let {
                from, 
                to,
                value,
                nonce,
                privateKey,
                GasPremium,
                GasFeeCap,
                GasLimit 
            } = tx
            switch (this.networkType){
                case 'proxy':
                    let val = fil2atto(value)
                    let msg = {
                        Version: 0,
                        To: to,
                        From: from,
                        Nonce:nonce,
                        Value: val,
                        GasPremium: GasPremium.toString(),
                        GasFeeCap: (GasFeeCap).toString(),
                        GasLimit: GasLimit,
                        Method: 0,
                        Params: ''
                    };
                    let signedMsg = await getT1SignedMsg(msg, privateKey)
                    let objparams = [{
                        ...signedMsg
                    }]
                    let proxyRes = await MessagePush(objparams,this.rpc)
                    if(proxyRes && proxyRes.data){
                        let signed_cid = proxyRes.data['/']
                        return {
                            signed_cid,
                            nonce:nonce+1
                        }
                    }else{
                        return {
                            signed_cid:'',
                            nonce:nonce+1
                        }
                    }
                    break;
                case 'ethereum':
                    let ransaction = {
                        gasLimit:GasLimit,
                        gasPrice: ethers.BigNumber.from(GasFeeCap),
                        to:to,
                        value: ethers.utils.parseEther(value.toString())
                    }
                    this.setBSCChainAPI()
                    this.BSCChainAPI.setProvider(this.rpc)
                    this.BSCChainAPI.setWalletWithProvider(privateKey)
                    let ethRes = await this.BSCChainAPI.sendTransaction(ransaction)
                    if(ethRes && ethRes.hash){
                        return {
                            signed_cid:ethRes.hash,
                            nonce:ethRes.nonce + 1
                        }
                    }else{
                        return {
                            signed_cid:'',
                            nonce:ethRes.nonce + 1
                        }
                    }
                    break;
                case 'filecoin':
                    let filVal = fil2atto(value)
                    let filMsg = {
                        Version: 0,
                        To: to,
                        From: from,
                        Nonce:nonce,
                        Value: filVal,
                        GasPremium: GasPremium.toString(),
                        GasFeeCap: (GasFeeCap).toString(),
                        GasLimit: GasLimit,
                        Method: 0,
                        Params: ''
                    };
                    let signMsg = await getT1SignedMsg(filMsg, privateKey)
                    let params = [{
                        ...signMsg
                    }]
                    console.log(params,'params')
                    this.setFilecoinAPI()
                    this.FilecoinAPI.setRpc(this.rpc)
                    let filRes = await this.FilecoinAPI.MpoolPush(params)
                    console.log(filRes,'MpoolPush')
                    return {
                        signed_cid:filRes,
                        nonce:nonce+1
                    }
                    break;
            }
            
            
        }catch(err){
            Message({
                type:'error',
                message:err
            })
            console.log(err,'GlobalApi.sendTransaction.err')
            return null
        }
    }
    async getTransaction(signed_cid){
        try{
            switch (this.networkType){
                case 'proxy':
                    let result = await MessageDetails([signed_cid],this.rpc)
                    let proxyRes = result.data
                    if(proxyRes){
                        let value = Number(proxyRes.value)
                        let all_gas_fee = Number(proxyRes.all_gas_fee)
                        let total_amount = Number(value) + Number(all_gas_fee)
                        let block_time = proxyRes.block_time ? formatDate(proxyRes.block_time,true):""
                        
                        let type = 'pending'
                        if(proxyRes.height  && proxyRes.exit_code === 0){
                            type = 'success'
                        }
                        if(proxyRes.height && proxyRes.exit_code !== 0){
                            type = 'error'
                        }
                        let detail = {
                            from:proxyRes.from,
                            to:proxyRes.to,
                            nonce:proxyRes.nonce,
                            value,
                            all_gas_fee,
                            total_amount,
                            type,
                            signed_cid,
                            block_time
                        }
                        return detail
                    }else{
                        return null
                    }
                    break;
                case 'ethereum':
                    this.setBSCChainAPI()
                    this.BSCChainAPI.setProvider(this.rpc)
                    let ethRes = await this.BSCChainAPI.getTransaction(signed_cid)
                    let rptRes = await this.BSCChainAPI.getTransactionReceipt(signed_cid)
                    let block = await this.BSCChainAPI.getBlock(ethRes.blockNumber)
                    let type = rptRes.status === 1 ? 'success' : 'error'
                    let block_time = formatDate(block.timestamp,true)
                    let value = Number(ethRes.value.toString())
                    let all_gas_fee = Number(ethRes.gasPrice.toString()) * Number(ethRes.gasLimit.toString())
                    let total_amount = value + all_gas_fee
                    let detail = {
                        from:ethRes.from,
                        to:ethRes.to,
                        nonce:ethRes.nonce,
                        value,
                        all_gas_fee,
                        total_amount,
                        type,
                        block_time,
                        signed_cid
                    }
                    return detail
                    break;
                case 'filecoin':
                    this.setFilecoinAPI()
                    this.FilecoinAPI.setRpc(this.rpc)
                    let filRes = await this.FilecoinAPI.chainGetMessage(signed_cid)
                    let stateRes = await this.FilecoinAPI.stateGetReceipt(signed_cid)
                    if(filRes){
                        let all_gas_fee = Number(filRes.GasFeeCap) * Number(filRes.GasLimit)
                        let total_amount = Number(value) + all_gas_fee
                        let mType = 'pending'
                        if(stateRes.ExitCode === 0){
                            console.log(filRes,'888888222222')
                            mType = 'success'
                        }
                        if( stateRes.ExitCode && stateRes.ExitCode !== 0){
                            mType = 'error'
                        }
                        let detail = {
                            from:filRes.From,
                            to:filRes.To,
                            nonce:filRes.Nonce,
                            value:filRes.Value,
                            all_gas_fee,
                            total_amount,
                            type:mType,
                            signed_cid,
                            block_time:""
                        }
                        return detail
                    }else{
                        return null
                    }
                    break;
            }
        }catch(err){
            console.log(err,'GlobalApi.getTransaction')
            return null
        }
        
    }
    async getGasFee(from,to,nonce){
        try{
            switch (this.networkType){
                case 'proxy':
                    let params = [to, 0]
                    let result = await BaseFeeAndGas(params,this.rpc)
                    let proxyRes = result.data
                    console.log(proxyRes,'resss BaseFeeAndGas')
                    let gasLimit_proxy = 0
                    let gasPremium_proxy = 0
                    let gasFeeCap_proxy = 0
                    let { base_fee,gas_limit,gas_premium } = proxyRes
                    if(proxyRes.base_fee){
                        gasPremium_proxy = Number(gas_premium)
                        gasLimit_proxy = Number(gas_limit)
                        gasFeeCap_proxy = getGasFeeCap(base_fee,3,gasPremium_proxy,gasLimit_proxy,this.networkType)/Math.pow(10,9)
                    }
                    return {
                        gasLimit:gasLimit_proxy,
                        gasPremium:gasPremium_proxy,
                        gasFeeCap:gasFeeCap_proxy
                    }
                    break;
                case 'ethereum':
                    this.setBSCChainAPI()
                    this.BSCChainAPI.setProvider(this.rpc)
                    let gas = await this.BSCChainAPI.getGasPrice()
                    let tx = {
                        to: to,
                        value: ethers.utils.parseEther("1.0")
                    }
                    let limit = await this.BSCChainAPI.getEstimateGas(tx)
                    return {
                        gasLimit:Number(limit.toString()),
                        gasPremium:0,
                        gasFeeCap:Number(gas.toString())/Math.pow(10,9)
                    }
                    break;
                case 'filecoin':
                    this.setFilecoinAPI()
                    this.FilecoinAPI.setRpc(this.rpc)
                    let filRes = await this.FilecoinAPI.getBaseFeeAndGas(from,to,nonce)
                    let { gasLimit,gasPremium,gasFeeCap } = filRes
                    console.log(filRes,'filRes 1234')
                    return {
                        gasLimit,
                        gasPremium,
                        gasFeeCap:Number(gasFeeCap)/Math.pow(10,9)
                    }
                    break;
            }
            
        }catch(err){
            console.log(err,'getGasFee.err')
            return {
                gasLimit:0,
                gasPremium:0,
                gasFeeCap:0
            }
        }
    }
    async getPrice(ids){
        try{
            let res = await getPricePoints(ids)
            if(res && res.data){
                let data = res.data
                return {
                    usd:data.usd,
                    cny:data.cny
                }
            }else{
                return {
                    usd:0,
                    cny:0
                }
            }
        }catch(err){
            console.log(err,'getPrice.err')
            return {
                usd:0,
                cny:0
            }
        }
    }
    async getFIleCoinChainHead(rpc){
        try{
            this.setFilecoinAPI()
            this.FilecoinAPI.setRpc(rpc)
            let res = await this.FilecoinAPI.getStateNetworkName()
            if(res && res.result){
                if(res.result === 'mainnet'){
                    return {
                        networkType:'filecoin',
                        filecoinAddress0:'f',
                    }
                }else{
                    return{
                        networkType:'filecoin',
                        filecoinAddress0:'t',
                    }
                }
            }else{
                return{
                    networkType:'',
                    filecoinAddress0:'',
                }
            }

        }catch(error){
            console.log(error,'GlobalApi.getStateNetworkName err')
            return{
                networkType:'',
                filecoinAddress0:'',
            }
        }
    }
    async getBlockNumber(rpc){
        try{
            this.setBSCChainAPI()
            this.BSCChainAPI.setProvider(rpc)
            let res = await this.BSCChainAPI.getBlockNumber()
            console.log(res,'rreeess  1234')
            if(res){
                return{
                    networkType:'ethereum',
                    filecoinAddress0:'',
                }
            }else{
                return{
                    networkType:'',
                    filecoinAddress0:'',
                }
            }
        }catch(error){
            return{
                networkType:'',
                filecoinAddress0:'',
            }
        }
        
    }
}

class BSCChainAPI{
    constructor(){
        this.provider = null;
        this.walletWithProvider = null
    }
    setWalletWithProvider(privateKey){
        this.walletWithProvider = new ethers.Wallet(privateKey, this.provider)
    }
    setProvider(rpc){
        this.provider = ethers.getDefaultProvider(rpc);
    }
    async getBalance(address){
        try{
            let res = await this.provider.getBalance(address)
            let balance = Number(res.toString())
            return balance
        }catch(err){
            console.log(err,'BSCChainAPI.getBalance')
            return 0
        }
    }
    async sendTransaction(tx){
        try{
            let res = await this.walletWithProvider.sendTransaction(tx)
            return res
        }catch(err){
            console.log(err,'BSCChainAPI.sendTransaction')
            return null
        }
        
    }
    async getTransaction(hash){
        try{
            let res = await this.provider.getTransaction(hash)
            return res
        }catch(error){
            console.log(error,'BSCChainAPI.getTransaction error')
            return null
        }
        
    }
    async getTransactionReceipt(hash){
        try{
            let res = await this.provider.getTransactionReceipt(hash)
            return res
        }catch(error){
            console.log(error,'BSCChainAPI.getTransactionReceipt error')
            return null
        }
    }
    async getGasPrice(){
        try{
            let res = await this.provider.getGasPrice()
            return res
        }catch(err){
            console.log(err,'BSCChainAPI.getTransaction')
            return null
        }
        
    }
    async getEstimateGas(transaction){
        try{
            let res = await this.provider.estimateGas(transaction)
            return res
        }catch(err){
            console.log(err,'BSCChainAPI.getTransaction')
            return null
        }
        
    }
    async getBlock(block){
        try{
            let res = await this.provider.getBlock(block)
            return res
        }catch(err){
            console.log(err,'BSCChainAPI.getBlock')
            return null
        }
        
    }
    async getBlockNumber(rpc){
        try{
            let res = await this.provider.getBlockNumber()
            return res
        }catch(err){
            console.log(err,'BSCChainAPI.getBlockNumber')
            return null
        }
        
    }
}

class FilecoinAPI{
    constructor(){
        this.rpc = ''
    }
    setRpc(rpc){
        this.rpc = rpc
    }
    async getStateNetworkName(){
        try{
            let params = {
                "id": 0,
                "jsonrpc": "2.0",
                "method": "Filecoin.StateNetworkName",
                "params": []
            }
            let res = await request({
                url:this.rpc,
                method: 'post',
                data:params,
            })
            return res
        }catch(error){
            console.log(error,'error filecoin StateNetworkName')
        }
    }
    async getBalance(address){
        try{
            let params = {
                "id": 0,
                "jsonrpc": "2.0",
                "method": "Filecoin.WalletBalance",
                "params": [address]
            }
            let res = await request({
                url:this.rpc,
                method: 'post',
                data:params,
            })
            if(res && res.result){
                let balance = Number(res.result || 0)
                return balance
            }else{
                return 0
            }
        }catch(error){
            console.log(error,'error filecoin getBalance')
            return 0
        }
    }
    async getBaseFeeAndGas(from,to,nonce){
        try{
            let params = {
                "id": 0,
                "jsonrpc": "2.0",
                "method": "Filecoin.GasEstimateMessageGas",
                "params": [
                    {
                        "Version": 0,
                        "To": to,
                        "From": from,
                        "Nonce": nonce,
                        "Value": "0",
                        "GasLimit": 0,
                        "GasFeeCap": "0",
                        "GasPremium": "0",
                        "Method": 0,
                        "Params": null
                    },
                    {
                        "MaxFee":"0"
                    },
                    []
                ]
            }
            let res = await request({
                url:this.rpc,
                method: 'post',
                data:params,
            })
            let gasLimit = 0
            let gasPremium = 0
            let gasFeeCap = 0
            console.log(res,'getBaseFeeAndGas res')
            if(res && res.result){
                gasLimit = res.result.GasLimit
                gasPremium = res.result.GasPremium
                gasFeeCap = res.result.GasFeeCap
            }
            return {
                gasLimit,
                gasPremium,
                gasFeeCap
            }
        }catch(error){
            console.log(error,'getBaseFeeAndGas err')
            return {
                gasLimit:0,
                gasPremium:0,
                gasFeeCap:0
            }
        }
    }
    async getNonce(address){
        try{
            let params = {
                "id": 0,
                "jsonrpc": "2.0",
                "method": "Filecoin.MpoolGetNonce",
                "params": [address]
            }
            let res = await request({
                url:this.rpc,
                method: 'post',
                data:params,
            })
            if(res && res.result){
                return res.result
            }else{
                return 0
            }
        }catch(error){
            return 0
        }
    }
    async MpoolPush(data){
        try{
            let params = {
                "id": 0,
                "jsonrpc": "2.0",
                "method": "Filecoin.MpoolPush",
                "params": data
            }
            let res = await request({
                url:this.rpc,
                method: 'post',
                data:params,
            })
            if(res && res.result){
                return res.result['/']
            }else{
                return ''
            }
        }catch(error){
            return ''
        }
    }
    async chainGetMessage(hash){
        try{
            let params = {
                "id": 0,
                "jsonrpc": "2.0",
                "method": "Filecoin.ChainGetMessage",
                "params": [ 
                    {
                        '/':hash
                    } 
                ]
            }
            let res = await request({
                url:this.rpc,
                method: 'post',
                data:params,
            })
            if(res && res.result){
                return res.result
            }else{
                return null
            }
        }catch(error){
            console.log(err,'err chainGetMessage')
            return null
        }
    }
    async stateGetReceipt(hash){
        try{
            let params = {
                "id": 0,
                "jsonrpc": "2.0",
                "method": "Filecoin.StateGetReceipt",
                "params": [ 
                    {
                        '/':hash
                    },
                    []
                ]
            }
            let res = await request({
                url:this.rpc,
                method: 'post',
                data:params,
            })
            if(res && res.result){
                return res.result
            }else{
                return null
            }
        }catch(error){
            console.log(error,'err StateGetReceipt')
            return null
        }
    }
}

export const MyGlobalApi = new GlobalApi()