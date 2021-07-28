<template>
<div class="address-list">
    <div class="back" v-if="listType !=='my-account'">
        <i class="el-icon-arrow-left" @click="back"></i>
        <span>{{$t('settingAddress.addressBook')}}</span>
        <i class="el-icon-close" @click="closeSetting"></i>
    </div>
    <div class="address-tips" @click="toMyAddress" v-if="listType !=='my-account'">
        <div class="c-top">{{$t('settingAddress.myWallet')}}</div>
        <div class="c-bottom">{{$t('settingAddress.autoAdd')}}</div>
        <div class="close"><i class="el-icon-arrow-right"></i></div>
    </div>
    <div class="my-account" v-if="listType ==='my-account'">
        <div class="back-last-book" @click="backLastBook">
            <i class="el-icon-arrow-left"></i>
            <span>{{$t('settingAddress.myWallet')}}</span>
        </div>
        <div class="address-item" v-for="(item,index) in accountList" :key="index">
            <div class="addrname">{{item.accountName}}</div>
            <div class="addr">{{item.address}}</div>
        </div>
    </div>
    <div class="last-book" v-else>
        <div class="last-name" v-if="addressRecordLast.length">{{$t('settingAddress.lastRecord')}}</div>
        <div class="last-list" v-if="addressRecordLast.length">
            <div class="address-item" v-for="(item,index) in addressRecordLast" :key="index" @click="addressClick(item)">
                <div class="addr">{{item.address}}</div>
                <div class="a-right"><i class="el-icon-arrow-right"></i></div>
            </div>
        </div>
        <div class="book-name" v-if="addressBook.length">{{$t('settingAddress.addressBook')}}</div>
        <div class="book-list" v-if="addressBook.length">
            <div class="address-item" v-for="(item,index) in addressBook" :key="index" @click="addressClick(item)">
                <div class="addr">
                    <div class="name">{{item.name}}</div>
                    <div class="add">{{item.address}}</div>
                </div>
                <div class="a-right"><i class="el-icon-arrow-right"></i></div>
            </div>
        </div>
    </div>
    <div class="position" v-if="listType !=='my-account'">
        <div class="add-btn">
            <el-button type="primary" @click="addAddress">{{$t('settingAddress.add')}}</el-button>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            // my-account last-book
            listType:'last-book',
            addressRecordLast:[],
            addressBook:[],
            accountList:[]
        }
    },
    props:{
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
    async mounted(){
        let activeAccount = await window.filecoinwalletDb.activeAccount.where({ kunyao:'kunyao'}).toArray ()|| [];
        let address = activeAccount.length && activeAccount[0].address
        let addressRecordLast = await window.filecoinwalletDb.addressRecordLast.where({ kunyao:'kunyao'}).toArray () || [];
         this.addressRecordLast = addressRecordLast.filter(n=>{
            return n.address === address
        })
        let addressBook = await window.filecoinwalletDb.addressBook.where({ kunyao:'kunyao'}).toArray () || [];
         this.addressBook = addressBook
        let accountList = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray () || [];
        this.accountList = accountList
    },
    methods:{
        toMyAddress(){
            this.listType = 'my-account'
        },
        backLastBook(){
            this.listType = 'last-book'
        },
        back(){
             window.location.href = './setting.html'
        },
        closeSetting(){
            window.location.href = './wallet.html'
        },
        addressClick(detail){
            console.log(detail,'addressClick')
            this.$emit('addressDetail',detail)
        },
        addAddress(){
            this.$emit('update:pageType','add')
        }
    }
}
</script>

<style  lang="less" scoped>
.address-list{
    height: 475px;
    
    .back{
        display: flex;
        align-items: center;
        padding:  10px 20px;
        color: #222;
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
        justify-content: space-between;
        i{
            font-size: 18px;
            display: flex;
            align-items: center;
            padding-right: 5px;
            cursor: pointer;
        }
        .el-icon-arrow-left{
            justify-content: flex-start;
        }
        .el-icon-close{
            justify-content: flex-end;
        }
        span{
            flex-grow: 1;
            font-size: 18px;
            text-align: left;
        }
    }
    .address-tips{
        padding: 10px 20px;
        border-bottom: 1px solid #eee;
        position: relative;
        .c-top{
            font-size: 18px;
            font-weight: bolder;
            color: #222;
            margin-bottom: 10px;
        }
        .c-bottom{
            font-size: 14px;
            color: #999;
        }
        .close{
            position: absolute;
            right: 20px;
            top:50%;
            transform: translateY(-50%);
        }
    }
    .my-account{
        .back-last-book{
            display: flex;
            align-items: center;
            padding: 10px 20px;
            color: #222;
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
            justify-content: flex-start;
            i{
                font-size: 18px;
                padding-right: 5px;
            }
            span{
                font-size: 18px;
            }
        }

        .address-item{
            background: #fff;
            border-bottom: 1px solid #eee;
            padding:10px 20px;
            .addrname{
                font-size: 14px;
                color: #222;
                margin-bottom: 5px;
            }
            .addr{
                font-size: 12px;
                color: #999;
                width: 100%;
                overflow: hidden;    
                text-overflow:ellipsis;    
                whitewhite-space: nowrap;
            }

        }
    }
    .last-book{
        .last-name,.book-name{
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            color: #222;
            padding: 0 20px;
            font-weight: bolder;
        }
        .address-item{
            background: #fff;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            .a-right{
                font-size: 14px;
                color: #222;
            }
            .addr{
                .name{
                    font-size: 14px;
                    color: #222;
                }
                font-size: 12px;
                color: #999;
                .add{

                width: 100%;
                overflow: hidden;    
                text-overflow:ellipsis;    
                whitewhite-space: nowrap;
                }
            }

        }
    }
    .position{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        .add-btn{
            display: flex;
            padding:10px 20px;
            /deep/.el-button{
                flex-grow: 1;
            }
        }
    }
}
</style>
