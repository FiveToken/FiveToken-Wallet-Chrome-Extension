<template>
    <div class="layout-compontent">
        <slot/>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { Database } from '@/utils/database.js';
export default {
    name:'ky-layout',
    data(){
        return{ }
    },
    async created(){
        let language = window.localStorage.getItem('fiveTokenLanguage')
        let currency = window.localStorage.getItem('fiveTokenCurrency')
        this.SET_LANGUAGE(language)
        this.SET_CURRENCY(currency)

        const db = new Database();
        let networks = await db.getTable('networks',{ khazix:'khazix' })
        let activenNetworks = await db.getTable('activenNetworks',{ khazix:'khazix' })
        let defaultNetworks = this.$t('defaultNetworks')
        if(!networks.length){
            db.bulkAddTable('networks',defaultNetworks)
        }
        if(!activenNetworks.length){
            let _first = defaultNetworks.length && defaultNetworks[0]
            db.addTable('activenNetworks',_first)
        }else{
            this.SET_ACTIVENETWORKS(activenNetworks)
            let rpc = activenNetworks[0].rpc
            let rpcName = activenNetworks[0].name
            let symbol = activenNetworks[0].symbol
            let ids = activenNetworks[0].ids
            let browser =  activenNetworks[0].browser
            let networkType =  activenNetworks[0].networkType
            let filecoinAddress0 = activenNetworks[0].filecoinAddress0
            let decimals = activenNetworks[0].decimals
            let image = activenNetworks[0].image
            let disabled = activenNetworks[0].disabled
            let deriveIndex = activenNetworks[0].deriveIndex
            this.SET_RPC(rpc)
            this.SET_RPCNAME(rpcName)
            this.SET_NETWORKS(networks)
            let accountList = await db.getTable('accountList',{ rpc })
            this.SET_ACCOUNTLIST(accountList)
            this.SET_SYMBOL(symbol)
            this.SET_IDS(ids)
            this.SET_BROWSER(browser)
            this.SET_NETWORKTYPE(networkType)
            this.SET_FILECOINADDRESS0(filecoinAddress0)
            this.SET_DECIMALS(decimals)
            this.SET_OWENCHAIN(disabled)
            this.SET_RPCIMAGE(image)
            this.SET_DERIVEINDEX(deriveIndex)
        }

        let activeAccount = await db.getTable('activeAccount',{ khazix:'khazix' })
        if(activeAccount.length){
            this.SET_ACTIVEACCOUNT(activeAccount)
            let address = activeAccount[0].address
            let privateKey = activeAccount[0].privateKey
            let digest = activeAccount[0].digest
            let accountName = activeAccount[0].accountName

            this.SET_PRIVATEKEY(privateKey)
            this.SET_ADDRESS(address)
            this.SET_DIGEST(digest)
            this.SET_ACCOUNTNAME(accountName)
        }
        this.$emit('layoutMounted')
    },
    methods:{
        ...mapMutations('app',[
            'SET_ACTIVENETWORKS',
            'SET_RPC',
            'SET_RPCNAME',
            'SET_ACTIVEACCOUNT',
            'SET_ACCOUNTLIST',
            'SET_PRIVATEKEY',
            'SET_ADDRESS',
            'SET_DIGEST',
            'SET_ACCOUNTNAME',
            'SET_SYMBOL',
            'SET_IDS',
            'SET_BROWSER',
            'SET_NETWORKS',
            'SET_NETWORKTYPE',
            'SET_FILECOINADDRESS0',
            'SET_LANGUAGE',
            'SET_CURRENCY',
            'SET_DECIMALS',
            'SET_OWENCHAIN',
            'SET_RPCIMAGE',
            'SET_DERIVEINDEX'
        ]),
    }
}
</script>
<style lang="less" scoped>
.layout-compontent{
    height: 100%;
}
</style>
