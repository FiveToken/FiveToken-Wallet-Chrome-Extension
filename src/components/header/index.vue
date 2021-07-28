<template>
    <div class="header">
        <div class="left" @click="toWallet">
            <div class="logo">
                <img class="img" :src="logo" />
            </div>
            <div class="text">FiveToken</div>
        </div>
        <div class="right">
            <div class="user">
                <div class="icon-user-wrap" @click="totgleSetting">
                    <i class="el-icon-user"></i>
                </div>
                <div class="user-setting" :class="{active:settingVisable}">
                    <div class="u-top">
                        <a href="./wallet.html" class="name">{{$t('header.myAccount')}}</a>
                        <div class="action" @click="lockUser">{{$t('header.lock')}}</div>
                    </div>
                    
                    <div class="account-list" v-if="accountList.length">
                        <div class="scroll-list">
                            <div class="account-item" v-for="(item,index) in accountList" :key="index">
                                <el-radio v-model="address" :label="item.address" class="radio-item" @change="changeAccount(item)">
                                    <i class="el-icon-circle-check check"></i>
                                    <div class="address-name">
                                        <div class="name">{{item.accountName}}</div>
                                       <div class="address">{{item.address|addressFormat}}</div>
                                    </div>
                                    <div class="fil">{{Number(item.fil).toFixed(4)}} FIL</div>
                                </el-radio>
                            </div>
                        </div>
                    </div>
                    <a class="create" href="./create-wallet.html?backPage=wallet">
                        <i class="el-icon-plus"></i>
                        <div class="text">{{$t('header.createAccount')}}</div>
                    </a>
                    <a class="export" href="./first-wallet.html?export=1">
                        <i class="el-icon-download"></i>
                        <div class="text">{{$t('header.import')}}</div>
                    </a>
                    <a class="setting" href="./setting.html">
                        <i class="el-icon-setting"></i>
                        <div class="text">{{$t('header.setting')}}</div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { BalanceNonceByAddress } from '@/utils/api'
export default {
    name:'ky-header',
    data(){
        return{
            address:'',
            logo:require('@/assets/image/logo.png'),
            accountList:[],
            settingVisable:false,
            privateKey:'',
            digest:''
        }
    },
    props:{
        etitCount:Number
    },
    watch:{
        async etitCount(newVal,oldVal){
            let accountList = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray ();
            this.accountList = accountList
            console.log(newVal,oldVal,'newVal,oldVal')
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
    },
    async mounted(){
        let accountList = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray ();
        this.accountList = accountList
        let activeAccount = await window.filecoinwalletDb.activeAccount.where({ kunyao:'kunyao'}).toArray ();
        this.address = activeAccount.length && activeAccount[0].address
        this.privateKey = activeAccount.length && activeAccount[0].privateKey
        this.digest = activeAccount.length && activeAccount[0].digest
        this.handle()
    },
    methods:{
        handle(){
            let that = this
            document.addEventListener('click',function(e){
                if(e.target.parentNode && e.target.parentNode.className !== 'icon-user-wrap'){
                   that.settingVisable = false;
                }
            })
        },
        toWallet(){
            window.location.href = './wallet.html'
        },
        totgleSetting(){
            this.settingVisable = !this.settingVisable
        },
        async lockUser(){
            let create_time =  parseInt(new Date().getTime() / 1000)
            await window.filecoinwalletDb.lockUser.add({
                address:this.address,
                privateKey:this.privateKey,
                create_time,
                kunyao:'kunyao',
                digest:this.digest
            })
            window.location.href = './filecoinwallet.html'
        },
        async changeAccount(item){
            await window.filecoinwalletDb.activeAccount.where({kunyao:'kunyao'}).delete()
            let {address,accountName,privateKey,create_time,digest,mnemonicWords} = item
            this.settingVisable = false
            BalanceNonceByAddress([{address}]).then(async (result)=>{
                let res = result.data
                let balance = 0
                if(res && res.code === -32603){
                    balance = 0
                }else{
                    balance = Number(res && res.balance || 0) / Math.pow(10, 18)
                }
                await window.filecoinwalletDb.activeAccount.add({
                    address,
                    accountName,
                    privateKey,
                    create_time,
                    kunyao:'kunyao',
                    fil:balance,
                    mnemonicWords,
                    digest
                })
                window.location.href = './wallet.html'
            }).catch(async (err)=>{
                console.log(err,'BalanceNonceByAddressErr')
            })
        }
    }
}
</script>
<style lang="less" scoped>
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:10px;
    width: 100%;
    box-sizing: border-box;
    background: #f2f2f2;
    .left{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        .logo{
            width: 28px;
            height: 28px;
            margin-right: 10px;
            .img{
                width: 28px;
                height: 28px;
            }
        }
        .text{
            font-size: 18px;
            color: #222;
            font-weight: 800;
        }
    }
    .right{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .user{
            width: 40px;
            height: 40px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .icon-user-wrap{
                i{
                    font-size: 24px;
                    color: #666;
                }
            }
            .user-setting{
                width: 320px;
                position: absolute;
                right: 0;
                top: 40px;
                background: rgba(0,0,0,0.7);
                z-index: 99;
                max-height: 0;
                transition: all 0.3s;
                overflow: hidden;
                box-sizing: border-box;
                border-radius:5px;
                &.active{
                    max-height: 345px;
                }
                .u-top{
                    font-size: 14px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #bbb;
                    padding: 15px 20px 10px;
                    &:hover{
                        background: #3d3c3c;
                    }
                    .name{
                        text-decoration: none;
                        font-size: 14px;
                        color: #fff;
                    }
                    .action{
                        border:1px solid #fff;
                        padding: 5px 20px;
                        border-radius: 3px;
                        cursor: pointer;
                    }
                }
            }
            .account-list{
                max-height: 140px;
                overflow-y: auto;
                box-sizing: border-box;
                position: relative;
                overflow: auto;
                border-bottom: 1px solid #eee;
                /deep/.el-radio{
                    width: 100%;
                    display: flex;
                    padding: 10px 20px;
                    box-sizing: border-box;
                    &.is-checked{
                        .check{
                            display: block;
                        }
                    }
                    &:hover{
                        background: #3d3c3c;
                    }
                    .el-radio__input{
                        display: none;
                    }
                    .el-radio__label{
                        flex-grow: 1;
                        position: relative;
                        padding-left: 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .check{
                        position: absolute;
                        left: 0;
                        top: 50%;
                        color: #fff;
                        transform: translateY(-50%);
                        font-size: 18px;
                        display: none;
                    }
                    .address-name{
                        flex-grow: 1;
                        .name{
                            font-size: 14px;
                            color: #fff;
                            margin-bottom: 5px;
                        }
                        .address{
                            font-size: 12px;
                            color: #ccc;
                        }
                    }
                    .fil{
                        font-size: 14px;
                        color: #fff;
                    }
                }
            }
            .create,.export,.setting{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding:15px 20px;
                cursor: pointer;
                text-decoration: none;
                &:hover{
                    background: #3d3c3c;
                }
                i{
                    font-size: 18px;
                    color: #fff;
                }
                .text{
                    font-size: 14px;
                    color: #fff;
                    padding-left: 10px;
                }
            }
            .setting{
                padding-bottom: 15px;
            }
        }
    }
}

</style>
