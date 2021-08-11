<template>
    <layout @layoutMounted="layoutMounted">
        <div class="account-page">
            <div class="accaccount-top">
                <div class="back-warp"><kyBack @pageBack="back"></kyBack></div>
                <div class="title">{{$t('account.title')}}</div>
                <div class="lock" @click="lockUser">{{$t('account.lock')}}</div>
            </div>
            <div class="content-account">
               <div class="mne-account" v-if="mneAccount.length">
                   <div class="mne-tit">{{$t('account.mneAccount')}}</div>
                   <div class="mne-list">
                       <div class="mne-item" v-for="(item,index) in mneAccount" :key="index" @click="changeAccount(item)">
                           <div class="check"><i class="el-icon-check" v-if="address === item.address"></i></div>
                           <div class="icon">{{item.accountName.charAt(0)}}</div>
                           <div class="account-info">
                               <div class="name">{{ item.accountName }}</div>
                               <div class="address-balance">
                                   <div class="address">{{ item.address | addressFormat }}</div>
                                   <div class="balance">{{ item.fil | formatBalance(decimals) }} {{symbol}}</div>
                               </div>
                           </div>
                       </div>
                   </div>
                </div>
                <div class="pk-account" v-if="pkAccount.length">
                   <div class="mne-tit">{{$t('account.pkAccount')}}</div>
                   <div class="mne-list">
                       <div class="mne-item" v-for="(item,index) in pkAccount" :key="index" @click="changeAccount(item)">
                           <div class="check"><i class="el-icon-check" v-if="address === item.address"></i></div>
                           <div class="icon">{{item.accountName.charAt(0)}}</div>
                           <div class="account-info">
                               <div class="name">{{ item.accountName }}</div>
                               <div class="address-balance">
                                   <div class="address">{{ item.address | addressFormat }}</div>
                                   <div class="balance">{{ item.fil | formatBalance(decimals)}} {{symbol}}</div>
                               </div>
                           </div>
                       </div>
                   </div>
                </div>
            </div>
            <div class="create-wallet" @click="createWallet">
                <div class="icon"><i class="el-icon-plus"></i></div>
                <div class="t">{{$t('account.createWallet')}}</div>
            </div>
            <div class="import-pk" @click="importWallet">
                <div class="icon"><i class="el-icon-bottom"></i></div>
                <div class="t">{{$t('account.import')}}</div>
            </div>
            <div class="setting" @click="toSetting">
                <div class="icon"><i class="el-icon-setting"></i></div>
                <div class="t">{{$t('account.setting')}}</div>
            </div>
            <el-dialog
                :visible.sync="addAccountVisable"
                width="300px"
                :show-close="false"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                class="network-dialog"
                :top="'34vh'"
            >
                <kyAdd :addName.sync="addName" v-if="addAccountVisable" @confirmAdd="confirmAdd" @closeAdd="closeAdd"/>
            </el-dialog>
            <div class="loading" v-if="isFetch">
                <img :src="loading" alt="" class="img">
            </div>
        </div>
    </layout>
</template>
<script>
import layout from '@/components/layout'
import { getQueryString,getF1ByMne,deCodeMnePsd } from '@/utils'
import { mapMutations, mapState } from 'vuex'
import kyBack from '@/components/back'
import kyAdd from './add.vue'
import { MyGlobalApi } from '@/utils/api'
export default {
    data(){
        return{
            loading:require('@/assets/image/loading.png'),
            isFetch:false,
            addAccountVisable:false,
            mneAccount:[],
            pkAccount:[],
            addName:'',
            mnePsd:null
        }
    },
    computed:{
        ...mapState('app',[
            'address',
            'rpc',
            'networkType',
            'accountList',
            'symbol',
            'filecoinAddress0',
            'decimals'
        ])
    },
    filters:{
        addressFormat(val){
            if(val.length>12){
                return val.substr(0,6) + '...' + val.substr(val.length-6,6)
            }else{
                return val
            } 
        },
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
        }
    },
    components:{
        layout,
        kyBack,
        kyAdd
    },
    async mounted(){
        let walletKey = await window.filecoinwalletDb.walletKey.where({khazix:'khazix'}).toArray()
        if(walletKey.length){
            let mnePsd = await deCodeMnePsd(walletKey[0].mnemonicWords,walletKey[0].password)
            this.mnePsd = mnePsd
            console.log(mnePsd,'mnePsd')
        }
    },
    methods:{
        ...mapMutations('app',[
            'SET_PRIVATEKEY',
            'SET_ADDRESS',
            'SET_DIGEST',
            'SET_ACCOUNTNAME',
        ]),
        layoutMounted(){
            let accountList = this.accountList
            this.mneAccount = accountList.filter(n=>{
                return n.createType === 'mnemonic'
            })
            this.pkAccount = accountList.filter(n=>{
                return n.createType === 'privateKey'
            })
            console.log(this.accountList,'accountList vvv')
        },
        async confirmAdd(){
            try{
                this.isFetch = true
                this.addAccountVisable = false
                let { mnemonic,password } = this.mnePsd
                let index = this.accountList.length + 1
                let f1 = await getF1ByMne(mnemonic,password,this.networkType,filecoinAddress0,index)
                let { address,privateKey,digest } = f1
                MyGlobalApi.setRpc(this.rpc)
                MyGlobalApi.setNetworkType(this.networkType)
                let res = await MyGlobalApi.getBalance(address)
                let { balance } = res
                let accountName = this.addName
                let create_time =  parseInt(new Date().getTime() / 1000)
                await window.filecoinwalletDb.accountList.add({
                accountName,
                address,
                createType:'mnemonic',
                privateKey,
                create_time,
                khazix:'khazix',
                digest,
                rpc:this.rpc,
                fil:balance
            })
            await window.filecoinwalletDb.activeAccount.where({khazix:'khazix'}).delete()
            await window.filecoinwalletDb.activeAccount.add({
                address,
                accountName,
                privateKey,
                create_time,
                khazix:'khazix',
                rpc:this.rpc,
                fil:balance,
                createType:'mnemonic',
                digest
            })
            this.isFetch = false
            window.location.href = './wallet.html'
            }catch(err){
                this.addAccountVisable = false
                this.isFetch = false
            }
        },
        closeAdd(){
            this.addAccountVisable = false
        },
        importByPk(){
            window.location.href = './import-privatekey.html'
        },
        async lockUser(){
            let create_time =  parseInt(new Date().getTime() / 1000)
            await window.filecoinwalletDb.lockUser.add({
                address:this.address,
                privateKey:this.privateKey,
                create_time,
                khazix:'khazix',
                digest:this.digest
            })
            window.location.href = './filecoinwallet.html'
        },
        async changeAccount(item){
            let {address,accountName,privateKey,create_time,digest,createType} = item
            this.settingVisible = false
            this.SET_PRIVATEKEY(privateKey)
            this.SET_ADDRESS(address)
            this.SET_DIGEST(digest)
            this.SET_ACCOUNTNAME(accountName)
            MyGlobalApi.setRpc(this.rpc)
            MyGlobalApi.setNetworkType(this.networkType)
            let res = await MyGlobalApi.getBalance(address)
            let { balance } = res
            console.log(balance,'balance 1234')
            await window.filecoinwalletDb.activeAccount.where({khazix:'khazix'}).delete()
            await window.filecoinwalletDb.activeAccount.add({
                address,
                accountName,
                privateKey,
                create_time,
                khazix:'khazix',
                fil:balance,
                createType,
                digest
            })
            window.location.href = './wallet.html'
        },
        createWallet(){
            this.addName = `Account` + (this.accountList.length + 1)
            this.addAccountVisable = true
        },
        importWallet(){
            window.location.href = './import-privatekey.html'
        },
        toSetting(){
            window.location.href = './setting.html'
        },
        back(){
            this.$router.go(-1)
        }
    }
}
</script>

<style  lang="less" scoped>
/deep/.el-dialog{
    border-radius: 10px;
    .el-dialog__header{
        padding: 0;
    }
    .el-dialog__body{
        padding: 0;
    }
}
.account-page{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    position: relative;
    .loading{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        .img{
            animation:turnX 3s linear infinite;
        }
        @keyframes turnX{
            0%{
                transform:rotateZ(0deg);
            }
            100%{
                transform:rotateZ(360deg);
            }
        }
    }
    .accaccount-top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid #F6F7FF;
        .back-warp{
            width: 62px;
        }
        .title{
            font-size: 14px;
            color: #101010;
        }
        .lock{
            width: 60px;
            height: 21px;
            text-align: center;
            line-height: 21px;
            font-size: 12px;
            color: #101010;
            border:1px solid #AFE0E5;
            border-radius: 4px;
            cursor: pointer;
        }
    }
    .content-account{
        max-height: 390px;
        overflow-y: auto;
        .mne-account,.pk-account{
            .mne-tit{
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    color: #101010;
                    padding: 0 20px;
            }
            .mne-list{
               .mne-item{
                    padding: 10px 20px 10px 50px;
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    &::before{
                        content: '';
                        position: absolute;
                        width: 300px;
                        height:1px;
                        background: #E6F0F0;
                        left: 50px;
                        bottom: 0;
                    }
                    &:hover{
                        background: #f5f5f5;
                    }
                    &:first-child{
                       &::after{
                            content: '';
                            position: absolute;
                            width: 300px;
                            height:1px;
                            background: #E6F0F0;
                            left: 50px;
                            top: 0;
                        }
                    }
                    &:nth-child(even){
                        .icon{
                            background: #9261E8;
                        }
                    }
                    &:nth-child(odd){
                        .icon{
                            background: #AFE0E5;
                        }
                    }
                    .check{
                        position: absolute;
                        left: -40px;
                        top: 50%;
                        transform: translateY(-50%);
                        i{
                            font-size: 14px;
                            color: #4EC1C9;
                        }
                    }
                    .icon{
                        width: 24px;
                        height: 24px;
                        border-radius: 12px;
                        text-align: center;
                        line-height: 24px;
                        color: #131313;
                        font-size: 12px;
                    }
                    .account-info{
                        flex-grow: 1;
                        padding-left: 10px;
                        .name{
                            font-size: 12px;
                            color: #131313;
                            line-height: 18px;
                            font-weight: bold;
                        }
                        .address-balance{
                            flex-grow: 1;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .address{
                                font-size: 12px;
                                color: #A8A5A5;
                                line-height: 18px;
                            }
                            .balance{
                                font-size: 12px;
                                color: #131313;
                            }
                        }
                    }
                }
            }
        }
    }
    .create-wallet,.import-pk,.setting{
        display: flex;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid #E6F0F0;
        cursor: pointer;
        .icon{
            i{
                font-size: 18px;
                color: #1C818A;
                font-weight: bold;
            }
        }
        .t{
            font-size: 14px;
            color: #101010;
            padding-left: 15px;
            line-height: 20px;
        }
    }
    .setting{
        border-bottom: none;
    }
}
</style>
