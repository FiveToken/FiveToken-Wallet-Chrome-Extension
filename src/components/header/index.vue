<template>
    <div class="header">
        <div class="left" @click="toWallet">
            <div class="logo">
                <img class="img" :src="logo" />
            </div>
        </div>
        <div class="networks-select">
            <div class="networks-name" @click="totgleNetwork">
                <div class="text">{{rpcName}}</div>
                <i 
                    class="icon el-icon-arrow-down"
                ></i>
            </div>
        </div>
        <div class="right">
            <div class="user">
                <div class="icon-user-wrap" @click="toAccount">
                    <i class="el-icon-user"></i>
                </div>
            </div>
        </div>
        <el-dialog
            :visible.sync="networkVisible"
            width="100%"
            :show-close="false"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            class="network-dialog"
        >
            <kyNetwork v-if="networkVisible" @confirmNet="networksChange" @closeNet="closeNet"/>
        </el-dialog>
    </div>
</template>

<script>
import { MyGlobalApi } from '@/utils/api'
import { mapState ,mapMutations, mapGetters} from 'vuex'
import kyNetwork from './network.vue'
export default {
    name:'ky-header',
    data(){
        return{
            logo:require('@/assets/image/logo.png'),
            settingVisible:false,
            networkVisible:false,
            net:''
        }
    },
    computed:{
        ...mapState('app',[
            'activenNetworks',
            'rpc',
            'rpcName',
            'accountList',
            'activeAccount',
            'address',
            'privateKey',
            'digest',
            'networkType'
        ]),
    },
    components: { kyNetwork },
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
            'SET_DECIMALS'
        ]),
        networksChange(obj){
            window.filecoinwalletDb.activenNetworks.where({ khazix:'khazix'}).delete()
            let {name,rpc,chainID,symbol,browser,ids,networkType,filecoinAddress0,decimals,image } = obj
            console.log(networkType,'networkType 1234')
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
                khazix:'khazix'
            }).then(async (res)=>{
                let accountList = await window.filecoinwalletDb.accountList.where({ rpc:rpc }).toArray ()|| [];
                this.networkVisible = false
                this.SET_RPC(rpc)
                this.SET_RPCNAME(name)
                this.SET_BROWSER(browser)
                this.SET_ACCOUNTLIST(accountList)
                this.SET_SYMBOL(symbol)
                this.SET_IDS(ids)
                this.SET_NETWORKTYPE(networkType)
                this.SET_FILECOINADDRESS0(filecoinAddress0)
                this.SET_ACTIVENETWORKS({
                    ...obj
                })
                this.SET_DECIMALS(decimals)
                
                if(accountList.length){
                    let first = accountList[0]
                    console.log(first,'first')
                    await this.changeAccount(first)
                    this.$emit('networkChange')
                }else{
                    window.location.href = './welcome.html'
                }
            })
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
            // window.location.href = './wallet.html'
        },
        toWallet(){
            window.location.href = './wallet.html'
        },
        totgleNetwork(){
            this.networkVisible = true
        },
        closeNet(){
            this.networkVisible = false
        },
        toAccount(){
           window.location.href = './account.html' 
        }
    }
}
</script>
<style lang="less" scoped>
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:8px 10px;
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
    .networks-select{
        position: relative;
        .networks-name{
            width: 120px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 20px;
            border: 1px solid #ccc;
            padding: 0 15px 0 5px;
            cursor: pointer;
            position: relative;
            .text{
                width: 100%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .icon{
                position: absolute;
                right: 5px;
                top:50%;
                transform: translateY(-50%);
            }
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
            cursor: pointer;
            .icon-user-wrap{
                i{
                    font-size: 24px;
                    color: #666;
                }
            }
           
        }
    }
    /deep/.network-dialog{
        bottom: 0;
        top: auto;
        .el-dialog{
            border-radius: 10px 10px 0 0;
        }
    }
}

</style>
