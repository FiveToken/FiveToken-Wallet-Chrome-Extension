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
import { getQueryString,formatNumber,getF1ByMne,getGlobalKek,minimumPrecision,isFilecoinChain } from '@/utils'
import { AESDecrypt } from '@/utils/key'
import { mapMutations, mapState } from 'vuex'
import kyBack from '@/components/back'
import kyAdd from './add.vue'
import { BigNumber } from "bignumber.js";
import { Database } from '@/utils/database.js';
export default {
    data(){
        return{
            loading:require('@/assets/image/loading.png'),
            isFetch:false,
            addAccountVisable:false,
            mneAccount:[],
            pkAccount:[],
            addName:'',
            nme:'',
            activeF1:null,
            ethereumF1:null,
            filecoinF1:null,
            calibrationF1:null,
            db:null
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
            'decimals',
            'deriveIndex',
            'networks'
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
            let big = new BigNumber(dec)
            let str = big.toFixed()
            if( dec !== 0 && dec < minimumPrecision){
                let min = new BigNumber(minimumPrecision).toFixed()
                return "<" + min
            }else{
                let num = formatNumber(str,8)
                return num 
            }
        }
    },
    components:{
        layout,
        kyBack,
        kyAdd
    },
    async mounted(){
        const db = new Database();
        this.db = db
        let walletKey = await db.getTable('walletKey',{ khazix:'khazix' })
        if(walletKey.length){
            this.nme = walletKey[0].mnemonicWords
        }
    },
    methods:{
        ...mapMutations('app',[
            'SET_PRIVATEKEY',
            'SET_ADDRESS',
            'SET_DIGEST',
            'SET_ACCOUNTNAME',
            'SET_DERIVEINDEX'
        ]),
        async initAdd(){
            let index = this.deriveIndex + 1
            let kek = getGlobalKek()
            let mnemonic = AESDecrypt(this.nme)
            let ethereumF1 = await getF1ByMne(mnemonic,kek,'ethereum','',index)
            let filecoinF1 = await getF1ByMne(mnemonic,kek,'filecoin','f',index)
            let calibrationF1 = await getF1ByMne(mnemonic,kek,'filecoin','t',index)
            let activeF1 = null
            if(this.filecoinAddress0 === 't'){
                activeF1 = calibrationF1
            }else if(this.filecoinAddress0 === 'f'){
                activeF1 = filecoinF1
            }else{
                activeF1 = ethereumF1
            }
            this.activeF1 = activeF1
            this.ethereumF1 = ethereumF1
            this.filecoinF1 = filecoinF1
            this.calibrationF1 = calibrationF1
        },
        layoutMounted(){
            let accountList = this.accountList
            this.mneAccount = accountList.filter(n=>{
                return n.createType === 'mnemonic'
            })
            this.pkAccount = accountList.filter(n=>{
                return n.createType === 'privateKey'
            })
        },
        async confirmAdd(){
            try{
                this.isFetch = true
                this.addAccountVisable = false
                let accountName = this.addName
                let create_time =  parseInt(new Date().getTime() / 1000)
                await this.db.modifyTable(
                    'activeAccount',
                    { rpc:this.rpc },
                    {
                       address:this.activeF1.address,
                        accountName,
                        privateKey:this.activeF1.privateKey,
                        create_time,
                        khazix:'khazix',
                        rpc:this.rpc,
                        fil:0,
                        createType:'mnemonic',
                        digest:this.activeF1.digest 
                    }
                )
                
                let _accountList = []
                let _networks = []
                let _index = this.deriveIndex + 1
                for (let n of this.networks){
                    if(n.filecoinAddress0 === 't'){
                        _accountList.push({
                            accountName,
                            address:this.calibrationF1.address,
                            createType:'mnemonic',
                            privateKey:this.calibrationF1.privateKey,
                            create_time,
                            khazix:'khazix',
                            digest:this.calibrationF1.digest,
                            rpc:n.rpc,
                            fil:0
                        })
                    }else if(n.filecoinAddress0 === 'f'){
                        _accountList.push({
                            accountName,
                            address:this.filecoinF1.address,
                            createType:'mnemonic',
                            privateKey:this.filecoinF1.privateKey,
                            create_time,
                            khazix:'khazix',
                            digest:this.filecoinF1.digest,
                            rpc:n.rpc,
                            fil:0
                        })
                    }else{
                        _accountList.push({
                            accountName,
                            address:this.ethereumF1.address,
                            createType:'mnemonic',
                            privateKey:this.ethereumF1.privateKey,
                            create_time,
                            khazix:'khazix',
                            digest:this.ethereumF1.digest,
                            rpc:n.rpc,
                            fil:0
                        })
                    }
                    _networks.push({
                        ...n,
                        deriveIndex:_index
                    })
                }
                
                await this.db.bulkAddTable('accountList',_accountList)
                await this.db.bulkPutTable('networks',_networks)
                await this.db.modifyTable(
                    'activenNetworks',
                    { rpc:this.rpc },
                    { deriveIndex:_index }
                )

                this.SET_DERIVEINDEX(_index)
                this.isFetch = false
                window.location.href = './wallet.html'
            }catch(err){
                this.addAccountVisable = false
                this.isFetch = false
                console.log(err,'add error')
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
            
            await this.db.addTable('lockUser',{
                address:this.address,
                privateKey:this.privateKey,
                create_time,
                khazix:'khazix',
                digest:this.digest
            })
            window.location.href = './filecoinwallet.html'
        },
        async changeAccount(item){
            let {address,accountName,privateKey,create_time,digest,createType,rpc } = item
            this.settingVisible = false
            this.SET_PRIVATEKEY(privateKey)
            this.SET_ADDRESS(address)
            this.SET_DIGEST(digest)
            this.SET_ACCOUNTNAME(accountName)
            
            await this.db.modifyTable(
                'activeAccount',
                { rpc:rpc },
                {
                    address,
                    accountName,
                    privateKey,
                    create_time,
                    khazix:'khazix',
                    rpc:rpc,
                    fil:0,
                    createType,
                    digest
                }
            )
            window.location.href = './wallet.html'
        },
        createWallet(){
            this.addName = `Account` + (this.accountList.length + 1)
            this.addAccountVisable = true
            setTimeout(()=>{
                this.initAdd()
            },0)
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
        box-shadow: 0 2px 10px 0 rgb(0 0 0 / 15%);
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
                        bottom: -1px;
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
                            background: #5BC1CA;
                        }
                    }
                    .check{
                        position: absolute;
                        left: 20px;
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
