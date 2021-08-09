<template>               
    <div class="transaction-item-components" >
        <div class="block-time">
            {{item.block_time}}
        </div>
        <div class="info-wrap">
            <div class="icon reveiced" v-if="item.type === 'success' && item.to === address">
                <img class="img" :src="send" />
            </div>
            <div class="icon send" v-else-if="item.type === 'success' && item.from === address">
                <img class="img" :src="rec" />
            </div>
            <div class="icon pending" v-if="item.type === 'pending'">
                <img class="img" :src="pending" />
            </div>
            <div class="icon error" v-if="item.type === 'error'">
                <img class="img" :src="error" />
            </div>
            <div class="des">
                <div class="name">{{item.typeName}}</div>
                <div class="from-to">
                    <span :class="{from:address === item.from}">{{item.from | addressFormat}} </span>
                    - 
                    <span :class="{to:address === item.to}">{{item.to |addressFormat }}</span>
                </div>
            </div>
            <div class="amount">
                <div class="fil">{{ Number(item.value) }} {{symbol}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { getNowFormatDateEn } from '@/utils'
import transactionItem from './transaction-item.vue'
export default {
    data(){
        return{
            rec:require('@/assets/image/rec.png'),
            send:require('@/assets/image/send.png'),
            pending:require('@/assets/image/pending.png'),
            error:require('@/assets/image/fail.png'),
        }
    },
    filters:{
        addressFormat(val){
            if(val.length>12){
                return val.substr(0,6) + '...' + val.substr(val.length-6,6)
            }else{
                return val
            } 
        },
        formatBalance(val,n){
            var str = String(val);
            let index = str.indexOf('.')
            if(index > -1){
                let arr = str.split(".")
                let num = arr[0] + "." + arr[1].substring(0,n)
                return num
            }else{
                return val
            }
        }
    },
    props:{
        item:Object
    },
    computed:{
        ...mapState('app',['address'])
    },
    methods:{
        skipToToken(item){
            this.$emit('tokenShow',item)
        },
        refreshList(){
            
        },
        selectType(type){
            this.type = type
        },
        showDetail(signed_cid,obj){
            console.log(signed_cid,obj,'signed_cid,obj')
            this.$emit('openDetail',signed_cid,obj)
        },
    }
}
</script>

<style lang="less" scoped>
.transaction-item-components{
    padding: 5px 20px 15px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    .info-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .block-time{
        color: #ccc;
        font-size: 12px;
        margin-bottom: 10px;
    }
    .icon{
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        &.reveiced{
            background: #5CC1CB;
        }
        &.send{
            background: #5C8BCB;
        }
        &.pending{
            background: #E8CC5C;
        }
        &.error{
            background: #B4B5B7;
        }
        .img{
            width:22px;
            height: 22px;
        }
    }
    .des{
        flex-grow: 1;
        padding-left: 15px;
        .name{
            font-size: 14px;
            color: #222;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .from-to{
            font-size: 12px;
            color:#5CC1CB;
            .from{
                color: #999;
            }
            .to{
                color:#999;
            }
        }
    }
    .amount{
        flex: 0 0 72px;
        width: 72px;
        .fil{
            font-size: 14px;
            color: #222;
            margin-bottom: 5px;
            font-weight: bold;
            width: 100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            text-align: right;
        }
        .usd{
            font-size: 12px;
            color: #999;
        }
    }
}
</style>