<template>
<div class="networks-form">
    <div class="back">
        <kyBack @pageBack="back" :name="pageName"/>
    </div>
    <div class="add-networks">
        <div class="tips">{{$t('settingNetworks.addTips')}}</div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.networkName')}}</div>
            <kyInput :value="form.name" :disabled="form.disabled" @changeInput="changeForm(arguments,'name')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.rpc')}}</div>
            <kyInput :value="form.rpc" :disabled="form.disabled" @changeInput="changeForm(arguments,'rpc')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.chainID')}}</div>
            <kyInput :value="form.chainID" :disabled="form.disabled" @changeInput="changeForm(arguments,'chainID')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.symbol')}}</div>
            <kyInput :value="form.symbol" :disabled="form.disabled" @changeInput="changeForm(arguments,'symbol')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.browser')}}</div>
            <kyInput :value="form.browser" :disabled="form.disabled" @changeInput="changeForm(arguments,'browser')"/>
        </div>
        <div class="btn-wrap" :class="{two:!form.disabled && detail}">
            <kyButton @btnClick="deleteNetwork" v-if="!form.disabled && detail">{{$t('settingNetworks.delete')}}</kyButton>
            <kyButton type="primary" v-if="!form.disabled" :active="active" @btnClick="save">{{$t('settingNetworks.save')}}</kyButton>
        </div>
    </div>
    <div class="loading" v-if="isFetch">
        <img :src="loading" alt="" class="img">
    </div>
    <el-dialog
        :visible.sync="deleteNetworkVisible"
        width="300px"
        :show-close="false"
        :top="'50vh'"
    >
        <deleteNetwork
            @confirmDelete="confirmDelete"
            @closeDelete="closeDelete"
        />
    </el-dialog>
</div>
</template>

<script>
import kyBack from '@/components/back'
import kyInput from '@/components/input'
import kyButton from '@/components/button'
import deleteNetwork from './delete-network.vue'
import { MyGlobalApi } from '@/utils/api'
import { getF1ByMne,getGlobalKek } from '@/utils'
import { AESDecrypt } from '@/utils/key'
import { mapState ,mapMutations} from 'vuex'
export default {
    data(){
        return{
            deleteNetworkVisible:false,
            form:{
                name:'',
                rpc:'',
                chainID:'',
                symbol:'',
                browser:'',
                disabled:false
            },
            loading:require('@/assets/image/loading.png'),
            isFetch:false,
            kek:'',
            mnemonicWords:''
        }
    },
    props:{
        detail:Object,
        pageType:String,
        deletaRpc:String
    },
    computed:{
        ...mapState('app',[
            'rpc',
            'networkType',
            'filecoinAddress0'
        ]),
        pageName(){
            let str = ''
            if(this.form.disabled){
                str = this.$t('settingNetworks.viewNetwork')
            }else{
                if(this.detail){
                    str = this.$t('settingNetworks.editNewwork')
                }else{
                    str = this.$t('settingNetworks.addNetwork')
                }
            }
            return str
        },
        active(){
            return this.form.name !== '' && this.form.rpc !== '' && this.form.chainID !== '' && this.form.symbol !== '' && !this.form.disabled
        }
    },
    watch:{
        detail:{
            handler(newval,old){
                if(newval){
                    this.form = Object.assign({}, this.form, { ...newval })
                    this.$set(this.form,'disabled',newval.disabled)
                }
                console.log(newval,this,'newval')
            },
            deep:true,
            immediate:true
        }
    },
    components:{
        kyBack,
        kyInput,
        kyButton,
        deleteNetwork
    },
    async mounted(){
        let kek = getGlobalKek()
        this.kek = kek
        let walletKey = await window.filecoinwalletDb.walletKey.where({khazix:'khazix'}).toArray()
        if(walletKey.length){
            let nme = walletKey[0].mnemonicWords
            let mnemonicWords = AESDecrypt(nme,kek)
            this.mnemonicWords = mnemonicWords
        }
    },
    methods:{
        ...mapMutations('app',[
            'SET_ACTIVENETWORKS',
            'SET_RPC',
            'SET_RPCNAME',
            'SET_ACCOUNTLIST',
            'SET_SYMBOL',
            'SET_PRIVATEKEY',
            'SET_ADDRESS',
            'SET_DIGEST',
            'SET_ACCOUNTNAME',
            'SET_IDS',
            'SET_BROWSER',
            'SET_NETWORKTYPE',
            'SET_FILECOINADDRESS0',
            'SET_DECIMALS',
            'SET_OWENCHAIN',
            'SET_RPCIMAGE',
            'SET_DERIVEINDEX'
        ]),
        async confirmDelete(){
            let that = this
            await window.filecoinwalletDb.networks.where({
                rpc:this.deletaRpc
            }).delete().then(res=>{
                window.filecoinwalletDb.accountList.where({ rpc:this.deletaRpc}).delete()
                that.deleteNetworkVisible = false
                that.$emit("deleteNetworkCb")
                that.$message({
                    type:'success',
                    message:that.$t('settingNetworks.deleteSuccess'),
                    duration:1000,
                    onClose:()=>{
                       
                    }
                })
            })
            if(this.rpc === this.deletaRpc){
                await window.filecoinwalletDb.activenNetworks.where({ khazix:'khazix'}).delete()
                let networks = await window.filecoinwalletDb.networks.where({ rpc:rpc }).toArray ()|| [];
                let obj = networks.length && networks[0]
                let {name,rpc,chainID,symbol,browser,ids,networkType,filecoinAddress0,decimals,image,disabled,deriveIndex } = obj
                window.filecoinwalletDb.activenNetworks.add({
                    name,
                    rpc,
                    chainID,
                    ids,
                    symbol,
                    browser,
                    networkType,
                    filecoinAddress0,
                    decimals,
                    image,
                    deriveIndex,
                    khazix:'khazix',
                    disabled
                }).then(async (res)=>{
                    this.$emit('networkChange',obj)
                    let accountList = await window.filecoinwalletDb.accountList.where({ rpc:rpc }).toArray ()|| [];
                    this.SET_RPC(rpc)
                    this.SET_RPCNAME(name)
                    this.SET_BROWSER(browser)
                    this.SET_ACCOUNTLIST(accountList)
                    this.SET_SYMBOL(symbol)
                    this.SET_IDS(ids)
                    this.SET_NETWORKTYPE(networkType)
                    this.SET_FILECOINADDRESS0(filecoinAddress0)
                    this.SET_ACTIVENETWORKS([obj])
                    this.SET_DECIMALS(decimals)
                    this.SET_OWENCHAIN(disabled)
                    this.SET_RPCIMAGE(image)
                    this.SET_DERIVEINDEX(deriveIndex)
                    if(accountList.length){
                        let first = accountList[0]
                        await this.changeAccount(first)
                    }else{
                        window.location.href = './welcome.html'
                    }
                })
            }
        },
        closeDelete(){
            this.deleteNetworkVisible = false
        },
        deleteNetwork(){
            this.deleteNetworkVisible = true
        },
        back(){
            this.$emit("update:pageType",'list')
        },
        async save(){
            if(!this.detail){
               let networks = await window.filecoinwalletDb.networks.where({ khazix:'khazix'}).toArray();
                let isExist = networks.find(n=>{
                    return n.rpc === this.form.rpc
                })
                if(isExist){
                    this.$message.error(this.$t('settingNetworks.isExistError'))
                    return
                }
            }
            if(this.active){
                this.isFetch = true
                MyGlobalApi.setRpc(this.form.rpc)
                MyGlobalApi.setNetworkType(this.networkType)
                let create_time =  parseInt(new Date().getTime() / 1000)
                let filRec = await MyGlobalApi.getFIleCoinChainHead(this.form.rpc)
                let ethRec = await MyGlobalApi.getBlockNumber(this.form.rpc)
                if(filRec && filRec.networkType === 'filecoin'){
                    this.isFetch = false
                    this.$message.error(this.$t('settingNetworks.addError'))
                    return
                    // let { networkType,filecoinAddress0 } = filRec
                    // let _index = 1
                    // if(this.detail){
                    //     _index = this.detail.deriveIndex
                    //     await window.filecoinwalletDb.networks.where({
                    //         rpc:this.deletaRpc
                    //     }).delete()
                        
                    // }else{
                    //     await this.addUser(networkType,filecoinAddress0,create_time,0)
                    //     _index = 1
                    // }
                    // await window.filecoinwalletDb.networks.add({
                    //     name:this.form.name,
                    //     rpc:this.form.rpc,
                    //     chainID:this.form.chainID,
                    //     symbol:this.form.symbol,
                    //     browser:this.form.browser,
                    //     disabled:false,
                    //     create_time,
                    //     ids:'filecoin',
                    //     networkType,
                    //     filecoinAddress0,
                    //     decimals:18,
                    //     image:'',
                    //     deriveIndex:_index,
                    //     khazix:'khazix'
                    // })
                }else if(ethRec && ethRec.networkType === 'ethereum'){
                    let ids = '' 
                    if(this.form.symbol.toUpperCase() === 'ETH'){
                        ids = 'ethereum'
                    }
                    if(this.form.symbol.toUpperCase() === 'BNB'){
                        ids = 'binancecoin'
                    }
                    let { networkType,filecoinAddress0 } = ethRec
                    let _index = 1
                    if(this.detail){
                        _index = this.detail.deriveIndex
                        await window.filecoinwalletDb.networks.where({
                            rpc:this.deletaRpc
                        }).delete()
                    }else{
                        await this.addUser(networkType,filecoinAddress0,create_time,0)
                        _index = 1
                    }
                    if(this.rpc === this.deletaRpc){
                        console.log(this.rpc === this.deletaRpc,'this.rpc === this.deletaRpc')
                        let dIndex =  0
                        if(this.form.rpc === this.deletaRpc){
                            dIndex = this.detail.deriveIndex
                        }else{
                            await this.addUser(networkType,filecoinAddress0,create_time,0)
                            dIndex = 1
                        }
                        await window.filecoinwalletDb.activenNetworks.where({ 
                            rpc: this.deletaRpc
                        }).modify({
                            name:this.form.name,
                            rpc:this.form.rpc,
                            chainID:this.form.chainID,
                            symbol:this.form.symbol,
                            browser:this.form.browser,
                            image:'',
                            ids:ids,
                            decimals:18,
                            networkType:networkType,
                            filecoinAddress0,
                            deriveIndex:dIndex,
                            disabled:false,
                            khazix:'khazix'
                        })
                    }
                    await window.filecoinwalletDb.networks.add({
                        name:this.form.name,
                        rpc:this.form.rpc,
                        chainID:this.form.chainID,
                        symbol:this.form.symbol,
                        browser:this.form.browser,
                        disabled:false,
                        create_time,
                        networkType,
                        filecoinAddress0,
                        decimals:18,
                        image:'',
                        ids,
                        deriveIndex:_index,
                        khazix:'khazix'
                    })
                }else{
                    this.isFetch = false
                    this.$message.error(this.$t('settingNetworks.addError'))
                    return
                }
                this.isFetch = false
                this.$emit('addNetworkCb')
            }
        },
        async addUser(networkType,filecoinAddress0,create_time,index){
            let rpcAccount = await window.filecoinwalletDb.accountList.where({rpc:this.form.rpc}).toArray() || []
            let accountName = `Account` + 1
            let f1 = await getF1ByMne(this.mnemonicWords,this.kek,networkType,filecoinAddress0,index)
            let { address,privateKey,digest } = f1
            let res = await MyGlobalApi.getBalance(address)
            let { balance,nonce } = res
            await window.filecoinwalletDb.accountList.add({
                address,
                accountName,
                createType:'mnemonic',
                privateKey,
                fil:balance,
                create_time,
                khazix:'khazix',
                digest,
                rpc:this.form.rpc
            })
        },
        changeForm(args,key){
            if(args){
                this.$set(this.form,key,args[0])
            }
        }
    }
}
</script>

<style  lang="less" scoped>
/deep/.el-dialog{
    margin: 0 auto;
    border-radius: 10px;
    margin-top: 50vh;
    transform: translateY(-50%);
}
/deep/.el-dialog__header{
    padding:0;
}
/deep/.el-dialog__body{
    padding: 0;
}
/deep/.el-dialog__footer{
    padding: 30px;
    border-top:1px solid #eee;
}
.networks-form{
    height: 100%;
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
    .back{
        padding:15px 20px;
        border-bottom: 1px solid #F5F5F5;
        margin-bottom: 10px;
    }
    .add-networks{
        padding: 0 20px;
        .tips{
            background: #FDF8EB;
            border-radius: 5px;
            border:1px solid #F7E00A;
            font-size: 12px;
            color: #101010;
            padding: 10px 15px;
            margin-bottom: 15px;
        }

        .input-item{
            margin-bottom: 20px;
            .label{
                margin-bottom: 6px;
                font-size: 14px;
                color: #131313;
            }
            .error{
                padding-top: 5px;
                font-size: 12px;
                color: #FD334C;
            }
        }
        .btn-wrap{
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 15px;
            &.two{
                justify-content: space-between;
                /deep/.button-wrap{
                    width: 155px;
                }
            }
            /deep/.button-wrap{
                width: 100%;
            }
        }
    }
}
</style>
