<template>
<div class="send-fil-component">
    <div class="top-title">
        <div class="text">{{$t('sendFil.addReveice')}}</div>
        <div class="cancel" @click="cancel">{{$t('sendFil.cancel')}}</div>
    </div>
    <div class="search">
        <el-input v-model="toValue" :clearable="clearable" @input="searchChange" @clear="clear">
            <i class="el-icon-search" slot="prepend"></i>
        </el-input>
    </div>
    <div class="add-address-box" v-if="pageType === 'add-address'">
        <div class="my-address 22" v-if="toMyAddressvisible" @click="toMyAddress">{{$t('sendFil.inMyAccount')}}</div>
        <div class="recently-name" v-if="addressRecordLast.length">{{$t('sendFil.lastRecord')}}</div>
        <div class="recently-list" v-if="addressRecordLast.length">
            <div class="recently-item" v-for="(item,index) in addressRecordLast" :key="index" @click="addressClick(item.address)">
                {{item.address| addressFormat}}
            </div>
        </div>
        <div class="address-name" v-if="addressBook.length">{{$t('sendFil.addressBook')}}</div>
        <div class="address-list" v-if="addressBook.length">
            <div class="address-item" v-for="(item,index) in addressBook" :key="index" @click="addressClick(item.address)">
                <div class="name">{{item.name}}</div>
                <div class="address">{{item.address| addressFormat}}</div>
            </div>
        </div>
    </div>

    <div class="send-fil-box" v-if="pageType === 'send-fil'">
        <div class="new-address" v-if="newAddress" @click="toAddressBook">{{$t('sendFil.addToaddress')}}</div>
        <div class="detail-item">
            <div class="label">{{$t('sendFil.property')}}</div>
            <div class="value">
                <div class="logo">
                    <img class="img" :src="logo" />
                </div>
                <div class="fil-m">
                    <div class="balance">{{$t('sendFil.balance')}}:{{balance}} FIL</div>
                </div>
            </div>
        </div>
        <div class="detail-item">
            <div class="label">{{$t('sendFil.amount')}}</div>
            <div class="value">
                <div class="fil-m">
                    <div class="fil">
                        <el-input v-model="filValue" type="number"></el-input>
                        <span>FIL</span>
                    </div>
                    <div class="usd"> {{filUsd}} USD</div>
                </div>
            </div>
        </div>
        <div class="detail-item">
            <div class="label">{{$t('sendFil.cost')}}</div>
            <div class="systom-cost" v-if="type !== 3">
                <div class="value-item" :class="{active:fast.type === type}" @click="selectCost(fast.type)">
                    <div class="type">{{fast.name}}</div>
                    <div class="fil">{{formatFil(fast.cost) }}</div>
                    <div class="usd"> {{(fast.cost*price_usd/Math.pow(10, 18)).toFixed(8)}} USD</div>
                </div>
                <div class="value-item" :class="{active:ordinary.type === type}" @click="selectCost(ordinary.type)">
                    <div class="type">{{ordinary.name}}</div>
                    <div class="fil">{{formatFil(ordinary.cost) }}</div>
                    <div class="usd">{{(ordinary.cost*price_usd/Math.pow(10, 18)).toFixed(8)}} USD</div>
                </div>
            </div>
            <div class="custom-cost" v-else>
                <div class="left">
                    <div class="fil">{{formatFil(custom.cost)}}</div>
                    <div class="usd">{{(custom.cost*price_usd/Math.pow(10, 18)).toFixed(2)}} USD</div>
                </div>
                <div class="right" @click="reset">{{$t('sendFil.reset')}}</div>
            </div>
        </div>
        <div class="custom" @click="openDialog">
            <div class="text">{{$t('sendFil.custom')}}</div>
        </div>
        <div class="position">
            <div class="btn-wrap">
                <el-button @click="cancel">{{$t('sendFil.cancel')}}</el-button>
                <el-button type="primary" :disabled="!disabled" @click="next">{{$t('sendFil.next')}}</el-button>
            </div>
        </div>
    </div>

    <div class="my-address-list" v-if="pageType === 'my-address'">
        <div class="back" @click="back">{{$t('sendFil.backAll')}}</div>
        <div class="my-address-name">{{$t('sendFil.myAccount')}}</div>
        <div class="my-list">
            <div class="my-item" v-for="(item,index) in accountList" :key="index" @click="addressClick(item.address)">
                <div class="name">{{item.accountName}}</div>
                <div class="address">{{item.address| addressFormat}}</div>
            </div>
        </div>
    </div>

    <div class="search-error" v-if="pageType === 'address-error'"> {{$t('sendFil.invalidReceiverAddress')}}</div>
    
</div>
</template>

<script>
import { isValidAddress,formatFilNum} from '@/utils'
export default {
    data(){
        return{
            filValue:'',
            toValue:'',
            clearable:true,
            logo:require('@/assets/image/logo.png'),
            // pageType:'add-address'， send-fil , add-address , my-address , address-error
            addressRecordLast:[],
            addressBook:[],
            accountList:[],
            newAddress:true
        }
    },
    props:{
        balance:Number,
        type:Number,
        price_usd:Number,
        customVisible:Boolean,
        address:String,
        ordinary:Object,
        fast:Object,
        custom:Object,
        step:Number,
        to:String,
        fil:Number,
        pageType:String
    },
    filters:{
        addressFormat(val){
            if(val.length>12){
                return val.substr(0,6) + '...' + val.substr(val.length-6,6)
            }else{
                return val
            } 
        },
    },
    computed:{
        disabled(){
            return this.to !== '' && this.filValue !== ''
        },
        filUsd(){
            let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/
            let volid = reg.test(this.filValue)
            if(volid) {
                return (this.filValue * this.price_usd).toFixed(2)
            }else{
                return 0
            }
        },
        pageName(){
            let name = ''
            switch(this.pageType){
                case 'add-address':
                    name = this.$t('sendFil.addReveice')
                    break;
                case 'send-fil':
                    name = this.$t('sendFil.sendFil')
                    break;
                case 'my-address':
                    name = this.$t('sendFil.addReveice')
                    break;
                case 'add-address':
                    name = this.$t('sendFil.addReveice')
                    break;
            }
            return name
        },
        toMyAddressvisible(){
            return this.accountList.length > 1
        }
    },
    watch:{
        filValue(val){
            if(val){
                this.$emit("update:fil",Number(val)||0)
            }else{
                this.$emit("update:fil",0)
            }
        },
        toValue(val){
            if(val){
                let voild = this.addressBook.some(n=>{
                    return n.address !== val
                })
                console.log(voild,'ccww')
                this.newAddress = voild
                this.$emit("update:to",val)
            }else{
                this.newAddress = false
                this.$emit("update:to",'')
            }
        }
    },
    async mounted(){
        if(this.fil){
            this.filValue = this.fil
        }
        this.toValue = this.to
        let addressRecordLast = await window.filecoinwalletDb.addressRecordLast.where({ kunyao:'kunyao'}).toArray () || [];
        this.addressRecordLast = addressRecordLast.filter(n=>{
            return n.address === this.address
        })
        let addressBook = await window.filecoinwalletDb.addressBook.where({ kunyao:'kunyao'}).toArray () || [];
        this.addressBook = addressBook
        let accountList = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray () || [];
        this.accountList = accountList
        console.log(this.balance,'balancebalancebalancebalance')
    },
    methods:{
        cancel(){
            window.location.href = './wallet.html'
        },
        formatFil(fil){
            return formatFilNum(fil/Math.pow(10, 18))
        },
        async searchChange(){
            if(this.toValue === '') return
            let voild = !isValidAddress(this.toValue)
            if(voild){
                this.$emit('update:pageType','address-error')
            }else{
                this.$emit('update:pageType','send-fil')
                // address,create_time,kunyao
                let create_time =  parseInt(new Date().getTime() / 1000)
                await window.filecoinwalletDb.addressRecordLast.add({
                    address:this.toValue,
                    create_time,
                    kunyao:'kunyao'
                })
            }
        },
        clear(){
          this.$emit('update:pageType','add-address')
        },
        toMyAddress(){
          this.$emit('update:pageType','my-address')
        },
        back(){
          this.$emit('update:pageType','add-address')
        },
        selectCost(type){
            if(type === 3){
                this.$emit('update:customVisible', true)
            }else{
                this.$emit('update:type', type)
            }
        },
        openDialog(){
            this.$emit('update:customVisible', true)
        },
        addressClick(address){
            let voild = !isValidAddress(address)
            if(voild){
                this.$emit('update:pageType','address-error')
            }else{
                this.$emit('update:pageType','send-fil')
                this.toValue = address
            }
        },
        next(){
            this.$emit('next')
        },
        reset(){
            this.$emit('reset')
        },
        toAddressBook(){
            window.location.href = `./setting-address.html?to=${this.toValue}`
        }
    }
}
</script>

<style  lang="less" scoped>
.send-fil-component{
    .my-address{
        padding: 10px 20px;
        font-size: 14px;
        color: #5CC1CB;
        background: #fff;
        cursor: pointer;
    }
    .recently-name{
        font-size: 14px; 
        color: #999;
        padding: 10px 20px;
    }
    .recently-list{
        .recently-item{
            background: #fff;
            font-size: 14px;
            color: #222;
            padding: 10px 20px;
            cursor: pointer;
        }
    }
    .address-name{
        font-size: 14px; 
        color: #999;
        padding: 10px 20px;
    }
    .address-list{
        .address-item{
            background: #fff;
            font-size: 14px;
            padding: 10px 20px;
            cursor: pointer;
            .name{
                color: #222;
            }
            .address{
                color: #999;
            }
        }
    }
    .search{
        padding: 0 10px;
        margin-bottom: 10px;
    }
    .search-error{
        background: #FCF2F3;
        border: 1px solid #EFB5BA;
        color: #C54A57;
        font-size: 14px;
        padding: 15px 10px;
        border-radius: 10px;
        width: calc(100% - 20px);
        margin: 0 auto;
        box-sizing: border-box;
    }
    .top-title{
        position: relative;
        padding: 10px 0;
        .text{
            font-size: 14px;
            color: #222;
            font-weight: bolder;
            text-align: center;
        }
        .cancel{
            position: absolute;
            top: 50%;
            right:10px;
            transform: translateY(-50%);
            font-size: 14px;
            color: #5CC1CB;
            cursor: pointer;
        }
    }
    .send-fil-box{
        background: #fff;
        padding: 10px;
        height: 430px;
        position: relative;
        .new-address{
            background: #ECF6FE;
            font-size: 14px;
            padding: 15px 10px;
            border-radius: 10px;
            width: 100%;
            margin: 0 auto;
            box-sizing: border-box;
            border: 1px solid #9FC2E8;
            color: #5CC1CB;
            margin-bottom: 10px;
            cursor: pointer;
        }
        .detail-item{
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .label{
                width: 100px;
            }
            .value{
                padding: 10px;
                border:1px solid #eee;
                flex-grow: 1;
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #666;
                .logo{
                    width: 24px;
                    height: 24px;
                    .img{
                        width: 24px;
                        height: 24px;
                    }
                }
                .fil-m{
                    padding-left: 15px;
                    .fil{
                        margin-bottom: 5px;
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        color: #666;
                        /deep/.el-input{
                            width: 100px;
                            padding-right: 10px;
                            .el-input__inner{
                                height: 30px;
                                line-height: 30px;
                            }
                        }
                    }
                    .usd{
                        font-size: 12px;
                        color: #666;
                    }
                }
            }
            .systom-cost{
                display: flex;
                flex-grow: 1;
                .value-item{
                    background: 10px;
                    font-size: 14px;
                    background: #fff;
                    border:1px solid #eee;
                    flex-grow: 1;
                    padding: 10px;
                    font-size: 12px;
                    color: #999;
                    height: 65px;
                    box-sizing: border-box;
                    flex:0 0 50%;
                    &.active{
                        background: #5CC1CB;
                        color: #fff;
                    }
                    .type{
                        margin-bottom: 5px;
                    }
                }
            }
            .custom-cost{
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-grow: 1;
                padding: 10px;
                border:1px solid #eee;
                .left{
                    .fil{
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .usd{
                        font-size: 12px;
                        color: #666;
                    }
                }
                .right{
                    color: #5CC1CB;
                    font-size: 14px;
                    cursor: pointer;
                }
            }
        }
        .custom{
            display: flex;
            padding: 10px;
            color: #5CC1CB;
            font-size: 14px;
            text-align: right;
            cursor: pointer;
            justify-content: flex-end;
        }
        .position{
            position: absolute;
            left: 0;
            bottom: 0;
            padding:10px;
            border-top: 1px solid #eee;
            width: 100%;
            box-sizing: border-box;
            .btn-wrap{
                display: flex;
                /deep/.el-button{
                    flex-grow: 1;
                }
            }
        }
    }
    .my-address-list{
        .back{
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            color: #5CC1CB;
            margin-bottom: 10px;
            background: #fff;

        }
        .my-address-name{
            font-size: 14px; 
            color: #999;
            padding: 10px 20px;
            margin-bottom: 10px;
            background: #fff;
        }
        .my-list{
            background: #fff;
            .my-item{
                font-size: 14px;
                padding: 10px 20px;
                border-bottom:1px solid #DCDFE6;
                cursor: pointer;
                .name{
                    color: #222;
                }
                .address{
                    color: #999;
                }
            }
        }
    }
}
</style>
