<template>
    <div class="token-components">
        <div class="top-back">
            <kyBack :name="tokenName" @pageBack='closeToken'/>
        </div>
        <div class="logo"></div>
        <div class="balance">{{balance|formatBalance(tokenDecimals)}} {{symbol1}}</div>
        <div class="usd">$ {{balance|formatUsd(price_usd,tokenDecimals)}}</div>
        <div class="action">
            <div class="receive" @click="openReceive">
                <div class="icon">
                    <img class="img" :src="send" />
                </div>
                <div class="text">{{$t('wallet.receive')}}</div>
            </div>
            <div class="send" @click="sendFil">
                <div class="icon">
                    <img class="img" :src="rec" />
                </div>
                <div class="text">{{$t('wallet.send')}}</div>
            </div>
        </div>
        <div class="list-tab">{{$t('wallet.tranRecord')}}</div>
        <div class="list">
            <div class="item-wrap" v-for="(item,index) in activityList" :key="index" @click="showDetail(item)">
                <transactionItem :item="item" />
            </div>
        </div>
    </div>
</template>

<script>
import kyBack from '@/components/back'
import { mapState } from 'vuex';
import transactionItem from './transaction-item.vue'
export default {
    data(){
        return{
            rec:require('@/assets/image/rec.png'),
            send:require('@/assets/image/send.png'),
            activityList:[]
        }
    },
    props:{
        tokenName:String,
        balance:Number,
        price_usd:Number,
        receiveVisible:Boolean,
        tokenVisible:Boolean,
        symbol1:String,
        tokenDecimals:Number
    },
    filters:{
        formatBalance(val,decimals){
            let dec = val / Math.pow(10,Number(decimals))
            var str = String(dec);
            let index = str.indexOf('.')
            if(index > -1){
                let arr = str.split(".")
                let num = arr[0] + "." + arr[1].substring(0,8)
                return num
            }else{
                return dec
            }
        },
        formatUsd(val,usd,decimals){
            let num = val * usd
            let dec = num / Math.pow(10,Number(decimals))
            let str = String(dec)
            let index = str.indexOf('.')
            if(index > -1){
                let arr = str.split(".")
                let n = arr[0] + "." + arr[1].substring(0,2)
                return n
            }else{
                return dec
            }
        }
    },
    components:{
        kyBack,
        transactionItem
    },
    async mounted(){
        let activityList = await window.filecoinwalletDb.messageList.where({ 
            rpc:this.rpc,
            token:this.tokenName
        }).toArray () || [];
        this.activityList = activityList
    },
    methods:{
        closeToken(){
            this.$emit("closeToken")
        },
        sendFil(){
            window.location.href = './send-fil.html'
        },
        openReceive(){
            this.$emit("update:receiveVisible",true)
        },
        showDetail(item){
            let { from,to,fil,all_gas_fee,create_time,block_time,type,signed_cid,value,serviceFee,token } = item
            let listObj = { from,to,fil,all_gas_fee,create_time,block_time,type,signed_cid,value,serviceFee,token }
            let listObjStr = JSON.stringify(listObj)
            window.location.href = `./message-detail.html?signed_cid=${signed_cid}&listObjStr=${listObjStr}`
        }
    }
}
</script>
<style lang="less" scoped>
.token-components{
    .top-back{
        padding: 20px;
        border-bottom: 1px solid #F6F7FF;
        margin-bottom: 20px;
    }
    .logo{

    }
    .balance{
        font-size: 26px;
        color: #131313;
        line-height: 30px;
        text-align: center;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .usd{
        font-size: 16px;
        color: #6A6767;
        line-height: 18px;
        margin-bottom: 15px;
        text-align: center;
    }
    .action{
        display: flex;
        justify-content: center;
        .receive{
            margin-right: 40px;
            .icon{
                background: #5CC1CB;
            }
        }
        .send{
            .icon{
                background: #5C8BCB;
            }
        }
        .receive,.send{
            text-align: center;
            cursor: pointer;
            .icon{
                width: 30px;
                height: 30px;
                border-radius: 15px;
                margin: 0 auto 6px;
                line-height: 30px;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                .img{
                    width: 22px;
                    height: 22px;
                }
            }
            .text{
                font-size: 14px;
                color: #999;

            }
        }
    }
    .list-tab{
        font-size: 14px;
        color: #5CC1CB;
        padding: 10px 0;
        text-align: center;
        border-bottom: 2px solid #5CC1CB;
    }
}
</style>
