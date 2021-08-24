
<template>
    <div class="select-network-component">
       <div class="title-network">{{ $t('importPrivatkey.titleNetwork') }}</div>
       <div class="close" @click="closeNetwork">
           <i class="el-icon-close"></i>
       </div>
       <div class="network-list">
           <div class="netwotk-item" v-for="(item,index) in networks" :key="index" @click="confirmNetwork(item)">
               <div class="img-wrap" v-if="item.disabled">
                   <img class="img" :src="require(`@/assets/svg/${item.image}`)" alt="">
               </div>
                <div class="custom-img" v-else>{{item.name.substring(0,1)}}</div>
               <div class="name">{{ item.name }}</div>
               <i class="el-icon-check check" v-if="rpc === item.rpc"></i>
            </div>
       </div>
    </div>
</template>

<script>
import { MyGlobalApi } from '@/utils/api'
import { mapState ,mapMutations, mapGetters} from 'vuex'
export default {
    data(){
        return{ }
    },
    computed:{
        ...mapState('app',[
            'networks',
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
    filter:{
        imageFormat(val){
            let src = require(`@/assets/image/${val}`)
            return src
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
        confirmNetwork(obj){
            window.filecoinwalletDb.activenNetworks.where({ khazix:'khazix'}).delete()
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
                    console.log(first,'first')
                    await this.changeAccount(first)
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
        },
        closeNetwork(){
            this.$emit('closeNetwork')
        }
    }
}
</script>

<style  lang="less" scoped>
.select-network-component{
    position: relative;
    z-index: 100;
    .title-network{
        height: 43px;
        line-height: 43px;
        font-size: 14px;
        color: #101010;
        border-bottom:1px solid #F5F5F5;
        text-align: center;
    }
    .close{
        width: 20px;
        height: 20px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        i{
            color: #201F1F;
        }
    }
    .network-list{
        max-height: 300px;
        overflow-y: auto;
        .netwotk-item{
            height: 50px;
            line-height: 50px;
            position: relative;
            cursor: pointer;
            color: #131313;
            font-size: 14px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &::before{
                width: calc(100% - 40px);
                height: 1px;
                content: '';
                position: absolute;
                bottom: 0;
                left: 20px;
                background: #E6F0F0;
            }
            .img-wrap{
                width: 26px;
                height: 26px;
                .img{
                   width: 26px;
                    height: 26px; 
                }
            }
            &:nth-child(even){
                .custom-img{
                    background: #9261E8;
                }
            }
            &:nth-child(odd){
                .custom-img{
                    background: #5BC1CA;
                }
            }
            .custom-img{
                width: 26px;
                height: 26px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                color: #fff;
                border-radius: 13px;
            }
            .name{
                padding-left: 10px;
                flex-grow: 1;
            }
            &:hover{
                background: #f5f5f5;
            }
            .check{
                position: absolute;
                top: 50%;
                right: 20px;
                color: #4EC1C9;
                font-size: 18px;
                transform: translateY(-50%);
            }
        }
    }
}
</style>
