<template>
    <div class="list-wrap">
        <div class="tab">
            <div class="tab-item" v-for="(item,index) in $t('wallet.tab')" 
                :key="index" 
                :class="{active:type === item.type}"
                @click="selectType(item.type)"
            >
                {{ item.name }}
            </div>
        </div>
        <div class="list">
            <div class="list-property-wrap" v-if="type === '1'">
                <div class="list-property">
                    <div class="list-item" @click="skipToToken(symbol,decimals,balance,1)">
                        <div class="logo" v-if="activenNetworks.length">
                            <div class="img-wrap" v-if="owenChain">
                                <img class="img" :src="require(`@/assets/svg/${chainImg}`)"/>
                            </div>
                            <div class="custom-img" v-else>{{chainName.substring(0,1)}}</div>
                        </div>
                        <div class="fil-amount">{{balance|formatBalance(8,decimals)}} {{symbol}}</div>
                        <div class="amount">
                            <div class="usd">
                                {{ currency === 'cny' ? "¥" : "$"}} 
                                {{(balance)|formatUsd(2,decimals,price_currency)}}
                            </div>
                        </div>
                    </div>
                    <div 
                        class="list-item" 
                        v-for="(item,index) in tokenList" 
                        :key="index" 
                        @click="skipToToken(item.symbol,item.decimals,item.balance,0)"
                    >
                        <div class="logo">
                            <kyCanvas :contract="item.contract" />
                        </div>
                        <div class="fil-amount">{{item.balance|formatBalance(8,item.decimals)}} {{item.symbol}}</div>
                        <!-- <div class="amount">
                            <div class="usd">
                                {{ currency === 'cny' ? "¥" : "$"}} 
                                {{(item.balance)|formatUsd(2,item.decimals,price_currency)}}
                            </div>
                        </div> -->
                    </div>
                </div>

                <div class="add-token" v-if="networkType === 'ethereum'" @click="addToken">
                    <i class="el-icon-plus"></i>
                </div>
            </div>
            <div class="list-activity" v-if="type === '2'">
                <div class="activity-item">
                    <div class="activity-wrap"> 
                        <div class="item-wrap" v-for="(item,index) in activityList" :key="index" @click="showDetail(item)">
                            <transactionItem :item="item" />
                        </div>
                    </div>
                    <div class="no-data" v-if="!activityList.length">{{$t('wallet.noTransactionRecord')}}</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getQueryString,formatNumber,minimumPrecision } from '@/utils'
import transactionItem from './transaction-item.vue'
import ABI from '@/utils/abi'
import { ethers } from 'ethers'
import { MyGlobalApi } from '@/utils/api'
import { BigNumber } from "bignumber.js";

import kyCanvas from "@/components/canvas";
export default {
    data(){
        return{
            type:'1',
            activityList:[],
            tokenList:[]
        }
    },
    props:{
        price_currency:Number,
        balance:Number
    },
    filters:{
        addressFormat(val){
            if(val.length>12){
                return val.substr(0,6) + '...' + val.substr(val.length-6,6)
            }else{
                return val
            } 
        },
        formatBalance(val,n,decimals){
            if(decimals){
                let dec = val / Math.pow(10,Number(decimals))
                let big = new BigNumber(dec)
                let str = big.toFixed()
                if( dec !== 0 && dec < minimumPrecision){
                    let min = new BigNumber(minimumPrecision).toFixed()
                    return "<" + min
                }else{
                    let num = formatNumber(str,n)
                    return num 
                }
            }else{
                return 0
            }
        },
        formatUsd(val,n,decimals,price_currency){
            if(decimals){
                let dec = val / Math.pow(10,Number(decimals))
                let big = new BigNumber(dec)
                let str = big.toFixed()
                if(dec < minimumPrecision ){
                    return 0
                }else{
                    let dep = dec * price_currency
                    let ss = new BigNumber(dep).toFixed()
                    let num = formatNumber(ss,n)
                    return num
                }
            }else{
                return 0
            }
        }
    },
    computed:{
        ...mapState('app',[
            'address',
            'rpc',
            'symbol',
            'networkType',
            'decimals',
            'currency',
            'activenNetworks'
        ]),
        owenChain(){
            let volid = false
            if(this.activenNetworks.length){
                 volid = this.activenNetworks[0].disabled
            }
            return volid
        },
        chainImg(){
            let src = ''
            if(this.activenNetworks.length){
                 src = this.activenNetworks[0].image
            }
            return src
        },
        chainName(){
            let name = ''
            if(this.activenNetworks.length){
                 name = this.activenNetworks[0].name
            }
            return name
        }
    },
    components:{
        transactionItem,
        kyCanvas
    },
    watch:{
        // monitoring RPC changes 
        async rpc(val){
            if(val){
                await this.getTokenList()
                await this.updateActivityList()
                await this.getActivityList()
            }
        }
    },
    async mounted(){
        let fromPage = getQueryString('fromPage')
        if(fromPage === 'sendFil' || fromPage === 'messageDetail'){
            this.type = '2'
        }
        // get assets list
        this.getTokenList()
        // update activity list
        this.updateActivityList()
        // get activity list
        this.getActivityList()
    },
    methods:{
        async updateActivityList(){
            let mesList = await window.filecoinwalletDb.messageList.where({ 
                rpc:this.rpc
            }).toArray ()
            let myMesList = mesList.filter(n=>{
                return n.from === this.address || n.to === this.address
            })
            myMesList.forEach(async (n)=>{
                // Get status
                if(n.type === 'pending'){
                    let itemRes = await this.getDetail(n.signed_cid,n)
                    console.log(itemRes,'itemRes 33333')
                    if(itemRes){
                        // get detail, update db messageList (type,allGasFee,block_time)
                        if(itemRes){
                            await window.filecoinwalletDb.messageList.where("signed_cid").equals(n.signed_cid).modify({
                                type:itemRes.type,
                                allGasFee:itemRes.all_gas_fee,
                                block_time:itemRes.block_time
                            })
                        }
                    }
                }
            })
            // delete same nonce （ type = pending）
            this.deleteSameNonce()
        },
        async getActivityList(){
            let mesList = await window.filecoinwalletDb.messageList.where({ 
                rpc:this.rpc
            }).reverse().sortBy('create_time')|| []
            let myMesList = mesList.filter(n=>{
                return n.from === this.address || n.to === this.address
            })
            this.activityList = myMesList
        },
        // get token list
        async getTokenList(){
            let list = await window.filecoinwalletDb.tokenList.where({ 
                rpc:this.rpc,
                address:this.address
            }).toArray () || [];
            let tokenList = []
            let provider = ethers.getDefaultProvider(this.rpc);
            list.forEach(async (n)=>{
                try{
                    let contract = new ethers.Contract(n.contract, ABI, provider);
                    // get balance by address
                    contract.balanceOf(this.address).then(res=>{
                        let balance = res.toString()
                        let num = Number(balance)
                        tokenList.push(
                            {
                                ...n,
                                balance:num
                            }
                        )
                    })
                }catch(err){
                    console.log(err,'contract.balanceOf error')
                }
            })
            this.tokenList = tokenList
            return tokenList
        },
        // get detail by hash
        async getDetail(signed_cid,itemObj){
            MyGlobalApi.setRpc(this.rpc)
            MyGlobalApi.setNetworkType(this.networkType)
            let detail = await MyGlobalApi.getTransaction(signed_cid)
            return detail
        },
        skipToToken(symbol,decimals,balance,isMain){
            this.$emit('tokenShow',{symbol,decimals,balance,isMain})
        },
        async deleteSameNonce(){
            let mesList = await window.filecoinwalletDb.messageList.where({ 
                rpc:this.rpc,
                address:this.address
            })
            let obj = {};
            let nonce = 0
            for(var i =0; i<mesList.length; i++){
                if(!obj.nonce){
                    obj.nonce = mesList[i].nonce
                }else{
                    nonce = mesList[i].nonce
                }
            }
            if(nonce){
                console(nonce,'delete nonce')
                await window.filecoinwalletDb.messageList.where({ 
                    rpc:this.rpc,
                    address:this.address,
                    nonce,
                    type:'pending'
                }).delete()
            }
        },
        selectType(type){
            this.type = type
        },
        showDetail(item){
            let { 
                from,
                to,
                fil,
                all_gas_fee,
                create_time,
                block_time,
                type,
                signed_cid,
                value,
                allGasFee,
                token,
                decimals 
            } = item
            let listObj = { 
                from,
                to,
                fil,
                all_gas_fee,
                create_time,
                block_time,
                type,
                signed_cid,
                value,
                allGasFee,
                token,
                decimals 
            }
            let listObjStr = JSON.stringify(listObj)
            window.location.href = `./message-detail.html?signed_cid=${signed_cid}&listObjStr=${listObjStr}`
        },
        addToken(){
            window.location.href = './add-token.html'
        }
    }
}
</script>

<style lang="less" scoped>

@keyframes rotate{
	0%{
		transform: rotateZ(0deg);/*从0度开始*/
	}
	100%{
		transform: rotateZ(360deg);/*360度结束*/
	}
}
    .list-wrap{
        .tab{
            display: flex;
            .tab-item{
                height: 40px;
                line-height: 40px;
                color: #222;
                text-align: center;
                flex-grow: 1;
                cursor: pointer;
                font-size: 14px;
                &.active{
                    color: #5CC1CB;
                    position: relative;
                    &::after{
                        content: '';
                        width: 100%;
                        height: 2px;
                        background: #5CC1CB;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                    }
                }
            }
        }
        .list{
            .list-property-wrap{
                position: relative;
                height: 240px;
                padding-bottom: 50px;
                .add-token{
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    border-radius: 12px;
                    background: #5CC1CB;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    i{
                        font-size: 18px;
                        color: #fff;
                        font-weight: bold;
                        margin-bottom: 3px;
                    }
                }
            }
            .list-property{
                height: 235px;
                overflow-y: auto;
                .list-item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    cursor: pointer;
                    .logo{
                        width: 30px;
                        height: 30px;
                        border-radius: 15px;
                        .img-wrap{
                            width: 30px;
                            height: 30px;
                            .img{
                                width: 30px;
                                height: 30px; 
                            }
                        }
                        .custom-img{
                            background: #5CC1CB;
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 18px;
                            color: #fff;
                            border-radius: 15px;
                            line-height: 30px;
                        }
                    }
                    .amount{
                        padding-left: 5px;
                        .fil{
                            font-size: 16px;
                            color: #222;
                            font-weight: bolder;
                        }
                        .usd{
                            font-size: 12px;
                            color: #999;
                        }
                    }
                    .fil-amount{
                        flex-grow: 1;
                        padding-left: 10px;
                        font-size: 12px;
                        color: #131313;
                        font-weight: bolder;
                    }
                }
            }
            .list-activity{
                .no-data{
                    padding: 15px 0;
                    font-size: 16px;
                    text-align: center;
                    color: #c2c2c2;
                }
            }
        }
    }
</style>
