<template>
    <layout>
        <div class="setting-networks">
            <networksList
                :networks="networks"
                @networksItemClick="networksItemClick" 
                @addNetwork="addNetwork" 
                v-if="pageType === 'list'"
            />
            <networksFrom
                :deletaRpc="deletaRpc"
                :detail="detail" 
                :pageType.sync="pageType" 
                v-if="pageType === 'detail'"
            />
        </div>
    </layout>
</template>

<script>
import networksList from './networks-list'
import networksFrom from './networks-form'
import layout from '@/components/layout'
export default {
    data(){
        return{
           pageType:'list',
           detail:null,
           deletaRpc:'',
           networks:[]
        }
    },
    components:{
       networksList,
       networksFrom,
       layout
    },
    async mounted(){
        let networks = await window.filecoinwalletDb.networks.where({ khazix:'khazix'}).sortBy('create_time');
        this.networks = networks
    },
    methods:{
        networksItemClick(obj){
            console.log(obj,'oobbjj')
            this.detail = obj
            this.deletaRpc = obj.rpc
            this.pageType = 'detail'
        },
        addNetwork(){
            this.deletaRpc = ''
            this.detail = null
            this.pageType = 'detail'
        }
    }
}
</script>

<style  lang="less" scoped>
.setting-networks{
    height: 100%;
}
</style>
